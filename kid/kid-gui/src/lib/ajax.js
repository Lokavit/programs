import axios from "axios";
// import qs from "qs";
import { resolve } from "path";
import queryString from "query-string";

const instance = axios.create({
  baseURL: `${GLOBAL_URL.HOST_API}`,

  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});

/**
 * 发起get请求
 * @param {*} url 请求路径，只需要相对路径即可
 * @param {*} handler
 */
var get = function (url, handler) {
  return instance
    .get(url)
    .catch(function (error) {
      console.error("网络请求异常", "请求地址：" + url);
    })
    .then((response) => {
      if (response.status != 200) {
        console.error("网络请求异常", "请求地址：" + url);
      } else {
        if (handler) {
          return handler(response.data);
        } else {
          return new Promise(function (resolve) {
            resolve(response.data);
          });
        }
      }
    });
};
/**
 * 发起Post请求
 * @param {*} url 请求路径，相对路径即可
 * @param {*} data 请求参数
 * @param {*} handler 回调函数
 */
var post = function (url, data, handler) {
  console.log("queryString.stringify(data):", queryString.stringify(data));
  return (
    instance
      // .post(url, qs.stringify(data))
      .post(url, queryString.stringify(data))
      .catch(function (error) {
        console.error("网络请求异常", "请求地址：" + url);
      })
      .then((response) => {
        if (response.status != 200) {
          console.error("网络请求异常", "请求地址：" + url);
        } else {
          if (handler) {
            return handler(response.data);
          } else {
            return new Promise(function (resolve) {
              resolve(response.data);
            });
          }
        }
      })
  );
};

// var download = function (url, handler) {
//   console.log("七牛云项目拉取地址:", url);
//   return axios
//     .get(url, {
//       responseType: "blob",
//     })
//     .catch(function (error) {
//       console.error("文件加载失败", "请求地址：" + url);
//     })
//     .then((res) => {
//       console.log("下载的 res", res);
//       if (handler) {
//         console.log("下载的handler", handler(res));
//         return handler(res);
//       } else {
//         return new Promise(function (resolve) {
//           resolve(res);
//         });
//       }
//     });
// };

// export { get, post, download };
export { get, post };
