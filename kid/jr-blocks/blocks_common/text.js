/*
 * @Author: Satya
 * @Date: 2020-06-12 14:04:03
 * @Last Modified by: Satya
 * @Last Modified time: 2020-06-12 14:04:43
 * doc:文本内容 积木块
 */

"use strict";

goog.provide("Blockly.Blocks.texts");
goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.constants");

/** 文本内容 积木块 */
Blockly.Blocks["text"] = {
  /**
   * Block for text value.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_input",
          name: "TEXT",
        },
      ],
      output: "String",
      outputShape: Blockly.OUTPUT_SHAPE_ROUND,
      colour: Blockly.Colours.textField,
      colourSecondary: Blockly.Colours.textField,
      colourTertiary: Blockly.Colours.textField,
    });
  },
};
