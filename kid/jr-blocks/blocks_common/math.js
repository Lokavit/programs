/*
 * @Author: Satya
 * @Date: 2020-06-12 13:53:18
 * @Last Modified by: Satya
 * @Last Modified time: 2020-06-12 13:59:30
 * doc: math相关积木块
 * 普通数值
 * 整数值
 * 整数(无负数 无小数)
 * 正数(含小数)
 * 角度选择器
 */

"use strict";

goog.provide("Blockly.Blocks.math");
goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.constants");

/** 普通数值 积木块 */
Blockly.Blocks["math_number"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_number",
          name: "NUM",
          value: "0",
        },
      ],
      output: "Number", // 输出数值
      // 输出形状
      outputShape: Blockly.OUTPUT_SHAPE_ROUND,
      // 主色
      colour: Blockly.Colours.textField,
      // 第二色
      colourSecondary: Blockly.Colours.textField,
      // 第三色
      colourTertiary: Blockly.Colours.textField,
    });
  },
};

/** 整数值 积木块 */
Blockly.Blocks["math_integer"] = {
  /**
   * Block for integer value (no decimal, + or -).
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_number",
          name: "NUM",
          precision: 1,
        },
      ],
      output: "Number",
      outputShape: Blockly.OUTPUT_SHAPE_ROUND,
      colour: Blockly.Colours.textField,
      colourSecondary: Blockly.Colours.textField,
      colourTertiary: Blockly.Colours.textField,
    });
  },
};

/** 整数(无负数 无小数) 积木块  */
Blockly.Blocks["math_whole_number"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_number",
          name: "NUM",
          min: 0,
          precision: 1,
        },
      ],
      output: "Number",
      outputShape: Blockly.OUTPUT_SHAPE_ROUND,
      colour: Blockly.Colours.textField,
      colourSecondary: Blockly.Colours.textField,
      colourTertiary: Blockly.Colours.textField,
    });
  },
};

/** 正数(含小数) 积木块  */
Blockly.Blocks["math_positive_number"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_number",
          name: "NUM",
          min: 0,
        },
      ],
      output: "Number",
      outputShape: Blockly.OUTPUT_SHAPE_ROUND,
      colour: Blockly.Colours.textField,
      colourSecondary: Blockly.Colours.textField,
      colourTertiary: Blockly.Colours.textField,
    });
  },
};

/** 角度选择器 积木块 */
Blockly.Blocks["math_angle"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_angle",
          name: "NUM",
          value: 90,
        },
      ],
      output: "Number",
      outputShape: Blockly.OUTPUT_SHAPE_ROUND,
      colour: Blockly.Colours.textField,
      colourSecondary: Blockly.Colours.textField,
      colourTertiary: Blockly.Colours.textField,
    });
  },
};
