/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:50
 * @LastEditTime: 2019-10-11 14:49:03
 */
import Cookies from 'js-cookie'
import { updateLangData } from '@/api/app'
import i18n from '@/lang'
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop'
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  updateLangData({ commit }, lang) {
    // 从Cookie中取要获取的语言类型
    var curLang = lang || Cookies.get('language')

    return new Promise((resolve, reject) => {

      // 本地存在语言文件，直接返回
      var localLangData = localStorage.getItem(curLang)
      if (localLangData) {
        resolve(JSON.parse(localLangData))
      } else {
        // 本地不存在语言包，异步获取
        updateLangData(curLang).then(response => {
          const { data } = response

          // 这里需要判断下，如果服务器没返回数据，则不进行下列赋值操作(用本地文件)

          localStorage.setItem(curLang, JSON.stringify(data))
          i18n.mergeLocaleMessage(curLang, Object.assign(data))
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      }
      
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
