<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-12 10:58:50
 * @LastEditTime: 2019-12-13 13:08:06
 -->
<template>
  <div class="staff-allot-multiple">
    <form-search :form-config="formSearchConfig" :column="1" @search="search"></form-search>
    <div class="separation-line box-shadow"></div>

    <div class="table-warpper">
      <el-table
        v-loading="tableLoading"
        :header-cell-style="{
          padding:'8px 0',
          color:'rgba(0,0,0,.7)',
          fontWeight:'900',
          borderBottom:'2px solid rgba(44, 62, 80,.3)'
        }"
        :cell-style="{padding:'4px 0',color:'#2e2f2f',cursor: 'pointer'}"
        :row-class-name="rowCanSelect"
        :data="pageList"
        style="width: 100%"
        @row-click="handleRowClick"
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
          prop="name"
          :label="$t('allotModal.table.name')">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="company.name"
          :label="$t('allotModal.table.company')">
        </el-table-column>
      </el-table>
    </div>

    <pagination
      :pagination="pagination"
      :page="params.page+1"
      layout="prev, pager, next"
      @sizeChange="sizeChange"
      @currentChange="currentChange">
    </pagination>
  </div>
</template>

<script>
import { deepCopy } from '@/utils/assist'
import FormSearch from '@/components/FormSearch'
import Pagination from '@/components/Pagination'
import PaginationMixin from '@/mixins/PaginationMixin'
import { getMemberListForAllot, allotVesselMember } from '@/api/vessel-member'

export default {
  inject: ['_idialog'],
  components: { FormSearch, Pagination },
  mixins: [ PaginationMixin ],
  props: {
    role: Number | String,
    vesselId: Number | String,
    selectedUserName: Array      // 已经选择过的用户(用户名称)
  },
  data() {
    return {
      formSearchConfig: [{
        label:'allotModal.search.name',
        key:'name',
        type:'text',
        placeholder:'common.placeholder'
      }],
      inited:false,
      pageList:[],
      clonePageList: [],
      tableLoading: false
    }
  },
  methods: {
    search(cond) {
      if(cond.name) {
        let filterData = this.clonePageList.filter(item => item.name.includes(cond.name))

        this.pageList = filterData
        this.pagination.total = filterData.length
      } else {
        this.getTableData()
      }
    },

    rowCanSelect({row, rowIndex}) {
      return this.selectedUserName.includes(row.name) ? 'row-disabled' : ''
    },

    handleRowClick(row, column, event) {
      let { userId, name } = row

      if(this.selectedUserName.includes(row.name)) {
        this.$message({showClose: true,message: this.$t('common.repeat'),type: 'warning'})
      } else {

        // 如果是机务提示一下，你会没有权限的
        if(row.role === 'SUPER_INTENDENT') {
          this.$confirm(this.$t('allotModal.tipReplace'), this.$t('common.tip'), {
            confirmButtonText: this.$t('common.ok'),
            cancelButtonText: this.$t('common.cancel'),
            closeOnClickModal: false,
            type: 'warning',
          }).then(() => {
            this.allotVesselMember({ userId, vesselId: this.vesselId }, row, column, event)
          }).catch(() => {

          })
        } else {
          this.allotVesselMember({ userId, vesselId: this.vesselId }, row, column, event)
        }
      }
    },

    allotVesselMember(data, row, column, event) {
      allotVesselMember(data).then(res => {
        this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})

        this.$emit('selectIt', row, column, event)
        this.$nextTick(() => {
          this._idialog.close()
        })
      })
    },

    // 假分页，所以需要前端自己切数据
    getCurrentPageData() {
      /**
       * this.params.page        第几页(下标0开始好计算)
       * this.pagination.size    每页几条数据
       */
      let startIndex = this.params.page * this.pagination.size
      let endIndex = startIndex + this.pagination.size

      return this.clonePageList.slice(startIndex, endIndex)
    },

    getTableData() {
      if(this.inited) {
        this.pageList = this.getCurrentPageData()
      } else {
        this.inited = true
        
        getMemberListForAllot(this.role).then(res => {
          this.clonePageList = deepCopy(res.data)
          this.pageList = this.getCurrentPageData()
          this.$set(this.pagination, 'total', res.data.length)
        })
      }
    }
  },
  created() {
    this._idialog.children.push(this)
  },
  mounted() {
    console.log(this.selectedUserName)
  }
}
</script>

<style lang="scss">
.el-table {
  .row-disabled{
    td {
      cursor:not-allowed;
      color: #CCC;
      div {
        cursor:not-allowed;
        color: #CCC;
      }
    }
  }
}
</style>
