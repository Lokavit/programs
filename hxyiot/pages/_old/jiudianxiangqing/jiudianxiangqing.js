
var app = getApp()
var RSA = require('../../utils/wx_rsa.js');
Page({
  data: {
    show1: 1,
    show2: 1,
    showAccount: 1,
    showOther: 1,

    totalAmount: '',
    shoukuanma: 1,

    mask: 0,
    error: 0,
    jianpan: [
      { one: 1, src: '../../img/1.png', wAndh: 'one' },
      { one: 2, src: '../../img/2.png', wAndh: '' },
      { one: 3, src: '../../img/3.png', wAndh: '' },
      { one: 4, src: '../../img/4.png', wAndh: '' },
      { one: 5, src: '../../img/5.png', wAndh: '' },
      { one: 6, src: '../../img/6.png', wAndh: '' },
      { one: 7, src: '../../img/7.png', wAndh: '' },
      { one: 8, src: '../../img/8.png', wAndh: '' },
      { one: 9, src: '../../img/9.png', wAndh: '' },
      { one: 'kong', wAndh: '' },
      { one: 0, src: '../../img/0.png', wAndh: 'zero' },
      { one: 'tuige', src: '../../img/tuige.png', wAndh: 'tuige' },

    ],
    codeList1: '',
    codeList2: '',
    codeList3: '',
    codeList4: '',
    codeList5: '',
    codeList6: '',

    codeList11: '',
    codeList22: '',
    codeList33: '',
    codeList44: '',
    codeList55: '',
    codeList66: '',

    yajin:0,
    showquan:0,
    yushou:1,

    yushow:1,
    tuishow:0,
    chehui:0,
    dayinshow:1,
    successshow:1,

    quxiaoyushouquan:'预授权撤销',
    chaojine:0,
    chaojinetip:1,

    timedesc:'预授权时间',
    timedescshow:0,
  },
  onLoad(query){
  
    var token = my.getStorageSync({ key: 'token' }).data;
    var Request = my.getStorageSync({ key: 'Request' }).data;

   
    var that=this
    that.setData({
      token:token,
      Request:Request,
      out_trade_no:query.out_trade_no,
      out_order_no:query.out_order_no,
 
      
    })
    
   
  },
  onShow(){
    var that=this
    my.request({
      url: that.data.Request+"/api/deposit/pay_order_info",
      method: 'POST',
      data: {
        token: that.data.token,
        // out_order_no:that.data.out_order_no,
        out_trade_no:that.data.out_trade_no,
      },
      dataType: 'json',
      success(res){
        console.log(res.data)
        // 隐藏加载框
        my.hideLoading();
        that.setData({
          totalAmount: res.data.data.amount,
          cashMoney:res.data.data.amount,
          item1: res.data.data.ways_source_desc,
          item2: res.data.data.amount,
          item3: res.data.data.pay_amount,
          item4: res.data.data.refund_amount,

          item5: res.data.data.store_name,
          item6: res.data.data.merchant_name,
          item7: res.data.data.deposit_time,
          item8: res.data.data.out_order_no,
          item9: res.data.data.pay_status_desc,
          item10: res.data.data.remark,
          

          pay_status_desc:res.data.data.pay_status_desc,

          store_id: res.data.data.store_id,
          out_order_no: res.data.data.out_order_no,
          out_trade_no: res.data.data.out_trade_no,

          deposit_time:res.data.data.deposit_time,
          pay_status:res.data.data.pay_status,
          deposit_status:res.data.data.deposit_status,
        })
        // 判断时间状态
        if(res.data.data.pay_status==2 && res.data.data.deposit_status==1){//押金冻结成功
          that.setData({
            item11:res.data.data.pay_time,
            timedesc:'预授权时间',
            timedescshow:0,
          })
          
        }else if(res.data.data.pay_status==1 && res.data.data.deposit_status==1){//押金预授权完成
          that.setData({
            item11:res.data.data.pay_time,
            timedesc:'预授权时间',
            timedescshow:1,
          })
        }else if(res.data.data.pay_status==2 && res.data.data.deposit_status==4){//预授权取消
          that.setData({
            item11:res.data.data.deposit_time,
            timedesc:'预授权撤销时间',
            timedescshow:1,
          })
        }else if(res.data.data.pay_status==4 && res.data.data.deposit_status==1){//退款成功**撤销订单
          that.setData({
            item11:res.data.data.refund_time,
            timedesc:'退款时间',
            timedescshow:1,
          })
        }
        


        // *************
        

        if (res.data.data.pay_status == 1) {
          that.setData({
            yajin: 0,
            yushow:0,
            tuishow:1
          })
        } else {
          that.setData({
            yajin: 1,
            yushow:1,
            tuishow: 0
          })
        }
        if (res.data.data.pay_status == 1 && res.data.data.deposit_status == 1) {
          that.setData({
            showquan: 1
          })
        } else if(res.data.data.pay_status == 4){
          that.setData({
            showquan: 1,
            yajin:1,
            yushow:0,
            tuishow:1,
          })
        }else{
          that.setData({
            showquan: 0
          })
        }

        if(res.data.data.deposit_status == 4){
          that.setData({            
            yushow:1,
            chehui:1,
            tuishow:0,
            successshow:1,
            showquan:1,
            quxiaoyushouquan:"已撤销"
          })
        }else{
         
        }
       

      }
    })
  },

  openA() {
    var that = this
    if (this.data.show1 == 0){
      that.setData({
        show1:1,
        showAccount:1,

        show2: 1,
        showOther: 1,
      })
    }else{
      that.setData({
        show1: 0,
        showAccount:0,
        
      })
    }
  },
  openD(){
    var that = this
    if (this.data.show2 == 0) {
      that.setData({
        show2: 1,
        showOther: 1,        
      })
    } else {
      that.setData({
        show2: 0,
        showOther: 0,

        show1: 0,
        showAccount: 0
      })
    }
  },
  // 点击想用键盘事件
  thouch: function (e) {
    var codeList1 = this.data.codeList1
    var codeList2 = this.data.codeList2
    var codeList3 = this.data.codeList3
    var codeList4 = this.data.codeList4
    var codeList5 = this.data.codeList5
    var codeList6 = this.data.codeList6

    var codeList11 = this.data.codeList11
    var codeList22 = this.data.codeList22
    var codeList33 = this.data.codeList33
    var codeList44 = this.data.codeList44
    var codeList55 = this.data.codeList55
    var codeList66 = this.data.codeList66
    var one = e.currentTarget.dataset.one
    console.log(one)
    if (one == 'kong') {

    } else if (one == 'tuige') {
      if (codeList6.length == 1) {
        codeList6 = ''
        this.setData({ codeList6 })
      } else if (codeList5.length == 1) {
        codeList5 = ''
        this.setData({ codeList5 })
      } else if (codeList4.length == 1) {
        codeList4 = ''
        this.setData({ codeList4 })
      } else if (codeList3.length == 1) {
        codeList3 = ''
        this.setData({ codeList3 })
      } else if (codeList2.length == 1) {
        codeList2 = ''
        this.setData({ codeList2 })
      } else {
        codeList1 = ''
        this.setData({ codeList1 })
      }
    } else {
      if (codeList1 == '') {
        this.setData({
          codeList1: '•',
          codeList11: one.toString(),
        })
      } else if (codeList2 == '') {
        this.setData({
          codeList2: '•',
          codeList22: one.toString(),
        })
      } else if (codeList3 == '') {
        this.setData({
          codeList3: '•',
          codeList33: one.toString(),
        })
      } else if (codeList4 == '') {
        this.setData({
          codeList4: '•',
          codeList44: one.toString(),
        })
      } else if (codeList5 == '') {
        this.setData({
          codeList5: '•',
          codeList55: one.toString(),
        })
      } else if (codeList6 == '') {
        this.setData({
          codeList6: '•',
          codeList66: one.toString(),
        })
        // console.log(codeList1, codeList2, codeList3, codeList4,codeList5,one)
        var password = codeList11 + codeList22 + codeList33 + codeList44 + codeList55 + one
        console.log(password)


        //加密开始
        var publickey = '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4COVutRbOUfQNjvVOzwK49NzHIPRwwksnJ6QtdHwGmdUZiT2HZxVwfotcOjA5aY16D/2Ahq3gLH4yu2y42dS0lfeBMqUcm+ bY7aZ54wClm75RI90uc54F8IgMkNz8J / VS9LYI / B4uHVsc + 4KK4Ycr8S8O004ExtvQqu2QCl7Aai/ WC4URIdCyNm8La2axoA1jjj3SzpytLvP6Z / iHSlx37Y9AMR0V94R13v4BFlMQDG+ 2REVJsk6LCyzHQfUvJlnsyKey0n/ v8DLC070lQzLPYV0jsiit2AUkyURRLxEaZm2C0YYhfrGjl + x8n / kDteZbDVcyn7UsEdSicijv9DXkQIDAQAB-----END PUBLIC KEY-----'
        // var phone_rsa = this.data.zhucephone;
        var sign_rsa = 'pay_password=' + password

        var encrypt_rsa = new RSA.RSAKey();
        encrypt_rsa = RSA.KEYUTIL.getKey(publickey);

        var signStr = encrypt_rsa.encrypt(sign_rsa);
        signStr = RSA.hex2b64(signStr);
        console.log(signStr)
        //加密结束

        var that = this
        my.request({
          url: that.data.Request+"/api/merchant/check_pay_password",//校验支付密码是否正确
          data: {
            token: this.data.token,
            sign: signStr
          },
          success: function (res) {
            console.log(res.data)
            
            if (res.data.status == 1) {
              // 预授权取消
              if(that.data.eachjianpan == 0){
                that.setData({
                  mimatip:'预授权取消'
                })
                my.request({
                  url: that.data.Request+"/api/deposit/fund_cancel",
                  data: {
                    token: that.data.token,
                    store_id: that.data.store_id,
                    out_order_no: that.data.out_order_no,
                    out_trade_no: that.data.out_trade_no,
                  },
                  success(res) {
                    console.log(res.data)
                    if (res.data.status == 1) {
                      my.alert({
                        title: '提示',
                        content: res.data.message,
                        buttonText: '我知道了',
                        success: () => {
                          that.setData({
                            mask: 0,         
                            chehui:1,                  
                            quxiaoyushouquan:'已撤销',
                            showquan:1,
                            yajin:1,
                          })
                        }
                      });
                     
                    } else {
                      my.alert({
                        title: '提示',
                        content: res.data.message,
                        buttonText: '我知道了',
                        success: () => {
                          that.setData({
                            mask: 0,
                          })
                        }
                      });
                    }
                  }
                })
              }else{
                // 退款
                that.setData({
                  mimatip: '退款金额'
                })
                console.log(that.data.store_id)
                console.log(that.data.out_order_no)
                console.log(that.data.out_trade_no)
                console.log(that.data.refundvalue)
                my.request({
                  url: that.data.Request+"/api/deposit/refund",//订单退款
                  data: {
                    token: that.data.token,
                    store_id: that.data.store_id,
                    out_order_no: that.data.out_order_no,
                    out_trade_no: that.data.out_trade_no,
                    refund_amount: that.data.refundvalue
                  },
                  success(res) {
                    console.log(res.data)
                    if (res.data.status == 1) {
                      my.alert({
                        title: '提示',
                        content: res.data.message,
                        buttonText: '我知道了',
                        success: () => {
                          that.setData({
                            mask: 0,
                            yajin: 1,  
                            pay_status_desc:'已退款',
                            item4:that.data.refundvalue     
                          })
                        }
                      });
                    } else {                     
                      my.alert({
                        title: '提示',
                        content: res.data.message,
                        buttonText: '我知道了',
                        success: () => {
                          that.setData({
                            mask: 0,
                          })
                        }
                      });
                    }
                  }
                })
              }
              
              

            } else if (res.data.status == 2) {
              that.setData({
                error: 1,
                codeList1: '',
                codeList2: '',
                codeList3: '',
                codeList4: '',
                codeList5: '',
                codeList6: '',
              })
              my.alert({
                title: '提示',
                content: res.data.message,
                buttonText: '我知道了',
                success: () => {
                  
                }
              });
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      }
    }


  },
 
  // 打印
  dayin(){    
    var print = my.getStorageSync({ key: 'print' }).data;
    console.log(print)
    if(print==1){
      if(this.data.pay_status==2 && this.data.deposit_status==1){//押金冻结成功
        this.dayinfunctiona()
      }else if(this.data.pay_status==1 && this.data.deposit_status==1){//押金预授权完成
        this.dayinfunctiona()
      }else if(this.data.pay_status==2 && this.data.deposit_status==4){//预授权取消
        this.dayinfunctiona()
      }else if(this.data.pay_status==4 && this.data.deposit_status==1){//退款成功**撤销订单
        this.dayinfunctionb()
      }
      
      
    }else{
      // this.dayinfunctiona()
      // this.dayinfunctionaa()
      // console.log('2遍')
      if(this.data.pay_status==2 && this.data.deposit_status==1){//押金冻结成功
        this.dayinfunctiona()
        this.dayinfunctionaa()
      }else if(this.data.pay_status==1 && this.data.deposit_status==1){//押金预授权完成
        this.dayinfunctiona()
        this.dayinfunctionaa()
      }else if(this.data.pay_status==2 && this.data.deposit_status==4){//预授权取消
        this.dayinfunctiona()
        this.dayinfunctionaa()
      }else if(this.data.pay_status==4 && this.data.deposit_status==1){//退款成功**撤销订单
        this.dayinfunctionb()
        this.dayinfunctionbb()
      }
    } 
  },
  // 打印描述**********************
  dayinfunctiona(){
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
        my.ix.printer({
          target:r.usb[0].id,
          cmds: [{'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']}, 
                {'cmd':'addSelectJustification', 'args': ['CENTER']},
                {'cmd':'addText', 'args':['收款单']},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'ON']}, 
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['商户名称:'+this.data.item5]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['收银员:'+this.data.item6]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单号:'+this.data.item8]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['押金金额:'+this.data.item2]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付金额:'+this.data.item3]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['退款金额:'+this.data.item4]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付方式:'+this.data.item1]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单状态:'+this.data.pay_status_desc]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['押金时间:'+this.data.deposit_time]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectJustification', 'args': ['CENTER']}, /*设置打印居中对齐*/
                {'cmd':'addSelectErrorCorrectionLevelForQRCode', 'args':['49']}, /*设置纠错等级*/
                {'cmd':'addSelectSizeOfModuleForQRCode', 'args':['10']}, /*设置qrcode模块大小*/
                {'cmd':'addStoreQRCodeData', 'args':[this.data.item8]}, /*设置qrcode内容*/
                {'cmd':'addPrintQRCode','args':[]}, /*打印QRCode*/                    

                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
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
    my.ix.onMonitorPrinter((r) => {
      console.log("received data:" + r);
      // 查询连接的打印机的 API
      my.ix.queryPrinter({
        success: (r) => {
          console.log(r)
          my.ix.printer({
            target:r.usb[0].id,
            cmds: [{'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']}, 
                  {'cmd':'addSelectJustification', 'args': ['CENTER']},
                  {'cmd':'addText', 'args':['收款单']},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'ON']}, 
                  {'cmd':'addSelectJustification', 'args': ['LEFT']},
                  {'cmd':'addText', 'args':['商户名称:'+this.data.item5]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addSelectJustification', 'args': ['LEFT']},
                  {'cmd':'addText', 'args':['收银员:'+this.data.item6]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['订单号:'+this.data.item8]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['押金金额:'+this.data.item2]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['支付金额:'+this.data.item3]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['退款金额:'+this.data.item4]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['支付方式:'+this.data.item1]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['订单状态:'+this.data.pay_status_desc]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['押金时间:'+this.data.deposit_time]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectJustification', 'args': ['CENTER']}, /*设置打印居中对齐*/
                  {'cmd':'addSelectErrorCorrectionLevelForQRCode', 'args':['49']}, /*设置纠错等级*/
                  {'cmd':'addSelectSizeOfModuleForQRCode', 'args':['10']}, /*设置qrcode模块大小*/
                  {'cmd':'addStoreQRCodeData', 'args':[this.data.item8]}, /*设置qrcode内容*/
                  {'cmd':'addPrintQRCode','args':[]}, /*打印QRCode*/                    

                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
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
  dayinfunctionaa(){
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
        my.ix.printer({
          target:r.usb[0].id,
          cmds: [{'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']}, 
                {'cmd':'addSelectJustification', 'args': ['CENTER']},
                {'cmd':'addText', 'args':['凭证二']},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'ON']}, 
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['商户名称:'+this.data.item5]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['收银员:'+this.data.item6]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单号:'+this.data.item8]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['押金金额:'+this.data.item2]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付金额:'+this.data.item3]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['退款金额:'+this.data.item4]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付方式:'+this.data.item1]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单状态:'+this.data.pay_status_desc]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['押金时间:'+this.data.deposit_time]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectJustification', 'args': ['CENTER']}, /*设置打印居中对齐*/
                {'cmd':'addSelectErrorCorrectionLevelForQRCode', 'args':['49']}, /*设置纠错等级*/
                {'cmd':'addSelectSizeOfModuleForQRCode', 'args':['10']}, /*设置qrcode模块大小*/
                {'cmd':'addStoreQRCodeData', 'args':[this.data.item8]}, /*设置qrcode内容*/
                {'cmd':'addPrintQRCode','args':[]}, /*打印QRCode*/                    

                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
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
    my.ix.onMonitorPrinter((r) => {
      console.log("received data:" + r);
      // 查询连接的打印机的 API
      my.ix.queryPrinter({
        success: (r) => {
          console.log(r)
          my.ix.printer({
            target:r.usb[0].id,
            cmds: [{'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']}, 
                  {'cmd':'addSelectJustification', 'args': ['CENTER']},
                  {'cmd':'addText', 'args':['凭证二']},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'ON']}, 
                  {'cmd':'addSelectJustification', 'args': ['LEFT']},
                  {'cmd':'addText', 'args':['商户名称:'+this.data.item5]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addSelectJustification', 'args': ['LEFT']},
                  {'cmd':'addText', 'args':['收银员:'+this.data.item6]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['订单号:'+this.data.item8]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['押金金额:'+this.data.item2]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['支付金额:'+this.data.item3]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['退款金额:'+this.data.item4]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['支付方式:'+this.data.item1]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['订单状态:'+this.data.pay_status_desc]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['押金时间:'+this.data.deposit_time]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectJustification', 'args': ['CENTER']}, /*设置打印居中对齐*/
                  {'cmd':'addSelectErrorCorrectionLevelForQRCode', 'args':['49']}, /*设置纠错等级*/
                  {'cmd':'addSelectSizeOfModuleForQRCode', 'args':['10']}, /*设置qrcode模块大小*/
                  {'cmd':'addStoreQRCodeData', 'args':[this.data.item8]}, /*设置qrcode内容*/
                  {'cmd':'addPrintQRCode','args':[]}, /*打印QRCode*/                    

                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
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
  dayinfunctionb(){
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
        my.ix.printer({
          target:r.usb[0].id,
          cmds: [{'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']}, 
                {'cmd':'addSelectJustification', 'args': ['CENTER']},
                {'cmd':'addText', 'args':['收款单']},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'ON']}, 
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['商户名称:'+this.data.item5]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['收银员:'+this.data.item6]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单号:'+this.data.item8]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['押金金额:'+this.data.item2]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付金额:'+this.data.item3]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['退款金额:'+this.data.item4]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付方式:'+this.data.item1]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单状态:'+this.data.pay_status_desc]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['退款时间:'+this.data.deposit_time]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectJustification', 'args': ['CENTER']}, /*设置打印居中对齐*/
                {'cmd':'addSelectErrorCorrectionLevelForQRCode', 'args':['49']}, /*设置纠错等级*/
                {'cmd':'addSelectSizeOfModuleForQRCode', 'args':['10']}, /*设置qrcode模块大小*/
                {'cmd':'addStoreQRCodeData', 'args':[this.data.item8]}, /*设置qrcode内容*/
                {'cmd':'addPrintQRCode','args':[]}, /*打印QRCode*/                    

                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
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
    my.ix.onMonitorPrinter((r) => {
      console.log("received data:" + r);
      // 查询连接的打印机的 API
      my.ix.queryPrinter({
        success: (r) => {
          console.log(r)
          my.ix.printer({
            target:r.usb[0].id,
            cmds: [{'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']}, 
                  {'cmd':'addSelectJustification', 'args': ['CENTER']},
                  {'cmd':'addText', 'args':['收款单']},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'ON']}, 
                  {'cmd':'addSelectJustification', 'args': ['LEFT']},
                  {'cmd':'addText', 'args':['商户名称:'+this.data.item5]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addSelectJustification', 'args': ['LEFT']},
                  {'cmd':'addText', 'args':['收银员:'+this.data.item6]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['订单号:'+this.data.item8]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['押金金额:'+this.data.item2]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['支付金额:'+this.data.item3]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['退款金额:'+this.data.item4]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['支付方式:'+this.data.item1]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['订单状态:'+this.data.pay_status_desc]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['退款时间:'+this.data.deposit_time]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectJustification', 'args': ['CENTER']}, /*设置打印居中对齐*/
                  {'cmd':'addSelectErrorCorrectionLevelForQRCode', 'args':['49']}, /*设置纠错等级*/
                  {'cmd':'addSelectSizeOfModuleForQRCode', 'args':['10']}, /*设置qrcode模块大小*/
                  {'cmd':'addStoreQRCodeData', 'args':[this.data.item8]}, /*设置qrcode内容*/
                  {'cmd':'addPrintQRCode','args':[]}, /*打印QRCode*/                    

                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
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
  dayinfunctionbb(){
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
        my.ix.printer({
          target:r.usb[0].id,
          cmds: [{'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']}, 
                {'cmd':'addSelectJustification', 'args': ['CENTER']},
                {'cmd':'addText', 'args':['凭证二']},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'ON']}, 
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['商户名称:'+this.data.item5]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['收银员:'+this.data.item6]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单号:'+this.data.item8]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['押金金额:'+this.data.item2]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付金额:'+this.data.item3]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['退款金额:'+this.data.item4]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付方式:'+this.data.item1]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单状态:'+this.data.pay_status_desc]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['退款时间:'+this.data.deposit_time]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectJustification', 'args': ['CENTER']}, /*设置打印居中对齐*/
                {'cmd':'addSelectErrorCorrectionLevelForQRCode', 'args':['49']}, /*设置纠错等级*/
                {'cmd':'addSelectSizeOfModuleForQRCode', 'args':['10']}, /*设置qrcode模块大小*/
                {'cmd':'addStoreQRCodeData', 'args':[this.data.item8]}, /*设置qrcode内容*/
                {'cmd':'addPrintQRCode','args':[]}, /*打印QRCode*/                    

                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
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
    my.ix.onMonitorPrinter((r) => {
      console.log("received data:" + r);
      // 查询连接的打印机的 API
      my.ix.queryPrinter({
        success: (r) => {
          console.log(r)
          my.ix.printer({
            target:r.usb[0].id,
            cmds: [{'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']}, 
                  {'cmd':'addSelectJustification', 'args': ['CENTER']},
                  {'cmd':'addText', 'args':['凭证二']},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'ON']}, 
                  {'cmd':'addSelectJustification', 'args': ['LEFT']},
                  {'cmd':'addText', 'args':['商户名称:'+this.data.item5]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addSelectJustification', 'args': ['LEFT']},
                  {'cmd':'addText', 'args':['收银员:'+this.data.item6]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['订单号:'+this.data.item8]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['押金金额:'+this.data.item2]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['支付金额:'+this.data.item3]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'ON', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['退款金额:'+this.data.item4]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['支付方式:'+this.data.item1]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['订单状态:'+this.data.pay_status_desc]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['退款时间:'+this.data.deposit_time]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectJustification', 'args': ['CENTER']}, /*设置打印居中对齐*/
                  {'cmd':'addSelectErrorCorrectionLevelForQRCode', 'args':['49']}, /*设置纠错等级*/
                  {'cmd':'addSelectSizeOfModuleForQRCode', 'args':['10']}, /*设置qrcode模块大小*/
                  {'cmd':'addStoreQRCodeData', 'args':[this.data.item8]}, /*设置qrcode内容*/
                  {'cmd':'addPrintQRCode','args':[]}, /*打印QRCode*/                    

                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
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
  // 打印描述**********************
  // 撤销
  chexiaoTap(){
    var that=this
    that.setData({
      eachjianpan:0
    })
    if (this.data.chehui==0){
      this.setData({
        mask: 1,
      })
    }
    
  },
  // 关闭支付弹窗
  del() {
    this.setData({
      mask: 0,
      codeList1: '',
      codeList2: '',
      codeList3: '',
      codeList4: '',
      codeList5: '',
      codeList6: '',
      error: 0
    })
  },
  // 预授权完成
  shouquanTap(){  
    if (this.data.showquan == 0) {
      this.setData({
        yushou: 0
      })
    }        
  },
  shouquandel(){
    this.setData({
      yushou:1
    })
  },
  yushouquanTap(e){
    if(e.detail.value>this.data.totalAmount){//输入金额大于授权金额
      this.setData({
        chaojine:1,
        chaojinetip:0
      })
    }else{
      this.setData({
        chaojine:0,
        chaojinetip:1
      })
    }
    this.setData({
      xiaofeijine:e.detail.value
    })
    
  },

  shouquanTips(){
    // 显示加载图标
    my.showLoading({
      content: '玩命加载中',
    })
    var that=this
    console.log(that.data.store_id)
    console.log(that.data.out_order_no)
    console.log(that.data.out_trade_no)
    console.log(that.data.xiaofeijine)
    my.request({
      url: that.data.Request+"/api/deposit/fund_pay",
      method: 'POST',
      data: {
        token: that.data.token,
        store_id: that.data.store_id,
        out_order_no: that.data.out_order_no,
        out_trade_no: that.data.out_trade_no,
        pay_amount: that.data.xiaofeijine
      },
      dataType: 'json',
      success(res) {
        console.log(res.data)
       my.hideLoading();
        if (res.data.status == 1) {
          that.setData({
            yushou: 1
          })
          my.navigateTo({
            url: '../shouquanjieguo/shouquanjieguo?jine=' + that.data.xiaofeijine,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        } else {
          my.alert({
            title: '提示',
            content: res.data.message,
            buttonText: '我知道了',
            success: () => {
              
            }
          });
        }
      }
    })
  },

  // 退款
  refundTap(){
    if (this.data.yajin == 0){
      this.setData({
        shoukuanma: 0,
        eachjianpan:1
      })
    }    
  },
  shoukuanTips(e) {
    var that=this
    console.log(e)
    if (e.currentTarget.dataset.tipsbtn == "cancel") {
      this.setData({
        shoukuanma: 1,
        refundvalue:''
      })
    } else if (e.currentTarget.dataset.tipsbtn == "comfirm") {
      console.log(that.data.refundvalue)
      this.setData({
        mask:1,
        shoukuanma: 1,
        cashMoney: that.data.refundvalue,
        refundvalue:that.data.refundvalue,
      })
    } 

  },
  refundmoney(e){
    if(e.detail.value>this.data.totalAmount){
      my.showToast({
        type: 'none',
        content: '退款金额不能大于订单金额',
        duration: 3000,
        success: () => {
          
        },
      });
    }else{
      this.setData({
        refundvalue:e.detail.value
      })
    }
    
  },
  

})