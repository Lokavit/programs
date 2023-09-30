/**
 * 2021.03.01 重写登出模块
 */

Page({
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 获取缓存的当前登入账号及当前认证门店
    const USER_INFO = my.getStorageSync({ key: 'userInfo' }).data;
    if (USER_INFO) this.setData({ userInfo: USER_INFO });
  },

  /** 登出事件 */
  onSignout() {
    my.confirm({
      title: '确定退出当前账号吗？',
      content: '退出后将不能使用流水功能',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.confirm) {
          console.warn('登出事件', result.confirm);
          // 账号登出，移除相关缓存值
          my.removeStorageSync({ key: 'userInfo' });
          // 跳转到登入页面
          my.reLaunch({ url: '../signin/signin' });
        }
      }
    });
  }
})