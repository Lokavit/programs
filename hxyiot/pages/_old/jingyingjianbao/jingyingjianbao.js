
var app = getApp();

Page({
  data: {

    tabArr: {
      curHdIndex: 1,//默认第一个选中
    },
    // 显示哪一块
    tabboxArr: {
      curJBIndex: 1,//默认第一个选中
    },
    tabCur1: {
      curcharts: 1,
    },
    chartsArr1: {
      curchartIndex: 1,
    },
    tabCur2: {
      curcharts: 1,
    },
    chartsArr2: {
      curchartIndex: 1,
    },
    date: '2016-09-01',//日报选择的时间

    array: [],//周报选择的时间
    objectArray: [],
    arraytotal: [],
    index: 0,

    array2: [],//月报选择的时间
    objectArray2: [],
    index2: 0,


    h: '00',
    m: '00',
    s: '00',
    h1: '23',
    m1: '59',
    s1: '59',



    show: 1,
    mask: 1,
    showweek: 1,
    showyue: 1,
    showscreen: 1,

    firstImg: '../../img/xuanzhong.png',
    noCurImg: '../../img/weixuanzhong.png',
    hasCurImg: '../../img/xuanzhong.png',

    totalstorecon: '全部门店',


    storeId: '',
    merchantid: '',
    screenshow: 0,
    margin: 1,

  },
  onLoad() {

    var that = this
    var token = my.getStorageSync({ key: 'token' }).data;
    var Request = my.getStorageSync({ key: 'Request' }).data;
    that.setData({
      token: token,
      Request: Request,
    })



    // 分割线*****************************************

    // 请求接口********************------------------****************************--------------


    // 时间--------**************日报****************-----------------------------------
    // 获取时间
    var nowdate = new Date();

    var year = nowdate.getFullYear();
    var mounth = nowdate.getMonth() + 1;
    var day = nowdate.getDate();
    // //console.log(year + '-' + mounth + '-'+day)

    if (mounth.toString().length < 2 && day.toString().length < 2) {
      var nwedata = year + '-0' + mounth + '-0' + day;
    }
    else if (mounth.toString().length < 2) {
      var nwedata = year + '-0' + mounth + '-' + day;
    }
    else if (day.toString().length < 2) {
      var nwedata = year + '-' + mounth + '-0' + day;
    }
    else {
      var nwedata = year + '-' + mounth + '-' + day;
    }
    console.log(nwedata)
    this.setData({
      RItime: nwedata,
    });
    this.setData({
      dayin_start_time: this.data.RItime + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s,
      dayin_end_time: this.data.RItime + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1,
    })
    console.log(this.data.dayin_start_time)
    console.log(this.data.dayin_end_time)

    // *******  获取当前日期时间/**** */
    var zitime = new Date();
    zitime.setMonth(zitime.getMonth());
    var y = zitime.getFullYear();
    var mon = zitime.getMonth() + 1;
    var d = zitime.getDate();
    var h = zitime.getHours();;
    var m = zitime.getMinutes();
    var todayData
    if (mon.toString().length < 2 && d.toString().length < 2) {
      todayData = y + '-0' + mon + '-0' + d + ' ' + h + ':' + m
    } else if (d.toString().length < 2) {
      todayData = y + '-' + mon + '-0' + d + ' ' + h + ':' + m
    } else if (mon.toString().length < 2) {
      todayData = y + '-0' + mon + '-' + d + ' ' + h + ':' + m
    } else {
      todayData = y + '-' + mon + '-' + d + '-' + h + ':' + m
    }
    // console.log(todayData)
    this.setData({
      starttimezidingyi: todayData,
      endtimezidingyi: todayData,
    });



    var that = this

    // 经营数据---日------request***************
    my.request({
      url: that.data.Request + "/api/merchant/order_count",
      method: 'POST',
      data: {
        token: this.data.token,
        time_start: this.data.RItime + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s,
        time_end: this.data.RItime + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1,
      },
      dataType: 'json',
      success(res) {
        console.log(res.data)

        that.setData({
          getamount: res.data.data.get_amount,
          totalamount: res.data.data.total_amount,
          totalcount: res.data.data.total_count,
          refundamount: res.data.data.refund_amount,
          refundcount: res.data.data.refund_count,
          feeamount: res.data.data.fee_amount,
          receiptamount: res.data.data.receipt_amount,
          // memberamount:res.data.data.member_amount,

          alipay_totalamount: res.data.data.alipay_total_amount,
          alipay_refundamount: res.data.data.alipay_refund_amount,
          alipay_refundcount: res.data.data.alipay_refund_count,
          alipay_getamount: res.data.data.alipay_get_amount,
          alipay_totalcount: res.data.data.alipay_total_count,
          alipay_feeamount: res.data.data.alipay_fee_amount,
          alipay_receiptamount: res.data.data.alipay_receipt_amount,


          weixin_totalamount: res.data.data.weixin_total_amount,
          weixin_refundamount: res.data.data.weixin_refund_amount,
          weixin_refundcount: res.data.data.weixin_refund_count,
          weixin_getamount: res.data.data.weixin_get_amount,
          weixin_totalcount: res.data.data.weixin_total_count,
          weixin_feeamount: res.data.data.weixin_fee_amount,
          weixin_receiptamount: res.data.data.weixin_receipt_amount,

          huiyuan_totalamount: res.data.data.member_total_amount,
          huiyuan_refundamount: res.data.data.member_refund_amount,
          huiyuan_refundcount: res.data.data.member_refund_count,
          huiyuan_getamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),
          huiyuan_totalcount: res.data.data.member_total_count,
          huiyuan_feeamount: res.data.data.member_total_deduction,
          huiyuan_receiptamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),

          jd_totalamount: res.data.data.jd_total_amount,
          jd_refundamount: res.data.data.jd_refund_amount,
          jd_refundcount: res.data.data.jd_refund_count,
          jd_getamount: res.data.data.jd_get_amount,
          jd_totalcount: res.data.data.jd_total_count,
          jd_feeamount: res.data.data.jd_fee_amount,
          jd_receiptamount: res.data.data.jd_receipt_amount,

          unqr_totalamount: res.data.data.unqr_total_amount,
          unqr_refundamount: res.data.data.unqr_refund_amount,
          unqr_refundcount: res.data.data.unqr_refund_count,
          unqr_getamount: res.data.data.unqr_get_amount,
          unqr_totalcount: res.data.data.unqr_total_count,
          unqr_feeamount: res.data.data.unqr_fee_amount,
          unqr_receiptamount: res.data.data.unqr_receipt_amount,

          un_totalamount: res.data.data.un_total_amount,
          un_refundamount: res.data.data.un_refund_amount,
          un_refundcount: res.data.data.un_refund_count,
          un_getamount: res.data.data.un_get_amount,
          un_totalcount: res.data.data.un_total_count,
          un_feeamount: res.data.data.un_fee_amount,
          un_receiptamount: res.data.data.un_receipt_amount,

          hbfq_totalamount: res.data.data.hbfq_total_amount,
          hbfq_refundamount: res.data.data.hbfq_refund_amount,
          hbfq_refundcount: res.data.data.hbfq_refund_count,
          hbfq_getamount: res.data.data.hbfq_get_amount,
          hbfq_totalcount: res.data.data.hbfq_total_count,
          hbfq_feeamount: res.data.data.hbfq_fee_amount,
          hbfq_receiptamount: res.data.data.hbfq_receipt_amount,

          print_id: res.data.data.print_id,

          time_start: that.data.date + ' ' + that.data.h + ':' + that.data.m + ':' + that.data.s,
          time_end: that.data.date + ' ' + that.data.h1 + ':' + that.data.m1 + ':' + that.data.s1,

        })

      }
    })

    // -------------  ********************月报****************  ---------------
    var date1 = new Date();
    var date2 = new Date();
    var date3 = new Date();
    date1.setMonth(date1.getMonth());//获取当前月的数据
    // date1.setMonth(date1.getMonth() -1);//获取上月的数据
    date2.setMonth(date2.getMonth() - 2);
    date3.setMonth(date3.getMonth() - 3);
    var year1 = date1.getFullYear();
    var year2 = date2.getFullYear();
    var year3 = date3.getFullYear();
    var month1 = date1.getMonth() + 1;
    var month2 = date2.getMonth() + 1;
    var month3 = date3.getMonth() + 1;
    month1 = (month1 < 10 ? "0" + month1 : month1);
    month2 = (month2 < 10 ? "0" + month2 : month2);
    month3 = (month3 < 10 ? "0" + month3 : month3);
    var sDate1 = (year1.toString() + '-' + month1.toString());
    var sDate2 = (year2.toString() + '-' + month2.toString());
    var sDate3 = (year3.toString() + '-' + month3.toString());
    // console.log(sDate1)
    // console.log(sDate2)
    // console.log(sDate3)



    var mon1 = sDate1
    var mon2 = sDate2
    var mon3 = sDate3
    // console.log(mon1);
    // console.log(mon2);
    // console.log(mon3);
    var yuebaoarr = []
    yuebaoarr.push(mon1, mon2, mon3)
    console.log(yuebaoarr);
    this.setData({
      array2: yuebaoarr,
      Yuetime: yuebaoarr[0]
    })

    var beforeyue = this.data.array2[0].substring(5, 7)
    console.log(beforeyue)
    console.log(this.data.array2[0])

    if (beforeyue == '02') {
      //console.log(yueyear % 4 == 0 ? 29 : 28)
      if (yueyear % 4 == 0) {
        var onemounthT = this.data.array2[0] + '-' + '01' + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s + '-' + this.data.array2[0] + '-' + '29' + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1;
        this.setData({
          days: 29,
          yuedata: onemounthT
        })

      } else {
        var onemounthT = yueyear + '-0' + (yueyue - 2) + '-' + '01' + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s + '-' + this.data.array2[0] + '-' + '28' + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1;
        this.setData({
          days: 28,
          yuedata: onemounthT
        })

      }
    } else if (beforeyue == '01' || beforeyue == '03' || beforeyue == '05' || beforeyue == '07' || beforeyue == '08' || beforeyue == '10' || beforeyue == '12') {
      //console.log('31')
      var onemounthT = this.data.array2[0] + '-' + '01' + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s + '-' + this.data.array2[0] + '-' + '31' + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1;
      this.setData({
        days: 31,
        yuedata: onemounthT
      })
    } else {
      //console.log('30')
      var onemounthT = this.data.array2[0] + '-' + '01' + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s + '-' + this.data.array2[0] + '-' + '30' + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1;
      this.setData({
        days: 30,
        yuedata: onemounthT
      })
    }
    console.log(this.data.yuedata)


    //-----------------***************周报***************************---------------------------------------

    // ********每周的周一*******
    var dayarr1 = []
    var starDay = [];
    var startotalDay = [];
    for (var i = 1; i < 5; i++) {
      var date1 = new Date();
      var weekyear1 = date1.getFullYear();
      var week1 = date1.getDay();
      // var diffweek1 = week1 - ((-i) * 7 + 1);//获取距离上周一的天数....上上周一的天数...
      var diffweek1 = week1 - ((-i) * 7 + 8);//获取当前周的天数
      var day1 = date1.getDate() - diffweek1;
      var date1 = date1.setDate(day1);

      if ((new Date(date1).getMonth() + 1).toString().length < 2 && new Date(date1).getDate().toString().length < 2) {
        var startotal = new Date(date1).getFullYear() + '-0' + (new Date(date1).getMonth() + 1) + '-0' + new Date(date1).getDate() + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s
      } else if ((new Date(date1).getMonth() + 1).toString().length < 2) {
        var startotal = new Date(date1).getFullYear() + '-0' + (new Date(date1).getMonth() + 1) + '-' + new Date(date1).getDate() + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s
      } else if (new Date(date1).getDate().toString().length < 2) {
        var startotal = new Date(date1).getFullYear() + '-' + (new Date(date1).getMonth() + 1) + '-0' + new Date(date1).getDate() + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s
      } else {
        var startotal = new Date(date1).getFullYear() + '-' + (new Date(date1).getMonth() + 1) + '-' + new Date(date1).getDate() + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s
      }






      var mounth1 = new Date(date1).getMonth() + 1;
      var day1 = new Date(date1).getDate();

      dayarr1.push(mounth1 + '-' + day1)
      // console.log(dayarr1);

      if (mounth1.toString().length < 2) {
        var star = '0' + mounth1 + '月' + day1 + '日';
      } else if (day1.toString().length < 2) {
        var star = mounth1 + '月0' + day1 + '日';
      } else {
        var star = mounth1 + '月' + day1 + '日';
      }

      startotalDay.push(startotal)
      starDay.push(star)
    }
    // //console.log(starDay)
    // //console.log(startotalDay)

    // ********每周的周日*******
    var dayarr2 = []
    var endDay = [];
    var endtotalDay = [];
    for (var i = 1; i < 5; i++) {
      var date2 = new Date();
      var weekyear2 = date2.getFullYear();
      var week2 = date2.getDay();
      // var diffweek2 = week2 - ((-i) * 7 + 7);//获取距离上周日的天数....上上周日的天数...
      var diffweek2 = week2 - ((i) * 7);
      var day2 = date2.getDate() - diffweek2;//今天的日期减去天数就是每个星期一的日期(日单位)
      var date2 = date2.setDate(day2);//将每个星期一的天转换成时间戳 var newDataT = new Date(newdayT)//时间戳转换成正常日期格式


      if ((new Date(date2).getMonth() + 1).toString().length < 2 && new Date(date2).getDate().toString().length < 2) {
        var endtotal = new Date(date2).getFullYear() + '-0' + (new Date(date2).getMonth() + 1) + '-0' + new Date(date2).getDate() + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1
      } else if ((new Date(date2).getMonth() + 1).toString().length < 2) {
        var endtotal = new Date(date2).getFullYear() + '-0' + (new Date(date2).getMonth() + 1) + '-' + new Date(date2).getDate() + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1
      } else if (new Date(date2).getDate().toString().length < 2) {
        var endtotal = new Date(date2).getFullYear() + '-' + (new Date(date2).getMonth() + 1) + '-0' + new Date(date2).getDate() + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1
      } else {
        var endtotal = new Date(date2).getFullYear() + '-' + (new Date(date2).getMonth() + 1) + '-' + new Date(date2).getDate() + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1
      }


      var mounth2 = new Date(date2).getMonth() + 1;
      var day2 = new Date(date2).getDate();

      dayarr2.push(mounth2 + '-' + day2)


      if (mounth2.toString().length < 2) {
        var end = '0' + mounth2 + '月' + day2 + '日';
      } else if (day2.toString().length < 2) {
        var end = mounth2 + '月0' + day2 + '日';
      } else {
        var end = mounth2 + '月' + day2 + '日';
      }
      endtotalDay.push(endtotal)
      endDay.push(end)
    }
    // //console.log(endDay)
    // //console.log(endtotalDay)

    var dataArr = []
    var datatotalArr = []
    for (var a = 0; a < starDay.length; a++) {
      dataArr[a] = starDay[a] + "-" + endDay[a]
    }
    console.log(dataArr);
    this.setData({
      array: dataArr,
      weektime: dataArr[0]
    })
    for (var b = 0; b < startotalDay.length; b++) {
      datatotalArr[b] = startotalDay[b] + "-" + endtotalDay[b]
    }
    // console.log(datatotalArr);

    this.setData({
      arraytotal: datatotalArr,
    })

    this.setData({
      week_start_time: this.data.arraytotal[0].substring(0, 19),
      week_end_time: this.data.arraytotal[0].substring(20, 39),
    })
    // console.log(that.data.week_start_time)
    // console.log(that.data.week_end_time)


    // ****************************自定义时间****************************
    var screendate = new Date();
    screendate.setMonth(screendate.getMonth() - 3);

    var s_y = screendate.getFullYear();
    var s_mon = screendate.getMonth() + 1;
    var s_d = screendate.getDate() + 1;
    var s_h = '00';
    var s_m = '00';
    console.log(s_d)
    if (s_mon.toString().length < 2) {
      var start_time_zdy = s_y + '-0' + s_mon + '-' + s_d + ' ' + s_h + ':' + s_m
    } else if (s_d.toString().length < 2) {
      var start_time_zdy = s_y + '-' + s_mon + '-0' + s_d + ' ' + s_h + ':' + s_m
    } else {
      var start_time_zdy = s_y + '-' + s_mon + '-' + s_d + ' ' + s_h + ':' + s_m
    }
    if (s_mon.toString().length < 2 && s_d.toString().length < 2) {
      var start_time_zdy = s_y + '-0' + s_mon + '-0' + s_d + ' ' + s_h + ':' + s_m
    }

    console.log(start_time_zdy)
    console.log(todayData)

    this.setData({
      start_time_zdy: start_time_zdy,
      end_time_zdy: todayData
    })

  },
  tab(e) {
    // var dataSId = e.currentTarget.dataset.id;
    // //console.log(dataSId)


    var dataId = e.currentTarget.id;
    var obj = {};
    obj.curHdIndex = dataId;

    var arr = {};
    arr.curJBIndex = dataId

    this.setData({
      tabArr: obj
    })
    ////console.log(e);
    this.setData({
      tabboxArr: arr
    })
    //console.log(this.data.tabboxArr.curJBIndex)
    var that = this
    this.setData({
      tabvalue: this.data.tabboxArr.curJBIndex,
      showscreen: 1,
      mask: 1,
    })
    if (this.data.tabboxArr.curJBIndex == 1) {
      that.setData({
        dayin_start_time: this.data.date + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s,
        dayin_end_time: this.data.date + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1,
        margin: 1
      })
      // 经营数据---日
      my.request({
        url: that.data.Request + "/api/merchant/order_count",
        method: 'POST',
        data: {
          token: this.data.token,
          store_id: this.data.storeId,
          merchant_id: that.data.merchantid,
          time_start: this.data.RItime + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s,
          time_end: this.data.RItime + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1,
          // time_start: this.data.date + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s,
          // time_end: this.data.date + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1,
        },
        dataType: 'json',
        success(res) {
          //console.log(res.data)

          that.setData({
            getamount: res.data.data.get_amount,
            totalamount: res.data.data.total_amount,
            totalcount: res.data.data.total_count,
            refundamount: res.data.data.refund_amount,
            refundcount: res.data.data.refund_count,
            feeamount: res.data.data.fee_amount,
            receiptamount: res.data.data.receipt_amount,

            alipay_totalamount: res.data.data.alipay_total_amount,
            alipay_refundamount: res.data.data.alipay_refund_amount,
            alipay_refundcount: res.data.data.alipay_refund_count,
            alipay_getamount: res.data.data.alipay_get_amount,
            alipay_totalcount: res.data.data.alipay_total_count - res.data.data.alipay_refund_count,
            alipay_feeamount: res.data.data.alipay_fee_amount,
            alipay_receiptamount: res.data.data.alipay_receipt_amount,


            weixin_totalamount: res.data.data.weixin_total_amount,
            weixin_refundamount: res.data.data.weixin_refund_amount,
            weixin_refundcount: res.data.data.weixin_refund_count,
            weixin_getamount: res.data.data.weixin_get_amount,
            weixin_totalcount: res.data.data.weixin_total_count - res.data.data.weixin_refund_count,
            weixin_feeamount: res.data.data.weixin_fee_amount,
            weixin_receiptamount: res.data.data.weixin_receipt_amount,

            huiyuan_totalamount: res.data.data.member_total_amount,
            huiyuan_refundamount: res.data.data.member_refund_amount,
            huiyuan_refundcount: res.data.data.member_refund_count,
            huiyuan_getamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),
            huiyuan_totalcount: res.data.data.member_total_count,
            huiyuan_feeamount: res.data.data.member_total_deduction,
            huiyuan_receiptamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),

            jd_totalamount: res.data.data.jd_total_amount,
            jd_refundamount: res.data.data.jd_refund_amount,
            jd_refundcount: res.data.data.jd_refund_count,
            jd_getamount: res.data.data.jd_get_amount,
            jd_totalcount: res.data.data.jd_total_count - res.data.data.jd_refund_count,
            jd_feeamount: res.data.data.jd_fee_amount,
            jd_receiptamount: res.data.data.jd_receipt_amount,

            unqr_totalamount: res.data.data.unqr_total_amount,
            unqr_refundamount: res.data.data.unqr_refund_amount,
            unqr_refundcount: res.data.data.unqr_refund_count,
            unqr_getamount: res.data.data.unqr_get_amount,
            unqr_totalcount: res.data.data.unqr_total_count - res.data.data.unqr_refund_count,
            unqr_feeamount: res.data.data.unqr_fee_amount,
            unqr_receiptamount: res.data.data.unqr_receipt_amount,

            un_totalamount: res.data.data.un_total_amount,
            un_refundamount: res.data.data.un_refund_amount,
            un_refundcount: res.data.data.un_refund_count,
            un_getamount: res.data.data.un_get_amount,
            un_totalcount: res.data.data.un_total_count - res.data.data.un_refund_count,
            un_feeamount: res.data.data.un_fee_amount,
            un_receiptamount: res.data.data.un_receipt_amount,

            print_id: res.data.data.print_id,

            time_start: that.data.date + ' ' + that.data.h + ':' + that.data.m + ':' + that.data.s,
            time_end: that.data.date + ' ' + that.data.h1 + ':' + that.data.m1 + ':' + that.data.s1,
          })

        }
      })
    } else if (this.data.tabboxArr.curJBIndex == 2) {
      // console.log(this.data.arraytotal)
      var start_time = this.data.week_start_time
      var end_time = this.data.week_end_time
      that.setData({
        dayin_start_time: start_time,
        dayin_end_time: end_time,
        margin: 1
      })
      // 经营数据---周
      my.request({
        url: that.data.Request + "/api/merchant/order_count",
        method: 'POST',
        data: {
          token: this.data.token,
          store_id: this.data.storeId,
          merchant_id: that.data.merchantid,
          time_start: start_time,
          time_end: end_time,
        },
        dataType: 'json',
        success(res) {
          //console.log(res.data)

          that.setData({
            getamount: res.data.data.get_amount,
            totalamount: res.data.data.total_amount,
            totalcount: res.data.data.total_count,
            refundamount: res.data.data.refund_amount,
            refundcount: res.data.data.refund_count,
            feeamount: res.data.data.fee_amount,
            receiptamount: res.data.data.receipt_amount,

            alipay_totalamount: res.data.data.alipay_total_amount,
            alipay_refundamount: res.data.data.alipay_refund_amount,
            alipay_refundcount: res.data.data.alipay_refund_count,
            alipay_getamount: res.data.data.alipay_get_amount,
            alipay_totalcount: res.data.data.alipay_total_count,
            alipay_feeamount: res.data.data.alipay_fee_amount,
            alipay_receiptamount: res.data.data.alipay_receipt_amount,


            weixin_totalamount: res.data.data.weixin_total_amount,
            weixin_refundamount: res.data.data.weixin_refund_amount,
            weixin_refundcount: res.data.data.weixin_refund_count,
            weixin_getamount: res.data.data.weixin_get_amount,
            weixin_totalcount: res.data.data.weixin_total_count,
            weixin_feeamount: res.data.data.weixin_fee_amount,
            weixin_receiptamount: res.data.data.weixin_receipt_amount,

            huiyuan_totalamount: res.data.data.member_total_amount,
            huiyuan_refundamount: res.data.data.member_refund_amount,
            huiyuan_refundcount: res.data.data.member_refund_count,
            huiyuan_getamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),
            huiyuan_totalcount: res.data.data.member_total_count,
            huiyuan_feeamount: res.data.data.member_total_deduction,
            huiyuan_receiptamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),

            jd_totalamount: res.data.data.jd_total_amount,
            jd_refundamount: res.data.data.jd_refund_amount,
            jd_refundcount: res.data.data.jd_refund_count,
            jd_getamount: res.data.data.jd_get_amount,
            jd_totalcount: res.data.data.jd_total_count,
            jd_feeamount: res.data.data.jd_fee_amount,
            jd_receiptamount: res.data.data.jd_receipt_amount,

            unqr_totalamount: res.data.data.unqr_total_amount,
            unqr_refundamount: res.data.data.unqr_refund_amount,
            unqr_refundcount: res.data.data.unqr_refund_count,
            unqr_getamount: res.data.data.unqr_get_amount,
            unqr_totalcount: res.data.data.unqr_total_count,
            unqr_feeamount: res.data.data.unqr_fee_amount,
            unqr_receiptamount: res.data.data.unqr_receipt_amount,

            un_totalamount: res.data.data.un_total_amount,
            un_refundamount: res.data.data.un_refund_amount,
            un_refundcount: res.data.data.un_refund_count,
            un_getamount: res.data.data.un_get_amount,
            un_totalcount: res.data.data.un_total_count,
            un_feeamount: res.data.data.un_fee_amount,
            un_receiptamount: res.data.data.un_receipt_amount,

            print_id: res.data.data.print_id,

            time_start: start_time,
            time_end: end_time,
          })

        }
      })
    } else if (this.data.tabboxArr.curJBIndex == 3) {
      console.log(this.data.yuedata)
      var start_time = this.data.yuedata.substring(0, 19)
      var end_time = this.data.yuedata.substring(20, 39)
      that.setData({
        dayin_start_time: start_time,
        dayin_end_time: end_time,
        margin: 1
      })
      // 经营数据---月
      my.request({
        url: that.data.Request + "/api/merchant/order_count",
        method: 'POST',
        data: {
          token: this.data.token,
          store_id: this.data.storeId,
          merchant_id: that.data.merchantid,
          time_start: start_time,
          time_end: end_time,
        },
        dataType: 'json',
        success(res) {
          //console.log(res.data)

          that.setData({
            getamount: res.data.data.get_amount,
            totalamount: res.data.data.total_amount,
            totalcount: res.data.data.total_count,
            refundamount: res.data.data.refund_amount,
            refundcount: res.data.data.refund_count,
            feeamount: res.data.data.fee_amount,
            receiptamount: res.data.data.receipt_amount,

            alipay_totalamount: res.data.data.alipay_total_amount,
            alipay_refundamount: res.data.data.alipay_refund_amount,
            alipay_refundcount: res.data.data.alipay_refund_count,
            alipay_getamount: res.data.data.alipay_get_amount,
            alipay_totalcount: res.data.data.alipay_total_count,
            alipay_feeamount: res.data.data.alipay_fee_amount,
            alipay_receiptamount: res.data.data.alipay_receipt_amount,


            weixin_totalamount: res.data.data.weixin_total_amount,
            weixin_refundamount: res.data.data.weixin_refund_amount,
            weixin_refundcount: res.data.data.weixin_refund_count,
            weixin_getamount: res.data.data.weixin_get_amount,
            weixin_totalcount: res.data.data.weixin_total_count,
            weixin_feeamount: res.data.data.weixin_fee_amount,
            weixin_receiptamount: res.data.data.weixin_receipt_amount,

            huiyuan_totalamount: res.data.data.member_total_amount,
            huiyuan_refundamount: res.data.data.member_refund_amount,
            huiyuan_refundcount: res.data.data.member_refund_count,
            huiyuan_getamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),
            huiyuan_totalcount: res.data.data.member_total_count,
            huiyuan_feeamount: res.data.data.member_total_deduction,
            huiyuan_receiptamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),

            jd_totalamount: res.data.data.jd_total_amount,
            jd_refundamount: res.data.data.jd_refund_amount,
            jd_refundcount: res.data.data.jd_refund_count,
            jd_getamount: res.data.data.jd_get_amount,
            jd_totalcount: res.data.data.jd_total_count,
            jd_feeamount: res.data.data.jd_fee_amount,
            jd_receiptamount: res.data.data.jd_receipt_amount,

            unqr_totalamount: res.data.data.unqr_total_amount,
            unqr_refundamount: res.data.data.unqr_refund_amount,
            unqr_refundcount: res.data.data.unqr_refund_count,
            unqr_getamount: res.data.data.unqr_get_amount,
            unqr_totalcount: res.data.data.unqr_total_count,
            unqr_feeamount: res.data.data.unqr_fee_amount,
            unqr_receiptamount: res.data.data.unqr_receipt_amount,

            un_totalamount: res.data.data.un_total_amount,
            un_refundamount: res.data.data.un_refund_amount,
            un_refundcount: res.data.data.un_refund_count,
            un_getamount: res.data.data.un_get_amount,
            un_totalcount: res.data.data.un_total_count,
            un_feeamount: res.data.data.un_fee_amount,
            un_receiptamount: res.data.data.un_receipt_amount,

            print_id: res.data.data.print_id,

            time_start: start_time,
            time_end: end_time,
          })

        }
      })
    } else if (this.data.tabboxArr.curJBIndex == 4) {

      var start_time = this.data.start_time_zdy
      var end_time = this.data.end_time_zdy
      that.setData({
        dayin_start_time: start_time,
        dayin_end_time: end_time,
        margin: 0
      })
      console.log(start_time)
      console.log(end_time)
      // 经营数据---月
      my.request({
        url: that.data.Request + "/api/merchant/order_count",
        method: 'POST',
        data: {
          token: this.data.token,
          store_id: this.data.storeId,
          merchant_id: that.data.merchantid,
          time_start: start_time,
          time_end: end_time,
        },
        dataType: 'json',
        success(res) {
          //console.log(res.data)

          that.setData({
            getamount: res.data.data.get_amount,
            totalamount: res.data.data.total_amount,
            totalcount: res.data.data.total_count,
            refundamount: res.data.data.refund_amount,
            refundcount: res.data.data.refund_count,
            feeamount: res.data.data.fee_amount,
            receiptamount: res.data.data.receipt_amount,

            alipay_totalamount: res.data.data.alipay_total_amount,
            alipay_refundamount: res.data.data.alipay_refund_amount,
            alipay_refundcount: res.data.data.alipay_refund_count,
            alipay_getamount: res.data.data.alipay_get_amount,
            alipay_totalcount: res.data.data.alipay_total_count,
            alipay_feeamount: res.data.data.alipay_fee_amount,
            alipay_receiptamount: res.data.data.alipay_receipt_amount,


            weixin_totalamount: res.data.data.weixin_total_amount,
            weixin_refundamount: res.data.data.weixin_refund_amount,
            weixin_refundcount: res.data.data.weixin_refund_count,
            weixin_getamount: res.data.data.weixin_get_amount,
            weixin_totalcount: res.data.data.weixin_total_count,
            weixin_feeamount: res.data.data.weixin_fee_amount,
            weixin_receiptamount: res.data.data.weixin_receipt_amount,

            huiyuan_totalamount: res.data.data.member_total_amount,
            huiyuan_refundamount: res.data.data.member_refund_amount,
            huiyuan_refundcount: res.data.data.member_refund_count,
            huiyuan_getamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),
            huiyuan_totalcount: res.data.data.member_total_count,
            huiyuan_feeamount: res.data.data.member_total_deduction,
            huiyuan_receiptamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),

            jd_totalamount: res.data.data.jd_total_amount,
            jd_refundamount: res.data.data.jd_refund_amount,
            jd_refundcount: res.data.data.jd_refund_count,
            jd_getamount: res.data.data.jd_get_amount,
            jd_totalcount: res.data.data.jd_total_count,
            jd_feeamount: res.data.data.jd_fee_amount,
            jd_receiptamount: res.data.data.jd_receipt_amount,

            unqr_totalamount: res.data.data.unqr_total_amount,
            unqr_refundamount: res.data.data.unqr_refund_amount,
            unqr_refundcount: res.data.data.unqr_refund_count,
            unqr_getamount: res.data.data.unqr_get_amount,
            unqr_totalcount: res.data.data.unqr_total_count,
            unqr_feeamount: res.data.data.unqr_fee_amount,
            unqr_receiptamount: res.data.data.unqr_receipt_amount,

            un_totalamount: res.data.data.un_total_amount,
            un_refundamount: res.data.data.un_refund_amount,
            un_refundcount: res.data.data.un_refund_count,
            un_getamount: res.data.data.un_get_amount,
            un_totalcount: res.data.data.un_total_count,
            un_feeamount: res.data.data.un_fee_amount,
            un_receiptamount: res.data.data.un_receipt_amount,

            print_id: res.data.data.print_id,

            time_start: start_time,
            time_end: end_time,
          })

        }
      })
    }
  },
  // 选择周报start
  weekTap(e) {
    var that = this
    that.setData({
      mask: 1,
      showweek: 1
    })
    var index = e.currentTarget.dataset.index;
    var array = that.data.array
    var arraytotal = that.data.arraytotal
    // console.log(array)
    for (var i = 0; i < array.length; i++) {
      if (index == i) {
        this.setData({
          weektime: array[i],
          week_time: arraytotal[i]
        })
      }
    }

    that.setData({
      week_start_time: that.data.week_time.substring(0, 19),
      week_end_time: that.data.week_time.substring(20, 39)
    })

    var start_time = that.data.week_time.substring(0, 19)
    var end_time = that.data.week_time.substring(20, 39)
    that.setData({
      dayin_start_time: start_time,
      dayin_end_time: end_time,
    })
    console.log(start_time)
    console.log(end_time)
    // 经营数据---周
    my.request({
      url: that.data.Request + "/api/merchant/order_count",
      method: 'POST',
      data: {
        token: this.data.token,
        store_id: this.data.storeId,
        merchant_id: that.data.merchantid,
        time_start: start_time,
        time_end: end_time,
      },
      dataType: 'json',
      success(res) {
        console.log(res.data)
        that.setData({
          getamount: res.data.data.get_amount,
          totalamount: res.data.data.total_amount,
          totalcount: res.data.data.total_count,
          refundamount: res.data.data.refund_amount,
          refundcount: res.data.data.refund_count,
          feeamount: res.data.data.fee_amount,
          receiptamount: res.data.data.receipt_amount,

          alipay_totalamount: res.data.data.alipay_total_amount,
          alipay_refundamount: res.data.data.alipay_refund_amount,
          alipay_refundcount: res.data.data.alipay_refund_count,
          alipay_getamount: res.data.data.alipay_get_amount,
          alipay_totalcount: res.data.data.alipay_total_count,
          alipay_feeamount: res.data.data.alipay_fee_amount,
          alipay_receiptamount: res.data.data.alipay_receipt_amount,


          weixin_totalamount: res.data.data.weixin_total_amount,
          weixin_refundamount: res.data.data.weixin_refund_amount,
          weixin_refundcount: res.data.data.weixin_refund_count,
          weixin_getamount: res.data.data.weixin_get_amount,
          weixin_totalcount: res.data.data.weixin_total_count,
          weixin_feeamount: res.data.data.weixin_fee_amount,
          weixin_receiptamount: res.data.data.weixin_receipt_amount,

          huiyuan_totalamount: res.data.data.member_total_amount,
          huiyuan_refundamount: res.data.data.member_refund_amount,
          huiyuan_refundcount: res.data.data.member_refund_count,
          huiyuan_getamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),
          huiyuan_totalcount: res.data.data.member_total_count,
          huiyuan_feeamount: res.data.data.member_total_deduction,
          huiyuan_receiptamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),

          jd_totalamount: res.data.data.jd_total_amount,
          jd_refundamount: res.data.data.jd_refund_amount,
          jd_refundcount: res.data.data.jd_refund_count,
          jd_getamount: res.data.data.jd_get_amount,
          jd_totalcount: res.data.data.jd_total_count,
          jd_feeamount: res.data.data.jd_fee_amount,
          jd_receiptamount: res.data.data.jd_receipt_amount,

          unqr_totalamount: res.data.data.unqr_total_amount,
          unqr_refundamount: res.data.data.unqr_refund_amount,
          unqr_refundcount: res.data.data.unqr_refund_count,
          unqr_getamount: res.data.data.unqr_get_amount,
          unqr_totalcount: res.data.data.unqr_total_count,
          unqr_feeamount: res.data.data.unqr_fee_amount,
          unqr_receiptamount: res.data.data.unqr_receipt_amount,

          un_totalamount: res.data.data.un_total_amount,
          un_refundamount: res.data.data.un_refund_amount,
          un_refundcount: res.data.data.un_refund_count,
          un_getamount: res.data.data.un_get_amount,
          un_totalcount: res.data.data.un_total_count,
          un_feeamount: res.data.data.un_fee_amount,
          un_receiptamount: res.data.data.un_receipt_amount,

          print_id: res.data.data.print_id,

          time_start: start_time,
          time_end: end_time,
          week_start_time: start_time,
          week_end_time: end_time
        })

      }
    })
  },
  // 选择周报end
  // 选择月报start
  yueTap(e) {
    var that = this

    that.setData({
      mask: 1,
      showyue: 1
    })
    var index = e.currentTarget.dataset.index;
    var array2 = that.data.array2
    var arraytotal = that.data.arraytotal
    console.log(array2)
    for (var i = 0; i < array2.length; i++) {
      if (index == i) {
        this.setData({
          Yuetime: array2[i],
        })
      }
    }

    that.setData({
      week_start_time: that.data.Yuetime.substring(0, 19),
      week_end_time: that.data.Yuetime.substring(20, 39)
    })



    var i = e.currentTarget.dataset.index;
    var yuedate = new Date();
    var yueyear = yuedate.getFullYear();
    var beforeyue = this.data.array2[i].substring(5, 7)
    console.log(beforeyue)

    if (beforeyue == '02') {
      //console.log(yueyear % 4 == 0 ? 29 : 28)
      if (yueyear % 4 == 0) {
        if (beforeyue.toString().length < 2) {
          var onemounthT = yueyear + '-0' + beforeyue + '-' + '01' + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s + '-' + yueyear + '-0' + beforeyue + '-' + '29' + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1;
        } else {
          var onemounthT = yueyear + '-' + beforeyue + '-' + '01' + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s + '-' + yueyear + '-' + beforeyue + '-' + '29' + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1;
        }
        this.setData({
          days: 29,
          yuedata: onemounthT
        })

      } else {
        if (beforeyue.toString().length < 2) {
          var onemounthT = yueyear + '-0' + beforeyue + '-' + '01' + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s + '-' + yueyear + '-0' + beforeyue + '-' + '28' + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1;
        } else {
          var onemounthT = yueyear + '-' + beforeyue + '-' + '01' + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s + '-' + yueyear + '-' + beforeyue + '-' + '28' + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1;
        }
        this.setData({
          days: 28,
          yuedata: onemounthT
        })
      }
    } else if (beforeyue == '01' || beforeyue == '03' || beforeyue == '05' || beforeyue == '07' || beforeyue == '08' || beforeyue == '10' || beforeyue == 12) {
      //console.log('31')
      if (beforeyue.toString().length < 2) {
        var onemounthT = yueyear + '-0' + beforeyue + '-' + '01' + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s + '-' + yueyear + '-0' + beforeyue + '-' + '31' + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1;
      } else {
        var onemounthT = yueyear + '-' + beforeyue + '-' + '01' + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s + '-' + yueyear + '-' + beforeyue + '-' + '31' + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1;
      }
      this.setData({
        days: 31,
        yuedata: onemounthT
      })
    } else {
      //console.log('30')
      if (beforeyue.toString().length < 2) {
        var onemounthT = yueyear + '-0' + beforeyue + '-' + '01' + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s + '-' + yueyear + '-0' + beforeyue + '-' + '30' + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1;
      } else {
        var onemounthT = yueyear + '-' + beforeyue + '-' + '01' + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s + '-' + yueyear + '-' + beforeyue + '-' + '30' + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1;
      }

      this.setData({
        days: 30,
        yuedata: onemounthT
      })
    }

    // console.log(this.data.yuedata)

    var start_time = this.data.yuedata.substring(0, 19)
    var end_time = this.data.yuedata.substring(20, 39)
    that.setData({
      dayin_start_time: start_time,
      dayin_end_time: end_time,
    })
    console.log(start_time)
    console.log(end_time)
    var that = this
    // 经营数据---月
    my.request({
      url: that.data.Request + '/api/merchant/order_count',
      method: 'POST',
      data: {
        token: this.data.token,
        store_id: this.data.storeId,
        merchant_id: that.data.merchantid,
        time_start: start_time,
        time_end: end_time,
      },
      dataType: 'json',
      success(res) {
        console.log(res.data)
        that.setData({
          getamount: res.data.data.get_amount,
          totalamount: res.data.data.total_amount,
          totalcount: res.data.data.total_count,
          refundamount: res.data.data.refund_amount,
          refundcount: res.data.data.refund_count,
          feeamount: res.data.data.fee_amount,
          receiptamount: res.data.data.receipt_amount,

          alipay_totalamount: res.data.data.alipay_total_amount,
          alipay_refundamount: res.data.data.alipay_refund_amount,
          alipay_refundcount: res.data.data.alipay_refund_count,
          alipay_getamount: res.data.data.alipay_get_amount,
          alipay_totalcount: res.data.data.alipay_total_count,
          alipay_feeamount: res.data.data.alipay_fee_amount,
          alipay_receiptamount: res.data.data.alipay_receipt_amount,


          weixin_totalamount: res.data.data.weixin_total_amount,
          weixin_refundamount: res.data.data.weixin_refund_amount,
          weixin_refundcount: res.data.data.weixin_refund_count,
          weixin_getamount: res.data.data.weixin_get_amount,
          weixin_totalcount: res.data.data.weixin_total_count,
          weixin_feeamount: res.data.data.weixin_fee_amount,
          weixin_receiptamount: res.data.data.weixin_receipt_amount,

          huiyuan_totalamount: res.data.data.member_total_amount,
          huiyuan_refundamount: res.data.data.member_refund_amount,
          huiyuan_refundcount: res.data.data.member_refund_count,
          huiyuan_getamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),
          huiyuan_totalcount: res.data.data.member_total_count,
          huiyuan_feeamount: res.data.data.member_total_deduction,
          huiyuan_receiptamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),

          jd_totalamount: res.data.data.jd_total_amount,
          jd_refundamount: res.data.data.jd_refund_amount,
          jd_refundcount: res.data.data.jd_refund_count,
          jd_getamount: res.data.data.jd_get_amount,
          jd_totalcount: res.data.data.jd_total_count,
          jd_feeamount: res.data.data.jd_fee_amount,
          jd_receiptamount: res.data.data.jd_receipt_amount,

          unqr_totalamount: res.data.data.unqr_total_amount,
          unqr_refundamount: res.data.data.unqr_refund_amount,
          unqr_refundcount: res.data.data.unqr_refund_count,
          unqr_getamount: res.data.data.unqr_get_amount,
          unqr_totalcount: res.data.data.unqr_total_count,
          unqr_feeamount: res.data.data.unqr_fee_amount,
          unqr_receiptamount: res.data.data.unqr_receipt_amount,

          un_totalamount: res.data.data.un_total_amount,
          un_refundamount: res.data.data.un_refund_amount,
          un_refundcount: res.data.data.un_refund_count,
          un_getamount: res.data.data.un_get_amount,
          un_totalcount: res.data.data.un_total_count,
          un_feeamount: res.data.data.un_fee_amount,
          un_receiptamount: res.data.data.un_receipt_amount,

          print_id: res.data.data.print_id,

          time_start: start_time,
          time_end: end_time,
        })

      }
    })
  },
  // 选择月报end





  bindPickerChangemonth: function (e) {
    //console.log('月报时间改变', e.detail.value)
    var i = e.detail.value
    //console.log(this.data.array2[i])

  },

  // 门店搜索***************************************
  choiceCancel: function () {
    this.setData({
      show: 1,
      mask: 1,
      canvasShow: false
    })
  },
  totalStore: function () {
    //console.log(this.data.chartsId)

    this.setData({
      mask: 0,
      show: 0,
      showweek: 1,
      showyue: 1,
      showscreen: 1,
      storeId: '',
      firstImg: '../../img/xuanzhong.png',
    })
    var that = this
    my.request({
      url: that.data.Request + "/api/merchant/store_lists",
      method: 'POST',
      data: {
        token: this.data.token,
        l: 200
      },
      dataType: 'json',
      success(res) {
        console.log(res.data)
        that.setData({
          storeArry: res.data.data
        })

      }
    })
  },
  storeItem: function (e) {
    console.log(e.currentTarget.dataset.index)
    // //console.log(this.data.time_start)
    // //console.log(this.data.time_end)
    // this.setData({
    //   show: 1,
    //   mask: 1,
    // })


    var that = this
    if (e.currentTarget.dataset.storeid == '') {
      that.setData({
        storeId: '',
        merchantid: '',
      })
    } else {
      that.setData({
        storeId: e.currentTarget.dataset.storeid,
        choicename: e.currentTarget.dataset.storename,
      })
    }

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
      console.log(changed2)
      that.setData(changed2)
    } else {
      that.setData({
        dataIndex: e.currentTarget.dataset.index
      })
      my.request({
        url: that.data.Request + "/api/merchant/merchant_lists",
        method: 'POST',
        data: {
          token: this.data.token,
          store_id: e.currentTarget.dataset.storeid
        },
        dataType: 'json',
        success(res) {
          console.log(res.data)
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
            console.log(changed2)
            that.setData(changed2)
          }
        }
      })
    }

  },
  // 展示店员--------------------------------------------------------
  merchantTab: function (e) {
    console.log(e.currentTarget.dataset.index)

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
    console.log(changed)
    that.setData(changed)
  },
  // 选择店员-------------------------
  merchantItem: function (e) {
    console.log(e.currentTarget.dataset.index)
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
      } else {
        changed3['merchantArry[' + i + '].show2'] = false
      }
    }
    console.log(changed3)
    that.setData(changed3)
  },

  btnSure: function () {
    var that = this
    console.log(that.data.storeId)
    console.log(that.data.merchantid)
    if (this.data.storeId == '') {
      this.setData({
        totalstorecon: '全部门店'
      })
    } else {
      this.setData({
        totalstorecon: this.data.choicename
      })
    }
    if (this.data.chartsId == 1 || this.data.chartsId == undefined) {
      this.setData({
        canvasShow: false,
      })
    } else {
      this.setData({
        canvasShow2: false,
      })
    }
    that.setData({
      show: 1,
      mask: 1,
    })
    my.request({
      url: that.data.Request + '/api/merchant/order_count',
      method: 'POST',
      data: {
        token: this.data.token,
        store_id: this.data.storeId,
        merchant_id: that.data.merchantid,
        time_start: this.data.RItime + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s,
        time_end: this.data.RItime + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1,
      },
      dataType: 'json',
      success(res) {
        console.log(res.data)
        that.setData({
          getamount: res.data.data.get_amount,
          totalamount: res.data.data.total_amount,
          totalcount: res.data.data.total_count,
          refundamount: res.data.data.refund_amount,
          refundcount: res.data.data.refund_count,
          feeamount: res.data.data.fee_amount,
          receiptamount: res.data.data.receipt_amount,

          alipay_totalamount: res.data.data.alipay_total_amount,
          alipay_refundamount: res.data.data.alipay_refund_amount,
          alipay_refundcount: res.data.data.alipay_refund_count,
          alipay_getamount: res.data.data.alipay_get_amount,
          alipay_totalcount: res.data.data.alipay_total_count,
          alipay_feeamount: res.data.data.alipay_fee_amount,
          alipay_receiptamount: res.data.data.alipay_receipt_amount,


          weixin_totalamount: res.data.data.weixin_total_amount,
          weixin_refundamount: res.data.data.weixin_refund_amount,
          weixin_refundcount: res.data.data.weixin_refund_count,
          weixin_getamount: res.data.data.weixin_get_amount,
          weixin_totalcount: res.data.data.weixin_total_count,
          weixin_feeamount: res.data.data.weixin_fee_amount,
          weixin_receiptamount: res.data.data.weixin_receipt_amount,

          huiyuan_totalamount: res.data.data.member_total_amount,
          huiyuan_refundamount: res.data.data.member_refund_amount,
          huiyuan_refundcount: res.data.data.member_refund_count,
          huiyuan_getamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),
          huiyuan_totalcount: res.data.data.member_total_count,
          huiyuan_feeamount: res.data.data.member_total_deduction,
          huiyuan_receiptamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),

          jd_totalamount: res.data.data.jd_total_amount,
          jd_refundamount: res.data.data.jd_refund_amount,
          jd_refundcount: res.data.data.jd_refund_count,
          jd_getamount: res.data.data.jd_get_amount,
          jd_totalcount: res.data.data.jd_total_count,
          jd_feeamount: res.data.data.jd_fee_amount,
          jd_receiptamount: res.data.data.jd_receipt_amount,

          unqr_totalamount: res.data.data.unqr_total_amount,
          unqr_refundamount: res.data.data.unqr_refund_amount,
          unqr_refundcount: res.data.data.unqr_refund_count,
          unqr_getamount: res.data.data.unqr_get_amount,
          unqr_totalcount: res.data.data.unqr_total_count,
          unqr_feeamount: res.data.data.unqr_fee_amount,
          unqr_receiptamount: res.data.data.unqr_receipt_amount,

          un_totalamount: res.data.data.un_total_amount,
          un_refundamount: res.data.data.un_refund_amount,
          un_refundcount: res.data.data.un_refund_count,
          un_getamount: res.data.data.un_get_amount,
          un_totalcount: res.data.data.un_total_count,
          un_feeamount: res.data.data.un_fee_amount,
          un_receiptamount: res.data.data.un_receipt_amount,

          print_id: res.data.data.print_id,
        })


      }
    })
  },


  // *************时间选择插件*****************// 开始时间插件
  datePickerRItime() {
    var that = this
    my.datePicker({
      format: 'yyyy-MM-dd',
      currentDate: this.data.RItime,
      startDate: '2010-01-01',
      endDate: '2030-01-10',
      success: (res) => {
        console.log(res.date)
        that.setData({
          RItime: res.date,
          dayin_start_time: res.date + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s,
          dayin_end_time: res.date + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1
        })

        // 获取时间
        var nowdate = new Date();
        // 本月
        var year = nowdate.getFullYear();
        var mounth = nowdate.getMonth() + 1;
        var day = nowdate.getDate();
        var hour = nowdate.getHours();//得到小时
        var minu = nowdate.getMinutes();//得到分钟
        var sec = nowdate.getSeconds();//得到秒
        var curData = year + '-' + mounth + '-' + day + ' ' + hour + ':' + minu + ':' + sec
        //console.log(curData)
        var oDate1 = new Date(res.date);//选择的时间
        var oDate2 = new Date(curData);//当前时间
        if (oDate1.getTime() > oDate2.getTime()) {
          console.log('不能超过当前时间')
          my.alert({
            title: '提示',
            content: '不能超过当前时间',
            buttonText: '我知道了',
            success: () => {

            },
          });
        } else {
          // 经营数据---日
          my.request({
            url: that.data.Request + "/api/merchant/order_count",
            method: 'POST',
            data: {
              token: this.data.token,
              store_id: this.data.storeId,
              merchant_id: that.data.merchantid,
              time_start: res.date + ' ' + this.data.h + ':' + this.data.m + ':' + this.data.s,
              time_end: res.date + ' ' + this.data.h1 + ':' + this.data.m1 + ':' + this.data.s1,
            },
            dataType: 'json',
            success(res) {
              console.log(res.data)

              that.setData({
                getamount: res.data.data.get_amount,
                totalamount: res.data.data.total_amount,
                totalcount: res.data.data.total_count,
                refundamount: res.data.data.refund_amount,
                refundcount: res.data.data.refund_count,
                feeamount: res.data.data.fee_amount,
                receiptamount: res.data.data.receipt_amount,

                alipay_totalamount: res.data.data.alipay_total_amount,
                alipay_refundamount: res.data.data.alipay_refund_amount,
                alipay_refundcount: res.data.data.alipay_refund_count,
                alipay_getamount: res.data.data.alipay_get_amount,
                alipay_totalcount: res.data.data.alipay_total_count,
                alipay_feeamount: res.data.data.alipay_fee_amount,
                alipay_receiptamount: res.data.data.alipay_receipt_amount,


                weixin_totalamount: res.data.data.weixin_total_amount,
                weixin_refundamount: res.data.data.weixin_refund_amount,
                weixin_refundcount: res.data.data.weixin_refund_count,
                weixin_getamount: res.data.data.weixin_get_amount,
                weixin_totalcount: res.data.data.weixin_total_count,
                weixin_feeamount: res.data.data.weixin_fee_amount,
                weixin_receiptamount: res.data.data.weixin_receipt_amount,

                huiyuan_totalamount: res.data.data.member_total_amount,
                huiyuan_refundamount: res.data.data.member_refund_amount,
                huiyuan_refundcount: res.data.data.member_refund_count,
                huiyuan_getamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),
                huiyuan_totalcount: res.data.data.member_total_count,
                huiyuan_feeamount: res.data.data.member_total_deduction,
                huiyuan_receiptamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),

                jd_totalamount: res.data.data.jd_total_amount,
                jd_refundamount: res.data.data.jd_refund_amount,
                jd_refundcount: res.data.data.jd_refund_count,
                jd_getamount: res.data.data.jd_get_amount,
                jd_totalcount: res.data.data.jd_total_count,
                jd_feeamount: res.data.data.jd_fee_amount,
                jd_receiptamount: res.data.data.jd_receipt_amount,

                unqr_totalamount: res.data.data.unqr_total_amount,
                unqr_refundamount: res.data.data.unqr_refund_amount,
                unqr_refundcount: res.data.data.unqr_refund_count,
                unqr_getamount: res.data.data.unqr_get_amount,
                unqr_totalcount: res.data.data.unqr_total_count,
                unqr_feeamount: res.data.data.unqr_fee_amount,
                unqr_receiptamount: res.data.data.unqr_receipt_amount,

                un_totalamount: res.data.data.un_total_amount,
                un_refundamount: res.data.data.un_refund_amount,
                un_refundcount: res.data.data.un_refund_count,
                un_getamount: res.data.data.un_get_amount,
                un_totalcount: res.data.data.un_total_count,
                un_feeamount: res.data.data.un_fee_amount,
                un_receiptamount: res.data.data.un_receipt_amount,

                print_id: res.data.data.print_id,

                time_start: res.date + ' ' + that.data.h + ':' + that.data.m + ':' + that.data.s,
                time_end: res.date + ' ' + that.data.h1 + ':' + that.data.m1 + ':' + that.data.s1,
              })

            }
          })
        }
      },
    });
  },

  datePickerWeektime() {
    var that = this
    that.setData({
      mask: 0,
      showweek: 0,
      showyue: 1,
      showscreen: 1,
    })
  },
  datePickerYuetime() {
    var that = this
    that.setData({
      mask: 0,
      showyue: 0,
      showweek: 1,
      showscreen: 1,
    })
  },
  datezidingyistart() {
    var that = this
    my.datePicker({
      format: 'yyyy-MM-dd HH:mm',
      currentDate: this.data.start_time_zdy,
      startDate: '2010-01-01 00:00',
      endDate: '3030-01-10 23:59',
      success: (res) => {
        console.log(res.date)
        console.log(that.data.end_time_zdy)
        that.setData({
          start_time_zdy: res.date,

          dayin_start_time: res.date,
          dayin_end_time: that.data.end_time_zdy,
        })
        // 获取时间
        var nowdate = new Date();
        // 本月
        var year = nowdate.getFullYear();
        var mounth = nowdate.getMonth() + 1;
        var day = nowdate.getDate();
        var curData = year + '-' + mounth + '-' + day
        //console.log(curData)
        var oDate1 = new Date(res.date);//选择的时间
        var oDate2 = new Date(that.data.end_time_zdy);//结束时间
        if (oDate1.getTime() > oDate2.getTime()) {
          console.log('开始时间不能超过结束时间')
          my.alert({
            title: '提示',
            content: '不能超过当前时间',
            buttonText: '我知道了',
            success: () => {

            },
          });
        } else {
          // 经营数据---日
          my.request({
            url: that.data.Request + "/api/merchant/order_count",
            method: 'POST',
            data: {
              token: this.data.token,
              store_id: this.data.storeId,
              merchant_id: that.data.merchantid,
              time_start: res.date,
              time_end: that.data.end_time_zdy
            },
            dataType: 'json',
            success(res) {
              console.log(res.data)

              that.setData({
                getamount: res.data.data.get_amount,
                totalamount: res.data.data.total_amount,
                totalcount: res.data.data.total_count,
                refundamount: res.data.data.refund_amount,
                refundcount: res.data.data.refund_count,
                feeamount: res.data.data.fee_amount,
                receiptamount: res.data.data.receipt_amount,

                alipay_totalamount: res.data.data.alipay_total_amount,
                alipay_refundamount: res.data.data.alipay_refund_amount,
                alipay_refundcount: res.data.data.alipay_refund_count,
                alipay_getamount: res.data.data.alipay_get_amount,
                alipay_totalcount: res.data.data.alipay_total_count,
                alipay_feeamount: res.data.data.alipay_fee_amount,
                alipay_receiptamount: res.data.data.alipay_receipt_amount,


                weixin_totalamount: res.data.data.weixin_total_amount,
                weixin_refundamount: res.data.data.weixin_refund_amount,
                weixin_refundcount: res.data.data.weixin_refund_count,
                weixin_getamount: res.data.data.weixin_get_amount,
                weixin_totalcount: res.data.data.weixin_total_count,
                weixin_feeamount: res.data.data.weixin_fee_amount,
                weixin_receiptamount: res.data.data.weixin_receipt_amount,

                huiyuan_totalamount: res.data.data.member_total_amount,
                huiyuan_refundamount: res.data.data.member_refund_amount,
                huiyuan_refundcount: res.data.data.member_refund_count,
                huiyuan_getamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),
                huiyuan_totalcount: res.data.data.member_total_count,
                huiyuan_feeamount: res.data.data.member_total_deduction,
                huiyuan_receiptamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),

                jd_totalamount: res.data.data.jd_total_amount,
                jd_refundamount: res.data.data.jd_refund_amount,
                jd_refundcount: res.data.data.jd_refund_count,
                jd_getamount: res.data.data.jd_get_amount,
                jd_totalcount: res.data.data.jd_total_count,
                jd_feeamount: res.data.data.jd_fee_amount,
                jd_receiptamount: res.data.data.jd_receipt_amount,

                unqr_totalamount: res.data.data.unqr_total_amount,
                unqr_refundamount: res.data.data.unqr_refund_amount,
                unqr_refundcount: res.data.data.unqr_refund_count,
                unqr_getamount: res.data.data.unqr_get_amount,
                unqr_totalcount: res.data.data.unqr_total_count,
                unqr_feeamount: res.data.data.unqr_fee_amount,
                unqr_receiptamount: res.data.data.unqr_receipt_amount,

                un_totalamount: res.data.data.un_total_amount,
                un_refundamount: res.data.data.un_refund_amount,
                un_refundcount: res.data.data.un_refund_count,
                un_getamount: res.data.data.un_get_amount,
                un_totalcount: res.data.data.un_total_count,
                un_feeamount: res.data.data.un_fee_amount,
                un_receiptamount: res.data.data.un_receipt_amount,

                print_id: res.data.data.print_id,

                time_start: res.date,
                time_end: that.data.endtimezidingyi,
              })

            }
          })
        }
      },
    });
  },
  datezidingyiend() {
    var that = this
    my.datePicker({
      format: 'yyyy-MM-dd HH:mm',
      currentDate: this.data.end_time_zdy,
      startDate: '2010-01-01 00:00',
      endDate: '3020-01-10 23:59',
      success: (res) => {
        console.log(that.data.start_time_zdy)
        console.log(res.date)

        that.setData({
          end_time_zdy: res.date,

          dayin_start_time: that.data.start_time_zdy,
          dayin_end_time: res.date,
        })
        // 获取时间
        var nowdate = new Date();
        // 本月
        var year = nowdate.getFullYear();
        var mounth = nowdate.getMonth() + 1;
        var day = nowdate.getDate();
        var curData = year + '-' + mounth + '-' + day
        //console.log(curData)
        var oDate1 = new Date(res.date);//结束时间
        var oDate2 = new Date(that.data.start_time_zdy);//开始时间
        if (oDate1.getTime() < oDate2.getTime()) {
          console.log('结束时间不能超过开始时间')
          my.alert({
            title: '提示',
            content: '结束时间不能超过开始时间',
            buttonText: '我知道了',
            success: () => {

            },
          });
        } else {
          // 经营数据---日
          my.request({
            url: that.data.Request + "/api/merchant/order_count",
            method: 'POST',
            data: {
              token: this.data.token,
              store_id: this.data.storeId,
              merchant_id: that.data.merchantid,
              time_start: that.data.start_time_zdy,
              time_end: res.date
            },
            dataType: 'json',
            success(res) {
              console.log(res.data)

              that.setData({
                getamount: res.data.data.get_amount,
                totalamount: res.data.data.total_amount,
                totalcount: res.data.data.total_count,
                refundamount: res.data.data.refund_amount,
                refundcount: res.data.data.refund_count,
                feeamount: res.data.data.fee_amount,
                receiptamount: res.data.data.receipt_amount,

                alipay_totalamount: res.data.data.alipay_total_amount,
                alipay_refundamount: res.data.data.alipay_refund_amount,
                alipay_refundcount: res.data.data.alipay_refund_count,
                alipay_getamount: res.data.data.alipay_get_amount,
                alipay_totalcount: res.data.data.alipay_total_count,
                alipay_feeamount: res.data.data.alipay_fee_amount,
                alipay_receiptamount: res.data.data.alipay_receipt_amount,


                weixin_totalamount: res.data.data.weixin_total_amount,
                weixin_refundamount: res.data.data.weixin_refund_amount,
                weixin_refundcount: res.data.data.weixin_refund_count,
                weixin_getamount: res.data.data.weixin_get_amount,
                weixin_totalcount: res.data.data.weixin_total_count,
                weixin_feeamount: res.data.data.weixin_fee_amount,
                weixin_receiptamount: res.data.data.weixin_receipt_amount,

                huiyuan_totalamount: res.data.data.member_total_amount,
                huiyuan_refundamount: res.data.data.member_refund_amount,
                huiyuan_refundcount: res.data.data.member_refund_count,
                huiyuan_getamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),
                huiyuan_totalcount: res.data.data.member_total_count,
                huiyuan_feeamount: res.data.data.member_total_deduction,
                huiyuan_receiptamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),

                jd_totalamount: res.data.data.jd_total_amount,
                jd_refundamount: res.data.data.jd_refund_amount,
                jd_refundcount: res.data.data.jd_refund_count,
                jd_getamount: res.data.data.jd_get_amount,
                jd_totalcount: res.data.data.jd_total_count,
                jd_feeamount: res.data.data.jd_fee_amount,
                jd_receiptamount: res.data.data.jd_receipt_amount,

                unqr_totalamount: res.data.data.unqr_total_amount,
                unqr_refundamount: res.data.data.unqr_refund_amount,
                unqr_refundcount: res.data.data.unqr_refund_count,
                unqr_getamount: res.data.data.unqr_get_amount,
                unqr_totalcount: res.data.data.unqr_total_count,
                unqr_feeamount: res.data.data.unqr_fee_amount,
                unqr_receiptamount: res.data.data.unqr_receipt_amount,

                un_totalamount: res.data.data.un_total_amount,
                un_refundamount: res.data.data.un_refund_amount,
                un_refundcount: res.data.data.un_refund_count,
                un_getamount: res.data.data.un_get_amount,
                un_totalcount: res.data.data.un_total_count,
                un_feeamount: res.data.data.un_fee_amount,
                un_receiptamount: res.data.data.un_receipt_amount,

                print_id: res.data.data.print_id,

                time_start: res.date,
                time_end: that.data.endtimezidingyi,
              })

            }
          })
        }
      },
    });
  },
  btnSurecom() {
    var that = this
    that.setData({
      mask: 1,
      showweek: 1,
      showyue: 1,
    })
  },
  screenTap() {
    var that = this
    that.setData({
      mask: 0,
      showscreen: 0,
      showyue: 1,
      showweek: 1,
      top: 0,
    })
  },
  dijineInput(e) {
    this.setData({
      dijine: e.detail.value
    })
  },
  gaojineInput(e) {
    this.setData({
      gaojine: e.detail.value
    })
  },

  chongzhi() {
    this.setData({
      gaojine: '',
      dijine: ''
    })
  },
  btnSureScreen() {
    console.log(this.data.start_time_zdy)
    console.log(this.data.end_time_zdy)
    this.setData({
      mask: 1,
      showscreen: 1
    })
    my.request({
      url: that.data.Request + "/api/merchant/order_count",
      method: 'POST',
      data: {
        token: this.data.token,
        store_id: this.data.storeId,
        merchant_id: that.data.merchantid,
        time_start: this.data.start_time_zdy,
        time_end: this.data.end_time_zdy,
      },
      dataType: 'json',
      success(res) {
        console.log(res.data)

        that.setData({
          getamount: res.data.data.get_amount,
          totalamount: res.data.data.total_amount,
          totalcount: res.data.data.total_count,
          refundamount: res.data.data.refund_amount,
          refundcount: res.data.data.refund_count,
          feeamount: res.data.data.fee_amount,
          receiptamount: res.data.data.receipt_amount,

          alipay_totalamount: res.data.data.alipay_total_amount,
          alipay_refundamount: res.data.data.alipay_refund_amount,
          alipay_refundcount: res.data.data.alipay_refund_count,
          alipay_getamount: res.data.data.alipay_get_amount,
          alipay_totalcount: res.data.data.alipay_total_count,
          alipay_feeamount: res.data.data.alipay_fee_amount,
          alipay_receiptamount: res.data.data.alipay_receipt_amount,


          weixin_totalamount: res.data.data.weixin_total_amount,
          weixin_refundamount: res.data.data.weixin_refund_amount,
          weixin_refundcount: res.data.data.weixin_refund_count,
          weixin_getamount: res.data.data.weixin_get_amount,
          weixin_totalcount: res.data.data.weixin_total_count,
          weixin_feeamount: res.data.data.weixin_fee_amount,
          weixin_receiptamount: res.data.data.weixin_receipt_amount,

          huiyuan_totalamount: res.data.data.member_total_amount,
          huiyuan_refundamount: res.data.data.member_refund_amount,
          huiyuan_refundcount: res.data.data.member_refund_count,
          huiyuan_getamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),
          huiyuan_totalcount: res.data.data.member_total_count,
          huiyuan_feeamount: res.data.data.member_total_deduction,
          huiyuan_receiptamount: (res.data.data.member_total_amount - res.data.data.member_total_deduction).toFixed(2),

          jd_totalamount: res.data.data.jd_total_amount,
          jd_refundamount: res.data.data.jd_refund_amount,
          jd_refundcount: res.data.data.jd_refund_count,
          jd_getamount: res.data.data.jd_get_amount,
          jd_totalcount: res.data.data.jd_total_count,
          jd_feeamount: res.data.data.jd_fee_amount,
          jd_receiptamount: res.data.data.jd_receipt_amount,

          unqr_totalamount: res.data.data.unqr_total_amount,
          unqr_refundamount: res.data.data.unqr_refund_amount,
          unqr_refundcount: res.data.data.unqr_refund_count,
          unqr_getamount: res.data.data.unqr_get_amount,
          unqr_totalcount: res.data.data.unqr_total_count,
          unqr_feeamount: res.data.data.unqr_fee_amount,
          unqr_receiptamount: res.data.data.unqr_receipt_amount,

          un_totalamount: res.data.data.un_total_amount,
          un_refundamount: res.data.data.un_refund_amount,
          un_refundcount: res.data.data.un_refund_count,
          un_getamount: res.data.data.un_get_amount,
          un_totalcount: res.data.data.un_total_count,
          un_feeamount: res.data.data.un_fee_amount,
          un_receiptamount: res.data.data.un_receipt_amount,

          print_id: res.data.data.print_id,

        })

      }
    })
  },


  printTap() {
    var checked = my.getStorageSync({ key: 'checked' }.data);

    if (checked== true) {
      my.alert({
        content: '打印机已连接',
      });
    }
    else {
      my.alert({
        content: '请连接打印机',
      });
    }

    my.alert({
      content: '打印机已连接',
    });
    // console.log(this.data.dayin_start_time)
    // console.log(this.data.dayin_end_time)
    // ************************************------------**************************
    var print = my.getStorageSync({ key: 'print' }).data;
    if (print == 1) {
      this.printa()
      console.log('1遍')
    } else {
      this.printa()
      // this.printb()
      console.log('2遍')
    }
  },
  printa() {
    // console.log(this.data.dayin_start_time)
    // console.log(this.data.dayin_end_time)
    // ************************************------------**************************
    var nowdate = new Date();
    nowdate.setMonth(nowdate.getMonth());
    var y = nowdate.getFullYear();
    var mon = nowdate.getMonth() + 1;
    var d = nowdate.getDate();
    var h = nowdate.getHours();
    var m = nowdate.getMinutes();
    var s = nowdate.getSeconds();
    var todayData
    if (mon.toString().length < 2 && d.toString().length < 2) {
      todayData = y + '-0' + mon + '-0' + d + ' ' + h + ':' + m + ':' + s
    } else if (d.toString().length < 2) {
      todayData = y + '-' + mon + '-0' + d + ' ' + h + ':' + m + ':' + s
    } else if (mon.toString().length < 2) {
      todayData = y + '-0' + mon + '-' + d + ' ' + h + ':' + m + ':' + s
    } else {
      todayData = y + '-' + mon + '-' + d + '-' + h + ':' + m + ':' + s
    }
    // console.log(todayData)//打印的时间--当前时间
    var checked = my.getStorageSync({ key: 'checked' }).data;
    if (checked == true) {
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
            target: r.usb[0].id,
            cmds: [{ 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
            { 'cmd': 'addText', 'args': ['门店汇总单'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'ON'] },
            { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
            { 'cmd': 'addText', 'args': ['门店:' + this.data.totalstorecon] },
            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
            // {'cmd':'addSelectJustification', 'args': ['LEFT']},
            // {'cmd':'addText', 'args':['门店编号:'+this.data.totalstorecon]},
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['开始时间:' + this.data.dayin_start_time] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['结束时间:' + this.data.dayin_end_time] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['收银员:全部收银员'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            // { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            // { 'cmd': 'addText', 'args': ['支付类型           ------------'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['------------支付宝------------'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['交易笔数:' + this.data.alipay_totalcount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['交易金额:' + this.data.alipay_totalamount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['退款笔数:' + this.data.alipay_refundcount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['退款金额:' + this.data.alipay_refundamount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['支付宝实收金额:' + this.data.alipay_getamount] },

            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            // { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            // { 'cmd': 'addText', 'args': ['支付类型           ------------'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['-----------微信支付-----------'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['交易笔数:' + this.data.weixin_totalcount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['交易金额:' + this.data.weixin_totalamount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['退款笔数:' + this.data.weixin_refundcount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['退款金额:' + this.data.weixin_refundamount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['微信实收金额:' + this.data.weixin_getamount] },

            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            // { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            // { 'cmd': 'addText', 'args': ['支付类型           ------------'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['-----------京东支付-----------'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['交易笔数:' + this.data.jd_totalcount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['交易金额:' + this.data.jd_totalamount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['退款笔数:' + this.data.jd_refundcount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['退款金额:' + this.data.jd_refundamount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['京东实收金额:' + this.data.jd_getamount] },

            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            // { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            // { 'cmd': 'addText', 'args': ['支付类型           ------------'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['------------云闪付------------'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['交易笔数:' + this.data.unqr_totalcount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['交易金额:' + this.data.unqr_totalamount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['退款笔数:' + this.data.unqr_refundcount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['退款金额:' + this.data.unqr_refundamount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['云闪付实收金额:' + this.data.unqr_getamount] },


            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            // { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            // { 'cmd': 'addText', 'args': ['支付类型           ------------'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['-----------会员支付-----------'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['交易笔数:' + this.data.huiyuan_totalcount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['交易金额:' + this.data.huiyuan_totalamount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['退款笔数:' + this.data.huiyuan_refundcount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['退款金额:' + this.data.huiyuan_refundamount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['会员收入金额:' + this.data.huiyuan_receiptamount] },





            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
            // {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
            // {'cmd':'addText', 'args':['---------------------刷卡支付---------------']},
            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
            // {'cmd':'addText', 'args':['交易笔数:'+this.data.un_totalcount]},
            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
            // {'cmd':'addText', 'args':['交易金额:'+this.data.un_totalamount]},
            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
            // {'cmd':'addText', 'args':['退款笔数:'+this.data.un_refundcount]},
            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
            // {'cmd':'addText', 'args':['退款金额:'+this.data.un_refundamount]},
            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
            // {'cmd':'addText', 'args':['刷卡收入金额:'+this.data.un_receiptamount]},

            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
            // {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
            // {'cmd':'addText', 'args':['---------------------花呗支付---------------']},
            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
            // {'cmd':'addText', 'args':['交易笔数:'+this.data.hbfq_totalcount]},
            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
            // {'cmd':'addText', 'args':['交易金额:'+this.data.hbfq_totalamount]},
            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
            // {'cmd':'addText', 'args':['退款笔数:'+this.data.hbfq_refundcount]},
            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
            // {'cmd':'addText', 'args':['退款金额:'+this.data.hbfq_refundamount]},
            // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
            // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
            // {'cmd':'addText', 'args':['花呗收入金额:'+this.data.hbfq_receiptamount]},

            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行

            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['总计交易笔数:' + this.data.totalcount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['总计交易金额:' + this.data.totalamount + '元'] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['总计退款笔数:' + this.data.refundcount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['总计退款金额:' + this.data.refundamount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['总计实收金额:' + this.data.getamount] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['总计会员金额:' + this.data.huiyuan_getamount] },


            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
            { 'cmd': 'addText', 'args': ['打印时间:' + todayData] },
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            ],
            success: (r) => {
              console.log(r)
              // if(r.success==true){

              // }
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
              target: r.usb[0].id,
              cmds: [{ 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
              { 'cmd': 'addText', 'args': ['门店汇总单'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'ON'] },
              { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
              { 'cmd': 'addText', 'args': ['门店:' + this.data.totalstorecon] },
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addSelectJustification', 'args': ['LEFT']},
              // {'cmd':'addText', 'args':['门店编号:'+this.data.totalstorecon]},
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['开始时间:' + this.data.dayin_start_time] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['结束时间:' + this.data.dayin_end_time] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['收银员:全部收银员'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              // { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              // { 'cmd': 'addText', 'args': ['支付类型           ------------'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['------------支付宝------------'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['交易笔数:' + this.data.alipay_totalcount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['交易金额:' + this.data.alipay_totalamount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['退款笔数:' + this.data.alipay_refundcount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['退款金额:' + this.data.alipay_refundamount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['支付宝实收金额:' + this.data.alipay_getamount] },

              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              // { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              // { 'cmd': 'addText', 'args': ['支付类型           ------------'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['-----------微信支付-----------'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['交易笔数:' + this.data.weixin_totalcount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['交易金额:' + this.data.weixin_totalamount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['退款笔数:' + this.data.weixin_refundcount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['退款金额:' + this.data.weixin_refundamount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['微信实收金额:' + this.data.weixin_getamount] },

              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              // { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              // { 'cmd': 'addText', 'args': ['支付类型           ------------'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['-----------京东支付-----------'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['交易笔数:' + this.data.jd_totalcount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['交易金额:' + this.data.jd_totalamount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['退款笔数:' + this.data.jd_refundcount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['退款金额:' + this.data.jd_refundamount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['京东实收金额:' + this.data.jd_getamount] },

              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              // { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              // { 'cmd': 'addText', 'args': ['支付类型           ------------'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['------------云闪付------------'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['交易笔数:' + this.data.unqr_totalcount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['交易金额:' + this.data.unqr_totalamount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['退款笔数:' + this.data.unqr_refundcount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['退款金额:' + this.data.unqr_refundamount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['云闪付实收金额:' + this.data.unqr_getamount] },


              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              // { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              // { 'cmd': 'addText', 'args': ['支付类型           ------------'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['-----------会员支付-----------'] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['交易笔数:' + this.data.huiyuan_totalcount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['交易金额:' + this.data.huiyuan_totalamount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['退款笔数:' + this.data.huiyuan_refundcount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['退款金额:' + this.data.huiyuan_refundamount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['会员收入金额:' + this.data.huiyuan_receiptamount] },

              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['---------------------扫码支付---------------']},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['交易笔数:'+this.data.unqr_totalcount]},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['交易金额:'+this.data.unqr_totalamount]},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['退款笔数:'+this.data.unqr_refundcount]},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['退款金额:'+this.data.unqr_refundamount]},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['扫码收入金额:'+this.data.unqr_receiptamount]},

              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['---------------------刷卡支付---------------']},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['交易笔数:'+this.data.un_totalcount]},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['交易金额:'+this.data.un_totalamount]},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['退款笔数:'+this.data.un_refundcount]},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['退款金额:'+this.data.un_refundamount]},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['刷卡收入金额:'+this.data.un_receiptamount]},

              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['---------------------花呗支付---------------']},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['交易笔数:'+this.data.hbfq_totalcount]},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['交易金额:'+this.data.hbfq_totalamount]},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['退款笔数:'+this.data.hbfq_refundcount]},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['退款金额:'+this.data.hbfq_refundamount]},
              // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
              // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
              // {'cmd':'addText', 'args':['花呗收入金额:'+this.data.hbfq_receiptamount]},

              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行

              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['总计交易笔数:' + this.data.totalcount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['总计交易金额:' + this.data.totalamount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['总计退款笔数:' + this.data.refundcount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['总计退款金额:' + this.data.refundamount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['总计实收金额:' + this.data.getamount] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              // {'cmd':'addText', 'args':['总计会员金额:'+this.data.huiyuan_getamount]},


              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
              { 'cmd': 'addText', 'args': ['打印时间:' + todayData] },
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
              ],
              success: (r) => {
                console.log(r)
                // if(r.success==true){

                // }
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

    } else {

    }

  },
  // printb(){
  //   // console.log(this.data.dayin_start_time)
  //   // console.log(this.data.dayin_end_time)
  //   // ************************************------------**************************
  //   var nowdate = new Date();
  //   nowdate.setMonth(nowdate.getMonth());
  //   var y = nowdate.getFullYear();
  //   var mon = nowdate.getMonth() + 1;
  //   var d = nowdate.getDate();
  //   var h = nowdate.getHours();
  //   var m = nowdate.getMinutes();
  //   var s = nowdate.getSeconds();
  //   var todayData
  //   if(mon.toString().length<2 && d.toString().length<2){
  //     todayData=y+'-0'+mon+'-0'+d+' '+h+':'+m+':'+s
  //   }else if(d.toString().length<2){
  //     todayData=y+'-'+mon+'-0'+d+' '+h+':'+m+':'+s
  //   }else if(mon.toString().length<2){
  //     todayData=y+'-0'+mon+'-'+d+' '+h+':'+m+':'+s
  //   }else{
  //     todayData=y+'-'+mon+'-'+d+'-'+h+':'+m+':'+s
  //   }
  //   // console.log(todayData)//打印的时间--当前时间
  //   var checked = my.getStorageSync({ key: 'checked' }).data;
  //   if(checked == true){
  //     // 开始监听
  //     my.ix.startMonitorPrinter({
  //       success: (r) => {
  //         console.log("success");      
  //       },
  //       fail: (r) => {
  //         console.log("fail, errorCode:" + r.error);
  //       }
  //     });
  //     // 查询连接的打印机的 API
  //     my.ix.queryPrinter({
  //       success: (r) => {
  //         console.log(r)
  //         my.ix.printer({
  //           target:r.usb[0].id,
  //           cmds: [{'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']}, 
  //                 {'cmd':'addSelectJustification', 'args': ['CENTER']},
  //                 {'cmd':'addText', 'args':['凭证二']},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'ON']}, 
  //                 {'cmd':'addSelectJustification', 'args': ['LEFT']},
  //                 {'cmd':'addText', 'args':['门店:'+this.data.totalstorecon]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addSelectJustification', 'args': ['LEFT']},
  //                 {'cmd':'addText', 'args':['门店编号:'+this.data.totalstorecon]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['开始时间:'+this.data.dayin_start_time]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['结束时间:'+this.data.dayin_end_time]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['收银员:全部收银员']},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['---------------------支付宝---------------']},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['交易笔数:'+this.data.alipay_totalcount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['交易金额:'+this.data.alipay_totalamount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['退款笔数:'+this.data.alipay_refundcount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['退款金额:'+this.data.alipay_refundamount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['支付宝收入金额:'+this.data.alipay_receiptamount]},

  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['---------------------微信支付---------------']},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['交易笔数:'+this.data.weixin_totalcount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['交易金额:'+this.data.weixin_totalamount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['退款笔数:'+this.data.weixin_refundcount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['退款金额:'+this.data.weixin_refundamount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['微信收入金额:'+this.data.weixin_receiptamount]},

  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['---------------------会员支付---------------']},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['交易笔数:'+this.data.huiyuan_totalcount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['交易金额:'+this.data.huiyuan_totalamount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['退款笔数:'+this.data.huiyuan_refundcount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['退款金额:'+this.data.huiyuan_refundamount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['会员收入金额:'+this.data.huiyuan_receiptamount]},

  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['---------------------京东支付---------------']},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['交易笔数:'+this.data.jd_totalcount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['交易金额:'+this.data.jd_totalamount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['退款笔数:'+this.data.jd_refundcount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['退款金额:'+this.data.jd_refundamount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['京东收入金额:'+this.data.jd_receiptamount]},

  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['---------------------扫码支付---------------']},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['交易笔数:'+this.data.unqr_totalcount]},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['交易金额:'+this.data.unqr_totalamount]},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['退款笔数:'+this.data.unqr_refundcount]},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['退款金额:'+this.data.unqr_refundamount]},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['扫码收入金额:'+this.data.unqr_receiptamount]},

  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['---------------------刷卡支付---------------']},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['交易笔数:'+this.data.un_totalcount]},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['交易金额:'+this.data.un_totalamount]},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['退款笔数:'+this.data.un_refundcount]},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['退款金额:'+this.data.un_refundamount]},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['刷卡收入金额:'+this.data.un_receiptamount]},

  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['---------------------花呗支付---------------']},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['交易笔数:'+this.data.hbfq_totalcount]},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['交易金额:'+this.data.hbfq_totalamount]},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['退款笔数:'+this.data.hbfq_refundcount]},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['退款金额:'+this.data.hbfq_refundamount]},
  //                 // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 // {'cmd':'addText', 'args':['花呗收入金额:'+this.data.hbfq_receiptamount]},

  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行

  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['总计成功笔数:'+this.data.totalcount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['总计成功金额:'+this.data.totalamount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['总计退款笔数:'+this.data.refundcount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['总计退款金额:'+this.data.refundamount]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['总计实收金额:'+this.data.getamount]},
  // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  // {'cmd':'addText', 'args':['总计会员金额:'+this.data.huiyuan_getamount]},

  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                 {'cmd':'addText', 'args':['打印时间:'+todayData]},
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //               ],
  //           success: (r) => {
  //             console.log(r)
  //             // if(r.success==true){

  //             // }
  //           },

  //           fail: (r) => {
  //             // console.log(r)
  //           }
  //         })
  //       },
  //       fail: (r) => {
  //         console.log(r)
  //         this.setData({
  //           message: JSON.stringify(r)
  //         })
  //       }
  //     });
  //     my.ix.onMonitorPrinter((r) => {
  //       console.log("received data:" + r);
  //       // 查询连接的打印机的 API
  //       my.ix.queryPrinter({
  //         success: (r) => {
  //           console.log(r)
  //           my.ix.printer({
  //             target:r.usb[0].id,
  //             cmds: [{'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']}, 
  //                   {'cmd':'addSelectJustification', 'args': ['CENTER']},
  //                   {'cmd':'addText', 'args':['凭证二']},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'ON']}, 
  //                   {'cmd':'addSelectJustification', 'args': ['LEFT']},
  //                   {'cmd':'addText', 'args':['门店:'+this.data.totalstorecon]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addSelectJustification', 'args': ['LEFT']},
  //                   {'cmd':'addText', 'args':['门店编号:'+this.data.totalstorecon]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['开始时间:'+this.data.dayin_start_time]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['结束时间:'+this.data.dayin_end_time]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['收银员:全部收银员']},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['---------------------支付宝---------------']},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['交易笔数:'+this.data.alipay_totalcount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['交易金额:'+this.data.alipay_totalamount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['退款笔数:'+this.data.alipay_refundcount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['退款金额:'+this.data.alipay_refundamount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['支付宝收入金额:'+this.data.alipay_receiptamount]},

  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['---------------------微信支付---------------']},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['交易笔数:'+this.data.weixin_totalcount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['交易金额:'+this.data.weixin_totalamount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['退款笔数:'+this.data.weixin_refundcount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['退款金额:'+this.data.weixin_refundamount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['微信收入金额:'+this.data.weixin_receiptamount]},

  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['---------------------会员支付---------------']},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['交易笔数:'+this.data.huiyuan_totalcount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['交易金额:'+this.data.huiyuan_totalamount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['退款笔数:'+this.data.huiyuan_refundcount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['退款金额:'+this.data.huiyuan_refundamount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['会员收入金额:'+this.data.huiyuan_receiptamount]},

  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['---------------------京东支付---------------']},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['交易笔数:'+this.data.jd_totalcount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['交易金额:'+this.data.jd_totalamount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['退款笔数:'+this.data.jd_refundcount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['退款金额:'+this.data.jd_refundamount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['京东收入金额:'+this.data.jd_receiptamount]},

  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['---------------------扫码支付---------------']},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['交易笔数:'+this.data.unqr_totalcount]},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['交易金额:'+this.data.unqr_totalamount]},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['退款笔数:'+this.data.unqr_refundcount]},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['退款金额:'+this.data.unqr_refundamount]},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['扫码收入金额:'+this.data.unqr_receiptamount]},

  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['---------------------刷卡支付---------------']},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['交易笔数:'+this.data.un_totalcount]},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['交易金额:'+this.data.un_totalamount]},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['退款笔数:'+this.data.un_refundcount]},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['退款金额:'+this.data.un_refundamount]},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['刷卡收入金额:'+this.data.un_receiptamount]},

  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['支付类型           当前设备/合计']},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['---------------------花呗支付---------------']},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['交易笔数:'+this.data.hbfq_totalcount]},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['交易金额:'+this.data.hbfq_totalamount]},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['退款笔数:'+this.data.hbfq_refundcount]},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['退款金额:'+this.data.hbfq_refundamount]},
  //                   // {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   // {'cmd':'addText', 'args':['花呗收入金额:'+this.data.hbfq_receiptamount]},

  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行

  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['总计成功笔数:'+this.data.totalcount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['总计成功金额:'+this.data.totalamount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['总计退款笔数:'+this.data.refundcount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['总计退款金额:'+this.data.refundamount]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['总计实收金额:'+this.data.getamount]},
  //   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  // {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  // {'cmd':'addText', 'args':['总计会员金额:'+this.data.huiyuan_getamount]},

  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addSelectPrintModes', 'args':['FONTA', 'OFF', 'OFF', 'OFF', 'OFF']},
  //                   {'cmd':'addText', 'args':['打印时间:'+todayData]},
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                   {'cmd':'addPrintAndLineFeed', 'args':[]},//打印并换行
  //                 ],
  //             success: (r) => {
  //               console.log(r)
  //               // if(r.success==true){

  //               // }
  //             },

  //             fail: (r) => {
  //               // console.log(r)
  //             }
  //           })        
  //         },
  //         fail: (r) => {
  //           console.log(r)
  //           this.setData({
  //             message: JSON.stringify(r)
  //           })
  //         }
  //       });
  //     });
  //     // # 结束监听
  //     my.ix.offMonitorPrinter({
  //       success: (r) => {
  //         console.log("success");
  //       },
  //       fail: (r) => {
  //         console.log("fail, errorCode:" + r.error);
  //       }
  //     });  

  //   }else{

  //   }

  // }



})