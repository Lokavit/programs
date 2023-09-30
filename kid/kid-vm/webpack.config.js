/*
 * @Author: Satya
 * @Date: 2020-07-20 16:43:54
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-21 16:33:11
 * doc:打包配置
 */

const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  devtool: "cheap-module-source-map",
  target: "web",
  entry: {
    "kid-vm": "./src/index.js",
  },
  output: {
    libraryTarget: "umd",
    path: path.resolve(__dirname, "dist"),
    library: "VirtualMachine",
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: require.resolve("./src/index.js"),
        loader: "expose-loader?VirtualMachine",
      },
      {
        include: [path.resolve("src")],
        test: /\.js$/,
        loader: "babel-loader",
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  plugins: [],
};
