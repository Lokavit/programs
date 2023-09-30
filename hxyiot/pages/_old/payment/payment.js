var app = getApp();
import md5 from '/utils/md5.js';
import { Page } from '/utils/ix'; // 添加这行
Page({
  data: {
    banner: [{
      ad_file:'../../img/banenr.png',
      ad_url:'www.baidu.com'
    },
    {
      ad_file:'../../img/banenr.png',
      ad_url:'www.sina.com'
    }
    ],
    indicatorDots: true,
    autoplay: true,
    vertical: false,
    interval: 5000,
    circular: true,
    acceleration:true,
    mode:'scaleToFill',
    canclick:true,
    canclick:true,
    show:false,
    show2:false,
  },
  onLoad(query) {

    var device_id = my.getStorageSync({ key: 'device_id' }).data;
    var Request = my.getStorageSync({ key: 'Request' }).data; 
    var pay_action = my.getStorageSync({ key: 'pay_action' }).data;
    var store_id = my.getStorageSync({ key: 'store_id' }).data;    
    var merchant_id = my.getStorageSync({ key: 'login_merchant_id' }).data;    
    var config_id = my.getStorageSync({ key: 'config_id' }).data;
    var memberchecked = my.getStorageSync({ key: 'memberchecked' }).data;
    var store_name = my.getStorageSync({ key: 'store_name' }).data;
    var name = my.getStorageSync({ key: 'name' }).data;
    this.setData({
      device_id:device_id,      
      pay_action:pay_action,
      store_id:store_id,
      merchant_id:merchant_id,
      config_id:config_id,
      Request:Request,
      memberchecked:memberchecked,
      store_name,
      name,
      // 付款金额
      jine:query.jine,
      posmoney:query.posmoney,
      bizNo:query.bizNo,
    }) 
 

    // my.ix.onCashierEventReceive((s) => {
    //   if (s.status === "RESULT_CLOSE"){
    //     console.log('收银台关闭')
    //     my.navigateBack({
    //       delta:2
    //     })
    //     // my.ix.offCashierEventReceive();
    //   } 
    // });
    
  },
  onShow(){
    this.setData({
      show:false,
      show2:false
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
    if(r.keyCode == 133){ 
      clearInterval(this.data.time)
      my.navigateBack({
        delta:1
      })
    }
  },
   // ***********关闭键盘事件监听********************    
  onHide(){
    my.ix.offKeyEventChange();
  }, 
  onUnLoad() {
    my.ix.offKeyEventChange();
  },
 
  onReady() {
    // 页面加载完成
    my.ix.speech({
      text: '请选择会员支付或刷脸支付',
      success: (r) => {
      }
    });
  },
  // tptap(e){
  //   console.log(e.currentTarget.dataset.url)

  //   my.navigateTo({
  //     url: '../payment/payment'//充值页面
  //   })
  // },
  memberPayTap(){
    var token = my.getStorageSync({ key: 'token' }).data;
    var that=this
    
    this.setData({
      show:true,
      show2:false
    }) 
    // 核身
    if(that.data.canclick){
      that.setData({
        canclick:false
      });
      setTimeout(()=>{
        my.ix.faceVerify({
            // certNo: 'XXX',
            // certName: 'XXX',
            // verifyType: 'idCard',
            option: 'life',
            success: (r) => {
                console.log(r)
                console.log(that.data.Request+'/api/member/mb_infos')
                console.log(token)
                console.log(that.data.store_id)
                console.log(r.buyerId)
                my.request({
                url: that.data.Request+'/api/member/mb_infos',
                data: {
                    token: token,
                    store_id: that.data.store_id,            
                    ali_user_id:r.buyerId
                },
                success:res=> {
                    console.log(res.data)
                    if (res.data.status == 1) {
                    if(res.data.is_member=='1' && that.data.memberchecked == true){//是会员
                    
                        my.navigateTo({
                            url: '/pages/hyyue/hyyue?buyerId='+r.buyerId+'&jine='+that.data.jine+'&mb_phone='+res.data.data.mb_phone+'&mb_name='+res.data.data.mb_name+'&mb_id='+res.data.data.mb_id+'&mb_money='+res.data.data.mb_money+'&merchant_id='+that.data.merchant_id+'&store_id='+that.data.store_id+'&config_id='+that.data.config_id+'&addition='+res.data.additional+'&mb_jf='+res.data.data.mb_jf

                        
                        })
                    }else{//不是会员
                    my.navigateTo({
                        url: '../registermember/registermember?buyerId='+r.buyerId +'&jine='+that.data.jine+'&merchant_id='+that.data.merchant_id+'&store_id='+that.data.store_id
                        })
                    }
                    
                    }
                }
                })

                // var store_member = my.getStorageSync({ key: 'store_member' }).data;
                // if(store_member==0){//0 代表没有开启门店会员 
                //   console.log('跳转注册会员') 
                //   
                // }else{//1 代表开启门店会员
                //   console.log('跳转会员支付') 
                //   my.navigateTo({
                //     url: '../registermember/registermember'  //***这里改成你写的页面****
                //   })
                // }

            },
            fail: (r) => {
                console.log(r)
            
            },
            complete: function(res) {
            
                that.setData({
                    canclick:true
                });
            }

            });


        },1000)
      }
                  
  },
  faceTap(){
      
    // *******************************随机数***********
    var data = new Date()
    var year = data.getFullYear();
    var mon = data.getMonth() + 1;
    var day = data.getDate();
    var h = data.getHours()
    var m = data.getMinutes()
    var s = data.getSeconds()
    
    var new_out_trade_no
    function test(){
      // 0-9的随机数
      var arr = [];//容器
      for(var i =0;i<6;i++){//循环六次
          var num = Math.random()*9;//Math.random();每次生成(0-1)之间的数;
          num = parseInt(num,10);
          arr.push(num);
      }               
      new_out_trade_no=year+''+mon+''+day+''+h+''+m+''+s+''+arr.join('')
      return new_out_trade_no;
    };
    test()

    var checked = my.getStorageSync({ key: 'checked' }).data;
    var print = my.getStorageSync({ key: 'print' }).data;
    
    this.setData({
      show2:true,
      show:false
    }) 

    var model = my.getStorageSync({ key: 'model' }).data;//判断是什么模式收银
    var that=this
    // ******************启动收银台**********************  
    
    if(model == 5){
      my.ix.startApp({
        appName: 'cashier',
        bizNo: new_out_trade_no,
        totalAmount: that.data.jine,
        success: (res) => {
          console.log(res.barCode)      
          if(res.barCode != undefined){  
            console.log(new_out_trade_no) 
            that.setData({
              show2:false
            });                         
            if(res.codeType=='C') {
              my.navigateTo({
                url: '../chaxunjieguo/chaxunjieguo?device_id='+that.data.device_id+"&pay_action="+that.data.pay_action+"&store_id="+that.data.store_id+"&merchant_id="+that.data.merchant_id+"&out_trade_no="+new_out_trade_no+"&config_id="+that.data.config_id+"&auth_code="+res.barCode+"&total_amount="+that.data.jine+"&codeType="+res.codeType+"&bizNo="+that.data.bizNo+"&posmoney="+that.data.posmoney+"&canceljudgement="+true,
              }) 
            }else{
              var data3 = {"device_id": that.data.device_id,"device_type": "face_f4","pay_method":"alipay_face","pay_action":that.data.pay_action,"store_id":that.data.store_id,"merchant_id":that.data.merchant_id,"out_trade_no":new_out_trade_no,"config_id":that.data.config_id,"auth_code":res.barCode,"total_amount":that.data.jine}            
              var str3= app.jsonsortSign(data3)  //键名排序+转换字符串(加密用)  
              var encryptedStr = md5(str3+"&key="+"88888888");//md5加密
              console.log(data3)
              
              my.request({
                url: that.data.Request+"/api/devicepay/all_pay",//*******支付接口***********/
                method: 'POST',
                data: {
                  device_id:that.data.device_id,
                  device_type:'face_f4',
                  pay_method:'alipay_face',
                  pay_action:that.data.pay_action,
                  store_id:that.data.store_id,
                  merchant_id:that.data.merchant_id,
                  out_trade_no:new_out_trade_no,
                  config_id:that.data.config_id,
                  auth_code:res.barCode,
                  total_amount:that.data.jine,
                  sign:encryptedStr
                },
                dataType: 'json',
                success: function(payres) { 
                  console.log(payres) 
                  that.setData({
                    out_trade_no:payres.data.out_trade_no,
                    total_amount:payres.data.total_amount,
                    ways_source_desc:payres.data.ways_source_desc,
                    result_msg:payres.data.result_msg,
                    pay_time:payres.data.pay_time,
                    remark:payres.data.remark,
                  })
                  if(payres.data.return_code=="SUCCESS"){//SUCCESS/FALL 此字段是通信标识
                    if (payres.data.result_code == "SUCCESS") {
                      
                      that.setData({
                        out_trade_no:payres.data.out_trade_no,
                        total_amount:payres.data.total_amount,
                        ways_source_desc:payres.data.ways_source_desc,
                        result_msg:payres.data.result_msg,
                        pay_time:payres.data.pay_time,
                        remark:payres.data.remark,
                      })
                      if(checked == true){//判断是否开启打印机
                        // ********--------*********
                        if(print==1){
                          that.dayina()
                          console.log('1遍')
                          console.log('刷脸走这边')
                        }else{
                          that.dayina()
                          that.dayinaa()
                          console.log('2遍')
                        } 
                      }else{

                      }

                      my.ix.onCashierEventReceive((s) => {
                        console.log(s)
                        if (s.status === "RESULT_CLOSE"){
                          console.log('收银台关闭')
                          my.navigateBack({
                            delta:2
                          })
                          my.ix.offCashierEventReceive();
                        } 
                      });

                      my.setStorageSync({key: 'kx_status',data: 1});
                      my.ix.tinyCommand({
                        target:"pos",  
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
                    }
                  } 
                  
                },
                fail: function(payres) {
                  
                },
                complete: function(payres) {        
                  
                }
              });
            }
                              
          } 
        }
      });
    }else{
      my.ix.startApp({
        appName: 'cashier',
        bizNo: new_out_trade_no,
        totalAmount: that.data.jine,
        success: (res) => {
          console.log(res.barCode)      
          if(res.barCode != undefined){  
            console.log(new_out_trade_no) 
            that.setData({
              show2:false
            });                         
            if(res.codeType=='C') {
              my.navigateTo({
                url: '../chaxunjieguo/chaxunjieguo?device_id='+that.data.device_id+"&pay_action="+that.data.pay_action+"&store_id="+that.data.store_id+"&merchant_id="+that.data.merchant_id+"&out_trade_no="+new_out_trade_no+"&config_id="+that.data.config_id+"&auth_code="+res.barCode+"&total_amount="+that.data.jine+"&codeType="+res.codeType+"&canceljudgement="+true,
              }) 
            }else{
              var data3 = {"device_id": that.data.device_id,"device_type": "face_f4","pay_method":"alipay_face","pay_action":that.data.pay_action,"store_id":that.data.store_id,"merchant_id":that.data.merchant_id,"out_trade_no":new_out_trade_no,"config_id":that.data.config_id,"auth_code":res.barCode,"total_amount":that.data.jine}            
              var str3= app.jsonsortSign(data3)  //键名排序+转换字符串(加密用)  
              var encryptedStr = md5(str3+"&key="+"88888888");//md5加密
              console.log(data3)
              
              my.request({
                url: that.data.Request+"/api/devicepay/all_pay",//*******支付接口***********/
                method: 'POST',
                data: {
                  device_id:that.data.device_id,
                  device_type:'face_f4',
                  pay_method:'alipay_face',
                  pay_action:that.data.pay_action,
                  store_id:that.data.store_id,
                  merchant_id:that.data.merchant_id,
                  out_trade_no:new_out_trade_no,
                  config_id:that.data.config_id,
                  auth_code:res.barCode,
                  total_amount:that.data.jine,
                  sign:encryptedStr
                },
                dataType: 'json',
                success: function(payres) { 
                  console.log(payres.data) 
                  that.setData({
                    out_trade_no:payres.data.out_trade_no,
                    total_amount:payres.data.total_amount,
                    ways_source_desc:payres.data.ways_source_desc,
                    result_msg:payres.data.result_msg,
                    pay_time:payres.data.pay_time,
                    remark:payres.data.remark,
                  })
                  if(payres.data.return_code=="SUCCESS"){//SUCCESS/FALL 此字段是通信标识
                    if (payres.data.result_code == "SUCCESS") {
                      that.setData({
                        out_trade_no:payres.data.out_trade_no,
                        total_amount:payres.data.total_amount,
                        ways_source_desc:payres.data.ways_source_desc,
                        result_msg:payres.data.result_msg,
                        pay_time:payres.data.pay_time,
                        remark:payres.data.remark,
                      })
                      if(checked == true){//判断是否开启打印机
                        // ********--------*********
                        if(print==1){
                          that.dayina()
                          console.log('1遍')
                          console.log('刷脸走这边')
                        }else{
                          that.dayina()
                          that.dayinaa()
                          console.log('2遍')
                        } 
                      }else{

                      }

                      my.ix.onCashierEventReceive((s) => {
                        console.log(s)
                        if (s.status === "RESULT_CLOSE"){
                          console.log('收银台关闭')
                          my.navigateBack({
                            delta:3
                          })
                          my.ix.offCashierEventReceive();
                        } 
                      });
                      
                    }
                  } 
                  
                },
                fail: function(payres) {
                  
                },
                complete: function(payres) {        
                  
                }
              });
            }
                              
          } 
        }
      });
    }
    
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

});
