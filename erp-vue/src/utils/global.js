/**
 * 全局变量及全局函数
 */


/**
 * 全局 [一行四列类型表单页|八列以上列表页] 在[1366]分辨率下的初始默认值
 * 该值用于 三列类型表单，在具体使用组件内，调用[returnCurrentWindowWidth]函数时，将其作为参数传入
 * use: this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
 */
const INITIAL_WIDE = 1100; // 1214

/**
 * 全局 [五至八列以下列表]在[1366]分辨率下的初始默认值
 */
const INITIAL_TABLE_MEDIUM = 892;

/**
 * 全局 [四列以下列表]在[1366]分辨率下的初始默认值
 */
const INITIAL_TABLE_SMALL = 672;

/** 
 * 全局 [一行一列表单页]在[1366]分辨率下的初始默认值
 */
const INITIAL_FORM_SINGLE = 280;


// const INITIAL_FORM_MULTIPLE = 1060;



/**
 * 列表页的表头样式
 */
const LIST_TABLE_HEADER_CELL_STYLE = {
    background: '#DCDFE6', // 表头背景色
    color: '#2E2F2E', // 表头文字色
    height: '38px', // 表头高度
}

/**
 * 列表页面，表头之外的单元格 样式
 */
const LIST_TABLE_CELL_STYLE = {
    // background: 'rgba(0,0,0,0)', // 表体内容背景色
    height: '34px', // 单元格高度
}

/**
 * 表单页中 Table 的外边距
 */
const FORM_TABLE_MARGIN = {
    marginTop: '20px', // 外边距距顶 [表单区域之下]
    marginBottom: "20px" // 外边距距底 [备注之上]
}

/**
 * 表单页中 table 的表头样式
 */
const FORM_TABLE_HEADER_CELL_STYLE = {
    background: '#DDE0E6',
    color: '#606266',
    height: '32px'
}

/**
 * 列表页面，表头之外的单元格 样式
 */
const FORM_TABLE_CELL_STYLE = {
    height: '28px', // 单元格高度
    padding: '0'
}

const FORM_TABLE_ROW_STYLE = {
    // background: '#999',
    height: '28px',
    // display: 'none',
}

/** 
 * 根据网页内容区域不同宽度值，返回列表页每页数据条数
 * 该返回值，直接用于 每个列表页请求中，tableData.size属性的值。
 * use: tableData:{size:this.GLOBAL.returnTableDataSize()} // 每页条数
 */
function returnTableDataSize() {
    /** 返回列表页每页显示的数据条数
     * window.screen.width:屏幕宽度
     * window.screen.availWidth:可用区域宽度[含滚动条]
     * window.document.body.offsetWidth:浏览器网页区域宽度[不含滚动条]
     */
    if (window.document.body.offsetWidth <= 1366) return 10; // 每页 10条
    if (window.document.body.offsetWidth > 1366 &&
        window.document.body.offsetWidth <= 1680) return 12; // 每页12条
    if (window.document.body.offsetWidth > 1680 &&
        window.document.body.offsetWidth <= 1920) return 15; // 每页15条
    if (window.document.body.offsetWidth > 1920) return 16; // 每页16条
}

/**
 * 当前窗体整体的宽度 
 * @param {*} initialWidth 初始宽度，默认基于1366分辨率设置的值
 * return:计算后的宽度值，用于根据不同分辨率，动态改变其dialog窗体宽度
 * use: this.GLOBAL.returnCurrentWindowWidth(1234); // 其中 1234 为1366下的宽度值
 */
function returnCurrentWindowWidth(initialWidth) {
    if (returnTableDataSize() == 10) return initialWidth + 'px';
    if (returnTableDataSize() == 12) return initialWidth * 1.2 + 'px';
    if (returnTableDataSize() == 15) return initialWidth * 1.5 + 'px';
    if (returnTableDataSize() == 16) return initialWidth * 1.6 + 'px';
}


/**
 * 获取当前对话框标题
 * @param {*} el 传入需寻找的元素
 * return:返回找到的元素的第一个子元素的标签内容，也就是当前对话框的标题内容
 * 该返回值，作为 动态打开新全局对话框时,作为新打开的全局对话框的标题
 * use:this.GLOBAL.getCurrentModalTitle(this.$parent.$parent.$el),
 */
function getCurrentModalTitle(el) {
    if (el) {
        // 从传入的el中，找到指定class的元素标签
        let temp = el.querySelector(".dialog-header");
        // 返回当前对话框的，header里面，的第一个子元素 ，的内容，也就是<span>标签里的明文
        return temp.firstElementChild.innerText;
    }
}

/**
 * 字符串转布尔值
 * @param {*} str 需转换的值
 * use:this.GLOBAL.stringToBoolean("true")
 */
function stringToBoolean(str) {
    console.log('str:', str);
    switch (str.toLowerCase()) {
        case "true":
        case "yes":
        case "1":
        case "男":
            return true;
        case "false":
        case "no":
        case "0":
        case "女":
        case null:
            return false;
        default:
            return Boolean(str);
    }
}

/**
 * 移除对象的空属性
 * @param {*} obj 传入需检测的对象
 * 遍历对象属性，移除其中属性值为""的属性
 * 用于检查请求体是否有空属性值，而导致提交请求错误
 */
export function removeEmptyObjectProperty(obj) {
    for (let key in obj) {
        if (obj[key] === "") delete obj[key];
    }
    return obj;
}

/**
 * 根绝指定类型返回对于数据集
 * @param {*} typeValue 指定类型字符串
 * @param {*} arrayData 原数组
 * @return:指定类型后，过滤返回的数据集
 */
export function returnDataByType(typeValue, arrayData) {
    return arrayData.filter(item => item.managementType === typeValue);
};


/** 日期时间格式化
 * @param date 传入的日期时间
 * 通常用于单据日期
 */
export function FORMATDATETIME(date) {
    // const date = new Date(); // 获取当前时间
    // let dateSeperator = `-`; // 日期分隔符
    // let tiemSeperator = `:`; // 时间分隔符
    // date.getFullYear(); // 当前年份
    // date.getMonth() + 1; // 当前月份[0表示1月]
    // date.getDate(); // 当前日[1-31]
    // date.getHours(); // 当前小时[0-59]
    // date.getMinutes(); // 当前分钟[0-59]
    // date.getSeconds(); // 当前秒

    // 月份补0处理
    let formatMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth() + 1;
    // 日期补0处理
    let formatDay = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    // 小时补0处理
    let formatHours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    // 分钟补0处理
    let formatMinutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    // 秒数补0处理
    let formatSeconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

    return `${date.getFullYear()}-${formatMonth}-${formatDay} ${formatHours}:${formatMinutes}:${formatSeconds}`;

}













export default {
    /** ==========[  全  局  变  量  ]=================== */

    INITIAL_WIDE, // 宽度初始值: 三列类型表单及五列以上列表 
    INITIAL_TABLE_MEDIUM, // 宽度初始值: 五至八列以下列表 
    INITIAL_TABLE_SMALL, // 宽度初始值: 四列以下列表 
    INITIAL_FORM_SINGLE, // 宽度初始值: 主表区域一行一列 

    LIST_TABLE_HEADER_CELL_STYLE, // 列表页Table表头样式
    LIST_TABLE_CELL_STYLE, // 列表页Table单元格样式
    FORM_TABLE_MARGIN, // 表单页 中 Table 外边距
    FORM_TABLE_HEADER_CELL_STYLE, // 表单页中 Table的表头样式
    FORM_TABLE_CELL_STYLE, // 表单页中 Table的单元格样式
    FORM_TABLE_ROW_STYLE, // 行样式

    /** ==========[  全  局  函  数  ]=================== */

    returnTableDataSize, // 根据不同分辨率返回列表页所需单页最大数据条数
    returnCurrentWindowWidth, // 根据以上函数的结果，返回重新计算的宽度
    getCurrentModalTitle, // 获取当前对话框的标题
    stringToBoolean, // 字符串转布尔值

    removeEmptyObjectProperty, // 移除空对象属性

    returnDataByType, // 根据指定类型返回所需

    FORMATDATETIME, // 日期时间格式化
}