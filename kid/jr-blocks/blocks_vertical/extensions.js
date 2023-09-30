/*
 * @Author: Satya
 * @Date: 2020-06-02 10:37:19
 * @Last Modified by: Satya
 * @Last Modified time: 2020-06-13 14:46:34
 * doc:
 *  追加新分类[音乐、绘画]的积木块初始化设置
 *  注:自定义追加不含（extension_）前缀
 */

"use strict";

goog.provide("Blockly.Blocks.extensions");

goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.constants");
goog.require("Blockly.ScratchBlocks.VerticalExtensions");

/**
 * 绘画分类 之 擦除
 */
Blockly.Blocks["pen_clear"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      // 明文内容:对应msg/messages.js文件中对应常量
      message0: Blockly.Msg.PEN_CLEAR,
      // 该积木块所需的参数对应设置
      args0: [
        // 第一个参数
        {
          type: "field_image", // 字段_图片 类型
          // 图片的src,通常采用 media\xxxxx.svg下的svg文件
          src: Blockly.mainWorkspace.options.pathToMedia + "pen.svg",
          width: 24, // 图标的宽度
          height: 24, // 图标的高度
        },
      ],
      // 分类:分类.绘画分类
      category: Blockly.Categories.pen,
      // :[设置绘画类图库的颜色，设置本积木块的形状]
      extensions: ["colours_pen", "shape_statement"],
    });
    // console.log("pen_clear 积木块初始化");
  },
};

/**
 * 绘画分类 之 落笔
 */
Blockly.Blocks["pen_down"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      // 明文内容:对应msg/messages.js文件中对应常量
      message0: Blockly.Msg.PEN_DOWN,
      // 该积木块所需的参数对应设置
      args0: [
        // 第一个参数
        {
          type: "field_image", // 字段_图片 类型
          // 图片的src,通常采用 media\xxxxx.svg下的svg文件
          src: Blockly.mainWorkspace.options.pathToMedia + "pen.svg",
          width: 24, // 图标的宽度
          height: 24, // 图标的高度
        },
      ],
      // 分类:分类.绘画分类
      category: Blockly.Categories.pen,
      // :[设置绘画类图库的颜色，设置本积木块的形状]
      extensions: ["colours_pen", "shape_statement"],
    });
  },
};

/**
 * 绘画分类 之 抬笔
 */
Blockly.Blocks["pen_up"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      // 明文内容:对应msg/messages.js文件中对应常量
      message0: Blockly.Msg.PEN_UP,
      // 该积木块所需的参数对应设置
      args0: [
        // 第一个参数
        {
          type: "field_image", // 字段_图片 类型
          // 图片的src,通常采用 media\xxxxx.svg下的svg文件
          src: Blockly.mainWorkspace.options.pathToMedia + "pen.svg",
          width: 24, // 图标的宽度
          height: 24, // 图标的高度
        },
      ],
      // 分类:分类.绘画分类
      category: Blockly.Categories.pen,
      // :[设置绘画类图库的颜色，设置本积木块的形状]
      extensions: ["colours_pen", "shape_statement"],
    });
  },
};

/**
 * 绘画分类 之 颜色选择器
 */
Blockly.Blocks["pen_setcolorto"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      // 明文内容:对应msg/messages.js文件中对应常量
      message0: Blockly.Msg.PEN_SETCOLORTO,
      // 该积木块所需的参数对应设置
      args0: [
        // 第一个参数
        {
          type: "field_image", // 字段_图片 类型
          // 图片的src,通常采用 media\xxxxx.svg下的svg文件
          src: Blockly.mainWorkspace.options.pathToMedia + "pen.svg",
          width: 24, // 图标的宽度
          height: 24, // 图标的高度
        },
        // 第二个参数  该设置可以实现 选择颜色
        {
          type: "input_value",
          name: "COLOR",
        },
      ],
      // 分类:分类.绘画分类
      category: Blockly.Categories.pen,
      // :[设置绘画类图库的颜色，设置本积木块的形状]
      extensions: ["colours_pen", "shape_statement"],
    });
  },
};

/**
 * 音乐分类 之 播放节拍鼓
 */
Blockly.Blocks["music_playDrumForBeats"] = {
  /**
   * 清理
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      // 明文内容:对应msg/messages.js文件中对应常量
      message0: Blockly.Msg.MUSIC_PLAYDRUMFORBEATS,
      // 该积木块所需的参数对应设置
      args0: [
        // 第一个参数
        {
          type: "field_image", // 字段_图片 类型
          // 图片的src,通常采用 media\xxxxx.svg下的svg文件
          src: Blockly.mainWorkspace.options.pathToMedia + "music.svg",
          width: 24, // 图标的宽度
          height: 24, // 图标的高度
        },
      ],
      // 分类:分类.运动分类
      category: Blockly.Categories.music,
      // :[设置运动类图库的颜色，设置本积木块的形状]
      extensions: ["colours_music", "shape_statement"],
    });
    // console.log("pen_clear 积木块初始化");
  },
};

/** =================== 以下为原本文件的扩展积木块初始化 ====================== */
Blockly.Blocks["extension_pen_down"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 pen down",
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "music.svg",
          width: 40,
          height: 40,
        },
        {
          type: "field_vertical_separator",
        },
      ],
      category: Blockly.Categories.more,
      extensions: ["colours_more", "shape_statement", "scratch_extension"],
    });
  },
};

Blockly.Blocks["extension_music_drum"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 play drum %3",
      args0: [
        {
          type: "field_image",
          src:
            Blockly.mainWorkspace.options.pathToMedia +
            "extensions/music-block-icon.svg",
          width: 40,
          height: 40,
        },
        {
          type: "field_vertical_separator",
        },
        {
          type: "input_value",
          name: "NUMBER",
        },
      ],
      category: Blockly.Categories.more,
      extensions: ["colours_more", "shape_statement", "scratch_extension"],
    });
  },
};

Blockly.Blocks["extension_wedo_motor"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 turn a motor %3",
      args0: [
        {
          type: "field_image",
          src:
            Blockly.mainWorkspace.options.pathToMedia +
            "extensions/wedo2-block-icon.svg",
          width: 40,
          height: 40,
        },
        {
          type: "field_vertical_separator",
        },
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "rotate-right.svg",
          width: 24,
          height: 24,
        },
      ],
      category: Blockly.Categories.more,
      extensions: ["colours_more", "shape_statement", "scratch_extension"],
    });
  },
};

Blockly.Blocks["extension_wedo_hat"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 when I am wearing a hat",
      args0: [
        {
          type: "field_image",
          src:
            Blockly.mainWorkspace.options.pathToMedia +
            "extensions/wedo2-block-icon.svg",
          width: 40,
          height: 40,
        },
        {
          type: "field_vertical_separator",
        },
      ],
      category: Blockly.Categories.more,
      extensions: ["colours_more", "shape_hat", "scratch_extension"],
    });
  },
};

Blockly.Blocks["extension_wedo_boolean"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 O RLY?",
      args0: [
        {
          type: "field_image",
          src:
            Blockly.mainWorkspace.options.pathToMedia +
            "extensions/wedo2-block-icon.svg",
          width: 40,
          height: 40,
        },
        {
          type: "field_vertical_separator",
        },
      ],
      category: Blockly.Categories.more,
      extensions: ["colours_more", "output_boolean", "scratch_extension"],
    });
  },
};

Blockly.Blocks["extension_wedo_tilt_reporter"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 tilt angle %3",
      args0: [
        {
          type: "field_image",
          src:
            Blockly.mainWorkspace.options.pathToMedia +
            "extensions/wedo2-block-icon.svg",
          width: 40,
          height: 40,
        },
        {
          type: "field_vertical_separator",
        },
        {
          type: "input_value",
          name: "TILT",
        },
      ],
      category: Blockly.Categories.more,
      extensions: ["colours_more", "output_number", "scratch_extension"],
    });
  },
};

Blockly.Blocks["extension_wedo_tilt_menu"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "TILT",
          options: [
            ["Any", "Any"],
            ["Whirl", "Whirl"],
            ["South", "South"],
            ["Back in time", "Back in time"],
          ],
        },
      ],
      extensions: ["colours_more", "output_string"],
    });
  },
};

Blockly.Blocks["extension_music_reporter"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 hey now, you're an all-star",
      args0: [
        {
          type: "field_image",
          src:
            Blockly.mainWorkspace.options.pathToMedia +
            "extensions/music-block-icon.svg",
          width: 40,
          height: 40,
        },
        {
          type: "field_vertical_separator",
        },
      ],
      category: Blockly.Categories.more,
      extensions: ["colours_more", "output_number", "scratch_extension"],
    });
  },
};

Blockly.Blocks["extension_microbit_display"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 display %3",
      args0: [
        {
          type: "field_image",
          src:
            Blockly.mainWorkspace.options.pathToMedia +
            "extensions/microbit-block-icon.svg",
          width: 40,
          height: 40,
        },
        {
          type: "field_vertical_separator",
        },
        {
          type: "input_value",
          name: "MATRIX",
        },
      ],
      category: Blockly.Categories.pen,
      extensions: ["colours_pen", "shape_statement", "scratch_extension"],
    });
  },
};

Blockly.Blocks["extension_music_play_note"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1 %2 play note %3 for %4 beats",
      args0: [
        {
          type: "field_image",
          src:
            Blockly.mainWorkspace.options.pathToMedia +
            "extensions/music-block-icon.svg",
          width: 40,
          height: 40,
        },
        {
          type: "field_vertical_separator",
        },
        {
          type: "input_value",
          name: "NOTE",
        },
        {
          type: "input_value",
          name: "BEATS",
        },
      ],
      category: Blockly.Categories.pen,
      extensions: ["colours_pen", "shape_statement", "scratch_extension"],
    });
  },
};
