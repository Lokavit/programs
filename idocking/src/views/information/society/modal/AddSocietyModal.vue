<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 17:01:07
 * @LastEditTime: 2019-10-29 20:23:58
 -->
<template>
  <form-mod
    labelWidth="150px"
    ref="formMod" 
    :form-config="addSocietyModalConfig"
    :form-data="formData"
    :column="2">
  </form-mod>
</template>
<script>
import { addSociety } from '@/api/society';
import FormMod from '@/components/FormMod'
import AddSocietyModalMixin from '../mixins/AddSocietyModal'

export default {
  inject: ['_idialog'],
  components: {
    FormMod
  },
  mixins: [AddSocietyModalMixin],
  props: {
    carrierId: Number,
    formType: Number,
    edit: {
      type: Boolean,
      default: false
    },
    formData: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      confirmLoading: false,
    }
  },
  created() {
    this._idialog.children.push(this)
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
          addSociety(data).then(res => {
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
  }
}
</script>