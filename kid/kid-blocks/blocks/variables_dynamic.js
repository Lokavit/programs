/*
 * @Author: Satya
 * @Date: 2020-11-14 15:01:57
 * @Last Modified by:   Satya
 * @Last Modified time: 2020-11-14 15:01:57
 * doc:
 */

/** VariablesDynamic 变量获取器 */
Blockly.Blocks["variables_get_dynamic"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_variable",
          name: "VAR",
          variable: KidBlocks.Msg.VARIABLES_DEFAULT_NAME,
        },
      ],
      style: "variable_dynamic_blocks",
      output: null,
      helpUrl: KidBlocks.Msg.VARIABLES_GET_HELPURL,
      tooltip: KidBlocks.Msg.VARIABLES_GET_TOOLTIP,
      extensions: ["contextMenu_variableDynamicSetterGetter"],
    });
  },
};

/** VariablesDynamic 变量设置器 */
Blockly.Blocks["variables_set_dynamic"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.VARIABLES_SET,
      args0: [
        {
          type: "field_variable",
          name: "VAR",
          variable: KidBlocks.Msg.VARIABLES_DEFAULT_NAME,
        },
        {
          type: "input_value",
          name: "VALUE",
        },
      ],
      style: "variable_dynamic_blocks",
      previousStatement: null,
      nextStatement: null,
      tooltip: KidBlocks.Msg.VARIABLES_SET_TOOLTIP,
      helpUrl: KidBlocks.Msg.VARIABLES_SET_HELPURL,
      extensions: ["contextMenu_variableDynamicSetterGetter"],
    });
  },
};

/**
   * Mixin添加上下文菜单项以为此setter / getter创建getter / setter块。
    由块'variables_set_dynamic'和'variables_get_dynamic'使用.
   * @mixin
   * @augments Blockly.Block
   * @package
   * @readonly
   */
Blockly.VariablesDynamic.CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN = {
  /**
   * 添加菜单选项以为此设置器/获取器创建获取器/设置器块.
   * @param {!Array} options 要添加到的菜单选项列表.
   * @this {Blockly.Block}
   */
  customContextMenu: function (options) {
    // Getter块可以选择创建一个setter块，反之亦然.
    if (!this.isInFlyout) {
      var opposite_type;
      var contextMenuMsg;
      var id = this.getFieldValue("VAR");
      var variableModel = this.workspace.getVariableById(id);
      var varType = variableModel.type;
      if (this.type == "variables_get_dynamic") {
        opposite_type = "variables_set_dynamic";
        contextMenuMsg = KidBlocks.Msg.VARIABLES_GET_CREATE_SET;
      } else {
        opposite_type = "variables_get_dynamic";
        contextMenuMsg = KidBlocks.Msg.VARIABLES_SET_CREATE_GET;
      }

      var option = { enabled: this.workspace.remainingCapacity() > 0 };
      var name = this.getField("VAR").getText();
      option.text = contextMenuMsg.replace("%1", name);
      var xmlField = Blockly.utils.xml.createElement("field");
      xmlField.setAttribute("name", "VAR");
      xmlField.setAttribute("variabletype", varType);
      xmlField.appendChild(Blockly.utils.xml.createTextNode(name));
      var xmlBlock = Blockly.utils.xml.createElement("block");
      xmlBlock.setAttribute("type", opposite_type);
      xmlBlock.appendChild(xmlField);
      option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
      options.push(option);
    } else {
      if (
        this.type == "variables_get_dynamic" ||
        this.type == "variables_get_reporter_dynamic"
      ) {
        var renameOption = {
          text: KidBlocks.Msg.RENAME_VARIABLE,
          enabled: true,
          callback: Blockly.Variables.RENAME_OPTION_CALLBACK_FACTORY(this),
        };
        var name = this.getField("VAR").getText();
        var deleteOption = {
          text: KidBlocks.Msg.DELETE_VARIABLE.replace("%1", name),
          enabled: true,
          callback: Blockly.Variables.DELETE_OPTION_CALLBACK_FACTORY(this),
        };
        options.unshift(renameOption);
        options.unshift(deleteOption);
      }
    }
  },
  /**
   * 只要工作空间上的任何内容发生变化都将调用.设置此块的连接类型.
   * @param {!Blockly.Events.Abstract} _e Change event.
   * @this {Blockly.Block}
   */
  onchange: function (_e) {
    var id = this.getFieldValue("VAR");
    var variableModel = Blockly.Variables.getVariable(this.workspace, id);
    if (this.type == "variables_get_dynamic") {
      this.outputConnection.setCheck(variableModel.type);
    } else {
      this.getInput("VALUE").connection.setCheck(variableModel.type);
    }
  },
};

/**
 * 与变量getter块关联的重命名变量下拉菜单选项的回调.
 * @param {!Blockly.Block} block 具有要重命名的变量的块.
 * @return {!function()} A function that renames the variable.
 */
Blockly.VariablesDynamic.RENAME_OPTION_CALLBACK_FACTORY = function (block) {
  return function () {
    var workspace = block.workspace;
    var variable = block.getField("VAR").getVariable();
    Blockly.Variables.renameVariable(workspace, variable);
  };
};

/**
 * 与变量getter块关联的删除变量下拉菜单选项的回调.
 * @param {!Blockly.Block} block The block with the variable to delete.
 * @return {!function()} A function that deletes the variable.
 */
Blockly.VariablesDynamic.DELETE_OPTION_CALLBACK_FACTORY = function (block) {
  return function () {
    var workspace = block.workspace;
    var variable = block.getField("VAR").getVariable();
    workspace.deleteVariableById(variable.getId());
    workspace.refreshToolboxSelection();
  };
};

Blockly.Extensions.registerMixin(
  "contextMenu_variableDynamicSetterGetter",
  Blockly.VariablesDynamic.CUSTOM_CONTEXT_MENU_VARIABLE_GETTER_SETTER_MIXIN
);
