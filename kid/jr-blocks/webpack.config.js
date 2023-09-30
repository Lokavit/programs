/*
 * @Author: Satya
 * @Date: 2020-07-20 16:41:54
 * @Last Modified by:   Satya
 * @Last Modified time: 2020-07-20 16:41:54
 * doc: 打包配置
 */

const path = require("path");

module.exports = [
  {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    entry: {
      horizontal: "./shim/horizontal.js",
      vertical: "./shim/vertical.js",
    },
    output: {
      library: "KidJrBlocks",
      libraryTarget: "commonjs2",
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
    },
    optimization: {
      minimize: false,
    },
    performance: {
      hints: false,
    },
  },
  {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    entry: {
      horizontal: "./shim/horizontal.js",
      vertical: "./shim/vertical.js",
    },
    output: {
      library: "KidJrBlocks",
      libraryTarget: "umd",
      path: path.resolve(__dirname, "dist", "web"),
      filename: "[name].js",
    },
    plugins: [],
  },
];
