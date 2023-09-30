var app = getApp();
Page({
  data: {
    payMoney:'',
    miao: 10,
    nmiao: 10,
    logo:'../../img/zhifubao-fukuan.png',
    time:null,
  },
  onLoad(query) {
    this.setData({
      shoukuanmer:query.store_name,
      payMoney:query.total_amount,
      out_trade_no:query.out_trade_no,
      pay_time:query.pay_time,
    })
    if(this.data.ways_source == 'alipay'){
      this.setData({
        logo:'../../img/zhifubao-fukuan.png',
      })
      my.ix.voicePlay({
        eventId: 'pay_succeed_with_summary',
        number: query.pay_amount,
        success: (r) => {
          // my.alert({content: r});
        }
      });
    }else{
      this.setData({
        logo:'../../img/weixin.png',
      })
      my.ix.voicePlay({
        eventId: 'ZFDZ',
        number: query.pay_amount,
        success: (r) => {
          // my.alert({content: r});
        }
      });
    }
    // 倒计时---函数
    this.daoshu()   
    
  },

  daoshu() {
    var that=this
    var time=this.data.time
    var miao = this.data.miao

    time = setInterval(function () {
      if (miao === 0) {
        //跳转首页
        clearInterval(time)   
        console.log('倒计时结束')       
        my.navigateTo({
          url: '../index/index'
        })
        
      } else {
        miao--
        that.setData({
          miao: miao,
        })
        console.log('倒计时--1')  
      }        
    }, 1000)


    // this.setData({
    //   time:time
    // })
  },
 
  // daojishiTap() {
  //   // console.log(this.data.time)
  //   clearInterval(this.data.time)
  //   my.redirectTo({
  //     url: '../index/index'
  //   })
  // },
  
});
