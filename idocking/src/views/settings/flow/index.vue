<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-06 09:08:45
 * @LastEditTime: 2019-12-09 14:09:27
 -->
<template>
  <div class="settings-flow">
    <div class="padding box-shadow">

      <!-- 流程审批设置 -->
      <id-dialog 
        v-model="flowConfigVisible"
        :title="$t('settings.flow.editModal.title')" 
        :box-padding=false 
        :box-shadow=false
      >
        <flow-config-modal
          v-if="flowConfigVisible"
          :flowRowData="flowRowData"
          ref="flowConfigModal"
          @reload="getTableData">
        </flow-config-modal>

        <template v-slot:title>
          <div class="settings-flow-header">
            <div class="modal-title">{{ $t('settings.flow.editModal.title') }}</div>
            <id-button :text="$t('settings.flow.addModal.btnAdd')" class="btn-addFlowNode" @click="addFlowNode"></id-button>
          </div>
        </template>
      </id-dialog> 
        
      <!-- 主表 -->
      <div class="table-warpper">
        <el-table
          v-loading="tableLoading"
          :header-cell-style="{
            padding:'8px 0',
            color:'rgba(0,0,0,.7)',
            fontWeight:'900',
            borderBottom:'2px solid rgba(44, 62, 80,.3)'
          }"
          :cell-style="{padding:'8px 0',color:'#2e2f2f'}"
          :data="flowList"
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
            :show-overflow-tooltip="true"
            align="left"
            width="300px"
            :label="$t('settings.flow.table.name')"
          >
            <template slot-scope="{ row }">
              <a class="cursor" @click.prevent="rowClickForEdit(row.id)">
                {{ $t(flowTypeMap(row.businessType)) }}
              </a>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            :label="$t('settings.flow.table.brief')">
            <template slot-scope="{ row }">
              <span v-html="formatSteps(row)"></span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <pagination
        :pagination="pagination"
        :page="params.page+1"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      ></pagination>
    </div>
  </div>
</template>

<script>
import { getFlowsList } from '@/api/settings-flow'
import Pagination from "@/components/Pagination"
import PaginationMixin from '@/mixins/PaginationMixin'
import FlowConfigModal from './modals/FlowConfig'
import IdButton from '@/components/IdButton'

export default {
  components: { Pagination, FlowConfigModal, IdButton },
  mixins: [ PaginationMixin ],
  data() {
    return {
      flowList: [],
      flowRowData: {},
      flowId:null,
      tableLoading: false,
      flowConfigVisible: false
    }
  },
  methods: {
    addFlowNode() {
      this.$refs['flowConfigModal'].addFlowNodeVisible = true
    },

    getTableData () {
      getFlowsList().then(res => {
        this.flowList = res.data

        // 流程数量固定，会直接返回所有数据，所以直接去length属性
        this.pagination.total = res.data.length
      })
    },

    formatSteps(row) {
      let formatStr = ''
      let steps = row.approvalFlowSteps
      let len = steps.length
      
      if(len) {
        row.approvalFlowSteps.forEach((step, index) => {
          formatStr += step.name
          if(index !== len - 1) {
            formatStr += '&nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-right"></i>&nbsp;&nbsp;&nbsp;&nbsp;'
          }
        })

        return formatStr
      }

      return 'Nothing'
    },

    rowClickForEdit(id) {
      this.flowId = id
      this.flowConfigVisible = true

      let index = this.flowList.findIndex(item => item.id === id)
      this.flowRowData = this.flowList[index]

    }
  }
}
</script>

<style lang="scss">
.settings-flow-header{
  display: flex;
  justify-content: space-between;
  .btn-addFlowNode{
    padding-right: 30px;
  }
}
</style>