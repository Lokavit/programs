/**
 * axios HTTP庫，創建並實例化，處理攔截
 */
import axios from 'axios';
import {
  Message
} from 'element-ui';

// import {
//   getToken
// } from '../utils/auth'
// import store from '../store/store'

export const HTTP = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  // baseURL: 'http://192.168.1.5:9000', // 后台接口
  baseURL: 'http://221.2.155.86:9000', // 后台接口 [外网]
  timeout: 5000, // 請求限時
})

/**
 *  request 請求攔截
 */
HTTP.interceptors.request.use(
  config => {
    // config.headers.get['Content-Type'] = 'application/json;charset=UTF-8';
    // config.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    // 如果获取到token ，每个请求的请求头，携带token,
    // // 獲取到token值
    // if (store.getters.token) {
    //   // 每個請求的請求頭，攜帶token [Authorization]自定義Key
    //   config.headers['Authorization'] = getToken()
    // }

    // 在这里统一处理，请求拦截 ，如条件查询时， 将query 解析为url get 带参
    // console.log('请求拦截中的url：', config.url);
    // console.log('请求拦截中的params:', config.params);

    // // 统一第一页？
    // console.log('请求拦截：', config);

    return config; //返回配置
  },
  error => {
    // 请求拦截的异常处理区域。
    // console.log('请求错误拦截 ERROR:',error);
    return Promise.reject(error)
  }
)

/**
 * response 響應攔截
 */
HTTP.interceptors.response.use(
  response => {

    if (response.status == 200) {
      // 该代码段为：Excel 下载所需
      if (response.data.type == "application/vnd.ms-excel") {
        return response;
      }
      // 非 文件下载，执行此处
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
  error => {
    if (error.response) {
      switch (error.response.status) {
        /** 请求错误(400) */
        case 400:
          // error.response.data.errorMsg 
          Message.warning(error.response.data.message);
          break;
        case 500:
          Message.warning(err.response.data.message);
          break;
        default:
          Message.warning(err.response.data.message);
      }
    } else {}
    return Promise.reject(error.response);
  }
)

/**
 *    if (err && err.response) {
        switch (err.response.status) {
            case 400: err.message = '请求错误(400)'; break;
            case 401: err.message = '未授权，请重新登录(401)'; break;
            case 403: err.message = '拒绝访问(403)'; break;
            case 404: err.message = '请求出错(404)'; break;
            case 408: err.message = '请求超时(408)'; break;
            case 500: err.message = '服务器错误(500)'; break;
            case 501: err.message = '服务未实现(501)'; break;
            case 502: err.message = '网络错误(502)'; break;
            case 503: err.message = '服务不可用(503)'; break;
            case 504: err.message = '网络超时(504)'; break;
            case 505: err.message = 'HTTP版本不受支持(505)'; break;
            default: err.message = `连接出错(${err.response.status})!`;
        }
    } else {
        err.message = '连接服务器失败!'
    }
 */