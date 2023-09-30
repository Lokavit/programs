/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:50
 * @LastEditTime: 2020-03-09 12:52:41
 */
import request from '@/utils/request'

export function updateLangData(lang) {
  lang = lang === 'zh' ? 'Chinese' : 'English'
  return request.get(`/dict?language=${lang}`)

  // if (lang == 'zh') {
  //   return Promise.resolve({
  //     navHeader: {
  //       logout: '退出登录'
  //     },
  //     // @/layout/components/navHeader.vue
  //     msgboxLang: {
  //       ok: '确定',
  //       cancel: '取消',
  //       title: '提示',
  //       content: '确定要切换语言吗?'
  //     },
  //     // @/utils/request.js
  //     errCode: {
  //       timeout: '请求超时!',
  //       c400: '操作失败!',
  //       c401: '您未登陆!',
  //       c403: '操作失败，您没有权限!',
  //       c404: '请求不存在!',
  //       c500: '服务器异常!',
  //       unkonwn: '未知错误!'
  //     },
  //     // @/view/baseinfo/page/index.vue
  //     baseInfo: {
  //       company: '船舶管理公司管理',
  //       shipowner: '船东管理',
  //       shipflag: '船籍社管理',
  //       ship: '船舶管理',
  //       cert: '船舶证书管理',
  //       person: '人员管理',
  //       shipyard: '船厂管理'
  //     },
  //     shipInfo: {
  //       table:{
  //         name: '名称',
  //         type: '类型',
  //         shipid: '船舶识别号',
  //         owner: '船东',
  //         ops: '操作'
  //       },
  //       add: '添加'
  //     }
  //   })
  // } else {
  //   return Promise.resolve({
  //     navHeader: {
  //       logout: 'logout'
  //     },
  //     // @/layout/components/navHeader.vue
  //     msgboxLang: {
  //       ok: 'Ok',
  //       cancel: 'Cancel',
  //       title: 'Info',
  //       content: 'Do you want to switch languages?'
  //     },
  //     // @/utils/request.js
  //     errCode: {
  //       timeout: 'timeout.',
  //       c400: 'operation failed.',
  //       c401: 'You are not logged in.',
  //       c403: 'The operation failed. You have no privileges.',
  //       c404: 'The request does not exist.',
  //       c500: 'Server exception.',
  //       unkonwn: 'unknown error.'
  //     },
  //     // @/view/baseinfo/page/index.vue
  //     baseInfo: {
  //       company: 'Ship-Company',
  //       shipowner: 'Shipowner',
  //       shipflag: 'Registration Society',
  //       ship: 'Ship',
  //       cert: 'Shipping certificate',
  //       person: 'Person',
  //       shipyard: 'Shipyard'
  //     },
  //     shipInfo: {
  //       table:{
  //         name: 'Name',
  //         type: 'Type',
  //         shipid: 'ShipID',
  //         owner: 'ShipOwner',
  //         ops: 'Operation'
  //       },
  //       add: 'Add'
  //     }
  //   })
  // }
}
