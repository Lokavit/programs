/*
 * @Author: Satya
 * @Date: 2020-12-22 15:25:23
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-22 15:52:14
 * doc:所有积木的驱动实现，统一放在这里
 * 由类名作为分类
 */

const Timer = require("./util/timer");
const RenderedTarget = require("./sprites/rendered-target");
const StageLayering = require("./engine/stage-layering");

/** @module 控制分类 */
class KidControlBlocks {
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
      control_repeat: this.repeat,
      control_repeat_until: this.repeatUntil,
      control_while: this.repeatWhile,
      control_for_each: this.forEach,
      control_forever: this.forever,
      control_wait: this.wait,
      control_wait_until: this.waitUntil,
      control_if: this.if,
      control_if_else: this.ifElse,
      control_stop: this.stop,
      control_create_clone_of: this.createClone,
      control_delete_this_clone: this.deleteClone,
      control_get_counter: this.getCounter,
      control_incr_counter: this.incrCounter,
      control_clear_counter: this.clearCounter,
      control_all_at_once: this.allAtOnce,
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

/** @module 事件分类 */
class KidEventBlocks {
  constructor(runtime) {
    /**
     * The runtime instantiating this block package.
     * @type {Runtime}
     */
    this.runtime = runtime;

    this.runtime.on("KEY_PRESSED", (key) => {
      this.runtime.startHats("event_whenkeypressed", {
        KEY_OPTION: key,
      });
      this.runtime.startHats("event_whenkeypressed", {
        KEY_OPTION: "any",
      });
    });
  }

  /**
   * Retrieve the block primitives implemented by this package.
   * @return {object.<string, Function>} Mapping of opcode to Function.
   */
  getPrimitives() {
    return {
      event_whentouchingobject: this.touchingObject,
      event_broadcast: this.broadcast,
      event_broadcastandwait: this.broadcastAndWait,
      event_whengreaterthan: this.hatGreaterThanPredicate,
    };
  }

  getHats() {
    return {
      event_whenflagclicked: {
        restartExistingThreads: true,
      },
      event_whenkeypressed: {
        restartExistingThreads: false,
      },
      event_whenthisspriteclicked: {
        restartExistingThreads: true,
      },
      event_whentouchingobject: {
        restartExistingThreads: false,
        edgeActivated: true,
      },
      event_whenstageclicked: {
        restartExistingThreads: true,
      },
      event_whenbackdropswitchesto: {
        restartExistingThreads: true,
      },
      event_whengreaterthan: {
        restartExistingThreads: false,
        edgeActivated: true,
      },
      event_whenbroadcastreceived: {
        restartExistingThreads: true,
      },
    };
  }

  touchingObject(args, util) {
    return util.target.isTouchingObject(args.TOUCHINGOBJECTMENU);
  }

  hatGreaterThanPredicate(args, util) {
    const option = String(args.WHENGREATERTHANMENU).toLowerCase();
    const value = Utility.toNumber(args.VALUE);
    switch (option) {
      case "timer":
        return util.ioQuery("clock", "projectTimer") > value;
      case "loudness":
        return (
          this.runtime.audioEngine &&
          this.runtime.audioEngine.getLoudness() > value
        );
    }
    return false;
  }

  broadcast(args, util) {
    const broadcastVar = util.runtime
      .getTargetForStage()
      .lookupBroadcastMsg(args.BROADCAST_OPTION.id, args.BROADCAST_OPTION.name);
    if (broadcastVar) {
      const broadcastOption = broadcastVar.name;
      util.startHats("event_whenbroadcastreceived", {
        BROADCAST_OPTION: broadcastOption,
      });
    }
  }

  broadcastAndWait(args, util) {
    const broadcastVar = util.runtime
      .getTargetForStage()
      .lookupBroadcastMsg(args.BROADCAST_OPTION.id, args.BROADCAST_OPTION.name);
    if (broadcastVar) {
      const broadcastOption = broadcastVar.name;
      // Have we run before, starting threads?
      if (!util.stackFrame.startedThreads) {
        // No - start hats for this broadcast.
        util.stackFrame.startedThreads = util.startHats(
          "event_whenbroadcastreceived",
          {
            BROADCAST_OPTION: broadcastOption,
          }
        );
        if (util.stackFrame.startedThreads.length === 0) {
          // Nothing was started.
          return;
        }
      }
      // We've run before; check if the wait is still going on.
      const instance = this;
      // Scratch 2 considers threads to be waiting if they are still in
      // runtime.threads. Threads that have run all their blocks, or are
      // marked done but still in runtime.threads are still considered to
      // be waiting.
      const waiting = util.stackFrame.startedThreads.some(
        (thread) => instance.runtime.threads.indexOf(thread) !== -1
      );
      if (waiting) {
        // If all threads are waiting for the next tick or later yield
        // for a tick as well. Otherwise yield until the next loop of
        // the threads.
        if (
          util.stackFrame.startedThreads.every((thread) =>
            instance.runtime.isWaitingThread(thread)
          )
        ) {
          util.yieldTick();
        } else {
          util.yield();
        }
      }
    }
  }
}

/**
 * @module 外观分类
 * @typedef {object} BubbleState - the bubble state associated with a particular target.
 * @property {Boolean} onSpriteRight - tracks whether the bubble is right or left of the sprite.
 * @property {?int} drawableId - the ID of the associated bubble Drawable, null if none.
 * @property {string} text - the text of the bubble.
 * @property {string} type - the type of the bubble, "say" or "think"
 * @property {?string} usageId - ID indicating the most recent usage of the say/think bubble.
 *      Used for comparison when determining whether to clear a say/think bubble.
 */

class KidLooksBlocks {
  constructor(runtime) {
    /**
     * The runtime instantiating this block package.
     * @type {Runtime}
     */
    this.runtime = runtime;

    this._onTargetChanged = this._onTargetChanged.bind(this);
    this._onResetBubbles = this._onResetBubbles.bind(this);
    this._onTargetWillExit = this._onTargetWillExit.bind(this);
    this._updateBubble = this._updateBubble.bind(this);

    // Reset all bubbles on start/stop
    this.runtime.on("PROJECT_STOP_ALL", this._onResetBubbles);
    this.runtime.on("targetWasRemoved", this._onTargetWillExit);

    // Enable other blocks to use bubbles like ask/answer
    this.runtime.on(KidLooksBlocks.SAY_OR_THINK, this._updateBubble);
  }

  /**
   * The default bubble state, to be used when a target has no existing bubble state.
   * @type {BubbleState}
   */
  static get DEFAULT_BUBBLE_STATE() {
    return {
      drawableId: null,
      onSpriteRight: true,
      skinId: null,
      text: "",
      type: "say",
      usageId: null,
    };
  }

  /**
   * The key to load & store a target's bubble-related state.
   * @type {string}
   */
  static get STATE_KEY() {
    return "Scratch.looks";
  }

  /**
   * Event name for a text bubble being created or updated.
   * @const {string}
   */
  static get SAY_OR_THINK() {
    // There are currently many places in the codebase which explicitly refer to this event by the string 'SAY',
    // so keep this as the string 'SAY' for now rather than changing it to 'SAY_OR_THINK' and breaking things.
    return "SAY";
  }

  /**
   * Limit for say bubble string.
   * @const {string}
   */
  static get SAY_BUBBLE_LIMIT() {
    return 330;
  }

  /**
   * Limit for ghost effect
   * @const {object}
   */
  static get EFFECT_GHOST_LIMIT() {
    return { min: 0, max: 100 };
  }

  /**
   * Limit for brightness effect
   * @const {object}
   */
  static get EFFECT_BRIGHTNESS_LIMIT() {
    return { min: -100, max: 100 };
  }

  /**
   * @param {Target} target - collect bubble state for this target. Probably, but not necessarily, a RenderedTarget.
   * @returns {BubbleState} the mutable bubble state associated with that target. This will be created if necessary.
   * @private
   */
  _getBubbleState(target) {
    let bubbleState = target.getCustomState(KidLooksBlocks.STATE_KEY);
    if (!bubbleState) {
      bubbleState = Utility.cloneSimple(KidLooksBlocks.DEFAULT_BUBBLE_STATE);
      target.setCustomState(KidLooksBlocks.STATE_KEY, bubbleState);
    }
    return bubbleState;
  }

  /**
   * Handle a target which has moved.
   * @param {RenderedTarget} target - the target which has moved.
   * @private
   */
  _onTargetChanged(target) {
    const bubbleState = this._getBubbleState(target);
    if (bubbleState.drawableId) {
      this._positionBubble(target);
    }
  }

  /**
   * Handle a target which is exiting.
   * @param {RenderedTarget} target - the target.
   * @private
   */
  _onTargetWillExit(target) {
    const bubbleState = this._getBubbleState(target);
    if (bubbleState.drawableId && bubbleState.skinId) {
      this.runtime.renderer.destroyDrawable(
        bubbleState.drawableId,
        StageLayering.SPRITE_LAYER
      );
      this.runtime.renderer.destroySkin(bubbleState.skinId);
      bubbleState.drawableId = null;
      bubbleState.skinId = null;
      this.runtime.requestRedraw();
    }
    target.removeListener(
      RenderedTarget.EVENT_TARGET_VISUAL_CHANGE,
      this._onTargetChanged
    );
  }

  /**
   * Handle project start/stop by clearing all visible bubbles.
   * @private
   */
  _onResetBubbles() {
    for (let n = 0; n < this.runtime.targets.length; n++) {
      const bubbleState = this._getBubbleState(this.runtime.targets[n]);
      bubbleState.text = "";
      this._onTargetWillExit(this.runtime.targets[n]);
    }
    clearTimeout(this._bubbleTimeout);
  }

  /**
   * Position the bubble of a target. If it doesn't fit on the specified side, flip and rerender.
   * @param {!Target} target Target whose bubble needs positioning.
   * @private
   */
  _positionBubble(target) {
    if (!target.visible) return;
    const bubbleState = this._getBubbleState(target);
    const [
      bubbleWidth,
      bubbleHeight,
    ] = this.runtime.renderer.getCurrentSkinSize(bubbleState.drawableId);
    let targetBounds;
    try {
      targetBounds = target.getBoundsForBubble();
    } catch (error_) {
      // Bounds calculation could fail (e.g. on empty costumes), in that case
      // use the x/y position of the target.
      targetBounds = {
        left: target.x,
        right: target.x,
        top: target.y,
        bottom: target.y,
      };
    }
    const stageSize = this.runtime.renderer.getNativeSize();
    const stageBounds = {
      left: -stageSize[0] / 2,
      right: stageSize[0] / 2,
      top: stageSize[1] / 2,
      bottom: -stageSize[1] / 2,
    };
    if (
      bubbleState.onSpriteRight &&
      bubbleWidth + targetBounds.right > stageBounds.right &&
      targetBounds.left - bubbleWidth > stageBounds.left
    ) {
      // Only flip if it would fit
      bubbleState.onSpriteRight = false;
      this._renderBubble(target);
    } else if (
      !bubbleState.onSpriteRight &&
      targetBounds.left - bubbleWidth < stageBounds.left &&
      bubbleWidth + targetBounds.right < stageBounds.right
    ) {
      // Only flip if it would fit
      bubbleState.onSpriteRight = true;
      this._renderBubble(target);
    } else {
      this.runtime.renderer.updateDrawableProperties(bubbleState.drawableId, {
        position: [
          bubbleState.onSpriteRight
            ? Math.max(
                stageBounds.left, // Bubble should not extend past left edge of stage
                Math.min(stageBounds.right - bubbleWidth, targetBounds.right)
              )
            : Math.min(
                stageBounds.right - bubbleWidth, // Bubble should not extend past right edge of stage
                Math.max(stageBounds.left, targetBounds.left - bubbleWidth)
              ),
          // Bubble should not extend past the top of the stage
          Math.min(stageBounds.top, targetBounds.bottom + bubbleHeight),
        ],
      });
      this.runtime.requestRedraw();
    }
  }

  /**
   * Create a visible bubble for a target. If a bubble exists for the target,
   * just set it to visible and update the type/text. Otherwise create a new
   * bubble and update the relevant custom state.
   * @param {!Target} target Target who needs a bubble.
   * @return {undefined} Early return if text is empty string.
   * @private
   */
  _renderBubble(target) {
    if (!this.runtime.renderer) return;

    const bubbleState = this._getBubbleState(target);
    const { type, text, onSpriteRight } = bubbleState;

    // Remove the bubble if target is not visible, or text is being set to blank.
    if (!target.visible || text === "") {
      this._onTargetWillExit(target);
      return;
    }

    if (bubbleState.skinId) {
      this.runtime.renderer.updateTextSkin(
        bubbleState.skinId,
        type,
        text,
        onSpriteRight,
        [0, 0]
      );
    } else {
      target.addListener(
        RenderedTarget.EVENT_TARGET_VISUAL_CHANGE,
        this._onTargetChanged
      );
      bubbleState.drawableId = this.runtime.renderer.createDrawable(
        StageLayering.SPRITE_LAYER
      );
      bubbleState.skinId = this.runtime.renderer.createTextSkin(
        type,
        text,
        bubbleState.onSpriteRight,
        [0, 0]
      );
      this.runtime.renderer.updateDrawableProperties(bubbleState.drawableId, {
        skinId: bubbleState.skinId,
      });
    }

    this._positionBubble(target);
  }

  /**
   * Properly format text for a text bubble.
   * @param {string} text The text to be formatted
   * @return {string} The formatted text
   * @private
   */
  _formatBubbleText(text) {
    if (text === "") return text;

    // Non-integers should be rounded to 2 decimal places (no more, no less), unless they're small enough that
    // rounding would display them as 0.00. This matches 2.0's behavior:
    // https://github.com/LLK/scratch-flash/blob/2e4a402ceb205a042887f54b26eebe1c2e6da6c0/src/scratch/ScratchSprite.as#L579-L585
    if (typeof text === "number" && Math.abs(text) >= 0.01 && text % 1 !== 0) {
      text = text.toFixed(2);
    }

    // Limit the length of the string.
    text = String(text).substr(0, KidLooksBlocks.SAY_BUBBLE_LIMIT);

    return text;
  }

  /**
   * The entry point for say/think blocks. Clears existing bubble if the text is empty.
   * Set the bubble custom state and then call _renderBubble.
   * @param {!Target} target Target that say/think blocks are being called on.
   * @param {!string} type Either "say" or "think"
   * @param {!string} text The text for the bubble, empty string clears the bubble.
   * @private
   */
  _updateBubble(target, type, text) {
    const bubbleState = this._getBubbleState(target);
    bubbleState.type = type;
    bubbleState.text = this._formatBubbleText(text);
    console.warn("look:", Utility.uid());
    bubbleState.usageId = Utility.uid();
    this._renderBubble(target);
  }

  /**
   * Retrieve the block primitives implemented by this package.
   * @return {object.<string, Function>} Mapping of opcode to Function.
   */
  getPrimitives() {
    return {
      /** KID-JR 专属指令 实现 */
      looks_zoomout: this.zoomOut,
      looks_zoomin: this.zoomIn,
      looks_zoomreset: this.zoomReset,
      /** KID-PRO 指令 实现 */
      looks_say: this.say,
      looks_sayforsecs: this.sayforsecs,
      looks_think: this.think,
      looks_thinkforsecs: this.thinkforsecs,
      looks_show: this.show,
      looks_hide: this.hide,
      looks_hideallsprites: () => {}, // legacy no-op block
      looks_switchcostumeto: this.switchCostume,
      looks_switchbackdropto: this.switchBackdrop,
      looks_switchbackdroptoandwait: this.switchBackdropAndWait,
      looks_nextcostume: this.nextCostume,
      looks_nextbackdrop: this.nextBackdrop,
      looks_changeeffectby: this.changeEffect,
      looks_seteffectto: this.setEffect,
      looks_cleargraphiceffects: this.clearEffects,
      looks_changesizeby: this.changeSize,
      looks_setsizeto: this.setSize,
      looks_changestretchby: () => {}, // legacy no-op blocks
      looks_setstretchto: () => {},
      looks_gotofrontback: this.goToFrontBack,
      looks_goforwardbackwardlayers: this.goForwardBackwardLayers,
      looks_size: this.getSize,
      looks_costumenumbername: this.getCostumeNumberName,
      looks_backdropnumbername: this.getBackdropNumberName,
    };
  }

  getMonitored() {
    return {
      looks_size: {
        isSpriteSpecific: true,
        getId: (targetId) => `${targetId}_size`,
      },
      looks_costumenumbername: {
        isSpriteSpecific: true,
        getId: (targetId, fields) =>
          Utility.getMonitorIdForBlockWithArgs(
            `${targetId}_costumenumbername`,
            fields
          ),
      },
      looks_backdropnumbername: {
        getId: (_, fields) =>
          Utility.getMonitorIdForBlockWithArgs("backdropnumbername", fields),
      },
    };
  }

  /** KID-JR 专属指令 实现 */
  /**
   * 自定义  放大函数
   * @param {*} args
   * @param {*} util
   */
  zoomOut(args, util) {
    if (util.stackFrame.timer) {
      const n = util.stackFrame.timer.timeElapsed();
      if (n < 1e3 * util.stackFrame.duration) {
        const r =
          ((n - util.stackFrame.prevTimeElapsed) /
            (1e3 * util.stackFrame.duration)) *
          util.stackFrame.absPercent;
        // eslint-disable-next-line no-unused-expressions
        util.target.setSize(util.stackFrame.crtScale + r), util.yield();
      } else {
        util.target.setSize(
          util.stackFrame.crtScale + util.stackFrame.absPercent
        );
      }
    } else {
      // const i = Cast.toNumber(args.PERCENT);
      const i = Utility.toNumber(1);
      util.stackFrame.timer = new Timer();

      util.stackFrame.timer.start();
      if (
        ((util.stackFrame.duration = 0.1 * i),
        (util.stackFrame.absPercent = 10 * i),
        (util.stackFrame.crtScale = util.target.size),
        (util.stackFrame.prevTimeElapsed = 0),
        util.stackFrame.duration <= 0)
      ) {
        return void util.target.setSize(
          util.stackFrame.crtScale + util.stackFrame.absPercent
        );
      }
      util.yield();
    }
  }

  /**
   * 自定义  缩小函数
   * @param {*} args
   * @param {*} util
   */
  zoomIn(args, util) {
    if (util.stackFrame.timer) {
      const n = util.stackFrame.timer.timeElapsed();
      if (n < 1e3 * util.stackFrame.duration) {
        const r =
          ((n - util.stackFrame.prevTimeElapsed) /
            (1e3 * util.stackFrame.duration)) *
          util.stackFrame.absPercent;
        // eslint-disable-next-line no-unused-expressions
        util.target.setSize(util.stackFrame.crtScale - r), util.yield();
      } else {
        util.target.setSize(
          util.stackFrame.crtScale - util.stackFrame.absPercent
        );
      }
    } else {
      // const i = Cast.toNumber(args.PERCENT);
      const i = Utility.toNumber(1);

      util.stackFrame.timer = new Timer();

      util.stackFrame.timer.start();
      if (
        ((util.stackFrame.duration = 0.1 * i),
        (util.stackFrame.absPercent = 10 * i),
        (util.stackFrame.crtScale = util.target.size),
        (util.stackFrame.prevTimeElapsed = 0),
        util.stackFrame.duration <= 0)
      ) {
        return void util.target.setSize(
          util.stackFrame.crtScale - util.stackFrame.absPercent
        );
      }
      util.yield();
    }
  }

  /**
   * 自定义  缩放重置函数
   * @param {*} args
   * @param {*} util
   */
  zoomReset(args, util) {
    util.target.setSize(100);
  }

  /** KID-PRO 指令 实现 */
  say(args, util) {
    // @TODO in 2.0 calling say/think resets the right/left bias of the bubble
    this.runtime.emit(
      KidLooksBlocks.SAY_OR_THINK,
      util.target,
      "say",
      args.MESSAGE
    );
  }

  sayforsecs(args, util) {
    this.say(args, util);
    const target = util.target;
    const usageId = this._getBubbleState(target).usageId;
    return new Promise((resolve) => {
      this._bubbleTimeout = setTimeout(() => {
        this._bubbleTimeout = null;
        // Clear say bubble if it hasn't been changed and proceed.
        if (this._getBubbleState(target).usageId === usageId) {
          this._updateBubble(target, "say", "");
        }
        resolve();
      }, 1000 * args.SECS);
    });
  }

  think(args, util) {
    this.runtime.emit(
      KidLooksBlocks.SAY_OR_THINK,
      util.target,
      "think",
      args.MESSAGE
    );
  }

  thinkforsecs(args, util) {
    this.think(args, util);
    const target = util.target;
    const usageId = this._getBubbleState(target).usageId;
    return new Promise((resolve) => {
      this._bubbleTimeout = setTimeout(() => {
        this._bubbleTimeout = null;
        // Clear think bubble if it hasn't been changed and proceed.
        if (this._getBubbleState(target).usageId === usageId) {
          this._updateBubble(target, "think", "");
        }
        resolve();
      }, 1000 * args.SECS);
    });
  }

  show(args, util) {
    util.target.setVisible(true);
    this._renderBubble(util.target);
  }

  hide(args, util) {
    util.target.setVisible(false);
    this._renderBubble(util.target);
  }

  /**
   * Utility function to set the costume of a target.
   * Matches the behavior of Scratch 2.0 for different types of arguments.
   * @param {!Target} target Target to set costume to.
   * @param {Any} requestedCostume Costume requested, e.g., 0, 'name', etc.
   * @param {boolean=} optZeroIndex Set to zero-index the requestedCostume.
   * @return {Array.<!Thread>} Any threads started by this switch.
   */
  _setCostume(target, requestedCostume, optZeroIndex) {
    if (typeof requestedCostume === "number") {
      // Numbers should be treated as costume indices, always
      target.setCostume(optZeroIndex ? requestedCostume : requestedCostume - 1);
    } else {
      // Strings should be treated as costume names, where possible
      const costumeIndex = target.getCostumeIndexByName(
        requestedCostume.toString()
      );

      if (costumeIndex !== -1) {
        target.setCostume(costumeIndex);
      } else if (requestedCostume === "next costume") {
        target.setCostume(target.currentCostume + 1);
      } else if (requestedCostume === "previous costume") {
        target.setCostume(target.currentCostume - 1);
        // Try to cast the string to a number (and treat it as a costume index)
        // Pure whitespace should not be treated as a number
        // Note: isNaN will cast the string to a number before checking if it's NaN
      } else if (
        !(isNaN(requestedCostume) || Utility.isWhiteSpace(requestedCostume))
      ) {
        target.setCostume(
          optZeroIndex ? Number(requestedCostume) : Number(requestedCostume) - 1
        );
      }
    }

    // Per 2.0, 'switch costume' can't start threads even in the Stage.
    return [];
  }

  /**
   * Utility function to set the backdrop of a target.
   * Matches the behavior of Scratch 2.0 for different types of arguments.
   * @param {!Target} stage Target to set backdrop to.
   * @param {Any} requestedBackdrop Backdrop requested, e.g., 0, 'name', etc.
   * @param {boolean=} optZeroIndex Set to zero-index the requestedBackdrop.
   * @return {Array.<!Thread>} Any threads started by this switch.
   */
  _setBackdrop(stage, requestedBackdrop, optZeroIndex) {
    if (typeof requestedBackdrop === "number") {
      // Numbers should be treated as backdrop indices, always
      stage.setCostume(
        optZeroIndex ? requestedBackdrop : requestedBackdrop - 1
      );
    } else {
      // Strings should be treated as backdrop names where possible
      const costumeIndex = stage.getCostumeIndexByName(
        requestedBackdrop.toString()
      );

      if (costumeIndex !== -1) {
        stage.setCostume(costumeIndex);
      } else if (requestedBackdrop === "next backdrop") {
        stage.setCostume(stage.currentCostume + 1);
      } else if (requestedBackdrop === "previous backdrop") {
        stage.setCostume(stage.currentCostume - 1);
      } else if (requestedBackdrop === "random backdrop") {
        const numCostumes = stage.getCostumes().length;
        if (numCostumes > 1) {
          // Don't pick the current backdrop, so that the block
          // will always have an observable effect.
          const lowerBound = 0;
          const upperBound = numCostumes - 1;
          const costumeToExclude = stage.currentCostume;

          const nextCostume = Utility.inclusiveRandIntWithout(
            lowerBound,
            upperBound,
            costumeToExclude
          );

          stage.setCostume(nextCostume);
        }
        // Try to cast the string to a number (and treat it as a costume index)
        // Pure whitespace should not be treated as a number
        // Note: isNaN will cast the string to a number before checking if it's NaN
      } else if (
        !(isNaN(requestedBackdrop) || Utility.isWhiteSpace(requestedBackdrop))
      ) {
        stage.setCostume(
          optZeroIndex
            ? Number(requestedBackdrop)
            : Number(requestedBackdrop) - 1
        );
      }
    }

    const newName = stage.getCostumes()[stage.currentCostume].name;
    return this.runtime.startHats("event_whenbackdropswitchesto", {
      BACKDROP: newName,
    });
  }

  switchCostume(args, util) {
    this._setCostume(util.target, args.COSTUME);
  }

  nextCostume(args, util) {
    this._setCostume(util.target, util.target.currentCostume + 1, true);
  }

  switchBackdrop(args) {
    this._setBackdrop(this.runtime.getTargetForStage(), args.BACKDROP);
  }

  switchBackdropAndWait(args, util) {
    // Have we run before, starting threads?
    if (!util.stackFrame.startedThreads) {
      // No - switch the backdrop.
      util.stackFrame.startedThreads = this._setBackdrop(
        this.runtime.getTargetForStage(),
        args.BACKDROP
      );
      if (util.stackFrame.startedThreads.length === 0) {
        // Nothing was started.
        return;
      }
    }
    // We've run before; check if the wait is still going on.
    const instance = this;
    // Scratch 2 considers threads to be waiting if they are still in
    // runtime.threads. Threads that have run all their blocks, or are
    // marked done but still in runtime.threads are still considered to
    // be waiting.
    const waiting = util.stackFrame.startedThreads.some(
      (thread) => instance.runtime.threads.indexOf(thread) !== -1
    );
    if (waiting) {
      // If all threads are waiting for the next tick or later yield
      // for a tick as well. Otherwise yield until the next loop of
      // the threads.
      if (
        util.stackFrame.startedThreads.every((thread) =>
          instance.runtime.isWaitingThread(thread)
        )
      ) {
        util.yieldTick();
      } else {
        util.yield();
      }
    }
  }

  nextBackdrop() {
    const stage = this.runtime.getTargetForStage();
    this._setBackdrop(stage, stage.currentCostume + 1, true);
  }

  clampEffect(effect, value) {
    let clampedValue = value;
    switch (effect) {
      case "ghost":
        clampedValue = Utility.clamp(
          value,
          KidLooksBlocks.EFFECT_GHOST_LIMIT.min,
          KidLooksBlocks.EFFECT_GHOST_LIMIT.max
        );
        break;
      case "brightness":
        clampedValue = Utility.clamp(
          value,
          KidLooksBlocks.EFFECT_BRIGHTNESS_LIMIT.min,
          KidLooksBlocks.EFFECT_BRIGHTNESS_LIMIT.max
        );
        break;
    }
    return clampedValue;
  }

  changeEffect(args, util) {
    const effect = String(args.EFFECT).toLowerCase();
    const change = Utility.toNumber(args.CHANGE);
    if (!util.target.effects.hasOwnProperty(effect)) return;
    let newValue = change + util.target.effects[effect];
    newValue = this.clampEffect(effect, newValue);
    util.target.setEffect(effect, newValue);
  }

  setEffect(args, util) {
    const effect = String(args.EFFECT).toLowerCase();
    let value = Utility.toNumber(args.VALUE);
    value = this.clampEffect(effect, value);
    util.target.setEffect(effect, value);
  }

  clearEffects(args, util) {
    util.target.clearEffects();
  }

  changeSize(args, util) {
    const change = Utility.toNumber(args.CHANGE);
    util.target.setSize(util.target.size + change);
  }

  setSize(args, util) {
    const size = Utility.toNumber(args.SIZE);
    util.target.setSize(size);
  }

  goToFrontBack(args, util) {
    if (!util.target.isStage) {
      if (args.FRONT_BACK === "front") {
        util.target.goToFront();
      } else {
        util.target.goToBack();
      }
    }
  }

  goForwardBackwardLayers(args, util) {
    if (!util.target.isStage) {
      if (args.FORWARD_BACKWARD === "forward") {
        util.target.goForwardLayers(Utility.toNumber(args.NUM));
      } else {
        util.target.goBackwardLayers(Utility.toNumber(args.NUM));
      }
    }
  }

  getSize(args, util) {
    return Math.round(util.target.size);
  }

  getBackdropNumberName(args) {
    const stage = this.runtime.getTargetForStage();
    if (args.NUMBER_NAME === "number") {
      return stage.currentCostume + 1;
    }
    // Else return name
    return stage.getCostumes()[stage.currentCostume].name;
  }

  getCostumeNumberName(args, util) {
    if (args.NUMBER_NAME === "number") {
      return util.target.currentCostume + 1;
    }
    // Else return name
    return util.target.getCostumes()[util.target.currentCostume].name;
  }
}

/** @module 运动分类 */
class KidMotionBlocks {
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
      /** 测试 Blockly指令 */
      // colour_picker: this.colourPicker,

      /** KID-JR 专属指令 */
      motion_moveleft: this.moveLeft, // 左移
      motion_moveright: this.moveRight, // 右移
      motion_moveup: this.moveUp, // 上移
      motion_movedown: this.moveDown, // 下移
      motion_jump: this.moveJump, // 跳跃
      motion_movereset: this.moveReset, // 位置重置

      /** KID-PRO 指令 */
      motion_movesteps: this.moveSteps,
      motion_gotoxy: this.goToXY,
      motion_goto: this.goTo,
      motion_turnright: this.turnRight,
      motion_turnleft: this.turnLeft,
      motion_pointindirection: this.pointInDirection,
      motion_pointtowards: this.pointTowards,
      motion_glidesecstoxy: this.glide,
      motion_glideto: this.glideTo,
      motion_ifonedgebounce: this.ifOnEdgeBounce,
      motion_setrotationstyle: this.setRotationStyle,
      motion_changexby: this.changeX,
      motion_setx: this.setX,
      motion_changeyby: this.changeY,
      motion_sety: this.setY,
      motion_xposition: this.getX,
      motion_yposition: this.getY,
      motion_direction: this.getDirection,
      // Legacy no-op blocks:
      motion_scroll_right: () => {},
      motion_scroll_up: () => {},
      motion_align_scene: () => {},
      motion_xscroll: () => {},
      motion_yscroll: () => {},
    };
  }

  getMonitored() {
    return {
      motion_xposition: {
        isSpriteSpecific: true,
        getId: (targetId) => `${targetId}_xposition`,
      },
      motion_yposition: {
        isSpriteSpecific: true,
        getId: (targetId) => `${targetId}_yposition`,
      },
      motion_direction: {
        isSpriteSpecific: true,
        getId: (targetId) => `${targetId}_direction`,
      },
    };
  }

  // /** 测试 Blockly 积木实现 vm驱动 */
  // colourPicker(args) {
  //   console.log("测试 Blockly积木实现 vm驱动:", args);
  // }

  /** KID-JR 专属指令 实现 */
  /**
   * 自定义  左移函数
   * @param {*} args 对象中属性 STEPS: "10"
   * @param {*} util
   */
  moveLeft(args, util) {
    console.log("左移积木块，新增速度值:", args);
    // args.STEPS的字符串值转换为数字类型
    const steps = Utility.toNumber(args.STEPS);
    // 角度值转弧度值
    const radians = Utility.degToRad(-90 - util.target.direction);
    // 返回一个数值的余弦值
    const dx = steps * Math.cos(radians) * 10;
    // 返回一个数值的正弦值
    const dy = steps * Math.sin(radians) * 10;
    // 原本使用输入值/5/输入的速度值。现在扩展一个速度的输入值 2020.09.18。
    const secs = steps / 5 / Utility.toNumber(args.SECS);
    // 此处 x轴计算时，使用减法，即向左移动
    // util.target.setXY(util.target.x - dx, util.target.y + dy);
    this.glide(
      { SECS: secs, X: util.target.x + dx, Y: util.target.y + dy },
      util
    );
  }

  /**
   * 自定义  右移函数
   * @param {*} args
   * @param {*} util
   */
  moveRight(args, util) {
    const steps = Utility.toNumber(args.STEPS);
    const radians = Utility.degToRad(90 - util.target.direction);
    const dx = steps * Math.cos(radians) * 10;
    const dy = steps * Math.sin(radians) * 10;
    // 原本使用输入值/5/输入的速度值。现在扩展一个速度的输入值 2020.09.22。
    const secs = steps / 5 / Utility.toNumber(args.SECS);
    // util.target.setXY(util.target.x + dx, util.target.y + dy);
    this.glide(
      { SECS: secs, X: util.target.x + dx, Y: util.target.y + dy },
      util
    );
  }

  /**
   * 自定义  上移函数
   * @param {*} args
   * @param {*} util
   */
  moveUp(args, util) {
    const steps = Utility.toNumber(args.STEPS);
    const radians = Utility.degToRad(180 - util.target.direction);
    const dx = steps * Math.cos(radians) * 10;
    const dy = steps * Math.sin(radians) * 10;
    // 原本使用输入值/5/输入的速度值。现在扩展一个速度的输入值 2020.09.22。
    const secs = steps / 5 / Utility.toNumber(args.SECS);
    this.glide(
      { SECS: secs, X: util.target.x + dx, Y: util.target.y + dy },
      util
    );
  }
  /**
   * 自定义  下移函数
   * @param {*} args
   * @param {*} util
   */
  moveDown(args, util) {
    const steps = Utility.toNumber(args.STEPS);
    const radians = Utility.degToRad(0 - util.target.direction);
    const dx = steps * Math.cos(radians) * 10;
    const dy = steps * Math.sin(radians) * 10;
    // util.target.setXY(util.target.x + dx, util.target.y + dy);
    // 原本使用输入值/5/输入的速度值。现在扩展一个速度的输入值 2020.09.22。
    const secs = steps / 5 / Utility.toNumber(args.SECS);
    this.glide(
      { SECS: secs, X: util.target.x + dx, Y: util.target.y + dy },
      util
    );
  }

  /**
   * 自定义  跳跃函数
   * @param {*} args
   * @param {*} util
   */
  moveJump(args, util) {
    const steps = Utility.toNumber(args.HEIGHT);
    const radians = Utility.degToRad(0 - util.target.direction);
    const dx = steps * Math.cos(radians) * 10;
    const dy = steps * Math.sin(radians) * 10;
    // eslint-disable-next-line no-console
    // this.glide({SECS: '1', X: util.target.x + dx, Y: util.target.y + dy}, util);
    const endX = util.target.x + dx;
    const endY = util.target.y + dy;
    // 原本使用输入值/5/输入的速度值。现在扩展一个速度的输入值 2020.09.22。
    const SECS = steps / 5 / Utility.toNumber(args.SECS);

    if (util.stackFrame.timer) {
      const timeElapsed = util.stackFrame.timer.timeElapsed();
      if (timeElapsed < util.stackFrame.duration * 500) {
        // 进行中：移至中间位置.
        const frac = timeElapsed / (util.stackFrame.duration * 500);
        const tmpdx = frac * (util.stackFrame.endX - util.stackFrame.startX);
        const tmpdy = frac * (util.stackFrame.endY - util.stackFrame.startY);
        util.target.setXY(
          util.stackFrame.startX - tmpdx,
          util.stackFrame.startY - tmpdy
        );
        util.yield();
      } else if (
        timeElapsed < util.stackFrame.duration * 1000 &&
        timeElapsed > util.stackFrame.duration * 500
      ) {
        const frac1 =
          (timeElapsed - util.stackFrame.duration * 500) /
          (util.stackFrame.duration * 500);
        const tmpdx1 =
          (1 - frac1) * (util.stackFrame.endX - util.stackFrame.startX);
        const tmpdy1 =
          (1 - frac1) * (util.stackFrame.endY - util.stackFrame.startY);
        util.target.setXY(
          util.stackFrame.startX - tmpdx1,
          util.stackFrame.startY - tmpdy1
        );
        util.yield();
      } else {
        // 完成：移至最终位置.
        util.target.setXY(util.stackFrame.startX, util.stackFrame.startY);
      }
    } else {
      // 第一次：保存数据以备将来使用.
      util.stackFrame.timer = new Timer();
      util.stackFrame.timer.start();
      util.stackFrame.duration = Utility.toNumber(SECS);
      util.stackFrame.startX = util.target.x;
      util.stackFrame.startY = util.target.y;
      util.stackFrame.endX = Utility.toNumber(endX);
      util.stackFrame.endY = Utility.toNumber(endY);
      if (util.stackFrame.duration <= 0) {
        // 持续时间太短，无法滑行.
        util.target.setXY(util.stackFrame.startX, util.stackFrame.startY);
        return;
      }
      util.yield();
    }
  }

  /**
   * 自定义 位置重置函数,方向亦重置
   * @param {*} args
   * @param {*} util
   */
  moveReset(args, util) {
    util.target.setXY(0, 0); // 角色坐标设置为0,0
    util.target.setDirection(90); // 角色方向设置为正向
  }

  /** KID-PRO 指令 实现 */
  moveSteps(args, util) {
    console.log("pro移动指定步:", args, util);
    const steps = Utility.toNumber(args.STEPS);
    const radians = Utility.degToRad(90 - util.target.direction);
    const dx = steps * Math.cos(radians);
    const dy = steps * Math.sin(radians);
    util.target.setXY(util.target.x + dx, util.target.y + dy);
  }

  goToXY(args, util) {
    const x = Utility.toNumber(args.X);
    const y = Utility.toNumber(args.Y);
    util.target.setXY(x, y);
  }

  getTargetXY(targetName, util) {
    let targetX = 0;
    let targetY = 0;
    if (targetName === "_mouse_") {
      targetX = util.ioQuery("mouse", "getScratchX");
      targetY = util.ioQuery("mouse", "getScratchY");
    } else if (targetName === "_random_") {
      const stageWidth = this.runtime.constructor.STAGE_WIDTH;
      const stageHeight = this.runtime.constructor.STAGE_HEIGHT;
      targetX = Math.round(stageWidth * (Math.random() - 0.5));
      targetY = Math.round(stageHeight * (Math.random() - 0.5));
    } else {
      targetName = String(targetName);
      const goToTarget = this.runtime.getSpriteTargetByName(targetName);
      if (!goToTarget) return;
      targetX = goToTarget.x;
      targetY = goToTarget.y;
    }
    return [targetX, targetY];
  }

  goTo(args, util) {
    const targetXY = this.getTargetXY(args.TO, util);
    if (targetXY) {
      util.target.setXY(targetXY[0], targetXY[1]);
    }
  }

  turnRight(args, util) {
    const degrees = Utility.toNumber(args.DEGREES);
    util.target.setDirection(util.target.direction + degrees);
  }

  turnLeft(args, util) {
    const degrees = Utility.toNumber(args.DEGREES);
    util.target.setDirection(util.target.direction - degrees);
  }

  pointInDirection(args, util) {
    console.log("pro面向:", args, util);
    const direction = Utility.toNumber(args.DIRECTION);
    util.target.setDirection(direction);
  }

  pointTowards(args, util) {
    let targetX = 0;
    let targetY = 0;
    if (args.TOWARDS === "_mouse_") {
      targetX = util.ioQuery("mouse", "getScratchX");
      targetY = util.ioQuery("mouse", "getScratchY");
    } else if (args.TOWARDS === "_random_") {
      util.target.setDirection(Math.round(Math.random() * 360) - 180);
      return;
    } else {
      args.TOWARDS = String(args.TOWARDS);
      const pointTarget = this.runtime.getSpriteTargetByName(args.TOWARDS);
      if (!pointTarget) return;
      targetX = pointTarget.x;
      targetY = pointTarget.y;
    }

    const dx = targetX - util.target.x;
    const dy = targetY - util.target.y;
    const direction = 90 - Utility.radToDeg(Math.atan2(dy, dx));
    util.target.setDirection(direction);
  }

  glide(args, util) {
    if (util.stackFrame.timer) {
      const timeElapsed = util.stackFrame.timer.timeElapsed();
      if (timeElapsed < util.stackFrame.duration * 1000) {
        // In progress: move to intermediate position.
        const frac = timeElapsed / (util.stackFrame.duration * 1000);
        const dx = frac * (util.stackFrame.endX - util.stackFrame.startX);
        const dy = frac * (util.stackFrame.endY - util.stackFrame.startY);
        util.target.setXY(
          util.stackFrame.startX + dx,
          util.stackFrame.startY + dy
        );
        util.yield();
      } else {
        // Finished: move to final position.
        util.target.setXY(util.stackFrame.endX, util.stackFrame.endY);
      }
    } else {
      // First time: save data for future use.
      util.stackFrame.timer = new Timer();
      util.stackFrame.timer.start();
      util.stackFrame.duration = Utility.toNumber(args.SECS);
      util.stackFrame.startX = util.target.x;
      util.stackFrame.startY = util.target.y;
      util.stackFrame.endX = Utility.toNumber(args.X);
      util.stackFrame.endY = Utility.toNumber(args.Y);
      if (util.stackFrame.duration <= 0) {
        // Duration too short to glide.
        util.target.setXY(util.stackFrame.endX, util.stackFrame.endY);
        return;
      }
      util.yield();
    }
  }

  glideTo(args, util) {
    const targetXY = this.getTargetXY(args.TO, util);
    if (targetXY) {
      this.glide({ SECS: args.SECS, X: targetXY[0], Y: targetXY[1] }, util);
    }
  }

  ifOnEdgeBounce(args, util) {
    const bounds = util.target.getBounds();
    if (!bounds) {
      return;
    }
    // Measure distance to edges.
    // Values are positive when the sprite is far away,
    // and clamped to zero when the sprite is beyond.
    const stageWidth = this.runtime.constructor.STAGE_WIDTH;
    const stageHeight = this.runtime.constructor.STAGE_HEIGHT;
    const distLeft = Math.max(0, stageWidth / 2 + bounds.left);
    const distTop = Math.max(0, stageHeight / 2 - bounds.top);
    const distRight = Math.max(0, stageWidth / 2 - bounds.right);
    const distBottom = Math.max(0, stageHeight / 2 + bounds.bottom);
    // Find the nearest edge.
    let nearestEdge = "";
    let minDist = Infinity;
    if (distLeft < minDist) {
      minDist = distLeft;
      nearestEdge = "left";
    }
    if (distTop < minDist) {
      minDist = distTop;
      nearestEdge = "top";
    }
    if (distRight < minDist) {
      minDist = distRight;
      nearestEdge = "right";
    }
    if (distBottom < minDist) {
      minDist = distBottom;
      nearestEdge = "bottom";
    }
    if (minDist > 0) {
      return; // Not touching any edge.
    }
    // Point away from the nearest edge.
    const radians = Utility.degToRad(90 - util.target.direction);
    let dx = Math.cos(radians);
    let dy = -Math.sin(radians);
    if (nearestEdge === "left") {
      dx = Math.max(0.2, Math.abs(dx));
    } else if (nearestEdge === "top") {
      dy = Math.max(0.2, Math.abs(dy));
    } else if (nearestEdge === "right") {
      dx = 0 - Math.max(0.2, Math.abs(dx));
    } else if (nearestEdge === "bottom") {
      dy = 0 - Math.max(0.2, Math.abs(dy));
    }
    const newDirection = Utility.radToDeg(Math.atan2(dy, dx)) + 90;
    util.target.setDirection(newDirection);
    // Keep within the stage.
    const fencedPosition = util.target.keepInFence(
      util.target.x,
      util.target.y
    );
    util.target.setXY(fencedPosition[0], fencedPosition[1]);
  }

  setRotationStyle(args, util) {
    util.target.setRotationStyle(args.STYLE);
  }

  changeX(args, util) {
    const dx = Utility.toNumber(args.DX);
    util.target.setXY(util.target.x + dx, util.target.y);
  }

  setX(args, util) {
    const x = Utility.toNumber(args.X);
    util.target.setXY(x, util.target.y);
  }

  changeY(args, util) {
    const dy = Utility.toNumber(args.DY);
    util.target.setXY(util.target.x, util.target.y + dy);
  }

  setY(args, util) {
    const y = Utility.toNumber(args.Y);
    util.target.setXY(util.target.x, y);
  }

  getX(args, util) {
    console.log("getX args:", args, util);
    return this.limitPrecision(util.target.x);
  }

  getY(args, util) {
    return this.limitPrecision(util.target.y);
  }

  getDirection(args, util) {
    return util.target.direction;
  }

  // 这对应于Scratch 2中的snapToInteger
  limitPrecision(coordinate) {
    const rounded = Math.round(coordinate);
    const delta = coordinate - rounded;
    const limitedCoord = Math.abs(delta) < 1e-9 ? rounded : coordinate;

    return limitedCoord;
  }
}

/** @module 运算分类 */
class KidOperatorsBlocks {
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
      operator_add: this.add,
      operator_subtract: this.subtract,
      operator_multiply: this.multiply,
      operator_divide: this.divide,
      operator_lt: this.lt,
      operator_equals: this.equals,
      operator_gt: this.gt,
      operator_and: this.and,
      operator_or: this.or,
      operator_not: this.not,
      operator_random: this.random,
      operator_join: this.join,
      operator_letter_of: this.letterOf,
      operator_length: this.length,
      operator_contains: this.contains,
      operator_mod: this.mod,
      operator_round: this.round,
      operator_mathop: this.mathop,
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

/**
 * Occluded boolean value to make its use more understandable.
 * @const {boolean}
 */
const STORE_WAITING = true;

class KidSoundBlocks {
  constructor(runtime) {
    /**
     * The runtime instantiating this block package.
     * @type {Runtime}
     */
    this.runtime = runtime;

    this.waitingSounds = {};

    // Clear sound effects on green flag and stop button events.
    this.stopAllSounds = this.stopAllSounds.bind(this);
    this._stopWaitingSoundsForTarget = this._stopWaitingSoundsForTarget.bind(
      this
    );
    this._clearEffectsForAllTargets = this._clearEffectsForAllTargets.bind(
      this
    );
    if (this.runtime) {
      this.runtime.on("PROJECT_STOP_ALL", this.stopAllSounds);
      this.runtime.on("PROJECT_STOP_ALL", this._clearEffectsForAllTargets);
      this.runtime.on("STOP_FOR_TARGET", this._stopWaitingSoundsForTarget);
      this.runtime.on("PROJECT_START", this._clearEffectsForAllTargets);
    }

    this._onTargetCreated = this._onTargetCreated.bind(this);
    if (this.runtime) {
      runtime.on("targetWasCreated", this._onTargetCreated);
    }
  }

  /**
   * The key to load & store a target's sound-related state.
   * @type {string}
   */
  static get STATE_KEY() {
    return "Scratch.sound";
  }

  /**
   * The default sound-related state, to be used when a target has no existing sound state.
   * @type {SoundState}
   */
  static get DEFAULT_SOUND_STATE() {
    return {
      effects: {
        pitch: 0,
        pan: 0,
      },
    };
  }

  /**
   * The minimum and maximum MIDI note numbers, for clamping the input to play note.
   * @type {{min: number, max: number}}
   */
  static get MIDI_NOTE_RANGE() {
    return { min: 36, max: 96 }; // C2 to C7
  }

  /**
   * The minimum and maximum beat values, for clamping the duration of play note, play drum and rest.
   * 100 beats at the default tempo of 60bpm is 100 seconds.
   * @type {{min: number, max: number}}
   */
  static get BEAT_RANGE() {
    return { min: 0, max: 100 };
  }

  /** The minimum and maximum tempo values, in bpm.
   * @type {{min: number, max: number}}
   */
  static get TEMPO_RANGE() {
    return { min: 20, max: 500 };
  }

  /** The minimum and maximum values for each sound effect.
   * @type {{effect:{min: number, max: number}}}
   */
  static get EFFECT_RANGE() {
    return {
      pitch: { min: -360, max: 360 }, // -3 to 3 octaves
      pan: { min: -100, max: 100 }, // 100% left to 100% right
    };
  }

  /**
   * @param {Target} target - collect sound state for this target.
   * @returns {SoundState} the mutable sound state associated with that target. This will be created if necessary.
   * @private
   */
  _getSoundState(target) {
    let soundState = target.getCustomState(KidSoundBlocks.STATE_KEY);
    if (!soundState) {
      soundState = Utility.cloneSimple(KidSoundBlocks.DEFAULT_SOUND_STATE);
      target.setCustomState(KidSoundBlocks.STATE_KEY, soundState);
      target.soundEffects = soundState.effects;
    }
    return soundState;
  }

  /**
   * When a Target is cloned, clone the sound state.
   * @param {Target} newTarget - the newly created target.
   * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
   * @listens Runtime#event:targetWasCreated
   * @private
   */
  _onTargetCreated(newTarget, sourceTarget) {
    if (sourceTarget) {
      const soundState = sourceTarget.getCustomState(KidSoundBlocks.STATE_KEY);
      if (soundState && newTarget) {
        newTarget.setCustomState(
          KidSoundBlocks.STATE_KEY,
          Utility.cloneSimple(soundState)
        );
        this._syncEffectsForTarget(newTarget);
      }
    }
  }

  /**
   * Retrieve the block primitives implemented by this package.
   * @return {object.<string, Function>} Mapping of opcode to Function.
   */
  getPrimitives() {
    return {
      sound_play: this.playSound,
      sound_playuntildone: this.playSoundAndWait,
      sound_stopallsounds: this.stopAllSounds,
      sound_seteffectto: this.setEffect,
      sound_changeeffectby: this.changeEffect,
      sound_cleareffects: this.clearEffects,
      sound_sounds_menu: this.soundsMenu,
      sound_beats_menu: this.beatsMenu,
      sound_effects_menu: this.effectsMenu,
      sound_setvolumeto: this.setVolume,
      sound_changevolumeby: this.changeVolume,
      sound_volume: this.getVolume,
    };
  }

  getMonitored() {
    return {
      sound_volume: {
        isSpriteSpecific: true,
        getId: (targetId) => `${targetId}_volume`,
      },
    };
  }

  playSound(args, util) {
    // Don't return the promise, it's the only difference for AndWait
    this._playSound(args, util);
  }

  playSoundAndWait(args, util) {
    return this._playSound(args, util, STORE_WAITING);
  }

  _playSound(args, util, storeWaiting) {
    const index = this._getSoundIndex(args.SOUND_MENU, util);
    if (index >= 0) {
      const { target } = util;
      const { sprite } = target;
      const { soundId } = sprite.sounds[index];
      if (sprite.soundBank) {
        if (storeWaiting === STORE_WAITING) {
          this._addWaitingSound(target.id, soundId);
        } else {
          this._removeWaitingSound(target.id, soundId);
        }
        return sprite.soundBank.playSound(target, soundId);
      }
    }
  }

  _addWaitingSound(targetId, soundId) {
    if (!this.waitingSounds[targetId]) {
      this.waitingSounds[targetId] = new Set();
    }
    this.waitingSounds[targetId].add(soundId);
  }

  _removeWaitingSound(targetId, soundId) {
    if (!this.waitingSounds[targetId]) {
      return;
    }
    this.waitingSounds[targetId].delete(soundId);
  }

  _getSoundIndex(soundName, util) {
    // if the sprite has no sounds, return -1
    const len = util.target.sprite.sounds.length;
    if (len === 0) {
      return -1;
    }

    // look up by name first
    const index = this.getSoundIndexByName(soundName, util);
    if (index !== -1) {
      return index;
    }

    // then try using the sound name as a 1-indexed index
    const oneIndexedIndex = parseInt(soundName, 10);
    if (!isNaN(oneIndexedIndex)) {
      return Utility.wrapClamp(oneIndexedIndex - 1, 0, len - 1);
    }

    // could not be found as a name or converted to index, return -1
    return -1;
  }

  getSoundIndexByName(soundName, util) {
    const sounds = util.target.sprite.sounds;
    for (let i = 0; i < sounds.length; i++) {
      if (sounds[i].name === soundName) {
        return i;
      }
    }
    // if there is no sound by that name, return -1
    return -1;
  }

  stopAllSounds() {
    if (this.runtime.targets === null) return;
    const allTargets = this.runtime.targets;
    for (let i = 0; i < allTargets.length; i++) {
      this._stopAllSoundsForTarget(allTargets[i]);
    }
  }

  _stopAllSoundsForTarget(target) {
    if (target.sprite.soundBank) {
      target.sprite.soundBank.stopAllSounds(target);
      if (this.waitingSounds[target.id]) {
        this.waitingSounds[target.id].clear();
      }
    }
  }

  _stopWaitingSoundsForTarget(target) {
    if (target.sprite.soundBank) {
      if (this.waitingSounds[target.id]) {
        for (const soundId of this.waitingSounds[target.id].values()) {
          target.sprite.soundBank.stop(target, soundId);
        }
        this.waitingSounds[target.id].clear();
      }
    }
  }

  setEffect(args, util) {
    return this._updateEffect(args, util, false);
  }

  changeEffect(args, util) {
    return this._updateEffect(args, util, true);
  }

  _updateEffect(args, util, change) {
    const effect = String(args.EFFECT).toLowerCase();
    const value = Utility.toNumber(args.VALUE);

    const soundState = this._getSoundState(util.target);
    if (!soundState.effects.hasOwnProperty(effect)) return;

    if (change) {
      soundState.effects[effect] += value;
    } else {
      soundState.effects[effect] = value;
    }

    const { min, max } = KidSoundBlocks.EFFECT_RANGE[effect];
    soundState.effects[effect] = Utility.clamp(
      soundState.effects[effect],
      min,
      max
    );

    this._syncEffectsForTarget(util.target);
    // Yield until the next tick.
    return Promise.resolve();
  }

  _syncEffectsForTarget(target) {
    if (!target || !target.sprite.soundBank) return;
    target.soundEffects = this._getSoundState(target).effects;

    target.sprite.soundBank.setEffects(target);
  }

  clearEffects(args, util) {
    this._clearEffectsForTarget(util.target);
  }

  _clearEffectsForTarget(target) {
    const soundState = this._getSoundState(target);
    for (const effect in soundState.effects) {
      if (!soundState.effects.hasOwnProperty(effect)) continue;
      soundState.effects[effect] = 0;
    }
    this._syncEffectsForTarget(target);
  }

  _clearEffectsForAllTargets() {
    if (this.runtime.targets === null) return;
    const allTargets = this.runtime.targets;
    for (let i = 0; i < allTargets.length; i++) {
      this._clearEffectsForTarget(allTargets[i]);
    }
  }

  setVolume(args, util) {
    const volume = Utility.toNumber(args.VOLUME);
    return this._updateVolume(volume, util);
  }

  changeVolume(args, util) {
    const volume = Utility.toNumber(args.VOLUME) + util.target.volume;
    return this._updateVolume(volume, util);
  }

  _updateVolume(volume, util) {
    volume = Utility.clamp(volume, 0, 100);
    util.target.volume = volume;
    this._syncEffectsForTarget(util.target);

    // Yield until the next tick.
    return Promise.resolve();
  }

  getVolume(args, util) {
    return util.target.volume;
  }

  soundsMenu(args) {
    return args.SOUND_MENU;
  }

  beatsMenu(args) {
    return args.BEATS;
  }

  effectsMenu(args) {
    return args.EFFECT;
  }
}

class KidSensingBlocks {
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
      sensing_touchingobject: this.touchingObject,
      sensing_touchingcolor: this.touchingColor,
      sensing_coloristouchingcolor: this.colorTouchingColor,
      sensing_distanceto: this.distanceTo,
      sensing_timer: this.getTimer,
      sensing_resettimer: this.resetTimer,
      sensing_of: this.getAttributeOf,
      sensing_mousex: this.getMouseX,
      sensing_mousey: this.getMouseY,
      sensing_setdragmode: this.setDragMode,
      sensing_mousedown: this.getMouseDown,
      sensing_keypressed: this.getKeyPressed,
      sensing_current: this.current,
      sensing_dayssince2000: this.daysSince2000,
      sensing_loudness: this.getLoudness,
      sensing_loud: this.isLoud,
      sensing_askandwait: this.askAndWait,
      sensing_answer: this.getAnswer,
      sensing_username: this.getUsername,
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

class KidDataBlocks {
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
      data_variable: this.getVariable,
      data_setvariableto: this.setVariableTo,
      data_changevariableby: this.changeVariableBy,
      data_hidevariable: this.hideVariable,
      data_showvariable: this.showVariable,
      data_listcontents: this.getListContents,
      data_addtolist: this.addToList,
      data_deleteoflist: this.deleteOfList,
      data_deletealloflist: this.deleteAllOfList,
      data_insertatlist: this.insertAtList,
      data_replaceitemoflist: this.replaceItemOfList,
      data_itemoflist: this.getItemOfList,
      data_itemnumoflist: this.getItemNumOfList,
      data_lengthoflist: this.lengthOfList,
      data_listcontainsitem: this.listContainsItem,
      data_hidelist: this.hideList,
      data_showlist: this.showList,
    };
  }

  getVariable(args, util) {
    const variable = util.target.lookupOrCreateVariable(
      args.VARIABLE.id,
      args.VARIABLE.name
    );
    return variable.value;
  }

  setVariableTo(args, util) {
    const variable = util.target.lookupOrCreateVariable(
      args.VARIABLE.id,
      args.VARIABLE.name
    );
    variable.value = args.VALUE;

    if (variable.isCloud) {
      util.ioQuery("cloud", "requestUpdateVariable", [
        variable.name,
        args.VALUE,
      ]);
    }
  }

  changeVariableBy(args, util) {
    const variable = util.target.lookupOrCreateVariable(
      args.VARIABLE.id,
      args.VARIABLE.name
    );
    const castedValue = Utility.toNumber(variable.value);
    const dValue = Utility.toNumber(args.VALUE);
    const newValue = castedValue + dValue;
    variable.value = newValue;

    if (variable.isCloud) {
      util.ioQuery("cloud", "requestUpdateVariable", [variable.name, newValue]);
    }
  }

  changeMonitorVisibility(id, visible) {
    // Send the monitor blocks an event like the flyout checkbox event.
    // This both updates the monitor state and changes the isMonitored block flag.
    this.runtime.monitorBlocks.changeBlock(
      {
        id: id, // Monitor blocks for variables are the variable ID.
        element: "checkbox", // Mimic checkbox event from flyout.
        value: visible,
      },
      this.runtime
    );
  }

  showVariable(args) {
    this.changeMonitorVisibility(args.VARIABLE.id, true);
  }

  hideVariable(args) {
    this.changeMonitorVisibility(args.VARIABLE.id, false);
  }

  showList(args) {
    this.changeMonitorVisibility(args.LIST.id, true);
  }

  hideList(args) {
    this.changeMonitorVisibility(args.LIST.id, false);
  }

  getListContents(args, util) {
    const list = util.target.lookupOrCreateList(args.LIST.id, args.LIST.name);

    // If block is running for monitors, return copy of list as an array if changed.
    if (util.thread.updateMonitor) {
      // Return original list value if up-to-date, which doesn't trigger monitor update.
      if (list._monitorUpToDate) return list.value;
      // If value changed, reset the flag and return a copy to trigger monitor update.
      // Because monitors use Immutable data structures, only new objects trigger updates.
      list._monitorUpToDate = true;
      return list.value.slice();
    }

    // Determine if the list is all single letters.
    // If it is, report contents joined together with no separator.
    // If it's not, report contents joined together with a space.
    let allSingleLetters = true;
    for (let i = 0; i < list.value.length; i++) {
      const listItem = list.value[i];
      if (!(typeof listItem === "string" && listItem.length === 1)) {
        allSingleLetters = false;
        break;
      }
    }
    if (allSingleLetters) {
      return list.value.join("");
    }
    return list.value.join(" ");
  }

  addToList(args, util) {
    const list = util.target.lookupOrCreateList(args.LIST.id, args.LIST.name);
    if (list.value.length < KidDataBlocks.LIST_ITEM_LIMIT) {
      list.value.push(args.ITEM);
      list._monitorUpToDate = false;
    }
  }

  deleteOfList(args, util) {
    const list = util.target.lookupOrCreateList(args.LIST.id, args.LIST.name);
    const index = Utility.toListIndex(args.INDEX, list.value.length, true);
    if (index === Utility.LIST_INVALID) {
      return;
    } else if (index === Utility.LIST_ALL) {
      list.value = [];
      return;
    }
    list.value.splice(index - 1, 1);
    list._monitorUpToDate = false;
  }

  deleteAllOfList(args, util) {
    const list = util.target.lookupOrCreateList(args.LIST.id, args.LIST.name);
    list.value = [];
    return;
  }

  insertAtList(args, util) {
    const item = args.ITEM;
    const list = util.target.lookupOrCreateList(args.LIST.id, args.LIST.name);
    const index = Utility.toListIndex(args.INDEX, list.value.length + 1, false);
    if (index === Utility.LIST_INVALID) return;

    const listLimit = KidDataBlocks.LIST_ITEM_LIMIT;
    if (index > listLimit) return;
    list.value.splice(index - 1, 0, item);
    if (list.value.length > listLimit) {
      // If inserting caused the list to grow larger than the limit,
      // remove the last element in the list
      list.value.pop();
    }
    list._monitorUpToDate = false;
  }

  replaceItemOfList(args, util) {
    const item = args.ITEM;
    const list = util.target.lookupOrCreateList(args.LIST.id, args.LIST.name);
    const index = Utility.toListIndex(args.INDEX, list.value.length, false);
    if (index === Utility.LIST_INVALID) return;

    list.value[index - 1] = item;
    list._monitorUpToDate = false;
  }

  getItemOfList(args, util) {
    const list = util.target.lookupOrCreateList(args.LIST.id, args.LIST.name);
    const index = Utility.toListIndex(args.INDEX, list.value.length, false);
    if (index === Utility.LIST_INVALID) return "";

    return list.value[index - 1];
  }

  getItemNumOfList(args, util) {
    const item = args.ITEM;
    const list = util.target.lookupOrCreateList(args.LIST.id, args.LIST.name);

    // Go through the list items one-by-one using Utility.compare. This is for
    // cases like checking if 123 is contained in a list [4, 7, '123'] --
    // Scratch considers 123 and '123' to be equal.
    for (let i = 0; i < list.value.length; i++) {
      if (Utility.compare(list.value[i], item) === 0) {
        return i + 1;
      }
    }

    // We don't bother using .indexOf() at all, because it would end up with
    // edge cases such as the index of '123' in [4, 7, 123, '123', 9].
    // If we use indexOf(), this block would return 4 instead of 3, because
    // indexOf() sees the first occurence of the string 123 as the fourth
    // item in the list. With Scratch, this would be confusing -- after all,
    // '123' and 123 look the same, so one would expect the block to say
    // that the first occurrence of '123' (or 123) to be the third item.

    // Default to 0 if there's no match. Since Scratch lists are 1-indexed,
    // we don't have to worry about this conflicting with the "this item is
    // the first value" number (in JS that is 0, but in Scratch it's 1).
    return 0;
  }

  lengthOfList(args, util) {
    const list = util.target.lookupOrCreateList(args.LIST.id, args.LIST.name);
    return list.value.length;
  }

  listContainsItem(args, util) {
    const item = args.ITEM;
    const list = util.target.lookupOrCreateList(args.LIST.id, args.LIST.name);
    if (list.value.indexOf(item) >= 0) {
      return true;
    }
    // Try using Scratch comparison operator on each item.
    // (Scratch considers the string '123' equal to the number 123).
    for (let i = 0; i < list.value.length; i++) {
      if (Utility.compare(list.value[i], item) === 0) {
        return true;
      }
    }
    return false;
  }

  /**
   * Type representation for list variables.
   * @const {number}
   */
  static get LIST_ITEM_LIMIT() {
    return 200000;
  }
}

class KidProcedureBlocks {
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
      procedures_definition: this.definition,
      procedures_call: this.call,
      argument_reporter_string_number: this.argumentReporterStringNumber,
      argument_reporter_boolean: this.argumentReporterBoolean,
    };
  }

  definition() {
    // No-op: execute the blocks.
  }

  call(args, util) {
    if (!util.stackFrame.executed) {
      const procedureCode = args.mutation.proccode;
      const paramNamesIdsAndDefaults = util.getProcedureParamNamesIdsAndDefaults(
        procedureCode
      );

      // If null, procedure could not be found, which can happen if custom
      // block is dragged between sprites without the definition.
      // Match Scratch 2.0 behavior and noop.
      if (paramNamesIdsAndDefaults === null) {
        return;
      }

      const [paramNames, paramIds, paramDefaults] = paramNamesIdsAndDefaults;

      // Initialize params for the current stackFrame to {}, even if the procedure does
      // not take any arguments. This is so that `getParam` down the line does not look
      // at earlier stack frames for the values of a given parameter (#1729)
      util.initParams();
      for (let i = 0; i < paramIds.length; i++) {
        if (args.hasOwnProperty(paramIds[i])) {
          util.pushParam(paramNames[i], args[paramIds[i]]);
        } else {
          util.pushParam(paramNames[i], paramDefaults[i]);
        }
      }

      util.stackFrame.executed = true;
      util.startProcedure(procedureCode);
    }
  }

  argumentReporterStringNumber(args, util) {
    const value = util.getParam(args.VALUE);
    if (value === null) {
      // When the parameter is not found in the most recent procedure
      // call, the default is always 0.
      return 0;
    }
    return value;
  }

  argumentReporterBoolean(args, util) {
    const value = util.getParam(args.VALUE);
    if (value === null) {
      // When the parameter is not found in the most recent procedure
      // call, the default is always 0.
      return 0;
    }
    return value;
  }
}

/**
 * 笔颜色参数值的枚举.
 * @readonly
 * @enum {string}
 */
const ColorParam = {
  COLOR: "color",
  SATURATION: "saturation",
  BRIGHTNESS: "brightness",
  TRANSPARENCY: "transparency",
};

/**
 * @typedef {object} PenState - 与特定目标关联的笔状态.
 * @property {Boolean} penDown - 跟踪笔是否应为此目标绘制.
 * @property {number} color - 笔的当前颜色（色相）.
 * @property {PenAttributes} penAttributes - 渲染器的缓存笔属性。 这是直径的权威值，而不是笔的颜色.
 */
/**
 * Scratch 3.0中与笔相关的块的主机
 * @param {Runtime} runtime - 运行时实例化此块包
 * @constructor
 */
class KidPenBlocks {
  constructor(runtime) {
    /**
     * 运行时实例化此块包
     * @type {Runtime}
     */
    this.runtime = runtime;

    /**
     * 笔层对应的渲染器Drawable的ID.
     * @type {int}
     * @private
     */
    this._penDrawableId = -1;

    /**
     * 与笔层相对应的渲染器外观的ID.
     * @type {int}
     * @private
     */
    this._penSkinId = -1;

    this._onTargetCreated = this._onTargetCreated.bind(this);
    this._onTargetMoved = this._onTargetMoved.bind(this);

    runtime.on("targetWasCreated", this._onTargetCreated);
    runtime.on("RUNTIME_DISPOSED", this.penClear.bind(this));
  }

  /**
   * 默认画笔状态, 当目标不存在画笔状态时使用.
   * @type {PenState}
   */
  static get DEFAULT_PEN_STATE() {
    return {
      penDown: false,
      color: 66.66,
      saturation: 100,
      brightness: 100,
      transparency: 0,
      _shade: 50, // 仅用于遗留的“改变阴影”块
      penAttributes: {
        color4f: [0, 0, 1, 1],
        diameter: 1,
      },
    };
  }
  /**
   * 笔的最小和最大尺寸.
   * 最大值是舞台对角线的两倍，因此即使是舞台下的精灵也可以填充它.
   * @type {{min: number, max: number}}
   */
  static get PEN_SIZE_RANGE() {
    return { min: 1, max: 1200 };
  }
  /**
   * 加载和存储目标笔相关状态的键.
   * @type {string}
   */
  static get STATE_KEY() {
    return "Scratch.pen";
  }

  /**
   * 检索此程序包实现的块原语
   * @return {object.<string, Function>} 操作码到功能的映射.
   */
  getPrimitives() {
    return {
      pen_clear: this.penClear, // 绘画.清理
      pen_down: this.penDown, // 绘画.落笔
      pen_up: this.penUp, // 绘画.抬笔
      pen_setcolorto: this.setPenColorToColor, // 绘画.设置颜色
    };
  }

  /**
   * 将笔大小值限制在笔允许的范围内.
   * @param {number} requestedSize - 要求的笔号.
   * @returns {number} the clamped size.
   * @private
   */
  _clampPenSize(requestedSize) {
    return Utility.clamp(
      requestedSize,
      KidPenBlocks.PEN_SIZE_RANGE.min,
      KidPenBlocks.PEN_SIZE_RANGE.max
    );
  }

  /**
   * 检索与笔层相对应的渲染器“ Skin”的ID。 如果笔皮肤还不存在，请创建它.
   * @returns {int} 笔层的皮肤ID，如果失败，则为-1.
   * @private
   */
  _getPenLayerID() {
    if (this._penSkinId < 0 && this.runtime.renderer) {
      this._penSkinId = this.runtime.renderer.createPenSkin();
      this._penDrawableId = this.runtime.renderer.createDrawable(
        StageLayering.PEN_LAYER
      );
      this.runtime.renderer.updateDrawableProperties(this._penDrawableId, {
        skinId: this._penSkinId,
      });
    }
    return this._penSkinId;
  }

  /**
   * @param {Target} target - 收集该目标的笔状态。 可能但不一定是渲染目标.
   * @returns {PenState} 与该目标关联的可变笔状态。 这将在必要时创建.
   * @private
   */
  _getPenState(target) {
    let penState = target.getCustomState(KidPenBlocks.STATE_KEY);
    if (!penState) {
      penState = Utility.cloneSimple(KidPenBlocks.DEFAULT_PEN_STATE);
      target.setCustomState(KidPenBlocks.STATE_KEY, penState);
    }
    return penState;
  }

  /**
   * 克隆使用笔的目标时，克隆笔状态.
   * @param {Target} newTarget - 新创建的目标.
   * @param {Target} [sourceTarget] - 用作新克隆源的目标（如果有）.
   * @listens Runtime#event:targetWasCreated
   * @private
   */
  _onTargetCreated(newTarget, sourceTarget) {
    if (sourceTarget) {
      const penState = sourceTarget.getCustomState(KidPenBlocks.STATE_KEY);
      if (penState) {
        newTarget.setCustomState(
          KidPenBlocks.STATE_KEY,
          Utility.cloneSimple(penState)
        );
        if (penState.penDown) {
          console.log("笔落下:", penState);
          newTarget.addListener(
            RenderedTarget.EVENT_TARGET_MOVED,
            this._onTargetMoved
          );
        }
      }
    }
  }

  /**
   * 处理已移动的目标。 仅在笔落下时才会触发.
   * @param {RenderedTarget} target - 已移动的目标.
   * @param {number} oldX - 先前的X位置.
   * @param {number} oldY - 先前的Y位置.
   * @param {boolean} isForce - 运动是否被迫.
   * @private
   */
  _onTargetMoved(target, oldX, oldY, isForce) {
    // 仅在不强制移动（即拖动）的情况下移动笔.
    if (!isForce) {
      const penSkinId = this._getPenLayerID();
      if (penSkinId >= 0) {
        const penState = this._getPenState(target);
        this.runtime.renderer.penLine(
          penSkinId,
          penState.penAttributes,
          oldX,
          oldY,
          target.x,
          target.y
        );
        this.runtime.requestRedraw();
      }
    }
  }

  /**
   * 将颜色输入包裹在（0,100）范围内.
   * @param {number} value - the value to be wrapped.
   * @returns {number} the wrapped value.
   * @private
   */
  _wrapColor(value) {
    return Utility.wrapClamp(value, 0, 100);
  }

  /**
   * 将笔颜色参数限制在（0,100）范围内.
   * @param {number} value - the value to be clamped.
   * @returns {number} the clamped value.
   * @private
   */
  _clampColorParam(value) {
    return Utility.clamp(value, 0, 100);
  }

  /**
   * 将Alpha值转换为笔透明度值.
   * Alpha的范围是0到1，其中0是透明的，而1是不透明的.
   * 透明度范围是0到100，其中0是不透明的，而100是透明的.
   * @param {number} alpha - 输入的Alpha值.
   * @returns {number} 透明度值.
   * @private
   */
  _alphaToTransparency(alpha) {
    return (1.0 - alpha) * 100.0;
  }

  /**
   * 将笔的透明度值转换为Alpha值.
   * Alpha的范围是0到1，其中0是透明的，而1是不透明的.
   * 透明度范围是0到100，其中0是不透明的，而100是透明的.
   * @param {number} transparency - 输入透明度值.
   * @returns {number} the alpha value.
   * @private
   */
  _transparencyToAlpha(transparency) {
    return 1.0 - transparency / 100.0;
  }

  /**
   * 自定义  擦除函数
   */
  penClear() {
    const penSkinId = this._getPenLayerID();
    if (penSkinId >= 0) {
      this.runtime.renderer.penClear(penSkinId);
      this.runtime.requestRedraw();
    }
  }

  /**
   * 自定义  落笔函数
   * "pen down"块使目标在以后的运动中留下笔迹
   * @param {*} args 积木参数
   * @param {*} util 运行时提供的实用程序对象
   */
  penDown(args, util) {
    // console.log("pen_down积木", "args:", args, "util:", util);
    const target = util.target;
    const penState = this._getPenState(target);

    if (!penState.penDown) {
      penState.penDown = true;
      target.addListener(
        RenderedTarget.EVENT_TARGET_MOVED,
        this._onTargetMoved
      );
    }

    const penSkinId = this._getPenLayerID();
    if (penSkinId >= 0) {
      this.runtime.renderer.penPoint(
        penSkinId,
        penState.penAttributes,
        target.x,
        target.y
      );
      this.runtime.requestRedraw();
    }
  }
  /**
   * The pen "pen up" block stops the target from leaving pen trails.
   * @param {object} args - the block arguments.
   * @param {object} util - utility object provided by the runtime.
   */
  penUp(args, util) {
    // console.log("pen_up积木", "args:", args, "util:", util);
    const target = util.target;
    const penState = this._getPenState(target);

    if (penState.penDown) {
      penState.penDown = false;
      target.removeListener(
        RenderedTarget.EVENT_TARGET_MOVED,
        this._onTargetMoved
      );
    }
  }

  /**
   * The pen "set pen color to {color}" 将笔设置为特定的RGB颜色
   * 透明度重置为0.
   * @param {object} args - the block arguments.
   *  @property {int} COLOR - 要设置的颜色，表示为24位RGB值（0xRRGGBB）.
   * @param {object} util - utility object provided by the runtime.
   */
  setPenColorToColor(args, util) {
    const penState = this._getPenState(util.target);
    const rgb = Utility.toRgbColorObject(args.COLOR);

    const hsv = Utility.rgbToHsv(rgb);
    penState.color = (hsv.h / 360) * 100;
    penState.saturation = hsv.s * 100;
    penState.brightness = hsv.v * 100;
    if (rgb.hasOwnProperty("a")) {
      penState.transparency = 100 * (1 - rgb.a / 255.0);
    } else {
      penState.transparency = 0;
    }

    // 设置旧的“阴影”值的方法与草稿2相同.
    penState._shade = penState.brightness / 2;

    this._updatePenColor(penState);
  }

  /**
   * 根据提供的PenState对象中的颜色，饱和度，亮度和透明度值更新缓存的颜色.
   * @param {PenState} penState - the pen state to update.
   * @private
   */
  _updatePenColor(penState) {
    const rgb = Utility.hsvToRgb({
      h: (penState.color * 360) / 100,
      s: penState.saturation / 100,
      v: penState.brightness / 100,
    });
    penState.penAttributes.color4f[0] = rgb.r / 255.0;
    penState.penAttributes.color4f[1] = rgb.g / 255.0;
    penState.penAttributes.color4f[2] = rgb.b / 255.0;
    penState.penAttributes.color4f[3] = this._transparencyToAlpha(
      penState.transparency
    );
  }

  /**
   * 在笔状态上设置或更改单一颜色参数，并更新笔颜色.
   * @param {ColorParam} param - 要设置或更改的颜色参数的名称.
   * @param {number} value - 用于设置或更改参数的值.
   * @param {PenState} penState - 笔状态更新.
   * @param {boolean} change - 如果为true，则按值更改参数；如果为false，则将参数设置为value.
   * @private
   */
  _setOrChangeColorParam(param, value, penState, change) {
    switch (param) {
      case ColorParam.COLOR:
        penState.color = this._wrapColor(value + (change ? penState.color : 0));
        break;
      case ColorParam.SATURATION:
        penState.saturation = this._clampColorParam(
          value + (change ? penState.saturation : 0)
        );
        break;
      case ColorParam.BRIGHTNESS:
        penState.brightness = this._clampColorParam(
          value + (change ? penState.brightness : 0)
        );
        break;
      case ColorParam.TRANSPARENCY:
        penState.transparency = this._clampColorParam(
          value + (change ? penState.transparency : 0)
        );
        break;
      default:
        console.warn(
          `Tried to set or change unknown color parameter: ${param}`
        );
    }
    this._updatePenColor(penState);
  }

  /**
   * The "change pen {ColorParam} by {number}" block changes one of the pen's color parameters
   * by a given amound.
   * @param {object} args - the block arguments.
   *  @property {ColorParam} COLOR_PARAM - the name of the selected color parameter.
   *  @property {number} VALUE - the amount to change the selected parameter by.
   * @param {object} util - utility object provided by the runtime.
   */
  changePenColorParamBy(args, util) {
    const penState = this._getPenState(util.target);
    this._setOrChangeColorParam(
      args.COLOR_PARAM,
      Utility.toNumber(args.VALUE),
      penState,
      true
    );
  }

  /**
   * The "set pen {ColorParam} to {number}" block sets one of the pen's color parameters
   * to a given amound.
   * @param {object} args - the block arguments.
   *  @property {ColorParam} COLOR_PARAM - the name of the selected color parameter.
   *  @property {number} VALUE - the amount to set the selected parameter to.
   * @param {object} util - utility object provided by the runtime.
   */
  setPenColorParamTo(args, util) {
    const penState = this._getPenState(util.target);
    this._setOrChangeColorParam(
      args.COLOR_PARAM,
      Utility.toNumber(args.VALUE),
      penState,
      false
    );
  }

  /**
   * The pen "change pen size by {number}" block changes the pen size by the given amount.
   * @param {object} args - the block arguments.
   *  @property {number} SIZE - the amount of desired size change.
   * @param {object} util - utility object provided by the runtime.
   */
  changePenSizeBy(args, util) {
    const penAttributes = this._getPenState(util.target).penAttributes;
    penAttributes.diameter = this._clampPenSize(
      penAttributes.diameter + Utility.toNumber(args.SIZE)
    );
  }

  /**
   * The pen "set pen size to {number}" block sets the pen size to the given amount.
   * @param {object} args - the block arguments.
   *  @property {number} SIZE - the amount of desired size change.
   * @param {object} util - utility object provided by the runtime.
   */
  setPenSizeTo(args, util) {
    const penAttributes = this._getPenState(util.target).penAttributes;
    penAttributes.diameter = this._clampPenSize(Utility.toNumber(args.SIZE));
  }

  /* LEGACY OPCODES */
  /**
   * Scratch 2 "hue" param is equivelant to twice the new "color" param.
   * @param {object} args - the block arguments.
   *  @property {number} HUE - the amount to set the hue to.
   * @param {object} util - utility object provided by the runtime.
   */
  setPenHueToNumber(args, util) {
    const penState = this._getPenState(util.target);
    const hueValue = Utility.toNumber(args.HUE);
    const colorValue = hueValue / 2;
    this._setOrChangeColorParam(ColorParam.COLOR, colorValue, penState, false);
    this._setOrChangeColorParam(ColorParam.TRANSPARENCY, 0, penState, false);
    this._legacyUpdatePenColor(penState);
  }

  /**
   * Scratch 2 "hue" param is equivelant to twice the new "color" param.
   * @param {object} args - the block arguments.
   *  @property {number} HUE - the amount of desired hue change.
   * @param {object} util - utility object provided by the runtime.
   */
  changePenHueBy(args, util) {
    const penState = this._getPenState(util.target);
    const hueChange = Utility.toNumber(args.HUE);
    const colorChange = hueChange / 2;
    this._setOrChangeColorParam(ColorParam.COLOR, colorChange, penState, true);

    this._legacyUpdatePenColor(penState);
  }

  /**
   * Use legacy "set shade" code to calculate RGB value for shade,
   * then convert back to HSV and store those components.
   * It is important to also track the given shade in penState._shade
   * because it cannot be accurately backed out of the new HSV later.
   * @param {object} args - the block arguments.
   *  @property {number} SHADE - the amount to set the shade to.
   * @param {object} util - utility object provided by the runtime.
   */
  setPenShadeToNumber(args, util) {
    const penState = this._getPenState(util.target);
    let newShade = Utility.toNumber(args.SHADE);

    // Wrap clamp the new shade value the way scratch 2 did.
    newShade = newShade % 200;
    if (newShade < 0) newShade += 200;

    // And store the shade that was used to compute this new color for later use.
    penState._shade = newShade;

    this._legacyUpdatePenColor(penState);
  }

  /**
   * Because "shade" cannot be backed out of hsv consistently, use the previously
   * stored penState._shade to make the shade change.
   * @param {object} args - the block arguments.
   *  @property {number} SHADE - the amount of desired shade change.
   * @param {object} util - utility object provided by the runtime.
   */
  changePenShadeBy(args, util) {
    const penState = this._getPenState(util.target);
    const shadeChange = Utility.toNumber(args.SHADE);
    this.setPenShadeToNumber({ SHADE: penState._shade + shadeChange }, util);
  }

  /**
   * Update the pen state's color from its hue & shade values, Scratch 2.0 style.
   * @param {object} penState - update the HSV & RGB values in this pen state from its hue & shade values.
   * @private
   */
  _legacyUpdatePenColor(penState) {
    // Create the new color in RGB using the scratch 2 "shade" model
    let rgb = Utility.hsvToRgb({
      h: (penState.color * 360) / 100,
      s: 1,
      v: 1,
    });
    const shade =
      penState._shade > 100 ? 200 - penState._shade : penState._shade;
    if (shade < 50) {
      rgb = Utility.mixRgb(Utility.RGB_BLACK, rgb, (10 + shade) / 60);
    } else {
      rgb = Utility.mixRgb(rgb, Utility.RGB_WHITE, (shade - 50) / 60);
    }

    // Update the pen state according to new color
    const hsv = Utility.rgbToHsv(rgb);
    penState.color = (100 * hsv.h) / 360;
    penState.saturation = 100 * hsv.s;
    penState.brightness = 100 * hsv.v;

    this._updatePenColor(penState);
  }
  /**
   * The pen "stamp" block stamps the current drawable's image onto the pen layer.
   * @param {object} args - the block arguments.
   * @param {object} util - utility object provided by the runtime.
   */
  stamp(args, util) {
    const penSkinId = this._getPenLayerID();
    if (penSkinId >= 0) {
      const target = util.target;
      this.runtime.renderer.penStamp(penSkinId, target.drawableID);
      this.runtime.requestRedraw();
    }
  }
}

const defaultBlockPackages = {
  /** kid-pro版 目前的积木 */
  kid_control: KidControlBlocks,
  kid_event: KidEventBlocks,
  kid_looks: KidLooksBlocks,
  kid_motion: KidMotionBlocks,
  kid_operators: KidOperatorsBlocks,
  kid_sound: KidSoundBlocks,
  kid_sensing: KidSensingBlocks,
  kid_data: KidDataBlocks,
  kid_procedures: KidProcedureBlocks,

  /** kid-jr版 */
  // 引入 音乐分类 绘画分类 （在blocks文件夹下，自定义绘画类积木块逻辑主文件 ）
  kid_pen: KidPenBlocks,

  //   /** 添加新版的积木脚本 */
  //   control: require("../blocks/control"),
  //   event: require("../blocks/event"),
  //   looks: require("../blocks/looks"),
  //   motion: require("../blocks/motion"),
  //   operators: require("../blocks/operators"),
  //   sound: require("../blocks/sound"),
  //   sensing: require("../blocks/sensing"),
  //   // data: require("../blocks/data"),
  //   // procedures: require("../blocks/procedures"),
};

module.exports = defaultBlockPackages;
