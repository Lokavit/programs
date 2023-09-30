/**
 * 当app.js执行完毕，开始执行index相关
 */
import { Page } from '/utils/ix'; // 添加这行 2021.03.02
import md5 from '/utils/md5.js';
import { JSONSORT } from '/utils/util.js';

let app = getApp(); // 全局的 getApp() 方法，可获取当前小程序实例，一般用于在子页面中获取顶层应用

Page({
  data: {
    /** swiper 是否显示指示点 */
    indicatorDots: true,
    /** swiper 是否自动切换 */
    autoplay: true,
    /** swiper 滑动方向是否为纵向 */
    vertical: false,
    /** swiper 自动切换时间间隔 */
    interval: 5000,
    /** swiper 是否启用无限滑动 */
    circular: true,
  },

  onLoad() {
    console.warn('index.js onLoad:', my.getStorageInfoSync());
    // 获取缓存的设备信息 于app.js设置该缓存
    const DEVICE_INFO = my.getStorageSync({ key: 'deviceInfo' }).data;
    // 获取缓存的收银模式码
    const CASHIER_MODE = my.getStorageSync({ key: 'cashierMode' }).data;
    // 获取缓存的广告组
    const AD_DATA = my.getStorageSync({ key: 'adData' }).data;
    // 打印功能设置的缓存值
    const PRINT_SET = my.getStorageSync({ key: 'printset' }).data;
    // 获取缓存的系统信息
    const SYSTEM_INFO = my.getStorageSync({ key: 'systemInfo' }).data;
    /** 为以上缓存设置当前data，便于使用 */
    this.setData({
      deviceInfo: DEVICE_INFO,
      systemInfo: SYSTEM_INFO,
      cashierMode: CASHIER_MODE,
      adDataList: AD_DATA,
      printSet: PRINT_SET
    });
    console.warn('index.js 获取缓存:', this.data);

    console.warn('是否支持扫付款码：', my.canIUse('ix.codeScan'));

    /** 暂存对象，后续使用
     * 此处对象的key必须与原版一致，因为需要md5加密匹配，擅改规则后端有可能抛回错误
     */
    let temp_data = {
      device_id: this.data.deviceInfo.DEVICE_SN, // 设备SN
      device_type: this.data.deviceInfo.DEVICE_TYPE, // 设备类型
      version: app.globalData.VERSION, // 初始版本号
    }
    // 以上对象转str作为sign的 md5值使用
    let md5_str = md5(`${JSONSORT(temp_data)}&key=88888888`);
    console.warn('设备初始化所需md5加密后的值:', md5_str);

    /**
     * 设备初始化 主要返回版本号、sign和一堆API。
     */
    my.request({
      // 此处的域名使用全局变量，之后其他请求使用以下返回结果中Request的缓存值
      url: `${app.globalData.HOST}/api/devicepay/face_device_start`,
      method: 'POST',
      data: {
        ...temp_data, // 解构暂存的设备信息对象
        sign: md5_str,
      },
      dataType: 'json',
      success: function (result) {
        console.warn('index.js 设备初始化post结果 success:', result.data);
        // 设置缓存host及所有api的对象。
        my.setStorageSync({
          key: 'hostApi', data: {
            // 2.1 版本号(似乎是API的版本) 用在[关于、设置(有声明但未使用)]
            VERSION: result.data.Version,
            // https://vip.whlxsz.com HOST
            REQUEST: result.data.Request,
            // /api/devicepay/face_pay_start 刷脸支付初始化
            PAY_INIT: result.data.PayInit,
            // /api/merchant/login 登入API 
            SIGNIN: result.data.Login,
            // /api/merchant/store_lists 商户门店列表
            MERCHANT_STORE_LISTS: result.data.MerchantStoreLists,
            // /api/merchant/merchant_lists 获取店员列表
            MERCHANT_MERCHANT_LISTS: result.data.MerchantMerchantLists,
            // /api/merchant/order 门店流水
            MERCHANT_ORDER: result.data.MerchantOrder,
            // /api/merchant/order_count 订单列表
            MERCHANT_ORDER_COUNT: result.data.MerchantOrderCount,
            // /api/merchant/order_info 订单详情
            MERCHANT_ORDER_INFO: result.data.MerchantOrderInfo,
            // ScanPay:"/api/devicepay/all_pay" 支付接口
            SCAN_PAY: result.data.ScanPay,
            // CheckPayPassword:/api/merchant/check_pay_password 校验密码 
            CHECK_PAY_PWD: result.data.CheckPayPassword,
            // MerchantRefund:"/api/merchant/refund" 退款
            MERCHANT_REFUND: result.data.MerchantRefund,
            // 支付成功后的广告
            PAY_ADLISTS: '/api/ad/ad_lists_new',
          }
        });
        /**
         * 支付初始化
         * 返回是否有该设备。如果有，则返回该设备的相关信息(绑定的门店、店员等信息)
         * 该返回结果与是否登入账号无关，是经过后台管理系统=》门店管理=》设备绑定操作后，返回的结果。
         */
        let { device_id, device_type } = temp_data;
        let md5_str_ = md5(`${JSONSORT({ device_id, device_type })}&key=88888888`);
        my.request({
          url: `${result.data.Request}${result.data.PayInit}`,
          method: 'POST',
          data: {
            device_id: temp_data.device_id,
            device_type: temp_data.device_type,
            sign: md5_str_,
          },
          dataType: 'json',
          success: (res) => {
            console.warn('index.js 支付初始化post结果 success:', res.data);
            // 如果有广告业务，并且数据数组>0，则对轮播图及轮播视频进行分类型处理。
            if (res.data.ad_data.length > 0) {
              res.data.ad_data.map(item => {
                let arr = item.ad_file.split('.');
                item.type = arr[arr.length - 1] == 'jpg' || 'png' ? 'img' : 'video';
              })
              console.warn('轮播所需:', res.data.ad_data);
              // 设置 广告缓存
              my.setStorageSync({ key: 'adData', data: res.data.ad_data });
            }

            /** 从请求结果中，设置一些后续所需缓存值 */
            my.setStorageSync({
              key: 'isvInfo', data: {
                // 设置缓存 设备中部分页面所需的热线电话，该电话由后台管理系统=》APP配置=》客服电话
                ISV_PHONE: res.data.isv_phone,
                // 设置缓存 设备小程序名称，(如：慧鑫云)
                // ISV_NAME: res.data.isv_name,
                // 设置缓存 设备小程序LOGO，(如：慧鑫云的蓝色图标)
                // ISV_LOGO: res.data.isv_logo,
                // 设置缓存 设备部分页面所需，底部横幅(如:三合一图标)由后台管理系统中上传配置[登入页、设置页]
                ISV_BANNER: res.data.login_logo,
              }
            })

            /**
             * 从请求结果中，设置一些其它需要的缓存值
             */
            my.setStorageSync({
              key: 'systemInfo', data: {
                // config_id:"1234"
                CONFIG_ID: res.data.config_id,
                // pay_action:"pay"
                PAY_ACTION: res.data.pay_action,
              }
            })

            /**
             * 当设备初始化执行完毕
             * 在此通过 获取缓存的用户信息，判断程序需要跳转到(index/signin)
             * reLaunch():关闭当前所有页面，跳转到应用内的某个指定页面(房子)
             */
            const USER_INFO = my.getStorageSync({ key: 'userInfo' }).data;
            console.warn('index.js USER_INFO:', USER_INFO);
            // !缓存的用户信息 跳转到signin (使用者必须先登入)
            if (!USER_INFO) my.reLaunch({ url: '../signin/signin' });
          },
          fail: () => { },
          complete: () => { }
        });
      },
      fail: function (rest) { },
      complete: function (rest) {
        my.hideLoading(); // 隐藏加载提示的过渡效果
      }
    });
  },

  onShow() { },

  /** 键盘指令及相关处理 */
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
    console.warn('index.js KeyEvent', r);

    // 跳转到设置页面
    if (r.keyCode == 134) {
      my.navigateTo({ url: '../setting/setting' })
    }

    // 应该在外界接盘按下 [收款]时，获取金额，并进行严格判断
    if (r.keyCode == 131) {
      console.warn('index.js keyCode==131 收款 金额为:', r.amount);
      // 优先判断输入金额是否>0 避免无用输入及跳转
      let temp_amount = Number(r.amount).toFixed(2) > 0 ? Number(r.amount).toFixed(2) : 0
      if (temp_amount > 0) {
        console.warn('输入金额>0', temp_amount);
        // 如果当前没有任何收银模式，则跳转到收银模式设置页面
        if (!this.data.cashierMode) {
          my.reLaunch({ url: '../cashiermode/cashiermode' });
          return;
        }
        // 跳转到支付处理页面。由于支付相关逻辑较负责，单独放在一个页面里处理
        my.reLaunch({ url: `../pay/pay?amount=${temp_amount}` });
      }

    }
  },


  /** 付款码？扫码支付? */
  // cashFunction() {
  //   // my.ix.startCodeScan({scanType: "ALL"});//容器10.1.60.1-7可不调用
  //   console.warn('付款码？', this);
  //   // my.ix.offCodeScan()//关闭扫码
  //   // this.cashFunction()
  //   // console.log('再次走函数')
  // },

  // ***********关闭键盘事件监听********************    
  onHide() {
    my.ix.offKeyEventChange(); // 关闭按键事件监听
  },

  // 页面加载完成
  onReady() {
    // 是否隐藏回到主页
    if (my.canIUse('hideBackHome')) {
      my.hideBackHome();
    }
  },

  /** 收银机收银模式下 唤起收银台 点击事件 */
  wakeCashier() {
    console.warn('点击唤醒收银台');
    // 跳转到支付处理页面。由于支付相关逻辑较负责，单独放在一个页面里处理
    my.reLaunch({ url: `../pay/pay` });
  },

  /** 打印 */
  dayina() { },

  /** 打印 */
  dayinaa() { },



  /** 客显刷脸 原客显模式所需 点击事件 */
  kxfaceTap() { },

});
