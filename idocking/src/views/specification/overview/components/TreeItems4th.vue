<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-24 13:21:50
 * @LastEditTime: 2019-11-12 13:06:45
 -->
<template>
  <div class="table-view add-dock-detail-item">
    <id-button
      v-if="!disabled"
      class="ddi-add"
      icon='plus'
      align="right"
      text="common.add"
      @click="add4thVisible = true">
    </id-button>
    
    <!-- 【增加】坞修细节项 -->
    <id-dialog 
      v-model="add4thVisible" 
      center
      width="920px"
      :box-shadow="false"
      :box-padding="false"
      footer-align="center"
      :footerLayout="['ok']"
      :title="$t('specification.overview.addDockDetailItem.titleAdd')">
      <add-4th-modal
        :treeItem3rd="treeItem3rd" 
        v-if="add4thVisible" 
        v-on="$listeners"
        @reload="getData">
      </add-4th-modal>
      <!-- 
        v-on="$listeners" 向上传递Add4thModal组件的事件，目的是让最顶级组件刷新数据 
        Add4thModal组件中增加数据后，需要更新：
        1、父组件TreeItems4th组件reload事件(更新4级项列表)
        2、最顶级组件TreeTable的reload事件(更新顶级组件的汇总数据)
      -->
    </id-dialog>
    
    <!-- 【修改】坞修细节项 -->
    <id-dialog 
      v-model="edit4thVisible"
      :footer="false"
      width="870px"
      center
      :title="$t('specification.overview.addDockDetailItem.titleEdit')">
      <edit-4th-modal
        v-if="edit4thVisible"
        v-on="$listeners"
        :treeItem3rdId="treeItem3rd.id" 
        :treeItem4thId="treeItem4thId" 
        @reload="getData" >
      </edit-4th-modal>
    </id-dialog>

    <div class="table-warpper">
      <el-table
        v-loading="tableLoading"
        :header-cell-style="{
          padding:'4px 0',
          color:'rgba(0,0,0,.7)',
          fontWeight:'900',
          borderBottom:'2px solid rgba(44, 62, 80,.3)'
        }"
        :max-height="maxHeight"
        :cell-style="{padding:'4px 0',color:'#2e2f2f'}"
        :data="dockDetailItems"
        style="width: 100%"
      >
        <el-table-column
          :show-overflow-tooltip="true"
          label="#"
          type="index"
          align="left"
          width="50">
        </el-table-column>

        <el-table-column
          align="left"
          :show-overflow-tooltip="true"
          :label="$t('dockDetailItem.table.code')"
          prop="code">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="name"
          width="180"
          :label="$t('dockDetailItem.table.name')">
            <template slot-scope="{ row }">
              <a class="cursor" @click.prevent="rowClickForEdit(row.id)">
                {{row.name}}
              </a>
            </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="type"
          :label="$t('dockDetailItem.table.type')">
          <template slot-scope="{ row }">
            {{ $t(dockDetailItemTypeMap(row.type)) }}
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="budget"
          :label="$t('dockDetailItem.table.budget') + '(' + currencyType + ')' ">
          <template slot-scope="{ row }">
            {{ (row.budget || 0) | currencyFormat }}
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          width="110"
          prop="selfSupply"
          :label="$t('dockDetailItem.table.selfSupply')">
          <template slot-scope="{ row }">
            {{ $t(selfRepairMap(row.selfSupply)) }}
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="endAt"
          :label="$t('common.ops')">
          <template slot-scope="{ row }">
            <div class="btn-table-ops" @click="rowDel(row.id)" v-if="!disabled">
              <i class="el-icon-remove"></i>
            </div>
            <div class="btn-table-ops" @click="moveWork($event, 'prve', row.id)" v-if="!disabled">
              <i class="el-icon-top moveIcon" 
              :class="'disMoveIcon'"></i>
            </div>
            <div class="btn-table-ops"  @click="moveWork($event, 'next', row.id)" v-if="!disabled">
              <i class="el-icon-bottom moveIcon" 
              :class="'disMoveIcon'" ></i>
            </div>
          </template>
        </el-table-column>

      </el-table>
    </div>

  </div>
</template>

<script>
import AttachmentMixin from '@/mixins/AttachmentMixin'
import IdButton from '@/components/IdButton'
import Pagination from "@/components/Pagination"
import Add4thModal from '../modals/Add4thModal'
import Edit4thModal from '../modals/Edit4thModal'
import { 
  getSpecDockItemDetailList,
  delSpecDockDetailItem,
  exchangeDockDetailItemOrder
} from '@/api/specification'

export default {
  mixins: [AttachmentMixin],
  components: {
    IdButton,
    Add4thModal,
    Edit4thModal
  },
  props:{
    treeItem3rd: Object,
    maxHeight:{
      type: String | Number,
      default: '190px'
    }
  },
  data() {
    return {
      tableLoading: false,
      dockDetailItems: [],      // 【level 4】坞修细节项列表，用于展示
      treeItem4thId: null,      // 【level 4】坞修细节项ID, 用于编辑细节项
      add4thVisible: false,
      edit4thVisible: false
    }
  },
  computed: {
    currencyType() {
      return this.$store.state.specification.currencyType
    },
    canEdit3rd () {
      return this.$store.state.specification.canEdit3rd
    }
  },
  methods: {
    rowDel(id) {
      this.$confirm(
        this.$t('common.delText'),  
        this.$t('msgboxLang.title'),
        {
          confirmButtonText: this.$t('msgboxLang.ok'),
          cancelButtonText: this.$t('msgboxLang.cancel'),
          type: 'warning'
        }
      ).then(async () => {
        delSpecDockDetailItem(id).then(res => {
          this.$message({showClose: true,message: this.$t('common.delOk'),type: 'success'})
          this.getData()
          this.$emit('reload')
        })
      })
    },

    rowClickForEdit(id) {
      this.treeItem4thId = id
      this.edit4thVisible = true
    },

    moveWork(e, direction, rowId) { // 工作项调换顺序
      let el = e.srcElement.parentNode.parentNode
      let index = this.dockDetailItems.findIndex(row => row.id === rowId)

      if(direction == 'next') {
        if(index == this.dockDetailItems.length-1) return
        this.swapSequence(el, 1, index)
      } else {
        if(index == 0) return
        this.swapSequence(el, -1, index)
      }
    },
    async swapSequence(el, direction, index) { // 调换顺序接口方法

      let time = null
      try {
        let params = {
          anotherId: this.dockDetailItems[index].id,
          id: this.dockDetailItems[index + direction].id
        }
        let res =  await exchangeDockDetailItemOrder(params)
      }
      catch(err) {
        return
      }

      let target = this.dockDetailItems[index]
      this.dockDetailItems.splice(index, 1);
      this.dockDetailItems.splice(index + direction, 0, target)
    },

    getData() {
      this.tableLoading = true;
      getSpecDockItemDetailList(this.treeItem3rd.id).then(res => {
        this.dockDetailItems = res.data
        this.tableLoading = false
      })
    }
  },
  created()  {
    this.getData()
  }
}
</script>

<style lang="scss">
.add-dock-detail-item{
  position: relative;
  .ddi-add{
    position: absolute;
    right:16px;
    top:-35px;
  }
}
</style>