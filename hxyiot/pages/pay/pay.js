import { GENERATE_BIZ_NO } from '/utils/util.js';
import md5 from '/utils/md5.js';
import { JSONSORT } from '/utils/util.js';
import { FORMAT_CURRENCY } from '/utils/util.js';

Page({
  data: {
    // payMethods: [{
    //   code: 0,
    //   name: '刷脸/刷码支付',
    // }, {
    //   code: 1,
    //   name: '会员支付',
    // }, {
    //   code: 2,
    //   name: '二维码付',
    // }, {
    //   code: 3,
    //   name: '花呗分期',
    // }]
  },

  onLoad(query) {
    console.warn('支付处理加载：', query.amount);
    // 获取缓存的设备信息
    const DEVICE_INFO = my.getStorageSync({ key: 'deviceInfo' }).data;
    // 获取缓存的系统信息
    const SYSTEM_INFO = my.getStorageSync({ key: 'systemInfo' }).data;
    // 获取缓存的用户信息
    const USER_INFO = my.getStorageSync({ key: 'userInfo' }).data;
    // 获取缓存的收银模式码
    const CASHIER_MODE = my.getStorageSync({ key: 'cashierMode' }).data;
    /** 为以上缓存设置当前data，便于使用 */
    this.setData({
      deviceInfo: DEVICE_INFO,
      systemInfo: SYSTEM_INFO,
      userInfo: USER_INFO,
      cashierMode: CASHIER_MODE,
      // 付款金额
      payAmount: Number(query.amount).toFixed(2) > 0 ? Number(query.amount).toFixed(2) : 0,
      // 付款金额 显示在页面
      // payAmountDec: FORMAT_CURRENCY(Number(query.amount).toFixed(2) > 0 ? Number(query.amount).toFixed(2) : 0)
    });


    /** 开启收银台事件监听的 API 
        appName:"cashier"
        appPackage:"zoloz.phone.android.alipay.com.dragonfly"
        bizType:"RESULT_DF_STATUS"
        data:{amount:"0.01"} // 从此处开始，直至整个流程走完，只有此处带有金额。
        status:"Cashier" // 收银台⻚⾯
    
      * 如果点击顶部扫码提示 (其他值一样，唯有状态不同)
        status:"CashierTipShow" // 展开扫码提示 
        status:"CashierTipHide" // 收起扫码提示
    
      * 如果点击了刷脸支付
        status:"START_SMILE" // 应该是开始刷脸，但未能在官方文档中找到
    
        * 如果点击开启并支付 (非首次使用，此处会变成确认支付)
        status: "RESULT_SEARCHING" // 等待支付结果事件
    
        * 程序会再次启动收银台。而后返回超时结果
        status: "SHOW_RESULT_DEFAULT" // 未知结果事件
    
      * 默认超时之后 ，点击刷脸支付，超时之后
          appName:"cashier"
          appPackage:"zoloz.phone.android.alipay.com.dragonfly"
          bizType:"RESULT_CLOSED" 
      */
    my.ix.onCashierEventReceive((r) => {
      console.warn('pay.js 收银台事件监听API:', r);
      if (r.bizType === 'RESULT_CLOSED') {
        // 关闭收银台事件监听的 API
        my.ix.offCashierEventReceive();
        // 应该在关闭时，跳转到index页面
        // my.reLaunch({ url: '../index/index' });
      }
      else if (r.bizType === 'RESULT_BTN_FUNCTION') {
        console.warn('pay.js 收银台事件监听API:自定义按钮按下');
        // my.showToast({ content: '收银台自定义按钮按下' });
      }
      else {
        console.warn('pay.js 收银台事件监听API:else', r);
      }
    });

    // 判断收银模式 之 独立收银模式
    if (this.data.cashierMode.MODE_CODE == 0) {
      console.warn('pay.js 独立模式:', this.data.cashierMode.MODE_CODE);
      // 调用独立收银模式函数
      this.modeSingle({
        /** 生成商户业务流水号 */
        bizNo: GENERATE_BIZ_NO(),
        /** 订单总金额 */
        totalAmount: this.data.payAmount
      });
    }
    // 收银模式 之 收银机模式
    else if (this.data.cashierMode.MODE_CODE == 1) {
      console.warn('pay.js 收银模式:', this.data.cashierMode.MODE_CODE);
      this.modeCashier({
        /** 生成商户业务流水号 */
        bizNo: GENERATE_BIZ_NO(),
      });
    }
  },

  // /**
  //  * 选择支付方式 开启多种支付方式时，方可用。
  //  * @param {*} event 
  //  */
  // selectPayMethod(event) {
  //   console.warn('消费者选择支付模式', event);
  //   // 选中的收款方式
  //   let method_code = event.currentTarget.dataset.code;

  //   // 判断收银模式 之 独立收银模式
  //   if (this.data.cashierMode.MODE_CODE == 0) {
  //     console.warn('pay.js 独立模式:', this.data.cashierMode.MODE_CODE);
  //     // 收款方式为刷脸/刷码支付
  //     if (method_code == 0) {
  //       console.warn('当前选择刷脸刷码支付');
  //       // 调用独立收银模式函数
  //       this.modeSingle({
  //         /** 生成商户业务流水号 */
  //         bizNo: GENERATE_BIZ_NO(),
  //         /** 订单总金额 */
  //         totalAmount: this.data.payAmount
  //       });
  //     }
  //     // 如果是会员支付
  //     else if (method_code == 1) {
  //       console.warn('会员相关逻辑');
  //       // 判断当前消费者是否为会员，引导消费者开通会员，并储值。
  //     }
  //     // 如果是二维码支付，设备展示二维码给消费者
  //     // 如果是花呗分期，处理相关逻辑
  //   }
  //   // 收银模式 之 收银机模式
  //   else if (this.data.cashierMode.MODE_CODE == 1) {
  //     console.warn('pay.js 收银模式:', this.data.cashierMode.MODE_CODE);
  //     this.modeCashier({
  //       /** 生成商户业务流水号 */
  //       bizNo: GENERATE_BIZ_NO(),
  //     });
  //   }
  // },

  /**
   * 独立收银模式
   * 一定是有金额且金额>0才会进入，所以此处无需对金额做三次校验
   */
  modeSingle(params) {
    console.warn('独立收银模式:', this.data.cashierMode.MODE_CODE, params);
    // 唤醒收银台
    my.ix.startApp({
      appName: 'cashier',       // 固定值 cashier，不能修改
      /**
       * 解构 params
       * bizNo：商户业务流水号；需保证在商户端不重复。
       * totalAmount：订单总金额。入参上限为 100 万元，即单笔订单最大金额不能超过 100 万元
       */
      ...params,
      /** 支付方式选择页超时时间 90s */
      posTimeout: '90',
      success: (result) => {
        console.warn('pay.js 启动收银台:', result);

        /**
         * 支付宝付款码扫码支付、微信付款码扫码支付、刷脸支付
         * 通过以上三种测试返回数据，得出其共通所需属性值为：
         */
        let temp_data_common = {
          /** 设备SN 原版使用了定义(缓存)的数据？ */
          device_id: this.data.deviceInfo.DEVICE_SN,
          /** 设备类型 原版使用了明文字符串 */
          device_type: this.data.deviceInfo.DEVICE_TYPE,
          /** 支付方式 原版使用名为字符串 */
          pay_method: "alipay_face",
          /** 支付行为？  */
          pay_action: this.data.systemInfo.PAY_ACTION,
          /** 该值似乎为写死的1234 原版使用缓存值 */
          config_id: this.data.systemInfo.CONFIG_ID,
          /** 门店ID 原版使用缓存值 */
          store_id: this.data.userInfo.STORE_ID,
          /** 商户ID 原版使用缓存值  */
          merchant_id: this.data.userInfo.MERCHANT_ID,
          /** 商户名 原版使用缓存值 */
          merchant_name: this.data.userInfo.USER_NAME,
          /** 商户业务流水号 原版使用按下收款键时，生成的号 */
          out_trade_no: params.bizNo,
          /** 原版为返回的barCode */
          auth_code: result.barCode,
          /** 原版为金额转字符串 */
          total_amount: params.totalAmount.toString(),
        }

        // 以上对象转str作为sign的 md5值使用
        let md5_str = md5(`${JSONSORT(temp_data_common)}&key=88888888`);
        console.warn('md5加密后的值:', md5_str);

        /** 支付接口 */
        my.request({
          url: `https://vip.whlxsz.com/api/devicepay/all_pay`,
          // url: `${this.data.hostApi.REQUEST}${this.data.hostApi.SCAN_PAY}`,
          method: 'POST',
          data: {
            ...temp_data_common, // 对象中已包含
            sign: md5_str // md5加密值
          },
          dataType: 'json',
          success: (resPay) => {
            console.warn('支付结果:', resPay);
            /* 
              或者将支付结果显示到pay页面，
              支付成功：显示信息、领券、广告等
              支付失败：显示关于失败的一些信息。
              然后，统一re路由到index页面。即本次流程结束。
             */
            // 支付宝扫码支付成功
            if (resPay.data.result_code == "SUCCESS") {
              // 支付结果通信标志码
              let temp_payResult = {
                code: resPay.data.result_code == "SUCCESS" ? true : false,
                msg: resPay.data.result_msg // 支付成功/支付失败
              }
              this.setData({ payResult: temp_payResult });
              // 页面需要一些显示值
              let temp_payInfo = [
                {
                  label: '支付方式',
                  value: resPay.data.ways_source_desc
                }, {
                  label: '支付金额',
                  value: resPay.data.pay_amount,
                }, {
                  label: '支付单号',
                  value: resPay.data.out_trade_no
                }, {
                  label: '支付时间',
                  value: resPay.data.pay_time
                }
              ];
              // 用于页面展示
              this.setData({ payInfo: temp_payInfo })
              console.warn('页面需要的值:', this.data.payInfo);

              // 支付成功后的广告
              my.request({
                url: `https://vip.whlxsz.com/api/ad/ad_lists_new`,
                // url: `${this.data.hostApi.REQUEST}${this.data.hostApi.PAY_ADLISTS}`,
                method: 'POST',
                data: {
                  DeviceId: this.data.deviceInfo.DEVICE_SN,
                  DeviceType: this.data.deviceInfo.DEVICE_TYPE,
                  AdPid: 3 // 投放位置
                },
                success: (res) => {
                  console.warn('拉取广告:', res);
                  this.setData({ adList: res.data.data[0].ad_file });
                },
                fail: function (res) {
                  console.log('拉取广告失败', res)
                },
              })

              // 如果是扫码支付
              if (result.codeType == "C") {
                // 语音播报 判断源为支付宝/微信，执行对应语音。刷脸支付无需单独设置。
                my.ix.voicePlay({
                  eventId: `${resPay.data.ways_source == 'alipay' ? 'pay_succeed_with_summary' : 'ZFDZ'}`,
                  number: resPay.data.pay_amount,
                  success: (r) => {
                    console.warn('语音播报:', r);
                    setTimeout(() => {
                      // 跳转到index
                      my.reLaunch({ url: '../index/index' });
                    }, 5000)
                  },
                  fail: (err) => {
                    console.warn('err:', err);
                  },
                });
              }
              // 非扫码付款，通常即为刷脸支付
              else {
                // 跳转到index，还是留在支付结果页面？
                my.reLaunch({ url: '../index/index' });
              }

            }
          },
          fail: (res) => {
            console.warn('支付接口err：', res);
          },
          complete: () => { }
        });
      },
      fail: (r) => {
        console.warn('唤醒收银台 fail:', r);
        // 收款=》未付=》设置
        if (r.error == 1700) {
          my.navigateTo({ url: '../setting/setting' })
        }
        //  收款=》未付=》取消 或者 收款=》刷脸=》取消
        if (r.error == 1500 || r.error == 1200) {
          // my.reLaunch({ url: '../index/index' })
          onBack();  // 回到支付选择页面
        }
      }

    })
  },

  /**
   * 收银机收银模式
   */
  modeCashier(params) {
    console.warn('收银机收银模式', params);
    // my.ix.writeHID 是发送付款码的 API
    my.ix.startApp({
      appName: 'cashier',
      bizNo: params.bizNo,
      success: (res) => {
        console.warn('启动收银台', res);
        // 对支付操作进行处理，结果显示到页面
      }
    })


  },

  /** 客显模式 (收银机上金额在此显示) */
  modeCashierGuest() { },

  /** 酒店预授权(押金)模式 */
  modeDeposit() { },

  /** 支付成功 底部发财广告。外链不生效。 */
  getReward(event) {
    console.warn("获取优惠券/广告", event);
  }

})