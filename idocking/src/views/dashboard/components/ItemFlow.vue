<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-16 12:36:35
 * @LastEditTime: 2020-03-09 12:47:47
 -->
<template>
  <div class="item-flow">
    <item-wrap :title="$t('dashboard.main.titleFlow')" icon-name="workbench-to-do-list" height="250px" :tag="false">
      <ul v-if="flowList.length" slot="body" class="tasks">
        <li
          v-for="(item, index) in flowList"
          :key="index"
          class="item-wrap-row cursor"
          @click="handleTodo(item.businessType, item.businessFormId, item.name)"
        >
          <div class="text">{{ index + 1 }}. {{ item.name }}</div>
          <div class="value">{{ $t(flowTypeMap(item.businessType)) }}</div>
        </li>
      </ul>
      <div v-else slot="body" class="holder-section">{{ $t('common.nothing') }}</div>
    </item-wrap>

    <id-dialog
      v-model="edit3rdVisible"
      center
      :box-shadow="true"
      :box-padding="false"
      :footer="false"
      :title="$t('specification.overview.addDockItem.title')"
    >
      <template v-slot:title>
        <div class="dockitem-header">
          <div class="left">
            <div class="modal-title">
              {{spec3rdModalTitle && spec3rdModalTitle.name}}
              （{{spec3rdModalTitle && spec3rdModalTitle.code}}）</div>
            <div class="modal-subtitle">
              {{ treeItem3rd && treeItem3rd.code }} &nbsp;&nbsp;&nbsp;&nbsp;  {{ treeItem3rd && treeItem3rd.name }}
            </div>
          </div>
          <power-button v-if="treeItem3rd && edit3rdVisible" :item-id="treeItem3rd.id" class="right" @state-change="powerChange" />
        </div>
      </template>

      <edit-3rd-modal
        v-if="edit3rdVisible"
        ref="dockItemInfo"
        :specId="id"
        :treeItem3rd="treeItem3rd"
        @reload="get3rdData">
      </edit-3rd-modal>

      </id-dialog>

  </div>
</template>

<script>
import ItemWrap from './ItemWrap'
import { getApprovalFlowAboutMe } from '@/api/dashboard'
import QuotationModal from '../../quote/overview'
import PowerButton from '../../specification/overview/components/PowerButton'
import Edit3rdModal from '../../specification/overview/modals/Edit3rdModal'
import { getDockItemInfo } from '@/api/specification'

export default {
  components: { ItemWrap, QuotationModal, Edit3rdModal, PowerButton },
  data() {
    return {
      flowList: [],
      treeItem3rd: null, // 坞修项数据【第三级】
      edit3rdVisible: false,
      treeItem3rd: {},
      id: null,          // 询价单/项目/坞修项【第三级】
      params: {
        page: 0,
        size: 5
      }
    }
  },
  computed: {
    spec3rdModalTitle() {
      return this.$store.state.specification.spec3rdModalTitle
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      getApprovalFlowAboutMe(this.params).then(res => {
        this.$store.commit('dashboard/SET_COUNT_FLOW', res.data.totalElements)
        this.flowList = res.data.content
        this.tableLoading = false
      })
    },

    get3rdData() {

    },

    powerChange() {
      this.$refs['dockItemInfo'].getData()
      this.getData()
    },

    handleTodo(type, id, name) {
      // QUOTATION_ACCEPT
      // SPECIFICATION_ITEM_COMPLETE
      // PROJECT_CREATE

      // 询价单
      if (type === 'QUOTATION_ACCEPT') {
        this.id = id

        this.$router.push({
          path: '/dockrepair/quote/overview',
          query: {
            id: id,
            name: name
          }
        })
        return
      }

      // 项目
      if (type === 'PROJECT_CREATE') {
        this.id = id

        this.$router.push({
          path: '/management/project/overview',
          query: {
            id: id,
            name: name
          }
        })
        return
      }

      // 规格书坞修项目
      if (type === 'SPECIFICATION_ITEM_COMPLETE') {
        this.id = id

        getDockItemInfo(id).then(res => {
          this.treeItem3rd = res.data
          this.edit3rdVisible = true
        })
      }
    }
  }
}
</script>

<style lang="scss">
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
