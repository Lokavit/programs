/** 钢材管理 API */

import {
    HTTP
} from './http';

/** 获取数据 */
export function getData(params) {
    return HTTP({
        url: '/',
        method: 'get',
        params
    })
}