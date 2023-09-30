/*
 * @Descripttion: App enrty
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:50
 * @LastEditTime: 2019-12-12 15:40:22
 */
import Vue from 'vue'
import '@/utils/init'
import 'normalize.css/normalize.css'
import '@/assets/iconfont/iconfont.css'

import '@/init/useElementUI'
import '@/init/useComponents'
import '@/init/usePermission'
import '@/init/useFilters'
import '@/init/useSvgIcon'

import '@/styles/index.scss'
import App from './App'
import i18n from './lang'
import store from './store'
import router from './routers'

// 附件URL
Vue.prototype.$ATT = process.env.VUE_APP_ATT_URL
Vue.config.productionTip = false

window.vm = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
