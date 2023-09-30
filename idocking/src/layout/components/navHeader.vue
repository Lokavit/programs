<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 09:59:26
 * @LastEditTime: 2019-12-11 08:21:56
 -->
<template>
  <div class="myheader">
    <div class="p_right">
      <div class="head-block lang" @click="changeLang">
        <span :class="{ 'activeLang': currentLang == 'zh' }">中</span>
        <span>/</span>
        <span :class="{ 'activeLang': currentLang == 'en' }">EN</span>
      </div>

      <div class="head-block cursor" @click="routeTo">
        <el-badge
          :value="$store.getters.noticeCount"
          :hidden="$store.getters.noticeCount == 0"
          :max="99"
          class="item"
        >
          <svg-icon name="head-massage" style="padding-right:0;" ></svg-icon>
        </el-badge>
      </div>

      <div class="head-block"><span style="font-size:14px;">{{userInfo.name}}</span></div>
      <div class="user-head">
        <el-dropdown trigger="click">
          <img
            class="img"
            :src="userInfo.avatar
            ?`${$ATT}/file/display/${userInfo.avatar}?compressed=true`
            :require('@/assets/settings/default-avatar.jpg')" 
          />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  @click.native="changePassword"> {{ $t('navHeader.password') }}</el-dropdown-item>
            <el-dropdown-item  @click.native="changeUserInfo"> {{ $t('navHeader.userinfo') }}</el-dropdown-item>
            <el-dropdown-item  @click.native="logout"> {{ $t('navHeader.logout') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <!-- 用户信息编辑 -->
    <id-dialog v-model="userInfoVisible" width="40%" :title="$t('settings.user.addModal.titleEdit')" :footer="false">
      <user-info-modal v-if="userInfoVisible" :userId="userInfo.userId"></user-info-modal>
    </id-dialog> 

    <id-dialog v-model="changePassVisible" width="40%" :title="$t('settings.user.passModal.title')">
      <change-password-modal v-if="changePassVisible" :userId="userInfo.userId"></change-password-modal>
    </id-dialog> 
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import UserInfoModal from '@/modals/UserInfo'
import ChangePasswordModal from '@/modals/ChangePassword'

export default {
  components: { UserInfoModal, ChangePasswordModal },
  data() {
    return {
      userInfoVisible: false,
      changePassVisible: false,
    }
  },
  computed: {
    currentLang () {
      return this.$i18n.locale
    },
    // store中的数据放在computed中才能实现，数据变更页面更新
    userInfo() {
      return this.$store.getters.userInfo || {}
    }
  },
  methods: {
    changeLang () {
      this.$confirm(
        this.$t('msgboxLang.content'),  
        this.$t('msgboxLang.title'),
        {
          confirmButtonText: this.$t('msgboxLang.ok'),
          cancelButtonText: this.$t('msgboxLang.cancel'),
          type: 'warning'
        }
      ).then(async () => {
        var curLang = this.$i18n.locale
        if (curLang == 'zh') {
          // await this.$store.dispatch('app/updateLangData', 'en')
          this.$i18n.locale = 'en'
        } else {
          // await this.$store.dispatch('app/updateLangData', 'zh')
          this.$i18n.locale = 'zh'
        }
        Cookies.set('language', this.$i18n.locale)
      })
    },
    changePassword() {
      this.changePassVisible = true
    },
    changeUserInfo() {
      this.userInfoVisible = true
    },
    logout() {
      this.$store.dispatch('user/logout')
      this.$router.push('/login')
    },
    getNoticeCount() {
      // 首次进入，先获取一次数据
      this.$store.dispatch('user/getNoticeCount')
      // 启动定时器，定时重新获取
      this.$store.dispatch('user/getNoticeCountTimer')
    },
    routeTo() {
      this.$router.push('/dashboard/notices')
    }
  },
  mounted() {
    this.getNoticeCount()
  },
}
</script>
<style lang = "scss" >
@import '../../styles/variables.scss';

.myheader{
  width: 100%;
  height: 100%;
  position: relative;
  color: #7D7D7D;
  border-bottom: 1px solid #f3f4f6;
  .p_right{
    width: 400px;
    position: absolute;
    right: 0;
    height: 100%;
    display:flex;
    justify-content:flex-end;
    align-items: center;
    .el-badge{
      padding-top: 4px;
    }
    .head-block{
      min-width: 50px;
      height: 100%;
      text-align: center;
      padding:0 10px;
      box-sizing:border-box;
      position: relative;
      &.lang{
        cursor: pointer;
        font-size: 12px;
      }
    }
    .activeLang {
      font-weight: bold;
      font-size: 16px;
      color: $bg-color;
    }
    .user-head{
      cursor: pointer;
      width: 30px;
      height: 30px;
      margin-left:10px;
      border-radius:50%;
      overflow: hidden;
      /* background-color:red; */
      vertical-align: top;
      .img{
        width:100%;
        height: 100%;
        border-radius:50%;
        vertical-align:top;
      }
    }
  }
}
</style>
