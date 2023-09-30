/**
 * 测试相关 vuex
 */

import {
    TYPE_DEMO
} from '../mutations-types';

import {
    getVendor
} from '@/api/purchase';

/** 共享数据 */
const state = {
    author: 'Shkaya', // 作者
    vendor: {}, // 供应商
    // posts: [],
    loading: true
}

const mutations = {
    /** 设置作者 */
    [TYPE_DEMO.SET_AUTHOR]: (state, name) => {
        state.author = name;
    },
    /** 获取供应商列表数据集 */
    [TYPE_DEMO.GET_VENDOR]: (state, data) => {
        console.log('获取供应商列表数据集 DATA:', data);
        state.vendor = data
    }
}

const actions = {
    serAuthor({
        commit,
        state
    }, name) {
        if (name) {
            // 异步出发同步同名函数
            commit(TYPE_DEMO.SET_AUTHOR, name);
        }
    },
    /** 获取供应商列表数据 */
    getVendorDemo({
        commit,
        state
    }, params) {
        console.log('异步请求参数:', params);
        getVendor(params).then(response => {
            console.log('返回响应体：', response);
            commit(TYPE_DEMO.GET_VENDOR, response);
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}