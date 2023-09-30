/*
 * @Author: Satya
 * @Date: 2020-12-09 16:34:37
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-23 16:08:11
 * doc:重写了对浏览器支持的判断
 */

import React from "react";
import ReactDOM from "react-dom";
import { compose } from "redux";
import AppStateHOC from "../lib/app-state-hoc.jsx";
import HashParserComponent from "../lib/hash-parser-hoc.jsx";

console.log("React:", React);

// console.log("AppStateHOC:", AppStateHOC);

/**
 * @function 从右到左来组合多个函数
 * @description compose(funcA, funcB, funcC) 形象为 compose(funcA(funcB(funcC())))
 * @param 需要合成的多个函数。预计每个函数都接收一个参数。它的返回值将作为一个参数提供给它左边的函数，以此类推。例外是最右边的参数可以接受多个参数，因为它将为由此产生的函数提供签名。
 * @returns (Function): 从右到左把接收到的函数合成后的最终函数
 */
const WrappedGui = compose(AppStateHOC(HashParserComponent));
// console.log("index.jsx WrappedGui:", WrappedGui);
// 通过判断浏览器是否支持，来决定所要渲染的内容
Utility.supportedBrowser()
  ? ReactDOM.render(
      // <WrappedGui showComingSoon canSave={false} />,
      <div>???</div>,
      document.getElementById("app")
    )
  : (document.body.innerHTML = `<div class="material_lib_null"><h1>当前浏览器不支持,请下载或升级到Chrome最新版</h1></div>`);
