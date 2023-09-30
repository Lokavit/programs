import Vue from "vue";
import App from "./App.vue";
import router from './router/router'; // 路由管理器
import store from './store/store'; // 状态管理器
import ElementUI from "element-ui";
import './assets/styles/index.scss'; // 引入全局样式
import mixin from './mixins/mixin'; // 引入全局混入
/** 引入全局组件 */
import './components/kingfisher/kingfisher';
import './utils/icon.js'; // svg-icon

import global from './utils/global'; // 引入 全局变量及函数文件

Vue.config.devtools = true; // 调试工具
Vue.config.productionTip = false;
Vue.prototype.GLOBAL = global; // 全局变量及全局函数

Vue.use(ElementUI);
Vue.mixin(mixin); // 全局混入

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");