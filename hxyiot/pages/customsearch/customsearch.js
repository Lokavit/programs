/**
 * 2021.03.04 自定义查询
 */
import { FORMAT_CURRENT_DATETIME, FORMAT_CURRENT_TODAY, FORMAT_CURRENCY } from '/utils/util.js';

Page({
  data: {
    /** 门店默认值下标 */
    storeNameIndex: 0,
    /** 店员默认值下标 */
    storeEmployeeIndex: 0,
    /** 订单状态下标 */
    orderStatusIndex: 0,
    /** 订单状态 */
    orderStatus: [
      { code: 0, desc: "全部状态" },
      { code: 1, desc: '交易成功' },
      { code: 2, desc: '等待支付' },
      { code: 3, desc: '交易失败' },
      { code: 6, desc: '已退款' },
    ],
    /** 开始时间 */
    startDateTime: `${FORMAT_CURRENT_TODAY()} 00:00:00`, // 默认值使用当日00:00:00?
    /** 结束时间 */
    endDateTime: `${FORMAT_CURRENT_DATETIME()}`, // 默认值: 使用当前时间 
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() { },

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
    }
  },

  /** 选择店员 */
  onChangeEmployee(value) {
    console.warn('customsearch.js 选择店员:', value);
    // 设置当前选中项
    this.setData({ storeEmployeeIndex: value });
    // 选中之后，为店员ID赋值 用于接口
    this.setData({ merchantId: this.data.storeEmployeeList[this.data.storeEmployeeIndex].merchant_id });
    console.warn('picker 选中的店员:', this.data.merchantId);
  },

  /** 选择订单状态 */
  onChangeOrderStatus(value) {
    console.warn('customsearch.js 选择订单状态:', value);
    this.setData({ orderStatusIndex: value });
    // 选中之后，为订单状态赋值，用于接口
    this.setData({ payStatus: this.data.orderStatus[this.data.orderStatusIndex].code });
    console.warn('当前选中的订单状态CODE：', this.data.payStatus);
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

  /** 日期选择器 开始时间 */
  onStartDateTime() {
    my.datePicker({
      format: 'yyyy-MM-dd HH:mm:ss',
      // 初始选择的日期时间，默认当日0点
      currentDate: `${FORMAT_CURRENT_TODAY()} 00:00:00`, // 当日
      // 最小日期时间 用户注册日期之类
      startDate: "",
      // 最大日期时间 当日当时当分当秒
      endDate: `${FORMAT_CURRENT_DATETIME()}`,
      success: (res) => {
        this.setData({ startDateTime: res.date })
      },
    });
  },

  /** 日期选择器 结束时间 */
  onEndDateTime() {
    my.datePicker({
      format: 'yyyy-MM-dd HH:mm:ss',
      // 初始选择的日期时间，默认当前时间
      currentDate: `${FORMAT_CURRENT_TODAY()} 00:00:00`, // 当日
      // 最小日期时间 用户注册日期之类
      startDate: '2021-01-01 11:11',
      // 最大日期时间 当日当时当分当秒
      endDate: `${FORMAT_CURRENT_TODAY()} 23:59:59`,
      success: (res) => {
        this.setData({ endDateTime: res.date })
      },
    });
  },

  /** 查询 */
  onSearch() {
    // 开始时间必须小于结束时间
    if (new Date(this.data.startDateTime) >= new Date(this.data.endDateTime)) {
      my.alert({
        content: '开始时间必须小于结束时间',
        buttonText: '确认',
        success: () => { },
      });
      return;
    }
    console.warn('查询函数:', this.data);


    my.request({
      url: `${this.data.hostApi.REQUEST}${this.data.hostApi.MERCHANT_ORDER_COUNT}`,
      method: 'POST',
      data: {
        token: this.data.userInfo.TOKEN,
        store_id: this.data.storeId, // 非必须
        merchant_id: this.data.merchantId, // 非必须
        pay_status: this.data.payStatus, // 非必须 选中的订单状态
        // time_start: `${this.data.startDateTime}`,
        time_start: `2021-03-01 09:00:00`,
        time_end: `${this.data.endDateTime}`,
        return_type: '02',
        p: '1', // ？？
        l: '15' // ？？
      },
      dataType: 'json',
      success: (result) => {
        console.warn('customsearch.js 查询结果：', result);
        // 查询结果中的交易统计
        let temp_trade_data = {
          title: '交易统计',
          desc: '商家实收 + 退款金额 = 交易金额',
          /** 商家实收 */
          merchantLabel: '商家实收',
          merchantAmount: FORMAT_CURRENCY(result.data.data.get_amount),
          /** 交易金额/笔数 */
          tradeLabel: '交易金额/笔数',
          tradeAmount: FORMAT_CURRENCY(result.data.data.total_amount),
          tradeCount: result.data.data.total_count,
          /** 退款金额/笔数 */
          refundLabel: '退款金额/笔数',
          refundAmount: FORMAT_CURRENCY(result.data.data.refund_amount),
          refundCount: result.data.data.refund_count,
        }
        this.setData({ tradeStatistics: temp_trade_data });
        console.warn('交易统计：', this.data.tradeStatistics);

        // 查询结果中的每笔交易概览 order_list 交易列表
        // 格式化列表中的金额项 total_amount
        result.data.data.order_list.map(item => item.total_amount = FORMAT_CURRENCY(item.total_amount));
        this.setData({ orderList: result.data.data.order_list });
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
  }
})