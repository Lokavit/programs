/*
 * @Author: Satya
 * @Date: 2020-07-21 12:02:14
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-27 16:00:52
 * doc:控制类积木命令
 */
class ControlBlocks {
  constructor(runtime) {
    /**
     * The runtime instantiating this block package.
     * @type {Runtime}
     */
    this.runtime = runtime;

    /**
     * The "counter" block value. For compatibility with 2.0.
     * @type {number}
     */
    this._counter = 0;

    this.runtime.on("RUNTIME_DISPOSED", this.clearCounter.bind(this));
  }

  /**
   * Retrieve the block primitives implemented by this package.
   * @return {object.<string, Function>} Mapping of opcode to Function.
   */
  getPrimitives() {
    return {
      pro_control_repeat: this.repeat,
      pro_control_repeat_until: this.repeatUntil,
      pro_control_while: this.repeatWhile,
      pro_control_for_each: this.forEach,
      pro_control_forever: this.forever,
      pro_control_wait: this.wait,
      pro_control_wait_until: this.waitUntil,
      pro_control_if: this.if,
      pro_control_if_else: this.ifElse,
      pro_control_stop: this.stop,
      pro_control_create_clone_of: this.createClone,
      pro_control_delete_this_clone: this.deleteClone,
      pro_control_get_counter: this.getCounter,
      pro_control_incr_counter: this.incrCounter,
      pro_control_clear_counter: this.clearCounter,
      pro_control_all_at_once: this.allAtOnce,
    };
  }

  getHats() {
    return {
      control_start_as_clone: {
        restartExistingThreads: false,
      },
    };
  }

  repeat(args, util) {
    const times = Math.round(Utility.toNumber(args.TIMES));
    // Initialize loop
    if (typeof util.stackFrame.loopCounter === "undefined") {
      util.stackFrame.loopCounter = times;
    }
    // Only execute once per frame.
    // When the branch finishes, `repeat` will be executed again and
    // the second branch will be taken, yielding for the rest of the frame.
    // Decrease counter
    util.stackFrame.loopCounter--;
    // If we still have some left, start the branch.
    if (util.stackFrame.loopCounter >= 0) {
      util.startBranch(1, true);
    }
  }

  repeatUntil(args, util) {
    const condition = Utility.toBoolean(args.CONDITION);
    // If the condition is false (repeat UNTIL), start the branch.
    if (!condition) {
      util.startBranch(1, true);
    }
  }

  repeatWhile(args, util) {
    const condition = Utility.toBoolean(args.CONDITION);
    // If the condition is true (repeat WHILE), start the branch.
    if (condition) {
      util.startBranch(1, true);
    }
  }

  forEach(args, util) {
    const variable = util.target.lookupOrCreateVariable(
      args.VARIABLE.id,
      args.VARIABLE.name
    );

    if (typeof util.stackFrame.index === "undefined") {
      util.stackFrame.index = 0;
    }

    if (util.stackFrame.index < Number(args.VALUE)) {
      util.stackFrame.index++;
      variable.value = util.stackFrame.index;
      util.startBranch(1, true);
    }
  }

  waitUntil(args, util) {
    const condition = Utility.toBoolean(args.CONDITION);
    if (!condition) {
      util.yield();
    }
  }

  forever(args, util) {
    util.startBranch(1, true);
  }

  wait(args, util) {
    if (util.stackTimerNeedsInit()) {
      const duration = Math.max(0, 1000 * Utility.toNumber(args.DURATION));

      util.startStackTimer(duration);
      this.runtime.requestRedraw();
      util.yield();
    } else if (!util.stackTimerFinished()) {
      util.yield();
    }
  }

  if(args, util) {
    const condition = Utility.toBoolean(args.CONDITION);
    if (condition) {
      util.startBranch(1, false);
    }
  }

  ifElse(args, util) {
    const condition = Utility.toBoolean(args.CONDITION);
    if (condition) {
      util.startBranch(1, false);
    } else {
      util.startBranch(2, false);
    }
  }

  stop(args, util) {
    const option = args.STOP_OPTION;
    if (option === "all") {
      util.stopAll();
    } else if (
      option === "other scripts in sprite" ||
      option === "other scripts in stage"
    ) {
      util.stopOtherTargetThreads();
    } else if (option === "this script") {
      util.stopThisScript();
    }
  }

  createClone(args, util) {
    // Cast argument to string
    args.CLONE_OPTION = String(args.CLONE_OPTION);

    // Set clone target
    let cloneTarget;
    if (args.CLONE_OPTION === "_myself_") {
      cloneTarget = util.target;
    } else {
      cloneTarget = this.runtime.getSpriteTargetByName(args.CLONE_OPTION);
    }

    // If clone target is not found, return
    if (!cloneTarget) return;

    // Create clone
    const newClone = cloneTarget.makeClone();
    if (newClone) {
      this.runtime.addTarget(newClone);

      // Place behind the original target.
      newClone.goBehindOther(cloneTarget);
    }
  }

  deleteClone(args, util) {
    if (util.target.isOriginal) return;
    this.runtime.disposeTarget(util.target);
    this.runtime.stopForTarget(util.target);
  }

  getCounter() {
    return this._counter;
  }

  clearCounter() {
    this._counter = 0;
  }

  incrCounter() {
    this._counter++;
  }

  allAtOnce(args, util) {
    // Since the "all at once" block is implemented for compatiblity with
    // Scratch 2.0 projects, it behaves the same way it did in 2.0, which
    // is to simply run the contained script (like "if 1 = 1").
    // (In early versions of Scratch 2.0, it would work the same way as
    // "run without screen refresh" custom blocks do now, but this was
    // removed before the release of 2.0.)
    util.startBranch(1, false);
  }
}

module.exports = ControlBlocks;
