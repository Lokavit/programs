module.exports = {
  title: 'i-Docking Code Dcoument',
  description: 'i-Dcoking Code Dcoument',
  sidebarDepth: 2,
  themeConfig: {
    lastUpdated: 'Last Updated', // 文档更新时间：每个文件git最后提交的时间
    nav:[
      {
        text: '学习', link: '/' ,
        items: [
          { text: '教程', link: '' },
          { text: 'API',link: '' },
          { text: '风格指南',link: '' },
          { text: '示例',link: '' },
          { text: 'Cookbook',link: '' },
        ]
      }
    ],
    sidebar:[
      {
        title: '指南',
        collapsable: false,
        children: [
          ['/FAQ/quickstart','快速开始'],
          ['/FAQ/directory','目录结构'],
          ['/FAQ/international','国际化配置'],
          ['/FAQ/dev','开发环境配置'],
          ['/FAQ/press','文档使用']
        ]
      },
      {
        title: '资源',
        collapsable: false,
        children: [
          ['/FAQ/quickstart','概览'],
          ['/FAQ/quickstart','svg'],
          ['/FAQ/quickstart','iconfont'],
          ['/FAQ/quickstart','图片'],
        ]
      },
      {
        title: '自定义组件',
        collapsable: false,
        children: [
          ['/FAQ/quickstart','FormMod'],
          ['/FAQ/quickstart','FormSearch'],
          ['/FAQ/quickstart','IdButton'],
          ['/FAQ/quickstart','IdDialog'],
          ['/FAQ/quickstart','RichText'],
          ['/FAQ/quickstart','Alert'],
          ['/FAQ/quickstart','Attachments'],
          ['/FAQ/quickstart','ImageModal'],
          ['/FAQ/quickstart','SvgIcon'],
        ]
      },
      {
        title: '路由',
        collapsable: false,
        children: [
          ['/FAQ/quickstart','路由配置'],
          ['/FAQ/quickstart','参数说明'],
        ]
      },
      {
        title: 'Store',
        collapsable: false,
        children: [
          ['/FAQ/quickstart','Vuex配置'],
          ['/FAQ/quickstart','参数说明'],
        ]
      },
      {
        title: '权限',
        collapsable: false,
        children: [
          ['/FAQ/quickstart','权限配置'],
          ['/FAQ/quickstart','参数说明'],
        ]
      },
      {
        title: 'API接口',
        collapsable: false,
        children: [
          ['/FAQ/quickstart','快速开始']
        ]
      },
      {
        title: 'Webpack打包',
        collapsable: false,
        children: [
          ['/FAQ/quickstart','快速开始']
        ]
      }
    ]
  }
}
