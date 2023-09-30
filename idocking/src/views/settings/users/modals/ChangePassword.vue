<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-10 17:19:06
 * @LastEditTime: 2019-12-11 08:43:36
 -->
<template>
  <div class="change-password">
    <form-mod :form-config="passwordConfig" :column=1 ref="formMod"></form-mod>
  </div>
</template>

<script>
import ChangePasswordMixin from '../mixins/ChangePassword'
import { changePassword } from '@/api/settings-user'

export default {
  inject:['_idialog'],
  mixins: [ ChangePasswordMixin ],
  props:{
    userId: Number | String
  },
  data() {
    return {
      passwordConfig: [
        {
          label: 'settings.user.passModal.newPass', 
          type: 'password',
          key: 'newPassword',
          rules:[
            {required:true,message:' ',trigger:'blur'},
          ], 
          placeholder:'settings.user.passModal.holderNewPass'
        },
      ]
    }
  },
  methods: {
    _save() {
      let formData = this.$refs['formMod']._getSelfData()
      let { newPassword } = formData

      if(newPassword) {
        changePassword({ userId: this.userId, newPassword }).then(res => {
          this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})
          this._idialog.close()
        })
      }
    }
  },
  created() {
    this._idialog.children.push(this)
  }
}
</script>