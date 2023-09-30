<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2020-03-09 13:44:31
 * @LastEditTime: 2020-03-09 15:04:41
 -->

# 目录结构
```
+ build
+ docs
+ mock
+ public
+ src
|---- + api
|---- + assets
|---- + components
|---- + filters
|---- + init
|---- + lang
|---- + layout
|---- + mixins
|---- + modals
|---- + routers
|---- + store
|---- + styles
|---- + utils
|---- + views
|---- App.vue
|---- main.js
|---- settings.js
|---- .env.development
|---- .env.production
|---- .env.testing
|---- vue.config.js
+ 
```
这里我只会介绍核心的目录和文件，其他的顾名思义直接去看代码就好。

### public
这里存放html静态模板，使用[WebpackHtmlPlugin](https://webpack.js.org/plugins/html-webpack-plugin/#root)插件，实现动态内容注入，我主要想后期扩展一些功能，比如适配不同尺寸的屏幕、优化对Retina屏幕的显示等。

### docs
使用[VuePress](https://www.vuepress.cn/ "Vue文档撰写工具")开发的文档工程，每篇文章就是一个md文件，

### src/api
所有与后端交互的接口，按模块进行划分

### src/assets
项目中用到的静态资源文件
目录名 | 说明 
- | -
404 | 404页面相关资源
iconfont | 字体图标
settings | 设置有关的图片 
svg | 所有svg-icon
vessel | 船舶类型图片

### src/components
自定义组件、全局常用组件等

### src/filters
过滤器

### src/init
这里面包含程序初始化时的操作流程，比如：
1. 按需引入ElementUI组件
2. 加载国际化文件
3. 注册svgicon

等等

### src/lang
国际化文件

### src/layout
程序主体框架布局文件，包含顶部header、左侧导航，实际切换的是内部右下角区块```el-main```组件

### src/mixins
多个页面公用的代码片段

### src/modals
全局公用的弹框

### src/routers
路由配置

### src/store
Vuex配置信息

### src/styles
页面样式信息独立出来，我这里没有放到src/assets，差不多啦

### src/utils
项目中公用的一些helpers

### srd/views
页面文件

### App.vue
顶层Vue组件

### main.js
入口文件，完成一些初始化工作

### settings.js
程序的一些配置

### .env.development
开始模式下的配置（api地址、端口、附件地址等）

### .env.production
生产环境下的配置（api地址、端口、附件地址等）

### .env.testing
测试环境下的配置（api地址、端口、附件地址等）
