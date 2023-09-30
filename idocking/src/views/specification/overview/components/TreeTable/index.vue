<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-05 13:08:45
 * @LastEditTime: 2019-11-27 15:33:33
 -->
<template>
  <div class="spec-tree-table">
    <ul>
      <template v-if="treeData.length!==0">
        <tree-row
          v-for="(item, index) in treeData"
          v-loading="treeLoading"
          :key="index"
          :item ="item"
          :index="index"
          @linkClick="handleLink"
          @addClick="handleAdd(item)"
          @treeChildDelete="handleChildDelete"
          :currencyType="currencyType">
        </tree-row>  
      </template>
      <li v-else class="empty-holder">
        {{ $t('common.nothing') }}
      </li>
    </ul>

    <id-dialog 
      v-model="add3rdVisible"
      center
      width="870px"
      :box-shadow="false"
      :box-padding="false"
      footer-align="center"
      :footerLayout="['ok']"
      :title="$t('specification.overview.addDockItem.title')">
      <add-3rd-modal
        :specId="specId"
        @reload="getData"
        :treeItem1st="treeItem1st"
        v-if="add3rdVisible">
      </add-3rd-modal>
    </id-dialog>

    <id-dialog
      v-model="edit3rdVisible"
      @reload="getData"
      center
      :footer="false"
      :box-shadow="true"
      :box-padding="false"
      :title="$t('specification.overview.addDockItem.title')"
    >
      <template v-slot:title>
        <div class="dockitem-header">
          <div class="left">
            <div class="modal-title">{{spec3rdModalTitle.name}}（{{spec3rdModalTitle.code}}）</div>
            <div class="modal-subtitle">
              {{ treeItem3rd && treeItem3rd.code }} &nbsp;&nbsp;&nbsp;&nbsp;  {{ treeItem3rd && treeItem3rd.name }}
            </div>
          </div>
          <power-button v-if="treeItem3rd && edit3rdVisible" :itemId="treeItem3rd.id" @state-change="powerChange" class="right"></power-button>
        </div>
      </template>
       
      <edit-3rd-modal
        :specId="specId"
        @reload="getData"
        ref="dockItemInfo"
        v-if="edit3rdVisible"
        :firstLevelData="firstLevelData"
        :treeItem3rd="treeItem3rd || {}"
        :flowStatus3rd="flowStatus3rd">
      </edit-3rd-modal>

    </id-dialog>
  </div>
</template>

<script>
import TreeRow from './TreeRow'
import PowerButton from '../../components/PowerButton'
import Add3rdModal from '../../modals/Add3rdModal' 
import Edit3rdModal from '../../modals/Edit3rdModal'
import { getSpecTreeData, delSpecificationItem } from '@/api/specification'

export default {
  provide() {
    return {
      _treeTable: this
    }
  },
  components:{ 
    TreeRow,
    PowerButton,
    Add3rdModal,
    Edit3rdModal
  },
  computed:{
    currencyType() {
      return this.$store.state.specification.currencyType
    },
    spec3rdModalTitle() {
      return this.$store.state.specification.spec3rdModalTitle
    }
  },
  data() {
    return {
      specId: null,
      treeItem1st:{},
      treeData:[],
      treeLoading: false,
      treeItem3rd: {},   // 坞修项数据
      firstLevelData:{},    // 第一级数据
      add3rdVisible: false,
      edit3rdVisible:false,
      flowStatus3rd:null
    }
  },
  methods: {
    powerChange() {
      this.$refs['dockItemInfo'].getData()
      this.getData()
    },
    handleAdd(data) {
      this.treeItem1st = data
      this.add3rdVisible = true;
    },
    handleLink(first, thrid, thridIndex, flowStatus3rd) {
      this.firstLevelData = first   // (Tree第一级)
      this.treeItem3rd = thrid     // (Tree第三级)坞修项数据

      this.edit3rdVisible = true
      this.flowStatus3rd = flowStatus3rd
    },
    handleChildDelete(child, c_index) {
      this.$confirm(
        this.$t('common.delText'),  
        this.$t('msgboxLang.title'),
        {
          confirmButtonText: this.$t('msgboxLang.ok'),
          cancelButtonText: this.$t('msgboxLang.cancel'),
          type: 'warning'
        }
      ).then(async () => {
        delSpecificationItem(child.id).then(res => {
          this.$message({showClose: true,message: this.$t('common.delOk'),type: 'success'});
          this.getData()
        })
      })
    },
    getData(){
      getSpecTreeData(this.specId).then(res => {
        this.treeData = res.data
      })
    }
  },
  created() {
    this.specId = this.$route.query.id
    this.getData()
  }
}
</script>

<style lang="scss">
.spec-tree-table{
  position: relative;
  overflow: hidden;
  width: 100%;
  font-size: 14px;
  font-weight: normal;
  &-header{
    cursor: pointer;
    width: 100%;
    display: flex;
    align-items: center;
    .item{
      flex:1;
      font-weight: 600;
      overflow: hidden;
      white-space:nowrap;
      text-overflow: ellipsis;
      padding: 8px 10px 8px 0;
    }
  }
}

.dockitem-header{
  display: flex;
  justify-content: space-between;
  .left{
    flex:1;
  }
  .power-button-project{
    width: 120px;
    padding: 10px 30px 0 0;
  }
}
.modal-subtitle{
  position:relative;
  top:10px;
  font-size: 14px;
  font-weight: bold;
}
</style>
