/** 全局过滤器 */

export default {

    /** 过滤 表单标题动态内容 */
    FormatFormTitle(value) {
        return value == "create" ? "创建" : value
    },
    
    // /** 格式化 基础数据 物料组 表单 状态 */
    // FormatMaterialGroupStatus(value){
    //     console.log('VALUE:',value);
    //     return value=="Enable"?"可用":"不可用"
    // },
    









    // =============== 以下为 2019版 所需过滤器 ==================  //

    // /** 过滤 采购申请单 列表页 状态 */
    // FormatBaseStatus(value) {
    //     return value == "Open" ? "未清" : value == "Closed" ? "已清" : "";
    //     // return value == "Open" ? "未清" : "已清";
    // },
    // /** 过滤 生产模块 中日程 列表页 状态 */
    // FormatActivitieState(value) {
    //     return value == "confirm" ? "确认" : "未确认";
    // },
    // /** 过滤 baseType 单据类型 */
    // FormatBaseType(value) {
    //     let result = "";
    //     switch (value) {
    //         case "GoodsIssue":
    //             result = "库存发货单";
    //             break;
    //         case "GoodsReceipt":
    //             result = "库存收货单";
    //             break;
    //         case "GoodsTransfer":
    //             result = "库存转储单";
    //             break;
    //         case "PurchaseDelivery":
    //             result = "采购收货单";
    //             break;
    //         case "PurchaseReturn":
    //             result = "采购退货单";
    //             break;
    //         default:
    //             return;
    //     }
    //     return result; // 
    // },
    // /**
    //  * 过滤 所有 标注 ，添加上 英文状态下的[:]
    //  */
    // FormatLabelSuffix(value) {
    //     return value = value + `:`;
    // },

    // /** 过滤选项 managementType 物料管理方式 */
    // FormatManagementType(value) {
    //     let formatData = "";
    //     switch (value) {
    //         case "NONE":
    //             formatData = "无";
    //             break;
    //         case "BATCHNUMBER":
    //             formatData = "批次管理";
    //             break;
    //         case "SERIALNUMBER":
    //             formatData = "序列号管理";
    //             break;
    //         default:
    //             return;
    //     }
    //     return formatData;
    // },
    // /** 继续以函数式往后添加 */

    // /** 过滤器 库存过账，出入方向 */
    // FormatDirection(value) {
    //     return value == "Out" ? "出" : "入";
    // },

    // /** 物料主数据中的 是否启用 */
    // FormatEnabled(value) {
    //     return value == "true" ? "可用" : "不可用";
    // },


};