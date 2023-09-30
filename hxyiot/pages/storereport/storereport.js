/** 经营简报 */
import { RETURN_WEEK_INTERVAL, FORMAT_CURRENT_YEAR_AND_MONTH, FORMAT_CURRENT_TODAY, FORMAT_CURRENT_DATETIME, FORMAT_CURRENCY } from '/utils/util.js';

Page({
  data: {
    /** 门店默认值下标 */
    storeNameIndex: 0,
    /** 店员默认值下标 */
    storeEmployeeIndex: 0,
    /** 简报模式下标 */
    reportModeIndex: 0,
    /** 简报模式 */
    reportMode: [
      { code: 0, desc: "日报" },
      { code: 1, desc: '周报' },
      { code: 2, desc: '月报' },
      { code: 3, desc: '自定义' }
    ],
    /** 星期下标 */
    weekIndex: 0,
    /** 当前日期 当日 */
    today: FORMAT_CURRENT_TODAY(),
    /** 开始时间 默认值使用当日00:00:00 */
    startDateTime: `${FORMAT_CURRENT_TODAY()} 00:00:00`,
    /** 结束时间  默认值: 使用当前时间  */
    endDateTime: `${FORMAT_CURRENT_DATETIME()}`,
  },
  onLoad() {
    // 获取缓存的hostApi
    const HOST_API = my.getStorageSync({ key: 'hostApi' }).data;
    if (HOST_API) this.setData({ hostApi: HOST_API });
    // 获取缓存的当前登入账号及当前认证门店
    const USER_INFO = my.getStorageSync({ key: 'userInfo' }).data;
    if (USER_INFO) this.setData({ userInfo: USER_INFO });
    // 获取全部门店
    this.getStoreList();
    // 获取星期区间列表 (当前日期，注册日期)
    let temp_all_week = RETURN_WEEK_INTERVAL(FORMAT_CURRENT_TODAY(), '2019-11-11');
    // 把数组中的对象元素，格式化为： 2021/03/15 - 2021/03/21
    this.setData({ weekList: temp_all_week });
    // 设置默认为第一个周期元素
    this.setData({ selectedWeek: this.data.weekList[0] });
    console.warn('默认周期：', this.data.selectedWeek);
    // 设置默认月份为当前月(从当前日中截取)
    this.setData({ monthDate: FORMAT_CURRENT_YEAR_AND_MONTH(this.data.today) });
    console.warn('默认月份：', this.data.monthDate);
    // 设置默认日期为当日
    this.setData({ dayDate: this.data.today });
    console.warn('默认日期：', this.data.dayDate);
    // 默认：日报模式，查询当日
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

  /** 选择简报模式 */
  onChangeReportMode(value) {
    console.warn('选择简报模式:', value);
    this.setData({ reportModeIndex: value });
    // 简报模式变更，调用查询函数
    this.onSearch();
  },

  /** 选择星期区间 */
  onChangeWeek(value) {
    console.warn('选择星期区间:', value);
    this.setData({ weekIndex: value });
    this.setData({ selectedWeek: this.data.weekList[this.data.weekIndex] });
    console.warn('选中星期区间:', this.data.selectedWeek);
    // 星期区间变更，调用查询函数
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

  /** 选择日期 */
  onDayDatePicker() {
    my.datePicker({
      currentDate: `${this.data.today}`,
      startDate: '2019-10-9',
      endDate: `${this.data.today}`,
      success: (res) => {
        this.setData({ dayDate: res.date });
        // 日报模式，日期变更，调用查询函数
        this.onSearch();
      },
    });
  },

  /**
   * 月度 虽然可以选中日期，但最终结果只到月份。
   */
  onMonthDatePicker() {
    my.datePicker({
      format: 'yyyy-MM',
      currentDate: `${this.data.today}`,
      startDate: '2019-01',
      endDate: `${this.data.today}`,
      success: (res) => {
        this.setData({ monthDate: res.date });
        // 月报模式，月份变更，调用查询函数
        this.onSearch();
      },
    });
  },

  /** 日期选择器 开始时间 */
  onStartDateTime() {
    my.datePicker({
      format: 'yyyy-MM-dd HH:mm:ss',
      // 初始选择的日期时间，默认当日0点
      currentDate: `${this.data.today} 00:00:00`, // 当日
      // 最小日期时间 用户注册日期之类
      startDate: "",
      // 最大日期时间 当日当时当分当秒
      endDate: `${FORMAT_CURRENT_DATETIME()}`,
      success: (res) => {
        this.setData({ startDateTime: res.date });
        // 自定义模式，开始时间变更 调用查询函数
        this.onSearch();
      },
    });
  },

  /** 日期选择器 结束时间 */
  onEndDateTime() {
    my.datePicker({
      format: 'yyyy-MM-dd HH:mm:ss',
      // 初始选择的日期时间，默认当前时间
      currentDate: `${this.data.today} 00:00:00`, // 当日
      // 最小日期时间 用户注册日期之类
      startDate: '2021-01-01 11:11',
      // 最大日期时间 当日当时当分当秒
      endDate: `${this.data.today} 23:59:59`,
      success: (res) => {
        this.setData({ endDateTime: res.date });
        // 自定义模式，结束时间变更 调用查询函数
        this.onSearch();
      },
    });
  },


  /** 查询 */
  onSearch() {
    console.warn('查询函数：', this.data)
    /**
     *  请求体进行处理
     * 日报：token  time_start time_end
     * 周报：token  time_start time_end store_id merchant_id
     * 月报：token  time_start time_end store_id merchant_id
     */
    let temp_code = this.data.reportMode[this.data.reportModeIndex].code;
    let temp_time_start = "";
    let temp_time_end = "";
    // 日报
    if (temp_code == 0) {
      temp_time_start = `${this.data.dayDate} 00:00:00`;
      temp_time_end = `${this.data.dayDate} 23:59:59`;

    } else if (temp_code == 1) {
      // 周区间
      temp_time_start = `${this.data.selectedWeek.monday} 00:00:00`;
      temp_time_end = `${this.data.selectedWeek.sunday} 23:59:59`;
    }
    else if (temp_code == 2) {
      // 月区间
      temp_time_start = `${this.data.monthDate}-01 00:00:00`;
      temp_time_end = `${this.data.monthDate}-31 23:59:59`;
    } else if (temp_code == 3) {
      // 自定义区间
      temp_time_start = this.data.startDateTime;
      temp_time_end = this.data.endDateTime;
    }
    console.warn(`${temp_time_start} - ${temp_time_end}`);
    my.request({
      url: `${this.data.hostApi.REQUEST}${this.data.hostApi.MERCHANT_ORDER_COUNT}`,
      method: 'POST',
      data: {
        token: this.data.userInfo.TOKEN,
        time_start: temp_time_start,
        time_end: temp_time_end,
        store_id: this.data.storeId,
        merchant_id: this.data.merchantId,
      },
      dataType: 'json',
      success: (result) => {
        console.warn('storeport.js 查询结果：', result);
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
        /** 支付宝支付 */
        let temp_alipay = {
          /** 商家实收 */
          alipayActualAmount: FORMAT_CURRENCY(result.data.data.alipay_get_amount),
          /** 交易金额 */
          alipayIncomeAmount: FORMAT_CURRENCY(result.data.data.alipay_total_amount),
          /** 交易笔数 */
          alipayIncomeCount: result.data.data.alipay_total_count,
          /** 退款金额 */
          alipayRefundAmount: FORMAT_CURRENCY(result.data.data.alipay_refund_amount),
          /** 退款笔数 */
          alipayRefundCount: result.data.data.alipay_refund_count,
        }
        this.setData({ alipayInfo: temp_alipay });

        /** 微信支付 */
        let temp_wechat = {
          /** 商家实收 */
          wechatActualAmount: FORMAT_CURRENCY(result.data.data.weixin_get_amount),
          /** 交易金额 */
          wechatIncomeAmount: FORMAT_CURRENCY(result.data.data.weixin_total_amount),
          /** 交易笔数 */
          wechatIncomeCount: result.data.data.weixin_total_count,
          /** 退款金额 */
          wechatRefundAmount: FORMAT_CURRENCY(result.data.data.weixin_refund_amount),
          /** 退款笔数 */
          wechatRefundCount: result.data.data.weixin_refund_count,
        }
        this.setData({ wechatInfo: temp_wechat });
      },
      fail: () => { },
      complete: () => { }
    });
  },
})