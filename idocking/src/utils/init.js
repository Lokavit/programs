/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-11 12:58:45
 * @LastEditTime: 2019-10-11 15:33:18
 */
import Cookies from 'js-cookie'
import i18n from '@/lang'
import { updateLangData } from '@/api/app'

// 刷新页面则删除旧的语言文件
localStorage.removeItem('en')
localStorage.removeItem('zh')

var curLang = Cookies.get('language')
if (!curLang) {
  // 初始化程序，设置默认语言
  Cookies.set('language', 'en')
}


// 用服务器的字典国际化文件
// curLang = Cookies.get('language')
// var langData = localStorage.getItem(curLang)
// if(!langData) {
//   updateLangData(curLang).then(response => {
//     var { data } = response
//     // 这里需要判断下，如果服务器没返回数据，则不进行下列赋值操作(用本地文件)
    
//     localStorage.setItem(curLang, JSON.stringify(data))
//     i18n.mergeLocaleMessage(curLang, Object.assign(data))
//     i18n.locale = curLang  // 要加
//   })
// } else {
//   i18n.mergeLocaleMessage(curLang, Object.assign(data))
// }