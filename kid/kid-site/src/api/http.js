/**
 * axios HTTP庫，創建並實例化，處理攔截
 */
import axios from "axios";

export const HTTP = axios.create({
  /** @description 后台接口 */
  baseURL: "/",
  /** @description 請求限時 */
  timeout: 5000,
  /** @description 允许cookie */
  withCredentials: true,
});

/**
 *  request 請求攔截
 */
HTTP.interceptors.request.use(
  (config) => {
    // config.headers.get['Content-Type'] = 'application/json;charset=UTF-8';
    // config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

    // 在这里统一处理，请求拦截 ，如条件查询时， 将query 解析为url get 带参
    // console.log('请求拦截中的url：', config.url);
    // console.log('请求拦截中的params:', config.params);
    console.log("请求拦截：", config);

    return config; //返回配置
  },
  (error) => {
    // 请求拦截的异常处理区域。
    // console.log('请求错误拦截 ERROR:',error);
    return Promise.reject(error);
  }
);

/**
 * response 響應攔截
 */
HTTP.interceptors.response.use(
  (response) => {
    if (response.status == 200) {
      const res = response.data; // 从 data里面的数据开始返回
      return res;
    } else {
      // 非200 非错误的情况下
      // console.log("响应拦截非200:", response);
    }
  },

  //   if (res.code !== 200) {
  //     console.error(res.message);
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     // if (res.code === 5000 || res.code === 50012 || res.code === 50014) {
  //     //   store.dispatch('user/resetToken').then(() => {
  //     //     location.reload()
  //     //   })
  //     // }
  //     return Promise.reject(res.message || 'error')
  //   } else {
  //     console.log('响应拦截 ELSE:', res);
  //     return res
  //   }
  // },

  /**
   * 异常处理区域
   */
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        /** 请求错误(400) */
        case 400:
          // error.response.data.errorMsg
          // Message.warning(error.response.data.message);
          break;
        case 500:
          // Message.warning(err.response.data.message);
          break;
        default:
        // Message.warning(err.response.data.message);
      }
    } else {
    }
    return Promise.reject(error.response);
  }
);
