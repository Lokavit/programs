"use strict";
const path = require("path");

module.exports = {
  // lintOnSave: false,
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "./static",
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
      "/api": {
        target: `http://192.168.1.5:9000`, // 目标主机
        // target: `http://221.2.155.86:9000`, // 目标主机
        changeOrigin: true, //
        // ws: true,
        pathRewrite: {
          // 重写路径
          "^/api": "/",
        },
      },
    },
  },

  chainWebpack: (config) => {
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(path.join(__dirname, "src/assets/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(path.join(__dirname, "src/assets/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    config.when(process.env.NODE_ENV === "development", (config) =>
      config.devtool("cheap-source-map")
    );

    config.when(process.env.NODE_ENV !== "development", (config) => {
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial", // only package third parties that are initially dependent
          },
          commons: {
            name: "chunk-commons",
            test: path.join(__dirname, "src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      });
      config.optimization.runtimeChunk("single");
    });
    // config
    //   .when(process.env.NODE_ENV !== 'development',
    //     config => {
    //       config
    //         .optimization.splitChunks({
    //           chunks: 'all',
    //           cacheGroups: {
    //             libs: {
    //               name: 'chunk-libs',
    //               test: /[\\/]node_modules[\\/]/,
    //               priority: 10,
    //               chunks: 'initial' // only package third parties that are initially dependent
    //             },
    //             commons: {
    //               name: 'chunk-commons',
    //               test: path.join(__dirname, 'src/components'), // can customize your rules
    //               minChunks: 3, //  minimum common number
    //               priority: 5,
    //               reuseExistingChunk: true
    //             }
    //           }
    //         })
    //       config.optimization.runtimeChunk('single')
    //     }
    //   )
  },
};
