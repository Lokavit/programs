/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:50
 * @LastEditTime: 2019-10-17 09:51:48
 */

import request from '@/utils/request'

// 获取船级社列表
export function getSocietyList() {
  return request.get('/classificationSociety/list')
}

// 增加船级社
export function addSociety(params) {
  return request.post('/classificationSociety/create', params)
}

// 增加船级社
export function delSociety(id) {
  return request.delete(`/classificationSociety/${id}/delete`)
}

// 更新船级社信息
export function updateSociety(params) {
  return request.put(`/classificationSociety/modify`, params)
}

// 获取指定船级社信息
export function getSocietyInfo(id) {
  return request.get(`/classificationSociety/${id}`)
}
