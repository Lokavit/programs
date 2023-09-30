/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:50
 * @LastEditTime: 2020-03-09 12:55:53
 */
import qs from 'qs'
import request from '@/utils/request'
import requestLogin from '@/utils/requestLogin'

// 登陆比较特殊，表单提交+独立验证
export function login(params) {
  return requestLogin.post('/oauth/token', qs.stringify(params))
}

// 未启用
export function logout() {
  return request.post('/user/logout')
}

export function getUserInfo() {
  return request.get('/user/me')
}

export function getNoticeCount() {
  return request.get('/notification/unread/count')
}

export function getAssignableRoles() {
  return request.get('/roles/assignable')
}
