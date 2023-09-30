<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-09 14:46:26
 * @LastEditTime: 2019-12-12 14:11:02
 -->
<template>
  <div class="settings-add-user">
    <avatar ref="avatar"></avatar>
    <form-mod :form-config="addUserConfig" :column=1 ref="formMod"></form-mod>
  </div>
</template>

<script>
import AddUserMixin from '../mixins/AddUser'
import Avatar from '@/components/Avatar'
import { checkLoginNameUnique, getJobList, addNewUser } from '@/api/settings-user'

export default {
  inject:['_idialog'],
  mixins: [ AddUserMixin ],
  components: { Avatar },
  methods: {
    checkLoginNameUnique(loginName) {
      return checkLoginNameUnique(loginName)
    },
    validateLoginName(rule, value, callback) {
      // callback(new Error('必须年满18岁'));
    },
    _save() {
      this.$refs['formMod'].$refs['formMod'].validate((valid) => {
        if (valid) {
          // 组织一下提交的数据
          let formData = this.$refs['formMod']._getSelfData()
          let avatar = this.$refs['avatar']._getSelfData()
          let avatarId = avatar.id ? avatar.id : ''
          formData.avatar = avatarId

          addNewUser(formData.loginName, formData).then(res => {
            this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})

            this.$emit('reload')
            this.$nextTick(() => {
              this._idialog.close()
            })
          })
        }
      })
    }
  },
  created() {
    this._idialog.children.push(this)
  },
  mounted() {
    // 头像变成可编辑状态
    this.$refs['avatar']._triggerState(3)
  }
}
</script>

<style lang="scss">
.settings-add-user{
  display: flex;
}
</style>