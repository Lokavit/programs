/*
 * @Author: Satya
 * @Date: 2020-11-23 10:43:52
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-17 12:00:46
 * doc:工具
 */

/** @description 唯一ID的合法字符 用于生成UID */
const SOUP =
  "!#%()*+,-./:;=?@[]^_`{|}~" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/**
 * @module base64相关处理
 */
const BASE64_UTIL = {
  /**
   * @function 将base64编码的字符串转换为Uint8Array
   * @param {string} dataURI 图像base64格式的DataURL
   *  @return {Uint8Array} - 解码的Uint8Array.
   */
  base64ToUintArray(dataURI) {
    const BASE64_MARKER = ";base64,";
    const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  },

  /**
   * @function 将Uint8Array转换为base64编码的字符串.
   * @param {Uint8Array} array - the array to convert.
   * @return {string} - the base64 encoded string.
   */
  uint8ArrayToBase64(array) {
    const base64 = window.btoa(String.fromCharCode.apply(null, array));
    return base64;
  },

  /**
   * @function 将数组缓冲区转换为base64编码的字符串.
   * @param {array} buffer - an array buffer to convert.
   * @return {string} - the base64 encoded string.
   */
  arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);

    // return window.btoa(String.fromCharCode(...new Uint8Array(buffer)));
  },
};

/**
 * @module 转换和比较KidBlocks数据类型的实用程序
 * KidBlocks在许多方面的行为与JavaScript略有不同，这些差异应封装在下面.
 * For example, in KidBlocks, add(1, join("hello", world")) -> 1.
 * This is because "hello world" is cast to 0.
 * In JavaScript, 1 + Number("hello" + "world") would give you NaN.
 * 在计算前强制值时使用.
 */
const CAST = {
  /**
   * @function 值转换为数字 Treats NaN as 0.
   * @param {*} value 值转换为数字.
   * @return {number}
   */
  toNumber(value) {
    // 如果value已经是一个数字，则无需使用Number（）强制它.
    if (typeof value === "number") {
      // 在需要时将NaN视为0. E.g., 0 + NaN -> 0.
      if (Number.isNaN(value)) return 0;
      return value;
    }
    const n = Number(value);
    // 在需要时将NaN视为0. E.g., 0 + NaN -> 0.
    if (Number.isNaN(n)) return 0;
    return n;
  },

  /**
   * @function 转换为布尔值.与JavaScript区别对待某些字符串值.
   * @param {*} value Value to cast to boolean.
   * @return {boolean}
   */
  toBoolean(value) {
    // 已经是布尔值?
    if (typeof value === "boolean") return value;

    if (typeof value === "string") {
      // 这些特定的字符串在KidBlocks中被视为false.
      if (value === "" || value === "0" || value.toLowerCase() === "false")
        return false;
      // 所有其他字符串均视为true.
      return true;
    }
    // 强制其他值和数字.
    return Boolean(value);
  },
  /**
   * @function 确定KidBlocks参数是否为空格字符串（或为null /空）.
   * @param {*} val value to check.
   * @return {boolean} True if the argument is all white spaces or null / empty.
   */
  isWhiteSpace(val) {
    return val === null || (typeof val === "string" && val.trim().length === 0);
  },

  /**
   * @function 使用KidBlocks强制转换，不区分大小写的字符串比较等比较两个值.
   * @param {*} v1 First value to compare.
   * @param {*} v2 Second value to compare.
   * @returns {number} Negative number if v1 < v2; 0 if equal; positive otherwise.
   */
  compare(v1, v2) {
    let n1 = Number(v1);
    let n2 = Number(v2);
    if (n1 === 0 && isWhiteSpace(v1)) {
      n1 = NaN;
    } else if (n2 === 0 && isWhiteSpace(v2)) {
      n2 = NaN;
    }
    if (isNaN(n1) || isNaN(n2)) {
      // 至少一个参数不能转换为数字. KidBlocks 比较字符串为不区分大小写.
      const s1 = String(v1).toLowerCase();
      const s2 = String(v2).toLowerCase();
      if (s1 < s2) {
        return -1;
      } else if (s1 > s2) {
        return 1;
      }
      return 0;
    }
    // 处理Infinity的特殊情况
    if (
      (n1 === Infinity && n2 === Infinity) ||
      (n1 === -Infinity && n2 === -Infinity)
    )
      return 0;

    // 比较数字.
    return n1 - n2;
  },
  /**
   * @function 确定KidBlocks参数编号是否表示舍入整数.
   * @param {*} val Value to check.
   * @return {boolean} True if number looks like an integer.
   */
  isInt(val) {
    // 已经是数字的值.
    if (typeof val === "number") {
      // NaN被认为是整数.
      if (isNaN(val)) return true;

      // True if it's "round" (e.g., 2.0 and 2).
      return val === parseInt(val, 10);
    } else if (typeof val === "boolean") {
      // `True` and `false` 总是代表整数.
      return true;
    } else if (typeof val === "string") {
      // 如果它包含小数点，请勿将其视为int.
      return val.indexOf(".") < 0;
    }
    return false;
  },

  get LIST_INVALID() {
    return "INVALID";
  },

  get LIST_ALL() {
    return "ALL";
  },

  /**
   * @function 基于KidBlocks参数，将基于1的索引计算为列表.
   * 可能会退回两种特殊情况:
   * LIST_ALL: 如果该块引用了列表中的所有项目.
   * LIST_INVALID: 如果索引以任何方式无效.
   * @param {*} index KidBlocks arg, including 1-based numbers or special cases.
   * @param {number} length Length of the list.
   * @param {boolean} acceptAll Whether it should accept "all" or not.
   * @return {(number|string)} 1-based index for list, LIST_ALL, or LIST_INVALID.
   */
  toListIndex(index, length, acceptAll) {
    if (typeof index !== "number") {
      if (index === "all") return acceptAll ? LIST_ALL : LIST_INVALID;

      if (index === "last") {
        if (length > 0) return length;

        return LIST_INVALID;
      } else if (index === "random" || index === "any") {
        if (length > 0) return 1 + Math.floor(Math.random() * length);

        return LIST_INVALID;
      }
    }
    index = Math.floor(toNumber(index));
    if (index < 1 || index > length) return LIST_INVALID;

    return index;
  },
};

/**
 * @module 色彩相关
 */
const COLOUR = {
  /** @description 黑色 */
  get RGB_BLACK() {
    return { r: 0, g: 0, b: 0 };
  },
  /** @description 白色 */
  get RGB_WHITE() {
    return { r: 255, g: 255, b: 255 };
  },

  /**
   * @function 将KidBlocks小数颜色转换为十六进制字符串#RRGGBB.
   * @param {number} decimal RGB color as a decimal.
   * @return {string} RGB color as #RRGGBB hex string.
   */
  decimalToHex(decimal) {
    if (decimal < 0) decimal += 0xffffff + 1;

    let hex = Number(decimal).toString(16);
    hex = `#${"000000".substr(0, 6 - hex.length)}${hex}`;
    return hex;
  },

  /**
   * @function 将KidBlocks小数颜色转换为RGB颜色对象.
   * @param {number} decimal RGB color as decimal.
   * @return {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
   */
  decimalToRgb(decimal) {
    const a = (decimal >> 24) & 0xff;
    const r = (decimal >> 16) & 0xff;
    const g = (decimal >> 8) & 0xff;
    const b = decimal & 0xff;
    return { r: r, g: g, b: b, a: a > 0 ? a : 255 };
  },

  /**
   * @function 将十六进制颜色（例如F00，＃03F，＃0033FF）转换为RGB颜色对象.
   * CC-BY-SA Tim Down:
   * https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
   * @param {!string} hex Hex representation of the color.
   * @return {RGBObject} null on failure, or rgb: {r: red [0,255], g: green [0,255], b: blue [0,255]}.
   */
  hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  /**
   * @function 将RGB颜色对象转换为KidBlocks十进制颜色.
   * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
   * @return {!number} 代表颜色的数字.
   */
  rgbToDecimal(rgb) {
    return (rgb.r << 16) + (rgb.g << 8) + rgb.b;
  },

  /**
   * @function 将RGB颜色对象转换为十六进制颜色.
   * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
   * @return {!string} 颜色的十六进制表示.
   */
  rgbToHex(rgb) {
    return decimalToHex(rgbToDecimal(rgb));
  },

  /**
   * @function 将十六进制颜色（例如F00，＃03F，＃0033FF）转换为十进制颜色数字.
   * @param {!string} hex 颜色的十六进制表示.
   * @return {!number} 代表颜色的数字.
   */
  hexToDecimal(hex) {
    return rgbToDecimal(hexToRgb(hex));
  },

  /**
   * @function 将HSV颜色转换为RGB格式.
   * @param {HSVObject} hsv - {h: hue [0,360), s: saturation [0,1], v: value [0,1]}
   * @return {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
   */
  hsvToRgb(hsv) {
    let h = hsv.h % 360;
    if (h < 0) h += 360;
    const s = Math.max(0, Math.min(hsv.s, 1));
    const v = Math.max(0, Math.min(hsv.v, 1));

    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - s * f);
    const t = v * (1 - s * (1 - f));

    let r;
    let g;
    let b;

    switch (i) {
      default:
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }

    return {
      r: Math.floor(r * 255),
      g: Math.floor(g * 255),
      b: Math.floor(b * 255),
    };
  },

  /**
   * @function 将RGB颜色转换为HSV格式.
   * @param {RGBObject} rgb - {r: red [0,255], g: green [0,255], b: blue [0,255]}.
   * @return {HSVObject} hsv - {h: hue [0,360), s: saturation [0,1], v: value [0,1]}
   */
  rgbToHsv(rgb) {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const x = Math.min(Math.min(r, g), b);
    const v = Math.max(Math.max(r, g), b);

    // For grays, hue will be arbitrarily reported as zero. Otherwise, calculate
    let h = 0;
    let s = 0;
    if (x !== v) {
      const f = r === x ? g - b : g === x ? b - r : r - g;
      const i = r === x ? 3 : g === x ? 5 : 1;
      h = ((i - f / (v - x)) * 60) % 360;
      s = (v - x) / v;
    }

    return { h: h, s: s, v: v };
  },

  /**
   * @function rgb0和rgb1之间的线性插值.
   * @param {RGBObject} rgb0 - the color corresponding to fraction1 <= 0.
   * @param {RGBObject} rgb1 - the color corresponding to fraction1 >= 1.
   * @param {number} fraction1 - 插值参数。 例如，如果为0.5，则将两种颜色均匀混合.
   * @return {RGBObject} the interpolated color.
   */
  mixRgb(rgb0, rgb1, fraction1) {
    if (fraction1 <= 0) return rgb0;
    if (fraction1 >= 1) return rgb1;
    const fraction0 = 1 - fraction1;
    return {
      r: fraction0 * rgb0.r + fraction1 * rgb1.r,
      g: fraction0 * rgb0.g + fraction1 * rgb1.g,
      b: fraction0 * rgb0.b + fraction1 * rgb1.b,
    };
  },

  /**
   * @function 将所有KidBlocks参数转换为要用于渲染器的RGB颜色对象.
   * @param {*} value Value to convert to RGB color object.
   * @return {RGBOject} [r,g,b], values between 0-255.
   */
  toRgbColorObject(value) {
    let color;
    if (typeof value === "string" && value.substring(0, 1) === "#") {
      color = hexToRgb(value);
    } else {
      color = decimalToRgb(CAST.toNumber(value));
    }
    return color;
  },

  /**
   * @function 将所有KidBlocks参数转换为要用于渲染器的RGB颜色数组.
   * @param {*} value Value to convert to RGB color array.
   * @return {Array.<number>} [r,g,b], values between 0-255.
   */
  toRgbColorList(value) {
    const color = toRgbColorObject(value);
    return [color.r, color.g, color.b];
  },
};

/** @module 数学相关 */
const MATH_UTIL = {
  /**
   * 将值从度转换为弧度.
   * @param {!number} deg 度值.
   * @return {!number} 弧度等值.
   */
  degToRad(deg) {
    return (deg * Math.PI) / 180;
  },

  /**
   * 将值从弧度转换为度.
   * @param {!number} rad Value in radians.
   * @return {!number} Equivalent value in degrees.
   */
  radToDeg(rad) {
    return (rad * 180) / Math.PI;
  },

  /**
   * 将数字限制在两个限制之间.
   * If n < min, return min. If n > max, return max. Else, return n.
   * @param {!number} n Number to clamp.
   * @param {!number} min Minimum limit.
   * @param {!number} max Maximum limit.
   * @return {!number} Value of n clamped to min and max.
   */
  clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
  },

  /**
   * 将数字保持在两个限制之间, wrapping "extra" 包装到范围内.
   * e.g., wrapClamp(7, 1, 5) == 2
   * wrapClamp(0, 1, 5) == 5
   * wrapClamp(-11, -10, 6) == 6, etc.
   * @param {!number} n Number to wrap.
   * @param {!number} min Minimum limit.
   * @param {!number} max Maximum limit.
   * @return {!number} n的值介于最小值和最大值之间.
   */
  wrapClamp(n, min, max) {
    const range = max - min + 1;
    return n - Math.floor((n - min) / range) * range;
  },

  /**
   * 从度数转换tan函数的值.
   * @param {!number} angle in degrees
   * @return {!number} Correct tan value
   */
  tan(angle) {
    angle = angle % 360;
    switch (angle) {
      case -270:
      case 90:
        return Infinity;
      case -90:
      case 270:
        return -Infinity;
      default:
        return parseFloat(Math.tan((Math.PI * angle) / 180).toFixed(10));
    }
  },

  /**
   * 给定一个唯一数字数组，返回一个精简数组，以便精简数组中的每个元素代表该元素在原始数组的排序版本中的位置.
   * E.g. [5, 19. 13, 1] => [1, 3, 2, 0]
   * @param {Array<number>} elts The elements to sort and reduce
   * @return {Array<number>} The array of reduced orderings
   */
  reducedSortOrdering(elts) {
    const sorted = elts.slice(0).sort((a, b) => a - b);
    return elts.map((e) => sorted.indexOf(e));
  },

  /**
   * 返回给定范围内的随机数和该范围内应排除的数字.
   * 例如，（1,5，3）将只挑1，2，4，或5（具有相等概率）
   *
   * @param {number} lower - 下限（含）
   * @param {number} upper - 上限（包括上限），使得下限<=上限
   * @param {number} excluded - 要排除的数字（必须在范围内）
   * @return {number} [下，上]范围内的随机整数，不被"excluded"
   */
  inclusiveRandIntWithout(lower, upper, excluded) {
    // Note that subtraction is the number of items in the
    // inclusive range [lower, upper] minus 1 already
    // (e.g. in the set {3, 4, 5}, 5 - 3 = 2).
    const possibleOptions = upper - lower;

    const randInt = lower + Math.floor(Math.random() * possibleOptions);
    if (randInt >= excluded) return randInt + 1;

    return randInt;
  },

  /**
   * 将数字从一个范围缩放到另一范围.
   * @param {number} i number to be scaled
   * @param {number} iMin input range minimum
   * @param {number} iMax input range maximum
   * @param {number} oMin output range minimum
   * @param {number} oMax output range maximum
   * @return {number} scaled number
   */
  scale(i, iMin, iMax, oMin, oMax) {
    const p = (i - iMin) / (iMax - iMin);
    return p * (oMax - oMin) + oMin;
  },
};

const SVGELEMENT = {
  /**
   * @function 在解析之前修正SVG字符串.
   * @param {!string} svgString 要修复的svg的字符串.
   * @returns {!string} 固定的svg应该是可解析的.
   */
  fixupSvgString(svgString) {
    // 添加根svg命名空间（如果不存在）.
    const svgAttrs = svgString.match(/<svg [^>]*>/);
    if (svgAttrs && svgAttrs[0].indexOf("xmlns=") === -1) {
      svgString = svgString.replace(
        "<svg ",
        '<svg xmlns="http://www.w3.org/2000/svg" '
      );
    }

    // Illustrator中有一些SVG使用未声明的实体.
    // 只需将这些实体替换为虚假的命名空间引用即可防止DOMParser崩溃
    if (
      svgAttrs &&
      svgAttrs[0].indexOf("&ns_") !== -1 &&
      svgString.indexOf("<!DOCTYPE") === -1
    ) {
      svgString = svgString.replace(
        svgAttrs[0],
        svgAttrs[0].replace(
          /&ns_[^;]+;/g,
          "http://ns.adobe.com/Extensibility/1.0/"
        )
      );
    }

    // 已发现从Photoshop导出的某些SVG的MIME类型无效，Chrome浏览器和Safari不会渲染这些SVG，因此我们在此处进行了更正
    if (svgString.includes("data:img/png")) {
      svgString = svgString.replace(
        // 使用xlink：href =和引号捕获整个图像标签-不捕获data: bit
        /(<image[^>]+?xlink:href=["'])data:img\/png/g,
        // 使用捕获的<image ..... xlink：href =“，然后附加正确的数据uri mime类型
        ($0, $1) => `${$1}data:image/png`
      );
    }

    // Inkscape中的某些SVG尝试将前缀绑定到保留的名称空间名称.
    // 这将导致SVG解析失败，因此将其替换为虚拟名称空间名称.
    // 该名称空间名称仅对“ xml”有效，如果将“ xmlns：xml”绑定到虚拟名称空间，解析将再次失败，因此请排除“ xmlns：xml”声明.
    if (
      svgString.match(
        /xmlns:(?!xml=)[^ ]+="http:\/\/www.w3.org\/XML\/1998\/namespace"/
      ) !== null
    ) {
      svgString = svgString.replace(
        // 捕获整个属性
        /(xmlns:(?!xml=)[^ ]+)="http:\/\/www.w3.org\/XML\/1998\/namespace"/g,
        // 使用捕获的属性名称； 仅替换网址
        ($0, $1) => `${$1}="http://dummy.namespace"`
      );
    }

    // <metadata>元素不需要呈现，有时包含Illustrator中无法解析的垃圾：(清空内容.
    // Note: [\s\S] 匹配所有内容包括换行符, which .* does not
    svgString = svgString.replace(
      /<metadata>[\s\S]*<\/metadata>/,
      "<metadata></metadata>"
    );

    // 空脚本标签和javascript执行
    svgString = svgString.replace(
      /<script[\s\S]*>[\s\S]*<\/script>/,
      "<script></script>"
    );

    return svgString;
  },
};

/** @module 触摸相关 */
const TOUCH_UTIL = {
  /** @function 获取事件XY坐标 */
  getEventXY(event) {
    if (event.touches && event.touches[0]) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    } else if (event.changedTouches && event.changedTouches[0]) {
      return {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
    }
    return { x: event.clientX, y: event.clientY };
  },
};

/** @module 实用工具 */
const Utility = {
  /** @description bas64相关处理 */
  ...BASE64_UTIL,
  /** @description 转换和比较KidBlocks数据类型的实用程序 */
  ...CAST,
  /** @description 色彩相关 */
  ...COLOUR,
  /** @description 数学相关 */
  ...MATH_UTIL,
  /** @description SVG元素相关 */
  ...SVGELEMENT,
  /** @description 触摸相关 */
  ...TOUCH_UTIL,

  /**
   * @function 从Blockly生成唯一的ID.
   * @description 这应该是全局唯一的. 87个字符^ 20个长度> 128位（比UUID更好）.
   * @return {string} 全局唯一的ID字符串.
   */
  uid() {
    const length = 20;
    const soupLength = SOUP.length;
    const id = [];
    for (let i = 0; i < length; i++) {
      id[i] = SOUP.charAt(Math.random() * soupLength);
    }
    return id.join("");
  },

  /**
   * @function 深度克隆一个“简单”对象：可以用JSON完整表达的对象.
   * @description 非JSON值（例如函数）将从克隆中剥离.
   * @param {object} original - 要克隆的对象.
   * @returns {object} a deep clone of the original object.
   */
  cloneSimple(original) {
    return JSON.parse(JSON.stringify(original));
  },

  /**
   * @function 返回一个字符串，该字符串代表受监视块的唯一ID，其中单个报告器块可以具有多个与之关联的监视器（因此有多个监视器块）（例如，当报告器块具有输入时）.
   * @description TODO 给定报告器块的操作码和所选参数的列表，此功能最终应是获得所有监视器ID的唯一位置.
   * @param {string} baseId 用于不同监视块的基本标识
   * @param {object} fields 监视块的字段对象.
   */
  getMonitorIdForBlockWithArgs(id, fields) {
    let fieldString = "";
    for (const fieldKey in fields) {
      let fieldValue = fields[fieldKey].value;
      if (fieldKey === "CURRENTMENU") {
        //  'sensing_current'块的所有大写字母都包含字段值.
        // 但是，从头开始导入2.0时，这些可能已被导入为小写字段值.
        // 在这里对字段值进行规范化，这样我们就不会以代表相同块配置的不同监视器ID结束
        // 注意：我们并不是针对此函数中的每个块字段都这样做，以免错误地假设输入的块字段值在小写之后将是唯一的
        fieldValue = fieldValue.toLowerCase();
      }
      fieldString += `_${fieldValue}`;
    }
    return `${id}${fieldString}`;
  },

  /**
   * 使给定的块具有新的ID并更新所有内部ID引用.
   * 不返回任何内容以表明块已就地更新.
   * @param {array} blocks - blocks to be mutated.
   */
  newBlockIds(blocks) {
    const oldToNew = {};

    // 首先更新所有顶级ID并创建新旧映射
    for (let i = 0; i < blocks.length; i++) {
      console.warn("new-block-ids:", Utility.uid());
      const newId = Utility.uid();
      const oldId = blocks[i].id;
      blocks[i].id = oldToNew[oldId] = newId;
    }

    // 然后返回并更新输入（块/阴影）和下一个/父级属性
    for (let i = 0; i < blocks.length; i++) {
      for (const key in blocks[i].inputs) {
        const input = blocks[i].inputs[key];
        input.block = oldToNew[input.block];
        input.shadow = oldToNew[input.shadow];
      }
      if (blocks[i].parent) blocks[i].parent = oldToNew[blocks[i].parent];

      if (blocks[i].next) blocks[i].next = oldToNew[blocks[i].next];
    }
  },

  /**
   * 转义字符串以在XML内容中安全使用.
   * CC-BY-SA: hgoebl
   * https://stackoverflow.com/questions/7918868/
   * how-to-escape-xml-entities-in-javascript
   * @param {!string | !Array.<string>} unsafe Unsafe string.
   * @return {string} XML-escaped string, for use within an XML tag.
   */
  xmlEscape(unsafe) {
    if (typeof unsafe !== "string")
      unsafe = Array.isArray(unsafe) ? String(unsafe) : unsafe;

    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case "'":
          return "&apos;";
        case '"':
          return "&quot;";
      }
    });
  },

  /**
   * @function 下载blob
   * @param {*} filename 文件名
   * @param {*} blob blob格式文件
   */
  downloadBlob(filename, blob) {
    console.log("下载blob", filename, blob);
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);

    const url = window.URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.type = blob.type;
    downloadLink.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(downloadLink);
  },

  /**
   * @function 判断当前浏览器是否支持该工具
   * @returns 返回当前浏览器是否支持
   */
  supportedBrowser() {
    const browser_type = navigator.appVersion;
    const browser_version =
      browser_type.match(/Chrome\/([\d.]+)/) ||
      browser_type.match(/CriOS\/([\d.]+)/);
    return parseFloat(browser_version[1]) > 85;
  },
  /**
   * @function 当前浏览器是否支持WebGL渲染
   */
  supportedWebGL() {
    let gl = document.createElement("canvas").getContext("webgl");
    return gl instanceof WebGLRenderingContext;
  },

  /**
   * @function 从文件名中获取项目名称
   * @param {*} fileInputFilename
   */
  getProjectTitleFromFilename(filename) {
    if (!filename) return "";
    // 仅解析具有有效暂存项目扩展名的标题 (.sb, .sb2, and .sb3)
    const matches = filename.match(/^(.*)\.sb[23]?$/);
    if (!matches) return "";
    return matches[1].substring(0, 100); // 将项目标题截断为最多100个字符
  },

  /**
   * @function 获取当前url指定参数值
   * @param {*} param 指定要获取值的url get参数
   */
  getUrlSearchParams(param) {
    return new URL(document.location).searchParams.get(param);
  },

  /**
   * @function 通用的元素隐藏设置,仅用于class可以使用common前缀控制的元素
   * @param {*} element
   */
  commonHideElement(element) {
    if (element && element.classList.contains("common_is_show"))
      element.classList.replace("common_is_show", "common_is_hide");
  },

  /**
   * @function 通用的元素显示设置,仅用于class可以使用common前缀控制的元素
   * @param {*} element
   */
  commonShowElement(element) {
    if (element && element.classList.contains("common_is_hide"))
      element.classList.replace("common_is_hide", "common_is_show");
  },
  /**
   * @function 通用的元素显隐控制,仅用于class可以使用common前缀控制的元素
   * @description 元素初始时，必须包含显隐class之一
   * @param {*} element 需进行显隐控制的元素
   */
  commonToggleElement(element) {
    element && element.classList.contains("common_is_hide")
      ? Utility.commonShowElement(element)
      : Utility.commonHideElement(element);
  },

  /**
   * @function 图像懒加载
   */
  lazyLoadImage() {
    console.log("图像懒加载");
    let imagesToLoad = document.querySelectorAll("img[data-src]");
    let loadImages = function (image) {
      image.setAttribute("src", image.getAttribute("data-src"));
      image.onload = function () {
        image.removeAttribute("data-src");
      };
    };
    //  Intersection Observer API 确保只有当图片出现在可见区域时，它才会被加载
    if ("IntersectionObserver" in window) {
      let observer = new IntersectionObserver(function (items, observer) {
        items.forEach(function (item) {
          if (item.isIntersecting) {
            loadImages(item.target);
            observer.unobserve(item.target);
          }
        });
      });
      imagesToLoad.forEach(function (img) {
        observer.observe(img);
      });
    } else {
      imagesToLoad.forEach(function (img) {
        loadImages(img);
      });
    }
  },

  // /** 字符串格式化 原型链方式
  //  * use:"abc{0}def{1}g".format ("1","2")
  //  */
  // stringFormat(val) {
  //   console.log("val:", val);
  //   // let args = Array.prototype.slice.call(val);
  //   // let count = 0;

  //   // if (this.indexOf("%s") >= -1) {
  //   //   return this.replace(/%s/g, function (s, i) {
  //   //     return args[count++];
  //   //   });
  //   // } else {
  //   //   return this.replace(/\{(\d+)\}/g, function (m, i) {
  //   //     return args[count];
  //   //   });
  //   // }
  // },
};
