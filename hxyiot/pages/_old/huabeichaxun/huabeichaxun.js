var app = getApp();
import md5 from '/utils/md5.js';
Page({
  data: {
    
  },
  
onLoad(query) {
  // 页面加载
  // **********排序函数******
  // console.log(query)
  
  this.setData({
    shop_price:query.shop_price,
    total_amount:query.total_amount,
    hb_fq_num:query.hb_fq_num,
    auth_code:query.auth_code
  })

  var Request = my.getStorageSync({ key: 'Request' }).data;
  var token = my.getStorageSync({ key: 'token' }).data;
  var store_id = my.getStorageSync({ key: 'store_id' }).data;
  var bear = my.getStorageSync({ key: 'bear' }).data;

  var checked = my.getStorageSync({ key: 'checked' }).data;


  var that=this
  that.setData({
    Request:Request
  })

  my.request({
    url: that.data.Request+"/api/merchant/fq/fq_pay",//*******花呗分期接口***********/
    method: 'POST',
    data: {
      token:token,
      store_id:store_id,
      ways_source:'alipay',
      auth_code:that.data.auth_code,
      shop_price:that.data.shop_price,
      total_amount:that.data.total_amount,
      hb_fq_num:that.data.hb_fq_num,
      hb_fq_seller_percent:bear,
    },
    dataType: 'json',
    success: function(hbres) {           
      console.log(hbres.data)      
      if(hbres.data.status==1){
        if (hbres.data.pay_status == 1) {
          if(checked == true){//判断是否开启打印机
            if(print==1){
              that.dayina()
              console.log('1遍')
            }else{
              that.dayina()
              that.dayinaa()
              console.log('2遍')
            } 
          }else{

          }
          status1()
          if(that.data.codeType=='C'){
            my.redirectTo({
              url: '../success/success?total_amount='+hbres.data.total_amount+"&ways_source_desc="+hbres.data.ways_source_desc+"&ways_source="+hbres.data.ways_source+"&out_trade_no="+hbres.data.out_trade_no+"&pay_time="+hbres.data.pay_time,
            })
          }else if(that.data.codeType=='F'){
            my.redirectTo({
              url: '../index/index',
            })
          }          
        } else if(hbres.data.pay_status == 3) {
          that.setData({
            result_msg:hbres.data.message,
            pay_amount:hbres.data.pay_amount,
          })
          status3()
        } else if(hbres.data.pay_status == 2) {
          // that.setData({
          //   result_msg:hbres.data.message,
          // })
          status2()
        }  

        //执行逻辑代码
        function timer() {
          my.request({
            url: that.data.Request+"/api/merchant/hb_order_foreach",//************轮询订单查询*****************
            method: 'POST',
            data: {
              token:token,
              store_id:store_id,
              out_trade_no:hbres.data.data.out_trade_no,
            },
            dataType: 'json',
            success: function(reslx) { 
              console.log(reslx.data)
              if(reslx.data.status==1){
                if (reslx.data.pay_status == 1) {
                  if(checked == true){//判断是否开启打印机
                    if(print==1){
                    that.dayinb()
                    console.log('1遍')
                  }else{
                    that.dayinb()
                    that.dayinbb()
                    console.log('2遍')
                  }
                  }else{
                    
                  }
                  status1()
                  my.redirectTo({
                    url: '../huabeisuccess/huabeisuccess?total_amount='+reslx.data.data.total_amount+"&store_name="+reslx.data.data.store_name+"&out_trade_no="+reslx.data.data.out_trade_no+"&pay_time="+reslx.data.pay_time,
                  })
                } else if (reslx.data.pay_status == 3) {
                  that.setData({
                    result_msg:reslx.data.message,
                    pay_amount:reslx.data.pay_amount,
                  })
                  status3()
                  my.redirectTo({
                    url: '../fail/fail?result_msg='+reslx.data.message,
                  })
                } else if (reslx.data.pay_status == 2) {
                  that.setData({
                    result_msg:reslx.data.message
                  })
                  status2()            
                } 
              }else{
                status1()
                my.redirectTo({
                  url: '../fail/fail?result_msg='+reslx.data.message+"&pay_amount="+reslx.data.pay_amount,
                })
              }               
                        
            },
            fail: function(rest) {
              // my.alert({content: 'fail'});
            },
            complete: function(rest) {
              my.hideLoading();
              // my.alert({content: 'complete'});
            }
          });                      
        }
        
        var count=0
        var timering
        //执行逻辑代码
        function status1() {
          //status1的代码复制到这里 
          clearInterval(timering);  
          
        }
        function status2() {
          //status2复制到这里                    
          clearInterval(timering);
          
          timering = setInterval(function () {
            count++ 
            if(count>20){//>20清除定时器
              
              my.request({
                url: that.data.Request+"/api/merchant/fq/hb_order_cancel",//************一分钟后请求的接口*****************
                method: 'POST',
                data: {
                  token:token,
                  store_id:store_id,
                  out_trade_no:hbres.data.out_trade_no,         
                },
                dataType: 'json',
                success: function(Cancelres) { 
                  console.log(Cancelres.data)
                  clearInterval(timering);             
                  my.redirectTo({
                    url: '../fail/fail?result_msg='+Cancelres.data.message,
                  })          
                },
                fail: function(rest) {
                  // my.alert({content: 'fail'});
                },
                complete: function(rest) {
                  my.hideLoading();
                  // my.alert({content: 'complete'});
                }
              });
                
            } else{
              timer()
            }                         
          }, 3000);//3秒轮询一次
        }
        function status3() {
          //status3复制到这里
          clearInterval(timering);
          my.redirectTo({
            url: '../fail/fail?result_msg='+that.data.message+"&pay_amount="+that.data.pay_amount,
          })
        }
        
      }else{
        my.redirectTo({
          url: '../fail/fail?result_msg='+hbres.data.message+"&pay_amount="+hbres.data.pay_amount,
        })
      }        
      
      
      
    },
    fail: function(hbres) {
      // my.alert({content: 'fail'});
      // console.log(payres.data)
    },
    complete: function(hbres) {        
      // my.alert({content: 'complete'});
      // console.log(payres.data)
    }
  });
},
dayina(){
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
              {'cmd':'addText', 'args':['商户名称:想用']},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addSelectJustification', 'args': ['LEFT']},
              {'cmd':'addText', 'args':['收银员:想用助手']},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['订单号:'+hbres.data.out_trade_no]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['订单金额:'+hbres.data.total_amount]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付方式:'+hbres.data.ways_source_desc]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付状态:'+hbres.data.result_msg]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付时间:'+hbres.data.pay_time]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['用户备注:'+hbres.data.remark]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['-------------------------------------']},
              

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
                {'cmd':'addText', 'args':['商户名称:想用']},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['收银员:想用助手']},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单号:'+hbres.data.out_trade_no]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单金额:'+hbres.data.total_amount]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付方式:'+hbres.data.ways_source_desc]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付状态:'+hbres.data.result_msg]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付时间:'+hbres.data.pay_time]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['用户备注:'+hbres.data.remark]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['-------------------------------------']},
                

                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
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
dayinaa(){
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
              {'cmd':'addText', 'args':['商户名称:想用']},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addSelectJustification', 'args': ['LEFT']},
              {'cmd':'addText', 'args':['收银员:想用助手']},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['订单号:'+hbres.data.out_trade_no]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['订单金额:'+hbres.data.total_amount]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付方式:'+hbres.data.ways_source_desc]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付状态:'+hbres.data.result_msg]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付时间:'+hbres.data.pay_time]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['用户备注:'+hbres.data.remark]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['-------------------------------------']},
              

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
                {'cmd':'addText', 'args':['商户名称:想用']},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['收银员:想用助手']},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单号:'+hbres.data.out_trade_no]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单金额:'+hbres.data.total_amount]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付方式:'+hbres.data.ways_source_desc]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付状态:'+hbres.data.result_msg]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付时间:'+hbres.data.pay_time]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['用户备注:'+hbres.data.remark]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['-------------------------------------']},
                

                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
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
dayinb(){
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
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addSelectJustification', 'args': ['LEFT']},
              {'cmd':'addText', 'args':['收银员:想用助手']},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['订单号:'+reslx.data.out_trade_no]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['订单金额:'+reslx.data.total_amount]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付方式:'+reslx.data.ways_source_desc]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付状态:'+reslx.data.result_msg]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付时间:'+reslx.data.pay_time]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['用户备注:'+reslx.data.remark]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['-------------------------------------']},                                    

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
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['收银员:想用助手']},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单号:'+reslx.data.out_trade_no]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单金额:'+reslx.data.total_amount]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付方式:'+reslx.data.ways_source_desc]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付状态:'+reslx.data.result_msg]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付时间:'+reslx.data.pay_time]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['用户备注:'+reslx.data.remark]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['-------------------------------------']},                                    

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
dayinbb(){
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
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addSelectJustification', 'args': ['LEFT']},
              {'cmd':'addText', 'args':['收银员:想用助手']},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['订单号:'+reslx.data.out_trade_no]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['订单金额:'+reslx.data.total_amount]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付方式:'+reslx.data.ways_source_desc]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付状态:'+reslx.data.result_msg]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付时间:'+reslx.data.pay_time]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['用户备注:'+reslx.data.remark]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['-------------------------------------']},                                    

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
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addSelectJustification', 'args': ['LEFT']},
                {'cmd':'addText', 'args':['收银员:想用助手']},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单号:'+reslx.data.out_trade_no]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['订单金额:'+reslx.data.total_amount]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付方式:'+reslx.data.ways_source_desc]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付状态:'+reslx.data.result_msg]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付时间:'+reslx.data.pay_time]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['用户备注:'+reslx.data.remark]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['-------------------------------------']},                                    

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
onShow(){   
},
});