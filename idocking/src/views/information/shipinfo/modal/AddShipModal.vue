<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 17:01:07
 * @LastEditTime: 2019-10-29 19:58:50
 -->
<template>
  <form-mod
    ref="formMod" 
    :form-config="addShipModalConfig"
    :form-data="formData"
    :column="2">
  </form-mod>
</template>
<script>
import { shipInfoAdd } from '@/api/baseInfo';
import FormMod from '@/components/FormMod'
import AddShipModalMixin from '../mixins/AddShipModal'

export default {
  inject: ['_idialog'],
  components: {
    FormMod
  },
  mixins: [AddShipModalMixin],
  data() {
    return {
      confirmLoading: false,
      formData:[]
    }
  },
  created() {
    this._idialog.children.push(this)
  },
  methods: {
    async _save() { // 确认添加

      this.$refs['formMod'].$refs['formMod'].validate((valid) => {
        if (valid) {
          var data = this.$refs['formMod']._getSelfData()

          shipInfoAdd(data).then(res => {
            this.confirmLoading = false
            this.$message({showClose: true,message: this.$t('common.addOk'),type: 'success'});
            this.$emit('reload')
            this._idialog.close()
          })
        } else {
          this.confirmLoading = false
        }
      })

    }
  }
}
</script>

<style lang="scss">
// 
</style>