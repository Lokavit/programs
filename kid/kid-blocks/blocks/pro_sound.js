/*
 * @Author: Satya
 * @Date: 2020-11-14 15:32:10
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-22 17:53:41
 * doc: 少儿编程 之 声音类
 */
/** SOUND 声音 音效下拉菜单 */
Blockly.Blocks["pro_sound_sounds_menu"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "SOUND_MENU",
          options: [
            ["1", "0"],
            ["2", "1"],
            ["3", "2"],
            ["4", "3"],
            ["5", "4"],
            ["6", "5"],
            ["7", "6"],
            ["8", "7"],
            ["9", "8"],
            ["10", "9"],
            // [
            //   "call a function",
            //   function () {
            //     window.alert("function called!");
            //   },
            // ],
          ],
        },
      ],
      colour: KidBlocks.Msg.PRO_SOUND_HUE,
      output: "String",
    });
  },
};

/** SOUND 声音 播放声音 */
Blockly.Blocks["pro_sound_play"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SOUND_PLAY,
      args0: [
        {
          type: "input_value",
          name: "SOUND_MENU",
        },
      ],
      colour: KidBlocks.Msg.PRO_SOUND_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** SOUND 声音 播放声音直到完成 */
Blockly.Blocks["pro_sound_playuntildone"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SOUND_PLAYUNTILDONE,
      args0: [
        {
          type: "input_value",
          name: "SOUND_MENU",
        },
      ],
      colour: KidBlocks.Msg.PRO_SOUND_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** SOUND 声音 停止所有声音 */
Blockly.Blocks["pro_sound_stopallsounds"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SOUND_STOPALLSOUNDS,
      colour: KidBlocks.Msg.PRO_SOUND_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** SOUND 声音 将[]音效增加 指定值 */
Blockly.Blocks["pro_sound_changeeffectby"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SOUND_CHANGEEFFECTBY,
      args0: [
        {
          type: "field_dropdown",
          name: "EFFECT",
          options: [
            [KidBlocks.Msg.PRO_SOUND_EFFECTS_PITCH, "PITCH"],
            [KidBlocks.Msg.PRO_SOUND_EFFECTS_PAN, "PAN"],
          ],
        },
        {
          type: "input_value",
          name: "VALUE",
        },
      ],
      colour: KidBlocks.Msg.PRO_SOUND_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** SOUND 声音 将[]音效设为 指定值 */
Blockly.Blocks["pro_sound_seteffectto"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SOUND_SETEFFECTO,
      args0: [
        {
          type: "field_dropdown",
          name: "EFFECT",
          options: [
            [KidBlocks.Msg.PRO_SOUND_EFFECTS_PITCH, "PITCH"],
            [KidBlocks.Msg.PRO_SOUND_EFFECTS_PAN, "PAN"],
          ],
        },
        {
          type: "input_value",
          name: "VALUE",
        },
      ],
      colour: KidBlocks.Msg.PRO_SOUND_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** SOUND 声音 清除音效 */
Blockly.Blocks["pro_sound_cleareffects"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SOUND_CLEAREFFECTS,
      colour: KidBlocks.Msg.PRO_SOUND_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** SOUND 声音 将精灵的音量更改为某个值 */
Blockly.Blocks["pro_sound_changevolumeby"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SOUND_CHANGEVOLUMEBY,
      args0: [
        {
          type: "input_value",
          name: "VOLUME",
        },
      ],
      colour: KidBlocks.Msg.PRO_SOUND_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

/** SOUND 声音 以将精灵的音量设置为一定百分比 */
Blockly.Blocks["pro_sound_setvolumeto"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SOUND_SETVOLUMETO,
      args0: [
        {
          type: "input_value",
          name: "VOLUME",
        },
      ],
      colour: KidBlocks.Msg.PRO_SOUND_HUE,
      previousStatement: null,
      nextStatement: null,
    });
  },
};

// 音量
Blockly.Blocks["pro_sound_volume"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_SOUND_VOLUME,
      colour: KidBlocks.Msg.PRO_SOUND_HUE,
      checkboxInFlyout: true,
      output: "Number",
    });
  },
};
