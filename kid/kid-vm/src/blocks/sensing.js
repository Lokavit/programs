const Timer = require("../util/timer");

class SensingBlocks {
  constructor(runtime) {
    /**
     * The runtime instantiating this block package.
     * @type {Runtime}
     */
    this.runtime = runtime;

    /**
     * The "answer" block value.
     * @type {string}
     */
    this._answer = "";

    /**
     * The timer utility.
     * @type {Timer}
     */
    this._timer = new Timer();

    /**
     * The stored microphone loudness measurement.
     * @type {number}
     */
    this._cachedLoudness = -1;

    /**
     * The time of the most recent microphone loudness measurement.
     * @type {number}
     */
    this._cachedLoudnessTimestamp = 0;

    /**
     * The list of queued questions and respective `resolve` callbacks.
     * @type {!Array}
     */
    this._questionList = [];

    this.runtime.on("ANSWER", this._onAnswer.bind(this));
    this.runtime.on("PROJECT_START", this._resetAnswer.bind(this));
    this.runtime.on("PROJECT_STOP_ALL", this._clearAllQuestions.bind(this));
    this.runtime.on("STOP_FOR_TARGET", this._clearTargetQuestions.bind(this));
    this.runtime.on("RUNTIME_DISPOSED", this._resetAnswer.bind(this));
  }

  /**
   * Retrieve the block primitives implemented by this package.
   * @return {object.<string, Function>} Mapping of opcode to Function.
   */
  getPrimitives() {
    return {
      pro_sensing_touchingobject: this.touchingObject,
      pro_sensing_touchingcolor: this.touchingColor,
      pro_sensing_coloristouchingcolor: this.colorTouchingColor,
      pro_sensing_distanceto: this.distanceTo,
      pro_sensing_timer: this.getTimer,
      pro_sensing_resettimer: this.resetTimer,
      pro_sensing_of: this.getAttributeOf,
      pro_sensing_mousex: this.getMouseX,
      pro_sensing_mousey: this.getMouseY,
      pro_sensing_setdragmode: this.setDragMode,
      pro_sensing_mousedown: this.getMouseDown,
      pro_sensing_keypressed: this.getKeyPressed,
      pro_sensing_current: this.current,
      pro_sensing_dayssince2000: this.daysSince2000,
      pro_sensing_loudness: this.getLoudness,
      pro_sensing_loud: this.isLoud,
      pro_sensing_askandwait: this.askAndWait,
      pro_sensing_answer: this.getAnswer,
      pro_sensing_username: this.getUsername,
      sensing_userid: () => {}, // legacy no-op block
    };
  }

  getMonitored() {
    return {
      sensing_answer: {
        getId: () => "answer",
      },
      sensing_loudness: {
        getId: () => "loudness",
      },
      sensing_timer: {
        getId: () => "timer",
      },
      sensing_current: {
        // This is different from the default toolbox xml id in order to support
        // importing multiple monitors from the same opcode from sb2 files,
        // something that is not currently supported in scratch 3.
        getId: (_, fields) =>
          Utility.getMonitorIdForBlockWithArgs("current", fields), // _${param}`
      },
    };
  }

  _onAnswer(answer) {
    this._answer = answer;
    const questionObj = this._questionList.shift();
    if (questionObj) {
      const [_question, resolve, target, wasVisible, wasStage] = questionObj;
      // If the target was visible when asked, hide the say bubble unless the target was the stage.
      if (wasVisible && !wasStage) {
        this.runtime.emit("SAY", target, "say", "");
      }
      resolve();
      this._askNextQuestion();
    }
  }

  _resetAnswer() {
    this._answer = "";
  }

  _enqueueAsk(question, resolve, target, wasVisible, wasStage) {
    this._questionList.push([question, resolve, target, wasVisible, wasStage]);
  }

  _askNextQuestion() {
    if (this._questionList.length > 0) {
      const [
        question,
        _resolve,
        target,
        wasVisible,
        wasStage,
      ] = this._questionList[0];
      // If the target is visible, emit a blank question and use the
      // say event to trigger a bubble unless the target was the stage.
      if (wasVisible && !wasStage) {
        this.runtime.emit("SAY", target, "say", question);
        this.runtime.emit("QUESTION", "");
      } else {
        this.runtime.emit("QUESTION", question);
      }
    }
  }

  _clearAllQuestions() {
    this._questionList = [];
    this.runtime.emit("QUESTION", null);
  }

  _clearTargetQuestions(stopTarget) {
    const currentlyAsking =
      this._questionList.length > 0 && this._questionList[0][2] === stopTarget;
    this._questionList = this._questionList.filter(
      (question) => question[2] !== stopTarget
    );

    if (currentlyAsking) {
      this.runtime.emit("SAY", stopTarget, "say", "");
      if (this._questionList.length > 0) {
        this._askNextQuestion();
      } else {
        this.runtime.emit("QUESTION", null);
      }
    }
  }

  askAndWait(args, util) {
    const _target = util.target;
    return new Promise((resolve) => {
      const isQuestionAsked = this._questionList.length > 0;
      this._enqueueAsk(
        String(args.QUESTION),
        resolve,
        _target,
        _target.visible,
        _target.isStage
      );
      if (!isQuestionAsked) {
        this._askNextQuestion();
      }
    });
  }

  getAnswer() {
    return this._answer;
  }

  touchingObject(args, util) {
    return util.target.isTouchingObject(args.TOUCHINGOBJECTMENU);
  }

  touchingColor(args, util) {
    const color = Utility.toRgbColorList(args.COLOR);
    return util.target.isTouchingColor(color);
  }

  colorTouchingColor(args, util) {
    const maskColor = Utility.toRgbColorList(args.COLOR);
    const targetColor = Utility.toRgbColorList(args.COLOR2);
    return util.target.colorIsTouchingColor(targetColor, maskColor);
  }

  distanceTo(args, util) {
    if (util.target.isStage) return 10000;

    let targetX = 0;
    let targetY = 0;
    if (args.DISTANCETOMENU === "_mouse_") {
      targetX = util.ioQuery("mouse", "getScratchX");
      targetY = util.ioQuery("mouse", "getScratchY");
    } else {
      args.DISTANCETOMENU = String(args.DISTANCETOMENU);
      const distTarget = this.runtime.getSpriteTargetByName(
        args.DISTANCETOMENU
      );
      if (!distTarget) return 10000;
      targetX = distTarget.x;
      targetY = distTarget.y;
    }

    const dx = util.target.x - targetX;
    const dy = util.target.y - targetY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  setDragMode(args, util) {
    util.target.setDraggable(args.DRAG_MODE === "draggable");
  }

  getTimer(args, util) {
    return util.ioQuery("clock", "projectTimer");
  }

  resetTimer(args, util) {
    util.ioQuery("clock", "resetProjectTimer");
  }

  getMouseX(args, util) {
    return util.ioQuery("mouse", "getScratchX");
  }

  getMouseY(args, util) {
    return util.ioQuery("mouse", "getScratchY");
  }

  getMouseDown(args, util) {
    return util.ioQuery("mouse", "getIsDown");
  }

  current(args) {
    const menuOption = String(args.CURRENTMENU).toLowerCase();
    const date = new Date();
    switch (menuOption) {
      case "year":
        return date.getFullYear();
      case "month":
        return date.getMonth() + 1; // getMonth is zero-based
      case "date":
        return date.getDate();
      case "dayofweek":
        return date.getDay() + 1; // getDay is zero-based, Sun=0
      case "hour":
        return date.getHours();
      case "minute":
        return date.getMinutes();
      case "second":
        return date.getSeconds();
    }
    return 0;
  }

  getKeyPressed(args, util) {
    return util.ioQuery("keyboard", "getKeyIsDown", [args.KEY_OPTION]);
  }

  daysSince2000() {
    const msPerDay = 24 * 60 * 60 * 1000;
    const start = new Date(2000, 0, 1); // Months are 0-indexed.
    const today = new Date();
    const dstAdjust = today.getTimezoneOffset() - start.getTimezoneOffset();
    let mSecsSinceStart = today.valueOf() - start.valueOf();
    mSecsSinceStart += (today.getTimezoneOffset() - dstAdjust) * 60 * 1000;
    return mSecsSinceStart / msPerDay;
  }

  getLoudness() {
    if (typeof this.runtime.audioEngine === "undefined") return -1;
    if (this.runtime.currentStepTime === null) return -1;

    // Only measure loudness once per step
    const timeSinceLoudness =
      this._timer.time() - this._cachedLoudnessTimestamp;
    if (timeSinceLoudness < this.runtime.currentStepTime) {
      return this._cachedLoudness;
    }

    this._cachedLoudnessTimestamp = this._timer.time();
    this._cachedLoudness = this.runtime.audioEngine.getLoudness();
    return this._cachedLoudness;
  }

  isLoud() {
    return this.getLoudness() > 10;
  }

  getAttributeOf(args) {
    let attrTarget;

    if (args.OBJECT === "_stage_") {
      attrTarget = this.runtime.getTargetForStage();
    } else {
      args.OBJECT = String(args.OBJECT);
      attrTarget = this.runtime.getSpriteTargetByName(args.OBJECT);
    }

    // attrTarget can be undefined if the target does not exist
    // (e.g. single sprite uploaded from larger project referencing
    // another sprite that wasn't uploaded)
    if (!attrTarget) return 0;

    // Generic attributes
    if (attrTarget.isStage) {
      switch (args.PROPERTY) {
        // Scratch 1.4 support
        case "background #":
          return attrTarget.currentCostume + 1;

        case "backdrop #":
          return attrTarget.currentCostume + 1;
        case "backdrop name":
          return attrTarget.getCostumes()[attrTarget.currentCostume].name;
        case "volume":
          return attrTarget.volume;
      }
    } else {
      switch (args.PROPERTY) {
        case "x position":
          return attrTarget.x;
        case "y position":
          return attrTarget.y;
        case "direction":
          return attrTarget.direction;
        case "costume #":
          return attrTarget.currentCostume + 1;
        case "costume name":
          return attrTarget.getCostumes()[attrTarget.currentCostume].name;
        case "size":
          return attrTarget.size;
        case "volume":
          return attrTarget.volume;
      }
    }

    // Target variables.
    const varName = args.PROPERTY;
    const variable = attrTarget.lookupVariableByNameAndType(varName, "", true);
    if (variable) {
      return variable.value;
    }

    // Otherwise, 0
    return 0;
  }

  getUsername(args, util) {
    return util.ioQuery("userData", "getUsername");
  }
}

module.exports = SensingBlocks;
