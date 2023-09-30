
var app = getApp()
Page({
  data: {
    show1: 1,
    show2: 1,
    showAccount:1,
    showOther:1,

    totalAmount:'',
  },
  onLoad(query){
    // //console.log(options.out_trade_no)
    var token = my.getStorageSync({ key: 'token' }).data;
    var Request = my.getStorageSync({ key: 'Request' }).data;
    var that=this
    that.setData({
      token:token,
      Request:Request,
      out_trade_no:query.out_trade_no
    })
    // 显示加载图标
    my.showLoading({
      title: '玩命加载中',
    })
    my.request({
      url: that.data.Request+"/api/merchant/fq/order_info",
      method: 'POST',
      data: {
        token: token,
        out_trade_no: query.out_trade_no
      },
      dataType: 'json',
      success(res){
        console.log(res.data)
        // 隐藏加载框
        my.hideLoading();
        that.setData({
          totalAmount: res.data.data.total_amount,
          item1: res.data.data.ways_source_desc,
          item2: res.data.data.shop_price,
          item3: res.data.data.hb_fq_num,
          
          item6: res.data.data.pay_sxf,
          item7: res.data.data.receipt_amount,

          item8: res.data.data.store_name,
          item9: res.data.data.merchant_name,
          item10: res.data.data.created_at,
          item11: res.data.data.out_trade_no,
          item12: res.data.data.pay_status_desc,
          item13: res.data.data.buyer_user,
          item14: res.data.data.buyer_phone,
          item15: res.data.data.shop_desc,
          item16: res.data.data.pay_status_desc,

          // remark:res.data.data.remark,

        })
        if (res.data.data.hb_fq_seller_percent==100){
          that.setData({
            item5: '商家',
            item4: '-'+res.data.data.hb_fq_sxf,
          })
        }else{
          that.setData({
            item5: '用户',
            item4:  res.data.data.hb_fq_sxf,
          })
        }
        console.log(res.data.data.pay_status)
        if(res.data.data.pay_status === 6){
          that.setData({
            hui:"color"
          })
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
  storeStaff () {
    my.navigateTo({
      url: '../mendianyuangong/mendianyuangong',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  tuikuan(){
    var that=this
    if(that.data.hui!='color'){
      my.confirm({
        title: '提示',
        content: '是否确定退款?',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        success: (result) => {
          console.log(result.confirm)
          
          if(result.confirm==true){
            my.showLoading({
              content: '加载中...',
            });
            my.request({
              url: that.data.Request+"/api/merchant/fq/refund",
              method: 'POST',
              data: {
                token:that.data.token,
                out_trade_no:that.data.out_trade_no,
                refund_amount:that.data.totalAmount
              },
              dataType: 'json',
              success: function(res) {
                console.log(res)
                my.hideLoading();
                my.alert({
                  content: res.data.message,
                  buttonText: '我知道了',
                  success: () => {
                    
                  },
                });
              },
              fail: function(res) {
                // my.alert({content: 'fail'});
              },
              complete: function(res) {
                // my.hideLoading();
                // my.alert({content: 'complete'});
              }
            });
          }
        },
      });
    }   
    
  },
  dayin(){
    var print = my.getStorageSync({ key: 'print' }).data;
    if(print==1){
      this.dayinfunctiona()
      console.log('1遍')
    }else{
      this.dayinfunctiona()
      this.dayinfunctionb()
      console.log('2遍')
    } 
    
    
  },
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
                {'cmd':'addText', 'args':['凭证二']},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'ON']}, 
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['商户名称:'+this.data.store_name]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['收银员:'+this.data.name]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单号:'+this.data.out_trade_no]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单金额:'+this.data.total_amount]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付方式:'+this.data.ways_source_desc]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付状态:'+this.data.result_msg]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付时间:'+this.data.pay_time]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行                    
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['用户备注:'+this.data.remark]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['-------------------------------------']},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectJustification', 'args': ['CENTER']}, /*设置打印居中对齐*/
                {'cmd':'addSelectErrorCorrectionLevelForQRCode', 'args':['49']}, /*设置纠错等级*/
                {'cmd':'addSelectSizeOfModuleForQRCode', 'args':['10']}, /*设置qrcode模块大小*/
                {'cmd':'addStoreQRCodeData', 'args':[this.data.out_trade_no]}, /*设置qrcode内容*/
                {'cmd':'addPrintQRCode','args':[]}, /*打印QRCode*/                        

                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
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
                  {'cmd':'addText', 'args':['商户名称:'+this.data.item8]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addSelectJustification', 'args': ['LEFT']},
                  {'cmd':'addText', 'args':['收银员:'+this.data.item9]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['订单号:'+this.data.item8]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['订单金额:'+this.data.totalAmount]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['支付方式:'+this.data.item1]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['支付状态:'+this.data.item12]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['支付时间:'+this.data.item10]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行                      
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectJustification', 'args': ['CENTER']}, /*设置打印居中对齐*/
                  {'cmd':'addSelectErrorCorrectionLevelForQRCode', 'args':['49']}, /*设置纠错等级*/
                  {'cmd':'addSelectSizeOfModuleForQRCode', 'args':['10']}, /*设置qrcode模块大小*/
                  {'cmd':'addStoreQRCodeData', 'args':[this.data.item8]}, /*设置qrcode内容*/
                  {'cmd':'addPrintQRCode','args':[]}, /*打印QRCode*/                     

                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                ],
            success: (r) => {
              console.log(r)             
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
                {'cmd':'addText', 'args':['凭证二']},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'ON']}, 
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['商户名称:'+this.data.item8]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['收银员:'+this.data.item9]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单号:'+this.data.item8]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单金额:'+this.data.totalAmount]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付方式:'+this.data.item1]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付状态:'+this.data.item12]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付时间:'+this.data.item10]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行                      
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectJustification', 'args': ['CENTER']}, /*设置打印居中对齐*/
                {'cmd':'addSelectErrorCorrectionLevelForQRCode', 'args':['49']}, /*设置纠错等级*/
                {'cmd':'addSelectSizeOfModuleForQRCode', 'args':['10']}, /*设置qrcode模块大小*/
                {'cmd':'addStoreQRCodeData', 'args':[this.data.item8]}, /*设置qrcode内容*/
                {'cmd':'addPrintQRCode','args':[]}, /*打印QRCode*/                     

                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              ],
          success: (r) => {
            console.log(r)
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
                  {'cmd':'addText', 'args':['商户名称:'+this.data.item8]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addSelectJustification', 'args': ['LEFT']},
                  {'cmd':'addText', 'args':['收银员:'+this.data.item9]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['订单号:'+this.data.item8]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['订单金额:'+this.data.totalAmount]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['支付方式:'+this.data.item1]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['支付状态:'+this.data.item12]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                  {'cmd':'addText', 'args':['支付时间:'+this.data.item10]},
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行                      
                  {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                  {'cmd':'addSelectJustification', 'args': ['CENTER']}, /*设置打印居中对齐*/
                  {'cmd':'addSelectErrorCorrectionLevelForQRCode', 'args':['49']}, /*设置纠错等级*/
                  {'cmd':'addSelectSizeOfModuleForQRCode', 'args':['10']}, /*设置qrcode模块大小*/
                  {'cmd':'addStoreQRCodeData', 'args':[this.data.item8]}, /*设置qrcode内容*/
                  {'cmd':'addPrintQRCode','args':[]}, /*打印QRCode*/                     

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

})