/**
 * @fileoverview
 * 实用程序函数返回对应于默认空资产的json.
 */

/**
 * 使用提供的名称为vm.addCostume生成空白costume对象.
 * @param {string} name 名称使用的costume，调用者应该本地化
 * @return {object} vm costume 对象
 */
const emptyCostume = (name) => ({
  name: name,
  md5: "cd21514d0531fdffb22204e0ec5ed84a.svg",
  rotationCenterX: 0,
  rotationCenterY: 0,
  bitmapResolution: 1,
  skinId: null,
});

/**
 * 生成一个新的空精灵。 调用方应提供默认名称的本地化版本.
 * @param {string} name 精灵使用的名称
 * @param {string} soundName 用于默认声音的名称
 * @param {string} costumeName 默认costume的名称
 * @return {object} vm.addSprite期望的对象
 */
const emptySprite = (name, soundName, costumeName) => ({
  objName: name,
  sounds: [
    {
      soundName: soundName,
      soundID: -1,
      md5: "83a9787d4cb6f3b7632b4ddfebf74367.wav",
      sampleCount: 258,
      rate: 11025,
      format: "",
    },
  ],
  costumes: [
    {
      costumeName: costumeName,
      baseLayerID: -1,
      baseLayerMD5: "cd21514d0531fdffb22204e0ec5ed84a.svg",
      bitmapResolution: 1,
      rotationCenterX: 0,
      rotationCenterY: 0,
    },
  ],
  currentCostumeIndex: 0,
  scratchX: 36,
  scratchY: 28,
  scale: 1,
  direction: 90,
  rotationStyle: "normal",
  isDraggable: false,
  visible: true,
  spriteInfo: {},
});

export { emptyCostume, emptySprite };
