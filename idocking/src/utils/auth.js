/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:51
 * @LastEditTime: 2019-10-10 09:07:37
 */
import Cookies from 'js-cookie'

const TOKEN_KEY = process.env.VUE_APP_TOKEN_KEY
const LANG_KEY = 'lanage'

export function getToken() {
  return Cookies.get(TOKEN_KEY)
}

export function setToken(token) {
  return Cookies.set(TOKEN_KEY, token)
}

export function removeToken() {
  return Cookies.remove(TOKEN_KEY)
}

export function getLanguage() {
  return Cookies.get(LANG_KEY)
}

export function setLanguage() {
  return Cookies.set(LANG_KEY)
}