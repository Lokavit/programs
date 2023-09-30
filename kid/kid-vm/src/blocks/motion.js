/*
 * @Author: Satya
 * @Date: 2020-11-22 12:18:44
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-23 17:23:12
 * doc:新pro版运动分类
 */

const Timer = require("../util/timer");

class MotionBlocks {
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
      pro_motion_movesteps: this.moveSteps,
      pro_motion_gotoxy: this.goToXY,
      pro_motion_goto: this.goTo,
      pro_motion_turnright: this.turnRight,
      pro_motion_turnleft: this.turnLeft,
      pro_motion_pointindirection: this.pointInDirection,
      pro_motion_pointtowards: this.pointTowards,
      pro_motion_glidesecstoxy: this.glide,
      pro_motion_glideto: this.glideTo,
      pro_motion_ifonedgebounce: this.ifOnEdgeBounce,
      pro_motion_setrotationstyle: this.setRotationStyle,
      pro_motion_changexby: this.changeX,
      pro_motion_setx: this.setX,
      pro_motion_changeyby: this.changeY,
      pro_motion_sety: this.setY,
      pro_motion_xposition: this.getX,
      pro_motion_yposition: this.getY,
      pro_motion_direction: this.getDirection,
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
    const direction = Utility.toNumber(args.NUM);
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

module.exports = MotionBlocks;
