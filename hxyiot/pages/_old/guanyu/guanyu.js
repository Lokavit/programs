var app = getApp();
console.log('guanyu.js',app);
Page({
  data: {
    
  },
  onLoad() {
    console.log('guanyu.js onLoad',this);
  },
  onShow(){    
    var isv_phone = my.getStorageSync({ key: 'isv_phone' }).data;
    var isv_name = my.getStorageSync({ key: 'isv_name' }).data;
    var isv_logo = my.getStorageSync({ key: 'isv_logo' }).data;
    var Version = my.getStorageSync({ key: 'Version' }).data;
    console.log(isv_logo)
    console.log(Version)
    console.log(isv_name)
    var that=this
    that.setData({      
      logo:isv_logo,
      Version:Version,
      isv_phone:isv_phone,
      isv_name:isv_name,
    })
    
  },
  
});
