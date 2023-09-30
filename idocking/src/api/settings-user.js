/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-06 09:47:37
 * @LastEditTime: 2020-03-09 12:54:24
 */

import request from '@/utils/request'

// 获取用户列表
export function getUserList(params) {
  return request.get('/user/page', { params })
}

// 检测登陆用户名是否唯一
export function checkLoginNameUnique(loginName) {
  return request.get('/user/loginNameTaken', { params: { loginName }})
}

// 获取船舶管理公司职位列表
export function getJobList() {
  return request.get('/job/managementCompany/list')
}

// 添加用户
export function addNewUser(loginName, userData) {
  return request.post(`/user/add?loginName=${loginName}`, userData)
}

// 获取用户信息
export function getUserInfo(userId) {
  return request.get(`/user/${userId}`)
}

// 更新用户信息
export function updateUserInfo(userData) {
  return request.put('/user/update', userData)
}

// 更改用户密码
export function changeMyPassword(userData) {
  return request({
    method: 'PUT',
    url: '/user/updateMyPassword',
    params: { ...userData }
  })
}

// 管理员更改用户密码
export function changePassword(userData) {
  return request({
    method: 'PUT',
    url: '/user/updatePassword',
    params: { ...userData }
  })
}

// 禁用用户
export function disableUser(userId) {
  return request({
    method: 'PUT',
    url: '/user/disable',
    params: { userId }
  })
}

// 使能用户
export function enableUser(userId) {
  return request({
    method: 'PUT',
    url: '/user/enable',
    params: { userId }
  })
}
