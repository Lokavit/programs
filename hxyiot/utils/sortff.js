// function jsonsort(data) {
//   var keys = Object.keys(data).sort();
//   var json = {};
//   for (var i = 0; i < keys.length; i++) {
//     json[keys[i]] = data[keys[i]];
//   }
//   return json;
// }

// /**
// * key排序+转换字符串(加密用)
// * @param {object} data 待加密数据
// * @returns 字符串
// * @DateTime 2020.02.25
// */
// export function jsonsort(data) {
//   console.log('传入的待加密数据:', data);
//   let stringToBeSigned = "";
//   let keys = Object.keys(data).sort();
//   for (let i = 0; i < keys.length; i++) {
//     if (i == 0) {
//       stringToBeSigned += keys[i] + "=" + data[keys[i]];
//     } else {
//       stringToBeSigned += "&" + keys[i] + "=" + data[keys[i]];
//     }
//   }
//   console.log('key排序+转换', stringToBeSigned);
//   return stringToBeSigned;
// }
