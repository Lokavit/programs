/*
 * @Author: Satya
 * @Date: 2020-06-01 15:08:13
 * @Last Modified by: Satya
 * @Last Modified time: 2020-06-01 15:12:06
 * doc:
 *  该文件，自定义所需颜色配置，并根据该对象中属性值，覆盖blockly.colours原值
 *  该文件中，每个分类三色值，即与XML的色值相同
 */

"use strict";

goog.provide("Blockly.Colours");

Blockly.Colours = {
  // SVG颜色：必须以#RRGGBB样式指定
  // 要添加不透明度，必须将其指定为单独的属性,对于SVG填充不透明度
  motion: {
    primary: "#4C97FF",
    secondary: "#4280D7",
    tertiary: "#3373CC",
  },
  looks: {
    primary: "#9966FF",
    secondary: "#855CD6",
    tertiary: "#774DCB",
  },
  sounds: {
    primary: "#CF63CF",
    secondary: "#C94FC9",
    tertiary: "#BD42BD",
  },
  control: {
    primary: "#FFAB19",
    secondary: "#EC9C13",
    tertiary: "#CF8B17",
  },
  event: {
    primary: "#FFBF00",
    secondary: "#E6AC00",
    tertiary: "#CC9900",
  },
  sensing: {
    primary: "#5CB1D6",
    secondary: "#47A8D1",
    tertiary: "#2E8EB8",
  },
  pen: {
    primary: "#0fBD8C",
    secondary: "#0DA57A",
    tertiary: "#0B8E69",
  },
  operators: {
    primary: "#59C059",
    secondary: "#46B946",
    tertiary: "#389438",
  },
  data: {
    primary: "#FF8C1A",
    secondary: "#FF8000",
    tertiary: "#DB6E00",
  },
  // 添加 music分类 三色配置
  music: {
    primary: "#0FBD8C",
    secondary: "#0DA57A",
    tertiary: "#DB6E00",
  },

  // 这不是一个新类别，而是为了区分列表和标量变量.
  data_lists: {
    primary: "#FF661A",
    secondary: "#FF5500",
    tertiary: "#E64D00",
  },
  more: {
    primary: "#FF6680",
    secondary: "#FF4D6A",
    tertiary: "#FF3355",
  },
  text: "#575E75",
  workspace: "#F9F9F9",
  toolboxHover: "#4C97FF",
  toolboxSelected: "#e9eef2",
  toolboxText: "#575E75",
  toolbox: "#FFFFFF",
  flyout: "#F9F9F9",
  scrollbar: "#CECDCE",
  scrollbarHover: "#CECDCE",
  textField: "#FFFFFF",
  insertionMarker: "#000000",
  insertionMarkerOpacity: 0.2,
  dragShadowOpacity: 0.3,
  stackGlow: "#FFF200",
  stackGlowSize: 4,
  stackGlowOpacity: 1,
  replacementGlow: "#FFFFFF",
  replacementGlowSize: 2,
  replacementGlowOpacity: 1,
  colourPickerStroke: "#FFFFFF",
  // CSS colours: support RGBA
  fieldShadow: "rgba(0,0,0,0.1)",
  dropDownShadow: "rgba(0, 0, 0, .3)",
  numPadBackground: "#547AB2",
  numPadBorder: "#435F91",
  numPadActiveBackground: "#435F91",
  numPadText: "white", // Do not use hex here, 它不能与数据URI内联SVG
  valueReportBackground: "#FFFFFF",
  valueReportBorder: "#AAAAAA",
};

/**
 * 覆盖Blockly.Color中的颜色，并根据给定的字典使用新值.
 * @param {!Object} colours 颜色属性和新值的字典.
 * @package
 */
Blockly.Colours.overrideColours = function (colours) {
  // 通过注射提供颜色覆盖
  if (colours) {
    for (var colourProperty in colours) {
      if (
        colours.hasOwnProperty(colourProperty) &&
        Blockly.Colours.hasOwnProperty(colourProperty)
      ) {
        // 如果一个属性同时具有colors选项和Blockly.Colours，请将Blockly.Colours值设置为override.
        // 用提供的属性覆盖按类别划分的颜色对象属性.
        var colourPropertyValue = colours[colourProperty];
        if (goog.isObject(colourPropertyValue)) {
          for (var colourSequence in colourPropertyValue) {
            if (
              colourPropertyValue.hasOwnProperty(colourSequence) &&
              Blockly.Colours[colourProperty].hasOwnProperty(colourSequence)
            ) {
              Blockly.Colours[colourProperty][colourSequence] =
                colourPropertyValue[colourSequence];
            }
          }
        } else {
          Blockly.Colours[colourProperty] = colourPropertyValue;
        }
      }
    }
  }
};
