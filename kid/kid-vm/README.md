### 2020.12.23
<!-- 取决于virtual-machine.js引入顺序
扩展:几种扩展积木的引擎
D:\GIT\kid-lib\kid-vm\src\extension-support\extension-manager.js

测试新方法:
D:\GIT\kid-lib\kid-vm\src\engine\runtime.js

D:\GIT\kid-lib\kid-vm\src\import\load-costume.js
load-costume.js class CanvasPool

 -->


### 2020.12.22

- 关于声音[可以在 blocks 库中使用<foreignObject>插入<div>]
- 声音积木分类，默认没有音频，点击可以添加[素材库、录音、导入]
- 由素材库中选中，拉取对应音频文件
- 添加到声音积木分类，顶部声音列表中
- 可编辑的叫音乐[midi]

### 2020.12.22

- 音频扩展模块改为使用才从远程拉取 midi 资源。
- 原有内置分类积木解析全部放在 vm-blocks.js 中

### 2020.12.21

- 记录 vm 大致流程

```js
// 在gui主文件中 实例化vm ,添加以下：
VM.attachStorage(STORAGE);
VM.attachRenderer(render);
VM.attachV2SVGAdapter(KidSvgRenderer.SVGRenderer);
VM.attachV2BitmapAdapter(KidSvgRenderer.BitmapAdapter);
VM.setLocale(INIT_LOCALES.locale, INIT_LOCALES.messages);
VM.attachAudioEngine(new AudioEngine());
// 以上几项皆在vm库中runtime中，作为其函数，
attachStorage(storage) {
  console.log("连接存储模块", storage);
  this.storage = storage;
}
// 又皆在v-m.js中作为函数，内中调用如
attachStorage(storage) {
  this.runtime.attachStorage(storage);
}

// 在gui主文件中 使用该函数，拉取默认作品,其中data为写死默认作品JSON
VM.loadProject(data).then(() => {});
// 该函数在v-m.js文件中如下
loadProject(data) {
  // 将json反序列化
  data = JSON.stringify(data)
  // 使用 Promise验证 ，parser解析，返回解析结果
  // 将解析成功的数据，反序列化,调用该反序列化项目函数
  this.deserializeProject(projectJSON, zip)
}

deserializeProject(projectJSON, zip){
  // 调用清理函数,清理当前runtime(内中调用了emitTargetUpdate(false))
  // 通过版本号调用序列化sb3.js还是sb2.js
  // 以sb3为例.进入sb3.js执行以下
}
// sb3.js
deserialize() // 其内中调用
parseKidAssets() // 内中根据造型和音频分别调用对应函数，如造型
return deserializeCostume(costume, runtime, zip).then(() =>
      loadCostume(costumeMd5Ext, costume, runtime));
// 执行完 parseKidAssets() 执行以下
parseKidObject() // 解析单个元素，包含元素所有信息及积木等，内中调用以下
const sprite = new Sprite(blocks, runtime);
// class Sprite{}又使用了以下
class Target{}
class RenderedTarget{}

```

### 2020.12.20

- 原 parser 库执行流程，index.js 整合为一个文件
- 移除原 parser 依赖库，改为单文件形式
- 移除 audio 依赖库，因为 vm 库中没有直接使用，gui 中才使用

- 记录当点击音乐扩展时,其内部执行的逻辑
- 此处的音频转 Arraybuffer 以后改为 fetch 回来 mp3 转 ArrayBuffer，或者使用 WebAudioAPI

```js
C:\GIT\kid-lib\kid-vm\src\extensions\scratch3_music\index.js

首先执行引入 创建的mainfest.js,为assetData赋值
assetData:{

}

_loadAllSounds() {
根据DRUM_INFO和INSTRUMENT_INFO 加载两个分类的所有音频

DRUM_INFO中对应音频全部在asset/drums中

每个drumsInfo:{name: "(1) 小军鼓", fileName: "1-snare"}
filePath = `drums/${drumInfo.fileName}`;用于传入以下函数
}

执行 _storeSound(filePath, index, playerArray){
const fullPath = `${filePath}.mp3`;
从assetData以fullPath为key，找到对应的Arraybuffer值
const soundBuffer = assetData[fullPath];
}

执行 _decodeSound(soundBuffer){
  // vm在实例化时，会执行以下挂载 AudioEngine为单个库
 // VM.attachAudioEngine(new AudioEngine());
const engine = this.runtime.audioEngine;
// 调用音频引擎中的音频播放
    return engine.decodeSoundPlayer({ data: { buffer: soundBuffer } });
}



```

### 2020.12.18

<!--
D:\GIT\kid-lib\kid-vm\src\engine\target.js
class Target extends EventEmitter {} 类，用于以下文件

D:\GIT\kid-lib\kid-vm\src\sprites\rendered-target.js
class RenderedTarget extends Target {} 在以下文件中实例化并使用

D:\GIT\kid-lib\kid-vm\src\sprites\sprite.js
class Sprite {} 在 sb3.js中实例化并使用
 -->

卸载依赖
stats.js 显示帧数

### 新版 运动分类

- motion.js

- 考虑将 D:\GIT\kid-lib\kid-vm\src\blocks 文件夹下所有分类.js，提取为单独文件
- 同时，将内中所有 utils.js 独立，便于与其它库的 utils 整合

- 注释了 scratch3_gdx_for 相关(此为一个扩展)

<!--
package.json
dep
      "scratch-sb1-converter": "0.2.7",
 -->

Target 目标：角色属性信息（基础信息、脚本信息），譬如角色的位置、方向、放大缩小、特效等等。每个 Clone 体对应一个 Target；
Stage 舞台：角色在舞台上完成动画，舞台是一个特殊的角色；
backdrop 舞台背景:舞台会有多个外观，称为舞台背景
Thread 线程：角色产生动画，需要运行环境，Thread 线程就是角色的运行时环境；
Drawable 图形：每个角色的 Clone 体，会对应一个 Target，Target 目标真正的绘图对象实际上是 Drawable；
Sound 声音：声音会让动画更加生动，Sound 角色的属性，由所有 Clone 体共用；
effects 特效：角色有很多造型，使用特效，可以在造型的基础上，修改造型外观，特效有 color,fisheye,whirl,pixelate, mosaic,brightness, ghost；
IO 输入输出：Scratch-VM 将键盘、鼠标左右键、鼠标滚轮、设备连接等定义为 IO，键盘、鼠标左右键、鼠标滚轮等提供统一的 IO 输入，设备提供蓝牙和 BT 连接，使用 socket 与 Scratch-link 进行通信；
刷新率：每秒钟动画绘制的次数;
时间片：一次绘制分配给 scratch 运行的时间，时间片到期自动放弃运行等待下一次运行，正常情况下，刷新率为每秒 60 次，时间片为 1000/60ms；
StackFrame 栈桢：线程运行时栈空间，通常情况下栈空间只有一个栈元素，当遇到循环、事件、函数时，会保留当前栈桢，新增一个栈桢；
ExtensionManager 扩展积木管理器：扩展积木的管理，Scratch 自定义了一种积木的定义方法，将自定义的积木转为 json，供 blockly 解析，所以我们定义积木时，可以在扩展中定义。

```js
// window.btoa 和 window.atob
let encodedData = window.btoa("Hello, world"); // 编码
let decodedData = window.atob(encodedData); // 解码

// 更好、更可靠、性能更优异的解决方案是使用类型化数组进行转换
// ucs-2 string to base64 encoded ascii
function utoa(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}
// base64 encoded ascii to ucs-2 string
function atou(str) {
  return decodeURIComponent(escape(window.atob(str)));
}
// Usage:
utoa("✓ à la mode"); // 4pyTIMOgIGxhIG1vZGU=
atou("4pyTIMOgIGxhIG1vZGU="); // "✓ à la mode"

utoa("I \u2661 Unicode!"); // SSDimaEgVW5pY29kZSE=
atou("SSDimaEgVW5pY29kZSE="); // "I ♡ Unicode!"
```

```
extension-support\block-type.js # 积木块的类型定义

```

```html
<script src="/path/to/dist/web/scratch-vm.js"></script>
<script>
  var vm = new window.VirtualMachine();
  // do things
</script>
```

## How to include in a Node.js App

For an extended setup example, check out the /src/playground directory, which includes a fully running VM instance.

```js
var VirtualMachine = require("scratch-vm");
var vm = new VirtualMachine();

// Block events
Scratch.workspace.addChangeListener(vm.blockListener);

// Run threads
vm.start();
```
