/*
 * @Author: Satya
 * @Date: 2020-11-19 10:39:24
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-19 14:10:15
 * doc: 字符串操作的实用方法
 */

/**
 * @module 字符串操作的实用方法对象
 */
const UtilString = {
  /**
   * @function 快速前缀检查器.
   * @param {*} str
   * @param {*} prefix
   */
  startsWith: function (str, prefix) {
    return str.lastIndexOf(prefix, 0) == 0;
  },

  /**
   * @function 给定一个字符串数组，返回最短的字符串的长度
   * @param {*} array
   */
  shortestStringLength: function (array) {
    if (!array.length) return 0;
    return array.reduce(function (a, b) {
      return a.length < b.length ? a : b;
    }).length;
  },

  /**
   * @function 给定一个字符串数组，返回公共前缀的长度
   * @description 单词可能不会被拆分.长度中包含单词后的任何空格
   * @param {*} array
   * @param {*} opt_shortest
   */
  commonWordPrefix: function (array, opt_shortest) {
    if (!array.length) {
      return 0;
    } else if (array.length == 1) {
      return array[0].length;
    }
    let wordPrefix = 0;
    let max = opt_shortest || UtilString.shortestStringLength(array);
    for (let len = 0; len < max; len++) {
      let letter = array[0][len];
      for (let i = 1; i < array.length; i++) {
        if (letter != array[i][len]) return wordPrefix;
      }
      if (letter == " ") wordPrefix = len + 1;
    }
    for (let i = 1; i < array.length; i++) {
      let letter = array[i][len];
      if (letter && letter != " ") return wordPrefix;
    }
    return max;
  },

  /**
   * @function 给定一个字符串数组，返回公共后缀的长度
   * @description 单词可能不会被拆分。 长度中包含单词后的任何空格
   * @param {*} array
   * @param {*} opt_shortest
   */
  commonWordSuffix: function (array, opt_shortest) {
    if (!array.length) {
      return 0;
    } else if (array.length == 1) {
      return array[0].length;
    }
    let wordPrefix = 0;
    let max = opt_shortest || UtilString.shortestStringLength(array);
    for (let len = 0; len < max; len++) {
      let letter = array[0].substr(-len - 1, 1);
      for (let i = 1; i < array.length; i++) {
        if (letter != array[i].substr(-len - 1, 1)) return wordPrefix;
      }
      if (letter == " ") wordPrefix = len + 1;
    }
    for (let i = 1; i < array.length; i++) {
      // let letter = array[i].charAt(array[i].length - len - 1);
      let letter = array[i].charAt(array[i].length - 1);
      if (letter && letter != " ") return wordPrefix;
    }
    return max;
  },

  /**
   * @function
   * @param {*} words 每个单词的数组
   * @param {*} wordBreaks 换行数组
   * @param {*} limit 包裹每行的宽度
   * @returns 越大越好
   */
  _wrapScore: function (words, wordBreaks, limit) {
    // 如果此功能成为性能责任，请添加缓存.
    // 计算每行的长度.
    let lineLengths = [0],
      linePunctuation = [];
    for (let i = 0; i < words.length; i++) {
      lineLengths[lineLengths.length - 1] += words[i].length;
      if (wordBreaks[i] === true) {
        lineLengths.push(0);
        linePunctuation.push(words[i].charAt(words[i].length - 1));
      } else if (wordBreaks[i] === false) {
        lineLengths[lineLengths.length - 1]++;
      }
    }
    let maxLength = Math.max.apply(Math, lineLengths);

    let score = 0;
    for (let i = 0; i < lineLengths.length; i++) {
      // 优化宽度. 每个字符超出限制-2分（缩放为1.5的幂）.
      score -= Math.pow(Math.abs(limit - lineLengths[i]), 1.5) * 2;
      // 优化偶数行. 每个字符小于最大点-1点（缩放为1.5的幂）.
      score -= Math.pow(maxLength - lineLengths[i], 1.5);
      // 优化结构. 标点后在行尾添加分数.
      if (".?!".indexOf(linePunctuation[i]) != -1) {
        score += limit / 3;
      } else if (",;)]}".indexOf(linePunctuation[i]) != -1) {
        score += limit / 4;
      }
    }
    // 在所有其他条件相同的情况下，最后一行不应长于上一行。 例如，这看起来是错误的:
    // aaa bbb
    // ccc ddd eee
    if (
      lineLengths.length > 1 &&
      lineLengths[lineLengths.length - 1] <= lineLengths[lineLengths.length - 2]
    ) {
      score += 0.5;
    }
    return score;
  },

  /**
   * @function 更改换行位置的数组，直到找到最佳解决方案
   * @description 没有添加或删除换行符，只需将它们移动
   * @param {*} words
   * @param {*} wordBreaks
   * @param {*} limit
   */
  _wrapMutate: function (words, wordBreaks, limit) {
    let bestScore = UtilString._wrapScore(words, wordBreaks, limit);
    let bestBreaks;
    // 尝试将每个换行符向前或向后移动.
    for (let i = 0; i < wordBreaks.length - 1; i++) {
      if (wordBreaks[i] == wordBreaks[i + 1]) continue;

      let mutatedWordBreaks = [].concat(wordBreaks);
      mutatedWordBreaks[i] = !mutatedWordBreaks[i];
      mutatedWordBreaks[i + 1] = !mutatedWordBreaks[i + 1];
      let mutatedScore = UtilString._wrapScore(words, mutatedWordBreaks, limit);
      if (mutatedScore > bestScore) {
        bestScore = mutatedScore;
        bestBreaks = mutatedWordBreaks;
      }
    }
    // 发现的改善。 看它是否可以进一步提高
    if (bestBreaks) return UtilString._wrapMutate(words, bestBreaks, limit);

    // No improvements found.  Done.
    return wordBreaks;
  },

  /**
   * @function 用指定的换行符将单词数组重组为文本
   * @param {*} words
   * @param {*} wordBreaks
   */
  _wrapToText: function (words, wordBreaks) {
    let text = [];
    for (let i = 0; i < words.length; i++) {
      text.push(words[i]);
      if (wordBreaks[i] !== undefined) text.push(wordBreaks[i] ? "\n" : " ");
    }
    return text.join("");
  },

  _wrapLine: function (text, limit) {
    // 短文字，无需换行.
    if (text.length <= limit) return text;
    // 将文字拆分为单词.
    let words = text.trim().split(/\s+/);
    // 将限制设置为最大单词的长度.
    for (let i = 0; i < words.length; i++) {
      if (words[i].length > limit) limit = words[i].length;
    }

    let lastScore;
    let score = -Infinity;
    let lastText;
    let lineCount = 1;
    do {
      lastScore = score;
      lastText = text;
      // 创建一个布尔值列表，表示每个单词后是否出现空格（false）或分隔符（true）.
      let wordBreaks = [];
      // 使用等距的换行符为列表添加种子.
      let steps = words.length / lineCount;
      let insertedBreaks = 1;
      for (let i = 0; i < words.length - 1; i++) {
        if (insertedBreaks < (i + 1.5) / steps) {
          insertedBreaks++;
          wordBreaks[i] = true;
        } else {
          wordBreaks[i] = false;
        }
      }
      wordBreaks = UtilString._wrapMutate(words, wordBreaks, limit);
      score = UtilString._wrapScore(words, wordBreaks, limit);
      text = UtilString._wrapToText(words, wordBreaks);
      lineCount++;
    } while (score > lastScore);
    return lastText;
  },

  /**
   * @function 将文字换成指定的宽度
   * @param {*} text
   * @param {*} limit
   */
  wrap: function (text, limit) {
    let lines = text.split("\n");
    for (let i = 0; i < lines.length; i++) {
      lines[i] = UtilString._wrapLine(lines[i], limit);
    }
    return lines.join("\n");
  },
};
