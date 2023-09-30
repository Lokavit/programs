/*
 * @Author: Satya
 * @Date: 2020-06-30 10:02:56
 * @Last Modified by: Satya
 * @Last Modified time: 2020-08-19 10:27:42
 * doc:index文件所需，暂时写在此处
 * 注:lib中的文件，不可替换
 */

/** 覆盖 window.alert的显示效果 */
function alert(value) {
  document.getElementById("stage").innerHTML += " " + value + "<br/>";
}

console.log("Blockly:", Blockly);
console.log(document.getElementById("toolbox"));

var workspace = Blockly.inject("blocklyDiv", {
  media: "./assets/media/",
  // 积木块拖放区域网格效果
  grid: {
    spacing: 25, // 网格点距
    length: 3, // 网格每个点的长度，数值太高就会成为明线棋盘
    colour: "#ccc", // 网格点的颜色
    snap: true, // 是否自动吸附网格
  },
  // 缩放配置
  zoom: {
    controls: true, // 显示控制按钮[zoom-centre、zoom-in、and zoom-out]
    wheel: true, // 允许鼠标滚轮缩放
    startScale: 1.0, // 初始缩放至
    maxScale: 3, // 最大缩放
    minScale: 0.3, // 最小缩放
    scaleSpeed: 1.2, // 缩放速度比
  },
  toolbox: document.getElementById("toolbox"),
});

// console.log(Blockly.inject("blocklyDiv"));

// /** 给显示JavaScript语言按钮添加点击事件，并显示源代码 */
// const btnJSCode = document.getElementById("btnShowJsCode");
// btnJSCode.addEventListener("click", showJSCode);
/** 给显示python语言按钮添加点击事件，并显示源代码 */
const btnPythonCode = document.getElementById("btnShowPythonCode");
btnPythonCode.addEventListener("click", showPythonCode);

/** 给显示python语言按钮添加点击事件，并显示源代码 */
const btnStart = document.getElementById("start");
btnStart.addEventListener("click", runCode);

/** 给显示python语言按钮添加点击事件，并显示源代码 */
const btnClear = document.getElementById("clear");
btnClear.addEventListener("click", clearCode);

// /** 显示JS源代码 */
// function showJSCode() {
//   Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
//   var code = Blockly.JavaScript.workspaceToCode(workspace);
//   // console.log(code);
//   showCode(code);
// }

/** 显示Python源代码 */
function showPythonCode() {
  Blockly.Python.INFINITE_LOOP_TRAP = null;
  var code = Blockly.Python.workspaceToCode(workspace);
  // console.log(code);
  showCode(code);
}

/** 显示代码 并将其插入到pre元素中 */
function showCode(code) {
  let preCode = document.getElementById("pre_code");
  preCode.innerHTML = `<code>${code}</code>`;
  // console.log(hljs);
  /* 代码高亮 ，每次显示code之后，执行 */
  document.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightBlock(block);
  });
}

/** 运行代码，并输出结果 */
function runCode() {
  // Generate JavaScript code and run it.
  window.LoopTrap = 1000;
  Blockly.JavaScript.INFINITE_LOOP_TRAP =
    'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
  var code = Blockly.JavaScript.workspaceToCode(workspace);
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  /** 解析code */
  return Function(code)();
}

function clearCode() {
  // 将运行结果清空
  document.getElementById("stage").innerHTML = " ";
}

let btnNavFile = document.querySelector(".nav_file");
// console.log(btnNavFile);
let dropdown_menu = document.querySelector(".dropdown_menu");
btnNavFile.addEventListener("click", function () {
  dropdown_menu.classList.toggle("show");
});

// 文件下多个按钮按钮的点击事件
let newFile = document.getElementById("new_file");
let openFile = document.getElementById("open_file");
let exportFile = document.getElementById("download_file");
let upload = document.getElementById("upload");
newFile.addEventListener("click", function () {
  dropdown_menu.classList.toggle("show");
  // 清空编辑区
  workspace.clear();
});
openFile.addEventListener("click", function () {
  upload.click();
  dropdown_menu.classList.toggle("show");
});
exportFile.addEventListener("click", function () {
  download_xml();
  dropdown_menu.classList.toggle("show");
});

upload.addEventListener("change", handleFileSelect, false);

/** 导出 编辑工作区的xml为本地文件 */
function download_xml() {
  var xml = Blockly.Xml.workspaceToDom(workspace);
  var xml_text = Blockly.Xml.domToText(xml);
  var blob = new Blob([xml_text], { type: "text/plain;charset=utf-8" });
  saveAs(blob, `edx_blocks_${new Date().getTime()}.xml`);
}

/** 导入本地xml文件 */
function import_xml(xml_text) {
  // console.log("导入:", xml_text);
  workspace.clear();
  var xml = Blockly.Xml.textToDom(xml_text);
  Blockly.Xml.domToWorkspace(xml, workspace);
}

function handleFileSelect(evt) {
  window.files = evt.target.files; // FileList object
  var reader = new FileReader();
  reader.readAsText(files[0], "UTF-8");
  reader.onload = function (e) {
    var filedata = this.result;
    import_xml(filedata);
  };
}

// let pushXML = document.querySelector(".nav_push");
// let pullXML = document.querySelector(".nav_pull");

// pushXML.addEventListener("click", pushFile);

// /** 云存储函数
//  * todo:用户登录状态判断，联网状态判断
//  */
// function pushFile() {
//   // 工作区 积木块xml结构文件
//   var xml = Blockly.Xml.workspaceToDom(workspace);
//   // 积木块xml结构转为text形式
//   var xml_text = Blockly.Xml.domToText(xml);
//   // console.log("xml:", xml);
//   // console.log("xml_text:", xml_text);
// }

// /** 云拉取 */
// function pullFile() {}
