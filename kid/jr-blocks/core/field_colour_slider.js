/*
 * @Author: Satya
 * @Date: 2020-06-06 10:14:32
 * @Last Modified by: Satya
 * @Last Modified time: 2020-06-16 16:37:02
 * doc:基于滑块的颜色输入字段的类
 */

/**
 * @fileoverview 颜色输入栏.
 * @author fraser@google.com (Neil Fraser)
 */
"use strict";

goog.provide("Blockly.FieldColourSlider");

goog.require("Blockly.Field");
goog.require("Blockly.DropDownDiv");
goog.require("goog.dom");
goog.require("goog.events");
goog.require("goog.style");
goog.require("goog.color");
goog.require("goog.ui.Slider");
goog.require("Blockly.utils.userAgent");

/**
 * 基于滑块的颜色输入字段的类.
 * @param {string} colour 初始颜色格式 '#rrggbb' format.
 * @param {Function=} opt_validator 选择新颜色时执行的功能。 它唯一的参数是新的颜色值。 除非未定义，否则它的返回值将成为选定的颜色，在这种情况下，将保留新的颜色；否则，该返回值将为null，在这种情况下，更改将中止.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldColourSlider = function (colour, opt_validator) {
  Blockly.FieldColourSlider.superClass_.constructor.call(
    this,
    colour,
    opt_validator
  );
  this.addArgType("colour");

  // 标记以跟踪是否应执行滑块回调
  this.sliderCallbacksEnabled_ = false;
};
goog.inherits(Blockly.FieldColourSlider, Blockly.Field);

/**
 * 从JSON arg对象构造FieldColourSlider.
 * @param {!Object} options A JSON object with options (colour).
 * @returns {!Blockly.FieldColourSlider} The new field instance.
 * @package
 * @nocollapse
 */
Blockly.FieldColourSlider.fromJson = function (options) {
  return new Blockly.FieldColourSlider(options["colour"]);
};

/**
 * 可以激活吸管时要调用的函数.
 * 如果定义，则将吸管按钮添加到颜色选择器中.
 * 该按钮通过回调来调用此函数以更新字段值.
 * 注意：这不是一个稳定的API，因此被标记为私有。 可能会改变.
 * @private
 */
Blockly.FieldColourSlider.activateEyedropper_ = null;

/**
 * 吸管svg图标的路径.
 */
Blockly.FieldColourSlider.EYEDROPPER_PATH = "eyedropper.svg";

/**
 * 将此字段安装在块上.
 * @param {!Blockly.Block} block 包含该字段的块.
 */
Blockly.FieldColourSlider.prototype.init = function (block) {
  // 颜色滑块已被初始化一次
  if (this.fieldGroup_) return;
  Blockly.FieldColourSlider.superClass_.init.call(this, block);
  this.setValue(this.getValue());
};

/**
 * 返回当前颜色.
 * @return {string} 当前颜色 in '#rrggbb' format.
 */
Blockly.FieldColourSlider.prototype.getValue = function () {
  return this.colour_;
};

/**
 * 设置颜色值.
 * @param {string} colour 新颜色值 in '#rrggbb' format.
 */
Blockly.FieldColourSlider.prototype.setValue = function (colour) {
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
    this.sourceBlock_.setColour(
      colour,
      colour,
      this.sourceBlock_.getColourTertiary()
    );
  }
  this.updateSliderHandles_();
  this.updateDom_();
};

/**
 * 为幻灯片背景创建色相，饱和度和值CSS渐变.
 * @param {string} channel – Either "hue", "saturation" or "value".
 * @return {string} Array colour hex colour stops for the given channel
 * @private
 */
Blockly.FieldColourSlider.prototype.createColourStops_ = function (channel) {
  console.log("创建色相：", channel); // 值为:case的三个字符串
  var stops = [];
  for (var n = 0; n <= 360; n += 20) {
    switch (channel) {
      case "hue":
        stops.push(goog.color.hsvToHex(n, this.saturation_, this.brightness_));
        break;
      case "saturation":
        stops.push(goog.color.hsvToHex(this.hue_, n / 360, this.brightness_));
        break;
      case "brightness":
        stops.push(
          goog.color.hsvToHex(this.hue_, this.saturation_, (255 * n) / 360)
        );
        break;
      default:
        throw new Error("Unknown channel for colour sliders: " + channel);
    }
  }
  console.log(Blockly.utils.userAgent);
  console.log("查看最终输出结果:", stops); // 三个数组，每个里面有19个颜色值元素
  return stops;
};

/**
 * 为给定的节点和通道设置渐变CSS属性
 * @param {Node} node - 将在其上设置渐变的DOM节点.
 * @param {string} channel – “色相”，“饱和度”或“值”.
 * @private
 */
Blockly.FieldColourSlider.prototype.setGradient_ = function (node, channel) {
  // 将某一组，转为字符串形式并拼接
  var gradient = this.createColourStops_(channel).join(",");
  goog.style.setStyle(
    node,
    "background",
    "-moz-linear-gradient(left, " + gradient + ")"
  );
  goog.style.setStyle(
    node,
    "background",
    "-webkit-linear-gradient(left, " + gradient + ")"
  );
  goog.style.setStyle(
    node,
    "background",
    "-o-linear-gradient(left, " + gradient + ")"
  );
  goog.style.setStyle(
    node,
    "background",
    "-ms-linear-gradient(left, " + gradient + ")"
  );
  goog.style.setStyle(
    node,
    "background",
    "linear-gradient(left, " + gradient + ")"
  );
};

/**
 * 值更改后更新读数和滑块背景.
 * @private
 */
Blockly.FieldColourSlider.prototype.updateDom_ = function () {
  if (this.hueSlider_) {
    // 更新滑块背景
    this.setGradient_(this.hueSlider_.getElement(), "hue");
    this.setGradient_(this.saturationSlider_.getElement(), "saturation");
    this.setGradient_(this.brightnessSlider_.getElement(), "brightness");

    // Update the readouts
    this.hueReadout_.textContent = Math.floor((100 * this.hue_) / 360).toFixed(
      0
    );
    this.saturationReadout_.textContent = Math.floor(
      100 * this.saturation_
    ).toFixed(0);
    this.brightnessReadout_.textContent = Math.floor(
      (100 * this.brightness_) / 255
    ).toFixed(0);
  }
};

/**
 * 从当前字段值更新滑块手柄位置.
 * @private
 */
Blockly.FieldColourSlider.prototype.updateSliderHandles_ = function () {
  if (this.hueSlider_) {
    // Don't let the following calls to setValue for each of the sliders
    // trigger the slider callbacks (which then call setValue on this field again
    // unnecessarily)
    this.sliderCallbacksEnabled_ = false;
    this.hueSlider_.setValue(this.hue_);
    this.saturationSlider_.setValue(this.saturation_);
    this.brightnessSlider_.setValue(this.brightness_);
    this.sliderCallbacksEnabled_ = true;
  }
};

/**
 * 从此字段获取文本。 块折叠时使用.
 * @return {string} Current text.
 */
Blockly.FieldColourSlider.prototype.getText = function () {
  var colour = this.colour_;
  // 如果可能，尝试使用#rgb格式，而不是#rrggbb.
  var m = colour.match(/^#(.)\1(.)\2(.)\3$/);
  if (m) {
    colour = "#" + m[1] + m[2] + m[3];
  }
  return colour;
};

/**
 * 创建标签和读出DOM元素，返回读出
 * @param {string} labelText - Text for the label
 * @return {Array} The container node and the readout node.
 * @private
 */
Blockly.FieldColourSlider.prototype.createLabelDom_ = function (labelText) {
  var labelContainer = document.createElement("div");
  labelContainer.setAttribute("class", "scratchColourPickerLabel");
  var readout = document.createElement("span");
  readout.setAttribute("class", "scratchColourPickerReadout");
  var label = document.createElement("span");
  label.setAttribute("class", "scratchColourPickerLabelText");
  label.textContent = labelText;
  labelContainer.appendChild(label);
  labelContainer.appendChild(readout);
  return [labelContainer, readout];
};

/**
 * 用于创建不同的滑块回调的工厂
 * @param {string} channel - One of "hue", "saturation" or "brightness"
 * @return {function} the callback for slider update
 * @private
 */
Blockly.FieldColourSlider.prototype.sliderCallbackFactory_ = function (
  channel
) {
  var thisField = this;
  return function (event) {
    if (!thisField.sliderCallbacksEnabled_) return;
    var channelValue = event.target.getValue();
    var hsv = goog.color.hexToHsv(thisField.getValue());
    switch (channel) {
      case "hue":
        hsv[0] = thisField.hue_ = channelValue;
        break;
      case "saturation":
        hsv[1] = thisField.saturation_ = channelValue;
        break;
      case "brightness":
        hsv[2] = thisField.brightness_ = channelValue;
        break;
    }
    var colour = goog.color.hsvToHex(hsv[0], hsv[1], hsv[2]);
    if (thisField.sourceBlock_) {
      // Call any validation function, and allow it to override.
      colour = thisField.callValidator(colour);
    }
    if (colour !== null) {
      thisField.setValue(colour, true);
    }
  };
};

/**
 * 激活吸管，传递用于设置字段值的回调.
 * @private
 */
Blockly.FieldColourSlider.prototype.activateEyedropperInternal_ = function () {
  var thisField = this;
  Blockly.FieldColourSlider.activateEyedropper_(function (value) {
    // Update the internal hue/saturation/brightness values so sliders update.
    var hsv = goog.color.hexToHsv(value);
    thisField.hue_ = hsv[0];
    thisField.saturation_ = hsv[1];
    thisField.brightness_ = hsv[2];
    thisField.setValue(value);
  });
};

/**
 * 在色域下创建色相，饱和度和亮度滑块.
 * @private
 */
Blockly.FieldColourSlider.prototype.showEditor_ = function () {
  Blockly.DropDownDiv.hideWithoutAnimation();
  Blockly.DropDownDiv.clearContent();
  var div = Blockly.DropDownDiv.getContentDiv();

  // 打开编辑器时使用的初始化颜色成分值，以保持滑块值稳定.
  var hsv = goog.color.hexToHsv(this.getValue());
  this.hue_ = hsv[0];
  this.saturation_ = hsv[1];
  this.brightness_ = hsv[2];

  // 在此处拦截，将滑块改为table形式

  var hueElements = this.createLabelDom_(Blockly.Msg.COLOUR_HUE_LABEL);
  div.appendChild(hueElements[0]);
  this.hueReadout_ = hueElements[1];
  this.hueSlider_ = new goog.ui.Slider();
  this.hueSlider_.setUnitIncrement(5);
  this.hueSlider_.setMinimum(0);
  this.hueSlider_.setMaximum(360);
  this.hueSlider_.setMoveToPointEnabled(true);
  this.hueSlider_.render(div);

  var saturationElements = this.createLabelDom_(
    Blockly.Msg.COLOUR_SATURATION_LABEL
  );
  div.appendChild(saturationElements[0]);
  this.saturationReadout_ = saturationElements[1];
  this.saturationSlider_ = new goog.ui.Slider();
  this.saturationSlider_.setMoveToPointEnabled(true);
  this.saturationSlider_.setUnitIncrement(0.01);
  this.saturationSlider_.setStep(0.001);
  this.saturationSlider_.setMinimum(0);
  this.saturationSlider_.setMaximum(1.0);
  this.saturationSlider_.render(div);

  var brightnessElements = this.createLabelDom_(
    Blockly.Msg.COLOUR_BRIGHTNESS_LABEL
  );
  div.appendChild(brightnessElements[0]);
  this.brightnessReadout_ = brightnessElements[1];
  this.brightnessSlider_ = new goog.ui.Slider();
  this.brightnessSlider_.setUnitIncrement(2);
  this.brightnessSlider_.setMinimum(0);
  this.brightnessSlider_.setMaximum(255);
  this.brightnessSlider_.setMoveToPointEnabled(true);
  this.brightnessSlider_.render(div);

  if (Blockly.FieldColourSlider.activateEyedropper_) {
    var button = document.createElement("button");
    button.setAttribute("class", "scratchEyedropper");
    var image = document.createElement("img");
    image.src =
      Blockly.mainWorkspace.options.pathToMedia +
      Blockly.FieldColourSlider.EYEDROPPER_PATH;
    button.appendChild(image);
    div.appendChild(button);
    Blockly.FieldColourSlider.eyedropperEventData_ = Blockly.bindEventWithChecks_(
      button,
      "click",
      this,
      this.activateEyedropperInternal_
    );
  }

  Blockly.DropDownDiv.setColour("#ffffff", "#dddddd");
  Blockly.DropDownDiv.setCategory(this.sourceBlock_.parentBlock_.getCategory());
  Blockly.DropDownDiv.showPositionedByBlock(this, this.sourceBlock_);

  // Set value updates the slider positions
  // Do this before attaching callbacks to avoid extra events from initial set
  this.setValue(this.getValue());

  // Enable callbacks for the sliders
  this.sliderCallbacksEnabled_ = true;

  Blockly.FieldColourSlider.hueChangeEventKey_ = goog.events.listen(
    this.hueSlider_,
    goog.ui.Component.EventType.CHANGE,
    this.sliderCallbackFactory_("hue")
  );
  Blockly.FieldColourSlider.saturationChangeEventKey_ = goog.events.listen(
    this.saturationSlider_,
    goog.ui.Component.EventType.CHANGE,
    this.sliderCallbackFactory_("saturation")
  );
  Blockly.FieldColourSlider.brightnessChangeEventKey_ = goog.events.listen(
    this.brightnessSlider_,
    goog.ui.Component.EventType.CHANGE,
    this.sliderCallbackFactory_("brightness")
  );
};

Blockly.FieldColourSlider.prototype.dispose = function () {
  if (Blockly.FieldColourSlider.hueChangeEventKey_) {
    goog.events.unlistenByKey(Blockly.FieldColourSlider.hueChangeEventKey_);
  }
  if (Blockly.FieldColourSlider.saturationChangeEventKey_) {
    goog.events.unlistenByKey(
      Blockly.FieldColourSlider.saturationChangeEventKey_
    );
  }
  if (Blockly.FieldColourSlider.brightnessChangeEventKey_) {
    goog.events.unlistenByKey(
      Blockly.FieldColourSlider.brightnessChangeEventKey_
    );
  }
  if (Blockly.FieldColourSlider.eyedropperEventData_) {
    Blockly.unbindEvent_(Blockly.FieldColourSlider.eyedropperEventData_);
  }
  Blockly.Events.setGroup(false);
  Blockly.FieldColourSlider.superClass_.dispose.call(this);
};
/** 注册 该颜色选择器 */
Blockly.Field.register("field_colour_slider", Blockly.FieldColourSlider);
