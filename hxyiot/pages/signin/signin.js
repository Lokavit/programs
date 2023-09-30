/**
 * 2021.02.26 新的登入模块
 */

Page({
  data: {
    /** 底部显隐状态值 */
    showFooter: true,
    /** 密码显隐状态值 */
    showPwd: false,
    /** 登入按钮是否禁用 */
    isDisabled: "",
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad() {
    // 获取缓存的设备信息
    const DEVICE_INFO = my.getStorageSync({ key: 'deviceInfo' }).data;
    // 获取缓存的hostApi
    const HOST_API = my.getStorageSync({ key: 'hostApi' }).data;
    // 获取缓存的ISV信息
    const ISV_INFO = my.getStorageSync({ key: 'isvInfo' }).data;
    this.setData({
      deviceInfo: DEVICE_INFO,
      hostApi: HOST_API,
      isvPhone: ISV_INFO.ISV_PHONE,
      isvBanner: ISV_INFO.ISV_BANNER
    });
    console.log('signin.js onLoad', this.data);

    // 获取账密缓存值，当首次输入值之后，会将其缓存。
    const SIGNIN_INFO = my.getStorageSync({ key: 'signinInfo' }).data;
    // 因页面账密输入框，所以此处赋值分开写
    if (SIGNIN_INFO) {
      this.setData({
        userPhone: SIGNIN_INFO.PHONE,
        userPwd: SIGNIN_INFO.PASSWORD,
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    my.ix.offKeyEventChange();
  },

  // 在登入页面点击左上角
  events: {
    onBack() {
      console.log('signin.js onBack--返回了广告页(index)');
    }
  },

  /** 聚焦事件 输入框聚焦时，隐藏底部 */
  onFocus() {
    this.setData({ showFooter: false });
    console.warn('聚焦事件:', this.data.showFooter);
  },

  /** 失焦事件 输入框失焦时，显示底部 */
  onBlur() {
    this.setData({ showFooter: true });
    console.warn('失焦事件:', this.data.showFooter);
  },

  /** 获取账号输入值 */
  getPhone(event) {
    if (event.detail.value && event.detail.value != "") {
      this.setData({ userPhone: event.detail.value });
      console.warn('账号输入值:', event.detail.value);
    }
  },

  /** 获取密码输入值 */
  getPwd(event) {
    if (event.detail.value && event.detail.value != "") {
      this.setData({ userPwd: event.detail.value });
      console.warn('密码输入值:', event.detail.value);
    }
  },

  /** 密码显隐切换 */
  onshowpwd() {
    console.warn('密码显隐切换图', this.data.showPwd);
    this.setData({ showPwd: !this.data.showPwd });
  },

  /**
   * 登入事件
   */
  onSignin() {
    // 点击登入按钮，设置按钮禁用，防止用户多次点击
    this.setData({ isDisabled: "true" });
    // 设置登陆进度
    my.showLoading({ content: '正在登入...', });
    console.warn('signin.js onSignin()', this);
    // 点击登入之后，设置账密缓存值
    my.setStorageSync({
      key: 'signinInfo',
      data: {
        PHONE: this.data.userPhone,
        PASSWORD: this.data.userPwd,
      }
    });

    // 在此需获取到用户输入的账密值
    my.request({
      url: `${this.data.hostApi.REQUEST}${this.data.hostApi.SIGNIN}`,
      method: 'POST',
      data: {
        phone: this.data.userPhone,
        password: this.data.userPwd,
        device_id: this.data.deviceInfo.DEVICE_SN,
        device_type: this.data.deviceInfo.DEVICE_TYPE,
      },
      dataType: 'json',
      success: (result) => {
        my.hideLoading(); // 隐藏登陆进度
        // 如果状态码=1
        if (result.data.status == 1) {
          console.warn('登入成功，处理相关数据', result);
          // 设置当前登入返回的信息后续所需值
          my.setStorageSync({
            key: 'userInfo', data: {
              // 设置登入状态
              SIGNIN_STATUS: true,
              // 设置当前登入成功返回的token缓存
              TOKEN: result.data.data.token,
              // 设置当前登入账号缓存。此处使用返回结果中的手机号，而不使用登入时输入值，避免前后台不一致。
              USER_PHONE: result.data.data.phone,
              // 设置当前登入用户名字缓存
              USER_NAME: result.data.data.name,
              // 设置当前登入商户自增ID的缓存
              MERCHANT_ID: result.data.data.merchant_id,
              // 设置当前登入账号认证门店ID缓存
              STORE_ID: result.data.data.store_id,
              // 设置当前登入账号认证门店名缓存
              STORE_NAME: result.data.data.store_name,
            }
          })

          // 获取缓存的收银模式
          const CASHIER_MODE = my.getStorageSync({ key: 'cashierMode' }).data;
          // 是否已经设置了收银模式 ? 已设置(跳转到index):未设置(跳转到设置收款模式 cashiermode)
          CASHIER_MODE ? my.reLaunch({ url: '../index/index' }) : my.reLaunch({ url: '../cashiermode/cashiermode' })

        } else {
          // 设备不存在的情况下
          my.alert({
            // title: 'HI',
            content: result.data.message,
            buttonText: '我知道了',
            success: () => {
              // 拿到请求结果，重新打开按钮事件
              this.setData({ isDisabled: "" });
            },
          });
        }
      },
      fail: (err) => {
        console.error('signin.js error', err);
      },
      complete: () => { }
    });
  }
})