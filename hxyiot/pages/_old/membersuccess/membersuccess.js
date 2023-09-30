var app = getApp();
import { Page } from '/utils/ix'; // 添加这行
Page({
  data: {
    payMoney:'',
    miao: 5,
    logo:'../../img/register/zhanghuyue.png',
    time:null,
  },
  onLoad(query) {
    // 姓名和手机号处理
    var mb_name=query.mb_name;
    mb_name=mb_name.replace(mb_name.substring(0,1), "*");

    var mb_phone = query.mb_phone;
    mb_phone = "" + mb_phone;
    var mb_phone = mb_phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
    
    this.setData({
      ways_source_desc:'会员卡支付成功',
      payMoney:query.payMoney,
      out_trade_no:query.out_trade_no,
      pay_time:query.pay_time,
      mb_phone:mb_phone,
      mb_name:mb_name,
      end_dk_money:query.end_dk_money,

    })
    this.setData({
      logo:'../../img/register/zhanghuyue.png',
    })
    // my.ix.voicePlay({
    //   eventId: 'pay_succeed_with_summary',
    //   number: query.pay_amount,
    //   success: (r) => {
    //     // my.alert({content: r});
    //   }
    // });
    my.ix.speech({
        text: '会员卡支付成功'+this.data.payMoney+'元',
        success: (r) => {
        }
    });
      
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
  onHide(){
    my.ix.offKeyEventChange();
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
      console.log('onBack--支付成功');
    },
  }, 


  daoshu() {
    let that=this
    let time=that.data.time
    let miao = that.data.miao
    clearInterval(time) 
    time = setInterval(function () {
      if (miao < 2) {
        console.log(typeof miao)
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
 
  daojishiTap() {
    // console.log(this.data.time)
    clearInterval(this.data.time)
    my.navigateBack({
      delta:4
    })
  },
  
  
});
