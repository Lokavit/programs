/** Modal 全局窗体 */

import {
    TYPE_MODAL
} from '../mutations-types';

const state = {
    modalGroup: [], // 窗体组
    levelNumberMax: 0, // 层级最大值
    /** 窗体初始化 坐标值 */
    modalPosition: {
        top: 0,
        left: 0,
    },
}

const getters = {}

const mutations = {
    /** 打开Modal */
    [TYPE_MODAL.OPEN_MODAL]: (state, modal) => {
        state.levelNumberMax++;
        // 向窗体组中增加窗体
        return state.modalGroup.push(modal);
    },


    /** 移除Modal */
    [TYPE_MODAL.CLOSE_MODAL]: (state, modal) => {
        // 从窗体组中，移除当前窗体 

        return state.modalGroup.splice(state.modalGroup.indexOf(modal), 1);
    },

    /** 是否显示窗体 */
    [TYPE_MODAL.SHOW_MODAL]: (state, {
        modal,
        show = !modal.show
    }) => {

        return modal.show = show // 窗体显示与否
    },

    /** 窗体层级切换
     * (state, modal)=>{……} 与 (state, {modal})=>{……}的区别
     * 前者无法直接获取对象属性，后者则可以
     */
    [TYPE_MODAL.SWITCH_MODAL_LEVEL]: (state, {
        modal
    }) => {
        /* modal 为传入的数据。 本函数目的为改变modal.levelNumber为层级最大值。 */
        // 返回当前窗体组中，最大层级
        let maxlevel = Math.max.apply(
            Math,
            state.modalGroup.map(m => {
                return m.levelNumber;
            })
        );
        // 如果 当前窗体层级值 != 最大层级值
        if (modal.levelNumber != maxlevel) {
            // 原窗体数组中，最大值的窗体层级值，与当前对调
            state.modalGroup.map(item => {
                if (item.levelNumber == maxlevel) {
                    item.levelNumber = modal.levelNumber;
                    return modal.levelNumber = maxlevel;
                }
            })

        }
    }
}

const actions = {
    /**
     * 窗体层级切换
     * @param {*} param0 
     * @param {*} modal  切换层级的窗体对象
     */
    switchModalLevel({
        commit,
        state
    }, modal) {
        if (modal) {
            commit(TYPE_MODAL.SWITCH_MODAL_LEVEL, {
                modal
            })
        }
    },

    /**
     * 异步增加 modal
     * @param {*} param0  提交事件, 共享数据
     * @param {*} modal 新增的窗体对象
     */
    openModal({
            commit,
            state
        },
        modal
    ) {
        if (modal) {
            commit(TYPE_MODAL.OPEN_MODAL, modal); // 异步触发同步同名函数
        }
    },

    /**
     * 异步移除 Modal
     * @param {*} param0 提交事件,共享数据
     * @param {*} modal 需关闭的modal 对象
     */
    closeModal({
        commit,
        state
    }, modal) {
        if (modal) {
            commit(TYPE_MODAL.CLOSE_MODAL, modal);
        }
    },

    /**
     * 显隐切换 
     * @param {*} param0 提交事件,共享数据
     * @param {*} modal 需关闭的modal 对象
     */
    toggleModal({
        commit,
        state
    }, modal) {
        // 提交到同步事件 ， 如果当前是显示，则隐藏，如果当前是隐藏则显示
        commit(TYPE_MODAL.SHOW_MODAL, {
            modal
        })
    },



}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}