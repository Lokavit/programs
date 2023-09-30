/*
 * @Author: Satya
 * @Date: 2020-07-22 12:03:07
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-24 17:50:58
 * doc:启动器文件。包含功能：
 *  进入模式检测函数: [由网站点击开始创作进入、由网站边看边做点击进入]
 *  对登录状态做首次检测: 因为边看边做模式需要后续操作
 *  返回视频ID函数:通过当前页面URL获取[videoId]值
 *  获取视频信息函数: 登录状态检测成功后，获取视频信息
 *  创建视频窗体函数: 由边看边做进入，并且登录，会创建视频窗体，播放视频
 *
 */

console.log("window", window);
console.log("URL:", window.location.protocol);
console.log("events:", new EventEmitter());
console.log("pro", window.KidProBlocks);
console.log("jr", window.KidJrBlocks);
console.log("kid-storage:", KidStorage);
console.log("kid-svg-renderer:", KidSvgRenderer);
console.log("kid-render", RenderWebGL);
console.log("kid-vm", VirtualMachine);
console.log("kid-audio", AudioEngine);

// 多语言明文
const L10N_MSGS = {
  en: EN,
  "zh-cn": ZH_CN,
  "zh-tw": ZH_TW,
};
/** @description 语言环境初始化状态 ，目前只做中文简体 */
const INIT_LOCALES = {
  // isRtl: false,
  locale: "zh-cn",
  // messagesByLocale: L10N_MSGS,
  messages: L10N_MSGS["zh-cn"],
};

const GLOBAL_L10N = (prop) => {
  return L10N_MSGS[document.documentElement.lang][prop];
};

/** 实例化 VM */
const VM = new VirtualMachine();
console.log("实例化完成 VM:", VM);
VM.initialized = true;

/** @description 重写实例化KIDSTORAGE相关 */
const STORAGE = new KidStorage();
console.log("STORAGE 实例化", STORAGE);
/** @description 设置作品所在 HOST */
STORAGE.setProjectHost(GLOBAL_URL.HOST_ASSET);
/** @description 设置资源所在 HOST */
STORAGE.setAssetHost(GLOBAL_URL.HOST_ASSET);
/** @description 注册资产 */
STORAGE.addOfficialScratchWebStores();
/** * @description VM/runtime 关联存储管理器 此处要使用，否则舞台无法显示元素*/
VM.attachStorage(STORAGE);

/** @description 实例化渲染器并将其连接到VM */
// const CANVAS = document.getElementById("kid_stage");
const CANVAS = document.createElement("canvas");
CANVAS.setAttribute("id", "kid_stage");
const RENDERER = new RenderWebGL(CANVAS);
console.warn("RENDERER:", RENDERER);
VM.attachRenderer(RENDERER);

/** @description 音频引擎 */
const AUDIOENGINE = new AudioEngine();
/** * @description VM/runtime 音频处理引擎 */
VM.attachAudioEngine(AUDIOENGINE);

/** * @description VM/runtime 设置svg适配器，它将临时2 svg转换为临时3 svg */
VM.attachV2SVGAdapter(KidSvgRenderer.SVGRenderer);
/** * @description VM/runtime 位图适配器，该适配器将草稿2位图转换为草稿3位图 */
VM.attachV2BitmapAdapter(KidSvgRenderer.BitmapAdapter);

/** * @description VM/runtime 多语言支持 */
VM.setLocale(INIT_LOCALES.locale, INIT_LOCALES.messages);

/** * @description VM/runtime true, runtime兼容模式，兼容2.0，30TPS */
VM.setCompatibilityMode(true);

VM.start();

/**
 *  this.emit(自定义事件名,要传送的数据)。触发当前实例上的事件，要传递的数据会传给监听器
 * vm库中 this.emit("targetsUpdate", {targetList:[],editingTarget:""})
 * VM.$on('事件名',callback)。callback回调$emit要传送的数据；监听当前实例上自定义事件
 * vm.on("targetsUpdate", handleTargetsUpdate)
 */
/** @description vm库的开启加速模式 */
VM.on("TURBO_MODE_ON", () => true);
/** @description vm库的关闭加速模式 */
VM.on("TURBO_MODE_OFF", () => false);
/** @description vm库的 项目运行开始 */
VM.on("PROJECT_RUN_START", () => true);
/** @description vm库的 项目运行停止 */
VM.on("PROJECT_RUN_STOP", () => false);
/** @description vm库的项目变更事件 */
VM.on("PROJECT_CHANGED", () => true);
/** @description vm库的运行时 准备完毕事件 */
VM.on("RUNTIME_STARTED", () => true);
VM.on("PROJECT_START", () => ({}));
VM.on("targetsUpdate", vmTargetsUpdate);

// 加载默认项目
pullDelaultProject(DEFAULT_PROJECT_DATA);
// VM.emitTargetsUpdate();

// console.log("VM 运行时 加载完毕:", VM.runtime.emitProjectLoaded());
/**
 * @function 拉取默认作品
 * @description 该函数一定是在作品id为0时执行
 * @description 将此处改为读取默认结构，去掉缓存部分
 */
function pullDelaultProject(data) {
  console.log("拉取默认作品,直接读取 DEFAULT_PROJECT_DATA 对象:", data);
  if (data) {
    // 要加载的项目的json字符串，对象或ArrayBuffer
    VM.loadProject(data).then(() => {});
    VM.greenFlag();
  } else {
    console.error("找不到项目");
  }
}

/**
 * @function 拉取远程指定ID的作品数据
 * @description 通常是用户保存在服务器上的作品
 */
async function pullRemoteProject() {
  console.log("拉取远程作品:", project_id);
  const res = await fetch(`${GLOBAL_URL.API_GET_PROJECT_DATA}/${project_id}`);
  const result = res.json();
  console.log("拉取远程指定ID的作品数据:", result);
  // 如果拉取数据成功，并且满足其他条件，继续拉取数据中指定的.sb3文件
  if (result.success && result.result && result.result.sb3Path) {
    const res_blob = await fetch(result.result.sb3Path);
    const result_file = await res_blob.blob();
    console.log("拉取到.sb3文件", result_file);
    // 对文件进行读取操作
    let reader = new FileReader();
    // 读取指定blob的内容,一旦完成,保存被读取文件的 ArrayBuffer 数据对象
    reader.readAsArrayBuffer(result_file);
    // 处理load事件。该事件在读取操作完成时触发。
    reader.onload = function (event) {
      console.log("读取完成:", event.target.result);
      VM.loadProject(event.target.result)
        .then(() => {})
        .catch((error) => {
          console.warn("VM.loadProject error", error);
        });
    };
  }
}

// material目标的元数据
const materialsMeta = {
  materials: {},
  editMaterialId: "",
};
const handle = {
  // 用于拦截对对象属性的 get 操作
  get: function (target, key) {
    // console.log("获取属性:", target, key);
    return key in target ? target[key] : "No prop!";
  },
  // 用于拦截对对象属性的 set 操作
  set(target, key, value) {
    // console.log("设置属性:", target, key, value);
    // console.log("set:", key);
    target[key] = value;
    return true;
  },
};

const proxy_materialsData = new Proxy(materialsMeta, handle);

/**
 * @function vm库的[targetsUpdate]Targets更新
 * @description 该函数为vm.on("targetsUpdate",handleTargetsUpdate)所需
 * @param {*} data 该参数随意命名，用于接受vm库中的对应this.emit("targetsUpdate",要传递的数据)该传递数据即赋值给此处的data
 * @description data格式为 {editingTarget: "s6HcKHxn+fjWM!.SQ4C@"targetList: (2) [{…}, {…}]}
 */
function vmTargetsUpdate(data) {
  console.log("vm库 Targets更新", data);
  // todo 判断应当更新的条件:非全屏、非只播放、非录音中
  // if (shouldUpdateTargets){} 嵌套以下代码块
  // 如果应当更新，就将data中的数据整理为当前可识别格式(数组转对象)
  if (data.targetList.length > 0) {
    let temp = data.targetList.reduce(
      (targets, target, index) =>
        Object.assign(targets, {
          [target.id]: { order: index, ...target },
        }),
      {}
    );
    proxy_materialsData.materials = temp;
    proxy_materialsData.editMaterialId = data.editingTarget;
    console.log("proxy_???", proxy_materialsData);
    VM.setEditingTarget(proxy_materialsData.editMaterialId);
    console.log("设置当前可编辑:", proxy_materialsData.editMaterialId);
  }
}

/** @description 调用创建loading函数 */
document.body.insertAdjacentHTML("afterbegin", CREATE_LOADING());
// 移除 loading遮罩的暂行版，实际使用加载进度完成与否来控制laoding显隐
setTimeout(() => {
  let loading = document.querySelector(".loading");
  document.body.removeChild(loading);

  createStageHeader();
  // 创建对应结构
  createStageWarpper();

  // 在这里挂一下 cnavas
  document.querySelector("#stage_parent").appendChild(CANVAS);
  CANVAS.setAttribute("class", "stage_size");
  updateRect();
  createStageFooter();
}, 5000);

function updateRect() {
  let currnet_rect = CANVAS.getBoundingClientRect();
  console.warn("currnet_rect:", currnet_rect);
  RENDERER.resize(currnet_rect.width, currnet_rect.height);
  draw();
  RENDERER.draw();
}

function draw() {
  console.warn("draw()");
}

// /** @description 浏览器是否在支持类型及版本内 */
// Utility.supportedBrowser();
// /** @description 浏览器是否支持WebGL */
// Utility.supportedWebGL();

/** @description 存储当前用户是否在线 (也就是是否登入) */
let isOnline = false;
/** @description 用于存储登入用户的信息 */
let user_info = {};
/** @description 用于存储是否为批改模式 */
let isAbleEditProject = false;
/** @description 当前url作品id,没有则返回0 */
let project_id = Utility.getUrlSearchParams("id")
  ? Utility.getUrlSearchParams("id")
  : 0;
/** @description 项目的默认标题 */
let project_title = "KID";
/** @description 存储项目的数据 */
let project_data = {};

/**
 * @function 登录检测
 * @description 在线状态始终在本函数中改变
 * @returns 返回检测结果(似乎无需返回)
 */
async function checkSignIn() {
  console.log("进入执行登入检测");
  const response = await fetch(GLOBAL_URL.API_SIGNIN_CHECK);
  const result = await response.json();
  console.log("登入状态检测:", result);
  isOnline = result.success;
  // return result;
}

// checkSignIn(); // 作为演示，关闭登入状态检测

/**
 * @function 创建<header>
 */
function createHeader() {
  console.log("创建header");
  let str_html = `
  <header class="header">
    ${CREATE_SITE_LOGO()}
    <nav>
      ${CREATE_FILEMENU()}
      <div onclick="showFileMenu(event)">编辑
        <ul class="common_is_hide">
          <li onclick="toggleTurboMode(event)">打开加速</li>
        </ul>
      </div>
      <div id="push_project" onclick="pushProject(event)">发布</div>
      ${CREATE_TUTORIALS_AND_PROJECT_LIB()}
      <div class="btn_sign common_is_show" onclick="openSignin(event)">登入</div>
    </nav>
  </header>
  `;
  document.body.insertAdjacentHTML("afterbegin", str_html);
}

createHeader();

/**
 * @function 是否可以改变作品
 * @description 需具备:登入状态 && url上具有当前作品id
 */
async function ableEditProject() {
  if (!project_id || project_id == 0) return;
  const response = await fetch(
    GLOBAL_URL.API_IS_ABLE_EDIT_PROJECT + project_id
  );
  const result = response.json();
  console.log("是否可以改编作品:", result);
  // 将结果直接赋值给是否为批改模式
  isAbleEditProject = result.success;
  // 如果是批改状态，将header>nav中的「发布」变更为「批改」
  if (isAbleEditProject) {
    let push_project = document.getElementById("push_project");
    push_project.innerText = isAbleEditProject ? "批改" : "发布";
    console.log("？？？", push_project);
  } else {
    console.warn("接口未通或id有误:", project_id);
  }
}

ableEditProject();

/**
 * @function 创建右侧个人中心结构
 * @param {*} userInfo 传入的用户数据
 */
function createAccount(userInfo) {
  if (!userInfo || userInfo == {}) return;
  let account = document.querySelector(".account");
  if (account) {
    Utility.commonToggleElement(account);
  } else {
    let str_html = `
    <div class="account common_is_show" onclick="showAccountMenu(event)">
      <img src="${user_info.avatar}"/>${user_info.nickName}
      <ul class="common_is_hide">
        <li onclick="signOut(event)">登出</li>
      </ul>
    </div>`;
    let header_nav = document.querySelector(".header nav");
    header_nav.insertAdjacentHTML("beforeend", str_html);
  }
}

/**
 * @function 显示文件菜单的子项
 * @param {*} event 通过事件找到需控制的子项组
 */
function showFileMenu(event) {
  event.stopPropagation();
  console.log("元素的显隐控制:", event);
  // 控制自身子项的显隐
  Utility.commonToggleElement(event.target.children[0]);
  // 控制其他子项的显隐(过滤掉当前子项)
  hideNavInMenu(event.target.children[0]);
}

// 尝试在body上加一个事件，用于控制所有展开nav的收起
document.body.addEventListener("click", hideNavInMenu, false);

/**
 * @function 隐藏所有ul中非当前展开项
 * @description 目前用于 导航菜单及元素添加按钮组
 * @param {*} current_el [可选]关闭全部时，需过滤的元素
 */
function hideNavInMenu(current_el) {
  let menus = document.querySelectorAll("ul");
  console.log("所有带显隐设置的ul元素:", menus);
  Array.from(menus).forEach((item) => {
    if (item != current_el) Utility.commonHideElement(item);
  });
}

/**
 * @function 新建作品
 */
function newProject(event) {
  event.stopPropagation();
  console.log("新建作品", event);
  Utility.commonToggleElement(event.target.parentElement);
  // 调用拉取默认作品
}

/**
 * @function 从电脑中打开作品
 */
function openProjectFormComputer(event) {
  event.stopPropagation();
  Utility.commonToggleElement(event.target.parentElement);
  console.log("从电脑中打开作品");
  // 激活指定id的 input type="file"，使其唤出资源管理器
  document.getElementById("open_project").click();
}

/**
 * @function 变更选择的作品
 */
function changeSelectProject() {
  console.log("变更选择的作品");
  let temp = document.getElementById("open_project");
  if (temp.files.length > 0) {
    let reader = new FileReader();
    reader.readAsArrayBuffer(temp.files[0]);
    reader.onload = function (event) {
      console.log("onload:", event.target.result);
      VM.loadProject(event.target.result).then(() => {
        temp.value = null;
      });
    };
  }
}

/**
 * @function 下载作品到电脑
 */
function saveProjectToComputer(event) {
  event.stopPropagation();
  Utility.commonToggleElement(event.target.parentElement);
  console.log("下载作品到电脑");
  // 调用 VM库中函数，内中在调用工具函数
  VM.saveProjectSb3().then((content) => {
    Utility.downloadBlob(
      `${projectTitle.length === 0 ? "KID" : projectTitle}.sb3`,
      content
    );
  });
}

/**
 * @function 显示编辑菜单的子项
 * @param {*} event 通过事件找到需控制的子项组
 */
function showEditMenu(event) {
  event.stopPropagation();
  console.log("元素的显隐控制:", event);
  // 控制自身子项的显隐
  Utility.commonToggleElement(event.target.children[0]);
  // 控制其他子项的显隐(过滤掉当前子项)
  hideNavInMenu(event.target.children[0]);
}

/**
 * @function 加速模式开关控制
 * @param {*} event
 */
function toggleTurboMode(event) {
  event.stopPropagation();
  console.log("加速模式开关", event);
  Utility.commonToggleElement(event.target.parentElement);
  // 将编辑的子项[加速模式]明文改变
  event.target.innerText =
    event.target.innerText == "打开加速" ? "关闭加速" : "打开加速";
  // 通过元素上的明文对比结果，传入vm库的加速模式状态
  VM.setTurboMode(event.target.innerText == "打开加速");
}

/**
 * @function 显示发布/批改作品浮层
 */
function pushProject(event) {
  event.stopPropagation();
  console.log("显示发布/批改作品浮层");
  // 通过在线状态，判断创建发布窗体浮层 : 调用打开登入窗体浮层函数
  isOnline ? console.log("创建发布窗体浮层:", isOnline) : openSignin(event);
  // 显示发布的浮层，并进行后续逻辑操作，例如:
  // CREATE_PUSH_MODAL(this.props, this.state.showEditProject);
}

/**
 * @function 打开登入窗体浮层
 * @param {*} event
 */
function openSignin(event) {
  event.stopPropagation();
  console.log("打开登入窗体浮层");
  // 创建遮罩及登入浮层
  CREATE_COMMON_MASK(closeSign);
  CREATE_SIGN();
}

async function signIn() {
  console.log("登入窗体中的按钮事件");
  let username = document.querySelector('[name="username"]').value;
  let password = document.querySelector('[name="password"]').value;
  // 输入值校验
  if (username.trim() == "" || password.trim() == "") return;
  console.log("待提交的表单:", username, password);
  let userData = new FormData();
  userData.append("user.userName", username);
  userData.append("user.password", password);

  const response = await fetch(GLOBAL_URL.API_SIGNIN, {
    method: "POST",
    body: userData,
  });
  const result = await response.json();
  console.log("result:", result);

  // 暂时模拟登入结果
  let temp = {
    avatar: "http://assets.program.leadersir.net/FhY67sEIfSZUSeboMxtT87RjJZ21",
    id: 848,
    nickName: "莫失莫忘丶",
    success: true,
  };

  // 如果登入成功
  if (temp.success) {
    // 调用检测登入函数，为改变在线状态
    checkSignIn();
    user_info = temp;
    console.log("user_info:", user_info);
    // 关闭登入浮层
    closeSign();
    // 创建 account
    createAccount(user_info);
    // 将 <nav>中的登入按钮隐藏，显示account
    Utility.commonToggleElement(document.querySelector(".btn_sign"));
  }
  console.log("返回登入结果:", temp);
}

/**
 * @function 关闭登入浮层
 */
function closeSign() {
  Utility.commonToggleElement(document.querySelector(".common_mask"));
  Utility.commonToggleElement(document.querySelector(".sign_warpper"));
}

/**
 * @function 使用微信扫码登入
 */
function useWechatSignIn() {
  window.open(
    GLOBAL_URL.API_SIGNIN_WECHAT,
    "_blank",
    "channelmode=yes, width=500, height= 500, left=5500, top=100"
  );
  checkSignIn();
}

/**
 * @function 使用QQ扫码登入
 */
function useQQSignIn() {
  window.open(
    GLOBAL_URL.API_SIGNIN_QQ,
    "_blank",
    "channelmode=yes, width=500, height= 500, left=5500, top=100"
  );
  checkSignIn();
}

/**
 * @function 显示个人中心的子项
 * @param {*} event
 */
function showAccountMenu(event) {
  event.stopPropagation();
  console.log("显示登出按钮", event);
  // 控制自身子项的显隐
  Utility.commonToggleElement(event.target.children[1]);
  // 控制其他子项的显隐(过滤掉当前子项)
  hideNavInMenu(event.target.children[1]);
}

/**
 * @function 登出按钮事件
 * @param {*} event
 */
async function signOut(event) {
  event.stopPropagation();
  console.log("显示登出按钮");
  const response = await fetch(GLOBAL_URL.API_SIGNOUT);
  const result = await response.json();
  console.log("sign out:", result);
  if (result.success) {
    // 调用检测登入函数
    checkSignIn();
    // 清空存储的user_info对象值
    user_info = {};
    /** @description 设置子项不可见,避免二次显示时，子项显隐状态未清除 */
    Utility.commonToggleElement(event.target.parentElement);
    // 将 <nav>中的account隐藏，显示登入按钮
    Utility.commonToggleElement(document.querySelector(".btn_sign"));
    Utility.commonToggleElement(document.querySelector(".account"));
  }
}

/**
 *
 *
 *
 */

// 创建主体及布局
CREATE_MAIN();

/**
 * 制作主体中间区域
 * 底部按钮组：点击上浮
 * 由上至下元素组:支持内滚动
 *  背景第一位，禁止拖拽
 *  其他元素可拖拽排序
 *
 */

/**
 * @function 创建添加元素按钮组
 */
function createAddMaterialBtns() {
  console.log("创建添加元素按钮组");
  let str_html = `<div onclick="showAddBtns(event)">
  <ul class="common_is_hide">
  <li onclick="openMaterialFormComputer(event)">上传
    <input
    id="open_material"
    accept=".svg, .png, .jpg, .jpeg, .sprite2, .sprite3"
    style="display:none"
    type="file"
    onChange="changeSelectMaterial()" />
  </li>
  <li onclick="randomMaterial(event)">随机</li>
  <li onclick="openPaintPanel(event)">绘制</li>
  <li onclick="openMaterialLibrary(event)">素材库</li>
</ul>
  </div>`;
  document
    .querySelector(".main_flex_center")
    .insertAdjacentHTML("afterbegin", str_html);
}

createAddMaterialBtns();

function showAddBtns(event) {
  event.stopPropagation();
  console.log("点击展示按钮组:", event);
  Utility.commonToggleElement(event.target.children[0]);
  // 控制其他子项的显隐(过滤掉当前子项)
  hideNavInMenu(event.target.children[0]);
}

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

function openMaterialFormComputer(event) {
  event.stopPropagation();
  console.log("打开元素上传:", event);
  Utility.commonToggleElement(event.target.parentElement);
  // 激活指定id的 input type="file"，使其唤出资源管理器
  document.getElementById("open_material").click();
}

function changeSelectMaterial() {
  console.log("变更选中元素");
  let temp = document.getElementById("open_material");
  if (temp.files.length > 0) {
    let reader = new FileReader();
    reader.readAsArrayBuffer(temp.files[0]);
    reader.onload = function (event) {
      console.log("onload:", event.target.result);
      temp.value = null; // 清除已选中的文件
    };
  }
}

/**
 * @function 随机一个元素
 */
function randomMaterial(event) {
  event.stopPropagation();
  console.log("随机一个元素", event);
  Utility.commonToggleElement(event.target.parentElement);
  // 有一个缓存列表，从中随机选取一个元素(需是非背景非音频类)
  // 缓存列表的结构形式？沿用还是重新制作？(原列表结构形式为官方形式)
  // 从列表中选取元素时，需根据标签[tags]进行过滤，以便于去除(非背景非音频类)
  // 将过滤后的列表数据，从中使用Math.random()*过滤后的列表长度
  // 随机元素的坐标信息，是否需要随机一组xy坐标?
  // 将以上随机生成并处理完成的元素(整个元素对象)，
  // 将其中的[json]属性使用json反序列化，转为字符串，作为vm对应处理函数的参数
  // VM.addSprite(JSON.stringify(item.json));
}

/**
 * @function 打开绘制面板浮层
 * @param {*} event
 */
function openPaintPanel(event) {
  event.stopPropagation();
  console.log("打开绘制面板浮层");
  Utility.commonToggleElement(event.target.parentElement);
  // 创建遮罩层 回调函数(关闭绘制面板浮层)
  CREATE_COMMON_MASK(closePaintPanel);
  // 创建绘制面板浮层
}
/**
 * @function 关闭绘制面板浮层
 * @param {*} event
 */
function closePaintPanel(event) {
  event.stopPropagation();
  console.log("关闭绘制面板浮层");
  // 处理一些关闭后的逻辑
}

/**
 * @function 打开素材库浮层
 * @param {*} event
 */
function openMaterialLibrary(event) {
  event.stopPropagation();
  console.log("打开素材库浮层");
  Utility.commonToggleElement(event.target.parentElement);
  // 创建遮罩层 回调函数(关闭素材库浮层)
  CREATE_COMMON_MASK(closeMaterialLibrary);
  // 创建素材库浮层，上行
}

/**
 * @function 关闭素材库浮层
 * @param {*} event
 */
function closeMaterialLibrary(event) {
  event.stopPropagation();
  console.log("关闭素材库浮层");
  // 处理一些关闭后的逻辑
}

/**
 * @function 创建元素列表
 */
function createMaterialArea() {
  console.log("创建元素列表");
  let str_html = `
  <div>
    <div class="material_backdrop"></div>
    <div class="material_list_warpper">
      <div class="material_list"></div> 
    </div>
  </div>`;
  document
    .querySelector(".main_flex_center")
    .insertAdjacentHTML("beforeend", str_html);
}

createMaterialArea();

function formatProjectData(data) {
  console.log("传入的待格式化当前项目数据:", data);
  // 传入的项目数据没有targets或者targets数组中没有东西，则直接返回
  if (!data || !data.materials) return;
  // 处理data.targets中的数据
  let temp_stage = {};
  let temp_materials = [];

  Object.keys(data.materials).map((id, index) => {
    console.log("id:", id);

    if (data.materials[id].isStage) {
      console.log("背景:", data.materials[id]);
      temp_stage = data.materials[id];
    } else {
      console.log("非背景:", data.materials[id]);
      temp_materials.push(data.materials[id]);
    }
  });
  console.log("暂存:", temp_stage, temp_materials);
  return {
    stage: temp_stage,
    materials: temp_materials,
  };
}

/**
 * @function 创建背景元素结构
 * @description 需注意,以下所有条件:
 *  默认显示背景的第一帧。或者默认空白背景？(空白绘制起来方便)
 *  添加背景时，显示添加帧
 *  添加多个背景时，显示最近加入序列帧的一帧
 *  从序列帧删除时，自动更新序列帧序列
 *  删除当前显示帧时，自动选中默认第一帧
 */
function createMaterialbackdrop(data) {
  console.log("传入背景元素数据:", data);
  if (!data || !data.stage) return;

  let str_html = `<section>
    <div style="background-image:url(${
      GLOBAL_URL.ASSET_MATERIAL + data.stage.costume.md5
    })"></div>
    <div class="material_name">${data.stage.name}</div>
    <div class="sprite_btn_common btn_delete"
        style="background-image:url(${
          GLOBAL_URL.ASSET_ICON_DELETE
        })" onclick="deleteBackgrop(event)"></div>
  </section>`;
  document
    .querySelector(".material_backdrop")
    .insertAdjacentHTML("afterbegin", str_html);
}

function deleteBackgrop(event) {
  console.log("删除背景", event);
}

/**
 * @function 创建非背景元素结构
 * @param {*} data
 */
function createMaterialList(data) {
  console.log("传入非背景元素数据:", data);
  if (!data || !data.materials || data.materials.length < 0) return;
  let fragment = document.createDocumentFragment();

  // 模拟十八个元素
  let temp_group = [];
  temp_group.push(data.materials[0]);
  for (let i = 0; i < 19; i++) {
    let { id, ...other } = data.materials[0];
    temp_group.push({
      id: id + i,
      ...other,
    });
  }

  let temp_data = temp_group;
  temp_data.forEach((item) => {
    // console.log("item:", item);
    let section = document.createElement("section");
    section.addEventListener("click", setEditMaterial, false);
    section.innerHTML = `
    <div style="background-image:url(${
      GLOBAL_URL.ASSET_MATERIAL + item.costume.md5
    })" data-id="${item.id}"></div>
    <div class="material_name">${item.name}</div>
    <div
    class="sprite_btn_common btn_delete"
    style="background-image:url(${GLOBAL_URL.ASSET_ICON_DELETE})"
    onclick="deleteMaterial(event)"></div>
    <div
      class="sprite_btn_common btn_copy"
      style="background-image:url(${
        GLOBAL_URL.ASSET_ICON_DELETE
      })" onclick="duplicateMaterial(event)"></div>
    <div
    class="sprite_btn_common btn_export"
    style="background-image:url(${GLOBAL_URL.ASSET_ICON_DELETE})"
    onclick="exportMaterial(event)"></div>
    `;

    fragment.appendChild(section);
  });

  document.querySelector(".material_list").appendChild(fragment);
}

function deleteMaterial(event) {
  console.log("删除当前", event);
}
function duplicateMaterial(event) {
  console.log("删除当前", event);
}
function exportMaterial(event) {
  console.log("删除当前", event);
}

function setEditMaterial(event) {
  console.log("设置当前元素", event.target.dataset.id);
  VM.setEditingTarget(event.target.dataset.id);
  // 遍历所有元素
  let material_list = document.querySelectorAll(".material_list section");
  Array.from(material_list).map((item) => {
    item.children[0].dataset.id == event.target.dataset.id
      ? item.classList.add("selected_material")
      : item.classList.remove("selected_material");
  });
}

// 先延迟个3秒钟，之后根据加载优先级进行调整。创建页面结构全部放在资源准备完毕之后

setTimeout(() => {
  createMaterialbackdrop(formatProjectData(proxy_materialsData));
  createMaterialList(formatProjectData(proxy_materialsData));
}, 3000);

const GetAssetURL = (function () {
  let cachedAssetId;
  let cachedUrl;

  return function (asset) {
    console.log("GetAssetURL asset:", asset);
    if (cachedAssetId === asset.assetId) return cachedUrl;

    cachedAssetId = asset.assetId;

    cachedUrl =
      asset.assetType === STORAGE.AssetType.ImageVector
        ? asset.encodeDataURI()
        : asset.encodeDataURI();

    return cachedUrl;
  };
})();

/**
 * 制作主体右侧区域
 * 舞台header 用于控制程序启动停止，屏幕比例等
 * 舞台区域 canvas，考虑加入离屏及分层设置，优化canvas
 * 舞台footer 当前选中元素的信息
 *
 *
 */

/**
 * @function 创建右布局之header
 * 启动程序:点击运行程序，并显示为停止按钮
 * 停止程序:点击停止全部程序，并显示为启动按钮
 * 加速模式:模式开关明文标识。
 * 最大化:点击切换为全屏播放模式，并带有控制器
 */
function createStageHeader() {
  console.log("创建舞台header区域");
  let header = document.createElement("header");
  header.innerHTML = `
    <div class="start_or_stop">
      <img src="${GLOBAL_URL.ASSET_ICON_GREEN_FLAG}"/>
    </div>
    <div class="start_or_stop">
    <img src="${GLOBAL_URL.ASSET_ICON_STOP_ALL}"/>
    </div>  
    <div class="turbo_container">
    <img
      class="turbo_icon"
      src=${GLOBAL_URL.ASSET_ICON_TURBO}
    />
    <div class="turbo_label">
      ${GLOBAL_L10N("gui.turboMode.active")}
    </div>
  </div>
  <div class="stage_header_button" onClick="" >
  <img draggable=false src="${GLOBAL_URL.ASSET_ICON_FULLSCREEN}" />
  </div>
  `;
  document.querySelector(".main_flex_right").appendChild(header);
}

function createStageWarpper() {
  let div = document.createElement("div"); // canvas_wrapper
  div.setAttribute("class", "stage_canvas_wrapper");
  div.innerHTML = `
    <!-- stage 舞台的canvas容器 -->
    <div id="stage_parent"> </div>

    <!-- stage monitor Wrapper --> 
    
    <!-- stage frame Wrapper -->
  `;
  document.querySelector(".main_flex_right").appendChild(div);
}

/**
 * @function 启动程序
 * @param {*} event
 *     <!-- 在预览模式下，可以点击该大绿旗，进行播放。播放时，需锁定其它。所以考虑浮层式 -->
    <div class="start_run" onclick="startRun(event)">
      <img draggable=false src="${GLOBAL_URL.ASSET_ICON_GREEN_FLAG}" />
    </div>
 */
function startRun(event) {
  event.stopPropagation();
  console.log("程序启动器");
  VM.start();
  VM.greenFlag();
}

// console.log("的元素:", materialsMeta);
// let editMaterial = materialsMeta.materils[materialsMeta.editMaterialId];
// console.log("选择的元素:", editMaterial);

/**
 * @description 非背景元素的旋转模式定义
 * @key 原项目中rotationStyle的值，作为选项value
 * @value 重写后选项的明文
 */
const ROTATE_MODE = {
  ALL_AROUND: {
    key: "all around",
    value: "自由",
  },
  LEFT_RIGHT: {
    key: "left-right",
    value: "水平",
  },
  DONT_ROTATE: {
    key: "don't rotate",
    value: "禁止",
  },
};

// 创建 右布局 之 footer 当前选中元素信息
function createStageFooter() {
  console.log("创建舞台footer区域");
  // input select checkbox
  let str_html = `
  <div><input type="text" value="" placeholder="名称" autocomplete="off"/></div>
  <div><label class="toggle">
    <input type="checkbox" checked="checked" onChange="materialToggleShowHide(event)" />
    <span class="slider"></span>
  </label></div>
  <div>旋转:
    <select class="rotate_mode" name="select_rotate" required onchange="changeRotateMode(event)">
      <option value="all around">自由</option>
      <option value="left-right">水平</option>
      <option value="don't rotate">禁止</option>
    </select>
  </div>
  <div><input type="text" value="" placeholder="方向" autocomplete="off"/></div>
  <div><input type="text" value="" placeholder="大小" autocomplete="off"/></div>
  <div><input type="text" value="" placeholder="X" autocomplete="off"/></div>
  <div><input type="text" value="" placeholder="Y" autocomplete="off"/></div>
  `;

  let footer = document.createElement("footer");
  footer.innerHTML = str_html;

  document.querySelector(".main_flex_right").appendChild(footer);
}

function materialToggleShowHide(event) {
  event.stopPropagation();
  console.log("元素显隐控制", event, event.target.checked);
  event.target.checked ? "" : "checked";
  let visible = event.target.checked;
  // 设置VM中对应元素信息
  VM.postSpriteInfo({ visible });
}

function changeRotateMode(event) {
  event.stopPropagation();
  console.log("变更旋转模式:", event);
  let rotationStyle = event.target.value;
  VM.postSpriteInfo({ rotationStyle });
}

/**
 *
 *
 *
 *
 *
 *
 *
 *
 */

// // 如果是边看边做进入创作模式
// if (ENTER_MODE()) {
//   // 获取视频信息(内中函数将返回视频id)
//   GET_VIDEO_INFO(RETURN_VIDEOID());
// }

/** 判断当前版本 */
const RETURN_KID_VERISON = () => {
  return window.KidProBlocks ? true : false;
};

// 页面首次加载时，判断url是否有videoId，如果有，则给
// window.location.href = `https://localhost:8601/?videoId=233`;

/**
 * 页面初始加载：
 *  以[window.location.search]是否有内容，来区别当前用户的进入模式[1or3]
 *  search值为["?videoId="]时，代表用户从边看边做进入，执行本文件中的相关逻辑
 *  否则，代表用户从网站开始创作进入，执行react中的登录检测
 *  如果执行本文件的登录检测时，用户未登录，
 *  就在react的登录之后，执行本文件的[进入模式、登录状态检测]
 *  同时，需要在react下login-modal.jsx的登录状态检测下，执行本文件相关函数
 */

// /** 创作模式 */
// const CREATIVE_MODE = {
//   /** 普通模式 */
//   basic: "BASIC_MODE",
//   /** 教程模式 */
//   tutorial: "TUTORIAL_MODE",
// };

/**
 * 创作工具 进入模式[普通进入，边看边做进入]
 * 当前页面url是否含有videoid参数值
 */
const ENTER_MODE = () => {
  console.log("判断进入模式");
  console.log("获取页面URL:", window.location);
  // 当前页面url是否含有videoid参数值
  return window.location.search.indexOf("videoId=") > -1 ? true : false;
};

/**
 * 首次加载时，检测登录状态的函数
 * 非react内的登录状态检测
 */
const CHECK_SIGNIN = () => {
  console.log("launcher.js中的登入状态检测");
  fetch(GLOBAL_URL.API_SIGNIN_CHECK).then((response) => {
    response.json().then((result) => {
      if (result.success) {
        console.log("已登入");
        // 登入之后，获取视频信息(返回视频ID())
        GET_VIDEO_INFO(RETURN_VIDEOID());
      }
    });
  });
};

/*
 * 拖放工具 元素的拖拽及缩放
 */

/**
 * 检查元素中是否有style的指定属性
 * @param {*} el 需检查的指定元素
 * @param {*} attr 元素中style的指定属性
 * @return 返回属性值
 */
const CHECK_STYLE = (el, attr) => {
  let attr_value = getComputedStyle(el, null)[attr];
  // 如果没有该属性样式值 或者属性样式值是'static',返回 ""，否则返回属性值
  return !attr_value || attr_value === "static" ? "" : attr_value;
};

/** 可缩放元素的最小宽高值设定 */
const RESIZE_MIN_WIDTH = 360,
  RESIZE_MIN_HEIGHT = 240;

/**
 * 拖放函数
 * @param {*} container 容器(拖放时，元素始终在该区域内)
 * @param {*} elDND 可拖放的元素
 * @param {*} elDrag 拖拽区域
 * @param {*} el_resize 缩放区域
 * @param {*} isPixel 是否px值(因为还可以是%值)
 * @param {*} callbackDrag 拖拽完成，回调函数。可不传，附带默认值
 * @param {*} callbackResize 缩放完成，回调函数
 */
const DRAG_AND_DROP = (
  container,
  elDND,
  elDrag,
  elResize,
  isPixel,
  callbackDrag = () => {},
  callbackResize = () => {}
) => {
  /** 检查待操作元素的父容器是否具有必要style的position属性 */
  if (CHECK_STYLE(container, "position") === "")
    container.style.position = "relative";
  /** 检查待操作元素是否具有必要style的position属性 */
  if (CHECK_STYLE(elDND, "position") === "") elDND.style.position = "absolute";

  /** 拖拽函数 */
  DRAG(elDND, elDrag, isPixel, callbackDrag);
  /** 缩放函数 */
  RESIZE(elDND, elResize, isPixel, callbackResize);
};

/**
 * 拖拽函数的逻辑处理
 * @param {*} elDND 可拖拽元素
 * @param {*} elDrag 拖拽的标识
 * @param {*} isPixel 是否px值
 * @param {*} callbackDrag 拖拽结束的回调函数
 */
const DRAG = (elDND, elDrag, isPixel, callbackDrag = () => {}) => {
  console.log("挂载 拖拽事件");
  /** 存储 距离XY = 鼠标按下 - 拖拽元素距离左上偏移值 */
  let distance_x = 0,
    distance_y = 0;

  /** 存储 可拖拽元素style最终距离左上确定值 */
  let elDND_new_left = "",
    elDND_new_top = "";

  /** 短路逻辑或运算 [前者为true返回前者，否则返回后者] */
  elDrag = elDrag || elDND;
  /** 为拖拽标识的元素 添加鼠标样式 */
  elDrag.style.cursor = "move";

  /**
   * 鼠标按下事件
   * @param {*} event
   */
  elDrag.onmousedown = (event) => {
    /** 短路逻辑或运算 [前者为true返回前者，否则返回后者] */
    event = event || window.event;

    /** 计算距离 = 鼠标按下 - 拖拽元素距离左上偏移值 */
    distance_x = event.clientX - elDND.offsetLeft;
    distance_y = event.clientY - elDND.offsetTop;

    /**
     * 鼠标移动中
     * @param {*} event
     */
    document.onmousemove = (event) => {
      /** 短路逻辑或运算 [前者为true返回前者，否则返回后者] */
      event = event || window.event;

      /** 重新计算距离左上的坐标值 = 鼠标移动的新位置 - 鼠标按下时计算出来的距离坐标 */
      let new_left = event.clientX - distance_x;
      let new_top = event.clientY - distance_y;
      /** 计算 最大距离左上的边界 = 可拖拽元素的父元素(容器)宽高 - 可拖拽元素的宽高 */
      let max_bound_left = elDND.parentNode.clientWidth - elDND.offsetWidth;
      let max_bound_top = elDND.parentNode.clientHeight - elDND.offsetHeight;

      /** 越界检测 使用短路逻辑与运算 */
      new_left <= 0 && (new_left = 0); /** 最小左上边界检测，越界则值为0 */
      new_top <= 0 && (new_top = 0);
      /** 最大左上边界检测，越界则值为最大边界值 */
      new_left >= max_bound_left && (new_left = max_bound_left);
      new_top >= max_bound_top && (new_top = max_bound_top);

      /** 如果是计算px值 */
      if (isPixel) {
        elDND_new_left = `${new_left}px`;
        elDND_new_top = `${new_top}px`;
      } else {
        /** 否则，是计算 %值 */
        elDND_new_left = `${(new_left / elDND.parentNode.clientWidth) * 100}%`;
        elDND_new_top = `${(new_top / elDND.parentNode.clientHeight) * 100}%`;
      }

      /** 为可拖拽元素赋值最新的距离左上的值 */
      elDND.style.left = elDND_new_left;
      elDND.style.top = elDND_new_top;
      return false;
    };

    /** 鼠标抬起事件 */
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;

      /** 如果有回调函数 */
      if (callbackDrag) {
        console.log("拖拽的回调函数");
        callbackDrag({ left: elDND_new_left, top: elDND_new_top });
      }
    };
    return false;
  };
};

/**
 * 缩放函数的逻辑处理
 * @param {*} elDND 可缩放元素
 * @param {*} elResize 缩放的标识
 * @param {*} isPixel 是否px值
 * @param {*} callbackResize 缩放结束的回调函数
 */
const RESIZE = (elDND, elResize, isPixel, callbackResize = () => {}) => {
  console.log("挂载 缩放事件");

  /** 鼠标按下事件 */
  elResize.onmousedown = (event) => {
    event = event || window.event;

    /** 计算距离 = 鼠标按下的坐标值 - 缩放标识元素的左上偏移(相对可缩放元素而言) */
    let distance_x = event.clientX - elResize.offsetLeft;
    let distance_y = event.clientY - elResize.offsetTop;

    /** 存储新的可拖拽元素的宽高值 */
    let new_width = 0,
      new_height = 0;

    /** 鼠标移动事件 */
    document.onmousemove = (event) => {
      event = event || window.event;

      /** 计算新的缩放标识元素距离左上值 = 鼠标移动中的值 - 距离值 */
      let new_left = event.clientX - distance_x;
      let new_top = event.clientY - distance_y;

      /** 最大宽高值 = 可缩放元素的父元素(容器)宽高 - 可缩放元素的左上偏移 */
      let max_width = elDND.parentNode.clientWidth - elDND.offsetLeft - 2;
      let max_height = elDND.parentNode.clientHeight - elDND.offsetTop - 2;

      /** 计算 可缩放元素新宽高值 = 缩放标识元素宽高 + 缩放标识元素距离左上新值(相对可缩放元素而言) */
      new_width = elResize.offsetWidth + new_left;
      new_height = elResize.offsetHeight + new_top;

      /** 对可缩放元素宽度的计算 短路逻辑与运算 */
      new_width < RESIZE_MIN_WIDTH && (new_width = RESIZE_MIN_WIDTH);
      new_width > max_width && (new_width = max_width);
      /** 可缩放元素最终宽度值， px 或 % */
      elDND.style.width = isPixel
        ? `${new_width}px`
        : `${(new_width / elDND.parentNode.clientWidth) * 100}%`;

      /** 对可缩放元素高度的计算，短路逻辑与运算 */
      new_height < RESIZE_MIN_HEIGHT && (new_height = RESIZE_MIN_HEIGHT);
      new_height > max_height && (new_height = max_height);
      /** 可缩放元素最终高度值， px 或 % */
      elDND.style.height = isPixel
        ? `${new_height}px`
        : `${(new_height / elDND.parentNode.clientHeight) * 100}%`;

      // /** 如果可缩放元素的新宽高已经到了最小宽度或者最小高度，便不再执行鼠标移动事件 （打开会有问题，所以将其注释） */
      // if (new_width <= RESIZE_MIN_WIDTH || new_height <= RESIZE_MIN_HEIGHT)
      //   document.onmousemove = null;

      return false;
    };

    /** 鼠标抬起事件 */
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      /** 如果有回调函数 */
      if (callbackResize) {
        console.log("缩放的回调函数");
        callbackResize({
          width: elDND.style.width,
          height: elDND.style.height,
        });
      }
    };
    return false;
  };
};

/**
 * 创建视频播放窗体
 * @param {*} videoInfo 视频信息
 */
const CREATE_VIDEO_MODAL = (videoInfo) => {
  console.log("创建视频对话框,传入的视频ID:", videoInfo);
  // 改变后台回来的数据的域名
  // if(videoInfo.vedioUrl.indexOf('http://assets.program.leadersir.net/'))

  let dnd_modal = document.createElement("div");
  dnd_modal.setAttribute("class", "dnd_modal hide");
  dnd_modal.innerHTML = `
      <div class="title">${videoInfo.name}</div>
      <div class="min" onclick="btnMin(event)">-</div>
      <div class="close" onclick="btnClose()">X</div>
      <!-- 视频播放层 宽高100% -->
      <video controls class="content" src="${videoInfo.vedioUrl}"></video>
      <div class="drag_area"></div>
      <div class="resize_area"></div>`;
  document.body.appendChild(dnd_modal);

  dnd_modal.addEventListener("loadedmetadata", function () {
    //加载数据
    //视频的总长度
  });
  dnd_modal.addEventListener(
    "ended",
    function () {
      //结束
    },
    false
  );

  // 延迟几秒再显示出来
  setTimeout(() => {
    // 去掉隐藏，添加显示
    dnd_modal.removeAttribute("class", "hide");
    dnd_modal.setAttribute("class", "dnd_modal show");
    let drag_area = document.querySelector(".drag_area");
    let resize_area = document.querySelector(".resize_area");
    DRAG_AND_DROP(
      document.body,
      dnd_modal,
      drag_area,
      resize_area,
      true,
      (drag_result) => {},
      (resize_result) => {}
    );
  }, 1000);
};

/**
 * 通过浏览器url，判断是否有参数
 * 返回视频id
 */
const RETURN_VIDEOID = () => {
  // 如果当前页面url中有视频编号
  if (window.location.search.indexOf("?videoId=") > -1) {
    return window.location.search.match(/videoId=(\S*)/)[1];
  }
};

/**
 * 根据传入的视频id，获取视频信息
 * @param {*} id 视频id
 */
const GET_VIDEO_INFO = (id) => {
  fetch(`${GLOBAL_URL.API_TUTORIAL}${id}`).then((response) => {
    response.json().then((result) => {
      // 如果请求成功，则创建视频对话框
      if (result.success && result.result) {
        // 创建视频播放窗体
        CREATE_VIDEO_MODAL(result.result);
      }
    });
  });
};

// 如果是边看边做进入创作模式
// if (ENTER_MODE()) {
//   // 检测登录状态
//   // CHECK_SIGNIN();
// }

/** 最小化按钮事件 */
btnMin = (event) => {
  let video_content = document.querySelector(".content");
  // 点击最小化时，暂停视频播放  video_content.play() // 播放
  video_content.pause();
  /** 隐藏整个窗体 */
  event.target.parentElement.style.opacity = "0";
  event.target.parentElement.style.zIndex = "-99";

  /** 把header的按钮显示出来 */
  showVideoBtn();
};

/** 显示打开视频按钮 */
showVideoBtn = () => {
  /** 显示视频的按钮 */
  let btn_show_video = document.querySelector(".btn_show_video");
  /** 如果有按钮，则将其设置为可见 */
  if (btn_show_video) {
    btn_show_video.style.opacity = "1";
  } else {
    /** 否则就创建按钮 */
    let btn_show_video = document.createElement("div");
    btn_show_video.setAttribute("class", "btn_show_video");
    btn_show_video.innerHTML = `
    <img src="${GLOBAL_URL.ASSET_ICON_VIDEO}"/>
    `;
    btn_show_video.addEventListener("click", showVideo);
    document.body.appendChild(btn_show_video);
  }
};

/** 打开视频 */
showVideo = () => {
  let dnd_modal = document.querySelector(".dnd_modal");
  dnd_modal.style.opacity = "1";
  dnd_modal.style.zIndex = "99";

  let btn_show_video = document.querySelector(".btn_show_video");
  btn_show_video.style.opacity = "0";
};

/** 视频窗口关闭前 */
beforeCloseVideo = () => {};

/** 关闭视频 */
btnClose = () => {
  let dnd_modal = document.querySelector(".dnd_modal");
  document.body.removeChild(dnd_modal);
};

/**
 * 从外部创建发布作品的表单
 * img及btn不含在内
 */

const PROJECT_TYPE = [];

// 创建发布作品弹出的表单
const CREATE_PUSH_PROJECT = () => {
  console.log("创建发布作品的表单");

  let temp = document.querySelector(".publish_modal_cover");
  console.log("img的上级元素", temp);

  let push_form_data = document.getElementById("form_data");
  console.log("是否已经创建表单:", push_form_data);
  if (!push_form_data) {
    const form_div = `
  <div id="form_data" style="margin-top:16px">
  <div class="input-outline-x">
  <input class="input-control input-outline" style="min-width:380px" type="text" name="projectname" value="" placeholder="作品名称" />
  <label class="input-label">作品名称</label>
</div>
<br/>
<div class="textarea-outline-x">
  <textarea
    class="input-control textarea-outline"
    cols="41"
    rows="2"
    name="description"
    placeholder="作品介绍"
  ></textarea>
  <label class="input-label">作品介绍</label>
</div>
<br/>
<div class="textarea-outline-x">
  <textarea
    class="input-control textarea-outline"
    cols="41"
    rows="2"
    name="instructions"
    placeholder="操作说明"
  ></textarea>
  <label class="input-label">操作说明</label>
</div>

<h5 style="color:#a2a9b6;">作品分类：</h5>
<div class="checkbox_list">
      <div>
      <input type="checkbox" name="type" value="1" checked="checked" id="cb_1">
      <label for="cb_1">游戏</label>
      </div>
      <div>
      <input type="checkbox" name="type" value="2" id="cb_2">
      <label for="cb_2">动画</label>
      </div>
      <div>
      <input type="checkbox" name="type" value="3" id="cb_3">
      <label for="cb_3">艺术</label>
      </div>
      <div>
      <input type="checkbox" name="type" value="4" id="cb_4">
      <label for="cb_4">音乐</label>
      </div>
      <div>
      <input type="checkbox" name="type" value="5" id="cb_5">
      <label for="cb_5">故事</label>
      </div>
      <div>
      <input type="checkbox" name="type" value="6" id="cb_6">
      <label for="cb_6">模拟</label>
      </div>
      <div>
      <input type="checkbox" name="type" value="7" id="cb_7">
      <label for="cb_7">主题</label>
      </div>
</div>


  </div>
  `;
    if (temp) {
      temp.insertAdjacentHTML("afterend", form_div);
    }
  }
};

// 当用户点击发布按钮时，在这边对表单进行校验，
// 校验无误后，以缓存形式，带入react中，分别对应赋值

const RETURN_PUSH_INFO = () => {
  let projectname = document.querySelector('[name="projectname"]').value;
  let description = document.querySelector('[name="description"]').value;
  let instructions = document.querySelector('[name="instructions"]').value;
  let cblist = document.querySelectorAll('[name="type"]');
  let cbed_type = [];
  let temp_cbed_type = {};

  for (let index in cblist) {
    if (cblist[index].checked) cbed_type.push(cblist[index].value);
  }

  for (let i = 0; i < cbed_type.length; i++) {
    temp_cbed_type[`type[${i}]`] = cbed_type[i];
  }

  console.log("对象:", temp_cbed_type);

  return {
    projectName: projectname,
    description: description,
    instructions: instructions,
    // 作品分类值解构
    ...temp_cbed_type,
  };
};

/**
 * 导入本地xml文件
 * @param {*} xml_text xml转text的文件内容
 */
function import_xml(xml_text) {
  // console.log("导入:", xml_text);
  /** 变量转换 workspace */
  let workspace = window.Blockly.getMainWorkspace();
  workspace.clear();
  var xml = window.Blockly.Xml.textToDom(xml_text);
  window.Blockly.Xml.domToWorkspace(xml, workspace);
}

/**
 * input type="file" 选择文件
 * @param {*} event 事件
 */
function handleFileSelect(event) {
  event.stopPropagation();
  window.files = event.target.files; // FileList object
  var reader = new FileReader();
  reader.readAsText(files[0], "UTF-8");
  reader.onload = function (e) {
    var filedata = this.result;
    import_xml(filedata);
  };
}

const handlerFileItemDownload = (event) => {
  event.stopPropagation();
  if (file_nav.classList.contains("nav_item_show")) {
    file_nav.classList.remove("nav_item_show");
  }
  /** 变量转换 workspace */
  let workspace = window.Blockly.getMainWorkspace();

  var xml = window.Blockly.Xml.workspaceToDom(workspace);
  var xml_text = window.Blockly.Xml.domToText(xml);
  var blob = new Blob([xml_text], { type: "text/plain;charset=utf-8" });

  saveAs(blob, `edx_blocks_${new Date().getTime()}.xml`);
};

/**
 * 根据语言，改变含有[data-lang]属性的元素值。
 * @param {*} lang 传入当前<html lang="值">
 */
const CHANGE_LANG = (lang) => {
  let data_l10n = document.querySelectorAll("[data-l10n]");

  Array.from(data_l10n).map((item, index) => {
    // 每个元素的内容 = 语言包[传入的语言][对应的key]
    item.innerHTML = `${LANG[lang][item.dataset.lang]}`;
  });
};

/**
 * 选择一种语言
 */
const handlerL10n = () => {
  let select_lang = document.querySelector('[name="select_lang"]');
  document.documentElement.lang = select_lang.value;
  CHANGE_LANG(document.documentElement.lang);
};

/**
 *  dataURI => Blob
 * @param {*} dataURI
 */
const DATA_URI_TO_BLOB = (dataURI) => {
  // png
  const byteString = atob(dataURI.split(",")[1]);
  // image/png
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  // unitArray
  const uintArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }
  //  {size: 260136, type: "image/png"}
  const blob = new Blob([arrayBuffer], { type: mimeString });
  return blob;
};

/** 获取后端返回的七牛云配置信息 */
const GET_QINIU_CONFIG = () => {
  return fetch(`${GLOBAL_URL.HOST_API}qiniu/config`).then((response) =>
    response.json()
  );
};

/**
 * 上传作品请求 将表单信息提交到后台
 * @param {*} data formData格式
 */
const POST_PUSH_PROJECT = (url, data) => {
  return fetch(url, {
    method: "POST",
    body: data,
  }).then((response) => response.json());
};

/** 用于存储react机制下带出的props */
let push_modal_props = {};
/** 存储预览图src */
let img_src = "";
/** 存储 项目id */
// let project_id = 0;
/** 创建一个发布作品对话框 */
const CREATE_PUSH_MODAL = (props, isEdit) => {
  push_modal_props = {
    ...props,
  };
  if (window.sessionStorage.getItem("imgsrc"))
    img_src = window.sessionStorage.getItem("imgsrc");

  /**
   * 如果返回了项目数据，则数据回显
   * 主要用于在作品页面中的发布或草稿点击「编辑」进入工具主页时，将数据带入，尤其需要ID
   */
  if (push_modal_props.project) project_id = push_modal_props.project.id;
  console.log("作品ID:", project_id, props);

  let push_modal = `
  <div class="push_modal_wrapper">
    <div class="push_modal">
      <div class="close" onclick="btnCancel(event)">X</div>
      <h1>${isEdit ? `批改` : `发布`}作品</h1>
      <section>
        <div class="img_wrapper"><img src="${img_src}"/></div>
        ${
          isEdit
            ? ""
            : ` <div id="form_data" style="margin-top:16px">
          <div class="input-outline-x">
            <input class="input-control input-outline" style="min-width:380px" type="text" name="projectname" value="" placeholder="作品名称" />
            <label class="input-label">作品名称</label>
          </div><br/>
          <div class="textarea-outline-x">
            <textarea
              class="input-control textarea-outline"
              cols="41"
              rows="2"
              name="description"
              placeholder="作品介绍"
            ></textarea>
            <label class="input-label">作品介绍</label>
          </div><br/>
          <div class="textarea-outline-x">
            <textarea
              class="input-control textarea-outline"
              cols="41"
              rows="2"
              name="instructions"
              placeholder="操作说明"
            ></textarea>
            <label class="input-label">操作说明</label>
          </div>

          <h5 style="color:#a2a9b6;text-align:left;">作品分类：</h5>
          <div class="checkbox_list">
            <div>
              <input type="checkbox" name="type" value="1" checked="checked" id="cb_1">
              <label for="cb_1">游戏</label>
            </div>
            <div>
              <input type="checkbox" name="type" value="2" id="cb_2">
              <label for="cb_2">动画</label>
            </div>
            <div>
              <input type="checkbox" name="type" value="3" id="cb_3">
              <label for="cb_3">艺术</label>
            </div>
            <div>
              <input type="checkbox" name="type" value="4" id="cb_4">
              <label for="cb_4">音乐</label>
            </div>
            <div>
              <input type="checkbox" name="type" value="5" id="cb_5">
              <label for="cb_5">故事</label>
            </div>
            <div>
              <input type="checkbox" name="type" value="6" id="cb_6">
              <label for="cb_6">模拟</label>
            </div>
            <div>
              <input type="checkbox" name="type" value="7" id="cb_7">
              <label for="cb_7">主题</label>
              </div>
            </div>
          </div>`
        }

        </section>
      <footer>
        ${
          isEdit
            ? `<button onclick="btnEditPush(event)">批改</button>`
            : `<button onclick="btnDraft(event)">存为草稿</button>
          <button onclick="btnPush(event)">发布</button>`
        }
      </footer> 
    </div>
  </div>
  `;
  document.body.insertAdjacentHTML("beforeend", push_modal);
};

/** 暂存上传到七牛云的文件的文件名 */
let temp_filename = "";

/** BASE64 TO FILE */
const DATAURL_TO_FILE = (dataurl, filename = "file") => {
  let arr = dataurl.split(",");
  let mime = arr[0].match(/:(.*?);/)[1];
  let suffix = mime.split("/")[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime,
  });
};

/**
 * 作品上传至七牛云的函数
 * @param {*} callback 该回调函数用于上传完毕后的表单提交
 */
const QINIU_UPLOAD = (callback = () => {}) => {
  // 保存项目 saveProjectSb3()该函数在vm库中
  push_modal_props.saveProjectSb3().then((content) => {
    console.log("content:", content);
    // 文件名
    temp_filename = `scratch/${new Date().getTime()}_${Math.floor(
      1000 * Math.random()
    )}.sb3`;
    console.log("temp_filename:", temp_filename);
    console.log(
      "base64->file:",
      DATAURL_TO_FILE(window.sessionStorage.getItem("imgsrc"), temp_filename)
    );

    // 文件及缩略图 提交的表单
    let temp_post_form_data = {
      // 文件名
      sb3FileName: temp_filename,
      // 作品文件
      sb3File: content,
      // 作品缩略图
      sb3ImageFile: DATAURL_TO_FILE(
        window.sessionStorage.getItem("imgsrc"),
        temp_filename
      ),
    };

    let sb3_data = new FormData();

    Object.keys(temp_post_form_data).forEach((key) => {
      sb3_data.append(key, temp_post_form_data[key]);
    });

    // 调用后端上传sb3文件API
    const res = POST_PUSH_PROJECT(`${GLOBAL_URL.API_UPLOAD_SB3FILE}`, sb3_data);
    if (res) {
      res.then((result) => {
        console.log("调用上传sb3文件API的结果:", result);
        if (result.success && callback) {
          console.log("执行传入的回调函数:", callback);
          callback();
        } else if (!result.success) {
          RETURN_MESSAGE(result.msg);
        }
      });
    }
  });
};

/** @function 改编作品 提交 */
btnEditPush = (event) => {
  console.log("改编作品按钮点击事件：", event);
  // 设置按钮禁用状态
  event.target.setAttribute("disabled", true);
  event.target.classList.add("disable-button");

  RETURN_MESSAGE(`正在提交……`);

  // project/modifyProjectByTeacher?id=2200&sb3FileName=scratch/1605862147668_496.sb3
  QINIU_UPLOAD(() => {
    console.log("这里是实现的回调，用于传入七牛云上传函数中");
    // 提交的表单
    let post_form_data = {
      id: new URL(document.location).searchParams.get("id"),
      sb3FileName: temp_filename,
    };
    let formData = new FormData();
    Object.keys(post_form_data).forEach((key) => {
      formData.append(key, post_form_data[key]);
    });

    const res3 = POST_PUSH_PROJECT(
      GLOBAL_URL.API_MODIFY_PROJECT_BY_TEACHER,
      formData
    );
    console.log("批改作品之提交表单 res3:", res3);
    res3.then((result) => {
      console.log("result:", result);
      if (result.success) {
        // 发布成功后，此处应调用updateProject(null)，null意为将其项目保留数据清空，尤其ID必须清理，否则会在发布草稿时，以当前的项目数据去提交，造成点击保存草稿后，发布作品被挪至草稿箱。
        push_modal_props.updateProject(null);
        RETURN_MESSAGE(`发布成功`);
        // 设置按钮启用
        event.target.removeAttribute("disabled");
        event.target.classList.remove("disable-button");
        // 上传成功后，调用关闭窗体事件
        btnCancel(event);
      } else {
        console.log(result);
        // 设置按钮启用
        event.target.removeAttribute("disabled");
        event.target.classList.remove("disable-button");
      }
    });
  });
};

/** 保存草稿按钮事件 */
btnDraft = (event) => {
  console.log("保存草稿按钮点击事件：", event);
  // 设置按钮禁用状态
  event.target.setAttribute("disabled", true);
  event.target.classList.add("disable-button");
  // 暂存表单输入项
  let temp_formData = RETURN_PUSH_INFO();
  console.log("获取缓存中的表单内容", temp_formData);
  console.log("作品名:", temp_formData.projectName);
  // 如果未输入作品名
  if (temp_formData.projectName.trim() == "") {
    RETURN_MESSAGE("请输入作品名");
    // 设置按钮启用
    event.target.removeAttribute("disabled");
    event.target.classList.remove("disable-button");
    return;
  }
  // 可以提交的情况下
  else {
    RETURN_MESSAGE(`正在提交……`);

    // 作品上传至七牛云的函数，内部支持回调，用于提交表单
    QINIU_UPLOAD(() => {
      console.log("这里是实现的回调，用于传入七牛云上传函数中");
      // 预览图也上传完之后,保存到系统
      let temp_data = {
        id: push_modal_props.project ? push_modal_props.project.id : 0,
        projectName: temp_formData.projectName,
        sb3FileName: temp_filename,
      };
      let formData = new FormData();
      Object.keys(temp_data).forEach((key) => {
        formData.append(key, temp_data[key]);
      });
      // 保存作品之提交表单
      const res3 = POST_PUSH_PROJECT(GLOBAL_URL.API_PROJECT_DRAFT, formData);
      console.log("保存作品之提交表单 res3:", res3);
      res3.then((result) => {
        console.log("result:", result);
        if (result.success) {
          push_modal_props.updateProject(result.result);
          console.log("保存成功");
          // 上传成功后，调用关闭窗体事件
          RETURN_MESSAGE(`保存成功`);
          // 设置按钮启用
          event.target.removeAttribute("disabled");
          event.target.classList.remove("disable-button");
          btnCancel(event);
        } else {
          console.log(result.msg);
          RETURN_MESSAGE(result.msg);
          // 设置按钮启用
          event.target.removeAttribute("disabled");
          event.target.classList.remove("disable-button");
        }
      });
    });
  }
};

btnPush = (event) => {
  console.log("发布/批改 按钮点击事件：", event);
  // 设置按钮禁用状态
  event.target.setAttribute("disabled", true);
  event.target.classList.add("disable-button");

  // 暂存表单输入项
  let temp_formData = RETURN_PUSH_INFO();
  console.log("获取缓存中的表单内容", temp_formData);
  console.log("作品名:", temp_formData.projectName);

  // 如果未输入作品名
  if (temp_formData.projectName.trim() == "") {
    RETURN_MESSAGE("请输入作品名");
    event.target.removeAttribute("disabled");
    event.target.classList.remove("disable-button");
    return;
  }
  // 如果未选择作品分类
  else if (!temp_formData["type[0]"]) {
    event.target.removeAttribute("disabled");
    event.target.classList.remove("disable-button");
    RETURN_MESSAGE("请至少选择一个作品分类");
    return;
  } else {
    RETURN_MESSAGE(`正在提交……`);

    // 作品上传至七牛云的函数，内部支持回调，用于提交表单
    QINIU_UPLOAD(() => {
      console.log("这里是实现的回调，用于传入七牛云上传函数中");
      // 提交的表单
      let post_form_data = {
        id: project_id,
        // match: _this.state.choosedMatch,
        "match[0]": 1,
        /**
         * 区分源码编辑器版本
         * 如果ture表示kid-pro版本，2表示kid-jr版本
         */
        version: RETURN_KID_VERISON() ? 1 : 2,
        sb3FileName: temp_filename,
        ...temp_formData, // 表单解构赋值
      };
      let formData = new FormData();
      Object.keys(post_form_data).forEach((key) => {
        formData.append(key, post_form_data[key]);
      });
      // 上传作品之提交表单
      const res3 = POST_PUSH_PROJECT(GLOBAL_URL.API_PROJECT_PUSH, formData);
      console.log("上传作品之提交表单 res3:", res3);
      res3.then((result) => {
        console.log("result:", result);
        if (result.success) {
          // 发布成功后，此处应调用updateProject(null)，null意为将其项目保留数据清空，尤其ID必须清理，否则会在发布草稿时，以当前的项目数据去提交，造成点击保存草稿后，发布作品被挪至草稿箱。
          push_modal_props.updateProject(null);
          RETURN_MESSAGE(`发布成功`);
          // 设置按钮启用
          event.target.removeAttribute("disabled");
          event.target.classList.remove("disable-button");
          // 上传成功后，调用关闭窗体事件
          btnCancel(event);
        } else {
          console.log(result);
          // 设置按钮启用
          event.target.removeAttribute("disabled");
          event.target.classList.remove("disable-button");
        }
      });
    });
  }
};

/** 窗体包裹器，点击则调用窗体关闭事件，关闭窗体 */
// btnClose = (event) => {
//   console.log("关闭窗体");
//   event.stopPropagation();
//   event.preventDefault();
//   btnCancel(event);
// };
/** 窗体右上角关闭按钮 */
btnCancel = (event) => {
  event.stopPropagation();
  event.preventDefault();
  let _push_modal = document.querySelector(".push_modal_wrapper");
  // 如果有窗体，将其删除
  if (_push_modal) document.body.removeChild(_push_modal);
};

/**
 * 舞台宽高计算
 * 根据不同的视口，返回不同的舞台size
 */
const RETURN_STAGE_SIZE = () => {
  let _width = 480;
  let _height = (_width * 3) / 4; // 0.75是4:3

  if (document.body.clientWidth <= 1024) {
    _width = 400;
    _height = 300;
  }
  if (document.body.clientWidth > 1024 && document.body.clientWidth <= 1440) {
    _width = 480;
    _height = (_width * 3) / 4;
  }
  if (document.body.clientWidth > 1440 && document.body.clientWidth <= 1920) {
    _width = 640;
    _height = (_width * 3) / 4;
  }
  if (document.body.clientWidth > 1920) {
    _width = 800;
    _height = (_width * 3) / 4;
  }

  return {
    width: _width,
    height: _height,
  };
};

/**
 * 消息弹出，1s
 * @param {*} val 弹出时显示的明文
 * use:RETURN_MESSAGE(`string`);
 */
const RETURN_MESSAGE = (val) => {
  let msg_box = ` <span class="msg_box"> ${val}</span> `;
  document.body.insertAdjacentHTML("beforeend", msg_box);
  setTimeout(() => {
    let _msg_box_list = document.querySelectorAll(".msg_box");
    if (_msg_box_list) {
      _msg_box_list.forEach((item) => {
        document.body.removeChild(item);
      });
    }
  }, 1000);
};

/**
 * @function 实现拖拽排序
 * @description 该事件需在元素组列表加载完成，调用。目前尚未找到合适时机。
 */
function DragSwappable() {
  console.log("进入拖拽事件");
  const containers = document.querySelectorAll(".sprite_selector");
  console.log("containers.length:", containers.length);
  if (containers.length === 0) return false;
  const swappable = new Swappable.default(containers, {
    draggable: ".is_draggable",
    mirror: {
      constrainDimensions: true,
    },
    plugins: [Plugins.ResizeMirror],
  });

  return swappable;
}

/**
 * @function 拉取资源列表
 * @param {*} url
 * @param {*} data
 */
async function pullMaterialList(url, data) {
  const res = await fetch(url, {
    method: "POST",
    body: data,
  });
  console.log("res:", res);
  const result = await res.json();
  console.log("获取素材列表", result);
  if (result.success) return result.result;
}

/**
 * @function 元素数据中md5去除后缀名，作为assetId
 * @param {*} md5
 */
function md5ToAssetId(md5) {
  return md5.substring(0, md5.lastIndexOf("."));
}

/**
 * @function 元素数据中md5生成Uid
 * @param {*} md5
 */
function md5ToUid(md5) {
  // 生成uid前，调用去除md5后缀名函数
  return Utility.uid(md5ToAssetId(md5));
}

/**
 * @function 根据图像url返回对应uint8Array
 * @param {*} url 图像url。使用GLOBAL_URL.ASSET_MATERIAL+md5作为url
 * @returns uint8Array数据
 * @example
 * imgUrlToUint8Array(GLOBAL_URL.ASSET_MATERIAL + material.md5)
 */
async function imgUrlToUint8Array(url) {
  const temp = await fetch(url).then(async (res) => {
    const buffer = await res.arrayBuffer();
    return new Uint8Array(buffer);
  });
  return temp;
}

/**
 * @function 格式化素材列表，即将所有素材处理为，可使用格式
 * @param {*} materialList
 */
function formatMaterialList(materialList) {
  console.log("格式化素材列表:", materialList);
  let temp_data = [];

  materialList.map((item) => {
    console.log("每个元素格式化前:", item);
    item = {
      id: md5ToUid(item.md5),
      costume: {
        asset: {
          assetId: md5ToAssetId(item.md5),
        },
        assetId: md5ToAssetId(item.md5),
        bitmapResolution: item.json.costumes[0].bitmapResolution,
        md5: md5ToAssetId(item.md5),
        name: item.name,
        rotationCenterX: item.json.costumes[0].rotationCenterX,
        rotationCenterY: item.json.costumes[0].rotationCenterY,
      },
      name: item.name,
      fileName: item.md5,
    };
    imgUrlToUint8Array(GLOBAL_URL.ASSET_MATERIAL + item.fileName).then(
      (result) => (item.costume.asset.data = result)
    );
    item.costumes = [item.costume];

    console.log("每个元素格式化后:", item);
    temp_data.push(item);
  });
  console.log("所有元素格式化后:", temp_data);
  return temp_data;
}
