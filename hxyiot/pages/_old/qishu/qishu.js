Page({
  data: {
    bg:'',
    // data:[
    //   {
    //     hb_fq_num:"3",
    //     hb_mq_h:"300",
    //     hb_fq_sxf:''
    //   },
    //   {
    //     hb_fq_num:"3",
    //     hb_mq_h:"100",
    //     hb_fq_sxf:''
    //   },
    //   {
    //     hb_fq_num:"3",
    //     hb_mq_h:"300",
    //     hb_fq_sxf:''
    //   },
    //   {
    //     hb_fq_num:"3",
    //     hb_mq_h:"30",
    //     hb_fq_sxf:'00'
    //   }
    // ],
    fee_cur:'',
  },

  onLoad(query) {
    this.setData({
      total_money:query.total_money,
      shop_money:query.total_money,
    })
   
    var Request = my.getStorageSync({ key: 'Request' }).data;
    var token = my.getStorageSync({ key: 'token' }).data;
    var store_id = my.getStorageSync({ key: 'store_id' }).data;
    var bear = my.getStorageSync({ key: 'bear' }).data;
    var that=this
    console.log(bear)
    my.request({
      url: that.data.Request+"/api/merchant/fq/hb_query_rate",
      method: 'POST',
      data: {
        token:token,
        store_id:store_id,
        hb_fq_seller_percent:bear,
        shop_price:that.data.total_money
      },
      dataType: 'json',
      success: function(res) {
        console.log(res.data.data)
        var fenqi=res.data.data
        
        for (var i = 0; i < fenqi.length; i++) {

          if(fenqi[i].hb_fq_sxf == '0.00'){
            fenqi[i].hbfq = '0服务费'
          }else{
            fenqi[i].hbfq = '含服务费'
          }

        }

        that.setData({
          data:res.data.data
        })
      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {
        console.log(res)
      }
    });
  },
  onShow() {
    
  },

  fenqiTap(event){
    var data=this.data.data
    var idx=event.currentTarget.dataset.id
    var amount=event.currentTarget.dataset.amount
    this.setData({   
      total_money: amount,  
      qs:event.currentTarget.dataset.qs,
      mq:event.currentTarget.dataset.mq,
    })
    var changed = {}
    // console.log(idx)
    // console.log(data)
    var that=this
    
    for (var i = 0; i < data.length; i++) {
      if (idx == i) {
        changed['data[' + i + '].fee_cur'] = 'fee_cur'
        
      } else {
        changed['data[' + i + '].fee_cur'] = ''
      }
    }
    // console.log(changed)
    that.setData(changed)
    this.setData({
      bg:"bgcolor"
    })
  },

  button(e){
    var that=this
    if(this.data.bg=="bgcolor"){
      
      my.navigateTo({
        url: '../fenqiconfirm/fenqiconfirm?shopmoney='+that.data.shop_money+"&paymoney="+that.data.total_money+"&qs="+that.data.qs+"&mq="+that.data.mq
      })
    }
  }
});
