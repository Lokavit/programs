<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-24 13:21:50
 * @LastEditTime: 2020-03-09 10:59:03
 -->
<template>
  <id-dialog
    width="55%"
    ref="_idialog"
    :footer="false"
    :box-padding="false"
    :box-shadow="false"
    :value="value"
    :title="$t('quote.search.selectSpec')"
    @close="_closeDialog"
  >
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
          :cell-style="{padding:'8px 0',color:'#2e2f2f',cursor: 'pointer'}"
          :data="specList"
          style="width: 100%"
          @row-click="rowClick"
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
              <a @click.prevent="rowClick(row)">
                {{ row.dockingProject.name }}
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
        :page="params.page + 1"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      ></pagination>
    </div>
  </id-dialog>
</template>

<script>
import Pagination from "@/components/Pagination"
import PaginationMixin from '@/mixins/PaginationMixin'
import { getSpecificationList } from '@/api/specification'

export default {
  components: {
    Pagination
  },
  mixins: [ PaginationMixin ],
  props: {
    value: Boolean
  },
  data() {
    return {
      tableLoading: false,
      specId:null,
      specList: []
    }
  },
  methods: {
    search(cond) {
      this.params = Object.assign(this.params, cond, { page: 0 })
      this.getTableData()
    },

    rowClick(row, column, event) {
      this.$emit('selectIt', row, column, event)
      this.$nextTick(() => {
        this._closeDialog()
      })
    },

    _closeDialog() {
      this.$emit('input',false)
    },

    getTableData() {
      this.tableLoading = true;
      getSpecificationList(this.params).then(res => {
        this.$set(this.pagination, 'total', res.data.totalElements);
        this.specList = res.data.content
        this.tableLoading = false
      })
    }
  }
}
</script>

<style lang="scss">

</style>