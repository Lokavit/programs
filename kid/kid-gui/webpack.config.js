/*
 * @Author: Satya
 * @Date: 2020-07-16 13:44:21
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-09 22:17:22
 * doc: 打包配置
 */

const path = require("path");

// Plugins
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// PostCss
const autoprefixer = require("autoprefixer");
const postcssVars = require("postcss-simple-vars");
const postcssImport = require("postcss-import");

const TerserPlugin = require("terser-webpack-plugin");

/** 七牛云资源地址 会根据不同协议返回不同域名 */
// const PATH_ASSET =
//   global.location.protocol.indexOf("https") > -1
//     ? `https://kid.leadersir.net/`
//     : `http://assets.program.leadersir.net/`;

module.exports = {
  // mode: process.env.NODE_ENV === "production" ? "production" : "development",
  mode: "production",
  entry: {
    gui: "./src/playground/index.jsx",
    // blocksonly: "./src/playground/blocks-only.jsx",
    // compatibilitytesting: "./src/playground/compatibility-testing.jsx",
    // player: "./src/playground/player.jsx",
  },
  output: {
    // library: "GUI",
    // filename: "[name].js",
    // chunkFilename: "chunks/[name].js",
    // 打包输出路径
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
  },
  devtool: "cheap-module-source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "build"),
    // host: "0.0.0.0",
    port: process.env.PORT || 8601,
    https: true,
  },

  externals: {
    React: "react",
    ReactDOM: "react-dom",
  },
  resolve: {
    symlinks: false,
    extensions: [".js", ".jsx", ".json"],
    // 设置别名
    alias: {
      "@": path.resolve("src"), // 这样配置后 @ 可以指向 src 目录
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        include: [
          path.resolve(__dirname, "src"),
          /node_modules[\\/]scratch-[^\\/]+[\\/]src/,
          /node_modules[\\/]pify/,
          /node_modules[\\/]@vernier[\\/]godirect/,
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: "[name]_[local]_[hash:base64:5]",
              camelCase: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: function () {
                return [postcssImport, postcssVars, autoprefixer];
              },
            },
          },
        ],
      },
      {
        test: /\.(svg|png|wav|gif|jpg)$/,
        loader: "file-loader",
        options: {
          name: "[sha512:hash:base64:7].[ext]",
          // name: "[name].[ext]",
          outputPath: "static/assets/",
        },
      },
    ],
  },

  /** npm run build 时 使用 */
  optimization: {
    minimize: false,
    // minimize: true,
    // minimizer: [
    //   new TerserPlugin({
    //     // 包含项正则，及非包含项正则
    //     // test: /[\\/]node_modules[\\/]/,
    //     // include: [/\.js$/],
    //     // static/js 下所有文件不编译，不压缩
    //     exclude: /[\\/]static[\\/]js[\\/]/,
    //     sourceMap: true,
    //     // 版权信息等注释
    //     extractComments: false,
    //     cache: true,
    //     parallel: require("os").cpus().length, // 使用多进程并行运行可提高构建速度
    //     terserOptions: {
    //       ecma: 5,
    //       warnings: false,
    //       // 指定一些其他解析选项，则传递一个对象
    //       parse: {},
    //       // 如果希望指定其他输出选项，则传递一个对象
    //       output: {
    //         // 版权信息等注释
    //         comments: false,
    //         semicolons: false,
    //       },
    //       // 传递false可以跳过名称修改，或传递一个对象以指定mangle选项
    //       mangle: true, // Note `mangle.properties` is `false` by default.
    //       module: false,
    //       // 传递false可以完全跳过压缩。传递一个对象以指定自定义压缩选项
    //       compress: {
    //         // 传递true放弃对console.*函数的调用
    //         drop_console: false,
    //       },
    //       // 如果您希望启用顶级变量和函数名称处理并删除未使用的变量和函数，则设置为true
    //       toplevel: false,
    //       nameCache: null,
    //       ie8: false,
    //       keep_classnames: undefined,
    //       keep_fnames: false,
    //       safari10: false,
    //     },
    //   }),
    // ],
    /** 尝试改变打包方式 */
    // splitChunks: {
    //   chunks: "all", // 分割所有代码
    //   minSize: 30000, // 模块的最小体积，大于30000就拆分
    //   minChunks: 1, // 模块的最小被引用次数  模块被引用2次以上的才抽离
    //   maxAsyncRequests: 5, // 按需加载的最大并行请求数
    //   maxInitialRequests: 9, // 一个入口最大并行请求数
    //   automaticNameDelimiter: "~", // 文件名的连接符
    //   name: true, // 抽取出来文件的名字，默认为 true，表示自动生成文件名；
    //   cacheGroups: {
    //     /** 单独打包 kid-相关库的代码 */
    //     "lib.kid": {
    //       test: /[\\/]node_modules[\\/]kid-[^\\/]/,
    //       name: "lib.kid",
    //       priority: -7,
    //       // 如果该chunk中引用了已被抽取的chunk，直接引用该chunk，不会重复打包代码
    //       reuseExistingChunk: true,
    //     },
    //     /** 单独打包 util-相关库的代码 */
    //     "lib.util": {
    //       test: /[\\/]node_modules[\\/]scratch-[^\\/]/,
    //       name: "lib.util",
    //       priority: -8,
    //       reuseExistingChunk: true,
    //     },
    //     /** 单独打包 react-相关库的代码 */
    //     "lib.react": {
    //       test: /[\\/]node_modules[\\/]react[^\\/]/,
    //       name: "lib.react",
    //       priority: -9,
    //       reuseExistingChunk: true,
    //     },
    //     /** 将第三方库代码单独打包  */
    //     vendors: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: "vendors",
    //       priority: -10,
    //       reuseExistingChunk: true,
    //     },
    //     /** 将第三方库代码单独打包  */
    //     common: {
    //       name: "common",
    //       priority: -20,
    //       reuseExistingChunk: true,
    //     },
    //   },
    // },
  },
  plugins: [
    /** 创作页面 */
    new HtmlWebpackPlugin({
      // 配置不允许注入的chunk
      excludeChunks: ["player"],
      // 允许插入到模板中的一些chunk
      chunks: ["gui", "lib.react", "lib.kid", "lib.util", "vendors", "common"],
      template: "src/playground/index.html",
      title: "羚羊创客",
      // 是否将错误信息输出到html页面中
      showErrors: true,
      // 在对应的chunk文件修改后就会emit文件
      cache: true,
      // 压缩HTML文件
      minify: {
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true, // 压缩内联css
      },
      // hash: true,
    }),

    // /** 作品播放页面 */
    // new HtmlWebpackPlugin({
    //   excludeChunks: ["gui"],
    //   chunks: [
    //     "player",
    //     "lib.react",
    //     "lib.kid",
    //     "lib.util",
    //     "vendors",
    //     "common",
    //   ],
    //   template: "src/playground/index.html",
    //   filename: "player.html",
    //   title: "羚羊创客",
    // }),
    /** blocks页面，只有积木块及操作区 */
    // new HtmlWebpackPlugin({
    //   chunks: [
    //     "blocksonly",
    //     "lib.react",
    //     "lib.kid",
    //     "lib.util",
    //     "vendors",
    //     "common",
    //   ],
    //   template: "src/playground/index.html",
    //   filename: "blocks-only.html",
    //   title: "Kid Pro: Blocks",
    // }),

    // /** 作品播放，兼容性测试页面 */
    // new HtmlWebpackPlugin({
    //   chunks: [
    //     "compatibilitytesting",
    //     "lib.react",
    //     "lib.kid",
    //     "lib.util",
    //     "vendors",
    //     "common",
    //   ],
    //   template: "src/playground/index.html",
    //   filename: "compatibility-testing.html",
    //   title: "Kid Pro: Compatibility Testing",
    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "static",
          to: "static",
        },
        // {
        //   from: "extensions/**",
        //   to: "static",
        //   context: "src/examples",
        // },
        // {
        //   from: "extension-worker.{js,js.map}",
        //   context: "node_modules/kid-vm/dist/web",
        // },
      ],
    }),
  ],
};
