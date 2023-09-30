/*
 * @Author: Satya
 * @Date: 2020-12-15 09:53:52
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-15 15:42:42
 * doc:自定义组件
 */

// class HTMLPUSHPROJECT extends HTMLElement {
//   // 需监听的属性
//   static get observedAttributes() {
//     return ["title"];
//   }
//   // 构造函数
//   constructor() {
//     super();
//     this._shadow = this.attachShadow({ mode: "open" });
//     this._title = "";
//     console.log("发布作品组件 构造函数:", this);
//   }
//   connectedCallback() {
//     console.log("自定义元素加入页面");
//     this._updateRendering();
//   }
//   disconnectedCallback() {
//     console.log("自定义元素移出页面");
//   }

//   attributeChangedCallback(name, oldValue, newValue) {
//     console.log("自定义元素属性发生变化", name, oldValue, newValue);
//     this._title = newValue;
//     console.log("当前title值:", this._title);
//     // 执行渲染更新
//     this._updateRendering();
//   }

//   get title() {
//     // 转为数组形式
//     return this._title;
//   }
//   set title(value) {
//     this.setAttribute("title:", value);
//   }

//   _updateRendering() {
//     console.log("渲染元素", this._title);
//   }
// }

// customElements.define("push-project", HTMLPUSHPROJECT);

// /**
//  *
//  *
//  */

// class HTMLSIGNACCOUNT extends HTMLElement {
//   static get observedAttributes() {
//     return ["user"];
//   }

//   constructor() {
//     super();
//     this._shadow = this.attachShadow({ mode: "open" });
//     /** @description 默认为未登入。通过该布尔值，判断显示的html */
//     this._user = false;
//     console.log("account:", this);
//   }

//   // 自定义元素加入页面
//   connectedCallback() {
//     console.log("自定义元素加入页面");
//     this._updateRendering();
//   }

//   disconnectedCallback() {
//     console.log("自定义元素移出页面");
//   }

//   attributeChangedCallback(name, oldValue, newValue) {
//     console.log("自定义元素属性发生变化", name, oldValue, newValue);
//     this._user = newValue;
//     console.log("当前登入状态:", this._user);
//     // 执行渲染更新
//     this._updateRendering();
//   }
//   // 设置直接get/set materils属性的方法
//   get user() {
//     // 转为数组形式
//     return this._user;
//   }
//   set user(value) {
//     this.setAttribute("user:", value);
//   }

//   _updateRendering() {
//     console.log("数据发生变化，更新UI", this._user);
//     // 每次数据变更，都改变以下渲染结构
//     let str_html = "";
//     str_html = !this._user
//       ? `
//       <div onclick="showAccountMenu(event)">
//         <img src="${user_info.avatar}"/>${user_info.nickName}
//         <ul class="common_is_hide">
//           <li onclick="signOut(event)">登出</li>
//         </ul>
//       </div>`
//       : `<div onclick="openSignin(event)">登入</div>`;
//     console.log("str_html:", str_html);
//     this.shadowRoot.innerHTML = str_html;
//   }

//   _openSignin() {
//     console.log("打开登入浮层");
//   }
// }

// customElements.define("sign-account", HTMLSIGNACCOUNT);
