/*
 * @Descripttion:
 * @Author: border-1px
 * @Date: 2019-10-08 15:22:51
 * @LastEditTime: 2019-10-10 11:17:28
 */
import { asyncRoutes, constantRoutes } from '@/routers'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterasyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterasyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

// function filterasyncRoutes(routes, roles) {
//   return routes.filter(route => {
//     if(route.children && route.children.length) {
//       route.children = filterasyncRoutes(route.children, roles)
//     }
    
//     return hasPermission(roles, route)
//   })
// }

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {

    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterasyncRoutes(asyncRoutes, roles)
      }

      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
