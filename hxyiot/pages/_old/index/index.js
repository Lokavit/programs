// import md5 from '/utils/md5.js';
import { Page } from '/utils/ix'; // 添加这行 2021.03.02

Page({
  data: {
    posid: 'idle_pos', // 海报位置id，目前固定传入idle_pos
    audible: true,  // 海报（视频类）是否有声音
    default_poster: 'image/15762069421783.jpg',  // 本地兜底海报路径
    show_default_poster: true,

    background: [],
    deviceSn: '',
    swiperTypes: [],
    swiper: {
      indicatorDots: true,
      autoplay: true,
      vertical: false,
      interval: 15000,
      circular: false,
      acceleration: true,
      tradeNum: '',
      indicatorDots: false,
      disableTouch: true,
    },
    token: '',
    video: {
      showAllControls: false,
      showPlayButton: true,
      showCenterButton: false,
      showFullScreenButton: true,
      isLooping: false,
      muteWhenPlaying: false,
      initTime: 0,
      objectFit: "fill",
      autoPlay: false,
      directionWhenFullScreen: 90,
      mobilenetHintType: 2,

    },
    videosPlay: {},
    indicatorDots: true,
    autoplay: true,
    loop: true,
    vertical: false,
    interval: 1000,
    circular: true,
    acceleration: true,
    mode: 'scaleToFill',
    new_out_trade_no: '',
    a: '',
    videoList: [],
    imgList: [],
    cashshow: 0,
    posmoney: '0.00',
    poshshow: 0,
    canclick: true,

  },

  onLoad(query) {
    // 页面加载  
    var token = my.getStorageSync({ key: 'token' }).data;
    var device_id = my.getStorageSync({ key: 'device_id' }).data;
    var Request = my.getStorageSync({ key: 'Request' }).data;
    var interval = my.getStorageSync({ key: 'interval' }).data;
    var sellerId = my.getStorageSync({ key: 'sellerId' }).data;
    var pay_action = my.getStorageSync({ key: 'pay_action' }).data;
    var store_id = my.getStorageSync({ key: 'store_id' }).data;
    var config_id = my.getStorageSync({ key: 'config_id' }).data;
    var merchant_name = my.getStorageSync({ key: 'name' }).data;
    var background = my.getStorageSync({ key: 'background' }).data;
    console.log('index页面加载的背景图', background) // 没有值
    var bjimg = JSON.parse(background)
    console.log(bjimg, 'img') // 没有值


    this.setData({
      device_id: device_id,
      Request: Request,
      background: bjimg,
      interval: interval,
      sellerId: sellerId,
      pay_action: pay_action,
      store_id: store_id,
      config_id: config_id,
      merchant_name,
      loginjudge: query.loginjudge,
      token: token,
    })
    console.log('index.js 页面加载:', this.data);

    var csh_merchant_id = my.getStorageSync({ key: 'csh_merchant_id' }).data;
    // 此处有值为42 （商户本人的自增ID）
    var login_merchant_id = my.getStorageSync({ key: 'login_merchant_id' }).data;
    console.log('index.js login_merchant_id', login_merchant_id);
    if (login_merchant_id != null) {
      this.setData({
        merchant_id: login_merchant_id,
      })
      console.log('index.js 登录收银员')
    } else {
      this.setData({
        merchant_id: csh_merchant_id,
      })
      console.log('index.js 非登录收银员')
    }

    my.ix.offCodeScan()//关闭扫码
    this.cashFunction()



  },

  onShow() {
    // 获取缓存的收银模式码
    const CASHIER_MODE = my.getStorageSync({ key: 'cashierMode' }).data;
    this.setData({ cashierMode: CASHIER_MODE });
    console.warn('index.js 获取缓存的收银模式:', this.data.cashierMode);

    my.removeStorage({ key: 'background' })

    var that = this

    // ****************************** 随机数 ***********  
    var new_out_trade_no = that.text();
    console.log(new_out_trade_no, 66666);
    // ****************************** 随机数 ***********    

    var model = my.getStorageSync({ key: 'model' }).data;//判断是什么模式收银
    var store_id = my.getStorageSync({ key: 'store_id' }).data;

    var store_name = my.getStorageSync({ key: 'store_name' }).data;
    var name = my.getStorageSync({ key: 'name' }).data;

    var checked = my.getStorageSync({ key: 'checked' }).data;
    var print = my.getStorageSync({ key: 'print' }).data;
    this.setData({
      store_name: store_name,
      name: name,
      store_id,
    })


    // ****************start-------***************  
    var cashFunction = null;
    console.log('index.js 输出收银模式的值：', model)
    if (model == 1) {// 判断是否为打印机模式，然后打开多次扫码事件start
      that.setData({
        cashshow: 1,
      })
      var qr_code_end = my.getStorageSync({ key: 'qr_code_end' }).data;

    } else if (model == 5) {
      var kx_status = my.getStorageSync({ key: 'kx_status' }).data;
      console.log('客显金额显示与否:   ' + kx_status)
      if (kx_status == 1) {//成功
        that.setData({
          poshshow: 0,
          posmoney: 0
        })
      } else {//失败
        that.setData({
          poshshow: 1
        })
      }
      // ***********************************-华-丽-的分割线*************************************************
      //# 开始接收指令
      my.ix.startMonitorTinyCommand({
        success: (r) => {
          console.log(r);
        },
        fail: (r) => {
          console.log("fail, errorCode:" + r.error);
        }
      });

      //# 等待指令的接收
      my.ix.onMonitorTinyCommand((r) => {
        console.log(r);
        if (r.method == "refresh" && r.totalAmount != "0" && r.totalAmount != "0.00") {
          that.setData({
            poshshow: 1,
            posmoney: r.totalAmount,
            bizNo: r.bizNo,
          })
          my.setStorageSync({ key: 'bizNo', data: r.bizNo });
          my.setStorageSync({ key: 'posmoney', data: r.totalAmount });
        } else {
          that.setData({
            poshshow: 0,
            posmoney: "",
          })
        }

      });


      // ***********************************-华-丽-的分割线*************************************************

    } else {// 判断是否为打印机模式，然后关闭多次扫码事件
      that.setData({
        cashshow: 0,
      })
      my.ix.offCodeScan()
    }
    // ****************end------***************
    this.getSwiperList()
  },
  getSwiperList() {
    if (this.isVideo()) {

      this.data.background.map(item => {
        if (item.type === 'video') {
          this.setData({
            videoList: [item]
          })
        }
      })
    } else {
      this.setData({
        imgList: this.data.background
      })
      console.log('轮播图：', this.data.imgList)
    }
  },
  isVideo() {
    return this.data.background ? this.data.background.some(item => {
      return item.type == 'video'
    }) : false
  },

  onKeyPress(r) {
    var that = this

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

    // 这里如果是true,表示已登录，执行if语句，否则执行else
    var loginjudge = my.getStorageSync({ key: 'loginjudge' }).data;
    if (loginjudge == true) {
      console.log('登录页过来的')


      var new_out_trade_no = that.text();
      console.log(new_out_trade_no);


      // ******************************随机数*********** 
      var model = my.getStorageSync({ key: 'model' }).data;//判断是什么模式收银
      var store_id = my.getStorageSync({ key: 'store_id' }).data;

      var store_name = my.getStorageSync({ key: 'store_name' }).data;
      var name = my.getStorageSync({ key: 'name' }).data;

      var checked = my.getStorageSync({ key: 'checked' }).data;
      var print = my.getStorageSync({ key: 'print' }).data;
      this.setData({
        store_name: store_name,
        name: name,
        store_id,
      })
      // ****************start-------***************  




      var jine = Number(r.amount).toFixed(2);
      if (model == 0) {//独立收银模式 
        console.log('index.js 独立收银模式')

        if (r.keyCode == 131) {
          console.log('index.js keyCode==131 收款');
          if (jine > 0) {
            // 判断是否选择挑战10秒游戏
            var gamememberchecked = my.getStorageSync({ key: 'gamememberchecked' }).data;
            console.log(gamememberchecked)
            if (gamememberchecked == true) {
              my.navigateTo({
                url: '../games/games',
              })
              return
            }
            // 判断是否选择会员支付
            var memberchecked = my.getStorageSync({ key: 'memberchecked' }).data;
            console.log(memberchecked)
            if (memberchecked == true) {//选择会员支付
              my.navigateTo({
                url: '../payment/payment?jine=' + jine.toString() + "&canceljudgement=" + true,
              })
            } else {//不选择会员支付
              // 收银台播报支付语音
              // my.ix.voicePlay({
              //   eventId: 'e4',
              //   number: jine.toString(),
              //   success: (r) => {
              //     console.log('11111111111111111111111111')
              //   }
              // });  
              // ******************启动收银台**********************
              console.log('index.js 准备启动收银台 my.ix.startApp');
              my.ix.startApp({
                appName: 'cashier',
                bizNo: new_out_trade_no,
                totalAmount: jine,
                success: (res) => {
                  console.log('启动收银台的success', JSON.stringify(res))
                  if (res.barCode != undefined) {
                    // C 代表扫码
                    if (res.codeType == 'C') {
                      my.navigateTo({
                        url: '../chaxunjieguo/chaxunjieguo?device_id=' + that.data.device_id + "&pay_action=" + that.data.pay_action + "&store_id=" + store_id + "&merchant_id=" + that.data.merchant_id + "&out_trade_no=" + new_out_trade_no + "&config_id=" + that.data.config_id + "&auth_code=" + res.barCode + "&total_amount=" + jine.toString() + "&codeType=" + res.codeType + "&canceljudgement=" + true,
                      })
                    } else {

                      var data3 = {
                        "device_id": that.data.device_id,
                        "device_type": "face_f4",
                        "pay_method": "alipay_face",
                        "pay_action": that.data.pay_action,
                        "store_id": store_id,
                        "merchant_id": that.data.merchant_id,
                        "merchant_name": that.data.name,
                        "out_trade_no": new_out_trade_no,
                        "config_id": that.data.config_id,
                        "auth_code": res.barCode,
                        "total_amount": jine.toString()
                      }
                      var str3 = app.jsonsortSign(data3)  //键名排序+转换字符串(加密用)  
                      var encryptedStr = md5(str3 + "&key=" + "88888888");//md5加密

                      my.request({
                        url: that.data.Request + "/api/devicepay/all_pay",//*******支付接口***********/
                        method: 'POST',
                        data: {
                          device_id: that.data.device_id,
                          device_type: 'face_f4',
                          pay_method: 'alipay_face',
                          pay_action: that.data.pay_action,
                          store_id: store_id,
                          merchant_name: that.data.name,
                          merchant_id: that.data.merchant_id,
                          out_trade_no: new_out_trade_no,
                          config_id: that.data.config_id,
                          auth_code: res.barCode,
                          total_amount: jine,
                          sign: encryptedStr
                        },
                        dataType: 'json',
                        success: function (payres) {
                          console.log(payres.data)
                          that.setData({
                            out_trade_no: payres.data.out_trade_no,
                            total_amount: payres.data.total_amount,
                            ways_source_desc: payres.data.ways_source_desc,
                            result_msg: payres.data.result_msg,
                            pay_time: payres.data.pay_time,
                            remark: payres.data.remark,
                          })
                          if (payres.data.return_code == "SUCCESS") {//SUCCESS/FALL 此字段是通信标识
                            if (payres.data.result_code == "SUCCESS") {
                              if (checked == true) {//判断是否开启打印机
                                // ********--------*********
                                if (print == 1) {
                                  that.dayina()
                                  console.log('1遍')
                                  console.log('刷脸走这边')
                                } else {
                                  that.dayina()
                                  that.dayinaa()
                                  console.log('2遍')
                                }
                              } else {

                              }
                            }
                          }

                        },
                        fail: function (payres) {

                        },
                        complete: function (payres) {

                        }
                      });
                    }

                  }
                }
              });
            }

          }
        } else if (r.keyCode == 134) {//设置
          my.navigateTo({
            // url: '../shezhi/shezhi'
            url: '../setting/setting'
          })
        } else if (r.keyCode == 133) {//取消

        } else if (r.keyCode == 132) {//刷脸

        } else {

        }

      } else if (model == 1) {//收银机模式

        // ******************启动收银台**********************
        var key = r.keyCode
        var keys = (key.toString()).length
        var syjine = Number(r.amount).toFixed(2);
        console.log('收银机模式')

        if (r.keyCode == 131) {
          if (keys == 3) {
            my.ix.startApp({
              appName: 'cashier',
              bizNo: new_out_trade_no,
              // totalAmount:syjine,
              // totalAmount: '',
              success: (res) => {
                console.log(res)
                console.log(res.barCode)
                var qr_code_end = my.getStorageSync({ key: 'qr_code_end' }).data;
                var face_code_end = my.getStorageSync({ key: 'face_code_end' }).data;
                console.log(res.barCode + qr_code_end)
                console.log(res.barCode + face_code_end)
                // 扫码
                if (res.codeType == 'C') {
                  if (qr_code_end == '' || qr_code_end == undefined) {
                    my.ix.writeHID({
                      protocol: 'barcode',
                      value: res.barCode,
                      success: (r) => {
                        console.log(r)
                        my.showToast('success: ' + JSON.stringify(r));
                      },
                      fail: (r) => {
                        console.log(r)
                        my.showToast('fail: ' + JSON.stringify(r));
                      }
                    })

                  } else {
                    var qr_code_end = res.barCode + qr_code_end
                    my.ix.writeHID({
                      protocol: 'barcode',
                      value: qr_code_end,
                      success: (r) => {
                        console.log(r)
                        my.showToast('success: ' + JSON.stringify(r));
                      },
                      fail: (r) => {
                        console.log(r)
                        my.showToast('fail: ' + JSON.stringify(r));
                      }
                    })
                  }
                } else {

                  if (face_code_end == '' || face_code_end == undefined) {
                    my.ix.writeHID({
                      protocol: 'barcode',
                      value: res.barCode,
                      success: (r) => {

                        console.log(r)
                        my.showToast('success: ' + JSON.stringify(r));
                      },
                      fail: (r) => {
                        console.log(r)
                        my.showToast('fail: ' + JSON.stringify(r));
                      }
                    })
                  } else {
                    var face_code_end = res.barCode + face_code_end
                    my.ix.writeHID({
                      protocol: 'barcode',
                      value: face_code_end,
                      success: (r) => {
                        console.log(r)
                        my.showToast('success: ' + JSON.stringify(r));
                      },
                      fail: (r) => {
                        console.log(r)
                        my.showToast('fail: ' + JSON.stringify(r));
                      }
                    })
                  }


                }


              }
            });
          }
        } else if (r.keyCode == 134) {//设置
          my.navigateTo({
            url: '../shezhi/shezhi'
          })
        } else if (r.keyCode == 133) {//取消

        } else if (r.keyCode == 132) {//刷脸

        } else {

        }



      } else if (model == 2) {//花呗分期
        if (jine > 0) {
          if (r.keyCode == 131) {

            my.navigateTo({
              url: '../feebear/feebear?total_money=' + jine.toString(),
            })
          }
        } else {

        }
        if (r.keyCode == 134) {//设置
          my.navigateTo({
            url: '../shezhi/shezhi'
          })
        } else if (r.keyCode == 133) {//取消

        }
      } else if (model == 3) {//酒店预授权      
        if (r.keyCode == 131) {
          if (jine != undefined && jine != "0" && jine != "0.0") {
            // // 收银台播报支付语音
            // my.ix.voicePlay({
            //   eventId: 'e4',
            //   number: jine.toString(),
            //   success: (r) => {
            //     console.log('333333333333333333333333')
            //   }
            // });  

            // ******************启动收银台**********************
            my.ix.startApp({
              appName: 'cashier',
              bizNo: new_out_trade_no,
              totalAmount: jine,
              success: (res) => {
                console.log(res.barCode)
                if (res.barCode != undefined) {
                  if (res.codeType == 'C') {
                    my.navigateTo({
                      url: '../jiudianchaxun/jiudianchaxun?pay_action=' + that.data.pay_action + "&store_id=" + store_id + "&out_trade_no=" + new_out_trade_no + "&auth_code=" + res.barCode + "&total_amount=" + jine.toString() + "&codeType=" + res.codeType,
                    })
                  } else {
                    var token = my.getStorageSync({ key: 'token' }).data;
                    my.request({
                      url: that.data.Request + "/api/deposit/micropay",//*******酒店预授权支付接口***********/
                      method: 'POST',
                      data: {
                        token: token,
                        device_type: 'face_f4',
                        pay_action: that.data.pay_action,
                        store_id: store_id,
                        code: res.barCode,
                        total_amount: jine,
                      },
                      dataType: 'json',
                      success: function (res) {
                        console.log(res.data)

                        if (res.data.status == 1) {
                          that.setData({
                            out_trade_no: res.data.data.out_trade_no,
                            total_amount: res.data.data.amount,
                            ways_source_desc: res.data.data.ways_source_desc,
                            result_msg: res.data.message,
                            pay_time: res.data.data.gmt_trans,
                          })
                          if (print == 1) {
                            that.dayina()
                            console.log('1遍')
                          } else {
                            that.dayina()
                            that.dayinaa()
                            console.log('2遍')
                          }
                          my.navigateTo({
                            url: '../success/success?pay_amount=' + res.data.data.amount + "&ways_source_desc=" + res.data.data.ways_source_desc + "&out_trade_no=" + res.data.data.out_trade_no + "&pay_time=" + res.data.data.gmt_trans,
                          })

                        } else {
                          // my.navigateTo({
                          //   url: '../fail/fail?result_msg='+res.data.return_msg+"&pay_amount="+res.data.pay_amount,
                          // })
                        }



                      },
                      fail: function (res) {
                        // my.alert({content: 'fail'});
                        // console.log(payres.data)
                      },
                      complete: function (res) {
                        // my.alert({content: 'complete'});
                        // console.log(payres.data)
                      }
                    });
                  }

                }
              }
            });
          }
        } else if (r.keyCode == 134) {//设置
          my.navigateTo({
            url: '../shezhi/shezhi'
          })
        } else if (r.keyCode == 133) {//取消

        }
      } else if (model == 4) {//固定金额模式 
        var gudingjine = my.getStorageSync({ key: 'gudingjine' }).data;
        console.log(gudingjine)
        if (r.keyCode == 131) {
          if (jine > 0) {
            // 收银台播报支付语音
            // my.ix.voicePlay({
            //   eventId: 'e4',
            //   number: gudingjine,
            //   success: (r) => {
            //     console.log('44444444444444444444444')
            //   }
            // });   
            // that.setData({
            //   out_trade_no:that.data.new_out_trade_no
            // })

            // ******************启动收银台**********************
            my.ix.startApp({
              appName: 'cashier',
              bizNo: new_out_trade_no,
              totalAmount: gudingjine,
              success: (res) => {
                console.log(res.barCode)
                if (res.barCode != undefined) {
                  my.navigateTo({
                    url: '../chaxunjieguo/chaxunjieguo?device_id=' + app.globalData.device_id + "&pay_action=" + app.globalData.pay_action + "&store_id=" + store_id + "&merchant_id=" + app.globalData.merchant_id + "&out_trade_no=" + new_out_trade_no + "&config_id=" + app.globalData.config_id + "&auth_code=" + res.barCode + "&total_amount=" + gudingjine + "&codeType=" + res.codeType + "&canceljudgement=" + true,
                  })
                }
              }
            });
          }

        } else if (r.keyCode == 134) {//设置
          my.navigateTo({
            url: '../shezhi/shezhi'
          })
        } else if (r.keyCode == 133) {//取消

        }
      } else if (model == 5) {//客显模式 
        console.log('客显模式')
        if (r.keyCode == 131) {
          my.setStorageSync({ key: 'kx_status', data: 0 });
          var kxjine = that.data.posmoney
          console.log(kxjine)

          // 判断是否选择会员支付
          var memberchecked = my.getStorageSync({ key: 'memberchecked' }).data;
          console.log(memberchecked)
          if (memberchecked == true) {//选择会员支付
            if (kxjine == "" && jine > 0) {
              console.log('客显金额为空,键盘金额不为空')
              my.navigateTo({
                url: '../payment/payment?jine=' + jine.toString(),
              })
            } else if (kxjine != "" && jine == 0) {
              console.log('客显金额不为空,键盘金额为空')
              my.navigateTo({
                url: '../payment/payment?jine=' + that.data.posmoney + "&bizNo=" + that.data.bizNo + "&posmoney=" + that.data.posmoney,
              })
            } else if (kxjine != "" && jine != 0) {
              if (kxjine == jine) {
                console.log('客显金额等于键盘金额时')
                my.navigateTo({
                  url: '../payment/payment?jine=' + that.data.posmoney + "&bizNo=" + that.data.bizNo + "&posmoney=" + that.data.posmoney,
                })
              } else {
                console.log('客显金额不等于键盘金额时')
                my.ix.speech({
                  text: '收款金额和键盘金额不匹配',
                  success: (r) => {
                  }
                });
              }
            }

            // my.navigateTo({
            //   url: '../payment/payment?jine='+that.data.posmoney+"&bizNo="+that.data.bizNo+"&posmoney="+that.data.posmoney,
            // })
          } else {//不选择会员支付
            // 收银台播报支付语音
            if (kxjine == "" && jine > 0) {
              console.log('客显金额为空,键盘金额不为空')
              // my.ix.voicePlay({
              //   eventId: 'e4',
              //   number: jine.toString(),
              //   success: (r) => {
              //     console.log('555555555555555555555')
              //   }
              // });                       
              // ******************启动收银台**********************
              my.ix.startApp({
                appName: 'cashier',
                bizNo: new_out_trade_no,
                totalAmount: kxjine,
                success: (res) => {
                  console.log(res)
                  if (res.barCode != undefined) {
                    // 扫码----------------------********************                            
                    if (res.codeType == 'C') {
                      my.navigateTo({
                        url: '../chaxunjieguo/chaxunjieguo?device_id=' + that.data.device_id + "&pay_action=" + that.data.pay_action + "&store_id=" + store_id + "&merchant_id=" + that.data.merchant_id + "&out_trade_no=" + new_out_trade_no + "&config_id=" + that.data.config_id + "&auth_code=" + res.barCode + "&total_amount=" + jine.toString() + "&codeType=" + res.codeType + "&bizNo=" + that.data.bizNo + "&posmoney=" + that.data.posmoney + "&canceljudgement=" + true,
                      })
                    } else {
                      // 刷脸----------------------********************
                      var data3 = { "device_id": that.data.device_id, "device_type": "face_f4", "pay_method": "alipay_face", "pay_action": that.data.pay_action, "store_id": store_id, "merchant_id": that.data.merchant_id, "merchant_name": that.data.name, "out_trade_no": new_out_trade_no, "config_id": that.data.config_id, "auth_code": res.barCode, "total_amount": jine.toString() }
                      var str3 = app.jsonsortSign(data3)  //键名排序+转换字符串(加密用)  
                      var encryptedStr = md5(str3 + "&key=" + "88888888");//md5加密
                      my.request({
                        url: that.data.Request + "/api/devicepay/all_pay",//*******支付接口***********/
                        method: 'POST',
                        data: {
                          device_id: that.data.device_id,
                          device_type: 'face_f4',
                          pay_method: 'alipay_face',
                          pay_action: that.data.pay_action,
                          store_id: store_id,
                          merchant_name: that.data.name,
                          merchant_id: that.data.merchant_id,
                          out_trade_no: new_out_trade_no,
                          config_id: that.data.config_id,
                          auth_code: res.barCode,
                          total_amount: jine,
                          sign: encryptedStr
                        },
                        dataType: 'json',
                        success: function (payres) {
                          console.log(payres.data)
                          that.setData({
                            out_trade_no: payres.data.out_trade_no,
                            total_amount: payres.data.total_amount,
                            ways_source_desc: payres.data.ways_source_desc,
                            result_msg: payres.data.result_msg,
                            pay_time: payres.data.pay_time,
                            remark: payres.data.remark,
                          })
                          if (payres.data.return_code == "SUCCESS") {//SUCCESS/FALL 此字段是通信标识
                            if (payres.data.result_code == "SUCCESS") {

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

                              if (checked == true) {//判断是否开启打印机
                                // ********--------*********
                                if (print == 1) {
                                  that.dayina()
                                  console.log('1遍')
                                  console.log('刷脸走这边')
                                } else {
                                  that.dayina()
                                  that.dayinaa()
                                  console.log('2遍')
                                }
                              } else {

                              }
                            }
                          } else {
                            my.setStorageSync({ key: 'kx_status', data: 0 });
                            my.ix.tinyCommand({
                              target: "pos",
                              content: {
                                method: "notify",
                                result: "fail", //交易结果 succ -成功 fail-失败 cancel-取消 waiting-正在支付 
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
                          }

                        },
                        fail: function (payres) {

                        },
                        complete: function (payres) {

                        }
                      });
                    }

                  }
                }
              });
            } else if (kxjine != "" && jine == 0) {
              console.log('客显金额不为空,键盘金额为空')
              // my.ix.voicePlay({
              //   eventId: 'e4',
              //   number: kxjine,
              //   success: (r) => {
              //     console.log('6666666666666666666666')
              //   }
              // });                       
              // ******************启动收银台**********************
              my.ix.startApp({
                appName: 'cashier',
                bizNo: new_out_trade_no,
                totalAmount: kxjine,
                success: (res) => {
                  console.log(res)
                  if (res.barCode != undefined) {
                    // 扫码----------------------********************                            
                    if (res.codeType == 'C') {
                      my.navigateTo({
                        url: '../chaxunjieguo/chaxunjieguo?device_id=' + that.data.device_id + "&pay_action=" + that.data.pay_action + "&store_id=" + store_id + "&merchant_id=" + that.data.merchant_id + "&out_trade_no=" + new_out_trade_no + "&config_id=" + that.data.config_id + "&auth_code=" + res.barCode + "&total_amount=" + kxjine.toString() + "&codeType=" + res.codeType + "&bizNo=" + that.data.bizNo + "&posmoney=" + that.data.posmoney + "&canceljudgement=" + true,
                      })
                    } else {
                      // 刷脸----------------------********************
                      var data3 = { "device_id": that.data.device_id, "device_type": "face_f4", "pay_method": "alipay_face", "pay_action": that.data.pay_action, "store_id": store_id, "merchant_id": that.data.merchant_id, "merchant_name": that.data.name, "out_trade_no": new_out_trade_no, "config_id": that.data.config_id, "auth_code": res.barCode, "total_amount": kxjine.toString() }
                      var str3 = app.jsonsortSign(data3)  //键名排序+转换字符串(加密用)  
                      var encryptedStr = md5(str3 + "&key=" + "88888888");//md5加密
                      my.request({
                        url: that.data.Request + "/api/devicepay/all_pay",//*******支付接口***********/
                        method: 'POST',
                        data: {
                          device_id: that.data.device_id,
                          device_type: 'face_f4',
                          pay_method: 'alipay_face',
                          pay_action: that.data.pay_action,
                          store_id: store_id,
                          merchant_name: that.data.name,
                          merchant_id: that.data.merchant_id,
                          out_trade_no: new_out_trade_no,
                          config_id: that.data.config_id,
                          auth_code: res.barCode,
                          total_amount: kxjine,
                          sign: encryptedStr
                        },
                        dataType: 'json',
                        success: function (payres) {
                          console.log(payres.data)
                          that.setData({
                            out_trade_no: payres.data.out_trade_no,
                            total_amount: payres.data.total_amount,
                            ways_source_desc: payres.data.ways_source_desc,
                            result_msg: payres.data.result_msg,
                            pay_time: payres.data.pay_time,
                            remark: payres.data.remark,
                          })
                          if (payres.data.return_code == "SUCCESS") {//SUCCESS/FALL 此字段是通信标识
                            if (payres.data.result_code == "SUCCESS") {

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

                              if (checked == true) {//判断是否开启打印机
                                // ********--------*********
                                if (print == 1) {
                                  that.dayina()
                                  console.log('1遍')
                                  console.log('刷脸走这边')
                                } else {
                                  that.dayina()
                                  that.dayinaa()
                                  console.log('2遍')
                                }
                              } else {

                              }
                            }
                          } else {
                            my.setStorageSync({ key: 'kx_status', data: 0 });
                            my.ix.tinyCommand({
                              target: "pos",
                              content: {
                                method: "notify",
                                result: "fail", //交易结果 succ -成功 fail-失败 cancel-取消 waiting-正在支付 
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
                          }

                        },
                        fail: function (payres) {

                        },
                        complete: function (payres) {

                        }
                      });
                    }

                  }
                }
              });
            } else if (kxjine != "" && jine != 0) {
              if (kxjine == jine) {
                console.log('客显金额等于键盘金额时')
                // my.ix.voicePlay({
                //   eventId: 'e4',
                //   number: kxjine,
                //   success: (r) => {
                //     console.log('11111111111111111111111111')
                //   }
                // });                       
                // ******************启动收银台**********************
                my.ix.startApp({
                  appName: 'cashier',
                  bizNo: new_out_trade_no,
                  totalAmount: kxjine,
                  success: (res) => {
                    console.log(res)
                    if (res.barCode != undefined) {
                      // 扫码----------------------********************                            
                      if (res.codeType == 'C') {
                        my.navigateTo({
                          url: '../chaxunjieguo/chaxunjieguo?device_id=' + that.data.device_id + "&pay_action=" + that.data.pay_action + "&store_id=" + store_id + "&merchant_id=" + that.data.merchant_id + "&out_trade_no=" + new_out_trade_no + "&config_id=" + that.data.config_id + "&auth_code=" + res.barCode + "&total_amount=" + kxjine.toString() + "&codeType=" + res.codeType + "&bizNo=" + that.data.bizNo + "&posmoney=" + that.data.posmoney + "&canceljudgement=" + true,
                        })
                      } else {
                        // 刷脸----------------------********************
                        var data3 = { "device_id": that.data.device_id, "device_type": "face_f4", "pay_method": "alipay_face", "pay_action": that.data.pay_action, "store_id": store_id, "merchant_id": that.data.merchant_id, "merchant_name": that.data.name, "out_trade_no": new_out_trade_no, "config_id": that.data.config_id, "auth_code": res.barCode, "total_amount": kxjine.toString() }
                        var str3 = app.jsonsortSign(data3)  //键名排序+转换字符串(加密用)  
                        var encryptedStr = md5(str3 + "&key=" + "88888888");//md5加密
                        my.request({
                          url: that.data.Request + "/api/devicepay/all_pay",//*******支付接口***********/
                          method: 'POST',
                          data: {
                            device_id: that.data.device_id,
                            device_type: 'face_f4',
                            pay_method: 'alipay_face',
                            pay_action: that.data.pay_action,
                            store_id: store_id,
                            merchant_name: that.data.name,
                            merchant_id: that.data.merchant_id,
                            out_trade_no: new_out_trade_no,
                            config_id: that.data.config_id,
                            auth_code: res.barCode,
                            total_amount: kxjine,
                            sign: encryptedStr
                          },
                          dataType: 'json',
                          success: function (payres) {
                            console.log(payres.data)
                            that.setData({
                              out_trade_no: payres.data.out_trade_no,
                              total_amount: payres.data.total_amount,
                              ways_source_desc: payres.data.ways_source_desc,
                              result_msg: payres.data.result_msg,
                              pay_time: payres.data.pay_time,
                              remark: payres.data.remark,
                            })
                            if (payres.data.return_code == "SUCCESS") {//SUCCESS/FALL 此字段是通信标识
                              if (payres.data.result_code == "SUCCESS") {

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

                                if (checked == true) {//判断是否开启打印机
                                  // ********--------*********
                                  if (print == 1) {
                                    that.dayina()
                                    console.log('1遍')
                                    console.log('刷脸走这边')
                                  } else {
                                    that.dayina()
                                    that.dayinaa()
                                    console.log('2遍')
                                  }
                                } else {

                                }
                              }
                            } else {
                              my.setStorageSync({ key: 'kx_status', data: 0 });
                              my.ix.tinyCommand({
                                target: "pos",
                                content: {
                                  method: "notify",
                                  result: "fail", //交易结果 succ -成功 fail-失败 cancel-取消 waiting-正在支付 
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
                            }

                          },
                          fail: function (payres) {

                          },
                          complete: function (payres) {

                          }
                        });
                      }

                    }
                  }
                });
              } else {
                console.log('客显金额不等于键盘金额时')
                my.ix.speech({
                  text: '收款金额和键盘金额不匹配',
                  success: (r) => {
                  }
                });
              }
            }

          }
        } else if (r.keyCode == 134) {//设置
          my.navigateTo({
            url: '../shezhi/shezhi'
          })
        } else if (r.keyCode == 133) {//取消
          // 关闭客显提示的金额弹窗********-------******-------******
          that.setData({
            poshshow: 0,
            posmoney: '',
          })
        } else if (r.keyCode == 132) {//刷脸

        } else {

        }
      }

    } else {
      console.log('非登录页过来的')
      my.alert({
        title: '提示',
        content: '前往登录页登录',
        buttonText: '我知道了',
        success: () => {
          my.reLaunch({
            // url: '../denglu/denglu'
            url: '../signin/signin'
          })
        }
      });
    }

  },

  //   封装的商业流水号
  text() {
    var date = new Date();
    var year = date.getFullYear();
    var mon = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getMinutes();
    var min = date.getSeconds();
    var arr = [];
    for (var i = 0; i < 6; i++) {
      var num = parseInt(Math.random() * 9);
      arr.push(num);
    }
    var new_out_trade_no = year + "" + mon + "" + day + "" + hour + "" + min + "" + arr.join("");
    return new_out_trade_no
  },

  cashFunction() {
    my.ix.startCodeScan({ scanType: "ALL" });//容器10.1.60.1-7可不调用
    my.ix.onCodeScan((r) => {
      if (r.success) {//获取付款码          
        my.ix.voicePlay({
          eventId: 'di',
        });
        console.log(r.code)
        var qr_code_end = my.getStorageSync({ key: 'qr_code_end' }).data;
        var store_id = my.getStorageSync({ key: 'store_id' }).data;
        // var store_id = my.getStorageSync({ key: 'store_id' }).data;
        // var device_id = my.getStorageSync({ key: 'device_id' }).data;
        // var Request = my.getStorageSync({ key: 'Request' }).data;
        // var interval = my.getStorageSync({ key: 'interval' }).data;
        // var sellerId = my.getStorageSync({ key: 'sellerId' }).data;
        // var pay_action = my.getStorageSync({ key: 'pay_action' }).data;
        // var config_id = my.getStorageSync({ key: 'config_id' }).data;
        // var merchant_name = my.getStorageSync({ key: 'name' }).data;
        console.log(qr_code_end)
        if (qr_code_end == '' && qr_code_end != undefined) {
          my.ix.writeHID({//写入
            protocol: 'barcode',
            value: r.code,
            success: (r) => {
              console.log(r)
              const now = Date.now();
              setTimeout(() => {
                Date.now() - now
                my.navigateTo({
                  url: '../sychaxunjieguo/sychaxunjieguo?barCode=' + r.value + "&store_id=" + store_id + "&device_id=" + this.data.device_id + "&pay_action=" + this.data.pay_action + "&canceljudgement=" + true,
                })
              }, 2000);
              //  console.log('../sysuccess/sysuccess?barCode=' + r.value)
              my.showToast('success: ' + JSON.stringify(r));
            },
            fail: (r) => {
              console.log(r)
              my.ix.voicePlay({
                eventId: 'wxfkm',
              });

            }
          })

        } else {
          var qr_code_end = r.code + qr_code_end
          my.ix.writeHID({
            protocol: 'barcode',
            value: qr_code_end,
            success: (r) => {
              console.log(r)
              my.showToast('success: ' + JSON.stringify(r));
            },
            fail: (r) => {
              console.log(r)
              my.showToast('fail: ' + JSON.stringify(r));
            }
          })

        }
        my.ix.offCodeScan()//关闭扫码
        this.cashFunction()
        console.log('再次走函数')
      }

    });
    // my.ix.startCodeScan({scanType: "ALL"});//容器10.1.60.1-7可不调用
  },
  // ***********关闭键盘事件监听********************    
  onHide() {
    my.ix.offKeyEventChange(); // 关闭按键事件监听
  },

  // 页面加载完成
  onReady() {
    // 是否隐藏回到主页
    if (my.canIUse('hideBackHome')) {
      my.hideBackHome();
    }
  },
  onUnload() {
    // 页面被关闭
  },

  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },

  changeIndicatorDots(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots,
    });
  },
  changeVertical() {
    this.setData({
      vertical: !this.data.vertical,
    });
  },
  changeCircular(e) {
    this.setData({
      circular: !this.data.circular,
    });
  },
  changeAutoplay(e) {
    this.setData({
      autoplay: !this.data.autoplay,
    });
  },
  intervalChange(e) {
    this.setData({
      interval: e.detail.value,
    });
  },

  /** 打印 */
  dayina() {
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
            { 'cmd': 'addText', 'args': ['支付方式:' + this.data.ways_source_desc] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付状态:' + this.data.result_msg] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['订单号:' + this.data.out_trade_no] },

            // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            // { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            // { 'cmd': 'addText', 'args': ['支付时间:' + this.data.pay_time] },
            // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行                    
            // { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            // { 'cmd': 'addText', 'args': ['用户备注:' + this.data.remark] },
            // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            // { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            // { 'cmd': 'addText', 'args': ['-------------------------------------'] },
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
            { 'cmd': 'addText', 'args': ['支付方式:' + this.data.ways_source_desc] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付状态:' + this.data.result_msg] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['订单号:' + this.data.out_trade_no] },

            // { 'cmd': 'addText', 'args': ['-------------------------------------'] },
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
      console.log("received data:" + r);
      // 查询连接的打印机的 API
      my.ix.queryPrinter({
        success: (r) => {
          console.log(r)
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
            { 'cmd': 'addText', 'args': ['支付方式:' + this.data.ways_source_desc] },
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

  /** 打印 */
  dayinaa() {
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
            { 'cmd': 'addText', 'args': ['支付方式:' + this.data.ways_source_desc] },
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
            { 'cmd': 'addText', 'args': ['支付方式:' + this.data.ways_source_desc] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付状态:' + this.data.result_msg] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['订单号:' + this.data.out_trade_no] },

            // { 'cmd': 'addText', 'args': ['-------------------------------------'] },
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
      console.log("received data:" + r);
      // 查询连接的打印机的 API
      my.ix.queryPrinter({
        success: (r) => {
          console.log(r)
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
            { 'cmd': 'addText', 'args': ['支付方式:' + this.data.ways_source_desc] },
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

  /** 刷脸 唤起收银台所需点击事件 */
  faceTap() {

    var qr_code_end = my.getStorageSync({ key: 'qr_code_end' }).data;
    // var store_id = my.getStorageSync({ key: 'store_id' }).data;
    var device_id = my.getStorageSync({ key: 'device_id' }).data;
    var Request = my.getStorageSync({ key: 'Request' }).data;
    var interval = my.getStorageSync({ key: 'interval' }).data;
    var sellerId = my.getStorageSync({ key: 'sellerId' }).data;
    var pay_action = my.getStorageSync({ key: 'pay_action' }).data;
    var store_id = my.getStorageSync({ key: 'store_id' }).data;
    var config_id = my.getStorageSync({ key: 'config_id' }).data;
    var merchant_name = my.getStorageSync({ key: 'name' }).data;


    // *******************************随机数***********
    var data = new Date()
    var year = data.getFullYear();
    var mon = data.getMonth() + 1;
    var day = data.getDate();
    var h = data.getHours()
    var m = data.getMinutes()
    var s = data.getSeconds()

    var new_out_trade_no
    function test() {
      // 0-9的随机数
      var arr = [];//容器
      for (var i = 0; i < 6; i++) {//循环六次
        var num = Math.random() * 9;//Math.random();每次生成(0-1)之间的数;
        num = parseInt(num, 10);
        arr.push(num);
      }
      new_out_trade_no = year + '' + mon + '' + day + '' + h + '' + m + '' + s + '' + arr.join('')
      return new_out_trade_no;
    };
    test()
    // *******************************随机数***********
    console.log(new_out_trade_no)

    my.ix.startApp({
      appName: 'cashier',
      bizNo: new_out_trade_no,
      // totalAmount: '',
      success: (res) => {
        console.log(res)
        console.log(res.barCode)

        if (res.codeType == 'C') {
          var qr_code_end = my.getStorageSync({ key: 'qr_code_end' }).data;
          console.log(res.barCode + qr_code_end)
          if (qr_code_end == '') {
            var store_id = my.getStorageSync({ key: 'store_id' }).data;
            my.ix.writeHID({
              protocol: 'barcode',
              value: res.barCode,
              success: (r) => {
                console.log(r)
                const now = Date.now();
                setTimeout(() => {
                  Date.now() - now
                  my.navigateTo({
                    url: '../sychaxunjieguo/sychaxunjieguo?barCode=' + r.value + "&store_id=" + store_id + "&device_id=" + this.data.device_id + "&pay_action=" + this.data.pay_action + "&canceljudgement=" + true,
                  })
                }, 2000);

                my.showToast('success: ' + JSON.stringify(r));
              },
              fail: (r) => {
                console.log(r)
                my.showToast('fail: ' + JSON.stringify(r));
              }
            })


          } else {
            var qr_code_end = res.barCode + qr_code_end
            var store_id = my.getStorageSync({ key: 'store_id' }).data;
            my.ix.writeHID({
              protocol: 'barcode',
              value: qr_code_end,
              success: (r) => {
                console.log(r)
                const now = Date.now();
                setTimeout(() => {
                  Date.now() - now
                  my.navigateTo({
                    url: '../sychaxunjieguo/sychaxunjieguo?barCode=' + r.value + "&store_id=" + store_id + "&device_id=" + this.data.device_id + "&pay_action=" + this.data.pay_action + "&canceljudgement=" + true,
                  })
                }, 2000);
                my.showToast('success: ' + JSON.stringify(r));
              },
              fail: (r) => {
                console.log(r)
                my.showToast('fail: ' + JSON.stringify(r));
              }
            })
          }

        } else {
          var face_code_end = my.getStorageSync({ key: 'face_code_end' }).data;
          var store_id = my.getStorageSync({ key: 'store_id' }).data;
          console.log(res.barCode + face_code_end)
          if (face_code_end == '') {
            my.ix.writeHID({
              protocol: 'barcode',
              value: res.barCode,
              success: (r) => {
                console.log(r)
                const now = Date.now();
                setTimeout(() => {
                  Date.now() - now
                  my.navigateTo({
                    url: '../sychaxunjieguo/sychaxunjieguo?barCode=' + r.value + "&store_id=" + store_id + "&device_id=" + this.data.device_id + "&pay_action=" + this.data.pay_action + "&canceljudgement=" + true,
                  })
                }, 2000);
                my.showToast('success: ' + JSON.stringify(r));
              },
              fail: (r) => {
                console.log(r)
                my.showToast('fail: ' + JSON.stringify(r));
              }
            })
          } else {
            var face_code_end = res.barCode + face_code_end
            my.ix.writeHID({
              protocol: 'barcode',
              value: face_code_end,
              success: (r) => {
                console.log(r)
                my.showToast('success: ' + JSON.stringify(r));
              },
              fail: (r) => {
                console.log(r)
                my.showToast('fail: ' + JSON.stringify(r));
              }
            })
          }

        }
      }
    });


  },

  /** 客显刷脸 */
  kxfaceTap() {
    my.setStorageSync({ key: 'kx_status', data: 0 });
    // *******************************随机数***********
    var data = new Date()
    var year = data.getFullYear();
    var mon = data.getMonth() + 1;
    var day = data.getDate();
    var h = data.getHours()
    var m = data.getMinutes()
    var s = data.getSeconds()

    var new_out_trade_no
    function test() {
      // 0-9的随机数
      var arr = [];//容器
      for (var i = 0; i < 6; i++) {//循环六次
        var num = Math.random() * 9;//Math.random();每次生成(0-1)之间的数;
        num = parseInt(num, 10);
        arr.push(num);
      }
      new_out_trade_no = year + '' + mon + '' + day + '' + h + '' + m + '' + s + '' + arr.join('')
      return new_out_trade_no;
    };
    test()
    // *******************************随机数***********
    console.log(new_out_trade_no)

    var that = this
    if (that.data.canclick) {
      that.setData({
        canclick: false
      });
      setTimeout(() => {
        var kxjine = that.data.posmoney
        // ******************启动收银台**********************
        // 判断是否选择会员支付
        var memberchecked = my.getStorageSync({ key: 'memberchecked' }).data;
        console.log(memberchecked)
        if (memberchecked == true) {//选择会员支付
          my.navigateTo({
            url: '../payment/payment?jine=' + that.data.posmoney + "&bizNo=" + that.data.bizNo + "&posmoney=" + that.data.posmoney,
          })
          that.setData({
            canclick: true
          });
        } else {//不选择会员支付
          // 收银台播报支付语音
          my.ix.voicePlay({
            eventId: 'e4',
            number: kxjine,
            success: (r) => {
              console.log('8888888888888888888888888888888')
            }
          });

          // ******************启动收银台**********************
          my.ix.startApp({
            appName: 'cashier',
            bizNo: new_out_trade_no,
            totalAmount: kxjine,
            success: (res) => {
              console.log(res)

              if (res.barCode != undefined) {
                // 扫码----------------------********************                            
                if (res.codeType == 'C') {

                  my.navigateTo({
                    url: '../chaxunjieguo/chaxunjieguo?device_id=' + that.data.device_id + "&pay_action=" + that.data.pay_action + "&store_id=" + that.data.store_id + "&merchant_id=" + that.data.merchant_id + "&out_trade_no=" + new_out_trade_no + "&config_id=" + that.data.config_id + "&auth_code=" + res.barCode + "&total_amount=" + kxjine.toString() + "&codeType=" + res.codeType + "&bizNo=" + that.data.bizNo + "&posmoney=" + that.data.posmoney + "&canceljudgement=" + true,
                  })


                } else {
                  // 刷脸----------------------********************
                  var data3 = { "device_id": that.data.device_id, "device_type": "face_f4", "pay_method": "alipay_face", "pay_action": that.data.pay_action, "store_id": that.data.store_id, "merchant_id": that.data.merchant_id, "out_trade_no": new_out_trade_no, "config_id": that.data.config_id, "auth_code": res.barCode, "total_amount": kxjine.toString() }
                  var str3 = app.jsonsortSign(data3)  //键名排序+转换字符串(加密用)  
                  var encryptedStr = md5(str3 + "&key=" + "88888888");//md5加密

                  my.request({
                    url: that.data.Request + "/api/devicepay/all_pay",//*******支付接口***********/
                    method: 'POST',
                    data: {
                      device_id: that.data.device_id,
                      device_type: 'face_f4',
                      pay_method: 'alipay_face',
                      pay_action: that.data.pay_action,
                      store_id: that.data.store_id,
                      merchant_id: that.data.merchant_id,
                      out_trade_no: new_out_trade_no,
                      config_id: that.data.config_id,
                      auth_code: res.barCode,
                      total_amount: kxjine,
                      sign: encryptedStr
                    },
                    dataType: 'json',
                    success: function (payres) {
                      console.log(payres.data)
                      that.setData({
                        out_trade_no: payres.data.out_trade_no,
                        total_amount: payres.data.total_amount,
                        ways_source_desc: payres.data.ways_source_desc,
                        result_msg: payres.data.result_msg,
                        pay_time: payres.data.pay_time,
                        remark: payres.data.remark,
                      })
                      if (payres.data.return_code == "SUCCESS") {//SUCCESS/FALL 此字段是通信标识
                        if (payres.data.result_code == "SUCCESS") {
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



                          if (checked == true) {//判断是否开启打印机
                            // ********--------*********
                            if (print == 1) {
                              that.dayina()
                              console.log('1遍')
                              console.log('刷脸走这边')
                            } else {
                              that.dayina()
                              that.dayinaa()
                              console.log('2遍')
                            }
                          } else {

                          }

                        }
                      }

                    },
                    fail: function (payres) {

                    },
                    complete: function (payres) {

                    }
                  });
                }

              }
            }
          });

          that.setData({
            canclick: true
          });
        }
        // 关闭客显提示的金额弹窗
        // that.setData({
        //   poshshow:0,
        //   posmoney:'0.00',
        // })

      }, 500)
    }
  },

});
