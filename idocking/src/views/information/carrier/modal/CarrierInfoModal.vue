<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-16 20:04:24
 * @LastEditTime: 2019-11-29 10:30:39
 -->
<template>
  <div class="carrier-info">

    <div class="carrier-info-top svg-bg-boat">
      <form-mod
        :form-config="infoModalConfig"
        :form-data="formData"
        :syncSave="false"
        class="form-mod-padding"
        :title="$t('common.baseTitle')"
        ref="formMod" 
        :type=2
        :column=2 
        @saveIt="_save"
        @editIt="editIt"
        @cancelIt="cancelIt"
      ></form-mod>

      <div style="height:5px;"></div>

      <att-cert :file-list="certData" ref="cert" :accept="accept" style="margin-bottom:8px"></att-cert>
      <att-auth :file-list="authData" ref="auth" :accept="accept"></att-auth>
      <div class="carrier-info-atta">
        <div class="carrier-info-atta-left el-form-item__label">{{ $t('common.attachment') }}</div>
        <div class="carrier-info-atta-right">
          <attachments :file-list="attachments" ref="atta"></attachments>
        </div>
      </div>

    </div>

    <div class="separation-line box-shadow" style="margin:20px 0"></div>
    
    <div class="form-mod-padding">
      <div class="info-title" style="padding: 0 0 20px 0">
        <i class="kft-icon-volumn" style="margin-right:6px;"></i>
        <span>{{ $t('carrier.detail.shipTitle') }}</span>
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
          :cell-style="{padding:'4px 0',color:'#2e2f2f'}"
          :data="carrierShipList"
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
            prop="name"
            :label="$t('shipInfo.table.name')"
          >
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="type.name"
            width="120px"
            :label="$t('shipInfo.table.type')">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="shipIdentificationNumber"
            :label="$t('shipInfo.table.shipid')"
            width="260">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="shipOwner.name"
            :label="$t('shipInfo.table.owner')">
          </el-table-column>

        </el-table>

        <pagination
          :pagination="pagination"
          :page="params.page+1"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        ></pagination>
      </div>
    </div>


  </div>
</template>

<script>
import FormMod from '@/components/FormMod'
import infoModalMixins from '../mixins/CarrierInfoModal'
import AttCert from '../components/AttCert'
import AttAuth from '../components/AttAuth'
import Attachments from '@/components/Attachments'
import PaginationMixin from "@/components/Pagination"
import Pagination from "@/components/Pagination"
import { getCarrierInfo, updateCarrier } from '@/api/carrier'
import { getVesselPageList } from '@/api/baseInfo'

export default {
  inject: ['_idialog'],
  components: {
    FormMod,
    AttCert,
    AttAuth,
    Attachments,
    Pagination
  },
  mixins: [
    infoModalMixins,
    PaginationMixin
  ],
  props: {
    carrierId: Number | String
  },
  data() {
    return {
      accept: '.jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.BMP,.PNG',
      formData: {},
      certData: [],
      authData: [],
      attachments:[],
      confirmLoading:false,

      carrierShipList:[],
      tableLoading: false,
      params: {                 // 船东的船舶信息
        companyId: null,
        nameContaining: null,
        shipOwnerId: this.carrierId,
        page: 0,
        size: 10,
        typeId: null,
        validity: true,
      }
    }
  },
  methods: {
    editIt() {
      this.$refs['cert']._triggerState(3)
      this.$refs['auth']._triggerState(3)
      this.$refs['atta']._triggerState(3)
    },
    cancelIt() {
      this.$refs['cert']._triggerState(4)
      this.$refs['auth']._triggerState(4)
      this.$refs['atta']._triggerState(4)
    },
    closeIt(){
      this._idialog.close()
    },
    _save() {
      // 编辑状态禁止提交数据

      this.confirmLoading = true
      var formData = this.$refs['formMod']._getSelfData()
      var certData = this.$refs['cert']._getSelfData()
      var authData = this.$refs['auth']._getSelfData()
      var attaData = this.$refs['atta']._getSelfData()

      var data = Object.assign(
        {
          id: this.carrierId
        },
        formData,
        { certificates: certData.attachments },
        { authorizationLetters: authData.attachments },
        { attachments: attaData.attachments }
      )

      this.$refs['formMod'].$refs['formMod'].validate((valid) => {
        if (valid) {
          updateCarrier(data).then(res => {
            this.$message({showClose: true,message: this.$t('shipInfo.addShipModal.editOk'),type: 'success'});
            this.$refs['formMod']._triggerSaveState()
            this.$refs['cert']._triggerSaveState()
            this.$refs['auth']._triggerSaveState()
            this.$refs['atta']._triggerSaveState()
            this.$emit('reload');
          })
        } else {
          this.confirmLoading = false
        }
      })

    },
    getTableData() {
      getVesselPageList(this.params).then(res => {
        this.$set(this.pagination, 'total', res.data.totalElements);
        this.carrierShipList = res.data.content;
        this.tableLoading = false;
      })
    },
  },
  created() {
    this._idialog.children.push(this)
    getCarrierInfo(this.carrierId).then(res => {
      this.formData = res.data
      this.certData = res.data.certificates
      this.authData = res.data.authorizationLetters
      this.attachments = res.data.attachments
    })
    this.getTableData()
  },
}
</script>

<style lang="scss">
.carrier-info{
  &-top{
    position: relative;
  }
  &-atta{
    margin-top: 15px;
    display: flex;
    &-left{
      box-sizing: border-box;
      width: 130px;
      padding: 0 12px 0 10px;
      text-align: left;
      font-size: 12px;
      font-weight: bold;
      color:#7D7D7D;
    }
    &-right{
      flex: 1;
      width: 0;
    }
  }
}

.svg-bg-boat{
  background-image: url(background-boat.svg);
  background-size: 227px 227px;
  background-repeat: no-repeat;
  background-position: right 40%;
}
</style>