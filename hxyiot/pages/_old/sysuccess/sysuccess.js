var app = getApp();
import { Page } from '/utils/ix'; // 添加这行
Page({
  data: {
    total_amount: '',
    miao: 5,
    logo: '../../img/zhifubao-fukuan.png',
    time: null,
  },
  onLoad(query) {

    console.log(query)
    this.setData({
      paymoney: query.paymoney,
      source_desc: query.source_desc,
      out_trade_no: query.out_trade_no,
      pay_time: query.pay_time,
      ways_source: query.ways_source,

    })

    if (this.data.ways_source == 'alipay') {
      this.setData({
        logo: '../../img/zhifubao-fukuan.png',
      })
      my.ix.voicePlay({
        eventId: 'pay_succeed_with_summary',
        number: query.paymoney,
        success: (r) => {
          // my.alert({content: r});
        }
      });
    } else {
      this.setData({
        logo: '../../img/weixin.png',
      })
      my.ix.voicePlay({
        eventId: 'ZFDZ',
        number: query.paymoney,
        success: (r) => {
          // my.alert({content: r});
        }
      });
    }



    // 倒计时---函数
    this.daoshu()
  },
  onShow() {


    var that = this
    my.ix.getSysProp({
      key: 'ro.serialno',
      success: (r) => {
        my.setStorageSync({ key: 'DeviceId', data: r.value });

        var data = { "DeviceId": r.value, "DeviceType": "face_f4", }

        // 支付成功后广告
        my.request({
          url: app.globalData.HOST + '/api/ad/ad_lists_new',
          method: 'POST',
          data: {
            DeviceId: r.value,//设备号
            DeviceType: "face_f4",//设备类型
            AdPid: 3 //投放位置
          },
          success: function (res) {
            // console.log(res.data,'999999999999999999999999')
            that.setData({
              imgs: res.data.data[0].ad_file
            })
          },
          fail: function (res) {
            console.log('失败')
          },

        })

      }
    })

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
    if (r.keyCode == 133) {
      clearInterval(this.data.time)
      my.navigateBack({
        delta: 5
      })
    }
  },
  // ***********关闭键盘事件监听********************    
  onHide() {
    // my.ix.offKeyEventChange();
  },
  onUnLoad() {
    my.ix.offKeyEventChange();
  },
  events: {
    onBack() {
      clearInterval(this.data.time)
      my.navigateBack({
        delta: 5
      })
      console.log('onBack--支付成功');
    },
  },


  daoshu() {
    let that = this
    let time = that.data.time
    let miao = that.data.miao
    clearInterval(time)
    time = setInterval(function () {
      if (miao < 2) {
        console.log(typeof miao)
        //跳转首页
        clearInterval(time)
        console.log('倒计时结束')
        my.navigateBack({
          delta: 5
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
      time: time
    })
  },

  daojishiTap() {
    // console.log(this.data.time)
    clearInterval(this.data.time)
    my.navigateBack({
      delta: 5
    })
  },


});
