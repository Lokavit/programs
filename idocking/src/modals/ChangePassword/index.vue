<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-10 17:19:06
 * @LastEditTime: 2019-12-11 08:15:50
 -->
<template>
  <div class="change-password">
    <form-mod :form-config="passwordConfig" :column=1 ref="formMod"></form-mod>
  </div>
</template>

<script>
import ChangePassword from './ChangePassword'
import { changeMyPassword } from '@/api/settings-user'

export default {
  inject:['_idialog'],
  mixins: [ ChangePassword ],
  methods: {
    _save() {
      let formData = this.$refs['formMod']._getSelfData()
      let { oldPassword, newPassword, newPassword2 } = formData

      if(newPassword !== newPassword2) {
        this.$message({showClose: true,message: this.$t('settings.user.passModal.errNotEqual'),type: 'error'})
        return
      }

      changeMyPassword({ oldPassword,newPassword }).then(res => {
        this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})
        this._idialog.close()

        // 修改密码后需要重新登录
        this.$store.dispatch('user/logout')
        this.$nextTick(() => {
          this.$router.push('/login')
        })

      })
    }
  },
  created() {
    this._idialog.children.push(this)
  }
}
</script>