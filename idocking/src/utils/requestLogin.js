/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:51
 * @LastEditTime: 2019-10-10 14:48:30
 */
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_LOGIN_URL,
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    config.headers.common['Authorization'] = 'Basic Y2xpZW50OnNlY3JldA==';
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if(error.message.includes('timeout')){
      Message({showClose: true,message: '请求超时!',type: 'error'});
      return Promise.reject(error);
    }

    if(error.response.data
      &&error.response.data.message
      &&error.response.data.message!=''
      ||error.response.data.message!=null
    ){
      Message({
        showClose: true,
        message: error.response.data.message,
        type: 'error'
      })
      return Promise.reject(error);
    }
    
    let code = error.response.status;
    switch(code) {
      case 400: Message({showClose: true,message: '操作失败!',type: 'error'});break;
      case 401: Message({showClose: true,message: '您未登陆!',type: 'error'});break;
      case 403: Message({showClose: true,message: '操作失败，您没有权限!',type: 'error'});break;
      case 404: Message({showClose: true,message: '请求不存在!',type: 'error'});break;
      case 500: Message({showClose: true,message: '服务器异常!',type: 'error'});break;
      default:Message({showClose: true,message: '未知错误!',type: 'error'});break;
    }

    return Promise.reject(err);
  }
)

export default service
