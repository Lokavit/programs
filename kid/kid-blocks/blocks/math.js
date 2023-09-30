/*
 * @Author: Satya
 * @Date: 2020-11-14 15:06:06
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-22 19:31:14
 * doc: 数学类
 */

/** @description 普通的数字值块 */
Blockly.Blocks["math_number"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_number",
          name: "NUM",
          value: 0,
        },
      ],
      style: "math_blocks",
      output: "Number",
      helpUrl: KidBlocks.Msg.MATH_NUMBER_HELPURL,
      tooltip: KidBlocks.Msg.MATH_NUMBER_TOOLTIP,
    });
  },
};

/**
 * @description 为整数值块（无小数，+或 - ）
 * 该积木用于 pro 积木
 */
Blockly.Blocks["math_integer"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_number",
          name: "NUM",
          precision: 1,
        },
      ],
      output: "Number",
      style: "math_blocks",
    });
  },
};

/**
 * @description 对于整数值，没有负数或小数块
 * 该积木用于 pro 积木
 */
Blockly.Blocks["math_whole_number"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_number",
          name: "NUM",
          min: 0,
          precision: 1,
        },
      ],
      output: "Number",
      style: "math_blocks",
    });
  },
};

/**
 * @description 正数值块，带小数
 * 该积木用于 pro 积木
 */
Blockly.Blocks["math_positive_number"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_number",
          name: "NUM",
          min: 0,
        },
      ],
      output: "Number",
      style: "math_blocks",
    });
  },
};

/**
 * @description 角度选择器块
 * 该积木用于 pro 积木
 */
Blockly.Blocks["math_angle"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_angle",
          name: "NUM",
          value: 90,
        },
      ],
      output: "Number",
      style: "math_blocks",
    });
  },
};

/** Math  基本算术运算符的块 */
Blockly.Blocks["math_arithmetic"] = {
  init: function () {
    this.jsonInit({
      message0: "%1 %2 %3",
      args0: [
        {
          type: "input_value",
          name: "A",
          check: "Number",
        },
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            [KidBlocks.Msg.MATH_ADDITION_SYMBOL, "ADD"],
            [KidBlocks.Msg.MATH_SUBTRACTION_SYMBOL, "MINUS"],
            [KidBlocks.Msg.MATH_MULTIPLICATION_SYMBOL, "MULTIPLY"],
            [KidBlocks.Msg.MATH_DIVISION_SYMBOL, "DIVIDE"],
            [KidBlocks.Msg.MATH_POWER_SYMBOL, "POWER"],
          ],
        },
        {
          type: "input_value",
          name: "B",
          check: "Number",
        },
      ],
      style: "math_blocks",
      output: "Number",
      inputsInline: true,
      helpUrl: KidBlocks.Msg.MATH_ARITHMETIC_HELPURL,
      extensions: ["math_op_tooltip"],
    });
  },
};

/** Math  具有单个操作数的高级数学运算符块 */
Blockly.Blocks["math_single"] = {
  init: function () {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            [KidBlocks.Msg.MATH_SINGLE_OP_ROOT, "ROOT"],
            [KidBlocks.Msg.MATH_SINGLE_OP_ABSOLUTE, "ABS"],
            ["-", "NEG"],
            ["ln", "LN"],
            ["log10", "LOG10"],
            ["e^", "EXP"],
            ["10^", "POW10"],
          ],
        },
        {
          type: "input_value",
          name: "NUM",
          check: "Number",
        },
      ],
      style: "math_blocks",
      output: "Number",
      helpUrl: KidBlocks.Msg.MATH_SINGLE_HELPURL,
      extensions: ["math_op_tooltip"],
    });
  },
};

/** Math  三角运算符块 */
Blockly.Blocks["math_trig"] = {
  init: function () {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            [KidBlocks.Msg.MATH_TRIG_SIN, "SIN"],
            [KidBlocks.Msg.MATH_TRIG_COS, "COS"],
            [KidBlocks.Msg.MATH_TRIG_TAN, "TAN"],
            [KidBlocks.Msg.MATH_TRIG_ASIN, "ASIN"],
            [KidBlocks.Msg.MATH_TRIG_ACOS, "ACOS"],
            [KidBlocks.Msg.MATH_TRIG_ATAN, "ATAN"],
          ],
        },
        {
          type: "input_value",
          name: "NUM",
          check: "Number",
        },
      ],
      style: "math_blocks",
      output: "Number",
      helpUrl: KidBlocks.Msg.MATH_TRIG_HELPURL,
      extensions: ["math_op_tooltip"],
    });
  },
};

/** Math  块常量: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY */
Blockly.Blocks["math_constant"] = {
  init: function () {
    this.jsonInit({
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: "CONSTANT",
          options: [
            ["\u03c0", "PI"],
            ["e", "E"],
            ["\u03c6", "GOLDEN_RATIO"],
            ["sqrt(2)", "SQRT2"],
            ["sqrt(\u00bd)", "SQRT1_2"],
            ["\u221e", "INFINITY"],
          ],
        },
      ],
      style: "math_blocks",
      output: "Number",
      tooltip: KidBlocks.Msg.MATH_CONSTANT_TOOLTIP,
      helpUrl: KidBlocks.Msg.MATH_CONSTANT_HELPURL,
    });
  },
};

/** Math 用于检查数字是否为偶数，奇数，质数，整数，正数，负数或是否可被某个数整除的块 */
Blockly.Blocks["math_number_property"] = {
  init: function () {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "input_value",
          name: "NUMBER_TO_CHECK",
          check: "Number",
        },
        {
          type: "field_dropdown",
          name: "PROPERTY",
          options: [
            [KidBlocks.Msg.MATH_IS_EVEN, "EVEN"],
            [KidBlocks.Msg.MATH_IS_ODD, "ODD"],
            [KidBlocks.Msg.MATH_IS_PRIME, "PRIME"],
            [KidBlocks.Msg.MATH_IS_WHOLE, "WHOLE"],
            [KidBlocks.Msg.MATH_IS_POSITIVE, "POSITIVE"],
            [KidBlocks.Msg.MATH_IS_NEGATIVE, "NEGATIVE"],
            [KidBlocks.Msg.MATH_IS_DIVISIBLE_BY, "DIVISIBLE_BY"],
          ],
        },
      ],
      style: "math_blocks",
      output: "Boolean",
      inputsInline: true,
      tooltip: KidBlocks.Msg.MATH_IS_TOOLTIP,
      mutator: "math_is_divisibleby_mutator",
    });
  },
};

/** Math 用于在适当位置添加变量的块 */
Blockly.Blocks["math_change"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.MATH_CHANGE_TITLE,
      args0: [
        {
          type: "field_variable",
          name: "VAR",
          variable: KidBlocks.Msg.MATH_CHANGE_TITLE_ITEM,
        },
        {
          type: "input_value",
          name: "DELTA",
          check: "Number",
        },
      ],
      style: "variable_blocks",
      previousStatement: null,
      nextStatement: null,
      helpUrl: KidBlocks.Msg.MATH_CHANGE_HELPURL,
      extensions: ["math_change_tooltip"],
    });
  },
};

/** Math 四舍五入功能块 */
Blockly.Blocks["math_round"] = {
  init: function () {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            [KidBlocks.Msg.MATH_ROUND_OPERATOR_ROUND, "ROUND"],
            [KidBlocks.Msg.MATH_ROUND_OPERATOR_ROUNDUP, "ROUNDUP"],
            [KidBlocks.Msg.MATH_ROUND_OPERATOR_ROUNDDOWN, "ROUNDDOWN"],
          ],
        },
        {
          type: "input_value",
          name: "NUM",
          check: "Number",
        },
      ],
      style: "math_blocks",
      output: "Number",
      helpUrl: KidBlocks.Msg.MATH_ROUND_HELPURL,
      tooltip: KidBlocks.Msg.MATH_ROUND_TOOLTIP,
    });
  },
};

/** Math 用于评估数字列表以返回总和，平均值，最小值，最大值等的块。某些函数也可用于文本（最小值，最大值，众数，中位数） */
Blockly.Blocks["math_on_list"] = {
  init: function () {
    this.jsonInit({
      message0: "%1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "OP",
          options: [
            [KidBlocks.Msg.MATH_ONLIST_OPERATOR_SUM, "SUM"],
            [KidBlocks.Msg.MATH_ONLIST_OPERATOR_MIN, "MIN"],
            [KidBlocks.Msg.MATH_ONLIST_OPERATOR_MAX, "MAX"],
            [KidBlocks.Msg.MATH_ONLIST_OPERATOR_AVERAGE, "AVERAGE"],
            [KidBlocks.Msg.MATH_ONLIST_OPERATOR_MEDIAN, "MEDIAN"],
            [KidBlocks.Msg.MATH_ONLIST_OPERATOR_MODE, "MODE"],
            [KidBlocks.Msg.MATH_ONLIST_OPERATOR_STD_DEV, "STD_DEV"],
            [KidBlocks.Msg.MATH_ONLIST_OPERATOR_RANDOM, "RANDOM"],
          ],
        },
        {
          type: "input_value",
          name: "LIST",
          check: "Array",
        },
      ],
      style: "math_blocks",
      output: "Number",
      helpUrl: KidBlocks.Msg.MATH_ONLIST_HELPURL,
      mutator: "math_modes_of_list_mutator",
      extensions: ["math_op_tooltip"],
    });
  },
};

/** Math 块除法的余 */
Blockly.Blocks["math_modulo"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.MATH_MODULO_TITLE,
      args0: [
        {
          type: "input_value",
          name: "DIVIDEND",
          check: "Number",
        },
        {
          type: "input_value",
          name: "DIVISOR",
          check: "Number",
        },
      ],
      style: "math_blocks",
      output: "Number",
      inputsInline: true,
      tooltip: KidBlocks.Msg.MATH_MODULO_TOOLTIP,
      helpUrl: KidBlocks.Msg.MATH_MODULO_HELPURL,
    });
  },
};

/** Math 在两个限制之间限制数字的块 */
Blockly.Blocks["math_constrain"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.MATH_CONSTRAIN_TITLE,
      args0: [
        {
          type: "input_value",
          name: "VALUE",
          check: "Number",
        },
        {
          type: "input_value",
          name: "LOW",
          check: "Number",
        },
        {
          type: "input_value",
          name: "HIGH",
          check: "Number",
        },
      ],
      style: "math_blocks",
      output: "Number",
      inputsInline: true,
      tooltip: KidBlocks.Msg.MATH_CONSTRAIN_TOOLTIP,
      helpUrl: KidBlocks.Msg.MATH_CONSTRAIN_HELPURL,
    });
  },
};

/** Math [X]和[Y]之间的随机整数 */
Blockly.Blocks["math_random_int"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.MATH_RANDOM_INT_TITLE,
      args0: [
        {
          type: "input_value",
          name: "FROM",
          check: "Number",
        },
        {
          type: "input_value",
          name: "TO",
          check: "Number",
        },
      ],
      style: "math_blocks",
      output: "Number",
      inputsInline: true,
      tooltip: KidBlocks.Msg.MATH_RANDOM_INT_TOOLTIP,
      helpUrl: KidBlocks.Msg.MATH_RANDOM_INT_HELPURL,
    });
  },
};

/** Math [X]和[Y]之间的随机整数 */
Blockly.Blocks["math_random_float"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.MATH_RANDOM_FLOAT_TITLE_RANDOM,
      style: "math_blocks",
      output: "Number",
      tooltip: KidBlocks.Msg.MATH_RANDOM_FLOAT_TOOLTIP,
      helpUrl: KidBlocks.Msg.MATH_RANDOM_FLOAT_HELPURL,
    });
  },
};

/** Math 计算[X]和[Y]的atan2的块 */
Blockly.Blocks["math_atan2"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.MATH_ATAN2_TITLE,
      args0: [
        {
          type: "input_value",
          name: "X",
          check: "Number",
        },
        {
          type: "input_value",
          name: "Y",
          check: "Number",
        },
      ],
      style: "math_blocks",
      output: "Number",
      inputsInline: true,
      tooltip: KidBlocks.Msg.MATH_ATAN2_TOOLTIP,
      helpUrl: KidBlocks.Msg.MATH_ATAN2_HELPURL,
    });
  },
};

/** Math */
Blockly.Math = {};

/**
 * 数学块OP值到块Math_arithmetic，math_simple，math_trig和math_on_lists的工具提示消息的映射.
 * @see {Blockly.Extensions#buildTooltipForDropdown}
 * @package
 * @readonly
 */
Blockly.Math.TOOLTIPS_BY_OP = {
  // 数学算术
  ADD: "%{BKY_MATH_ARITHMETIC_TOOLTIP_ADD}",
  MINUS: "%{BKY_MATH_ARITHMETIC_TOOLTIP_MINUS}",
  MULTIPLY: "%{BKY_MATH_ARITHMETIC_TOOLTIP_MULTIPLY}",
  DIVIDE: "%{BKY_MATH_ARITHMETIC_TOOLTIP_DIVIDE}",
  POWER: "%{BKY_MATH_ARITHMETIC_TOOLTIP_POWER}",

  // math_simple
  ROOT: "%{BKY_MATH_SINGLE_TOOLTIP_ROOT}",
  ABS: "%{BKY_MATH_SINGLE_TOOLTIP_ABS}",
  NEG: "%{BKY_MATH_SINGLE_TOOLTIP_NEG}",
  LN: "%{BKY_MATH_SINGLE_TOOLTIP_LN}",
  LOG10: "%{BKY_MATH_SINGLE_TOOLTIP_LOG10}",
  EXP: "%{BKY_MATH_SINGLE_TOOLTIP_EXP}",
  POW10: "%{BKY_MATH_SINGLE_TOOLTIP_POW10}",

  // math_trig
  SIN: "%{BKY_MATH_TRIG_TOOLTIP_SIN}",
  COS: "%{BKY_MATH_TRIG_TOOLTIP_COS}",
  TAN: "%{BKY_MATH_TRIG_TOOLTIP_TAN}",
  ASIN: "%{BKY_MATH_TRIG_TOOLTIP_ASIN}",
  ACOS: "%{BKY_MATH_TRIG_TOOLTIP_ACOS}",
  ATAN: "%{BKY_MATH_TRIG_TOOLTIP_ATAN}",

  // math_on_lists
  SUM: "%{BKY_MATH_ONLIST_TOOLTIP_SUM}",
  MIN: "%{BKY_MATH_ONLIST_TOOLTIP_MIN}",
  MAX: "%{BKY_MATH_ONLIST_TOOLTIP_MAX}",
  AVERAGE: "%{BKY_MATH_ONLIST_TOOLTIP_AVERAGE}",
  MEDIAN: "%{BKY_MATH_ONLIST_TOOLTIP_MEDIAN}",
  MODE: "%{BKY_MATH_ONLIST_TOOLTIP_MODE}",
  STD_DEV: "%{BKY_MATH_ONLIST_TOOLTIP_STD_DEV}",
  RANDOM: "%{BKY_MATH_ONLIST_TOOLTIP_RANDOM}",
};

Blockly.Extensions.register(
  "math_op_tooltip",
  Blockly.Extensions.buildTooltipForDropdown("OP", Blockly.Math.TOOLTIPS_BY_OP)
);

/**
 * 在'math_is_divisibleby_mutator'扩展名中的mutator的Mixin
 * @mixin
 * @augments Blockly.Block
 * @package
 */
Blockly.Math.IS_DIVISIBLEBY_MUTATOR_MIXIN = {
  /**
   * 创建XML以表示是否应该存在'divisorInput'.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function () {
    var container = Blockly.utils.xml.createElement("mutation");
    var divisorInput = this.getFieldValue("PROPERTY") == "DIVISIBLE_BY";
    container.setAttribute("divisor_input", divisorInput);
    return container;
  },
  /**
   * 解析XML以还原'divisorInput'.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function (xmlElement) {
    var divisorInput = xmlElement.getAttribute("divisor_input") == "true";
    this.updateShape_(divisorInput);
  },
  /**
   * 修改此块以具有（或不具有）输入'is divisible by'.
   * @param {boolean} divisorInput 如果此块具有除数输入，则为True.
   * @private
   * @this {Blockly.Block}
   */
  updateShape_: function (divisorInput) {
    // 添加或删除值输入.
    var inputExists = this.getInput("DIVISOR");
    if (divisorInput) {
      if (!inputExists) {
        this.appendValueInput("DIVISOR").setCheck("Number");
      }
    } else if (inputExists) {
      this.removeInput("DIVISOR");
    }
  },
};

/**
 * 对'math_property'块的'math_is_divisibleby_mutator'扩展，可以根据属性是否被“整除”来更新块形状（添加/删除除数输入）.
 * @this {Blockly.Block}
 * @package
 */
Blockly.Math.IS_DIVISIBLE_MUTATOR_EXTENSION = function () {
  this.getField("PROPERTY").setValidator(function (option) {
    var divisorInput = option == "DIVISIBLE_BY";
    this.getSourceBlock().updateShape_(divisorInput);
  });
};

Blockly.Extensions.registerMutator(
  "math_is_divisibleby_mutator",
  Blockly.Math.IS_DIVISIBLEBY_MUTATOR_MIXIN,
  Blockly.Math.IS_DIVISIBLE_MUTATOR_EXTENSION
);

// 更新'math_change'块的工具提示以引用变量.
Blockly.Extensions.register(
  "math_change_tooltip",
  Blockly.Extensions.buildTooltipWithFieldText(
    "%{BKY_MATH_CHANGE_TOOLTIP}",
    "VAR"
  )
);

/**
 * 如果'math_on_list'块使用'MODE'操作，则混合使用mutator方法以支持备用输出.
 * @mixin
 * @augments Blockly.Block
 * @package
 * @readonly
 */
Blockly.Math.LIST_MODES_MUTATOR_MIXIN = {
  /**
   * 修改此块以具有正确的输出类型.
   * @param {string} newOp 'MODE'或某些操作会返回一个数字.
   * @private
   * @this {Blockly.Block}
   */
  updateType_: function (newOp) {
    if (newOp == "MODE") {
      this.outputConnection.setCheck("Array");
    } else {
      this.outputConnection.setCheck("Number");
    }
  },
  /**
   * 创建XML表示输出类型.
   * @return {!Element} XML storage element.
   * @this {Blockly.Block}
   */
  mutationToDom: function () {
    var container = Blockly.utils.xml.createElement("mutation");
    container.setAttribute("op", this.getFieldValue("OP"));
    return container;
  },
  /**
   * 解析XML以恢复输出类型.
   * @param {!Element} xmlElement XML storage element.
   * @this {Blockly.Block}
   */
  domToMutation: function (xmlElement) {
    this.updateType_(xmlElement.getAttribute("op"));
  },
};

/**
 * 扩展到'math_on_list'块，允许支持模式操作（输出数字列表）.
 * @this {Blockly.Block}
 * @package
 */
Blockly.Math.LIST_MODES_MUTATOR_EXTENSION = function () {
  this.getField("OP").setValidator(
    function (newOp) {
      this.updateType_(newOp);
    }.bind(this)
  );
};

Blockly.Extensions.registerMutator(
  "math_modes_of_list_mutator",
  Blockly.Math.LIST_MODES_MUTATOR_MIXIN,
  Blockly.Math.LIST_MODES_MUTATOR_EXTENSION
);
