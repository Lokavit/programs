const EventEmitter = require("events");
const JSZip = require("jszip");

const Buffer = require("buffer").Buffer;
const centralDispatch = require("./dispatch/central-dispatch");
const ExtensionManager = require("./extension-support/extension-manager");
const Runtime = require("./engine/runtime");
const StringUtil = require("./util/string-util");
const formatMessage = require("format-message");

const Variable = require("./engine/variable");

const { loadCostume } = require("./import/load-costume.js");
const { loadSound } = require("./import/load-sound.js");

/**
 * 序列化所有给定类型的资源('sounds' or 'costumes')
 * in the provided runtime into an array of file descriptors.
 * A file descriptor is an object containing the name of the file
 * to be written and the contents of the file, the serialized asset.
 * @param {Runtime} runtime The runtime with the assets to be serialized
 * @param {string} assetType The type of assets to be serialized: 'sounds' | 'costumes'
 * @param {string=} optTargetId Optional target id to serialize assets for
 * @returns {Array<object>} An array of file descriptors for each asset
 */
const serializeAssets = function (runtime, assetType, optTargetId) {
  console.log("v-m.js 序列化资源");
  const targets = optTargetId
    ? [runtime.getTargetById(optTargetId)]
    : runtime.targets;
  const assetDescs = [];
  for (let i = 0; i < targets.length; i++) {
    const currTarget = targets[i];
    const currAssets = currTarget.sprite[assetType];
    for (let j = 0; j < currAssets.length; j++) {
      const currAsset = currAssets[j];
      const asset = currAsset.asset;
      assetDescs.push({
        fileName: `${asset.assetId}.${asset.dataFormat}`,
        fileContent: asset.data,
      });
    }
  }
  return assetDescs;
};

/**
 * Serialize all the sounds in the provided runtime or, if a target id is provided,
 * in the specified target into an array of file descriptors.
 * A file descriptor is an object containing the name of the file
 * to be written and the contents of the file, the serialized sound.
 * @param {Runtime} runtime The runtime with the sounds to be serialized
 * @param {string=} optTargetId Optional targetid for serializing sounds of a single target
 * @returns {Array<object>} An array of file descriptors for each sound
 */
const serializeSounds = function (runtime, optTargetId) {
  return serializeAssets(runtime, "sounds", optTargetId);
};

/**
 * Serialize all the costumes in the provided runtime into an array of file
 * descriptors. A file descriptor is an object containing the name of the file
 * to be written and the contents of the file, the serialized costume.
 * @param {Runtime} runtime The runtime with the costumes to be serialized
 * @param {string} optTargetId Optional targetid for serializing costumes of a single target
 * @returns {Array<object>} An array of file descriptors for each costume
 */
const serializeCostumes = function (runtime, optTargetId) {
  return serializeAssets(runtime, "costumes", optTargetId);
};

const RESERVED_NAMES = ["_mouse_", "_stage_", "_edge_", "_myself_", "_random_"];

const CORE_EXTENSIONS = [
  // 'motion',
  // 'looks',
  // 'sound',
  // 'events',
  // 'control',
  // 'sensing',
  // 'operators',
  // 'variables',
  // 'myBlocks'
];

/**
 * Handles connections between blocks, stage, and extensions.
 * 块，舞台，和延伸部之间的连接
 * @constructor
 */
class VirtualMachine extends EventEmitter {
  constructor() {
    super();

    /**
     * VM runtime, to store blocks, I/O devices, sprites/targets, etc.
     * @type {!Runtime}
     */
    this.runtime = new Runtime();
    console.log("class VirtualMachine:", this.runtime);
    centralDispatch.setService("runtime", this.runtime).catch((e) => {
      console.error(`Failed to register runtime service: ${JSON.stringify(e)}`);
    });

    /**
     * The "currently editing"/selected target ID for the VM.
     * 从任何Blockly工作区块事件路由到该目标.
     * @type {Target}
     */
    this.editingTarget = null;

    /**
     * 当前拖动的目标，用于重定向IO数据.
     * @type {Target}
     */
    this._dragTarget = null;

    // Runtime emits are passed along as VM emits.
    this.runtime.on(Runtime.SCRIPT_GLOW_ON, (glowData) => {
      this.emit(Runtime.SCRIPT_GLOW_ON, glowData);
    });
    this.runtime.on(Runtime.SCRIPT_GLOW_OFF, (glowData) => {
      this.emit(Runtime.SCRIPT_GLOW_OFF, glowData);
    });
    this.runtime.on(Runtime.BLOCK_GLOW_ON, (glowData) => {
      this.emit(Runtime.BLOCK_GLOW_ON, glowData);
    });
    this.runtime.on(Runtime.BLOCK_GLOW_OFF, (glowData) => {
      this.emit(Runtime.BLOCK_GLOW_OFF, glowData);
    });
    this.runtime.on(Runtime.PROJECT_START, () => {
      this.emit(Runtime.PROJECT_START);
    });
    this.runtime.on(Runtime.PROJECT_RUN_START, () => {
      this.emit(Runtime.PROJECT_RUN_START);
    });
    this.runtime.on(Runtime.PROJECT_RUN_STOP, () => {
      this.emit(Runtime.PROJECT_RUN_STOP);
    });
    this.runtime.on(Runtime.PROJECT_CHANGED, () => {
      this.emit(Runtime.PROJECT_CHANGED);
    });
    this.runtime.on(Runtime.VISUAL_REPORT, (visualReport) => {
      this.emit(Runtime.VISUAL_REPORT, visualReport);
    });
    /** targetsUpdate */
    this.runtime.on(Runtime.TARGETS_UPDATE, (emitProjectChanged) => {
      console.log(
        "vm this.runtime.on(Runtime.TARGETS_UPDATE, (emitProjectChanged):",
        emitProjectChanged
      );
      this.emitTargetsUpdate(emitProjectChanged);
    });
    this.runtime.on(Runtime.MONITORS_UPDATE, (monitorList) => {
      this.emit(Runtime.MONITORS_UPDATE, monitorList);
    });
    this.runtime.on(Runtime.BLOCK_DRAG_UPDATE, (areBlocksOverGui) => {
      this.emit(Runtime.BLOCK_DRAG_UPDATE, areBlocksOverGui);
    });
    this.runtime.on(Runtime.BLOCK_DRAG_END, (blocks, topBlockId) => {
      this.emit(Runtime.BLOCK_DRAG_END, blocks, topBlockId);
    });
    this.runtime.on(Runtime.EXTENSION_ADDED, (categoryInfo) => {
      this.emit(Runtime.EXTENSION_ADDED, categoryInfo);
    });
    this.runtime.on(
      Runtime.EXTENSION_FIELD_ADDED,
      (fieldName, fieldImplementation) => {
        this.emit(
          Runtime.EXTENSION_FIELD_ADDED,
          fieldName,
          fieldImplementation
        );
      }
    );
    this.runtime.on(Runtime.BLOCKSINFO_UPDATE, (categoryInfo) => {
      this.emit(Runtime.BLOCKSINFO_UPDATE, categoryInfo);
    });
    this.runtime.on(Runtime.BLOCKS_NEED_UPDATE, () => {
      this.emitWorkspaceUpdate();
    });
    this.runtime.on(Runtime.TOOLBOX_EXTENSIONS_NEED_UPDATE, () => {
      this.extensionManager.refreshBlocks();
    });
    this.runtime.on(Runtime.PERIPHERAL_LIST_UPDATE, (info) => {
      this.emit(Runtime.PERIPHERAL_LIST_UPDATE, info);
    });
    this.runtime.on(Runtime.PERIPHERAL_CONNECTED, () =>
      this.emit(Runtime.PERIPHERAL_CONNECTED)
    );
    this.runtime.on(Runtime.PERIPHERAL_REQUEST_ERROR, () =>
      this.emit(Runtime.PERIPHERAL_REQUEST_ERROR)
    );
    this.runtime.on(Runtime.PERIPHERAL_DISCONNECTED, () =>
      this.emit(Runtime.PERIPHERAL_DISCONNECTED)
    );
    this.runtime.on(Runtime.PERIPHERAL_CONNECTION_LOST_ERROR, (data) =>
      this.emit(Runtime.PERIPHERAL_CONNECTION_LOST_ERROR, data)
    );
    this.runtime.on(Runtime.PERIPHERAL_SCAN_TIMEOUT, () =>
      this.emit(Runtime.PERIPHERAL_SCAN_TIMEOUT)
    );
    this.runtime.on(Runtime.MIC_LISTENING, (listening) => {
      this.emit(Runtime.MIC_LISTENING, listening);
    });
    this.runtime.on(Runtime.RUNTIME_STARTED, () => {
      this.emit(Runtime.RUNTIME_STARTED);
    });
    this.runtime.on(Runtime.HAS_CLOUD_DATA_UPDATE, (hasCloudData) => {
      this.emit(Runtime.HAS_CLOUD_DATA_UPDATE, hasCloudData);
    });

    // 扩展管理器
    this.extensionManager = new ExtensionManager(this.runtime);

    // 加载核心扩展
    for (const id of CORE_EXTENSIONS) {
      this.extensionManager.loadExtensionIdSync(id);
    }

    this.blockListener = this.blockListener.bind(this);
    this.flyoutBlockListener = this.flyoutBlockListener.bind(this);
    this.monitorBlockListener = this.monitorBlockListener.bind(this);
    this.variableListener = this.variableListener.bind(this);
  }

  /**
   * 开始运行VM-在执行其他操作之前.
   */
  start() {
    this.runtime.start();
  }

  /**
   * "Green flag" handler - 以绿色标志开始所有线程.
   */
  greenFlag() {
    this.runtime.greenFlag();
  }

  /**
   * Stop all threads and running activities.停止所有线程
   */
  stopAll() {
    this.runtime.stopAll();
  }

  /**
   * 设置虚拟机是否处于"turbo模式"
   * When true, turbo mode，加速模式，循环不导致重绘
   * @param {boolean} turboModeOn 是否应设置涡轮增压模式.
   */
  setTurboMode(turboModeOn) {
    this.runtime.turboMode = !!turboModeOn;
    if (this.runtime.turboMode) {
      console.log("启用加速模式", Runtime.TURBO_MODE_ON);
      this.emit(Runtime.TURBO_MODE_ON);
    } else {
      console.log("禁用加速模式", Runtime.TURBO_MODE_OFF);
      this.emit(Runtime.TURBO_MODE_OFF);
    }
  }

  /**
   * Set whether the VM is in 2.0 "compatibility mode."
   * When true, runtime兼容模式，兼容2.0，30TPS
   * @param {boolean} compatibilityModeOn Whether compatibility mode is set.
   */
  setCompatibilityMode(compatibilityModeOn) {
    console.log("设置兼容模式 兼容2.0，30TPS");
    this.runtime.setCompatibilityMode(!!compatibilityModeOn);
  }

  /**
   * 清除当前正在运行的项目数据.
   */
  clear() {
    this.runtime.dispose();
    this.editingTarget = null;
    console.warn(
      "v-m.js清理函数会触发emitTargetsUpdate(false),即不提到项目变更"
    );
    this.emitTargetsUpdate(false /* Don't emit project change */);
  }

  /**
   * Get data for playground. Data comes back in an emitted event.
   * 获取editingTarget所在的thread里的data
   */
  getPlaygroundData() {
    console.log("获取editingTarget所在的thread里的data");
    const instance = this;
    // Only send back thread data for the current editingTarget.
    const threadData = this.runtime.threads.filter(
      (thread) => thread.target === instance.editingTarget
    );
    // Remove the target key, since it's a circular reference.
    const filteredThreadData = JSON.stringify(
      threadData,
      (key, value) => {
        if (key === "target" || key === "blockContainer") return;
        return value;
      },
      2
    );
    this.emit("playgroundData", {
      blocks: this.editingTarget.blocks,
      threads: filteredThreadData,
    });
  }

  /**
   * Post I/O data to the virtual devices. 向runtime中的设备发送数据
   * @param {?string} device Name of virtual I/O device.
   * @param {object} data Any data object to post to the I/O device.
   */
  postIOData(device, data) {
    // console.log("向runtime中的设备发送数据", device, data);
    if (this.runtime.ioDevices[device]) {
      this.runtime.ioDevices[device].postData(data);
    }
  }

  setVideoProvider(videoProvider) {
    this.runtime.ioDevices.video.setProvider(videoProvider);
  }

  setCloudProvider(cloudProvider) {
    this.runtime.ioDevices.cloud.setProvider(cloudProvider);
  }

  /**
   * Tell the specified extension to scan for a peripheral.
   * @param {string} extensionId - the id of the extension.
   */
  scanForPeripheral(extensionId) {
    this.runtime.scanForPeripheral(extensionId);
  }

  /**
   * Connect to the extension's specified peripheral.
   * @param {string} extensionId - the id of the extension.
   * @param {number} peripheralId - the id of the peripheral.
   */
  connectPeripheral(extensionId, peripheralId) {
    this.runtime.connectPeripheral(extensionId, peripheralId);
  }

  /**
   * Disconnect from the extension's connected peripheral.
   * @param {string} extensionId - the id of the extension.
   */
  disconnectPeripheral(extensionId) {
    this.runtime.disconnectPeripheral(extensionId);
  }

  /**
   * Returns whether the extension has a currently connected peripheral.
   * @param {string} extensionId - the id of the extension.
   * @return {boolean} - whether the extension has a connected peripheral.
   */
  getPeripheralIsConnected(extensionId) {
    return this.runtime.getPeripheralIsConnected(extensionId);
  }

  /**
   * 从.sb，.sb2，.sb3或json字符串加载项目.
   * @param {string | object} data 代表要加载的项目的json字符串，对象或ArrayBuffer.
   * @return {!Promise} Promise that resolves after targets are installed.
   */
  loadProject(data) {
    console.log("vm.js loadProject()", data);
    // 如果输入是一个对象，并且没有任何ArrayBuffer或ArrayBuffer视图（包括所有类型的数组和DataViews），则将该对象转换为JSON字符串，因为我们怀疑这是一个project.json，因为对象验证要求字符串或缓冲区为 输入
    if (
      typeof data === "object" &&
      !(data instanceof ArrayBuffer) &&
      !ArrayBuffer.isView(data)
    )
      data = JSON.stringify(data);

    // 使用校验
    const validate = require("./parser/index");
    const validationPromise = new Promise((resolve, reject) => {
      try {
        /**
         * 启用parser解析
         * 参数一:传入待解析的数据(项目JSON或元素的……)
         * 参数二:false表示项目数据;true表示单个元素数据
         */
        return resolve(validate(data, false));
      } catch (e) {
        // 由于输入似乎不是SB1File，因此引发原始错误.
        return reject(e);
      }
    });

    return validationPromise
      .then((res) => {
        console.log("validationPromise:", res);
        // 从JSON加载项目
        this.deserializeProject(res, null);
      })
      .then(() => {
        console.log("loadProject 调用 runtime.emitProjectLoaded()");
        this.runtime.emitProjectLoaded();
      })
      .catch((error) => {
        return Promise.reject(JSON.stringify(error));
      });
  }

  /**
   * Load a project from the Scratch web site, by ID.
   * 通过projectId，从storage中下载项目(storage封装了本地和网络加载，并缓存)
   * @param {string} id - the ID of the project to download, as a string.
   */
  downloadProjectId(id) {
    const storage = this.runtime.storage;
    if (!storage) {
      console.error("No storage module present; cannot load project: ", id);
      return;
    }
    const vm = this;
    const promise = storage.load(storage.AssetType.Project, id);
    promise.then((projectAsset) => {
      vm.loadProject(projectAsset.data);
    });
  }

  /**
   * 导出3.0项目,zip的blob流
   * @returns {string} Project in a Scratch 3.0 JSON representation.
   */
  saveProjectSb3() {
    const soundDescs = serializeSounds(this.runtime);
    const costumeDescs = serializeCostumes(this.runtime);
    const projectJson = this.toJSON(); // 导出project.json

    // TODO want to eventually move zip creation out of here, and perhaps
    // into scratch-storage
    const zip = new JSZip();

    // Put everything in a zip file
    zip.file("project.json", projectJson);
    this._addFileDescsToZip(soundDescs.concat(costumeDescs), zip);

    return zip.generateAsync({
      type: "blob",
      mimeType: "application/x.scratch.sb3",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6, // Tradeoff between best speed (1) and best compression (9)
      },
    });
  }

  /*
   * @type {Array<object>} 当前运行时中所有服装和声音的数组
   */
  get assets() {
    return this.runtime.targets.reduce(
      (acc, target) =>
        acc
          .concat(target.sprite.sounds.map((sound) => sound.asset))
          .concat(target.sprite.costumes.map((costume) => costume.asset)),
      []
    );
  }

  _addFileDescsToZip(fileDescs, zip) {
    for (let i = 0; i < fileDescs.length; i++) {
      const currFileDesc = fileDescs[i];
      zip.file(currFileDesc.fileName, currFileDesc.fileContent);
    }
  }

  /**
   * Exports a sprite in the sprite3 format.
   * @param {string} targetId ID of the target to export
   * @param {string=} optZipType Optional type that the resulting
   * zip should be outputted in. Options are: base64, binarystring,
   * array, uint8array, arraybuffer, blob, or nodebuffer. Defaults to
   * blob if argument not provided.
   * See https://stuk.github.io/jszip/documentation/api_jszip/generate_async.html#type-option
   * for more information about these options.
   * @return {object} A generated zip of the sprite and its assets in the format
   * specified by optZipType or blob by default.
   */
  exportSprite(targetId, optZipType) {
    console.log("v-m.js 导出元素", targetId, optZipType);
    const sb3 = require("./serialization/sb3");

    const soundDescs = serializeSounds(this.runtime, targetId);
    const costumeDescs = serializeCostumes(this.runtime, targetId);
    const spriteJson = StringUtil.stringify(
      sb3.serialize(this.runtime, targetId)
    );

    const zip = new JSZip();
    zip.file("sprite.json", spriteJson);
    this._addFileDescsToZip(soundDescs.concat(costumeDescs), zip);

    return zip.generateAsync({
      type: typeof optZipType === "string" ? optZipType : "blob",
      mimeType: "application/x.scratch.sprite3",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6,
      },
    });
  }

  /**
   * 将项目导出为Scratch 3.0 JSON表示形式.导出project.json
   * @return {string} Serialized state of the runtime.
   */
  toJSON() {
    const sb3 = require("./serialization/sb3");
    return StringUtil.stringify(sb3.serialize(this.runtime));
  }

  /**
   * 反序列化项目 从JSON表示加载项目.
   * @param {string} projectJSON 代表项目的JSON字符串.
   * @param {?JSZip} zip 可选的压缩项目，其中包含要加载的资产.
   * @returns {Promise} 判断2.0还是3.0的项目，3.0的项目包含meta字段，2.0的项目有自己的特定格式schema.json
   * 调用各自的 deserialize，反序列化project.json
   */
  deserializeProject(projectJSON, zip) {
    console.log("vm.js deserializeProject() 反序列化项目", projectJSON, zip);
    // Clear the current runtime
    this.clear();

    const runtime = this.runtime;

    const deserializePromise = function () {
      // 当前项目版本
      const projectVersion = projectJSON.projectVersion;
      if (projectVersion === 2) {
        const sb2 = require("./serialization/sb2");
        return sb2.deserialize(projectJSON, runtime, false, zip);
      }
      if (projectVersion === 3) {
        const sb3 = require("./serialization/sb3");
        console.log("v-m.js sb3.调用其专属反序列化", projectJSON, runtime, zip);
        return sb3.deserialize(projectJSON, runtime, zip);
      }
      return Promise.reject("Unable to verify Scratch Project version.");
    };
    return deserializePromise().then(({ targets, extensions }) => {
      console.log("调用installTargets安装所有解析", targets, extensions);
      // 解析出所有的targets，调用installTargets安装
      this.installTargets(targets, extensions, true);
    });
  }

  /**
   * Install `deserialize` results: 在这些目标使用的扩展名（如果有）之后添加零个或多个目标.
   * 安装targets,targets可能来自与extension，如果是，则先加载所有的extensions，通过promise.all，等扩展安装之后，再安装所有targets
   * @param {Array.<Target>} targets - 要安装的目标
   * @param {ImportedExtensionsInfo} extensions - 有关这些目标使用的扩展的元数据
   * @param {boolean} wholeProject - 如果安装整个项目，而不是单个精灵，则设置为true.
   * @returns {Promise} 安装目标后解决
   */
  installTargets(targets, extensions, wholeProject) {
    console.log("执行installTargets()", targets, extensions, wholeProject);
    const extensionPromises = [];

    extensions.extensionIDs.forEach((extensionID) => {
      if (!this.extensionManager.isExtensionLoaded(extensionID)) {
        const extensionURL =
          extensions.extensionURLs.get(extensionID) || extensionID;
        extensionPromises.push(
          this.extensionManager.loadExtensionURL(extensionURL)
        );
      }
    });

    targets = targets.filter((target) => !!target);

    return Promise.all(extensionPromises).then(() => {
      targets.forEach((target) => {
        console.warn("准备执行this.runtime.addTarget", target);
        this.runtime.addTarget(target);
        /** @type RenderedTarget */ target.updateAllDrawableProperties();
        // 确保唯一的精灵名称
        if (target.isSprite()) this.renameSprite(target.id, target.getName());
      });
      // 按层顺序对可执行目标进行排序. 使用后删除layerOrder属性.
      this.runtime.executableTargets.sort(
        (a, b) => a.layerOrder - b.layerOrder
      );
      targets.forEach((target) => {
        delete target.layerOrder;
      });

      // 选择要编辑的第一个目标，例如第一个精灵.
      this.editingTarget =
        wholeProject && targets.length > 1 ? targets[1] : targets[0];

      if (!wholeProject) this.editingTarget.fixUpVariableReferences();

      // 更新VM用户对工作空间上的目标和块的了解.
      console.warn("v-m.js installTargets emitTargetsUpdate(false)");
      this.emitTargetsUpdate(false /* Don't emit project change */);
      this.emitWorkspaceUpdate();
      this.runtime.setEditingTarget(this.editingTarget);
      this.runtime.ioDevices.cloud.setStage(this.runtime.getTargetForStage());
    });
  }

  /**
   * 添加一个精灵，可以是.sprite2或.sprite3。 首先解压缩并验证此类文件.
   * @param {string | object} input 代表要加载的项目的json字符串，对象或ArrayBuffer.
   * @return {!Promise} 在安装目标后解决的承诺.
   */
  addSprite(input) {
    const errorPrefix = "Sprite Upload Error:";
    if (
      typeof input === "object" &&
      !(input instanceof ArrayBuffer) &&
      !ArrayBuffer.isView(input)
    ) {
      // If the input is an object and not any ArrayBuffer
      // or an ArrayBuffer view (this includes all typed arrays and DataViews)
      // turn the object into a JSON string, because we suspect
      // this is a project.json as an object
      // validate expects a string or buffer as input
      // TODO not sure if we need to check that it also isn't a data view
      input = JSON.stringify(input);
    }

    const validationPromise = new Promise((resolve, reject) => {
      const validate = require("./parser/index");
      // The second argument of true below indicates to the parser/validator
      // that the given input should be treated as a single sprite and not
      // an entire project
      validate(input, true, (error, res) => {
        if (error) return reject(error);
        resolve(res);
      });
    });

    return validationPromise
      .then((validatedInput) => {
        const projectVersion = validatedInput[0].projectVersion;
        if (projectVersion === 2) {
          // 反序列化2.0的一个sprite，并加载到当前project
          return this._addSprite2(validatedInput[0], validatedInput[1]);
        }
        if (projectVersion === 3) {
          return this._addSprite3(validatedInput[0], validatedInput[1]);
        }
        return Promise.reject(
          `${errorPrefix} Unable to verify sprite version.`
        );
      })
      .then(() => this.runtime.emitProjectChanged())
      .catch((error) => {
        // Intentionally rejecting here (want errors to be handled by caller)
        if (error.hasOwnProperty("validationError")) {
          return Promise.reject(JSON.stringify(error));
        }
        return Promise.reject(`${errorPrefix} ${error}`);
      });
  }

  /**
   * 反序列化2.0的一个sprite，并加载到当前project
   * @param {object} sprite Object representing 2.0 sprite to be added.
   * @param {?ArrayBuffer} zip Optional zip of assets being referenced by json
   * @returns {Promise} Promise that resolves after the sprite is added
   */
  _addSprite2(sprite, zip) {
    console.log("vm.js _addSprite2", sprite, zip);
    // Validate & parse
    const sb2 = require("./serialization/sb2");
    return sb2
      .deserialize(sprite, this.runtime, true, zip)
      .then(({ targets, extensions }) =>
        this.installTargets(targets, extensions, false)
      );
  }

  /**
   * Add a single sb3 sprite.
   * @param {object} sprite Object rperesenting 3.0 sprite to be added.
   * @param {?ArrayBuffer} zip Optional zip of assets being referenced by target json
   * @returns {Promise} Promise that resolves after the sprite is added
   */
  _addSprite3(sprite, zip) {
    console.log("vm.js _addSprite3", sprite, zip);
    // Validate & parse
    const sb3 = require("./serialization/sb3");
    return sb3
      .deserialize(sprite, this.runtime, zip, true)
      .then(({ targets, extensions }) =>
        this.installTargets(targets, extensions, false)
      );
  }

  /**
   * @function 增加一个costume
   * @param {string} md5ext - MD5和要加载的costume的扩展名.
   * @param {!object} costumeObject 代表costume的对象.
   * @property {int} skinId - costume渲染皮肤的ID（安装后）.
   * @property {number} rotationCenterX - 旋转中心YX.
   * @property {number} rotationCenterY - 旋转中心Y.
   * @property {number} [bitmapResolution] - 位图costume的分辨率比例.
   * @param {string} optTargetId - 要添加的目标的ID，如果不是编辑目标.
   * @param {string} optVersion - 如果这是2，则将服装加载为sb2，否则将服装加载为sb3.
   * @returns {?Promise} - a promise that resolves when the costume has been added
   */
  addCostume(md5ext, costumeObject, optTargetId, optVersion) {
    console.log(
      "vm.js addCostume",
      md5ext,
      costumeObject,
      optTargetId,
      optVersion
    );
    const target = optTargetId
      ? this.runtime.getTargetById(optTargetId)
      : this.editingTarget;
    if (target) {
      return loadCostume(md5ext, costumeObject, this.runtime, optVersion).then(
        () => {
          target.addCostume(costumeObject);
          target.setCostume(target.getCostumes().length - 1);
          this.runtime.emitProjectChanged();
        }
      );
    }
    // 如果无法通过ID找到目标，则返回 rejected promise
    return Promise.reject();
  }

  /**
   * @function 将从库加载的costume添加到当前编辑目标.
   * @param {string} md5ext - MD5和要加载的costume的扩展名.
   * @param {!object} costumeObject 代表costume的对象.
   * @property {int} skinId - costume渲染皮肤的ID（安装后）.
   * @property {number} rotationCenterX - 旋转中心YX.
   * @property {number} rotationCenterY - 旋转中心Y.
   * @property {number} [bitmapResolution] - 位图costume的分辨率比例.
   * @returns {?Promise} - a promise that resolves when the costume has been added
   */
  addCostumeFromLibrary(md5ext, costumeObject) {
    console.log(
      "v-m.js 将从库加载的costume添加到当前编辑目标",
      md5ext,
      costumeObject
    );
    if (!this.editingTarget) return Promise.reject();
    return this.addCostume(
      md5ext,
      costumeObject,
      this.editingTarget.id,
      2 /* optVersion */
    );
  }

  /**
   * Duplicate the costume at the given index. Add it at that index + 1.复制costume
   * @param {!int} costumeIndex Index of costume to duplicate
   * @returns {?Promise} - a promise that resolves when the costume has been decoded and added
   */
  duplicateCostume(costumeIndex) {
    console.log("v-m.js 复制costume", costumeIndex);
    const originalCostume = this.editingTarget.getCostumes()[costumeIndex];
    const clone = Object.assign({}, originalCostume);
    const md5ext = `${clone.assetId}.${clone.dataFormat}`;
    return loadCostume(md5ext, clone, this.runtime).then(() => {
      this.editingTarget.addCostume(clone, costumeIndex + 1);
      this.editingTarget.setCostume(costumeIndex + 1);
      this.emitTargetsUpdate();
    });
  }

  /**
   * Duplicate the sound at the given index. Add it at that index + 1. 复制sound
   * @param {!int} soundIndex Index of sound to duplicate
   * @returns {?Promise} - a promise that resolves when the sound has been decoded and added
   */
  duplicateSound(soundIndex) {
    const originalSound = this.editingTarget.getSounds()[soundIndex];
    const clone = Object.assign({}, originalSound);
    return loadSound(
      clone,
      this.runtime,
      this.editingTarget.sprite.soundBank
    ).then(() => {
      this.editingTarget.addSound(clone, soundIndex + 1);
      this.emitTargetsUpdate();
    });
  }

  /**
   * Rename a costume on the current editing target. 重命名costume
   * @param {int} costumeIndex - the index of the costume to be renamed.
   * @param {string} newName - the desired new name of the costume (will be modified if already in use).
   */
  renameCostume(costumeIndex, newName) {
    console.log("v-m.js 重命名costume", costumeIndex);
    this.editingTarget.renameCostume(costumeIndex, newName);
    this.emitTargetsUpdate();
  }

  /**
   * Delete a costume from the current editing target. 删除costume
   * @param {int} costumeIndex - the index of the costume to be removed.
   * @return {?function} A function to restore the deleted costume, or null,
   * if no costume was deleted.
   */
  deleteCostume(costumeIndex) {
    console.log("v-m.js 删除costume", costumeIndex);
    const deletedCostume = this.editingTarget.deleteCostume(costumeIndex);
    if (deletedCostume) {
      const target = this.editingTarget;
      this.runtime.emitProjectChanged();
      return () => {
        target.addCostume(deletedCostume);
        this.emitTargetsUpdate();
      };
    }
    return null;
  }

  /**
   * Add a sound to the current editing target.
   * @param {!object} soundObject Object representing the costume.
   * @param {string} optTargetId - the id of the target to add to, if not the editing target.
   * @returns {?Promise} - a promise that resolves when the sound has been decoded and added
   */
  addSound(soundObject, optTargetId) {
    const target = optTargetId
      ? this.runtime.getTargetById(optTargetId)
      : this.editingTarget;
    if (target) {
      return loadSound(soundObject, this.runtime, target.sprite.soundBank).then(
        () => {
          target.addSound(soundObject);
          this.emitTargetsUpdate();
        }
      );
    }
    // If the target cannot be found by id, return a rejected promise
    return new Promise.reject();
  }

  /**
   * Rename a sound on the current editing target.
   * @param {int} soundIndex - the index of the sound to be renamed.
   * @param {string} newName - the desired new name of the sound (will be modified if already in use).
   */
  renameSound(soundIndex, newName) {
    this.editingTarget.renameSound(soundIndex, newName);
    this.emitTargetsUpdate();
  }

  /**
   * Get a sound buffer from the audio engine. 从audio engine获取一个sound buffer
   * @param {int} soundIndex - the index of the sound to be got.
   * @return {AudioBuffer} the sound's audio buffer.
   */
  getSoundBuffer(soundIndex) {
    const id = this.editingTarget.sprite.sounds[soundIndex].soundId;
    if (id && this.runtime && this.runtime.audioEngine) {
      return this.editingTarget.sprite.soundBank.getSoundPlayer(id).buffer;
    }
    return null;
  }

  /**
   * Update a sound buffer.
   * @param {int} soundIndex - the index of the sound to be updated.
   * @param {AudioBuffer} newBuffer - new audio buffer for the audio engine.
   * @param {ArrayBuffer} soundEncoding - the new (wav) encoded sound to be stored
   */
  updateSoundBuffer(soundIndex, newBuffer, soundEncoding) {
    const sound = this.editingTarget.sprite.sounds[soundIndex];
    const id = sound ? sound.soundId : null;
    if (id && this.runtime && this.runtime.audioEngine) {
      this.editingTarget.sprite.soundBank.getSoundPlayer(id).buffer = newBuffer;
    }
    // Update sound in runtime
    if (soundEncoding) {
      // Now that we updated the sound, the format should also be updated
      // so that the sound can eventually be decoded the right way.
      // Sounds that were formerly 'adpcm', but were updated in sound editor
      // will not get decoded by the audio engine correctly unless the format
      // is updated as below.
      sound.format = "";
      const storage = this.runtime.storage;
      sound.asset = storage.createAsset(
        storage.AssetType.Sound,
        storage.DataFormat.WAV,
        soundEncoding,
        null,
        true // generate md5
      );
      sound.assetId = sound.asset.assetId;
      sound.dataFormat = storage.DataFormat.WAV;
      sound.md5 = `${sound.assetId}.${sound.dataFormat}`;
      sound.sampleCount = newBuffer.length;
      sound.rate = newBuffer.sampleRate;
    }
    // If soundEncoding is null, it's because gui had a problem
    // encoding the updated sound. We don't want to store anything in this
    // case, and gui should have logged an error.

    this.emitTargetsUpdate();
  }

  /**
   * Delete a sound from the current editing target.
   * @param {int} soundIndex - the index of the sound to be removed.
   * @return {?Function} A function to restore the sound that was deleted,
   * or null, if no sound was deleted.
   */
  deleteSound(soundIndex) {
    const target = this.editingTarget;
    const deletedSound = this.editingTarget.deleteSound(soundIndex);
    if (deletedSound) {
      this.runtime.emitProjectChanged();
      const restoreFun = () => {
        target.addSound(deletedSound);
        this.emitTargetsUpdate();
      };
      return restoreFun;
    }
    return null;
  }

  /**
   * Get a string representation of the image from storage. 获取costume svg格式
   * @param {int} costumeIndex - the index of the costume to be got.
   * @return {string} the costume's SVG string if it's SVG,
   *     a dataURI if it's a PNG or JPG, or null if it couldn't be found or decoded.
   */
  getCostume(costumeIndex) {
    console.log("v-m.js 获取costume svg格式", costumeIndex);
    const asset = this.editingTarget.getCostumes()[costumeIndex].asset;
    if (!asset || !this.runtime || !this.runtime.storage) return null;
    const format = asset.dataFormat;
    if (format === this.runtime.storage.DataFormat.SVG) {
      return asset.decodeText();
    } else if (
      format === this.runtime.storage.DataFormat.PNG ||
      format === this.runtime.storage.DataFormat.JPG
    ) {
      return asset.encodeDataURI();
    }
    console.error(`Unhandled format: ${asset.dataFormat}`);
    return null;
  }

  /**
   * Update a costume with the given bitmap
   * @param {!int} costumeIndex - the index of the costume to be updated.
   * @param {!ImageData} bitmap - new bitmap for the renderer.
   * @param {!number} rotationCenterX x of point about which the costume rotates, relative to its upper left corner
   * @param {!number} rotationCenterY y of point about which the costume rotates, relative to its upper left corner
   * @param {!number} bitmapResolution 1 for bitmaps that have 1 pixel per unit of stage,
   *     2 for double-resolution bitmaps
   */
  updateBitmap(
    costumeIndex,
    bitmap,
    rotationCenterX,
    rotationCenterY,
    bitmapResolution
  ) {
    console.log(
      "v-m.js 更新Bitmap",
      costumeIndex,
      bitmap,
      rotationCenterX,
      rotationCenterY,
      bitmapResolution
    );
    const costume = this.editingTarget.getCostumes()[costumeIndex];
    if (!(costume && this.runtime && this.runtime.renderer)) return;

    costume.rotationCenterX = rotationCenterX;
    costume.rotationCenterY = rotationCenterY;

    // If the bitmap originally had a zero width or height, use that value
    const bitmapWidth = bitmap.sourceWidth === 0 ? 0 : bitmap.width;
    const bitmapHeight = bitmap.sourceHeight === 0 ? 0 : bitmap.height;
    // @todo: updateBitmapSkin does not take ImageData
    const canvas = document.createElement("canvas");
    canvas.width = bitmapWidth;
    canvas.height = bitmapHeight;
    const context = canvas.getContext("2d");
    context.putImageData(bitmap, 0, 0);

    // Divide by resolution because the renderer's definition of the rotation center
    // is the rotation center divided by the bitmap resolution
    this.runtime.renderer.updateBitmapSkin(
      costume.skinId,
      canvas,
      bitmapResolution,
      [rotationCenterX / bitmapResolution, rotationCenterY / bitmapResolution]
    );

    // @todo there should be a better way to get from ImageData to a decodable storage format
    canvas.toBlob((blob) => {
      const reader = new FileReader();
      reader.addEventListener("loadend", () => {
        const storage = this.runtime.storage;
        costume.dataFormat = storage.DataFormat.PNG;
        costume.bitmapResolution = bitmapResolution;
        costume.size = [bitmapWidth, bitmapHeight];
        costume.asset = storage.createAsset(
          storage.AssetType.ImageBitmap,
          costume.dataFormat,
          Buffer.from(reader.result),
          null, // id
          true // generate md5
        );
        costume.assetId = costume.asset.assetId;
        costume.md5 = `${costume.assetId}.${costume.dataFormat}`;
        this.emitTargetsUpdate();
      });
      // Bitmaps with a zero width or height return null for their blob
      if (blob) {
        reader.readAsArrayBuffer(blob);
      }
    });
  }

  /**
   * Update a costume with the given SVG
   * @param {int} costumeIndex - the index of the costume to be updated.
   * @param {string} svg - new SVG for the renderer.
   * @param {number} rotationCenterX x of point about which the costume rotates, relative to its upper left corner
   * @param {number} rotationCenterY y of point about which the costume rotates, relative to its upper left corner
   */
  updateSvg(costumeIndex, svg, rotationCenterX, rotationCenterY) {
    console.log(
      "v-m.js 更新造型svg",
      costumeIndex,
      svg,
      rotationCenterX,
      rotationCenterY
    );
    const costume = this.editingTarget.getCostumes()[costumeIndex];
    if (costume && this.runtime && this.runtime.renderer) {
      costume.rotationCenterX = rotationCenterX;
      costume.rotationCenterY = rotationCenterY;
      this.runtime.renderer.updateSVGSkin(costume.skinId, svg, [
        rotationCenterX,
        rotationCenterY,
      ]);
      costume.size = this.runtime.renderer.getSkinSize(costume.skinId);
    }
    const storage = this.runtime.storage;
    // If we're in here, we've edited an svg in the vector editor,
    // so the dataFormat should be 'svg'
    costume.dataFormat = storage.DataFormat.SVG;
    costume.bitmapResolution = 1;
    costume.asset = storage.createAsset(
      storage.AssetType.ImageVector,
      costume.dataFormat,
      new TextEncoder().encode(svg),
      null,
      true // generate md5
    );
    costume.assetId = costume.asset.assetId;
    costume.md5 = `${costume.assetId}.${costume.dataFormat}`;
    this.emitTargetsUpdate();
  }

  /**
   * Add a backdrop to the stage.
   * @param {string} md5ext - the MD5 and extension of the backdrop to be loaded.
   * @param {!object} backdropObject Object representing the backdrop.
   * @property {int} skinId - the ID of the backdrop's render skin, once installed.
   * @property {number} rotationCenterX - the X component of the backdrop's origin.
   * @property {number} rotationCenterY - the Y component of the backdrop's origin.
   * @property {number} [bitmapResolution] - the resolution scale for a bitmap backdrop.
   * @returns {?Promise} - a promise that resolves when the backdrop has been added
   */
  addBackdrop(md5ext, backdropObject) {
    console.log("v-m.js 添加背景", md5ext, backdropObject);
    return loadCostume(md5ext, backdropObject, this.runtime).then(() => {
      const stage = this.runtime.getTargetForStage();
      stage.addCostume(backdropObject);
      stage.setCostume(stage.getCostumes().length - 1);
      this.runtime.emitProjectChanged();
    });
  }

  /**
   * Rename a sprite.
   * @param {string} targetId ID of a target whose sprite to rename.
   * @param {string} newName New name of the sprite.
   */
  renameSprite(targetId, newName) {
    console.log("v-m.js 重命名元素", targetId, newName);
    const target = this.runtime.getTargetById(targetId);
    if (target) {
      if (!target.isSprite()) {
        throw new Error("Cannot rename non-sprite targets.");
      }
      const sprite = target.sprite;
      if (!sprite) {
        throw new Error("No sprite associated with this target.");
      }
      if (newName && RESERVED_NAMES.indexOf(newName) === -1) {
        const names = this.runtime.targets
          .filter(
            (runtimeTarget) =>
              runtimeTarget.isSprite() && runtimeTarget.id !== target.id
          )
          .map((runtimeTarget) => runtimeTarget.sprite.name);
        const oldName = sprite.name;
        const newUnusedName = StringUtil.unusedName(newName, names);
        sprite.name = newUnusedName;
        const allTargets = this.runtime.targets;
        for (let i = 0; i < allTargets.length; i++) {
          const currTarget = allTargets[i];
          currTarget.blocks.updateAssetName(oldName, newName, "sprite");
        }

        if (newUnusedName !== oldName) this.emitTargetsUpdate();
      }
    } else {
      throw new Error("No target with the provided id.");
    }
  }

  /**
   * Delete a sprite and all its clones.
   * @param {string} targetId ID of a target whose sprite to delete.
   * @return {Function} Returns a function to restore the sprite that was deleted
   */
  deleteSprite(targetId) {
    console.log("v-m.js 删除元素", targetId);
    const target = this.runtime.getTargetById(targetId);

    if (target) {
      const targetIndexBeforeDelete = this.runtime.targets
        .map((t) => t.id)
        .indexOf(target.id);
      if (!target.isSprite()) {
        throw new Error("Cannot delete non-sprite targets.");
      }
      const sprite = target.sprite;
      if (!sprite) {
        throw new Error("No sprite associated with this target.");
      }
      const spritePromise = this.exportSprite(targetId, "uint8array");
      const restoreSprite = () =>
        spritePromise.then((spriteBuffer) => this.addSprite(spriteBuffer));
      // Remove monitors from the runtime state and remove the
      // target-specific monitored blocks (e.g. local variables)
      target.deleteMonitors();
      const currentEditingTarget = this.editingTarget;
      for (let i = 0; i < sprite.clones.length; i++) {
        const clone = sprite.clones[i];
        this.runtime.stopForTarget(sprite.clones[i]);
        this.runtime.disposeTarget(sprite.clones[i]);
        // Ensure editing target is switched if we are deleting it.
        if (clone === currentEditingTarget) {
          const nextTargetIndex = Math.min(
            this.runtime.targets.length - 1,
            targetIndexBeforeDelete
          );
          if (this.runtime.targets.length > 0) {
            this.setEditingTarget(this.runtime.targets[nextTargetIndex].id);
          } else {
            this.editingTarget = null;
          }
        }
      }
      // Sprite object should be deleted by GC.
      this.emitTargetsUpdate();
      return restoreSprite;
    }

    throw new Error("No target with the provided id.");
  }

  /**
   * Duplicate a sprite.
   * @param {string} targetId ID of a target whose sprite to duplicate.
   * @returns {Promise} Promise that resolves when duplicated target has
   *     been added to the runtime.
   */
  duplicateSprite(targetId) {
    console.log("v-m.js 复制元素", targetId);
    const target = this.runtime.getTargetById(targetId);
    if (!target) {
      throw new Error("No target with the provided id.");
    } else if (!target.isSprite()) {
      throw new Error("Cannot duplicate non-sprite targets.");
    } else if (!target.sprite) {
      throw new Error("No sprite associated with this target.");
    }
    return target.duplicate().then((newTarget) => {
      this.runtime.addTarget(newTarget);
      newTarget.goBehindOther(target);
      this.setEditingTarget(newTarget.id);
    });
  }

  /**
   * Set the audio engine for the VM/runtime 关联audio engine，gui项目中(gui.jsx)调用
   * @param {!AudioEngine} audioEngine The audio engine to attach
   */
  attachAudioEngine(audioEngine) {
    this.runtime.attachAudioEngine(audioEngine);
  }

  /**
   * Set the renderer for the VM/runtime 关联渲染器, gui项目中(stage.jsx)调用
   * @param {!RenderWebGL} renderer The renderer to attach
   */
  attachRenderer(renderer) {
    this.runtime.attachRenderer(renderer);
  }

  /**
   * @returns {RenderWebGL} The renderer attached to the vm
   */
  get renderer() {
    return this.runtime && this.runtime.renderer;
  }

  /**
   * 为虚拟机/运行时设置svg适配器，它将临时2 svg转换为临时3 svg
   * @param {!SvgRenderer} svgAdapter The adapter to attach
   */
  attachV2SVGAdapter(svgAdapter) {
    console.log(
      "为虚拟机/运行时设置svg适配器，它将临时2 svg转换为临时3 svg:",
      svgAdapter
    );
    this.runtime.attachV2SVGAdapter(svgAdapter);
  }

  /**
   * 设置VM /运行时的位图适配器，该适配器将草稿2位图转换为草稿3位图。 （从头开始的3个位图都是位图分辨率2）
   * @param {!function} bitmapAdapter The adapter to attach
   */
  attachV2BitmapAdapter(bitmapAdapter) {
    this.runtime.attachV2BitmapAdapter(bitmapAdapter);
  }

  /**
   * 关联存储管理器, gui项目中(reducers/vm.js)调用
   * @param {!ScratchStorage} storage The storage module to attach
   */
  attachStorage(storage) {
    this.runtime.attachStorage(storage);
  }

  /**
   * 多语言支持
   * @param {!string} locale       current locale
   * @param {!object} messages     builtin messages map for current locale
   * @returns {Promise} Promise that resolves when all the blocks have been
   *     updated for a new locale (or empty if locale hasn't changed.)
   */
  setLocale(locale, messages) {
    if (locale !== formatMessage.setup().locale) {
      formatMessage.setup({
        locale: locale,
        translations: { [locale]: messages },
      });
    }
    return this.extensionManager.refreshBlocks();
  }

  /**
   * get the current locale for the VM
   * @returns {string} the current locale in the VM
   */
  getLocale() {
    return formatMessage.setup().locale;
  }

  /**
   * Handle a Blockly event for the current editing target.
   * @param {!Blockly.Event} e Any Blockly event.
   */
  blockListener(e) {
    if (this.editingTarget) {
      this.editingTarget.blocks.blocklyListen(e);
    }
  }

  /**
   * Handle a Blockly event for the flyout.
   * @param {!Blockly.Event} e Any Blockly event.
   */
  flyoutBlockListener(e) {
    this.runtime.flyoutBlocks.blocklyListen(e);
  }

  /**
   * Handle a Blockly event for the flyout to be passed to the monitor container.
   * @param {!Blockly.Event} e Any Blockly event.
   */
  monitorBlockListener(e) {
    // Filter events by type, since monitor blocks only need to listen to these events.
    // Monitor blocks shouldn't be destroyed when flyout blocks are deleted.
    if (["create", "change"].indexOf(e.type) !== -1) {
      this.runtime.monitorBlocks.blocklyListen(e);
    }
  }

  /**
   * Handle a Blockly event for the variable map.
   * @param {!Blockly.Event} e Any Blockly event.
   */
  variableListener(e) {
    // Filter events by type, since blocks only needs to listen to these
    // var events.
    if (["var_create", "var_rename", "var_delete"].indexOf(e.type) !== -1) {
      this.runtime.getTargetForStage().blocks.blocklyListen(e);
    }
  }

  /**
   * Set an editing target. An editor UI can use this function to switch
   * between editing different targets, sprites, etc.
   * After switching the editing target, the VM may emit updates
   * to the list of targets and any attached workspace blocks
   * (see `emitTargetsUpdate` and `emitWorkspaceUpdate`).
   * @param {string} targetId Id of target to set as editing.
   */
  setEditingTarget(targetId) {
    console.log("setEditingTarget", targetId);
    // Has the target id changed? If not, exit.
    if (this.editingTarget && targetId === this.editingTarget.id) return;

    const target = this.runtime.getTargetById(targetId);
    if (target) {
      this.editingTarget = target;
      // Emit appropriate UI updates.
      this.emitTargetsUpdate(false /* Don't emit project change */);
      this.emitWorkspaceUpdate();
      this.runtime.setEditingTarget(target);
    }
  }

  /**
   * Called when blocks are dragged from one sprite to another. Adds the blocks to the
   * workspace of the given target. 当从一个sprite拖拽到另一个sprite时调用
   * @param {!Array<object>} blocks Blocks to add.
   * @param {!string} targetId Id of target to add blocks to.
   * @param {?string} optFromTargetId Optional target id indicating that blocks are being
   * shared from that target. This is needed for resolving any potential variable conflicts.
   * @return {!Promise} Promise that resolves when the extensions and blocks have been added.
   */
  shareBlocksToTarget(blocks, targetId, optFromTargetId) {
    const sb3 = require("./serialization/sb3");

    const copiedBlocks = JSON.parse(JSON.stringify(blocks));
    Utility.newBlockIds(copiedBlocks);
    const target = this.runtime.getTargetById(targetId);

    if (optFromTargetId) {
      // If the blocks are being shared from another target,
      // resolve any possible variable conflicts that may arise.
      const fromTarget = this.runtime.getTargetById(optFromTargetId);
      fromTarget.resolveVariableSharingConflictsWithTarget(
        copiedBlocks,
        target
      );
    }

    // Create a unique set of extensionIds that are not yet loaded
    const extensionIDs = new Set(
      copiedBlocks
        .map((b) => sb3.getExtensionIdForOpcode(b.opcode))
        .filter((id) => !!id) // Remove ids that do not exist
        .filter((id) => !this.extensionManager.isExtensionLoaded(id)) // and remove loaded extensions
    );

    // Create an array promises for extensions to load
    const extensionPromises = Array.from(extensionIDs, (id) =>
      this.extensionManager.loadExtensionURL(id)
    );

    return Promise.all(extensionPromises).then(() => {
      copiedBlocks.forEach((block) => {
        target.blocks.createBlock(block);
      });
      target.blocks.updateTargetSpecificBlocks(target.isStage);
    });
  }

  /**
   * 当服装从编辑目标拖动到另一个目标时调用.
   * 将新添加的服装设置为当前服装.
   * @param {!number} costumeIndex 分享的编辑对象的服装索引.
   * @param {!string} targetId 要添加服装的目标ID.
   * @return {Promise} 承诺会在装入新服装时解决.
   */
  shareCostumeToTarget(costumeIndex, targetId) {
    const originalCostume = this.editingTarget.getCostumes()[costumeIndex];
    const clone = Object.assign({}, originalCostume);
    const md5ext = `${clone.assetId}.${clone.dataFormat}`;
    return loadCostume(md5ext, clone, this.runtime).then(() => {
      const target = this.runtime.getTargetById(targetId);
      if (target) {
        target.addCostume(clone);
        target.setCostume(target.getCostumes().length - 1);
      }
    });
  }

  /**
   * Called when sounds are dragged from editing target to another target.
   * @param {!number} soundIndex Index of the sound of the editing target to share.
   * @param {!string} targetId Id of target to add the sound.
   * @return {Promise} Promise that resolves when the new sound has been loaded.
   */
  shareSoundToTarget(soundIndex, targetId) {
    const originalSound = this.editingTarget.getSounds()[soundIndex];
    const clone = Object.assign({}, originalSound);
    const target = this.runtime.getTargetById(targetId);
    return loadSound(clone, this.runtime, target.sprite.soundBank).then(() => {
      if (target) {
        target.addSound(clone);
        this.emitTargetsUpdate();
      }
    });
  }

  /**
   * Repopulate the workspace with the blocks of the current editingTarget. This
   * allows us to get around bugs like gui#413.
   * 强制刷新
   */
  refreshWorkspace() {
    if (this.editingTarget) {
      this.emitWorkspaceUpdate();
      this.runtime.setEditingTarget(this.editingTarget);
      this.emitTargetsUpdate(false /* Don't emit project change */);
    }
  }

  /**
   * Emit metadata about available targets.发出有关可用目标的元数据
   * 编辑器UI可以使用它来显示目标列表并显示当前正在编辑的目标.
   * @param {bool} triggerProjectChange 如果为true，还发出项目更改事件.
   * 有选择地被不影响项目序列化的更新禁用.默认为true.
   */
  emitTargetsUpdate(triggerProjectChange) {
    console.log("vm emitTargetsUpdate():", triggerProjectChange);
    if (typeof triggerProjectChange === "undefined")
      triggerProjectChange = true;
    this.emit("targetsUpdate", {
      // [[target id, human readable target name], ...].
      targetList: this.runtime.targets
        .filter(
          // 不报告克隆.
          (target) => !target.hasOwnProperty("isOriginal") || target.isOriginal
        )
        .map((target) => target.toJSON()),
      // 当前正在编辑目标ID.
      editingTarget: this.editingTarget ? this.editingTarget.id : null,
    });
    if (triggerProjectChange) {
      this.runtime.emitProjectChanged();
    }
  }

  /**
   * Emit an Blockly/scratch-blocks compatible XML representation
   * of the current editing target's blocks.
   */
  emitWorkspaceUpdate() {
    // Create a list of broadcast message Ids according to the stage variables
    const stageVariables = this.runtime.getTargetForStage().variables;
    let messageIds = [];
    for (const varId in stageVariables) {
      if (stageVariables[varId].type === Variable.BROADCAST_MESSAGE_TYPE) {
        messageIds.push(varId);
      }
    }
    // Go through all blocks on all targets, removing referenced
    // broadcast ids from the list.
    for (let i = 0; i < this.runtime.targets.length; i++) {
      const currTarget = this.runtime.targets[i];
      const currBlocks = currTarget.blocks._blocks;
      for (const blockId in currBlocks) {
        if (currBlocks[blockId].fields.BROADCAST_OPTION) {
          const id = currBlocks[blockId].fields.BROADCAST_OPTION.id;
          const index = messageIds.indexOf(id);
          if (index !== -1) {
            messageIds = messageIds
              .slice(0, index)
              .concat(messageIds.slice(index + 1));
          }
        }
      }
    }
    // Anything left in messageIds is not referenced by a block, so delete it.
    for (let i = 0; i < messageIds.length; i++) {
      const id = messageIds[i];
      delete this.runtime.getTargetForStage().variables[id];
    }
    const globalVarMap = Object.assign(
      {},
      this.runtime.getTargetForStage().variables
    );
    const localVarMap = this.editingTarget.isStage
      ? Object.create(null)
      : Object.assign({}, this.editingTarget.variables);

    const globalVariables = Object.keys(globalVarMap).map(
      (k) => globalVarMap[k]
    );
    const localVariables = Object.keys(localVarMap).map((k) => localVarMap[k]);
    const workspaceComments = Object.keys(this.editingTarget.comments)
      .map((k) => this.editingTarget.comments[k])
      .filter((c) => c.blockId === null);

    const xmlString = `<xml xmlns="http://www.w3.org/1999/xhtml">
                            <variables>
                                ${globalVariables.map((v) => v.toXML()).join()}
                                ${localVariables
                                  .map((v) => v.toXML(true))
                                  .join()}
                            </variables>
                            ${workspaceComments.map((c) => c.toXML()).join()}
                            ${this.editingTarget.blocks.toXML(
                              this.editingTarget.comments
                            )}
                        </xml>`;

    this.emit("workspaceUpdate", { xml: xmlString });
  }

  /**
   * Get a target id for a drawable id. Useful for interacting with the renderer
   * 通过renderer的drawableid，反向获取targetid
   * @param {int} drawableId The drawable id to request the target id for
   * @returns {?string} The target id, if found. Will also be null if the target found is the stage.
   */
  getTargetIdForDrawableId(drawableId) {
    const target = this.runtime.getTargetByDrawableId(drawableId);
    if (
      target &&
      target.hasOwnProperty("id") &&
      target.hasOwnProperty("isStage") &&
      !target.isStage
    ) {
      return target.id;
    }
    return null;
  }

  /**
   * Reorder target by index. Return whether a change was made.
   * @param {!string} targetIndex Index of the target.
   * @param {!number} newIndex index that the target should be moved to.
   * @returns {boolean} Whether a target was reordered.
   */
  reorderTarget(targetIndex, newIndex) {
    let targets = this.runtime.targets;
    targetIndex = Utility.clamp(targetIndex, 0, targets.length - 1);
    newIndex = Utility.clamp(newIndex, 0, targets.length - 1);
    if (targetIndex === newIndex) return false;
    const target = targets[targetIndex];
    targets = targets
      .slice(0, targetIndex)
      .concat(targets.slice(targetIndex + 1));
    targets.splice(newIndex, 0, target);
    this.runtime.targets = targets;
    this.emitTargetsUpdate();
    return true;
  }

  /**
   * Reorder the costumes of a target if it exists. Return whether it succeeded.
   * @param {!string} targetId ID of the target which owns the costumes.
   * @param {!number} costumeIndex index of the costume to move.
   * @param {!number} newIndex index that the costume should be moved to.
   * @returns {boolean} Whether a costume was reordered.
   */
  reorderCostume(targetId, costumeIndex, newIndex) {
    const target = this.runtime.getTargetById(targetId);
    if (target) {
      const reorderSuccessful = target.reorderCostume(costumeIndex, newIndex);
      if (reorderSuccessful) {
        this.runtime.emitProjectChanged();
      }
      return reorderSuccessful;
    }
    return false;
  }

  /**
   * Reorder the sounds of a target if it exists. Return whether it occured.
   * @param {!string} targetId ID of the target which owns the sounds.
   * @param {!number} soundIndex index of the sound to move.
   * @param {!number} newIndex index that the sound should be moved to.
   * @returns {boolean} Whether a sound was reordered.
   */
  reorderSound(targetId, soundIndex, newIndex) {
    const target = this.runtime.getTargetById(targetId);
    if (target) {
      const reorderSuccessful = target.reorderSound(soundIndex, newIndex);
      if (reorderSuccessful) {
        this.runtime.emitProjectChanged();
      }
      return reorderSuccessful;
    }
    return false;
  }

  /**
   * Put a target into a "drag" state, during which its X/Y positions will be unaffected
   * by blocks.
   * 设置某target进入drag mode(this. _dragTarget=target), gui项目中(stage.jsx)调用
   * @param {string} targetId The id for the target to put into a drag state
   */
  startDrag(targetId) {
    const target = this.runtime.getTargetById(targetId);
    if (target) {
      this._dragTarget = target;
      target.startDrag();
    }
  }

  /**
   * Remove a target from a drag state, so blocks may begin affecting X/Y position again
   * 设置某target离开drag mode(this. _dragTarget=null), gui项目中(stage.jsx)调用
   * @param {string} targetId The id for the target to remove from the drag state
   */
  stopDrag(targetId) {
    const target = this.runtime.getTargetById(targetId);
    if (target) {
      this._dragTarget = null;
      target.stopDrag();
      this.setEditingTarget(
        target.sprite && target.sprite.clones[0]
          ? target.sprite.clones[0].id
          : target.id
      );
    }
  }

  /**
   * Post/edit sprite info for the current editing target or the drag target.
   * 向editing target or dragging target 发送sprite信息
   * @param {object} data An object with sprite info data to set.
   */
  postSpriteInfo(data) {
    if (this._dragTarget) {
      this._dragTarget.postSpriteInfo(data);
    } else {
      this.editingTarget.postSpriteInfo(data);
    }
    // Post sprite info means the gui has changed something about a sprite,
    // either through the sprite info pane fields (e.g. direction, size) or
    // through dragging a sprite on the stage
    // Emit a project changed event.
    this.runtime.emitProjectChanged();
  }

  /**
   * Set a target's variable's value. Return whether it succeeded.
   * @param {!string} targetId ID of the target which owns the variable.
   * @param {!string} variableId ID of the variable to set.
   * @param {!*} value The new value of that variable.
   * @returns {boolean} whether the target and variable were found and updated.
   */
  setVariableValue(targetId, variableId, value) {
    const target = this.runtime.getTargetById(targetId);
    if (target) {
      const variable = target.lookupVariableById(variableId);
      if (variable) {
        variable.value = value;

        if (variable.isCloud) {
          this.runtime.ioDevices.cloud.requestUpdateVariable(
            variable.name,
            variable.value
          );
        }

        return true;
      }
    }
    return false;
  }

  /**
   * Get a target's variable's value. Return null if the target or variable does not exist.
   * @param {!string} targetId ID of the target which owns the variable.
   * @param {!string} variableId ID of the variable to set.
   * @returns {?*} The value of the variable, or null if it could not be looked up.
   */
  getVariableValue(targetId, variableId) {
    const target = this.runtime.getTargetById(targetId);
    if (target) {
      const variable = target.lookupVariableById(variableId);
      if (variable) {
        return variable.value;
      }
    }
    return null;
  }

  /**
   * Allow VM consumer to configure the ScratchLink socket creator.
   * @param {Function} factory The custom ScratchLink socket factory.
   */
  configureScratchLinkSocketFactory(factory) {
    this.runtime.configureScratchLinkSocketFactory(factory);
  }
}

module.exports = VirtualMachine;
