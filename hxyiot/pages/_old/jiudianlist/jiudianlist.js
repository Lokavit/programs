// pages/shoukuanjilu/shoukuanjilu.js
var app = getApp()
var url = app.globalData.HOST +  'alipayapp/'
Page({
  data: {
    show: 1,
    mask: 1,
    p:1,
    noOrder:0,
    firstImg: '../../img/xuanzhong.png',
    noCurImg: '../../img/weixuanzhong.png',
    hasCurImg: '../../img/xuanzhong.png',
    outtrade:'订单号查询',
    showout:1,
  },
  onLoad() {
    var that = this
    var token = my.getStorageSync({ key: 'token' }).data;
    var Request = my.getStorageSync({ key: 'Request' }).data;
    var store_id = my.getStorageSync({ key: 'store_id' }).data;
    
    that.setData({
      token:token,
      Request:Request,      
      storeid:store_id,
    })
    // 显示加载图标
    
    // my.showLoading({
    //   content: '加载中...',
    // });
    
    
  },
  detail(e){
    my.navigateTo({
      url: '../jiudianxiangqing/jiudianxiangqing?out_trade_no=' +e.currentTarget.dataset.outtradeno+'&out_order_no='+e.currentTarget.dataset.outorderno,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onReady () {
    // Do something when page ready.
  },
  onShow () {
    my.ix.startCodeScan({scanType: "ALL"});//容器10.1.60.1-7可不调用
    my.ix.onCodeScan((r) => {
      console.log(r)
      if(r.success){
        console.log('code: ' + r.code);
        my.ix.offCodeScan()
        this.setData({
          out_order_no: r.code,
          color:1
        })
        
      }
          
    });
    var that=this
    my.request({
      url: that.data.Request+"/api/deposit/pay_order_list",
      method: 'POST',
      data: {
        token: that.data.token,
        // store_id: storeid,
        // merchant_id: merchantid,
        // time_start: starttime,
        // time_end: endtime,
        p: '1',
        l: '15'
      },
      dataType: 'json',
      success(res) {
        console.log(res.data)
        // 隐藏加载框
        my.hideLoading();
        if (res.data.status == 1) {
          
          if (res.data.t == 0) {
            that.setData({
              collectmoney: '',
              noOrder: 1,
            })
          } else {
            var p = that.data.p + 1
            that.setData({
              collectmoney: res.data.data,
              p: p,
              count: res.data.t
            })

            var allOrder = that.data.collectmoney
            var changedOrder = {}

            for (var i = 0; i < allOrder.length; i++) {
              var ways_source = allOrder[i].ways_source

              switch (ways_source) {
                case "weixin":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/weixinzhifu.png";
                  break;
                case "alipay":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/zhifubaozhifu.png";
                  break;
                case "unionpay":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/yunshanfu.png";
                  break;
                case "jd":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/jindongzhifu.png  ";
                  break;
              }

              that.setData(changedOrder)
            }
          }
        }

      }
    })
  },
  onHide () {
    // Do something when page hide.
  },
  onUnload () {
    // Do something when page close.
  },
  outtrade(){
    this.setData({
      showout: 0,
      mask: 0
    })
  },
  // 查询订单号
  outbind:function(){
    var that = this
    // my.showLoading({
    //   content: '加载中...',
    // });
    my.navigateTo({
      url: '../jiudianxiangqing/jiudianxiangqing?out_trade_no=' + that.data.out_order_no,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    that.setData({
      showout: 1,
      mask: 1,
      out_trade_no:''
    })
  },
  // 输入订单号input
  tradeTap(e){
    console.log(e)
    if (e.detail.value !=''){
      this.setData({
        out_order_no: e.detail.value,
        color:1
      })
    }else{
      this.setData({        
        color: 0
      })
    }
    
  },

  // 移除店员  
  removeStall () {
    this.setData({
      show: 0,
      mask: 0
    })
  },
  choiceCancel () {
    this.setData({
      show: 1,
      mask: 1
    })
  },
  removeTrue () {
    my.navigateTo({
      url: '../mendianyuangong/mendianyuangong',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }, 
  totalStore(){
    this.setData({
      show: 0,
      mask: 0,
      firstImg: '../../img/xuanzhong.png',
      storeid: '',
      merchantid: ''
    })
    var that=this

    my.request({
      url: that.data.Request+"/api/merchant/store_lists",
      data: {
        token: this.data.token,
        l:200
      },
      success(res) {
        console.log(res.data)
        if (res.data.status == 1) {
          that.setData({
            storeArry: res.data.data
          })          
        }
      }
    })
  },
  // 选择门店--------------------------------------------------------------
  storeItem(e){
    //console.log(e)
    var that=this
    if (e.currentTarget.dataset.storeid == ''){
      that.setData({
        storeid: '',
        merchantid:''
      })
    }else{
      that.setData({
        storeid: e.currentTarget.dataset.storeid,
        choicename: e.currentTarget.dataset.storename,
      })
    }
    

    if (e.currentTarget.dataset.index == '10000'){
      that.setData({        
        firstImg: '../../img/xuanzhong.png',
        dataIndex: e.currentTarget.dataset.index
      })
      var storeArry = that.data.storeArry
      var idx = e.currentTarget.dataset.index

      var changed2 = {}
      for (var i = 0; i < storeArry.length; i++) {
        if (idx == i) {
          changed2['storeArry[' + i + '].show1'] = false
          changed2['storeArry[' + i + '].imgUrl'] = that.data.hasCurImg
        } else {
          changed2['storeArry[' + i + '].show1'] = false
          changed2['storeArry[' + i + '].imgUrl'] = that.data.noCurImg
          changed2['storeArry[' + i + '].show'] = false
        }
      }
      //console.log(changed2)
      that.setData(changed2)
    }else{
      that.setData({
        dataIndex: e.currentTarget.dataset.index
      })
      my.request({
        url: that.data.Request+"/api/merchant/merchant_lists",
        data: {
          token: this.data.token,
          store_id: e.currentTarget.dataset.storeid
        },
        success(res) {
          //console.log(res.data)
          if (res.data.status == 1) {
            that.setData({
              merchantArry: res.data.data,
              idx: e.currentTarget.dataset.index,
              firstImg: that.data.noCurImg,
            })
            var storeArry = that.data.storeArry
            var idx = e.currentTarget.dataset.index

            var changed2 = {}
            for (var i = 0; i < storeArry.length; i++) {
              if (idx == i) {
                changed2['storeArry[' + i + '].show1'] = true
                changed2['storeArry[' + i + '].imgUrl'] = that.data.hasCurImg
              } else {
                changed2['storeArry[' + i + '].show1'] = false
                changed2['storeArry[' + i + '].imgUrl'] = that.data.noCurImg
                changed2['storeArry[' + i + '].show'] = false
              }
            }
            //console.log(changed2)
            that.setData(changed2)
          }
        }
      })
    }
    
    
  },
  // 展示店员--------------------------------------------------------
  merchantTab(e){
    //console.log(e.currentTarget.dataset.index)

    var that = this
    var storeArry = that.data.storeArry
    var idx = e.currentTarget.dataset.index

    var changed = {}
    for (var i = 0; i < storeArry.length; i++) {
      if (idx == i) {
        if (storeArry[i].show) {
          changed['storeArry[' + i + '].show'] = false
        } else {
          changed['storeArry[' + i + '].show'] = true
        }
      }
    }
    //console.log(changed)
    that.setData(changed)
  },
  // 选择店员-------------------------
  merchantItem(e){
    // console.log(e.currentTarget.dataset.index)
    var that = this
    that.setData({
      merchantid: e.currentTarget.dataset.merchantid,
      choicename: e.currentTarget.dataset.name
    })
    var merchantArry = that.data.merchantArry
    var idx = e.currentTarget.dataset.index

    var changed3 = {}
    for (var i = 0; i < merchantArry.length; i++) {    
      if (idx == i) {        
        if (merchantArry[i].show2) {
          changed3['merchantArry[' + i + '].show2'] = false
        } else {
          changed3['merchantArry[' + i + '].show2'] = true
        }
      }else{
        changed3['merchantArry[' + i + '].show2'] = false
      }
    }
    // console.log(changed3)
    that.setData(changed3)
  },

  search(){
    my.navigateTo({
      url: '../jiudianzidingyi/jiudianzidingyi',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  btnSure(){
    var that=this
    this.setData({
      show: 1,
      mask: 1
    })
    if (that.data.dataIndex == '10000'){
      that.setData({
        totalStore: '全部门店'
      })
    }else{
      that.setData({
        totalStore: that.data.choicename
      })
    }

    if (that.data.storeid==''){
      that.setData({
        totalStore: '全部门店'
      })
    }
    
    my.request({
      url: that.data.Request+"/api/deposit/pay_order_list",
      data: {
        token: this.data.token,
        store_id: this.data.storeid,
        merchant_id: this.data.merchantid,
        p:'1',
        l:'15'
      },
      success(res) {
        console.log(res.data)
        if (res.data.status == 1) {
          if (res.data.t == 0){
            that.setData({
              collectmoney:'',
              noOrder: 1,
              show: 1,
              mask: 1,
            })
          }else{
            var p = 2
            that.setData({
              collectmoney: res.data.data,
              noOrder: 0,
              p:p,
              count:res.data.t,
            })

            var allOrder = that.data.collectmoney
            var changedOrder = {}

            for (var i = 0; i < allOrder.length; i++) {
              var ways_source = allOrder[i].ways_source
              switch (ways_source) {
                case "weixin":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/weixinzhifu.png";
                  break;
                case "alipay":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/zhifubaozhifu.png";
                  break;
                case "unionpay":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/yunshanfu.png";
                  break;
                case "jd":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/jindongzhifu.png  ";
                  break;
              }
              that.setData(changedOrder)


            }
            that.setData({
              show: 1,
              mask: 1,
            })
          }
          
        }else{
          that.setData({
            noOrder:1
          })
        }
      }
    })
  },

  onPullDownRefresh() {
    var that=this
    my.request({
      url: that.data.Request+"/api/deposit/pay_order_list",
      data: {
        token: this.data.token,
        store_id: this.data.storeid,
        merchant_id: this.data.merchantid,
        p: '1',
        l: '15'
      },
      success(res) {
        // console.log(res.data)
        my.stopPullDownRefresh()
        
        if (res.data.status == 1) {

          if (res.data.t == 0) {
            that.setData({
              collectmoney: '',
              noOrder: 1,
            })
          } else {
            var p = that.data.p + 1
            that.setData({
              collectmoney: res.data.data,
              // p: p,
              count: res.data.t
            })

            var allOrder = that.data.collectmoney
            var changedOrder = {}

            for (var i = 0; i < allOrder.length; i++) {
              var ways_source = allOrder[i].ways_source
              switch (ways_source) {
                case "weixin":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/weixinzhifu.png";
                  break;
                case "alipay":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/zhifubaozhifu.png";
                  break;
                case "unionpay":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/yunshanfu.png";
                  break;
                case "jd":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/jindongzhifu.png  ";
                  break;
              }
              that.setData(changedOrder)
            }
          }
        }

      }
    })
    
  },

  onReachBottom(){
    // //console.log('加载更多')
    // 显示加载图标
    my.showLoading({
      content: '加载中...',
    })

    var that = this   
    var p=that.data.p 
    
    var a = that.data.count / 15
    var p1 = Math.ceil(a)
    // //console.log(p1)
    if(p <= p1){
      my.request({
        url: that.data.Request+"/api/deposit/pay_order_list",
        data: {
          token: this.data.token,
          store_id: this.data.storeid,
          merchant_id: this.data.merchantid,
          // time_start: this.data.starttime,
          // time_end: this.data.endtime,
          p: p,
          l: '15'
        },
        success(res) {
          // 隐藏加载框
          my.hideLoading();
          console.log(res.data)
          if (res.data.status == 1) {
            var collectmoney = that.data.collectmoney
            for (var j = 0; j < res.data.data.length; j++) {
              collectmoney.push(res.data.data[j])
            }
            var p = that.data.p + 1
            that.setData({
              collectmoney: collectmoney,
              p: p
            })

            var allOrder = that.data.collectmoney
            // //console.log(allOrder)
            var changedOrder = {}

            for (var i = 0; i < allOrder.length; i++) {
              var ways_source = allOrder[i].ways_source
              switch (ways_source) {
                case "weixin":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/weixinzhifu.png";
                  break;
                case "alipay":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/zhifubaozhifu.png";
                  break;
                case "unionpay":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/yunshanfu.png";
                  break;
                case "jd":
                  changedOrder['collectmoney[' + i + '].payIconSrc'] = "../../img/jindongzhifu.png  ";
                  break;
              }
              that.setData(changedOrder)
            }
          }else{
            that.setData({
              noOrder:1
            })
          }

        }
      })
    }else{
      // 隐藏加载框
      my.hideLoading();
      that.setData({
        noOrder:1
      })
    }
    


    
  }


})
