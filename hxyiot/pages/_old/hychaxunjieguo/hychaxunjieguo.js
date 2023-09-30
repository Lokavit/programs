var app = getApp();
Page({
  data: {

  },

  onLoad(query) {

    // 页面加载
    // **********排序函数******
    // console.log(query)
    this.setData({
      store_id: query.store_id,
      merchant_id: query.merchant_id,
      device_id: query.device_id,
      out_trade_no: query.out_trade_no,
      code: query.auth_code,
      cz: query.cz,
      cz_s: query.cz_s,
      mb_id: query.mb_id,
      buyerId: query.buyerId,
      paymoney: query.paymoney,
      codeType: query.codeType,
      mb_phone: query.mb_phone,
      mb_name: query.mb_name,
    })


  },


  onShow() {

    var token = my.getStorageSync({ key: 'token' }).data;
    var Request = my.getStorageSync({ key: 'Request' }).data;
    var store_name = my.getStorageSync({ key: 'store_name' }).data;
    var name = my.getStorageSync({ key: 'name' }).data;
    var checked = my.getStorageSync({ key: 'checked' }).data;
    var print = my.getStorageSync({ key: 'print' }).data;

    var bizNo = my.getStorageSync({ key: 'bizNo' }).data;
    var posmoney = my.getStorageSync({ key: 'posmoney' }).data;
    this.setData({
      Request,
      store_name: store_name,
      name: name,
      token,
      bizNo,
      posmoney,
    })

    var that = this

    //-------------**---------
    my.request({
      url: that.data.Request + "/api/member/cz_b",//*******会员卡充值接口************/
      method: 'POST',
      data: {
        token: that.data.token,
        store_id: that.data.store_id,  //门店ID         
        merchant_id: that.data.merchant_id,//收银员ID
        device_id: that.data.device_id, //设备ID
        device_type: 'face_f4',  //设备类型     
        cz: that.data.cz,//充值金额
        cz_s: that.data.cz_s, //赠送金额
        mb_id: that.data.mb_id,//会员卡ID
        code: that.data.code, //支付授权码
        ali_user_id: that.data.buyerId   //支付宝用户ID    
      },
      dataType: 'json',
      success: function (payres) {
        console.log(payres.data)

        if (payres.data.status == 1) {//SUCCESS/FALL 此字段是通信标识

          console.log(payres.data.data.out_trade_no)
          that.setData({
            out_trade_no: payres.data.data.out_trade_no,
            total_amount: payres.data.data.total_amount,
            ways_source_desc: payres.data.data.ways_source_desc,
            result_msg: payres.data.message,
            pay_time: payres.data.data.pay_time,
            remark: payres.data.data.remark,
          })

          if (payres.data.pay_status == "1") {
            if (checked == true) {//判断是否开启打印机
              // ********--------*********
              if (print == 1) {
                that.dayina()
                console.log('1遍')
              } else {
                that.dayina()
                that.dayinaa()
                console.log('2遍')
              }
            } else {

            }




            status1() //清除定时器
            console.log(payres.data.data.mb_money)
            console.log(that.data.paymoney)
            if (that.data.codeType == 'C') {
              // my.setStorageSync({key: 'mb_money',data: payres.data.data.mb_money});

              my.redirectTo({
                url: '/pages/rechargeseccess/rechargeseccess?out_trade_no=' + payres.data.data.out_trade_no + "&pay_amount=" + payres.data.data.total_amount + "&ways_source=" + payres.data.data.ways_source + "&pay_time=" + payres.data.data.pay_time + '&buyerId=' + that.data.buyerId + '&mb_id=' + that.data.mb_id + '&mb_money=' + payres.data.data.mb_money

              });

            } else if (that.data.codeType == 'F') {
              my.redirectTo({
                url: '../index/index',
              })
            }

          } else if (payres.data.pay_status == "3") {
            that.setData({
              result_msg: payres.data.message,
              pay_amount: payres.data.pay_amount,
            })
            status3() //清楚定时器,跳转失败页面
          } else if (payres.data.pay_status == "2") {
            that.setData({
              result_msg: payres.data.message
            })
            status2()
          }

          //执行逻辑代码  轮询订单查询
          function timer() {
            console.log(that.data.token)
            console.log(that.data.store_id)
            console.log(that.data.out_trade_no)
            my.request({
              url: that.data.Request + "/api/member/order_foreach",//************轮询订单查询*****************
              method: 'POST',
              data: {
                token: that.data.token,
                store_id: that.data.store_id,
                out_trade_no: that.data.out_trade_no,
              },
              dataType: 'json',
              success: function (reslx) {
                console.log(reslx.data)
                // my.alert({content: reslx.data});
                that.setData({
                  out_trade_no: reslx.data.data.out_trade_no,
                  total_amount: reslx.data.data.total_amount,
                  ways_source_desc: reslx.data.data.ways_source_desc,
                  result_msg: reslx.data.message,
                  pay_time: reslx.data.data.pay_time,
                  remark: reslx.data.data.remark,
                })
                if (reslx.data.status == 1) {  //返回的状态成功 
                  if (reslx.data.pay_status == "1") {             //支付成功=====跳转会员卡充值成功页
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
                    status1() //清除定时器
                    console.log(reslx.data.data.mb_money)
                    my.redirectTo({
                      url: '/pages/rechargeseccess/rechargeseccess?out_trade_no=' + reslx.data.data.out_trade_no + "&pay_amount=" + reslx.data.data.total_amount + "&ways_source=" + reslx.data.data.ways_source + "&pay_time=" + reslx.data.data.pay_time + '&buyerId=' + that.data.buyerId + '&mb_id=' + that.data.mb_id + '&mb_money=' + reslx.data.data.mb_money

                    });
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


                  } else if (reslx.data.pay_status == "3") { //支付失败=====跳转失败页
                    that.setData({
                      result_msg: reslx.data.message,
                      pay_amount: reslx.data.pay_amount,
                    })
                    status3()  //清除定时器跳转失败页面
                    my.redirectTo({
                      url: '../fail/fail?result_msg=' + reslx.data.message,
                    })
                  } else if (reslx.data.pay_status == "2") { //等待支付(3s轮询一次  >20请求订单支付取消接口  否则轮询订单查询 )
                    that.setData({
                      result_msg: reslx.data.message
                    })
                    status2()   //3s轮询一次  >20请求订单支付取消接口  否则轮询订单查询 
                  }
                } else { //返回状态失败
                  my.redirectTo({
                    url: '../fail/fail?result_msg=' + reslx.data.message + "&pay_amount=" + reslx.data.total_amount,
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
                      url: '../fail/fail?result_msg=' + Cancelres.data.message
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
              url: '../fail/fail?result_msg=' + that.data.message + "&pay_amount=" + that.data.total_amount,
            })
          }

          my.ix.onKeyEventChange((r) => {
            console.log(JSON.stringify(r))//键盘事件返回
            console.log(payres.data.out_trade_no)//******************************* */
            if (r.keyCode == 133) {
              if (that.data.canceljudgement == 'true') {
                my.request({
                  url: that.data.Request + "/api/devicepay/order_pay_cancel",//************一分钟后请求的接口*****************
                  method: 'POST',
                  data: {
                    store_id: that.data.store_id,
                    config_id: that.data.config_id,
                    out_trade_no: payres.data.out_trade_no,
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
                        url: '../fail/fail?result_msg=' + Cancelres.data.message,
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
            url: '../fail/fail?result_msg=' + payres.data.message + "&pay_amount=" + payres.data.pay_amount,
          })
        }

      },
      fail: function (payres) {
        // my.alert({content: 'fail'});
        // console.log(payres.data)
      },
      complete: function (payres) {
        // my.alert({content: 'complete'});
        // console.log(payres.data)
      }
    });

  },

  // ***********关闭键盘事件监听********************    
  onHide() {
    my.ix.offKeyEventChange();
  },
  onUnLoad() {
    my.ix.offKeyEventChange();
  },

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