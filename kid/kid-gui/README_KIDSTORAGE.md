### 2020.12.21

<!--
D:\GIT\kid-lib\kid-storage\src\FetchWorkerTool.worker.js 执行顺序
if (self.fetch) {
  console.log("FetchWorkerTool.worker.js ", self.fetch);
  postMessage({ support: { fetch: true } });
  self.addEventListener("message", onMessage);
}
const registerStep = function () {}
const onMessage = ({ data: job }) => {}
 -->

 <!-- 执行程序时
 // gui启动器.js中 实例化STORAGE相关 const STORAGE = new Storage();影响以下：
class Helper Storage {defaultAssetId: {…}}
class BuiltinHelper extends Helper BuiltinHelper {parent: Storage, assets: {…}}

// 此处因为 实例化后，调用了addOfficialScratchWebStores()函数，所以执行以下：
(也就是将该函数中的三个this.addWebStore()都执行一遍)
KidStorage.js addWebStore 
KidStorage.js addWebStore (3) [{…}, {…}, {…}]
KidStorage.js  addWebStore [{…}]0: {contentType: "audio/x-wav", name: "Sound", runtimeFormat: "wav", immutable: true}contentType: "audio/x-wav"immutable: truename: "Sound"runtimeFormat: "wav"__proto__: Objectlength: 1__proto__: Array(0) (asset) =>
        `static/extension-assets/scratch3_music/${asset.assetId}.${asset.dataFormat}`

// 程序执行到vm相关，走到反序列化 ，反序列化.sb3文件，执行以下:
 KidStorage.js load 内中含有 assetType 及assetId ，似乎没有 dataFormat
KidStorage load {contentType: "image/png", name: "ImageBitmap", runtimeFormat: "png", immutable: true}contentType: "image/png"immutable: truename: "ImageBitmap"runtimeFormat: "png"__proto__: Object 
 67e0db3305b3c8bac3a363b1c428892e png

BuiltinHelper.js load 获取资产，但不处理依赖项 也就是将以上的参数值，其中的资源类型及资源id传入
BuiltinHelper load {contentType: "image/png", name: "ImageBitmap", runtimeFormat: "png", immutable: true} 67e0db3305b3c8bac3a363b1c428892e

BuiltinHelper.js get(assetId) {}
BuiltinHelper get同步获取给定资产ID的缓存资产 af4ff4232a743af3198b34d5e5d4e237

  -->

```js
// js-md5单独提取
// D:\GIT\kid-lib\kid-storage\src\FetchWorkerTool.js
// class PrivateFetchWorkerTool {} 移除了其相关

```

### 2020.10.15

<!--
运行顺序:
KID-GUI project-fetcher-hoc.jsx componentDidUpdate: prevProps
KID-GUI 调用fetchProject() true true
KID-GUI project-fetcher-hoc.jsx componentDidUpdate this.fetchProject
KID-GUI fetchProject 提取作品 作品ID: 0 加载状态: FETCHING_NEW_DEFAULT
KidStorage.js load: 0
BuiltinHelper.js load: 0，及assetType对象 project.json

/** 默认舞台背景 */
KidStorage.js load: 67e0db3305b3c8bac3a363b1c428892e
BuiltinHelper.js load: 67e0db3305b3c8bac3a363b1c428892e
WebHelper.js load: 67e0db3305b3c8bac3a363b1c428892e
KID-GUI launcher.js 获取资源的url:
FetchWorkerTool.js url: https://kid.leadersir.net/material/67e0db3305b3c8bac3a363b1c428892e.png

/** 其他资源亦按照如上顺序执行
  不含打开默认项目，打开本地.sb3文件时，采用读取内中数据的形式，不走以上逻辑

 */

 -->

### 加载网络资源

- ProxyTool 中的 tools，循环 FetchWorkerTool，FetchTool 请求网络数据
- FetchWorkerTool
- FetchTool
- Helper
- WebHelper web 资源 提取资产但不处理依赖项
- BuiltinHelper 将资源存储在本地内存中，assets 存储所有资源文件。

### 2020.10.13

- 移除默认资源相关
- 移除 base64js 及 text 编码解码，改为原生方式
- 变更导入导出方式

## scratch-storage

#### Scratch Storage is a library for loading and storing project and asset files for Scratch 3.0

    "coverage": "tap ./test/{unit,integration}/*.js --coverage --coverage-report=lcov",
    "commitmsg": "commitlint -e $GIT_PARAMS",
    "lint": "eslint .",
    "tap-integration": "tap ./test/integration/*.js",
    "tap-unit": "tap ./test/unit/*.js",
    "tap": "npm run tap-unit && npm run tap-integration",
    "test": "npm run lint && npm run tap",
    "version": "json -f package.json -I -e \"this.repository.sha = '$(git log -n1 --pretty=format:%H)'\"",
    "watch": "webpack --progress --colors --watch",
    "semantic-release": "semantic-release"

"config": {
"commitizen": {
"path": "./node_modules/cz-conventional-changelog"
}
},
"release": {
"branch": "develop"
}

[![Build Status](https://travis-ci.org/LLK/scratch-storage.svg?branch=develop)](https://travis-ci.org/LLK/scratch-storage)
[![Coverage Status](https://coveralls.io/repos/github/LLK/scratch-storage/badge.svg?branch=develop)](https://coveralls.io/github/LLK/scratch-storage?branch=develop)
[![Greenkeeper badge](https://badges.greenkeeper.io/LLK/scratch-storage.svg)](https://greenkeeper.io/)

## Installation

This requires you to have Node.js installed.

In your own Node.js environment/application:

```bash
npm install https://github.com/LLK/scratch-storage.git
```

If you want to edit/play yourself (requires Git):

```bash
git clone https://github.com/LLK/scratch-storage.git
cd scratch-storage
npm install
```

## Using scratch-storage

### From HTML

```html
<script src="scratch-storage/dist/web/scratch-storage.js"></script>
<script>
  var storage = new Scratch.Storage();
  // continue to "Storage API Quick Start" section below
</script>
```

### From Node.js / Webpack

```js
var storage = require("scratch-storage");
// continue to "Storage API Quick Start" section below
```

### Storage API Quick Start

Once you have an instance of `scratch-storage`, add some web sources. For each source you'll need to provide a function
to generate a URL for a supported type of asset:

```js
/**
 * @param {Asset} asset - calculate a URL for this asset.
 * @returns {string} a URL to download a project asset (PNG, WAV, etc.)
 */
var getAssetUrl = function (asset) {
  var assetUrlParts = [
    "https://assets.example.com/path/to/assets/",
    asset.assetId,
    ".",
    asset.dataFormat,
    "/get/",
  ];
  return assetUrlParts.join("");
};
```

然后，让存储模块知道您的来源:

```js
storage.addWebStore(
  [AssetType.ImageVector, AssetType.ImageBitmap, AssetType.Sound],
  getAssetUrl
);
```

如果您使用的是 ES6，则可以简化上述所有步骤:

```js
storage.addWebStore(
  [AssetType.ImageVector, AssetType.ImageBitmap, AssetType.Sound],
  (asset) =>
    `https://assets.example.com/path/to/assets/${asset.assetId}.${asset.dataFormat}/get/`
);
```

一旦存储模块知道您需要的来源，就可以开始加载资产:

```js
storage.load(AssetType.Sound, soundId).then(function (soundAsset) {
  // `soundAsset` is an `Asset` object. File contents are stored in `soundAsset.data`.
});
```

如果您想将`scratch-storage`与`scratch-vm`一起使用，则必须将存储模块“附加”到 VM:

```js
vm.attachStorage(storage);
```
