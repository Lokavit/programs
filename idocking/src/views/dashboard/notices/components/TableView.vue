
<template>
  <div class="table-view">

    <div class="notice-btns-set">
      <div class="btns-horizontal">
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button type="primary" size="mini" :disabled="!canMark">
            {{ $t('dashboard.notices.table.flagAt') }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command=true>{{ $t('dashboard.notices.table.flag_Readed') }}</el-dropdown-item>
            <el-dropdown-item :command=false>{{ $t('dashboard.notices.table.flag_UnRead') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div></div>
    </div>

    <id-dialog
      v-model="noticeInfoVisible"
      ref="noticeInfoDialog"
      @close="getTableData"
      :title="$t('dashboard.notices.infoModal.title')" 
      width="45%" 
      :box-padding=false>
      <notice-info-modal v-if="noticeInfoVisible" :noticeId="noticeId" ref="noticeInfoModal" @reload="getTableData"></notice-info-modal>

      <template v-slot:footer>
        <el-button
          type="primary"
          size="mini" 
          @click="handleOk"> 
          <span>{{ $t('common.ok') }}</span> 
        </el-button>
        <el-button
          type="warning"
          size="mini" 
          @click="handleAsUnRead"> 
          <span>{{ $t('dashboard.notices.infoModal.btnUnRead') }}</span> 
        </el-button>
      </template>
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
        :cell-style="{padding:'8px 0',color:'#2e2f2f'}"
        :data="noticesList"
        style="width: 100%"
        highlight-current-row
        @selection-change="changeRow"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
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
          :label="$t('dashboard.notices.table.content')" 
          prop="name">
          <template slot-scope="{ row }">
            <a class="cursor" @click.prevent="handleRowClick(row)">
              {{row.name}}
            </a>
          </template>
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="from.name"
          :label="$t('dashboard.notices.table.from')">
        </el-table-column>

        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="createdTime"
          :label="$t('dashboard.notices.table.createAt')">
        </el-table-column>
        
        <el-table-column
          align="left"
          prop="read"
          :label="$t('dashboard.notices.table.status')">
          <template slot-scope="{ row }">
            <div :class="['notice-status', true ? 'notice-status-' + row.read : '']">
              {{ $t(noticeStatusMap(row.read)) }}
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
import IdButton from '@/components/IdButton'
import NoticeInfoModal from '../modals/NoticeInfo'
import Pagination from "@/components/Pagination"
import PaginationMixin from '@/mixins/PaginationMixin'
import { getNotices, markNoticeAsUnRead, markNoticeAsReaded } from '@/api/dashboard'

export default {
  components: {
    Pagination,
    IdButton,
    NoticeInfoModal
  },
  mixins: [ PaginationMixin ],
  data() {
    return {
      tableLoading: false,
      noticeId:null,
      noticeInfoVisible:false,
      noticesList: [],
      multipleSelection: []
    }
  },
  computed: {
    canMark() {
      return this.multipleSelection.length > 0
    }
  },
  methods: {

    search(cond) {
      let params = Object.assign(cond, { page: 0, size: 10 })
      this.params = Object.assign(this.params, cond)
      this.getTableData(params)
    },

    handleCommand(command) {
      if(command) {
        this.markNoticeAsReaded(this.multipleSelection)
      } else {
        this.markNoticeAsUnRead(this.multipleSelection)
      }
    },

    changeRow(set) {
      this.multipleSelection = set.map(item => {
        return item.id
      }) 
    },

    handleOk() {
      this.$refs['noticeInfoDialog'].close()
      this.getTableData()
    },

    handleAsUnRead() {
      this.$refs['noticeInfoModal'].markNoticeAsUnRead()
    },

    markNoticeAsUnRead(ids) {
      markNoticeAsUnRead(ids).then(res => {
        this.getTableData()
      })
    },
    markNoticeAsReaded(ids) {
      markNoticeAsReaded(ids).then(res => {
        this.getTableData()
      })
    },

    handleRowClick(row) {
      this.noticeId = row.id
      this.noticeInfoVisible = true
    },

    getTableData(params) {
      this.tableLoading = true
      params = params ? params : this.params

      getNotices(params).then(res => {
        this.$set(this.pagination, 'total', res.data.totalElements)
        this.noticesList = res.data.content
        this.tableLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../../../styles/variables.scss';
.notice-btns-set{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.notice-status{
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
  &-true{
    color: $main-bg;
  }
  &-false{
    color: $red;
  }

}
</style>