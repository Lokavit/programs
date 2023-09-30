/**
 * BasicData 基础数据 API
 */
import {
    HTTP
} from "./http";

/** ======================  物料组数据 API  ==================================== */
/**
 * 获取物料组列表数据
 * @param {*} params
 */
export function getMaterialGroup(params) {
    return HTTP({
        url: "/bes/materialGroups",
        method: "get",
        params
    });
}

/**
 * 获取指定物料组编码的物料组数据
 * @param {*} code
 */
export function getMaterialGroupInfo(code) {
    return HTTP({
        url: `/bes/materialGroups/${code}`,
        method: "get"
    });
}

/**
 * 物料组表单 新增
 * @param {*} data
 */
export function postMaterialGroup(data) {
    return HTTP({
        url: "/bes/materialGroups",
        method: "post",
        data
    });
}

/**
 * 物料组表单 更新
 * @param {*} data
 */
export function putMaterialGroup(data) {
    /** 把需要的编码单独提出，剩余对象属性作为请求体 */
    let {
        itemGroupCode,
        ...formData
    } = data;
    return HTTP({
        url: `/bes/materialGroups/${itemGroupCode}`,
        method: "put",
        data: formData
    });
}

/** ======================  仓库主数据 API  ==================================== */
/**
 * 获取仓库列表数据
 * @param {*} params 
 */
export function getWarehouse(params) {
    return HTTP({
        url: '/bes/warehouses',
        method: 'get',
        params
    })
}

/**
 * 根据传入的仓库编码获取该仓库数据
 * @param {String} code 传入的仓库编码 
 */
export function getWarehouseInfo(code) {
    return HTTP({
        url: `/bes/warehouses/${code}`,
        method: 'get',
    })
}

/**
 * 仓库表单 新增
 * @param {*} data  
 */
export function postWarehouse(data) {
    return HTTP({
        url: '/bes/warehouses',
        method: 'post',
        data
    })
}

/**
 * 仓库表单 更新
 * @param {*} data 
 */
export function putWarehouse(data) {
    /** 把需要的编码单独提出，剩余对象属性作为请求体 */
    let {
        whsCode,
        ...formData
    } = data;
    return HTTP({
        url: `/bes/warehouses/${whsCode}`,
        method: 'put',
        data: formData
    })
}

/** ======================  计量单位数据 API  ==================================== */
/**
 * 获取计量单位列表
 * @param {*} params 
 */
export function getUOM(params) {
    return HTTP({
        url: '/bes/uoms',
        method: 'get',
        params
    })
}

/**
 * 根据传入的计量单位编码，获取该计量单位详情
 * @param {*} code 
 */
export function getUOMInfo(code) {
    return HTTP({
        url: `/bes/uoms/${code}`,
        method: 'get',
    })
}

/**
 * 计量单位表单 新增
 * @param {*} data  
 */
export function postUOM(data) {
    return HTTP({
        url: '/bes/uoms',
        method: 'post',
        data
    })
}

/**
 * 计量单位表单 更新
 * @param {*} data 
 */
export function putUOM(data) {
    /** 把需要的编码单独提出，剩余对象属性作为请求体 */
    let {
        uomCode,
        ...formData
    } = data;
    return HTTP({
        url: `/bes/uoms/${uomCode}`,
        method: 'put',
        data: formData,
    })
}

/** ======================  材质代码数据 API  ==================================== */
/**
 * 获取材质代码列表
 * @param {*} params 
 */
export function getMaterialQualitie(params) {
    return HTTP({
        url: '/bes/materialQualities',
        method: 'get',
        params
    })
}

/**
 * 根据传入的计量单位编码，获取该计量单位详情
 * @param {*} code 
 */
export function getMaterialQualitieInfo(code) {
    return HTTP({
        url: `/bes/materialQualities/${code}`,
        method: 'get',
    })
}

/**
 * 计量单位表单 新增
 * @param {*} data  
 */
export function postMaterialQualitie(data) {
    return HTTP({
        url: '/bes/materialQualities',
        method: 'post',
        data
    })
}

/**
 * 计量单位表单 更新
 * @param {*} data 
 */
export function putMaterialQualitie(data) {
    /** 把需要的编码单独提出，剩余对象属性作为请求体 */
    let {
        mqCode,
        ...formData
    } = data;
    return HTTP({
        url: `/bes/materialQualities/${mqCode}`,
        method: 'put',
        data: formData,
    })
}

/** ======================  供应商数据 API  ==================================== */
/**
 * 获取材质代码列表
 * @param {*} params 
 */
export function getSupplier(params) {
    return HTTP({
        url: '/bes/suppliers',
        method: 'get',
        params
    })
}

/**
 * 根据传入的计量单位编码，获取该计量单位详情
 * @param {*} code 
 */
export function getSupplierInfo(code) {
    return HTTP({
        url: `/bes/suppliers/${code}`,
        method: 'get',
    })
}

/**
 * 计量单位表单 新增
 * @param {*} data  
 */
export function postSupplier(data) {
    return HTTP({
        url: '/bes/suppliers',
        method: 'post',
        data
    })
}

/**
 * 计量单位表单 更新
 * @param {*} data 
 */
export function putSupplier(data) {
    /** 把需要的编码单独提出，剩余对象属性作为请求体 */
    let {
        supplierCode,
        ...formData
    } = data;
    return HTTP({
        url: `/bes/suppliers/${supplierCode}`,
        method: 'put',
        data: formData,
    })
}