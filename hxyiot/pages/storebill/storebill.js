/**
 * 2021.03.04 门店流水
 */
import { FORMAT_CURRENCY } from '/utils/util.js';

Page({
  data: {
    /** 门店默认值下标 */
    storeNameIndex: 0,
    /** 店员默认值下标 */
    storeEmployeeIndex: 0
  },
  /**
* 生命周期函数--监听页面加载
*/
  onLoad() {
    // 获取缓存的hostApi
    const HOST_API = my.getStorageSync({ key: 'hostApi' }).data;
    // 获取缓存的当前登入账号及当前认证门店
    const USER_INFO = my.getStorageSync({ key: 'userInfo' }).data;
    this.setData({ hostApi: HOST_API, userInfo: USER_INFO });
    // 获取全部门店
    this.getStoreList();
    // 默认获取当日数据
    this.onSearch();
  },

  /** 每次显示，重新请求一次数据，以保证数据同步 */
  onShow() {
    this.onSearch();
  },

  /** 选择门店 */
  onChangeStore(value) {
    console.warn('storebill.js 选择门店:', value);
    // 每次变更门店的选择项，都将店员项设置为[全部店员]
    if (value != this.data.storeNameIndex) this.setData({ storeEmployeeIndex: 0 });
    // 设置门店选择项
    this.setData({ storeNameIndex: value });
    // Index=0的时候，不需要获取门店ID
    if (this.data.storeNameIndex > 0) {
      //  为门店ID赋值 用于接口
      this.setData({ storeId: this.data.storeList[this.data.storeNameIndex].store_id });
      // 获取店员列表
      this.getMerchantList();
      console.warn('picker-item 选中的门店:', this.data.storeId);
      // 获取交易统计数据
      this.onSearch();
    }
  },

  /** 选择店员 */
  onChangeEmployee(value) {
    console.warn('storebill.js 选择店员:', value);
    // 设置当前选中项
    this.setData({ storeEmployeeIndex: value });
    // 选中之后，为店员ID赋值 用于接口
    this.setData({ merchantId: this.data.storeEmployeeList[this.data.storeEmployeeIndex].merchant_id });
    console.warn('picker 选中的店员:', this.data.merchantId);
    // 获取交易统计数据
    this.onSearch();
  },

  /** 获取门店列表 */
  getStoreList() {
    my.request({
      url: `${this.data.hostApi.REQUEST}${this.data.hostApi.MERCHANT_STORE_LISTS}`,
      data: {
        token: this.data.userInfo.TOKEN,
        l: 200
      },
      success: (result) => {
        if (result.data.status == 1 && result.data.data.length > 0) {
          // 向数组中添加第一位元素[全部]
          result.data.data.unshift({ store_name: '全部门店' });
          // 设置门店列表
          this.setData({ storeList: result.data.data });
          console.warn('storebill.js 处理后的门店数组：', this.data.storeList);
        }
      }
    });
  },

  /** 获取员工列表 */
  getMerchantList() {
    my.request({
      url: `${this.data.hostApi.REQUEST}${this.data.hostApi.MERCHANT_MERCHANT_LISTS}`,
      data: {
        token: this.data.userInfo.TOKEN,
        store_id: this.data.storeId,
      },
      success: (result) => {
        if (result.data.status == 1 && result.data.data.length > 0) {
          // 向数组中添加第一位元素[全部]
          result.data.data.unshift({ name: '全部店员' });
          // 设置店员列表
          this.setData({ storeEmployeeList: result.data.data });
          console.warn('storebill.js 处理后的店员数组：', this.data.storeEmployeeList);
        }
      }
    });
  },

  /** 查询 似乎只能查当日 */
  onSearch() {
    my.request({
      url: `${this.data.hostApi.REQUEST}${this.data.hostApi.MERCHANT_ORDER}`,
      method: 'POST',
      data: {
        token: this.data.userInfo.TOKEN,
        store_id: this.data.storeId, // 非必须
        merchant_id: this.data.merchantId, // 非必须
        p: '1', // ？？
        l: '15' // ？？
      },
      dataType: 'json',
      success: (result) => {
        console.warn('storebill.js 查询结果：', result);
        // 查询结果中的每笔交易概览 交易列表
        // 格式化列表中的金额项 total_amount
        result.data.data.map(item => item.total_amount = FORMAT_CURRENCY(item.total_amount));
        this.setData({ orderList: result.data.data });
        console.warn('交易列表：', this.data.orderList);
      },
      fail: () => { },
      complete: () => { }
    });
  },

  /** 点击单笔概览，跳转到详情页面 */
  onDetail(event) {
    console.warn('点击单笔概览', event.currentTarget.dataset.outtradeno);
    my.navigateTo({
      url: `../paydetail/paydetail?out_trade_no=${event.currentTarget.dataset.outtradeno}`,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /** 自定义查询 */
  onSearchCustom() {
    // 跳转到自定义查询页面
    my.navigateTo({ url: '../customsearch/customsearch' })
  },

  /** 订单号查询 20213152223876584 */
  onSearchOrderNo() {
    // 点击弹出输入订单号的弹层
    my.prompt({
      title: '订单号查询',
      message: '请输入订单号',
      placeholder: '订单号',
      align: '',
      okButtonText: '查询',
      cancelButtonText: '取消',
      success: (result) => {
        if (result.ok) {
          console.warn('订单号:', result.inputValue);
          let outtradeno = result.inputValue;
          my.navigateTo({
            url: `../paydetail/paydetail?out_trade_no=${outtradeno}`,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
        }
      },
      fail: () => { },
      complete: () => { }
    });
  },

  // /** 二维码查询 */
  // onSearchQR() {
  //   console.warn('二维码查询');
  //   my.ix.codeScan({
  //     success: (r) => {
  //       console.log('code: ' + r.code);
  //     },
  //     fail: (r) => {
  //       console.log('error: ' + r.errorMessage);
  //     }
  //   });
  // }

})