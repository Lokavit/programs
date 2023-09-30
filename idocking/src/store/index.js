/*
 * @Descripttion:
 * @Author: border-1px
 * @Date: 2019-10-08 14:07:49
 * @LastEditTime: 2019-11-15 14:50:53
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import user from './modules/user'
import settings from './modules/settings'
import permission from './modules/permission'
import specification from './modules/specification'
import quote from './modules/quote'
import dashboard from './modules/dashboard'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    quote,
    settings,
    dashboard,
    permission,
    specification
  },
  getters
})

export default store
