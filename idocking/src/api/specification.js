/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:50
 * @LastEditTime: 2020-03-09 12:55:42
 */

import request from '@/utils/request'

// 获取规格书列表
export function getSpecificationList(params) {
  return request.get('/specification/page', { params })
}

export function getSpecListAll(params) {
  return request.get('/standardTree/listAll', { params })
}

// 添加规格书
export function addSpecification(params) {
  return request.post('/specification/create', params)
}

// 规格书详情
export function getSpecificationInfo(id) {
  return request.get(`/specification/${id}`)
}

// 规格书详情坞修区域tree数据接口
export function getSpecTreeData(specificationId) {
  return request.get('/specificationItem/bySpecification', { params: { specificationId }})
}

// 规增加规格书坞修项目
export function addSpecificationItem(params) {
  return request.post(`/specificationItem/add`, params)
}

// 规增加规格书坞修项目(批量)
export function addSpecificationItems(params) {
  return request.post(`/specificationItem/createWithBatch`, params)
}

// 规格书坞修项顺序调换
export function exchangeDockItemOrder(params) {
  return request({
    method: 'PUT',
    url: '/specificationItem/exchangeOrder',
    params
  })
}

// 规格书坞修项删除
export function delSpecificationItem(id) {
  return request.put(`/specificationItem/${id}/lock`)
}

// 规格书坞修项详情
export function getDockItemInfo(id) {
  return request.get(`/specificationItem/${id}`)
}

// 获取坞修细节项列表
export function getSpecDockItemDetailList(specificationItemId) {
  return request.get(`/specificationDetailedItem/bySpecificationItem`, { params: { specificationItemId }})
}

// 删除坞修细节项
export function delSpecDockDetailItem(id) {
  return request({
    method: 'PUT',
    url: '/specificationDetailedItem/lock',
    params: { id }
  })
}

// 规格书坞修细节项顺序调换
export function exchangeDockDetailItemOrder(params) {
  return request({
    method: 'PUT',
    url: '/specificationDetailedItem/exchangeOrder',
    params
  })
}

// 获取标准分类体系所有数据，用于input过滤
export function getStandardTreeAll(versionId) {
  return request.get('/standardTree/listAll', { params: { versionId }})
}

// 添加坞修细节项
export function addDockDetailItem(params) {
  return request.post('/specificationDetailedItem/create', params)
}

// 添加坞修细节项(批量)
export function addDockDetailItems(params) {
  return request.post('/specificationDetailedItem/createWithBatch', params)
}

// 获取坞修细节项信息
export function getDockDetailItemInfo(id) {
  return request.get(`/specificationDetailedItem/${id}`)
}

// 更新坞修细节项信息
export function updateDockDetailItemInfo(params) {
  return request.put(`/specificationDetailedItem/modify`, params)
}

// 更新坞修项信息(level 3)
export function updateDockItemInfo(params) {
  return request.put(`/specificationItem/modify`, params)
}

// 获取坞修项操作符(level 3)
export function getDockItemOperations(id) {
  return request.get(`/specificationItem/availableOperations`, { params: { id }})
}

// 【提交】坞修项
export function submitDockItem(id) {
  return request({
    method: 'PUT',
    url: '/specificationItem/submit',
    params: { id }
  })
}

// 【同意】坞修项
export function approveDockItem(id, comment) {
  return request({
    method: 'PUT',
    url: '/specificationItem/approve',
    params: { id, comment }
  })
}

// 【拒绝】坞修项
export function rejectDockItem(id, comment) {
  return request({
    method: 'PUT',
    url: '/specificationItem/reject',
    params: { id, comment }
  })
}

// 【重新编辑】坞修项  重新编辑已通过的坞修项,这一步只是将Approved状态变为drafting,然后可以通过update更新
export function reEditDockItem(id) {
  return request({
    method: 'PUT',
    url: '/specificationItem/reedit',
    params: { id }
  })
}

// 【删除】坞修项
export function delDockItem(id) {
  return request({
    method: 'PUT',
    url: '/specificationItem/lock',
    params: { id }
  })
}

// 【删除】坞修项
export function getDockItemFlowData(id) {
  return request.get(`/specificationItem/approvalFlows`, { params: { id }})
}

// 【删除】坞修项
export function getStandardTreeInfo(id) {
  return request.get(`/standardTree/info`, { params: { id }})
}

// 询比价中，根据询价单获取对应的规格书
export function getReferSpecInfo(id) {
  return request.get(`/specification/brief`, { params: { id }})
}

export function getWorkListAll() {
  return request.get('/specificationItem/includingWork/list')
}

export function getCheckOptionsAll() {
  return request.get('/specificationItem/verificationParty/list')
}
