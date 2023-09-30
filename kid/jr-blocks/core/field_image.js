/*
 * @Author: Satya
 * @Date: 2020-06-15 14:48:53
 * @Last Modified by: Satya
 * @Last Modified time: 2020-06-15 15:00:16
 * doc:图像字段。 用于图片，图标等
 * use:init积木块时，args中type: "field_image"的设置。
 */

"use strict";

goog.provide("Blockly.FieldImage");

goog.require("Blockly.Field");
goog.require("goog.dom");
goog.require("goog.math.Size");
goog.require("goog.userAgent");

/**
 * Class for an image on a block.
 * @param {string} src The URL of the image.
 * @param {number} width Width of the image.
 * @param {number} height Height of the image.
 * @param {string=} opt_alt Optional alt text for when block is collapsed.
 * @param {boolean} flip_rtl Whether to flip the icon in RTL
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldImage = function (src, width, height, opt_alt, flip_rtl) {
  this.sourceBlock_ = null;

  // Ensure height and width are numbers.  Strings are bad at math.
  this.height_ = Number(height);
  this.width_ = Number(width);
  this.size_ = new goog.math.Size(this.width_, this.height_);
  this.text_ = opt_alt || "";
  this.flipRTL_ = flip_rtl;
  this.setValue(src);
};
goog.inherits(Blockly.FieldImage, Blockly.Field);

/**
 * 从JSON arg对象构造一个FieldImage，取消引用任何字符串表引用.
 * @param {!Object} options 具有选项（src，宽度，高度，alt和flipRtl / flip_rtl）的JSON对象.
 * @returns {!Blockly.FieldImage} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldImage.fromJson = function (options) {
  // console.log("options:", options);
  var src = Blockly.utils.replaceMessageReferences(options["src"]);
  var width = Number(Blockly.utils.replaceMessageReferences(options["width"]));
  var height = Number(
    Blockly.utils.replaceMessageReferences(options["height"])
  );
  var alt = Blockly.utils.replaceMessageReferences(options["alt"]);
  var flip_rtl = !!options["flip_rtl"] || !!options["flipRtl"];
  return new Blockly.FieldImage(src, width, height, alt, flip_rtl);
};

/**
 * 可编辑字段由XML渲染器保存，不可编辑字段不保存.
 */
Blockly.FieldImage.prototype.EDITABLE = false;

/**
 * 将此映像安装在块上.
 */
Blockly.FieldImage.prototype.init = function () {
  // 图片已经初始化过一次
  if (this.fieldGroup_) return;
  // 构建元素.
  /** @type {SVGElement} */
  this.fieldGroup_ = Blockly.utils.createSvgElement("g", {}, null);
  if (!this.visible_) this.fieldGroup_.style.display = "none";
  /** @type {SVGElement} */
  this.imageElement_ = Blockly.utils.createSvgElement(
    "image",
    {
      height: this.height_ + "px",
      width: this.width_ + "px",
    },
    this.fieldGroup_
  );
  this.setValue(this.src_);
  this.sourceBlock_.getSvgRoot().appendChild(this.fieldGroup_);

  // Configure the field to be transparent with respect to tooltips.
  this.setTooltip(this.sourceBlock_);
  Blockly.Tooltip.bindMouseEvents(this.imageElement_);
};

/**
 * Dispose of all DOM objects belonging to this text.
 */
Blockly.FieldImage.prototype.dispose = function () {
  goog.dom.removeNode(this.fieldGroup_);
  this.fieldGroup_ = null;
  this.imageElement_ = null;
};

/**
 * Change the tooltip text for this field.
 * @param {string|!Element} newTip Text for tooltip or a parent element to
 *     link to for its tooltip.
 */
Blockly.FieldImage.prototype.setTooltip = function (newTip) {
  this.imageElement_.tooltip = newTip;
};

/**
 * Get the source URL of this image.
 * @return {string} Current text.
 * @override
 */
Blockly.FieldImage.prototype.getValue = function () {
  return this.src_;
};

/**
 * Set the source URL of this image.
 * @param {?string} src New source.
 * @override
 */
Blockly.FieldImage.prototype.setValue = function (src) {
  if (src === null) {
    // No change if null.
    return;
  }
  this.src_ = src;
  if (this.imageElement_) {
    this.imageElement_.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      src || ""
    );
  }
};

/**
 * Get whether to flip this image in RTL
 * @return {boolean} True if we should flip in RTL.
 */
Blockly.FieldImage.prototype.getFlipRTL = function () {
  return this.flipRTL_;
};

/**
 * Set the alt text of this image.
 * @param {?string} alt New alt text.
 * @override
 */
Blockly.FieldImage.prototype.setText = function (alt) {
  if (alt === null) {
    // No change if null.
    return;
  }
  this.text_ = alt;
};

/**
 * Images are fixed width, no need to render.
 * @private
 */
Blockly.FieldImage.prototype.render_ = function () {
  // NOP
};

/**
 * Images are fixed width, no need to update.
 * @private
 */
Blockly.FieldImage.prototype.updateWidth = function () {
  // NOP
};

Blockly.Field.register("field_image", Blockly.FieldImage);
