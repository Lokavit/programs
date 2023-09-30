/**
 * 程序所需工具函数，及一些通用函数
 */

/**
* key排序+转换字符串(加密用)
* @param {object} data 待加密数据
* @returns 字符串
* @DateTime 2020.02.25
*/
export const JSONSORT = (data) => {
  console.log('传入的待加密数据:', data);
  let stringToBeSigned = "";
  let keys = Object.keys(data).sort();
  for (let i = 0; i < keys.length; i++) {
    if (i == 0) {
      stringToBeSigned += keys[i] + "=" + data[keys[i]];
    } else {
      stringToBeSigned += "&" + keys[i] + "=" + data[keys[i]];
    }
  }
  console.log('key排序+转换', stringToBeSigned);
  return stringToBeSigned;
}

/**
 * 货币格式化
 * @param {*} money 传入的货币值 
 */
export const FORMAT_CURRENCY = (money) => {
  return new Intl.NumberFormat('zh-Hans', {
    style: 'currency', // 指定数字的格式样式
    currency: 'CNY', // 在货币格式化中使用的货币符号
    // currencyDisplay: 'name' // 使用本地化的货币符号 name会将￥转换为明文人民币
    // currencySign: 'accounting',
    // useGrouping:true, // 是否使用千位分隔符或千/万/亿分隔符，默认值是 true.
  }).format(money)
}

/**
 * 数组乱序 洗牌算法（Fisher-Yates）
 * @param {*} arr 
 * @returns 洗牌后的数组
 */
export const SHUFFLE = (arr) => {
  let i = arr.length, t, j;
  while (i) {
    j = Math.floor(Math.random() * i--);
    t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

/**
 * 获取当前年月日
 */
export const FORMAT_CURRENT_TODAY = () => {
  return new Intl.DateTimeFormat('zh', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/**
 * 获取当前年月日时分秒
 */
export const FORMAT_CURRENT_DATETIME = () => {
  return new Intl.DateTimeFormat('zh', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(new Date());
}

/**
 * 获取当前年月 正则 /替换为 - 并将日期部分剔除
 * @param {*} date 传入的当日
 * @returns 格式化处理为当前年月 
 */
export const FORMAT_CURRENT_YEAR_AND_MONTH = (date) => date.substring(0, date.length - 3).replace('/', '-');

// export const FORMAT_CURRENT_YEAR_AND_MONTH = () => {
//   return new Intl.DateTimeFormat('zh', {
//     year: 'numeric',
//     month: '2-digit',
//   }).format(new Date());
// }
// console.warn('星期', new Intl.NumberFormat('zh-Hans-CN-u-nu-hanidec').format(new Date(res.date).getDay()))
// console.warn('月', new Intl.NumberFormat('zh-Hans-CN-u-nu-hanidec').format(new Date(res.date).getMonth() + 1))


/**
 * 日期=》毫秒值
 * @param {*} date  日期
 * @returns  毫秒值
 */
const RETURN_DATE_TO_MILLISECONDS = (date) => date.getTime();

/**
 * 毫秒值=》日期
 * @param {*} milliseconds 毫秒值
 * @returns 日期
 */
const RETURN_MILLISECONDS_TO_DATE = (milliseconds) => new Date(milliseconds).toLocaleDateString();


/**
 * 根据传入日期，返回该日期所在星期的星期一
 * @param {*} date  
 * @returns 返回星期一的日期值
 */
const RETURN_MONDAY = (date) => {
  console.warn('传入日期：', date);
  // date = "2021/03/07";
  // 输出的是个{}，但没有这句，就无法使用其getDay()等函数。
  date = new Date(date);
  // 传入日期是星期几? week in day
  let day_of_the_week = date.getDay();
  console.warn('传入日期为 星期:', day_of_the_week);
  // 如果为 0 = 星期日 - 6天的毫秒值，算出所在星期的星期一，并返回
  if (day_of_the_week == 0) {
    console.warn('毫秒值倒推七天：并转换为日期：', RETURN_MILLISECONDS_TO_DATE(RETURN_DATE_TO_MILLISECONDS(date) - 86400000 * 6));
    // 星期日，则 星期日毫秒值 - 86400000 * 6 ，倒推出星期一
    return RETURN_MILLISECONDS_TO_DATE(RETURN_DATE_TO_MILLISECONDS(date) - 86400000 * 6);
  }
  // 如果为 1 = 星期一 返回星期一的日期
  else if (day_of_the_week == 1) {
    console.warn('星期一毫秒值，并转换为日期：', RETURN_MILLISECONDS_TO_DATE(RETURN_DATE_TO_MILLISECONDS(date)))
    // 星期一毫秒值，并转换为日期
    return RETURN_MILLISECONDS_TO_DATE(RETURN_DATE_TO_MILLISECONDS(date));
  }

  // 非星期一，亦非星期日的情况下  距离星期一的差值 = (当前星期数 -1)*每日毫秒值 
  else {
    console.warn('传入日期所在星期的星期一：', RETURN_MILLISECONDS_TO_DATE(RETURN_DATE_TO_MILLISECONDS(date) - (day_of_the_week - 1) * 86400000));
    // 传入日期所在星期的星期一 = 传入日期毫秒值 -  (传入日期所在星期的index-1) * 86400000;
    return RETURN_MILLISECONDS_TO_DATE(RETURN_DATE_TO_MILLISECONDS(date) - (day_of_the_week - 1) * 86400000);
  }
}

/**
 * 根据传入日期，返回该日期所在星期的星期日
 * @param {*} date 传入日期 (通常传入计算完成的星期一)
 * @returns 星期日的日期值
 */
const RETURN_SUNDAY = (date) => {
  date = new Date(date);
  console.warn('传入星期一，输出星期日:', RETURN_MILLISECONDS_TO_DATE(RETURN_DATE_TO_MILLISECONDS(date) + 86400000 * 6));
  return RETURN_MILLISECONDS_TO_DATE(RETURN_DATE_TO_MILLISECONDS(date) + 86400000 * 6);
}


/** 
 * 获取周区间数组
 */
export const RETURN_WEEK_INTERVAL = (currentDate, createDate) => {
  console.warn('当前日期:', currentDate);
  console.warn('账户创建日期:', createDate);

  let temp_monday_current = new Date(RETURN_MONDAY(currentDate));
  console.warn('当前日期所在星期的星期一:', temp_monday_current);

  let temp_monday_create = new Date(RETURN_MONDAY(createDate));
  console.warn('注册日期所在星期的星期一:', temp_monday_create);

  // 从当前日期的周一到注册日期的周一，已毫秒值算出有多少个7天？
  let offset_milliseconds = RETURN_DATE_TO_MILLISECONDS(temp_monday_current) - RETURN_DATE_TO_MILLISECONDS(temp_monday_create);
  console.warn('当前日期所在星期一毫秒值 - 注册日期所在星期一毫秒值：', offset_milliseconds);
  let total_week = offset_milliseconds / (86400000 * 7);
  console.warn('总星期:', Number(total_week).toFixed(0));  // 69个星期

  // 存储星期的数组
  let arr_week = [];
  let len = Number(total_week).toFixed(0); // 总星期数
  while (len >= 0) {
    // 计算出每个星期一 (倒推)
    let _monday = RETURN_DATE_TO_MILLISECONDS(temp_monday_create) + (len * 7 * 86400000);
    console.warn('每个星期一:', _monday);
    len--;
    // 每个星期区间添加到数组中
    arr_week.push({
      monday: RETURN_MILLISECONDS_TO_DATE(_monday),
      sunday: RETURN_SUNDAY(_monday),
      desc: `${RETURN_MILLISECONDS_TO_DATE(_monday)} - ${RETURN_SUNDAY(_monday)}`,
    })
  }
  // 返回可选所有星期区间
  return arr_week;
}

/**
 * 生成商户业务流水号 需保证在商户端不重复
 * 此为原版生成方式，因考虑到前后台统一规范等问题，未作变更。
 * 待实现自家后端系统后，此处可根据后端新规范，重写该函数。
 */
export const GENERATE_BIZ_NO = () => {
  let date = new Date();
  let year = date.getFullYear();
  let mon = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getMinutes();
  let min = date.getSeconds();
  let arr = [];
  for (let i = 0; i < 6; i++) {
    let num = parseInt(Math.random() * 9);
    arr.push(num);
  }
  let bizno = `${year}${mon}${day}${hour}${min}${arr.join('')}`;
  console.warn('生成单号:', bizno);
  return bizno;
}



