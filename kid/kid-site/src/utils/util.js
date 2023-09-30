/**
 * 工具
 */

/**
 * @function 在指定范围内，生成随机不重复指定长度的整数
 * @param {*} len 指定长度
 * @param {*} start 开始值
 * @param {*} end 结束值
 */
export function generateRandInt(len, start, end) {
  let temp = [];
  function _inner(start, end) {
    let span = end - start;
    return parseInt(Math.random() * span + start);
  }
  while (temp.length < len) {
    let num = _inner(start, end);
    if (temp.indexOf(num) == -1) {
      temp.push(num);
    }
  }
  return temp;
}

// // 数组完全展开，代替 flat不支持的情况
// function arrayFlat(arr) {
//     while (arr.some(t => Array.isArray(t))) {
//         arr = [].concat.apply([], arr);
//     }
//     return arr;
// }

/**
 * 数组去重合并
 * use:let m = [1, 2, 2], n = [2,3,3];
 * console.log(combine(m,n)); // [1, 2, 3]
 */
export function combine() {
  let arr = [].concat.apply([], arguments); //没有去重复的新数组
  return Array.from(new Set(arr));
}

// /**
//  * 字符串转布尔值
//  * @param {*} str 需转换的值
//  * use:stringToBoolean("true")
//  */
// export function stringToBoolean(str) {
//     switch (str.toLowerCase()) {
//         case "true":
//         case "yes":
//         case "1":
//             return true;
//         case "false":
//         case "no":
//         case "0":
//         case null:
//             return false;
//         default:
//             return Boolean(str);
//     }
// }

/**
 * 首字母转大写
 * @param {String} str 需处理字符串
 * use:upperFirst("abc")
 * result: Abc
 */
export function upperFirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

/**
 * 字符串转驼峰
 * @param {String} str 需处理的字符串
 * use:camelCase("ab-cd-ef")
 * result:abCdEf
 */
export function camelCase(str) {
  let arr = str.split("");
  if (arr[0] == "-") {
    arr.splice(0, 1);
  }
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i] == "-") {
      arr.splice(i, 1);
      arr[i] = arr[i].toUpperCase();
    }
  }
  return arr.join("");
}

// /**
//  * 对比两个对象是否相等
//  * @param {*} obj1 对象1
//  * @param {*} obj2 对象2
//  */
// export function equalObject(obj1, obj2) {
//     // 类型对比
//     if (!(obj1 instanceof Object) || !(obj2 instanceof Object)) return false;
//     // obj.toString 效果与上相同 [object object],但返回的是[String]。↑返回[true/false]
//     // if (!(obj1.toString()) || !(obj2.toString())) return false;
//     // 长度对比
//     if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
//     // 每个key对比
//     return Object.keys(obj1).every(v => obj1[v] === obj2[v]);
// };

/** 生成指定长度随机字符串
 * use: getRandStr(5) // 生成指定长度字符串
 */
export function generateRandStr(len) {
  let randstr = "";
  let dict = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
  for (let i = 0; i < len; i++) {
    let index = Math.floor(Math.random() * dict.length);
    randstr += dict[index];
  }
  return randstr;
}
