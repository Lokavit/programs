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
    store_id:query.store_id,
    auth_code:query.auth_code,    
    pay_action:query.pay_action,
    total_amount:query.total_amount, 
    codeType:query.codeType,  
  })

  var Request = my.getStorageSync({ key: 'Request' }).data;
  var token = my.getStorageSync({ key: 'token' }).data;

  var store_name = my.getStorageSync({ key: 'store_name' }).data;
  var name = my.getStorageSync({ key: 'name' }).data;

  var checked = my.getStorageSync({ key: 'checked' }).data;
  var print = my.getStorageSync({ key: 'print' }).data;
  this.setData({
    store_name:store_name,
    name:name,
    Request:Request,
  })
  console.log(token)


  var that=this
  // ******************设备交易支付接口******************************---*****--*************

  my.request({
    url: that.data.Request+"/api/deposit/micropay",//*******支付接口***********/
    method: 'POST',
    data: {
      token:token,
      device_type:'face_f4',
      pay_action:that.data.pay_action,
      store_id:that.data.store_id,
      code:that.data.auth_code,
      total_amount:that.data.total_amount,
    },
    dataType: 'json',
    success: function(res) {           
      console.log(res.data)
      
      if(res.data.status==1){

        that.setData({
          out_trade_no:res.data.data.out_trade_no,
          total_amount:res.data.data.amount,//押金金额
          ways_source_desc:res.data.data.ways_source_desc,
          result_msg:res.data.message,
          pay_time:res.data.data.gmt_trans,

          deposit_time:res.data.data.deposit_time,
          pay_amount:res.data.data.pay_amount,//支付金额
          refund_amount:res.data.data.refund_amount,//退款金额
          remark:res.data.data.remark,

        })
        if(print==1){
          that.dayina()
          console.log('1遍')
        }else{
          that.dayina()
          that.dayinaa()
          console.log('2遍')
        } 
        if(that.data.codeType=='C'){
          my.navigateTo({
            url: '../success/success?pay_amount='+res.data.data.amount+"&ways_source_desc="+res.data.data.ways_source_desc+"&out_trade_no="+res.data.data.out_trade_no+"&pay_time="+res.data.data.gmt_trans,
          })
        }else if(that.data.codeType=='F'){
          my.navigateTo({
            url: '../index/index',
          })
        }
        
      }else{
        my.navigateTo({
          url: '../fail/fail?result_msg='+res.data.return_msg+"&pay_amount="+res.data.pay_amount,
        })
      }        
      
      
      
    },
    fail: function(res) {
      // my.alert({content: 'fail'});
      // console.log(payres.data)
    },
    complete: function(res) {        
      // my.alert({content: 'complete'});
      // console.log(payres.data)
    }
  });
},
onShow(){    
    
  
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
              {'cmd':'addText', 'args':['押金金额:'+this.data.total_amount]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付金额:'+this.data.pay_amount]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['退款金额:'+this.data.refund_amount]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付方式:'+this.data.ways_source_desc]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付状态:'+this.data.result_msg]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['押金时间:'+this.data.deposit_time]},
              
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行                    
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['用户备注:'+this.data.remark]},
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
                {'cmd':'addText', 'args':['押金金额:'+this.data.total_amount]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付金额:'+this.data.pay_amount]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['退款金额:'+this.data.refund_amount]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付方式:'+this.data.ways_source_desc]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付状态:'+this.data.result_msg]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['押金时间:'+this.data.deposit_time]},
                
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行                    
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['用户备注:'+this.data.remark]},
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
              {'cmd':'addText', 'args':['押金金额:'+this.data.total_amount]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付金额:'+this.data.pay_amount]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['退款金额:'+this.data.refund_amount]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付方式:'+this.data.ways_source_desc]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['支付状态:'+this.data.result_msg]},
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['押金时间:'+this.data.deposit_time]},
              
              {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行                    
              {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              {'cmd':'addText', 'args':['用户备注:'+this.data.remark]},
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
                {'cmd':'addText', 'args':['押金金额:'+this.data.total_amount]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付金额:'+this.data.pay_amount]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['退款金额:'+this.data.refund_amount]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付方式:'+this.data.ways_source_desc]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['支付状态:'+this.data.result_msg]},
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['押金时间:'+this.data.deposit_time]},
                
                {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行                    
                {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
                {'cmd':'addText', 'args':['用户备注:'+this.data.remark]},
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