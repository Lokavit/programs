/**
 * manufacture 生产模块 API
 */
import {
    HTTP
} from './http';

/** 获取项目主数据列表 */
export function getProjects(params) {
    return HTTP({
        url: '/projects',
        method: 'get',
        params
    })
}
/** 根据指定的查询条件,获取该项目主数据的详细信息 */
export function getProjectInfo(code) {
    return HTTP({
        url: `/projects/${code}`,
        method: 'get',
    })
}
/** 项目主数据 新增 */
export function postProject(data) {
    return HTTP({
        url: '/projects',
        method: 'post',
        data
    })
}
/** 项目主数据 更新 */
export function putProject(data) {
    return HTTP({
        url: '/projects',
        method: 'put',
        data
    })
}
/** 导入项目登记 Excel文件 (data 该内容为 formData内容) */
export function postProjectImport(data) {
    return HTTP({
        url: '/projects/import',
        method: 'post',
        data
    })
}
/** 项目登记 下载 */
export function getProjectDownload() {
    return HTTP({
        url: '/projects/download',
        method: 'get',
        responseType: 'blob', //定义
    })
}


/** 分段主数据 获取列表数据集 */
export function getBlocks(params) {
    return HTTP({
        url: '/blocks',
        method: 'get',
        params
    })
}
/** 分段主数据 获取指定数据的详细信息 传入项目编码及编码 */
export function getBlockInfo(projectEntry, entry) {
    return HTTP({
        url: `/blocks/${projectEntry}/${entry}`,
        method: 'get',
    })
}
/** 分段主数据 新增 */
export function postBlock(data) {
    return HTTP({
        url: '/blocks',
        method: 'post',
        data
    })
}
/** 分段主数据 更新 */
export function putBlock(data) {
    return HTTP({
        url: '/blocks',
        method: 'put',
        data
    })
}
/* 导入分段登记 Excel文件 (data 该内容为 formData内容) */
export function postBlockImport(data) {
    return HTTP({
        url: '/blocks/import',
        method: 'post',
        data
    })
}

/** 获取 区域主数据 列表数据集 */
export function getZones(params) {
    return HTTP({
        url: '/zones',
        method: 'get',
        params
    })
}
/** 区域主数据 获取单条数据详细信息 传入项目编码及编码 */
export function getZoneInfo(projectEntry, entry) {
    return HTTP({
        url: `/zones/${projectEntry}/${entry}`,
        method: 'get',
    })
}
/** 区域主数据 新增 */
export function postZone(data) {
    return HTTP({
        url: '/zones',
        method: 'post',
        data
    })
}
/** 区域主数据 更新 */
export function putZone(data) {
    return HTTP({
        url: '/zones',
        method: 'put',
        data
    })
}
/* 导入区域登记 Excel文件 (data 该内容为 formData内容) */
export function postZoneImport(data) {
    return HTTP({
        url: '/zones/import',
        method: 'post',
        data
    })
}

/** 获取 中日程列表数据集 */
export function getActivities(params) {
    return HTTP({
        url: '/activities',
        method: 'get',
        params
    })
}
/** 中日程 获取单条数据 详细信息 */
export function getActivitieInfo(code) {
    return HTTP({
        url: `/activities/${code}`,
        method: 'get',
    })
}
/** 中日程 新增 */
export function postActivitie(data) {
    return HTTP({
        url: '/activities',
        method: 'post',
        data
    })
}
/** 中日程 更新 */
export function putActivitie(data) {
    return HTTP({
        url: '/activities',
        method: 'put',
        data
    })
}
/* 导入中日程 Excel文件 (data 该内容为 formData内容) */
export function postActivitieimport(data) {
    return HTTP({
        url: '/activities/import',
        method: 'post',
        data
    })
}

/** 获取作业包 列表数据集 */
export function getWorkPackages(params) {
    return HTTP({
        url: '/workPackages',
        method: 'get',
        params
    })
}
/** 作业包 获取单条数据详细信息 */
export function getWorkPackageInfo(code) {
    return HTTP({
        url: `/workPackages/${code}`,
        method: 'get',
    })
}
/** 作业包 新增 */
export function postWorkPackage(data) {
    return HTTP({
        url: '/workPackages',
        method: 'post',
        data
    })
}
/** 作业包 更新 */
export function putWorkPackage(data) {
    return HTTP({
        url: '/workPackages',
        method: 'put',
        data
    })
}

/** 获取作业指示 列表数据集 */
export function getWorkOrders(params) {
    return HTTP({
        url: '/workOrders',
        method: 'get',
        params
    })
}
/** 作业指示 获取单条数据详细信息 */
export function getworkOrderInfo(code) {
    return HTTP({
        url: `/workOrders/${code}`,
        method: 'get',
    })
}
/** 作业指示 新增 */
export function postWorkOrder(data) {
    return HTTP({
        url: '/workOrders',
        method: 'post',
        data
    })
}
/** 作业指示 更新 */
export function putWorkOrder(data) {
    return HTTP({
        url: '/workOrders',
        method: 'put',
        data
    })
}

/** 获取 职班主数据 列表数据集 */
export function getWorkteams(params) {
    return HTTP({
        url: '/workteams',
        method: 'get',
        params
    })
}
/** 职班主数据 获取单条数据详细信息 */
export function getWorkteamInfo(code) {
    return HTTP({
        url: `/workteams/${code}`,
        method: 'get',
    })
}
/** 职班主数据 新增 */
export function postWorkteam(data) {
    return HTTP({
        url: '/workteams',
        method: 'post',
        data
    })
}
/** 职班主数据 更新 */
export function putWorkteam(data) {
    return HTTP({
        url: '/workteams',
        method: 'put',
        data
    })
}

/** 获取作业分割体系单位 数据集 */
export function getWbsElements(params) {
    return HTTP({
        url: '/wbsElements',
        method: 'get',
        params
    })
}
/** 作业分割体系单位 单条数据详情 */
export function getWbsElementInfo(code) {
    return HTTP({
        url: `/wbsElements/${code}`,
        method: 'get',
    })
}
/** 作业分割体系单位 新增 */
export function postWbsElement(data) {
    return HTTP({
        url: '/wbsElements',
        method: 'post',
        data
    })
}
/** 作业分割体系单位 更新 */
export function putWbsElement(data) {
    return HTTP({
        url: '/wbsElements',
        method: 'put',
        data
    })
}
/**
 * WBS模块 删除 数据字典数据 单条数据
 * @param {*} code 传入 单条数据的ID
 */
export function deleteWbsElement(code) {
    return HTTP({
        url: `/wbsElements/${code}`,
        method: 'delete',
    })
}
/** 导入作业分割体系 Excel文件 (data 该内容为 formData内容) */
export function postWbsElementImport(data) {
    return HTTP({
        url: '/wbsElements/import',
        method: 'post',
        data
    })
}

/** 获取项目大日程 数据集 */
export function getScheduleMaster(params) {
    return HTTP({
        url: '/schedule/master',
        method: 'get',
        params
    })
}
/** 项目大日程 单条数据 修改 */
export function putScheduleMaster(data) {
    return HTTP({
        url: '/schedule/master',
        method: 'put',
        data
    })
}