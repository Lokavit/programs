<!--
user.userName: 13206306300 ,
user.password: 519395650

:white_check_mark:
:negative_squared_cross_mark: :one: :two:
:three: :four: :five: :six: :seven: :eight:
:nine: :keycap_ten: :1234: :zero:

😀😁😂😃😄😅😆😉😊😋😎😍😘😗😙😚☺😇😐😑
😶😏😣😥😮😯😪😫😴😌😛😜😝😒😓😔😕😲😷
😖😞😟😤😢😭😦😧😨😬😰😱😳😵😡😠😈👿👹
👺💀👻👽👦👧👨👩👴👵👶👱👮👲👳👷👸💂🎅👰
👼💆💇🙍🙎🙅🙆💁🙋🙇🙌🙏👤👥🚶🏃👯💃👫👬
👭💏💑👪💪👈👉☝👆👇✊👊👋👏👐⬛⬜🔲🔳⚪
✅❎⭕⚫⚠⛔🚫☯📁📂📄✌✋👌👍👎✍🔥

利用js单线程实现沙盒管理

 -->

# version

```js
第一部分为主版本号 (通常不变)
第二部分为子版本号 (增改功能，UI变更等)
第三部分为阶段版本号 (改BUG等小型修复)
第四部分为日期版本号加希腊字母版本号。(以下为第四部分详情：
Alpha版 表示软件具有雏形基本功能，多用于开发者之间交流，bug较多，尚待修改完善。
Beta版 表示软件无严重错误，但还需大量测试进一步修改bug或UI。
Rc版 表示软件基本不存在会导致错误的严重bug，与正式版接近。
Release版 表示一个正式版本，此版本会面向用户，称为标准版。简写为R。
```

# 📚 TODO

| ☑    | ✔    | ✖    | ❌   | 🔵   | 🔴   |
| ---- | ---- | ---- | ---- | ---- | ---- |
| 完成 | 发布 | 重定 | 驳回 | 新增 | 修复 |

| 📚   | 📖   | 📔  | 📕  | 📗  | 📘  | 📙  |
| ---- | ---- | --- | --- | --- | --- | --- |
| 列表 | 进行 |     |     |     |     |     |

`- 进度(完成|发布|重定|驳回)、次第(赤|橙|蓝|绿|白)、类型(新增|BUG)[完成日期]`

### 页面初始化及加载流程

#### 异步部分

- 登入检测。
- - 已登入。
- - 未登入。
- 判断 url 参数，拉取作品 不带 id 参数:
- - 加载默认作品。加载失败，抛出错误。
- 判断 url 参数，拉取作品 带有 id 参数:
- - 加载 id 作品，加载失败时，改为加载默认作品
- - 判断当前是否为[批改],批改情况下，将[发布替换为批改]
- 判断 url 是否带视频 id 参数
- - 若带有视频 id 参数，则需动态创建视频窗体，并拉取指定 id 的视频数据

- VM 部分
- - 等待 vmTargetUpdate 最新数据

#### 需要异步返回数据的部分

- 页面 Header
- - [发布/批改]: 目前已经实现。尚有优化空间。
- - [登入/个人中心]: 目前已经实现。尚有优化空间。

- 页面 Main > Stage
- - Stage:复杂的 canvas，需要使用相关优化技术。
- - StargeFooter:元素信息只显示当前 EditTarget 元素的信息(需动态改变数据)

- 页面 Main > MaterialArea 角色操作区域
- - 背景元素:需要 vmTargetUpdate 的最新数据
- - 元素列表:需要 vmTargetUpdate 的最新数据(并且需要联动该列表 CUED)

#### Proxy

- 一个等待异步及异步返回处理完成的状态值，当该值为 true 时，初始化页面 HTML 结构
- - 所有需要动态改变且需要监听的值，使用 new Proxy 形式。
- - 所有需要动态数据的 DOM 使用 customElements 创建。
- - 最终在渲染页面时，将所有元素及自定义元素，按序加载。

### IndexedDB 存储

### canvas 的处理：参见 MDN-canvas 相关

- 优化:
- - 使用离屏绘制，一切完成后，在赋值到需显示的 canvas 中
- - 避免浮点数的坐标点，用整数取而代之
- - 在离屏 canvas 中缓存图片的不同尺寸，而不要用 drawImage()去缩放它们
- - 使用多层画布去画一个复杂的场景
- - 尽可能避免 text rendering

图像拖拽缩放:，使用 canvas 中图像相关处理(偏重计算)

### JS DOM 变化的监听检测与应用

- 自定义元素声明周期与 DOM 变化检测

### 素材分类存储

- materials 所有素材
- - default 默认素材[type:角色|背景|声音]
- - type=ROLE category:[形象、界面、道具、特效]
- - type=BACKGROP category:[游戏、生活、自然]
- - type=AUDIO category:[音效、音乐]

- kid/material/midi:音乐扩展积木所需预设音效



### 2020.12.23

- 在初始化完成之后，根据launcher.js书写结构决定以下流程

```js
kid-storage.js


```

### 2020.12.22

- 重写 AudioEngine 为单文件形式

<!-- 更新
@babel/core @babel/preset-env @babel/preset-react babel-loader @babel/plugin-transform-runtime
 -->

### 2020.12.21

- kid-stroage.js 采用单文件形式(详见对应 README.md)
- 应当解决，当所有非渲染性内容已准备完毕，在对整个页面结构进行加载
- 只有当前选中的元素，才会显示其可操作按钮组

### 2020.12.19

- 剥离 node 模块 events 单文件形式，并且通过以下方式使用
- kid-render:采用单文件形式(详见对应 README.md)

```js
console.log("events:", new EventEmitter());
/** @description 实例化 node的 events */
const EVENTEMITTER = new EventEmitter();
console.log("EVENTEMITTER:", EVENTEMITTER);

EVENTEMITTER.on("message", function (text) {
  console.warn(text);
});
EVENTEMITTER.emit("message", "hello world");

/**  @description 类继承写法 */
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    console.log("扩展类:", this);
  }
}

const myEmitter = new MyEmitter();
myEmitter.on("event", () => {
  console.warn("触发事件");
});
myEmitter.emit("event");
```

### 2020.12.18

- 元素列表,可滚动,可拖拽(每个元素是否动态显示当前选中帧?)
- - 所有:单击选中、双击展开序列帧。
- - 序列帧:所有元素序列帧支持拖拽排序.
- - 背景元素:[按钮:删除]只显示一个,所有选择作为其序列帧追加
- - 非背景元素:[按钮:复制、导出、删除]按需罗列。
- - 若无需懒加载，则使用 backgroun:url()形式

<!--
元素图像以url还是img懒加载形式?
按照目前拉取项目资源方式，一次性获取元素列表，无需懒加载。

 -->

```js
// 拉取素材库资源
let temp_formData = new FormData();
temp_formData.append("form[from]", 1);
temp_formData.append("form[type]", 1);
temp_formData.append("form[bagId]", 0);
temp_formData.append("form[categoryId]", 0);
temp_formData.append("form[page]", 1);

pullMaterialList(
  `https://steam.leadersir.com/material/listUserResources`,
  temp_formData
).then((result) => {
  // 再将资源赋值给当前变量
  this.setState({
    materialLists: formatMaterialList(result),
  });
  // 执行图像懒加载函数
  Utility.lazyLoadImage();
});

// 绘制，添加一个空元素用于绘制
const emptyItem = emptySprite();
VM.addSprite(JSON.stringify(emptyItem)).then(() => {});
```

### 2020.12.17

- 通过页面加载时 url 的 id 参数值，判断当前加载默认还是服务器作品
- project_id:作品参数值每次初始化加载都会变更
- [主体-中]元素列表操作按钮组[顶部]
- - 上传:从电脑中上传一个元素
- - 随机:从缓存列表中随机一个元素
- - 绘制:打开绘制面板浮层
- - 素材库:打开素材库浮层

### 2020.12.16

- <nav>优化，保证同时只有一个<nav>项被展开。
- body 添加 onclick 事件，用于点击页面任何地方，可以收起所有<nav>展开项
- 根据登入检测赋值在线状态，通过在线状态，动态改变[登入按钮|用户中心]
- 根据登入检测赋值在线状态，根据 url 作品 id 返回当前是否可批改，通过结果动态改变[发布/批改]按钮文字
- <nav>编辑子项加速模式，动态改变子项明文[打开加速|关闭加速]

### 2020.12.15

- [发布/批改]: 唯有在已登入状态下，才会建立并显示发布浮层

### 2020.12.14

- 重写页面 MENU。

### 2020.12.13

- 重写加载遮罩。
- 加载遮罩层上加点儿 tip(小题示)，随机出现。[未做]
- 在页面首次加载遮罩时，处理一些事情
- - 判断当前浏览器是否支持该工具
- - 浏览器是否支持 WebGL 渲染

### 2020.12.10

- 暂时注释语言选择，以后使用新的方式重写
- app-state-hoc.jsx 梳理
- 尝试 hash-parser-hoc.jsx 转入 app-state-hoc.jsx

- 重要操作执行前，检测登入状态:
- - 未登入则弹出登入浮层，登入或关闭，逻辑循环。
- - 已登入，执行后续逻辑。

### 2020.12.09

- 重写浏览器支持即版本判定
- 根据以上结果判断加载内容页面还是空页面
- 重写当前浏览器对 WebGL 支持结果输出内容。
- gui.jsx 页面
- - 移除 LocalizationHOC(提供本地化状态的高阶组件)
- - 移除 FontLoaderHOC(加载字体高阶组件)
- - 移除字体高阶对应引用及在 vmManagerHOC 中的使用
- - 移除 WebGlModal 相关
- - 移除 TelemetryModal 相关
- - gui.jsx 转入 vm-manager-hoc.jsx
- - vm-manager-hoc.jsx 转入 vm-listener-hoc.jsx
- - vm-listener-hoc.jsx 转入 project-saver-hoc.jsx
- - project-saver-hoc.jsx 转入 project-fetcher-hoc.jsx
- - titled-hoc.jsx 转入 hash-parser-hoc.jsx
- - project-fetcher-hoc.jsx 转入 hash-parser-hoc.jsx

### 2020.12.07

- 素材库: material
- - 默认素材:角色、背景、声音；我的素材:分组
- 使用新的资源懒加载方式,以及<div><img src="默认url" data-src="真实url"/></div>
- 在素材商城界面，显示当前登入用户的账户信息，如金币数量。(这样即可随意调整，以备变更校园不可出现账户信息的。即在校园时，隐藏素材商城面板)

<!--
素材商城:

https://api.codemao.cn/web/materials/categories 返回结果为以下会用到的path，也就是根据该数据结构，进行分类。

角色-人物: https://api.codemao.cn/web/materials?sort=LATEST_ONLINE&offset=0&limit=20&category_path=/0001/0001

返回的数据
{
    "id":"15088625",
    "name":"老虎",
    "file_type":"NORMAL_IMAGE",
    "resource_urls":[
        "https://static.codemao.cn/whale/rkx5HtMKtw"
    ],
    "resource_names":[
        "老虎"
    ],
    "copyright":{
        "id":"1",
        "name":"编程猫官方",
        "statement":"2018 Shenzhen Dianmao Technology Company",
        "status":true
    },
    "price":"0",
    "n_collections":4479,
    "is_collected":false,
    "is_bought":false,
    "online_at":1605081414
},
{
    "id":"15088537",
    "name":"大黄鸡",
    "file_type":"MULTI_IMAGE",
    "resource_urls":[
        "https://static.codemao.cn/whale/rktwtpVnU",
        "https://static.codemao.cn/whale/r1KDt64n8"
    ],
    "resource_names":[
        "大黄鸡_闭嘴",
        "大黄鸡_张嘴"
    ],
    "copyright":{
        "id":"1",
        "name":"编程猫官方",
        "statement":"2018 Shenzhen Dianmao Technology Company",
        "status":true
    },
    "price":"0",
    "n_collections":5473,
    "is_collected":false,
    "is_bought":false,
    "online_at":1591167330
}




我的素材:
角色-全部: https://api.codemao.cn/web/materials/default?offset=0&limit=40&type=ROLE
角色-形象: https://api.codemao.cn/web/materials/default?offset=0&limit=40&type=ROLE&category=CHARACTER
角色-界面: https://api.codemao.cn/web/materials/default?offset=0&limit=40&type=ROLE&category=INTERFACE
角色-道具: https://api.codemao.cn/web/materials/default?offset=0&limit=40&type=ROLE&category=ITEM
角色-特效: https://api.codemao.cn/web/materials/default?offset=0&limit=40&type=ROLE&category=EFFECT
背景-全部: https://api.codemao.cn/web/materials/default?offset=0&limit=40&type=BACKGROUND
背景-游戏: https://api.codemao.cn/web/materials/default?offset=0&limit=40&type=BACKGROUND&category=GAME
背景-生活: https://api.codemao.cn/web/materials/default?offset=0&limit=40&type=BACKGROUND&category=LIFE
背景-自然: https://api.codemao.cn/web/materials/default?offset=0&limit=40&type=BACKGROUND&category=NATURE
声音-全部: https://api.codemao.cn/web/materials/default?offset=0&limit=40&type=AUDIO
声音-音效: https://api.codemao.cn/web/materials/default?offset=0&limit=40&type=AUDIO&category=SOUND_EFFECT
声音-音乐: https://api.codemao.cn/web/materials/default?offset=0&limit=40&type=AUDIO&category=MUSIC


实际图像地址: https://static.codemao.cn/kitten/material_060918_cn/sprite/1_actor/2_codemon/01%E7%BC%96%E7%A8%8B%E7%8C%AB.png?imageMogr2/thumbnail/!200x200r/blur/1x0/quality/100|imageslim

// 拼在.png之后： imageMogr2/thumbnail/!200x200r/blur/1x0/quality/100|imageslim
/** 此为 七牛云高级处理图像的一些参数
* imageMogr2/:图片高级处理(格式转换、缩放、裁剪、旋转),(格式有psd、jpeg、png、gif、webp、tiff、bmp)
* thumbnail/:缩放.等比缩放，比例值为宽缩放比和高缩放比的较大值，Width 和 Height 取值范围1-9999
* !200x200r/: 注意：宽缩放比：目标宽/原图宽   高缩放比：目标高/原图高
* blur/:高斯模糊参数。radius是模糊半径，取值范围为1-50。sigma是正态分布的标准差，必须大于0。图片格式为gif时，不支持该参数。
* 1x0/:半径为 1，Sigma 值为 0
* quality/:新图的图片质量。取值范围为1-100，默认75。七牛会根据原图质量算出一个修正值，取修正值和指定值中的小值
* 100|imageslim:图片质量100|图片瘦身(在尽可能不影响画质的情况下，将JPEG、PNG格式的图片实时压缩，大幅缩小文件体积)
* 其他 interlace:是否支持渐进显示。取值1支持，取值0不支持（默认为0）。适用jpg目标格式，网速慢时，图片显示由模糊到清晰。
*/
 imageMogr2/thumbnail/!200x200r/blur/1x0/quality/100|imageslim:


会有几种不同数据结构，多图情况下，鼠标滑入时，图片切换
默认素材 API:https://api.codemao.cn/web/materials/default?offset=0&limit=40&type=ROLE
返回:items[
  {
    id:"1",
    name:{zh:'雀儿',en:'bird',tw:'雀児'},
    file_type:"NORMAL_IMAGE",
    resource_urls:["https://static.xxx.com/material_0000_cn/sprite/1_actor/2_codemon/01雀儿.png"],
    resource_names:[],
    subtitle:{zh:'源码精灵',en:'codemon',tw:'源码精灵'},
    source:"DEFAULT"
},{
  id:"28",
  name:{zh:"扑街",en:"fall",tw:"扑街"},
  file_type:"MULTI_IMAGE",
  resource_urls:[
    "https://xx.com/material_0000_cn/sprite/1_actor/2_codemon/28扑街/1.png"，
    "https://xx.com/material_0000_cn/sprite/1_actor/2_codemon/28扑街/2.png"],
  resource_names:{zh:["扑街(1)","扑街(2)"],en:["fall-1","fall-2"],tw:[与zh同样]},
  subtitle:{zh:'源码精灵',en:'codemon',tw:'源码精灵'},
  source:"DEFAULT"
},
{
  id:"35",
  name:{"zh":"火球球","en":"Fireball","tw":"火球球"},
  file_type:"MULTI_IMAGE",
  resource_urls:[
      "https://static.codemao.cn/materials/165/火球球_火球球-1.png",
      "https://static.codemao.cn/materials/165/火球球_火球球-2.png",
      "https://static.codemao.cn/materials/165/火球球_火球球-3.png",
      "https://static.codemao.cn/materials/165/火球球_火球球-4.png",
      "https://static.codemao.cn/materials/165/火球球_火球球-5.png",
      "https://static.codemao.cn/materials/165/火球球_火球球-6.png",
      "https://static.codemao.cn/materials/165/火球球_火球球-7.png",
      "https://static.codemao.cn/materials/165/火球球_火球球-8.png",
      "https://static.codemao.cn/materials/165/火球球_火球球-9.png"
  ],
  resource_names:{"zh":["火球球-1","火球球-2","火球球-3","火球球-4","火球球-5","火球球-6","火球球-7","火球球-8","火球球-9"],"en":["Fireball-1","Fireball-2","Fireball-3","Fireball-4","Fireball-5","Fireball-6","Fireball-7","Fireball-8","Fireball-9"],"tw":["火球球-1","火球球-2","火球球-3","火球球-4","火球球-5","火球球-6","火球球-7","火球球-8","火球球-9"]},
  subtitle:{"zh":"源码精灵","en":"codemon","tw":"源碼精靈"},
  source:"DEFAULT"
}，
{
  "id":"36",
  "name":"{"zh":"编程猫向右走","en":"Codemao to the right","tw":"編程貓向右走"}",
  "file_type":"MULTI_IMAGE",
  "resource_urls":[
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-1.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-2.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-3.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-4.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-5.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-6.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-7.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-8.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-9.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-10.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-11.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-12.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-13.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-14.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-15.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-16.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-17.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-18.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-19.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-20.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-21.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-22.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-23.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-24.png",
      "https://static.codemao.cn/materials/163/编程猫向右走_编程猫向右走-25.png"
  ],
  "resource_names":"{"zh":["编程猫向右走-1","编程猫向右走-2","编程猫向右走-3","编程猫向右走-4","编程猫向右走-5","编程猫向右走-6","编程猫向右走-7","编程猫向右走-8","编程猫向右走-9","编程猫向右走-10","编程猫向右走-11","编程猫向右走-12","编程猫向右走-13","编程猫向右走-14","编程猫向右走-15","编程猫向右走-16","编程猫向右走-17","编程猫向右走-18","编程猫向右走-19","编程猫向右走-20","编程猫向右走-21","编程猫向右走-22","编程猫向右走-23","编程猫向右走-24","编程猫向右走-25"],"en":["Codemao to the right-1","Codemao to the right-2","Codemao to the right-3","Codemao to the right-4","Codemao to the right-5","Codemao to the right-6","Codemao to the right-7","Codemao to the right-8","Codemao to the right-9","Codemao to the right-10","Codemao to the right-11","Codemao to the right-12","Codemao to the right-13","Codemao to the right-14","Codemao to the right-15","Codemao to the right-16","Codemao to the right-17","Codemao to the right-18","Codemao to the right-19","Codemao to the right-20","Codemao to the right-21","Codemao to the right-22","Codemao to the right-23","Codemao to the right-24","Codemao to the right-25"],"tw":["編程貓向右走-1","編程貓向右走-2","編程貓向右走-3","編程貓向右走-4","編程貓向右走-5","編程貓向右走-6","編程貓向右走-7","編程貓向右走-8","編程貓向右走-9","編程貓向右走-10","編程貓向右走-11","編程貓向右走-12","編程貓向右走-13","編程貓向右走-14","編程貓向右走-15","編程貓向右走-16","編程貓向右走-17","編程貓向右走-18","編程貓向右走-19","編程貓向右走-20","編程貓向右走-21","編程貓向右走-22","編程貓向右走-23","編程貓向右走-24","編程貓向右走-25"]}",
  "subtitle":"{"zh":"源码精灵","en":"codemon","tw":"源碼精靈"}",
  "source":"DEFAULT"
}
]
 -->

```js
{
  form[from]: 1
  form[type]: 1
  form[bagId]: 0
  form[categoryId]: 0
  form[keywords]:
  form[page]: 1
}

// type 1
{"id":3025,"info":[0,1,0],"json":{"costumes":[{"baseLayerID":3017,"baseLayerMD5":"672510ff2f2dbfeb9d1d9960ffae62f7.png","bitmapResolution":1,"costumeName":"防护罩","rotationCenterX":480,"rotationCenterY":55,"url":"http://assets.program.leadersir.net/material/672510ff2f2dbfeb9d1d9960ffae62f7.png"}],"currentCostumeIndex":0,"isDraggable":false,"objName":"防护罩","rotationStyle":"normal","scale":1,"visible":true},"md5":"672510ff2f2dbfeb9d1d9960ffae62f7.png","name":"防护罩","type":"sprite","url":"http://assets.program.leadersir.net/material/672510ff2f2dbfeb9d1d9960ffae62f7.png"}

// type 2
{"id":3017,"info":[960,110,2],"md5":"672510ff2f2dbfeb9d1d9960ffae62f7.png","name":"防护罩","type":"costume","url":"http://assets.program.leadersir.net/material/672510ff2f2dbfeb9d1d9960ffae62f7.png"}

// type 3
{"id":3019,"info":[960,720,2],"md5":"93d8915be7770bc76a5a79a7e564dadd.png","name":"抗击病毒背景","type":"backdrop","url":"http://assets.program.leadersir.net/material/93d8915be7770bc76a5a79a7e564dadd.png"}

// type 4
{"format":"","id":2837,"md5":"4b4b5079160d2cc64bc02d4af42c65e2.wav","name":"吹气球","rate":22050,"url":"http://assets.program.leadersir.net/material/4b4b5079160d2cc64bc02d4af42c65e2.wav"}

```

```js
// 前者为占位图，后者为真实图片地址
// <img src='data/img/placeholder.png' data-src='data/img/SLUG.jpg'/>
// Progressive loading images 渐进式加载图像
let imagesToLoad = document.querySelectorAll("img[data-src]");
let loadImages = function (image) {
  image.setAttribute("src", image.getAttribute("data-src"));
  image.onload = function () {
    image.removeAttribute("data-src");
  };
};
//  Intersection Observer API 确保只有当图片出现在可见区域时，它才会被加载
if ("IntersectionObserver" in window) {
  let observer = new IntersectionObserver(function (items, observer) {
    items.forEach(function (item) {
      if (item.isIntersecting) {
        loadImages(item.target);
        observer.unobserve(item.target);
      }
    });
  });
  imagesToLoad.forEach(function (img) {
    observer.observe(img);
  });
} else {
  imagesToLoad.forEach(function (img) {
    loadImages(img);
  });
}
```

### 2020.12.05

- React onClick 点击事件传参写法[非统一绑定式]

```js
/**
 * 用bind绑定，调用是作为第二个参数传递，不用显示传递事件对象，定义方法时，事件对象作为最后一个参数传入
 */
// onClick={this.handleSelectSprite.bind(this, id)}
/**
 * @function 选择精灵
 * @param {*} spriteId 选中精灵的id
 * @param {*} e event
 */
handleSelectSprite(spriteId, e) {
  console.log("选择精灵:", spriteId, e);
  e.preventDefault(); // 阻止事件向下传递
  this.props.vm.setEditingTarget(spriteId);
}

```

### 2020.12.04

- 重写添加元素及系列按钮功能
-

<!--
主按钮:点击显示扩展按钮
- 素材库:点击弹出库，库中含所有，选定后，需做类型判断，及后续处理。
- - 选择角色，就直接添加角色，若选择背景，则默认打开背景的序列帧。
- 绘制:点击弹出画板，确认添加，只为角色元素。
- 随机:随机一个角色元素。
- 上传:电脑上传的图皆为角色元素。

 -->

### 2020.12.01

- ✔ 是否将 gui.jsx 混入到 gui.jsx 中？以便第二条实现。
- ✔ 将 target-pane.jsx 重写于 gui.jsx 中

### 2020.11.30

-

### 2020.11.29

- 重写元素显隐功能，以开关形式，使其更加人性化。
- 重写旋转模式以及方向设置。

### 2020.11.28

- 单个元素:去掉右键功能，添加复制及导出功能。

### 2020.11.27

- 将 kid-render 嵌入 gui 的项目中，其中 util 部分单独处理

### 2020.11.25 2020.11.26

- ✔ kid-svg-renderer 库整合为单文件
- kid-svg-renderer 相关工具依赖处理
- 优化程序的执行/停止。

### 布局

- min-width:350px; max-width:537px;
- 屏幕管理:添加删除屏幕[暂时不做]
- 主舞台区域:显示内容
- 底部三条:
- - 舞台相关操作。见下
- - 元素信息:角色名、显隐、锁、旋转、XY、大小、方向

#### 舞台区域

- 占地:min-width:340px; max-width:527px;
- - 横竖屏切换:以上宽度不变，只改变内容比例。
- - 网格:显隐网格参照线。
- - 全屏:弹出层，保持比例放大。
- - 手机预览:暂时留空
- - 开始按钮:点击后切换为待停止。执行逻辑。除舞台区域，其它被半透明 mask 遮挡。
- - mask:显示文字提示[程序正在执行，点击停止]。点击 mask，停止程序。

#### 重做角色选择面板:

- 角色选择区 BUG:角色过多，无法内滚动至底部。考虑改为一横或一列布局。
- - 一横/纵布局:第一位加号(添加元素)、背景、角色，横/纵向滚动。
- 添加角色:改为添加元素(含:角色、背景、声音等)。
- 添加元素:统一为一个接口,根据类型区分。
- 其中背景和角色直接展示，而声音则添加在声音分类下。
- 每个元素:删除按钮(删除当前元素)、展开按钮(展开序列帧)、元素第一帧、元素名
- 每个元素(右键):复制、修改名称、创建分组、导出角色、添加到背包。背景只有修改名称一项。
- - 横/纵布局:每个元素序列帧向上下/左右展开。
- 展开序列帧:第一位加号(添加元素)、当前元素所有序列帧展示。
- - 加号:弹出小菜单,含素材库(弹层)、画板(弹层)、电脑上传。
- - 素材库:确定后，将激活放在最新添加元素上，舞台同步更新。
- - 画板:打开画板，拉取所有序列帧，并新建空白帧。
- - 电脑上传:正在压缩,上传成功。(div background-image:(url"data:image/png;base64"))

#### 重做造型面板:

- - 由角色点击展开每帧，根据帧上编辑按钮，弹出编辑面板。
- - 移除序列帧每帧信息；使帧内容展示空间更大；移除右键事件；
- - 以上完成，替换掉现有造型 tab 整体。
- 删除按钮改为鼠标滑入显示背景色
- 舞台：也就是背景，应该只有一个，将其挪到选择角色区第一位，之后凡添加角色时选择背景，一律追加到该背景下。
- 因以上，需重写角色选择及背景选择，将两者合并，而后根据选定结果，自动匹配
- - 选择角色，正常追加，选择背景，则直接追加到当前背景序列帧中。

#### 重做声音面板:

- - 声音也属于元素之一，

- worker.js 内嵌？
<!-- 
.worker.js 
资源的.json
https://www.codeandweb.com/texturepacker

lottiejs
Lottie 动画是将 AE 文件导出 json 文件，然后使用 LottieJS 进行动画的控制，目前动画的交互性不是很强，所以先用这种技术。

https://piwik.org (free/libre analytics platform)

workbox-sw

PWA：progressive-web-apps 渐进式网络应用

CanvasRenderer 渲染器 three.js 中有使用该技术
WebGLRenderer 同上 (pixi.js 中亦有使用)
-->

### 造型切换

- 点击角色箭头，展开显示角色序列帧。此处渲染时，角色序列帧采用<div style="background-image:url("data:image/png;base64,……")"></div>的形式
  实际编辑造型时，在点击每帧上的编辑按钮。已弹出并遮挡的方式，显示造型编辑面板。
  造型编辑面板，含左侧序列帧切换，及右侧画板。
  其中，序列帧采用<img src="data:image/png;base64,……"/>
  举例中两处 base64 内容相同。
  当点击画笔在帧内容上绘制时，每次松开鼠标，画板内容转 base64，并将其赋值给对应的帧图<img src="data:image/png;base64,……"/>，达到更新序列帧中当前帧的效果。

Artboard(画布)、FrameDrawer(帧绘制)
当快速切换帧时，画板显示内容有个类似于缓冲的机制，或许可以使用，当点击停止在一定时间，切换画板内容为当前激活帧内容

另外，可以增加播放按钮，播放当前序列帧。导出帧图像，可以选择导出格式。
当点击确认添加时，关闭造型编辑面板，并且变更主页面的舞台角色、对应角色及帧图。
变更的角色及帧图改为 image/svg+xml 形式。

存在问题：当在帧图区传入小图片，如果将该图片放大，则会影响原本帧图变得更大。

#### 图片内容共享逻辑：

- 选择角色:默认显示角色首帧。角色或许为序列帧，加载该角色所有帧，默认不展开。
- 点击三角:展开序列帧。切换时，会连带变更角色当前帧，以及舞台内容为选中帧内容
- 点击编辑:弹出造型编辑面板。左侧为序列帧，右侧为画板。
- 左侧:每帧皆为<img src="data:image/png;base64,……"/>。
- 右侧:选中帧的帧内容<canvas>
- 确定:关闭面板。序列帧变更(svg)、角色变更为当前帧(svg)、舞台上的帧内容随之变更。

```html
<!-- 舞台帧内容 -->
<canvas></canvas>
<!-- 角色及角色序列帧 为以下两种方式。通常默认为png，帧图被绘制后，打概率改为svg形式-->
<div style="background-image:url("data:image/png;base64,……")"></div>
<div style="background-image:url("data:image/svg+xml;base64,……")"></div>
<!-- 造型编辑面板 左侧 也就是序列帧 -->
<img src="data:image/svg+xml;base64,……"/>
<!-- 造型编辑面板 右侧 也就是画板 -->
<canvas></canvas>
```

### 2020.11.20

- ✔🔵 改编作品

### 2020.11.19

- ✔🔵 sprite-info.jsx 添加 XY 坐标显示

### 2020.11.14

- 优化发布作品窗体按钮样式及事件处理逻辑

### 2020.11.12

- 页面加载时，检测登录状态，登录成功，调用是否可以改编的检测。
- 可改编:生成改编按钮，导航居右。用户信息的左侧。
- 教师可以改编学生作品，通过「改编」按钮，单独接口及处理流程。

### 2020.11.04

- ✔🔴 发布作品消息提示处理、队列性移除。
- ✔🔴 发布作品按钮状态控制。禁用状态属性设置及移除。
- ✔🔵 发布作品按钮鼠标滑入效果。

### 2020.11.02 起，迁移过程中，未实现的积木及功能

- 因使用 kid-blocks 积木，暂时将运行时积木发光效果注释。
- 运动分类，checkbox 类型:X 坐标、Y 坐标、方向

### 2020.10.30

- 将 pro-blocks 替换成 kid-blocks.
- 为转移到 kid-blocks 的积木追加代码
<!-- 
 需要有绿旗才可以驱动。
 pro-blocks的积木块，作为外挂还是库里定义？
 Blockly原版的积木如何在vm实现？
- 不需要实现，只作为纯代码编辑时显示
- 像判断舞台还是角色一样，判断每个积木分类是否可用
- 也就是重新整理所有积木块及分类
  -->

### 2020.10.21

- Loading 页面重做:将原来伪加载替换为真实加载，页面采用 SVG+gsap 库制作。

### 2020.10.13

<!-- - https://test.leadersir.com/kid-pro/player.html?id=1820 -->

### 2020.10.12

- [评估]特殊用户在[文件]下增加一项[下载作品]
<!--
点击[下载作品]，内中先执行 this.props.saveProjectSb3()
然后调用外部一个 生成project.html的函数(参数:content)，返回一个Blob，用于用户下载。
其中HTML部分，重新整理：
 -->

```js
/**
 * HTML结构字符串
 * 生成HTML
 * 将其转换为Blob
 */

const GENERATOR_HTML = (content) => {
  // 生成HTML文件的结构
  return `
    <div>Hello!</div>
    <script>console.log(${content})</script>
  `;
};

/**
 * 生成HTML 并返回Blob格式
 * @param {*} content 用来传入.sb3的blob数据
 */
const RETURN_BLOB = (content) => {
  console.log("传入的.sb3 blob:", content);

  return content.text().then((res) => {
    console.info("生成HTML文件的结构:", GENERATOR_HTML(res));
    //将字符串 转换成 Blob 对象
    let blob = new Blob([GENERATOR_HTML(res)], {
      type: "text/plain",
    });
    console.info("加内容的blob", blob);
    console.log("加内容的blob => text()", blob.text());
    return blob;
  });
};
```

- 🔵 重写素材库
<!--
素材懒加载。
 -->

### 2020.10.11

- 🔵 素材库添加会员分类，并且为每一个素材添加点击事件，非会员弹出购买连接。
- 🔵 友好的消息提示框

### 2020.10.10

- ☑ [2020.10.11]抽取 KidStorage 库，对该类的继承放在外部 je 文件

<!--
D:\GIT\kid-gui\src\lib\storage.js 改写该文件，提取到外部
用到继承KidStorage类的地方
D:\GIT\kid-gui\src\containers\gui.jsx
D:\GIT\kid-gui\src\containers\sprite-selector-item.jsx
D:\GIT\kid-gui\src\containers\watermark.jsx
D:\GIT\kid-gui\src\lib\get-costume-url.js
D:\GIT\kid-gui\src\lib\project-fetcher-hoc.jsx
D:\GIT\kid-gui\src\lib\project-saver-hoc.jsx
D:\GIT\kid-gui\src\lib\save-project-to-server.js
D:\GIT\kid-gui\src\reducers\vm.js
 -->

### 2020.10.09

- ☑📕🔵[2020.10.12]变更发布及草稿的提交方式
- 🔵 在 player 页面，http 及 https 互通
- player 页面的播放容器，根据项目中存储的容器大小变更。
- Loading 动画从全屏挪到 Player 容器中
<!--
原本资源地址 material/
.sb3文件，实际为zip文件，解压可见内中相关资源，以及.json文件
目前发现的在player页面，http及https不互通的问题，解决思路:更改原有播放页。scratchPlayer.jsp

 -->

### 2020.09.27

- ☑🔴 添加角色区域被撑开
- ☑ 添加一个消息提示条，3s 自动关闭
- ☑🔴 发布及保存按钮添加冷却事件
- 🔴 发布及保存按钮事件中的逻辑判断里面，需要加禁用状态设置语句
- 🔴 发布作品对话框 CSS 调整(如果创作时固定尺寸，则不会出现对话框样式错位现象)

### 2020.09.24

- 📖🔵Blocks+Blockly 的可行性
<!--
kid-Blocks[pro、jr] 驱动canvas内容
Blockly [代码、硬件]
pxt-Blockly [代码、硬件]
webduino-blockly [代码、硬件]
将pxt-Blockly编译引入本项目，作为扩展积木库？

 -->

- ☑ 重写发布及草稿功能，使其解藕 react 机制

### 2020.09.22

- ☑🔵 对碰撞添加条件语句相关积木块

### 2020.09.21

- ☑📕🔴 线上版本发布作品预览图黑屏

### 2020.09.18 JR 版本的更新需求(PART－1)

- ☑🔵 程序每次运行结束后还原原本初始化状态 **使用重置积木**
- ☑🔵 角色移动速度可以使用模块设定 **运动分类所有积木添加第三参数%3,设置速度**
- ☑🔵 角色碰到功能(碰到某个角色后或者颜色后出发程序) **增加侦听分类下碰撞积木块**
- ✖📔🔵 多任务并行(上和左同时运行) **需为每个积木块添加角度**
- ✖📔🔵 录音功能放置在声音功能区 **？？？**
- ✖📔🔵 角色边缘检测 **左进右出，右进左出**
- ✖📔🔵 角色移动时候(左右)面对的方向 **角色操作之方向**

## 本地运行

- 注释 init.js 中的写入文档部分代码

## 打包部署

- 参照以下，将文件传入七牛云
- 修改打包后的 index.html 页面内容

```html
<body>
  <script src="./init.js"></script>
</body>
```

## 云

`以日期为版本 kid/js/v/`

- launcher.js
- en.js zh-cn.js zh-tw.js
- blocks_jr.js
- vertical_jr.js
- blocks_pro.js
- vertical_pro.js
- lib.kid.js
- lib.util.js
- lib.react.js
- vendors.js
- common.js
- gui.js

## paint 库

- 该库中的图标资源是个问题

## CSS 整理中

- 为适配做准备，暂定采用 js 加载时，通过屏幕分辨率，判断需加载的 css
- js 判断媒介，移动端强制横屏

### 积木显示模式

- 收起：每次点选之后自动收起
- 常驻：始终展示在分类区域旁边

## MediaQuery

<!-- MediaQuery
react-responsive

render() {
  return (
    <div>
      <MediaQuery query='(min-device-width: 1224px)'>
        <PCIndex />
      </MediaQuery>
      <MediaQuery query='(max-device-width: 1224px)'>
        <MobileIndex />
      </MediaQuery>
    </div>
  )
}

D:\GIT\kid-gui\src\lib\layout-constants.js
D:\GIT\kid-gui\src\lib\screen-utils.js
D:\GIT\kid-gui\src\components\gui\gui.jsx

 -->

https://v5.leadersir.com/project/saveProjectDraftAndPublish/?id=0&match%5B0%5D=1&version=1&sb3FileName=scratch%2F1598694834274_71.sb3&projectName=31111&description=331313&instructions=31313&type%5B0%5D=1&type%5B1%5D=6

<!-- 需替换的文件
  src\containers\custom-procedures.jsx
  D:\GIT\kid-jr\jr-gui\src\lib\make-toolbox-xml.js
  D:\GIT\kid-jr\jr-gui\src\lib\blocks.js ，部分地方还需要注释
   -->

### blocks 的 media

- 之后将 pro 和 jr 的资源整理为一份，放在七牛云的同一处

```jsx
/* src\components\gui\gui.jsx 改为 https七牛云指定文件夹 */
<Blocks
  canUseCloud={canUseCloud}
  grow={1}
  isVisible={blocksTabVisible}
  // options={{ media: `${basePath}static/blocks-media/` }}
  options={{ media: GLOBAL_URL.ASSET_BLOCK_MEDIA_PRO }}
  stageSize={stageSize}
  vm={vm}
/>
```

<!--
src\containers\custom-procedures.jsx


因为考虑到兼容两个blocks，所以这里将相关文件分别写
src\lib\make-toolbox-xml.js 重写为单文件形式
src\lib\blocks.js 待重写中 (目前只注释 import)

以上两个文件pro和jr各自一份，在index.html引入时，
pro/vertical.js
pro/make-toolbox-xml.js
pro/blocks.js
jr/vertical.js
jr/make-toolbox-xml.js
jr/blocks.js




src\containers\blocks.jsx 在以上重写完之后，更改这里的引用
this.KidBlocks = VM_PRO_BLOCKS(props.vm);

 -->

## paint 库

- 不可以 link，否则打包时会报错。

---

## 解决不安全脚本问题

- 资源请求，HTTP 及 HTTPS 不可混用

---

<!--
/** static/js/lib/vertical.js */
该文件为pro-blocks编译后web版本文件，并且删除不必要的语言对象

/** make-toolbox-xml.js */
该文件被使用处
src\reducers\toolbox.js
src\containers\blocks.jsx
 -->

## TODO:

- static\assets 中资源，为原版扩展项资源及教程资源
- 云变量:服务器压力大

## 优化

- 优化点击 LOGO 去官网的写法。

### 从原版中移除不需要的功能代码

<!--
src\reducers\gui.js
移除内中./cards.js的引用及使用

src\components\gui\gui.jsx
移除内中如下组件的引用及使用
TipsLibrary组件:原教程相关
Cards组件:原教程相关
Backpack组件:背包

src\containers\gui.jsx
移除 QueryParserHOC组件

src\components\menu-bar\menu-bar.jsx
移除内中openTipsLibrary的引用及使用

src\containers\stage-selector.jsx
移除对backpack-api.js的引用及使用


删除以下文件:
src\lib\query-parser-hoc.jsx
src\lib\tutorial-from-url.js
src\reducers\cards.js
src\components\cards\下所有文件
src\containers\tips-library.jsx
src\lib\libraries\decks\下所有文件
src\components\backpack\下所有文件
src\containers\backpack.jsx
src\lib\backpack-api.js

src\components\menu-bar\community-button.jsx(原版查看作品按钮)
src\components\menu-bar\community-button.css
src\components\menu-bar\user-avatar.jsx 头像
src\components\menu-bar\user-avatar.css
src\components\coming-soon\coming-soon.jsx (原版的即将推出组件)
src\components\coming-soon\coming-soon.css



注释以下文件，即其相关使用
src\containers\error-boundary.jsx
src\lib\error-boundary-hoc.jsx






src\components\menu-bar\login-dropdown.jsx


 -->

## TODO

- src\components\library-nav\library-nav.jsx 待重写
- src\components\sprite-info\sprite-info.jsx 无法更改多语言

## 增加一些新东西

### 边看边做

```js
/** src\components\menu-bar\menu-bar.jsx
 * 原版教程按钮，会打开一个窗体，内中为视频教程[废弃]
 * 改为以下方式:
 * 1.点击教程按钮，打开官网教程页面 [完成]
 * 2.选择视频后，带参回到创作页面[需服务器]
 * 3.在检测登录的地方，添加对地址参数判断
 * 4.如果有video参数，则请求视频
 * 5.生成视频窗体，并保持窗体始终再最前。
 * 6.窗体支持拖拽缩放。
 * 7.最小化时暂停播放，并在页面右上角添加一个按钮[显示视频]
 * 8.关闭视频窗体。
 * 9.缩放BUG[修复]
 */
```

- 在登录检测中判断的话，是否会出现多次打开视频？
- 拿到视频 id 后，重定向地址？
<!--
courseContent/getVideoForScratch/233
 -->

### 添加一个默认舞台背景

```js
/* src\lib\default-project\project-data.js
  文件中的costumes[]数组里，替换图片以及设置偏移
  src\lib\libraries\backdrops.json
  该文件中找一张图，作为默认背景图
*/
```

### 所有 URL 提取为一个全局对象

```js
/** pro-gui\static\js\global-url.js */
```

### 发布作品[考虑重新实现]

- 解决 canvas 黑屏问题
- src\components\menu-bar\publish-modal.jsx
- 从缓存里获取到 canvas 的数据
<!--
点击「发布作品」打开对话框，获取到img，可将其在当前页面暂存，用于七牛云上传。
页面创建时，调用外部结构「*作品名、作品介绍、操作说明、作品分类」
填写完毕后，以对象形式返回
使用点击「发布」时，获取返回的内容，赋值到react写法中，再进行提交
 -->

```js
/* menu-bar.jsx */
<PublishModal handleClose={this.handleClosePublish} vm={this.props.vm}/>

/* publish-modal.jsx
  这里需要接收，menu-bar.jsx传入的vm
*/
componentWillMount() {
  //虽然不知道原因，但是缺这段不可
    this.getProjectThumbnail();
    }
  // 参照 project-saver-hoc.jsx方法
  getProjectThumbnail(callback) {
    // 这里renderer之后都是undefind
    this.props.vm.renderer.draw();
  }
```

### 积木块及代码静态化时的获取方式

- event 有个 view 其为 Window 对象，似乎可以从中拿到 Blockly
- 某个点击事件，传入 event，函数参数获取[event.view.Blockly]

```js
// <!-- 测试 添加一个按钮，为获取blockly的xml结构 -->
// <button onclick="getBlockly(event)">GET</button>

/** 测试 获取Blockly */
getBlockly = (event) => {
  let injectionDiv = document.querySelector(".injectionDiv");
  console.log("injectionDiv:", injectionDiv);

  console.log("event", event);
  console.log("event.view.Blockly", event.view.Blockly);
  console.log("event.view.Blockly  ??", event.view.Blockly.getMainWorkspace());

  /** 变量转换 blockly */
  let _Blockly = event.view.Blockly;
  /** 变量转换 workspace */
  let workspace = _Blockly.getMainWorkspace();

  /** 输出xml结构 */
  let xml_dom = _Blockly.Xml.workspaceToDom(workspace);
  console.log("xml:", xml_dom);

  /** xml转text 便可以存储为文件.xml */
  let xml_to_text = _Blockly.Xml.domToText(xml_dom);
  console.log("xml->text", xml_to_text);

  /** text_xml 转 xml 读取文件之后，解析为xml显示在页面 */
  let text_to_xml = _Blockly.Xml.textToDom(xml_to_text);
  console.log("text转xml:", text_to_xml);

  console.log("看看结果:", _Blockly.Xml.domToWorkspace(text_to_xml, workspace));
};
```

---

### KID 存储在七牛云的资源

- kid/extensions/，扩展库预览图片资源
- kid/actor/ loading.gif

<!-- material/
src\lib\libraries\backdrops.json 背景
src\lib\libraries\costumes.json 造型
src\lib\libraries\sounds.json 音频
src\lib\libraries\sprites.json 精灵(svg、wav、png) -->

### 重写扩展预览组件的数据

- 原版对国际化支持不好，重写该数据处理方式
- src\lib\libraries\extension-library-data.js
- 以上为重写的文件，并对原版所有使用的地方替换调用
- 扩展预览组中，有些扩展被墙，需使用提供下载的方式解决
- 规避 scratch

<!-- 乐高在微软商店的地址
https://www.microsoft.com/zh-cn/p/scratch-link/9n48xllczh0x?activetab=pivot:overviewtab
 -->

```js
// 调用示例
// 新写的加载扩展库预览方式
import { EXTENSIONLIBRARY_DATA } from "../lib/libraries/extension-library-data";
EXTENSIONLIBRARY_DATA(document.documentElement.lang);
```

======

<!--
执行顺序：
project-data.js
src\lib\storage.js
  defaultProjectAssets ，及其forEach()，缓存默认作品，缓存每个md5id
src\components\menu-bar\menu-bar.jsx执行检测登入状态函数
src\lib\project-fetcher-hoc.jsx 作品提取HOC渲染完成
src\lib\vm-manager-hoc.jsx 组件componentDidUpdate完成 isLoadingWithId
src\lib\project-fetcher-hoc.jsx componentDidUpdate完成 提取作品
  fetchProject函数返回 storage.load。提取资源，其中资源id=0资源类型json
  资源data就是默认作品的数据，数据格式json
src\lib\storage.js 获取资源的url
  getAssetGetConfig函数，并执行为测试添加的fetch七牛云资源
src\containers\sprite-selector-item.jsx
  getCostumeData函数 获取造型数据
  该函数中调用了 src\lib\get-costume-url.js 将数据转码base64

 -->

### 资源必须是 md5

- 替换老羊为 Q 版羊，资源必须 MD5 重传到七牛云
- 七牛云传上去的资源，如果同名资源替换（含删除再传同名文件），则 HTTPS，请求不到。

```js
// src\lib\default-project\project-data.js 整理该文件，替换多语言方式
// 注：原本的翻译就不可用。

// 主角的三个造型
https://kid.leadersir.net/material/af4ff4232a743af3198b34d5e5d4e237.svg
https://kid.leadersir.net/material/8601bd32ca5689ee893223a7bb087abd.svg
https://kid.leadersir.net/material/1160fd4cef57911426fb1dea2698976b.svg

```

<!--
角色库
src\containers\sprite-library.jsx
C:\GIT\kid-pro\pro-gui\src\containers\backdrop-library.jsx
C:\GIT\kid-pro\pro-gui\src\containers\costume-library.jsx
C:\GIT\kid-pro\pro-gui\src\containers\sound-library.jsx

我的素材包 ,以上几个都有
src\components\library-nav\library-nav.jsx

 -->

### 改变多语言明文的写法

- 目的：逐渐移除 react-intl
- TODO:对于含有变量的明文，如果转换?("{arrow}We need your permission")
- 处理完含变量的明文之后，将整体改为全局对象形式
- locales 语言环境。L10N

```js
/* 新方式：语言包提取为静态文件形式加载，单独写一个多语言处理的函数。使用方式如下: */
GLOBAL_L10N("gui.cameraModal.loadingCameraMessage");
```

<!--
创建多语言文件: src\locales\l10n-msgs.js,里面导入所需语言.js
语言文件:en.js、zh-cn.js、zh-tw.js，内中根据需求新增的语言对象属性及属性值
语言选择文件: src\containers\language-selector.jsx
该文件中会监听语言切换情况，并将语言赋值给 document.documentElement.lang
即表示将 html 设置为当前选择的语言，该变量为全局变量。
在其它文件使用自定义国际化语言 js 文件时，如以下：
src\components\gui\gui.jsx 参见代码块
其它文件变更只做文件罗列，不再具体到代码块，如有需要，参见git变更日志
src\components\menu-bar\menu-bar.jsx
src\components\sprite-selector-item\sprite-selector-item.jsx
src\containers\sprite-library.jsx
src\containers\extension-library.jsx
src\containers\backdrop-library.jsx

 -->

```jsx
/* 以下注释内容为将原版删除的代码块 */
// import {
//   defineMessages,
//   FormattedMessage,
//   injectIntl,
//   intlShape,
// } from "react-intl"; // 移除 原本的 react-intl国际化

// 引入自定义语言文件
import editorMessages from "../../locales/editor-msgs";

// const messages = defineMessages({
//   addExtension: {
//     id: "gui.gui.addExtension",
//     description: "Button to add an extension in the target pane",
//     defaultMessage: "Add Extension",
//   },
// });

// 该组件的props定义，去掉 intl

{/* <FormattedMessage
  defaultMessage="Code"
  description="Button to get to the code panel"
  id="gui.gui.codeTab"
/> */}
{
  GLOBAL_L10N( "gui.gui.codeTab" )
}
{targetIsStage
? //   <FormattedMessage
  //     defaultMessage="Backdrops"
  //     description="Button to get to the backdrops panel"
  //     id="gui.gui.backdropsTab"
  //   />
  GLOBAL_L10N( "gui.gui.backdropsTab" )
: //   <FormattedMessage
  //     defaultMessage="Costumes"
  //     description="Button to get to the costumes panel"
  //     id="gui.gui.costumesTab"
  //   />
 GLOBAL_L10N( "gui.gui.costumesTab" )}
  // .... 其它 <FormattedMessage/> 类似
<button
  className={styles.extensionButton}
  //   title={intl.formatMessage(messages.addExtension)}
  title={
    editorMessages[document.documentElement.lang][
      "gui.gui.addExtension"
    ]
  }
  onClick={onExtensionButtonClick}
>

GUIComponent.propTypes = {
    //   intl: intlShape.isRequired,
}
// 最后导出时， 去掉国际化的包裹
// export default injectIntl(connect(mapStateToProps)(GUIComponent));
export default connect(mapStateToProps)(GUIComponent);
```
