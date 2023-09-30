/*
 * @Author: Satya
 * @Date: 2020-11-17 15:08:49
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-20 15:38:08
 * doc: KidBlocks下的常量。
 */

const CONSTANTS = Object.freeze({
  /** @type {number} 使用线增量模式的滚轮增量的乘数. */
  LINE_MODE_MULTIPLIER: 40,

  /** @type {number} 使用页面增量模式的滚轮增量的乘数 */
  PAGE_MODE_MULTIPLIER: 125,

  /** @description 拖动开始之前鼠标必须移动的像素数. */
  DRAG_RADIUS: 5,

  /** @description 从弹出按钮开始拖动/滚动之前，鼠标必须移动的像素数。 因为拖动意图是在到达时确定的，所以它大于DRAG_RADIUS，因此拖动方向更清晰. */
  FLYOUT_DRAG_RADIUS: 10,

  /** @description 连接之间的最大错位，使它们无法对齐. */
  SNAP_RADIUS: 28,

  /** @description 当连接已突出显示时，连接之间的最大不对齐将使它们对齐. */
  get CONNECTING_SNAP_RADIUS() {
    return this.SNAP_RADIUS;
  },

  /**
   * How much to prefer staying connected to the current connection over moving to
   * a new connection.  The current previewed connection is considered to be this
   * much closer to the matching connection on the block than it actually is.
   * 当前的连接偏好
   */
  CURRENT_CONNECTION_PREFERENCE: 8,

  /** @description 碰撞延迟.触发和碰撞未连接块未对准之间的毫秒延迟. */
  BUMP_DELAY: 250,

  /** @description 以工作空间为单位的最大随机性. */
  BUMP_RANDOMNESS: 10,

  /** @description 截断折叠块的字符数. */
  COLLAPSE_CHARS: 30,

  /** @description 长度（以毫秒为单位），使触摸成为长按. */
  LONGPRESS: 750,

  /** @description 如果在这么多毫秒内出现另一种声音，则防止声音播放. */
  SOUND_LIMIT: 100,

  /** @description 将块拖出堆栈时, 将堆栈分成两部分(true), 或者将块拖出修复堆栈(false). */
  DRAG_STACK: true,

  /** @description 色块丰富，与色调无关. 必须在0（含）到1（不含）范围内. */
  HSV_SATURATION: 0.45,

  /** @description 块色的强度，与色调无关. 必须在0（含）到1（不含）范围内. */
  HSV_VALUE: 0.65,

  /** @description 充满活力的图标和图像. */
  SPRITE: {
    width: 96,
    height: 124,
    url: "sprites.png",
  },

  // 低于此点的常量不打算更改.

  /** @const ENUM表示面向右的值输入.  E.g. 'set item to' or 'return'. */
  INPUT_VALUE: 1,

  /** @const ENUM用于左值输出.  E.g. 'random fraction'. */
  OUTPUT_VALUE: 2,

  /** @const ENUM用于朝下的块堆栈.  E.g. 'if-do' or 'else'. */
  NEXT_STATEMENT: 3,

  /** @const 用ENUM表示向上的块堆栈.  E.g. 'break out of loop'. */
  PREVIOUS_STATEMENT: 4,

  /** @const ENUM为虚拟输入. 用于添加无输入的字段. */
  DUMMY_INPUT: 5,

  /** @const ENUM左对齐. */
  ALIGN_LEFT: -1,

  /** @const ENUM用于中心对齐. */
  ALIGN_CENTRE: 0,

  /** @const ENUM右对齐. */
  ALIGN_RIGHT: 1,

  /** @const ENUM，无拖动操作. */
  DRAG_NONE: 0,

  /** @const ENUM for inside the sticky DRAG_RADIUS. */
  DRAG_STICKY: 1,

  /** @const ENUM用于非粘性DRAG_RADIUS内部，用于区分单击和拖动. */
  DRAG_BEGIN: 1,

  /** @const ENUM可自由拖动（如果适用，则在DRAG_RADIUS之外）. */
  DRAG_FREE: 2,

  /** @const 查找表，用于确定连接的相反类型. */
  get OPPOSITE_TYPE() {
    return [
      ,
      (this.INPUT_VALUE = this.OUTPUT_VALUE),
      (this.OUTPUT_VALUE = this.INPUT_VALUE),
      (this.NEXT_STATEMENT = this.PREVIOUS_STATEMENT),
      (this.PREVIOUS_STATEMENT = this.NEXT_STATEMENT),
    ];
  },

  /**  @const 用于工具箱和弹出窗口在屏幕顶部. */
  TOOLBOX_AT_TOP: 0,

  /** @const 屏幕底部的工具箱和弹出按钮. */
  TOOLBOX_AT_BOTTOM: 1,

  /** @const 屏幕左侧的工具箱和弹出按钮. */
  TOOLBOX_AT_LEFT: 2,

  /** @const 屏幕右侧的工具箱和弹出按钮. */
  TOOLBOX_AT_RIGHT: 3,

  /** @const 表示事件不在任何删除区域中的ENUM. 向后兼容原因为空. */
  DELETE_AREA_NONE: null,

  /** @const 枚举表示事件位于垃圾箱的删除区域中. */
  DELETE_AREA_TRASH: 1,

  /** @const 表示事件在工具箱或弹出窗口的删除区域中的ENUM. */
  DELETE_AREA_TOOLBOX: 2,

  /**
   * 在工具箱XML中类别的"custom"属性中使用的字符串 .
   * 此字符串指示类别应动态填充变量块.
   * @const {string}
   */
  VARIABLE_CATEGORY_NAME: "VARIABLE",
  /**
   * String for use in the "custom" attribute of a category in toolbox XML.
   * This string indicates that the category should be dynamically populated with
   * variable blocks.
   * @const {string}
   */
  VARIABLE_DYNAMIC_CATEGORY_NAME: "VARIABLE_DYNAMIC",

  /**
   * String for use in the "custom" attribute of a category in toolbox XML.
   * This string indicates that the category should be dynamically populated with
   * procedure blocks.
   * @const {string}
   */
  PROCEDURE_CATEGORY_NAME: "PROCEDURE",

  /**
   * String for use in the dropdown created in field_variable.
   * This string indicates that this option in the dropdown is 'Rename
   * variable...' and if selected, should trigger the prompt to rename a variable.
   * @const {string}
   */
  RENAME_VARIABLE_ID: "RENAME_VARIABLE_ID",

  /**
   * String for use in the dropdown created in field_variable.
   * This string indicates that this option in the dropdown is 'Delete the "%1"
   * variable' and if selected, should trigger the prompt to delete a variable.
   * @const {string}
   */
  DELETE_VARIABLE_ID: "DELETE_VARIABLE_ID",
});

// console.log("CONSTANTS:", CONSTANTS);
