/*
 * @Author: Satya
 * @Date: 2020-05-21 09:18:54
 * @Last Modified by: Satya
 * @Last Modified time: 2020-06-16 09:42:20
 * doc:重写渲染积木块svg主文件
 * 以图形方式将块渲染为SVG的方法
 */

"use strict";

goog.provide("Blockly.BlockSvg.render");

goog.require("Blockly.BlockSvg");
goog.require("Blockly.scratchBlocksUtils");
goog.require("Blockly.utils");

// UI constants for rendering blocks. 呈现块的UI常量
/**
 * 网格单元的像素转换 4
 * @const
 */
Blockly.BlockSvg.GRID_UNIT = 8;

/**
 * 单个积木块内，元素之间的水平空间
 * @const
 */
Blockly.BlockSvg.SEP_SPACE_X = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 元素之间的垂直空间
 * @const
 */
Blockly.BlockSvg.SEP_SPACE_Y = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 积木的最小宽度
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 带输出的积木的最小宽度
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X_OUTPUT = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 带输出的阴影块的最小宽度
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X_SHADOW_OUTPUT = 10 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 块的最小高度
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 语句输入后额外行的高度
 * @const
 */
Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * C形或E形块的最小宽度
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT = 20 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 最小块Y单filed输出 具有输出和单个字段的阴影块的最小高度。
 * 这用于仅包含字段的阴影块-甚至小于报告器 最小块Y单场输出
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y_SINGLE_FIELD_OUTPUT =
  8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 前面有个checkbox的积木块,影响其外形. 带输出的非阴影块（即报告器）的最小高度
 * @const
 */
Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER = 10 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 最小(声明)输入高度 语句输入高度的最小空间
 * @const
 */
Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT = 6 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 垂直槽口的宽度
 * @const
 */
Blockly.BlockSvg.NOTCH_WIDTH = 4 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 垂直槽口的高度
 * @const
 */
Blockly.BlockSvg.NOTCH_HEIGHT = 4 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 圆角半径。该值影响积木块四角圆角弧度
 * @const
 */
Blockly.BlockSvg.CORNER_RADIUS = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * c型积木块的左侧连接最小宽度（以px为单位）
 * @const
 */
Blockly.BlockSvg.STATEMENT_INPUT_EDGE_WIDTH = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * c型积木块 内中(上凸下凹)槽口距左连接的宽度(该空间调整合适值，才能完全对接内中积木块)
 * @const
 */
Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE = 1 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 顶部为弧形的曲线的路径。
 * @const
 */
// Blockly.BlockSvg.START_HAT_PATH = "c 25,-22 71,-22 76,0";
Blockly.BlockSvg.START_HAT_PATH =
  "A " +
  Blockly.BlockSvg.CORNER_RADIUS +
  "," +
  Blockly.BlockSvg.CORNER_RADIUS +
  " 0 0,1 " +
  Blockly.BlockSvg.CORNER_RADIUS +
  ",0" +
  "h 60";

/**
 * 顶部弧形的积木块的高度
 * @const
 */
Blockly.BlockSvg.START_HAT_HEIGHT = 12;

/**
 * 出现在块左边缘的图标（例如扩展图标）的垂直分隔线的高度。图标分隔符高度
 * @const
 */
Blockly.BlockSvg.ICON_SEPARATOR_HEIGHT = 10 * Blockly.BlockSvg.GRID_UNIT;
/**
 * 凹口左至右的SVG路径。此处内中h表示(凹的中间水平线长度)
 * @const
 */
Blockly.BlockSvg.NOTCH_PATH_LEFT =
  "c 2,0 3,1 4,2 " +
  "l 4,4 " +
  "c 1,1 2,2 4,2 " +
  "h 24 " +
  "c 2,0 3,-1 4,-2 " +
  "l 4,-4 " +
  "c 1,-1 2,-2 4,-2";

/**
 * 凹口右至左的SVG路径。此处内中h表示(凸的中间水平线长度)
 * @const
 */
Blockly.BlockSvg.NOTCH_PATH_RIGHT =
  "c -2,0 -3,1 -4,2 " +
  "l -4,4 " +
  "c -1,1 -2,2 -4,2 " +
  "h -24 " +
  "c -2,0 -3,-1 -4,-2 " +
  "l -4,-4 " +
  "c -1,-1 -2,-2 -4,-2";

/**
 * 缺口前的填充量。
 * @const
 */
Blockly.BlockSvg.NOTCH_START_PADDING = 3 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 绘制左上角的SVG起点 = "m 0,圆角半径的值"
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER_START =
  "m 0," + Blockly.BlockSvg.CORNER_RADIUS;

/**
 * 绘制左上角弧形的SVG路径。
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER =
  "A " +
  Blockly.BlockSvg.CORNER_RADIUS +
  "," +
  Blockly.BlockSvg.CORNER_RADIUS +
  " 0 0,1 " +
  Blockly.BlockSvg.CORNER_RADIUS +
  ",0";

/**
 * 绘制右上角弧形的SVG路径。
 * @const
 */
Blockly.BlockSvg.TOP_RIGHT_CORNER =
  "a " +
  Blockly.BlockSvg.CORNER_RADIUS +
  "," +
  Blockly.BlockSvg.CORNER_RADIUS +
  " 0 0,1 " +
  Blockly.BlockSvg.CORNER_RADIUS +
  "," +
  Blockly.BlockSvg.CORNER_RADIUS;

/**
 * 绘制右下角的弧形的SVG路径
 * @const
 */
Blockly.BlockSvg.BOTTOM_RIGHT_CORNER =
  " a " +
  Blockly.BlockSvg.CORNER_RADIUS +
  "," +
  Blockly.BlockSvg.CORNER_RADIUS +
  " 0 0,1 -" +
  Blockly.BlockSvg.CORNER_RADIUS +
  "," +
  Blockly.BlockSvg.CORNER_RADIUS;

/**
 * 绘制左下角弧形的SVG路径。
 * @const
 */
Blockly.BlockSvg.BOTTOM_LEFT_CORNER =
  "a " +
  Blockly.BlockSvg.CORNER_RADIUS +
  "," +
  Blockly.BlockSvg.CORNER_RADIUS +
  " 0 0,1 -" +
  Blockly.BlockSvg.CORNER_RADIUS +
  ",-" +
  Blockly.BlockSvg.CORNER_RADIUS;

/**
 * 绘制输入框左上角弧形的SVG路径。
 * @const
 */
Blockly.BlockSvg.INNER_TOP_LEFT_CORNER =
  " a " +
  Blockly.BlockSvg.CORNER_RADIUS +
  "," +
  Blockly.BlockSvg.CORNER_RADIUS +
  " 0 0,0 -" +
  Blockly.BlockSvg.CORNER_RADIUS +
  "," +
  Blockly.BlockSvg.CORNER_RADIUS;

/**
 * 绘制输入框左下角弧形的SVG路径。包括圆角内角
 * @const
 */
Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER =
  "a " +
  Blockly.BlockSvg.CORNER_RADIUS +
  "," +
  Blockly.BlockSvg.CORNER_RADIUS +
  " 0 0,0 " +
  Blockly.BlockSvg.CORNER_RADIUS +
  "," +
  Blockly.BlockSvg.CORNER_RADIUS;

/**
 * 空六边形输入框形状的SVG路径。
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL =
  "M " +
  4 * Blockly.BlockSvg.GRID_UNIT +
  ",0 " +
  " h " +
  4 * Blockly.BlockSvg.GRID_UNIT +
  " l " +
  4 * Blockly.BlockSvg.GRID_UNIT +
  "," +
  4 * Blockly.BlockSvg.GRID_UNIT +
  " l " +
  -4 * Blockly.BlockSvg.GRID_UNIT +
  "," +
  4 * Blockly.BlockSvg.GRID_UNIT +
  " h " +
  -4 * Blockly.BlockSvg.GRID_UNIT +
  " l " +
  -4 * Blockly.BlockSvg.GRID_UNIT +
  "," +
  -4 * Blockly.BlockSvg.GRID_UNIT +
  " l " +
  4 * Blockly.BlockSvg.GRID_UNIT +
  "," +
  -4 * Blockly.BlockSvg.GRID_UNIT +
  " z";

/**
 * 空布尔输入形状的宽度。输入形状六角形宽度
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL_WIDTH = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 空方形输入形状的SVG路径。输入形状的正方形
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_SQUARE =
  Blockly.BlockSvg.TOP_LEFT_CORNER_START +
  Blockly.BlockSvg.TOP_LEFT_CORNER +
  " h " +
  (12 * Blockly.BlockSvg.GRID_UNIT - 2 * Blockly.BlockSvg.CORNER_RADIUS) +
  Blockly.BlockSvg.TOP_RIGHT_CORNER +
  " v " +
  (8 * Blockly.BlockSvg.GRID_UNIT - 2 * Blockly.BlockSvg.CORNER_RADIUS) +
  Blockly.BlockSvg.BOTTOM_RIGHT_CORNER +
  " h " +
  (-12 * Blockly.BlockSvg.GRID_UNIT + 2 * Blockly.BlockSvg.CORNER_RADIUS) +
  Blockly.BlockSvg.BOTTOM_LEFT_CORNER +
  " z";

/**
 * 空正方形输入形状的宽度。
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_SQUARE_WIDTH = 10 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 空圆形输入形状的SVG路径。
 * @const
 */

Blockly.BlockSvg.INPUT_SHAPE_ROUND =
  "M " +
  4 * Blockly.BlockSvg.GRID_UNIT +
  ",0" +
  " h " +
  4 * Blockly.BlockSvg.GRID_UNIT +
  " a " +
  4 * Blockly.BlockSvg.GRID_UNIT +
  " " +
  4 * Blockly.BlockSvg.GRID_UNIT +
  " 0 0 1 0 " +
  8 * Blockly.BlockSvg.GRID_UNIT +
  " h " +
  -4 * Blockly.BlockSvg.GRID_UNIT +
  " a " +
  4 * Blockly.BlockSvg.GRID_UNIT +
  " " +
  4 * Blockly.BlockSvg.GRID_UNIT +
  " 0 0 1 0 -" +
  8 * Blockly.BlockSvg.GRID_UNIT +
  " z";

/**
 * 空圆形输入形状的宽度。
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_ROUND_WIDTH = 12 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 空输入形状的高度。
 * @const
 */
Blockly.BlockSvg.INPUT_SHAPE_HEIGHT = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 用户输入的高度
 * @const
 */
Blockly.BlockSvg.FIELD_HEIGHT = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 用户输入的宽度
 * @const
 */
Blockly.BlockSvg.FIELD_WIDTH = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 圆角输入框或下拉框中文本内容的内间距
 * @const
 */
Blockly.BlockSvg.EDITABLE_FIELD_PADDING = 6;

/**
 * 圆角输入框或下拉框中文本内容的内间距
 * @const
 */
Blockly.BlockSvg.BOX_FIELD_PADDING = 4 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 下拉箭头填充。
 * @const
 */
Blockly.BlockSvg.DROPDOWN_ARROW_PADDING = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 编辑期间用户输入的最小宽度
 * @const
 */
Blockly.BlockSvg.FIELD_WIDTH_MIN_EDIT = 8 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 编辑期间用户输入的最大宽度
 * @const
 */
Blockly.BlockSvg.FIELD_WIDTH_MAX_EDIT = Infinity;

/**
 * 编辑期间用户输入的最大高度
 * @const
 */
Blockly.BlockSvg.FIELD_HEIGHT_MAX_EDIT = Blockly.BlockSvg.FIELD_HEIGHT;

/**
 * 用户输入的最高填充
 * @const
 */
Blockly.BlockSvg.FIELD_TOP_PADDING = 0.5 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 数字输入的转角半径
 * @const
 */
Blockly.BlockSvg.NUMBER_FIELD_CORNER_RADIUS = 4 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 文字输入的转角半径
 * @const
 */
Blockly.BlockSvg.TEXT_FIELD_CORNER_RADIUS = 1 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 字段的默认半径，以px为单位。
 * @const
 */
Blockly.BlockSvg.FIELD_DEFAULT_CORNER_RADIUS = 4 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 字段的最大文本显示长度（水平/垂直）
 * @const
 */
Blockly.BlockSvg.MAX_DISPLAY_LENGTH = Infinity;

/**
 * 积木块中，一个以上元素，最小水平间距，确保之间不重叠
 * @const
 */
Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X = 6 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 积木块中含有输入元素时，垂直间距
 * @const
 */
Blockly.BlockSvg.INLINE_PADDING_Y = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 字段文本输入字号初始,动画前文本字段的磅值。须与CSS.js中(.blocklyText{})字号匹配
 * See implementation in field_textinput.
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_FONTSIZE_INITIAL = 16;

/**
 * 字段文本输入字号最后,动画后文本字段的磅值。请参阅field_textinput中的实现。
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_FONTSIZE_FINAL = 16;

/**
 * 是否允许文本字段扩展到超出其截断的块大小
 * @const{boolean}
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_EXPAND_PAST_TRUNCATION = false;

/**
 * 文本字段是否应设置其位置的动画。
 * @const{boolean}
 */
Blockly.BlockSvg.FIELD_TEXTINPUT_ANIMATE_POSITIONING = false;

/**
 * 输出/输入形状的映射及其应导致填充块的数量
 * 外键是外部形状，内键是内部形状。
 * 当具有外部形状的块在左侧或右侧边缘上包含具有内部形状的输入块时，该侧将通过指定的填充进行扩展。
 * See also: `Blockly.BlockSvg.computeOutputPadding_`.
 */
Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING = {
  1: {
    // 外形：六角形。
    0: 5 * Blockly.BlockSvg.GRID_UNIT, // 六角形的字段
    1: 2 * Blockly.BlockSvg.GRID_UNIT, // 六角形内六角
    2: 5 * Blockly.BlockSvg.GRID_UNIT, // 六边形圆
    3: 5 * Blockly.BlockSvg.GRID_UNIT, // 六角方形
  },
  2: {
    // 外形：圆形。
    0: 3 * Blockly.BlockSvg.GRID_UNIT, // 圆的字段。
    1: 3 * Blockly.BlockSvg.GRID_UNIT, // 圆形六边形
    2: 1 * Blockly.BlockSvg.GRID_UNIT, // 圆形圆形
    3: 2 * Blockly.BlockSvg.GRID_UNIT, // 圆形方形
  },
  3: {
    // 外形：方形。
    0: 2 * Blockly.BlockSvg.GRID_UNIT, // 正方形的字段
    1: 2 * Blockly.BlockSvg.GRID_UNIT, // 正方形内六角
    2: 2 * Blockly.BlockSvg.GRID_UNIT, // 圆角正方形
    3: 2 * Blockly.BlockSvg.GRID_UNIT, // 方形方形
  },
};

/**
 * 帽子在定义块上的角半径。
 * @const
 */
Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS = 5 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 绘制圆形左上角hat的SVG路径
 * @const
 */
Blockly.BlockSvg.TOP_LEFT_CORNER_DEFINE_HAT =
  "a " +
  Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS +
  "," +
  Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS +
  " 0 0,1 " +
  Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS +
  ",-" +
  Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS;

/**
 * 绘制圆形右上角hat的SVG路径
 * @const
 */
Blockly.BlockSvg.TOP_RIGHT_CORNER_DEFINE_HAT =
  "a " +
  Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS +
  "," +
  Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS +
  " 0 0,1 " +
  Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS +
  "," +
  Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS;

/**
 * 在定义块的内部块右侧填充
 * @const
 */
Blockly.BlockSvg.DEFINE_BLOCK_PADDING_RIGHT = 2 * Blockly.BlockSvg.GRID_UNIT;

/**
 * 更改块的颜色。
 */
Blockly.BlockSvg.prototype.updateColour = function () {
  var strokeColour = this.getColourTertiary();
  var renderShadowed =
    this.isShadow() &&
    !Blockly.scratchBlocksUtils.isShadowArgumentReporter(this);

  if (renderShadowed && this.parentBlock_) {
    // 如果可能，从父块的第三级拖动阴影块的笔触颜色。
    strokeColour = this.parentBlock_.getColourTertiary();
    // 特殊情况：如果包含色域，请设置为特殊的笔触颜色。
    if (
      this.inputList[0] &&
      this.inputList[0].fieldRow[0] &&
      (this.inputList[0].fieldRow[0] instanceof Blockly.FieldColour ||
        this.inputList[0].fieldRow[0] instanceof Blockly.FieldColourSlider)
    ) {
      strokeColour = Blockly.Colours.colourPickerStroke;
    }
  }

  //  svg path 描边
  this.svgPath_.setAttribute("stroke", strokeColour);

  // svg path 填充
  if (this.isGlowingBlock_ || renderShadowed) {
    // 尽可能使用块的阴影颜色。
    if (this.getShadowColour()) {
      var fillColour = this.getShadowColour();
    } else {
      var fillColour = this.getColourSecondary();
    }
  } else {
    var fillColour = this.getColour();
  }
  this.svgPath_.setAttribute("fill", fillColour);

  // 填充不透明度
  this.svgPath_.setAttribute("fill-opacity", this.getOpacity());

  // 新输入形状的颜色
  for (var i = 0, input; (input = this.inputList[i]); i++) {
    if (input.outlinePath) {
      input.outlinePath.setAttribute("fill", this.getColourTertiary());
    }
  }

  // 渲染图标（如果适用）
  var icons = this.getIcons();
  for (var i = 0; i < icons.length; i++) {
    icons[i].updateColour();
  }

  // 每个下拉菜单以更改其颜色
  for (var x = 0, input; (input = this.inputList[x]); x++) {
    for (var y = 0, field; (field = input.fieldRow[y]); y++) {
      field.setText(null);
    }
  }
};

/**
 * 视觉效果表明，如果拖放了拖动块，该块将被替换。 如果有阴影块，它将消失。 否则会碰撞。
 * @param {boolean} add 如果应添加高亮显示，则为true。
 * 高亮替换块？
 */
Blockly.BlockSvg.prototype.highlightForReplacement = function (add) {
  if (add) {
    var replacementGlowFilterId =
      this.workspace.options.replacementGlowFilterId ||
      "blocklyReplacementGlowFilter";
    this.svgPath_.setAttribute(
      "filter",
      "url(#" + replacementGlowFilterId + ")"
    );
    Blockly.utils.addClass(
      /** @type {!Element} */ (this.svgGroup_),
      "blocklyReplaceable"
    );
  } else {
    this.svgPath_.removeAttribute("filter");
    Blockly.utils.removeClass(
      /** @type {!Element} */ (this.svgGroup_),
      "blocklyReplaceable"
    );
  }
};

/**
 * 视觉效果显示，如果拖放了拖动块，它将连接到此输入。
 * @param {Blockly.Connection} conn The connection on the input to highlight.
 * @param {boolean} add True if highlighting should be added.
 */
Blockly.BlockSvg.prototype.highlightShapeForInput = function (conn, add) {
  var input = this.getInputWithConnection(conn);
  if (!input) {
    throw "No input found for the connection";
  }
  if (!input.outlinePath) {
    return;
  }
  if (add) {
    var replacementGlowFilterId =
      this.workspace.options.replacementGlowFilterId ||
      "blocklyReplacementGlowFilter";
    input.outlinePath.setAttribute(
      "filter",
      "url(#" + replacementGlowFilterId + ")"
    );
    Blockly.utils.addClass(
      /** @type {!Element} */ (this.svgGroup_),
      "blocklyReplaceable"
    );
  } else {
    input.outlinePath.removeAttribute("filter");
    Blockly.utils.removeClass(
      /** @type {!Element} */ (this.svgGroup_),
      "blocklyReplaceable"
    );
  }
};

/**
 * 返回一个边界框，该边界框描述此块及其下面堆叠的任何块的尺寸。
 * @return {!{height: number, width: number}} Object with height and width properties.
 */
Blockly.BlockSvg.prototype.getHeightWidth = function () {
  var height = this.height;
  var width = this.width;
  // 递归增加后续块的大小。
  var nextBlock = this.getNextBlock();
  if (nextBlock) {
    var nextHeightWidth = nextBlock.getHeightWidth();
    height += nextHeightWidth.height;
    // 排除连接槽口的高度。
    height -= Blockly.BlockSvg.NOTCH_HEIGHT;
    width = Math.max(width, nextHeightWidth.width);
  }
  return { height: height, width: width };
};

/**
 * 渲染块。根据块的内容和设置对块进行布局和重排。
 * @param {boolean=} opt_bubble 如果为true，则还渲染块的父母，祖父母等。默认为true。
 */
Blockly.BlockSvg.prototype.render = function (opt_bubble) {
  Blockly.Field.startCache();
  this.rendered = true;

  var cursorX = Blockly.BlockSvg.SEP_SPACE_X;
  if (this.RTL) cursorX = -cursorX;

  // 将图标移到适当位置.
  var icons = this.getIcons();
  var scratchCommentIcon = null;
  for (var i = 0; i < icons.length; i++) {
    // 在输入之后才渲染暂存区注释图标
    icons[i] instanceof Blockly.ScratchBlockComment
      ? (scratchCommentIcon = icons[i])
      : (cursorX = icons[i].renderIcon(cursorX));
  }
  // 如果没有图标，cursorX将为0，否则将为第一个标签需要经过的宽度。
  cursorX += this.RTL
    ? Blockly.BlockSvg.SEP_SPACE_X
    : -Blockly.BlockSvg.SEP_SPACE_X;

  // 如果这是扩展报告程序块，请添加水平偏移量
  if (this.isScratchExtension && this.outputConnection)
    cursorX += this.RTL
      ? -Blockly.BlockSvg.GRID_UNIT
      : Blockly.BlockSvg.GRID_UNIT;

  var inputRows = this.renderCompute_(cursorX);
  this.renderDraw_(cursorX, inputRows);
  this.renderMoveConnections_();

  this.renderClassify_();

  // 将Scratch块注释图标放在块的末尾
  if (scratchCommentIcon) {
    var iconX = this.RTL ? -inputRows.rightEdge : inputRows.rightEdge;
    var inputMarginY = inputRows[0].height / 2;
    scratchCommentIcon.renderIcon(iconX, inputMarginY);
  }

  if (opt_bubble !== false) {
    // 渲染高于此的所有块（传播重排）。
    var parentBlock = this.getParent();
    // 最上面的块。 触发事件以允许滚动条调整大小。
    parentBlock
      ? parentBlock.render(true)
      : Blockly.resizeSvgContents(this.workspace);
  }
  Blockly.Field.stopCache();
};

/**
 * 渲染从指定位置开始的字段列表
 * @param {!Array.<!Blockly.Field>} fieldList
 * @param {number} cursorX X坐标开始字段
 * @param {number} cursorY Y坐标开始字段
 * @return {number} 字段行末端的X坐标(加间隙)
 * @private
 */
Blockly.BlockSvg.prototype.renderFields_ = function (
  fieldList,
  cursorX,
  cursorY
) {
  if (this.RTL) {
    cursorX = -cursorX;
  }
  // 占位字段
  for (var t = 0, field; (field = fieldList[t]); t++) {
    // 第0个,是块中的第一个元素,通常为icon
    // console.log("field:", fieldList[0].getSvgRoot());
    var root = field.getSvgRoot();
    if (!root) continue;
    // 在带有槽口的块中，应将字段增加到最小X，以避免与槽口重叠。 标签和图像字段被排除。
    if (
      this.previousConnection &&
      !(field instanceof Blockly.FieldLabel) &&
      !(field instanceof Blockly.FieldImage)
    )
      cursorX = this.RTL
        ? Math.min(cursorX, -Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X)
        : Math.max(cursorX, Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X);

    // 通过其高度的一半向上偏移. 这将垂直围绕光标Y使字段居中
    var yOffset = -field.getSize().height / 2;

    // 如果这是扩展块，并且此字段是第一个字段，并且是图像字段，并且此块具有先前的连接，则将图像向下碰撞一个网格单元以使其垂直对齐。
    if (
      this.isScratchExtension &&
      field === this.inputList[0].fieldRow[0] &&
      field instanceof Blockly.FieldImage &&
      this.previousConnection
    )
      yOffset += Blockly.BlockSvg.GRID_UNIT;

    // 如果这是扩展帽块，请调整垂直分隔符的高度，而不调整场高。效果是将行的底端向上移动一个网格单元。
    if (
      this.isScratchExtension &&
      !this.previousConnection &&
      this.nextConnection &&
      field instanceof Blockly.FieldVerticalSeparator
    )
      field.setLineHeight(
        Blockly.BlockSvg.ICON_SEPARATOR_HEIGHT - Blockly.BlockSvg.GRID_UNIT
      );

    var translateX, translateY;
    var scale = "";
    if (this.RTL) {
      cursorX -= field.renderSep + field.renderWidth;
      translateX = cursorX;
      translateY = cursorY + yOffset;
      if (field.renderWidth) cursorX -= Blockly.BlockSvg.SEP_SPACE_X;
    } else {
      translateX = cursorX + field.renderSep;
      translateY = cursorY + yOffset;
      if (field.renderWidth)
        cursorX +=
          field.renderSep + field.renderWidth + Blockly.BlockSvg.SEP_SPACE_X;
    }
    if (this.RTL && field instanceof Blockly.FieldImage && field.getFlipRTL()) {
      scale = "scale(-1 1)";
      translateX += field.renderWidth;
    }
    /**
     * 此处设置:积木块中的icon的 translate
     * <g transform="translate(16,12)"><image></image></g>
     */
    root.setAttribute(
      "transform",
      "translate(" + translateX + ", " + translateY + ") " + scale
    );

    // 字段在插入标记上不可见。
    if (this.isInsertionMarker()) {
      root.setAttribute("display", "none");
    }
  }
  return this.RTL ? -cursorX : cursorX;
};

/**
 * 计算每个行和字段的高度和宽度。
 * @param {number} iconWidth 由于出现图标，第一行的偏移量。
 * @return {!Array.<!Array.<!Object>>} 2D对象数组，每个对象包含
 * @private
 */
Blockly.BlockSvg.prototype.renderCompute_ = function (iconWidth) {
  var inputList = this.inputList;
  var inputRows = [];
  // 块将从0（左边缘）到rightEdge（以px为单位）绘制。
  inputRows.rightEdge = 0;
  // 从0到bottomEdge垂直绘制
  inputRows.bottomEdge = 0;
  var fieldValueWidth = 0; // 最长外部值字段的宽度。
  var fieldStatementWidth = 0; // 最长语句字段的宽度
  var hasValue = false;
  var hasStatement = false;
  var hasDummy = false;
  var lastType = undefined;

  // 先前创建的行，用于在C型和E型块上特殊包装的行高。
  var previousRow;
  for (var i = 0, input; (input = inputList[i]); i++) {
    if (!input.isVisible()) {
      continue;
    }
    var isSecondInputOnProcedure =
      this.type == "procedures_definition" &&
      lastType &&
      lastType == Blockly.NEXT_STATEMENT;
    var row;
    // 不要为过程块上的第二个虚拟输入创建新行。
    // See github.com/LLK/scratch-blocks/issues/1658
    // 在所有其他情况下，语句和值输入会捕获所有先前的虚拟输入，并在后面的输入之前引起换行
    if (
      !isSecondInputOnProcedure &&
      (!lastType ||
        lastType == Blockly.NEXT_STATEMENT ||
        input.type == Blockly.NEXT_STATEMENT)
    ) {
      lastType = input.type;
      row = this.createRowForInput_(input);
      inputRows.push(row);
    } else {
      row = inputRows[inputRows.length - 1];
    }
    row.push(input);

    // 计算此输入的最小尺寸
    input.renderHeight = this.computeInputHeight_(input, row, previousRow);
    input.renderWidth = this.computeInputWidth_(input);

    // 如果输入是语句输入，请确定是否应在C的内部底部绘制一个凹口
    row.statementNotchAtBottom = true;
    if (input.connection && input.connection.type === Blockly.NEXT_STATEMENT) {
      var linkedBlock = input.connection.targetBlock();
      if (linkedBlock && !linkedBlock.lastConnectionInStack()) {
        row.statementNotchAtBottom = false;
      }
    }

    // 扩大输入大小
    if (input.connection) {
      var linkedBlock = input.connection.targetBlock();
      var paddedHeight = 0;
      var paddedWidth = 0;
      if (linkedBlock) {
        // 块连接到输入-使用其大小
        var bBox = linkedBlock.getHeightWidth();
        paddedHeight = bBox.height;
        paddedWidth = bBox.width;
      } else {
        // 无块连接-使用渲染的空输入形状的大小。
        paddedHeight = Blockly.BlockSvg.INPUT_SHAPE_HEIGHT;
      }
      if (input.connection.type === Blockly.INPUT_VALUE) {
        paddedHeight += 2 * Blockly.BlockSvg.INLINE_PADDING_Y;
      }
      if (input.connection.type === Blockly.NEXT_STATEMENT) {
        // 仅当堆栈中的最后一个块具有下一个连接时，才减去凹口的高度
        if (row.statementNotchAtBottom) {
          paddedHeight -= Blockly.BlockSvg.NOTCH_HEIGHT;
        }
      }
      input.renderHeight = Math.max(input.renderHeight, paddedHeight);
      input.renderWidth = Math.max(input.renderWidth, paddedWidth);
    }
    row.height = Math.max(row.height, input.renderHeight);
    input.fieldWidth = 0;
    if (inputRows.length == 1) {
      // 第一行将移动以容纳任何图标。
      input.fieldWidth += this.RTL ? -iconWidth : iconWidth;
    }
    var previousFieldEditable = false;
    for (var j = 0, field; (field = input.fieldRow[j]); j++) {
      if (j != 0) {
        input.fieldWidth += Blockly.BlockSvg.SEP_SPACE_X;
      }
      // 获取字段的尺寸。
      var fieldSize = field.getSize();
      field.renderWidth = fieldSize.width;
      field.renderSep =
        previousFieldEditable && field.EDITABLE
          ? Blockly.BlockSvg.SEP_SPACE_X
          : 0;
      // See github.com/LLK/scratch-blocks/issues/1658
      if (!isSecondInputOnProcedure) {
        input.fieldWidth += field.renderWidth + field.renderSep;
      }
      row.height = Math.max(row.height, fieldSize.height);
      previousFieldEditable = field.EDITABLE;
    }

    if (row.type != Blockly.BlockSvg.INLINE) {
      if (row.type == Blockly.NEXT_STATEMENT) {
        hasStatement = true;
        fieldStatementWidth = Math.max(fieldStatementWidth, input.fieldWidth);
      } else {
        if (row.type == Blockly.INPUT_VALUE) {
          hasValue = true;
        } else if (row.type == Blockly.DUMMY_INPUT) {
          hasDummy = true;
        }
        fieldValueWidth = Math.max(fieldValueWidth, input.fieldWidth);
      }
    }
    previousRow = row;
  }
  // 计算输出块的填充。数据附加到该行 // 似乎没用到
  // this.computeOutputPadding_(inputRows);

  // 计算语句边缘。这是嵌套语句的块的宽度
  inputRows.statementEdge =
    Blockly.BlockSvg.STATEMENT_INPUT_EDGE_WIDTH + fieldStatementWidth;

  // 计算首选的右边缘
  inputRows.rightEdge = this.computeRightEdge_(
    inputRows.rightEdge,
    hasStatement
  );

  // 底边是行高的总和
  for (var i = 0; i < inputRows.length; i++) {
    inputRows.bottomEdge += inputRows[i].height;
  }

  inputRows.hasValue = hasValue;
  inputRows.hasStatement = hasStatement;
  inputRows.hasDummy = hasDummy;
  return inputRows;
};

/**
 * 根据连接类型和输出计算此输入的最小宽度。
 * @param {!Blockly.Input} input 要测量的输入。
 * @return {number} 此输入的计算宽度
 * @private
 */
Blockly.BlockSvg.prototype.computeInputWidth_ = function (input) {
  // console.log("INPUT:", input);
  // input.fieldRow[0].fieldGroup_.parentElement.attributes[3].nodeValue

  if (
    input.type == Blockly.INPUT_VALUE &&
    (!input.connection || !input.connection.isConnected())
  ) {
    switch (input.connection.getOutputShape()) {
      case Blockly.OUTPUT_SHAPE_SQUARE:
        return Blockly.BlockSvg.INPUT_SHAPE_SQUARE_WIDTH;
      case Blockly.OUTPUT_SHAPE_ROUND:
        return Blockly.BlockSvg.INPUT_SHAPE_ROUND_WIDTH;
      case Blockly.OUTPUT_SHAPE_HEXAGONAL:
        return Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL_WIDTH;
      default:
        return 0;
    }
  } else {
    return 0;
  }
};

/**
 * 计算此输入的最小高度
 * @param {!Blockly.Input} input 要测量的输入。
 * @param {!Object} row 当前正在测量的块的行。
 * @param {!Object} previousRow 块的前一行，刚刚被测量
 * @return {number} 此输入的计算高度。
 * @private
 */
Blockly.BlockSvg.prototype.computeInputHeight_ = function (
  input,
  row,
  previousRow
) {
  if (
    this.inputList.length === 1 &&
    this.outputConnection &&
    this.isShadow() &&
    !Blockly.scratchBlocksUtils.isShadowArgumentReporter(this)
  ) {
    // “单独”字段块较小。
    return Blockly.BlockSvg.MIN_BLOCK_Y_SINGLE_FIELD_OUTPUT;
  } else if (this.outputConnection) {
    // 如果这是扩展报告程序块，请使其更高
    if (this.isScratchExtension) {
      return (
        Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER + 2 * Blockly.BlockSvg.GRID_UNIT
      );
    }
    // All other reporters.
    return Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;
  } else if (row.type == Blockly.NEXT_STATEMENT) {
    // Statement input. 语句输入
    return Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT;
  } else if (previousRow && previousRow.type == Blockly.NEXT_STATEMENT) {
    // Extra row for below statement input. 以下语句输入的额外行
    return Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y;
  } else {
    // 如果这是扩展块，并且具有先前的连接，则使其更高。
    if (this.isScratchExtension && this.previousConnection) {
      return Blockly.BlockSvg.MIN_BLOCK_Y + 2 * Blockly.BlockSvg.GRID_UNIT;
    }
    // All other blocks. 所有其他块
    return Blockly.BlockSvg.MIN_BLOCK_Y;
  }
};

/**
 * 为输入和关联字段创建一行。
 * @param {!Blockly.Input} input 该行所基于的输入
 * @return {!Object} 具有正确类型和默认大小信息的新行
 */
Blockly.BlockSvg.prototype.createRowForInput_ = function (input) {
  // Create new row. 创建新行
  var row = [];
  if (input.type != Blockly.NEXT_STATEMENT) {
    row.type = Blockly.BlockSvg.INLINE;
  } else {
    row.type = input.type;
  }
  row.height = 0;
  // 块的默认填充：与字段/输入之间的分隔符相同。
  row.paddingStart = Blockly.BlockSvg.SEP_SPACE_X;
  row.paddingEnd = Blockly.BlockSvg.SEP_SPACE_X;
  return row;
};

/**
 * 计算块的首选右边缘
 * @param {number} curEdge 先前计算的右边缘
 * @param {boolean} hasStatement 此块是否具有语句输入
 * @return {number} 块的首选右边缘
 */
Blockly.BlockSvg.prototype.computeRightEdge_ = function (
  curEdge,
  hasStatement
) {
  var edge = curEdge;
  if (this.previousConnection || this.nextConnection) {
    // Blocks with notches 带缺口块
    edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X);
  } else if (this.outputConnection) {
    if (
      this.isShadow() &&
      !Blockly.scratchBlocksUtils.isShadowArgumentReporter(this)
    ) {
      // Single-fields
      edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X_SHADOW_OUTPUT);
    } else {
      // Reporters
      edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X_OUTPUT);
    }
  }
  if (hasStatement) {
    // Statement blocks (C- or E- shaped) have a longer minimum width.
    // 语句块（C形或E形）具有更长的最小宽度
    edge = Math.max(edge, Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT);
  }

  // Ensure insertion markers are at least insertionMarkerMinWidth_ wide.
  // 确保插入标记的宽度至少为插入标记的最小宽度
  if (this.insertionMarkerMinWidth_ > 0) {
    edge = Math.max(edge, this.insertionMarkerMinWidth_);
  }
  return edge;
};

/**
 * 对于具有输出的块，根据连接的输入确定开始和结束填充。填充将取决于输出的形状，输入的形状以及可能的输入大小。
 * @param {!Array.<!Array.<!Object>>} inputRows 部分计算的行
 */
Blockly.BlockSvg.prototype.computeOutputPadding_ = function (inputRows) {
  console.log("计算输出块的padding：", inputRows);
  // 仅适用于具有输出的块，不适用于单个字段（阴影）。
  if (
    !this.getOutputShape() ||
    !this.outputConnection ||
    (this.isShadow() &&
      !Blockly.scratchBlocksUtils.isShadowArgumentReporter(this))
  )
    return;
  // 具有输出的块必须具有要填充的单行
  if (inputRows.length > 1) return;
  var row = inputRows[0];
  var shape = this.getOutputShape();
  // 重置所有填充：即将设置。
  row.paddingStart = 0;
  row.paddingEnd = 0;
  // 开始行填充：基于第一个输入或第一个字段
  var firstInput = row[0];
  var firstField = firstInput.fieldRow[0];
  var otherShape;
  // 在检查左侧/开始侧时，字段优先于任何输入 这是因为将在任何值输入之前呈现字段。
  if (firstField) {
    otherShape = 0; // 字段排在第一位
  } else {
    // 值输入排在第一位。
    var inputConnection = firstInput.connection;
    if (!inputConnection.targetConnection) {
      // 未连接：使用绘制的形状
      otherShape = inputConnection.getOutputShape();
    } else {
      // 已连接：使用已连接块的输出形状
      otherShape = inputConnection.targetConnection
        .getSourceBlock()
        .getOutputShape();
    }
    // 六角形输出的特殊情况：如果连接的高度大于标准报告器的高度，请添加一些起始填充。
    // https://github.com/LLK/scratch-blocks/issues/376
    if (
      shape == Blockly.OUTPUT_SHAPE_HEXAGONAL &&
      otherShape != Blockly.OUTPUT_SHAPE_HEXAGONAL
    ) {
      var deltaHeight =
        firstInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;
      // 每层嵌套一个网格单元。
      row.paddingStart += deltaHeight / 2;
    }
  }
  row.paddingStart +=
    Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[shape][otherShape];
  // 末行填充：基于最后一个输入或最后一个字段
  var lastInput = row[row.length - 1];
  // 在检查右侧/末端时，任何值输入都优先于任何字段。
  // 这是因为字段是在输入之前呈现的...如果存在，则行中的最后一项将是输入。
  if (lastInput.connection) {
    // Value input last in the row. 值输入在行的最后。
    var inputConnection = lastInput.connection;
    if (!inputConnection.targetConnection) {
      // Not connected: use the drawn shape. 未连接：使用绘制的形状
      otherShape = inputConnection.getOutputShape();
    } else {
      // Connected: use the connected block's output shape. 已连接：使用已连接块的输出形状。
      otherShape = inputConnection.targetConnection
        .getSourceBlock()
        .getOutputShape();
    }
    // Special case for hexagonal output: if the connection is larger height
    // than a standard reporter, add some end padding.
    // 六角形输出的特殊情况：如果连接的高度大于标准报告器的高度，请添加一些端部填充。
    // https://github.com/LLK/scratch-blocks/issues/376
    if (
      shape == Blockly.OUTPUT_SHAPE_HEXAGONAL &&
      otherShape != Blockly.OUTPUT_SHAPE_HEXAGONAL
    ) {
      var deltaHeight =
        lastInput.renderHeight - Blockly.BlockSvg.MIN_BLOCK_Y_REPORTER;
      // 每层嵌套一个网格单元
      row.paddingEnd += deltaHeight / 2;
    }
  } else {
    // 该行无输入-标记为字段。
    otherShape = 0;
  }
  row.paddingEnd += Blockly.BlockSvg.SHAPE_IN_SHAPE_PADDING[shape][otherShape];
};

/**
 * 绘制块的路径
 * 将字段移到正确的位置
 * @param {number} iconWidth 第一行由于图标的偏移
 * @param {!Array.<!Array.<!Object>>} inputRows 对象的2D数组，每个对象包含位置信息。
 * @private
 */
Blockly.BlockSvg.prototype.renderDraw_ = function (iconWidth, inputRows) {
  this.startHat_ = false;
  // 左上角应该是圆角还是正方形 目前，仅在戴帽子的情况下才平方。
  this.squareTopLeftCorner_ = false; // 非方形左上角
  // !输出连接 && !以前的连接
  if (!this.outputConnection && !this.previousConnection) {
    // 没有输出或以前的连接
    this.squareTopLeftCorner_ = true; // 方形左上角
    this.startHat_ = true;
    inputRows.rightEdge = Math.max(inputRows.rightEdge, 100);
  }

  // 跳过绘制顶部和底部的空间，以便为左右绘制图形（曲线或角度）留出空间。
  this.edgeShapeWidth_ = 0; // 边缘形状宽度
  this.edgeShape_ = null; // 边缘形状
  // 如果是输出连接
  if (this.outputConnection) {
    // Width of the curve/pointy-curve 曲线/尖曲线的宽度
    var shape = this.getOutputShape();
    // 输出形状六角形 || 输出形状圆
    if (
      shape === Blockly.OUTPUT_SHAPE_HEXAGONAL ||
      shape === Blockly.OUTPUT_SHAPE_ROUND
    ) {
      this.edgeShapeWidth_ = inputRows.bottomEdge / 2;
      this.edgeShape_ = shape;
      this.squareTopLeftCorner_ = true;
    }
  }

  // 组装块的路径
  var steps = []; // 用于存储积木的路径
  // 渲染绘制上 函数(起点，输入行的右边界)
  this.renderDrawTop_(steps, inputRows.rightEdge);
  // 渲染绘制右 函数(前面累计的路径数组，输入行，icon宽度？) 返回 游标Y轴
  var cursorY = this.renderDrawRight_(steps, inputRows, iconWidth);
  // 渲染绘制下 函数(前面累计的路径数组，游标Y)
  this.renderDrawBottom_(steps, cursorY);
  // 渲染绘制左 函数(前面累计的路径数组)
  this.renderDrawLeft_(steps);
  // svg路径字符串 = 上右下左函数执行完得到的steps数组转字符串
  var pathString = steps.join(" ");
  // <path d="这里是pathString"></path>
  this.svgPath_.setAttribute("d", pathString);
  // 如果是右至左，就反转积木
  if (this.RTL) {
    // 镜像块的路径 也就是调整该css属性值
    this.svgPath_.setAttribute("transform", "scale(-1 1)");
  }
};

/**
 * 给该积木一个属性“ data-shapes”，列出其形状，并给属性“ data-category”及其类别。
 * @private
 */
Blockly.BlockSvg.prototype.renderClassify_ = function () {
  var shapes = [];

  if (this.outputConnection) {
    if (this.isShadow_) {
      shapes.push("argument");
    } else {
      shapes.push("reporter");
    }
    if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      shapes.push("boolean");
    } else if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_ROUND) {
      shapes.push("round");
    }
  } else {
    // 计算语句输入的数量
    var inputList = this.inputList;
    var statementCount = 0;
    for (var i = 0, input; (input = inputList[i]); i++) {
      if (
        input.connection &&
        input.connection.type === Blockly.NEXT_STATEMENT
      ) {
        statementCount++;
      }
    }

    if (statementCount) {
      shapes.push("c-block");
      shapes.push("c-" + statementCount);
    }
    if (this.startHat_) {
      // 可以使用c块+帽子（例如报告程序）
      shapes.push("hat");
    } else if (!statementCount) {
      shapes.push("stack"); // 如果不是C块，则仅将其称为“堆栈”
    }
    if (!this.nextConnection) {
      shapes.push("end");
    }
  }
  this.svgGroup_.setAttribute("data-shapes", shapes.join(" "));

  if (this.getCategory()) {
    this.svgGroup_.setAttribute("data-category", this.getCategory());
  }
};

/**
 * 渲染块的顶部边缘
 * @param {!Array.<string>} steps 块轮廓的路径。
 * @param {number} rightEdge 最小块宽度
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawTop_ = function (steps, rightEdge) {
  // 如果类型 == 程序定义块类型
  if (this.type == Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE) {
    steps.push("m 0, 0");
    steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER_DEFINE_HAT);
  } else {
    // Position the cursor at the top-left starting point. 将光标置于左上角的起点。
    if (this.squareTopLeftCorner_) {
      // 起笔点
      steps.push("m 0,0");
      // 如果是 顶部弧形？
      if (this.startHat_) {
        steps.push(Blockly.BlockSvg.START_HAT_PATH);
      }
      // Skip space for the output shape 跳过输出形状的空间
      if (this.edgeShapeWidth_) {
        // 边缘形状宽度 (改变最后的0,则会使每个积木块中圆形输入区域位置改变)
        steps.push("m " + this.edgeShapeWidth_ + ",0");
      }
    } else {
      steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER_START);
      // Top-left rounded corner. 左上角的圆角
      steps.push(Blockly.BlockSvg.TOP_LEFT_CORNER);
    }

    // Top edge. 上边缘
    if (this.previousConnection) {
      // Space before the notch 缺口前的空间
      steps.push("H", Blockly.BlockSvg.NOTCH_START_PADDING);
      steps.push(Blockly.BlockSvg.NOTCH_PATH_LEFT);
      // Create previous block connection. 创建先前的块连接
      var connectionX = this.RTL
        ? -Blockly.BlockSvg.NOTCH_WIDTH
        : Blockly.BlockSvg.NOTCH_WIDTH;
      this.previousConnection.setOffsetInBlock(connectionX, 0);
    }
  }
  this.width = rightEdge;
};

/**
 * 渲染积木块的右边缘
 * @param {!Array.<string>} steps 块轮廓的路径
 * @param {!Array.<!Array.<!Object>>} inputRows 对象的2D数组，每个对象包含位置信息
 * @param {number} iconWidth 由于出现图标，第一行的偏移量
 * @return {number} 返回积木块的高度。
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawRight_ = function (
  steps,
  inputRows,
  iconWidth
) {
  var cursorX = 0; // 游标xy
  var cursorY = 0;
  var connectionX, connectionY; // 连接xy
  // 遍历
  for (var y = 0, row; (row = inputRows[y]); y++) {
    cursorX = row.paddingStart;
    if (y == 0) {
      cursorX += this.RTL ? -iconWidth : iconWidth;
    }

    if (row.type == Blockly.BlockSvg.INLINE) {
      // 内联输入。
      for (var x = 0, input; (input = row[x]); x++) {
        // 在行内垂直对齐字段 将字段移到行高的一半
        // 在renderFields_中，该字段以其自身的渲染高度进一步居中
        var fieldY = cursorY + row.height / 2;

        var fieldX = Blockly.BlockSvg.getAlignedCursor_(
          cursorX,
          input,
          inputRows.rightEdge
        );

        cursorX = this.renderFields_(input.fieldRow, fieldX, fieldY);
        if (input.type == Blockly.INPUT_VALUE) {
          // 创建内联输入连接 在带有槽口的块中，输入应增加到最小X，以避免与槽口重叠。
          if (this.previousConnection) {
            cursorX = Math.max(cursorX, Blockly.BlockSvg.INPUT_AND_FIELD_MIN_X);
          }
          connectionX = this.RTL ? -cursorX : cursorX;
          // 尝试使连接垂直居中
          var connectionYOffset = row.height / 2;
          connectionY = cursorY + connectionYOffset;
          input.connection.setOffsetInBlock(connectionX, connectionY);
          // 调用 渲染输入框形状(输入,X偏移,Y偏移) 游标x，游标y(全为0),连接y偏移(全为24)
          this.renderInputShape_(input, cursorX, cursorY + connectionYOffset);
          cursorX += input.renderWidth + Blockly.BlockSvg.SEP_SPACE_X;
        }
      }
      // 卸下最后的隔板，并用右填充物代替
      cursorX -= Blockly.BlockSvg.SEP_SPACE_X;
      cursorX += row.paddingEnd;
      // 更新所有输入的右边缘，以使所有行的长度至少等于所有先前行的大小。
      inputRows.rightEdge = Math.max(cursorX, inputRows.rightEdge);
      // 移到右边
      cursorX = Math.max(cursorX, inputRows.rightEdge);
      this.width = Math.max(this.width, cursorX);
      if (!this.edgeShape_) {
        let temp = 0; // 暂存值
        // 如果输入框是一个，并且类型值不是5
        if (inputRows.length == 1 && inputRows[0][0].type != 5) {
          temp = 50; // 暂存值设置为50，用于以下计算
        }

        // console.log("inputRows:", inputRows);

        // 在绘制水平线时包括拐角半径,以下H若注释，则影响每个积木块的宽度
        steps.push(
          "H",
          cursorX - Blockly.BlockSvg.CORNER_RADIUS - this.edgeShapeWidth_ - temp
        );

        steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
      } else {
        // 不包括拐角半径-没有拐角（绘制边缘形状）
        steps.push("H", cursorX - this.edgeShapeWidth_);
      }
      // 减去CORNER RADIUS * 2占右上角和右下角。 仅垂直移动非角长度。
      if (!this.edgeShape_) {
        steps.push("v", row.height - Blockly.BlockSvg.CORNER_RADIUS * 2);
      }
    } else if (row.type == Blockly.NEXT_STATEMENT) {
      // 嵌套语句
      var input = row[0];
      var fieldX = cursorX;
      // 在行内垂直对齐字段 在renderFields_中，该字段进一步以其自身高度居中
      var fieldY = cursorY;
      fieldY += Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT;
      this.renderFields_(input.fieldRow, fieldX, fieldY);
      // 移至缺口的开头
      cursorX = inputRows.statementEdge + Blockly.BlockSvg.NOTCH_WIDTH;

      if (this.type == Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE) {
        this.renderDefineBlock_(steps, inputRows, input, row, cursorY);
      } else {
        Blockly.BlockSvg.drawStatementInputFromTopRight_(
          steps,
          cursorX,
          inputRows.rightEdge,
          row
        );
      }

      // 创建语句连接
      connectionX = this.RTL ? -cursorX : cursorX;
      // input的偏移
      input.connection.setOffsetInBlock(connectionX, cursorY);
      if (input.connection.isConnected()) {
        this.width = Math.max(
          this.width,
          inputRows.statementEdge +
            input.connection.targetBlock().getHeightWidth().width
        );
      }
      if (
        this.type != Blockly.PROCEDURES_DEFINITION_BLOCK_TYPE &&
        (y == inputRows.length - 1 ||
          inputRows[y + 1].type == Blockly.NEXT_STATEMENT)
      ) {
        // 如果最终输入是语句堆栈，请在下面添加一小行。连续的语句堆栈也由一个小的分隔符分隔。
        steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER);
        steps.push(
          "v",
          Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y -
            2 * Blockly.BlockSvg.CORNER_RADIUS
        );
        cursorY += Blockly.BlockSvg.EXTRA_STATEMENT_ROW_Y;
      }
    }
    cursorY += row.height;
  }
  this.drawEdgeShapeRight_(steps);
  if (!inputRows.length) {
    cursorY = Blockly.BlockSvg.MIN_BLOCK_Y;
    steps.push("V", cursorY);
  }
  return cursorY;
};

/**
 * 渲染输入框形状 如果有连接的块，则隐藏输入形状;否则，绘制并设置输入形状的位置
 * @param {!Blockly.Input} input 要渲染的输入
 * @param {Number} x 输入X偏移
 * @param {Number} y 输入Y偏移
 */
Blockly.BlockSvg.prototype.renderInputShape_ = function (input, x, y) {
  // console.log("渲染输入框形状:", input, x, y); // input对象 56,24
  // 在此通过input组件的name，判断是否需要对input进行transform:translate设置
  // if (input.name) {
  //   if (
  //     input.name == "STEPS" ||
  //     input.name == "DEGREES" ||
  //     input.name == "HEIGHT"
  //   ) {
  //     // console.log("找到为数字输入:", input.connection.offsetInBlock_.x);
  //     input.connection.offsetInBlock_.x += 50;
  //   }
  // }

  var inputShape = input.outlinePath;
  // 此输入没有输入形状-例如，图块是插入标记
  if (!inputShape) return;
  // 输入形状仅可见地显示在未连接的插槽上。
  if (input.connection.targetConnection) {
    inputShape.setAttribute("style", "visibility: hidden");
  } else {
    var inputShapeX = 0,
      inputShapeY = 0;
    var inputShapeInfo = Blockly.BlockSvg.getInputShapeInfo_(
      input.connection.getOutputShape()
    );
    if (this.RTL) {
      inputShapeX = -x - inputShapeInfo.width;
    } else {
      inputShapeX = x;
    }
    inputShapeY = y - Blockly.BlockSvg.INPUT_SHAPE_HEIGHT / 2;
    inputShape.setAttribute("d", inputShapeInfo.path);
    inputShape.setAttribute(
      "transform",
      "translate(" + inputShapeX + "," + inputShapeY + ")"
    );
    inputShape.setAttribute("data-argument-type", inputShapeInfo.argType);
    inputShape.setAttribute("style", "visibility: visible");
  }
};

/**
 * Render the bottom edge of the block. 渲染块的底部边缘
 * @param {!Array.<string>} steps Path of block outline. 块轮廓的路径
 * @param {number} cursorY Height of block. 块高
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawBottom_ = function (steps, cursorY) {
  this.height = cursorY;
  if (!this.edgeShape_) {
    steps.push(Blockly.BlockSvg.BOTTOM_RIGHT_CORNER);
  }
  if (this.nextConnection) {
    // Move to the right-side of the notch. 移至槽口的右侧
    var notchStart =
      Blockly.BlockSvg.NOTCH_WIDTH +
      Blockly.BlockSvg.NOTCH_START_PADDING +
      Blockly.BlockSvg.CORNER_RADIUS;
    steps.push("H", notchStart, " ");
    steps.push(Blockly.BlockSvg.NOTCH_PATH_RIGHT);
    // Create next block connection. 创建下一个块连接。
    var connectionX = this.RTL
      ? -Blockly.BlockSvg.NOTCH_WIDTH
      : Blockly.BlockSvg.NOTCH_WIDTH;
    this.nextConnection.setOffsetInBlock(connectionX, cursorY);
    // Include height of notch in block height. 将刻槽高度包括在块高度中
    this.height += Blockly.BlockSvg.NOTCH_HEIGHT;
  }
  // Bottom horizontal line 底部水平线
  if (!this.edgeShape_) {
    steps.push("H", Blockly.BlockSvg.CORNER_RADIUS);
    // Bottom left corner 左下角
    steps.push(Blockly.BlockSvg.BOTTOM_LEFT_CORNER);
  } else {
    steps.push("H", this.edgeShapeWidth_);
  }
};

/**
 * Render the left edge of the block. 渲染块的左边缘
 * @param {!Array.<string>} steps Path of block outline. 块轮廓的路径
 * @param {number} cursorY Height of block. 块高
 * @private
 */
Blockly.BlockSvg.prototype.renderDrawLeft_ = function (steps) {
  if (this.outputConnection) {
    // Scratch-style reporters have output connection y at half block height.
    // 临时样式的报告器的输出连接y为半块高度。
    this.outputConnection.setOffsetInBlock(0, this.height / 2);
  }
  if (this.edgeShape_) {
    // Draw the left-side edge shape. 绘制左侧边缘形状
    if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_ROUND) {
      // Draw a rounded arc. 画一个圆弧
      steps.push(
        "a " +
          this.edgeShapeWidth_ +
          " " +
          this.edgeShapeWidth_ +
          " 0 0 1 0 -" +
          this.edgeShapeWidth_ * 2
      );
    } else if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      // Draw a half-hexagon. 画一个半六边形
      steps.push(
        "l " +
          -this.edgeShapeWidth_ +
          " " +
          -this.edgeShapeWidth_ +
          " l " +
          this.edgeShapeWidth_ +
          " " +
          -this.edgeShapeWidth_
      );
    }
  }
  steps.push("z");

  // console.log(
  //   "block_render_svg_vertical.js",
  //   `<svg xmlns="http://www.w3.org/2000/svg" version="1.1"><path d="${steps.join(
  //     ""
  //   )}" /></svg>`
  // );

  // console.log("block_render_svg_vertical.js steps:", steps.join(""));
};

/**
 * Draw the edge shape (rounded or hexagonal) on the right side of a block with
 * an output. 在带有输出的块的右侧绘制边缘形状（圆形或六边形）。
 * @param {!Array.<string>} steps Path of block outline. 块轮廓的路径
 * @private
 */
Blockly.BlockSvg.prototype.drawEdgeShapeRight_ = function (steps) {
  if (this.edgeShape_) {
    // Draw the right-side edge shape. 绘制右侧边缘形状
    if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_ROUND) {
      // Draw a rounded arc. 画一个圆弧
      steps.push(
        "a " +
          this.edgeShapeWidth_ +
          " " +
          this.edgeShapeWidth_ +
          " 0 0 1 0 " +
          this.edgeShapeWidth_ * 2
      );
    } else if (this.edgeShape_ === Blockly.OUTPUT_SHAPE_HEXAGONAL) {
      // Draw an half-hexagon. 画一个半六边形
      steps.push(
        "l " +
          this.edgeShapeWidth_ +
          " " +
          this.edgeShapeWidth_ +
          " l " +
          -this.edgeShapeWidth_ +
          " " +
          this.edgeShapeWidth_
      );
    }
  }
};

/**
 * Position an new block correctly, so that it doesn't move the existing block
 * when connected to it. 正确放置新块，以便在连接新块时不会移动现有块。
 * @param {!Blockly.Block} newBlock The block to position - either the first
 *     block in a dragged stack or an insertion marker. 要定位的块-拖动堆栈中的第一个块或插入标记。
 * @param {!Blockly.Connection} newConnection The connection on the new block's
 *     stack - either a connection on newBlock, or the last NEXT_STATEMENT
 *     connection on the stack if the stack's being dropped before another
 *     block. 新块堆栈上的连接-newBlock上的连接，或者堆栈上的最后一个NEXT_STATEMENT连接（如果将堆栈放在另一个块之前）。
 * @param {!Blockly.Connection} existingConnection The connection on the
 *     existing block, which newBlock should line up with. 现有块上的连接，newBlock应该与该块对齐
 */
Blockly.BlockSvg.prototype.positionNewBlock = function (
  newBlock,
  newConnection,
  existingConnection
) {
  // We only need to position the new block if it's before the existing one,
  // otherwise its position is set by the previous block. 如果新块位于现有块之前，则只需将其定位，否则它的位置由上一个块设置
  if (newConnection.type == Blockly.NEXT_STATEMENT) {
    var dx = existingConnection.x_ - newConnection.x_;
    var dy = existingConnection.y_ - newConnection.y_;

    newBlock.moveBy(dx, dy);
  }
};

/**
 * Draw the outline of a statement input, starting at the top right corner.
 * 从右上角开始绘制语句输入的轮廓
 * @param {!Array.<string>} steps Path of block outline. 块轮廓的路径
 * @param {number} cursorX The x position of the start of the notch at the top
 *     of the input. 缺口起点在输入顶部的x位置
 * @param {number} rightEdge The far right edge of the block, which determines
 *     how wide the statement input is. 块的最右边，它确定语句输入的宽度
 * @param {!Array.<!Object>} row An object containing information about the
 *     current row, including its height and whether it should have a notch at
 *     the bottom. 一个对象，其中包含有关当前行的信息，包括其高度以及底部是否应有一个凹口。
 * @private
 */
Blockly.BlockSvg.drawStatementInputFromTopRight_ = function (
  steps,
  cursorX,
  rightEdge,
  row
) {
  Blockly.BlockSvg.drawStatementInputTop_(steps, cursorX);
  steps.push("v", row.height - 2 * Blockly.BlockSvg.CORNER_RADIUS);
  Blockly.BlockSvg.drawStatementInputBottom_(steps, rightEdge, row);
};

/**
 * Draw the top of the outline of a statement input, starting at the top right
 * corner. 从右上角开始绘制语句输入轮廓的顶部
 * @param {!Array.<string>} steps Path of block outline. 块轮廓的路径
 * @param {number} cursorX The x position of the start of the notch at the top
 *     of the input. 缺口起点在输入顶部的x位置
 * @private
 */
Blockly.BlockSvg.drawStatementInputTop_ = function (steps, cursorX) {
  steps.push(Blockly.BlockSvg.BOTTOM_RIGHT_CORNER);
  steps.push(
    "H",
    cursorX +
      Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE +
      2 * Blockly.BlockSvg.CORNER_RADIUS
  );
  steps.push(Blockly.BlockSvg.NOTCH_PATH_RIGHT);
  steps.push("h", "-" + Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE);
  steps.push(Blockly.BlockSvg.INNER_TOP_LEFT_CORNER);
};

/**
 * Draw the bottom of the outline of a statement input, starting at the inner
 * left corner. 从左内角开始绘制语句输入的轮廓的底部
 * @param {!Array.<string>} steps Path of block outline. 块轮廓的路径
 * @param {number} rightEdge The far right edge of the block, which determines
 *     how wide the statement input is. 块的最右边，它确定语句输入的宽度
 * @param {!Array.<!Object>} row An object containing information about the
 *     current row, including its height and whether it should have a notch at
 *     the bottom. 一个对象，其中包含有关当前行的信息，包括其高度以及底部是否应有一个凹口。
 * @private
 */
Blockly.BlockSvg.drawStatementInputBottom_ = function (steps, rightEdge, row) {
  steps.push(Blockly.BlockSvg.INNER_BOTTOM_LEFT_CORNER);
  if (row.statementNotchAtBottom) {
    steps.push("h ", Blockly.BlockSvg.STATEMENT_INPUT_INNER_SPACE);
    steps.push(Blockly.BlockSvg.NOTCH_PATH_LEFT);
  }
  steps.push("H", rightEdge - Blockly.BlockSvg.CORNER_RADIUS);
};

/**
 * Render part of the hat and the right side of the define block to fully wrap
 * the connected statement block. 渲染帽子的一部分和define块的右侧，以完全包装连接的语句块
 * Scratch-specific.
 * @param {!Array.<string>} steps Path of block outline. 块轮廓的路径
 * @param {!Array.<!Array.<!Object>>} inputRows 2D array of objects, each
 *     containing position information. 对象的2D数组，每个对象包含位置信息
 * @param {!Blockly.Input} input The input that is currently being rendered. 当前正在呈现的输入
 * @param {!Array.<!Object>} row An object containing information about the
 *     current row, including its height and whether it should have a notch at
 *     the bottom. 一个对象，其中包含有关当前行的信息，包括其高度以及底部是否应有一个凹口。
 * @param {number} cursorY The y position of the start of this row.  Used to
 *     position the following dummy input's fields. 该行开始处的y位置。 用于放置以下虚拟输入的字段
 * @private
 */
Blockly.BlockSvg.prototype.renderDefineBlock_ = function (
  steps,
  inputRows,
  input,
  row,
  cursorY
) {
  // Following text shows up as a dummy input after the statement input, which
  // we are forcing to stay inline with the statement input instead of letting
  // it drop to a new line. 后面的文本在语句输入之后显示为虚拟输入，我们强迫其保持与语句输入的内联，而不是让其下降到新行
  var hasFollowingText = row.length == 2;

  // Figure out where the right side of the block is. 找出方块右侧的位置
  var rightSide = inputRows.rightEdge;
  if (input.connection && input.connection.targetBlock()) {
    rightSide =
      inputRows.statementEdge +
      input.connection.targetBlock().getHeightWidth().width +
      Blockly.BlockSvg.DEFINE_BLOCK_PADDING_RIGHT;
  } else {
    // Handles the case where block is being rendered as an insertion marker
    // 处理将块渲染为插入标记的情况
    rightSide =
      Math.max(Blockly.BlockSvg.MIN_BLOCK_X_WITH_STATEMENT, rightSide) +
      Blockly.BlockSvg.DEFINE_BLOCK_PADDING_RIGHT;
  }
  rightSide -= Blockly.BlockSvg.DEFINE_HAT_CORNER_RADIUS;

  if (hasFollowingText) {
    var followingTextInput = row[1];
    var fieldStart = rightSide + 3 * Blockly.BlockSvg.SEP_SPACE_X;
    rightSide += followingTextInput.fieldRow[0].getSize().width;
    rightSide += 2 * Blockly.BlockSvg.SEP_SPACE_X;

    // Align fields vertically within the row. 在行内垂直对齐字段
    // In renderFields_, the field is further centered by its own height.在renderFields_中，该字段进一步以其自身高度居中。
    // The dummy input's fields did not get laid out normally because we're
    // forcing them to stay inline with a statement input.伪输入的字段未正常布局，因为我们强迫它们与语句输入保持一致。
    var fieldY = cursorY;
    fieldY += Blockly.BlockSvg.MIN_STATEMENT_INPUT_HEIGHT;
    this.renderFields_(followingTextInput.fieldRow, fieldStart, fieldY);
  }
  // Draw the top and the right corner of the hat. 画出帽子的右上角
  steps.push("H", rightSide);
  steps.push(Blockly.BlockSvg.TOP_RIGHT_CORNER_DEFINE_HAT);
  row.height += 3 * Blockly.BlockSvg.GRID_UNIT;
  // Draw the right side of the block around the statement input.
  // 在语句输入周围绘制块的右侧
  steps.push("v", row.height);
  // row.height will be used to update the cursor in the calling function.
  // row.height将用于在调用函数中更新游标
  row.height += Blockly.BlockSvg.GRID_UNIT;
};

/**
 * 根据连接的类型，获取有关要绘制的输入形状的一些信息
 * @param {number} shape 一个枚举，表示我们要绘制的连接的形状
 * @return {!Object} 包含SVG路径，参数类型的字符串表示形式和宽度的对象
 * @private
 */
Blockly.BlockSvg.getInputShapeInfo_ = function (shape) {
  var inputShapePath = null;
  var inputShapeArgType = null;
  var inputShapeWidth = 0;

  switch (shape) {
    case Blockly.OUTPUT_SHAPE_HEXAGONAL:
      inputShapePath = Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL;
      inputShapeWidth = Blockly.BlockSvg.INPUT_SHAPE_HEXAGONAL_WIDTH;
      inputShapeArgType = "boolean";
      break;
    case Blockly.OUTPUT_SHAPE_ROUND:
      inputShapePath = Blockly.BlockSvg.INPUT_SHAPE_ROUND;
      inputShapeWidth = Blockly.BlockSvg.INPUT_SHAPE_ROUND_WIDTH;
      inputShapeArgType = "round";
      break;
    case Blockly.OUTPUT_SHAPE_SQUARE:
    default:
      // If the input connection is not connected, draw a hole shape.
      // 如果未连接输入连接，请绘制孔形状。
      inputShapePath = Blockly.BlockSvg.INPUT_SHAPE_SQUARE;
      inputShapeWidth = Blockly.BlockSvg.INPUT_SHAPE_SQUARE_WIDTH;
      inputShapeArgType = "square";
      break;
  }
  return {
    path: inputShapePath,
    argType: inputShapeArgType,
    width: inputShapeWidth,
  };
};

/**
 * 根据对齐方式，块的总大小和输入的大小，获取给定输入的正确光标位置。
 * @param {number} cursorX 光标的最小x值
 * @param {!Blockly.Input} input 用于对齐字段的输入
 * @param {number} rightEdge 块的最大宽度。 右对齐的字段基于此数字定位
 * @return {number} 新光标位置
 * @private
 */
Blockly.BlockSvg.getAlignedCursor_ = function (cursorX, input, rightEdge) {
  // Align inline field rows (left/right/centre). 对齐内联字段行（左/右/中心）
  if (input.align === Blockly.ALIGN_RIGHT) {
    cursorX += rightEdge - input.fieldWidth - 2 * Blockly.BlockSvg.SEP_SPACE_X;
  } else if (input.align === Blockly.ALIGN_CENTRE) {
    cursorX = Math.max(cursorX, rightEdge / 2 - input.fieldWidth / 2);
  }
  return cursorX;
};

/**
 * 使用renderCompute中计算的新位置更新此块上的所有连接，并根据新的连接位置移动所有连接的块。
 * @private
 */
Blockly.BlockSvg.prototype.renderMoveConnections_ = function () {
  var blockTL = this.getRelativeToSurfaceXY();
  // Don't tighten previous or output connections because they are inferior.
  // 不要拧紧先前的或输出的连接，因为它们的质量较差
  if (this.previousConnection) {
    this.previousConnection.moveToOffset(blockTL);
  }
  if (this.outputConnection) {
    this.outputConnection.moveToOffset(blockTL);
  }

  for (var i = 0; i < this.inputList.length; i++) {
    var conn = this.inputList[i].connection;
    if (conn) {
      conn.moveToOffset(blockTL);
      if (conn.isConnected()) {
        conn.tighten_();
      }
    }
  }

  if (this.nextConnection) {
    this.nextConnection.moveToOffset(blockTL);
    if (this.nextConnection.isConnected()) {
      this.nextConnection.tighten_();
    }
  }
};
