/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-11 14:16:59
 * @LastEditTime: 2020-03-09 12:56:04
 */

import request from '@/utils/request'

// 查看船舶成员
export function getVesselMember(vesselId) {
  return request.get(`/vessel/members?vesselId=${vesselId}`)
}

// 查看可分配人员名单
export function getMemberListForAllot(role) {
  return request.get(`/vessel/member/candidates?role=${role}`)
}

// 分船
export function allotVesselMember(params) {
  // return request.put(`/vessel/assign`, params)  // body
  return request({
    method: 'PUT',
    url: '/vessel/assign',
    params: { ...params }
  })
}

export function withdrawVesselMember(params) {
  return request({
    method: 'PUT',
    url: '/vessel/withdraw',
    params: { ...params }
  })
}
