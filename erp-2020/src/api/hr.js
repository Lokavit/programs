/**
 * HumanResource 人力资源模块 API
 */
import {HTTP} from './http';

/** 获取员工主数据列表 */
export function getEmployees(params) {
    return HTTP({
        url: '/employees',
        method: 'get',
        params
    })
}

/**
 * 根据指定员工编码，获取该员工详细信息
 * @param {*} code 员工编码 
 */
export function getEmployeesInfo(code) {
    return HTTP({
        url: `/employees/${code}`,
        method: 'get'
    })
}


/** 新增员工主数据 */
export function postEmployees(data) {
    return HTTP({
        url: '/employees',
        method: 'post',
        data
    })
}