/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:50
 * @LastEditTime: 2019-10-21 09:42:48
 */

import request from '@/utils/request'

// 获取船东列表
export function getCarrierList() {
  return request.get('/shipOwner/list')
}

// 更新船东信息
export function updateCarrier(params) {
  return request.put(`/shipOwner/modify`, params)
}

// 删除船东信息
export function delCarrier(id) {
  return request({
    method: 'PUT',
    url: '/shipOwner/lock',
    params: { id }
  })
}

// 添加船东信息
export function addCarrier(params) {
  return request.post('/shipOwner/create', params)
}

// 获取船东信息
export function getCarrierInfo(id) {
  return request.get(`/shipOwner/${id}`)
}