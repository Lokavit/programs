/*
 * @Author: Satya
 * @Date: 2020-11-18 14:53:02
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-19 13:45:20
 * doc: 矩形
 */

/**
 * @function 矩形区域
 * @param {*} top
 * @param {*} bottom
 * @param {*} left
 * @param {*} right
 */
const UtilRect = function (top, bottom, left, right) {
  // console.info("矩阵:", top, bottom, left, right);
  this.top = top;
  this.bottom = bottom;
  this.left = left;
  this.right = right;
};

/**
 * @function 矩形是否包含x/y坐标
 * @param {*} x
 * @param {*} y
 */
UtilRect.prototype.contains = function (x, y) {
  // console.info("矩形是否包含x/y坐标:", x, y);
  return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
};
