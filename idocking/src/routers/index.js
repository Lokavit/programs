/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:50
 * @LastEditTime: 2019-10-11 13:37:47
 */
import Vue from 'vue'
import Router from 'vue-router'
import DashboardRouter from './modules/dashboard'
import ManagementRouter from './modules/management'
import DockRepairRouter from './modules/dockrepair'

Vue.use(Router)

export const constantRoutes = [
  
  {
    path: '/',
    redirect: '/dashboard',
    hidden: true
  },

  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/test',
    component: () => import('@/views/test'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
  
]

const createRouter = () => new Router({
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router

export const asyncRoutes = [
  DashboardRouter,
  DockRepairRouter,
  ManagementRouter,
  { path: "*", redirect: "/dashboard", hidden: true }
]