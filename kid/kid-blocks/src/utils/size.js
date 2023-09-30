/*
 * @Author: Satya
 * @Date: 2020-11-19 11:06:59
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-19 14:01:24
 * doc: 尺寸计算的实用方法
 */

/**
 * @function 表示由宽度和高度组成的尺寸的类
 * @param {*} width
 * @param {*} height
 */
const UtilSize = function (width, height) {
  this.width = width;
  this.height = height;
};

/**
 * @function 比较两个size是否相等
 * @param {*} a
 * @param {*} b
 */
UtilSize.equals = function (a, b) {
  if (a == b) return true;
  if (!a || !b) return false;
  return a.width == b.width && a.height == b.height;
};
