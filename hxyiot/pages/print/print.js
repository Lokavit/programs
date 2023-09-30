Page({
  data: {
    /** 打印功能开关 */
    isPrint: false,
    // /** 打印二维码开关 */
    // isPrintQR: false,
    /** 打印测试 按钮开关 */
    isDisabled: false,
    /** 打印联 */
    printList: [
      { code: 0, name: '打印一联', desc: '只打印记账联' },
      { code: 1, name: '打印二联', desc: '同时打印记账联和抵扣联' }
    ],
    /** 当前打印联设置 */
    currentPrint: 0,
  },

  onLoad(query) {
    console.warn('print:', query);
    // 获取打印功能设置的缓存值
    const PRINT_SET = my.getStorageSync({ key: 'printset' }).data;
    this.setData({
      isPrint: PRINT_SET ? PRINT_SET.IS_PRINT : this.data.isPrint,
      currentPrint: PRINT_SET ? PRINT_SET.PRINT_CODE : this.data.currentPrint
    });
    console.warn('获取打印功能设置的缓存值:', this.data);
  },

  /**
   * 页面被关闭 在其之前，做一些操作，如设置他处必要的缓存值
   */
  onUnload() {
    my.setStorageSync({
      key: 'printset', data: {
        /** 是否开启打印功能 */
        IS_PRINT: this.data.isPrint,
        /** 打印联 0=一联 1=二联 */
        PRINT_CODE: this.data.currentPrint
      }
    });
    console.warn('页面被关闭:', this.data);
  },

  /** 开关 打印功能 */
  onChangePrint(event) {
    this.setData({ isPrint: event.detail.value });
    console.warn('打印功能开关:', this.data.isPrint)
  },

  // /** 开关 打印二维码 */
  // onChangePrintQR(event) {
  //   this.setData({ isPrintQR: event.detail.value });
  //   my.setStorageSync({ key: 'printqr', data: this.data.isPrintQR });
  //   console.warn('打印二维码开关:', this.data.isPrintQR)
  // },

  /** 选择打印联 */
  onSelectedPrint(event) {
    let temp_current_code = event.currentTarget.dataset.code;
    // 将当前选中项code赋值
    this.setData({ currentPrint: temp_current_code });
    console.warn('选择打印联：', this.data.currentPrint);
  },

  /** 打印测试 按钮事件 */
  onPrintTest() {
    console.warn('打印测试');

    // 开始监听
    my.ix.startMonitorPrinter({
      success: (r) => {
        console.log("开始监听 success");
      },
      fail: (r) => {
        console.log("fail, errorCode:" + r.error);
      }
    });

    /** 查询连接打印机的API */
    my.ix.queryPrinter({
      success: (result) => {
        console.log('查询连接打印机的API', result);
        console.warn('打印机 cmdType：', result.usb[0].cmdType);
        // let printerInfo = r.usb[0];
        // // 老版本的容器返回打印机信息是以字符串形式，这里需要兼容处理
        // if (typeof (printerInfo) === 'string') {
        //   printerInfo = JSON.parse(printerInfo)
        // }
        my.ix.printer({
          /** 打印机ID */
          target: result.usb[0].id,
          /** 'esc' 表示 cmds 是 ESC 小票打印指令 */
          cmdType: result.usb[0].cmdType,
          /** 指令集 */
          cmds: [{ 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
          { 'cmd': 'addSelectJustification', 'args': ['CENTER'] },
          { 'cmd': 'addText', 'args': ['打印测试'] },
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
          { 'cmd': 'addText', 'args': ['测试成功'] },
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          ],
          success: (r) => {
            console.warn('printer ', r);
          },
          fail: () => { }
        });
      },
      fail: () => { }
    });

    // 等待事件的变化
    my.ix.onMonitorPrinter((r) => {
      console.log("received data:" + r);
    });

    // 结束监听
    my.ix.offMonitorPrinter({
      success: (r) => {
        console.log("结束监听 success");
      },
      fail: (r) => {
        console.log("fail, errorCode:" + r.error);
      }
    });
  },
});
