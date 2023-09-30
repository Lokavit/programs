/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2018 Google Inc.
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
 * @fileoverview Class for a category header in the flyout for Scratch
 * extensions which can display a textual label and a status button.
 * Scratch扩展的弹出窗口中类别标题的类，可以显示文本标签和状态按钮
 * @author ericr@media.mit.edu (Eric Rosenbaum)
 */
"use strict";

goog.provide("Blockly.FlyoutExtensionCategoryHeader");

goog.require("Blockly.FlyoutButton");

/**
 * Class for a category header in the flyout for Scratch extensions which can display a textual label and a status button.
 * Scratch扩展的弹出窗口中类别标题的类，可以显示文本标签和状态按钮
 * @param {!Blockly.WorkspaceSvg} workspace 放置此标题的工作空间.
 * @param {!Blockly.WorkspaceSvg} targetWorkspace 弹出窗口的目标工作区.
 * @param {!Element} xml 指定标头的XML.
 * @extends {Blockly.FlyoutButton}
 * @constructor
 */
Blockly.FlyoutExtensionCategoryHeader = function (
  workspace,
  targetWorkspace,
  xml
) {
  this.init(workspace, targetWorkspace, xml, false);

  /**
   * @type {number}
   * @private
   */
  this.flyoutWidth_ = this.targetWorkspace_.getFlyout().getWidth();

  /**
   * @type {string}
   */
  this.extensionId = xml.getAttribute("id");

  /**
   * 这是否是类别顶部的标签.
   * @type {boolean}
   * @private
   */
  this.isCategoryLabel_ = true;
};
goog.inherits(Blockly.FlyoutExtensionCategoryHeader, Blockly.FlyoutButton);

/**
 * Create the label and button elements.
 * @return {!Element} The SVG group.
 */
Blockly.FlyoutExtensionCategoryHeader.prototype.createDom = function () {
  var cssClass = "blocklyFlyoutLabel";

  this.svgGroup_ = Blockly.utils.createSvgElement(
    "g",
    { class: cssClass },
    this.workspace_.getCanvas()
  );

  this.addTextSvg(true);

  this.refreshStatus();

  var statusButtonWidth = 30;
  var marginX = 20;
  var marginY = 5;
  var touchPadding = 16;

  var statusButtonX = this.workspace_.RTL
    ? marginX - this.flyoutWidth_ + statusButtonWidth
    : (this.flyoutWidth_ - statusButtonWidth - marginX) / this.workspace_.scale;

  if (this.imageSrc_) {
    /** @type {SVGElement} */
    this.imageElement_ = Blockly.utils.createSvgElement(
      "image",
      {
        class: "blocklyFlyoutButton",
        height: statusButtonWidth + "px",
        width: statusButtonWidth + "px",
        x: statusButtonX + "px",
        y: marginY + "px",
      },
      this.svgGroup_
    );
    this.imageElementBackground_ = Blockly.utils.createSvgElement(
      "rect",
      {
        class: "blocklyTouchTargetBackground",
        height: statusButtonWidth + 2 * touchPadding + "px",
        width: statusButtonWidth + 2 * touchPadding + "px",
        x: statusButtonX - touchPadding + "px",
        y: marginY - touchPadding + "px",
      },
      this.svgGroup_
    );
    this.setImageSrc(this.imageSrc_); // ../media/status-not-ready.svg
  }

  this.callback_ = Blockly.statusButtonCallback.bind(this, this.extensionId);

  this.mouseUpWrapper_ = Blockly.bindEventWithChecks_(
    this.imageElementBackground_,
    "mouseup",
    this,
    this.onMouseUp_
  );
  return this.svgGroup_;
};

/**
 * 刷新状态。使用状态字符串在状态按钮上设置图像.
 */
Blockly.FlyoutExtensionCategoryHeader.prototype.refreshStatus = function () {
  var status = Blockly.FlyoutExtensionCategoryHeader.getExtensionState(
    this.extensionId
  );
  var basePath = Blockly.mainWorkspace.options.pathToMedia;
  if (status == Blockly.StatusButtonState.READY) {
    this.setImageSrc(basePath + "status-ready.svg"); // 准备完毕(绿色对号)
  }
  if (status == Blockly.StatusButtonState.NOT_READY) {
    this.setImageSrc(basePath + "status-not-ready.svg"); // 橙色叹号
  }
};

/**
 * 设置按钮图像的源URL.
 * @param {?string} src New source.
 * @package
 */
Blockly.FlyoutExtensionCategoryHeader.prototype.setImageSrc = function (src) {
  if (src === null) {
    // No change if null.
    return;
  }
  this.imageSrc_ = src;
  if (this.imageElement_) {
    this.imageElement_.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "xlink:href",
      this.imageSrc_ || ""
    );
  }
};

/**
 * 获取扩展状态. Overridden externally.
 * @param {string} extensionId The ID of the extension in question.
 * @return {Blockly.StatusButtonState} The state of the extension.
 * @public
 */
Blockly.FlyoutExtensionCategoryHeader.getExtensionState = function (/* extensionId */) {
  return Blockly.StatusButtonState.NOT_READY;
};
