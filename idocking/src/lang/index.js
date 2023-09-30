/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-10-09 15:53:08
 * @LastEditTime: 2019-10-11 13:27:37
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import Store from '@/store'
import zhMsg from './zh'
import enMsg from './en'
import ElementLocale from 'element-ui/lib/locale'
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enMsg,
    ...elementEnLocale
  },
  zh: {
    ...zhMsg,
    ...elementZhLocale
  }
}

const i18n = new VueI18n({
  locale: Cookies.get('language') || 'en',
  messages,
})

ElementLocale.i18n((key, value) => i18n.t(key, value))
export default i18n
