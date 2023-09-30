/*
 * @Author: Satya
 * @Date: 2020-11-12 16:41:53
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-20 17:29:43
 * doc: kid-blocks库
 */

/**
 * @function 具有存储在通用名称中的元素类型的名称.
 * @param {string} name 注册类型的名称. 比如[event,field,theme等]
 */
const RegistryType = function (name) {
  // console.log("KidBlocks RegistryType函数值:", name);
  this.name = name;
};

/**
 * @override 返回类型的名称.
 * @return {string} The name.
 */
RegistryType.prototype.toString = function () {
  // console.log("KidBlocks this.name:", this.name);
  return this.name;
};

/**
 * @module 注册类
 * @description 通用注册项，提供用于注册和注销不同类型的类。
 */
const Registry = {
  /**
   * @type {object} keys是正在注册的类的类型和名称,value是构造函数.
   * @example {'field': {'field_angle': Blockly.FieldAngle}}
   */
  _typeMap: {},
  /** @type {string} 用于为插件类型注册默认类的字符串. */
  DEFAULT: "default",

  /** @type {!RegistryType< .IConnectionChecker>} 连接检查器 */
  CONNECTION_CHECKER: new RegistryType("connectionChecker"),

  /** @type {!RegistryType< .Events.Abstract>} 事件 */
  EVENT: new RegistryType("event"),

  /** @type {!RegistryType< .Field>} 字段 */
  FIELD: new RegistryType("field"),

  /** @type {!Blockly.registry.Type<Blockly.blockRendering.Renderer>} */
  RENDERER: new RegistryType("renderer"),

  /** @type {!Blockly.registry.Type<Blockly.IToolbox>} */
  TOOLBOX: new RegistryType("toolbox"),

  /** @type {!Blockly.registry.Type<Blockly.Theme>} */
  THEME: new RegistryType("theme"),

  /** @type {!Blockly.registry.Type<Blockly.ToolboxItem>} */
  TOOLBOX_ITEM: new RegistryType("toolboxItem"),

  /** @type {!Blockly.registry.Type<Blockly.IFlyout>} */
  FLYOUTS_VERTICAL_TOOLBOX: new RegistryType("flyoutsVerticalToolbox"),

  /** @type {!Blockly.registry.Type<Blockly.IFlyout>} */
  FLYOUTS_HORIZONTAL_TOOLBOX: new RegistryType("flyoutsHorizontalToolbox"),

  /**
   * @function 根据类型检测给定的注册项是否需要属性
   * @param {string} type 类型 (比如，Field,Renderer)
   * @param {Function|Object} registryItem 正在检查所需属性的类或对象.
   */
  validate: function (type, registryItem) {
    // console.log("KidBlocks 根据类型检测给定的注册项是否需要属性", type);
    switch (type) {
      case String(RegistryType.FIELD):
        if (typeof registryItem.fromJson != "function")
          console.warn("类型必须有一个fromJson函数");
        break;
    }
  },

  /**
   * @function 根据类型和名称注册一个类
   * @param {*} type 类型 (比如，Field, Renderer)
   * @param {*} name 名称. (Ex. field_angle, geras)
   * @param {*} registryItem 要注册的类或对象。该参数值为typeMap对应属性的值
   */
  register: function (type, name, registryItem) {
    // console.log("KidBlocks Registry.register函数:", name);
    // type参数值 合法检测 之 类型错误或为空字符串
    if (
      (!(type instanceof RegistryType) && typeof type != "string") ||
      String(type).trim() == ""
    )
      console.warn("注册函数type参数值 类型错误或 字符串为空");
    //  type参数值 字符串值转为小写形式
    type = String(type).toLowerCase();

    // name参数值 合法检测 之 非字符串类或字符串为空
    if (typeof name != "string" || name.trim() == "")
      console.warn("注册函数name参数值 非字符串类或字符串为空");
    // name参数值 字符串转小写
    name = name.toLowerCase();

    // 如果要注册的类或对象为空
    if (!registryItem) console.warn("要注册的类或对象为null");

    // 从typeMap中查找指定type的属性，其返回值为type属性的对应大对象。
    let temp_type_registry = Registry._typeMap[type];
    // console.log("KidBlocks 注册 查找当前类型暂存:", temp_type_registry);

    // 如果 类型map中没有当前类型 为其赋值为空对象
    if (!temp_type_registry) temp_type_registry = Registry._typeMap[type] = {};

    // 校验 给定的类具有所有必须的属性
    Registry.validate(type, registryItem);
    // 如果 已有当前类型
    if (temp_type_registry[name]) console.warn("当前类型已注册过");

    // 为当前类型赋值。也就是typeMap[type]的value
    temp_type_registry[name] = registryItem;
    // console.log("KidBlocks 根据类型和名称注册一个类:", temp_type_registry);
  },

  /**
   * @function 根据传入的类型及名称，注销一个类
   * @param {*} type 传入的注销类型 (e.g. Field, Renderer)
   * @param {*} name 传入的注销类型的名称
   */
  unregister: function (type, name) {
    // console.log("根据传入的类型及名称，注销一个类", type);
    // 类型格式化
    type = String(type).toLowerCase();
    // 名称格式化
    name = name.toLowerCase();

    // 暂存 从typeMap中找到的项
    let temp_type_registry = Registry._typeMap[type];
    // console.log("KidBlocks 注销 查找当前类型暂存:", temp_type_registry);
    if (!temp_type_registry) {
      console.warn("KidBlocks 注销 temp_type_registry");
      return;
    }
    if (!temp_type_registry[name]) {
      console.warn("KidBlocks 注销 temp_type_registry[name]:", name);
      return;
    }
    // 只有类型名称对应并且在typeMap中具有时，才将其由typeMap中彻底删除
    delete Registry._typeMap[type][name];
  },

  /**
   * @function 获取传入的类型及名称的注册项
   * @description 可以是一个类或一个对象（如:Field及其类或对象）
   * @param {*} type  (e.g. Field, Renderer)
   * @param {*} name (Ex. field_angle, geras)
   * @returns 具有指定类及名称的类或对象
   */
  _getItem: function (type, name) {
    // console.log("KidBlocks 获取传入的类型及名称的注册项", type, name);
    // 类型格式化
    type = String(type).toLowerCase();
    // 名称格式化
    name = name.toLowerCase();

    // 暂存 从typeMap中找到的项
    let temp_type_registry = Registry._typeMap[type];
    // console.log("KidBlocks 获取注册项 查找当前类型暂存:", temp_type_registry);
    if (!temp_type_registry) {
      console.warn("KidBlocks 获取注册项 temp_type_registry");
      return null;
    }
    if (!temp_type_registry[name]) {
      console.warn("KidBlocks 获取注册项 temp_type_registry[name]:", name);
      return null;
    }

    return temp_type_registry[name];
  },

  /**
   * @function typeMap对象中是否有指定类型及名称的注册项。
   * @param {*} type (e.g. Field, Renderer)
   * @param {*} name (Ex. field_angle, geras)
   * @return {boolean} 如果注册表中的项目具有给定的类型和名称，则为true，否则为false.
   */
  hasItem: function (type, name) {
    // console.log("KidBlocks typeMap中是否有指定项 hasItem:", type, name);
    // 类型格式化
    type = String(type).toLowerCase();
    // 名称格式化
    name = name.toLowerCase();

    // 暂存 从typeMap中找到的项
    let temp_type_registry = Registry._typeMap[type];
    // console.log("KidBlocks 注销 查找当前类型暂存:", temp_type_registry);
    if (!temp_type_registry) return false;
    return !!temp_type_registry[name];
  },

  /**
   * @function 获取指定类型和名称的类
   * @param {*} type
   * @param {*} name
   * @return 具有给定名称和类型的类；如果不存在为null.
   */
  getClass: function (type, name) {
    // console.log("name:", name);
    // console.log("获取指定类型和名称的类:", type, name);
    return Registry._getItem(type, name);
  },

  /**
   * @function 获取指定类型和名称的对象
   * @param {*} type
   * @param {*} name
   * @return 具有给定名称和类型的对象；如果不存在为null.
   */
  getObject: function (type, name) {
    // console.log("获取指定类型和名称的对象:", type, name);
    return Registry._getItem(type, name);
  },

  /**
   * @function 从选项中获取类
   * @param {*} type
   * @param {*} options
   * @returns 通过选项扩展出来一个类
   */
  getClassFromOptions: function (type, options) {
    // console.log("从选项中获取类", type, options);
    // type参数值转字符串
    let typeName = type.toString();
    // 选项值
    let plugin = options.plugins[typeName] || Registry.DEFAULT;

    // 如果传入的是plugin类型，就返回plugin
    if (typeof plugin == "function") return plugin;

    // 返回 获取类
    return Registry.getClass(type, plugin);
  },
};

// console.log("Registry:", Registry);
