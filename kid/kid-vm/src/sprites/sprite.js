const RenderedTarget = require("./rendered-target");
const Blocks = require("../engine/blocks");
const { loadSoundFromAsset } = require("../import/load-sound");
const { loadCostumeFromAsset } = require("../import/load-costume");
const StringUtil = require("../util/string-util");
const StageLayering = require("../engine/stage-layering");

class Sprite {
  /**
   * Sprite将在Scratch阶段使用.
   * 所有克隆共有 shared blocks, shared costumes, shared variables, shared sounds, etc.
   * @param {?Blocks} blocks 精灵的所有克隆的共享块对象.
   * @param {Runtime} runtime 引用运行时.
   * @constructor
   */
  constructor(blocks, runtime) {
    console.log("class Sprite", blocks, runtime);
    this.runtime = runtime;
    if (!blocks) {
      // Shared set of blocks for all clones.
      blocks = new Blocks(runtime);
    }
    this.blocks = blocks;
    /**
     * Human-readable name for this sprite (and all clones).
     * @type {string}
     */
    this.name = "";
    /**
     * List of costumes for this sprite.
     * Each entry is an object, e.g.,
     * {
     *      skinId: 1,
     *      name: "Costume Name",
     *      bitmapResolution: 2,
     *      rotationCenterX: 0,
     *      rotationCenterY: 0
     * }
     * @type {Array.<!Object>}
     */
    this.costumes_ = [];
    /**
     * List of sounds for this sprite.
     */
    this.sounds = [];
    /**
     * List of clones for this sprite, including the original.
     * @type {Array.<!RenderedTarget>}
     */
    this.clones = [];

    this.soundBank = null;
    if (this.runtime && this.runtime.audioEngine) {
      this.soundBank = this.runtime.audioEngine.createBank();
    }
  }

  /**
   * 添加一系列服装，注意避免重复的名称.
   * @param {!Array<object>} costumes 代表服装的对象数组.
   */
  set costumes(costumes) {
    this.costumes_ = [];
    for (const costume of costumes) {
      this.addCostumeAt(costume, this.costumes_.length);
    }
  }

  /**
   * 获取完整的服装清单
   * @return {object[]} 服装清单。
   */
  get costumes() {
    return this.costumes_;
  }

  /**
   * 在给定的索引处添加服装，注意避免重复的名称.
   * @param {!object} costumeObject 代表服装的对象.
   * @param {!int} index 服装添加索引
   */
  addCostumeAt(costumeObject, index) {
    console.log("vm sprite.js addCostumeAt()", costumeObject, index);
    if (!costumeObject.name) costumeObject.name = "";

    const usedNames = this.costumes_.map((costume) => costume.name);
    costumeObject.name = StringUtil.unusedName(costumeObject.name, usedNames);
    this.costumes_.splice(index, 0, costumeObject);
  }

  /**
   * Delete a costume by index.
   * @param {number} index Costume index to be deleted
   * @return {?object} The deleted costume
   */
  deleteCostumeAt(index) {
    return this.costumes.splice(index, 1)[0];
  }

  /**
   * 创建此精灵的副本.
   * @param {string=} optLayerGroup 克隆的绘制对象应添加到的可选图层组
   * 默认为精灵图层组
   * @returns {!RenderedTarget} 新创建的克隆.
   */
  createClone(optLayerGroup) {
    console.log("createClone 创建副本:", optLayerGroup);
    const newClone = new RenderedTarget(this, this.runtime);
    newClone.isOriginal = this.clones.length === 0;
    this.clones.push(newClone);
    newClone.initAudio();
    if (newClone.isOriginal) {
      // Default to the sprite layer group if optLayerGroup is not provided
      const layerGroup =
        typeof optLayerGroup === "string"
          ? optLayerGroup
          : StageLayering.SPRITE_LAYER;
      newClone.initDrawable(layerGroup);
      this.runtime.fireTargetWasCreated(newClone);
    } else {
      this.runtime.fireTargetWasCreated(newClone, this.clones[0]);
    }
    return newClone;
  }

  /**
   * Disconnect a clone from this sprite. The clone is unmodified.
   * In particular, the clone's dispose() method is not called.
   * @param {!RenderedTarget} clone - the clone to be removed.
   */
  removeClone(clone) {
    this.runtime.fireTargetWasRemoved(clone);
    const cloneIndex = this.clones.indexOf(clone);
    if (cloneIndex >= 0) {
      this.clones.splice(cloneIndex, 1);
    }
  }

  duplicate() {
    const newSprite = new Sprite(null, this.runtime);
    const blocksContainer = this.blocks._blocks;
    const originalBlocks = Object.keys(blocksContainer).map(
      (key) => blocksContainer[key]
    );
    const copiedBlocks = JSON.parse(JSON.stringify(originalBlocks));
    Utility.newBlockIds(copiedBlocks);
    copiedBlocks.forEach((block) => {
      newSprite.blocks.createBlock(block);
    });

    const allNames = this.runtime.targets.map((t) => t.sprite.name);
    newSprite.name = StringUtil.unusedName(this.name, allNames);

    const assetPromises = [];

    newSprite.costumes = this.costumes_.map((costume) => {
      const newCostume = Object.assign({}, costume);
      assetPromises.push(loadCostumeFromAsset(newCostume, this.runtime));
      return newCostume;
    });

    newSprite.sounds = this.sounds.map((sound) => {
      const newSound = Object.assign({}, sound);
      const soundAsset = sound.asset;
      assetPromises.push(
        loadSoundFromAsset(
          newSound,
          soundAsset,
          this.runtime,
          newSprite.soundBank
        )
      );
      return newSound;
    });

    return Promise.all(assetPromises).then(() => newSprite);
  }

  dispose() {
    if (this.soundBank) {
      this.soundBank.dispose();
    }
  }
}

module.exports = Sprite;
