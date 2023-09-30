var app = getApp();
import { Page } from '/utils/ix'; // 添加这行
Page({
  data: {
    payMoney: '',
    miao: 5,
    logo: '../../img/zhifubao-fukuan.png',
    time: null,
  },
  onLoad(query) {
    var that = this
    // var mb_money = my.getStorageSync({ key: 'mb_money' }).data;
    var pay_money = my.getStorageSync({ key: 'paymoney' }).data;
    var mb_phone = my.getStorageSync({ key: 'mb_phone' }).data;
    var mb_name = my.getStorageSync({ key: 'mb_name' }).data;
    var store_name = my.getStorageSync({ key: 'store_name' }).data;
    var name = my.getStorageSync({ key: 'name' }).data;

    var bizNo = my.getStorageSync({ key: 'bizNo' }).data;
    var posmoney = my.getStorageSync({ key: 'posmoney' }).data;

    this.setData({
      ways_source_desc: query.ways_source_desc,
      payMoney: query.pay_amount,
      ways_source: query.ways_source,
      out_trade_no: query.out_trade_no,
      pay_time: query.pay_time,
      buyerId: query.buyerId,
      mb_id: query.mb_id,
      mb_money: query.mb_money,
      pay_money,
      mb_phone,
      mb_name,
      store_name,
      name,
      bizNo,
      posmoney,
    })
    // 判断是微信支付还是会员卡支付
    if (this.data.ways_source == 'alipay') {
      this.setData({
        logo: '../../img/zhifubao-fukuan.png',
      })

      my.ix.speech({
        text: '会员充值成功' + query.pay_amount + '元',
        success: (r) => {
        }
      });
    } else {
      this.setData({
        logo: '../../img/weixin.png',
      })

      my.ix.speech({
        text: '会员充值成功' + query.pay_amount + '元',
        success: (r) => {
        }
      });
    }


    // 倒计时函数
    this.daoshu()
  },
  onShow() {

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
        delta: 3
      })
    }
  },
  // ***********关闭键盘事件监听********************    
  onHide() {
    my.ix.offKeyEventChange();
  },
  onUnLoad() {
    my.ix.offKeyEventChange();
  },
  events: {
    onBack() {
      clearInterval(this.data.time)
      my.navigateBack({
        delta: 3
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
        // my.redirectTo({
        //   url: '/pages/hyyue/hyyue?mb_money='+that.data.mb_money+"&jine="+that.data.paymoney+"&mb_phone="+that.data.mb_phone+"&mb_name="+that.data.mb_name
        // });
        console.log(Number(that.data.mb_money), Number(that.data.pay_money))
        if (Number(that.data.mb_money) >= Number(that.data.pay_money)) {
          console.log(11111)
          console.log(that.data.pay_money, that.data.buyerId, that.data.mb_id)
          that.quest(that.data.buyerId);//*******会员卡支付接口***********

        } else {
          my.redirectTo({
            url: '/pages/hyyue/hyyue?buyerId=' + that.data.buyerId + '&jine=' + that.data.pay_money + '&mb_phone=' + that.data.mb_phone + '&mb_name=' + that.data.mb_name + '&mb_id=' + that.data.mb_id + '&mb_money=' + that.data.mb_money + '&merchant_id=' + that.data.merchant_id + '&store_id=' + that.data.store_id + '&config_id=' + that.data.config_id
          });
        }

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
    var that = this
    // console.log(this.data.time)
    clearInterval(that.data.time)
    // my.navigateBack({
    //   delta:3
    // })
    my.redirectTo({
      url: '/pages/hyyue/hyyue?buyerId=' + that.data.buyerId + '&jine=' + that.data.pay_money + '&mb_phone=' + that.data.mb_phone + '&mb_name=' + that.data.mb_name + '&mb_id=' + that.data.mb_id + '&mb_money=' + that.data.mb_money + '&merchant_id=' + that.data.merchant_id + '&store_id=' + that.data.store_id + '&config_id=' + that.data.config_id
    });


  },

  // 封装会员卡支付接口请求  
  quest(id) {
    var that = this;
    var token = my.getStorageSync({ key: 'token' }).data;
    var store_id = my.getStorageSync({ key: 'store_id' }).data;
    var merchant_id = my.getStorageSync({ key: 'login_merchant_id' }).data;
    var device_id = my.getStorageSync({ key: 'device_id' }).data;
    var Request = my.getStorageSync({ key: 'Request' }).data;

    var checked = my.getStorageSync({ key: 'checked' }).data;
    var print = my.getStorageSync({ key: 'print' }).data;
    my.request({
      url: Request + "/api/member/member_pay_submit",//*******会员卡支付接口***********
      method: 'POST',
      data: {
        token: token,
        store_id: store_id,  //门店ID         
        merchant_id: merchant_id,//收银员ID
        device_id: device_id, //设备ID
        device_type: 'face_f4',  //设备类型     
        total_amount: that.data.pay_money,  //订单金额
        pay_amount: that.data.pay_money,//支付金额
        open_id: id, //支付宝/微信用户id
        mb_id: that.data.mb_id,    //会员ID             
      },
      dataType: 'json',
      success: payR => {
        console.log(payR.data)
        // 会员卡支付成功                                        
        if (payR.data.status == 1) {
          that.setData({
            total_amount: payR.data.data.pay_amount,
            out_trade_no: payR.data.data.out_trade_no,
            result_msg: payR.data.message,
            pay_time: payR.data.data.pay_time,
          })
          if (checked == true) {//判断是否开启打印机
            if (print == 1) {
              that.dayinb()
              console.log('1遍')
            } else {
              that.dayinb()
              that.dayinbb()
              console.log('2遍')
            }

          } else {

          }

          my.setStorageSync({ key: 'kx_status', data: 1 });
          my.ix.tinyCommand({
            target: "pos",
            content: {
              method: "notify",
              result: "succ", //交易结果 succ -成功 fail-失败 cancel-取消 waiting-正在支付 
              bizNo: that.data.bizNo,    //包号，必须与支付前最后一条刷新交易金额指令的包号一致
              totalAmount: that.data.posmoney,  //金额，必须与支付前最后一条刷新交易金额指令的金额一致
              channel: "alipay"  //交易通道 ，alipay、wxpay、cloudpay等
            },
            success: (r) => {
              console.log(r);

            },
            fail: (r) => {
              console.log("fail, errorCode:" + r.error);
            },
          });

          my.redirectTo({
            url: '../membersuccess/membersuccess?payMoney=' + payR.data.data.pay_amount + '&out_trade_no=' + payR.data.data.out_trade_no + '&pay_time=' + payR.data.data.pay_time + '&mb_phone=' + payR.data.data.mb_phone + "&message=" + payR.data.message + '&merchant_id=' + that.data.merchant_id + '&buyerId=' + that.data.buyerId + '&mb_name=' + payR.data.data.mb_name
          })

        } else { // 会员卡支付失败
          console.log(payR.data.message);
          my.redirectTo({
            url: '../fail/fail?result_msg=' + payR.data.message
          })
        }
      },
      fail: payR => {
      },
      complete: payR => {

      }
    });

  },
  dayinb() {
    var device_id = my.getStorageSync({ key: 'device_id' }).data;
    var checkeds = my.getStorageSync({ key: 'checkeds' }).data;
    // 开始监听
    my.ix.startMonitorPrinter({
      success: (r) => {
        console.log("success");

      },
      fail: (r) => {
        console.log("fail, errorCode:" + r.error);
      }
    });
    // 查询连接的打印机的 API
    my.ix.queryPrinter({
      success: (r) => {
        console.log(r)
        if (checkeds == true) {
          my.ix.printer({
            target: r.usb[0].id,
            cmds: [{ 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
            { 'cmd': 'addText', 'args': ['收款单'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'ON'] },
            { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
            { 'cmd': 'addText', 'args': ['商户名称:' + this.data.store_name] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
            { 'cmd': 'addText', 'args': ['设备SN:' + device_id] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付时间:' + this.data.pay_time] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['订单金额:' + this.data.total_amount] },

            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付方式:会员卡支付'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付状态:' + this.data.result_msg] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['订单号:' + this.data.out_trade_no] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectJustification', 'args': ['CENTER'] }, /*设置打印居中对齐*/
            { 'cmd': 'addSelectErrorCorrectionLevelForQRCode', 'args': ['49'] }, /*设置纠错等级*/
            { 'cmd': 'addSelectSizeOfModuleForQRCode', 'args': ['10'] }, /*设置qrcode模块大小*/
            { 'cmd': 'addStoreQRCodeData', 'args': [this.data.out_trade_no] }, /*设置qrcode内容*/
            { 'cmd': 'addPrintQRCode', 'args': [] }, /*打印QRCode*/

            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            ],
            success: (r) => {
              console.log(r)
              // if(r.success==true){

              // }
            },
            complete: (r) => {
              console.log(r)

            },

            fail: (r) => {
              // console.log(r)
            }
          })
        } else {
          my.ix.printer({
            target: r.usb[0].id,
            cmds: [{ 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
            { 'cmd': 'addText', 'args': ['收款单'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'ON'] },
            { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
            { 'cmd': 'addText', 'args': ['商户名称:' + this.data.store_name] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
            { 'cmd': 'addText', 'args': ['设备SN:' + device_id] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付时间:' + this.data.pay_time] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['订单金额:' + this.data.total_amount] },

            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付方式:会员卡支付'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付状态:' + this.data.result_msg] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['订单号:' + this.data.out_trade_no] },
            // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            // { 'cmd': 'addSelectJustification', 'args': ['CENTER'] }, /*设置打印居中对齐*/
            // { 'cmd': 'addSelectErrorCorrectionLevelForQRCode', 'args': ['49'] }, /*设置纠错等级*/
            // { 'cmd': 'addSelectSizeOfModuleForQRCode', 'args': ['10'] }, /*设置qrcode模块大小*/
            // { 'cmd': 'addStoreQRCodeData', 'args': [this.data.out_trade_no] }, /*设置qrcode内容*/
            // { 'cmd': 'addPrintQRCode', 'args': [] }, /*打印QRCode*/

            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            ],
            success: (r) => {
              console.log(r)
              // if(r.success==true){

              // }
            },
            complete: (r) => {
              console.log(r)

            },

            fail: (r) => {
              // console.log(r)
            }
          })
        }

      },
      fail: (r) => {
        console.log(r)
        this.setData({
          message: JSON.stringify(r)
        })
      }
    });
    my.ix.onMonitorPrinter((r) => {
      var device_id = my.getStorageSync({ key: 'device_id' }).data;
      var checkeds = my.getStorageSync({ key: 'checkeds' }).data;
      console.log("received data:" + r);
      // 查询连接的打印机的 API
      my.ix.queryPrinter({
        success: (r) => {
          console.log(r)
          if (checkeds == true) {
            my.ix.printer({
              target: r.usb[0].id,
              cmds: [{ 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
              { 'cmd': 'addText', 'args': ['收款单'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'ON'] },
              { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
              { 'cmd': 'addText', 'args': ['商户名称:' + this.data.store_name] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
              { 'cmd': 'addText', 'args': ['设备SN:' + device_id] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['支付时间:' + this.data.pay_time] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['订单金额:' + this.data.total_amount] },

              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['支付方式:会员卡支付'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['支付状态:' + this.data.result_msg] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['订单号:' + this.data.out_trade_no] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectJustification', 'args': ['CENTER'] }, /*设置打印居中对齐*/
              { 'cmd': 'addSelectErrorCorrectionLevelForQRCode', 'args': ['49'] }, /*设置纠错等级*/
              { 'cmd': 'addSelectSizeOfModuleForQRCode', 'args': ['10'] }, /*设置qrcode模块大小*/
              { 'cmd': 'addStoreQRCodeData', 'args': [this.data.out_trade_no] }, /*设置qrcode内容*/
              { 'cmd': 'addPrintQRCode', 'args': [] }, /*打印QRCode*/

              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              ],
              success: (r) => {
                console.log(r)
                // if(r.success==true){

                // }
              },
              complete: (r) => {
                console.log(r)

              },

              fail: (r) => {
                // console.log(r)
              }
            })
          } else {
            my.ix.printer({
              target: r.usb[0].id,
              cmds: [{ 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
              { 'cmd': 'addText', 'args': ['收款单'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'ON'] },
              { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
              { 'cmd': 'addText', 'args': ['商户名称:' + this.data.store_name] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
              { 'cmd': 'addText', 'args': ['设备SN:' + device_id] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['支付时间:' + this.data.pay_time] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['订单金额:' + this.data.total_amount] },

              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['支付方式:会员卡支付'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['支付状态:' + this.data.result_msg] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['订单号:' + this.data.out_trade_no] },
              // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              // { 'cmd': 'addSelectJustification', 'args': ['CENTER'] }, /*设置打印居中对齐*/
              // { 'cmd': 'addSelectErrorCorrectionLevelForQRCode', 'args': ['49'] }, /*设置纠错等级*/
              // { 'cmd': 'addSelectSizeOfModuleForQRCode', 'args': ['10'] }, /*设置qrcode模块大小*/
              // { 'cmd': 'addStoreQRCodeData', 'args': [this.data.out_trade_no] }, /*设置qrcode内容*/
              // { 'cmd': 'addPrintQRCode', 'args': [] }, /*打印QRCode*/

              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              ],
              success: (r) => {
                console.log(r)
                // if(r.success==true){

                // }
              },
              complete: (r) => {
                console.log(r)

              },

              fail: (r) => {
                // console.log(r)
              }
            })
          }

        },
        fail: (r) => {
          console.log(r)
          this.setData({
            message: JSON.stringify(r)
          })
        }
      });
    });
    // # 结束监听
    my.ix.offMonitorPrinter({
      success: (r) => {
        console.log("success");
      },
      fail: (r) => {
        console.log("fail, errorCode:" + r.error);
      }
    });


  },
  dayinbb() {
    var device_id = my.getStorageSync({ key: 'device_id' }).data;
    var checkeds = my.getStorageSync({ key: 'checkeds' }).data;
    // 开始监听
    my.ix.startMonitorPrinter({
      success: (r) => {
        console.log("success");

      },
      fail: (r) => {
        console.log("fail, errorCode:" + r.error);
      }
    });
    // 查询连接的打印机的 API
    my.ix.queryPrinter({
      success: (r) => {
        console.log(r)
        if (checkeds == true) {
          my.ix.printer({
            target: r.usb[0].id,
            cmds: [{ 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
            { 'cmd': 'addText', 'args': ['收款单'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'ON'] },
            { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
            { 'cmd': 'addText', 'args': ['商户名称:' + this.data.store_name] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
            { 'cmd': 'addText', 'args': ['设备SN:' + device_id] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付时间:' + this.data.pay_time] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['订单金额:' + this.data.total_amount] },

            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付方式:会员卡支付'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付状态:' + this.data.result_msg] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['订单号:' + this.data.out_trade_no] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectJustification', 'args': ['CENTER'] }, /*设置打印居中对齐*/
            { 'cmd': 'addSelectErrorCorrectionLevelForQRCode', 'args': ['49'] }, /*设置纠错等级*/
            { 'cmd': 'addSelectSizeOfModuleForQRCode', 'args': ['10'] }, /*设置qrcode模块大小*/
            { 'cmd': 'addStoreQRCodeData', 'args': [this.data.out_trade_no] }, /*设置qrcode内容*/
            { 'cmd': 'addPrintQRCode', 'args': [] }, /*打印QRCode*/

            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            ],
            success: (r) => {
              console.log(r)
              // if(r.success==true){

              // }
            },
            complete: (r) => {
              console.log(r)

            },

            fail: (r) => {
              // console.log(r)
            }
          })
        } else {
          my.ix.printer({
            target: r.usb[0].id,
            cmds: [{ 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
            { 'cmd': 'addText', 'args': ['收款单'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'ON'] },
            { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
            { 'cmd': 'addText', 'args': ['商户名称:' + this.data.store_name] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
            { 'cmd': 'addText', 'args': ['设备SN:' + device_id] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付时间:' + this.data.pay_time] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['订单金额:' + this.data.total_amount] },

            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付方式:会员卡支付'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付状态:' + this.data.result_msg] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['订单号:' + this.data.out_trade_no] },
            // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            // { 'cmd': 'addSelectJustification', 'args': ['CENTER'] }, /*设置打印居中对齐*/
            // { 'cmd': 'addSelectErrorCorrectionLevelForQRCode', 'args': ['49'] }, /*设置纠错等级*/
            // { 'cmd': 'addSelectSizeOfModuleForQRCode', 'args': ['10'] }, /*设置qrcode模块大小*/
            // { 'cmd': 'addStoreQRCodeData', 'args': [this.data.out_trade_no] }, /*设置qrcode内容*/
            // { 'cmd': 'addPrintQRCode', 'args': [] }, /*打印QRCode*/

            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            ],
            success: (r) => {
              console.log(r)
              // if(r.success==true){

              // }
            },
            complete: (r) => {
              console.log(r)

            },

            fail: (r) => {
              // console.log(r)
            }
          })
        }

      },
      fail: (r) => {
        console.log(r)
        this.setData({
          message: JSON.stringify(r)
        })
      }
    });
    my.ix.onMonitorPrinter((r) => {
      var device_id = my.getStorageSync({ key: 'device_id' }).data;
      var checkeds = my.getStorageSync({ key: 'checkeds' }).data;
      console.log("received data:" + r);
      // 查询连接的打印机的 API
      my.ix.queryPrinter({
        success: (r) => {
          console.log(r)
          if (checkeds == true) {
            my.ix.printer({
              target: r.usb[0].id,
              cmds: [{ 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
              { 'cmd': 'addText', 'args': ['收款单'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'ON'] },
              { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
              { 'cmd': 'addText', 'args': ['商户名称:' + this.data.store_name] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
              { 'cmd': 'addText', 'args': ['设备SN:' + device_id] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['支付时间:' + this.data.pay_time] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['订单金额:' + this.data.total_amount] },

              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['支付方式:会员卡支付'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['支付状态:' + this.data.result_msg] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['订单号:' + this.data.out_trade_no] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectJustification', 'args': ['CENTER'] }, /*设置打印居中对齐*/
              { 'cmd': 'addSelectErrorCorrectionLevelForQRCode', 'args': ['49'] }, /*设置纠错等级*/
              { 'cmd': 'addSelectSizeOfModuleForQRCode', 'args': ['10'] }, /*设置qrcode模块大小*/
              { 'cmd': 'addStoreQRCodeData', 'args': [this.data.out_trade_no] }, /*设置qrcode内容*/
              { 'cmd': 'addPrintQRCode', 'args': [] }, /*打印QRCode*/

              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              ],
              success: (r) => {
                console.log(r)
                // if(r.success==true){

                // }
              },
              complete: (r) => {
                console.log(r)

              },

              fail: (r) => {
                // console.log(r)
              }
            })
          } else {
            my.ix.printer({
              target: r.usb[0].id,
              cmds: [{ 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
              { 'cmd': 'addText', 'args': ['收款单'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'ON'] },
              { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
              { 'cmd': 'addText', 'args': ['商户名称:' + this.data.store_name] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
              { 'cmd': 'addText', 'args': ['设备SN:' + device_id] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['支付时间:' + this.data.pay_time] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['订单金额:' + this.data.total_amount] },

              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['支付方式:会员卡支付'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['支付状态:' + this.data.result_msg] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['订单号:' + this.data.out_trade_no] },
              // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              // { 'cmd': 'addSelectJustification', 'args': ['CENTER'] }, /*设置打印居中对齐*/
              // { 'cmd': 'addSelectErrorCorrectionLevelForQRCode', 'args': ['49'] }, /*设置纠错等级*/
              // { 'cmd': 'addSelectSizeOfModuleForQRCode', 'args': ['10'] }, /*设置qrcode模块大小*/
              // { 'cmd': 'addStoreQRCodeData', 'args': [this.data.out_trade_no] }, /*设置qrcode内容*/
              // { 'cmd': 'addPrintQRCode', 'args': [] }, /*打印QRCode*/

              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              ],
              success: (r) => {
                console.log(r)
                // if(r.success==true){

                // }
              },
              complete: (r) => {
                console.log(r)

              },

              fail: (r) => {
                // console.log(r)
              }
            })
          }

        },
        fail: (r) => {
          console.log(r)
          this.setData({
            message: JSON.stringify(r)
          })
        }
      });
    });
    // # 结束监听
    my.ix.offMonitorPrinter({
      success: (r) => {
        console.log("success");
      },
      fail: (r) => {
        console.log("fail, errorCode:" + r.error);
      }
    });


  },

});
