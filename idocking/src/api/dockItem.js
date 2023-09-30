/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-31 10:12:50
 * @LastEditTime: 2019-10-31 12:50:14
 */

import request from '@/utils/request'

// 获取第一级
export function getTreeLevel1(params) {
  return request.get('/standardTree/listLevel1Category', { params })
}

// 获取第二级
export function getTreeLevel2(params) {
  return request.get('/standardTree/listLevel2Category', { params })
}

// 获取第三级
export function getTreeLevel3(params) {
  return request.get('/standardTree/listStandardItem', { params })
}

// 获取第三级
export function getTreeLevel4(params) {
  return request.get('/standardTree/listStandardDetailedItem', { params })
}
