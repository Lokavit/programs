const dispatch = require("../dispatch/central-dispatch");
const maybeFormatMessage = require("../util/maybe-format-message");
const BlockType = require("./block-type");
const ArgumentType = require("./argument-type");
const TargetType = require("../extension-support/target-type");
const formatMessage = require("format-message");
const RenderedTarget = require("../sprites/rendered-target");
const StageLayering = require("../engine/stage-layering");

/** 把 core_example合并过来 */
/* eslint-disable-next-line max-len */
const blockIconURICoreExample =
  'data:image/svg+xml,%3Csvg id="rotate-counter-clockwise" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"%3E%3Cdefs%3E%3Cstyle%3E.cls-1%7Bfill:%233d79cc;%7D.cls-2%7Bfill:%23fff;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Erotate-counter-clockwise%3C/title%3E%3Cpath class="cls-1" d="M22.68,12.2a1.6,1.6,0,0,1-1.27.63H13.72a1.59,1.59,0,0,1-1.16-2.58l1.12-1.41a4.82,4.82,0,0,0-3.14-.77,4.31,4.31,0,0,0-2,.8,4.25,4.25,0,0,0-1.34,1.73,5.06,5.06,0,0,0,.54,4.62A5.58,5.58,0,0,0,12,17.74h0a2.26,2.26,0,0,1-.16,4.52A10.25,10.25,0,0,1,3.74,18,10.14,10.14,0,0,1,2.25,8.78,9.7,9.7,0,0,1,5.08,4.64,9.92,9.92,0,0,1,9.66,2.5a10.66,10.66,0,0,1,7.72,1.68l1.08-1.35a1.57,1.57,0,0,1,1.24-.6,1.6,1.6,0,0,1,1.54,1.21l1.7,7.37A1.57,1.57,0,0,1,22.68,12.2Z"/%3E%3Cpath class="cls-2" d="M21.38,11.83H13.77a.59.59,0,0,1-.43-1l1.75-2.19a5.9,5.9,0,0,0-4.7-1.58,5.07,5.07,0,0,0-4.11,3.17A6,6,0,0,0,7,15.77a6.51,6.51,0,0,0,5,2.92,1.31,1.31,0,0,1-.08,2.62,9.3,9.3,0,0,1-7.35-3.82A9.16,9.16,0,0,1,3.17,9.12,8.51,8.51,0,0,1,5.71,5.4,8.76,8.76,0,0,1,9.82,3.48a9.71,9.71,0,0,1,7.75,2.07l1.67-2.1a.59.59,0,0,1,1,.21L22,11.08A.59.59,0,0,1,21.38,11.83Z"/%3E%3C/svg%3E';

/**
 * An example core block implemented using the extension spec.
 * This is not loaded as part of the core blocks in the VM but it is provided
 * and used as part of tests.
 */
class KidCoreExample {
  constructor(runtime) {
    /**
     * The runtime instantiating this block package.
     * @type {Runtime}
     */
    this.runtime = runtime;
  }

  /**
   * @returns {object} metadata for this extension and its blocks.
   */
  getInfo() {
    return {
      id: "coreExample",
      name: "CoreEx", // This string does not need to be translated as this extension is only used as an example.
      blocks: [
        {
          func: "MAKE_A_VARIABLE",
          blockType: BlockType.BUTTON,
          text: "make a variable (CoreEx)",
        },
        {
          opcode: "exampleOpcode",
          blockType: BlockType.REPORTER,
          text: "example block",
        },
        {
          opcode: "exampleWithInlineImage",
          blockType: BlockType.COMMAND,
          text: "block with image [CLOCKWISE] inline",
          arguments: {
            CLOCKWISE: {
              type: ArgumentType.IMAGE,
              dataURI: blockIconURICoreExample,
            },
          },
        },
      ],
    };
  }

  /**
   * Example opcode just returns the name of the stage target.
   * @returns {string} The name of the first target in the project.
   */
  exampleOpcode() {
    const stage = this.runtime.getTargetForStage();
    return stage ? stage.getName() : "no stage yet";
  }

  exampleWithInlineImage() {
    return;
  }
}

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURIPenBlocks =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+cGVuLWljb248L3RpdGxlPjxnIHN0cm9rZT0iIzU3NUU3NSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04Ljc1MyAzNC42MDJsLTQuMjUgMS43OCAxLjc4My00LjIzN2MxLjIxOC0yLjg5MiAyLjkwNy01LjQyMyA1LjAzLTcuNTM4TDMxLjA2NiA0LjkzYy44NDYtLjg0MiAyLjY1LS40MSA0LjAzMi45NjcgMS4zOCAxLjM3NSAxLjgxNiAzLjE3My45NyA0LjAxNUwxNi4zMTggMjkuNTljLTIuMTIzIDIuMTE2LTQuNjY0IDMuOC03LjU2NSA1LjAxMiIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0yOS40MSA2LjExcy00LjQ1LTIuMzc4LTguMjAyIDUuNzcyYy0xLjczNCAzLjc2Ni00LjM1IDEuNTQ2LTQuMzUgMS41NDYiLz48cGF0aCBkPSJNMzYuNDIgOC44MjVjMCAuNDYzLS4xNC44NzMtLjQzMiAxLjE2NGwtOS4zMzUgOS4zYy4yODItLjI5LjQxLS42NjguNDEtMS4xMiAwLS44NzQtLjUwNy0xLjk2My0xLjQwNi0yLjg2OC0xLjM2Mi0xLjM1OC0zLjE0Ny0xLjgtNC4wMDItLjk5TDMwLjk5IDUuMDFjLjg0NC0uODQgMi42NS0uNDEgNC4wMzUuOTYuODk4LjkwNCAxLjM5NiAxLjk4MiAxLjM5NiAyLjg1NU0xMC41MTUgMzMuNzc0Yy0uNTczLjMwMi0xLjE1Ny41Ny0xLjc2NC44M0w0LjUgMzYuMzgybDEuNzg2LTQuMjM1Yy4yNTgtLjYwNC41My0xLjE4Ni44MzMtMS43NTcuNjkuMTgzIDEuNDQ4LjYyNSAyLjEwOCAxLjI4Mi42Ni42NTggMS4xMDIgMS40MTIgMS4yODcgMi4xMDIiIGZpbGw9IiM0Qzk3RkYiLz48cGF0aCBkPSJNMzYuNDk4IDguNzQ4YzAgLjQ2NC0uMTQuODc0LS40MzMgMS4xNjVsLTE5Ljc0MiAxOS42OGMtMi4xMyAyLjExLTQuNjczIDMuNzkzLTcuNTcyIDUuMDFMNC41IDM2LjM4bC45NzQtMi4zMTYgMS45MjUtLjgwOGMyLjg5OC0xLjIxOCA1LjQ0LTIuOSA3LjU3LTUuMDFsMTkuNzQzLTE5LjY4Yy4yOTItLjI5Mi40MzItLjcwMi40MzItMS4xNjUgMC0uNjQ2LS4yNy0xLjQtLjc4LTIuMTIyLjI1LjE3Mi41LjM3Ny43MzcuNjE0Ljg5OC45MDUgMS4zOTYgMS45ODMgMS4zOTYgMi44NTYiIGZpbGw9IiM1NzVFNzUiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGQ9Ik0xOC40NSAxMi44M2MwIC41LS40MDQuOTA1LS45MDQuOTA1cy0uOTA1LS40MDUtLjkwNS0uOTA0YzAtLjUuNDA3LS45MDMuOTA2LS45MDMuNSAwIC45MDQuNDA0LjkwNC45MDR6IiBmaWxsPSIjNTc1RTc1Ii8+PC9nPjwvc3ZnPg==";

/**
 * Enum for pen color parameter values.
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
 * @typedef {object} PenState - the pen state associated with a particular target.
 * @property {Boolean} penDown - tracks whether the pen should draw for this target.
 * @property {number} color - the current color (hue) of the pen.
 * @property {PenAttributes} penAttributes - cached pen attributes for the renderer. This is the authoritative value for
 *   diameter but not for pen color.
 */

/**
 * Host for the Pen-related blocks in Scratch 3.0
 * @param {Runtime} runtime - the runtime instantiating this block package.
 * @constructor
 */
class kidPenBlocksExtensions {
  constructor(runtime) {
    /**
     * The runtime instantiating this block package.
     * @type {Runtime}
     */
    this.runtime = runtime;

    /**
     * The ID of the renderer Drawable corresponding to the pen layer.
     * @type {int}
     * @private
     */
    this._penDrawableId = -1;

    /**
     * The ID of the renderer Skin corresponding to the pen layer.
     * @type {int}
     * @private
     */
    this._penSkinId = -1;

    this._onTargetCreated = this._onTargetCreated.bind(this);
    this._onTargetMoved = this._onTargetMoved.bind(this);

    runtime.on("targetWasCreated", this._onTargetCreated);
    runtime.on("RUNTIME_DISPOSED", this.clear.bind(this));
  }

  /**
   * The default pen state, to be used when a target has no existing pen state.
   * @type {PenState}
   */
  static get DEFAULT_PEN_STATE() {
    return {
      penDown: false,
      color: 66.66,
      saturation: 100,
      brightness: 100,
      transparency: 0,
      _shade: 50, // Used only for legacy `change shade by` blocks
      penAttributes: {
        color4f: [0, 0, 1, 1],
        diameter: 1,
      },
    };
  }

  /**
   * The minimum and maximum allowed pen size.
   * The maximum is twice the diagonal of the stage, so that even an
   * off-stage sprite can fill it.
   * @type {{min: number, max: number}}
   */
  static get PEN_SIZE_RANGE() {
    return { min: 1, max: 1200 };
  }

  /**
   * The key to load & store a target's pen-related state.
   * @type {string}
   */
  static get STATE_KEY() {
    return "Scratch.pen";
  }

  /**
   * Clamp a pen size value to the range allowed by the pen.
   * @param {number} requestedSize - the requested pen size.
   * @returns {number} the clamped size.
   * @private
   */
  _clampPenSize(requestedSize) {
    return Utility.clamp(
      requestedSize,
      kidPenBlocksExtensions.PEN_SIZE_RANGE.min,
      kidPenBlocksExtensions.PEN_SIZE_RANGE.max
    );
  }

  /**
   * Retrieve the ID of the renderer "Skin" corresponding to the pen layer. If
   * the pen Skin doesn't yet exist, create it.
   * @returns {int} the Skin ID of the pen layer, or -1 on failure.
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
   * @param {Target} target - collect pen state for this target. Probably, but not necessarily, a RenderedTarget.
   * @returns {PenState} the mutable pen state associated with that target. This will be created if necessary.
   * @private
   */
  _getPenState(target) {
    let penState = target.getCustomState(kidPenBlocksExtensions.STATE_KEY);
    if (!penState) {
      penState = Utility.cloneSimple(kidPenBlocksExtensions.DEFAULT_PEN_STATE);
      target.setCustomState(kidPenBlocksExtensions.STATE_KEY, penState);
    }
    return penState;
  }

  /**
   * When a pen-using Target is cloned, clone the pen state.
   * @param {Target} newTarget - the newly created target.
   * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
   * @listens Runtime#event:targetWasCreated
   * @private
   */
  _onTargetCreated(newTarget, sourceTarget) {
    if (sourceTarget) {
      const penState = sourceTarget.getCustomState(
        kidPenBlocksExtensions.STATE_KEY
      );
      if (penState) {
        newTarget.setCustomState(
          kidPenBlocksExtensions.STATE_KEY,
          Utility.cloneSimple(penState)
        );
        if (penState.penDown) {
          newTarget.addListener(
            RenderedTarget.EVENT_TARGET_MOVED,
            this._onTargetMoved
          );
        }
      }
    }
  }

  /**
   * Handle a target which has moved. This only fires when the pen is down.
   * @param {RenderedTarget} target - the target which has moved.
   * @param {number} oldX - the previous X position.
   * @param {number} oldY - the previous Y position.
   * @param {boolean} isForce - whether the movement was forced.
   * @private
   */
  _onTargetMoved(target, oldX, oldY, isForce) {
    // Only move the pen if the movement isn't forced (ie. dragged).
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
   * Wrap a color input into the range (0,100).
   * @param {number} value - the value to be wrapped.
   * @returns {number} the wrapped value.
   * @private
   */
  _wrapColor(value) {
    return Utility.wrapClamp(value, 0, 100);
  }

  /**
   * Initialize color parameters menu with localized strings
   * @returns {array} of the localized text and values for each menu element
   * @private
   */
  _initColorParam() {
    return [
      {
        text: formatMessage({
          id: "pen.colorMenu.color",
          default: "color",
          description:
            "label for color element in color picker for pen extension",
        }),
        value: ColorParam.COLOR,
      },
      {
        text: formatMessage({
          id: "pen.colorMenu.saturation",
          default: "saturation",
          description:
            "label for saturation element in color picker for pen extension",
        }),
        value: ColorParam.SATURATION,
      },
      {
        text: formatMessage({
          id: "pen.colorMenu.brightness",
          default: "brightness",
          description:
            "label for brightness element in color picker for pen extension",
        }),
        value: ColorParam.BRIGHTNESS,
      },
      {
        text: formatMessage({
          id: "pen.colorMenu.transparency",
          default: "transparency",
          description:
            "label for transparency element in color picker for pen extension",
        }),
        value: ColorParam.TRANSPARENCY,
      },
    ];
  }

  /**
   * Clamp a pen color parameter to the range (0,100).
   * @param {number} value - the value to be clamped.
   * @returns {number} the clamped value.
   * @private
   */
  _clampColorParam(value) {
    return Utility.clamp(value, 0, 100);
  }

  /**
   * Convert an alpha value to a pen transparency value.
   * Alpha ranges from 0 to 1, where 0 is transparent and 1 is opaque.
   * Transparency ranges from 0 to 100, where 0 is opaque and 100 is transparent.
   * @param {number} alpha - the input alpha value.
   * @returns {number} the transparency value.
   * @private
   */
  _alphaToTransparency(alpha) {
    return (1.0 - alpha) * 100.0;
  }

  /**
   * Convert a pen transparency value to an alpha value.
   * Alpha ranges from 0 to 1, where 0 is transparent and 1 is opaque.
   * Transparency ranges from 0 to 100, where 0 is opaque and 100 is transparent.
   * @param {number} transparency - the input transparency value.
   * @returns {number} the alpha value.
   * @private
   */
  _transparencyToAlpha(transparency) {
    return 1.0 - transparency / 100.0;
  }

  /**
   * @returns {object} metadata for this extension and its blocks.
   */
  getInfo() {
    return {
      id: "pen",
      name: formatMessage({
        id: "pen.categoryName",
        default: "Pen",
        description: "Label for the pen extension category",
      }),
      blockIconURI: blockIconURIPenBlocks,
      blocks: [
        {
          opcode: "clear",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "pen.clear",
            default: "erase all",
            description: "erase all pen trails and stamps",
          }),
        },
        {
          opcode: "stamp",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "pen.stamp",
            default: "stamp",
            description: "render current costume on the background",
          }),
          filter: [TargetType.SPRITE],
        },
        {
          opcode: "penDown",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "pen.penDown",
            default: "pen down",
            description: "start leaving a trail when the sprite moves",
          }),
          filter: [TargetType.SPRITE],
        },
        {
          opcode: "penUp",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "pen.penUp",
            default: "pen up",
            description: "stop leaving a trail behind the sprite",
          }),
          filter: [TargetType.SPRITE],
        },
        {
          opcode: "setPenColorToColor",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "pen.setColor",
            default: "set pen color to [COLOR]",
            description: "set the pen color to a particular (RGB) value",
          }),
          arguments: {
            COLOR: {
              type: ArgumentType.COLOR,
            },
          },
          filter: [TargetType.SPRITE],
        },
        {
          opcode: "changePenColorParamBy",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "pen.changeColorParam",
            default: "change pen [COLOR_PARAM] by [VALUE]",
            description: "change the state of a pen color parameter",
          }),
          arguments: {
            COLOR_PARAM: {
              type: ArgumentType.STRING,
              menu: "colorParam",
              defaultValue: ColorParam.COLOR,
            },
            VALUE: {
              type: ArgumentType.NUMBER,
              defaultValue: 10,
            },
          },
          filter: [TargetType.SPRITE],
        },
        {
          opcode: "setPenColorParamTo",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "pen.setColorParam",
            default: "set pen [COLOR_PARAM] to [VALUE]",
            description:
              "set the state for a pen color parameter e.g. saturation",
          }),
          arguments: {
            COLOR_PARAM: {
              type: ArgumentType.STRING,
              menu: "colorParam",
              defaultValue: ColorParam.COLOR,
            },
            VALUE: {
              type: ArgumentType.NUMBER,
              defaultValue: 50,
            },
          },
          filter: [TargetType.SPRITE],
        },
        {
          opcode: "changePenSizeBy",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "pen.changeSize",
            default: "change pen size by [SIZE]",
            description: "change the diameter of the trail left by a sprite",
          }),
          arguments: {
            SIZE: {
              type: ArgumentType.NUMBER,
              defaultValue: 1,
            },
          },
          filter: [TargetType.SPRITE],
        },
        {
          opcode: "setPenSizeTo",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "pen.setSize",
            default: "set pen size to [SIZE]",
            description: "set the diameter of a trail left by a sprite",
          }),
          arguments: {
            SIZE: {
              type: ArgumentType.NUMBER,
              defaultValue: 1,
            },
          },
          filter: [TargetType.SPRITE],
        },
        /* Legacy blocks, should not be shown in flyout */
        {
          opcode: "setPenShadeToNumber",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "pen.setShade",
            default: "set pen shade to [SHADE]",
            description: "legacy pen blocks - set pen shade",
          }),
          arguments: {
            SHADE: {
              type: ArgumentType.NUMBER,
              defaultValue: 1,
            },
          },
          hideFromPalette: true,
        },
        {
          opcode: "changePenShadeBy",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "pen.changeShade",
            default: "change pen shade by [SHADE]",
            description: "legacy pen blocks - change pen shade",
          }),
          arguments: {
            SHADE: {
              type: ArgumentType.NUMBER,
              defaultValue: 1,
            },
          },
          hideFromPalette: true,
        },
        {
          opcode: "setPenHueToNumber",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "pen.setHue",
            default: "set pen color to [HUE]",
            description: "legacy pen blocks - set pen color to number",
          }),
          arguments: {
            HUE: {
              type: ArgumentType.NUMBER,
              defaultValue: 1,
            },
          },
          hideFromPalette: true,
        },
        {
          opcode: "changePenHueBy",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "pen.changeHue",
            default: "change pen color by [HUE]",
            description: "legacy pen blocks - change pen color",
          }),
          arguments: {
            HUE: {
              type: ArgumentType.NUMBER,
              defaultValue: 1,
            },
          },
          hideFromPalette: true,
        },
      ],
      menus: {
        colorParam: {
          acceptReporters: true,
          items: this._initColorParam(),
        },
      },
    };
  }

  /**
   * The pen "clear" block clears the pen layer's contents.
   */
  clear() {
    const penSkinId = this._getPenLayerID();
    if (penSkinId >= 0) {
      this.runtime.renderer.penClear(penSkinId);
      this.runtime.requestRedraw();
    }
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

  /**
   * The pen "pen down" block causes the target to leave pen trails on future motion.
   * @param {object} args - the block arguments.
   * @param {object} util - utility object provided by the runtime.
   */
  penDown(args, util) {
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
   * The pen "set pen color to {color}" block sets the pen to a particular RGB color.
   * The transparency is reset to 0.
   * @param {object} args - the block arguments.
   *  @property {int} COLOR - the color to set, expressed as a 24-bit RGB value (0xRRGGBB).
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

    // Set the legacy "shade" value the same way scratch 2 did.
    penState._shade = penState.brightness / 2;

    this._updatePenColor(penState);
  }

  /**
   * Update the cached color from the color, saturation, brightness and transparency values
   * in the provided PenState object.
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
   * Set or change a single color parameter on the pen state, and update the pen color.
   * @param {ColorParam} param - the name of the color parameter to set or change.
   * @param {number} value - the value to set or change the param by.
   * @param {PenState} penState - the pen state to update.
   * @param {boolean} change - if true change param by value, if false set param to value.
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
}

/** @description MIDI音乐资源域名 */
const ASSET_MIDI_HOST =
  window.location.protocol.indexOf("https") != -1
    ? `https://kid.leadersir.net/`
    : `http://kid.leadersir.net/`;
/** @description midi资源url统一部分 */
const ASSET_MIDI_URL = `${ASSET_MIDI_HOST}kid/material/midi/`;

/** @description 用于存储所有midi资源的key及buffer */
let MIDI_BUFFER = {
  "drums/1-snare.mp3": null,
  "drums/2-bass-drum.mp3": null,
  "drums/3-side-stick.mp3": null,
  "drums/4-crash-cymbal.mp3": null,
  "drums/5-open-hi-hat.mp3": null,
  "drums/6-closed-hi-hat.mp3": null,
  "drums/7-tambourine.mp3": null,
  "drums/8-hand-clap.mp3": null,
  "drums/9-claves.mp3": null,
  "drums/10-wood-block.mp3": null,
  "drums/11-cowbell.mp3": null,
  "drums/12-triangle.mp3": null,
  "drums/13-bongo.mp3": null,
  "drums/14-conga.mp3": null,
  "drums/15-cabasa.mp3": null,
  "drums/16-guiro.mp3": null,
  "drums/17-vibraslap.mp3": null,
  "drums/18-cuica.mp3": null,
  "instruments/1-piano/24.mp3": null,
  "instruments/1-piano/36.mp3": null,
  "instruments/1-piano/48.mp3": null,
  "instruments/1-piano/60.mp3": null,
  "instruments/1-piano/72.mp3": null,
  "instruments/1-piano/84.mp3": null,
  "instruments/1-piano/96.mp3": null,
  "instruments/1-piano/108.mp3": null,
  "instruments/2-electric-piano/60.mp3": null,
  "instruments/3-organ/60.mp3": null,
  "instruments/4-guitar/60.mp3": null,
  "instruments/5-electric-guitar/60.mp3": null,
  "instruments/6-bass/36.mp3": null,
  "instruments/6-bass/48.mp3": null,
  "instruments/7-pizzicato/60.mp3": null,
  "instruments/8-cello/36.mp3": null,
  "instruments/8-cello/48.mp3": null,
  "instruments/8-cello/60.mp3": null,
  "instruments/9-trombone/36.mp3": null,
  "instruments/9-trombone/48.mp3": null,
  "instruments/9-trombone/60.mp3": null,
  "instruments/10-clarinet/48.mp3": null,
  "instruments/10-clarinet/60.mp3": null,
  "instruments/11-saxophone/36.mp3": null,
  "instruments/11-saxophone/60.mp3": null,
  "instruments/11-saxophone/84.mp3": null,
  "instruments/12-flute/60.mp3": null,
  "instruments/12-flute/72.mp3": null,
  "instruments/13-wooden-flute/60.mp3": null,
  "instruments/13-wooden-flute/72.mp3": null,
  "instruments/14-bassoon/36.mp3": null,
  "instruments/14-bassoon/48.mp3": null,
  "instruments/14-bassoon/60.mp3": null,
  "instruments/15-choir/48.mp3": null,
  "instruments/15-choir/60.mp3": null,
  "instruments/15-choir/72.mp3": null,
  "instruments/16-vibraphone/60.mp3": null,
  "instruments/16-vibraphone/72.mp3": null,
  "instruments/17-music-box/60.mp3": null,
  "instruments/18-steel-drum/60.mp3": null,
  "instruments/19-marimba/60.mp3": null,
  "instruments/20-synth-lead/60.mp3": null,
  "instruments/21-synth-pad/60.mp3": null,
};

/**
 * @type {string} 显示在每个扩展块左边缘的图标svg，编码为数据URI.
 */
const blockIconURIMusicBlocks =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PHRpdGxlPm11c2ljLWJsb2NrLWljb248L3RpdGxlPjxkZWZzPjxwYXRoIGQ9Ik0zMi4xOCAyNS44NzRDMzIuNjM2IDI4LjE1NyAzMC41MTIgMzAgMjcuNDMzIDMwYy0zLjA3IDAtNS45MjMtMS44NDMtNi4zNzItNC4xMjYtLjQ1OC0yLjI4NSAxLjY2NS00LjEzNiA0Ljc0My00LjEzNi42NDcgMCAxLjI4My4wODQgMS44OS4yMzQuMzM4LjA4Ni42MzcuMTguOTM4LjMwMi44Ny0uMDItLjEwNC0yLjI5NC0xLjgzNS0xMi4yMy0yLjEzNC0xMi4zMDIgMy4wNi0xLjg3IDguNzY4LTIuNzUyIDUuNzA4LS44ODUuMDc2IDQuODItMy42NSAzLjg0NC0zLjcyNC0uOTg3LTQuNjUtNy4xNTMuMjYzIDE0LjczOHptLTE2Ljk5OCA1Ljk5QzE1LjYzIDM0LjE0OCAxMy41MDcgMzYgMTAuNDQgMzZjLTMuMDcgMC01LjkyMi0xLjg1Mi02LjM4LTQuMTM2LS40NDgtMi4yODQgMS42NzQtNC4xMzUgNC43NS00LjEzNSAxLjAwMyAwIDEuOTc1LjE5NiAyLjg1NS41NDMuODIyLS4wNTUtLjE1LTIuMzc3LTEuODYyLTEyLjIyOC0yLjEzMy0xMi4zMDMgMy4wNi0xLjg3IDguNzY0LTIuNzUzIDUuNzA2LS44OTQuMDc2IDQuODItMy42NDggMy44MzQtMy43MjQtLjk4Ny00LjY1LTcuMTUyLjI2MiAxNC43Mzh6IiBpZD0iYSIvPjwvZGVmcz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjx1c2UgZmlsbD0iI0ZGRiIgeGxpbms6aHJlZj0iI2EiLz48cGF0aCBzdHJva2Utb3BhY2l0eT0iLjEiIHN0cm9rZT0iIzAwMCIgZD0iTTI4LjQ1NiAyMS42NzVjLS4wMS0uMzEyLS4wODctLjgyNS0uMjU2LTEuNzAyLS4wOTYtLjQ5NS0uNjEyLTMuMDIyLS43NTMtMy43My0uMzk1LTEuOTgtLjc2LTMuOTItMS4xNDItNi4xMTMtLjczMi00LjIyMy0uNjkzLTYuMDUuMzQ0LTYuNTI3LjUtLjIzIDEuMDYtLjA4IDEuODQuMzUuNDE0LjIyNyAyLjE4MiAxLjM2NSAyLjA3IDEuMjk2IDEuOTk0IDEuMjQyIDMuNDY0IDEuNzc0IDQuOTMgMS41NDggMS41MjYtLjIzNyAyLjUwNC0uMDYgMi44NzYuNjE4LjM0OC42MzUuMDE1IDEuNDE2LS43MyAyLjE4LTEuNDcyIDEuNTE2LTMuOTc1IDIuNTE0LTUuODQ4IDIuMDIzLS44MjItLjIyLTEuMjM4LS40NjUtMi4zOC0xLjI2N2wtLjA5NS0uMDY2Yy4wNDcuNTkzLjI2NCAxLjc0LjcxNyAzLjgwMy4yOTQgMS4zMzYgMi4wOCA5LjE4NyAyLjYzNyAxMS42NzRsLjAwMi4wMTJjLjUyOCAyLjYzNy0xLjg3MyA0LjcyNC01LjIzNiA0LjcyNC0zLjI5IDAtNi4zNjMtMS45ODgtNi44NjItNC41MjgtLjUzLTIuNjQgMS44NzMtNC43MzQgNS4yMzMtNC43MzQuNjcyIDAgMS4zNDcuMDg1IDIuMDE0LjI1LjIyNy4wNTcuNDM2LjExOC42MzYuMTg3em0tMTYuOTk2IDUuOTljLS4wMS0uMzE4LS4wOS0uODM4LS4yNjYtMS43MzctLjA5LS40Ni0uNTk1LTIuOTM3LS43NTMtMy43MjctLjM5LTEuOTYtLjc1LTMuODktMS4xMy02LjA3LS43MzItNC4yMjMtLjY5Mi02LjA1LjM0NC02LjUyNi41MDItLjIzIDEuMDYtLjA4MiAxLjg0LjM1LjQxNS4yMjcgMi4xODIgMS4zNjQgMi4wNyAxLjI5NSAxLjk5MyAxLjI0MiAzLjQ2MiAxLjc3NCA0LjkyNiAxLjU0OCAxLjUyNS0uMjQgMi41MDQtLjA2NCAyLjg3Ni42MTQuMzQ4LjYzNS4wMTUgMS40MTUtLjcyOCAyLjE4LTEuNDc0IDEuNTE3LTMuOTc3IDIuNTEzLTUuODQ3IDIuMDE3LS44Mi0uMjItMS4yMzYtLjQ2NC0yLjM3OC0xLjI2N2wtLjA5NS0uMDY1Yy4wNDcuNTkzLjI2NCAxLjc0LjcxNyAzLjgwMi4yOTQgMS4zMzcgMi4wNzggOS4xOSAyLjYzNiAxMS42NzVsLjAwMy4wMTNjLjUxNyAyLjYzOC0xLjg4NCA0LjczMi01LjIzNCA0LjczMi0zLjI4NyAwLTYuMzYtMS45OTMtNi44Ny00LjU0LS41Mi0yLjY0IDEuODg0LTQuNzMgNS4yNC00LjczLjkwNSAwIDEuODAzLjE1IDIuNjUuNDM2eiIvPjwvZz48L3N2Zz4=";

/**
 * @type {string} 将在类别菜单中显示的图标svg，编码为数据URI.
 */
const menuIconURIMusicBlocks =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTE2LjA5IDEyLjkzN2MuMjI4IDEuMTQxLS44MzMgMi4wNjMtMi4zNzMgMi4wNjMtMS41MzUgMC0yLjk2Mi0uOTIyLTMuMTg2LTIuMDYzLS4yMy0xLjE0Mi44MzMtMi4wNjggMi4zNzItMi4wNjguMzIzIDAgLjY0MS4wNDIuOTQ1LjExN2EzLjUgMy41IDAgMCAxIC40NjguMTUxYy40MzUtLjAxLS4wNTItMS4xNDctLjkxNy02LjExNC0xLjA2Ny02LjE1MiAxLjUzLS45MzUgNC4zODQtMS4zNzcgMi44NTQtLjQ0Mi4wMzggMi40MS0xLjgyNSAxLjkyMi0xLjg2Mi0uNDkzLTIuMzI1LTMuNTc3LjEzMiA3LjM3ek03LjQ2IDguNTYzYy0xLjg2Mi0uNDkzLTIuMzI1LTMuNTc2LjEzIDcuMzdDNy44MTYgMTcuMDczIDYuNzU0IDE4IDUuMjIgMThjLTEuNTM1IDAtMi45NjEtLjkyNi0zLjE5LTIuMDY4LS4yMjQtMS4xNDIuODM3LTIuMDY3IDIuMzc1LTIuMDY3LjUwMSAwIC45ODcuMDk4IDEuNDI3LjI3Mi40MTItLjAyOC0uMDc0LTEuMTg5LS45My02LjExNEMzLjgzNCAxLjg3IDYuNDMgNy4wODcgOS4yODIgNi42NDZjMi44NTQtLjQ0Ny4wMzggMi40MS0xLjgyMyAxLjkxN3oiIGZpbGw9IiM1NzVFNzUiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==";

/**
 * @function 拉取远端资源
 */
async function pullRemoteAssetAsync() {
  console.warn("待拉取的资源名:");
  const temp = Object.keys(MIDI_BUFFER);
  for (let i = 0; i < temp.length; i++) {
    console.warn("遍历拉取", temp[i]);
    const response = await fetch(ASSET_MIDI_URL + temp[i]);
    const blob = await response.blob();
    console.warn("blob:", blob);

    let reader = new FileReader();
    // 开始读取指定的 Blob中的内容, 一旦完成, result 属性中保存的将是被读取文件的 ArrayBuffer 数据对象.
    reader.readAsArrayBuffer(blob);
    // 处理load事件。该事件在读取操作完成时触发。
    reader.onload = function (event) {
      MIDI_BUFFER[temp[i]] = event.target.result;
    };
  }
}
/**
 * 与音乐相关的块的类
 * @param {Runtime} runtime - 运行时实例化此块包.
 * @constructor
 */
class kidMusicBlocks {
  constructor(runtime) {
    this.runtime = runtime;
    /** @type {number} 当前正在同时播放的鼓声和乐器声音的数量. */
    this._concurrencyCounter = 0;

    /** @type {Array} 一组声音播放器，每个鼓声音一个. */
    this._drumPlayers = [];

    /** @type {Array[]} 声音播放器的数组。 每个乐器都有一个或多个音频播放器. */
    this._instrumentPlayerArrays = [];

    /** @type {Array[]} 声音播放器的数组。 每个乐器mya的每个可弹奏音符都有一个音频播放器. */
    this._instrumentPlayerNoteArrays = [];

    /** @type {Array} 音频bufferSourceNodes的数组。 每次您演奏乐器或鼓声时，都会创建一个bufferSourceNode。 我们会保留对它们的引用，以确保可以触发他们的事件. */
    this._bufferSources = [];

    this._onTargetCreated = this._onTargetCreated.bind(this);
    this.runtime.on("targetWasCreated", this._onTargetCreated);

    this._playNoteForPicker = this._playNoteForPicker.bind(this);
    this.runtime.on("PLAY_NOTE", this._playNoteForPicker);

    this._loadAllSounds();
  }

  /**
   * 解码全套鼓声和乐器声音，并将音频缓冲区存储在数组中.
   */
  async _loadAllSounds() {
    console.log("音乐扩展index.js _loadAllSounds");
    // 等待拉取完成。
    await pullRemoteAssetAsync();
    const loadingPromises = [];
    this.DRUM_INFO.forEach((drumInfo, index) => {
      const filePath = `drums/${drumInfo.fileName}`;
      console.log("音乐扩展index.js _loadAllSounds drum", drumInfo);
      const promise = this._storeSound(filePath, index, this._drumPlayers);
      loadingPromises.push(promise);
    });
    this.INSTRUMENT_INFO.forEach((instrumentInfo, instrumentIndex) => {
      this._instrumentPlayerArrays[instrumentIndex] = [];
      this._instrumentPlayerNoteArrays[instrumentIndex] = [];
      instrumentInfo.samples.forEach((sample, noteIndex) => {
        const filePath = `instruments/${instrumentInfo.dirName}/${sample}`;
        console.log(
          "音乐扩展index.js _loadAllSounds instrument",
          instrumentInfo
        );
        const promise = this._storeSound(
          filePath,
          noteIndex,
          this._instrumentPlayerArrays[instrumentIndex]
        );
        loadingPromises.push(promise);
      });
    });
    Promise.all(loadingPromises).then(() => {
      // @TODO: 更新扩展状态指示器.
      console.warn("更新扩展状态指示器");
    });
  }

  /**
   * 解码声音并将播放器存储在阵列中.
   * @param {string} filePath - 音频文件名.
   * @param {number} index - 存储音频播放器的索引.
   * @param {array} playerArray - 存储它的玩家数组.
   * @return {Promise} - 一旦存储声音，诺言就会解决.
   */
  _storeSound(filePath, index, playerArray) {
    console.log("音乐扩展index.js _storeSound", filePath, index, playerArray);
    const fullPath = `${filePath}.mp3`;
    if (!MIDI_BUFFER[fullPath]) return;
    // 声音播放器已通过上面所需的清单文件下载。.
    const soundBuffer = MIDI_BUFFER[fullPath];
    return this._decodeSound(soundBuffer).then((player) => {
      playerArray[index] = player;
    });
  }

  /**
   * 解码声音并使用音频缓冲区返回承诺.
   * @param  {ArrayBuffer} soundBuffer - 包含编码音频的缓冲区.
   * @return {Promise} - 声音解码后将解决的诺言.
   */
  _decodeSound(soundBuffer) {
    console.log("音乐扩展index.js _decodeSound", soundBuffer);
    const engine = this.runtime.audioEngine;

    if (!engine) return Promise.reject(new Error("No Audio Context Detected"));

    // 检查较新的基于承诺的API
    return engine.decodeSoundPlayer({ data: { buffer: soundBuffer } });
  }

  /**
   * 以暂存块格式为菜单创建数据，该数据由具有文本和值属性的对象数组组成。 文本是翻译后的字符串，值是一个索引.
   * @param  {object[]} info - An array of info objects each having a name property.
   * @return {array} - An array of objects with text and value properties.
   * @private
   */
  _buildMenu(info) {
    return info.map((entry, index) => {
      const obj = {};
      obj.text = entry.name;
      obj.value = String(index + 1);
      return obj;
    });
  }

  /**
   * 有关每个鼓的一系列信息.
   * @type {object[]}
   * @param {string} name - the translatable name to display in the drums menu.
   * @param {string} fileName - the name of the audio file containing the drum sound.
   */
  get DRUM_INFO() {
    return [
      {
        name: formatMessage({
          id: "music.drumSnare",
          default: "(1) Snare Drum",
          description: "Sound of snare drum as used in a standard drum kit",
        }),
        fileName: "1-snare",
      },
      {
        name: formatMessage({
          id: "music.drumBass",
          default: "(2) Bass Drum",
          description: "Sound of bass drum as used in a standard drum kit",
        }),
        fileName: "2-bass-drum",
      },
      {
        name: formatMessage({
          id: "music.drumSideStick",
          default: "(3) Side Stick",
          description:
            "Sound of a drum stick hitting the side of a drum (usually the snare)",
        }),
        fileName: "3-side-stick",
      },
      {
        name: formatMessage({
          id: "music.drumCrashCymbal",
          default: "(4) Crash Cymbal",
          description: "Sound of a drum stick hitting a crash cymbal",
        }),
        fileName: "4-crash-cymbal",
      },
      {
        name: formatMessage({
          id: "music.drumOpenHiHat",
          default: "(5) Open Hi-Hat",
          description: "Sound of a drum stick hitting a hi-hat while open",
        }),
        fileName: "5-open-hi-hat",
      },
      {
        name: formatMessage({
          id: "music.drumClosedHiHat",
          default: "(6) Closed Hi-Hat",
          description: "Sound of a drum stick hitting a hi-hat while closed",
        }),
        fileName: "6-closed-hi-hat",
      },
      {
        name: formatMessage({
          id: "music.drumTambourine",
          default: "(7) Tambourine",
          description: "Sound of a tambourine being struck",
        }),
        fileName: "7-tambourine",
      },
      {
        name: formatMessage({
          id: "music.drumHandClap",
          default: "(8) Hand Clap",
          description: "Sound of two hands clapping together",
        }),
        fileName: "8-hand-clap",
      },
      {
        name: formatMessage({
          id: "music.drumClaves",
          default: "(9) Claves",
          description: "Sound of claves being struck together",
        }),
        fileName: "9-claves",
      },
      {
        name: formatMessage({
          id: "music.drumWoodBlock",
          default: "(10) Wood Block",
          description: "Sound of a wood block being struck",
        }),
        fileName: "10-wood-block",
      },
      {
        name: formatMessage({
          id: "music.drumCowbell",
          default: "(11) Cowbell",
          description: "Sound of a cowbell being struck",
        }),
        fileName: "11-cowbell",
      },
      {
        name: formatMessage({
          id: "music.drumTriangle",
          default: "(12) Triangle",
          description: "Sound of a triangle (instrument) being struck",
        }),
        fileName: "12-triangle",
      },
      {
        name: formatMessage({
          id: "music.drumBongo",
          default: "(13) Bongo",
          description: "Sound of a bongo being struck",
        }),
        fileName: "13-bongo",
      },
      {
        name: formatMessage({
          id: "music.drumConga",
          default: "(14) Conga",
          description: "Sound of a conga being struck",
        }),
        fileName: "14-conga",
      },
      {
        name: formatMessage({
          id: "music.drumCabasa",
          default: "(15) Cabasa",
          description: "Sound of a cabasa being shaken",
        }),
        fileName: "15-cabasa",
      },
      {
        name: formatMessage({
          id: "music.drumGuiro",
          default: "(16) Guiro",
          description: "Sound of a guiro being played",
        }),
        fileName: "16-guiro",
      },
      {
        name: formatMessage({
          id: "music.drumVibraslap",
          default: "(17) Vibraslap",
          description: "Sound of a Vibraslap being played",
        }),
        fileName: "17-vibraslap",
      },
      {
        name: formatMessage({
          id: "music.drumCuica",
          default: "(18) Cuica",
          description: "Sound of a cuica being played",
        }),
        fileName: "18-cuica",
      },
    ];
  }

  /**
   * An array of info about each instrument.
   * @type {object[]}
   * @param {string} name - the translatable name to display in the instruments menu.
   * @param {string} dirName - the name of the directory containing audio samples for this instrument.
   * @param {number} [releaseTime] - an optional duration for the release portion of each note.
   * @param {number[]} samples - an array of numbers representing the MIDI note number for each
   *                           sampled sound used to play this instrument.
   */
  get INSTRUMENT_INFO() {
    return [
      {
        name: formatMessage({
          id: "music.instrumentPiano",
          default: "(1) Piano",
          description: "Sound of a piano",
        }),
        dirName: "1-piano",
        releaseTime: 0.5,
        samples: [24, 36, 48, 60, 72, 84, 96, 108],
      },
      {
        name: formatMessage({
          id: "music.instrumentElectricPiano",
          default: "(2) Electric Piano",
          description: "Sound of an electric piano",
        }),
        dirName: "2-electric-piano",
        releaseTime: 0.5,
        samples: [60],
      },
      {
        name: formatMessage({
          id: "music.instrumentOrgan",
          default: "(3) Organ",
          description: "Sound of an organ",
        }),
        dirName: "3-organ",
        releaseTime: 0.5,
        samples: [60],
      },
      {
        name: formatMessage({
          id: "music.instrumentGuitar",
          default: "(4) Guitar",
          description: "Sound of an accoustic guitar",
        }),
        dirName: "4-guitar",
        releaseTime: 0.5,
        samples: [60],
      },
      {
        name: formatMessage({
          id: "music.instrumentElectricGuitar",
          default: "(5) Electric Guitar",
          description: "Sound of an electric guitar",
        }),
        dirName: "5-electric-guitar",
        releaseTime: 0.5,
        samples: [60],
      },
      {
        name: formatMessage({
          id: "music.instrumentBass",
          default: "(6) Bass",
          description: "Sound of an accoustic upright bass",
        }),
        dirName: "6-bass",
        releaseTime: 0.25,
        samples: [36, 48],
      },
      {
        name: formatMessage({
          id: "music.instrumentPizzicato",
          default: "(7) Pizzicato",
          description:
            "Sound of a string instrument (e.g. violin) being plucked",
        }),
        dirName: "7-pizzicato",
        releaseTime: 0.25,
        samples: [60],
      },
      {
        name: formatMessage({
          id: "music.instrumentCello",
          default: "(8) Cello",
          description: "Sound of a cello being played with a bow",
        }),
        dirName: "8-cello",
        releaseTime: 0.1,
        samples: [36, 48, 60],
      },
      {
        name: formatMessage({
          id: "music.instrumentTrombone",
          default: "(9) Trombone",
          description: "Sound of a trombone being played",
        }),
        dirName: "9-trombone",
        samples: [36, 48, 60],
      },
      {
        name: formatMessage({
          id: "music.instrumentClarinet",
          default: "(10) Clarinet",
          description: "Sound of a clarinet being played",
        }),
        dirName: "10-clarinet",
        samples: [48, 60],
      },
      {
        name: formatMessage({
          id: "music.instrumentSaxophone",
          default: "(11) Saxophone",
          description: "Sound of a saxophone being played",
        }),
        dirName: "11-saxophone",
        samples: [36, 60, 84],
      },
      {
        name: formatMessage({
          id: "music.instrumentFlute",
          default: "(12) Flute",
          description: "Sound of a flute being played",
        }),
        dirName: "12-flute",
        samples: [60, 72],
      },
      {
        name: formatMessage({
          id: "music.instrumentWoodenFlute",
          default: "(13) Wooden Flute",
          description: "Sound of a wooden flute being played",
        }),
        dirName: "13-wooden-flute",
        samples: [60, 72],
      },
      {
        name: formatMessage({
          id: "music.instrumentBassoon",
          default: "(14) Bassoon",
          description: "Sound of a bassoon being played",
        }),
        dirName: "14-bassoon",
        samples: [36, 48, 60],
      },
      {
        name: formatMessage({
          id: "music.instrumentChoir",
          default: "(15) Choir",
          description: "Sound of a choir singing",
        }),
        dirName: "15-choir",
        releaseTime: 0.25,
        samples: [48, 60, 72],
      },
      {
        name: formatMessage({
          id: "music.instrumentVibraphone",
          default: "(16) Vibraphone",
          description: "Sound of a vibraphone being struck",
        }),
        dirName: "16-vibraphone",
        releaseTime: 0.5,
        samples: [60, 72],
      },
      {
        name: formatMessage({
          id: "music.instrumentMusicBox",
          default: "(17) Music Box",
          description: "Sound of a music box playing",
        }),
        dirName: "17-music-box",
        releaseTime: 0.25,
        samples: [60],
      },
      {
        name: formatMessage({
          id: "music.instrumentSteelDrum",
          default: "(18) Steel Drum",
          description: "Sound of a steel drum being struck",
        }),
        dirName: "18-steel-drum",
        releaseTime: 0.5,
        samples: [60],
      },
      {
        name: formatMessage({
          id: "music.instrumentMarimba",
          default: "(19) Marimba",
          description: "Sound of a marimba being struck",
        }),
        dirName: "19-marimba",
        samples: [60],
      },
      {
        name: formatMessage({
          id: "music.instrumentSynthLead",
          default: "(20) Synth Lead",
          description: 'Sound of a "lead" synthesizer being played',
        }),
        dirName: "20-synth-lead",
        releaseTime: 0.1,
        samples: [60],
      },
      {
        name: formatMessage({
          id: "music.instrumentSynthPad",
          default: "(21) Synth Pad",
          description: 'Sound of a "pad" synthesizer being played',
        }),
        dirName: "21-synth-pad",
        releaseTime: 0.25,
        samples: [60],
      },
    ];
  }

  /**
   * 从MIDI乐器编号到Scratch乐器编号的映射的数组.
   * @type {number[]}
   */
  get MIDI_INSTRUMENTS() {
    return [
      // Acoustic Grand, Bright Acoustic, Electric Grand, Honky-Tonk
      1,
      1,
      1,
      1,
      // Electric Piano 1, Electric Piano 2, Harpsichord, Clavinet
      2,
      2,
      4,
      4,
      // Celesta, Glockenspiel, Music Box, Vibraphone
      17,
      17,
      17,
      16,
      // Marimba, Xylophone, Tubular Bells, Dulcimer
      19,
      16,
      17,
      17,
      // Drawbar Organ, Percussive Organ, Rock Organ, Church Organ
      3,
      3,
      3,
      3,
      // Reed Organ, Accordion, Harmonica, Tango Accordion
      3,
      3,
      3,
      3,
      // Nylon String Guitar, Steel String Guitar, Electric Jazz Guitar, Electric Clean Guitar
      4,
      4,
      5,
      5,
      // Electric Muted Guitar, Overdriven Guitar,Distortion Guitar, Guitar Harmonics
      5,
      5,
      5,
      5,
      // Acoustic Bass, Electric Bass (finger), Electric Bass (pick), Fretless Bass
      6,
      6,
      6,
      6,
      // Slap Bass 1, Slap Bass 2, Synth Bass 1, Synth Bass 2
      6,
      6,
      6,
      6,
      // Violin, Viola, Cello, Contrabass
      8,
      8,
      8,
      8,
      // Tremolo Strings, Pizzicato Strings, Orchestral Strings, Timpani
      8,
      7,
      8,
      19,
      // String Ensemble 1, String Ensemble 2, SynthStrings 1, SynthStrings 2
      8,
      8,
      8,
      8,
      // Choir Aahs, Voice Oohs, Synth Voice, Orchestra Hit
      15,
      15,
      15,
      19,
      // Trumpet, Trombone, Tuba, Muted Trumpet
      9,
      9,
      9,
      9,
      // French Horn, Brass Section, SynthBrass 1, SynthBrass 2
      9,
      9,
      9,
      9,
      // Soprano Sax, Alto Sax, Tenor Sax, Baritone Sax
      11,
      11,
      11,
      11,
      // Oboe, English Horn, Bassoon, Clarinet
      14,
      14,
      14,
      10,
      // Piccolo, Flute, Recorder, Pan Flute
      12,
      12,
      13,
      13,
      // Blown Bottle, Shakuhachi, Whistle, Ocarina
      13,
      13,
      12,
      12,
      // Lead 1 (square), Lead 2 (sawtooth), Lead 3 (calliope), Lead 4 (chiff)
      20,
      20,
      20,
      20,
      // Lead 5 (charang), Lead 6 (voice), Lead 7 (fifths), Lead 8 (bass+lead)
      20,
      20,
      20,
      20,
      // Pad 1 (new age), Pad 2 (warm), Pad 3 (polysynth), Pad 4 (choir)
      21,
      21,
      21,
      21,
      // Pad 5 (bowed), Pad 6 (metallic), Pad 7 (halo), Pad 8 (sweep)
      21,
      21,
      21,
      21,
      // FX 1 (rain), FX 2 (soundtrack), FX 3 (crystal), FX 4 (atmosphere)
      21,
      21,
      21,
      21,
      // FX 5 (brightness), FX 6 (goblins), FX 7 (echoes), FX 8 (sci-fi)
      21,
      21,
      21,
      21,
      // Sitar, Banjo, Shamisen, Koto
      4,
      4,
      4,
      4,
      // Kalimba, Bagpipe, Fiddle, Shanai
      17,
      14,
      8,
      10,
      // Tinkle Bell, Agogo, Steel Drums, Woodblock
      17,
      17,
      18,
      19,
      // Taiko Drum, Melodic Tom, Synth Drum, Reverse Cymbal
      1,
      1,
      1,
      1,
      // Guitar Fret Noise, Breath Noise, Seashore, Bird Tweet
      21,
      21,
      21,
      21,
      // Telephone Ring, Helicopter, Applause, Gunshot
      21,
      21,
      21,
      21,
    ];
  }

  /**
   * 一个数组，它是从范围（35..81）的MIDI鼓号到Scratch鼓号的映射.
   * It's in the format [drumNum, pitch, decay].
   * 目前未使用音调和衰减属性.
   * @type {Array[]}
   */
  get MIDI_DRUMS() {
    return [
      [1, -4], // "BassDrum" in 2.0, "Bass Drum" in 3.0 (which was "Tom" in 2.0)
      [1, 0], // Same as just above
      [2, 0],
      [0, 0],
      [7, 0],
      [0, 2],
      [1, -6, 4],
      [5, 0],
      [1, -3, 3.2],
      [5, 0], // "HiHatPedal" in 2.0, "Closed Hi-Hat" in 3.0
      [1, 0, 3],
      [4, -8],
      [1, 4, 3],
      [1, 7, 2.7],
      [3, -8],
      [1, 10, 2.7],
      [4, -2],
      [3, -11],
      [4, 2],
      [6, 0],
      [3, 0, 3.5],
      [10, 0],
      [3, -8, 3.5],
      [16, -6],
      [4, 2],
      [12, 2],
      [12, 0],
      [13, 0, 0.2],
      [13, 0, 2],
      [13, -5, 2],
      [12, 12],
      [12, 5],
      [10, 19],
      [10, 12],
      [14, 0],
      [14, 0], // "Maracas" in 2.0, "Cabasa" in 3.0 (TODO: pitch up?)
      [17, 12],
      [17, 5],
      [15, 0], // "GuiroShort" in 2.0, "Guiro" in 3.0 (which was "GuiroLong" in 2.0) (TODO: decay?)
      [15, 0],
      [8, 0],
      [9, 0],
      [9, -4],
      [17, -5],
      [17, 0],
      [11, -6, 1],
      [11, -6, 3],
    ];
  }

  /**
   * The key to load & store a target's music-related state.
   * @type {string}
   */
  static get STATE_KEY() {
    return "Scratch.music";
  }

  /**
   * The default music-related state, to be used when a target has no existing music state.
   * @type {MusicState}
   */
  static get DEFAULT_MUSIC_STATE() {
    return {
      currentInstrument: 0,
    };
  }

  /**
   * The minimum and maximum MIDI note numbers, for clamping the input to play note.
   * @type {{min: number, max: number}}
   */
  static get MIDI_NOTE_RANGE() {
    return { min: 0, max: 130 };
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

  /**
   * The maximum number of sounds to allow to play simultaneously.
   * @type {number}
   */
  static get CONCURRENCY_LIMIT() {
    return 30;
  }

  /**
   * @param {Target} target - collect music state for this target.
   * @returns {MusicState} the mutable music state associated with that target. This will be created if necessary.
   * @private
   */
  _getMusicState(target) {
    let musicState = target.getCustomState(kidMusicBlocks.STATE_KEY);
    if (!musicState) {
      musicState = Utility.cloneSimple(kidMusicBlocks.DEFAULT_MUSIC_STATE);
      target.setCustomState(kidMusicBlocks.STATE_KEY, musicState);
    }
    return musicState;
  }

  /**
   * When a music-playing Target is cloned, clone the music state.
   * @param {Target} newTarget - the newly created target.
   * @param {Target} [sourceTarget] - the target used as a source for the new clone, if any.
   * @listens Runtime#event:targetWasCreated
   * @private
   */
  _onTargetCreated(newTarget, sourceTarget) {
    if (sourceTarget) {
      const musicState = sourceTarget.getCustomState(kidMusicBlocks.STATE_KEY);
      if (musicState) {
        newTarget.setCustomState(
          kidMusicBlocks.STATE_KEY,
          Utility.cloneSimple(musicState)
        );
      }
    }
  }

  /**
   * @returns {object} 此扩展及其块的元数据.
   */
  getInfo() {
    return {
      id: "music",
      name: formatMessage({
        id: "music.categoryName",
        default: "Music",
        description: "Label for the Music extension category",
      }),
      menuIconURI: menuIconURIMusicBlocks,
      blockIconURI: blockIconURIMusicBlocks,
      blocks: [
        {
          opcode: "playDrumForBeats",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "music.playDrumForBeats",
            default: "play drum [DRUM] for [BEATS] beats",
            description: "play drum sample for a number of beats",
          }),
          arguments: {
            DRUM: {
              type: ArgumentType.NUMBER,
              menu: "DRUM",
              defaultValue: 1,
            },
            BEATS: {
              type: ArgumentType.NUMBER,
              defaultValue: 0.25,
            },
          },
        },
        {
          opcode: "midiPlayDrumForBeats",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "music.midiPlayDrumForBeats",
            default: "play drum [DRUM] for [BEATS] beats",
            description:
              "play drum sample for a number of beats according to a mapping of MIDI codes",
          }),
          arguments: {
            DRUM: {
              type: ArgumentType.NUMBER,
              menu: "DRUM",
              defaultValue: 1,
            },
            BEATS: {
              type: ArgumentType.NUMBER,
              defaultValue: 0.25,
            },
          },
          hideFromPalette: true,
        },
        {
          opcode: "restForBeats",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "music.restForBeats",
            default: "rest for [BEATS] beats",
            description: "rest (play no sound) for a number of beats",
          }),
          arguments: {
            BEATS: {
              type: ArgumentType.NUMBER,
              defaultValue: 0.25,
            },
          },
        },
        {
          opcode: "playNoteForBeats",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "music.playNoteForBeats",
            default: "play note [NOTE] for [BEATS] beats",
            description: "play a note for a number of beats",
          }),
          arguments: {
            NOTE: {
              type: ArgumentType.NOTE,
              defaultValue: 60,
            },
            BEATS: {
              type: ArgumentType.NUMBER,
              defaultValue: 0.25,
            },
          },
        },
        {
          opcode: "setInstrument",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "music.setInstrument",
            default: "set instrument to [INSTRUMENT]",
            description:
              "set the instrument (e.g. piano, guitar, trombone) for notes played",
          }),
          arguments: {
            INSTRUMENT: {
              type: ArgumentType.NUMBER,
              menu: "INSTRUMENT",
              defaultValue: 1,
            },
          },
        },
        {
          opcode: "midiSetInstrument",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "music.midiSetInstrument",
            default: "set instrument to [INSTRUMENT]",
            description:
              "set the instrument for notes played according to a mapping of MIDI codes",
          }),
          arguments: {
            INSTRUMENT: {
              type: ArgumentType.NUMBER,
              defaultValue: 1,
            },
          },
          hideFromPalette: true,
        },
        {
          opcode: "setTempo",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "music.setTempo",
            default: "set tempo to [TEMPO]",
            description: "set tempo (speed) for notes, drums, and rests played",
          }),
          arguments: {
            TEMPO: {
              type: ArgumentType.NUMBER,
              defaultValue: 60,
            },
          },
        },
        {
          opcode: "changeTempo",
          blockType: BlockType.COMMAND,
          text: formatMessage({
            id: "music.changeTempo",
            default: "change tempo by [TEMPO]",
            description:
              "change tempo (speed) for notes, drums, and rests played",
          }),
          arguments: {
            TEMPO: {
              type: ArgumentType.NUMBER,
              defaultValue: 20,
            },
          },
        },
        {
          opcode: "getTempo",
          text: formatMessage({
            id: "music.getTempo",
            default: "tempo",
            description:
              "get the current tempo (speed) for notes, drums, and rests played",
          }),
          blockType: BlockType.REPORTER,
        },
      ],
      menus: {
        DRUM: {
          acceptReporters: true,
          items: this._buildMenu(this.DRUM_INFO),
        },
        INSTRUMENT: {
          acceptReporters: true,
          items: this._buildMenu(this.INSTRUMENT_INFO),
        },
      },
    };
  }

  /**
   * Play a drum sound for some number of beats.
   * @param {object} args - the block arguments.
   * @param {object} util - utility object provided by the runtime.
   * @property {int} DRUM - the number of the drum to play.
   * @property {number} BEATS - the duration in beats of the drum sound.
   */
  playDrumForBeats(args, util) {
    this._playDrumForBeats(args.DRUM, args.BEATS, util);
  }

  /**
   * Play a drum sound for some number of beats according to the range of "MIDI" drum codes supported.
   * This block is implemented for compatibility with old Scratch projects that use the
   * 'drum:duration:elapsed:from:' block.
   * @param {object} args - the block arguments.
   * @param {object} util - utility object provided by the runtime.
   */
  midiPlayDrumForBeats(args, util) {
    let drumNum = Utility.toNumber(args.DRUM);
    drumNum = Math.round(drumNum);
    const midiDescription = this.MIDI_DRUMS[drumNum - 35];
    if (midiDescription) {
      drumNum = midiDescription[0];
    } else {
      drumNum = 2; // Default instrument used in Scratch 2.0
    }
    drumNum += 1; // drumNum input to _playDrumForBeats is one-indexed
    this._playDrumForBeats(drumNum, args.BEATS, util);
  }

  /**
   * Internal code to play a drum sound for some number of beats.
   * @param {number} drumNum - the drum number.
   * @param {beats} beats - the duration in beats to pause after playing the sound.
   * @param {object} util - utility object provided by the runtime.
   */
  _playDrumForBeats(drumNum, beats, util) {
    if (this._stackTimerNeedsInit(util)) {
      drumNum = Utility.toNumber(drumNum);
      drumNum = Math.round(drumNum);
      drumNum -= 1; // drums are one-indexed
      drumNum = Utility.wrapClamp(drumNum, 0, this.DRUM_INFO.length - 1);
      beats = Utility.toNumber(beats);
      beats = this._clampBeats(beats);
      this._playDrumNum(util, drumNum);
      this._startStackTimer(util, this._beatsToSec(beats));
    } else {
      this._checkStackTimer(util);
    }
  }

  /**
   * Play a drum sound using its 0-indexed number.
   * @param {object} util - utility object provided by the runtime.
   * @param {number} drumNum - the number of the drum to play.
   * @private
   */
  _playDrumNum(util, drumNum) {
    if (util.runtime.audioEngine === null) return;
    if (util.target.sprite.soundBank === null) return;
    // If we're playing too many sounds, do not play the drum sound.
    if (this._concurrencyCounter > kidMusicBlocks.CONCURRENCY_LIMIT) {
      return;
    }

    const player = this._drumPlayers[drumNum];

    if (typeof player === "undefined") return;

    if (player.isPlaying && !player.isStarting) {
      // Take the internal player state and create a new player with it.
      // `.play` does this internally but then instructs the sound to
      // stop.
      player.take();
    }

    const engine = util.runtime.audioEngine;
    const context = engine.audioContext;
    const volumeGain = context.createGain();
    volumeGain.gain.setValueAtTime(
      util.target.volume / 100,
      engine.currentTime
    );
    volumeGain.connect(engine.getInputNode());

    this._concurrencyCounter++;
    player.once("stop", () => {
      this._concurrencyCounter--;
    });

    player.play();
    // Connect the player to the gain node.
    player.connect({
      getInputNode() {
        return volumeGain;
      },
    });
  }

  /**
   * Rest for some number of beats.
   * @param {object} args - the block arguments.
   * @param {object} util - utility object provided by the runtime.
   * @property {number} BEATS - the duration in beats of the rest.
   */
  restForBeats(args, util) {
    if (this._stackTimerNeedsInit(util)) {
      let beats = Utility.toNumber(args.BEATS);
      beats = this._clampBeats(beats);
      this._startStackTimer(util, this._beatsToSec(beats));
    } else {
      this._checkStackTimer(util);
    }
  }

  /**
   * Play a note using the current musical instrument for some number of beats.
   * This function processes the arguments, and handles the timing of the block's execution.
   * @param {object} args - the block arguments.
   * @param {object} util - utility object provided by the runtime.
   * @property {number} NOTE - the pitch of the note to play, interpreted as a MIDI note number.
   * @property {number} BEATS - the duration in beats of the note.
   */
  playNoteForBeats(args, util) {
    if (this._stackTimerNeedsInit(util)) {
      let note = Utility.toNumber(args.NOTE);
      note = Utility.clamp(
        note,
        kidMusicBlocks.MIDI_NOTE_RANGE.min,
        kidMusicBlocks.MIDI_NOTE_RANGE.max
      );
      let beats = Utility.toNumber(args.BEATS);
      beats = this._clampBeats(beats);
      // If the duration is 0, do not play the note. In Scratch 2.0, "play drum for 0 beats" plays the drum,
      // but "play note for 0 beats" is silent.
      if (beats === 0) return;

      const durationSec = this._beatsToSec(beats);

      this._playNote(util, note, durationSec);

      this._startStackTimer(util, durationSec);
    } else {
      this._checkStackTimer(util);
    }
  }

  _playNoteForPicker(noteNum, category) {
    if (category !== this.getInfo().name) return;
    const util = {
      runtime: this.runtime,
      target: this.runtime.getEditingTarget(),
    };
    this._playNote(util, noteNum, 0.25);
  }

  /**
   * Play a note using the current instrument for a duration in seconds.
   * This function actually plays the sound, and handles the timing of the sound, including the
   * "release" portion of the sound, which continues briefly after the block execution has finished.
   * @param {object} util - utility object provided by the runtime.
   * @param {number} note - the pitch of the note to play, interpreted as a MIDI note number.
   * @param {number} durationSec - the duration in seconds to play the note.
   * @private
   */
  _playNote(util, note, durationSec) {
    if (util.runtime.audioEngine === null) return;
    if (util.target.sprite.soundBank === null) return;

    // If we're playing too many sounds, do not play the note.
    if (this._concurrencyCounter > kidMusicBlocks.CONCURRENCY_LIMIT) {
      return;
    }

    // Determine which of the audio samples for this instrument to play
    const musicState = this._getMusicState(util.target);
    const inst = musicState.currentInstrument;
    const instrumentInfo = this.INSTRUMENT_INFO[inst];
    const sampleArray = instrumentInfo.samples;
    const sampleIndex = this._selectSampleIndexForNote(note, sampleArray);

    // If the audio sample has not loaded yet, bail out
    if (typeof this._instrumentPlayerArrays[inst] === "undefined") return;
    if (typeof this._instrumentPlayerArrays[inst][sampleIndex] === "undefined")
      return;

    // Fetch the sound player to play the note.
    const engine = util.runtime.audioEngine;

    if (!this._instrumentPlayerNoteArrays[inst][note]) {
      this._instrumentPlayerNoteArrays[inst][
        note
      ] = this._instrumentPlayerArrays[inst][sampleIndex].take();
    }

    const player = this._instrumentPlayerNoteArrays[inst][note];

    if (player.isPlaying && !player.isStarting) {
      // Take the internal player state and create a new player with it.
      // `.play` does this internally but then instructs the sound to
      // stop.
      player.take();
    }

    // Set its pitch.
    const sampleNote = sampleArray[sampleIndex];
    const notePitchInterval = this._ratioForPitchInterval(note - sampleNote);

    // Create gain nodes for this note's volume and release, and chain them
    // to the output.
    const context = engine.audioContext;
    const volumeGain = context.createGain();
    volumeGain.gain.setValueAtTime(
      util.target.volume / 100,
      engine.currentTime
    );
    const releaseGain = context.createGain();
    volumeGain.connect(releaseGain);
    releaseGain.connect(engine.getInputNode());

    // Schedule the release of the note, ramping its gain down to zero,
    // and then stopping the sound.
    let releaseDuration = this.INSTRUMENT_INFO[inst].releaseTime;
    if (typeof releaseDuration === "undefined") {
      releaseDuration = 0.01;
    }
    const releaseStart = context.currentTime + durationSec;
    const releaseEnd = releaseStart + releaseDuration;
    releaseGain.gain.setValueAtTime(1, releaseStart);
    releaseGain.gain.linearRampToValueAtTime(0.0001, releaseEnd);

    this._concurrencyCounter++;
    player.once("stop", () => {
      this._concurrencyCounter--;
    });

    // Start playing the note
    player.play();
    // Connect the player to the gain node.
    player.connect({
      getInputNode() {
        return volumeGain;
      },
    });
    // Set playback now after play creates the outputNode.
    player.outputNode.playbackRate.value = notePitchInterval;
    // Schedule playback to stop.
    player.outputNode.stop(releaseEnd);
  }

  /**
   * The samples array for each instrument is the set of pitches of the available audio samples.
   * This function selects the best one to use to play a given input note, and returns its index
   * in the samples array.
   * @param  {number} note - the input note to select a sample for.
   * @param  {number[]} samples - an array of the pitches of the available samples.
   * @return {index} the index of the selected sample in the samples array.
   * @private
   */
  _selectSampleIndexForNote(note, samples) {
    // Step backwards through the array of samples, i.e. in descending pitch, in order to find
    // the sample that is the closest one below (or matching) the pitch of the input note.
    for (let i = samples.length - 1; i >= 0; i--) {
      if (note >= samples[i]) {
        return i;
      }
    }
    return 0;
  }

  /**
   * Calcuate the frequency ratio for a given musical interval.
   * @param  {number} interval - the pitch interval to convert.
   * @return {number} a ratio corresponding to the input interval.
   * @private
   */
  _ratioForPitchInterval(interval) {
    return Math.pow(2, interval / 12);
  }

  /**
   * Clamp a duration in beats to the allowed min and max duration.
   * @param  {number} beats - a duration in beats.
   * @return {number} - the clamped duration.
   * @private
   */
  _clampBeats(beats) {
    return Utility.clamp(
      beats,
      kidMusicBlocks.BEAT_RANGE.min,
      kidMusicBlocks.BEAT_RANGE.max
    );
  }

  /**
   * Convert a number of beats to a number of seconds, using the current tempo.
   * @param  {number} beats - number of beats to convert to secs.
   * @return {number} seconds - number of seconds `beats` will last.
   * @private
   */
  _beatsToSec(beats) {
    return (60 / this.getTempo()) * beats;
  }

  /**
   * Check if the stack timer needs initialization.
   * @param {object} util - utility object provided by the runtime.
   * @return {boolean} - true if the stack timer needs to be initialized.
   * @private
   */
  _stackTimerNeedsInit(util) {
    return !util.stackFrame.timer;
  }

  /**
   * Start the stack timer and the yield the thread if necessary.
   * @param {object} util - utility object provided by the runtime.
   * @param {number} duration - a duration in seconds to set the timer for.
   * @private
   */
  _startStackTimer(util, duration) {
    util.stackFrame.timer = new Timer();
    util.stackFrame.timer.start();
    util.stackFrame.duration = duration;
    util.yield();
  }

  /**
   * Check the stack timer, and if its time is not up yet, yield the thread.
   * @param {object} util - utility object provided by the runtime.
   * @private
   */
  _checkStackTimer(util) {
    const timeElapsed = util.stackFrame.timer.timeElapsed();
    if (timeElapsed < util.stackFrame.duration * 1000) {
      util.yield();
    }
  }

  /**
   * Select an instrument for playing notes.
   * @param {object} args - the block arguments.
   * @param {object} util - utility object provided by the runtime.
   * @property {int} INSTRUMENT - the number of the instrument to select.
   */
  setInstrument(args, util) {
    this._setInstrument(args.INSTRUMENT, util, false);
  }

  /**
   * Select an instrument for playing notes according to a mapping of MIDI codes to Scratch instrument numbers.
   * This block is implemented for compatibility with old Scratch projects that use the 'midiInstrument:' block.
   * @param {object} args - the block arguments.
   * @param {object} util - utility object provided by the runtime.
   * @property {int} INSTRUMENT - the MIDI number of the instrument to select.
   */
  midiSetInstrument(args, util) {
    this._setInstrument(args.INSTRUMENT, util, true);
  }

  /**
   * Internal code to select an instrument for playing notes. If mapMidi is true, set the instrument according to
   * the MIDI to Scratch instrument mapping.
   * @param {number} instNum - the instrument number.
   * @param {object} util - utility object provided by the runtime.
   * @param {boolean} mapMidi - whether or not instNum is a MIDI instrument number.
   */
  _setInstrument(instNum, util, mapMidi) {
    const musicState = this._getMusicState(util.target);
    instNum = Utility.toNumber(instNum);
    instNum = Math.round(instNum);
    instNum -= 1; // instruments are one-indexed
    if (mapMidi) {
      instNum = (this.MIDI_INSTRUMENTS[instNum] || 0) - 1;
    }
    instNum = Utility.wrapClamp(instNum, 0, this.INSTRUMENT_INFO.length - 1);
    musicState.currentInstrument = instNum;
  }

  /**
   * Set the current tempo to a new value.
   * @param {object} args - the block arguments.
   * @property {number} TEMPO - the tempo, in beats per minute.
   */
  setTempo(args) {
    const tempo = Utility.toNumber(args.TEMPO);
    this._updateTempo(tempo);
  }

  /**
   * Change the current tempo by some amount.
   * @param {object} args - the block arguments.
   * @property {number} TEMPO - the amount to change the tempo, in beats per minute.
   */
  changeTempo(args) {
    const change = Utility.toNumber(args.TEMPO);
    const tempo = change + this.getTempo();
    this._updateTempo(tempo);
  }

  /**
   * Update the current tempo, clamping it to the min and max allowable range.
   * @param {number} tempo - the tempo to set, in beats per minute.
   * @private
   */
  _updateTempo(tempo) {
    tempo = Utility.clamp(
      tempo,
      kidMusicBlocks.TEMPO_RANGE.min,
      kidMusicBlocks.TEMPO_RANGE.max
    );
    const stage = this.runtime.getTargetForStage();
    if (stage) {
      stage.tempo = tempo;
    }
  }

  /**
   * Get the current tempo.
   * @return {number} - the current tempo, in beats per minute.
   */
  getTempo() {
    const stage = this.runtime.getTargetForStage();
    if (stage) {
      return stage.tempo;
    }
    return 60;
  }
}

// 这些扩展当前内置于VM存储库中，但不应在启动时加载.
// TODO: 将它们移到单独的存储库中?
// TODO: 更改扩展规范，以便可以通过静态方法收集库信息（包括扩展ID）

const builtinExtensions = {
  // 此示例未与其他核心模块一起加载，但作为将核心模块作为扩展加载的参考.
  coreExample: () => KidCoreExample,
  // 这些是非核心内置扩展.
  pen: () => kidPenBlocksExtensions,
  wedo2: () => require("../extensions/scratch3_wedo2"),
  music: () => kidMusicBlocks,
  microbit: () => require("../extensions/scratch3_microbit"),
  text2speech: () => require("../extensions/scratch3_text2speech"),
  translate: () => require("../extensions/scratch3_translate"),
  videoSensing: () => require("../extensions/scratch3_video_sensing"),
  ev3: () => require("../extensions/scratch3_ev3"),
  makeymakey: () => require("../extensions/scratch3_makeymakey"),
  boost: () => require("../extensions/scratch3_boost"),
  // gdxfor: () => require("../extensions/scratch3_gdx_for"),z
};
console.warn("扩展", builtinExtensions);

/**
 * @typedef {object} ArgumentInfo - Information about an extension block argument
 * @property {ArgumentType} type - the type of value this argument can take
 * @property {*|undefined} default - the default value of this argument (default: blank)
 */

/**
 * @typedef {object} ConvertedBlockInfo - Raw extension block data paired with processed data ready for scratch-blocks
 * @property {ExtensionBlockMetadata} info - the raw block info
 * @property {object} json - the scratch-blocks JSON definition for this block
 * @property {string} xml - the scratch-blocks XML definition for this block
 */

/**
 * @typedef {object} CategoryInfo - Information about a block category
 * @property {string} id - the unique ID of this category
 * @property {string} name - the human-readable name of this category
 * @property {string|undefined} blockIconURI - optional URI for the block icon image
 * @property {string} color1 - the primary color for this category, in '#rrggbb' format
 * @property {string} color2 - the secondary color for this category, in '#rrggbb' format
 * @property {string} color3 - the tertiary color for this category, in '#rrggbb' format
 * @property {Array.<ConvertedBlockInfo>} blocks - the blocks, separators, etc. in this category
 * @property {Array.<object>} menus - the menus provided by this category
 */

/**
 * @typedef {object} PendingExtensionWorker - Information about an extension worker still initializing
 * @property {string} extensionURL - the URL of the extension to be loaded by this worker
 * @property {Function} resolve - function to call on successful worker startup
 * @property {Function} reject - function to call on failed worker startup
 */

class ExtensionManager {
  constructor(runtime) {
    /**
     * The ID number to provide to the next extension worker.
     * @type {int}
     */
    this.nextExtensionWorker = 0;

    /**
     * FIFO queue of extensions which have been requested but not yet loaded in a worker,along with promise resolution functions to call once the worker is ready or failed.
     *
     * @type {Array.<PendingExtensionWorker>}
     */
    this.pendingExtensions = [];

    /**
     * Map of worker ID to workers which have been allocated but have not yet finished initialization.
     * @type {Array.<PendingExtensionWorker>}
     */
    this.pendingWorkers = [];

    /**
     * Set of loaded extension URLs/IDs (equivalent for built-in extensions).
     * @type {Set.<string>}
     * @private
     */
    this._loadedExtensions = new Map();

    /**
     * Keep a reference to the runtime so we can construct internal extension objects.
     * TODO: remove this in favor of extensions accessing the runtime as a service.
     * @type {Runtime}
     */
    this.runtime = runtime;

    dispatch.setService("extensions", this).catch((e) => {
      console.error(
        `ExtensionManager was unable to register extension service: ${JSON.stringify(
          e
        )}`
      );
    });
  }

  /**
   * Check whether an extension is registered or is in the process of loading. This is intended to control loading or
   * adding extensions so it may return `true` before the extension is ready to be used. Use the promise returned by
   * `loadExtensionURL` if you need to wait until the extension is truly ready.
   * @param {string} extensionID - the ID of the extension.
   * @returns {boolean} - true if loaded, false otherwise.
   */
  isExtensionLoaded(extensionID) {
    return this._loadedExtensions.has(extensionID);
  }

  /**
   * Synchronously load an internal extension (core or non-core) by ID. This call will
   * fail if the provided id is not does not match an internal extension.
   * @param {string} extensionId - the ID of an internal extension
   */
  loadExtensionIdSync(extensionId) {
    if (!builtinExtensions.hasOwnProperty(extensionId)) {
      console.warn(
        `Could not find extension ${extensionId} in the built in extensions.`
      );
      return;
    }

    /** @TODO dupe handling for non-builtin extensions. See commit 670e51d33580e8a2e852b3b038bb3afc282f81b9 */
    if (this.isExtensionLoaded(extensionId)) {
      const message = `Rejecting attempt to load a second extension with ID ${extensionId}`;
      console.warn(message);
      return;
    }

    const extension = builtinExtensions[extensionId]();
    const extensionInstance = new extension(this.runtime);
    const serviceName = this._registerInternalExtension(extensionInstance);
    this._loadedExtensions.set(extensionId, serviceName);
  }

  /**
   * Load an extension by URL or internal extension ID
   * @param {string} extensionURL - the URL for the extension to load OR the ID of an internal extension
   * @returns {Promise} resolved once the extension is loaded and initialized or rejected on failure
   */
  loadExtensionURL(extensionURL) {
    if (builtinExtensions.hasOwnProperty(extensionURL)) {
      /** @TODO dupe handling for non-builtin extensions. See commit 670e51d33580e8a2e852b3b038bb3afc282f81b9 */
      if (this.isExtensionLoaded(extensionURL)) {
        const message = `Rejecting attempt to load a second extension with ID ${extensionURL}`;
        console.warn(message);
        return Promise.resolve();
      }

      const extension = builtinExtensions[extensionURL]();
      const extensionInstance = new extension(this.runtime);
      const serviceName = this._registerInternalExtension(extensionInstance);
      this._loadedExtensions.set(extensionURL, serviceName);
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      // 如果我们在全局一级“require”这样做，则会破坏非Webpack目标，包括测试
      const ExtensionWorker = require("worker-loader?name=extension-worker.js!./extension-worker");

      this.pendingExtensions.push({ extensionURL, resolve, reject });
      dispatch.addWorker(new ExtensionWorker());
    });
  }

  /**
   * Regenerate blockinfo for any loaded extensions
   * @returns {Promise} resolved once all the extensions have been reinitialized
   */
  refreshBlocks() {
    const allPromises = Array.from(this._loadedExtensions.values()).map(
      (serviceName) =>
        dispatch
          .call(serviceName, "getInfo")
          .then((info) => {
            info = this._prepareExtensionInfo(serviceName, info);
            dispatch.call("runtime", "_refreshExtensionPrimitives", info);
          })
          .catch((e) => {
            console.error(
              `Failed to refresh built-in extension primitives: ${JSON.stringify(
                e
              )}`
            );
          })
    );
    return Promise.all(allPromises);
  }

  allocateWorker() {
    const id = this.nextExtensionWorker++;
    const workerInfo = this.pendingExtensions.shift();
    this.pendingWorkers[id] = workerInfo;
    return [id, workerInfo.extensionURL];
  }

  /**
   * Synchronously collect extension metadata from the specified service and begin the extension registration process.
   * @param {string} serviceName - the name of the service hosting the extension.
   */
  registerExtensionServiceSync(serviceName) {
    const info = dispatch.callSync(serviceName, "getInfo");
    this._registerExtensionInfo(serviceName, info);
  }

  /**
   * Collect extension metadata from the specified service and begin the extension registration process.
   * @param {string} serviceName - the name of the service hosting the extension.
   */
  registerExtensionService(serviceName) {
    dispatch.call(serviceName, "getInfo").then((info) => {
      this._registerExtensionInfo(serviceName, info);
    });
  }

  /**
   * Called by an extension worker to indicate that the worker has finished initialization.
   * @param {int} id - the worker ID.
   * @param {*?} e - the error encountered during initialization, if any.
   */
  onWorkerInit(id, e) {
    const workerInfo = this.pendingWorkers[id];
    delete this.pendingWorkers[id];
    if (e) {
      workerInfo.reject(e);
    } else {
      workerInfo.resolve(id);
    }
  }

  /**
   * Register an internal (non-Worker) extension object
   * @param {object} extensionObject - the extension object to register
   * @returns {string} The name of the registered extension service
   */
  _registerInternalExtension(extensionObject) {
    const extensionInfo = extensionObject.getInfo();
    const fakeWorkerId = this.nextExtensionWorker++;
    const serviceName = `extension_${fakeWorkerId}_${extensionInfo.id}`;
    dispatch.setServiceSync(serviceName, extensionObject);
    dispatch.callSync(
      "extensions",
      "registerExtensionServiceSync",
      serviceName
    );
    return serviceName;
  }

  /**
   * Sanitize extension info then register its primitives with the VM.
   * @param {string} serviceName - the name of the service hosting the extension
   * @param {ExtensionInfo} extensionInfo - the extension's metadata
   * @private
   */
  _registerExtensionInfo(serviceName, extensionInfo) {
    extensionInfo = this._prepareExtensionInfo(serviceName, extensionInfo);
    dispatch
      .call("runtime", "_registerExtensionPrimitives", extensionInfo)
      .catch((e) => {
        console.error(
          `Failed to register primitives for extension on service ${serviceName}:`,
          e
        );
      });
  }

  /**
   * Modify the provided text as necessary to ensure that it may be used as an attribute value in valid XML.
   * @param {string} text - the text to be sanitized
   * @returns {string} - the sanitized text
   * @private
   */
  _sanitizeID(text) {
    return text.toString().replace(/[<"&]/, "_");
  }

  /**
   * Apply minor cleanup and defaults for optional extension fields.
   * TODO: make the ID unique in cases where two copies of the same extension are loaded.
   * @param {string} serviceName - the name of the service hosting this extension block
   * @param {ExtensionInfo} extensionInfo - the extension info to be sanitized
   * @returns {ExtensionInfo} - a new extension info object with cleaned-up values
   * @private
   */
  _prepareExtensionInfo(serviceName, extensionInfo) {
    extensionInfo = Object.assign({}, extensionInfo);
    if (!/^[a-z0-9]+$/i.test(extensionInfo.id)) {
      throw new Error("Invalid extension id");
    }
    extensionInfo.name = extensionInfo.name || extensionInfo.id;
    extensionInfo.blocks = extensionInfo.blocks || [];
    extensionInfo.targetTypes = extensionInfo.targetTypes || [];
    extensionInfo.blocks = extensionInfo.blocks.reduce((results, blockInfo) => {
      try {
        let result;
        switch (blockInfo) {
          case "---": // separator
            result = "---";
            break;
          default:
            // an ExtensionBlockMetadata object
            result = this._prepareBlockInfo(serviceName, blockInfo);
            break;
        }
        results.push(result);
      } catch (e) {
        // TODO: more meaningful error reporting
        console.error(
          `Error processing block: ${e.message}, Block:\n${JSON.stringify(
            blockInfo
          )}`
        );
      }
      return results;
    }, []);
    extensionInfo.menus = extensionInfo.menus || {};
    extensionInfo.menus = this._prepareMenuInfo(
      serviceName,
      extensionInfo.menus
    );
    return extensionInfo;
  }

  /**
   * Prepare extension menus. e.g. setup binding for dynamic menu functions.
   * @param {string} serviceName - the name of the service hosting this extension block
   * @param {Array.<MenuInfo>} menus - the menu defined by the extension.
   * @returns {Array.<MenuInfo>} - a menuInfo object with all preprocessing done.
   * @private
   */
  _prepareMenuInfo(serviceName, menus) {
    const menuNames = Object.getOwnPropertyNames(menus);
    for (let i = 0; i < menuNames.length; i++) {
      const menuName = menuNames[i];
      let menuInfo = menus[menuName];

      // If the menu description is in short form (items only) then normalize it to general form: an object with
      // its items listed in an `items` property.
      if (!menuInfo.items) {
        menuInfo = {
          items: menuInfo,
        };
        menus[menuName] = menuInfo;
      }
      // If `items` is a string, it should be the name of a function in the extension object. Calling the
      // function should return an array of items to populate the menu when it is opened.
      if (typeof menuInfo.items === "string") {
        const menuItemFunctionName = menuInfo.items;
        const serviceObject = dispatch.services[serviceName];
        // Bind the function here so we can pass a simple item generation function to Scratch Blocks later.
        menuInfo.items = this._getExtensionMenuItems.bind(
          this,
          serviceObject,
          menuItemFunctionName
        );
      }
    }
    return menus;
  }

  /**
   * Fetch the items for a particular extension menu, providing the target ID for context.
   * @param {object} extensionObject - the extension object providing the menu.
   * @param {string} menuItemFunctionName - the name of the menu function to call.
   * @returns {Array} menu items ready for scratch-blocks.
   * @private
   */
  _getExtensionMenuItems(extensionObject, menuItemFunctionName) {
    // Fetch the items appropriate for the target currently being edited. This assumes that menus only
    // collect items when opened by the user while editing a particular target.
    const editingTarget =
      this.runtime.getEditingTarget() || this.runtime.getTargetForStage();
    const editingTargetID = editingTarget ? editingTarget.id : null;
    const extensionMessageContext = this.runtime.makeMessageContextForTarget(
      editingTarget
    );

    // TODO: Fix this to use dispatch.call when extensions are running in workers.
    const menuFunc = extensionObject[menuItemFunctionName];
    const menuItems = menuFunc
      .call(extensionObject, editingTargetID)
      .map((item) => {
        item = maybeFormatMessage(item, extensionMessageContext);
        switch (typeof item) {
          case "object":
            return [
              maybeFormatMessage(item.text, extensionMessageContext),
              item.value,
            ];
          case "string":
            return [item, item];
          default:
            return item;
        }
      });

    if (!menuItems || menuItems.length < 1) {
      throw new Error(
        `Extension menu returned no items: ${menuItemFunctionName}`
      );
    }
    return menuItems;
  }

  /**
   * Apply defaults for optional block fields.
   * @param {string} serviceName - the name of the service hosting this extension block
   * @param {ExtensionBlockMetadata} blockInfo - the block info from the extension
   * @returns {ExtensionBlockMetadata} - a new block info object which has values for all relevant optional fields.
   * @private
   */
  _prepareBlockInfo(serviceName, blockInfo) {
    blockInfo = Object.assign(
      {},
      {
        blockType: BlockType.COMMAND,
        terminal: false,
        blockAllThreads: false,
        arguments: {},
      },
      blockInfo
    );
    blockInfo.opcode = blockInfo.opcode && this._sanitizeID(blockInfo.opcode);
    blockInfo.text = blockInfo.text || blockInfo.opcode;

    switch (blockInfo.blockType) {
      case BlockType.EVENT:
        if (blockInfo.func) {
          console.warn(
            `Ignoring function "${blockInfo.func}" for event block ${blockInfo.opcode}`
          );
        }
        break;
      case BlockType.BUTTON:
        if (blockInfo.opcode) {
          console.warn(
            `Ignoring opcode "${blockInfo.opcode}" for button with text: ${blockInfo.text}`
          );
        }
        break;
      default: {
        if (!blockInfo.opcode) {
          throw new Error("Missing opcode for block");
        }

        const funcName = blockInfo.func
          ? this._sanitizeID(blockInfo.func)
          : blockInfo.opcode;

        const getBlockInfo = blockInfo.isDynamic
          ? (args) => args && args.mutation && args.mutation.blockInfo
          : () => blockInfo;
        const callBlockFunc = (() => {
          if (dispatch._isRemoteService(serviceName)) {
            return (args, util, realBlockInfo) =>
              dispatch.call(serviceName, funcName, args, util, realBlockInfo);
          }

          // avoid promise latency if we can call direct
          const serviceObject = dispatch.services[serviceName];
          if (!serviceObject[funcName]) {
            // The function might show up later as a dynamic property of the service object
            console.warn(
              `Could not find extension block function called ${funcName}`
            );
          }
          return (args, util, realBlockInfo) =>
            serviceObject[funcName](args, util, realBlockInfo);
        })();

        blockInfo.func = (args, util) => {
          const realBlockInfo = getBlockInfo(args);
          // TODO: filter args using the keys of realBlockInfo.arguments? maybe only if sandboxed?
          return callBlockFunc(args, util, realBlockInfo);
        };
        break;
      }
    }

    return blockInfo;
  }
}

module.exports = ExtensionManager;
