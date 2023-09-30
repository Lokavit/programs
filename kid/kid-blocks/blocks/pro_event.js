/*
 * @Author: Satya
 * @Date: 2020-11-14 15:32:56
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-14 15:33:17
 * doc: 少儿编程 之 事件类
 */
/** EVENT 事件 绿旗 */
Blockly.Blocks["pro_event_whenflagclicked"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_EVENT_WHENFLAGCLICKED,
      args0: [
        {
          type: "field_image",
          src: `${Blockly.MEDIA_PATH}green-flag.svg`,
          width: 24,
          height: 24,
          alt: "flag",
        },
      ],
      colour: KidBlocks.Msg.PRO_EVENT_HUE,
      nextStatement: null,
    });
  },
};

/** EVENT 事件 单击此精灵时 */
Blockly.Blocks["pro_event_whenthisspriteclicked"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_EVENT_WHENTHISSPRITECLICKED,
      colour: KidBlocks.Msg.PRO_EVENT_HUE,
      nextStatement: null,
    });
  },
};

/** EVENT 事件 点击舞台时 */
Blockly.Blocks["pro_event_whenstageclicked"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_EVENT_WHENSTAGECLICKED,
      colour: KidBlocks.Msg.PRO_EVENT_HUE,
      nextStatement: null,
    });
  },
};

/** EVENT 事件 发送广播 */
Blockly.Blocks["pro_event_whenkeypressed"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_EVENT_WHENKEYPRESSED,
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
      colour: KidBlocks.Msg.PRO_EVENT_HUE,
      nextStatement: null,
    });
  },
};

/** EVENT 事件 当前背景切换到所选背景 */
Blockly.Blocks["pro_event_whenbackdropswitchesto"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_EVENT_WHENBACKDROPSWITCHESTO,
      args0: [
        {
          type: "field_dropdown",
          name: "BACKDROP",
          options: [["backdrop1", "BACKDROP1"]],
        },
      ],
      colour: KidBlocks.Msg.PRO_EVENT_HUE,
      nextStatement: null,
    });
  },
};

/** EVENT 事件 当响度/定时器/视频运动大于该值时 */
Blockly.Blocks["pro_event_whengreaterthan"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_EVENT_WHENGREATERTHAN,
      args0: [
        {
          type: "field_dropdown",
          name: "WHENGREATERTHANMENU",
          options: [
            [KidBlocks.Msg.PRO_EVENT_WHENGREATERTHAN_TIMER, "TIMER"],
            [KidBlocks.Msg.PRO_EVENT_WHENGREATERTHAN_LOUDNESS, "LOUDNESS"],
          ],
        },
        {
          type: "input_value",
          name: "VALUE",
        },
      ],
      colour: KidBlocks.Msg.PRO_EVENT_HUE,
      nextStatement: null,
    });
  },
};

/** EVENT 事件 接收广播时 */
Blockly.Blocks["pro_event_whenbroadcastreceived"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_EVENT_WHENBROADCASTRECEIVED,
      args0: [
        {
          type: "field_variable",
          name: "BROADCAST_OPTION",
          // variableTypes: [Blockly.BROADCAST_MESSAGE_VARIABLE_TYPE],
          variable: KidBlocks.Msg.DEFAULT_BROADCAST_MESSAGE_NAME,
        },
      ],
      colour: KidBlocks.Msg.PRO_EVENT_HUE,
      nextStatement: null,
    });
  },
};

/** EVENT 事件 广播下拉菜单 */
Blockly.Blocks["pro_event_broadcast_menu"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_variable",
          name: "BROADCAST_OPTION",
          // variableTypes: [Blockly.BROADCAST_MESSAGE_VARIABLE_TYPE],
          variable: KidBlocks.Msg.DEFAULT_BROADCAST_MESSAGE_NAME,
        },
      ],
      colour: KidBlocks.Msg.PRO_EVENT_HUE,
      output: "String",
    });
  },
};

/** EVENT 事件 发送广播 */
Blockly.Blocks["pro_event_broadcast"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_EVENT_BROADCAST,
      args0: [
        {
          type: "input_value",
          name: "BROADCAST_INPUT",
        },
      ],
      colour: KidBlocks.Msg.PRO_EVENT_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** EVENT 事件 发送广播 并等待 */
Blockly.Blocks["pro_event_broadcastandwait"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_EVENT_BROADCASTANDWAIT,
      args0: [
        {
          type: "input_value",
          name: "BROADCAST_INPUT",
        },
      ],
      colour: KidBlocks.Msg.PRO_EVENT_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};
