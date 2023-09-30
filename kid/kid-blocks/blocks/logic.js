/*
 * @Author: Satya
 * @Date: 2020-11-14 15:03:34
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-14 15:04:23
 * doc:逻辑类
 */

/** Logic 布尔数据类型块 */
Blockly.Blocks["logic_boolean"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "BOOL",
          options: [
            [KidBlocks.Msg.LOGIC_BOOLEAN_TRUE, "TRUE"],
            [KidBlocks.Msg.LOGIC_BOOLEAN_FALSE, "FALSE"],
          ],
        },
      ],
      style: "logic_blocks",
      output: "Boolean",
      helpUrl: KidBlocks.Msg.LOGIC_BOOLEAN_TOOLTIP,
      tooltip: KidBlocks.Msg.LOGIC_BOOLEAN_HELPURL,
    });
  },
};

/** Logic if/elseif/else 条件 */
Blockly.Blocks["controls_if"] = {
  init: function () {
    this.jsonInit({
      message0: `${KidBlocks.Msg.CONTROLS_IF_MSG_IF} %1`,
      args0: [
        {
          type: "input_value",
          name: "IF0",
          check: "Boolean",
        },
      ],
      message1: `${KidBlocks.Msg.CONTROLS_IF_MSG_THEN} %1`,
      args1: [
        {
          type: "input_statement",
          name: "DO0",
        },
      ],
      style: "logic_blocks",
      previousStatement: null,
      nextStatement: null,
      mutator: "controls_if_mutator",
      extensions: ["controls_if_tooltip"],
      helpUrl: KidBlocks.Msg.CONTROLS_IF_HELPURL,
    });
  },
};

/** Logic 不使用mutator的if/else */
Blockly.Blocks["controls_ifelse"] = {
  init: function () {
    this.jsonInit({
      message0: `${KidBlocks.Msg.CONTROLS_IF_MSG_IF} %1`,
      args0: [
        {
          type: "input_value",
          name: "IF0",
          check: "Boolean",
        },
      ],
      message1: `${KidBlocks.Msg.CONTROLS_IF_MSG_THEN} %1`,
      args1: [
        {
          type: "input_statement",
          name: "DO0",
        },
      ],
      message2: `${KidBlocks.Msg.CONTROLS_IF_MSG_ELSE} %1`,
      args2: [
        {
          type: "input_statement",
          name: "ELSE",
        },
      ],
      style: "logic_blocks",
      previousStatement: null,
      nextStatement: null,
      tooltip: KidBlocks.Msg.CONTROLS_IF_TOOLTIP_2,
      helpUrl: KidBlocks.Msg.CONTROLS_IF_HELPURL,
      extensions: ["controls_if_tooltip"],
    });
  },
};

/** Logic 比较运算符块 */
Blockly.Blocks["logic_compare"] = {
  init: function () {
    this.jsonInit({
      message0: "%1 %2 %3",
      args0: [
        {
          type: "input_value",
          name: "A",
        },
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            ["=", "EQ"],
            ["\u2260", "NEQ"],
            ["\u200F<", "LT"],
            ["\u200F\u2264", "LTE"],
            ["\u200F>", "GT"],
            ["\u200F\u2265", "GTE"],
          ],
        },
        {
          type: "input_value",
          name: "B",
        },
      ],
      style: "logic_blocks",
      output: "Boolean",
      inputsInline: true,
      helpUrl: KidBlocks.Msg.LOGIC_COMPARE_HELPURL,
      extensions: ["logic_compare", "logic_op_tooltip"],
    });
  },
};

/** Logic 逻辑操作块: 'and', 'or' */
Blockly.Blocks["logic_operation"] = {
  init: function () {
    this.jsonInit({
      message0: "%1 %2 %3",
      args0: [
        {
          type: "input_value",
          name: "A",
          check: "Boolean",
        },
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            [KidBlocks.Msg.LOGIC_OPERATION_AND, "AND"],
            [KidBlocks.Msg.LOGIC_OPERATION_OR, "OR"],
          ],
        },
        {
          type: "input_value",
          name: "B",
          check: "Boolean",
        },
      ],
      style: "logic_blocks",
      output: "Boolean",
      inputsInline: true,
      helpUrl: KidBlocks.Msg.LOGIC_OPERATION_HELPURL,
      extensions: ["logic_op_tooltip"],
    });
  },
};

/** Logic 否定块 */
Blockly.Blocks["logic_negate"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.LOGIC_NEGATE_TITLE,
      args0: [
        {
          type: "input_value",
          name: "BOOL",
          check: "Boolean",
        },
      ],
      style: "logic_blocks",
      output: "Boolean",
      tooltip: KidBlocks.Msg.LOGIC_NEGATE_TOOLTIP,
      helpUrl: KidBlocks.Msg.LOGIC_NEGATE_HELPURL,
    });
  },
};

/** Logic 空数据类型块 */
Blockly.Blocks["logic_null"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.LOGIC_NULL,
      style: "logic_blocks",
      output: null,
      tooltip: KidBlocks.Msg.LOGIC_NULL_TOOLTIP,
      helpUrl: KidBlocks.Msg.LOGIC_NULL_HELPURL,
    });
  },
};

/** Logic 空数据类型块 */
Blockly.Blocks["logic_ternary"] = {
  init: function () {
    this.jsonInit({
      message0: `${KidBlocks.Msg.LOGIC_TERNARY_CONDITION} %1`,
      args0: [
        {
          type: "input_value",
          name: "IF",
          check: "Boolean",
        },
      ],
      message1: `${KidBlocks.Msg.LOGIC_TERNARY_IF_TRUE} %1`,
      args1: [
        {
          type: "input_value",
          name: "THEN",
        },
      ],
      message2: `${KidBlocks.Msg.LOGIC_TERNARY_IF_FALSE} %1`,
      args2: [
        {
          type: "input_value",
          name: "ELSE",
        },
      ],
      style: "logic_blocks",
      output: null,
      tooltip: KidBlocks.Msg.LOGIC_TERNARY_TOOLTIP,
      helpUrl: KidBlocks.Msg.LOGIC_TERNARY_HELPURL,
      extensions: ["logic_ternary"],
    });
  },
};

/** Logic 表示controls_if mutator中的if语句的块 */
Blockly.Blocks["controls_if_if"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.CONTROLS_IF_IF_TITLE_IF,
      style: "logic_blocks",
      nextStatement: null,
      enableContextMenu: false,
      tooltip: KidBlocks.Msg.CONTROLS_IF_IF_TOOLTIP,
    });
  },
};

/** Logic 表示controls_if mutator中的else-if语句的块 */
Blockly.Blocks["controls_if_elseif"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF,
      style: "logic_blocks",
      previousStatement: null,
      nextStatement: null,
      enableContextMenu: false,
      tooltip: KidBlocks.Msg.CONTROLS_IF_ELSEIF_TOOLTIP,
    });
  },
};

/** Logic 表示controls_if mutator中的else语句的块 */
Blockly.Blocks["controls_if_else"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.CONTROLS_IF_ELSE_TITLE_ELSE,
      style: "logic_blocks",
      previousStatement: null,
      enableContextMenu: false,
      tooltip: KidBlocks.Msg.CONTROLS_IF_ELSE_TOOLTIP,
    });
  },
};

// console.log(Blockly.Constants);
Blockly.Logic = {};
/** Logic
 * 工具提示文本，由块OP值键入。 由逻辑比较块和逻辑运算块使用
 */
Blockly.Logic.TOOLTIPS_BY_OP = {
  // 逻辑比较
  EQ: "%{BKY_LOGIC_COMPARE_TOOLTIP_EQ}",
  NEQ: "%{BKY_LOGIC_COMPARE_TOOLTIP_NEQ}",
  LT: "%{BKY_LOGIC_COMPARE_TOOLTIP_LT}",
  LTE: "%{BKY_LOGIC_COMPARE_TOOLTIP_LTE}",
  GT: "%{BKY_LOGIC_COMPARE_TOOLTIP_GT}",
  GTE: "%{BKY_LOGIC_COMPARE_TOOLTIP_GTE}",

  // 逻辑运算
  AND: "%{BKY_LOGIC_OPERATION_TOOLTIP_AND}",
  OR: "%{BKY_LOGIC_OPERATION_TOOLTIP_OR}",
};
// console.log("TOOLTIPS_BY_OP:", Blockly.Logic.TOOLTIPS_BY_OP);

/** Logic 在Blockly.Extensions里注册 */
Blockly.Extensions.register(
  "logic_op_tooltip",
  Blockly.Extensions.buildTooltipForDropdown("OP", Blockly.Logic.TOOLTIPS_BY_OP)
);

/**
 * 将mutator方法添加到controls_if块.
 * @augments Blockly.Block
 * @readonly
 */
Blockly.Logic.CONTROLS_IF_MUTATOR_MIXIN = {
  elseifCount_: 0,
  elseCount_: 0,

  /**
   * 不要自动将STATEMENT_PREFIX和STATEMENT_SUFFIX添加到生成的代码中。这些将在此块的生成器中手动处理.
   */
  suppressPrefixSuffix: true,

  /**
   * 创建XML以表示else-if和else输入的数量.
   * @return {Element} XML存储元素.
   * @this {Blockly.Block}
   */
  mutationToDom: function () {
    if (!this.elseifCount_ && !this.elseCount_) {
      return null;
    }
    var container = Blockly.utils.xml.createElement("mutation");
    if (this.elseifCount_) {
      container.setAttribute("elseif", this.elseifCount_);
    }
    if (this.elseCount_) {
      container.setAttribute("else", 1);
    }
    return container;
  },
  /**
   * 解析XML以还原else-if和else输入.
   * @param {!Element} xmlElement XML存储元素.
   * @this {Blockly.Block}
   */
  domToMutation: function (xmlElement) {
    this.elseifCount_ = parseInt(xmlElement.getAttribute("elseif"), 10) || 0;
    this.elseCount_ = parseInt(xmlElement.getAttribute("else"), 10) || 0;
    this.rebuildShape_();
  },
  /**
   * 使用此块的组件填充mutator的对话框.
   * @param {!Blockly.Workspace} workspace Mutator's 赋值函数的工作空间
   * @return {!Blockly.Block} Root block in mutator.
   * @this {Blockly.Block}
   */
  decompose: function (workspace) {
    var containerBlock = workspace.newBlock("controls_if_if");
    containerBlock.initSvg();
    var connection = containerBlock.nextConnection;
    for (var i = 1; i <= this.elseifCount_; i++) {
      var elseifBlock = workspace.newBlock("controls_if_elseif");
      elseifBlock.initSvg();
      connection.connect(elseifBlock.previousConnection);
      connection = elseifBlock.nextConnection;
    }
    if (this.elseCount_) {
      var elseBlock = workspace.newBlock("controls_if_else");
      elseBlock.initSvg();
      connection.connect(elseBlock.previousConnection);
    }
    return containerBlock;
  },
  /**
   * 根据mutator对话框的组件重新配置该块.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this {Blockly.Block}
   */
  compose: function (containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    // 计算输入数量.
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
    var valueConnections = [null];
    var statementConnections = [null];
    var elseStatementConnection = null;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case "controls_if_elseif":
          this.elseifCount_++;
          valueConnections.push(clauseBlock.valueConnection_);
          statementConnections.push(clauseBlock.statementConnection_);
          break;
        case "controls_if_else":
          this.elseCount_++;
          elseStatementConnection = clauseBlock.statementConnection_;
          break;
        default:
          throw TypeError("Unknown block type: " + clauseBlock.type);
      }
      clauseBlock =
        clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
    }
    this.updateShape_();
    // 重新连接所有子块.
    this.reconnectChildBlocks_(
      valueConnections,
      statementConnections,
      elseStatementConnection
    );
  },
  /**
   * 存储指向任何已连接子块的指针.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this {Blockly.Block}
   */
  saveConnections: function (containerBlock) {
    var clauseBlock = containerBlock.nextConnection.targetBlock();
    var i = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case "controls_if_elseif":
          var inputIf = this.getInput("IF" + i);
          var inputDo = this.getInput("DO" + i);
          clauseBlock.valueConnection_ =
            inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
            inputDo && inputDo.connection.targetConnection;
          i++;
          break;
        case "controls_if_else":
          var inputDo = this.getInput("ELSE");
          clauseBlock.statementConnection_ =
            inputDo && inputDo.connection.targetConnection;
          break;
        default:
          throw TypeError("Unknown block type: " + clauseBlock.type);
      }
      clauseBlock =
        clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * 重建带有所有子块的块.
   * @this {Blockly.Block}
   */
  rebuildShape_: function () {
    var valueConnections = [null];
    var statementConnections = [null];
    var elseStatementConnection = null;

    if (this.getInput("ELSE")) {
      elseStatementConnection = this.getInput("ELSE").connection
        .targetConnection;
    }
    var i = 1;
    while (this.getInput("IF" + i)) {
      var inputIf = this.getInput("IF" + i);
      var inputDo = this.getInput("DO" + i);
      valueConnections.push(inputIf.connection.targetConnection);
      statementConnections.push(inputDo.connection.targetConnection);
      i++;
    }
    this.updateShape_();
    this.reconnectChildBlocks_(
      valueConnections,
      statementConnections,
      elseStatementConnection
    );
  },
  /**
   * 修改此块以具有正确的输入数.
   * @this {Blockly.Block}
   * @private
   */
  updateShape_: function () {
    // 删除所有内容.
    if (this.getInput("ELSE")) {
      this.removeInput("ELSE");
    }
    var i = 1;
    while (this.getInput("IF" + i)) {
      this.removeInput("IF" + i);
      this.removeInput("DO" + i);
      i++;
    }
    // 重建块.
    for (i = 1; i <= this.elseifCount_; i++) {
      this.appendValueInput("IF" + i)
        .setCheck("Boolean")
        .appendField(KidBlocks.Msg.CONTROLS_IF_MSG_ELSEIF);
      this.appendStatementInput("DO" + i).appendField(
        KidBlocks.Msg.CONTROLS_IF_MSG_THEN
      );
    }
    if (this.elseCount_) {
      this.appendStatementInput("ELSE").appendField(
        KidBlocks.Msg.CONTROLS_IF_MSG_ELSE
      );
    }
  },
  /**
   * 重新连接子块.
   * @param {!Array.<?Blockly.RenderedConnection>} valueConnections 'if' 输入的值连接列表.
   * @param {!Array.<?Blockly.RenderedConnection>} statementConnections 'do'输入的语句连接列表.
   * @param {?Blockly.RenderedConnection} elseStatementConnection 其他输入的语句连接.
   * @this {Blockly.Block}
   */
  reconnectChildBlocks_: function (
    valueConnections,
    statementConnections,
    elseStatementConnection
  ) {
    for (var i = 1; i <= this.elseifCount_; i++) {
      Blockly.Mutator.reconnect(valueConnections[i], this, "IF" + i);
      Blockly.Mutator.reconnect(statementConnections[i], this, "DO" + i);
    }
    Blockly.Mutator.reconnect(elseStatementConnection, this, "ELSE");
  },
};

/** Logic 在Blockly.Extensions里注册 */
Blockly.Extensions.registerMutator(
  "controls_if_mutator",
  Blockly.Logic.CONTROLS_IF_MUTATOR_MIXIN,
  null,
  ["controls_if_elseif", "controls_if_else"]
);
/**
 * "controls_if"扩展功能. "controls_if"添加mutator,形状更新方法和动态工具提示.
 * @this {Blockly.Block}
 */
Blockly.Logic.CONTROLS_IF_TOOLTIP_EXTENSION = function () {
  this.setTooltip(
    function () {
      if (!this.elseifCount_ && !this.elseCount_) {
        return KidBlocks.Msg.CONTROLS_IF_TOOLTIP_1;
      } else if (!this.elseifCount_ && this.elseCount_) {
        return KidBlocks.Msg.CONTROLS_IF_TOOLTIP_2;
      } else if (this.elseifCount_ && !this.elseCount_) {
        return KidBlocks.Msg.CONTROLS_IF_TOOLTIP_3;
      } else if (this.elseifCount_ && this.elseCount_) {
        return KidBlocks.Msg.CONTROLS_IF_TOOLTIP_4;
      }
      return "";
    }.bind(this)
  );
};

/** Logic 在Blockly.Extensions里注册 */
Blockly.Extensions.register(
  "controls_if_tooltip",
  Blockly.Logic.CONTROLS_IF_TOOLTIP_EXTENSION
);

/**
 * 为logic_compare块的左侧和右侧添加动态类型验证.
 * @mixin
 * @augments Blockly.Block
 * @package
 * @readonly
 */
Blockly.Logic.LOGIC_COMPARE_ONCHANGE_MIXIN = {
  /**
   * 只要工作空间上的任何内容发生变化都将调用.防止比较不匹配的类型.
   * @param {!Blockly.Events.Abstract} e Change event.
   * @this {Blockly.Block}
   */
  onchange: function (e) {
    if (!this.prevBlocks_) {
      this.prevBlocks_ = [null, null];
    }

    var blockA = this.getInputTargetBlock("A");
    var blockB = this.getInputTargetBlock("B");
    // 如果不匹配，请断开此更改之前存在的块.
    if (
      blockA &&
      blockB &&
      !this.workspace.connectionChecker.doTypeChecks(
        blockA.outputConnection,
        blockB.outputConnection
      )
    ) {
      // 两个输入之间不匹配.恢复块连接,使新连接的块消失.
      Blockly.Events.setGroup(e.group);
      var prevA = this.prevBlocks_[0];
      if (prevA !== blockA) {
        blockA.unplug();
        if (prevA && !prevA.isDisposed() && !prevA.isShadow()) {
          // 阴影块在unplug（）期间自动替换.
          this.getInput("A").connection.connect(prevA.outputConnection);
        }
      }
      var prevB = this.prevBlocks_[1];
      if (prevB !== blockB) {
        blockB.unplug();
        if (prevB && !prevB.isDisposed() && !prevB.isShadow()) {
          // 阴影块在unplug（）期间自动替换.
          this.getInput("B").connection.connect(prevB.outputConnection);
        }
      }
      this.bumpNeighbours();
      Blockly.Events.setGroup(false);
    }
    this.prevBlocks_[0] = this.getInputTargetBlock("A");
    this.prevBlocks_[1] = this.getInputTargetBlock("B");
  },
};

/**
 * "logic_compare" extension function. 将类型左侧和右侧类型检查添加到"logic_compare" blocks.
 * @this {Blockly.Block}
 * @package
 * @readonly
 */
Blockly.Logic.LOGIC_COMPARE_EXTENSION = function () {
  // 添加onchange处理程序以确保类型兼容.
  this.mixin(Blockly.Logic.LOGIC_COMPARE_ONCHANGE_MIXIN);
};

/** Logic 在Blockly.Extensions里注册 */
Blockly.Extensions.register(
  "logic_compare",
  Blockly.Logic.LOGIC_COMPARE_EXTENSION
);

/**
 * 在输入和输出之间添加类型协调.
 * @mixin
 * @augments Blockly.Block
 * @package
 * @readonly
 */
Blockly.Logic.LOGIC_TERNARY_ONCHANGE_MIXIN = {
  prevParentConnection_: null,

  /**
   * 只要工作空间上的任何内容发生更改都调用.
   * @param {!Blockly.Events.Abstract} e Change event.
   * @this {Blockly.Block}
   */
  onchange: function (e) {
    var blockA = this.getInputTargetBlock("THEN");
    var blockB = this.getInputTargetBlock("ELSE");
    var parentConnection = this.outputConnection.targetConnection;
    // 如果不匹配，请断开此更改之前存在的块.
    if ((blockA || blockB) && parentConnection) {
      for (var i = 0; i < 2; i++) {
        var block = i == 1 ? blockA : blockB;
        if (
          block &&
          !block.workspace.connectionChecker.doTypeChecks(
            block.outputConnection,
            parentConnection
          )
        ) {
          // 确保所有断开连接都与引起事件分组.
          Blockly.Events.setGroup(e.group);
          if (parentConnection === this.prevParentConnection_) {
            this.unplug();
            parentConnection.getSourceBlock().bumpNeighbours();
          } else {
            block.unplug();
            block.bumpNeighbours();
          }
          Blockly.Events.setGroup(false);
        }
      }
    }
    this.prevParentConnection_ = parentConnection;
  },
};

/** Logic 在Blockly.Extensions里注册 */
Blockly.Extensions.registerMixin(
  "logic_ternary",
  Blockly.Logic.LOGIC_TERNARY_ONCHANGE_MIXIN
);
