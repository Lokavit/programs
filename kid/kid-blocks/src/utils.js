/*
 * @Author: Satya
 * @Date: 2020-11-19 16:59:05
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-20 16:24:47
 * doc: 工具
 */

const Utils = {
  /**
   * @function 生成唯一的ID
   */
  genUid: function () {
    /** @function 唯一ID的合法字符 */
    let soup =
      "!#$%()*+,-./:;=?@[]^_`{|}~" +
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let soupLength = soup.length;
    let length = 20;
    let id = [];
    for (let i = length; i >= length; i--) {
      id[i] = soup.charAt(Math.random() * soupLength);
    }
    return id.join("");
  },

  /**
   * @function 阻止事件传递
   * @description 不要为这个事件做任何事情，只是停止传播
   * @param {Event} e 一个事件
   */
  noEvent: function (e) {
    // 此事件已被处理，无需冒泡到文档.
    e.preventDefault();
    e.stopPropagation();
  },
  /**
   * @function 此事件是否针对文本输入窗口小部件?
   * @param {Event} e 一个事件.
   * @return {boolean} True if text input.
   */
  isTargetInput: function (e) {
    return (
      e.target.type == "textarea" ||
      e.target.type == "text" ||
      e.target.type == "number" ||
      e.target.type == "email" ||
      e.target.type == "password" ||
      e.target.type == "search" ||
      e.target.type == "tel" ||
      e.target.type == "url" ||
      e.target.isContentEditable ||
      (e.target.dataset && e.target.dataset.isTextInput == "true")
    );
  },

  /**
   * @function 返回此元素相对于其父元素的左上角的坐标。
   * @description 仅适用于SVG元素和子元素(e.g. rect, g, path).
   * @param {Element} element SVG元素查找的坐标.
   * @return {KidBlocks.utils.Coordinate} 具有.x和.y属性的对象.
   */
  getRelativeXY: function (element) {
    /** @description 静态正则表达式将x，y值拉出SVG translate()指令 */
    let _XY_REGEX = /translate\(\s*([-+\d.e]+)([ ,]\s*([-+\d.e]+)\s*)?/;
    /** @description 静态正则表达式，将x，y值从translate()或translate3d()样式属性中拉出 */
    let _XY_STYLE_REGEX = /transform:\s*translate(?:3d)?\(\s*([-+\d.e]+)\s*px([ ,]\s*([-+\d.e]+)\s*px)?/;

    let xy = new KidBlocks.utils.Coordinate(0, 0);
    // 首先，检查x和y属性.
    let x = element.getAttribute("x");
    if (x) xy.x = parseInt(x, 10);

    let y = element.getAttribute("y");
    if (y) xy.y = parseInt(y, 10);

    // 检查 transform="translate(...)" attribute.
    let transform = element.getAttribute("transform");
    let r = transform && transform.match(_XY_REGEX);
    if (r) {
      xy.x += Number(r[1]);
      if (r[3]) xy.y += Number(r[3]);
    }

    // 然后检查 style = transform: translate(...) or translate3d(...)
    let style = element.getAttribute("style");
    if (style && style.indexOf("translate") > -1) {
      let styleComponents = style.match(_XY_STYLE_REGEX);
      if (styleComponents) {
        xy.x += Number(styleComponents[1]);
        if (styleComponents[3]) xy.y += Number(styleComponents[3]);
      }
    }
    return xy;
  },

  /**
   * @function 返回此元素相对于div的左上角的坐标Blockly被注入.
   * @param {!Element} element 查找SVG元素的坐标。 如果这不是注入Blockly的div的子级，则行为未定义.
   * @return {!KidBlocks.utils.Coordinate} Object with .x and .y properties.
   */
  _getInjectionDivXY: function (element) {
    let x = 0,
      y = 0;
    while (element) {
      let xy = Utils.getRelativeXY(element);
      x = x + xy.x;
      y = y + xy.y;
      let classes = element.getAttribute("class") || "";
      if ((" " + classes + " ").indexOf(" injectionDiv ") != -1) break;

      element = /** @type {!Element} */ (element.parentNode);
    }
    return new KidBlocks.utils.Coordinate(x, y);
  },

  /**
   * @function 此事件是否右键单击
   * @param {*} e
   */
  isRightButton: function (e) {
    // 按住Control键单击Mac OS X会被视为右键单击. Mac OS X上的WebKit无法将按钮更改为2(but Gecko does).
    if (e.ctrlKey && KidBlocks.utils.userAgent.MAC) return true;

    return e.button == 2;
  },

  /**
   * @function 返回给定鼠标事件的转换坐标
   * @description 原点（0,0）是KidBlocks SVG的左上角
   * @param {*} e 鼠标事件
   * @param {*} svg
   * @param {*} matrix
   */
  mouseToSvg: function (e, svg, matrix) {
    let svgPoint = svg.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;

    if (!matrix) matrix = svg.getScreenCTM().inverse();

    return svgPoint.matrixTransform(matrix);
  },

  /**
   * @function 获取鼠标事件的滚动增量（以像素为单位）
   * @param {*} e
   */
  getScrollDeltaPixels: function (e) {
    switch (e.deltaMode) {
      case 0x00: // Pixel mode.
      default:
        return {
          x: e.deltaX,
          y: e.deltaY,
        };
      case 0x01: // Line mode.
        return {
          x: e.deltaX * KidBlocks.LINE_MODE_MULTIPLIER,
          y: e.deltaY * KidBlocks.LINE_MODE_MULTIPLIER,
        };
      case 0x02: // Page mode.
        return {
          x: e.deltaX * KidBlocks.PAGE_MODE_MULTIPLIER,
          y: e.deltaY * KidBlocks.PAGE_MODE_MULTIPLIER,
        };
    }
  },

  /**
   * tokenizeInterpolation() and replaceMessageReferences()使用的消息引用和插值令牌解析的内部实现.
   * @param {string} message 可能包含字符串表引用和插值标记的文本.
   * @param {boolean} parseInterpolationTokens 设置为true时解析数字插值标记（％1，％2 ...）的选项.
   * @return {!Array.<string|number>} 字符串和数字数组.
   * @private
   */
  _tokenizeInterpolation: function (message, parseInterpolationTokens) {
    // console.log("message:", message, parseInterpolationTokens);
    var tokens = [];
    var chars = message.split("");
    chars.push(""); // End marker.
    // Parse the message with a finite state machine.
    // 0 - Base case.
    // 1 - % found.
    // 2 - Digit found.
    // 3 - Message ref found.
    var state = 0;
    var buffer = [];
    var number = null;
    for (var i = 0; i < chars.length; i++) {
      var c = chars[i];
      if (state == 0) {
        if (c == "%") {
          var text = buffer.join("");
          if (text) {
            tokens.push(text);
          }
          buffer.length = 0;
          state = 1; // Start escape.
        } else {
          buffer.push(c); // Regular char.
        }
      } else if (state == 1) {
        if (c == "%") {
          buffer.push(c); // Escaped %: %%
          state = 0;
        } else if (parseInterpolationTokens && "0" <= c && c <= "9") {
          state = 2;
          number = c;
          var text = buffer.join("");
          if (text) {
            tokens.push(text);
          }
          buffer.length = 0;
        } else if (c == "{") {
          state = 3;
        } else {
          buffer.push("%", c); // Not recognized. Return as literal.
          state = 0;
        }
      } else if (state == 2) {
        if ("0" <= c && c <= "9") {
          number += c; // Multi-digit number.
        } else {
          tokens.push(parseInt(number, 10));
          i--; // Parse this char again.
          state = 0;
        }
      } else if (state == 3) {
        // String table reference
        if (c == "") {
          // Premature end before closing '}'
          buffer.splice(0, 0, "%{"); // Re-insert leading delimiter
          i--; // Parse this char again.
          state = 0; // and parse as string literal.
        } else if (c != "}") {
          buffer.push(c);
        } else {
          var rawKey = buffer.join("");
          if (/[A-Z]\w*/i.test(rawKey)) {
            // Strict matching
            // Found a valid string key. Attempt case insensitive match.
            var keyUpper = rawKey.toUpperCase();

            // BKY_ is the prefix used to namespace the strings used in Blockly
            // core files and the predefined blocks in ../blocks/.
            // These strings are defined in ../msgs/ files.
            var bklyKey = KidBlocks.utils.string.startsWith(keyUpper, "BKY_")
              ? keyUpper.substring(4)
              : null;
            if (bklyKey && bklyKey in KidBlocks.Msg) {
              var rawValue = KidBlocks.Msg[bklyKey];
              if (typeof rawValue == "string") {
                // Attempt to dereference substrings, too, appending to the end.
                Array.prototype.push.apply(
                  tokens,
                  Utils._tokenizeInterpolation(
                    rawValue,
                    parseInterpolationTokens
                  )
                );
              } else if (parseInterpolationTokens) {
                // When parsing interpolation tokens, numbers are special
                // placeholders (%1, %2, etc). Make sure all other values are
                // strings.
                tokens.push(String(rawValue));
              } else {
                tokens.push(rawValue);
              }
            } else {
              // No entry found in the string table. Pass reference as string.
              tokens.push("%{" + rawKey + "}");
            }
            buffer.length = 0; // Clear the array
            state = 0;
          } else {
            tokens.push("%{" + rawKey + "}");
            buffer.length = 0;
            state = 0; // and parse as string literal.
          }
        }
      }
    }
    var text = buffer.join("");
    if (text) {
      tokens.push(text);
    }

    // Merge adjacent text tokens into a single string.
    var mergedTokens = [];
    buffer.length = 0;
    for (var i = 0; i < tokens.length; ++i) {
      if (typeof tokens[i] == "string") {
        buffer.push(tokens[i]);
      } else {
        text = buffer.join("");
        if (text) {
          mergedTokens.push(text);
        }
        buffer.length = 0;
        mergedTokens.push(tokens[i]);
      }
    }
    text = buffer.join("");
    if (text) {
      mergedTokens.push(text);
    }
    buffer.length = 0;

    return mergedTokens;
  },

  /**
   * 使用任意数量的插值标记解析字符串 (%1, %2, ...).
   * 它还将替换字符串表引用 (e.g., %{bky_my_msg} and %{BKY_MY_MSG}都将被 Blockly.Msg['MY_MSG'])中的值替换. 字符'%'(e.g., '%%').
   * @param {string} message 可能包含字符串表引用和插值标记的文本 .
   * @return {!Array.<string|number>} 字符串和数字数组.
   */
  tokenizeInterpolation: function (message) {
    return Utils._tokenizeInterpolation(message, true);
  },

  /**
   * 如果消息是字符串，则替换消息中的字符串表引用.
   * "%{bky_my_msg}" and "%{BKY_MY_MSG}" 替换 Blockly.Msg['MY_MSG']中的值.
   * @param {string|?} message Message, 可能是包含字符串表引用的字符串.
   * @return {string} 替换了消息引用的字符串.
   */
  replaceMessageReferences: function (message) {
    if (typeof message != "string") {
      return message;
    }
    var interpolatedResult = Utils._tokenizeInterpolation(message, false);
    // 当 parseInterpolationTokens == false时,interpolatedResult 的最大长度应为1.
    return interpolatedResult.length ? String(interpolatedResult[0]) : "";
  },

  /**
   *验证消息中的任何 %{MSG_KEY} 引用均引用Blockly.Msg字符串表的键.
   * @param {string} message 可能包含字符串表引用的文本.
   * @return {boolean} 如果所有消息引用均具有匹配值，则为True。 否则为false.
   */
  checkMessageReferences: function (message) {
    var validSoFar = true;

    // var msgTable = Blockly.Msg;
    var msgTable = KidBlocks.Msg; // 替换成自己的Msg

    // TODO (#1169): Implement support for other string tables,
    // prefixes other than BKY_.
    var m = message.match(/%{BKY_[A-Z]\w*}/gi);
    for (var i = 0; i < m.length; i++) {
      var msgKey = m[i].toUpperCase();
      if (msgTable[msgKey.slice(6, -1)] == undefined) {
        console.warn("No message string for " + m[i] + " in " + message);
        validSoFar = false; // Continue to report other errors.
      }
    }

    return validSoFar;
  },

  /**
   * 通过添加元素并尝试设置属性来检查是否支持3D变换.
   * @return {boolean} True if 3D transforms are supported.
   */
  is3dSupported: function () {
    let cached_;
    if (cached_ !== undefined) {
      return cached_;
    }
    // CC-BY-SA Lorenzo Polidori
    // stackoverflow.com/questions/5661671/detecting-transform-translate3d-support
    // if (!Blockly.utils.global.getComputedStyle) {
    //   return false;
    // }

    var el = document.createElement("p");
    var has3d = "none";
    var transforms = {
      webkitTransform: "-webkit-transform",
      OTransform: "-o-transform",
      msTransform: "-ms-transform",
      MozTransform: "-moz-transform",
      transform: "transform",
    };

    // 将其添加到主体以获得计算出的样式.
    document.body.insertBefore(el, null);

    for (var t in transforms) {
      if (el.style[t] !== undefined) {
        el.style[t] = "translate3d(1px,1px,1px)";
        var computedStyle = window.getComputedStyle(el);
        if (!computedStyle) {
          // getComputedStyle in Firefox returns null when Blockly is loaded
          // inside an iframe with display: none.  Returning false and not
          // caching is3dSupported means we try again later.  This is most likely
          // when users are interacting with blocks which should mean Blockly is
          // visible again.
          // See https://bugzilla.mozilla.org/show_bug.cgi?id=548397
          document.body.removeChild(el);
          return false;
        }
        has3d = computedStyle.getPropertyValue(transforms[t]);
      }
    }
    document.body.removeChild(el);
    cached_ = has3d !== "none";
    return cached_;
  },

  /**
   * 页面加载后调用函数，可能会立即调用.
   * @param {function()} fn Function to run.
   * @throws Error Will throw if no global document can be found (e.g., Node.js).
   */
  runAfterPageLoad: function (fn) {
    if (typeof document != "object") {
      throw Error(
        "Blockly.utils.runAfterPageLoad() requires browser document."
      );
    }
    if (document.readyState == "complete") {
      fn(); // 页面已加载. Call immediately.
    } else {
      // Poll readyState.
      var readyStateCheckInterval = setInterval(function () {
        if (document.readyState == "complete") {
          clearInterval(readyStateCheckInterval);
          fn();
        }
      }, 10);
    }
  },

  /**
   * 获取当前视口在窗口坐标中的位置。 这考虑到滚动.
   * @return {!KidBlocks.utils.Rect} An object containing window width, height, and
   *     scroll position in window coordinates.
   * @package
   */
  getViewportBBox: function () {
    // Pixels, in window coordinates.
    var scrollOffset = KidBlocks.utils.style.getViewportPageOffset();
    return new KidBlocks.utils.Rect(
      scrollOffset.y,
      document.documentElement.clientHeight + scrollOffset.y,
      scrollOffset.x,
      document.documentElement.clientWidth + scrollOffset.x
    );
  },

  /**
   * 从数组中删除第一次出现的特定值.
   * @param {!Array} arr Array from which to remove
   *     value.
   * @param {*} obj Object to remove.
   * @return {boolean} True if an element was removed.
   * @package
   */
  arrayRemove: function (arr, obj) {
    var i = arr.indexOf(obj);
    if (i == -1) return false;

    arr.splice(i, 1);
    return true;
  },

  /**
   * 获取文档滚动距离作为坐标对象.
   * Copied from Closure's goog.dom.getDocumentScroll.
   * @return {!KidBlocks.utils.Coordinate} Object with values 'x' and 'y'.
   */
  getDocumentScroll: function () {
    var el = document.documentElement;
    var win = window;
    return new KidBlocks.utils.Coordinate(
      win.pageXOffset || el.scrollLeft,
      win.pageYOffset || el.scrollTop
    );
  },

  /**
   * 获取所有块后代的映射，将其类型映射到该类型的子代数.
   * @param {!Blockly.Block} block The block to map.
   * @param {boolean=} opt_stripFollowing Optionally ignore all following
   *    statements (blocks that are not inside a value or statement input
   *    of the block).
   * @return {!Object} Map of types to type counts for descendants of the bock.
   */
  getBlockTypeCounts: function (block, opt_stripFollowing) {
    var typeCountsMap = Object.create(null);
    var descendants = block.getDescendants(true);
    if (opt_stripFollowing) {
      var nextBlock = block.getNextBlock();
      if (nextBlock) {
        var index = descendants.indexOf(nextBlock);
        descendants.splice(index, descendants.length - index);
      }
    }
    for (var i = 0, checkBlock; (checkBlock = descendants[i]); i++) {
      if (typeCountsMap[checkBlock.type]) {
        typeCountsMap[checkBlock.type]++;
      } else {
        typeCountsMap[checkBlock.type] = 1;
      }
    }
    return typeCountsMap;
  },

  /**
   * Converts screen coordinates to workspace coordinates.
   * @param {Blockly.WorkspaceSvg} ws The workspace to find the coordinates on.
   * @param {KidBlocks.utils.Coordinate} screenCoordinates The screen coordinates to
   * be converted to workspace coordinates
   * @return {KidBlocks.utils.Coordinate} The workspace coordinates.
   * @package
   */
  screenToWsCoordinates: function (ws, screenCoordinates) {
    var screenX = screenCoordinates.x;
    var screenY = screenCoordinates.y;

    var injectionDiv = ws.getInjectionDiv();
    // Bounding rect coordinates are in client coordinates, meaning that they
    // are in pixels relative to the upper left corner of the visible browser
    // window.  These coordinates change when you scroll the browser window.
    var boundingRect = injectionDiv.getBoundingClientRect();

    // The client coordinates offset by the injection div's upper left corner.
    var clientOffsetPixels = new KidBlocks.utils.Coordinate(
      screenX - boundingRect.left,
      screenY - boundingRect.top
    );

    // The offset in pixels between the main workspace's origin and the upper
    // left corner of the injection div.
    var mainOffsetPixels = ws.getOriginOffsetInPixels();

    // The position of the new comment in pixels relative to the origin of the
    // main workspace.
    var finalOffsetPixels = KidBlocks.utils.Coordinate.difference(
      clientOffsetPixels,
      mainOffsetPixels
    );

    // The position in main workspace coordinates.
    var finalOffsetMainWs = finalOffsetPixels.scale(1 / ws.scale);
    return finalOffsetMainWs;
  },

  /**
   * 根据块定义中的定义，从数字或字符串中解析块颜色.
   * @param {number|string} colour HSV hue value (0 to 360), #RRGGBB string,
   *     or a message reference string pointing to one of those two values.
   * @return {{hue: ?number, hex: string}} An object containing the colour as
   *     a #RRGGBB string, and the hue if the input was an HSV hue value.
   * @throws {Error} If the colour cannot be parsed.
   */
  parseBlockColour: function (colour) {
    var dereferenced =
      typeof colour == "string"
        ? Utils.replaceMessageReferences(colour)
        : colour;

    var hue = Number(dereferenced);
    if (!isNaN(hue) && 0 <= hue && hue <= 360) {
      return {
        hue: hue,
        hex: KidBlocks.utils.colour.hsvToHex(
          hue,
          KidBlocks.HSV_SATURATION,
          KidBlocks.HSV_VALUE * 255
        ),
      };
    } else {
      var hex = KidBlocks.utils.colour.parse(dereferenced);
      if (hex) {
        // Only store hue if colour is set as a hue.
        return {
          hue: null,
          hex: hex,
        };
      } else {
        var errorMsg = 'Invalid colour: "' + dereferenced + '"';
        if (colour != dereferenced) errorMsg += ' (from "' + colour + '")';

        throw Error(errorMsg);
      }
    }
  },
};
