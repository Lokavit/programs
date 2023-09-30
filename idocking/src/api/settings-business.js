/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-06 09:47:37
 * @LastEditTime: 2019-12-11 09:59:56
 */

import request from '@/utils/request'

// 更新商务条款
export function updateBusinessInfo(params) {
  return request.put('/managementCompany/commerceClause/modify', params)
}

// 获取商务条款
export function getBusinessInfo() {
  return request.get('/managementCompany/commerceClause')
}