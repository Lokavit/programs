/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:50
 * @LastEditTime: 2019-12-10 17:11:23
 */
import { login, logout, getUserInfo, getNoticeCount } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import settings from '@/settings'
import router, { resetRouter } from '@/routers'
import { Message } from 'element-ui'

const state = {
  token: getToken(),
  userInfo:{name: 'border-1px'},
  noticeCount: 10,
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_NOTICE_COUNT: (state, noticeCount) => {
    state.noticeCount = noticeCount
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.access_token)
        setToken(data.access_token)

        Message({showClose: true,message: '登录成功',type: 'success'})
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        // const { roles } = data

        // roles must be a non-empty array
        // if (!roles || roles.length <= 0) {
        //   reject('getUserInfo: roles must be a non-null array!')
        // }
        // commit('SET_ROLES', roles)
        
        commit('SET_USERINFO', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      clearInterval(window.TimerGetNoticeCount)
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_USERINFO', {})

      // 注销登陆后，删除语言文件，便于登陆时候重新获取最新数据
      localStorage.removeItem('en')
      localStorage.removeItem('zh')
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('user/getUserInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  getNoticeCount({ commit }) { // 获取通知条数
    return new Promise((resolve, reject) => {
      getNoticeCount().then(res=> {
        commit('SET_NOTICE_COUNT', res.data)
        resolve(res.data)
      }).catch(err=>{
        reject(err)
      })
    })
  },

  getNoticeCountTimer( { commit, dispatch } ) {
    window.TimerGetNoticeCount = setInterval(() => {
      dispatch('getNoticeCount')
    }, settings.noticeTimer)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
