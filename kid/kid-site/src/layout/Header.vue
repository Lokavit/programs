<template>
  <header class="header_wrap">
    <img
      :src="logo"
      style="height: 4rem; padding-left: 0.5rem"
      draggable="false"
    />
    <section>
      <!-- 未登录 显示登入按钮 -->
      <template v-if="!userInfo.success">
        <button class="draw_border" @click="onShowSign">登入</button>
      </template>
      <!-- 登入 显示个人信息 -->
      <template v-else-if="userInfo.success">
        <div @click="onShowAccountMenu" class="account_wrap">
          <img :src="userInfo.avatar" draggable="false" />{{
            userInfo.nickName
          }}
          <ul :style="{ display: isShowAccount ? 'block' : 'none' }">
            <template v-if="headerInfo.schoolList">
              <li @click="onSchool">进入校园</li>
            </template>
            <li><a :href="`/home/friends/${userInfo.id}`">我的主页</a></li>
            <li><a href="/center/creation">我的作品</a></li>
            <li><a href="/account/userInfo">个人资料</a></li>
            <li>修改密码</li>
            <li @click="onSignOut">登出</li>
          </ul>
        </div>
      </template>
    </section>
    <template v-if="isShowSign">
      <Sign @closeSign="onCloseSign"></Sign>
    </template>
  </header>
</template>

<script>
import { getCheckSignState, getSignOut } from "@/api/sign";
import { getHeaderInfo } from "../api/studio";
import Sign from "../components/Sign";
export default {
  name: "Header",
  props: {
    /* 每个机构自己的LOGO */
    logo: { type: String, default: "" },
  },
  components: { Sign },
  data() {
    return {
      userInfo: {},
      headerInfo: {},
      isShowAccount: false,
      isShowSign: false,
      formdata: {
        username: "",
        password: "",
      },
    };
  },
  computed: {},

  watch: {
    isShowAccount(newval, oldval) {
      console.log("监听属性:", newval, oldval);
    },
  },
  mounted() {
    this.checkSign();
  },
  methods: {
    /**
     * @function 点击展开子菜单
     */
    onShowAccountMenu() {
      console.log("点击展开子菜单", this.isShowAccount);
      this.isShowAccount = !this.isShowAccount ? true : false;
    },

    /**
     * @function 点击进入校园(管理后台)
     */
    onSchool() {
      console.log("点击进入管理后台", this.headerInfo.schoolList[0].schoolId);
      if (this.headerInfo.schoolList[0].schoolId) {
        // 新窗口打开外链接
        window.open(
          `/school?schoolId=${this.headerInfo.schoolList[0].schoolId}`,
          "_blank"
        );
      }
    },

    /**
     * @function 显示登入窗体
     */
    onShowSign() {
      console.log("显示登入窗体");
      this.isShowSign = !this.isShowSign ? true : false;
    },

    /**
     * @function 关闭登入窗体
     */
    onCloseSign() {
      console.log("取消登入");
      this.isShowSign = false;
    },

    /**
     * @function 检测登入状态
     */
    async checkSign() {
      console.log("进入登入检测函数");
      this.userInfo = await getCheckSignState();
      console.log("登入检测:", this.userInfo);
      this.headerInfo = await getHeaderInfo();
    },

    /**
     * @function 登出系统
     */
    async onSignOut() {
      console.log("进入登出函数");
      const res = await getSignOut();
      console.log("返回的登出结果:", res);
      this.checkSign();
      console.log("登出后，在此调用登入检测");
    },
  },
};
</script>
