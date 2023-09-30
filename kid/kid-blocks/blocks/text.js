/*
 * @Author: Satya
 * @Date: 2020-11-14 15:07:37
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-14 15:08:46
 * doc: 文本类
 */
/** Text 文本值 */
Blockly.Blocks["text"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_input",
          name: "TEXT",
          text: "",
        },
      ],
      style: "text_blocks",
      output: "String",
      helpUrl: KidBlocks.Msg.TEXT_TEXT_HELPURL,
      tooltip: KidBlocks.Msg.TEXT_TEXT_TOOLTIP,
      extensions: ["text_quotes", "parent_tooltip_when_inline"],
    });
  },
};

/** Text 文本值 多行 */
Blockly.Blocks["text_multiline"] = {
  init: function () {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "field_image",
          src:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAARCAYAAADpP" +
            "U2iAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAdhgAAHYYBXaITgQAAABh0RVh0" +
            "U29mdHdhcmUAcGFpbnQubmV0IDQuMS42/U4J6AAAAP1JREFUOE+Vks0KQUEYhjm" +
            "RIja4ABtZ2dm5A3t3Ia6AUm7CylYuQRaUhZSlLZJiQbFAyRnPN33y01HOW08z88" +
            "73zpwzM4F3GWOCruvGIE4/rLaV+Nq1hVGMBqzhqlxgCys4wJA65xnogMHsQ5luj" +
            "nYHTejBBCK2mE4abjCgMGhNxHgDFWjDSG07kdfVa2pZMf4ZyMAdWmpZMfYOsLiD" +
            "MYMjlMB+K613QISRhTnITnsYg5yUd0DETmEoMlkFOeIT/A58iyK5E18BuTBfgYX" +
            "fwNJv4P9/oEBerLylOnRhygmGdPpTTBZAPkde61lbQe4moWUvYUZYLfUNftIY4z" +
            "wA5X2Z9AYnQrEAAAAASUVORK5CYII=",
          width: 12,
          height: 17,
          alt: "\u00B6",
        },
        {
          type: "field_multilinetext",
          name: "TEXT",
          text: "",
        },
      ],
      style: "text_blocks",
      output: "String",
      helpUrl: KidBlocks.Msg.TEXT_TEXT_HELPURL,
      tooltip: KidBlocks.Msg.TEXT_TEXT_TOOLTIP,
      extensions: ["parent_tooltip_when_inline"],
    });
  },
};

/** Text  */
Blockly.Blocks["text_join"] = {
  init: function () {
    this.jsonInit({
      message0: "",
      style: "text_blocks",
      output: "String",
      helpUrl: KidBlocks.Msg.TEXT_JOIN_HELPURL,
      tooltip: KidBlocks.Msg.TEXT_JOIN_TOOLTIP,
      mutator: "text_join_mutator",
    });
  },
};

/** Text  */
Blockly.Blocks["text_create_join_container"] = {
  init: function () {
    this.jsonInit({
      message0: `${KidBlocks.Msg.TEXT_CREATE_JOIN_TITLE_JOIN} %1 %2`,
      args0: [
        {
          type: "input_dummy",
        },
        {
          type: "input_statement",
          name: "STACK",
        },
      ],
      style: "text_blocks",
      tooltip: KidBlocks.Msg.TEXT_CREATE_JOIN_TOOLTIP,
      enableContextMenu: false,
    });
  },
};

/** Text  */
Blockly.Blocks["text_create_join_item"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.TEXT_CREATE_JOIN_ITEM_TITLE_ITEM,
      style: "text_blocks",
      previousStatement: null,
      nextStatement: null,
      tooltip: KidBlocks.Msg.TEXT_CREATE_JOIN_ITEM_TOOLTIP,
      enableContextMenu: false,
    });
  },
};

/** Text  */
Blockly.Blocks["text_append"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.TEXT_APPEND_TITLE,
      args0: [
        {
          type: "field_variable",
          name: "VAR",
          variable: KidBlocks.Msg.TEXT_APPEND_VARIABLE,
        },
        {
          type: "input_value",
          name: "TEXT",
        },
      ],
      style: "text_blocks",
      previousStatement: null,
      nextStatement: null,
      extensions: ["text_append_tooltip"],
    });
  },
};

/** Text 文本长度 */
Blockly.Blocks["text_length"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.TEXT_LENGTH_TITLE,
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: ["String", "Array"],
        },
      ],
      style: "text_blocks",
      output: "Number",
      tooltip: KidBlocks.Msg.TEXT_LENGTH_TOOLTIP,
      helpUrl: KidBlocks.Msg.TEXT_LENGTH_HELPURL,
    });
  },
};

/** Text 是否为空 */
Blockly.Blocks["text_isEmpty"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.TEXT_ISEMPTY_TITLE,
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: ["String", "Array"],
        },
      ],
      style: "text_blocks",
      output: "Boolean",
      tooltip: KidBlocks.Msg.TEXT_ISEMPTY_TOOLTIP,
      helpUrl: KidBlocks.Msg.TEXT_ISEMPTY_HELPURL,
    });
  },
};

/** Text 查找 */
Blockly.Blocks["text_indexOf"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.TEXT_INDEXOF_TITLE,
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: "String",
        },
        {
          type: "field_dropdown",
          name: "END",
          options: [
            [KidBlocks.Msg.TEXT_INDEXOF_OPERATOR_FIRST, "FIRST"],
            [KidBlocks.Msg.TEXT_INDEXOF_OPERATOR_LAST, "LAST"],
          ],
        },
        {
          type: "input_value",
          name: "FIND",
          check: "String",
        },
      ],
      style: "text_blocks",
      output: "Number",
      helpUrl: KidBlocks.Msg.TEXT_INDEXOF_HELPURL,
      inputsInline: true,
      extensions: ["text_indexOf_tooltip"],
    });
  },
};

/** Text  */
Blockly.Blocks["text_charAt"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.TEXT_CHARAT_TITLE, // "in text %1 %2"
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: "String",
        },
        {
          type: "field_dropdown",
          name: "WHERE",
          options: [
            [KidBlocks.Msg.TEXT_CHARAT_FROM_START, "FROM_START"],
            [KidBlocks.Msg.TEXT_CHARAT_FROM_END, "FROM_END"],
            [KidBlocks.Msg.TEXT_CHARAT_FIRST, "FIRST"],
            [KidBlocks.Msg.TEXT_CHARAT_LAST, "LAST"],
            [KidBlocks.Msg.TEXT_CHARAT_RANDOM, "RANDOM"],
          ],
        },
      ],
      style: "text_blocks",
      output: "String",
      helpUrl: KidBlocks.Msg.TEXT_CHARAT_HELPURL,
      inputsInline: true,
      mutator: "text_charAt_mutator",
    });
  },
};

/** Text 获取子字符串 */
Blockly.Blocks["text_getSubstring"] = {
  /**
   * 获取子字符串.
   * @this {Blockly.Block}
   */
  init: function () {
    this["WHERE_OPTIONS_1"] = [
      [KidBlocks.Msg.TEXT_GET_SUBSTRING_START_FROM_START, "FROM_START"],
      [KidBlocks.Msg.TEXT_GET_SUBSTRING_START_FROM_END, "FROM_END"],
      [KidBlocks.Msg.TEXT_GET_SUBSTRING_START_FIRST, "FIRST"],
    ];
    this["WHERE_OPTIONS_2"] = [
      [KidBlocks.Msg.TEXT_GET_SUBSTRING_END_FROM_START, "FROM_START"],
      [KidBlocks.Msg.TEXT_GET_SUBSTRING_END_FROM_END, "FROM_END"],
      [KidBlocks.Msg.TEXT_GET_SUBSTRING_END_LAST, "LAST"],
    ];
    this.setHelpUrl(KidBlocks.Msg.TEXT_GET_SUBSTRING_HELPURL);
    this.setStyle("text_blocks");
    this.appendValueInput("STRING")
      .setCheck("String")
      .appendField(KidBlocks.Msg.TEXT_GET_SUBSTRING_INPUT_IN_TEXT);
    this.appendDummyInput("AT1");
    this.appendDummyInput("AT2");
    if (KidBlocks.Msg.TEXT_GET_SUBSTRING_TAIL) {
      this.appendDummyInput("TAIL").appendField(
        KidBlocks.Msg.TEXT_GET_SUBSTRING_TAIL
      );
    }
    this.setInputsInline(true);
    this.setOutput(true, "String");
    this.updateAt_(1, true);
    this.updateAt_(2, true);
    this.setTooltip(KidBlocks.Msg.TEXT_GET_SUBSTRING_TOOLTIP);
  },
  /**
   * 创建XML表示是否有“ AT”输入.
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
   * 解析XML以恢复“ AT”输入.
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
   * 创建或删除数字索引的输入.该块有两个这样的输入，彼此独立.
   * @param {number} n 指定第一个或第二个输入(1 or 2).
   * @param {boolean} isAt 如果输入应存在，则为true.
   * @private
   * @this {Blockly.Block}
   */
  updateAt_: function (n, isAt) {
    // 创建或删除数字索引的输入.销毁旧的“ AT”和“ ORDINAL”输入.
    this.removeInput("AT" + n);
    this.removeInput("ORDINAL" + n, true);
    // 创建值“ AT”输入或虚拟输入.
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
    // 将尾巴（如果有的话）移动到块的结尾.
    if (n == 2 && KidBlocks.Msg.TEXT_GET_SUBSTRING_TAIL) {
      this.removeInput("TAIL", true);
      this.appendDummyInput("TAIL").appendField(
        KidBlocks.Msg.TEXT_GET_SUBSTRING_TAIL
      );
    }
    var menu = new Blockly.FieldDropdown(this["WHERE_OPTIONS_" + n], function (
      value
    ) {
      var newAt = value == "FROM_START" || value == "FROM_END";
      // 于此函数是一个闭包，因此'isAt'变量可用.
      if (newAt != isAt) {
        var block = this.getSourceBlock();
        block.updateAt_(n, newAt);
        // 该菜单已被破坏并替换.更新替换.
        block.setFieldValue(value, "WHERE" + n);
        return null;
      }
      return undefined;
    });

    this.getInput("AT" + n).appendField(menu, "WHERE" + n);
    if (n == 1) {
      this.moveInputBefore("AT1", "AT2");
      if (this.getInput("ORDINAL1")) {
        this.moveInputBefore("ORDINAL1", "AT2");
      }
    }
  },
};

/** Text 大写更改块 */
Blockly.Blocks["text_changeCase"] = {
  /**
   * @this {Blockly.Block}
   */
  init: function () {
    var OPERATORS = [
      [KidBlocks.Msg.TEXT_CHANGECASE_OPERATOR_UPPERCASE, "UPPERCASE"],
      [KidBlocks.Msg.TEXT_CHANGECASE_OPERATOR_LOWERCASE, "LOWERCASE"],
      [KidBlocks.Msg.TEXT_CHANGECASE_OPERATOR_TITLECASE, "TITLECASE"],
    ];
    this.setHelpUrl(KidBlocks.Msg.TEXT_CHANGECASE_HELPURL);
    this.setStyle("text_blocks");
    this.appendValueInput("TEXT")
      .setCheck("String")
      .appendField(new Blockly.FieldDropdown(OPERATORS), "CASE");
    this.setOutput(true, "String");
    this.setTooltip(KidBlocks.Msg.TEXT_CHANGECASE_TOOLTIP);
  },
};

/** Text 块微调空间 */
Blockly.Blocks["text_trim"] = {
  /**
   * @this {Blockly.Block}
   */
  init: function () {
    var OPERATORS = [
      [KidBlocks.Msg.TEXT_TRIM_OPERATOR_BOTH, "BOTH"],
      [KidBlocks.Msg.TEXT_TRIM_OPERATOR_LEFT, "LEFT"],
      [KidBlocks.Msg.TEXT_TRIM_OPERATOR_RIGHT, "RIGHT"],
    ];
    this.setHelpUrl(KidBlocks.Msg.TEXT_TRIM_HELPURL);
    this.setStyle("text_blocks");
    this.appendValueInput("TEXT")
      .setCheck("String")
      .appendField(new Blockly.FieldDropdown(OPERATORS), "MODE");
    this.setOutput(true, "String");
    this.setTooltip(KidBlocks.Msg.TEXT_TRIM_TOOLTIP);
  },
};

/** Text 输出 */
Blockly.Blocks["text_print"] = {
  /**
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.TEXT_PRINT_TITLE,
      args0: [
        {
          type: "input_value",
          name: "TEXT",
        },
      ],
      style: "text_blocks",
      previousStatement: null,
      nextStatement: null,
      tooltip: KidBlocks.Msg.TEXT_PRINT_TOOLTIP,
      helpUrl: KidBlocks.Msg.TEXT_PRINT_HELPURL,
    });
  },
};

/** Text 提示功能（外部消息） */
Blockly.Blocks["text_prompt_ext"] = {
  /**
   * @this {Blockly.Block}
   */
  init: function () {
    var TYPES = [
      [KidBlocks.Msg.TEXT_PROMPT_TYPE_TEXT, "TEXT"],
      [KidBlocks.Msg.TEXT_PROMPT_TYPE_NUMBER, "NUMBER"],
    ];
    this.setHelpUrl(KidBlocks.Msg.TEXT_PROMPT_HELPURL);
    this.setStyle("text_blocks");
    // 将“ this”分配给变量以在下面的闭包中使用.
    var thisBlock = this;
    var dropdown = new Blockly.FieldDropdown(TYPES, function (newOp) {
      thisBlock.updateType_(newOp);
    });
    this.appendValueInput("TEXT").appendField(dropdown, "TYPE");
    this.setOutput(true, "String");
    this.setTooltip(function () {
      return thisBlock.getFieldValue("TYPE") == "TEXT"
        ? KidBlocks.Msg.TEXT_PROMPT_TOOLTIP_TEXT
        : KidBlocks.Msg.TEXT_PROMPT_TOOLTIP_NUMBER;
    });
  },
  /**
   * 修改此块以具有正确的输出类型.
   * @param {string} newOp Either 'TEXT' or 'NUMBER'.
   * @private
   * @this {Blockly.Block}
   */
  updateType_: function (newOp) {
    this.outputConnection.setCheck(newOp == "NUMBER" ? "Number" : "String");
  },
  /**
   * 创建XML表示输出类型.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function () {
    var container = Blockly.utils.xml.createElement("mutation");
    container.setAttribute("type", this.getFieldValue("TYPE"));
    return container;
  },
  /**
   * 解析XML以恢复输出类型.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function (xmlElement) {
    this.updateType_(xmlElement.getAttribute("type"));
  },
};

/** Text 提示功能（外部消息）首选'text_prompt_ext'块，因为它更灵活. */
Blockly.Blocks["text_prompt"] = {
  /**
   * @this {Blockly.Block}
   */
  init: function () {
    this.mixin(Blockly.Text.QUOTE_IMAGE_MIXIN);
    var TYPES = [
      [KidBlocks.Msg.TEXT_PROMPT_TYPE_TEXT, "TEXT"],
      [KidBlocks.Msg.TEXT_PROMPT_TYPE_NUMBER, "NUMBER"],
    ];

    // 将“ this”分配给变量以在下面的闭包中使用.
    var thisBlock = this;
    this.setHelpUrl(KidBlocks.Msg.TEXT_PROMPT_HELPURL);
    this.setStyle("text_blocks");
    var dropdown = new Blockly.FieldDropdown(TYPES, function (newOp) {
      thisBlock.updateType_(newOp);
    });
    this.appendDummyInput()
      .appendField(dropdown, "TYPE")
      .appendField(this.newQuote_(true))
      .appendField(new Blockly.FieldTextInput(""), "TEXT")
      .appendField(this.newQuote_(false));
    this.setOutput(true, "String");
    this.setTooltip(function () {
      return thisBlock.getFieldValue("TYPE") == "TEXT"
        ? KidBlocks.Msg.TEXT_PROMPT_TOOLTIP_TEXT
        : KidBlocks.Msg.TEXT_PROMPT_TOOLTIP_NUMBER;
    });
  },
  updateType_: Blockly.Blocks["text_prompt_ext"].updateType_,
  mutationToDom: Blockly.Blocks["text_prompt_ext"].mutationToDom,
  domToMutation: Blockly.Blocks["text_prompt_ext"].domToMutation,
};

/** Text 计算一个字符串在另一个字符串中出现多少次的块 */
Blockly.Blocks["text_count"] = {
  /**
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.TEXT_COUNT_MESSAGE0,
      args0: [
        {
          type: "input_value",
          name: "SUB",
          check: "String",
        },
        {
          type: "input_value",
          name: "TEXT",
          check: "String",
        },
      ],
      style: "text_blocks",
      output: "Number",
      inputsInline: true,
      tooltip: KidBlocks.Msg.TEXT_COUNT_TOOLTIP,
      helpUrl: KidBlocks.Msg.TEXT_COUNT_HELPURL,
    });
  },
};

/** Text 在文本中用一个字符串替换另一个字符串的块 */
Blockly.Blocks["text_replace"] = {
  /**
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.TEXT_REPLACE_MESSAGE0,
      args0: [
        {
          type: "input_value",
          name: "FROM",
          check: "String",
        },
        {
          type: "input_value",
          name: "TO",
          check: "String",
        },
        {
          type: "input_value",
          name: "TEXT",
          check: "String",
        },
      ],
      style: "text_blocks",
      output: "String",
      inputsInline: true,
      tooltip: KidBlocks.Msg.TEXT_REPLACE_TOOLTIP,
      helpUrl: KidBlocks.Msg.TEXT_REPLACE_HELPURL,
    });
  },
};

/** Text 反转字符串块 */
Blockly.Blocks["text_reverse"] = {
  /**
   * @this {Blockly.Block}
   */
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.TEXT_REVERSE_MESSAGE0,
      args0: [
        {
          type: "input_value",
          name: "TEXT",
          check: "String",
        },
      ],
      style: "text_blocks",
      output: "String",
      inputsInline: true,
      tooltip: KidBlocks.Msg.TEXT_REVERSE_TOOLTIP,
      helpUrl: KidBlocks.Msg.TEXT_REVERSE_HELPURL,
    });
  },
};

Blockly.Text = {};

/**
 *
 * @mixin
 * @package
 * @readonly
 */
Blockly.Text.QUOTE_IMAGE_MIXIN = {
  /**
   * LTR开双引号的图像数据URI（与RTL开双引号相同）.
   * @readonly
   */
  QUOTE_IMAGE_LEFT_DATAURI:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAA" +
    "n0lEQVQI1z3OMa5BURSF4f/cQhAKjUQhuQmFNwGJEUi0RKN5rU7FHKhpjEH3TEMtkdBSCY" +
    "1EIv8r7nFX9e29V7EBAOvu7RPjwmWGH/VuF8CyN9/OAdvqIXYLvtRaNjx9mMTDyo+NjAN1" +
    "HNcl9ZQ5oQMM3dgDUqDo1l8DzvwmtZN7mnD+PkmLa+4mhrxVA9fRowBWmVBhFy5gYEjKMf" +
    "z9AylsaRRgGzvZAAAAAElFTkSuQmCC",
  /**
   * LTR的双引号（与RTL的双引号相同）的图像数据URI
   * @readonly
   */
  QUOTE_IMAGE_RIGHT_DATAURI:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAA" +
    "qUlEQVQI1z3KvUpCcRiA8ef9E4JNHhI0aFEacm1o0BsI0Slx8wa8gLauoDnoBhq7DcfWhg" +
    "gONDmJJgqCPA7neJ7p934EOOKOnM8Q7PDElo/4x4lFb2DmuUjcUzS3URnGib9qaPNbuXvB" +
    "O3sGPHJDRG6fGVdMSeWDP2q99FQdFrz26Gu5Tq7dFMzUvbXy8KXeAj57cOklgA+u1B5Aos" +
    "lLtGIHQMaCVnwDnADZIFIrXsoXrgAAAABJRU5ErkJggg==",
  /**
   * QUOTE_IMAGE_LEFT_DATAURI和QUOTE_IMAGE_RIGHT_DATAURI的像素宽度.
   * @readonly
   */
  QUOTE_IMAGE_WIDTH: 12,
  /**
   * QUOTE_IMAGE_LEFT_DATAURI和QUOTE_IMAGE_RIGHT_DATAURI的像素高度.
   * @readonly
   */
  QUOTE_IMAGE_HEIGHT: 12,

  /**
   * 在命名字段之前和之后插入适当的报价图像.
   * @param {string} fieldName 用引号引起来的字段名称.
   * @this {Blockly.Block}
   */
  quoteField_: function (fieldName) {
    for (var i = 0, input; (input = this.inputList[i]); i++) {
      for (var j = 0, field; (field = input.fieldRow[j]); j++) {
        if (fieldName == field.name) {
          input.insertFieldAt(j, this.newQuote_(true));
          input.insertFieldAt(j + 2, this.newQuote_(false));
          return;
        }
      }
    }
    console.warn(
      'field named "' + fieldName + '" not found in ' + this.toDevString()
    );
  },

  /**
   * 一个辅助函数，该函数生成双引号或双引号的FieldImage。 所选报价将适用于RTL块.
   * @param {boolean} open If the image should be open quote (“ in LTR).
   *                       Otherwise, a closing quote is used (” in LTR).
   * @return {!Blockly.FieldImage} The new field.
   * @this {Blockly.Block}
   */
  newQuote_: function (open) {
    var isLeft = this.RTL ? !open : open;
    var dataUri = isLeft
      ? this.QUOTE_IMAGE_LEFT_DATAURI
      : this.QUOTE_IMAGE_RIGHT_DATAURI;
    return new Blockly.FieldImage(
      dataUri,
      this.QUOTE_IMAGE_WIDTH,
      this.QUOTE_IMAGE_HEIGHT,
      isLeft ? "\u201C" : "\u201D"
    );
  },
};

/**
 * 用双引号字符的图像包装TEXT字段.
 * @this {Blockly.Block}
 */
Blockly.Text.TEXT_QUOTES_EXTENSION = function () {
  this.mixin(Blockly.Text.QUOTE_IMAGE_MIXIN);
  this.quoteField_("TEXT");
};

/**
 * 用于'text_join_mutator'扩展名中的mutator函数的Mixin.
 * @mixin
 * @augments Blockly.Block
 * @package
 */
Blockly.Text.TEXT_JOIN_MUTATOR_MIXIN = {
  /**
   * 创建XML表示文本输入的数量.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function () {
    var container = Blockly.utils.xml.createElement("mutation");
    container.setAttribute("items", this.itemCount_);
    return container;
  },
  /**
   * 解析XML以还原文本输入.
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
    var containerBlock = workspace.newBlock("text_create_join_container");
    containerBlock.initSvg();
    var connection = containerBlock.getInput("STACK").connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock("text_create_join_item");
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
    // 计算输入数量.
    var connections = [];
    while (itemBlock) {
      connections.push(itemBlock.valueConnection_);
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
    // 断开所有不属于 children.
    for (var i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput("ADD" + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }
    this.itemCount_ = connections.length;
    this.updateShape_();
    // 重新连接所有子块.
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
      this.appendDummyInput("EMPTY")
        .appendField(this.newQuote_(true))
        .appendField(this.newQuote_(false));
    }
    // 添加新输入.
    for (var i = 0; i < this.itemCount_; i++) {
      if (!this.getInput("ADD" + i)) {
        var input = this.appendValueInput("ADD" + i).setAlign(
          Blockly.ALIGN_RIGHT
        );
        if (i == 0) {
          input.appendField(KidBlocks.Msg.TEXT_JOIN_TITLE_CREATEWITH);
        }
      }
    }
    // 删除已删除的输入.
    while (this.getInput("ADD" + i)) {
      this.removeInput("ADD" + i);
      i++;
    }
  },
};

/**
 * 执行text_join块的最终设置.
 * @this {Blockly.Block}
 */
Blockly.Text.TEXT_JOIN_EXTENSION = function () {
  // Add the quote mixin for the itemCount_ = 0 case.
  this.mixin(Blockly.Text.QUOTE_IMAGE_MIXIN);
  // 初始化变量值.
  this.itemCount_ = 2;
  this.updateShape_();
  // 配置 mutator UI.
  this.setMutator(new Blockly.Mutator(["text_create_join_item"]));
};

// 更新“ text_append”块的工具提示以引用变量.
Blockly.Extensions.register(
  "text_append_tooltip",
  Blockly.Extensions.buildTooltipWithFieldText(
    "%{BKY_TEXT_APPEND_TOOLTIP}",
    "VAR"
  )
);

/**
 * 更新“ text_append”块的工具提示以引用变量.
 * @this {Blockly.Block}
 */
Blockly.Text.TEXT_INDEXOF_TOOLTIP_EXTENSION = function () {
  // 将“ this”分配给变量，以在下面的工具提示中使用.
  var thisBlock = this;
  this.setTooltip(function () {
    return KidBlocks.Msg.TEXT_INDEXOF_TOOLTIP.replace(
      "%1",
      thisBlock.workspace.options.oneBasedIndex ? "0" : "-1"
    );
  });
};

/**
 * 扩展程序'text_charAt_mutator'中的mutator函数的Mixin.
 * @mixin
 * @augments Blockly.Block
 * @package
 */
Blockly.Text.TEXT_CHARAT_MUTATOR_MIXIN = {
  /**
   * 创建XML以表示是否有“ AT”输入.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function () {
    var container = Blockly.utils.xml.createElement("mutation");
    container.setAttribute("at", !!this.isAt_);
    return container;
  },
  /**
   * 解析XML以恢复“ AT”输入.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function (xmlElement) {
    // 注意：在2013年1月之前，此区块没有突变，因此'at'默认为true.
    var isAt = xmlElement.getAttribute("at") != "false";
    this.updateAt_(isAt);
  },
  /**
   * 创建或删除数字索引的输入.
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this {Blockly.Block}
   */
  updateAt_: function (isAt) {
    // 销毁旧的“ AT”和“ ORDINAL”输入.
    this.removeInput("AT", true);
    this.removeInput("ORDINAL", true);
    // 创建值“ AT”输入或虚拟输入.
    if (isAt) {
      this.appendValueInput("AT").setCheck("Number");
      if (KidBlocks.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput("ORDINAL").appendField(
          KidBlocks.Msg.ORDINAL_NUMBER_SUFFIX
        );
      }
    }
    if (KidBlocks.Msg.TEXT_CHARAT_TAIL) {
      this.removeInput("TAIL", true);
      this.appendDummyInput("TAIL").appendField(KidBlocks.Msg.TEXT_CHARAT_TAIL);
    }

    this.isAt_ = isAt;
  },
};

/**
 * 初始增变器是否更新text_charAt并添加工具提示
 * @this {Blockly.Block}
 */
Blockly.Text.TEXT_CHARAT_EXTENSION = function () {
  var dropdown = this.getField("WHERE");
  dropdown.setValidator(function (value) {
    var newAt = value == "FROM_START" || value == "FROM_END";
    if (newAt != this.isAt_) {
      var block = this.getSourceBlock();
      block.updateAt_(newAt);
    }
  });
  this.updateAt_(true);
  // 将“ this”分配给变量，以在下面的工具提示中使用
  var thisBlock = this;
  this.setTooltip(function () {
    var where = thisBlock.getFieldValue("WHERE");
    var tooltip = KidBlocks.Msg.TEXT_CHARAT_TOOLTIP;
    if (where == "FROM_START" || where == "FROM_END") {
      var msg =
        where == "FROM_START"
          ? KidBlocks.Msg.LISTS_INDEX_FROM_START_TOOLTIP
          : KidBlocks.Msg.LISTS_INDEX_FROM_END_TOOLTIP;
      if (msg) {
        tooltip +=
          "  " +
          msg.replace(
            "%1",
            thisBlock.workspace.options.oneBasedIndex ? "#1" : "#0"
          );
      }
    }
    return tooltip;
  });
};

Blockly.Extensions.register(
  "text_indexOf_tooltip",
  Blockly.Text.TEXT_INDEXOF_TOOLTIP_EXTENSION
);

Blockly.Extensions.register("text_quotes", Blockly.Text.TEXT_QUOTES_EXTENSION);

Blockly.Extensions.registerMutator(
  "text_join_mutator",
  Blockly.Text.TEXT_JOIN_MUTATOR_MIXIN,
  Blockly.Text.TEXT_JOIN_EXTENSION
);

Blockly.Extensions.registerMutator(
  "text_charAt_mutator",
  Blockly.Text.TEXT_CHARAT_MUTATOR_MIXIN,
  Blockly.Text.TEXT_CHARAT_EXTENSION
);
