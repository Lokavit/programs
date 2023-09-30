var app = getApp();
import md5 from '/utils/md5.js';
// import { Page } from '/utils/ix'; // 添加这行
Page({
  data: {

  },

  onLoad(query) {
    let that = this;
    var token = my.getStorageSync({ key: 'token' }).data;
    var Request = my.getStorageSync({ key: 'Request' }).data;
    // 页面加载
    // **********排序函数******
    console.log(query)
    this.setData({
      token: token,
      barCode: query.barCode,
      store_id: query.store_id,
      device_id: query.device_id,
      codeType: query.codeType,
      Request: Request,
    })

    that.getOrderInfo(query);
  },


  getOrderInfo(query) {
    var that = this;
    var token = my.getStorageSync({ key: 'token' }).data;
    var model = my.getStorageSync({ key: 'model' }).data;//判断是什么模式收银
    console.log(token);
    //需要获取barcode 和 store_id
    // 获取当前小程序的页面栈
    // let pages = getCurrentPages();
    // console.log(pages);
    // 数组中索引最大的页面--当前页面
    // let currentPage = pages[pages.length-1];
    // console.log(currentPage);
    // 打印出当前页面中的 options
    let options = query;
    console.log(options);

    let barCode  = options.barCode;
    let store_id = options.store_id;

    console.log(barCode,store_id,app.globalData.HOST + "/api/qwx/get_order_by_authcode");

    my.request({
      url: app.globalData.HOST + "/api/qwx/get_order_by_authcode",
      method: 'POST',
      data: {
        token: token,
        barCode: barCode,
        storeId: store_id,
        faceType:1
      },
      dataType: 'json',
      success: function (res) {
        console.log(res.data)

        if (res.data.status == 1) {//SUCCESS/FALL 此字段是通信标识

          console.log(res.data.data.out_trade_no)
          that.setData({
            paymoney: res.data.data.pay_amount,
            source_desc: res.data.data.pay_status_desc,
            out_trade_no: res.data.data.out_trade_no,
            pay_time: res.data.data.created_at,
            ways_source: res.data.data.ways_source_desc,
          })

          if (res.data.data.pay_status_desc == "支付成功") {

            status1() //清除定时器
            // console.log(res.data.data.mb_money)
            console.log(that.data.paymoney)
            my.navigateTo({
              url: '../sysuccess/sysuccess?paymoney=' + that.data.paymoney + "&source_desc=" + that.data.source_desc + "&out_trade_no=" + that.data.out_trade_no + "&pay_time=" + that.data.pay_time + "&ways_source=" + that.data.ways_source,
            })


          } else if (res.data.data.pay_status_desc == "支付失败") {
            that.setData({
              result_msg: res.data.pay_status_desc,
              pay_amount: res.data.pay_amount,
            })
            status3() //清楚定时器,跳转失败页面
          } else if (res.data.data.pay_status_desc == "等待支付") {
            that.setData({
              result_msg: res.data.pay_status_desc
            })
            status2()
          }

          //执行逻辑代码  轮询订单查询
          function timer() {
            // console.log(that.data.token)
            console.log(that.data.store_id,store_id)
            console.log(that.data.barCode,barCode)
            my.request({
              url: app.globalData.HOST + "/api/qwx/get_order_by_authcode",//************轮询订单查询*****************
              method: 'POST',
              data: {
                token: token,
                barCode: barCode,
                storeId: store_id,
                faceType:1
              },
              dataType: 'json',
              success: function (ress) {
                console.log(ress.data)
                // my.alert({content: ress.data});
                
                if (ress.data.status == 1) {  //返回的状态成功
                  that.setData({
                    paymoney: ress.data.data.pay_amount,
                    source_desc: ress.data.data.pay_status_desc,
                    out_trade_no: ress.data.data.out_trade_no,
                    pay_time: ress.data.data.created_at,
                    ways_source: ress.data.data.ways_source_desc,
                  })
                  if (ress.data.data.pay_status_desc == "支付成功") {             //支付成功

                    status1() //清除定时器
                    // console.log(ress.data.data.mb_money)
                    my.navigateTo({
                      url: '../sysuccess/sysuccess?paymoney=' + that.data.paymoney + "&source_desc=" + that.data.source_desc + "&out_trade_no=" + that.data.out_trade_no + "&pay_time=" + that.data.pay_time + "&ways_source=" + that.data.ways_source,
                    })

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


                  } else if (ress.data.data.pay_status_desc == "支付失败") { //支付失败=====跳转失败页
                    that.setData({
                      result_msg: ress.data.data.pay_status_desc,
                      // pay_amount: ress.data.pay_amount,
                    })
                    status3()  //清除定时器跳转失败页面
                    my.redirectTo({
                      url: '../fail/fail?result_msg=' + '支付失败',
                    })
                  } else if (ress.data.data.pay_status_desc == "等待支付") { //等待支付(3s轮询一次  >20请求订单支付取消接口  否则轮询订单查询 )
                    that.setData({
                      result_msg: ress.data.data.pay_status_desc
                    })
                    status2()   //3s轮询一次  >20请求订单支付取消接口  否则轮询订单查询 
                  }
                } else { //返回状态失败
                  my.redirectTo({
                    url: '../fail/fail?result_msg=' + '支付失败',
                  })
                }

              },
              fail: function (rest) {
                // my.alert({content: 'fail'});
              },
              complete: function (rest) {
                my.hideLoading();
                // my.alert({content: 'complete'});
              }
            });
          }

          //执行逻辑代码
          function status1() {
            //status1的代码复制到这里 
            clearInterval(timering);
          }

          var count = 0
          var timering

          // 3s轮询一次  >20请求订单支付取消接口跳转至失败页  否则轮询订单查询
          function status2() {
            //status2复制到这里                    
            clearInterval(timering);
            timering = setInterval(function () {
              count++
              if (count > 20) {//>20清除定时器              
                my.request({
                  url: that.data.Request + "/api/devicepay/order_pay_cancel",//************一分钟后请求的接口*****************
                  method: 'POST',
                  data: {
                    token: that.data.token,
                    store_id: that.data.store_id,
                    out_trade_no: that.data.out_trade_no,
                  },
                  dataType: 'json',
                  success: function (Cancelres) {
                    console.log(Cancelres.data)
                    clearInterval(timering);
                    my.redirectTo({
                      url: '../fail/fail?result_msg=' + '支付失败'
                    })
                  },
                  fail: function (rest) {
                    // my.alert({content: 'fail'});
                  },
                  complete: function (rest) {
                    my.hideLoading();
                    // my.alert({content: 'complete'});
                  }
                });

              } else {
                timer()
              }
            }, 3000);//3秒轮询一次

            that.setData({
              timering: timering
            })
          }

          function status3() {
            //status3复制到这里
            clearInterval(timering);
            my.redirectTo({
              url: '../fail/fail?result_msg=' + '支付失败',
            })
          }

          my.ix.onKeyEventChange((r) => {
            console.log(JSON.stringify(r))//键盘事件返回
            console.log(res.data.out_trade_no)//******************************* */
            if (r.keyCode == 133) {
              if (that.data.canceljudgement == 'true') {
                my.request({
                  url: that.data.Request + "/api/devicepay/order_pay_cancel",//************一分钟后请求的接口*****************
                  method: 'POST',
                  data: {
                    store_id: that.data.store_id,
                    config_id: that.data.config_id,
                    out_trade_no: res.data.out_trade_no,
                    device_id: that.data.device_id,
                    device_type: "face_f4",
                    pay_action: that.data.pay_action,
                    sign: encryptedStr4
                  },
                  dataType: 'json',
                  success: function (Cancelres) {
                    console.log(Cancelres.data)
                    clearInterval(timering);
                    if (Cancelres.data.return_code == "SUCCESS") {
                      my.navigateBack({
                        delta: 1
                      })
                    } else {
                      my.redirectTo({
                        url: '../fail/fail?result_msg='+ '支付失败',
                      })
                    }

                  },
                  fail: function (rest) {
                    // my.alert({content: 'fail'});
                  },
                  complete: function (rest) {
                    my.hideLoading();
                    // my.alert({content: 'complete'});
                  }
                });
              } else {

              }
            }
          });

        } else {
          my.redirectTo({
            url: '../fail/fail?result_msg='+ '支付失败',
          })
        }

      },
      fail: function (res) {
        // my.alert({content: 'fail'});
        // console.log(res.data)
      },
      complete: function (res) {
        // my.alert({content: 'complete'});
        // console.log(res.data)
      }
    })
  }


});