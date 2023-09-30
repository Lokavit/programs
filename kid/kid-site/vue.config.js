"use strict";

module.exports = {
  // lintOnSave: false,
  /** @description 该路径指向本项目根路径 */
  publicPath: "/kid-site/",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV === "development",
  productionSourceMap: false,
  devServer: {
    port: 1413, // 端口号
    open: false, // 不自动打开浏览器
    overlay: {
      warnings: false,
      errors: true,
    },
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      "/": {
        target: `http://192.168.0.248`, // 目标主机
        changeOrigin: true, //
      },
    },
  },
};
