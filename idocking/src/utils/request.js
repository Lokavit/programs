/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:51
 * @LastEditTime: 2019-11-05 09:36:25
 */
// let $t = window.vm.$i18n.t
import i18n from '@/lang'
import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 30000
})

service.interceptors.request.use(
  config => {

    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${ getToken() }`
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {

    return response
  },
  error => {
    if(error.message.includes('timeout')){
      Message({showClose: true,message: i18n.t('errCode.timeout'),type: 'error'});
      return Promise.reject(error);
    }

    // if(error.response.data
    //   &&error.response.data.message
    //   &&error.response.data.message!=''
    //   ||error.response.data.message!=null
    // ){
    //   Message({
    //     showClose: true,
    //     message: error.response.data.message,
    //     type: 'error'
    //   })
    //   return Promise.reject(error);
    // }
    var message = error.response.data.message
    let code = error.response.status;
    switch(code) {
      case 400: Message({showClose: true,message: message,type: 'error'});console.error(message);break;
      case 401: Message({showClose: true,message: i18n.t('errCode.c401'),type: 'error'});console.error(message);break;
      case 403: Message({showClose: true,message: i18n.t('errCode.c403'),type: 'error'});console.error(message);break;
      case 404: Message({showClose: true,message: i18n.t('errCode.c404'),type: 'error'});console.error(message);break;
      case 500: Message({showClose: true,message: i18n.t('errCode.c500'),type: 'error'});console.error(message);break;
      default:Message({showClose: true,message: i18n.t('errCode.unknown'),type: 'error'});console.error(message);break;
    }

    return Promise.reject(err);
  }
)

export default service
