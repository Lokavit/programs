/**
 * common 通用接口
 */
import {
  HTTP
} from './http';

/**
 * 根据传入请求体，获取chooseList对应数据
 * @param {*} params [code]类型 
 */
export function getChooseList(params) {
  return HTTP({
    url: '/chooseLists',
    method: 'get',
    params
  })
}

/**
 * 根据传入的请求体，获取该详情详细信息
 * @param {*} params [code]类型,[key]必填
 */
export function getDetails(params) {
  return HTTP({
    url: '/details',
    method: 'get',
    params
  })
}

/**
 * 数据字典维护模块 获取 数据字典数据
 * @param {*} params parentEntry[父级节点ID]
 */
export function getSystemCommoncodes(params) {
  return HTTP({
    url: '/system/commoncodes',
    method: 'get',
    params,
  })
}

/**
 * 数据字典维护模块 新增 数据字典数据
 * @param {*} data 
 */
export function postSystemCommoncodes(data) {
  return HTTP({
    url: '/system/commoncodes',
    method: 'post',
    data
  })
}

/**
 * 数据字典维护模块 修改 数据字典数据
 * @param {*} data 
 */
export function putSystemCommoncodes(data) {
  return HTTP({
    url: '/system/commoncodes',
    method: 'put',
    data
  })
}


/**
 * 数据字典维护模块 查看 数据字典 单条数据
 * @param {*} code 传入 单条数据的ID
 */
export function getSystemCommoncodesInfo(code) {
  return HTTP({
    url: `/system/commoncodes/${code}`,
    method: 'get'
  })
}


/**
 * 数据字典维护模块 删除 数据字典数据 单条数据
 * @param {*} code 传入 单条数据的ID
 */
export function deleteSystemCommoncodes(code) {
  return HTTP({
    url: `/system/commoncodes/${code}`,
    method: 'delete',
  })
}

/**
 * 带选列表
 * @param {*} params 
 */
export function getSelectLists(params) {
  return HTTP({
    url: '/selectLists',
    method: 'get',
    params
  })
}