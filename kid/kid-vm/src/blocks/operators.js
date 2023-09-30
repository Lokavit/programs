class OperatorsBlocks {
  constructor(runtime) {
    /**
     * The runtime instantiating this block package.
     * @type {Runtime}
     */
    this.runtime = runtime;
  }

  /**
   * Retrieve the block primitives implemented by this package.
   * @return {object.<string, Function>} Mapping of opcode to Function.
   */
  getPrimitives() {
    return {
      pro_operator_add: this.add,
      pro_operator_subtract: this.subtract,
      pro_operator_multiply: this.multiply,
      pro_operator_divide: this.divide,
      pro_operator_lt: this.lt,
      pro_operator_equals: this.equals,
      pro_operator_gt: this.gt,
      pro_operator_and: this.and,
      pro_operator_or: this.or,
      pro_operator_not: this.not,
      pro_operator_random: this.random,
      pro_operator_join: this.join,
      pro_operator_letter_of: this.letterOf,
      pro_operator_length: this.length,
      pro_operator_contains: this.contains,
      pro_operator_mod: this.mod,
      pro_operator_round: this.round,
      pro_operator_mathop: this.mathop,
    };
  }

  add(args) {
    return Utility.toNumber(args.NUM1) + Utility.toNumber(args.NUM2);
  }

  subtract(args) {
    return Utility.toNumber(args.NUM1) - Utility.toNumber(args.NUM2);
  }

  multiply(args) {
    return Utility.toNumber(args.NUM1) * Utility.toNumber(args.NUM2);
  }

  divide(args) {
    return Utility.toNumber(args.NUM1) / Utility.toNumber(args.NUM2);
  }

  lt(args) {
    return Utility.compare(args.OPERAND1, args.OPERAND2) < 0;
  }

  equals(args) {
    return Utility.compare(args.OPERAND1, args.OPERAND2) === 0;
  }

  gt(args) {
    return Utility.compare(args.OPERAND1, args.OPERAND2) > 0;
  }

  and(args) {
    return Utility.toBoolean(args.OPERAND1) && Utility.toBoolean(args.OPERAND2);
  }

  or(args) {
    return Utility.toBoolean(args.OPERAND1) || Utility.toBoolean(args.OPERAND2);
  }

  not(args) {
    return !Utility.toBoolean(args.OPERAND);
  }

  random(args) {
    const nFrom = Utility.toNumber(args.FROM);
    const nTo = Utility.toNumber(args.TO);
    const low = nFrom <= nTo ? nFrom : nTo;
    const high = nFrom <= nTo ? nTo : nFrom;
    if (low === high) return low;
    // If both arguments are ints, truncate the result to an int.
    if (Utility.isInt(args.FROM) && Utility.isInt(args.TO)) {
      return low + Math.floor(Math.random() * (high + 1 - low));
    }
    return Math.random() * (high - low) + low;
  }

  join(args) {
    returnString(args.STRING1) + String(args.STRING2);
  }

  letterOf(args) {
    const index = Utility.toNumber(args.LETTER) - 1;
    const str = String(args.STRING);
    // Out of bounds?
    if (index < 0 || index >= str.length) {
      return "";
    }
    return str.charAt(index);
  }

  length(args) {
    return String(args.STRING).length;
  }

  contains(args) {
    const format = function (string) {
      return String(string).toLowerCase();
    };
    return format(args.STRING1).includes(format(args.STRING2));
  }

  mod(args) {
    const n = Utility.toNumber(args.NUM1);
    const modulus = Utility.toNumber(args.NUM2);
    let result = n % modulus;
    // Scratch mod uses floored division instead of truncated division.
    if (result / modulus < 0) result += modulus;
    return result;
  }

  round(args) {
    return Math.round(Utility.toNumber(args.NUM));
  }

  mathop(args) {
    const operator = String(args.OPERATOR).toLowerCase();
    const n = Utility.toNumber(args.NUM);
    switch (operator) {
      case "abs":
        return Math.abs(n);
      case "floor":
        return Math.floor(n);
      case "ceiling":
        return Math.ceil(n);
      case "sqrt":
        return Math.sqrt(n);
      case "sin":
        return parseFloat(Math.sin((Math.PI * n) / 180).toFixed(10));
      case "cos":
        return parseFloat(Math.cos((Math.PI * n) / 180).toFixed(10));
      case "tan":
        return Utility.tan(n);
      case "asin":
        return (Math.asin(n) * 180) / Math.PI;
      case "acos":
        return (Math.acos(n) * 180) / Math.PI;
      case "atan":
        return (Math.atan(n) * 180) / Math.PI;
      case "ln":
        return Math.log(n);
      case "log":
        return Math.log(n) / Math.LN10;
      case "e ^":
        return Math.exp(n);
      case "10 ^":
        return Math.pow(10, n);
    }
    return 0;
  }
}

module.exports = OperatorsBlocks;
