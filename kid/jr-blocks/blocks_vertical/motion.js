/*
 * @Author: Satya
 * @Date: 2020-05-21 10:00:37
 * @Last Modified by: Satya
 * @Last Modified time: 2020-09-22 18:48:49
 * doc: 运动分类，创建其所有积木块
 */

"use strict";

goog.provide("Blockly.Blocks.motion");

goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.constants");
goog.require("Blockly.ScratchBlocks.VerticalExtensions");

/** 向左移动的积木块 将 'motion_moveleft' 添加到 Blockly.Blocks 对象中，这个对象包含了所有积木的定义 */
Blockly.Blocks["motion_moveleft"] = {
  /**
   * 积木初始化时调用的方法
   * @this Blockly.Block
   */
  init: function () {
    /** 积木的 json 配置 */
    this.jsonInit({
      // 积木标识符，如果和 ScratchBlocks.Blocks['motion_movesteps'] 中的一致，可以省略不写
      // "type": "motion_movesteps",
      // 明文内容:对应msg/messages.js文件中对应常量 %1 是参数占位符，和 args0 数组中参数对应
      message0: Blockly.Msg.MOTION_MOVELEFT,
      // 该积木块所需的参数对应设置，必须是数组，可以为空数组
      args0: [
        // 第一个参数
        {
          type: "field_image", // 字段_图片 类型
          // 图片的src,通常采用 media\xxxxx.svg下的svg文件
          src:
            Blockly.mainWorkspace.options.pathToMedia + "motion/moveleft.png",
          width: 48, // 图标的宽度
          height: 48, // 图标的高度
        },
        // 第二个参数 参数类型，input_ 开头表示包含了一个 shadow block,
        {
          type: "input_value", // 需要在 xml 中指明 shadow block 的 type
          name: "STEPS", // 参数的名称
        },
        // 第三个参数 参数类型，input_ 开头表示包含了一个 shadow block,
        {
          type: "input_value", // 需要在 xml 中指明 shadow block 的 type
          name: "SECS", // 参数的名称 表示速度
        },
      ],
      // 积木所属的分类，对应 xml 中 category 标签的 id
      category: Blockly.Categories.motion,
      // 积木继承项，数组中的字符串是已经定义好的扩展，使用扩展属性可以减少重复的配置
      // 可以在 ScratchBlocks.Extensions 对象中查看所有定义的扩展，也可以自己定义扩展。
      // :[设置运动类图库的颜色，设置本积木块的形状]
      extensions: ["colours_motion", "shape_statement"],
    });
  },
};

/** 向右移动的积木块 */
Blockly.Blocks["motion_moveright"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      // 明文内容:对应msg/messages.js文件中对应常量
      message0: Blockly.Msg.MOTION_MOVERIGHT,
      // 该积木块所需的参数对应设置
      args0: [
        // 第一个参数
        {
          type: "field_image", // 字段_图片 类型
          // 图片的src,通常采用 media\xxxxx.svg下的svg文件
          src:
            Blockly.mainWorkspace.options.pathToMedia + "motion/moveright.png",
          width: 48, // 图标的宽度
          height: 48, // 图标的高度
        },
        // 第二个参数
        {
          type: "input_value", // 输入值类型
          name: "STEPS", // 步，可以看作单位？
        },
        // 第三个参数 参数类型，input_ 开头表示包含了一个 shadow block,
        {
          type: "input_value", // 需要在 xml 中指明 shadow block 的 type
          name: "SECS", // 参数的名称 表示速度
        },
      ],
      // 分类:分类.运动分类
      category: Blockly.Categories.motion,
      // :[设置运动类图库的颜色，设置本积木块的形状]
      extensions: ["colours_motion", "shape_statement"],
    });
  },
};

/** 向上移动的积木块 */
Blockly.Blocks["motion_moveup"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      // 明文内容:对应msg/messages.js文件中对应常量
      message0: Blockly.Msg.MOTION_MOVEUP,
      // 该积木块所需的参数对应设置
      args0: [
        // 第一个参数
        {
          type: "field_image", // 字段_图片 类型
          // 图片的src,通常采用 media\xxxxx.svg下的svg文件
          src: Blockly.mainWorkspace.options.pathToMedia + "motion/moveup.png",
          width: 48, // 图标的宽度
          height: 48, // 图标的高度
        },
        // 第二个参数
        {
          type: "input_value", // 输入值类型
          name: "STEPS", // 步，可以看作单位？
        },
        // 第三个参数 参数类型，input_ 开头表示包含了一个 shadow block,
        {
          type: "input_value", // 需要在 xml 中指明 shadow block 的 type
          name: "SECS", // 参数的名称 表示速度
        },
      ],
      // 分类:分类.运动分类
      category: Blockly.Categories.motion,
      // :[设置运动类图库的颜色，设置本积木块的形状]
      extensions: ["colours_motion", "shape_statement"],
    });
  },
};

/** 向下移动的积木块 */
Blockly.Blocks["motion_movedown"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      // 明文内容:对应msg/messages.js文件中对应常量
      message0: Blockly.Msg.MOTION_MOVEDOWN,
      // 该积木块所需的参数对应设置
      args0: [
        // 第一个参数
        {
          type: "field_image", // 字段_图片 类型
          // 图片的src,通常采用 media\xxxxx.svg下的svg文件
          src:
            Blockly.mainWorkspace.options.pathToMedia + "motion/movedown.png",
          width: 48, // 图标的宽度
          height: 48, // 图标的高度
        },
        // 第二个参数
        {
          type: "input_value", // 输入值类型
          name: "STEPS", // 步，可以看作单位？
        },
        // 第三个参数 参数类型，input_ 开头表示包含了一个 shadow block,
        {
          type: "input_value", // 需要在 xml 中指明 shadow block 的 type
          name: "SECS", // 参数的名称 表示速度
        },
      ],
      // 分类:分类.运动分类
      category: Blockly.Categories.motion,
      // :[设置运动类图库的颜色，设置本积木块的形状]
      extensions: ["colours_motion", "shape_statement"],
    });
  },
};

/** 向左转的积木块 */
Blockly.Blocks["motion_turnleft"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.MOTION_TURNLEFT,
      args0: [
        {
          type: "field_image",
          src:
            Blockly.mainWorkspace.options.pathToMedia + "motion/turnleft.png",
          width: 48,
          height: 48,
        },
        {
          type: "input_value",
          name: "DEGREES",
        },
      ],
      category: Blockly.Categories.motion,
      extensions: ["colours_motion", "shape_statement"],
    });
  },
};

/** 向右转的积木块 */
Blockly.Blocks["motion_turnright"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.MOTION_TURNRIGHT,
      args0: [
        {
          type: "field_image",
          src:
            Blockly.mainWorkspace.options.pathToMedia + "motion/turnright.png",
          width: 48,
          height: 48,
        },
        {
          type: "input_value",
          name: "DEGREES",
        },
      ],
      category: Blockly.Categories.motion,
      extensions: ["colours_motion", "shape_statement"],
    });
  },
};

/** 向跳的积木块 */
Blockly.Blocks["motion_jump"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.MOTION_JUMP,
      args0: [
        {
          type: "field_image",
          src: Blockly.mainWorkspace.options.pathToMedia + "motion/jump.png",
          width: 48,
          height: 48,
        },
        {
          type: "input_value",
          name: "HEIGHT",
        },
        // 第三个参数 参数类型，input_ 开头表示包含了一个 shadow block,
        {
          type: "input_value", // 需要在 xml 中指明 shadow block 的 type
          name: "SECS", // 参数的名称 表示速度
        },
      ],
      category: Blockly.Categories.motion,
      extensions: ["colours_motion", "shape_statement"],
    });
  },
};

/** 运动 之 重置 即舞台角色回归至 0,0 */
Blockly.Blocks["motion_movereset"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      // 明文内容:对应msg/messages.js文件中对应常量
      message0: Blockly.Msg.MOTION_MOVERESET,
      // 该积木块所需的参数对应设置
      args0: [
        // 第一个参数
        {
          type: "field_image", // 字段_图片 类型
          // 图片的src,通常采用 media\xxxxx.svg下的svg文件
          src:
            Blockly.mainWorkspace.options.pathToMedia + "motion/movereset.png",
          width: 48, // 图标的宽度
          height: 48, // 图标的高度
        },
      ],
      // 分类:分类.运动分类
      category: Blockly.Categories.motion,
      // :[设置运动类图库的颜色，设置本积木块的形状]
      extensions: ["colours_motion", "shape_statement"],
    });
  },
};

// Blockly.Blocks["motion_pointindirection"] = {
//   /**
//    * Block to point in direction.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_POINTINDIRECTION,
//       args0: [
//         {
//           type: "input_value",
//           name: "DIRECTION",
//         },
//       ],
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "shape_statement"],
//     });
//   },
// };

// Blockly.Blocks["motion_pointtowards_menu"] = {
//   /**
//    * Point towards drop-down menu.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: "%1",
//       args0: [
//         {
//           type: "field_dropdown",
//           name: "TOWARDS",
//           options: [
//             [Blockly.Msg.MOTION_POINTTOWARDS_POINTER, "_mouse_"],
//             [Blockly.Msg.MOTION_POINTTOWARDS_RANDOM, "_random_"],
//           ],
//         },
//       ],
//       colour: Blockly.Colours.motion.secondary,
//       colourSecondary: Blockly.Colours.motion.secondary,
//       colourTertiary: Blockly.Colours.motion.tertiary,
//       extensions: ["output_string"],
//     });
//   },
// };

// Blockly.Blocks["motion_pointtowards"] = {
//   /**
//    * Block to point in direction.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_POINTTOWARDS,
//       args0: [
//         {
//           type: "input_value",
//           name: "TOWARDS",
//         },
//       ],
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "shape_statement"],
//     });
//   },
// };

// Blockly.Blocks["motion_goto_menu"] = {
//   /**
//    * Go to drop-down menu.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: "%1",
//       args0: [
//         {
//           type: "field_dropdown",
//           name: "TO",
//           options: [
//             [Blockly.Msg.MOTION_GOTO_POINTER, "_mouse_"],
//             [Blockly.Msg.MOTION_GOTO_RANDOM, "_random_"],
//           ],
//         },
//       ],
//       colour: Blockly.Colours.motion.secondary,
//       colourSecondary: Blockly.Colours.motion.secondary,
//       colourTertiary: Blockly.Colours.motion.tertiary,
//       extensions: ["output_string"],
//     });
//   },
// };

// Blockly.Blocks["motion_gotoxy"] = {
//   /**
//    * Block to go to X, Y.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_GOTOXY,
//       args0: [
//         {
//           type: "input_value",
//           name: "X",
//         },
//         {
//           type: "input_value",
//           name: "Y",
//         },
//       ],
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "shape_statement"],
//     });
//   },
// };

// Blockly.Blocks["motion_goto"] = {
//   /**
//    * Block to go to a menu item.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_GOTO,
//       args0: [
//         {
//           type: "input_value",
//           name: "TO",
//         },
//       ],
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "shape_statement"],
//     });
//   },
// };

// Blockly.Blocks["motion_glidesecstoxy"] = {
//   /**
//    * Block to glide for a specified time.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_GLIDESECSTOXY,
//       args0: [
//         {
//           type: "input_value",
//           name: "SECS",
//         },
//         {
//           type: "input_value",
//           name: "X",
//         },
//         {
//           type: "input_value",
//           name: "Y",
//         },
//       ],
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "shape_statement"],
//     });
//   },
// };

// Blockly.Blocks["motion_glideto_menu"] = {
//   /**
//    * Glide to drop-down menu
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: "%1",
//       args0: [
//         {
//           type: "field_dropdown",
//           name: "TO",
//           options: [
//             [Blockly.Msg.MOTION_GLIDETO_POINTER, "_mouse_"],
//             [Blockly.Msg.MOTION_GLIDETO_RANDOM, "_random_"],
//           ],
//         },
//       ],
//       colour: Blockly.Colours.motion.secondary,
//       colourSecondary: Blockly.Colours.motion.secondary,
//       colourTertiary: Blockly.Colours.motion.tertiary,
//       extensions: ["output_string"],
//     });
//   },
// };

// Blockly.Blocks["motion_glideto"] = {
//   /**
//    * Block to glide to a menu item
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_GLIDETO,
//       args0: [
//         {
//           type: "input_value",
//           name: "SECS",
//         },
//         {
//           type: "input_value",
//           name: "TO",
//         },
//       ],
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "shape_statement"],
//     });
//   },
// };

// Blockly.Blocks["motion_changexby"] = {
//   /**
//    * Block to change X.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_CHANGEXBY,
//       args0: [
//         {
//           type: "input_value",
//           name: "DX",
//         },
//       ],
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "shape_statement"],
//     });
//   },
// };

// Blockly.Blocks["motion_setx"] = {
//   /**
//    * Block to set X.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_SETX,
//       args0: [
//         {
//           type: "input_value",
//           name: "X",
//         },
//       ],
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "shape_statement"],
//     });
//   },
// };

// Blockly.Blocks["motion_changeyby"] = {
//   /**
//    * Block to change Y.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_CHANGEYBY,
//       args0: [
//         {
//           type: "input_value",
//           name: "DY",
//         },
//       ],
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "shape_statement"],
//     });
//   },
// };

// Blockly.Blocks["motion_sety"] = {
//   /**
//    * Block to set Y.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_SETY,
//       args0: [
//         {
//           type: "input_value",
//           name: "Y",
//         },
//       ],
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "shape_statement"],
//     });
//   },
// };

// Blockly.Blocks["motion_ifonedgebounce"] = {
//   /**
//    * Block to bounce on edge.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_IFONEDGEBOUNCE,
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "shape_statement"],
//     });
//   },
// };

// Blockly.Blocks["motion_setrotationstyle"] = {
//   /**
//    * Block to set rotation style.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_SETROTATIONSTYLE,
//       args0: [
//         {
//           type: "field_dropdown",
//           name: "STYLE",
//           options: [
//             [Blockly.Msg.MOTION_SETROTATIONSTYLE_LEFTRIGHT, "left-right"],
//             [Blockly.Msg.MOTION_SETROTATIONSTYLE_DONTROTATE, "don't rotate"],
//             [Blockly.Msg.MOTION_SETROTATIONSTYLE_ALLAROUND, "all around"],
//           ],
//         },
//       ],
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "shape_statement"],
//     });
//   },
// };

// Blockly.Blocks["motion_xposition"] = {
//   /**
//    * Block to report X.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_XPOSITION,
//       category: Blockly.Categories.motion,
//       checkboxInFlyout: true,
//       extensions: ["colours_motion", "output_number"],
//     });
//   },
// };

// Blockly.Blocks["motion_yposition"] = {
//   /**
//    * Block to report Y.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_YPOSITION,
//       category: Blockly.Categories.motion,
//       checkboxInFlyout: true,
//       extensions: ["colours_motion", "output_number"],
//     });
//   },
// };

// Blockly.Blocks["motion_direction"] = {
//   /**
//    * Block to report direction.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_DIRECTION,
//       category: Blockly.Categories.motion,
//       checkboxInFlyout: true,
//       extensions: ["colours_motion", "output_number"],
//     });
//   },
// };

// Blockly.Blocks["motion_scroll_right"] = {
//   /**
//    * Block to scroll the stage right. Does not actually do anything. This is
//    * an obsolete block that is implemented for compatibility with Scratch 2.0
//    * projects.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_SCROLLRIGHT,
//       args0: [
//         {
//           type: "input_value",
//           name: "DISTANCE",
//         },
//       ],
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "shape_statement"],
//     });
//   },
// };

// Blockly.Blocks["motion_scroll_up"] = {
//   /**
//    * Block to scroll the stage up. Does not actually do anything. This is an
//    * obsolete block that is implemented for compatibility with Scratch 2.0
//    * projects.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_SCROLLUP,
//       args0: [
//         {
//           type: "input_value",
//           name: "DISTANCE",
//         },
//       ],
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "shape_statement"],
//     });
//   },
// };

// Blockly.Blocks["motion_align_scene"] = {
//   /**
//    * Block to change the stage's scrolling alignment. Does not actually do
//    * anything. This is an obsolete block that is implemented for compatibility
//    * with Scratch 2.0 projects.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_ALIGNSCENE,
//       args0: [
//         {
//           type: "field_dropdown",
//           name: "ALIGNMENT",
//           options: [
//             [Blockly.Msg.MOTION_ALIGNSCENE_BOTTOMLEFT, "bottom-left"],
//             [Blockly.Msg.MOTION_ALIGNSCENE_BOTTOMRIGHT, "bottom-right"],
//             [Blockly.Msg.MOTION_ALIGNSCENE_MIDDLE, "middle"],
//             [Blockly.Msg.MOTION_ALIGNSCENE_TOPLEFT, "top-left"],
//             [Blockly.Msg.MOTION_ALIGNSCENE_TOPRIGHT, "top-right"],
//           ],
//         },
//       ],
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "shape_statement"],
//     });
//   },
// };

// Blockly.Blocks["motion_xscroll"] = {
//   /**
//    * Block to report the stage's scroll position's X value. Does not actually
//    * do anything. This is an obsolete block that is implemented for
//    * compatibility with Scratch 2.0 projects.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_XSCROLL,
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "output_number"],
//     });
//   },
// };

// Blockly.Blocks["motion_yscroll"] = {
//   /**
//    * Block to report the stage's scroll position's Y value. Does not actually
//    * do anything. This is an obsolete block that is implemented for
//    * compatibility with Scratch 2.0 projects.
//    * @this Blockly.Block
//    */
//   init: function () {
//     this.jsonInit({
//       message0: Blockly.Msg.MOTION_YSCROLL,
//       category: Blockly.Categories.motion,
//       extensions: ["colours_motion", "output_number"],
//     });
//   },
// };
