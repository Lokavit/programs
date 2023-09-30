/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:50
 * @LastEditTime: 2019-10-23 09:08:13
 */

import request from '@/utils/request'

// 获取船舶证书列表
export function getCertList(params) {
  return request.get('/vessel/certificates/page', { params })
}

// 添加船舶证书
export function addShipCert(params) {
  return request.post('/vessel/certificates/create', params)
}

// 更新船舶证书信息
export function updateShipCert(params) {
  return request.put(`/vessel/certificates/modify`, params)
}

// 删除船舶证书
export function delShipCert(id) {
  return request.delete(`/vessel/certificates/${id}/delete`)
}

// 获取船舶证书信息
export function getCertInfo(id) {
  return request.get(`/vessel/certificates/${id}`)
}
