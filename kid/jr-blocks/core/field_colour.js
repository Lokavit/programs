/*
 * @Author: Satya
 * @Date: 2020-06-06 09:45:54
 * @Last Modified by: Satya
 * @Last Modified time: 2020-06-16 15:40:56
 * doc: 颜色输入字段的类
 */

/**
 * @fileoverview 颜色输入栏.
 * @author fraser@google.com (Neil Fraser)
 */
"use strict";

goog.provide("Blockly.FieldColour");

goog.require("Blockly.Field");
goog.require("Blockly.utils");

goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.style");
goog.require("goog.ui.ColorPicker");

/**
 * 颜色输入字段的类.
 * @param {string} colour 初始颜色为“ #rrggbb”格式.
 * @param {Function=} opt_validator 选择新颜色时执行的功能。 它唯一的参数是新的颜色值。 除非未定义，否则它的返回值将成为选定的颜色，在这种情况下，将保留新的颜色；否则，该返回值将为null，在这种情况下，更改将中止.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldColour = function (colour, opt_validator) {
  console.log(colour);
  Blockly.FieldColour.superClass_.constructor.call(this, colour, opt_validator);
  this.addArgType("colour");
};
goog.inherits(Blockly.FieldColour, Blockly.Field);

/**
 * 从JSON arg对象构造FieldColour.
 * @param {!Object} options 带有选项（颜色）的JSON对象.
 * @returns {!Blockly.FieldColour} 新的字段实例.
 * @package
 * @nocollapse
 */
Blockly.FieldColour.fromJson = function (options) {
  return new Blockly.FieldColour(options["colour"]);
};

/**
 * 默认情况下，对颜色使用全局常量.
 * @type {Array.<string>}
 * @private
 */
Blockly.FieldColour.prototype.colours_ = null;

/**
 * 默认情况下，对列使用全局常量.
 * @type {number}
 * @private
 */
Blockly.FieldColour.prototype.columns_ = 0;

/**
 * 将此字段安装在块上.
 * @param {!Blockly.Block} block 包含该字段的块.
 */
Blockly.FieldColour.prototype.init = function (block) {
  // 颜色字段已被初始化一次.
  if (this.fieldGroup_) return;
  Blockly.FieldColour.superClass_.init.call(this, block);
  this.setValue(this.getValue());
};

/**
 * 在启动编辑器的热点上时的鼠标光标样式.
 */
Blockly.FieldColour.prototype.CURSOR = "default";

/**
 * 如果要删除此输入，请关闭颜色选择器.
 */
Blockly.FieldColour.prototype.dispose = function () {
  Blockly.WidgetDiv.hideIfOwner(this);
  Blockly.FieldColour.superClass_.dispose.call(this);
};

/**
 * 返回当前颜色.
 * @return {string} 当前颜色为“ #rrggbb”格式.
 */
Blockly.FieldColour.prototype.getValue = function () {
  return this.colour_;
};

/**
 * 设置颜色.
 * @param {string} colour 新颜色 '#rrggbb' format.
 */
Blockly.FieldColour.prototype.setValue = function (colour) {
  if (
    this.sourceBlock_ &&
    Blockly.Events.isEnabled() &&
    this.colour_ != colour
  ) {
    Blockly.Events.fire(
      new Blockly.Events.BlockChange(
        this.sourceBlock_,
        "field",
        this.name,
        this.colour_,
        colour
      )
    );
  }
  this.colour_ = colour;
  if (this.sourceBlock_) {
    // 将此原色，第二色和第三色设置为此值.
    // 渲染器希望能够使用辅助颜色作为阴影的填充.
    this.sourceBlock_.setColour(colour, colour, colour);
  }
};

/**
 * 从此字段获取文本。 块折叠时使用.
 * @return {string} Current text.
 */
Blockly.FieldColour.prototype.getText = function () {
  var colour = this.colour_;
  // 如果可能，尝试使用#rgb格式，而不是#rrggbb.
  var m = colour.match(/^#(.)\1(.)\2(.)\3$/);
  if (m) {
    colour = "#" + m[1] + m[2] + m[3];
  }
  return colour;
};

/**
 * 返回固定的高度和宽度.
 * @return {!goog.math.Size} 高度和宽度.
 */
Blockly.FieldColour.prototype.getSize = function () {
  return new goog.math.Size(
    Blockly.BlockSvg.FIELD_WIDTH,
    Blockly.BlockSvg.FIELD_HEIGHT
  );
};

/**
 * 调色板的颜色字符串数组.
 * goog.ui.ColorPicker.SIMPLE_GRID_COLORS为Blockly色板选择矩阵的所有预设颜色
 * 数组形式，一共70个预设颜色
 * @type {!Array.<string>}
 */
Blockly.FieldColour.COLOURS = goog.ui.ColorPicker.SIMPLE_GRID_COLORS;

/**
 * 调色板中的列数.
 */
Blockly.FieldColour.COLUMNS = 7;

/**
 * 为该字段设置自定义颜色网格.
 * @param {Array.<string>} colours 此块的颜色数组，或者为null以使用默认值（Blockly.FieldColour.COLOURS）.
 * @return {!Blockly.FieldColour} 返回自身（用于方法链接）.
 */
Blockly.FieldColour.prototype.setColours = function (colours) {
  this.colours_ = colours;
  return this;
};

/**
 * 设置此字段的自定义网格大小.
 * @param {number} columns 此块的列数，或使用0以使用默认值（Blockly.FieldColour.COLUMNS）.
 * @return {!Blockly.FieldColour} 返回自身（用于方法链接）.
 */
Blockly.FieldColour.prototype.setColumns = function (columns) {
  this.columns_ = columns;
  return this;
};

/**
 * 在颜色字段下创建一个调色板.
 * @private
 */
Blockly.FieldColour.prototype.showEditor_ = function () {
  Blockly.WidgetDiv.show(
    this,
    this.sourceBlock_.RTL,
    Blockly.FieldColour.widgetDispose_
  );

  // 在添加小部件之前记录视口尺寸.
  var viewportBBox = Blockly.utils.getViewportBBox();
  var anchorBBox = this.getScaledBBox_();

  // 创建并添加颜色选择器，然后记录尺寸.
  var picker = this.createWidget_();
  var paletteSize = goog.style.getSize(picker.getElement());

  // Position the picker to line up with the field.
  Blockly.WidgetDiv.positionWithAnchor(
    viewportBBox,
    anchorBBox,
    paletteSize,
    this.sourceBlock_.RTL
  );

  // 配置事件处理程序.
  var thisField = this;
  Blockly.FieldColour.changeEventKey_ = goog.events.listen(
    picker,
    goog.ui.ColorPicker.EventType.CHANGE,
    function (event) {
      var colour = event.target.getSelectedColor() || "#000000";
      Blockly.WidgetDiv.hide();
      if (thisField.sourceBlock_) {
        // Call any validation function, and allow it to override.
        colour = thisField.callValidator(colour);
      }
      if (colour !== null) {
        thisField.setValue(colour);
      }
    }
  );
};

/**
 * 创建一个颜色选择器小部件并将其呈现在小部件div中.
 * @return {!goog.ui.ColorPicker} The newly created color picker.
 * @private
 */
Blockly.FieldColour.prototype.createWidget_ = function () {
  // Create the palette using Closure.
  var picker = new goog.ui.ColorPicker();
  picker.setSize(this.columns_ || Blockly.FieldColour.COLUMNS);
  picker.setColors(this.colours_ || Blockly.FieldColour.COLOURS);
  var div = Blockly.WidgetDiv.DIV;
  picker.render(div);
  picker.setSelectedColor(this.getValue());
  return picker;
};

/**
 * 隐藏调色板.
 * @private
 */
Blockly.FieldColour.widgetDispose_ = function () {
  if (Blockly.FieldColour.changeEventKey_) {
    goog.events.unlistenByKey(Blockly.FieldColour.changeEventKey_);
  }
  Blockly.Events.setGroup(false);
};

/** 注册 该色板 */
Blockly.Field.register("field_colour", Blockly.FieldColour);
