const JSZip = require("jszip");

/**
 * 将声音从文件反序列化到存储缓存中，以便可以将其加载到运行时中.
 * @param {object} sound sb3文件中声音的描述符
 * @param {Runtime} runtime T运行时包含用于缓存声音的存储
 * @param {JSZip} zip 包含声音文件的zip文件，由`sound`描述
 * @param {string} assetFileName 给定资产的可选文件名
 * (sb2 files have filenames of the form [int].[ext],
 * sb3 files have filenames of the form [md5].[ext])
 * @return {Promise} 在将描述的声音存储到运行时存储高速缓存，声音已经存储或发生错误之后解决的承诺.
 */
const deserializeSound = function (sound, runtime, zip, assetFileName) {
  const fileName = assetFileName ? assetFileName : sound.md5;
  const storage = runtime.storage;
  if (!storage) {
    console.error(
      "No storage module present; cannot load sound asset: ",
      fileName
    );
    return Promise.resolve(null);
  }

  if (!zip) {
    // Zip will not be provided if loading project json from server
    return Promise.resolve(null);
  }

  let soundFile = zip.file(fileName);
  if (!soundFile) {
    // look for assetfile in a flat list of files, or in a folder
    const fileMatch = new RegExp(`^([^/]*/)?${fileName}$`);
    soundFile = zip.file(fileMatch)[0]; // use first matching file
  }

  if (!soundFile) {
    console.error(
      `Could not find sound file associated with the ${sound.name} sound.`
    );
    return Promise.resolve(null);
  }

  if (!JSZip.support.uint8array) {
    console.error("JSZip uint8array is not supported in this browser.");
    return Promise.resolve(null);
  }

  const dataFormat =
    sound.dataFormat.toLowerCase() === "mp3"
      ? storage.DataFormat.MP3
      : storage.DataFormat.WAV;
  return soundFile
    .async("uint8array")
    .then((data) =>
      storage.createAsset(storage.AssetType.Sound, dataFormat, data, null, true)
    )
    .then((asset) => {
      sound.asset = asset;
      sound.assetId = asset.assetId;
      sound.md5 = `${asset.assetId}.${asset.dataFormat}`;
    });
};

/**
 * 将服装从文件反序列化到存储缓存中，以便可以将其加载到运行时中.
 * @param {object} costume sb3文件中服装的描述符
 * @param {Runtime} runtime 运行时包含用于存储服装的存储空间
 * @param {JSZip} zip 包含服装文件的zip由`costume`描述
 * @param {string} assetFileName Optional file name for the given asset
 * (sb2 files have filenames of the form [int].[ext],
 * sb3 files have filenames of the form [md5].[ext])
 * @param {string} textLayerFileName Optional file name for the given asset's text layer (sb2 only; files have filenames of the form [int].png)
 * @return {Promise} Promise that resolves after the described costume has been stored into the runtime storage cache, the costume was already stored, or an error has occurred.
 */
const deserializeCostume = function (
  costume,
  runtime,
  zip,
  assetFileName,
  textLayerFileName
) {
  console.log("反序列化资源.js");
  const storage = runtime.storage;
  const assetId = costume.assetId;
  const fileName = assetFileName
    ? assetFileName
    : `${assetId}.${costume.dataFormat}`;

  if (!storage) {
    console.error(
      "No storage module present; cannot load costume asset: ",
      fileName
    );
    return Promise.resolve(null);
  }

  if (costume.asset) {
    // 从图像文件上传精灵时，将提供资产数据
    // @todo 将资产数据缓存到某处并在此处拉出
    return Promise.resolve(
      storage.createAsset(
        costume.asset.assetType,
        costume.asset.dataFormat,
        new Uint8Array(
          Object.keys(costume.asset.data).map((key) => costume.asset.data[key])
        ),
        null,
        true
      )
    ).then((asset) => {
      costume.asset = asset;
      costume.assetId = asset.assetId;
      costume.md5 = `${asset.assetId}.${asset.dataFormat}`;
    });
  }
  // 如果从服务器加载项目json
  if (!zip) return Promise.resolve(null);

  let costumeFile = zip.file(fileName);
  if (!costumeFile) {
    // 在平面文件列表或文件夹中查找资产文件
    const fileMatch = new RegExp(`^([^/]*/)?${fileName}$`);
    costumeFile = zip.file(fileMatch)[0]; // use the first matched file
  }

  if (!costumeFile) {
    console.error(
      `Could not find costume file associated with the ${costume.name} costume.`
    );
    return Promise.resolve(null);
  }
  let assetType = null;
  const costumeFormat = costume.dataFormat.toLowerCase();
  if (costumeFormat === "svg") {
    assetType = storage.AssetType.ImageVector;
  } else if (["png", "bmp", "jpeg", "jpg", "gif"].indexOf(costumeFormat) >= 0) {
    assetType = storage.AssetType.ImageBitmap;
  } else {
    console.error(`Unexpected file format for costume: ${costumeFormat}`);
  }
  if (!JSZip.support.uint8array) {
    console.error("JSZip uint8array is not supported in this browser.");
    return Promise.resolve(null);
  }

  // textLayerMD5 exists if there is a text layer, which is a png of text from Scratch 1.4
  // that was opened in Scratch 2.0. In this case, set costume.textLayerAsset.
  let textLayerFilePromise;
  if (costume.textLayerMD5) {
    const textLayerFile = zip.file(textLayerFileName);
    if (!textLayerFile) {
      console.error(
        `Could not find text layer file associated with the ${costume.name} costume.`
      );
      return Promise.resolve(null);
    }
    textLayerFilePromise = textLayerFile
      .async("uint8array")
      .then((data) =>
        storage.createAsset(
          storage.AssetType.ImageBitmap,
          "png",
          data,
          costume.textLayerMD5
        )
      )
      .then((asset) => {
        costume.textLayerAsset = asset;
      });
  } else {
    textLayerFilePromise = Promise.resolve(null);
  }

  return Promise.all([
    textLayerFilePromise,
    costumeFile
      .async("uint8array")
      .then((data) =>
        storage.createAsset(
          assetType,
          // TODO eventually we want to map non-png's to their actual file types?
          costumeFormat,
          data,
          null,
          true
        )
      )
      .then((asset) => {
        costume.asset = asset;
        costume.assetId = asset.assetId;
        costume.md5 = `${asset.assetId}.${asset.dataFormat}`;
      }),
  ]);
};

module.exports = {
  deserializeSound,
  deserializeCostume,
};
