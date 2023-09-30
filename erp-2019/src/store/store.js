import Vue from "vue";
import Vuex from "vuex";

import getters from './getters';
import modal from './modules/modal';
import taskbar from './modules/taskbar';
import label from './modules/label';
import demo from './modules/demo'; // 测试相关

Vue.use(Vuex);

import createLogger from 'vuex/dist/logger' // 修改state時在console打印

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  getters,
  modules: {
    modal,
    taskbar,
    label,
    demo,
  },

  strict: debug, // 嚴格模式，非法修改state時報錯
  plugins: debug ? [createLogger()] : []
});

export default store; // 最後導出，並在src/main.js中引入