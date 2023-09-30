import keyMirror from "keymirror";

/**
 * 舞台大小切换的每个状态的名称
 * @enum {string}
 */
const STAGE_SIZE_MODES = keyMirror({
  /** 按下“大舞台”按钮； 用户想要一个大舞台 */
  large: null,

  /** 按下“小舞台”按钮； 用户想要一个小舞台 */
  small: null,
});

/**
 * Names for each stage render size
 * @enum {string}
 */
const STAGE_DISPLAY_SIZES = keyMirror({
  /** 具有大型浏览器的大型舞台 */
  large: null,

  /** 大型舞台 窄浏览器 */
  largeConstrained: null,

  /** 小舞台（忽略浏览器宽度） */
  small: null,
});

const STAGE_DISPLAY_SCALES = {};
STAGE_DISPLAY_SCALES[STAGE_DISPLAY_SIZES.large] = 1; // 大模式，宽浏览器（标准）
STAGE_DISPLAY_SCALES[STAGE_DISPLAY_SIZES.largeConstrained] = 0.85; // 大模式但浏览器狭窄
STAGE_DISPLAY_SCALES[STAGE_DISPLAY_SIZES.small] = 0.5; // 小模式，与浏览器大小无关

export default {
  standardStageWidth: RETURN_STAGE_SIZE().width,
  standardStageHeight: RETURN_STAGE_SIZE().height,
  fullSizeMinWidth: 640,
  fullSizePaintMinWidth: 640,
};

export { STAGE_DISPLAY_SCALES, STAGE_DISPLAY_SIZES, STAGE_SIZE_MODES };
