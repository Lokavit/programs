//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },

  onLoad(query) {
    this.setData({
      jine: query.jine
    })
  },
  btnTap() {
    my.navigateBack({
      delta: 1
    })
  }



})
