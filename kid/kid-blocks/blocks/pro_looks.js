/*
 * @Author: Satya
 * @Date: 2020-11-14 15:30:58
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-22 17:44:06
 * doc: 少儿编程 之 外观类
 */
Blockly.Blocks["pro_looks_show"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_SHOW,
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观  */
Blockly.Blocks["pro_looks_hide"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_HIDE,
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观  */
Blockly.Blocks["pro_looks_sayforsecs"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_SAYFORSECS,
      args0: [
        {
          type: "input_value",
          name: "MESSAGE",
        },
        {
          type: "input_value",
          name: "SECS",
        },
      ],
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观  */
Blockly.Blocks["pro_looks_say"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_SAY,
      args0: [
        {
          type: "input_value",
          name: "MESSAGE",
        },
      ],
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观  */
Blockly.Blocks["pro_looks_thinkforsecs"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_THINKFORSECS,
      args0: [
        {
          type: "input_value",
          name: "MESSAGE",
        },
        {
          type: "input_value",
          name: "SECS",
        },
      ],
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观  */
Blockly.Blocks["pro_looks_think"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_THINK,
      args0: [
        {
          type: "input_value",
          name: "MESSAGE",
        },
      ],
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观 换造型 */
Blockly.Blocks["pro_looks_costume"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "COSTUME",
          options: [
            ["造型1", "COSTUME1"],
            ["造型2", "COSTUME2"],
          ],
        },
      ],
      output: "String",
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
    });
  },
};

/** Looks 外观 块将精灵的Costumes 造型切换为选定的Costumes 造型. */
Blockly.Blocks["pro_looks_switchcostumeto"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_SWITCHCOSTUMETO,
      args0: [
        {
          type: "input_value",
          name: "COSTUME",
        },
      ],
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观 将精灵的造型切换到下一个 */
Blockly.Blocks["pro_looks_nextcostume"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_NEXTCOSTUME,
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观 背景列表 */
Blockly.Blocks["pro_looks_backdrops"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "BACKDROP",
          options: [["backdrop1", "BACKDROP1"]],
        },
      ],
      output: "String",
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
    });
  },
};

/** Looks 外观 将背景切换到选定的背景 */
Blockly.Blocks["pro_looks_switchbackdropto"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_SWITCHBACKDROPTO,
      args0: [
        {
          type: "input_value",
          name: "BACKDROP",
        },
      ],
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观 将背景切换到所选背景并等待 */
Blockly.Blocks["pro_looks_switchbackdroptoandwait"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_SWITCHBACKDROPTOANDWAIT,
      args0: [
        {
          type: "input_value",
          name: "BACKDROP",
        },
      ],
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观 将背景切换到下一个 */
Blockly.Blocks["pro_looks_nextbackdrop"] = {
  /**
   * 将背景切换到下一个.
   * @this Blockly.Block
   */
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_NEXTBACKDROP_BLOCK,
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观 将大小增加 */
Blockly.Blocks["pro_looks_changesizeby"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_CHANGESIZEBY,
      args0: [
        {
          type: "input_value",
          name: "CHANGE",
        },
      ],
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观 将大小设置 */
Blockly.Blocks["pro_looks_setsizeto"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_SETSIZETO,
      args0: [
        {
          type: "input_value",
          name: "SIZE",
        },
      ],
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观 改变层级 */
Blockly.Blocks["pro_looks_gotofrontback"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_GOTOFRONTBACK,
      args0: [
        {
          type: "field_dropdown",
          name: "FRONT_BACK",
          options: [
            [KidBlocks.Msg.PRO_LOOKS_GOTOFRONTBACK_FRONT, "front"],
            [KidBlocks.Msg.PRO_LOOKS_GOTOFRONTBACK_BACK, "back"],
          ],
        },
      ],
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观 改变层级 以指定方式移到指定层 */
Blockly.Blocks["pro_looks_goforwardbackwardlayers"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_GOFORWARDBACKWARDLAYERS,
      args0: [
        {
          type: "field_dropdown",
          name: "FORWARD_BACKWARD",
          options: [
            [
              KidBlocks.Msg.PRO_LOOKS_GOFORWARDBACKWARDLAYERS_FORWARD,
              "forward",
            ],
            [
              KidBlocks.Msg.PRO_LOOKS_GOFORWARDBACKWARDLAYERS_BACKWARD,
              "backward",
            ],
          ],
        },
        {
          type: "input_value",
          name: "NUM",
        },
      ],
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观 更改图像效果 将[]特效增加指定值 */
Blockly.Blocks["pro_looks_changeeffectby"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_CHANGEEFFECTBY,
      args0: [
        {
          type: "field_dropdown",
          name: "EFFECT",
          options: [
            [KidBlocks.Msg.PRO_LOOKS_EFFECT_COLOR, "COLOR"],
            [KidBlocks.Msg.PRO_LOOKS_EFFECT_FISHEYE, "FISHEYE"],
            [KidBlocks.Msg.PRO_LOOKS_EFFECT_WHIRL, "WHIRL"],
            [KidBlocks.Msg.PRO_LOOKS_EFFECT_PIXELATE, "PIXELATE"],
            [KidBlocks.Msg.PRO_LOOKS_EFFECT_MOSAIC, "MOSAIC"],
            [KidBlocks.Msg.PRO_LOOKS_EFFECT_BRIGHTNESS, "BRIGHTNESS"],
            [KidBlocks.Msg.PRO_LOOKS_EFFECT_GHOST, "GHOST"],
          ],
        },
        {
          type: "input_value",
          name: "CHANGE",
        },
      ],
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Looks 外观 更改图像效果 将[]特效设定为指定值 */
Blockly.Blocks["pro_looks_seteffectto"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_SETEFFECTTO,
      args0: [
        {
          type: "field_dropdown",
          name: "EFFECT",
          options: [
            [KidBlocks.Msg.PRO_LOOKS_EFFECT_COLOR, "COLOR"],
            [KidBlocks.Msg.PRO_LOOKS_EFFECT_FISHEYE, "FISHEYE"],
            [KidBlocks.Msg.PRO_LOOKS_EFFECT_WHIRL, "WHIRL"],
            [KidBlocks.Msg.PRO_LOOKS_EFFECT_PIXELATE, "PIXELATE"],
            [KidBlocks.Msg.PRO_LOOKS_EFFECT_MOSAIC, "MOSAIC"],
            [KidBlocks.Msg.PRO_LOOKS_EFFECT_BRIGHTNESS, "BRIGHTNESS"],
            [KidBlocks.Msg.PRO_LOOKS_EFFECT_GHOST, "GHOST"],
          ],
        },
        {
          type: "input_value",
          name: "VALUE",
        },
      ],
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};
/** Looks 外观 清除图像效果 */
Blockly.Blocks["pro_looks_cleargraphiceffects"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_CLEARGRAPHICEFFECTS,
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

Blockly.Blocks["pro_looks_size"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_SIZE,
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      checkboxInFlyout: true,
      output: "Number",
    });
  },
};

Blockly.Blocks["pro_looks_costumenumbername"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_COSTUMENUMBERNAME,
      args0: [
        {
          type: "field_dropdown",
          name: "NUMBER_NAME",
          options: [
            [KidBlocks.Msg.PRO_LOOKS_NUMBERNAME_NUMBER, "number"],
            [KidBlocks.Msg.PRO_LOOKS_NUMBERNAME_NAME, "name"],
          ],
        },
      ],
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      checkboxInFlyout: true,
      output: "Number",
    });
  },
};

Blockly.Blocks["pro_looks_backdropnumbername"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_LOOKS_BACKDROPNUMBERNAME,
      args0: [
        {
          type: "field_dropdown",
          name: "NUMBER_NAME",
          options: [
            [KidBlocks.Msg.PRO_LOOKS_NUMBERNAME_NUMBER, "number"],
            [KidBlocks.Msg.PRO_LOOKS_NUMBERNAME_NAME, "name"],
          ],
        },
      ],
      colour: KidBlocks.Msg.PRO_LOOKS_HUE,
      checkboxInFlyout: true,
      output: "Number",
    });
  },
};
