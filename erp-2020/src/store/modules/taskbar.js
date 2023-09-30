/**
 * taskbar 任务栏 对应模态框所需
 */
import {
  TYPE_TAKSBAR
} from "../mutations-types";

const state = {
  // 任务栏中的任务项 组
  taskGroup: []
};

const mutations = {
  /** 于任务栏中，添加一个任务项 */
  [TYPE_TAKSBAR.ADD_TASK]: (state, task) => {
    // 向模态框组中增加模态框
    return state.taskGroup.push(task);
  },

  /** 于任务栏中，关闭(移除)一个任务项 */
  [TYPE_TAKSBAR.CLOSE_TASK]: (state, task) => {
    // 移除当前指定的 任务项
    return state.taskGroup.splice(state.taskGroup.indexOf(task), 1);
  },

  /** 清空任务栏 */
  [TYPE_TAKSBAR.CLEAR_TASK]: state => {
    return (state.taskGroup = []);
  },

  /** 切换激活任务项 */
  [TYPE_TAKSBAR.SWITCH_TASK_ACTIVE]: (state, {
    task
  }) => {
    // console.log('切换激活任务项:',task);
    // 只有当前的task.active为true ,其他为 flase
    for (let i = 0; i < state.taskGroup.length; i++) {
      if (state.taskGroup[i].path == task.path) {
        state.taskGroup[i].active = true;
      } else if (state.taskGroup[i].path != task.path) {
        state.taskGroup[i].active = false;
      }
    }
    return state.taskGroup; // 返回最终处理完成的任务项数组
  },

  /** 切换标星任务项 */
  [TYPE_TAKSBAR.SWITCH_TASK_STATUS]: (state, {
    task
  }) => {
    for (let i = 0; i < state.taskGroup.length; i++) {
      if (state.taskGroup[i].path == task.path) {
        state.taskGroup[i].status = true;
      }
    }
    return state.taskGroup

  }
};

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
      // 异步触发同步同名函数 添加任务项
      commit(TYPE_TAKSBAR.ADD_TASK, task);
      // 添加任务项之后， 切换任务项激活状态为当前任务项
      commit(TYPE_TAKSBAR.SWITCH_TASK_ACTIVE, {
        task
      });
    }
  },

  /**
   * 关闭任务项
   * @param {*} param0 提交事件及共享数据
   * @param {*} task 需关闭的任务项
   */
  closeTask({
    commit,
    state
  }, task) {
    if (task) {
      commit(TYPE_TAKSBAR.CLOSE_TASK, task);
    }
  },

  /**
   * 清理任务栏 (与每次切换子系统时，调用)
   * @param {*} param0
   */
  clearTask({
    commit,
    state
  }) {
    commit(TYPE_TAKSBAR.CLEAR_TASK);
  },

  /**
   * 切换任务项激活状态
   * @param {*} param0
   * @param {*} task 当前选中的任务项
   */
  switchTaskActive({
    commit,
    state
  }, task) {
    if (task) {
      // 异步触发同步同名函数 切换当前任务项激活状态
      commit(TYPE_TAKSBAR.SWITCH_TASK_ACTIVE, {
        task
      });
    }
  },

  /**
   * 切换任务项标星状态
   * @param {*} param0 
   * @param {*} task 
   */
  switchTaskStatus({
    commit,
    state
  }, task) {
    if (task) {
      commit(TYPE_TAKSBAR.SWITCH_TASK_STATUS, {
        task
      });
    }
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};