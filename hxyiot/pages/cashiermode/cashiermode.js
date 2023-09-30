/**
 * 2021.03.01 重写收银模式模块
 */

Page({
  data: {
    /** 收银模式列表 */
    cashierList: [
      { code: 0, name: '独立收银模式', desc: '无需连接收银机，独立键盘' },
      { code: 1, name: '收银机收银模式', desc: '通过USB连接收银机，进行收款' },
      { code: 2, name: '花呗分期模式', desc: '无需连接收银机，分期收款', disabled: true },
      { code: 3, name: '酒店预授权模式', desc: '适用于酒店、租赁行业，先收押金后扣款' },
      { code: 4, name: '固定金额模式', desc: '当前尚未设置固定收款金额', disabled: true },
      { code: 5, name: '客显模式', desc: '通过USB连接收银机，读取金额' }
    ],
    // /** 当前选中收银模式项 */
    currentMode: -1,
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad() { },

  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady() { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取缓存的收银模式
    const CASHIER_MODE = my.getStorageSync({ key: 'cashierMode' }).data;
    // 非首次情况下，可能已有缓存选项，获取并赋值给当前模式
    if (CASHIER_MODE) this.setData({ currentMode: CASHIER_MODE.MODE_CODE });
    console.warn('缓存的模式:', this.data.currentMode);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    // my.ix.offKeyEventChange();
  },

  onSelectedMode(event) {
    let temp_current_code = event.currentTarget.dataset.code;
    console.warn('点选收银模式：', temp_current_code);
    // 弹出是否确认变更收银模式的弹层
    my.confirm({
      title: `您确定将收银模式切换为:`,
      content: `${this.data.cashierList[temp_current_code].name}`,
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          console.warn('确认:', result.confirm);
          // 将当前选中项code赋值
          this.setData({ currentMode: temp_current_code });
          // 再将其设置为收银模式缓存
          my.setStorageSync({
            key: 'cashierMode', data: {
              MODE_CODE: this.data.currentMode,
              MODE_NAME: this.data.cashierList[this.data.currentMode].name
            }
          });

          if (this.data.currentMode == 4) {
            // 跳转到gudingjine页面
            my.reLaunch({ url: '../gudingjine/gudingjine' });
          } else if (this.data.currentMode == 5) {
            // 获取POS机列表，及后续操作
          } else {
            // 0123 跳转到index
            my.reLaunch({ url: '../index/index' });
          }
        }
      },
      fail: () => { },
      complete: () => { }
    });
  }
})