/**
 * 每个mutation都有一个常量字符串的事件类型
 * 在此同一定义为常量
 */

/** ======================= */

/**
 * Modal 相关事件
 */
export const TYPE_MODAL = {
    OPEN_MODAL: 'OPEN_MODAL', // 增加模态框
    CLOSE_MODAL: 'CLOSE_MODAL', // 移除模态框
    SHOW_MODAL: 'SHOW_MODAL', // 控制是否显示模态框
    SWITCH_MODAL_LEVEL: 'SWITCH_MODAL_LEVEL' // 切换窗体层级
}

/**
 * 任务栏相关
 */
export const TYPE_TAKSBAR = {
    ADD_TASK: 'ADD_TASK', // 添加任务项
    CLOSE_TASK: 'CLOSE_TASK', // 关闭任务项
}

/** labels 相关 */
export const TYPE_LABELS = {
    GET_LABELS: 'GET_LABELS', // 获取labels
}


/**
 * 测试相关
 */
export const TYPE_DEMO = {
    // 设置作者
    SET_AUTHOR: 'SET_AUTHOR',
    GET_VENDOR: 'GET_VENDOR', // 获取供应商列表数据集
}