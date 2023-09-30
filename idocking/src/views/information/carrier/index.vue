<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 17:01:07
 * @LastEditTime: 2019-11-19 13:17:16
 -->
<template>
  <div class="id-carrier">
    <form-search :form-config="formSearchConfig" :column="3" labelWidth="120px" @search="search"></form-search>
    <div class="separation-line box-shadow"></div>

    <div class="padding box-shadow">
      <div class="table-toolbar">
        <div class="right">
          <id-button icon="plus" class="align-right" text="common.add" @click="addCarrierVisible = true"></id-button>
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
          :data="carrierList"
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
            :show-overflow-tooltip="true"
            align="left"
            width="300px"
            :label="$t('carrier.table.name')"
          >
            <template slot-scope="scope">
              <a class="cursor" @click.prevent="rowClickForEdit(scope.row.id)">
                {{scope.row.name}}
              </a>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="liaison"
            width="200px"
            :label="$t('carrier.table.contacts')">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="telephone"
            :label="$t('carrier.table.phone')"
            >
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="endAt"
            width="120px"
            fixed="right"
            :label="$t('shipInfo.table.ops')"
          >
            <template slot-scope="{ row }">
              <div class="btn-table-ops" @click.prevent="rowClickForEdit(row.id)">
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
    <id-dialog v-model="addCarrierVisible" width="55%" :title="$t('carrier.addCarrier')">
      <add-carrier-modal v-if="addCarrierVisible" @reload="getTableData"></add-carrier-modal>
    </id-dialog> 

    <!-- 船舶详情弹框 -->
    <id-dialog v-model="carrierInfoVisible" width="900px" center :boxPadding="false" :title="$t('carrier.editCarrier')" :footer="false">
      <carrier-info-modal v-if="carrierInfoVisible" :carrierId="carrierId" @reload="getTableData"></carrier-info-modal>
    </id-dialog> 
    
    <!-- <el-button type="primary" @click="carrierInfoVisible = true">modal</el-button> -->

  </div>
</template>
<script>
import { deepCopy, filterData } from '@/utils/assist'
import IdButton from '@/components/IdButton'
import IdDialog from '@/components/IdDialog'
import FormSearch from "@/components/FormSearch"
import Pagination from "@/components/Pagination"
import PaginationMixin from '@/mixins/PaginationMixin'
import FormSearchConfig from './mixins/FormSearch'
import AddCarrierModal from './modal/AddCarrierModal'
import CarrierInfoModal from './modal/CarrierInfoModal'

import {
  getCarrierList,
  delCarrier
} from '@/api/carrier';

export default {
  name: 'shipInfo',
  components: {
    IdButton,
    Pagination,
    FormSearch,
    IdDialog,
    AddCarrierModal,
    CarrierInfoModal
  },
  mixins: [ PaginationMixin, FormSearchConfig ],
  data() {
    return {
      tableLoading: false,
      carrierInfoVisible:false, // 详情Modal
      addCarrierVisible:false,  // 添加Modal
      carrierId: 0,             // 船舶id
      rowClickData: {},         // 编辑某行数据
      carrierList: [],          // 船东信息列表数据
      params: {                 // 传给后台
        companyId: null,
        nameContaining: null,
        shipOwnerId: null,
        page: 0,
        size: 10,
        typeId: null,
        validity: true,
      }
    }
  },
  methods: {
    search(conditions) {
      this.params.page = 0;

      let { name, liaison } = conditions
      if(!name && !liaison) {
        this.getTableData()
      } else {
        this.carrierList = filterData(conditions, this.carrierList)
      }
      
    },

    rowClickForEdit(id) {
      this.carrierId = id;
      this.carrierInfoVisible = true;
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
        delCarrier(id).then(res => {
          this.$message({showClose: true,message: this.$t('common.delOk'),type: 'success'});
          this.getTableData()
        })
      })
    },

    getTableData() {
      this.tableLoading = true;
      getCarrierList().then(res => {
        this.$set(this.pagination, 'total', res.data.length);
        this.carrierList = res.data;
        this.tableLoading = false;
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';

.btn-table-ops{
  display: inline-block;
  width: 22px;
  text-align: center;
  cursor: pointer;
  i{
    color: $main-bg;
  }
  &:hover{
    background-color: rgba(0,0,0,0.2);
    border-radius: 4px;
  }
}  
</style>