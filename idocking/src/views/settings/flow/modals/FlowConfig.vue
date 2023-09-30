<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-06 10:26:00
 * @LastEditTime: 2019-12-09 16:28:06
 -->
<template>
  <div class="flow-config">
    <id-dialog v-model="addFlowNodeVisible" width="40%" :title="$t('settings.flow.addModal.title')">
      <add-flow-node-modal v-if="addFlowNodeVisible" @addFlowNode="handleAddFlowNode"></add-flow-node-modal>
    </id-dialog>

    <id-dialog v-model="flowNodeInfoVisbile" width="40%" :title="$t('settings.flow.editModal.title2')">
      <flow-node-info-modal v-if="flowNodeInfoVisbile" :data="rowDataForEdit" @editFlowNode="handleEditFlowNode"></flow-node-info-modal>
    </id-dialog>

    <div class="table-warpper">
      <el-table
        v-loading="tableLoading"
        :header-cell-style="{
          padding:'8px 0',
          color:'rgba(0,0,0,.7)',
          fontWeight:'900',
          borderBottom:'2px solid rgba(44, 62, 80,.3)'
        }"
        :cell-style="{padding:'4px 0',color:'#2e2f2f'}"
        :data="cloneFlowRowData.approvalFlowSteps"
        style="width: 100%"
      >
        <el-table-column
          :show-overflow-tooltip="true"
          :label="$t('settings.flow.editModal.step')"
          type="index"
          align="left"
          width="80">
        </el-table-column>

        <!-- 节点名称 -->
        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="name"
          :label="$t('settings.flow.editModal.nodeName')">
            <template slot-scope="scope">
              <a class="cursor" @click.prevent="rowClickForEdit(scope.row.id, scope.$index, scope.row)">
                {{scope.row.name}}
              </a>
            </template>
        </el-table-column>

        <!-- 审批角色 -->
        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          :label="$t('settings.flow.editModal.roleName')">
            <template slot-scope="scope">
              {{ $t(roleMap(scope.row.requiredRole)) }}
            </template>
        </el-table-column>

        <!-- 是否拥有可编辑权限 -->
        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="modifiable"
          :label="$t('settings.flow.editModal.modifiable')">
            <template slot-scope="scope">
              {{ $t(selfRepairMap(scope.row.modifiable)) }}
            </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="name"
          :label="$t('common.ops')">
          <template slot-scope="scope">
            <div class="operating">
              <div class="btn-table-ops" @click="onDelRow(scope.$index)">
                <i class="el-icon-remove"></i>
              </div>
              <div class="btn-table-ops" @click="moveWork($event, 'prve', scope.$index)">
                <i class="el-icon-top moveIcon" ></i>
              </div>
              <div class="btn-table-ops"  @click="moveWork($event, 'next', scope.$index)">
                <i class="el-icon-bottom moveIcon" ></i>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { updateApprovalFlow } from '@/api/settings-flow'
import flowNodeInfoModal from './FlowNodeInfo'
import AddFlowNodeModal from './AddFlowNode'
import { deepCopy } from '@/utils/assist'

export default {
  inject: ['_idialog'],
  components: { AddFlowNodeModal, flowNodeInfoModal },
  props:{
    flowRowData: Object | Array
  },
  data() {
    return {
      cloneFlowRowData: {},
      tableLoading: false,
      addFlowNodeVisible: false,
      flowNodeInfoVisbile: false,
      rowDataForEdit: {},
      flowNodeIndex: -1
    }
  },
  mounted() {
    this.cloneFlowRowData = deepCopy(this.flowRowData)
  },
  methods: {
    // 增加流程节点，在尾部附加
    handleAddFlowNode(data) {
      this.cloneFlowRowData.approvalFlowSteps.push(data)
    },

    // 编辑流程节点，需要找到编辑的是哪一个Node
    handleEditFlowNode(data) {
      console.log(data)
      this.$set(this.cloneFlowRowData.approvalFlowSteps, this.flowNodeIndex, data)
    },

    onDelRow (index) {
      this.cloneFlowRowData.approvalFlowSteps.splice(index,1);  
    },

    rowClickForEdit(id, index, rowData) {
      this.flowNodeInfoVisbile = true
      this.flowNodeIndex = index
      this.rowDataForEdit = rowData
    },

    moveWork(e, direction, index) { // 工作项调换顺序
      let el = e.srcElement.parentNode.parentNode
      if(direction == 'next'){
        if(index == this.cloneFlowRowData.approvalFlowSteps.length - 1) return
        this.swapSequence(el, 1, index)
      }else {
        if(index == 0) return
        this.swapSequence(el, -1, index)
      }
    },

    swapSequence(el, direction, index) { // 调换顺序接口方法
      let target = this.cloneFlowRowData.approvalFlowSteps[index]
      this.cloneFlowRowData.approvalFlowSteps.splice(index, 1)
      this.cloneFlowRowData.approvalFlowSteps.splice(index + direction, 0, target)
    },

    _save() {
      updateApprovalFlow(this.cloneFlowRowData).then(res => {
        this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'});
        this.$emit('reload')

        this.$nextTick(() => {
          this._idialog.close()
        })
      })
    }
  },
  
  created() {
    this._idialog.children.push(this)
  }
}
</script>

<style lang="scss">

</style>