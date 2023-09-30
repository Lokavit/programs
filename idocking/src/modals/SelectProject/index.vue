<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-21 18:35:08
 * @LastEditTime: 2019-11-05 08:54:58
 -->
<template>
  <id-dialog
    width="55%"
    ref="_idialog"
    :footer="false"
    :box-padding="false"
    :box-shadow="false"
    :value="value"
    :title="$t('project.addProject.titles')"
    @close="_closeDialog"
  >
    <div class="project-select-warpper" v-loading="matterLoading">
      <div class="table-warpper"> 
        <el-table
          :header-row-style="{color:'#2e2f2f', height:'30px'}"
          :header-cell-style="{padding:'3px 0',  borderBottom:'2px solid rgba(44, 62, 80,.3)'}"
          :cell-style="{padding:'3px 0',color:'#2e2f2f',cursor: 'pointer'}"
          :data="projectList"
          @row-click="rowClick"
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
            width="150"
            :show-overflow-tooltip="true"
            :label="$t('project.table.code')"
            prop="code">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="name"
            width="220"
            :label="$t('project.table.name')">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            width="150"
            prop="startAt"
            :label="$t('project.table.startTime')">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="endAt"
            width="150"
            :label="$t('project.table.endTime')">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="status"
            :label="$t('project.table.status')"
          >
            <template slot-scope="{ row }">
              <span :class="'project-status-' + row.status">
                {{ $t(projectStatusMap(row.status)) }}
              </span>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <pagination :pagination="pagination" :page="params.page+1"  @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
    </div>
  </id-dialog>
</template>
<script>
import { getProjectList } from '@/api/project'
import IdDialog from '@/components/IdDialog'
import Pagination from '@/components/Pagination'
import PaginationMixin from '@/mixins/PaginationMixin'
export default {
  name: 'VesselSelect',
  mixins: [ PaginationMixin ],
  components: {
    Pagination,
    IdDialog
  },
  props: {
    value: Boolean,
    status: String
  },
  data() {
    return{
      matterLoading: false,
      projectList: [], // 船舶信息列表数据
    }
  },
  methods: {
    _closeDialog() {
      this.$emit('input',false)
    },
    getTableData() {
      this.matterLoading = true;

      // 根据status,过滤指定状态的项目
      this.params = Object.assign(this.params, { status: this.status })
      getProjectList(this.params).then(res => {
        this.$set(this.pagination, 'total', res.data.totalElements);
        this.projectList = res.data.content;
        this.matterLoading = false;
      })
    },
    rowClick(row, column, event) {
      this.$emit('selectIt', row, column, event)
      this.$nextTick(() => {
        this.$emit('input',false)
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>

