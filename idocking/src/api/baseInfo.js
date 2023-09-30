/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:50
 * @LastEditTime: 2019-10-21 15:56:26
 */
import request from '@/utils/request'

export function getVesselPageList(params) {
  return request.get('/vessel/page', { params })
}

export function shipInfoAdd(params) {
  return request.post('/vessel/create', params)
}

// 获取船籍社选项列表
export function getClassificationSocietyList() {
  return request.get('/classificationSociety/list')
}

// 船舶信息详情接口
export function getVesselInfo(id) {
  return request.get(`/vessel/${id}`)
}

// 船舶信息的更新接口
export function shipInfoUpdata(id, params) {
  return request.put(`/vessel/modify`, params)
}

// 船舶信息的更新接口
export function shipInfoDelete(id) {
  return request({
    method: 'PUT',
    url: '/vessel/lock',
    params: { id }
  })
}
