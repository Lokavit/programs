/**
 * taskbar 任务栏 对应模态框所需
 */
import {
    TYPE_TAKSBAR
} from '../mutations-types';

const state = {
    // 任务栏中的任务项 组
    taskGroup: [],
}

const mutations = {
    /**
     * 于任务栏中，添加一个任务项
     */
    [TYPE_TAKSBAR.ADD_TASK]: (state, task) => {
        // 向模态框组中增加模态框
        return state.taskGroup.push(task);
    },

    [TYPE_TAKSBAR.CLOSE_TASK]: (state, task) => {
        // 移除当前指定的 任务项
        return state.taskGroup.splice(state.taskGroup.indexOf(task), 1);
    }
}

const actions = {

    /**
     * 添加任务项
     * @param {*} param0 提交事件及共享数据 
     * @param {*} task 需添加的任务项对象
     */
    addTask({
        commit,
        state
    }, task) {
        if (task) {
            commit(TYPE_TAKSBAR.ADD_TASK, task); // 异步触发同步同名函数
        }
    },

    /**
     * 关闭任务项
     * @param {*} param0 提交事件及恭喜数据 
     * @param {*} task 需关闭的任务项
     */
    closeTask({
        commit,
        state
    }, task) {
        if (task) {
            commit(TYPE_TAKSBAR.CLOSE_TASK, task);
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}