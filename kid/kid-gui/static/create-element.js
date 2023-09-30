/*
 * @Author: Satya
 * @Date: 2020-12-15 11:36:17
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-18 11:30:19
 * doc: 创建元素相关
 * 尽量保证只有创建元素，无状态变更或数据渲染，使用常量命名方式
 * 当遇到非挂载于body的元素时，在此使用return形式，即外部决定元素挂载点
 */

/**
 * @function 创建Loading，在需显示的地方调用
 * @description 需在实际内容加载完，执行元素隐藏，或移除
 */
const CREATE_LOADING = () => {
  return `<div class="loading">
    <!-- <img src="${GLOBAL_URL.ASSET_LOADING}" width="30%" /> -->
    <h2>LOADING……</h2>
  </div>`;
};

/**
 * @function 创建站点左侧LOGO
 * @description 点击超链接至网站主页
 */
const CREATE_SITE_LOGO = () => {
  return `<div class="kid_logo">
    <a href="${GLOBAL_URL.LINK_LEADERSIR_HOME}" target="_black">
      <img alt="kid" draggable="false" src="${GLOBAL_URL.ASSET_LOGO}" />
    </a>
  </div>`;
};

/**
 * @function 创建文件菜单及其子项
 * @description 该文件菜单及子项不含有状态
 */
const CREATE_FILEMENU = () => {
  return `<div onclick="showFileMenu(event)">文件
    <ul class="common_is_hide">
      <li onclick="newProject(event)">新建作品</li>
      <li onclick="openProjectFormComputer(event)">打开作品
        <input
        id="open_project"
        accept=".sb,.sb2,.sb3"
        style="display:none"
        type="file"
        onChange="changeSelectProject()" />
      </li>
      <li onclick="saveProjectToComputer(event)">下载作品</li>
    </ul>
  </div>`;
};

/**
 * @function 创建教程和作品库菜单按钮
 * @description 无状态
 */
const CREATE_TUTORIALS_AND_PROJECT_LIB = () => {
  return `<div>
    <a href="${GLOBAL_URL.LINK_LEADERSIR_TUTORIALS}" target="_blank" class="a_to_btn">教程</a>
  </div>
  <div>
    <a href="${GLOBAL_URL.LINK_LOOK_PROJECT}" target="_blank" class="a_to_btn">作品库</a>
  </div>`;
};

/**
 * @function 创建通用遮罩
 * @param {*} callback 回调函数.点击遮罩，关闭浮层。(必填)
 */
const CREATE_COMMON_MASK = (callback) => {
  console.log("遮罩的回调函数", callback);
  if (!callback) return;
  // 用于存储创建的html结构
  let str_html = "";
  // 优先获取页面上的元素(非首次加载时，或许已创建)
  let common_mask = document.querySelector(".common_mask");

  /**
   * @description 如果页面已有遮罩层，则判断其是否在显示中，若不显示则将其显示
   * 如果页面没有遮罩层，则创建一个遮罩层。
   */
  common_mask
    ? Utility.commonToggleElement(common_mask)
    : (str_html = `<div class="common_mask common_is_show"></div>`);

  document.body.insertAdjacentHTML("beforeend", str_html);
  document
    .querySelector(".common_mask")
    .addEventListener("click", callback ? callback : () => {});
};

/**
 * @function 创建登入浮层内容
 */
const CREATE_SIGN = () => {
  // 用于存储创建的html结构
  let str_html = "";
  let sign_warpper = document.querySelector(".sign_warpper");
  // 如果已有则判断其是否在显示中，若不显示则将其显示
  sign_warpper
    ? Utility.commonToggleElement(sign_warpper)
    : (str_html = `<div class="sign_warpper common_is_show">
    <header><span onclick="closeSign()">X</span></header>
    <main id="sign_data">
      <div class="input-outline-x">
        <input class="input-control input-outline" style="min-width:18rem" type="text" name="username" value="" placeholder="帐号" autocomplete="off"/>
        <label class="input-label">帐号</label>
      </div>
      <div class="input-outline-x">
        <input class="input-control input-outline" style="min-width:18rem" type="password" name="password" value="" placeholder="密码" autocomplete="off"/>
        <label class="input-label">密码</label>
      </div>
    </main>
    <button onclick="signIn()">登入</button>
  </div>
`);
  document.body.insertAdjacentHTML("beforeend", str_html);
};

/**
 * @function 创建主体及布局
 * @description 左侧:积木;中间:元素列表;右侧:舞台
 */
const CREATE_MAIN = () => {
  console.log("创建页面主体 main");
  let main = document.createElement("main");
  main.setAttribute("class", "main");
  main.innerHTML = `<section class="main_flex_left"></section>
   <section class="main_flex_center"></section>
   <section class="main_flex_right"></section>`;
  document.body.appendChild(main);
};
