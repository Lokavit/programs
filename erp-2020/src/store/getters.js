/**
 * 计算共享数据
 * 對共享數據進行過濾獲取，與[computed]類似
 * 返回值会根据它的依赖被缓存起来
 */
export default {

    /**
     * 测试数据
     * 数据获取 大于零输出值,否则输出 0
     */
    // count: state => state.demo.count > 0 ? state.demo.count : 0,
    author: state => state.demo.author,
    /** 供应商列表数据集 */
    vendor: state => state.demo.vendor,

    /** ======================= */

    /** 任务栏组  */
    taskGroup: state => state.taskbar.taskGroup,

    /** label.js 的 labels */
    labels: state => state.label.labels,






    /** ========= old modal ============== */




    /**  窗体组  */
    modalGroup: state => state.modal.modalGroup,


    // 窗体数组长度
    modalCount(state, getters) {
        // 返回 窗体数组长度
        return getters.modalGroup.length;
    },
    /** 窗体层级最大值 */
    levelNumberMax: state => state.modal.levelNumberMax,
    /** 窗体坐标值 */
    modalPosition: state => {
        /** 目前简单使用层级奇偶数来判定采用哪个坐标值 */
        return {
            top: 0,
            left: 0
        };
    },

}