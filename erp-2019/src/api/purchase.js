/**
 * purchase 采购模块 API
 */
import {
    HTTP
} from './http';


/**
 * 获取供应商列表
 * @param {*} params
 */
export function getVendor(params) {
    return HTTP({
        url: '/vendors',
        method: 'get',
        params
    })
}

/**
 * 根据指定的供应商编码，获取该供应商信息
 * @param {*} code 
 */
export function getVendorInfo(code) {
    return HTTP({
        url: `/vendors/${code}`,
        method: 'get',
    })
}

/**
 * 供应商表单 新增
 * @param {*} data  
 */
export function postVendor(data) {
    return HTTP({
        url: '/vendors',
        method: 'post',
        data
    })
}

/**
 * 供应商表单 更新
 * @param {*} data 
 */
export function putVendor(data) {
    return HTTP({
        url: '/vendors',
        method: 'put',
        data
    })
}

/**
 * 获取采购申请单列表数据集
 * @param {*} params 
 */
export function getPurchaseOrderRequest(params) {
    return HTTP({
        url: '/purchaseOrderRequests?sort=docEntry,desc',
        method: 'get',
        params
    })
}

/**
 * 获取指定单据号的采购申请单详情
 * @param {*} code 指定单据号
 */
export function getPurchaseOrderRequestInfo(code) {
    return HTTP({
        url: `/purchaseOrderRequests/${code}`,
        method: 'get',
    })
}

/**
 * 采购申请单 新增
 * @param {*} data  
 */
export function postPurchaseOrderRequest(data) {
    return HTTP({
        url: '/purchaseOrderRequests',
        method: 'post',
        data
    })
}
/**
 * 采购申请单 更新
 * @param {*} data 
 */
export function putPurchaseOrderRequest(data) {
    return HTTP({
        url: '/purchaseOrderRequests',
        method: 'put',
        data
    })
}


/**
 * 获取采购订单列表数据集
 * @param {*} params 
 */
export function getPurchaseOrder(params) {
    return HTTP({
        url: '/purchaseOrders?sort=docEntry,desc',
        method: 'get',
        params
    })
}

/**
 * 获取指定单据号的采购订单详情
 * @param {*} code 指定单据号
 */
export function getPurchaseOrderInfo(code) {
    return HTTP({
        url: `/purchaseOrders/${code}`,
        method: 'get',
    })
}

/**
 * 采购订单 新增
 * @param {*} data  
 */
export function postPurchaseOrder(data) {
    return HTTP({
        url: '/purchaseOrders',
        method: 'post',
        data
    })
}
/**
 * 采购订单 更新
 * @param {*} data 
 */
export function putPurchaseOrder(data) {
    return HTTP({
        url: '/purchaseOrders',
        method: 'put',
        data
    })
}





/**
 * 获取采购收货单列表数据集
 * @param {*} params 
 */
export function getPurchaseDelivery(params) {
    return HTTP({
        url: '/purchaseDeliveries?sort=docEntry,desc',
        method: 'get',
        params
    })
}

/**
 * 获取指定单据号的采购收货单详情
 * @param {*} code 指定单据号
 */
export function getPurchaseDeliveryInfo(code) {
    return HTTP({
        url: `/purchaseDeliveries/${code}`,
        method: 'get',
    })
}

/**
 * 采购收货单 新增
 * @param {*} data  
 */
export function postPurchaseDelivery(data) {
    return HTTP({
        url: '/purchaseDeliveries',
        method: 'post',
        data
    })
}
/**
 * 采购收货单 更新
 * @param {*} data 
 */
export function putPurchaseDelivery(data) {
    return HTTP({
        url: '/purchaseDeliveries',
        method: 'put',
        data
    })
}

/**
 * 获取采购退货单列表数据集
 * @param {*} params 
 */
export function getPurchaseReturns(params) {
    return HTTP({
        url: '/purchaseReturns?sort=docEntry,desc',
        method: 'get',
        params
    })
}

/**
 * 获取指定单据号的采购退货单详情
 * @param {*} code 指定单据号
 */
export function getPurchaseReturnsInfo(code) {
    return HTTP({
        url: `/purchaseReturns/${code}`,
        method: 'get',
    })
}

/**
 * 采购退货单 新增
 * @param {*} data  
 */
export function postPurchaseReturns(data) {
    return HTTP({
        url: '/purchaseReturns',
        method: 'post',
        data
    })
}
/**
 * 采购退货单 更新
 * @param {*} data 
 */
export function putPurchaseReturns(data) {
    return HTTP({
        url: '/purchaseReturns',
        method: 'put',
        data
    })
}

/**
 * 获取 未清状态的采购申请单
 */
export function getPurchaseOrderRequestGuide() {
    return HTTP({
        url: '/guide/purchaseOrders/purchaseOrderRequests',
        method: 'get',
    })
}

/**
 * 获取 未清状态的采购订单
 */
export function getPurchaseOrderGuide() {
    return HTTP({
        url: '/guide/purchaseDeliveries/purchaseOrders',
        method: 'get',
    })
}

/**
 * 获取 未清状态的采购申请单
 */
export function getPurchaseDeliveryGuide() {
    return HTTP({
        url: '/guide/purchaseReturns/purchaseDeliveries',
        method: 'get',
    })
}