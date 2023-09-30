var app = getApp();
Page({
  data: {
    //   img:"/img/lijichongzhi-anniu.png",

    cz: 0, //充值金额
    data: [{
      cz: "0.01",
      cz_s: "1"
    }, {
      cz: "0.01",
      cz_s: "10"
    }, {
      cz: "0.01",
      cz_s: "100"
    }],
    blue: ''
  },
  onLoad(query) {
    var that = this;
    var Request = my.getStorageSync({ key: 'Request' }).data;
    var token = my.getStorageSync({ key: 'token' }).data;
    var device_id = my.getStorageSync({ key: 'device_id' }).data;
    var store_id = my.getStorageSync({ key: 'store_id' }).data;
    var checked = my.getStorageSync({ key: 'checked' }).data;
    var print = my.getStorageSync({ key: 'print' }).data;
    var pay_action = my.getStorageSync({ key: 'pay_action' }).data;

    var merchant_id = my.getStorageSync({ key: 'login_merchant_id' }).data;
    var config_id = my.getStorageSync({ key: 'config_id' }).data;
    var store_name = my.getStorageSync({ key: 'store_name' }).data;
    var name = my.getStorageSync({ key: 'name' }).data;

    var bizNo = my.getStorageSync({ key: 'bizNo' }).data;
    var posmoney = my.getStorageSync({ key: 'posmoney' }).data;
    that.setData({
      Request,
      token,
      mb_name: query.mb_name,
      mb_phone: query.mb_phone,
      paymoney: query.paymoney,
      buyerId: query.buyerId,
      pay_action,
      mb_id: query.mb_id,
      balance: query.balance,
      device_id,
      store_id,
      config_id,
      checked,
      print,
      merchant_id,
      store_name,
      name,
      bizNo,
      posmoney,
    })

    my.request({
      url: that.data.Request + "/api/member/cz_query",  //====充值活动接口=====
      method: "POST",
      data: {
        store_id: that.data.store_id
      },
      dataType: "json",
      success: res => {
        console.log(res.data);
        if (res.data.status == 1) {
          var cz_list = JSON.parse(res.data.data.cz_list);
          console.log(cz_list)
          that.setData({ cz_list });
        }
      },
      fail: res => { console.log(res) },
      complete: res => { console.log(res) }
    })

  },
  onShow() {

  },
  // 选择充值金额
  selemoney(e) {
    var cz = e.target.dataset.cz;
    var cz_s = e.target.dataset.cz_s;
    console.log(cz, cz_s);
    this.setData({
      cz,
      cz_s,
      blue: 'blue',
    })
  },
  // 立即充值
  chongzhi() {
    var that = this;
    if (that.data.blue == 'blue') {

      var checked = my.getStorageSync({ key: 'checked' }).data;
      var print = my.getStorageSync({ key: 'print' }).data;
      console.log("会员卡充值");
      var new_out_trade_no = that.text();

      console.log(that.data.cz);
      console.log(that.data.cz_s);

      my.ix.startApp({
        appName: 'cashier',
        bizNo: new_out_trade_no,
        totalAmount: that.data.cz,//用户实付金额
        success: res => {
          console.log(res);
          if (res.codeType == 'C') {
            my.redirectTo({
              url: '/pages/hychaxunjieguo/hychaxunjieguo?store_id=' + that.data.store_id + "&merchant_id=" + that.data.merchant_id + "&device_id=" + that.data.device_id + "&cz=" + that.data.cz + "&cz_s=" + that.data.cz_s + "&mb_id=" + that.data.mb_id + "&auth_code=" + res.barCode + "&buyerId=" + that.data.buyerId + "&paymoney=" + that.data.paymoney + "&codeType=" + res.codeType + "&mb_name=" + that.data.mb_name + "&mb_phone=" + that.data.mb_phone + "&canceljudgement=" + true,
            })

          } else {
            if (res.barCode != undefined) {//刷脸/扫码成功后返回付款码
              console.log(that.data.cz);
              console.log(that.data.cz_s);
              my.request({
                url: that.data.Request + "/api/member/cz_b",//*******会员卡充值接口***********/
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
                  code: res.barCode, //支付授权码
                  ali_user_id: that.data.buyerId   //支付宝用户ID    
                },
                dataType: 'json',
                success: res => {
                  console.log(res.data);
                  console.log(res.data.data.mb_id)
                  if (res.data.pay_status == '1' && res.data.status == 1) {

                    console.log(typeof (that.data.paymoney))
                    console.log(res.data.data.mb_money)

                    that.setData({
                      out_trade_no: res.data.data.out_trade_no,
                      total_amount: res.data.data.total_amount,
                      ways_source_desc: res.data.data.ways_source_desc,
                      result_msg: res.data.message,
                      pay_time: res.data.data.pay_time,
                      remark: res.data.data.remark,
                    })
                    if (checked == true) {//判断是否开启打印机
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



                    //  that.setData({balance:res.data.data.mb_money})
                    console.log(Number(res.data.data.mb_money) >= Number(that.data.paymoney))
                    console.log(Number(res.data.data.mb_money), Number(that.data.paymoney))
                    if (Number(res.data.data.mb_money) >= Number(that.data.paymoney)) {
                      console.log('我走了这里啊')
                      my.request({
                        url: that.data.Request + "/api/member/member_pay_submit",//*******会员卡支付接口***********
                        method: 'POST',
                        data: {
                          token: that.data.token,
                          store_id: that.data.store_id,  //门店ID         
                          merchant_id: that.data.merchant_id,//收银员ID
                          device_id: that.data.device_id, //设备ID
                          device_type: 'face_f4',  //设备类型     
                          total_amount: that.data.paymoney,  //订单金额
                          pay_amount: that.data.paymoney,//支付金额
                          open_id: that.data.buyerId, //支付宝/微信用户id
                          mb_id: that.data.mb_id,    //会员ID             
                        },
                        dataType: 'json',
                        success: r => {
                          console.log(r.data)
                          // 会员卡支付成功                                        
                          my.ix.onCashierEventReceive((s) => {
                            console.log(s)
                            if (s.status === "RESULT_CLOSE" || s.bizType === 'RESULT_DF_STATUS') {
                              console.log('收银台关闭')

                              if (r.data.status == 1) {
                                console.log(r.data.message);
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

                                my.redirectTo({
                                  url: '../membersuccess/membersuccess?payMoney=' + r.data.data.pay_amount + '&out_trade_no=' + r.data.data.out_trade_no + '&pay_time=' + r.data.data.pay_time + '&mb_phone=' + r.data.data.mb_phone + "&message=" + r.data.message + '&merchant_id=' + that.data.merchant_id + '&buyerId=' + that.data.buyerId + '&mb_name=' + r.data.data.mb_name
                                })

                                my.ix.offCashierEventReceive();

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
                              } else { // 会员卡支付失败
                                console.log(r.data.message);
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
                            }
                            // else if(r.data.status==1){
                            //   console.log('收银台返回状态不对,然后走这里')
                            //   console.log(r.data.message);  
                            //   if(checked == true){//判断是否开启打印机
                            //     if(print==1){
                            //         that.dayinb()
                            //         console.log('1遍')
                            //     }else{
                            //         that.dayinb()
                            //         that.dayinbb()
                            //         console.log('2遍')
                            //     } 

                            //   }else{

                            //   }   

                            //   my.redirectTo({
                            //       url:'../membersuccess/membersuccess?payMoney='+r.data.data.pay_amount+'&out_trade_no='+r.data.data.out_trade_no+'&pay_time='+r.data.data.pay_time+'&mb_phone='+r.data.data.mb_phone+"&message="+r.data.message+'&merchant_id='+that.data.merchant_id+'&buyerId='+that.data.buyerId+'&mb_name='+r.data.data.mb_name
                            //   })

                            //   my.ix.offCashierEventReceive();

                            //   my.setStorageSync({key: 'kx_status',data: 1});
                            //   my.ix.tinyCommand({
                            //     target:"pos",  
                            //     content: {		
                            //       method: "notify", 
                            //       result: "succ", //交易结果 succ -成功 fail-失败 cancel-取消 waiting-正在支付 
                            //       bizNo: that.data.bizNo,    //包号，必须与支付前最后一条刷新交易金额指令的包号一致
                            //       totalAmount: that.data.posmoney,  //金额，必须与支付前最后一条刷新交易金额指令的金额一致
                            //       channel: "alipay"  //交易通道 ，alipay、wxpay、cloudpay等
                            //     },                          
                            //     success: (r) => {
                            //       console.log(r);

                            //     },
                            //     fail: (r) => {
                            //       console.log("fail, errorCode:" + r.error);
                            //     },
                            //   });
                            // }

                          });


                        },
                        fail: r => {
                        },
                        complete: r => {
                          // console.log(r.data)                                      
                        }
                      });

                    } else {
                      my.redirectTo({
                        url: '/pages/hyyue/hyyue?buyerId=' + that.data.buyerId + '&jine=' + that.data.paymoney + '&mb_phone=' + that.data.mb_phone + '&mb_name=' + that.data.mb_name + '&mb_id=' + res.data.data.mb_id + '&mb_money=' + res.data.data.mb_money + '&merchant_id=' + that.data.merchant_id + '&store_id=' + that.data.store_id + '&config_id=' + that.data.config_id
                      });
                    }
                  }
                },
                fail: res => { },
                complete: res => { }
              });
            }
          }
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
