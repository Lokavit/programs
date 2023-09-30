/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:51
 * @LastEditTime: 2019-10-10 09:38:08
 */
import defaultSettings from '@/settings'
import Cookies from 'js-cookie'

const defaultTitle = defaultSettings.title || 'I-DOCKING'

export default function getPageTitle(meta) {

  let lang = Cookies.get('language') || 'en'
  let title

  if (lang === 'zh') {
    title = meta.cn_title
  } else {
    title = meta.title
  }

  return defaultTitle
}
