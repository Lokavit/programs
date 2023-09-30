/*
 * @Author: Satya
 * @Date: 2020-12-25 16:26:47
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-28 13:39:57
 * doc:注册、登入、登出相关API
 */

import { HTTP } from "./http";

/**
 * @function 获取检测登入状态
 */
export function getCheckSignState() {
  return HTTP({
    url: "user/checkLogin",
    method: "GET",
  });
}

/**
 * @function 登入请求
 * @param params 传入登入的必要信息(帐密)
 */
export function getSignIn(params) {
  return HTTP({
    url: "user/loginByAjax",
    method: "GET",
    params,
  });
}
export function getSignUp(params) {
  return HTTP({
    url: "user/registerByAjax",
    method: "GET",
    params,
  });
}

/**
 * @function 登出请求
 */
export function getSignOut() {
  return HTTP({
    url: "loginOut",
    method: "GET",
  });
}
