/**
 * 全局变量及全局函数
 */


// /**
//  * 全局 [一行四列类型表单页|八列以上列表页] 在[1366]分辨率下的初始默认值
//  * 该值用于 三列类型表单，在具体使用组件内，调用[returnCurrentWindowWidth]函数时，将其作为参数传入
//  * use: this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
//  */
// const INITIAL_WIDE = 1100; // 1214

// /**
//  * 全局 [五至八列以下列表]在[1366]分辨率下的初始默认值
//  */
// const INITIAL_TABLE_MEDIUM = 892;

// /**
//  * 全局 [四列以下列表]在[1366]分辨率下的初始默认值
//  */
// const INITIAL_TABLE_SMALL = 672;

// /** 
//  * 全局 [一行一列表单页]在[1366]分辨率下的初始默认值
//  */
// const INITIAL_FORM_SINGLE = 280;


// // const INITIAL_FORM_MULTIPLE = 1060;



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

/** 屏幕宽度与每页数据集条数对应 */
const SCREEN_WIDTH_FOR_ITEMS = [{
    screenWidth: 1366, // 屏幕宽度
    item: 10, // 条数
    // zoom:1, // 屏幕缩放比(用于通过屏幕宽度计算指定元素size)
}, {
    screenWidth: 1680,
    item: 13,
    // zoom:1.3 // 屏幕缩放比(用于通过屏幕宽度计算指定元素size)
}, {
    screenWidth: 1920,
    item: 15,
    // zoom:1.5 // 屏幕缩放比(用于通过屏幕宽度计算指定元素size)
}];

/** 基础数据 计量单位 舍入类型
 * 用于 表单页下拉选项组，亦用于列表页返回对应对象label值
 */
const ROUND_TYPE = [{
        label: "四舍五入",
        value: "HalfAdjust"
    },
    {
        label: "进位",
        value: "RoundUp"
    },
    {
        label: "舍入",
        value: "RoundOff"
    }
];

/** 
 * 通用 状态[可用|禁用] 定义数组对象
 * 作用于表单页状态下拉选项组
 * 作用于列表页状态值的明文转换
 */
const STATUS_ENBALE = [{
        status: 'Enable',
        label: "可用",
        color: "green"
    },
    {
        status: 'Disabled',
        label: "不可用",
        color: "red"
    }
]


/**
 * 根据传入参数，从数组对象中返回指定对象
 * @param {*} status 传入的状态值
 * @param {*} statusTypes 多种状态类型数组择一
 * @return 返回由状态类型数组对象中，找到的同状态值对象
 */
function returnStatusObject(status, statusTypes) {
    // console.log('STATUS:', status, 'TYPE:', statusTypes)
    return statusTypes.find(item => item.status == status);
}





/**
 * 根据传入参数，找到对应舍入类型
 * @param {*} roundType 传入的舍入类型值
 * @return 舍入类型值对应对象的明文
 */
function returnListUOMRoundType(roundType) {
    return ROUND_TYPE.find(item => item.value == roundType);
}



/**
 * 通过传入的屏幕尺寸，返回列表页数据最大展示数据条数
 * @param {*} screenWidth 屏幕宽度
 * 返回屏幕宽度及最大条数对象
 * use:this.GLOBAL.returnTableDataSize().size
 */
function returnTableDataItem() {
    /** 返回列表页每页显示的数据条数
     * window.screen.width:屏幕宽度
     * window.screen.availWidth:可用区域宽度[含滚动条]
     * window.document.body.offsetWidth:浏览器网页区域宽度[不含滚动条]
     */
    if (window.document.body.offsetWidth < 0) return;
    // 从数组中过滤出来符合当前区间值的数据
    let tableDataSize = SCREEN_WIDTH_FOR_ITEMS.find(item => window.document.body.offsetWidth <= item.screenWidth);
    // 如果过滤结果有数据，返回过滤结果，否则返回数组中第一个元素对象
    return tableDataSize ? tableDataSize : SCREEN_WIDTH_FOR_ITEMS[0];
}

/** 状态类型数组对象
 * 目前用作物资供应计划列表状态
 */
const STATUSTYPE = [{
    status: 'draft', // 草稿
    label: '草拟', // 汉译明文
    color: 'blue' // 文字颜色
}, {
    status: 'confirm', // 确认(生效)
    label: '确认', // 汉译明文
    color: 'aqua' // 文字颜色
}, {
    status: 'cleared', // 已清
    label: '已清', // 汉译明文
    color: 'green' // 文字颜色
}, {
    status: 'invalid', // 作废
    label: '作废', // 汉译明文
    color: 'red' // 文字颜色
}]

/**
 * 通过传入值，返回状态类型
 * @param status 传入的状态值
 */
function returnStatusType(status) {
    // 传入的状态值，转换为字符串，便于统一对比
    return STATUSTYPE.find(item => item.status == status);
}





import XLSX from "xlsx"; // 引入 js-xlsx
/**
 * 解析excel中的数据
 * @param {*} file 传入的excel文件
 * @return 解析后的数据
 */
function parseExcelData(file) {
    // 文件读取
    const reader = new FileReader();
    // 读取指定file文件
    reader.readAsBinaryString(file);

    return new Promise((resolve, reject) => {
        // console.log('Promise')
        reader.onloadstart = function () {
            // console.log("onloadstart状态")
            // console.log("开始加载")
        }
        reader.onprogress = function () {
            // console.log("onprogress状态")
        }
        // 文件加载
        reader.onload = event => {
            // 返回 workbook 整份EXCEL文档
            const workbook = XLSX.read(event.target.result, {
                type: "binary"
            });
            // 返回 worksheet EXCEL文档中的表  worksheet['!ref'] 是工作表的有效范围（基于 A-1）
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            // 表中数据转为JSON
            const data = XLSX.utils.sheet_to_json(worksheet, {
                header: 1
            });
            resolve(data);
        };
        reader.onloadend = function () {
            // console.log("onloadend状态")
            // console.log("加载结束")
        }
        reader.onerror = function () {
            console.error('出错了')
        }
    })
}

/**
 * 图片文件 转为 Base64
 * @param {*} file 传入的图片文件
 */
function imgFileToBase64(file) {
    // 文件读取
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
        let imgBase64 = "";
        reader.onload = function () {
            imgBase64 = reader.result;
        };
        reader.onerror = function (error) {
            reject(error);
        };
        reader.onloadend = function () {
            resolve(imgBase64);
        };
    })
}


/**
 * 日期时间格式化 后台返回时间字符串中的[T]替换为空格
 * @param {*} dataTime 
 * @return 格式化后的日期时间
 */
function dateTiemFormatRemoveT(dataTime) {
    return dataTime.replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
}



// /**
//  * 当前窗体整体的宽度 
//  * @param {*} initialWidth 初始宽度，默认基于1366分辨率设置的值
//  * return:计算后的宽度值，用于根据不同分辨率，动态改变其dialog窗体宽度
//  * use: this.GLOBAL.returnCurrentWindowWidth(1234); // 其中 1234 为1366下的宽度值
//  */
// function returnCurrentWindowWidth(initialWidth) {
//     if (returnTableDataSize() == 10) return initialWidth + 'px';
//     if (returnTableDataSize() == 12) return initialWidth * 1.2 + 'px';
//     if (returnTableDataSize() == 15) return initialWidth * 1.5 + 'px';
//     if (returnTableDataSize() == 16) return initialWidth * 1.6 + 'px';
// }


// /**
//  * 获取当前对话框标题
//  * @param {*} el 传入需寻找的元素
//  * return:返回找到的元素的第一个子元素的标签内容，也就是当前对话框的标题内容
//  * 该返回值，作为 动态打开新全局对话框时,作为新打开的全局对话框的标题
//  * use:this.GLOBAL.getCurrentModalTitle(this.$parent.$parent.$el),
//  */
// function getCurrentModalTitle(el) {
//     if (el) {
//         // 从传入的el中，找到指定class的元素标签
//         let temp = el.querySelector(".dialog-header");
//         // 返回当前对话框的，header里面，的第一个子元素 ，的内容，也就是<span>标签里的明文
//         return temp.firstElementChild.innerText;
//     }
// }

// /**
//  * 字符串转布尔值
//  * @param {*} str 需转换的值
//  * use:this.GLOBAL.stringToBoolean("true")
//  */
// function stringToBoolean(str) {
//     console.log('str:', str);
//     switch (str.toLowerCase()) {
//         case "true":
//         case "yes":
//         case "1":
//         case "男":
//             return true;
//         case "false":
//         case "no":
//         case "0":
//         case "女":
//         case null:
//             return false;
//         default:
//             return Boolean(str);
//     }
// }

// /**
//  * 移除对象的空属性
//  * @param {*} obj 传入需检测的对象
//  * 遍历对象属性，移除其中属性值为""的属性
//  * 用于检查请求体是否有空属性值，而导致提交请求错误
//  */
// export function removeEmptyObjectProperty(obj) {
//     for (let key in obj) {
//         if (obj[key] === "") delete obj[key];
//     }
//     return obj;
// }

// /**
//  * 根绝指定类型返回对于数据集
//  * @param {*} typeValue 指定类型字符串
//  * @param {*} arrayData 原数组
//  * @return:指定类型后，过滤返回的数据集
//  */
// export function returnDataByType(typeValue, arrayData) {
//     return arrayData.filter(item => item.managementType === typeValue);
// };

// /**
//  * 比较两个对象是否相等
//  * @param {*} obj1 参照对象
//  * @param {*} obj2 目标对象
//  */
// export function equalObject(obj1, obj2) {
//     // 类型对比
//     if (!(obj1 instanceof Object) || !(obj2 instanceof Object)) return false;
//     // obj.toString() 效果与上相同 [object object]，但[↑返回true/false]，[↓返回string]
//     // if (!obj1.toString() || !obj2.toString()) return false;
//     // 长度对比
//     if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
//     // 每个key对比
//     return Object.keys(obj1).every(v => obj1[v] === obj2[v]);
// }


// /** 日期时间格式化
//  * @param date 传入的日期时间
//  * 通常用于单据日期
//  */
// export function FORMATDATETIME(date) {
//     // const date = new Date(); // 获取当前时间
//     // let dateSeperator = `-`; // 日期分隔符
//     // let tiemSeperator = `:`; // 时间分隔符
//     // date.getFullYear(); // 当前年份
//     // date.getMonth() + 1; // 当前月份[0表示1月]
//     // date.getDate(); // 当前日[1-31]
//     // date.getHours(); // 当前小时[0-59]
//     // date.getMinutes(); // 当前分钟[0-59]
//     // date.getSeconds(); // 当前秒

//     // 月份补0处理
//     let formatMonth = date.getMonth() + 1 < 10 ? `0${date.getMonth()+1}` : date.getMonth() + 1;
//     // 日期补0处理
//     let formatDay = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
//     // 小时补0处理
//     let formatHours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
//     // 分钟补0处理
//     let formatMinutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
//     // 秒数补0处理
//     let formatSeconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

//     return `${date.getFullYear()}-${formatMonth}-${formatDay} ${formatHours}:${formatMinutes}:${formatSeconds}`;

// }














export default {
    /** ==========[  全  局  变  量  ]=================== */

    /** 基础数据 计量单位 舍入类型 定义数组对象 导出 */
    ROUND_TYPE,
    /** 通用 状态[可用|禁用] 定义数组对象 导出 */
    STATUS_ENBALE,
    /** 状态[草稿|确认|已清|作废] */
    STATUSTYPE,

    /** ==========[  全  局  函  数  ]=================== */

    returnStatusObject, // 返回状态对象

    returnTableDataItem, // 根据不同分辨率返回列表页所需单页最大数据条数
    parseExcelData, // 解析excel文件中的数据
    imgFileToBase64, // 图片文件转为Base64
    returnStatusType, // 根据不同状态值，返回状态类型对象

    /** 根据不同舍入类型值，返回对应舍入类型明文 */
    returnListUOMRoundType,
    /** 日期时间格式化 后台返回时间字符串中的[T]替换为空格 */
    dateTiemFormatRemoveT,





















    // /** 以下为 2019版相关全局变量，及全局函数 */

    // INITIAL_WIDE, // 宽度初始值: 三列类型表单及五列以上列表 
    // INITIAL_TABLE_MEDIUM, // 宽度初始值: 五至八列以下列表 
    // INITIAL_TABLE_SMALL, // 宽度初始值: 四列以下列表 
    // INITIAL_FORM_SINGLE, // 宽度初始值: 主表区域一行一列 

    // LIST_TABLE_HEADER_CELL_STYLE, // 列表页Table表头样式
    // LIST_TABLE_CELL_STYLE, // 列表页Table单元格样式
    // FORM_TABLE_MARGIN, // 表单页 中 Table 外边距
    // FORM_TABLE_HEADER_CELL_STYLE, // 表单页中 Table的表头样式
    // FORM_TABLE_CELL_STYLE, // 表单页中 Table的单元格样式
    // FORM_TABLE_ROW_STYLE, // 行样式




    // // returnCurrentWindowWidth, // 根据以上函数的结果，返回重新计算的宽度
    // getCurrentModalTitle, // 获取当前对话框的标题
    // stringToBoolean, // 字符串转布尔值

    // removeEmptyObjectProperty, // 移除空对象属性

    // returnDataByType, // 根据指定类型返回所需
    // equalObject, // 比较两个对象是否相等

    // FORMATDATETIME, // 日期时间格式化
}