/*
 * @Author: Satya
 * @Date: 2020-11-14 15:30:00
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-22 19:32:24
 * doc: 少儿编程 之 运动类
 */

// 移动指定不数
Blockly.Blocks["pro_motion_movesteps"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_MOVESTEPS,
      args0: [
        {
          type: "input_value",
          name: "STEPS",
        },
      ],
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

// 右转指定角度
Blockly.Blocks["pro_motion_turnright"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_TURNRIGHT,
      args0: [
        {
          type: "field_image",
          src: `${Blockly.MEDIA_PATH}rotate-right.svg`,
          width: 24,
          height: 24,
        },
        {
          type: "input_value",
          name: "DEGREES",
        },
      ],
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

// 左转指定角度
Blockly.Blocks["pro_motion_turnleft"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_TURNLEFT,
      args0: [
        {
          type: "field_image",
          src: `${Blockly.MEDIA_PATH}rotate-left.svg`,
          width: 24,
          height: 24,
        },
        {
          type: "input_value",
          name: "DEGREES",
        },
      ],
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

// 面向指定方向
Blockly.Blocks["pro_motion_pointindirection"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_POINTINDIRECTION,
      args0: [
        {
          type: "input_value",
          name: "DIRECTION",
        },
      ],
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

// 面向的下拉菜单
Blockly.Blocks["pro_motion_pointtowards_menu"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "TOWARDS",
          options: [
            [KidBlocks.Msg.PRO_MOTION_POINTTOWARDS_POINTER, "_mouse_"],
            [KidBlocks.Msg.PRO_MOTION_POINTTOWARDS_RANDOM, "_random_"],
          ],
        },
      ],
      output: "String",
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
    });
  },
};

// 面向指定选项
Blockly.Blocks["pro_motion_pointtowards"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_POINTTOWARDS,
      args0: [
        {
          type: "input_value",
          name: "TOWARDS",
        },
      ],
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

// 下拉选项[鼠标指针|随机位置]
Blockly.Blocks["pro_motion_goto_menu"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "TO",
          options: [
            [KidBlocks.Msg.PRO_MOTION_GOTO_POINTER, "_mouse_"],
            [KidBlocks.Msg.PRO_MOTION_GOTO_RANDOM, "_random_"],
          ],
        },
      ],
      output: "String",
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
    });
  },
};

// 移到指定 [鼠标指针|随机位置]
Blockly.Blocks["pro_motion_goto"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_GOTO,
      args0: [
        {
          type: "input_value",
          name: "TO",
        },
      ],
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

// 移到 指定XY
Blockly.Blocks["pro_motion_gotoxy"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_GOTOXY,
      args0: [
        {
          type: "input_value",
          name: "X",
        },
        {
          type: "input_value",
          name: "Y",
        },
      ],
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      previousStatement: null,
      nextStatement: null,
      inputsInline: true, // 一行。false会折行。
    });
  },
};

// 指定时间内 滑行到指定项[鼠标指针|随机位置]
Blockly.Blocks["pro_motion_glideto_menu"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "TO",
          options: [
            [KidBlocks.Msg.PRO_MOTION_GLIDETO_POINTER, "_mouse_"],
            [KidBlocks.Msg.PRO_MOTION_GLIDETO_RANDOM, "_random_"],
          ],
        },
      ],
      output: "String", // 这个设置，表示该下拉选项输出String类型值
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
    });
  },
};

// 指定时间内 滑行到指定 XY
Blockly.Blocks["pro_motion_glidesecstoxy"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_GLIDESECSTOXY,
      args0: [
        {
          type: "input_value",
          name: "SECS",
        },
        {
          type: "input_value",
          name: "X",
        },
        {
          type: "input_value",
          name: "Y",
        },
      ],
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      previousStatement: null,
      nextStatement: null,
      inputsInline: true, // 一行。false会折行。
    });
  },
};

// 滑行到指定项[鼠标指针|随机位置]
Blockly.Blocks["pro_motion_glideto"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_GLIDETO,
      args0: [
        {
          type: "input_value",
          name: "SECS",
        },
        {
          type: "input_value",
          name: "TO",
        },
      ],
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      previousStatement: null,
      nextStatement: null,
      inputsInline: true, // 一行。false会折行。
    });
  },
};

// 将X坐标增加指定数值
Blockly.Blocks["pro_motion_changexby"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_CHANGEXBY,
      args0: [
        {
          type: "input_value",
          name: "DX",
        },
      ],
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

// 将X轴设置为指定数值
Blockly.Blocks["pro_motion_setx"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_SETX,
      args0: [
        {
          type: "input_value",
          name: "X",
        },
      ],
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

// 将Y坐标增加指定数值
Blockly.Blocks["pro_motion_changeyby"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_CHANGEYBY,
      args0: [
        {
          type: "input_value",
          name: "DY",
        },
      ],
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

// 将Y轴设置为指定数值
Blockly.Blocks["pro_motion_sety"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_SETY,
      args0: [
        {
          type: "input_value",
          name: "Y",
        },
      ],
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

// 碰到边界就反弹
Blockly.Blocks["pro_motion_ifonedgebounce"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_IFONEDGEBOUNCE,
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

// 将旋转方式设为[左右翻转|不可旋转|任意旋转]
Blockly.Blocks["pro_motion_setrotationstyle"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_SETROTATIONSTYLE,
      args0: [
        {
          type: "field_dropdown",
          name: "STYLE",
          options: [
            [KidBlocks.Msg.PRO_MOTION_SETROTATIONSTYLE_LEFTRIGHT, "left-right"],
            [
              KidBlocks.Msg.PRO_MOTION_SETROTATIONSTYLE_DONTROTATE,
              "don't rotate",
            ],
            [KidBlocks.Msg.PRO_MOTION_SETROTATIONSTYLE_ALLAROUND, "all around"],
          ],
        },
      ],
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

// checkbox X坐标
Blockly.Blocks["pro_motion_xposition"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_XPOSITION,
      checkboxInFlyout: true,
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      output: "Number",
    });
  },
};

// checkbox Y坐标
Blockly.Blocks["pro_motion_yposition"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_YPOSITION,
      checkboxInFlyout: true,
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      output: "Number",
    });
  },
};

// checkbox 方向
Blockly.Blocks["pro_motion_direction"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_MOTION_DIRECTION,
      checkboxInFlyout: true,
      colour: KidBlocks.Msg.PRO_MOTION_HUE,
      output: "Number",
    });
  },
};
