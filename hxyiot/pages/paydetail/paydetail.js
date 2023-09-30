/** 交易详情 */
import { SHUFFLE, FORMAT_CURRENCY } from '/utils/util.js';

let RSA = require('../../utils/wx_rsa.js');// 密钥

Page({
  data: {
    /** 该code对应实际数字 */
    keys: [
      { code: 0 },
      { code: 1 },
      { code: 2 },
      { code: 3 },
      { code: 4 },
      { code: 5 },
      { code: 6 },
      { code: 7 },
      { code: 8 },
      { code: 9 },
      { code: 10 },
    ],
    /** 六位密码
     * key:密码位0-5
     * value:密码实际值
     * desc:用于覆盖真实输入值
     */
    codeList: [
      { key: 0, value: "", desc: '' },
      { key: 1, value: "", desc: '' },
      { key: 2, value: "", desc: '' },
      { key: 3, value: "", desc: '' },
      { key: 4, value: "", desc: '' },
      { key: 5, value: "", desc: '' }],
    /** 是否显示支付密码输入弹层 */
    isShowPwdKey: false,
    /** 是否禁用安全键盘 */
    isDisabled: false,
  },

  onShow() { },

  /**
   * 生命周期 之 页面加载完成 ，
   */
  onReady() {
    // 每次页面加载完成都将安全键盘数组顺序
    this.data.keys.sort((a, b) => a.code - b.code);
    console.warn('页面加载完成 顺序:', this.data.keys);
    let temp_keys = this.data.keys;
    console.warn('存储临时变量，使用但不变更原始值', temp_keys);
    // 取出固定项 最后一位元素(删除键)
    let fix = temp_keys.filter(item => item.code == 10)[0];
    console.warn('取出固定项：', fix);
    // 把固定项剔除 
    let _temp = temp_keys.filter(item => item.code != fix.code);
    // 乱序
    SHUFFLE(_temp).push(fix);
    this.setData({ keybords: _temp });
    console.warn('乱序:', this.data.keybords);
  },

  /** 跳转过来时带的参数在query里 */
  onLoad(query) {
    console.warn('传入的单号：', query.out_trade_no);
    this.setData({ test: query.out_trade_no });

    // 获取缓存的设备信息
    const DEVICE_INFO = my.getStorageSync({ key: 'deviceInfo' }).data;
    if (DEVICE_INFO) this.setData({ deviceInfo: DEVICE_INFO });
    // 获取缓存的hostApi
    const HOST_API = my.getStorageSync({ key: 'hostApi' }).data;
    if (HOST_API) this.setData({ hostApi: HOST_API });
    // 获取缓存的当前登入账号及当前认证门店
    const USER_INFO = my.getStorageSync({ key: 'userInfo' }).data;
    if (USER_INFO) this.setData({ userInfo: USER_INFO });
    console.warn('登入用户的信息:', this.data.userInfo);


    // 获取传入订单号的账单信息
    my.request({
      url: `${this.data.hostApi.REQUEST}${this.data.hostApi.MERCHANT_ORDER_INFO}`,
      method: 'POST',
      data: {
        token: this.data.userInfo.TOKEN,
        out_trade_no: query.out_trade_no, // 传入的订单号
      },
      dataType: 'json',
      success: (result) => {
        console.warn('获取传入订单号的账单信息:', result);
        /** 临时对象 账单明细数据 */
        let temp_info = {
          /** 商家实收 */
          totalAmount: result.data.data.total_amount,
          /** 商家实收 只用于页面显示 因被格式化后无法直接Number */
          totalAmountDesc: FORMAT_CURRENCY(result.data.data.total_amount),
          /** 付款方式 明文 */
          waysSourceDesc: result.data.data.ways_source_desc,
          /** 商品金额 */
          shopPrice: FORMAT_CURRENCY(result.data.data.shop_price),
          /** 支付时间 */
          payTime: result.data.data.pay_time,
          /** 单号 从返回数据中获取，非页面传入的单号 */
          outTradeNo: result.data.data.out_trade_no,
          /** 支付状态 明文 */
          payStatusDesc: result.data.data.pay_status_desc,
          /** 退款金额 */
          refundAmount: FORMAT_CURRENCY(result.data.data.refund_amount),
        }
        this.setData({ orderInfo: temp_info });
        console.warn('获取账单明细:', this.data.orderInfo);
      },
      fail: () => { },
      complete: () => { }
    });
  },

  /** 退款按钮事件 */
  onRefund() {
    console.warn('退款按钮事件');
    /**
     * 可以弹出输出，但不是数字键盘。
     */
    my.prompt({
      title: '直接确定默认退全款',
      message: '退款成功后，金额将原路返回',
      placeholder: '请输入退款金额',
      okButtonText: '确定',
      cancelButtonText: '取消',
      success: (result) => {
        console.warn('确认退款：', result);
        if (result.ok) {
          // 暂存用户输入值
          let temp = result.inputValue == "" ? this.data.orderInfo.totalAmount : result.inputValue;
          // 对用户输入内容进行合法校验，并返回校验结果
          let checkValue = Number(temp).toFixed(2);
          if (isNaN(checkValue)) {
            my.alert({
              title: '友情提示',
              content: '输入金额有误，请重新输入',
              buttonText: '确认',
              success: (alertResult) => {
                if (alertResult.success) {
                  // 重新调用退款按钮事件
                  this.onRefund();
                }
              },
            });
          } else {
            console.warn('用户输入值:', checkValue);
            // 用户输入内容合法，再与全款进行比较，返回结果
            let _temp = Number(this.data.orderInfo.totalAmount).toFixed(2);
            if (checkValue > _temp) {
              my.alert({
                title: '友情提示',
                content: '输入退款金额不能大于全款，请重新输入',
                buttonText: '确认',
                success: (aResult) => {
                  if (aResult.success) {
                    // 重新调用退款按钮事件
                    this.onRefund();
                  }
                },
              });
            } else {
              console.warn('输入合法值:', checkValue);
              my.confirm({
                title: `确认退款 ${checkValue} 元`,
                content: '退款成功后，金额将原路返回',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                success: (result) => {
                  if (result.confirm) {
                    this.setData({ newRefundAmount: FORMAT_CURRENCY(checkValue) });
                    console.warn('页面所需退款金额:', this.data.newRefundAmount);
                    // 显示支付密码弹层
                    this.setData({ isShowPwdKey: true });
                    console.warn('支付密码弹层:', this.data.isShowPwdKey);
                  }
                }
              });
            }
          }
        }
      },
    });
  },

  /** 关闭支付密码弹层 */
  onClose() {
    this.setData({ isShowPwdKey: false });
    console.warn('关闭支付密码弹层', this.data.isShowPwdKey);
    // 清理输入的密码,即将codeList设置为最初的状态
    this.data.codeList.map(item => {
      item.value = ""; // 重置实际值
      item.desc = ""; // 重置覆盖值
    });
    this.setData({ codeList: this.data.codeList });
    console.warn('清理codeList:', this.data.codeList);
    this.setData({ isDisabled: false });
    console.warn('解禁安全键盘:', this.data.isDisabled);
  },




  btnPwd(event) {
    console.warn('按下密码：', event);
    // 收集按下的真实数字
    let temp = event.currentTarget.dataset.index;
    let temp_code = this.data.keybords[temp].code;
    console.warn('按下的值:', temp, '其实际值：', temp_code);

    // 返回当前已输入密码数组，后续用到其长度值
    let alreadyPwd = this.data.codeList.filter(item => item.desc == "•");
    console.warn('当前已有密码位数:', alreadyPwd, alreadyPwd.length);

    // 判断按下的是否为退格键 code=10
    if (temp_code == 10) {
      console.warn('按下退格键，处理退格事件:', this.data.codeList);
      // 退格键按下时，当前密码位数是否全空
      if (alreadyPwd.length > 0 && alreadyPwd.length < 6) {
        console.warn('当前密码位数:', alreadyPwd.length);
        // 退一格。即当前密码位数-1的下标元素，还原为初始状态
        this.data.codeList.map((item, index) => {
          if (index == alreadyPwd.length - 1) {
            item.value = ""; // 清空该位置的value值
            item.desc = ""; // 情况该位置的覆盖值
          }
        })
        this.setData({ codeList: this.data.codeList });
        console.warn('退一格后的值:', this.data.codeList);
      } else {
        console.warn('当前密码位数为0或者为6，退无可退', alreadyPwd.length);
        return;
      }
    }
    // 如果按下的非退格键
    else {
      console.warn('如果按下的非退格键 按下的键为:', temp_code);
      // 找出 value===""的首个元素 为其value赋值。此处使用绝对比较
      let temp_index = this.data.codeList.findIndex(item => item.value === "");
      console.warn('找出value==""的第一个元素', temp_index);
      this.data.codeList.map((item, index) => {
        if (index == temp_index) {
          item.value = temp_code;
          item.desc = "•";
        }
      })
      console.warn('重新整理数组:', this.data.codeList);
      this.setData({ codeList: this.data.codeList });

      // 判断六个元素的value都非空
      let isFinsh = this.data.codeList.every(item => item.value !== "");
      console.warn('是否按满六位:', isFinsh);
      if (isFinsh) {
        console.warn('按满六位:', isFinsh, '输入的密码：', this.data.codeList);
        // 设置安全键盘为禁止输入状态，并改变其背景色，醒目标注
        this.setData({ isDisabled: true });
        console.warn('禁用安全键盘', this.data.isDisabled);

        // 提取六位密码值
        let temp_pwd = "";
        this.data.codeList.forEach(item => {
          temp_pwd += item.value
        });
        console.warn('提取六位密码:', temp_pwd);
        // 调用支付函数
        this.testPay(temp_pwd);
      }
    }
  },

  /**
   * 
   * @param {*} pwd 传入格式化完成的六位密码
   */
  testPay(pwd) {
    console.warn('调用支付函数', pwd);
    //加密开始
    let publickey = '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4COVutRbOUfQNjvVOzwK49NzHIPRwwksnJ6QtdHwGmdUZiT2HZxVwfotcOjA5aY16D/2Ahq3gLH4yu2y42dS0lfeBMqUcm+ bY7aZ54wClm75RI90uc54F8IgMkNz8J / VS9LYI / B4uHVsc + 4KK4Ycr8S8O004ExtvQqu2QCl7Aai/ WC4URIdCyNm8La2axoA1jjj3SzpytLvP6Z / iHSlx37Y9AMR0V94R13v4BFlMQDG+ 2REVJsk6LCyzHQfUvJlnsyKey0n/ v8DLC070lQzLPYV0jsiit2AUkyURRLxEaZm2C0YYhfrGjl + x8n / kDteZbDVcyn7UsEdSicijv9DXkQIDAQAB-----END PUBLIC KEY-----'

    let sign_rsa = 'pay_password=' + pwd
    let encrypt_rsa = new RSA.RSAKey();
    encrypt_rsa = RSA.KEYUTIL.getKey(publickey);
    let signStr = encrypt_rsa.encrypt(sign_rsa);
    signStr = RSA.hex2b64(signStr);

    my.request({
      url: `${this.data.hostApi.REQUEST}${this.data.hostApi.CHECK_PAY_PWD}`,
      method: 'POST',
      data: {
        token: this.data.userInfo.TOKEN,
        sign: signStr
      },
      dataType: 'json',
      success: (result) => {
        console.warn('校验支付密码的结果:', result);
        // status=1 支付密码匹配
        if (result.data.status == 1) {
          // 退款接口
          my.request({
            url: `${this.data.hostApi.REQUEST}${this.data.hostApi.MERCHANT_REFUND}`,
            method: 'POST',
            data: {
              token: this.data.userInfo.TOKEN,
              out_trade_no: this.data.orderInfo.outTradeNo,
              refund_amount: this.data.orderInfo.totalAmount
            },
            dataType: 'json',
            success: (res_refund) => {
              console.warn('发起退款的请求结果:', res_refund);
              /* 退款成功，返回的结果
              other_no:""
              out_trade_no:"aliscan20210419154123302720666"
              refund_amount:"0.01"
              refund_no:"aliscan20210419154123302720666123"
              message:"退款成功"
              status:"1"
              */
              my.showToast({
                type: 'success',
                content: res_refund.data.message,
                duration: 2000,
                success: () => {
                  // 退款成功，返回到上级(门店流水或经营简报)
                  my.navigateBack()
                }
              });
            },
            fail: () => {

            },
            complete: () => {

            }
          });
        } else {
          console.warn('校验不合格', result);
          my.showToast({
            type: 'fail',
            content: result.data.message,
            duration: 2000,
          });
        }
      },
      fail: () => {

      },
      complete: () => {

      }
    });



    setTimeout(() => {
      my.hideLoading();
      // 调用关闭支付密码事件
      this.onClose();
    }, 5000);

    // 如果支付密码错误，清空重新输入

  },

  /** 打印小票 */
  onPrint() {
    console.warn('打印???');

    // 开始监听
    my.ix.startMonitorPrinter({
      success: (r) => {
        console.log("开始监听 success", r);
      },
      fail: (r) => {
        console.log("fail, errorCode:" + r.error);
      }
    });

    /** 查询连接打印机的API */
    my.ix.queryPrinter({
      success: (result) => {
        console.log('查询连接打印机的API', result);
        /** 打印小票 API */
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
          { 'cmd': 'addText', 'args': ['客户联'] },
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
          { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
          { 'cmd': 'addText', 'args': ['商户名称:' + this.data.userInfo.STORE_NAME] },
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
          { 'cmd': 'addSelectJustification', 'args': ['LEFT'] },
          { 'cmd': 'addText', 'args': ['设备SN:' + this.data.deviceInfo.DEVICE_SN] },
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
          { 'cmd': 'addText', 'args': ['支付时间:' + this.data.orderInfo.payTime] },
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
          { 'cmd': 'addText', 'args': ['订单金额:' + this.data.orderInfo.totalAmount] },
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
          { 'cmd': 'addText', 'args': ['支付方式:' + this.data.orderInfo.waysSourceDesc] },
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
          { 'cmd': 'addText', 'args': ['支付状态:' + this.data.orderInfo.payStatusDesc] },
          { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          { 'cmd': 'addSelectPrintModes', 'args': ['FONTA', 'OFF', 'OFF', 'OFF', 'OFF'] },
          { 'cmd': 'addText', 'args': ['订单号:' + this.data.orderInfo.outTradeNo] },

            /** 暂时关闭，反正设备不支持扫描纸质二维码 */
            // /** 二维码相关 在用户设置打印二维码时，才会启用 */
            // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            // { 'cmd': 'addSelectJustification', 'args': ['CENTER'] }, /*设置打印居中对齐*/
            // { 'cmd': 'addSelectErrorCorrectionLevelForQRCode', 'args': ['49'] }, /*设置纠错等级*/
            // { 'cmd': 'addSelectSizeOfModuleForQRCode', 'args': ['10'] }, /*设置qrcode模块大小*/
            // /*设置qrcode内容 此处使用订单号 */
            // { 'cmd': 'addStoreQRCodeData', 'args': [this.data.orderInfo.outTradeNo] },
            // { 'cmd': 'addPrintQRCode', 'args': [] }, /*打印QRCode*/

            // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
            // { 'cmd': 'addPrintAndLineFeed', 'args': [] },//打印并换行
          ],
          success: (r) => {
            console.warn('printer ', r);
          },
          fail: () => { }
        });
      },
      fail: () => { }
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
  }
})