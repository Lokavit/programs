<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-24 13:21:50
 * @LastEditTime: 2019-11-18 18:48:54
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
        :data="specList"
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
          :label="$t('specification.table.proName')" 
          prop="name">
          <template slot-scope="{ row }">
            <a class="cursor" @click.prevent="rowClick(row)">
              {{row.dockingProject.name}}
            </a>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="currencyType.name"
          :label="$t('specification.table.currency')">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="standardTreeVersion.name"
          :label="$t('specification.table.version')">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="createdAt"
          :label="$t('specification.table.createAt')">
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
import Pagination from '@/components/Pagination'
import PaginationMixin from '@/mixins/PaginationMixin'
import { getSpecificationList } from '@/api/specification'
import { delProject } from '@/api/project'

export default {
  components: {
    Pagination
  },
  mixins: [PaginationMixin],
  data() {
    return {
      tableLoading: false,
      specId: null,
      specList: []
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
      ).then(async() => {
        delProject(id).then(res => {
          this.$message({ showClose: true, message: this.$t('common.delOk'), type: 'success' })
          this.getTableData()
        })
      })
    },

    rowClick(row) {
      this.specId = row.id
      this.$router.push({ path: '/dockrepair/specification/overview', query: { id: row.id, name: row.vessel.name }})
    },

    getTableData() {
      this.tableLoading = true
      getSpecificationList(this.params).then(res => {
        this.$set(this.pagination, 'total', res.data.totalElements)
        this.specList = res.data.content
        this.tableLoading = false
      })
    }
  }
}
</script>

<style lang="scss">

</style>
