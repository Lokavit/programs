<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-24 13:21:50
 * @LastEditTime: 2020-03-11 08:42:24
 -->
<template>
  <div class="table-view table-view-quote">

    <div class="quote-btns-set">
      <div class="btns-horizontal">
        <id-button type="blue" text="quote.table.btnCompare" @click="handleContrast" />
        <id-button type="blue" text="quote.table.btnDeal" @click="handleDeal" />
        <id-button type="blue" text="quote.table.btnReject" @click="handleReject" />
      </div>
      <div>
        <id-button icon="plus" text="common.add" style="margin-left:20px;" @click="addQuotationVisible = true" />
      </div>
    </div>

    <id-dialog v-model="addQuotationVisible" :title="$t('quote.addModal.title')" width="35%" :box-padding="false">
      <add-quotation-modal v-if="addQuotationVisible" @reload="getTableData" />
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
        :cell-style="{padding:'8px 0', color:'#2e2f2f', cursor: 'pointer'}"
        @row-click="handleRowClick"
        @selection-change="handleCheckbox"
        :data="specList"
        style="width: 100%"
        row-key="id"

        highlight-current-row
        @select="handleSelectionChange"
      >
        <el-table-column
          :reserve-selection="true"
          type="selection"
          :selectable="isSelectable"
          width="55"
        />

        <el-table-column
          :show-overflow-tooltip="true"
          label="#"
          type="index"
          align="left"
          width="50"
        />

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="dockingProjectCode"
          :label="$t('quote.table.projectNumber')"
        />

        <el-table-column
          align="left"
          :show-overflow-tooltip="true"
          :label="$t('quote.table.projectName')"
          prop="dockingProjectName"
        >
          <template slot-scope="{ row }">
            <a class="cursor" @click.prevent="handleCellClick(row)">
              {{ row.dockingProjectName }}
            </a>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="vesselName"
          :label="$t('quote.table.shipName')"
        />

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="quotationPartyName"
          :label="$t('quote.table.shipyard')"
        />

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="offeredAt"
          :label="$t('quote.table.offeredAt')"
        />

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="status"
          :label="$t('quote.table.status')"
        >
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
    />
  </div>
</template>

<script>
import IdButton from '@/components/IdButton'
import Pagination from '@/components/Pagination'
import PaginationMixin from '@/mixins/PaginationMixin'
import AddQuotationModal from '../modals/AddQuotation'
import { getQuoteList, acceptQuotation, rejectQuotation } from '@/api/quote'

export default {
  components: {
    Pagination,
    IdButton,
    AddQuotationModal
  },
  mixins: [PaginationMixin],
  data() {
    return {
      tableLoading: false,
      isFullSize: false, // 是否已选够
      fullSize: 3,  // 最多选几个       
      multipleSelection: [],  // 当前已选中的行id
      quoteId: null,
      specList: [],
      selectedRowData: null,
      curStatusIndex: 0,
      addQuotationVisible: false
    }
  },
  methods: {
    /**
     * 表格行是否可选
     */
    isSelectable(row, index) {
      if (this.isFullSize && !this.multipleSelection.some(item => item === row.id)) {
        return false
      } else {
        return true
      }
    },


    handleCheckbox(selection) {
      if(selection.length === 1) {
        this.selectedRowData = selection[0]
        this.quoteId = selection[0].id
      }
    },

    /** 
     * 处理成交。【已审批】才能成交
     */
    handleDeal() {
      if (this.selectedRowData.status === 'APPROVED') {
        acceptQuotation(this.quoteId).then(res => {
          this.$message({ showClose: true, message: this.$t('common.doOk'), type: 'success' })
          this.getTableData()
        })
      } else {
        this.$message({ showClose: true, message: this.$t('quote.table.tipNoPassToDeal'), type: 'warning' })
      }
    },

    /**
     * 处理拒绝。【已成交】、【已拒绝】不能再次拒绝
     */
    handleReject() {
      const status = this.selectedRowData.status
      if (status === 'APPROVED' || status === 'REJECTED') {
        this.$message({ showClose: true, message: this.$t('quote.table.tipIsCompleteToReject'), type: 'warning' })
      } else {
        rejectQuotation(this.quoteId).then(res => {
          this.$message({ showClose: true, message: this.$t('common.doOk'), type: 'success' })
        })
      }
    },

    /**
     * 表格行选中/反选回调函数
     */
    handleSelectionChange(selection, row) {
      this.multipleSelection = selection.map(item => item.id)
      this.multipleSelectionObj = selection

      if (selection.length >= this.fullSize) {
        this.isFullSize = true
      } else {
        this.isFullSize = false
      }
    },

    /**
     * 搜索条件
     */
    search(cond) {
      const params = Object.assign(cond, { page: 0, size: 10 })
      this.getTableData(params)
    },

    filterStatus(status, index) {
      this.curStatusIndex = index
    },

    handleCellClick(row) {
      this.quoteId = row.id
      this.$store.commit('quote/SET_QUOTATIONLINE', row)
      this.$router.push({ path: '/dockrepair/quote/overview',
        query: {
          id: row.id,
          name: row.dockingProjectName 
        }
      })
    },

    /**
     * 行选中，用于判断是否可以成交/拒绝
     */
    handleRowClick(row, column, event) {
      this.selectedRowData = row
    },

    /**
     * 比价前，处理用户选择的询价单id
     */
    handleContrast() {

      const selArr = this.multipleSelection

      if (selArr.length) {

        let id = this.multipleSelectionObj[0].dockingProjectId
        let flag = this.multipleSelectionObj.every(item => {
          console.warn(item.dockingProjectId)
          return item.dockingProjectId === id
        })

        // 只有同一个项目的报价单才能一块比
        if(flag) {
          this.$router.push({
            path: '/dockrepair/quote/contrast',
            query: {
              qId: (selArr.length > 0) ? selArr[0] : null,
              qId2: (selArr.length > 1) ? selArr[1] : null,
              qId3: (selArr.length > 2) ? selArr[2] : null
            }
          })
        } else {
          this.$message({ showClose: true, message: this.$t('quote.table.tipNoMatch'), type: 'warning' })
        }
      } else {
        this.$message({ showClose: true, message: this.$t('quote.table.tipNoSelect'), type: 'warning' })
      }
    },

    getTableData(params) {
      this.tableLoading = true
      params = params || this.params

      getQuoteList(params).then(res => {
        this.$set(this.pagination, 'total', res.data.totalElements)
        this.specList = res.data.content
        this.tableLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../../../styles/variables.scss';

.table-view-quote{
  table.el-table__header{
    label.el-checkbox{
      display: none;
    }
  }

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
      color: #1E90FF;
    }
    &-REJECTED{
      color: #FF4500;
    }
    &-ACCEPTED{
      color: #539F5C;
    }
  }
}

.btns-horizontal{
  .id-button{
    margin-right: 8px;
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
.quote-btns-set{
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
</style>
