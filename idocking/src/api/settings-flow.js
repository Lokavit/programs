/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-06 09:47:37
 * @LastEditTime: 2020-03-09 12:54:10
 */

import request from '@/utils/request'

// 获取列表
export function getFlowsList() {
  return request.get('/approvalFlow/list')
}

// 更新流程定义
export function updateApprovalFlow(params) {
  return request.put(`/approvalFlow/modify`, params)
}
