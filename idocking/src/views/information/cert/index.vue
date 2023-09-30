<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 17:01:07
 * @LastEditTime: 2019-12-09 14:21:36
 -->
<template>
  <div class="class-society">
    <form-search :form-config="formSearchConfig" :column="3" labelWidth="120px" ref="formSearch" @search="search"></form-search>
    <div class="separation-line box-shadow"></div>

    <div class="padding box-shadow">      
      <div class="table-toolbar">
        <div class="right">
          <id-button icon="plus" class="align-right" text="common.add" @click="addShipCertVisible = true"></id-button>
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
          :data="certList"
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
            :label="$t('shipCert.table.certName')"
            prop="name">
            <template slot-scope="{ row }">
              <a class="cursor" @click.prevent="rowClickForEdit(row)">
                {{row.name}}
              </a>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="vessel.name"
            :label="$t('shipCert.table.shipName')">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="code"
            :label="$t('shipCert.table.certId')">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="expirationDate"
            :label="$t('shipCert.table.expireDate')">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            :label="$t('shipCert.table.status')">
            <template slot-scope="{ row }">
              <!-- {{ $t(row.computedInfo.status | shipCertStatusMap) }}  // 国际化不支持使用过滤器 -->
              <span :class="'cert-status-' + row.computedInfo.status">
                {{ $t(shipCertStatusMap(row.computedInfo.status)) }}
              </span>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="endAt"
            fixed="right"
            width="120px"
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
    
    <select-vessel v-model="selectVesselVisible" @selectIt="selectVessel"></select-vessel>

    <!-- 添加 -->
    <id-dialog v-model="addShipCertVisible" width="55%" :title="$t('shipCert.addCert')">
      <add-cert-modal v-if="addShipCertVisible" @reload="getTableData"></add-cert-modal>
    </id-dialog> 
   
    <!-- 编辑 -->
    <id-dialog v-model="editShipCertVisible" width="55%" center :title="$t('shipCert.editCert')" :footer="false">
      <cert-info-modal v-if="editShipCertVisible" :certId="certId" @reload="getTableData"></cert-info-modal>
    </id-dialog> 

  </div>
</template>
<script>
import IdButton from '@/components/IdButton'
import IdDialog from '@/components/IdDialog'
import FormSearch from '@/components/FormSearch'
import Pagination from "@/components/Pagination"
import AddCertModal from './modal/AddCertModal'
import CertInfoModal from './modal/CertInfoModal'
import FormSearchMixin from './mixins/FormSearch'
import PaginationMixin from '@/mixins/PaginationMixin'
import SelectVessel from '@/modals/SelectVessel'

import {
  getCertList,
  delShipCert
} from '@/api/cert';

export default {
  name: 'shipInfo',
  components: {
    IdButton,
    Pagination,
    IdDialog,
    FormSearch,
    AddCertModal,
    CertInfoModal,
    SelectVessel
  },
  mixins: [ PaginationMixin, FormSearchMixin ],
  data() {
    return {
      certId: 0,                   // 证书Id
      certList: [],                // 船舶信息列表数据
      tableLoading: false,         // 表格加载状态
      addShipCertVisible: false,   // 添加Modal
      editShipCertVisible: false,  // 编辑Modal
      selectVesselVisible: false,  // 选择船舶Modal
      params: {                    // 搜索
        status: null,
        vesselId: null,
        page: 0,
        size: 10,
        validity: true,
      }
    }
  },
  methods: {
    search(params) {
      this.params.page = 0;
      this.$set(this.params, 'status', params.status || null)
      this.$set(this.params, 'vesselId',params.vessel.id || null)  // vessel是Object
      this.getTableData()
    },

    selectVessel(row){
      let { name, id } = row

      this.$refs['formSearch'].formModel.vessel = { name, id }
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
        delShipCert(id).then(res => {
          this.$message({showClose: true,message: this.$t('common.delOk'),type: 'success'})
          this.getTableData()
        })
      })
    },

    rowClickForEdit(row) {
      this.certId = row.id
      this.editShipCertVisible = true
    },

    getTableData() {
      this.tableLoading = true;
      getCertList(this.params).then(res => {
        this.$set(this.pagination, 'total', res.data.totalElements);
        this.certList = res.data.content
        this.tableLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
.cert-status-NORMAL{
  // 
}
.cert-status-EXPIRATION_CLOSE{
  color: #f0ad4e;
  font-weight: bold;
}
.cert-status-EXPIRED{
  color: #d9534f;
  font-weight: bold;
}
</style>