Page({
  data: {
    opacity:0
  },
  onLoad(query) {
    var device_id = my.getStorageSync({ key: 'device_id' }).data;
   
    var pay_action = my.getStorageSync({ key: 'pay_action' }).data;
    var store_id = my.getStorageSync({ key: 'store_id' }).data;
    var merchant_id = my.getStorageSync({ key: 'merchant_id' }).data;
    var config_id = my.getStorageSync({ key: 'config_id' }).data;
    
    // var bjimg=JSON.parse(background)    
    this.setData({
      device_id:device_id,    
      pay_action:pay_action,
      store_id:store_id,
      merchant_id:merchant_id,
      config_id:config_id,
      merchant_id:merchant_id,                  
    }) 
    
  },
  jineTap(e){
    this.setData({
      jine:e.detail.value,      
    })
    if(e.detail.value == ''){
      this.setData({
        opacity:0
      })  
    }else{
      this.setData({
        opacity:1
      })
    }
  },
  shoukuan(){
    my.setStorageSync({key: 'gudingjine',data: this.data.jine});
    var that=this;
    console.log('0000')
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
    // 收银台播报支付语音
    my.ix.voicePlay({
      eventId: 'e4',
      number: that.data.jine,
      success: (r) => {}
    });
    // ******************启动收银台**********************
    // my.ix.startApp({
    //   appName: 'cashier',
    //   bizNo: that.data.new_out_trade_no,
    //   totalAmount: that.data.jine,
    //   success: (r) => {
    //     console.log(r.barCode)
    //     my.redirectTo({
    //       url: '../chaxunjieguo/chaxunjieguo?shop_price='+that.data.shopmoney+"&total_amount="+that.data.jine+"&hb_fq_num="+that.data.qishu+"&auth_code="+r.barCode,
    //     })
    //   }
    // });

    // ***********
    // ******************启动收银台**********************
    my.ix.startApp({
      appName: 'cashier',
      bizNo: that.data.new_out_trade_no,
      totalAmount: that.data.jine,
      success: (res) => {
        console.log(res.barCode)                 
        my.redirectTo({
          url: '../chaxunjieguo/chaxunjieguo?device_id='+that.data.device_id+"&pay_action="+that.data.pay_action+"&store_id="+that.data.store_id+"&merchant_id="+that.data.merchant_id+"&out_trade_no="+that.data.out_trade_no+"&config_id="+that.data.config_id+"&auth_code="+res.barCode+"&total_amount="+that.data.jine+"&codeType="+res.codeType+"&canceljudgement="+true,
        })
        
      }
    });
  }
});
