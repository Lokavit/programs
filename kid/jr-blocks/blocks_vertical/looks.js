/*
 * @Author: Satya
 * @Date: 2020-06-11 14:37:00
 * @Last Modified by: Satya
 * @Last Modified time: 2020-06-15 16:33:54
 * doc: 外观分类下所有积木块创建及配置
 */

"use strict";

goog.provide("Blockly.Blocks.looks");

goog.require("Blockly.Blocks");
goog.require("Blockly.Colours");
goog.require("Blockly.constants");
goog.require("Blockly.ScratchBlocks.VerticalExtensions");

/** 外观 之 显示角色 */
Blockly.Blocks["looks_show"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.LOOKS_SHOW,
      // 该积木块所需的参数对应设置
      args0: [
        // 第一个参数
        {
          type: "field_image", // 字段_图片 类型
          // 图片的src,通常采用 media\xxxxx.svg下的svg文件
          src: Blockly.mainWorkspace.options.pathToMedia + "looks/show.png",
          width: 48, // 图标的宽度
          height: 48, // 图标的高度
        },
      ],
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "shape_statement"],
    });
  },
};

/** 外观 之 隐藏角色 */
Blockly.Blocks["looks_hide"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.LOOKS_HIDE,
      // 该积木块所需的参数对应设置
      args0: [
        // 第一个参数
        {
          type: "field_image", // 字段_图片 类型
          // 图片的src,通常采用 media\xxxxx.svg下的svg文件
          src: Blockly.mainWorkspace.options.pathToMedia + "looks/hide.png",
          width: 48, // 图标的宽度
          height: 48, // 图标的高度
        },
      ],
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "shape_statement"],
    });
  },
};

/** 外观 之 放大角色 */
Blockly.Blocks["looks_zoomout"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.LOOKS_ZOOMOUT,
      args0: [
        // 第一个参数
        {
          type: "field_image", // 字段_图片 类型
          // 图片的src,通常采用 media\xxxxx.svg下的svg文件
          src: Blockly.mainWorkspace.options.pathToMedia + "looks/zoomout.png",
          width: 48, // 图标的宽度
          height: 48, // 图标的高度
        },
      ],
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "shape_statement"],
    });
  },
};

/** 外观 之 缩小角色 */
Blockly.Blocks["looks_zoomin"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.LOOKS_ZOOMIN,
      args0: [
        // 第一个参数
        {
          type: "field_image", // 字段_图片 类型
          // 图片的src,通常采用 media\xxxxx.svg下的svg文件
          src: Blockly.mainWorkspace.options.pathToMedia + "looks/zoomin.png",
          width: 48, // 图标的宽度
          height: 48, // 图标的高度
        },
      ],
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "shape_statement"],
    });
  },
};

/** 外观 之 缩放重置 */
Blockly.Blocks["looks_zoomreset"] = {
  /**
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      // 明文内容:对应msg/messages.js文件中对应常量
      message0: Blockly.Msg.LOOKS_ZOOMRESET,
      // 该积木块所需的参数对应设置
      args0: [
        // 第一个参数
        {
          type: "field_image", // 字段_图片 类型
          // 图片的src,通常采用 media\xxxxx.svg下的svg文件
          src:
            Blockly.mainWorkspace.options.pathToMedia + "looks/zoomreset.png",
          width: 48, // 图标的宽度
          height: 48, // 图标的高度
        },
      ],
      // 分类:分类.运动分类
      category: Blockly.Categories.motion,
      // :[设置运动类图库的颜色，设置本积木块的形状]
      extensions: ["colours_looks", "shape_statement"],
    });
  },
};

/** 外观 之 背景替换 */
Blockly.Blocks["looks_switchbackdropto"] = {
  /**
   * Block to switch the backdrop to the selected one.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: Blockly.Msg.LOOKS_SWITCHBACKDROPTO,
      args0: [
        {
          type: "field_image", // 字段_图片 类型
          src:
            Blockly.mainWorkspace.options.pathToMedia + "looks/changescene.png",
          width: 48, // 图标的宽度
          height: 48, // 图标的高度
        },
        {
          type: "input_value",
          name: "BACKDROP",
        },
      ],
      category: Blockly.Categories.looks,
      extensions: ["colours_looks", "shape_statement"],
    });
  },
};

Blockly.Blocks["looks_backdrops"] = {
  /**
   * 背景列表
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      id: "looks_backdrops",
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "BACKDROP",
          options: [["backdrop1", "BACKDROP1"]],
        },
      ],
      colour: Blockly.Colours.looks.secondary,
      colourSecondary: Blockly.Colours.looks.secondary,
      colourTertiary: Blockly.Colours.looks.tertiary,
      extensions: ["output_string"],
    });
  },
};

// Blockly.Blocks['looks_sayforsecs'] = {
//   /**
//    * Block to say for some time.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_SAYFORSECS,
//       "args0": [
//         {
//           "type": "input_value",
//           "name": "MESSAGE"
//         },
//         {
//           "type": "input_value",
//           "name": "SECS"
//         }
//       ],
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_say'] = {
//   /**
//    * Block to say.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_SAY,
//       "args0": [
//         {
//           "type": "input_value",
//           "name": "MESSAGE"
//         }
//       ],
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_thinkforsecs'] = {
//   /**
//    * Block to think for some time.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_THINKFORSECS,
//       "args0": [
//         {
//           "type": "input_value",
//           "name": "MESSAGE"
//         },
//         {
//           "type": "input_value",
//           "name": "SECS"
//         }
//       ],
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_think'] = {
//   /**
//    * Block to think.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_THINK,
//       "args0": [
//         {
//           "type": "input_value",
//           "name": "MESSAGE"
//         }
//       ],
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_hideallsprites'] = {
//   /**
//    * Hide-all-sprites block. Does not actually do anything. This is an
//    * obsolete block that is implemented for compatibility with Scratch 2.0
//    * projects.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_HIDEALLSPRITES,
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_changeeffectby'] = {
//   /**
//    * Block to change graphic effect.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_CHANGEEFFECTBY,
//       "args0": [
//         {
//           "type": "field_dropdown",
//           "name": "EFFECT",
//           "options": [
//             [Blockly.Msg.LOOKS_EFFECT_COLOR, 'COLOR'],
//             [Blockly.Msg.LOOKS_EFFECT_FISHEYE, 'FISHEYE'],
//             [Blockly.Msg.LOOKS_EFFECT_WHIRL, 'WHIRL'],
//             [Blockly.Msg.LOOKS_EFFECT_PIXELATE, 'PIXELATE'],
//             [Blockly.Msg.LOOKS_EFFECT_MOSAIC, 'MOSAIC'],
//             [Blockly.Msg.LOOKS_EFFECT_BRIGHTNESS, 'BRIGHTNESS'],
//             [Blockly.Msg.LOOKS_EFFECT_GHOST, 'GHOST']
//           ]
//         },
//         {
//           "type": "input_value",
//           "name": "CHANGE"
//         }
//       ],
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_seteffectto'] = {
//   /**
//    * Block to set graphic effect.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_SETEFFECTTO,
//       "args0": [
//         {
//           "type": "field_dropdown",
//           "name": "EFFECT",
//           "options": [
//             [Blockly.Msg.LOOKS_EFFECT_COLOR, 'COLOR'],
//             [Blockly.Msg.LOOKS_EFFECT_FISHEYE, 'FISHEYE'],
//             [Blockly.Msg.LOOKS_EFFECT_WHIRL, 'WHIRL'],
//             [Blockly.Msg.LOOKS_EFFECT_PIXELATE, 'PIXELATE'],
//             [Blockly.Msg.LOOKS_EFFECT_MOSAIC, 'MOSAIC'],
//             [Blockly.Msg.LOOKS_EFFECT_BRIGHTNESS, 'BRIGHTNESS'],
//             [Blockly.Msg.LOOKS_EFFECT_GHOST, 'GHOST']
//           ]
//         },
//         {
//           "type": "input_value",
//           "name": "VALUE"
//         }
//       ],
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_cleargraphiceffects'] = {
//   /**
//    * Block to clear graphic effects.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_CLEARGRAPHICEFFECTS,
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_setsizeto'] = {
//   /**
//    * Block to set size
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_SETSIZETO,
//       "args0": [
//         {
//           "type": "input_value",
//           "name": "SIZE"
//         }
//       ],
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_size'] = {
//   /**
//    * Block to report size
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_SIZE,
//       "category": Blockly.Categories.looks,
//       "checkboxInFlyout": true,
//       "extensions": ["colours_looks", "output_number"]
//     });
//   }
// };

// Blockly.Blocks['looks_changestretchby'] = {
//   /**
//    * Block to change stretch. Does not actually do anything. This is an
//    * obsolete block that is implemented for compatibility with Scratch 1.4
//    * projects as well as 2.0 projects that still have the block.
//    * The "stretch" blocks were introduced in very early versions of Scratch,
//    * but their functionality was removed shortly later. They still appeared
//    * correctly up until (and including) Scratch 1.4 - as "change stretch by"
//    * and "set stretch to" - but were removed altogether in Scratch 2.0, and
//    * displayed as red "undefined" blocks. Some Scratch projects still contain
//    * these blocks, however, and they don't open in 3.0 unless the blocks
//    * actually exist (though they still don't funcitonally do anything).
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_CHANGESTRETCHBY,
//       "args0": [
//         {
//           "type": "input_value",
//           "name": "CHANGE"
//         }
//       ],
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_setstretchto'] = {
//   /**
//    * Block to set stretch. Does not actually do anything. This is an obsolete
//    * block that is implemented for compatibility with Scratch 1.4 projects
//    * (see looks_changestretchby).
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_SETSTRETCHTO,
//       "args0": [
//         {
//           "type": "input_value",
//           "name": "STRETCH"
//         }
//       ],
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_costume'] = {
//   /**
//    * Costumes drop-down menu.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": "%1",
//       "args0": [
//         {
//           "type": "field_dropdown",
//           "name": "COSTUME",
//           "options": [
//             ['costume1', 'COSTUME1'],
//             ['costume2', 'COSTUME2']
//           ]
//         }
//       ],
//       "colour": Blockly.Colours.looks.secondary,
//       "colourSecondary": Blockly.Colours.looks.secondary,
//       "colourTertiary": Blockly.Colours.looks.tertiary,
//       "extensions": ["output_string"]
//     });
//   }
// };

// Blockly.Blocks['looks_switchcostumeto'] = {
//   /**
//    * Block to switch the sprite's costume to the selected one.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_SWITCHCOSTUMETO,
//       "args0": [
//         {
//           "type": "input_value",
//           "name": "COSTUME"
//         }
//       ],
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_nextcostume'] = {
//   /**
//    * Block to switch the sprite's costume to the next one.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_NEXTCOSTUME,
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_gotofrontback'] = {
//   /**
//    * "Go to front/back" Block.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_GOTOFRONTBACK,
//       "args0": [
//         {
//           "type": "field_dropdown",
//           "name": "FRONT_BACK",
//           "options": [
//             [Blockly.Msg.LOOKS_GOTOFRONTBACK_FRONT, 'front'],
//             [Blockly.Msg.LOOKS_GOTOFRONTBACK_BACK, 'back']
//           ]
//         }
//       ],
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_goforwardbackwardlayers'] = {
//   /**
//    * "Go forward/backward [Number] Layers" Block.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_GOFORWARDBACKWARDLAYERS,
//       "args0": [
//         {
//           "type": "field_dropdown",
//           "name": "FORWARD_BACKWARD",
//           "options": [
//             [Blockly.Msg.LOOKS_GOFORWARDBACKWARDLAYERS_FORWARD, 'forward'],
//             [Blockly.Msg.LOOKS_GOFORWARDBACKWARDLAYERS_BACKWARD, 'backward']
//           ]
//         },
//         {
//           "type": "input_value",
//           "name": "NUM"
//         }
//       ],
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_backdropnumbername'] = {
//   /**
//    * Block to report backdrop's number or name
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_BACKDROPNUMBERNAME,
//       "args0": [
//         {
//           "type": "field_dropdown",
//           "name": "NUMBER_NAME",
//           "options": [
//             [Blockly.Msg.LOOKS_NUMBERNAME_NUMBER, 'number'],
//             [Blockly.Msg.LOOKS_NUMBERNAME_NAME, 'name']
//           ]
//         }
//       ],
//       "category": Blockly.Categories.looks,
//       "checkboxInFlyout": true,
//       "extensions": ["colours_looks", "output_number"]
//     });
//   }
// };

// Blockly.Blocks['looks_costumenumbername'] = {
//   /**
//    * Block to report costume's number or name
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_COSTUMENUMBERNAME,
//       "args0": [
//         {
//           "type": "field_dropdown",
//           "name": "NUMBER_NAME",
//           "options": [
//             [Blockly.Msg.LOOKS_NUMBERNAME_NUMBER, 'number'],
//             [Blockly.Msg.LOOKS_NUMBERNAME_NAME, 'name']
//           ]
//         }
//       ],
//       "category": Blockly.Categories.looks,
//       "checkboxInFlyout": true,
//       "extensions": ["colours_looks", "output_number"]
//     });
//   }
// };

// Blockly.Blocks['looks_switchbackdroptoandwait'] = {
//   /**
//    * Block to switch the backdrop to the selected one and wait.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_SWITCHBACKDROPTOANDWAIT,
//       "args0": [
//         {
//           "type": "input_value",
//           "name": "BACKDROP"
//         }
//       ],
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };

// Blockly.Blocks['looks_nextbackdrop'] = {
//   /**
//    * Block to switch the backdrop to the next one.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.jsonInit({
//       "message0": Blockly.Msg.LOOKS_NEXTBACKDROP_BLOCK,
//       "category": Blockly.Categories.looks,
//       "extensions": ["colours_looks", "shape_statement"]
//     });
//   }
// };
