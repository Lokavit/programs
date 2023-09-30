/**
 * 2021.03.02 重写程序设置模块
 */
import { Page } from '/utils/ix'; // 添加这行 2021.03.02
Page({
  data: {
    setItems: [{
      code: 0,
      name: 'signout', // 功能名
      desc: '用户信息', // 功能描述
    }, {
      code: 1,
      name: 'cashiermode',
      desc: '收银模式',
    }, {
      code: 2,
      name: 'storebill',
      desc: '门店流水', // shoukuan => storebill
    }, {
      code: 3,
      name: 'storereport',
      desc: '经营简报', // jingyingjianbao  =>storereport
    }, {
      code: 4,
      name: 'deposit',
      desc: '预授权', // 押金记录 jiudianlist => deposit
    },
    {
      code: 5,
      name: 'print',
      desc: '打印设置', // print
    },
    {
      code: 6,
      name: 'settings',
      desc: '系统设置',
    },
      // {
      //   code: 4,
      //   name: 'vip',
      //   desc: '会员中心', // huiyuanzhongxin =>vip
      // },
    ]
  },

  // 点击回退，到index
  events: {
    onBack() {
      my.reLaunch({ url: '../index/index' });
    }
  },

  onLoad() { },

  onShow() {
    // 获取缓存的ISV信息
    const ISV_INFO = my.getStorageSync({ key: 'isvInfo' }).data;
    if (ISV_INFO) this.setData({ isvPhone: ISV_INFO.ISV_PHONE, isvBanner: ISV_INFO.ISV_BANNER });
  },

  onKeyPress(r) {
    switch (r.keyCode) {
      case 133:
        r.keyName = '取消';
        break;
    }
    console.warn('setting.js KeyEvent', r);
    if (r.keyCode == 133) {
      // 回到主页
      my.reLaunch({ url: '../index/index' });
    }
  },

  // ***********关闭键盘事件监听********************    
  onHide() {
    my.ix.offKeyEventChange();
  },
  onUnLoad() {
    my.ix.offKeyEventChange();
  },

  /** 选中一项 */
  onSelected(event) {
    let temp_code = event.currentTarget.dataset.code;
    console.warn('选中项CODE:', temp_code);
    // 暂存选项名
    let temp_name = this.data.setItems[temp_code].name;
    // 对选中项的处理 如果是6(系统设置)，否则按照对应url跳转
    temp_code == 6 ? my.ix.startApp({ appName: `${temp_name}`, }) : my.navigateTo({ url: `../${temp_name}/${temp_name}` })
  }

})
