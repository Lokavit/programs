/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2017 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview 垂直积木扩展
 * 以下扩展名可以用于从头开始描述块
 * 也就是在blocks_vertical中，每个分类下，每个积木定义时，末尾"extensions":[设置颜色，设置积木类型]
 * @author fenichel@google.com (Rachel Fenichel)
 */
"use strict";

goog.provide("Blockly.ScratchBlocks.VerticalExtensions");

goog.require("Blockly.Colours");
goog.require("Blockly.constants");

/**
 * Helper function that generates an extension based on a category name.
 * 基于类别名称生成扩展名
 * The generated function will set primary, secondary, and tertiary colours
 * based on the category name. 生成的函数将根据类别名称设置原色(背景色)，第二色(边框色)和第三色
 * @param {String} category The name of the category to set colours for.
 * @return {function} An extension function that sets colours based on the given
 *     category. 扩展功能可根据给定类别设置颜色。例如：运动类蓝色，外观类紫色，事件类黄色等
 */
Blockly.ScratchBlocks.VerticalExtensions.colourHelper = function (category) {
  var colours = Blockly.Colours[category];
  if (!(colours && colours.primary && colours.secondary && colours.tertiary)) {
    throw new Error('Could not find colours for category "' + category + '"');
  }
  /**
   * Set the primary, secondary, and tertiary colours on this block for the
   * given category. 在积木上为给定类别设置原色，第二色(边框色)和第三色
   * @this {Blockly.Block}
   */
  return function () {
    this.setColourFromRawValues_(
      colours.primary, // 原色(背景色)
      colours.secondary, // 第二色(边框色)
      colours.tertiary // 第三色
    );
  };
};

/**
 * Extension to set the colours of a text field, which are all the same.
 * 用于设置文本字段颜色的扩展名，这些颜色都相同。原程序文本字段皆为白色
 */
Blockly.ScratchBlocks.VerticalExtensions.COLOUR_TEXTFIELD = function () {
  this.setColourFromRawValues_(
    Blockly.Colours.textField,
    Blockly.Colours.textField,
    Blockly.Colours.textField
  );
};

/**
 * SHAPE_STATEMENT:带有上下槽口的积木块{
 *    设置输入内联;
 *    设置上一个语句;
 *    设置下一个语句;}
 * @this {Blockly.Block}
 * @readonly
 */
Blockly.ScratchBlocks.VerticalExtensions.SHAPE_STATEMENT = function () {
  this.setInputsInline(true); // 设置输入内联
  this.setPreviousStatement(true, null); // 设置上一个语句
  this.setNextStatement(true, null); // 设置下一条语句
};
// /**
//  * 新增自定义形状 带阴影
//  */
// Blockly.ScratchBlocks.VerticalExtensions.SHAPE_CSSTATEMENT = function () {
//   this.setPreviousStatement(true, null); // 设置上一个语句
//   this.setNextStatement(true, null); // 设置下一条语句
// };

/**
 * SHAPE_HAT:顶部为弧形，且不含上部槽口的积木块{
 *    设置输入内联;
 *    设置下一条语句}
 * @this {Blockly.Block}
 * @readonly
 */
Blockly.ScratchBlocks.VerticalExtensions.SHAPE_HAT = function () {
  this.setInputsInline(true); // 设置输入内联
  this.setNextStatement(true, null); // 设置下一条语句
};

/**
 * SHAPE_END:底部无槽口，但顶部有槽口，通常为最终积木块{
 *    设置输入内联;
 *    设置上一个语句;}
 * @this {Blockly.Block}
 * @readonly
 */
Blockly.ScratchBlocks.VerticalExtensions.SHAPE_END = function () {
  this.setInputsInline(true); // 设置输入内联
  this.setPreviousStatement(true, null); // 设置上一个语句
};

/**
 * OUTPUT_NUMBER:输出number {
 *    设置输入内联;
 *    设置圆形输出;
 *    设置输出类型为数字类型;}
 * @this {Blockly.Block}
 * @readonly
 */
Blockly.ScratchBlocks.VerticalExtensions.OUTPUT_NUMBER = function () {
  this.setInputsInline(true); // 设置输入内联
  this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND); // 设置圆形输出
  this.setOutput(true, "Number"); // 设置输出类型为数字类型
};

/**
 * OUTPUT_STRING:输出 string {
 *    设置输入内联;
 *    设置圆形输出;
 *    设置输出类型为字符串类型;}
 * @this {Blockly.Block}
 * @readonly
 */
Blockly.ScratchBlocks.VerticalExtensions.OUTPUT_STRING = function () {
  this.setInputsInline(true); // 设置输入内联
  this.setOutputShape(Blockly.OUTPUT_SHAPE_ROUND); // 设置圆形输出
  this.setOutput(true, "String"); // 设置输出类型为字符串类型
};

/**
 * OUTPUT_BOOLEAN:输出 boolean {
 *    设置输入内联;
 *    设置输出形状六角形;
 *    设置输出类型为布尔类型;}
 * @this {Blockly.Block}
 * @readonly
 */
Blockly.ScratchBlocks.VerticalExtensions.OUTPUT_BOOLEAN = function () {
  this.setInputsInline(true); // 设置输入内联;
  this.setOutputShape(Blockly.OUTPUT_SHAPE_HEXAGONAL); // 设置输出形状六角形
  this.setOutput(true, "Boolean"); // 设置输出类型
};

/**
 * Mixin to add a context menu for a procedure definition block.
 * 混入添加上下文菜单的程序定义块
 * 它添加了"edit"选项，并删除了"duplicate"选项
 * @mixin
 * @augments Blockly.Block
 * @package
 * @readonly
 * 程序默认上下文菜单
 */
Blockly.ScratchBlocks.VerticalExtensions.PROCEDURE_DEF_CONTEXTMENU = {
  /**
   * 从上下文菜单中，添加"edit"选项，并删除了"duplicate"选项
   * @param {!Array.<!Object>} menuOptions List of menu options to edit.
   * @this Blockly.Block
   */
  customContextMenu: function (menuOptions) {
    // Add the edit option at the end. 在最后添加编辑选项
    menuOptions.push(Blockly.Procedures.makeEditOption(this));

    // Find the delete option and update its callback to be specific to
    // functions. 找到删除选项并更新其回调以特定函数
    for (var i = 0, option; (option = menuOptions[i]); i++) {
      if (option.text == Blockly.Msg.DELETE_BLOCK) {
        var input = this.getInput("custom_block");
        // this is the root block, not the shadow block. 这是根块，而不是阴影块
        if (input && input.connection && input.connection.targetBlock()) {
          var procCode = input.connection.targetBlock().getProcCode();
        } else {
          return;
        }
        var rootBlock = this;
        option.callback = function () {
          var didDelete = Blockly.Procedures.deleteProcedureDefCallback(
            procCode,
            rootBlock
          );
          if (!didDelete) {
            // TODO:(#1151)
            alert(
              "To delete a block definition, first remove all uses of the block"
            );
          }
        };
      }
    }
    // Find and remove the duplicate option 查找并删除重复的选项
    for (var i = 0, option; (option = menuOptions[i]); i++) {
      if (option.text == Blockly.Msg.DUPLICATE) {
        menuOptions.splice(i, 1);
        break;
      }
    }
  },
};

/**
 * 混入添加上下文菜单，程序调用块
 * 添加 "edit" 选项和 "define"(定义)选项.
 * @mixin
 * @augments Blockly.Block
 * @package
 * @readonly
 * 程序调用上下文菜单
 */
Blockly.ScratchBlocks.VerticalExtensions.PROCEDURE_CALL_CONTEXTMENU = {
  /**
   * Add the "edit" option to the context menu.
   * @todo Add "go to definition" option once implemented. 一旦实现，添加"转到定义"
   * @param {!Array.<!Object>} menuOptions List of menu options to edit.
   * @this Blockly.Block
   */
  customContextMenu: function (menuOptions) {
    menuOptions.push(Blockly.Procedures.makeEditOption(this));
  },
};

Blockly.ScratchBlocks.VerticalExtensions.SCRATCH_EXTENSION = function () {
  this.isScratchExtension = true;
};
/**
 * Register all extensions for scratch-blocks. 注册所有扩展以暂存块
 * @package
 */
Blockly.ScratchBlocks.VerticalExtensions.registerAll = function () {
  var categoryNames = [
    "control",
    "data",
    "data_lists",
    "sounds",
    "motion",
    "looks",
    "event",
    "sensing",
    "operators",
    "more",
    // 追加音乐分类
    "music",
    // 追加绘画分类
    "pen",
  ];
  // Register functions for all category colours. 注册所有类别颜色的功能
  for (var i = 0; i < categoryNames.length; i++) {
    var name = categoryNames[i];
    Blockly.Extensions.register(
      "colours_" + name,
      Blockly.ScratchBlocks.VerticalExtensions.colourHelper(name)
    );
  }

  // Text fields transcend categories. 文字栏位超越类别
  Blockly.Extensions.register(
    "colours_textfield",
    Blockly.ScratchBlocks.VerticalExtensions.COLOUR_TEXTFIELD
  );

  // Register extensions for common block shapes. 注册通用块形状的扩展

  // Blockly.Extensions.register(
  //   "shape_csstatement",
  //   Blockly.ScratchBlocks.VerticalExtensions.SHAPE_CSSTATEMENT
  // );

  Blockly.Extensions.register(
    "shape_statement",
    Blockly.ScratchBlocks.VerticalExtensions.SHAPE_STATEMENT
  );
  Blockly.Extensions.register(
    "shape_hat",
    Blockly.ScratchBlocks.VerticalExtensions.SHAPE_HAT
  );
  Blockly.Extensions.register(
    "shape_end",
    Blockly.ScratchBlocks.VerticalExtensions.SHAPE_END
  );

  // Output shapes and types are related. 输出类型的形状相关
  Blockly.Extensions.register(
    "output_number",
    Blockly.ScratchBlocks.VerticalExtensions.OUTPUT_NUMBER
  );
  Blockly.Extensions.register(
    "output_string",
    Blockly.ScratchBlocks.VerticalExtensions.OUTPUT_STRING
  );
  Blockly.Extensions.register(
    "output_boolean",
    Blockly.ScratchBlocks.VerticalExtensions.OUTPUT_BOOLEAN
  );

  // Custom procedures have interesting context menus. 自定义过程具有有趣的上下文菜单
  Blockly.Extensions.registerMixin(
    "procedure_def_contextmenu",
    Blockly.ScratchBlocks.VerticalExtensions.PROCEDURE_DEF_CONTEXTMENU
  );
  Blockly.Extensions.registerMixin(
    "procedure_call_contextmenu",
    Blockly.ScratchBlocks.VerticalExtensions.PROCEDURE_CALL_CONTEXTMENU
  );

  // Extension blocks have slightly different block rendering. 扩展块的块呈现方式略有不同
  Blockly.Extensions.register(
    "scratch_extension",
    Blockly.ScratchBlocks.VerticalExtensions.SCRATCH_EXTENSION
  );
};

Blockly.ScratchBlocks.VerticalExtensions.registerAll();
