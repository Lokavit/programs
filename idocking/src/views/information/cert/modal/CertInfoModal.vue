<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-22 16:10:31
 * @LastEditTime: 2019-11-14 14:37:26
 -->
<template>
  <div class="cert-info-modal" v-loading="modalLoading" :element-loading-text="$t('common.loadingTip')">
    <div class="svg-bg-boat">
      <form-mod
        ref="formMod" 
        :syncSave="false"
        :form-config="certInfoModalConfig"
        :form-data="certInfo"
        :title="$t('common.baseTitle')"
        label-width="100px"
        :column="2"
        :type=2
        @saveIt="_save"
        @editIt="_editIt"
        @cancelIt="_cancelIt">
      </form-mod>
      <div class="separation-line box-shadow" style="margin:10px 0;"></div>
      <attachments :file-list="attachments" ref="atta" :max-height="250"></attachments>
    </div>

    <select-vessel v-model="selectVesselVisible" @selectIt="selectVessel"></select-vessel>
  </div>
</template>

<script>
import FormMod from '@/components/FormMod'
import IdDialog from '@/components/IdDialog'
import Attachments from '@/components/Attachments'
import SelectVessel from '@/modals/SelectVessel'
import CertInfoModalMixin from '../mixins/CertInfoModal'
import { getCertInfo, updateShipCert } from '@/api/cert'

export default {
  inject: ['_idialog'],
  components: {
    FormMod,
    IdDialog,
    Attachments,
    SelectVessel
  },
  mixins: [CertInfoModalMixin],
  props: {
    certId: Number
  },
  data() {
    return {
      modalLoading: false,
      confirmLoading: false,
      selectVesselVisible:false,
      certInfo: {},
      attachments: []
    }
  },
  methods: {
    _editIt() {
      this.$refs['atta']._triggerState(3)
    },
    _cancelIt() {
      this.$refs['atta']._triggerState(4)
    },
    closeIt() {
      this._idialog.close()
    },
    selectVessel(row){
      let { name, id } = row

      this.$refs['formMod'].formModel.vessel = { name, id }
    },
    _save() {
      this.confirmLoading = true

      this.$refs['formMod'].$refs['formMod'].validate((valid) => {
        if (valid) {
          let data = Object.assign(
            {
              id: this.certId
            },
            this.$refs['formMod']._getSelfData(),
            this.$refs['atta']._getSelfData()
          )
        
          updateShipCert(data)
            .then(res => {
              this.$message({showClose: true,message: this.$t('common.editOk'),type: 'success'});
              this.$refs['formMod']._triggerSaveState()
              this.$refs['atta']._triggerSaveState()
              this.confirmLoading = false
              this.$emit('reload')
          })
        }
      })
    },
    getCertInfo() {
      this.modalLoading = true;

      getCertInfo(this.certId).then(res => {
        this.certInfo = res.data
        this.attachments = res.data.attachments
        this.modalLoading = false
      })

    }
  },
  created() {
    this._idialog.children.push(this)
    this.getCertInfo()
  }
}
</script>

<style lang="scss">
.svg-bg-boat{
  background-image: url(background-boat.svg);
  background-size: 227px 227px;
  background-repeat: no-repeat;
  background-position: right top;
}
</style>