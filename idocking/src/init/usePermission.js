/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-10-08 15:18:23
 * @LastEditTime: 2019-11-21 19:52:01
 */
import i18n from '@/lang'
import router from '../routers'
import store from '../store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/auth-redirect']

router.beforeEach(async(to, from, next) => {

  NProgress.start()
  document.title = getPageTitle(to.meta)
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0

      if (hasRoles) {
        next()
      } else {
        try {
          await store.dispatch('user/getUserInfo')
          let userRole = store.state.user.userInfo.role

          await store.commit('user/SET_ROLES', [userRole])
          const accessRoutes = await store.dispatch('permission/generateRoutes', [userRole])

          router.addRoutes(accessRoutes)
          // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
