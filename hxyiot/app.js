/**
 * 主程序文件
 */
App({
  // 定义全局变量 globalData，在整个App中有效
  globalData: {
    version: '1.1.1',
    yuming: 'https://vip.whlxsz.com/', // 原代码使用
    HOST: 'https://vip.whlxsz.com', // 新代码使用 2021.02.25
    VERSION: '1.1.1', // 版本号 (2021.03.02虽然换成全大写，但值不变，避免无法与后端匹配)
    DEVICE_TYPE: "face_f4", // 设备类型
  },

  onLaunch() {
    /** 调试程序，有时需清理所有缓存值 */
    // my.clearStorageSync();

    // 同步查询系统信息 
    let temp_device = my.ix.getSysPropSync({ key: 'ro.serialno' });
    // 可以查询系统属性，也可以进行 IoT SDK 属性查询
    temp_device ? temp_device : my.ix.getSysProp({ key: 'ro.serialno' });
    console.warn('app.js getSysPropSync:', temp_device);

    // 设置设备信息缓存值
    my.setStorageSync({
      key: 'deviceInfo', data: {
        DEVICE_SN: temp_device.value, // 设备SN
        DEVICE_TYPE: this.globalData.DEVICE_TYPE, // 全局变量里的设备类型
      }
    });
  },
});
