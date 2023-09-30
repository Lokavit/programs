/*
 * @Author: Satya
 * @Date: 2020-11-14 15:40:28
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-14 15:41:00
 * doc: 少儿编程 之 运算类
 */

/** Operators 运算 大于 */
Blockly.Blocks["pro_operator_gt"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_GT,
      args0: [
        {
          type: "input_value",
          name: "OPERAND1",
        },
        {
          type: "input_value",
          name: "OPERAND2",
        },
      ],
      output: "Boolean",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 小于 */
Blockly.Blocks["pro_operator_lt"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_LT,
      args0: [
        {
          type: "input_value",
          name: "OPERAND1",
        },
        {
          type: "input_value",
          name: "OPERAND2",
        },
      ],
      output: "Boolean",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 等于 */
Blockly.Blocks["pro_operator_equals"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_EQUALS,
      args0: [
        {
          type: "input_value",
          name: "OPERAND1",
        },
        {
          type: "input_value",
          name: "OPERAND2",
        },
      ],
      output: "Boolean",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 与 */
Blockly.Blocks["pro_operator_and"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_AND,
      args0: [
        {
          type: "input_value",
          name: "OPERAND1",
          check: "Boolean",
        },
        {
          type: "input_value",
          name: "OPERAND2",
          check: "Boolean",
        },
      ],
      output: "Boolean",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 或 */
Blockly.Blocks["pro_operator_or"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_OR,
      args0: [
        {
          type: "input_value",
          name: "OPERAND1",
          check: "Boolean",
        },
        {
          type: "input_value",
          name: "OPERAND2",
          check: "Boolean",
        },
      ],
      output: "Boolean",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 不成立 */
Blockly.Blocks["pro_operator_not"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_NOT,
      args0: [
        {
          type: "input_value",
          name: "OPERAND",
          check: "Boolean",
        },
      ],
      output: "Boolean",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 xx包含yy */
Blockly.Blocks["pro_operator_contains"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_CONTAINS,
      args0: [
        {
          type: "input_value",
          name: "STRING1",
        },
        {
          type: "input_value",
          name: "STRING2",
        },
      ],
      output: "Boolean",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 加法 */
Blockly.Blocks["pro_operator_add"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_ADD,
      args0: [
        {
          type: "input_value",
          name: "NUM1",
        },
        {
          type: "input_value",
          name: "NUM2",
        },
      ],
      output: "Number",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 减法 */
Blockly.Blocks["pro_operator_subtract"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_SUBTRACT,
      args0: [
        {
          type: "input_value",
          name: "NUM1",
        },
        {
          type: "input_value",
          name: "NUM2",
        },
      ],
      output: "Number",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 乘法 */
Blockly.Blocks["pro_operator_multiply"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_MULTIPLY,
      args0: [
        {
          type: "input_value",
          name: "NUM1",
        },
        {
          type: "input_value",
          name: "NUM2",
        },
      ],
      output: "Number",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 除法 */
Blockly.Blocks["pro_operator_divide"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_DIVIDE,
      args0: [
        {
          type: "input_value",
          name: "NUM1",
        },
        {
          type: "input_value",
          name: "NUM2",
        },
      ],
      output: "Number",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 四舍五入 */
Blockly.Blocks["pro_operator_mathop"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_MATHOP,
      args0: [
        {
          type: "field_dropdown",
          name: "OPERATOR",
          options: [
            [KidBlocks.Msg.PRO_OPERATORS_MATHOP_ABS, "abs"],
            [KidBlocks.Msg.PRO_OPERATORS_MATHOP_FLOOR, "floor"],
            [KidBlocks.Msg.PRO_OPERATORS_MATHOP_CEILING, "ceiling"],
            [KidBlocks.Msg.PRO_OPERATORS_MATHOP_SQRT, "sqrt"],
            [KidBlocks.Msg.PRO_OPERATORS_MATHOP_SIN, "sin"],
            [KidBlocks.Msg.PRO_OPERATORS_MATHOP_COS, "cos"],
            [KidBlocks.Msg.PRO_OPERATORS_MATHOP_TAN, "tan"],
            [KidBlocks.Msg.PRO_OPERATORS_MATHOP_ASIN, "asin"],
            [KidBlocks.Msg.PRO_OPERATORS_MATHOP_ACOS, "acos"],
            [KidBlocks.Msg.PRO_OPERATORS_MATHOP_ATAN, "atan"],
            [KidBlocks.Msg.PRO_OPERATORS_MATHOP_LN, "ln"],
            [KidBlocks.Msg.PRO_OPERATORS_MATHOP_LOG, "log"],
            [KidBlocks.Msg.PRO_OPERATORS_MATHOP_EEXP, "e ^"],
            [KidBlocks.Msg.PRO_OPERATORS_MATHOP_10EXP, "10 ^"],
          ],
        },
        {
          type: "input_value",
          name: "NUM",
        },
      ],
      output: "Number",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 数字进行“高级”数学运算 */
Blockly.Blocks["pro_operator_round"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_ROUND,
      args0: [
        {
          type: "input_value",
          name: "NUM",
        },
      ],
      output: "Number",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 xx除以yy的余数 */
Blockly.Blocks["pro_operator_mod"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_MOD,
      args0: [
        {
          type: "input_value",
          name: "NUM1",
        },
        {
          type: "input_value",
          name: "NUM2",
        },
      ],
      output: "Number",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 xx的字符数 */
Blockly.Blocks["pro_operator_length"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_LENGTH,
      args0: [
        {
          type: "input_value",
          name: "STRING",
        },
      ],
      output: "String",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 xx的第yy个字符 */
Blockly.Blocks["pro_operator_letter_of"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_LETTEROF,
      args0: [
        {
          type: "input_value",
          name: "LETTER",
        },
        {
          type: "input_value",
          name: "STRING",
        },
      ],
      output: "String",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 连接xx和yy */
Blockly.Blocks["pro_operator_join"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_JOIN,
      args0: [
        {
          type: "input_value",
          name: "STRING1",
        },
        {
          type: "input_value",
          name: "STRING2",
        },
      ],
      output: "String",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};

/** Operators 运算 范围内随机整数 */
Blockly.Blocks["pro_operator_random"] = {
  init: function () {
    this.jsonInit({
      message0: KidBlocks.Msg.PRO_OPERATORS_RANDOM,
      args0: [
        {
          type: "input_value",
          name: "FROM",
        },
        {
          type: "input_value",
          name: "TO",
        },
      ],
      output: "Number",
      colour: KidBlocks.Msg.PRO_OPERATORS_HUE,
      inputsInline: true,
    });
  },
};
