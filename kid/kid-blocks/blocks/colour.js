/*
 * @Author: Satya
 * @Date: 2020-11-14 15:02:39
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-22 18:40:34
 * doc: 颜色类积木块
 */

/** Colour 颜色选择器 */
Blockly.Blocks["colour_picker"] = {
  init: function () {
    this.jsonInit({
      type: "colour_picker",
      message0: "%1",
      args0: [
        {
          type: "field_colour",
          name: "COLOUR",
          colour: KidBlocks.utils.colour.randomColour(),
        },
      ],
      //   colour: KidBlocks.Msg.COLOUR_HUE"],
      style: "colour_blocks",
      output: "Colour", // 输出类型:颜色值
      helpUrl: KidBlocks.Msg.COLOUR_PICKER_HELPURL,
      tooltip: KidBlocks.Msg.COLOUR_PICKER_TOOLTIP,
      extensions: ["parent_tooltip_when_inline"],
    });
  },
};

/** Colour 颜色选择器 */
Blockly.Blocks["colour_random"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.COLOUR_RANDOM_TITLE,
      style: "colour_blocks",
      output: "Colour",
      extensions: ["parent_tooltip_when_inline"],
      helpUrl: KidBlocks.Msg.COLOUR_RANDOM_HELPURL,
      tooltip: KidBlocks.Msg.COLOUR_RANDOM_TOOLTIP,
    });
  },
};

/** Colour RGB颜色值设置 */
Blockly.Blocks["colour_rgb"] = {
  init: function () {
    this.jsonInit({
      message0: `${KidBlocks.Msg.COLOUR_RGB_TITLE} ${KidBlocks.Msg.COLOUR_RGB_RED} %1 ${KidBlocks.Msg.COLOUR_RGB_GREEN} %2 ${KidBlocks.Msg.COLOUR_RGB_BLUE} %3`,
      args0: [
        {
          type: "input_value",
          name: "RED",
          check: "Number", // 类型检查:数值类型
        },
        {
          type: "input_value",
          name: "GREEN",
          check: "Number",
        },
        {
          type: "input_value",
          name: "BLUE",
          check: "Number",
        },
      ],
      style: "colour_blocks",
      output: "Colour",
      inputsInline: true, // 一行。false会折行。
      helpUrl: KidBlocks.Msg.COLOUR_RGB_HELPURL,
      tooltip: KidBlocks.Msg.COLOUR_RGB_TOOLTIP,
    });
  },
};

/** Colour RGB颜色值设置 */
Blockly.Blocks["colour_blend"] = {
  init: function () {
    this.jsonInit({
      message0: `${KidBlocks.Msg.COLOUR_BLEND_TITLE} ${KidBlocks.Msg.COLOUR_BLEND_COLOUR1} %1 ${KidBlocks.Msg.COLOUR_BLEND_COLOUR2} %2 ${KidBlocks.Msg.COLOUR_BLEND_RATIO} %3`,
      args0: [
        {
          type: "input_value",
          name: "COLOUR1",
          check: "Colour", // 类型检查:颜色类型
        },
        {
          type: "input_value",
          name: "COLOUR2",
          check: "Colour",
        },
        {
          type: "input_value",
          name: "RATIO",
          check: "Number",
        },
      ],
      style: "colour_blocks",
      output: "Colour",
      inputsInline: true, // 一行。false会折行。
      helpUrl: KidBlocks.Msg.COLOUR_BLEND_HELPURL,
      tooltip: KidBlocks.Msg.COLOUR_BLEND_TOOLTIP,
    });
  },
};
