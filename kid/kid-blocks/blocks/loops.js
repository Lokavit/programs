/*
 * @Author: Satya
 * @Date: 2020-11-14 15:04:46
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-14 15:06:35
 * doc:循环类
 */

/** Loops 为重复块n次(external number) */
Blockly.Blocks["controls_repeat_ext"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.CONTROLS_REPEAT_TITLE,
      args0: [
        {
          type: "input_value",
          name: "TIMES",
          check: "Number",
        },
      ],
      message1: `${KidBlocks.Msg.CONTROLS_REPEAT_INPUT_DO} %1`,
      args1: [
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      style: "loop_blocks",
      previousStatement: null,
      nextStatement: null,
      tooltip: KidBlocks.Msg.CONTROLS_REPEAT_TOOLTIP,
      helpUrl: KidBlocks.Msg.CONTROLS_REPEAT_HELPURL,
    });
  },
};

/** Loops 为重复块n次(internal number)
 * 首选'controls_repeat_ext'块，因为它更灵活
 */
Blockly.Blocks["controls_repeat"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.CONTROLS_REPEAT_TITLE,
      args0: [
        {
          type: "field_number",
          name: "TIMES",
          value: 10,
          min: 0,
          precision: 1,
        },
      ],
      message1: `${KidBlocks.Msg.CONTROLS_REPEAT_INPUT_DO} %1`,
      args1: [
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      style: "loop_blocks",
      previousStatement: null,
      nextStatement: null,
      tooltip: KidBlocks.Msg.CONTROLS_REPEAT_TOOLTIP,
      helpUrl: KidBlocks.Msg.CONTROLS_REPEAT_HELPURL,
    });
  },
};

/** Loops  'do while/until' 循环 */
Blockly.Blocks["controls_whileUntil"] = {
  init: function () {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "MODE",
          options: [
            [KidBlocks.Msg.CONTROLS_WHILEUNTIL_OPERATOR_WHILE, "WHILE"],
            [KidBlocks.Msg.CONTROLS_WHILEUNTIL_OPERATOR_UNTIL, "UNTIL"],
          ],
        },
        {
          type: "input_value",
          name: "BOOL",
          check: "Boolean",
        },
      ],
      message1: `${KidBlocks.Msg.CONTROLS_REPEAT_INPUT_DO} %1`,
      args1: [
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      style: "loop_blocks",
      previousStatement: null,
      nextStatement: null,
      helpUrl: KidBlocks.Msg.CONTROLS_WHILEUNTIL_HELPURL,
      extensions: ["controls_whileUntil_tooltip"],
    });
  },
};

/** Loops  'for' 循环 */
Blockly.Blocks["controls_for"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.CONTROLS_FOR_TITLE,
      args0: [
        {
          type: "field_variable",
          name: "VAR",
          variable: null,
        },
        {
          type: "input_value",
          name: "FROM",
          check: "Number",
          align: "RIGHT",
        },
        {
          type: "input_value",
          name: "TO",
          check: "Number",
          align: "RIGHT",
        },
        {
          type: "input_value",
          name: "BY",
          check: "Number",
          align: "RIGHT",
        },
      ],
      message1: `${KidBlocks.Msg.CONTROLS_REPEAT_INPUT_DO} %1`,
      args1: [
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      style: "loop_blocks",
      inputsInline: true,
      previousStatement: null,
      nextStatement: null,
      helpUrl: KidBlocks.Msg.CONTROLS_FOR_HELPURL,
      extensions: ["contextMenu_newGetVariableBlock", "controls_for_tooltip"],
    });
  },
};

/** Loops  'for each' 循环 */
Blockly.Blocks["controls_forEach"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.CONTROLS_FOREACH_TITLE,
      args0: [
        {
          type: "field_variable",
          name: "VAR",
          variable: null,
        },
        {
          type: "input_value",
          name: "LIST",
          check: "Array",
        },
      ],
      message1: `${KidBlocks.Msg.CONTROLS_REPEAT_INPUT_DO} %1`,
      args1: [
        {
          type: "input_statement",
          name: "DO",
        },
      ],
      style: "loop_blocks",
      previousStatement: null,
      nextStatement: null,
      helpUrl: KidBlocks.Msg.CONTROLS_FOREACH_HELPURL,
      extensions: [
        "contextMenu_newGetVariableBlock",
        "controls_forEach_tooltip",
      ],
    });
  },
};

/** Loops  流程语句块: continue, break */
Blockly.Blocks["controls_flow_statements"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "FLOW",
          options: [
            [KidBlocks.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK, "BREAK"],
            [
              KidBlocks.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE,
              "CONTINUE",
            ],
          ],
        },
      ],
      style: "loop_blocks",
      previousStatement: null,
      helpUrl: KidBlocks.Msg.CONTROLS_FLOW_STATEMENTS_HELPURL,
      extensions: ["controls_flow_tooltip", "controls_flow_in_loop_check"],
    });
  },
};

/** Loops */
Blockly.Loops = {};

/**
 * 'controls_whileUntil' 块的工具提示，以MODE值作为键.
 * @see {Blockly.Extensions#buildTooltipForDropdown}
 * @package
 * @readonly
 */
Blockly.Loops.WHILE_UNTIL_TOOLTIPS = {
  WHILE: "%{BKY_CONTROLS_WHILEUNTIL_TOOLTIP_WHILE}",
  UNTIL: "%{BKY_CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL}",
};

/**  */
Blockly.Extensions.register(
  "controls_whileUntil_tooltip",
  Blockly.Extensions.buildTooltipForDropdown(
    "MODE",
    Blockly.Loops.WHILE_UNTIL_TOOLTIPS
  )
);

/**
 * 'controls_flow_statements'块的工具提示，以FLOW值作为键.
 * @see {Blockly.Extensions#buildTooltipForDropdown}
 * @package
 * @readonly
 */
Blockly.Loops.BREAK_CONTINUE_TOOLTIPS = {
  BREAK: "%{BKY_CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK}",
  CONTINUE: "%{BKY_CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE}",
};

Blockly.Extensions.register(
  "controls_flow_tooltip",
  Blockly.Extensions.buildTooltipForDropdown(
    "FLOW",
    Blockly.Loops.BREAK_CONTINUE_TOOLTIPS
  )
);

/**
 * Mixin添加上下文菜单项以创建'variables_get'块.
 * 由'controls_for'和'controls_forEach'使用.
 * @mixin
 * @augments Blockly.Block
 * @package
 * @readonly
 */
Blockly.Loops.CUSTOM_CONTEXT_MENU_CREATE_VARIABLES_GET_MIXIN = {
  /**
   * 添加上下文菜单选项为循环的变量创建getter块.
   * (customContextMenu支持仅限于Web BlockSvg.)
   * @param {!Array} options 要添加到的菜单选项列表 .
   * @this {Blockly.Block}
   */
  customContextMenu: function (options) {
    if (this.isInFlyout) {
      return;
    }
    var variable = this.getField("VAR").getVariable();
    var varName = variable.name;
    if (!this.isCollapsed() && varName != null) {
      var option = { enabled: true };
      option.text = KidBlocks.Msg.VARIABLES_SET_CREATE_GET.replace(
        "%1",
        varName
      );
      var xmlField = Blockly.Variables.generateVariableFieldDom(variable);
      var xmlBlock = Blockly.utils.xml.createElement("block");
      xmlBlock.setAttribute("type", "variables_get");
      xmlBlock.appendChild(xmlField);
      option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
      options.push(option);
    }
  },
};

Blockly.Extensions.registerMixin(
  "contextMenu_newGetVariableBlock",
  Blockly.Loops.CUSTOM_CONTEXT_MENU_CREATE_VARIABLES_GET_MIXIN
);

Blockly.Extensions.register(
  "controls_for_tooltip",
  Blockly.Extensions.buildTooltipWithFieldText(
    "%{BKY_CONTROLS_FOR_TOOLTIP}",
    "VAR"
  )
);

Blockly.Extensions.register(
  "controls_forEach_tooltip",
  Blockly.Extensions.buildTooltipWithFieldText(
    "%{BKY_CONTROLS_FOREACH_TOOLTIP}",
    "VAR"
  )
);

/**
 * 此混入添加检查以确保循环中包含'controls_flow_statements'块。否则将警告添加到块中。
 * @mixin
 * @augments Blockly.Block
 * @package
 * @readonly
 */
Blockly.Loops.CONTROL_FLOW_IN_LOOP_CHECK_MIXIN = {
  /**
   * 循环的块类型列表，因此不需要警告.
   * 要添加新的循环类型，请将其添加到您的代码中:
   * Blockly.Loops.CONTROL_FLOW_IN_LOOP_CHECK_MIXIN.LOOP_TYPES.push('custom_loop');
   */
  LOOP_TYPES: [
    "controls_repeat",
    "controls_repeat_ext",
    "controls_forEach",
    "controls_for",
    "controls_whileUntil",
  ],

  /**
   * 不要自动将STATEMENT_PREFIX和STATEMENT_SUFFIX添加到生成的代码中.这些将在此块的生成器中手动处理.
   */
  suppressPrefixSuffix: true,

  /**
   * 给定的块是否被循环包围（在任何级别上）?
   * @param {!Blockly.Block} block 当前块.
   * @return {Blockly.Block} 最近的环绕循环；如果没有，则为null.
   */
  getSurroundLoop: function (block) {
    // 块是否嵌套在循环中?
    do {
      if (
        Blockly.Loops.CONTROL_FLOW_IN_LOOP_CHECK_MIXIN.LOOP_TYPES.indexOf(
          block.type
        ) != -1
      ) {
        return block;
      }
      block = block.getSurroundParent();
    } while (block);
    return null;
  },

  /**
   * 只要工作空间上的任何内容发生更改都调用.
   * 如果此流程块未嵌套在循环中，则添加警告.
   * @param {!Blockly.Events.Abstract} e 变更事件.
   * @this {Blockly.Block}
   */
  onchange: function (e) {
    // 如果不更改状态:
    //   * 这是拖累的开始.
    //   * 这不是移动事件.
    //   * 或移动块不是此块.
    if (
      !this.workspace.isDragging ||
      this.workspace.isDragging() ||
      e.type != Blockly.Events.BLOCK_MOVE ||
      e.blockId != this.id
    ) {
      return;
    }
    var enabled = Blockly.Loops.CONTROL_FLOW_IN_LOOP_CHECK_MIXIN.getSurroundLoop(
      this
    );
    this.setWarningText(
      enabled ? null : KidBlocks.Msg.CONTROLS_FLOW_STATEMENTS_WARNING
    );
    if (!this.isInFlyout) {
      var group = Blockly.Events.getGroup();
      // 使其移动和禁用事件一起撤消.
      Blockly.Events.setGroup(e.group);
      this.setEnabled(enabled);
      Blockly.Events.setGroup(group);
    }
  },
};

Blockly.Extensions.registerMixin(
  "controls_flow_in_loop_check",
  Blockly.Loops.CONTROL_FLOW_IN_LOOP_CHECK_MIXIN
);
