import layout, {
  STAGE_DISPLAY_SCALES,
  STAGE_SIZE_MODES,
  STAGE_DISPLAY_SIZES,
} from "../lib/layout-constants";

/**
 * @typedef {object} StageDimensions
 * @property {int} height - 当前情况下舞台使用的高度.
 * @property {int} width - 当前情况下舞台要使用的宽度.
 * @property {number} scale - 从舞台的默认大小到当前大小的比例因子.
 * @property {int} heightDefault - 舞台的默认高度（大）.
 * @property {int} widthDefault - 舞台的默认宽度（大）.
 */

const STAGE_DIMENSION_DEFAULTS = {
  // referencing css/units.css,
  // spacingBorderAdjustment = 2 * $full-screen-top-bottom-margin +
  //   2 * $full-screen-border-width
  fullScreenSpacingBorderAdjustment: 12,
  // referencing css/units.css,
  // menuHeightAdjustment = $stage-menu-height
  menuHeightAdjustment: 44,
};

/**
 * 将当前的GUI和浏览器状态解析为实际的舞台大小枚举值.
 * @param {STAGE_SIZE_MODES} stageSizeMode - 舞台大小切换按钮的状态.
 * @param {boolean} isFullSize - 如果窗口足够大，足以容纳大型舞台，则为true.
 * @return {STAGE_DISPLAY_SIZES} - 在这种情况下应该使用的舞台大小枚举值.
 */
const resolveStageSize = (stageSizeMode, isFullSize) => {
  if (stageSizeMode === STAGE_SIZE_MODES.small)
    return STAGE_DISPLAY_SIZES.small;

  if (isFullSize) return STAGE_DISPLAY_SIZES.large;

  return STAGE_DISPLAY_SIZES.largeConstrained;
};

/**
 * 检索用于根据当前GUI和浏览器状态确定实际舞台大小的信息.
 * @param {STAGE_DISPLAY_SIZES} stageSize - 当前完全解析的舞台大小.
 * @param {boolean} isFullScreen - 如果启用了全屏模式，则为true.
 * @return {StageDimensions} - 描述舞台尺寸的对象.
 */
const getStageDimensions = (stageSize, isFullScreen) => {
  const stageDimensions = {
    heightDefault: layout.standardStageHeight,
    widthDefault: layout.standardStageWidth,
    height: 0,
    width: 0,
    scale: 0,
  };

  if (isFullScreen) {
    stageDimensions.height =
      window.innerHeight -
      STAGE_DIMENSION_DEFAULTS.menuHeightAdjustment -
      STAGE_DIMENSION_DEFAULTS.fullScreenSpacingBorderAdjustment;

    stageDimensions.width = stageDimensions.height + stageDimensions.height / 3;

    if (stageDimensions.width > window.innerWidth) {
      stageDimensions.width = window.innerWidth;
      stageDimensions.height = stageDimensions.width * 0.75;
    }

    stageDimensions.scale =
      stageDimensions.width / stageDimensions.widthDefault;
  } else {
    stageDimensions.scale = STAGE_DISPLAY_SCALES[stageSize];
    stageDimensions.height =
      stageDimensions.scale * stageDimensions.heightDefault;
    stageDimensions.width =
      stageDimensions.scale * stageDimensions.widthDefault;
  }

  // Round off dimensions to prevent resampling/blurriness
  stageDimensions.height = Math.round(stageDimensions.height);
  stageDimensions.width = Math.round(stageDimensions.width);

  return stageDimensions;
};

/**
 * 为舞台取一对尺寸（目标高度和宽度以及默认高度和宽度），计算它们之间的比例，然后返回CSS变换以缩放至该比例.
 * @param {object} sizeInfo 包含目标尺寸和默认舞台尺寸的对象.
 * @param {number} sizeInfo.width The target width
 * @param {number} sizeInfo.height The target height
 * @param {number} sizeInfo.widthDefault The default width
 * @param {number} sizeInfo.heightDefault The default height
 * @returns {object} the CSS transform
 */
const stageSizeToTransform = ({
  width,
  height,
  widthDefault,
  heightDefault,
}) => {
  const scaleX = width / widthDefault;
  const scaleY = height / heightDefault;
  if (scaleX === 1 && scaleY === 1) {
    // Do not set a transform if the scale is 1 because
    // it messes up `position: fixed` elements like the context menu.
    return;
  }
  return { transform: `scale(${scaleX},${scaleY})` };
};

export { getStageDimensions, resolveStageSize, stageSizeToTransform };
