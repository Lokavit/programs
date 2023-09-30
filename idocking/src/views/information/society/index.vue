<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 17:01:07
 * @LastEditTime: 2019-10-21 14:18:58
 -->
<template>
  <div class="class-society">
    <!-- <form-search :form-config="formSearchConfig" :column="4" @search="search"></form-search> -->
    <!-- <div class="separation-line box-shadow"></div> -->

    <div class="padding box-shadow">
      <div class="table-toolbar">
        <div class="right">
          <id-button icon="plus" class="align-right" text="common.add" @click="addSocietyVisible = true"></id-button>
        </div>
      </div>  

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
          :data="societyList"
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
            width="200px"
            :show-overflow-tooltip="true"
            :label="$t('society.table.name')"
            prop="name">
            <template slot-scope="scope">
              <a class="cursor" @click.prevent="rowClickForEdit(scope.row)">
                {{scope.row.name}}
              </a>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="abbr"
            width="120px"
            :label="$t('society.table.shortName')">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            width="150px"
            prop="liaison"
            :label="$t('society.table.contacts')">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            width="150px"
            prop="telephone"
            :label="$t('society.table.phone')">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="email"
            width="180px"
            :label="$t('society.table.mail')">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="remark"
            :label="$t('society.table.remark')">
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
                <i class="el-icon-edit" ></i>
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
    
    <!-- 添加 -->
    <id-dialog v-model="addSocietyVisible" width="55%" :title="$t('society.addSoc')">
      <add-society-modal v-if="addSocietyVisible" @reload="getTableData"></add-society-modal>
    </id-dialog> 
   
    <!-- 编辑 -->
    <id-dialog v-model="editSocietyVisible" width="55%" :title="$t('society.editSoc')" :footer="false">
      <society-info-modal v-if="editSocietyVisible" :societyInfo="rowData" :societyId="societyId"  @reload="getTableData"></society-info-modal>
    </id-dialog> 
    
  </div>
</template>
<script>
import IdButton from '@/components/IdButton'
import IdDialog from '@/components/IdDialog'
import Pagination from "@/components/Pagination"
import AddSocietyModal from './modal/AddSocietyModal'
import SocietyInfoModal from './modal/SocietyInfoModal'
import PaginationMixin from '@/mixins/PaginationMixin'

import {
  getSocietyList,
  delSociety
} from '@/api/society';

export default {
  name: 'shipInfo',
  components: {
    IdButton,
    Pagination,
    IdDialog,
    AddSocietyModal,
    SocietyInfoModal
  },
  mixins: [ PaginationMixin ],
  data() {
    return {
      societyId: 0,             // 船东Id
      rowData: {},              // 编辑Modal时的行数据
      societyList: [],          // 船舶信息列表数据
      tableLoading: false,
      addSocietyVisible: false,
      editSocietyVisible: false
    }
  },
  methods: {
    addSociety() {
      this.addSocietyVisible = true
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
        delSociety(id).then(res => {
          this.$message({showClose: true,message: this.$t('common.delOk'),type: 'success'})
          this.getTableData()
        })
      })
    },

    rowClickForEdit(row) {
      this.rowData = row
      this.societyId = row.id
      this.editSocietyVisible = true
    },

    getTableData() {
      this.tableLoading = true;
      getSocietyList(this.params).then(res => {
        this.$set(this.pagination, 'total', res.data.length);
        this.societyList = res.data
        this.tableLoading = false
      })
    }
  }
}
</script>
