/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:50
 * @LastEditTime: 2020-03-09 12:53:38
 */

import request from '@/utils/request'

// 获取项目列表
export function getProjectList(params) {
  return request.get('/project/page', { params })
}

// 添加项目
export function addProject(params) {
  return request.post('/project/create', params)
}

// 获取项目信息
export function getProjectInfo(id) {
  return request.get(`/project/${id}`)
}

// 更新项目信息
export function updateProjectInfo(params) {
  return request.put(`/project/modify`, params)
}

// 删除项目
export function delProject(id) {
  return request({
    method: 'PUT',
    url: '/project/lock',
    params: { id }
  })
}

// 查看项目审批流
export function getApprovalFlows(projectId) {
  return request.get(`/project/approvalFlows`, {
    params: {
      projectId
    }
  })
}

// 获取按钮权限列表
export function getOperation(id) {
  return request.get(`/project/availableOperations`, {
    params: {
      id
    }
  })
}

// 提交项目审批
export function submitProject(id) {
  return request({
    method: 'PUT',
    url: '/project/submit',
    params: { id }
  })
}

// 同意项目审批
export function approveProjet(id, comment) {
  return request({
    method: 'PUT',
    url: '/project/approve',
    params: { id, comment }
  })
}

// 拒绝项目审批
export function rejectProjet(id, comment) {
  return request({
    method: 'PUT',
    url: '/project/reject',
    params: { id, comment }
  })
}

// 删除项目
export function delProjet(id) {
  return request({
    method: 'PUT',
    url: '/project/lock',
    params: { id }
  })
}
