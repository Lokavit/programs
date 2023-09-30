<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 17:01:07
 * @LastEditTime: 2019-10-29 20:26:49
 -->
<template>
  <div class="add-society-modal">
    <form-mod
      ref="formMod" 
      :form-config="addCertModalConfig"
      :column="2">
    </form-mod>

    <select-vessel v-model="selectVesselVisible" @selectIt="selectVessel"></select-vessel>
  </div>
</template>
<script>
import { addShipCert } from '@/api/cert'
import AddCertModalMixin from '../mixins/AddCertModal'
import FormMod from '@/components/FormMod'
import IdDialog from '@/components/IdDialog'
import SelectVessel from '@/modals/SelectVessel'

export default {
  inject: ['_idialog'],
  components: {
    FormMod,
    IdDialog,
    SelectVessel
  },
  mixins: [AddCertModalMixin],
  data() {
    return {
      confirmLoading: false,
      selectVesselVisible: false
    }
  },
  methods: {
    selectVessel(row){
      let { name, id } = row

      this.$refs['formMod'].formModel.vessel = { name, id }
    },
    closeIt() {
      this._idialog.close()
    },
    _save() {
      this.confirmLoading = true
      var data = Object.assign({}, this.$refs['formMod']._getSelfData())

      this.$refs['formMod'].$refs['formMod'].validate((valid) => {
        if (valid) {
          addShipCert(data).then(res => {
            this.confirmLoading = false
            this.$message({showClose: true,message: this.$t('common.addOk'),type: 'success'});
            this.$emit('reload')
            this.closeIt()
          })
        } else {
          this.confirmLoading = false
        }
      })
      
    }
  },
  created() {
    this._idialog.children.push(this)
  }
}
</script>