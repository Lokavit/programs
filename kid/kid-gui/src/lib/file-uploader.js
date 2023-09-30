/*
 * @Author: Satya
 * @Date: 2020-11-26 20:04:50
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-26 20:49:23
 * doc:
 */

/**
 * @function 在给定包含文件的输入元素的情况下处理文件上传，并提供处理文件加载的功能.
 * @param {Input} fileInput 包含要加载文件的<input />元素
 * @param {Function} onload 处理加载文件的功能
 * @param {Function} onerror 处理加载文件时发生的任何错误的函数
 */
const handleFileUpload = function (fileInput, onload, onerror) {
  console.log("handleFileUpload 上传文件");
  const readFile = (i, files) => {
    if (i === files.length) {
      // 现在，我们已拥有所需的一切，请重置文件输入值，以便用户可以选择多次上传相同的声音
      fileInput.value = null;
      return;
    }
    const file = files[i];
    const reader = new FileReader();
    reader.onload = () => {
      const fileType = file.type;
      const fileName = file.name.split(".", 1)[0]; // .后缀名之前的所有内容作为文件名
      onload(reader.result, fileType, fileName, i, files.length);
      readFile(i + 1, files);
    };
    reader.onerror = onerror;
    reader.readAsArrayBuffer(file);
  };
  readFile(0, fileInput.files);
};

/**
 * @typedef VMAsset
 * @property {string} name 该资产的用户可读名称-如果此资产已存在于此vm资产范围内（例如，如果已经存在相同目标的相同名称的声音），它将自动转换为新名称。
 * @property {string} dataFormat The data format of this asset, typically
 * the extension to be used for that particular asset, e.g. 'svg' for vector images
 * @property {string} md5 The md5 hash of the asset data, followed by '.'' and dataFormat
 * @property {string} The md5 hash of the asset data // TODO remove duplication....
 */

/**
 * 创建具有存储的资产（服装，声音），并返回要在VM中跟踪的资产的对象表示形式.
 * @param {ScratchStorage} storage 用于缓存资产的存储
 * @param {AssetType} assetType Storage AssetType，指示这是什么类型的资产.
 * @param {string} dataFormat 此数据的格式（通常是文件扩展名）
 * @param {UInt8Array} data 资产数据缓冲区
 * @return {VMAsset} 代表此资产和相关信息的对象，可用于查找存储中的数据
 */
const createVMAsset = function (storage, assetType, dataFormat, data) {
  const asset = storage.createAsset(
    assetType,
    dataFormat,
    data,
    null,
    true // generate md5
  );

  return {
    name: null, // 需要由呼叫者设置
    dataFormat: dataFormat,
    asset: asset,
    md5: `${asset.assetId}.${dataFormat}`,
    assetId: asset.assetId,
  };
};

/**
 * 使用提供的上下文相关信息处理造型或背景的加载
 * @param {ArrayBuffer | string} fileData 服装数据要加载（可以是base64字符串，图像是位图）
 * @param {string} fileType The MIME type of this file
 * @param {ScratchStorage} storage Storage实例缓存服装数据
 * @param {Function} handleCostume 这是个回调函数，负责将造型添加到VM并处理添加造型后应出现的其它UI流
 * @param {Function} handleError 解析服装时发生错误时执行的功能
 */
const costumeUpload = function (
  fileData,
  fileType,
  storage,
  handleCostume,
  handleError = () => {}
) {
  console.log("造型上传:", fileData); // ArrayBuffer
  let costumeFormat = null;
  let assetType = null;
  switch (fileType) {
    case "image/svg+xml": {
      costumeFormat = storage.DataFormat.SVG;
      assetType = storage.AssetType.ImageVector;
      break;
    }
    case "image/jpeg": {
      costumeFormat = storage.DataFormat.JPG;
      assetType = storage.AssetType.ImageBitmap;
      break;
    }
    case "image/png": {
      costumeFormat = storage.DataFormat.PNG;
      assetType = storage.AssetType.ImageBitmap;
      break;
    }
    default:
      handleError(`遇到意外的文件类型: ${fileType}`);
      return;
  }

  const bitmapAdapter = KidSvgRenderer.BitmapAdapter;

  /**
   *
   * @param {*} dataBuffer
   */
  const addCostumeFromBuffer = function (dataBuffer) {
    console.log("添加造型到buffer:", dataBuffer);
    const vmCostume = createVMAsset(
      storage,
      assetType,
      costumeFormat,
      dataBuffer
    );
    console.log("准备执行回调函数handleCostume([vmCostume]):", vmCostume);
    // 这是个函数
    handleCostume([vmCostume]);
  };

  if (costumeFormat === storage.DataFormat.SVG) {
    // 必须作为Uint8Array传入文件数据，传入数组缓冲区会导致精灵/造型缩略图无法显示，因为造型的数据URI无效
    addCostumeFromBuffer(new Uint8Array(fileData));
  } else {
    /**
     * 如果是位图，比如是png图片，则使用其内中几个主要函数，处理该图像
     * 导入位图函数:传入
     */
    bitmapAdapter
      .importBitmap(fileData, fileType)
      .then(addCostumeFromBuffer)
      .catch(handleError);
  }
};

/**
 * 使用提供的上下文相关信息处理声音加载
 * @param {ArrayBuffer} fileData The sound data to load
 * @param {string} fileType The MIME type of this file; This function will exit
 * early if the fileType is unexpected.
 * @param {ScratchStorage} storage The ScratchStorage instance to cache the sound data
 * @param {Function} handleSound The function to execute on the sound object of type VMAsset
 * This function should be responsible for adding the sound to the VM
 * as well as handling other UI flow that should come after adding the sound
 */
const soundUpload = function (fileData, fileType, storage, handleSound) {
  let soundFormat;
  switch (fileType) {
    case "audio/mp3":
    case "audio/mpeg": {
      soundFormat = storage.DataFormat.MP3;
      break;
    }
    case "audio/wav":
    case "audio/wave":
    case "audio/x-wav":
    case "audio/x-pn-wav": {
      soundFormat = storage.DataFormat.WAV;
      break;
    }
    default:
      console.warn(`Encountered unexpected file type: ${fileType}`);
      return;
  }

  const vmSound = createVMAsset(
    storage,
    storage.AssetType.Sound,
    soundFormat,
    new Uint8Array(fileData)
  );

  handleSound(vmSound);
};

const spriteUpload = function (
  fileData,
  fileType,
  spriteName,
  storage,
  handleSprite,
  handleError = () => {}
) {
  console.log(
    "file-uploader.js spriteUpload:",
    fileData,
    fileType,
    spriteName,
    storage
  );
  switch (fileType) {
    case "":
    case "application/zip": {
      // 认为这是.sprite2或.sprite3文件
      handleSprite(new Uint8Array(fileData));
      return;
    }
    case "image/svg+xml":
    case "image/png":
    case "image/jpeg":
    default: {
      handleError(`Encountered unexpected file type: ${fileType}`);
      return;
    }
  }
};

export { handleFileUpload, costumeUpload, soundUpload, spriteUpload };
