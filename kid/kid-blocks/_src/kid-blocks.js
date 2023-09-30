/*
 * @Author: Satya
 * @Date: 2020-10-21 15:47:10
 * @Last Modified by: Satya
 * @Last Modified time: 2020-10-30 09:00:21
 * doc: kid-blocks
 */
"use strict";

console.log("kid-blocks");

/**
 * const 常量只能锁定简单数据(数字/字符串/布尔类型),对象及数组则需要使用冻结函数
 *  Object.freeze() 冻结对象 freeze冻结的是堆内存中的值，和栈中的引用无关
 * 默认只有浅冻结，深度冻结需使用递归冻结
 */

/** 深度冻结对象
 * 除了将对象本身冻结，对象的属性也应该冻结
 * @param {*} obj 需冻结的对象
 * @returns 冻结的对象
 * use: DEEP_FREEZE(object),对象中的函数亦不例外
 */
const DEEP_FREEZE = (obj) => {
  Object.keys(obj).forEach((key, i) => {
    // 如果obj[key]是个对象，冻结它 递归
    if (typeof obj[key] === "object" && obj[key] !== null)
      DEEP_FREEZE(obj[key]);
  });
  console.log("冻结?");
  // 将每个对象冻结
  return Object.freeze(obj);
};

/**
 * @module KidBlocks所需常量定义
 * @description 默认冻结该对象
 */
const CONSTANTS = Object.freeze({
  /**
   * @description ENUM for a right-facing value input.  E.g. 'set item to' or 'return'.
   */
  INPUT_VALUE: 1,

  /**
   * @description ENUM for a left-facing value output.  E.g. 'random fraction'.
   * Math分类中一个名为'random fraction'的块，形状为:左侧凸锯齿+四直角+无上下右内凹槽。
   */
  OUTPUT_VALUE: 2,

  /**
   * @description ENUM for a down-facing block stack.  E.g. 'if-do' or 'else'.
   */
  NEXT_STATEMENT: 3,

  /**
   * @description ENUM for an up-facing block stack.  E.g. 'break out of loop'.
   * Loops分类中一个名为'break out of loop'的块，形状为:上凹槽+左上下圆角+右上下直角
   */
  PREVIOUS_STATEMENT: 4,
});

/**
 * @module 多种文档命名空间及SVG元素标签转常量的定义
 * @description 默认冻结该对象
 */
const SVG_CONSTANTS = Object.freeze({
  /** @type {string} SVG元素所需的名称空间 */
  SVG_NS: "http://www.w3.org/2000/svg",
  /** @type {string} HTML元素所需的名称空间 */
  HTML_NS: "http://www.w3.org/1999/xhtml",
  /** @type {string} XLINK元素所需的名称空间 */
  XLINK_NS: "http://www.w3.org/1999/xlink",
  /** @type {<SVGAnimateElement>}
   * @description 动画元素放在形状元素的内部，用来定义一个元素的某个属性如何踩着时点改变。在指定持续时间里，属性从开始值变成结束值。
   */
  ANIMATE: "animate",
  /** @type {<SVGCircleElement>}
   * @description 一个SVG的基本形状，用来创建圆,基于一个圆心和一个半径。
   */
  CIRCLE: "circle",
  /** @type {<SVGClipPathElement>}
   * @description 定义一条剪切路径，可作为其他元素的 clip-path 属性的值。剪切路径限制了图形的可见范围。从概念上来说，如果图形超出了当前剪切路径所包围的区域，那么超出部分将不会绘制。
   */
  CLIPPATH: "clipPath",
  /** @type {<SVGDefsElement>}
   * @description 定义以后需要重复使用的图形元素。 建议把所有需要再次使用的引用元素定义在defs元素里面。这样做可以增加SVG内容的易读性和可访问性。 在defs元素中定义的图形元素不会直接呈现。 你可以在你的视口的任意地方利用 <use>元素呈现这些元素
   */
  DEFS: "defs",
  /** @type {<SVGFECompositeElement>}
   * @description 该滤镜执行两个输入图像的智能像素组合，在图像空间中使用以下Porter-Duff合成操作之一：over、in、atop、xor。
   */
  FECOMPOSITE: "feComposite",
  /** @type {<SVGFEComponentTransferElement>}
   * @description 滤镜基元对每个像素执行颜色分量的数据重映射.它允许进行像亮度调整,对比度调整,色彩平衡或阈值的操作.
   */
  FECOMPONENTTRANSFER: "feComponentTransfer",
  /** @type {<SVGFEFloodElement>}
   * @description 该滤镜用flood-color元素定义的颜色和flood-opacity元素定义的不透明度填充了滤镜子区域。
   */
  FEFLOOD: "feFlood",
  /** @type {<SVGFEFuncAElement>}
   * @description 为它的父元素 <feComponentTransfer> 的输入图形的透明度（alpha）组件定义了变换函数。
   */
  FEFUNCA: "feFuncA",
  /** @type {<SVGFEGaussianBlurElement>}
   * @description 该滤镜对输入图像进行高斯模糊，属性stdDeviation中指定的数量定义了钟形。
   */
  FEGAUSSIANBLUR: "feGaussianBlur",

  /** @type {<SVGFEPointLightElement>}
   * @description 光源元素
   */
  FEPOINTLIGHT: "fePointLight",
  /** @type {<SVGFESpecularLightingElement>}
   * @description 该滤镜照亮一个源图形，使用alpha通道作为隆起映射。利用在应用到纹理图像前添加多个光映射，可以模拟多个光源。
   */
  FESPECULARLIGHTING: "feSpecularLighting",
  /** @type {<SVGFilterElement>}
   * @description 作为原子滤镜操作的容器。它不能直接呈现。可以利用目标SVG元素上的filter属性引用一个滤镜。
   */
  FILTER: "filter",
  /** @type {<SVGForeignObjectElement>}
   * @description 允许包含来自不同的XML命名空间的元素。在浏览器的上下文中，很可能是XHTML / HTML
   */
  FOREIGNOBJECT: "foreignObject",
  /** @type {<SVGGElement>}
   * @description 用来组合对象的容器。添加到g元素上的变换会应用到其所有的子元素上。添加到g元素的属性会被其所有的子元素继承。此外，g元素也可以用来定义复杂的对象，之后可以通过<use>元素来引用它们。
   */
  G: "g",
  /** @type {<SVGImageElement>}
   * @description SVG元素包含图像信息。它表现为图像文件或者其他SVG文件。SVG图像格式转换软件支持JPEG、PNG格式
   */
  IMAGE: "image",
  /** @type {<SVGLineElement>}
   * @description 一个SVG基本形状，用来创建一条连接两个点的线。
   */
  LINE: "line",
  /** @type {<SVGPathElement>}
   * @description 用来定义形状的通用元素。所有的基本形状都可以用path元素来创建。
   */
  PATH: "path",
  /** @type {<SVGPatternElement>}
   * @description 使用预定义的图形对一个对象进行填充或描边，就要用到pattern元素。pattern元素让预定义图形能够以固定间隔在x轴和y轴上重复（或平铺）从而覆盖要涂色的区域。先使用pattern元素定义图案，然后在给定的图形元素上用属性fill或属性stroke引用用来填充或描边的图案。
   */
  PATTERN: "pattern",
  /** @type {<SVGPolygonElement>}
   * @description 定义了一个由一组首尾相连的直线线段构成的闭合多边形形状。最后一点连接到第一点。
   */
  POLYGON: "polygon",
  /** @type {<SVGRectElement>}
   * @description 一个基本形状，用来创建矩形，基于一个角位置以及它的宽和高。它还可以用来创建圆角矩形。
   */
  RECT: "rect",
  /** @type {<SVGSVGElement>}
   * @description 如果svg不是根元素，svg 元素可以用于在当前文档（比如说，一个HTML文档）内嵌套一个独立的svg片段 。 这个独立片段拥有独立的视口和坐标系统。
   */
  SVG: "svg",
  /** @type {<SVGTextElement>}
   * @description 定义了一个由文字组成的图形。可以将渐变、图案、剪切路径、遮罩或者滤镜应用到text上。
   */
  TEXT: "text",
  /** @type {<SVGTSpanElement>}
   * @description 在 <text>元素中，利用内含的tspan元素，可以调整文本和字体的属性以及当前文本的位置、绝对或相对坐标值。
   */
  TSPAN: "tspan",
});

console.log(SVG_CONSTANTS);

/**
 * @module  svg的各种paths,用于创建部分SVG路径字符串的方法，该对象创建时冻结
 * @type {Object}
 */
const SvgPaths = {
  /**
   * @function 创建一个表示给定的x，y对的字符串。坐标是相对的还是绝对的都没有关系。
   * @description
   * @param {number} x x坐标.
   * @param {number} y y坐标.
   * @returns {string} 格式为: ' x,y '
   * @example
   * SvgPaths.point(xValue, yValue)
   */
  point(x, y) {
    return ` ${x},${y} `;
  },

  /**
   * @function 绘制曲线或二次曲线.这些坐标是无单位的，因此在用户坐标系中
   * @param {string} command 要使用的命令。应该是其中之一: c, C, s, S, q, Q.
   * @param {!Array.<string>} points 包含按顺序传递给曲线命令的所有点的数组。这些点表示为格式为“ x，y”的字符串
   * @return {string} 定义一个或多个贝塞尔曲线的字符串.
   * @example
   *  SvgPaths.curve("c", [
   *    SvgPaths.point(3, 5),
   *    SvgPaths.point(6, 9),
   *    SvgPaths.point(11, 13)]);
   */
  curve(command, points) {
    return ` ${command + points.join("")}`;
  },

  /**
   * @function 将光标移动到给定位置而不画线。坐标是绝对的、无单位的，因此位于用户坐标系中。
   * @param {number} x 绝对x坐标.
   * @param {number} y 绝对y坐标.
   * @return {string} 格式为: ' M x,y '
   * @example
   *  SvgPaths.moveTo(0, 0);
   */
  moveTo(x, y) {
    return ` M ${x},${y} `;
  },

  /**
   * @function 将光标移动到给定位置而不画线。坐标是相对的、无单位的，因此位于用户坐标系中
   * @param {number} dx 相对x坐标.
   * @param {number} dy 相对y坐标.
   * @return {string} 格式为: ' m x,y '
   * @example
   *  SvgPaths.moveBy(25, -8.7);
   */
  moveBy(dx, dy) {
    return ` m ${dx},${dy} `;
  },

  /**
   * @function 从当前点到终点画一条线，该点是当前点在x轴上偏移dx，在y轴上偏移dy的位置.
   * @description 这些坐标是无单位的，因此位于用户坐标系中
   * @param {number} dx 相对x坐标.
   * @param {number} dy 相对y坐标.
   * @return {string} 格式为: ' l dx,dy '
   * @example
   *  SvgPaths.lineTo(5.1, 2.6);
   */
  lineTo(dx, dy) {
    return ` l ${dx},${dy} `;
  },

  /**
   * @function 绘制多条线，依次连接所有给定点。这等效于一系列'l'命令
   * @description 这些坐标是无单位的，因此位于用户坐标系中
   * @param {!Array.<string>} points 包含按顺序绘制线的所有点的数组,格式为:' dx,dy '.
   * @return {string} 格式为:' l (dx,dy)+ '
   * @example
   *  SvgPaths.line([SvgPaths.point(3, 5), SvgPaths.point(6, 9),……]);
   */
  line(points) {
    return ` l${points.join("")}`;
  },

  /**
   * @function 画一条水平或垂直线。第一个参数指定方向以及给定位置是相对位置还是绝对位置。
   * @description 这些坐标是无单位的，因此位于用户坐标系中
   * @param {string} command 预先设置命令给坐标.应该是其中之一: V, v, H, h.
   * @param {number} val 传递给命令的坐标。它可以是绝对的或相对的.
   * @return {string} 格式为: ' command val '
   * @example
   *  SvgPaths.lineOnAxis("V", 1)
   *  SvgPaths.lineOnAxis("H", 3)
   *  SvgPaths.lineOnAxis("v", 5)
   *  SvgPaths.lineOnAxis("h", 7)
   */
  lineOnAxis(command, val) {
    return ` ${command} ${val} `;
  },

  /**
   * @function 画一条椭圆弧线.
   * @description 这些坐标是无单位的，因此位于用户坐标系中
   * @param {string} command 命令字符串.'a' or 'A'.
   * @param {string} flags 标志字符串.
   * @param {number} radius 画圆弧的半径.
   * @param {string} point 绘制圆弧后将光标移动到的点,根据命令以绝对坐标或相对坐标指定
   * @return {string} 格式为: 'command radius radius flags point'
   * @example
   *  SvgPaths.arc("a", "0 0,0", 8, SvgPaths.point(-8, 8));
   */
  arc(command, flags, radius, point) {
    return `${command} ${radius} ${radius} ${flags + point}`;
  },
};

/**
 * =============================================
 * @module BlockRendering对象之Types的常量定义
 * @description 可测量的类型
 */
const BLOCK_RENDERING_TYPES_CONSTANTS = Object.freeze({
  NONE: 0 /** @description None. */,
  FIELD: 1 << 0 /** @description Field. */,
  HAT: 1 << 1 /** @description Hat. */,
  ICON: 1 << 2 /** @description Icon. */,
  SPACER: 1 << 3 /** @description Spacer. */,
  BETWEEN_ROW_SPACER: 1 << 4 /** @description 行间距之间. */,
  IN_ROW_SPACER: 1 << 5 /** @description 行分隔符. */,
  EXTERNAL_VALUE_INPUT: 1 << 6 /** @description 外部值输入. */,
  INPUT: 1 << 7 /** @description Input. */,
  INLINE_INPUT: 1 << 8 /** @description 内联输入. */,
  STATEMENT_INPUT: 1 << 9 /** @description 语句输入. */,
  CONNECTION: 1 << 10 /** @description 连接. */,
  PREVIOUS_CONNECTION: 1 << 11 /** @description Previous 的连接. */,
  NEXT_CONNECTION: 1 << 12 /** @description Next 的连接. */,
  OUTPUT_CONNECTION: 1 << 13 /** @description Output 的连接. */,
  CORNER: 1 << 14 /** @description 角. */,
  LEFT_SQUARE_CORNER: 1 << 15 /** @description 方角. */,
  LEFT_ROUND_CORNER: 1 << 16 /** @description 圆角. */,
  RIGHT_SQUARE_CORNER: 1 << 17 /** @description Right 方角. */,
  RIGHT_ROUND_CORNER: 1 << 18 /** @description Right Round 角. */,
  JAGGED_EDGE: 1 << 19 /** @description Jagged Edge. 锯齿边缘. */,
  ROW: 1 << 20 /** @description 行. */,
  TOP_ROW: 1 << 21 /** @description 顶行. */,
  BOTTOM_ROW: 1 << 22 /** @description 底行. */,
  INPUT_ROW: 1 << 23 /** @description 输入行. */,
});

/**
 * @module 类型相关检测函数
 * @description 解构类型常量，并添加类型相关检测函数
 */
const BLOCK_RENDERING_TYPES = {
  /** @description 可测量的类型BlockRendering对象之Types的常量定义 */
  ...BLOCK_RENDERING_TYPES_CONSTANTS,

  /**
   * @function 是否存储有关(FIELD|字段)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关字段的信息，则为1
   */
  isField(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.FIELD;
  },

  /**
   * @function 是否存储有关(HAT)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关HAT的信息，则为1
   */
  isHat(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.HAT;
  },

  /**
   * @function 是否存储有关(ICON|图标)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关图标的信息，则为1
   */
  isIcon(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.ICON;
  },

  /**
   * @function 是否存储有关(SPACER|间隔)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关间隔的信息，则为1
   */
  isSpacer(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.SPACER;
  },

  /**
   * @function 是否存储有关(IN_ROW_SPACER|行内分隔符)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关行内分隔符的信息，则为1
   */
  isInRowSpacer(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.IN_ROW_SPACER;
  },

  /**
   * @function 是否存储有关(INPUT|输入)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关输入的信息，则为1
   */
  isInput(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.INPUT;
  },

  /**
   * @function 是否存储有关(EXTERNAL_VALUE_INPUT|外部输入)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关外部输入的信息，则为1
   */
  isExternalInput(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.EXTERNAL_VALUE_INPUT;
  },

  /**
   * @function 是否存储有关(INLINE_INPUT|内联输入)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关内联输入的信息，则为1
   */
  isInlineInput(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.INLINE_INPUT;
  },

  /**
   * @function 是否存储有关(STATEMENT_INPUT|语句输入)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关语句输入的信息，则为1
   */
  isStatementInput(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.STATEMENT_INPUT;
  },

  /**
   * @function 是否存储有关(PREVIOUS_CONNECTION|先前连接)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关先前连接的信息，则为1
   */
  isPreviousConnection(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.PREVIOUS_CONNECTION;
  },

  /**
   * @function 是否存储有关(NEXT_CONNECTION|下一个连接)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关下一个连接的信息，则为1
   */
  isNextConnection(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.NEXT_CONNECTION;
  },

  /**
   * @function 是否存储有关上一个或下一个连接的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关上一个或下一个连接的信息，则为1
   */
  isPreviousOrNextConnection(el) {
    return (
      el.type &
      (BLOCK_RENDERING_TYPES_CONSTANTS.PREVIOUS_CONNECTION |
        BLOCK_RENDERING_TYPES_CONSTANTS.NEXT_CONNECTION)
    );
  },

  /**
   * @function 是否存储有关(LEFT_ROUND_CORNER|左圆角)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关左圆角的信息，则为1
   */
  isLeftRoundedCorner(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.LEFT_ROUND_CORNER;
  },

  /**
   * @function 是否存储有关(RIGHT_ROUND_CORNER|右圆角)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关右圆角的信息，则为1
   */
  isRightRoundedCorner(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.RIGHT_ROUND_CORNER;
  },

  /**
   * @function 是否存储有关(LEFT_SQUARE_CORNER|左方角)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关左方角的信息，则为1
   */
  isLeftSquareCorner(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.LEFT_SQUARE_CORNER;
  },

  /**
   * @function 是否存储有关(RIGHT_SQUARE_CORNER|右方角)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关右方角的信息，则为1
   */
  isRightSquareCorner(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.RIGHT_SQUARE_CORNER;
  },

  /**
   * @function 是否存储有关(CORNER|拐角)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关拐角的信息，则为1
   */
  isCorner(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.CORNER;
  },

  /**
   * @function 是否存储有关(JAGGED_EDGE|锯齿边缘)的信息
   * @param {*} el 待检查的元素
   * @returns {number} 如果对象存储有关锯齿边缘的信息，则为1
   */
  isJaggedEdge(el) {
    return el.type & BLOCK_RENDERING_TYPES_CONSTANTS.JAGGED_EDGE;
  },

  /**
   * @function 是否存储有关(ROW|行)的信息
   * @param {blockRendering.Row} row 待检查的行
   * @returns {number} 如果对象存储有关行的信息，则为1
   */
  isRow(row) {
    return row.type & BLOCK_RENDERING_TYPES_CONSTANTS.ROW;
  },

  /**
   * @function 是否存储有关(BETWEEN_ROW_SPACER|行间间隔)的信息
   * @param {blockRendering.Row} row 待检查的行
   * @returns {number} 如果对象存储有关行间间隔的信息，则为1
   */
  isBetweenRowSpacer(row) {
    return row.type & BLOCK_RENDERING_TYPES_CONSTANTS.BETWEEN_ROW_SPACER;
  },

  /**
   * @function 是否存储有关(TOP_ROW|顶行)的信息
   * @param {blockRendering.Row} row 待检查的行
   * @returns {number} 如果对象存储有关顶行的信息，则为1
   */
  isTopRow(row) {
    return row.type & BLOCK_RENDERING_TYPES_CONSTANTS.TOP_ROW;
  },

  /**
   * @function 是否存储有关(BOTTOM_ROW|底行)的信息
   * @param {blockRendering.Row} row 待检查的行
   * @returns {number} 如果对象存储有关底行的信息，则为1
   */
  isBottomRow(row) {
    return row.type & BLOCK_RENDERING_TYPES_CONSTANTS.BOTTOM_ROW;
  },

  /**
   * @function 是否存储有关顶行还是底行的信息
   * @param {blockRendering.Row} row 待检查的行
   * @returns {number} 如果对象存储有关顶行还是底行的信息，则为1
   */
  isTopOrBottomRow(row) {
    return (
      row.type &
      (BLOCK_RENDERING_TYPES_CONSTANTS.TOP_ROW |
        BLOCK_RENDERING_TYPES_CONSTANTS.BOTTOM_ROW)
    );
  },

  /**
   * @function 是否存储有关(INPUT_ROW|输入行)的信息
   * @param {blockRendering.Row} row 待检查的行
   * @returns {number} 如果对象存储有关输入行的信息，则为1
   */
  isInputRow(row) {
    return row.type & BLOCK_RENDERING_TYPES_CONSTANTS.INPUT_ROW;
  },
};

console.log("可测量的类型:", BLOCK_RENDERING_TYPES_CONSTANTS);
console.log("可测量的类型+检测函数:", BLOCK_RENDERING_TYPES);

/**
 * @function 以图形方式将块渲染为SVG的方法
 * @description 表示在渲染过程中占用空间的块的一部分的基类.每个非空格可衡量的构造函数都记录块元素的大小(e.g. field, statement input).
 * @param {!KidBlocks.BlockRendering.ConstantProvider} constants The rendering constants provider.
 */
function BlockRenderingMeasurable(constants) {
  return {
    width: 0,
    height: 0,
    type: BLOCK_RENDERING_TYPES_CONSTANTS.NONE,
    xPos: 0,
    centerline: 0,
    /** @type {!KidBlocks.BlockRendering.BlockRenderingConstantProvider} */
    constants,
    /** 从块左侧或语句内部输入到槽口左侧的偏移量 */
    nothOffset: constants.NOTCH_OFFSET_LEFT,
  };
}

/**
 * @function 表示连接的基类及其在块上所占的空间.
 * @param {!KidBlocks.BlockRendering.ConstantProvider} constants 渲染常量提供
 * @param {!KidBlocks.RenderedConnection} connectionModel 这代表的块上的连接对象.
 * @description connectionModel可以暂时简单的传个对象{type:1}
 * @extends {KidBlocks.BlockRendering.BlockRenderingMeasurable}
 * @example
 *  BlockRenderingBaseConnection(new BlockRenderingConstantProvider(), {type:1})
 */
function BlockRenderingBaseConnection(constants, connectionModel) {
  const measurable = BlockRenderingMeasurable(constants);
  console.log("measurable:", measurable);
  return Object.assign({}, measurable, {
    connectionModel,
    /** @description 形状 通过该函数及参数返回对应的形状 */
    shape: constants.shapeFor(connectionModel),
    /** 是否动态形状 */
    get isDynamicShape() {
      return !!this.shape["isDynamic"];
    },
    /** @description 类型: 连接 */
    type: measurable.type | BLOCK_RENDERING_TYPES_CONSTANTS.CONNECTION,
  });
}

/**
 * @function 包含有关渲染期间输出连接占用空间的信息的对象
 * @param {!KidBlocks.BlockRendering.ConstantProvider} constants 渲染常量提供
 * @param {!KidBlocks.RenderedConnection} connectionModel 这代表的块上的连接对象.
 * @description connectionModel可以暂时简单的传个对象{type:2}
 * @extends {KidBlocks.BlockRendering.BlockRenderingBaseConnection}
 * @example
 *  BlockRenderingOutputConnection(new BlockRenderingConstantProvider(), {})
 */
function BlockRenderingOutputConnection(constants, connectionModel) {
  const connection = BlockRenderingBaseConnection(constants, connectionModel);
  console.log("connection:", connection);
  return Object.assign({}, connection, {
    /** @description 类型: 输出连接 */
    type: connection.type | BLOCK_RENDERING_TYPES_CONSTANTS.OUTPUT_CONNECTION,
    height: !connection.isDynamicShape ? connection.shape.height : 0,
    width: !connection.isDynamicShape ? connection.shape.width : 0,
    get startX() {
      return this.width;
    },
    connectionOffsetX: 0,
    connectionOffsetY: constants.TAB_OFFSET_FROM_TOP,
  });
}

/**
 * @function 包含有关渲染期间先前连接占用空间的信息的对象
 * @param {!KidBlocks.BlockRendering.ConstantProvider} constants 渲染常量提供
 * @param {!KidBlocks.RenderedConnection} connectionModel 这代表的块上的连接对象.
 * @description connectionModel可以暂时简单的传个对象{type:4}
 * @extends {KidBlocks.BlockRendering.BlockRenderingBaseConnection}
 * @example
 *  BlockRenderingPreviousConnection(new BlockRenderingConstantProvider(), {})
 */
function BlockRenderingPreviousConnection(constants, connectionModel) {
  const connection = BlockRenderingBaseConnection(constants, connectionModel);
  console.log("connection:", connection);
  return Object.assign({}, connection, {
    /** @description 类型: 上一连接 */
    type: connection.type | BLOCK_RENDERING_TYPES_CONSTANTS.PREVIOUS_CONNECTION,
    height: connection.shape.height,
    width: connection.shape.width,
  });
}

/**
 * @function 包含有关渲染期间下一个连接占用空间的信息的对象
 * @param {!KidBlocks.BlockRendering.ConstantProvider} constants 渲染常量提供
 * @param {!KidBlocks.RenderedConnection} connectionModel 这代表的块上的连接对象.
 * @description connectionModel可以暂时简单的传个对象{type:3}
 * @extends {KidBlocks.BlockRendering.BlockRenderingBaseConnection}
 * @example
 *  BlockRenderingNextConnection(new BlockRenderingConstantProvider(), {})
 */
function BlockRenderingNextConnection(constants, connectionModel) {
  const connection = BlockRenderingBaseConnection(constants, connectionModel);
  console.log("connection:", connection);
  return Object.assign({}, connection, {
    /** @description 类型: 下一连接 */
    type: connection.type | BLOCK_RENDERING_TYPES_CONSTANTS.NEXT_CONNECTION,
    height: connection.shape.height,
    width: connection.shape.width,
  });
}

// console.log(
//   "?",
//   BlockRenderingNextConnection(new BlockRenderingConstantProvider(), {
//     height: 4,
//     pathLeft: " l 6,4  3,0  6,-4 ",
//     pathRight: " l -6,4  -3,0  -6,-4 ",
//     type: 2,
//     width: 15,
//   })
// );

/**
 *
 * 尝试函数式 组合+继承的方式，实现多种渲染
 *
 *
 */

/**
 * @module 渲染，基类，常量
 * common的渲染函数,内中定义属性、函数等
 */
function BlockRenderingConstantProvider() {
  return {
    /** @const @type {number} hat的起笔高度 top hat */
    START_HAT_HEIGHT: 15,
    /** @const @type {number} hat的宽度 top hat */
    START_HAT_WIDTH: 100,
    /** @const @type {boolean} 字段的文本元素的主要基线. */
    FIELD_TEXT_BASELINE_CENTER: true,
    /** 从块左侧或语句内部输入到槽口左侧的偏移量
     * BlockRenderingMeasurable 函数使用
     */
    NOTCH_OFFSET_LEFT: 15,
    /** 距拼图选项卡所在的块的顶部的偏移量
     * BlockRenderingOutputConnection 函数使用
     */
    TAB_OFFSET_FROM_TOP: 5,

    // /**
    //  * 初始化，暂时不需要，以后若需要再写
    //  */
    // init() {
    //   console.log("init初始化");
    //   return {
    //     START_HAT: this.makeStartHat(),
    //   };
    // },

    /**
     * 生成顶部块的顶边？
     */
    makeStartHat() {
      return {
        height: this.START_HAT_HEIGHT,
        width: this.START_HAT_WIDTH,
        path: SvgPaths.curve("c", [
          SvgPaths.point(30, -this.START_HAT_HEIGHT),
          SvgPaths.point(70, -this.START_HAT_HEIGHT),
          SvgPaths.point(this.START_HAT_WIDTH, 0),
        ]),
      };
    },

    getCss(selector) {
      console.log("基础函数的getCss函数");
    },

    /**
     * 根据连接的类型获取具有连接形状和尺寸信息的对象
     * @param {*} connection
     * @description BlockRenderingBaseConnection函数中使用，暂时写在这里，
     * 本函数未完成
     */
    shapeFor(connection) {
      console.log("shapeFor:", connection);
      switch (connection.type) {
        case CONSTANTS.INPUT_VALUE:
        case CONSTANTS.OUTPUT_VALUE:
          // return this.PUZZLE_TAB;
          console.log("this.PUZZLE_TAB");
          return;
        case CONSTANTS.PREVIOUS_STATEMENT:
        case CONSTANTS.NEXT_STATEMENT:
          // return this.NOTCH;
          console.log("this.NOTCH");
          return;
        default:
          throw Error("Unknown connection type 未知的连接类型");
      }
    },
  };
}
// console.log(new BlockRenderingConstantProvider());
// console.log(BlockRenderingConstantProvider().makeStartHat());

// console.log(BlockRenderingConstantProvider().START_HAT);
// console.log(BlockRenderingConstantProvider().makeStartHat());

/**
 * 某一类型渲染，组合common的渲染函数进来，并追加自己的函数
 * 有可能重写内部定义字段属性或方法
 */
function GerasConstantProvider() {
  const base_constantprovider = BlockRenderingConstantProvider();
  return Object.assign({}, base_constantprovider, {
    FIELD_TEXT_BASELINE_CENTER: false,
    getCss(selector) {
      base_constantprovider.getCss();
      console.log("子函数中的getCss函数，其上运行了一次基函数中的该函数");
    },
  });
}

// console.log(new GerasConstantProvider());
// console.log(GerasConstantProvider().getCss());

// /** 在外部使用的测试 */
// function BaseRenderer(name) {
//   return {
//     name: name,
//     constants_: null,

//     makeConstants() {
//       return new BlockRenderingConstantProvider();
//     },
//   };
// }

// // console.log(new BaseRenderer("aaa"));
// const base_renderer = new BaseRenderer();
// console.log(base_renderer.makeConstants());

/** 如果有可以脱离的函数，可以使用以下对象形式写为通用函数，在需要的地方调用 */
const skills = {
  code(thing) {
    /* ... */
    console.log(`code ${thing}`);
  },
  design(thing) {
    /* ... */
    console.log(`design ${thing}`);
  },
  sayHello() {
    /* ... */
    console.log(`sayHello`);
  },
};

/**
 * @module dom
 * @type {Object}
 */
const dom = DEEP_FREEZE({
  /**
   * @function 创建svg元素(包括但不限于svg内的其他元素)
   * @param {string|Blockly.utils.Svg<T>} name 元素名(以变量形式)
   * @param {!Object} attrs 特性组(用于解析当前元素设置的特性)
   * @param {Element=} parent 上级元素(用于指定创建元素的挂载点)
   * @return {T} 新创建的SVG元素
   * @example
   *  dom.createSvgElement(
   *    SVG_CONSTANTS.SVG,
   *    { xmlns: SVG_CONSTANTS.SVG_NS, class: "blocklyBlockDragSurface" },
   *    document.body
   *  );
   */
  createSvgElement(name, attrs, parent) {
    let el = document.createElementNS(SVG_CONSTANTS.SVG_NS, String(name));
    console.log("el:", el);
    for (let key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
    if (parent) parent.appendChild(el);
    return el;
  },
});

/**
 * @description 以下为对象整合，将以上所有对象，按照层级最终整理为一个对象，供外部使用
 *
 *
 *
 *
 *
 *
 */

/**
 * @module 当前库的工具相关
 * @type {Object}
 */
const utils = DEEP_FREEZE({
  /** @type {Object}  */ SvgPaths,
});

/** 测试整理blockRendering对象 */

function BlockRendering() {
  return {
    ConstantProvider: new BlockRenderingConstantProvider(),
  };
}

// const BlockRendering = {
//   ConstantProvider: new BlockRenderingConstantProvider(),
// };

/**
 * @module 最终给外部使用
 * @type {Object}
 */
const KidBlocks = {
  /** @description 常量 */
  ...CONSTANTS,
  /** @type {Object} */ utils,
  // 实例化基类
  blockRendering: new BlockRendering(),
  // blockRendering: BlockRendering,
  // 实例化派生类
  blockSvg: new GerasConstantProvider(),
};

console.dir(KidBlocks);
// console.log(KidBlocks);

// // function DemoSVG(tagname) {
// //   tagname,
// //   ANIMATE= new DemoSVG("animate"),
// // }

// let test = 1 << 24;
// console.log("test:", test);
// // 左移赋值运算符（<<=）将指定的位数移到左侧，并将结果赋给变量
// console.log("test:", (test <<= 1));
// // 按位或运算符（|）在每个操作数或两个操作数的对应位为1的每个位位置返回1
// console.log("|:", (1 << 15) | (1 << 16));
