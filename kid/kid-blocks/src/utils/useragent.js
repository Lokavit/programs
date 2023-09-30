/*
 * @Author: Satya
 * @Date: 2020-11-19 16:09:02
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-20 15:37:26
 * doc: 用户代理检测
 */

const USER_AGENT = window.navigator.userAgent;

console.info("USER_AGENT:", USER_AGENT);
function has(name) {
  // console.log("是否包含:", name);
  //   return USER_AGENT.indexOf(name.toUpperCase()) != -1;
  return USER_AGENT.indexOf(name) != -1;
}

const UtilUserAgent = {
  /** 获取用户当前浏览器信息 */
  raw: window.navigator.userAgent,

  /** @description 浏览器 */
  IE: has("Trident") || has("MSIE"),
  EDGE: has("Edg"),
  CHROME: has("Chrome") || has("CriOS"),
  JAVA_FX: has("JavaFX"),

  /** @description 引擎类 */
  WEBKIT: has("WebKit"),

  /** @description 平台类 */
  ANDROID: has("Android"),
  MAC: has("Macintosh"),
  IPAD: has("iPad"),
  IPOD: has("iPod"),
  IPHONE: has("iPhone") && !has("iPad") && !has("iPod"),

  /** @description 设备类 */
  TABLET: has("iPad") || (has("Android") && !has("Mobile")) || has("Silk"),

  get MOBILE() {
    return (
      !this.TABLET &&
      (has("iPod") || this.IPHONE || has("Android") || has("IEMobile"))
    );
  },
};

// console.log("???", UtilUserAgent);
