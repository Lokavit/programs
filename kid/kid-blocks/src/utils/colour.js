/*
 * @Author: Satya
 * @Date: 2020-11-18 15:59:55
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-22 18:40:11
 * doc: 颜色操作
 */

/**
 * @description 基本颜色关键字
 */
const COLOUR_NAME = Object.freeze({
  aqua: "#00ffff",
  black: "#000000",
  blue: "#0000ff",
  fuchsia: "#ff00ff",
  gray: "#808080",
  green: "#008000",
  lime: "#00ff00",
  maroon: "#800000",
  navy: "#000080",
  olive: "#808000",
  purple: "#800080",
  red: "#ff0000",
  silver: "#c0c0c0",
  teal: "#008080",
  white: "#ffffff",
  yellow: "#ffff00",
});

const UtilColour = {
  /** 基本颜色关键字 */
  names: COLOUR_NAME,

  /**
   * @function 选择一个随机的颜色.
   * @return {string} #RRGGBB for random colour.
   */
  randomColour: function () {
    let num = Math.floor(Math.random() * Math.pow(2, 24));
    return "#" + ("00000" + num.toString(16)).substr(-6);
  },

  /**
   * @function 将颜色从RGB转换为十六进制
   * @param {*} r
   * @param {*} g
   * @param {*} b
   */
  rgbToHex: function (r, g, b) {
    let rgb = (r << 16) | (g << 8) | b;
    if (r < 0x10) return `#${(0x1000000 | rgb).toString(16).substr(1)}`;
    return `#${rgb.toString(16)}`;
  },

  /**
   * @function 解析颜色值
   * @param {*} str
   */
  parse: function (str) {
    str = String(str).toLowerCase().trim();
    let hex = COLOUR_NAME[str];
    if (hex) return hex;

    hex = str.substring(0, 2) == "0x" ? `#${str.substring(2)}` : str;
    hex = hex[0] == "#" ? hex : `#${hex}`;
    // 正则匹配  e.g. '#00ff88'
    if (/^#[0-9a-f]{6}$/.test(hex)) return hex;
    // 正则匹配  e.g. '#0f8'
    if (/^#[0-9a-f]{3}$/.test(hex))
      return ["#", hex[1], hex[1], hex[2], hex[2], hex[3], hex[3]].join("");

    let rgb = str.match(/^(?:rgb)?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
    if (rgb) {
      // e.g. 'rgb(0, 128, 255)'
      let r = Number(rgb[1]);
      let g = Number(rgb[2]);
      let b = Number(rgb[3]);
      if (r >= 0 && r < 256 && g >= 0 && g < 256 && b >= 0 && b < 256)
        return UtilColour.rgbToHex(r, g, b);
    }
    return null;
  },

  /**
   * @function 将HSV三元组转换为十六进制表示形式
   * @param {*} colour
   */
  hexToRgb: function (colour) {
    let hex = UtilColour.parse(colour);
    if (!hex) return [0, 0, 0];

    let rgb = parseInt(hex.substr(1), 16);
    let r = rgb >> 16;
    let g = (rgb >> 8) & 255;
    let b = rgb & 255;

    return [r, g, b];
  },

  /**
   * @function 将HSV三元组转换为十六进制表示形式
   * @param {*} h Hue value in [0, 360]
   * @param {*} s Saturation value in [0, 1]
   * @param {*} v Brightness in [0, 255]
   */
  hsvToHex: function (h, s, v) {
    let red = 0,
      green = 0,
      blue = 0;
    if (s == 0) {
      red = v;
      green = v;
      blue = v;
    } else {
      let sextant = Math.floor(h / 60);
      let remainder = h / 60 - sextant;
      let val1 = v * (1 - s);
      let val2 = v * (1 - s * remainder);
      let val3 = v * (1 - s * (1 - remainder));
      switch (sextant) {
        case 1:
          red = val2;
          green = v;
          blue = val1;
          break;
        case 2:
          red = val1;
          green = v;
          blue = val3;
          break;
        case 3:
          red = val1;
          green = val2;
          blue = v;
          break;
        case 4:
          red = val3;
          green = val1;
          blue = v;
          break;
        case 5:
          red = v;
          green = val1;
          blue = val2;
          break;
        case 6:
        case 0:
          red = v;
          green = val3;
          blue = val1;
          break;
      }
    }
    return UtilColour.rgbToHex(
      Math.floor(red),
      Math.floor(green),
      Math.floor(blue)
    );
  },

  /**
   * 使用指定的因子将两种颜色混合在一起，以指示赋予第一种颜色的权重
   * @param {*} colour1
   * @param {*} colour2
   * @param {*} factor
   */
  blend: function (colour1, colour2, factor) {
    let hex1 = UtilColour.parse(colour1);
    if (!hex1) {
      return null;
    }
    let hex2 = UtilColour.parse(colour2);
    if (!hex2) {
      return null;
    }
    let rgb1 = UtilColour.hexToRgb(hex1);
    let rgb2 = UtilColour.hexToRgb(hex2);
    let r = Math.round(rgb2[0] + factor * (rgb1[0] - rgb2[0]));
    let g = Math.round(rgb2[1] + factor * (rgb1[1] - rgb2[1]));
    let b = Math.round(rgb2[2] + factor * (rgb1[2] - rgb2[2]));
    return UtilColour.rgbToHex(r, g, b);
  },
};
