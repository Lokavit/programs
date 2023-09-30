<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-24 13:21:50
 * @LastEditTime: 2020-03-09 08:54:04
 -->
<template>
  <div class="table-view table-view-quote">
  
    <div class="table-warpper">
      <el-table
        v-loading="tableLoading"
        :header-cell-style="{
          padding:'8px 0',
          color:'rgba(0,0,0,.7)',
          fontWeight:'900',
          borderBottom:'2px solid rgba(44, 62, 80,.3)'
        }"
        :cell-style="{padding:'4px 0',color:'#2e2f2f', cursor: 'pointer'}"
        :data="specList"
        style="width: 100%"
        :row-class-name="rowCanSelect"
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
          align="left"
          :show-overflow-tooltip="true"
          :label="$t('quote.table.projectNumber')"
          prop="dockingProjectCode">
        </el-table-column>

        <el-table-column
          align="left"
          :show-overflow-tooltip="true"
          :label="$t('quote.table.projectName')"
          prop="dockingProjectName">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="vesselName"
          :label="$t('quote.table.shipName')">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="quotationPartyName"
          :label="$t('quote.table.shipyard')">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="offeredAt"
          :label="$t('quote.table.offeredAt')">
        </el-table-column>
        
        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="status"
          :label="$t('quote.table.status')">
          <template slot-scope="{ row }">
            <div :class="['btn-status', true ? 'btn-status-' + row.status : '']">
              {{ $t(specStatusMap(row.status)) }}
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
import { getQuoteList } from '@/api/quote'

export default {
  inject: ['_idialog'],
  props: {
    referSpecId: Number,
    selectedQuotations: Array
  },
  components: { Pagination },
  mixins: [ PaginationMixin ],
  data() {
    return {
      tableLoading: false,
      quoteId:null,
      rowData:null,        // 表格行数据，用于比价时判断，是否选择了一个报价单
      specList: [],
      curStatusIndex: 0,
      addQuotationVisible: false,
      STATUS:[
        {name: 'quote.status.CREATED', value: 'CREATED'},
        {name: 'quote.status.OFFERED', value: 'OFFERED'},
        {name: 'quote.status.WAITING', value: 'WAITING_FOR_APPROVAL'},
        {name: 'quote.status.APPROVED', value: 'APPROVED'},
        {name: 'quote.status.REJECTED', value: 'REJECTED'}
      ]
    }
  },
  methods: {
    _closeDialog() {
      this._idialog.close()
    },

    filterStatus(status, index) {
      this.curStatusIndex = index
    },

    rowCanSelect({row, rowIndex}) {
      if(this.selectedQuotations.indexOf(row.id) > -1) {
        return 'row-disabled'
      }
    },

    handleRowClick(row) {
      if(this.selectedQuotations.indexOf(row.id) > -1) {
        // 已经选过的询价单不能再选！
        this.$message({showClose: true,message: this.$t('quote.contrast.tipRepeat'),type: 'warning'})
      } else {
        this.$emit('selectIt', row)
        this.$nextTick(() => { this._closeDialog() })
      }
    },

    getTableData() {
      this.tableLoading = true

      this.params = Object.assign(
        this.params, { 
          specificationId: this.referSpecId,
          // status: this.status
        }
      )
      
      getQuoteList(this.params).then(res => {
        this.$set(this.pagination, 'total', res.data.totalElements)
        this.specList = res.data.content
        this.tableLoading = false
      })
    }
  },
  created() {
    this._idialog.children.push(this)
  }
}
</script>

<style lang="scss">
@import '../../styles/variables.scss';

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
.table-view-quote{

  .btn-status{
    display: inline-block;
    font-size: 12px;
    font-weight: bold;
    position: relative;
    padding: 0 0 0 10px;
    &::before{
      content: ' ';
      display: inline-block;
      position: absolute;
      left:-6px;
      top:8px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: currentColor
    }
    &-CREATED{
      color: #808080;
    }
    &-OFFERED{
      color: $main-bg;
    }
    &-WAITING_FOR_APPROVAL{
      color: #FF8C00;
    }
    &-APPROVED{
      color: #539F5C;
    }
    &-REJECTED{
      color: #FF4500;
    }
  }
}

.btns-quote-status{
  font-size: 0;
  // box-shadow: 0 0 2px #DCDCDC;
  > div {
    position: relative;
    display: inline-block;
    font-size: 12px;
    padding: 7px 20px;
    border:1px solid #DCDCDC;
    &:first-child{
      border-radius: 20px 0 0 20px;
    }
    &:last-child{
      border-radius: 0 20px 20px 0;
    }
    :before{
      content: ' 22 ';
      position: absolute;
      display: block;
      width: 6px;
      height: 6px;
      left: -10px;
      top:4px;
      background-color: green;
    }
  }
}
</style>