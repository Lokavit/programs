/*
 * @Author: Satya
 * @Date: 2020-11-14 15:09:05
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-14 15:09:49
 * doc: 列表
 */

/** Lists 创建空列表的块 首选'list_create_with'块，因为更灵活 */
Blockly.Blocks["lists_create_empty"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.LISTS_CREATE_EMPTY_TITLE,
      style: "list_blocks",
      output: "Array",
      tooltip: KidBlocks.Msg.LISTS_CREATE_EMPTY_TOOLTIP,
      helpUrl: KidBlocks.Msg.LISTS_CREATE_EMPTY_HELPURL,
    });
  },
};

/** Lists 用于重复创建一个元素的列表的块 */
Blockly.Blocks["lists_repeat"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.LISTS_REPEAT_TITLE,
      args0: [
        {
          type: "input_value",
          name: "ITEM",
        },
        {
          type: "input_value",
          name: "NUM",
          check: "Number",
        },
      ],
      style: "list_blocks",
      output: "Array",
      tooltip: KidBlocks.Msg.LISTS_REPEAT_TOOLTIP,
      helpUrl: KidBlocks.Msg.LISTS_REPEAT_HELPURL,
    });
  },
};

/** Lists 用于重复创建一个元素的列表的块 */
Blockly.Blocks["lists_reverse"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.LISTS_REVERSE_MESSAGE0,
      args0: [
        {
          type: "input_value",
          name: "LIST",
          check: "Array",
        },
      ],
      style: "list_blocks",
      output: "Array",
      inputsInline: true,
      tooltip: KidBlocks.Msg.LISTS_REVERSE_TOOLTIP,
      helpUrl: KidBlocks.Msg.LISTS_REVERSE_HELPURL,
    });
  },
};

/** Lists 块检查，如果列表为空 */
Blockly.Blocks["lists_isEmpty"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.LISTS_ISEMPTY_TITLE,
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: ["String", "Array"],
        },
      ],
      style: "list_blocks",
      output: "Boolean",
      tooltip: KidBlocks.Msg.LISTS_ISEMPTY_TOOLTIP,
      helpUrl: KidBlocks.Msg.LISTS_ISEMPTY_HELPURL,
    });
  },
};

/** Lists 获取列表长度的块 */
Blockly.Blocks["lists_length"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.LISTS_LENGTH_TITLE,
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: ["String", "Array"],
        },
      ],
      style: "list_blocks",
      output: "Number",
      tooltip: KidBlocks.Msg.LISTS_LENGTH_TOOLTIP,
      helpUrl: KidBlocks.Msg.LISTS_LENGTH_HELPURL,
    });
  },
};

Blockly.Blocks["lists_create_with"] = {
  /**
   * 用于创建具有任何数量的任何类型的元素的列表的块.
   * @this {Blockly.Block}
   */
  init: function () {
    this.setHelpUrl(KidBlocks.Msg.LISTS_CREATE_WITH_HELPURL);
    this.setStyle("list_blocks");
    this.itemCount_ = 3;
    this.updateShape_();
    this.setOutput(true, "Array");
    this.setMutator(new Blockly.Mutator(["lists_create_with_item"]));
    this.setTooltip(KidBlocks.Msg.LISTS_CREATE_WITH_TOOLTIP);
  },
  /**
   * 创建XML以表示列表输入.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function () {
    var container = Blockly.utils.xml.createElement("mutation");
    container.setAttribute("items", this.itemCount_);
    return container;
  },
  /**
   * 解析XML以还原列表输入.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function (xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute("items"), 10);
    this.updateShape_();
  },
  /**
   * 使用此块的组件填充mutator的对话框.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this {Blockly.Block}
   */
  decompose: function (workspace) {
    var containerBlock = workspace.newBlock("lists_create_with_container");
    containerBlock.initSvg();
    var connection = containerBlock.getInput("STACK").connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock("lists_create_with_item");
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * 根据mutator对话框的组件重新配置该块.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this {Blockly.Block}
   */
  compose: function (containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock("STACK");
    // Count number of inputs.
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
    // Disconnect any children that don't belong.
    for (var i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput("ADD" + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      Blockly.Mutator.reconnect(connections[i], this, "ADD" + i);
    }
  },
  /**
   * 存储指向任何已连接子块的指针.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this {Blockly.Block}
   */
  saveConnections: function (containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock("STACK");
    var i = 0;
    while (itemBlock) {
      var input = this.getInput("ADD" + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * 修改此块以具有正确的输入数.
   * @private
   * @this {Blockly.Block}
   */
  updateShape_: function () {
    if (this.itemCount_ && this.getInput("EMPTY")) {
      this.removeInput("EMPTY");
    } else if (!this.itemCount_ && !this.getInput("EMPTY")) {
      this.appendDummyInput("EMPTY").appendField(
        KidBlocks.Msg.LISTS_CREATE_EMPTY_TITLE
      );
    }
    // Add new inputs.
    for (var i = 0; i < this.itemCount_; i++) {
      if (!this.getInput("ADD" + i)) {
        var input = this.appendValueInput("ADD" + i).setAlign(
          Blockly.ALIGN_RIGHT
        );
        if (i == 0) {
          input.appendField(KidBlocks.Msg.LISTS_CREATE_WITH_INPUT_WITH);
        }
      }
    }
    // Remove deleted inputs.
    while (this.getInput("ADD" + i)) {
      this.removeInput("ADD" + i);
      i++;
    }
  },
};

Blockly.Blocks["lists_create_with_container"] = {
  /**
   * 列表容器的突变体块.
   * @this {Blockly.Block}
   */
  init: function () {
    this.setStyle("list_blocks");
    this.appendDummyInput().appendField(
      KidBlocks.Msg.LISTS_CREATE_WITH_CONTAINER_TITLE_ADD
    );
    this.appendStatementInput("STACK");
    this.setTooltip(KidBlocks.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  },
};

Blockly.Blocks["lists_create_with_item"] = {
  /**
   * 用于添加项目的Mutator块.
   * @this {Blockly.Block}
   */
  init: function () {
    this.setStyle("list_blocks");
    this.appendDummyInput().appendField(
      KidBlocks.Msg.LISTS_CREATE_WITH_ITEM_TITLE
    );
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(KidBlocks.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
  },
};

Blockly.Blocks["lists_indexOf"] = {
  /**
   * 在列表中查找项目的块.
   * @this {Blockly.Block}
   */
  init: function () {
    var OPERATORS = [
      [KidBlocks.Msg.LISTS_INDEX_OF_FIRST, "FIRST"],
      [KidBlocks.Msg.LISTS_INDEX_OF_LAST, "LAST"],
    ];
    this.setHelpUrl(KidBlocks.Msg.LISTS_INDEX_OF_HELPURL);
    this.setStyle("list_blocks");
    this.setOutput(true, "Number");
    this.appendValueInput("VALUE")
      .setCheck("Array")
      .appendField(KidBlocks.Msg.LISTS_INDEX_OF_INPUT_IN_LIST);
    this.appendValueInput("FIND").appendField(
      new Blockly.FieldDropdown(OPERATORS),
      "END"
    );
    this.setInputsInline(true);
    // 将“ this”分配给变量，以在下面的工具提示中使用.
    var thisBlock = this;
    this.setTooltip(function () {
      return KidBlocks.Msg.LISTS_INDEX_OF_TOOLTIP.replace(
        "%1",
        thisBlock.workspace.options.oneBasedIndex ? "0" : "-1"
      );
    });
  },
};

Blockly.Blocks["lists_getIndex"] = {
  /**
   * 获取索引元素的块.
   * @this {Blockly.Block}
   */
  init: function () {
    var MODE = [
      [KidBlocks.Msg.LISTS_GET_INDEX_GET, "GET"],
      [KidBlocks.Msg.LISTS_GET_INDEX_GET_REMOVE, "GET_REMOVE"],
      [KidBlocks.Msg.LISTS_GET_INDEX_REMOVE, "REMOVE"],
    ];
    this.WHERE_OPTIONS = [
      [KidBlocks.Msg.LISTS_GET_INDEX_FROM_START, "FROM_START"],
      [KidBlocks.Msg.LISTS_GET_INDEX_FROM_END, "FROM_END"],
      [KidBlocks.Msg.LISTS_GET_INDEX_FIRST, "FIRST"],
      [KidBlocks.Msg.LISTS_GET_INDEX_LAST, "LAST"],
      [KidBlocks.Msg.LISTS_GET_INDEX_RANDOM, "RANDOM"],
    ];
    this.setHelpUrl(KidBlocks.Msg.LISTS_GET_INDEX_HELPURL);
    this.setStyle("list_blocks");
    var modeMenu = new Blockly.FieldDropdown(MODE, function (value) {
      var isStatement = value == "REMOVE";
      this.getSourceBlock().updateStatement_(isStatement);
    });
    this.appendValueInput("VALUE")
      .setCheck("Array")
      .appendField(KidBlocks.Msg.LISTS_GET_INDEX_INPUT_IN_LIST);
    this.appendDummyInput()
      .appendField(modeMenu, "MODE")
      .appendField("", "SPACE");
    this.appendDummyInput("AT");
    if (KidBlocks.Msg.LISTS_GET_INDEX_TAIL) {
      this.appendDummyInput("TAIL").appendField(
        KidBlocks.Msg.LISTS_GET_INDEX_TAIL
      );
    }
    this.setInputsInline(true);
    this.setOutput(true);
    this.updateAt_(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue("MODE");
      var where = thisBlock.getFieldValue("WHERE");
      var tooltip = "";
      switch (mode + " " + where) {
        case "GET FROM_START":
        case "GET FROM_END":
          tooltip = KidBlocks.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FROM;
          break;
        case "GET FIRST":
          tooltip = KidBlocks.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FIRST;
          break;
        case "GET LAST":
          tooltip = KidBlocks.Msg.LISTS_GET_INDEX_TOOLTIP_GET_LAST;
          break;
        case "GET RANDOM":
          tooltip = KidBlocks.Msg.LISTS_GET_INDEX_TOOLTIP_GET_RANDOM;
          break;
        case "GET_REMOVE FROM_START":
        case "GET_REMOVE FROM_END":
          tooltip = KidBlocks.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM;
          break;
        case "GET_REMOVE FIRST":
          tooltip = KidBlocks.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FIRST;
          break;
        case "GET_REMOVE LAST":
          tooltip = KidBlocks.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_LAST;
          break;
        case "GET_REMOVE RANDOM":
          tooltip = KidBlocks.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_RANDOM;
          break;
        case "REMOVE FROM_START":
        case "REMOVE FROM_END":
          tooltip = KidBlocks.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FROM;
          break;
        case "REMOVE FIRST":
          tooltip = KidBlocks.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_FIRST;
          break;
        case "REMOVE LAST":
          tooltip = KidBlocks.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_LAST;
          break;
        case "REMOVE RANDOM":
          tooltip = KidBlocks.Msg.LISTS_GET_INDEX_TOOLTIP_REMOVE_RANDOM;
          break;
      }
      if (where == "FROM_START" || where == "FROM_END") {
        var msg =
          where == "FROM_START"
            ? KidBlocks.Msg.LISTS_INDEX_FROM_START_TOOLTIP
            : KidBlocks.Msg.LISTS_INDEX_FROM_END_TOOLTIP;
        tooltip +=
          "  " +
          msg.replace(
            "%1",
            thisBlock.workspace.options.oneBasedIndex ? "#1" : "#0"
          );
      }
      return tooltip;
    });
  },
  /**
   * 创建XML以表示该块是语句还是值.还代表是否有“ AT”输入.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function () {
    var container = Blockly.utils.xml.createElement("mutation");
    var isStatement = !this.outputConnection;
    container.setAttribute("statement", isStatement);
    var isAt = this.getInput("AT").type == Blockly.INPUT_VALUE;
    container.setAttribute("at", isAt);
    return container;
  },
  /**
   * 解析XML以恢复“ AT”输入.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function (xmlElement) {
    // Note: Until January 2013 this block did not have mutations,
    // so 'statement' defaults to false and 'at' defaults to true.
    var isStatement = xmlElement.getAttribute("statement") == "true";
    this.updateStatement_(isStatement);
    var isAt = xmlElement.getAttribute("at") != "false";
    this.updateAt_(isAt);
  },
  /**
   * 在值块和语句块之间切换.
   * @param {boolean} newStatement 如果块应为语句，则为True.
   *     False if the block should be a value.
   * @private
   * @this {Blockly.Block}
   */
  updateStatement_: function (newStatement) {
    var oldStatement = !this.outputConnection;
    if (newStatement != oldStatement) {
      this.unplug(true, true);
      if (newStatement) {
        this.setOutput(false);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
      } else {
        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.setOutput(true);
      }
    }
  },
  /**
   * 创建或删除数字索引的输入x.
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this {Blockly.Block}
   */
  updateAt_: function (isAt) {
    // Destroy old 'AT' and 'ORDINAL' inputs.
    this.removeInput("AT");
    this.removeInput("ORDINAL", true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput("AT").setCheck("Number");
      if (KidBlocks.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput("ORDINAL").appendField(
          KidBlocks.Msg.ORDINAL_NUMBER_SUFFIX
        );
      }
    } else {
      this.appendDummyInput("AT");
    }
    var menu = new Blockly.FieldDropdown(this.WHERE_OPTIONS, function (value) {
      var newAt = value == "FROM_START" || value == "FROM_END";
      // The 'isAt' variable is available due to this function being a closure.
      if (newAt != isAt) {
        var block = this.getSourceBlock();
        block.updateAt_(newAt);
        // This menu has been destroyed and replaced.  Update the replacement.
        block.setFieldValue(value, "WHERE");
        return null;
      }
      return undefined;
    });
    this.getInput("AT").appendField(menu, "WHERE");
    if (KidBlocks.Msg.LISTS_GET_INDEX_TAIL) {
      this.moveInputBefore("TAIL", null);
    }
  },
};

Blockly.Blocks["lists_setIndex"] = {
  /**
   * Block for setting the element at index.
   * @this {Blockly.Block}
   */
  init: function () {
    var MODE = [
      [KidBlocks.Msg.LISTS_SET_INDEX_SE, "SET"],
      [KidBlocks.Msg.LISTS_SET_INDEX_INSERT, "INSERT"],
    ];
    this.WHERE_OPTIONS = [
      [KidBlocks.Msg.LISTS_GET_INDEX_FROM_START, "FROM_START"],
      [KidBlocks.Msg.LISTS_GET_INDEX_FROM_END, "FROM_END"],
      [KidBlocks.Msg.LISTS_GET_INDEX_FIRST, "FIRST"],
      [KidBlocks.Msg.LISTS_GET_INDEX_LAST, "LAST"],
      [KidBlocks.Msg.LISTS_GET_INDEX_RANDOM, "RANDOM"],
    ];
    this.setHelpUrl(KidBlocks.Msg.LISTS_SET_INDEX_HELPURL);
    this.setStyle("list_blocks");
    this.appendValueInput("LIST")
      .setCheck("Array")
      .appendField(KidBlocks.Msg.LISTS_SET_INDEX_INPUT_IN_LIST);
    this.appendDummyInput()
      .appendField(new Blockly.FieldDropdown(MODE), "MODE")
      .appendField("", "SPACE");
    this.appendDummyInput("AT");
    this.appendValueInput("TO").appendField(
      KidBlocks.Msg.LISTS_SET_INDEX_INPUT_TO
    );
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(KidBlocks.Msg.LISTS_SET_INDEX_TOOLTIP);
    this.updateAt_(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue("MODE");
      var where = thisBlock.getFieldValue("WHERE");
      var tooltip = "";
      switch (mode + " " + where) {
        case "SET FROM_START":
        case "SET FROM_END":
          tooltip = KidBlocks.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FROM;
          break;
        case "SET FIRST":
          tooltip = KidBlocks.Msg.LISTS_SET_INDEX_TOOLTIP_SET_FIRS;
          break;
        case "SET LAST":
          tooltip = KidBlocks.Msg.LISTS_SET_INDEX_TOOLTIP_SET_LAST;
          break;
        case "SET RANDOM":
          tooltip = KidBlocks.Msg.LISTS_SET_INDEX_TOOLTIP_SET_RANDOM;
          break;
        case "INSERT FROM_START":
        case "INSERT FROM_END":
          tooltip = KidBlocks.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FROM;
          break;
        case "INSERT FIRST":
          tooltip = KidBlocks.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_FIRST;
          break;
        case "INSERT LAST":
          tooltip = KidBlocks.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_LAST;
          break;
        case "INSERT RANDOM":
          tooltip = KidBlocks.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT_RANDOM;
          break;
      }
      if (where == "FROM_START" || where == "FROM_END") {
        tooltip +=
          "  " +
          KidBlocks.Msg.LISTS_INDEX_FROM_START_TOOLTIP.replace(
            "%1",
            thisBlock.workspace.options.oneBasedIndex ? "#1" : "#0"
          );
      }
      return tooltip;
    });
  },
  /**
   * 创建XML以表示是否有“ AT”输入.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function () {
    var container = Blockly.utils.xml.createElement("mutation");
    var isAt = this.getInput("AT").type == Blockly.INPUT_VALUE;
    container.setAttribute("at", isAt);
    return container;
  },
  /**
   * Parse XML to restore the 'AT' input.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function (xmlElement) {
    // Note: Until January 2013 this block did not have mutations,
    // so 'at' defaults to true.
    var isAt = xmlElement.getAttribute("at") != "false";
    this.updateAt_(isAt);
  },
  /**
   * Create or delete an input for the numeric index.
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this {Blockly.Block}
   */
  updateAt_: function (isAt) {
    // Destroy old 'AT' and 'ORDINAL' input.
    this.removeInput("AT");
    this.removeInput("ORDINAL", true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput("AT").setCheck("Number");
      if (KidBlocks.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput("ORDINAL").appendField(
          KidBlocks.Msg.ORDINAL_NUMBER_SUFFIX
        );
      }
    } else {
      this.appendDummyInput("AT");
    }
    var menu = new Blockly.FieldDropdown(this.WHERE_OPTIONS, function (value) {
      var newAt = value == "FROM_START" || value == "FROM_END";
      // The 'isAt' variable is available due to this function being a closure.
      if (newAt != isAt) {
        var block = this.getSourceBlock();
        block.updateAt_(newAt);
        // This menu has been destroyed and replaced.  Update the replacement.
        block.setFieldValue(value, "WHERE");
        return null;
      }
      return undefined;
    });
    this.moveInputBefore("AT", "TO");
    if (this.getInput("ORDINAL")) {
      this.moveInputBefore("ORDINAL", "TO");
    }

    this.getInput("AT").appendField(menu, "WHERE");
  },
};

Blockly.Blocks["lists_getSublist"] = {
  /**
   * Block for getting sublist.
   * @this {Blockly.Block}
   */
  init: function () {
    this["WHERE_OPTIONS_1"] = [
      [KidBlocks.Msg.LISTS_GET_SUBLIST_START_FROM_START, "FROM_START"],
      [KidBlocks.Msg.LISTS_GET_SUBLIST_START_FROM_END, "FROM_END"],
      [KidBlocks.Msg.LISTS_GET_SUBLIST_START_FIRST, "FIRST"],
    ];
    this["WHERE_OPTIONS_2"] = [
      [KidBlocks.Msg.LISTS_GET_SUBLIST_END_FROM_START, "FROM_START"],
      [KidBlocks.Msg.LISTS_GET_SUBLIST_END_FROM_END, "FROM_END"],
      [KidBlocks.Msg.LISTS_GET_SUBLIST_END_LAST, "LAST"],
    ];
    this.setHelpUrl(KidBlocks.Msg.LISTS_GET_SUBLIST_HELPURL);
    this.setStyle("list_blocks");
    this.appendValueInput("LIST")
      .setCheck("Array")
      .appendField(KidBlocks.Msg.LISTS_GET_SUBLIST_INPUT_IN_LIST);
    this.appendDummyInput("AT1");
    this.appendDummyInput("AT2");
    if (KidBlocks.Msg.LISTS_GET_SUBLIST_TAIL) {
      this.appendDummyInput("TAIL").appendField(
        KidBlocks.Msg.LISTS_GET_SUBLIST_TAIL
      );
    }
    this.setInputsInline(true);
    this.setOutput(true, "Array");
    this.updateAt_(1, true);
    this.updateAt_(2, true);
    this.setTooltip(KidBlocks.Msg.LISTS_GET_SUBLIST_TOOLTIP);
  },
  /**
   * Create XML to represent whether there are 'AT' inputs.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function () {
    var container = Blockly.utils.xml.createElement("mutation");
    var isAt1 = this.getInput("AT1").type == Blockly.INPUT_VALUE;
    container.setAttribute("at1", isAt1);
    var isAt2 = this.getInput("AT2").type == Blockly.INPUT_VALUE;
    container.setAttribute("at2", isAt2);
    return container;
  },
  /**
   * Parse XML to restore the 'AT' inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function (xmlElement) {
    var isAt1 = xmlElement.getAttribute("at1") == "true";
    var isAt2 = xmlElement.getAttribute("at2") == "true";
    this.updateAt_(1, isAt1);
    this.updateAt_(2, isAt2);
  },
  /**
   * Create or delete an input for a numeric index.
   * This block has two such inputs, independent of each other.
   * @param {number} n Specify first or second input (1 or 2).
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this {Blockly.Block}
   */
  updateAt_: function (n, isAt) {
    // Create or delete an input for the numeric index.
    // Destroy old 'AT' and 'ORDINAL' inputs.
    this.removeInput("AT" + n);
    this.removeInput("ORDINAL" + n, true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput("AT" + n).setCheck("Number");
      if (KidBlocks.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput("ORDINAL" + n).appendField(
          KidBlocks.Msg.ORDINAL_NUMBER_SUFFIX
        );
      }
    } else {
      this.appendDummyInput("AT" + n);
    }
    var menu = new Blockly.FieldDropdown(this["WHERE_OPTIONS_" + n], function (
      value
    ) {
      var newAt = value == "FROM_START" || value == "FROM_END";
      // The 'isAt' variable is available due to this function being a
      // closure.
      if (newAt != isAt) {
        var block = this.getSourceBlock();
        block.updateAt_(n, newAt);
        // This menu has been destroyed and replaced.
        // Update the replacement.
        block.setFieldValue(value, "WHERE" + n);
        return null;
      }
    });
    this.getInput("AT" + n).appendField(menu, "WHERE" + n);
    if (n == 1) {
      this.moveInputBefore("AT1", "AT2");
      if (this.getInput("ORDINAL1")) {
        this.moveInputBefore("ORDINAL1", "AT2");
      }
    }
    if (KidBlocks.Msg.LISTS_GET_SUBLIST_TAIL) {
      this.moveInputBefore("TAIL", null);
    }
  },
};

Blockly.Blocks["lists_sort"] = {
  /**
   * Block for sorting a list.
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.LISTS_SORT_TITLE,
      args0: [
        {
          type: "field_dropdown",
          name: "TYPE",
          options: [
            [KidBlocks.Msg.LISTS_SORT_TYPE_NUMERIC, "NUMERIC"],
            [KidBlocks.Msg.LISTS_SORT_TYPE_TEXT, "TEXT"],
            [KidBlocks.Msg.LISTS_SORT_TYPE_IGNORECASE, "IGNORE_CASE"],
          ],
        },
        {
          type: "field_dropdown",
          name: "DIRECTION",
          options: [
            [KidBlocks.Msg.LISTS_SORT_ORDER_ASCENDING, "1"],
            [KidBlocks.Msg.LISTS_SORT_ORDER_DESCENDING, "-1"],
          ],
        },
        {
          type: "input_value",
          name: "LIST",
          check: "Array",
        },
      ],
      output: "Array",
      style: "list_blocks",
      tooltip: KidBlocks.Msg.LISTS_SORT_TOOLTIP,
      helpUrl: KidBlocks.Msg.LISTS_SORT_HELPURL,
    });
  },
};

Blockly.Blocks["lists_split"] = {
  /**
   * 块分割文本到一个列表，或加入一个列表转换成文本.
   * @this {Blockly.Block}
   */
  init: function () {
    // Assign 'this' to a variable for use in the closures below.
    var thisBlock = this;
    var dropdown = new Blockly.FieldDropdown(
      [
        [KidBlocks.Msg.LISTS_SPLIT_LIST_FROM_TEXT, "SPLIT"],
        [KidBlocks.Msg.LISTS_SPLIT_TEXT_FROM_LIST, "JOIN"],
      ],
      function (newMode) {
        thisBlock.updateType_(newMode);
      }
    );
    this.setHelpUrl(KidBlocks.Msg.LISTS_SPLIT_HELPURL);
    this.setStyle("list_blocks");
    this.appendValueInput("INPUT")
      .setCheck("String")
      .appendField(dropdown, "MODE");
    this.appendValueInput("DELIM")
      .setCheck("String")
      .appendField(KidBlocks.Msg.LISTS_SPLIT_WITH_DELIMITER);
    this.setInputsInline(true);
    this.setOutput(true, "Array");
    this.setTooltip(function () {
      var mode = thisBlock.getFieldValue("MODE");
      if (mode == "SPLIT") {
        return KidBlocks.Msg.LISTS_SPLIT_TOOLTIP_SPLIT;
      } else if (mode == "JOIN") {
        return KidBlocks.Msg.LISTS_SPLIT_TOOLTIP_JOIN;
      }
      throw Error("Unknown mode: " + mode);
    });
  },
  /**
   * 修改此块以具有正确的输入和输出类型.
   * @param {string} newMode Either 'SPLIT' or 'JOIN'.
   * @private
   * @this {Blockly.Block}
   */
  updateType_: function (newMode) {
    var mode = this.getFieldValue("MODE");
    if (mode != newMode) {
      var inputConnection = this.getInput("INPUT").connection;
      inputConnection.setShadowDom(null);
      var inputBlock = inputConnection.targetBlock();
      if (inputBlock) {
        inputConnection.disconnect();
        if (inputBlock.isShadow()) {
          inputBlock.dispose();
        } else {
          this.bumpNeighbours();
        }
      }
    }
    if (newMode == "SPLIT") {
      this.outputConnection.setCheck("Array");
      this.getInput("INPUT").setCheck("String");
    } else {
      this.outputConnection.setCheck("String");
      this.getInput("INPUT").setCheck("Array");
    }
  },
  /**
   * Create XML to represent the input and output types.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function () {
    var container = Blockly.utils.xml.createElement("mutation");
    container.setAttribute("mode", this.getFieldValue("MODE"));
    return container;
  },
  /**
   * Parse XML to restore the input and output types.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function (xmlElement) {
    this.updateType_(xmlElement.getAttribute("mode"));
  },
};
