<template>
  <div class="common_mask">
    <section class="sign_wrap">
      <header>
        <label class="toggle">
          <input type="checkbox" checked="checked" @change="changeSignMode" />
          <span class="slider"></span>
        </label>
      </header>
      <main>
        <div class="input_wrap">
          <input
            type="text"
            v-model="formdata.username"
            placeholder="请输入帐号"
          />
        </div>
        <div class="input_wrap">
          <input
            type="password"
            v-model="formdata.password"
            placeholder="请输入密码"
          />
        </div>
        <template v-if="isSignup">
          <div class="input_wrap">
            <input
              type="text"
              v-model="formdata.nickname"
              placeholder="请输入昵称"
            />
          </div>
        </template>
      </main>
      <footer>
        <template v-if="isSignup">
          <button class="draw_border" @click="onSignUp">注册</button>
        </template>
        <template v-if="!isSignup">
          <button class="draw_border" @click="onSignIn">登入</button>
        </template>
        <button class="draw_border" @click="onClose">关闭</button>
      </footer>
    </section>
  </div>
</template>

<script>
import { getSignIn, getSignUp } from "@/api/sign";
import Header from "../layout/Header.vue";
export default {
  name: "Sign",
  data() {
    return {
      isSignup: false,
      formdata: {
        username: "",
        password: "",
        nickname: "",
      },
    };
  },
  computed: {},

  watch: {},

  mounted() {
    console.log("this:", this);
  },

  methods: {
    onClose() {
      console.log("关闭窗体");
      this.$emit("closeSign", false);
    },

    changeSignMode() {
      console.log("切换登入还是注册", this.isSignup);
      this.isSignup = !this.isSignup ? true : false;
    },

    /**
     * @function 登入
     */
    async onSignIn() {
      console.log("进入登入函数", this.formdata);
      // 校验帐密合法性
      if (
        this.formdata.username.trim() == "" ||
        this.formdata.password.trim() == ""
      ) {
        alert("输入有误，请检测");
        return;
      }

      let temp_formData = {
        userName: this.formdata.username,
        password: this.formdata.password,
      };
      const res = await getSignIn(temp_formData);
      console.log("返回的登入结果:", res);
      if (res.success) {
        this.$parent.checkSign();
        // 调用关闭窗体函数
        this.onClose();
      }
    },
    /**
     * @function 注册
     */
    async onSignUp() {
      console.log("进入注册函数", this.formdata);
      // 校验帐密合法性
      if (
        this.formdata.username.trim() == "" ||
        this.formdata.password.trim() == "" ||
        this.formdata.nickname.trim() == ""
      ) {
        alert("输入有误，请检测");
        return;
      }

      let temp_formData = {
        userName: this.formdata.username,
        password: this.formdata.password,
        nickName: this.formdata.nickname,
      };
      const res = await getSignUp(temp_formData);
      console.log("返回的注册结果:", res);
      if (res.success) {
        this.$parent.checkSign();
        // 调用关闭窗体函数
        this.onClose();
      }
    },
  },
};
</script>
