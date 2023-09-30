/*
 * @Author: Satya
 * @Date: 2020-11-14 15:39:39
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-22 19:15:13
 * doc: 少儿编程 之 侦测类
 */

/** Sensing 侦测 按下鼠标? */
Blockly.Blocks["pro_sensing_mousedown"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_MOUSEDOWN,
      output: "Boolean",
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
    });
  },
};

/** Sensing 侦测 按下 [下拉选项] 键? */
Blockly.Blocks["pro_sensing_keyoptions"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "KEY_OPTION",
          options: [
            [KidBlocks.Msg.PRO_EVENT_WHENKEYPRESSED_SPACE, "space"],
            [KidBlocks.Msg.PRO_EVENT_WHENKEYPRESSED_UP, "up arrow"],
            [KidBlocks.Msg.PRO_EVENT_WHENKEYPRESSED_DOWN, "down arrow"],
            [KidBlocks.Msg.PRO_EVENT_WHENKEYPRESSED_RIGHT, "right arrow"],
            [KidBlocks.Msg.PRO_EVENT_WHENKEYPRESSED_LEFT, "left arrow"],
            [KidBlocks.Msg.PRO_EVENT_WHENKEYPRESSED_ANY, "any"],
            ["a", "a"],
            ["b", "b"],
            ["c", "c"],
            ["d", "d"],
            ["e", "e"],
            ["f", "f"],
            ["g", "g"],
            ["h", "h"],
            ["i", "i"],
            ["j", "j"],
            ["k", "k"],
            ["l", "l"],
            ["m", "m"],
            ["n", "n"],
            ["o", "o"],
            ["p", "p"],
            ["q", "q"],
            ["r", "r"],
            ["s", "s"],
            ["t", "t"],
            ["u", "u"],
            ["v", "v"],
            ["w", "w"],
            ["x", "x"],
            ["y", "y"],
            ["z", "z"],
            ["0", "0"],
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"],
            ["6", "6"],
            ["7", "7"],
            ["8", "8"],
            ["9", "9"],
          ],
        },
      ],
      output: "String",
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
    });
  },
};

/** Sensing 侦测 按下 %1 键? */
Blockly.Blocks["pro_sensing_keypressed"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_KEYPRESSED,
      args0: [
        {
          type: "input_value",
          name: "KEY_OPTION",
        },
      ],
      output: "Boolean",
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
    });
  },
};

/** Sensing "Touching [Object]" Block Menu */
Blockly.Blocks["pro_sensing_touchingobjectmenu"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "TOUCHINGOBJECTMENU",
          options: [
            [KidBlocks.Msg.PRO_SENSING_TOUCHINGOBJECT_POINTER, "_mouse_"],
            [KidBlocks.Msg.PRO_SENSING_TOUCHINGOBJECT_EDGE, "_edge_"],
          ],
        },
      ],
      output: "String",
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
    });
  },
};

/** Sensing 侦测 报告是否触摸到对象 */
Blockly.Blocks["pro_sensing_touchingobject"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_TOUCHINGOBJECT,
      args0: [
        {
          type: "input_value",
          name: "TOUCHINGOBJECTMENU",
        },
      ],
      output: "Boolean",
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
    });
  },
};

/** Sensing 侦测 碰到颜色 */
Blockly.Blocks["pro_sensing_touchingcolor"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_TOUCHINGCOLOR,
      args0: [
        {
          type: "input_value",
          name: "COLOR",
        },
      ],
      output: "Boolean",
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
    });
  },
};

/** Sensing 侦测 报告颜色是否触摸某种颜色 */
Blockly.Blocks["pro_sensing_coloristouchingcolor"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_COLORISTOUCHINGCOLOR,
      args0: [
        {
          type: "input_value",
          name: "COLOR",
        },
        {
          type: "input_value",
          name: "COLOR2",
        },
      ],
      output: "Boolean",
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
    });
  },
};

/** Sensing 侦测 询问 %1 并等待 */
Blockly.Blocks["pro_sensing_askandwait"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_ASKANDWAIT,
      args0: [
        {
          type: "input_value",
          name: "QUESTION",
        },
      ],
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Sensing 侦测 将拖动模式设为 %1 */
Blockly.Blocks["pro_sensing_setdragmode"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_SETDRAGMODE,
      args0: [
        {
          type: "field_dropdown",
          name: "DRAG_MODE",
          options: [
            [KidBlocks.Msg.PRO_SENSING_SETDRAGMODE_DRAGGABLE, "draggable"],
            [
              KidBlocks.Msg.PRO_SENSING_SETDRAGMODE_NOTDRAGGABLE,
              "not draggable",
            ],
          ],
        },
      ],
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Sensing 侦测 计时器归零 */
Blockly.Blocks["pro_sensing_resettimer"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_RESETTIMER,
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Sensing 侦测 到 [下拉菜单] 的距离 */
Blockly.Blocks["pro_sensing_distancetomenu"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "DISTANCETOMENU",
          options: [[KidBlocks.Msg.PRO_SENSING_DISTANCETO_POINTER, "_mouse_"]],
        },
      ],
      output: "String",
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
    });
  },
};

/** Sensing 侦测 到 %1 的距离 */
Blockly.Blocks["pro_sensing_distanceto"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_DISTANCETO,
      args0: [
        {
          type: "input_value",
          name: "DISTANCETOMENU",
        },
      ],
      output: "Number",
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
    });
  },
};

/** Sensing 侦测 鼠标的x坐标 */
Blockly.Blocks["pro_sensing_mousex"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_MOUSEX,
      output: "Number",
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
    });
  },
};

/** Sensing 侦测 鼠标的y坐标 */
Blockly.Blocks["pro_sensing_mousey"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_MOUSEY,
      output: "Number",
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
    });
  },
};

/** Sensing 侦测 [下拉菜单]的[下拉菜单] */
Blockly.Blocks["pro_sensing_of_object_menu"] = {
  /**
   * "* of _" object menu.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "OBJECT",
          options: [
            ["Sprite1", "Sprite1"],
            ["Stage", "_stage_"],
          ],
        },
      ],
      output: "String",
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
    });
  },
};

/** Sensing 侦测 [下拉菜单]的[下拉菜单] */
Blockly.Blocks["pro_sensing_of"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_OF,
      args0: [
        {
          type: "field_dropdown",
          name: "PROPERTY",
          options: [
            // [KidBlocks.Msg.PRO_SENSING_OF_STAGE, "stage"],
            [KidBlocks.Msg.PRO_SENSING_OF_XPOSITION, "x position"],
            [KidBlocks.Msg.PRO_SENSING_OF_YPOSITION, "y position"],
            [KidBlocks.Msg.PRO_SENSING_OF_DIRECTION, "direction"],
            [KidBlocks.Msg.PRO_SENSING_OF_COSTUMENUMBER, "costume #"],
            [KidBlocks.Msg.PRO_SENSING_OF_COSTUMENAME, "costume name"],
            [KidBlocks.Msg.PRO_SENSING_OF_SIZE, "size"],
            [KidBlocks.Msg.PRO_SENSING_OF_VOLUME, "volume"],
            [KidBlocks.Msg.PRO_SENSING_OF_BACKDROPNUMBER, "backdrop #"],
            [KidBlocks.Msg.PRO_SENSING_OF_BACKDROPNAME, "backdrop name"],
          ],
        },
        {
          type: "input_value",
          name: "OBJECT",
        },
      ],
      output: true,
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
      // outputShape: Blockly.OUTPUT_SHAPE_ROUND,
    });
  },
};

/** Sensing 侦测 2000年至今的天数 */
Blockly.Blocks["pro_sensing_dayssince2000"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_DAYSSINCE2000,
      output: "Number",
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
    });
  },
};

Blockly.Blocks["pro_sensing_answer"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_ANSWER,
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
      checkboxInFlyout: true,
      output: "Number",
    });
  },
};

Blockly.Blocks["pro_sensing_loudness"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_LOUDNESS,
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
      checkboxInFlyout: true,
      output: "Number",
    });
  },
};

Blockly.Blocks["pro_sensing_timer"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_TIMER,
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
      checkboxInFlyout: true,
      output: "Number",
    });
  },
};
// 该积木需处理下拉选项，否则生成一堆checkbox
// Blockly.Blocks["pro_sensing_current"] = {
//   init: function () {
//     this.jsonInit({
//       message0: KidBlocks.Msg.PRO_SENSING_CURRENT,
//       args0: [
//         {
//           type: "field_dropdown",
//           name: "CURRENTMENU",
//           options: [
//             [KidBlocks.Msg.PRO_SENSING_CURRENT_YEAR, "YEAR"],
//             [KidBlocks.Msg.PRO_SENSING_CURRENT_MONTH, "MONTH"],
//             [KidBlocks.Msg.PRO_SENSING_CURRENT_DATE, "DATE"],
//             [KidBlocks.Msg.PRO_SENSING_CURRENT_DAYOFWEEK, "DAYOFWEEK"],
//             [KidBlocks.Msg.PRO_SENSING_CURRENT_HOUR, "HOUR"],
//             [KidBlocks.Msg.PRO_SENSING_CURRENT_MINUTE, "MINUTE"],
//             [KidBlocks.Msg.PRO_SENSING_CURRENT_SECOND, "SECOND"],
//           ],
//         },
//       ],
//       colour: KidBlocks.Msg.PRO_SENSING_HUE,
//       checkboxInFlyout: true,
//       output: "Number",
//     });
//   },
// };

Blockly.Blocks["pro_sensing_username"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SENSING_USERNAME,
      colour: KidBlocks.Msg.PRO_SENSING_HUE,
      checkboxInFlyout: true,
      output: "Number",
    });
  },
};
