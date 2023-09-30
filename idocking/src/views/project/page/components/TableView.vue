<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-24 13:21:50
 * @LastEditTime: 2019-12-09 14:19:38
 -->
<template>
  <div class="table-view">
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
        :data="projectList"
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
          <template slot-scope="{ row }">
            <a @click.prevent="rowClickForEdit(row)">
              {{row.code}}
            </a>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="name"
          width="220"
          :label="$t('project.table.name')">
          <template slot-scope="{ row }">
            <a class="cursor" @click.prevent="rowClickForEdit(row)">
              {{row.name}}
            </a>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          width="300"
          prop="phase"
          :label="$t('project.table.stage')"
        >
          <template slot-scope="{ row }">
            <project-stage :stage="row.phase"></project-stage>
          </template>
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
            <span :class="
              [
                'project-status',
                true ? 'project-status-' + row.status : ''
              ]"
            >
              {{ $t(projectStatusMap(row.status)) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="endAt"
          width="100px"
          :label="$t('common.ops')"
        >
          <template slot-scope="{ row }">
            <div class="btn-table-ops" @click.prevent="rowClickForEdit(row)">
              <i class="el-icon-view" ></i>
            </div>
            <div class="btn-table-ops" @click.prevent="rowDel(row.id)">
              <i class="el-icon-remove" ></i>
            </div>
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
</template>

<script>
import Pagination from "@/components/Pagination"
import PaginationMixin from '@/mixins/PaginationMixin'
import ProjectStage from '@/components/ProjectStage'
import { getProjectList, delProject } from '@/api/project'

export default {
  components: {
    Pagination,
    ProjectStage
  },
  mixins: [ PaginationMixin ],
  data() {
    return {
      tableLoading: false,
      projectList: []
    }
  },
  methods: {
    search(cond) {
      this.params = Object.assign(this.params, cond, { page: 0 })
      this.getTableData()
    },
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
        delProject(id).then(res => {
          this.$message({showClose: true,message: this.$t('common.delOk'),type: 'success'})
          this.getTableData()
        })
      })
    },

    rowClickForEdit(row) {
      this.projectId = row.id
      this.$router.push({ path:'/management/project/overview', query: { id: row.id, name: row.name }})
    },

    getTableData() {
      this.tableLoading = true;
      getProjectList(this.params).then(res => {
        this.$set(this.pagination, 'total', res.data.totalElements);
        this.projectList = res.data.content
        this.tableLoading = false
      })
    }
  }
}
</script>

<style lang="scss">

</style>