/*
 * @Author: Satya
 * @Date: 2020-08-19 10:58:40
 * @Last Modified by: Satya
 * @Last Modified time: 2020-08-19 14:26:38
 * doc:自定义积木块
 */

Blockly.Blocks["say"] = {
  init: function () {
    this.appendDummyInput()
      .appendField("say")
      .appendField(new Blockly.FieldTextInput("hello"), "say_content");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
    this.setTooltip("");
    this.setHelpUrl("");
  },
};
