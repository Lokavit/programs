var app = getApp();
Page({
  data: {},
  onLoad(query) {
    // {mq: "30", paymoney(支付金额): "undefined", qs: "3", shopmoney: "90.00"}
    console.log('fenqiconfirm.js query：',query);
    var bear = my.getStorageSync({ key: 'bear' }).data;
    console.log('fenqiconfirm.js bear：',bear)
    if(bear == "0"){
      this.setData({
        bear:"买家",
      })
    }else{
      this.setData({
        bear:"卖家",
      })
    }
    this.setData({
      paymoney:query.paymoney,
      shopmoney:query.shopmoney,
      qishu:query.qs,
      huankuan:query.mq,
    })
  },
  onShow(){  

    // my.ix.startCodeScan({scanType: "ALL"});//容器10.1.60.1-7可不调用
    // my.ix.onCodeScan((r) => {
    //   console.log(r)
    //   if(r.success){
    //     console.log('code: ' + r.code);
    //     my.ix.offCodeScan()
    //     my.redirectTo({
    //       url: '../huabeichaxun/huabeichaxun?shop_price='+that.data.shopmoney+"&total_amount="+that.data.paymoney+"&hb_fq_num="+that.data.qishu+"&auth_code="+r.code,
    //     })
        
    //   }
          
    // });
  },
  paybutton(){
    var that=this;
    // 收银台播报支付语音
    my.ix.voicePlay({
      eventId: 'e4',
      number: that.data.paymoney,
      success: (r) => {}
    });
    
    // console.log('0000')
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
    
    that.setData({
      new_out_trade_no:new_out_trade_no
    })    
    
    // ******************************随机数***********
    
    // ******************启动收银台**********************
    my.ix.startApp({
      appName: 'cashier',
      bizNo: that.data.new_out_trade_no,
      totalAmount: that.data.paymoney,
      success: (r) => {
        console.log(r.barCode)
        if(r.barCode != undefined){
          my.redirectTo({
            url: '../huabeichaxun/huabeichaxun?shop_price='+that.data.shopmoney+"&total_amount="+that.data.paymoney+"&hb_fq_num="+that.data.qishu+"&auth_code="+r.barCode,
          })
        }
        
      }
    });
  }

});
