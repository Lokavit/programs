/*
 * @Author: Satya
 * @Date: 2020-11-18 10:13:00
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-19 13:45:10
 * doc: 坐标操作
 */

/**
 * @function 坐标及位置
 * @param {*} x
 * @param {*} y
 */
const UtilCoordinate = function (x, y) {
  // console.log("坐标及位置:", x, y);
  this.x = x;
  this.y = y;
};

/**
 * @function 比较坐标是否相等
 * @param {*} a
 * @param {*} b
 */
UtilCoordinate.equals = function (a, b) {
  // console.log("比较坐标是否相等:", a, b);
  if (!a || !b) return false;
  if (a == b) return true;
  if (!a == !b) return false;
  return a.x == b.x && a.y == b.y;
};

/**
 * @function 返回两个坐标之间的距离
 * @param {*} a
 * @param {*} b
 */
UtilCoordinate.distance = function (a, b) {
  // console.log("返回两个坐标之间的距离:", a, b);
  //   if (!a || !b) return;
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * @function 返回坐标的大小
 * @param {*} a
 */
UtilCoordinate.magnitude = function (a) {
  // console.log("返回坐标的大小:", a);
  return Math.sqrt(a.x * a.x + a.y * a.y);
};

/**
 * @function 返回两个坐标之间的差作为新的坐标及位置
 * @param {*} a
 * @param {*} b
 */
UtilCoordinate.difference = function (a, b) {
  // console.log("返回两个坐标之间的差作为新的坐标及位置:", a, b);
  //   if (!a || !b) return;
  // console.log("坐标差:", new UtilCoordinate(a.x - b.x, a.y - b.y));
  return new UtilCoordinate(a.x - b.x, a.y - b.y);
};

/**
 * @function 返回两个坐标的和作为新的坐标及位置
 * @param {*} a
 * @param {*} b
 */
UtilCoordinate.sum = function (a, b) {
  // console.log("返回两个坐标的和作为新的坐标及位置:", a, b);
  return new UtilCoordinate(a.x + b.x, a.y + b.y);
};

/**
 * @function 按给定的比例因子缩放此坐标
 * @param {*} s
 */
UtilCoordinate.prototype.scale = function (s) {
  // console.log("按给定的比例因子缩放此坐标:", s);
  this.x *= s;
  this.y *= s;
  return this;
};

/**
 * @function 用给定的偏移量平移此坐标
 * @param {*} tx
 * @param {*} ty
 */
UtilCoordinate.prototype.translate = function (tx, ty) {
  // console.log("按给定的比例因子缩放此坐标:", tx, ty);
  this.x += tx;
  this.y += ty;
  return this;
};
