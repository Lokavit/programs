/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-01 13:41:31
 * @LastEditTime: 2019-11-12 12:36:25
 */
module.exports = {
  "presets": [
    ["@babel/preset-env", { "modules": false }],
    '@vue/app'
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
