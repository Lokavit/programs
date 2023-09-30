var app = getApp();
Page({
  data: {},
  onLoad() {
    
  },
  onShow(){
    
  },
  shoukuanTap(){
    my.navigateTo({
      url: '../shoukuan/shoukuan'
    })
  },
  flowerTap(){
    my.navigateTo({
      url: '../flowerlist/flowerlist'
    })
  },
  // jianbaoTap(){
  //   my.navigateTo({
  //     url: '../jingyingjianbao/jingyingjianbao'
  //   })
  // },
  // jiudianTap(){
  //   my.navigateTo({
  //     url: '../jiudianlist/jiudianlist'
  //   })
  // }
});
