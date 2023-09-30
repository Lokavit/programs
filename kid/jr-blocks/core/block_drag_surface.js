/*
 * @Author: Satya
 * @Date: 2020-06-15 13:48:57
 * @Last Modified by:   Satya
 * @Last Modified time: 2020-06-15 13:48:57
 * doc:一个管理用于拖动块的表面的类
 * 开始拖动块时，我们将块（和子元素）移动到一个单独的DOM元素，该元素将使用translate3d移动。 拖动结束时，这些块将放回到它们来自的SVG中。 通过避免在拖动块时每次鼠标移动都重新绘制整个SVG，这有助于提高性能
 */

"use strict";

goog.provide("Blockly.BlockDragSurfaceSvg");
goog.require("Blockly.utils");
goog.require("goog.asserts");
goog.require("goog.math.Coordinate");

/**
 * 当前拖动的块的拖动表面的类。 这是一个单独的SVG，仅包含当前移动的块，不包含任何内容.
 * @param {!Element} container Containing element.
 * @constructor
 */
Blockly.BlockDragSurfaceSvg = function (container) {
  /**
   * @type {!Element}
   * @private
   */
  this.container_ = container;
  this.createDom();
};

/**
 * The SVG drag surface. Set once by Blockly.BlockDragSurfaceSvg.createDom.
 * @type {Element}
 * @private
 */
Blockly.BlockDragSurfaceSvg.prototype.SVG_ = null;

/**
 * This is where blocks live while they are being dragged if the drag surface
 * is enabled.
 * @type {Element}
 * @private
 */
Blockly.BlockDragSurfaceSvg.prototype.dragGroup_ = null;

/**
 * Containing HTML element; parent of the workspace and the drag surface.
 * @type {Element}
 * @private
 */
Blockly.BlockDragSurfaceSvg.prototype.container_ = null;

/**
 * Cached value for the scale of the drag surface.
 * Used to set/get the correct translation during and after a drag.
 * @type {number}
 * @private
 */
Blockly.BlockDragSurfaceSvg.prototype.scale_ = 1;

/**
 * Cached value for the translation of the drag surface.
 * This translation is in pixel units, because the scale is applied to the
 * drag group rather than the top-level SVG.
 * @type {goog.math.Coordinate}
 * @private
 */
Blockly.BlockDragSurfaceSvg.prototype.surfaceXY_ = null;

/**
 * ID for the drag shadow filter, set in createDom.
 * Belongs in Scratch Blocks but not Blockly.
 * @type {string}
 * @private
 */
Blockly.BlockDragSurfaceSvg.prototype.dragShadowFilterId_ = "";

/**
 * Standard deviation for gaussian blur on drag shadow, in px.
 * Belongs in Scratch Blocks but not Blockly.
 * @type {number}
 * @const
 */
Blockly.BlockDragSurfaceSvg.SHADOW_STD_DEVIATION = 6;

/**
 * Create the drag surface and inject it into the container.
 */
Blockly.BlockDragSurfaceSvg.prototype.createDom = function () {
  if (this.SVG_) {
    return; // Already created.
  }
  this.SVG_ = Blockly.utils.createSvgElement(
    "svg",
    {
      xmlns: Blockly.SVG_NS,
      "xmlns:html": Blockly.HTML_NS,
      "xmlns:xlink": "http://www.w3.org/1999/xlink",
      version: "1.1",
      class: "blocklyBlockDragSurface",
    },
    this.container_
  );
  this.dragGroup_ = Blockly.utils.createSvgElement("g", {}, this.SVG_);
  // Belongs in Scratch Blocks, but not Blockly.
  var defs = Blockly.utils.createSvgElement("defs", {}, this.SVG_);
  this.dragShadowFilterId_ = this.createDropShadowDom_(defs);
  this.dragGroup_.setAttribute(
    "filter",
    "url(#" + this.dragShadowFilterId_ + ")"
  );
};

/**
 * Scratch-specific: Create the SVG def for the drop shadow.
 * @param {Element} defs Defs element to insert the shadow filter definition
 * @return {string} ID for the filter element
 * @private
 */
Blockly.BlockDragSurfaceSvg.prototype.createDropShadowDom_ = function (defs) {
  var rnd = String(Math.random()).substring(2);
  // Adjust these width/height, x/y properties to stop the shadow from clipping
  var dragShadowFilter = Blockly.utils.createSvgElement(
    "filter",
    {
      id: "blocklyDragShadowFilter" + rnd,
      height: "140%",
      width: "140%",
      y: "-20%",
      x: "-20%",
    },
    defs
  );
  Blockly.utils.createSvgElement(
    "feGaussianBlur",
    {
      in: "SourceAlpha",
      stdDeviation: Blockly.BlockDragSurfaceSvg.SHADOW_STD_DEVIATION,
    },
    dragShadowFilter
  );
  var componentTransfer = Blockly.utils.createSvgElement(
    "feComponentTransfer",
    { result: "offsetBlur" },
    dragShadowFilter
  );
  // Shadow opacity is specified in the adjustable colour library,
  // since the darkness of the shadow largely depends on the workspace colour.
  Blockly.utils.createSvgElement(
    "feFuncA",
    {
      type: "linear",
      slope: Blockly.Colours.dragShadowOpacity,
    },
    componentTransfer
  );
  Blockly.utils.createSvgElement(
    "feComposite",
    {
      in: "SourceGraphic",
      in2: "offsetBlur",
      operator: "over",
    },
    dragShadowFilter
  );
  return dragShadowFilter.id;
};

/**
 * Set the SVG blocks on the drag surface's group and show the surface.
 * Only one block group should be on the drag surface at a time.
 * @param {!Element} blocks Block or group of blocks to place on the drag
 * surface.
 */
Blockly.BlockDragSurfaceSvg.prototype.setBlocksAndShow = function (blocks) {
  goog.asserts.assert(
    this.dragGroup_.childNodes.length == 0,
    "Already dragging a block."
  );
  // appendChild removes the blocks from the previous parent
  this.dragGroup_.appendChild(blocks);
  this.SVG_.style.display = "block";
  this.surfaceXY_ = new goog.math.Coordinate(0, 0);
  // This allows blocks to be dragged outside of the blockly svg space.
  // This should be reset to hidden at the end of the block drag.
  // Note that this behavior is different from blockly where block disappear
  // "under" the blockly area.
  var injectionDiv = document.getElementsByClassName("injectionDiv")[0];
  injectionDiv.style.overflow = "visible";
};

/**
 * 将整个拖动曲面组平移并缩放到给定位置，以与工作空间保持同步。
 * @param {number} x X translation in workspace coordinates.
 * @param {number} y Y translation in workspace coordinates.
 * @param {number} scale Scale of the group.
 */
Blockly.BlockDragSurfaceSvg.prototype.translateAndScaleGroup = function (
  x,
  y,
  scale
) {
  this.scale_ = scale;
  // 这是一种变通方法，可以防止在拖动表面上拖动块时使块变得模糊.
  var fixedX = x.toFixed(0);
  var fixedY = y.toFixed(0);
  this.dragGroup_.setAttribute(
    "transform",
    "translate(" + fixedX + "," + fixedY + ") scale(" + scale + ")"
  );
};

/**
 * Translate the drag surface's SVG based on its internal state.
 * @private
 */
Blockly.BlockDragSurfaceSvg.prototype.translateSurfaceInternal_ = function () {
  var x = this.surfaceXY_.x;
  var y = this.surfaceXY_.y;
  // This is a work-around to prevent a the blocks from rendering
  // fuzzy while they are being dragged on the drag surface.
  x = x.toFixed(0);
  y = y.toFixed(0);
  this.SVG_.style.display = "block";

  Blockly.utils.setCssTransform(
    this.SVG_,
    "translate3d(" + x + "px, " + y + "px, 0px)"
  );
};

/**
 * Translate the entire drag surface during a drag.
 * We translate the drag surface instead of the blocks inside the surface
 * so that the browser avoids repainting the SVG.
 * Because of this, the drag coordinates must be adjusted by scale.
 * @param {number} x X translation for the entire surface.
 * @param {number} y Y translation for the entire surface.
 */
Blockly.BlockDragSurfaceSvg.prototype.translateSurface = function (x, y) {
  this.surfaceXY_ = new goog.math.Coordinate(x * this.scale_, y * this.scale_);
  this.translateSurfaceInternal_();
};

/**
 * Reports the surface translation in scaled workspace coordinates.
 * Use this when finishing a drag to return blocks to the correct position.
 * @return {!goog.math.Coordinate} Current translation of the surface.
 */
Blockly.BlockDragSurfaceSvg.prototype.getSurfaceTranslation = function () {
  var xy = Blockly.utils.getRelativeXY(this.SVG_);
  return new goog.math.Coordinate(xy.x / this.scale_, xy.y / this.scale_);
};

/**
 * Provide a reference to the drag group (primarily for
 * BlockSvg.getRelativeToSurfaceXY).
 * @return {Element} Drag surface group element.
 */
Blockly.BlockDragSurfaceSvg.prototype.getGroup = function () {
  return this.dragGroup_;
};

/**
 * Get the current blocks on the drag surface, if any (primarily
 * for BlockSvg.getRelativeToSurfaceXY).
 * @return {!Element|undefined} Drag surface block DOM element, or undefined
 * if no blocks exist.
 */
Blockly.BlockDragSurfaceSvg.prototype.getCurrentBlock = function () {
  return this.dragGroup_.firstChild;
};

/**
 * Clear the group and hide the surface; move the blocks off onto the provided
 * element.
 * If the block is being deleted it doesn't need to go back to the original
 * surface, since it would be removed immediately during dispose.
 * @param {Element=} opt_newSurface Surface the dragging blocks should be moved
 *     to, or null if the blocks should be removed from this surface without
 *     being moved to a different surface.
 */
Blockly.BlockDragSurfaceSvg.prototype.clearAndHide = function (opt_newSurface) {
  if (opt_newSurface) {
    // appendChild removes the node from this.dragGroup_
    opt_newSurface.appendChild(this.getCurrentBlock());
  } else {
    this.dragGroup_.removeChild(this.getCurrentBlock());
  }
  this.SVG_.style.display = "none";
  goog.asserts.assert(
    this.dragGroup_.childNodes.length == 0,
    "Drag group was not cleared."
  );
  this.surfaceXY_ = null;

  // Reset the overflow property back to hidden so that nothing appears outside
  // of the blockly area.
  // Note that this behavior is different from blockly. See note in
  // setBlocksAndShow.
  var injectionDiv = document.getElementsByClassName("injectionDiv")[0];
  injectionDiv.style.overflow = "hidden";
};
