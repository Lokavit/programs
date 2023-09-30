var app = getApp();
import md5 from '/utils/md5.js';
Page({
    data: {
         canclick:true,
         show:false,
    },
    onLoad(query) {
        var Request = my.getStorageSync({ key: 'Request' }).data;
        var store_id = my.getStorageSync({ key: 'store_id' }).data;
        var config_id = my.getStorageSync({ key: 'config_id' }).data;
        var merchant_id = my.getStorageSync({ key: 'login_merchant_id' }).data; 
        var device_id = my.getStorageSync({ key: 'device_id' }).data;
       
        var pay_action = my.getStorageSync({ key: 'pay_action' }).data;
        var checked = my.getStorageSync({ key: 'checked' }).data;
        var print = my.getStorageSync({ key: 'print' }).data;
        var token = my.getStorageSync({ key: 'token' }).data; 
        var store_name = my.getStorageSync({ key: 'store_name' }).data;
        var name = my.getStorageSync({ key: 'name' }).data;

        var bizNo = my.getStorageSync({ key: 'bizNo' }).data;
        var posmoney = my.getStorageSync({ key: 'posmoney' }).data;
        // 姓名和手机号处理
        var mb_name=query.mb_name;
        mb_name=mb_name.replace(mb_name.substring(0,1), "*");
        
        var mb_phone = query.mb_phone;
        mb_phone = "" + mb_phone;
        var mb_phone = mb_phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
        console.log(mb_phone);

        var mb_money=Number(query.mb_money).toFixed(2)
        var jine=Number(query.jine).toFixed(2)
        console.log(mb_money,jine)

        
        this.setData({
            Request,
            token,
            balance:mb_money,
            paymoney:jine,
            yybbjine:query.jine,//语音播报金额
            mb_id:query.mb_id,
            buyerId:query.buyerId,
            mb_name,
            mb_phone,            
            device_id,
            pay_action,
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
      my.setStorageSync({key: 'mb_id',data: query.mb_id});
      my.setStorageSync({key: 'buyerId',data: query.buyerId});
      my.setStorageSync({key: 'paymoney',data: jine});
      my.setStorageSync({key: 'mb_name',data: mb_name});
      my.setStorageSync({key: 'mb_phone',data: mb_phone});
    //   my.setStorageSync({key: 'mb_money',data: mb_money});

       if(Number(this.data.paymoney)>Number(this.data.balance)){
            my.ix.speech({
            text: '会员余额不足请充值',
            success: (r) => {
            }
            });
            this.setData({
                text:"余额不足",
                font:"redfont",
                faceshow:true
            })
      }else{
        let text=this.data.balance
        this.setData({
             text,
             font:'',
             faceshow:false
         })
      }
    
    },

    onShow(){
        var that=this;
        // 判断是会员充值还是立即支付
        console.log(typeof(that.data.paymoney),typeof(that.data.balance))
        console.log(Number(that.data.paymoney),Number(that.data.balance))
        if(Number(that.data.paymoney)>Number(that.data.balance)){
            that.setData({
                payaction:"会员充值",
                show:false
            })
        }else{
            that.setData({
                payaction:"立即支付"
            })
        }

    },
    recharge(){   
        var  that=this
        // var mb_money = my.getStorageSync({ key: 'mb_money' }).data;
        var paymoney = my.getStorageSync({ key: 'paymoney' }).data;//输入的金额
        var mb_phone = my.getStorageSync({ key: 'mb_phone' }).data;//输入的金额
        var mb_name = my.getStorageSync({ key: 'mb_name' }).data;//输入的金额

        var checked = my.getStorageSync({ key: 'checked' }).data;
        var print = my.getStorageSync({ key: 'print' }).data;
        var get_mb_money=Number(that.data.balance)
        that.setData({
          balance:get_mb_money,
          paymoney,
          mb_name,
          mb_phone,
        })
        console.log(typeof(that.data.paymoney),typeof(that.data.balance))
        //   会员充值  支付金额/会员余额
        if(Number(that.data.paymoney)>Number(that.data.balance)){
            my.redirectTo({
                url: '../recharge/recharge?balance='+that.data.balance+'&mb_id='+that.data.mb_id+'&config_id='+that.data.config_id+'&merchant_id='+that.data.merchant_id+'&buyerId='+that.data.buyerId+'&paymoney='+that.data.paymoney+'&mb_name='+that.data.mb_name+'&mb_phone='+that.data.mb_phone
            })         
        }else{ //会员卡支付
            console.log("会员卡支付");
            // *******会员卡支付接口***********
              console.log(that.data.canclick,that.data.show)
            if(that.data.canclick){
                that.setData({
                    canclick:false,
                    show:true,
                    payaction:''
                });
                my.request({
                  url:that.data.Request+"/api/member/member_pay_submit",
                  method: 'POST',
                  data: {
                      token:that.data.token,
                      store_id:that.data.store_id,  //门店ID         
                      merchant_id:that.data.merchant_id,//收银员ID
                      device_id:that.data.device_id, //设备ID
                      device_type:'face_f4',  //设备类型            
                      total_amount:that.data.paymoney,  //订单金额
                      pay_amount:that.data.paymoney,//支付金额
                      open_id:that.data.buyerId, //支付宝/微信用户id
                      mb_id:that.data.mb_id,    //会员ID     
                  },
                  dataType: 'json',
                  success: res=> { 
                      console.log(res.data);
                      
                      // 会员卡支付成功
                      if(res.data.status==1){
                          console.log(res.data.message);
                          var balance=this.data.balance-res.data.data.pay_amount;//会员余额
                          that.setData({
                          balance,
                          total_amount:res.data.data.pay_amount,
                          out_trade_no:res.data.data.out_trade_no,
                          result_msg:res.data.message,
                          pay_time:res.data.data.pay_time,
                          })
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
                          my.navigateTo({
                              url:'/pages/membersuccess/membersuccess?payMoney='+res.data.data.pay_amount+'&out_trade_no='+res.data.data.out_trade_no+'&pay_time='+res.data.data.pay_time+'&mb_phone='+res.data.data.mb_phone+"&message="+res.data.message+'&merchant_id='+that.data.merchant_id+'&buyerId='+that.data.buyerId+'&mb_name='+res.data.data.mb_name
                          },() =>{
                            that.setData({
                              canclick:true
                            });
                          });
                          
                      }else{ // 会员卡支付失败
                        console.log(res.data.message);
                        that.setData({
                          canclick:true
                        });
                        my.setStorageSync({key: 'kx_status',data: 0});
                        my.ix.tinyCommand({
                          target:"pos",  
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
                  fail:res=> {
                                  
                  },
                  complete: res=> {        
                             
                  }
              });
            }
        }
          
    },

    //   刷脸支付
    facepay(){ 
        var that=this;
        var new_out_trade_no=that.text();
        console.log(new_out_trade_no) ;
        if(that.data.paymoney != undefined &&that.data.paymoney != "0" && that.data.paymoney!= "0.0"){
            // 开启收银台
            my.ix.startApp({
                appName: 'cashier',
                bizNo: new_out_trade_no,
                totalAmount: that.data.yybbjine,
                success: (res) => {
                    console.log(res.barCode)      
                    if(res.barCode != undefined){                             
                        if(res.codeType=='C') { //扫码
                            my.navigateTo({
                                url: '../chaxunjieguo/chaxunjieguo?device_id='+that.data.device_id+"&pay_action="+that.data.pay_action+"&store_id="+that.data.store_id+"&merchant_id="+that.data.merchant_id+"&out_trade_no="+new_out_trade_no+"&config_id="+that.data.config_id+"&auth_code="+res.barCode+"&total_amount="+that.data.paymoney+"&codeType="+res.codeType+"&canceljudgement="+true,
                            }) 
                        }else{ //刷脸
                            var data3 = {"device_id": that.data.device_id,"device_type": "face_f4","pay_method":"alipay_face","pay_action":that.data.pay_action,"store_id":that.data.store_id,"merchant_id":that.data.merchant_id,"out_trade_no":new_out_trade_no,"config_id":that.data.config_id,"auth_code":res.barCode,"total_amount": that.data.paymoney}            
                            var str3= app.jsonsortSign(data3)  //键名排序+转换字符串(加密用)  
                            var encryptedStr = md5(str3+"&key="+"88888888");//md5加密
                        
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
                                    total_amount:that.data.paymoney,
                                    sign:encryptedStr
                                },
                                dataType: 'json',
                                success: (payres)=> { 
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
                                            if(that.data.checked == true){//判断是否开启打印机
                                                // ********--------*********
                                                if(that.data.print==1){
                                                    that.dayina()
                                                    console.log('1遍')
                                                    console.log('刷脸走这边')
                                                }else{
                                                    that.dayina()
                                                    that.dayinaa()
                                                    console.log('2遍')
                                                } 
                                            }else{  }
                                            my.navigateBack({
                                              delta:3
                                            })
                                        }
                                    } 
                                
                                },
                                fail: function(payres) {  },
                                complete: function(payres) {        }
                            });
                        }                   
                    } 
                }
            });
        }
    },
    //   封装的商业流水号
    text(){
        var date=new Date();
        var year=date.getFullYear();
        var mon=date.getMonth()+1;
        var day=date.getDate();
        var hour=date.getMinutes();
        var min=date.getSeconds();
        var arr=[];
        for(var i=0;i<6;i++){
            var num=parseInt(Math.random()*9);
            arr.push(num);
        }
        var new_out_trade_no=year+""+mon+""+day+""+hour+""+min+""+arr.join("");
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
            { 'cmd': 'addText', 'args': ['支付方式:会员卡支付'] },
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
