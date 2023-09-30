
var app = getApp()
// var url = app.globalData.yuming 'weixinapp/'

Page({
  data: {
    show: 1,
    shows: 1,
    mask: 1,
    showout:1,
    showpay:1,
    totalstorecon: '全部门店',   


    firstImg: '../../img/xuanzhong.png',
    noCurImg: '../../img/weixuanzhong.png',
    hasCurImg: '../../img/xuanzhong.png',

    storeid: '',
    merchantid: '',
    payIndex:'1000',
    paystatus:'1000',
    totalShow:0,

    outtrade: '订单号查询',
    choicename:'',
    orderstate:"请选择",
    payway:"请选择",

    payways:[
      {
        name:"支付宝",
        status:'alipay'
      },
      {
        name:"微信支付",
        status:'weixin'
      },
      {
        name:"刷卡支付",
        status:'unionpay'
      },
      
    ],
    searchstatus:[
      {
        name:"押金冻结中",
        status:'1-2'
      },
      {
        name:"预授权完成",
        status:'1-1'
      },
      {
        name:"预授权失败",
        status:'3-2'
      },
      {
        name:"已撤销",
        status:'4-2'
      },
      {
        name:"已退款",
        status:'1-4'
      },
    ],

    starttime:"",
    endtime:"",
    start_time:'请选择',
    end_time:'请选择',
    color: 0,
    p:1,
    noOrder:0,


    ordercolor:0,
    waycolor:0,
    startcolor:0,
    endcolor:0,

    pay_order_status:'',
    pay_ways_source:''
  },
  onLoad(query) {
    var nowdate = new Date();
    nowdate.setMonth(nowdate.getMonth());
    var y = nowdate.getFullYear();
    var mon = nowdate.getMonth() + 1;
    var d = nowdate.getDate();
    var h = '00';
    var m = '00';
    var s='00';
    var curh = nowdate.getHours()<10?"0"+nowdate.getHours():nowdate.getHours();      
    var curm = nowdate.getMinutes()<10?"0"+nowdate.getMinutes():nowdate.getMinutes();    
    var curs =nowdate.getSeconds()<10?"0"+nowdate.getSeconds():nowdate.getSeconds();    
    var curDate
    var todayData
    if(mon.toString().length<2 && d.toString().length<2){
      todayData=y+'-0'+mon+'-0'+d+' '+h+':'+m+':'+s
      curDate=y+'-0'+mon+'-0'+d+' '+curh+':'+curm+':'+curs
    }else if(d.toString().length<2){
      todayData=y+'-'+mon+'-0'+d+' '+h+':'+m+':'+s
      curDate=y+'-'+mon+'-0'+d+' '+curh+':'+curm+':'+curs
    }else if(mon.toString().length<2){
      todayData=y+'-0'+mon+'-'+d+' '+h+':'+m+':'+s
      curDate=y+'-0'+mon+'-'+d+' '+curh+':'+curm+':'+curs
    }else{
      todayData=y+'-'+mon+'-'+d+' '+h+':'+m+':'+s
      curDate=y+'-'+mon+'-'+d+' '+curh+':'+curm+':'+curs
    }
    console.log(todayData,curDate)


    var token = my.getStorageSync('token');
    this.setData({
      token,
      todayData,
      start_time:todayData,
      end_time:curDate,
      starttime:todayData,
      endtime:curDate,
      startcolor:1,
      endcolor:1
    })
    

    var that=this

    var token = my.getStorageSync({ key: 'token' }).data;
    var Request = my.getStorageSync({ key: 'Request' }).data;
    that.setData({
      token:token,
      Request:Request,      
    })
   
  },
  
  onReady: function () {
    // Do something when page ready.
  },
  onShow: function () {
    // Do something when page show.
    var appname = my.getStorageSync('appname');
    this.setData({
      appname: appname
    })

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
  },
  onHide: function () {
    // Do something when page hide.
  },
  onUnload: function () {
    // Do something when page close.
  },

  // 移除店员 
  choiceCancel: function () {
    this.setData({
      show: 1,
      shows: 1,
      mask: 1
    })
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
    
    that.setData({
      showout: 1,
      mask: 1
    })
   
    if (that.data.color == 1){
      my.navigateTo({
        url: '../jiudianxiangqing/jiudianxiangqing?out_trade_no=' + that.data.out_order_no,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
      
    }
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
  // *************请求门店接口显示出来*************
  totalStore() {
    console.log('000')
    this.setData({
      show: 0,
      mask: 0,
      showpay:1,
      shows:1,
      firstImg: '../../img/xuanzhong.png',
      storeid: '',
      merchantid: ''
    })
    var that = this

    my.request({
      url: that.data.Request+"/api/merchant/store_lists",
      data: {
        token: this.data.token,
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
  storeItem(e) {
    //console.log(e)
    var that = this
    if (e.currentTarget.dataset.storeid == '') {
      that.setData({
        storeid: '',
        merchantid: ''
      })
    } else {
      that.setData({
        storeid: e.currentTarget.dataset.storeid,
        choicename: e.currentTarget.dataset.storename,
      })
    }
    
    //console.log(e.currentTarget.dataset.index)
    my.setStorageSync('storeidkey', that.data.storeid)
    if (e.currentTarget.dataset.index == '10000') {
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
    } else {
      that.setData({
        firstImg: '../../img/weixuanzhong.png',
        dataIndex: e.currentTarget.dataset.index
      })
      my.request({
        url: that.data.Request+"/api/merchant/merchant_lists",
        data: {
          token: this.data.token,
          store_id: e.currentTarget.dataset.storeid
        },
        success(res) {
          console.log(res.data)
          if (res.data.status == 1) {
            that.setData({
              merchantArry: res.data.data,
              idx: e.currentTarget.dataset.index,
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
  merchantTab(e) {
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
  merchantItem(e) {
    //console.log(e.currentTarget.dataset.name)
    var that = this
    that.setData({
      merchantid: e.currentTarget.dataset.merchantid,
      choicename: e.currentTarget.dataset.name
    })
    my.setStorageSync('merchantidkey', that.data.merchantid)
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
    //console.log(changed3)
    that.setData(changed3)
  },
  btnSure() {//确定查询*****************
    this.setData({
      show: 1,
      mask: 1
    })
    //console.log(this.data.dataIndex)
    if (this.data.dataIndex == '10000') {
      this.setData({
        totalstorecon: '全部门店'
      })
    } else {
      this.setData({
        totalstorecon: this.data.choicename
      })
    }
    if (this.data.storeid == '') {
      this.setData({
        totalstorecon: '全部门店'
      })
    }
  },
  

  scanTap() {
    console.log('000')    

    my.ix.codeScan({
      success: (r) => {
          console.log('code: ' + r.code);
      },
      fail: (r) => {
          console.log('error: ' + r.errorMessage);
      }
    });
    my.ix.onCodeScan((r) => {
      if(r.success)
        console.log('code: ' + r.code);
    });
  },
  // 详情-------------
  detail(e) {
    //console.log(e)
    my.navigateTo({
      url: '../jiudianxiangqing/jiudianxiangqing?out_trade_no=' +e.currentTarget.dataset.outtradeno+'&out_order_no='+e.currentTarget.dataset.outorderno,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  

  onReachBottom: function () {
    // //console.log('加载更多')
    // 显示加载图标
    my.showLoading({
      content: '加载中...',
    })

    var that = this
    var p = that.data.p

    var a = that.data.count / 15
    var p1 = Math.ceil(a)
    console.log(p)
    if (p <= p1) {
      my.request({
        url: that.data.Request+"/api/merchant/fq/order",
        data: {
          token: that.data.token,
          store_id: that.data.storeid,
          merchant_id: that.data.merchantid,
          ways_source:that.data.paystatus,
          order_status:that.data.payIndex,
          time_start: that.data.starttime,
          time_end: that.data.endtime,
          return_type:'02',
          p: p,
          l: '15'
        },
        success(res) {

          console.log(res.data)
          if (res.data.status == 1) {
            // 隐藏加载框
            my.hideLoading();

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
          }

        }
      })
    } else {
      // 隐藏加载框
      my.hideLoading();
      that.setData({
        noOrder: 1
      })
    }

  },

  // ***********订单状态************
  orderstateTap(){
    this.setData({
      shows:0,
      mask:0,
    })
  },
  paystatusTap(e){
    console.log(e)
    var that=this
    
    var searchstatus = that.data.searchstatus
    var idx = e.currentTarget.dataset.index
    if(idx == '1000'){
      that.setData({
        firstImg: '../../img/xuanzhong.png',
        paystatus: e.currentTarget.dataset.index,
        paystatusname:e.currentTarget.dataset.payname,
        pay_order_status:e.currentTarget.dataset.paystatus,
      })
    }else{
      that.setData({
        firstImg: '../../img/weixuanzhong.png',
        paystatus: e.currentTarget.dataset.index,
        paystatusname:e.currentTarget.dataset.payname,
        pay_order_status:e.currentTarget.dataset.paystatus,
      })
    }
    var changed2 = {}
    for (var i = 0; i < searchstatus.length; i++) {
      if (idx == i) {
        changed2['searchstatus[' + i + '].payUrl'] = that.data.hasCurImg
      } else {
        changed2['searchstatus[' + i + '].payUrl'] = that.data.noCurImg
      }
    }
    //console.log(changed2)
    that.setData(changed2)
  },
  paybtnSure(){
    this.setData({
      shows: 1,
      mask: 1,
      ordercolor:1
    })
    //console.log(this.data.dataIndex)
    if (this.data.paystatus == '1000') {
      this.setData({
        orderstate: '全部状态'
      })
    } else {
      this.setData({
        orderstate: this.data.paystatusname
      })
    }
    
  },
  // ***********订单状态************
  // *************支付方式*********
  paywayTap(){
    this.setData({
      showpay:0,
      mask:0,
    })
  },
  paywaysTap(e){
    // console.log(e)
    var that=this
    
    var payways = that.data.payways
    var idx = e.currentTarget.dataset.index
    if(idx == '1000'){
      that.setData({
        firstImg: '../../img/xuanzhong.png',
        payIndex: e.currentTarget.dataset.index,
        ways_source:e.currentTarget.dataset.payname,
        pay_ways_source:e.currentTarget.dataset.paystatus,
      })
    }else{
      that.setData({
        firstImg: '../../img/weixuanzhong.png',
        payIndex: e.currentTarget.dataset.index,
        ways_source:e.currentTarget.dataset.payname,
        pay_ways_source:e.currentTarget.dataset.paystatus,
      })
    }
    var changed2 = {}
    for (var i = 0; i < payways.length; i++) {
      if (idx == i) {
        changed2['payways[' + i + '].payUrl'] = that.data.hasCurImg
      } else {
        changed2['payways[' + i + '].payUrl'] = that.data.noCurImg
      }
    }
    //console.log(changed2)
    that.setData(changed2)
  },
  paywaybtnSure(){
    this.setData({
      showpay: 1,
      mask: 1,
      waycolor:1
    })
    
    if (this.data.payIndex == '1000') {
      this.setData({
        payway: '全部方式'
      })
    } else {
      this.setData({
        payway: this.data.ways_source
      })
    }
  },
  // *************支付方式*********

  //自定义查询按钮事件
  search(){
    var that=this
    var storeid=that.data.storeid
    var merchantid=that.data.merchantid
    var endtime = that.data.endtime
    var starttime = that.data.starttime
    var oDate1 = new Date(starttime);
    var oDate2 = new Date(endtime);

    console.log(that.data.storeid)
    console.log(that.data.merchantid)
    console.log(that.data.pay_order_status)//订单状态
    console.log(that.data.pay_ways_source)//支付方式
    console.log(that.data.starttime)
    console.log(that.data.endtime)
    if(that.data.pay_order_status != undefined && that.data.pay_ways_source != undefined && that.data.starttime != '' && that.data.endtime != ''){
      console.log('0000')
      if (oDate1.getTime() > oDate2.getTime()){
        my.alert({
          title: '提示',
          content: '开始时间不能大于结束时间',
          buttonText: '我知道了',
          success: () => {
            
          },
        });
        
      } else if (oDate1.getTime() == oDate2.getTime()){
      
        my.alert({
          title: '提示',
          content: '开始时间不能等于结束时间',
          buttonText: '我知道了',
          success: () => {
            
          },
        });
        
      }else{
      
        // 显示加载图标
        my.showLoading({
          content: '加载中...',
        })
        this.setData({
          totalShow:1
        })
        if(that.data.pay_order_status == '1000' && that.data.pay_ways_source == '1000'){
          my.request({
            url: that.data.Request+"/api/deposit/pay_order_list",
            method: 'POST',
            data: {
              token: that.data.token,
              store_id: that.data.storeid,
              merchant_id: that.data.merchantid,
              ways_source:'',//支付方式
              order_status:'',//订单状态
              time_start: that.data.starttime,
              time_end: that.data.endtime,       
              p: '1',
              l: '15',
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
                  var p = 2
                  that.setData({
                    collectmoney: res.data.data,
                    p: p,
                    count: res.data.t,
                    noOrder:0
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

              }else{
                my.alert({
                  content: res.data.message,
                  buttonText: '我知道了',
                  success: () => {
                    
                  },
                });
              }

            }
          })
        }else if(that.data.pay_order_status == '1000'){
          my.request({
            url: that.data.Request+"/api/deposit/pay_order_list",
            method: 'POST',
            data: {
              token: that.data.token,
              store_id: that.data.storeid,
              merchant_id: that.data.merchantid,
              ways_source:that.data.pay_ways_source,//支付方式
              order_status:'',//订单状态
              time_start: that.data.starttime,
              time_end: that.data.endtime,       
              p: '1',
              l: '15',
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
                  var p = 2
                  that.setData({
                    collectmoney: res.data.data,
                    p: p,
                    count: res.data.t,
                    noOrder:0
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

              }else{
                my.alert({
                  content: res.data.message,
                  buttonText: '我知道了',
                  success: () => {
                    
                  },
                });
              }

            }
          })
        }else if(that.data.pay_ways_source == '1000'){
          my.request({
            url: that.data.Request+"/api/deposit/pay_order_list",
            method: 'POST',
            data: {
              token: that.data.token,
              store_id: that.data.storeid,
              merchant_id: that.data.merchantid,
              ways_source:'',//支付方式
              order_status:that.data.pay_order_status,//订单状态
              time_start: that.data.starttime,
              time_end: that.data.endtime,       
              p: '1',
              l: '15',
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
                  var p = 2
                  that.setData({
                    collectmoney: res.data.data,
                    p: p,
                    count: res.data.t,
                    noOrder:0
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

              }else{
                my.alert({
                  content: res.data.message,
                  buttonText: '我知道了',
                  success: () => {
                    
                  },
                });
              }

            }
          })
        }else{
          my.request({
            url: that.data.Request+"/api/deposit/pay_order_list",
            method: 'POST',
            data: {
              token: that.data.token,
              store_id: that.data.storeid,
              merchant_id: that.data.merchantid,
              ways_source:that.data.pay_ways_source,
              order_status:that.data.pay_order_status,
              time_start: that.data.starttime,
              time_end: that.data.endtime,       
              p: '1',
              l: '15',
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
                  var p = 2
                  that.setData({
                    collectmoney: res.data.data,
                    p: p,
                    count: res.data.t,
                    noOrder:0
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

              }else{
                my.alert({
                  content: res.data.message,
                  buttonText: '我知道了',
                  success: () => {
                    
                  },
                });
              }

            }
          })
        }
        
        
      } 
    }else{
      console.log('111')
    }
      
    
  },
  // 开始时间插件
  datePickerYMDHMSstart() {
    var that=this
    my.datePicker({
      format: 'yyyy-MM-dd HH:mm:ss',
      currentDate: this.data.todayData,
      startDate: '2010-01-01 00:00:00',
      endDate: '2030-01-10 23:59:59',
      success: (res) => {
        console.log(res.date)
        that.setData({
          starttime:res.date,
          start_time:res.date,
          startcolor:1
        })
      },
    });    
  },
  // 结束时间插件
  datePickerYMDHMSend() {
    var that=this
    my.datePicker({
      format: 'yyyy-MM-dd HH:mm:ss',
      currentDate: this.data.todayData,
      startDate: '2012-01-01 00:00:00',
      endDate: '3020-01-10 23:59:59', 
      success: (res) => {
        console.log(res.date)       
        that.setData({
          endtime:res.date,
          end_time:res.date,
          endcolor:1
        })
      },
    });    
  },
  
})