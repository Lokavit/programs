/**
 * 交易列表组件
 */
Component({
  props: {
    orderList: [],
  },
  methods: {
    /** 点击单笔交易，跳转到详情页面 */
    onDetail(event) {
      console.warn('点击单笔交易', event.currentTarget.dataset.outtradeno);
      my.navigateTo({
        url: `../paydetail/paydetail?out_trade_no=${event.currentTarget.dataset.outtradeno}`,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  }
})