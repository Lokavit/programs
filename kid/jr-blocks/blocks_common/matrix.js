/*
 * @Author: Satya
 * @Date: 2020-06-12 14:02:04
 * @Last Modified by:   Satya
 * @Last Modified time: 2020-06-12 14:02:04
 * doc: 矩阵值 积木块
 */

"use strict";

goog.provide("Blockly.Blocks.matrix");
goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.constants");

/** 矩阵值 */
Blockly.Blocks["matrix"] = {
  /**
   * Block for matrix value.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_matrix",
          name: "MATRIX",
        },
      ],
      outputShape: Blockly.OUTPUT_SHAPE_ROUND,
      output: "Number",
      extensions: ["colours_pen"],
    });
  },
};
