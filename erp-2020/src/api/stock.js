/**
 * 库存相关的接口封装
 */
import {
  HTTP
} from './http';


/**
 * 获取物料主数据列表
 * @param {*} params 
 */
export function getMaterial(params) {
  return HTTP({
    url: '/materials',
    method: 'get',
    params
  })
}

/**
 * 根据传入的 itemCode ,获取该编码对应数据详细信息
 * @param {*} code 
 */
export function getMaterialInfo(code) {
  return HTTP({
    url: `/materials/${code}`,
    method: 'get',
  })
}

/**
 * 物料主数据表单 新增
 * @param {*} data  
 */
export function postMaterial(data) {
  return HTTP({
    url: '/materials',
    method: 'post',
    data
  })
}

/**
 * 物料主数据表单 更新
 * @param {*} data 
 */
export function putMaterial(data) {
  return HTTP({
    url: '/materials',
    method: 'put',
    data
  })
}

// /**
//  * 获取 物料主数据下  物料管理方式
//  */
// export function getMTOptions() {
//   return HTTP({
//     url: '/materials/managementTypes',
//     method: 'get',
//   })
// }

// /**
//  * =======================================
//  * 获取物料组列表数据
//  * @param {*} params 
//  */
// export function getMaterialGroup(params) {
//   return HTTP({
//     url: '/materialGroups',
//     method: 'get',
//     params
//   })
// }

// /**
//  * 获取指定物料组编码的物料组数据
//  * @param {*} code 
//  */
// export function getMaterialGroupInfo(code) {
//   return HTTP({
//     url: `/materialGroups/${code}`,
//     method: 'get',
//   })
// }

// /**
//  * 物料组表单 新增
//  * @param {*} data  
//  */
// export function postMaterialGroup(data) {
//   return HTTP({
//     url: '/materialGroups',
//     method: 'post',
//     data
//   })
// }

// /**
//  * 物料组表单 更新
//  * @param {*} data 
//  */
// export function putMaterialGroup(data) {
//   return HTTP({
//     url: '/materialGroups',
//     method: 'put',
//     data
//   })
// }

// /**
//  * 获取仓库列表数据
//  * @param {*} params 
//  */
// export function getWarehouse(params) {
//   return HTTP({
//     url: '/warehouses',
//     method: 'get',
//     params
//   })
// }

// /**
//  * 根据传入的仓库编码获取该仓库数据
//  * @param {String} code 传入的仓库编码 
//  */
// export function getWarehouseInfo(code) {
//   return HTTP({
//     url: `/warehouses/${code}`,
//     method: 'get',
//   })
// }

// /**
//  * 仓库表单 新增
//  * @param {*} data  
//  */
// export function postWarehouse(data) {
//   return HTTP({
//     url: '/warehouses',
//     method: 'post',
//     data
//   })
// }

// /**
//  * 仓库表单 更新
//  * @param {*} data 
//  */
// export function putWarehouse(data) {
//   return HTTP({
//     url: '/warehouses',
//     method: 'put',
//     data
//   })
// }


// /**
//  * 获取计量单位列表
//  * @param {*} params 
//  */
// export function getUOM(params) {
//   return HTTP({
//     url: '/uoms',
//     method: 'get',
//     params
//   })
// }

// /**
//  * 根据传入的计量单位编码，获取该计量单位详情
//  * @param {*} code 
//  */
// export function getUOMInfo(code) {
//   return HTTP({
//     url: `/uoms/${code}`,
//     method: 'get',
//   })
// }

// /**
//  * 计量单位表单 新增
//  * @param {*} data  
//  */
// export function postUOM(data) {
//   return HTTP({
//     url: '/uoms',
//     method: 'post',
//     data
//   })
// }

// /**
//  * 计量单位表单 更新
//  * @param {*} data 
//  */
// export function putUOM(data) {
//   return HTTP({
//     url: '/uoms',
//     method: 'put',
//     data
//   })
// }

/**
 * 获取体积单位
 */
export function getVolumnUnits() {
  return HTTP({
    url: '/uoms/volumnUnits',
    method: 'get',
  })
}

/**
 * =========================================
 * 获取物料批次列表
 * @param {*} params 
 */
export function getMaterialBatch(params) {
  return HTTP({
    url: '/materialBatches',
    method: 'get',
    params
  })
}

/**
 * 根据物料批次号，获取该批次详情
 * @param {*} code 
 */
export function getMaterialBatchInfo(code) {
  return HTTP({
    url: `/materialBatches/${code}`,
    method: 'get',
  })
}
/**
 * 物料批次表单 新增
 * @param {*} data  
 */
export function postMaterialBatch(data) {
  return HTTP({
    url: '/materialBatches',
    method: 'post',
    data
  })
}

/**
 * 物料批次表单 更新
 * @param {*} data 
 */
export function putMaterialBatch(data) {
  return HTTP({
    url: '/materialBatches',
    method: 'put',
    data
  })
}

/**
 * 库存发货单
 * @param {*} params 
 */
export function getGoodsIssue(params) {
  return HTTP({
    url: '/goodsIssues?sort=createTime,desc',
    method: 'get',
    params
  })
}

/**
 * 库存发货单 详情
 * @param {*} code 
 */
export function getGoodsIssueInfo(code) {
  return HTTP({
    url: `/goodsIssues/${code}`,
    method: 'get',
  })
}
/**
 * 库存发货单表单 新增
 * @param {*} data  
 */
export function postGoodsIssue(data) {
  return HTTP({
    url: '/goodsIssues',
    method: 'post',
    data
  })
}

/**
 * 库存收货单
 * @param {*} params 
 */
export function getGoodsReceipt(params) {
  return HTTP({
    url: '/goodsReceipts?sort=createTime,desc',
    method: 'get',
    params
  })
}

/**
 * 库存收货单 详情
 * @param {*} code 
 */
export function getGoodsReceiptInfo(code) {
  return HTTP({
    url: `/goodsReceipts/${code}`,
    method: 'get',
  })
}
/**
 * 库存收货单表单 新增
 * @param {*} data  
 */
export function postGoodsReceipt(data) {
  return HTTP({
    url: '/goodsReceipts',
    method: 'post',
    data
  })
}

/**
 * 库存转储单
 * @param {*} params 
 */
export function getGoodsTransfer(params) {
  return HTTP({
    url: '/goodsTransfer?sort=createTime,desc',
    method: 'get',
    params
  })
}

/**
 * 库存转储单 详情
 * @param {*} code 
 */
export function getGoodsTransferInfo(code) {
  return HTTP({
    url: `/goodsTransfer/${code}`,
    method: 'get',
  })
}
/**
 * 库存转储单表单 新增
 * @param {*} data  
 */
export function postGoodsTransfer(data) {
  return HTTP({
    url: '/goodsTransfer',
    method: 'post',
    data
  })
}

/**
 * 根据传入的物料编码，请求仓库物料报表
 * @param {*} params 物料编码 
 */
export function getReportMaterial(params) {
  return HTTP({
    url: '/reports/inventories',
    method: 'get',
    params
  })
}

/**
 * 根据传入的物料编码及仓库编码，获取该物料的仓库批次报表
 * @param {*} params 传入 [itemCode] [whsCode]
 */
export function getReportInventoriesBath(params) {
  return HTTP({
    url: '/reports/inventories/batch',
    method: 'get',
    params
  })
}

/**
 * 库存过账记录 清单
 * @param {*} params 
 */
export function getReportJournal(params) {
  return HTTP({
    url: '/reports/journals',
    method: 'get',
    params
  })
}

/**
 * 批次交易报表
 * @param {*} params 
 */
export function getReportBatch(params) {
  return HTTP({
    url: '/reports/journals/batch',
    method: 'get',
    params,
  })
}