const StringUtil = require("../util/string-util");

const loadVector_ = function (costume, runtime, rotationCenter, optVersion) {
  return new Promise((resolve) => {
    let svgString = costume.asset.decodeText();
    // SVG Renderer负载修复了与Scratch 2项目相关的“怪癖”
    if (optVersion && optVersion === 2 && !runtime.v2SvgAdapter) {
      console.error(
        "No V2 SVG adapter present; SVGs may not render correctly."
      );
    } else if (optVersion && optVersion === 2 && runtime.v2SvgAdapter) {
      runtime.v2SvgAdapter.loadString(svgString, true /* fromVersion2 */);
      svgString = runtime.v2SvgAdapter.toString();
      // 放回仓库
      const storage = runtime.storage;
      costume.asset.encodeTextData(svgString, storage.DataFormat.SVG, true);
      costume.assetId = costume.asset.assetId;
      costume.md5 = `${costume.assetId}.${costume.dataFormat}`;
    }
    // 如果未提供rotationCenter，createSVGSkin会做正确的事情，因此，如果在此处未定义，则可以
    costume.skinId = runtime.renderer.createSVGSkin(svgString, rotationCenter);
    costume.size = runtime.renderer.getSkinSize(costume.skinId);
    // 现在我们应该有一个rotationCenter，即使我们以前没有
    if (!rotationCenter) {
      rotationCenter = runtime.renderer.getSkinRotationCenter(costume.skinId);
      costume.rotationCenterX = rotationCenter[0];
      costume.rotationCenterY = rotationCenter[1];
      costume.bitmapResolution = 1;
    }

    resolve(costume);
  });
};

const canvasPool = (function () {
  /**
   * 可以重用以减少内存分配的画布对象池.以及花费在这些分配和以后的垃圾收集上的时间.
   */
  class CanvasPool {
    constructor() {
      console.log("load-costume.js class CanvasPool");
      this.pool = [];
      this.clearSoon = null;
    }

    /**
     *短暂的等待后，清除池以让VM收集垃圾.
     */
    clear() {
      if (!this.clearSoon) {
        this.clearSoon = new Promise((resolve) =>
          setTimeout(resolve, 1000)
        ).then(() => {
          this.pool.length = 0;
          this.clearSoon = null;
        });
      }
    }

    /**
     * 返回画布。 如果池为空，则创建画布.
     * @returns {HTMLCanvasElement} A canvas element.
     */
    create() {
      return this.pool.pop() || document.createElement("canvas");
    }

    /**
     * 释放画布以重复使用.
     * @param {HTMLCanvasElement} canvas A canvas element.
     */
    release(canvas) {
      this.clear();
      this.pool.push(canvas);
    }
  }

  return new CanvasPool();
})();

/**
 * 以从存储中获取位图并将其作为画布返回
 * 如果造型具有bitmapResolution 1，则它将在此处转换为bitmapResolution 2（Scratch 3的标准）
 * 如果服装具有文本图层资产（这是Scratch 1.4的文本部分），则此功能将合并两个图像资产。
 * @param {!object} costume - 临时服装对象.
 * @param {!Runtime} runtime - 用于访问v2BitmapAdapter
 * @param {?object} rotationCenter - 可选地传递图像旋转中心的坐标. 如果未指定，则服装的旋转中心将在稍后设置为服装的中间.
 * @property {number} costume.bitmapResolution - 位图服装的分辨率比例.
 * @returns {?Promise} - a promise which will resolve to an object {canvas, rotationCenter, assetMatchesBase},
 *     or reject on error.
 *     如果资产与基础层匹配，则assetMatchesBase为true； 如果需要调整，则返回false
 */
const fetchBitmapCanvas_ = function (costume, runtime, rotationCenter) {
  console.log(
    "load-costume.js fetchBitmapCanvas_",
    costume,
    runtime,
    rotationCenter
  );
  if (!costume || !costume.asset)
    return Promise.reject("Costume load failed. Assets were missing.");

  if (!runtime.v2BitmapAdapter)
    return Promise.reject("No V2 Bitmap adapter present.");

  return Promise.all(
    [costume.asset, costume.textLayerAsset].map((asset) => {
      if (!asset) return null;

      if (typeof createImageBitmap !== "undefined")
        return createImageBitmap(
          new Blob([asset.data], { type: asset.assetType.contentType })
        );

      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = function () {
          resolve(image);
          image.onload = null;
          image.onerror = null;
        };
        image.onerror = function () {
          reject("Costume load failed. Asset could not be read.");
          image.onload = null;
          image.onerror = null;
        };
        image.src = asset.encodeDataURI();
      });
    })
  )
    .then(([baseImageElement, textImageElement]) => {
      const mergeCanvas = canvasPool.create();

      const scale = costume.bitmapResolution === 1 ? 2 : 1;
      mergeCanvas.width = baseImageElement.width;
      mergeCanvas.height = baseImageElement.height;

      const ctx = mergeCanvas.getContext("2d");
      ctx.drawImage(baseImageElement, 0, 0);
      if (textImageElement) ctx.drawImage(textImageElement, 0, 0);

      // Track the canvas we merged the bitmaps onto separately from the
      // canvas that we receive from resize if scale is not 1. We know
      // resize treats mergeCanvas as read only data. We don't know when
      // resize may use or modify the canvas. So we'll only release the
      // mergeCanvas back into the canvas pool. Reusing the canvas from
      // resize may cause errors.
      let canvas = mergeCanvas;
      if (scale !== 1)
        canvas = runtime.v2BitmapAdapter.resize(
          mergeCanvas,
          canvas.width * scale,
          canvas.height * scale
        );

      // By scaling, we've converted it to bitmap resolution 2
      if (rotationCenter) {
        rotationCenter[0] = rotationCenter[0] * scale;
        rotationCenter[1] = rotationCenter[1] * scale;
        costume.rotationCenterX = rotationCenter[0];
        costume.rotationCenterY = rotationCenter[1];
      }
      costume.bitmapResolution = 2;

      // Clean up the costume object
      delete costume.textLayerMD5;
      delete costume.textLayerAsset;

      return {
        canvas,
        mergeCanvas,
        rotationCenter,
        // True if the asset matches the base layer; false if it required adjustment
        assetMatchesBase: scale === 1 && !textImageElement,
      };
    })
    .catch(() => {
      // Clean up the text layer properties if it fails to load
      delete costume.textLayerMD5;
      delete costume.textLayerAsset;
    });
};

const loadBitmap_ = function (costume, runtime, _rotationCenter) {
  console.log("load-costume.js loadBitmap_", costume, runtime, _rotationCenter);
  return fetchBitmapCanvas_(costume, runtime, _rotationCenter)
    .then((fetched) => {
      const updateCostumeAsset = function (dataURI) {
        // 返回拒绝以停止执行updateCostumeAsset.
        if (!runtime.v2BitmapAdapter)
          return Promise.reject("No V2 Bitmap adapter present.");

        const storage = runtime.storage;
        costume.asset = storage.createAsset(
          storage.AssetType.ImageBitmap,
          storage.DataFormat.PNG,
          runtime.v2BitmapAdapter.convertDataURIToBinary(dataURI),
          null,
          true // generate md5
        );
        costume.dataFormat = storage.DataFormat.PNG;
        costume.assetId = costume.asset.assetId;
        costume.md5 = `${costume.assetId}.${costume.dataFormat}`;
      };

      if (!fetched.assetMatchesBase)
        updateCostumeAsset(fetched.canvas.toDataURL());

      return fetched;
    })
    .then(({ canvas, mergeCanvas, rotationCenter }) => {
      // 如果服装。旋转中心未定义，createBitmapSkin会做正确的事情.
      // 如果您上传位图资产或通过拍照创建资产，情况就是如此.
      let center;
      // fetchBitmapCanvas将确保服装的位图分辨率为2，并且其旋转中心缩放为匹配，因此始终除以2是可以的.
      if (rotationCenter)
        center = [rotationCenter[0] / 2, rotationCenter[1] / 2];

      // TODO: 根据fetchBitmapCanvas_，此时服装.bitmapResolution将始终为2，因此我们无需在此处传递它.
      costume.skinId = runtime.renderer.createBitmapSkin(
        canvas,
        costume.bitmapResolution,
        center
      );
      canvasPool.release(mergeCanvas);
      const renderSize = runtime.renderer.getSkinSize(costume.skinId);
      costume.size = [renderSize[0] * 2, renderSize[1] * 2]; // 实际大小，因为所有位图均为分辨率2

      if (!rotationCenter) {
        rotationCenter = runtime.renderer.getSkinRotationCenter(costume.skinId);
        // 实际旋转中心，因为所有位图均为分辨率2
        costume.rotationCenterX = rotationCenter[0] * 2;
        costume.rotationCenterY = rotationCenter[1] * 2;
        costume.bitmapResolution = 2;
      }
      return costume;
    });
};

/**
 * 从资产异步初始化 costume 除非附加了渲染器，否则请勿调用此方法.
 * @param {!object} costume - 代表costume的对象.
 * @property {int} skinId - costume渲染皮肤的ID（安装后）.
 * @property {number} rotationCenterX - 旋转中心YX.
 * @property {number} rotationCenterY - 旋转中心Y.
 * @property {number} [bitmapResolution] - 位图costume的分辨率比例.
 * @property {!Asset} costume.asset - 从存储中加载的costume资产.
 * @param {!Runtime} runtime - 运行时，用于访问存储模块.
 * @param {?int} optVersion - 造型来自哪个版本？2.0or3.0..
 * @returns {?Promise} - a promise which will resolve after skinId is set, or null on error.
 */
const loadCostumeFromAsset = function (costume, runtime, optVersion) {
  console.log(
    "vm load-costume.js loadCostumeFromAsset costume ",
    costume,
    runtime,
    optVersion
  );
  costume.assetId = costume.asset.assetId;
  const renderer = runtime.renderer;
  if (!renderer) {
    console.error(
      "No rendering module present; cannot load costume: ",
      costume.name
    );
    return Promise.resolve(costume);
  }
  const AssetType = runtime.storage.AssetType;
  let rotationCenter;
  // 如果定义了旋转中心和分辨率，请使用它们。 位图分辨率只能为1或2.
  if (
    typeof costume.rotationCenterX === "number" &&
    !isNaN(costume.rotationCenterX) &&
    typeof costume.rotationCenterY === "number" &&
    !isNaN(costume.rotationCenterY)
  ) {
    rotationCenter = [costume.rotationCenterX, costume.rotationCenterY];
  }
  if (
    costume.asset.assetType.runtimeFormat ===
    AssetType.ImageVector.runtimeFormat
  ) {
    return loadVector_(costume, runtime, rotationCenter, optVersion).catch(
      (error) => {
        console.warn(
          `Error loading vector image: ${error.name}: ${error.message}`
        );
        // Use default asset if original fails to load
        costume.assetId = runtime.storage.defaultAssetId.ImageVector;
        costume.asset = runtime.storage.get(costume.assetId);
        costume.md5 = `${costume.assetId}.${AssetType.ImageVector.runtimeFormat}`;
        return loadVector_(costume, runtime);
      }
    );
  }
  return loadBitmap_(costume, runtime, rotationCenter, optVersion);
};

/**
 * 将服装的资产异步加载到内存中.除非附加了渲染器，否则请勿调用此方法.
 * @param {string} md5ext - MD5和要加载的costume的扩展名.
 * @param {!object} costume - 代表costume的对象.
 * @property {int} skinId - costume渲染皮肤的ID（安装后）.
 * @property {number} rotationCenterX - 旋转中心YX.
 * @property {number} rotationCenterY - 旋转中心Y.
 * @property {number} [bitmapResolution] - 位图costume的分辨率比例.
 * @param {!Runtime} runtime - 运行时，用于访问存储模块.
 * @param {?int} optVersion - 造型来自哪个版本？2.0or3.0.
 * @returns {?Promise} - a promise which will resolve after skinId is set, or null on error.
 */
const loadCostume = function (md5ext, costume, runtime, optVersion) {
  console.log(
    "vm load-costume.js loadCostume 将造型资源异步加载到内存中 ",
    md5ext,
    costume,
    runtime,
    optVersion
  );
  const idParts = StringUtil.splitFirst(md5ext, ".");
  const md5 = idParts[0];
  const ext = idParts[1].toLowerCase();
  costume.dataFormat = ext;

  // Costume 附带资产。 它可能来自相机，图像上传，拖放或文件
  if (costume.asset) return loadCostumeFromAsset(costume, runtime, optVersion);

  // 需要从存储中加载costume。 服务器应对此md5进行引用 .
  if (!runtime.storage) {
    console.error(
      "No storage module present; cannot load costume asset: ",
      md5ext
    );
    return Promise.resolve(costume);
  }

  if (!runtime.storage.defaultAssetId) {
    console.error(`No default assets found`);
    return Promise.resolve(costume);
  }

  const AssetType = runtime.storage.AssetType;
  const assetType =
    ext === "svg" ? AssetType.ImageVector : AssetType.ImageBitmap;

  const costumePromise = runtime.storage.load(assetType, md5, ext);
  if (!costumePromise) {
    console.error(`Couldn't fetch costume asset: ${md5ext}`);
    return;
  }

  let textLayerPromise;
  if (costume.textLayerMD5) {
    textLayerPromise = runtime.storage.load(
      AssetType.ImageBitmap,
      costume.textLayerMD5,
      "png"
    );
  } else {
    textLayerPromise = Promise.resolve(null);
  }

  return Promise.all([costumePromise, textLayerPromise]).then((assetArray) => {
    costume.asset = assetArray[0];
    if (assetArray[1]) costume.textLayerAsset = assetArray[1];

    console.log(
      "vm load-costume.js loadCostume Promise.all 将服装的资产异步加载到内存中 ",
      md5ext,
      costume,
      runtime,
      optVersion
    );
    return loadCostumeFromAsset(costume, runtime, optVersion);
  });
};

module.exports = {
  loadCostume,
  loadCostumeFromAsset,
};
