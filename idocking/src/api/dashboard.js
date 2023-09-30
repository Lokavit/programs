/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-05 10:05:41
 * @LastEditTime: 2020-03-09 12:53:29
 */

import request from '@/utils/request'
import qs from 'qs'

// 获取通知列表
export function getNotices(params) {
  return request.get('/notification/sentToMe/page', { params })
}

// 获取通知详情
export function getNoticeInfo(id) {
  return request.get(`/notification/${id}`)
}

// 通知，标记为未读
export function markNoticeAsUnRead(ids) {
  const params = qs.stringify({ notificationIds: ids }, { arrayFormat: 'repeat' })
  return request({
    method: 'PUT',
    url: `/notification/markAsUnread/?${params}`
  })
}
// 通知，标记为已读
export function markNoticeAsReaded(ids) {
  const params = qs.stringify({ notificationIds: ids }, { arrayFormat: 'repeat' })
  return request({
    method: 'PUT',
    url: `/notification/markAsRead/?${params}`
  })
}

// 查询待当前用户审批的审批流
export function getApprovalFlowAboutMe(params) {
  return request.get('/approvalFlow/instance/waitingForMe', { params })
}
