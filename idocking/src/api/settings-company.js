/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-06 09:47:37
 * @LastEditTime: 2019-12-11 09:59:56
 */

import request from '@/utils/request'

// 获取公司信息
export function getCompanyInfo() {
  return request.get('/managementCompany/mine')
}

// 更新公司信息
export function updateCompanyInfo(params) {
  return request.put('/managementCompany/modify', params)
}

export function getRegion(parentId) {
  return request.get('/region/byParent', { params: { parentId }})
}
