<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 17:01:07
 * @LastEditTime: 2019-10-29 20:29:35
 -->
<template>
  <form-mod
    ref="formMod" 
    :form-config="addCarrierModalConfig"
    :form-data="formData"
    :column="2">
  </form-mod>
</template>
<script>
import { addCarrier } from '@/api/carrier';
import FormMod from '@/components/FormMod'
import AddCarrierModalMixin from '../mixins/AddCarrierModal'

export default {
  inject: ['_idialog'],
  components: {
    FormMod
  },
  mixins: [AddCarrierModalMixin],
  data() {
    return {
      confirmLoading: false,
    }
  },
  props: {
    carrierId: Number,
    formData: {
      type: [Object, Array]
    }
  },
  methods: {
    closeIt() { // 检测对象
      this._idialog.close()
    },
    _save() {
      this.confirmLoading = true

      this.$refs['formMod'].$refs['formMod'].validate((valid) => {
        if (valid) {
          var data = this.$refs['formMod']._getSelfData()
          addCarrier(data).then(res => {
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