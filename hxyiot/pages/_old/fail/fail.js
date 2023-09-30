var app = getApp();
import { Page } from '/utils/ix'; // 添加这行
Page({
  data: {
    miao: 5,
    time:null,
  },
  onLoad(query) {
    my.ix.voicePlay({
      eventId: 'gxsy',      
    });
    this.setData({
      result_msg:query.result_msg,
      pay_amount:query.pay_amount
    })
    
    // 倒计时---函数
    this.daoshu()  
  },
  onShow(){
    
  },
  onKeyPress(r) {
    switch (r.keyCode) {
      case 131:
        r.keyName = '收款';
        break;
      case 132:
        r.keyName = '刷脸';
        break;
      case 133:
        r.keyName = '取消';
        break;
      case 134:
        r.keyName = '设置';
        break;
    }
    console.log('KeyEvent', r);
    if(r.keyCode == 133){ 
      clearInterval(this.data.time)
      my.navigateBack({
        delta:3
      })
    }
  },
 // ***********关闭键盘事件监听********************    
  onHide() {
    my.ix.offKeyEventChange();
    clearInterval(this.data.time)
    my.navigateBack({
      delta:3
    })
  }, 
  onUnLoad() {
    my.ix.offKeyEventChange();
  },
  events: {
    onBack() {
      clearInterval(this.data.time)
      my.navigateBack({
        delta:3
      })
      console.log('onBack--支付失败');
    },
  }, 
// 倒计时
  daoshu() {
    var that=this
    var time=that.data.time
    var miao = that.data.miao

    time = setInterval(function () {
      if (miao < 2) {
        //跳转首页
        clearInterval(time)   
        console.log('倒计时结束')       
        my.navigateBack({
          delta:3
        })
        
      } else {
        miao--
        that.setData({
          miao: miao,
        })
        console.log('倒计时--1')  
      }        
    }, 1000)


    that.setData({
      time:time
    })
  },
  daojishiTap(){
    clearInterval(this.data.time)
    my.navigateBack({
      delta:3
    })
  }
});
