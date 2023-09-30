/*
 * @Author: Satya
 * @Date: 2020-06-13 14:39:47
 * @Last Modified by: Satya
 * @Last Modified time: 2020-06-16 13:53:33
 * doc:块类型名称到块原型对象的映射
 */

"use strict";

/**
 * @name Blockly.Blocks
 */
goog.provide("Blockly.Blocks");

/*
 * 块类型名称到块原型对象的映射.
 * @type {!Object.<string,Object>}
 * Blockly:其中所有，含Blocks
 * Blockly.Blocks:是其中所有对象原型。如motion_jump里是init函数，即创建积木块
 */
Blockly.Blocks = new Object(null);
// console.log("块类型名称到块原型对象的映射.js:", Blockly);
// console.log("块类型名称到块原型对象的映射.js:", Blockly.Blocks);
// console.log("块类型名称到块原型对象的映射.js goog:", goog);
