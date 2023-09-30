/*
 * @Author: Satya
 * @Date: 2020-12-19 16:45:55
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-23 10:48:46
 * doc:重写的单文件形式
 */

/**
 * 枚举支持的数据格式. 请求资源时，资源类型对应数据格式种类
 * @enum {string}
 */
const DataFormat = {
  JPG: "jpg",
  JSON: "json",
  MP3: "mp3",
  PNG: "png",
  SB3: "sb3",
  SVG: "svg",
  WAV: "wav",
};

/**
 * 枚举支持的资产类型.
 * @type {Object.<String,AssetType>}
 * @typedef {Object} AssetType - 有关支持的资产类型的信息.
 * @property {string} contentType - 与此类数据关联的MIME类型。 对数据URI等有用.
 * @property {string} name - 该资产类型的易读名称.
 * @property {DataFormat} runtimeFormat - 用于判断数据使用哪种方式解析.
 * @property {boolean} immutable - 是否一成不变。 指示资产ID是否由资产内容确定.
 */
const AssetType = {
  ImageBitmap: {
    contentType: "image/png",
    name: "ImageBitmap",
    runtimeFormat: DataFormat.PNG,
    immutable: true,
  },
  ImageVector: {
    contentType: "image/svg+xml",
    name: "ImageVector",
    runtimeFormat: DataFormat.SVG,
    immutable: true,
  },
  Project: {
    contentType: "application/json",
    name: "Project",
    runtimeFormat: DataFormat.JSON,
    immutable: false,
  },
  Sound: {
    contentType: "audio/x-wav",
    name: "Sound",
    runtimeFormat: DataFormat.WAV,
    immutable: true,
  },
  Sprite: {
    contentType: "application/json",
    name: "Sprite",
    runtimeFormat: DataFormat.JSON,
    immutable: true,
  },
};

const memoizedToString = (assetId, data) => {
  const strings = {};
  let fromCharCode = null;
  const BTOA_CHUNK_MAX_LENGTH = 32766;

  if (!strings.hasOwnProperty(assetId)) {
    if (fromCharCode === null) {
      // 缓存前256个字符作为输入字节值.
      fromCharCode = new Array(256);
      for (let i = 0; i < 256; i++) {
        fromCharCode[i] = String.fromCharCode(i);
      }
    }
    const { length } = data;
    let s = "";
    // 遍历二进制数据的大块.
    for (let i = 0, e = 0; i < length; i = e) {
      // 创建小块以导致更多的较小分配和更少的较大分配.
      e = Math.min(e + BTOA_CHUNK_MAX_LENGTH, length);
      let s_ = "";
      for (let j = i; j < e; j += 1) {
        s_ += fromCharCode[data[j]];
      }
      // 对最新的块进行编码，以便我们创建一个大输出字符串，而不是先创建一个大输入字符串，然后再创建一个大输出字符串.
      /* global btoa */
      s += btoa(s_);
    }
    /** 为 strings[指定资源id]属性 赋值s的最终内容，也就是base64不含头 */
    strings[assetId] = s; // 输出base64的具体内容
  }
  return strings[assetId]; // 输出base64的具体内容
};

/**
 * Assert存储资源对象，由对象属性assetId确定唯一性
 */
class Asset {
  /**
   * 构造资产
   * @param {AssetType} assetType - 资源类型 (sound, image, etc.)
   * @param {string} assetId - data的md5值.
   * @param {DataFormat} [dataFormat] - 资源格式，用于采用何种方式格式化
   * @param {Buffer} [data] - 资源数据
   * @param {bool} [generateId] - 是否从数据的md5哈希创建ID
   */
  constructor(assetType, assetId, dataFormat, data, generateId) {
    /** @type {AssetType} */
    this.assetType = assetType;

    /** @type {string} */
    this.assetId = assetId;

    this.setData(data, dataFormat || assetType.runtimeFormat, generateId);

    /** @type {Asset[]} */
    this.dependencies = [];
    console.warn(
      "class Asset",
      assetType,
      assetId,
      dataFormat,
      data,
      generateId
    );
  }

  /**
   * set资源
   * @param {*} data 资源数据
   * @param {*} dataFormat 资源格式，用于采用何种方式格式化
   * @param {*} generateId 是否从数据的md5哈希创建ID
   */
  setData(data, dataFormat, generateId) {
    if (data && !dataFormat) throw new Error("提供的数据未指定其格式");

    /** @type {DataFormat} */
    this.dataFormat = dataFormat;

    /** @type {Buffer} */
    this.data = data;

    /**
     * 当使用者上传本地资源时，会用到此处生成ID，同时亦需要md5加密
     * 这里的data通常为 Uint8Array 格式
     */
    if (generateId) this.assetId = md5(data);

    // 仅在调用不带generateId的set时标记为清理
    // 如果正在生成新的ID，请将该资产标记为不清理
    this.clean = !generateId;
  }

  /**
   * @returns {string}.此资产的数据，解码为文本
   */
  decodeText() {
    // 返回一个DOMString，其中包含使用特定 TextDecoder 对象的方法解码的文本
    const decoder = new TextDecoder();
    return decoder.decode(this.data);
  }

  /**
   * 与`setData`相同，但首先编码文本.
   * @param {string} data - 文本数据进行编码和存储.
   * @param {DataFormat} dataFormat - 数据的格式（例如DataFormat.SVG）.
   * @param {bool} generateId - 设置数据后，将id设置为数据的md5？
   */
  encodeTextData(data, dataFormat, generateId) {
    // 接受一个 USVString 作为输入，返回一个包含文本的 Uint8Array，其中的文本使用 UTF-8 编码。
    const encoder = new TextEncoder();
    this.setData(encoder.encode(data), dataFormat, generateId);
  }

  /**
   * @param {string} [contentType] - （可选）覆盖要包含在数据URI中的内容类型.
   * @returns {string} - 代表资产数据的 DataURI
   */
  encodeDataURI(contentType) {
    contentType = contentType || this.assetType.contentType;
    return `data:${contentType};base64,${memoizedToString(
      this.assetId,
      this.data
    )}`;
  }
}

/**
 * @abstract 资产加载/保存助手的基类
 */
class Helper {
  constructor(parent) {
    this.parent = parent;
    console.warn("class Helper", this.parent);
  }

  /**
   * 提取资产但不处理依赖项.
   * @param {AssetType} assetType - 要获取的资产类型.
   * @param {string} assetId - 要提取的资产的ID：项目ID，MD5等.
   * @param {DataFormat} dataFormat - 要提取的资产的文件格式/文件扩展名：PNG，JPG等.
   * @return {Promise.<Asset>} 对资产内容的承诺.
   */
  load(assetType, assetId, dataFormat) {
    console.warn(
      "Helper load 提取资产但不处理依赖项",
      assetType,
      assetId,
      dataFormat
    );
    return Promise.reject(
      new Error(
        `No asset of type ${assetType} for ID ${assetId} with format ${dataFormat}`
      )
    );
  }
}

/** 将资源存储在本地内存中，assets存储所有资源文件
 * @property {AssetType} type - The type of the asset.
 * @property {DataFormat} format - The format of the asset's data.
 * @property {?string} id - The asset's unique ID.
 * @property {Buffer} data - The asset's data.
 */
class BuiltinHelper extends Helper {
  constructor(parent) {
    super(parent);
    /**
     * 在内存中存储的所有内置资产.
     * @type {Object.<AssetType, AssetIdMap>} 将资产类型映射到资产ID映射到实际资产
     * @typedef {Object.<string, BuiltinAssetRecord>} AssetIdMap - Maps asset ID to asset.
     */
    this.assets = {};
    console.warn("class BuiltinHelper extends Helper", this);
  }

  /**
   * 同步获取给定资产ID的缓存资产。 如果找不到，则返回null.
   * @param {string} assetId - 要获取的资产的ID.
   * @returns {?Asset} assetId的资产（如果存在）.
   */
  get(assetId) {
    console.warn("BuiltinHelper get同步获取给定资产ID的缓存资产", assetId);
    let asset = null;
    if (this.assets.hasOwnProperty(assetId)) {
      /** @type{BuiltinAssetRecord} */
      const assetRecord = this.assets[assetId];
      asset = new Asset(
        assetRecord.type,
        assetRecord.id,
        assetRecord.format,
        assetRecord.data
      );
    }
    return asset;
  }

  /**
   * 缓存资产以供将来按ID查找.
   * @param {AssetType} assetType - 要缓存的资产类型.
   * @param {DataFormat} dataFormat - 缓存资产的数据的dataFormat.
   * @param {Buffer} data - 缓存资产的数据.
   * @param {(string|number)} id - 缓存资产的ID.
   * @returns {string} 计算出的缓存资产的ID，如果资产是可变的，则提供该ID.
   */
  _store(assetType, dataFormat, data, id) {
    console.warn(
      "BuiltinHelper _store 缓存资产以供将来按ID查找",
      assetType,
      dataFormat,
      data,
      id
    );
    if (!dataFormat) throw new Error("高速缓存的数据未指定其格式");
    if (id !== "" && id !== null && typeof id !== "undefined") {
      if (this.assets.hasOwnProperty(id) && assetType.immutable) return id;
    } else if (assetType.immutable) {
      id = md5(data);
    } else {
      throw new Error("尝试缓存没有ID的数据");
    }
    this.assets[id] = {
      type: assetType,
      format: dataFormat,
      id: id,
      data: data,
    };
    return id;
  }

  /**
   *  获取资产，但不处理依赖项.
   * @param {AssetType} assetType - 要获取的资产类型.
   * @param {string} assetId - 要提取的资产的ID：项目ID，MD5等
   * @return {?Promise.<Asset>} A promise for the contents of the asset.
   */
  load(assetType, assetId) {
    console.warn(
      "BuiltinHelper load 获取资产，但不处理依赖项",
      assetType,
      assetId
    );
    // 立即返回null，以便存储可以快速转到尝试下一个帮助程序.
    if (!this.get(assetId)) return null;

    // 将现有对象转为 Promise 对象
    return Promise.resolve(this.get(assetId));
  }
}

/**
 * Get and send assets with the fetch standard web api.
 * 加载资源 网络资源获取方式有三种之一 FetchTool
 */
class FetchTool {
  /**
   * 得到支持吗？ 如果环境不支持Fetch，则返回false.
   * @returns {boolean} Is get supported?
   */
  get isGetSupported() {
    return typeof fetch !== "undefined";
  }

  /**
   * 通过提取从服务器请求数据
   * @param {{url:string}} reqConfig - 请求配置以获取数据.
   * @param {{method:string}} options - 配置提取的其他选项.
   * @returns {Promise.<Uint8Array>} 解决来自服务器的数据缓冲区.
   */
  get({ url, ...options }) {
    console.warn("FetchTool get函数:", url, options);
    return fetch(url, Object.assign({ method: "GET" }, options))
      .then((result) => result.arrayBuffer())
      .then((body) => new Uint8Array(body));
  }

  /**
   * 支持发送吗？ 如果环境不支持通过fetch发送，则返回false.
   * @returns {boolean} Is sending supported?
   */
  get isSendSupported() {
    return typeof fetch !== "undefined";
  }

  /**
   * 通过fetch将数据发送到服务器.
   * @param {Request} reqConfig - 请求配置以发送数据.
   * @returns {Promise.<string>} 服务器返回的元数据.
   */
  send({ url, withCredentials = false, ...options }) {
    console.warn("FetchTool send函数:", url, options);
    return fetch(
      url,
      Object.assign(
        {
          credentials: withCredentials ? "include" : "omit",
        },
        options
      )
    ).then((response) => {
      if (response.ok) return response.text();
      return Promise.reject(response.status);
    });
  }
}

/**
 * @typedef {object} Request
 * @property {string} url
 * @property {*} body
 * @property {string} method
 * @property {boolean} withCredentials
 */

/**
 * 由于浏览器支持的请求的方式不一样，而每种请求的性能和用法不一致，因此使用ProxyTool抽象代理对象.
 * 代理对象循环 FetchWorkerTool，FetchTool 请求网络数据
 */
class ProxyTool {
  constructor(filter = ProxyTool.TOOL_FILTER.ALL) {
    let tools;
    tools =
      filter === ProxyTool.TOOL_FILTER.READY
        ? [new FetchTool()]
        : // : [new FetchWorkerTool(), new FetchTool()];
          [new FetchTool()];

    /**
     * @type {Array.<Tool>} 代理工具的顺序.
     */
    this.tools = tools;
    console.warn("ProxyTool.js ", filter, tools);
  }

  /**
   * 得到支持吗？ 如果所有代理工具都返回false，则返回false.
   * @returns {boolean} Is get supported?
   */
  get isGetSupported() {
    return this.tools.some((tool) => tool.isGetSupported);
  }

  /**
   * 使用其中一种代理工具请求数据.
   * @param {Request} reqConfig - 请求配置以获取数据.(资源url：http://kid.…………/material/资源id.后缀名)
   * @returns {Promise.<Buffer>} 解决来自服务器的数据缓冲区.
   */
  get(reqConfig) {
    console.warn("ProxyTool.js get", reqConfig);
    let toolIndex = 0;
    const nextTool = (err) => {
      const tool = this.tools[toolIndex++];
      if (!tool) throw err;

      if (!tool.isGetSupported) return nextTool(err);

      return tool.get(reqConfig).catch(nextTool);
    };
    return nextTool();
  }

  /**
   * 支持发送吗？ 如果所有代理工具都返回false，则返回false.
   * @returns {boolean} Is sending supported?
   */
  get isSendSupported() {
    return this.tools.some((tool) => tool.isSendSupported);
  }

  /**
   * 使用代理工具之一将数据发送到服务器.
   * @param {Request} reqConfig - 请求配置以发送数据.
   * @returns {Promise.<Buffer|string|object>} 服务器返回的元数据.
   */
  send(reqConfig) {
    console.warn("ProxyTool.js send", reqConfig);
    let toolIndex = 0;
    const nextTool = (err) => {
      const tool = this.tools[toolIndex++];
      if (!tool) throw err;

      if (!tool.isSendSupported) return nextTool(err);

      return tool.send(reqConfig).catch(nextTool);
    };
    return nextTool();
  }
}

/**
 * @enum {string} 用于过滤ProxyTool实例中的工具集的常量值.
 */
ProxyTool.TOOL_FILTER = {
  /** 使用所有工具 */
  ALL: "all",
  /** 使用立即可用的工具. */
  READY: "ready",
};

/**
 * 确保请求配置
 * @param {*} reqConfig
 */
const ensureRequestConfig = (reqConfig) => {
  if (typeof reqConfig === "string") {
    return {
      url: reqConfig,
    };
  }
  return reqConfig;
};

/** web资源
 * @typedef {function} UrlFunction - 根据资产信息计算URL的功能.
 * @param {Asset} - 应为其计算URL的资产.
 * @returns {(string|object)} - 字符串，代表资产请求的URL或具有配置用于基础提取调用的对象（配置例如身份验证是必需的）
 */

class WebHelper extends Helper {
  constructor(parent) {
    super(parent);
    console.warn("class WebHelper ", parent);
    /**
     * @type {Array.<StoreRecord>}
     * @typedef {object} StoreRecord
     * @property {Array.<string>} types - 此商店提供的资产类型，在AssetType的名称字段中.
     * @property {UrlFunction} getFunction - 从资产计算URL的函数.
     * @property {UrlFunction} createFunction - 从资产计算URL的函数.
     * @property {UrlFunction} updateFunction - 从资产计算URL的函数.
     */
    this.stores = [];

    /**
     * 一组最佳地并行加载许多资产的工具。 如果一个工具无法使用，它将使用下一个.
     * @type {ProxyTool}
     */
    this.assetTool = new ProxyTool();

    /**
     * 一组工具，可最佳地与资产并行加载项目数据。 该工具集倾向于立即使用的工具。
     * 一些工具必须先进行初始化，然后才能加载文件.
     * @type {ProxyTool}
     */
    this.projectTool = new ProxyTool(ProxyTool.TOOL_FILTER.READY);
  }

  /**
   * 在基于Web的商店中注册资产。 来源将按照注册顺序进行检查.
   * @param {Array.<AssetType>} types - 该商店提供的资产类型.
   * @param {UrlFunction} getFunction - A function which computes a GET URL for an Asset
   * @param {UrlFunction} createFunction - A function which computes a POST URL for an Asset
   * @param {UrlFunction} updateFunction - A function which computes a PUT URL for an Asset
   */
  addStore(types, getFunction, createFunction, updateFunction) {
    this.stores.push({
      types: types.map((assetType) => assetType.name),
      get: getFunction,
      create: createFunction,
      update: updateFunction,
    });
  }

  /**
   * 提取资产但不处理依赖项.
   * @param {AssetType} assetType - 要获取的资产类型.
   * @param {string} assetId - 要提取的资产的ID: a project ID, MD5, etc.
   * @param {DataFormat} dataFormat - 要获取的资产的文件格式/文件扩展名: PNG, JPG, etc.
   * @return {Promise.<Asset>} A promise for the contents of the asset.
   */
  load(assetType, assetId, dataFormat) {
    console.warn("WebHelper load", assetType, assetId, dataFormat);
    /** @type {Array.<{url:string, result:*}>} URL列表尝试和遇到的错误. */
    const errors = [];
    const stores = this.stores
      .slice()
      .filter((store) => store.types.indexOf(assetType.name) >= 0);
    const asset = new Asset(assetType, assetId, dataFormat);

    let tool = this.assetTool;
    if (assetType.name === "Project") tool = this.projectTool;

    let storeIndex = 0;
    const tryNextSource = () => {
      const store = stores[storeIndex++];

      /** @type {UrlFunction} */
      const reqConfigFunction = store.get;

      if (reqConfigFunction) {
        const reqConfig = ensureRequestConfig(reqConfigFunction(asset));
        if (reqConfig === false) return tryNextSource();

        return tool
          .get(reqConfig)
          .then((body) => asset.setData(body, dataFormat))
          .catch(tryNextSource);
      } else if (errors.length > 0) return Promise.reject(errors);

      // no stores 匹配 asset
      return Promise.resolve(null);
    };

    return tryNextSource().then(() => asset);
  }

  /**
   * 使用提供的数据创建或更新资产。 如果未提供资产ID，则调用create函数
   * @param {AssetType} assetType - 要创建或更新的资产类型.
   * @param {?DataFormat} dataFormat - 存储资产的数据的DataFormat.
   * @param {Buffer} data - 缓存资产的数据.
   * @param {?string} assetId - 要提取的资产的ID：项目ID，MD5等.
   * @return {Promise.<object>} A promise 对创建或更新请求的响应
   */
  store(assetType, dataFormat, data, assetId) {
    console.warn("WebHelper store", assetType, dataFormat, data, assetId);
    const asset = new Asset(assetType, assetId, dataFormat);
    // If 有assetId，则应进行更新，否则创建以获取ID
    const create =
      assetId === "" || assetId === null || typeof assetId === "undefined";

    // Use the first store with the appropriate asset type and url function
    const store = this.stores.filter(
      (s) =>
        // Only use stores for the incoming asset type
        s.types.indexOf(assetType.name) !== -1 &&
        // 如果这是创建请求，则仅使用具有创建功能的store；如果是更新请求，则仅使用具有更新功能的store
        ((create && s.create) || s.update)
    )[0];

    const method = create ? "post" : "put";

    if (!store) return Promise.reject("没有合适的 stores");

    let tool = this.assetTool;
    if (assetType.name === "Project") {
      tool = this.projectTool;
    }

    const reqConfig = ensureRequestConfig(
      create ? store.create(asset) : store.update(asset)
    );
    const reqBodyConfig = Object.assign({ body: data, method }, reqConfig);
    return tool.send(reqBodyConfig).then((body) => {
      // xhr使得发送FormData和自动解析JSON响应变得困难。 因此，尝试将所有内容解析为JSON
      if (typeof body === "string") {
        try {
          body = JSON.parse(body);
        } catch (parseError) {
          // 如果它不可解析，那么即使我们愿意也无法添加ID，因此请在此处停止
          return body;
        }
      }
      return Object.assign(
        {
          id: body["content-name"] || assetId,
        },
        body
      );
    });
  }
}

class KidStorage {
  constructor() {
    this.defaultAssetId = {};

    this.builtinHelper = new BuiltinHelper(this);
    this.webHelper = new WebHelper(this);
    // this.builtinHelper.registerDefaultAssets(this);

    this._helpers = [
      {
        helper: this.builtinHelper,
        priority: 100,
      },
      {
        helper: this.webHelper,
        priority: -100,
      },
    ];
  }

  /**
   * @return {Asset} - the `Asset` class constructor.
   * @constructor
   */
  get Asset() {
    // return _Asset;
    return Asset;
  }

  /**
   * @return {AssetType} - the list of supported asset types.
   * @constructor
   */
  get AssetType() {
    // return _AssetType;
    return AssetType;
  }

  /**
   * @return {DataFormat} - the list of supported data formats.
   * @constructor
   */
  get DataFormat() {
    // return _DataFormat;
    return DataFormat;
  }

  /**
   * @deprecated Please use the `Asset` member of a storage instance instead.
   * @return {Asset} - the `Asset` class constructor.
   * @constructor
   */
  static get Asset() {
    // return _Asset;
    return Asset;
  }

  /**
   * @deprecated Please use the `AssetType` member of a storage instance instead.
   * @return {AssetType} - the list of supported asset types.
   * @constructor
   */
  static get AssetType() {
    // return _AssetType;
    return AssetType;
  }

  /**
   * 将存储助手添加到该管理器。 加载或存储资产时，将首先检查具有较高优先级数字的助手。 为了进行比较，内置资产的帮助器的优先级为100，默认的Web帮助器的优先级为-100。 具有相同优先级的助手的相对顺序不确定.
   * @param {Helper} helper - 要添加的助手.
   * @param {number} [priority] - 此新助手的优先级（默认值：0）.
   */
  addHelper(helper, priority = 0) {
    this._helpers.push({ helper, priority });
    this._helpers.sort((a, b) => b.priority - a.priority);
  }

  /**
   * 从内置存储中同步获取缓存的资产。 资产在加载时被缓存.
   * @param {string} assetId - 要提取的资产的ID.
   * @returns {?Asset} 资产（如果存在）.
   */
  get(assetId) {
    return this.builtinHelper.get(assetId);
  }

  /**
   * 构造资产，并选择生成其数据的md5哈希值以创建ID
   * @param {AssetType} assetType - 要缓存的资产类型.
   * @param {DataFormat} dataFormat - 缓存资产的数据的dataFormat
   * @param {Buffer} data - 缓存资产的数据.
   * @param {string} [id] - 缓存资产的ID.
   * @param {bool} [generateId] - 如果未提供“ id”，则将ID设置为md5数据哈希的标志
   * @returns {Asset} 如果未提供，则设置了具有“ id”属性的生成资产
   */
  createAsset(assetType, dataFormat, data, id, generateId) {
    if (!dataFormat) throw new Error("尝试创建没有dataFormat的资产");
    return new Asset(assetType, id, dataFormat, data, generateId);
  }

  /**
   * 注册资产的基于Web的来源。 来源将按照注册顺序进行检查.
   * @param {Array.<AssetType>} types - 此来源提供的资产类型.
   * @param {UrlFunction} getFunction - 从资产计算GET URL的函数.
   * @param {UrlFunction} createFunction - 计算资产数据的POST URL的函数.
   * @param {UrlFunction} updateFunction - 计算资产数据的PUT URL的函数.
   */
  addWebStore(types, getFunction, createFunction, updateFunction) {
    console.warn("KidStorage addWebStore", types);
    this.webHelper.addStore(types, getFunction, createFunction, updateFunction);
  }

  /**
   * 按类型和ID提取资产.
   * @param {AssetType} assetType - 要获取的资产类型。 这也决定了要使用哪个资产存储.
   * @param {string} assetId - 要提取的资产的ID：项目ID，MD5等.
   * @param {DataFormat} [dataFormat] - 可选：加载此格式，而不是AssetType的默认格式.
   * @return {Promise.<Asset>} 对所请求资产的Promise
   * If the promise is resolved with non-null,则该值为请求的资产或后备 a fallback.
   * If the promise is resolved with null,则无法在当前资产来源中找到所需资产.
   * If the promise is rejected,则至少一个资产来源存在错误。 HTTP 404此处不算作错误，但是（例如）HTTP 403.
   */
  load(assetType, assetId, dataFormat) {
    console.warn("KidStorage load", assetType, assetId, dataFormat);
    /** @type {Helper[]} */
    const helpers = this._helpers.map((x) => x.helper);
    const errors = [];
    dataFormat = dataFormat || assetType.runtimeFormat;

    let helperIndex = 0;
    let helper;
    const tryNextHelper = (err) => {
      if (err) errors.push(err);

      helper = helpers[helperIndex++];

      if (helper) {
        const loading = helper.load(assetType, assetId, dataFormat);
        if (loading === null) return tryNextHelper();

        // 请注意，其他尝试可能会记录错误。 如果成功，他们将被抑制..
        return (
          loading
            // TODO: 也许某些类型的错误应该阻止尝试下一个帮助程序?
            .catch(tryNextHelper)
        );
      } else if (errors.length > 0) {
        // 至少有一件事情出错了，而且我们也找不到资产.
        return Promise.reject(errors);
      }

      // 没问题，但我们找不到资产.
      return Promise.resolve(null);
    };

    return tryNextHelper();
  }

  /**
   * 按类型和ID存储资产.
   * @param {AssetType} assetType - 要获取的资产类型。 这也决定了要使用哪个资产存储.
   * @param {?DataFormat} [dataFormat] - 可选：加载此格式，而不是AssetType的默认格式.
   * @param {Buffer} data - 资产要存储的数据
   * @param {?string} [assetId] - 要提取的资产的ID：项目ID，MD5等.
   * @return {Promise.<object>} 对资产元数据的Promise
   */
  store(assetType, dataFormat, data, assetId) {
    console.warn("KidStorage store", assetType, dataFormat, data, assetId);
    dataFormat = dataFormat || assetType.runtimeFormat;
    return new Promise((resolve, reject) =>
      this.webHelper
        .store(assetType, dataFormat, data, assetId)
        .then((body) => {
          this.builtinHelper._store(assetType, dataFormat, data, body.id);
          return resolve(body);
        })
        .catch((error) => reject(error))
    );
  }

  /** @description 合并原来的扩展 */

  /**
   * 设置作品所在 HOST
   * @param {*} projectHost
   */
  setProjectHost(projectHost) {
    this.projectHost = projectHost;
  }
  /**
   * 获取作品 get作品资源
   * @param {*} projectAsset
   */
  getProjectGetConfig(projectAsset) {
    return `${this.projectHost}/${projectAsset.assetId}`;
  }

  /**
   * 获取作品创建配置
   */
  getProjectCreateConfig() {
    return {
      url: `${this.projectHost}/`,
      withCredentials: true,
    };
  }

  /**
   * 获取作品更新配置
   * @param {*} projectAsset
   */
  getProjectUpdateConfig(projectAsset) {
    return {
      url: `${this.projectHost}/${projectAsset.assetId}`,
      withCredentials: true,
    };
  }

  /**
   * 设置资源域名
   * @param {*} assetHost
   */
  setAssetHost(assetHost) {
    this.assetHost = assetHost;
  }

  /**
   * 获取资源的url
   * @param {*} asset 索要请求的资源
   * @returns 资源在七牛云的绝对地址
   * Example: https://kid.leadersir.net/material/67e0db3305b3c8bac3a363b1c428892e.png
   */
  getAssetGetConfig(asset) {
    // HOST 资源文件夹/资源id.资源的格式(作为后缀名)
    return `${GLOBAL_URL.ASSET_MATERIAL}${asset.assetId}.${asset.dataFormat}`;
  }
  /**
   * 获取资源创建配置
   * @param {*} asset
   */
  getAssetCreateConfig(asset) {
    return {
      // 没有诸如更新资产之类的事情，但是存储假定如果有assetId，则资产应该更新，并且资产存储将assetId用作创建URI的一部分。 因此，将方法强制为POST。
      // Then when storage finds this config to use for the "update", still POSTs
      method: "post",
      url: `${this.assetHost}/${asset.assetId}.${asset.dataFormat}`,
      withCredentials: true,
    };
  }

  /**
   * @function 添加官方的WebStores
   */
  addOfficialScratchWebStores() {
    console.log("注册资产的基于Web的来源");
    /**
     * @description 注册基于Web来源的资源。来源将按照注册顺序进行检查.通常时 项目的json文件
     * @param {Array.<AssetType>} types - 此来源提供的资产类型.
     * @param {UrlFunction} getFunction - 从资产计算GET URL的函数.
     * @param {UrlFunction} createFunction - 计算资产数据的POST URL的函数.
     * @param {UrlFunction} updateFunction - 计算资产数据的PUT URL的函数.
     */
    this.addWebStore(
      [this.AssetType.Project],
      this.getProjectGetConfig.bind(this),
      this.getProjectCreateConfig.bind(this),
      this.getProjectUpdateConfig.bind(this)
    );

    /**
     * @description 资源文件(图像或音频等)
     */
    this.addWebStore(
      [
        this.AssetType.ImageVector,
        this.AssetType.ImageBitmap,
        this.AssetType.Sound,
      ],
      this.getAssetGetConfig.bind(this),
      // 将create和update配置都设置为相同的方法，因为存储假定如果有assetId，它应该更新，但是资产存储区将assetId用作创建URI的一部分。.
      this.getAssetCreateConfig.bind(this),
      this.getAssetCreateConfig.bind(this)
    );

    /** @description 声音文件还需单独再处理一下 */
    this.addWebStore(
      [this.AssetType.Sound],
      (asset) =>
        `static/extension-assets/scratch3_music/${asset.assetId}.${asset.dataFormat}`
    );
  }
}

/**
 * 默认作品的数据
 * 此处的内容，也就是下载.sb3解压缩之后的project.json文件
 */
const DEFAULT_PROJECT_DATA = {
  targets: [
    {
      isStage: true,
      name: "Stage",
      variables: { "`jEk@4|i[#Fk?(8x)AV.-my variable": ["我的变量", 0] },
      lists: {},
      broadcasts: {},
      blocks: {},
      comments: {},
      currentCostume: 0,
      costumes: [
        {
          assetId: "67e0db3305b3c8bac3a363b1c428892e",
          name: "背景1",
          bitmapResolution: 2,
          md5ext: "67e0db3305b3c8bac3a363b1c428892e.png",
          dataFormat: "png",
          rotationCenterX: 480,
          rotationCenterY: 360,
        },
      ],
      sounds: [
        {
          assetId: "83a9787d4cb6f3b7632b4ddfebf74367",
          name: "pop",
          dataFormat: "wav",
          format: "",
          rate: 48000,
          sampleCount: 1123,
          md5ext: "83a9787d4cb6f3b7632b4ddfebf74367.wav",
        },
      ],
      volume: 100,
      layerOrder: 0,
      tempo: 60,
      videoTransparency: 50,
      videoState: "on",
      textToSpeechLanguage: null,
    },
    {
      isStage: false,
      name: "洋洋",
      variables: {},
      lists: {},
      broadcasts: {},
      blocks: {},
      comments: {},
      currentCostume: 0,
      costumes: [
        {
          assetId: "af4ff4232a743af3198b34d5e5d4e237",
          name: "造型1",
          bitmapResolution: 1,
          md5ext: "af4ff4232a743af3198b34d5e5d4e237.svg",
          dataFormat: "svg",
          rotationCenterX: -54,
          rotationCenterY: 71,
        },
        {
          assetId: "8601bd32ca5689ee893223a7bb087abd",
          name: "造型2",
          bitmapResolution: 1,
          md5ext: "8601bd32ca5689ee893223a7bb087abd.svg",
          dataFormat: "svg",
          rotationCenterX: -54,
          rotationCenterY: 71,
        },
        {
          assetId: "1160fd4cef57911426fb1dea2698976b",
          name: "造型3",
          bitmapResolution: 1,
          md5ext: "1160fd4cef57911426fb1dea2698976b.svg",
          dataFormat: "svg",
          rotationCenterX: -54,
          rotationCenterY: 71,
        },
      ],
      sounds: [
        {
          assetId: "6fcd64d6357e4ea03704e5f96bfd35ba",
          name: "Meow",
          dataFormat: "wav",
          format: "",
          rate: 22050,
          sampleCount: 7113,
          md5ext: "6fcd64d6357e4ea03704e5f96bfd35ba.wav",
        },
      ],
      volume: 100,
      layerOrder: 1,
      visible: true,
      x: 0,
      y: 0,
      size: 100,
      direction: 90,
      draggable: false,
      rotationStyle: "all around",
    },
  ],
  monitors: [],
  extensions: [],
  meta: { semver: "3.0.0", vm: "0.2.0", agent: " Edg/85.0.4183.102" },
};
