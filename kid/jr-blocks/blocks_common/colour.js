/*
 * @Author: Satya
 * @Date: 2020-06-06 09:42:35
 * @Last Modified by: Satya
 * @Last Modified time: 2020-06-16 15:40:44
 * doc: 积木块中通用的选择颜色
 */

"use strict";

goog.provide("Blockly.Blocks.colour");
goog.require("Blockly.Blocks");
goog.require("Blockly.constants");

/**
 * 选择一个随机的颜色
 * @return {string} #RRGGBB颜色随机.
 */
function randomColour() {
  var num = Math.floor(Math.random() * Math.pow(2, 24));
  return "#" + ("00000" + num.toString(16)).substr(-6);
}

/**
 * 拾色器 积木块
 * use:<shadow type="colour_picker"></shadow>
 */
Blockly.Blocks["colour_picker"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_colour_slider",
          name: "COLOUR",
          colour: randomColour(),
        },
      ],
      // 输出形状 圆角形
      outputShape: Blockly.OUTPUT_SHAPE_ROUND,
      output: "Colour",
    });
  },
};
