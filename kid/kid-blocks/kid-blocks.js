/*
 * @Author: Satya
 * @Date: 2020-11-17 15:10:53
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-21 09:29:11
 * doc: KidBlocks的创建可部分赋值
 */

window.KidBlocks = {
  /** MSG CN */
  Msg: Msg,
  /** 基础常量 */
  ...CONSTANTS,
  /** 类或对象的注册注销相关 */
  registry: Registry,

  /** utils 对象的各个工具.js */
  utils: {
    /** 坐标及位置 */
    Coordinate: UtilCoordinate,
    /** 矩形 */
    Rect: UtilRect,
    /** 颜色 */
    colour: UtilColour,
    /** 字符串操作 */
    string: UtilString,
    /** size操作 */
    Size: UtilSize,
    /** 元素样式的实用 */
    style: UtilStyle,
    /** 用户代理检测 */
    userAgent: UtilUserAgent,
    /** 其他工具函数 此处解构 */
    ...Utils,
  },
  /** 工作空间 */
  //   Workspace: Workspace,
  /** 事件 */
  //   Events: Events,
};

console.log("KidBlocks:", KidBlocks);
