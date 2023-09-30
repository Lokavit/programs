/*
 * @Author: Satya
 * @Date: 2020-11-14 15:38:21
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-14 15:38:59
 * doc: 少儿编程 之 控制类
 */

/** Control 控制 等待条件变为真 */
Blockly.Blocks["pro_control_wait_until"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_CONTROL_WAITUNTIL,
      args0: [
        {
          type: "input_value",
          name: "CONDITION",
          check: "Boolean",
        },
      ],
      colour: KidBlocks.Msg.PRO_CONTROL_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Control 控制 等待（暂停）堆栈 */
Blockly.Blocks["pro_control_wait"] = {
  init: function () {
    this.jsonInit({
      id: "control_wait",
      message0: KidBlocks.Msg.PRO_CONTROL_WAIT,
      args0: [
        {
          type: "input_value",
          name: "DURATION",
        },
      ],
      colour: KidBlocks.Msg.PRO_CONTROL_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Control 控制 重复执行 */
Blockly.Blocks["pro_control_forever"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_CONTROL_FOREVER,
      message1: "%1", // Statement
      message2: "%1", // Icon
      lastDummyAlign2: "RIGHT",
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      args2: [
        {
          type: "field_image",
          src: `${Blockly.MEDIA_PATH}repeat.svg`,
          width: 24,
          height: 24,
          alt: "*",
          flip_rtl: true,
        },
      ],
      colour: KidBlocks.Msg.PRO_CONTROL_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Control 控制 重复n次 */
Blockly.Blocks["pro_control_repeat"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_CONTROL_REPEAT,
      message1: "%1", // Statement
      message2: "%1", // Icon
      lastDummyAlign2: "RIGHT",
      args0: [
        {
          type: "input_value",
          name: "TIMES",
        },
      ],
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      args2: [
        {
          type: "field_image",
          src: `${Blockly.MEDIA_PATH}repeat.svg`,
          width: 24,
          height: 24,
          alt: "*",
          flip_rtl: true,
        },
      ],
      colour: KidBlocks.Msg.PRO_CONTROL_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Control 控制 重复直到条件变为真 */
Blockly.Blocks["pro_control_repeat_until"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_CONTROL_REPEATUNTIL,
      message1: "%1",
      message2: "%1",
      lastDummyAlign2: "RIGHT",
      args0: [
        {
          type: "input_value",
          name: "CONDITION",
          check: "Boolean",
        },
      ],
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      args2: [
        {
          type: "field_image",
          src: `${Blockly.MEDIA_PATH}repeat.svg`,
          width: 24,
          height: 24,
          alt: "*",
          flip_rtl: true,
        },
      ],
      colour: KidBlocks.Msg.PRO_CONTROL_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Control 控制 如果[]那么 */
Blockly.Blocks["pro_control_if"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_CONTROL_IF,
      message1: "%1", // Statement
      args0: [
        {
          type: "input_value",
          name: "CONDITION",
          check: "Boolean",
        },
      ],
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      colour: KidBlocks.Msg.PRO_CONTROL_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Control 控制 如果[]那么 */
Blockly.Blocks["pro_control_if_else"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_CONTROL_IF,
      message1: "%1",
      message2: KidBlocks.Msg.PRO_CONTROL_ELSE,
      message3: "%1",
      args0: [
        {
          type: "input_value",
          name: "CONDITION",
          check: "Boolean",
        },
      ],
      args1: [
        {
          type: "input_statement",
          name: "SUBSTACK",
        },
      ],
      args3: [
        {
          type: "input_statement",
          name: "SUBSTACK2",
        },
      ],
      colour: KidBlocks.Msg.PRO_CONTROL_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Control 控制 当作为克隆体启动时 */
Blockly.Blocks["pro_control_start_as_clone"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_CONTROL_STARTASCLONE,
      args0: [],
      colour: KidBlocks.Msg.PRO_CONTROL_HUE,
      nextStatement: null,
    });
  },
};

/** Control 控制 克隆[下拉选项] */
Blockly.Blocks["pro_control_create_clone_of_menu"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "CLONE_OPTION",
          options: [
            [KidBlocks.Msg.PRO_CONTROL_CREATECLONEOF_MYSELF, "_myself_"],
          ],
        },
      ],
      output: "String",
      colour: KidBlocks.Msg.PRO_CONTROL_HUE,
    });
  },
};

/** Control 控制 克隆[] */
Blockly.Blocks["pro_control_create_clone_of"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_CONTROL_CREATECLONEOF,
      args0: [
        {
          type: "input_value",
          name: "CLONE_OPTION",
        },
      ],
      colour: KidBlocks.Msg.PRO_CONTROL_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** Control 控制 删除克隆体 */
Blockly.Blocks["pro_control_delete_this_clone"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_CONTROL_DELETETHISCLONE,
      args0: [],
      colour: KidBlocks.Msg.PRO_CONTROL_HUE,
      previousStatement: null,
    });
  },
};
