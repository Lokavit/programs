<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-09 14:46:26
 * @LastEditTime: 2019-12-10 17:04:50
 -->
<template>
  <div class="settings-user-info">
    <form-mod-title 
      :text="$t('common.baseTitle')"
      :syncSave="false"
      @edit="handleEdit"
      @save="_save"
      @cancel="handleCancel">
    </form-mod-title>
    
    <div class="userinfo-wrapper">
      <avatar ref="avatar" :file-list="userInfo" @updateAvatarOk="handleUpdateAvatar"></avatar>
      <form-mod 
        :form-config="userInfoConfig" 
        :form-data="userInfo" 
        :column=1 
        :type=1 
        :showHeader=false 
        ref="formMod">
      </form-mod>
    </div>
  </div>
</template>

<script>
import UserInfoMixin from './UserInfo'
import { getUserInfo, updateUserInfo } from '@/api/settings-user'
import Avatar from '@/components/Avatar'
import FormModTitle from '@/components/FormModTitle'

export default {
  inject:['_idialog'],
  mixins: [ UserInfoMixin ],
  components: { Avatar, FormModTitle },
  props:{
    userId: Number | String
  },
  data() {
    return {
      userInfo: {},
      avatarId: null   // 头像图片id
    }
  },
  methods: {
    handleUpdateAvatar(avatarId) {
      this.avatarId = avatarId
    },

    handleEdit() {
      this.$refs['avatar']._triggerState(3)
      this.$refs['formMod']._triggerState(3)
    },

    handleCancel() {
      this.$refs['avatar']._triggerState(4)
      this.$refs['formMod']._triggerState(4)
    },

    getUserInfo() {
      getUserInfo(this.userId).then(res => {
        res.data.id = res.data.avatar   // avatar组件来源于附件，数据中需要一个id字段，用于拼接图片url
        
        this.avatarId = res.data.avatar
        this.userInfo = res.data
      })
    },

    _save() {
      this.$refs['formMod'].$refs['formMod'].validate((valid) => {
        if (valid) {
          let formData = this.$refs['formMod']._getSelfData()
          let params = {
            name: formData.name,
            avatar: this.avatarId
          }

          updateUserInfo(params).then(res => {
            this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})
            this.$refs['avatar']._triggerSaveState()
            this.$refs['formMod']._triggerSaveState()
            this.$store.dispatch('user/getUserInfo')
            // this.$nextTick(() => { this._idialog.close() })
          })
        }
      })
    }
  },
  created() {
    this._idialog.children.push(this)
    this.getUserInfo()
  }
}
</script>

<style lang="scss">
.userinfo-wrapper{
  display: flex;
}
.settings-user-info /deep/ .form-mod-title{
  padding-bottom: 15px;
}
</style>