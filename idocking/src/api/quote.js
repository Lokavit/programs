/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:50
 * @LastEditTime: 2020-03-09 12:54:02
 */
import request from '@/utils/request'

// 获取询价列表
export function getQuoteList(params) {
  return request.get('/quotation/page', { params })
}

// 增加询价单
export function addQuotation(params) {
  return request.post(`/quotation/create`, params)
}

// 获取坞修列表
export function getSpecBriefTree(id) {
  return request.get(`/specification/brief`, { params: { id } })
}

// 获取报价单详情
export function getQuotationTree(id) {
  return request.get(`/quotation/${id}`)
}

// 获取报价单详情
export function getQuotationInfo(id) {
  return request.get(`/quotation/${id}`)
}

// 获取可操作权限
export function getOperations(id) {
  return request.get(`/quotation/availableOperations`, { params: { id } })
}

// 提交项目审批
export function submitQuotation(id, comment) {
  return request({
    method: 'PUT',
    url: '/quotation/submit',
    params: { id, comment }
  })
}

// 提交项目审批
export function acceptQuotation(id) {
  return request({
    method: 'PUT',
    url: '/quotation/accept',
    params: { id }
  })
}

// 同意项目审批
export function approveQuotation(id, comment) {
  return request({
    method: 'PUT',
    url: '/quotation/approve',
    params: { id, comment }
  })
}

// 拒绝项目审批
export function rejectQuotation(id, comment) {
  return request({
    method: 'PUT',
    url: '/quotation/reject',
    params: { id, comment }
  })
}

// 删除项目
export function delQuotation(id) {
  return request({
    method: 'PUT',
    url: `/quotation/lock`,
    params: { id }
  })
}

// 导入询价单
export function importQuotation(id, fileId) {
  return request({
    method: 'PUT',
    url: '/quotation/importExcel',
    params: { id, fileId }
  })
}

// 获取审批流数据
export function getApprovalFlows(id) {
  return request.get(`/quotation/approvalFlow`, { params: { id } })
}

// 生成PDF请求
export function computePDF(id) {
  return request.post(`/quotation/computePdf?id=${id}` )
}

// 获取PDF文件的fileId
export function fetchPDFId(id) {
  return request.get(`/quotation/fetchPdf`, { params: { id } })
}
