/*
 * @Author: Satya
 * @Date: 2020-08-02 17:34:18
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-23 14:40:20
 * doc:自己写一个扩展库预览所需数据，含多语言处理方式
 * 改变原版必须使用react-intl的方式
 * 该扩展库预览后期考虑以https请求加载形式，
 * 目前资源在七牛云 kid/extensions文件夹下
 * 所需资源地址，改为GLOBAL对象下的对应地址
 */

// 处理多语言问题
export const EXTENSIONLIBRARY_DATA = () => {
  return [
    //   音乐
    {
      name: GLOBAL_L10N("gui.extension.music.name"),
      extensionId: "music",
      iconURL: GLOBAL_URL.ASSET_EXTENSION_ICON_URL_MUSIC,
      insetIconURL: GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_MUSIC,
      description: GLOBAL_L10N("gui.extension.music.description"),
      featured: true,
    },
    // 绘画
    {
      name: GLOBAL_L10N("gui.extension.pen.name"),
      extensionId: "pen",
      iconURL: GLOBAL_URL.ASSET_EXTENSION_ICON_URL_PEN,
      insetIconURL: GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_PEN,
      description: GLOBAL_L10N("gui.extension.pen.description"),
      featured: true,
    },
    // 视频侦测
    {
      name: GLOBAL_L10N("gui.extension.videosensing.name"),
      extensionId: "videoSensing",
      iconURL: GLOBAL_URL.ASSET_EXTENSION_ICON_URL_VIDEO_SENSING,
      insetIconURL: GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_VIDEO_SENSING,
      description: GLOBAL_L10N("gui.extension.videosensing.description"),
      featured: true,
    },
    //   文字朗读
    {
      name: GLOBAL_L10N("gui.extension.text2speech.name"),
      extensionId: "text2speech",
      collaborator: "Amazon Web Services",
      iconURL: GLOBAL_URL.ASSET_EXTENSION_ICON_URL_TEXT_TO_SPEECH,
      insetIconURL: GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_TEXT_TO_SPEECH,
      description: GLOBAL_L10N("gui.extension.text2speech.description"),
      featured: true,
      internetConnectionRequired: true,
    },
    //   翻译
    {
      name: GLOBAL_L10N("gui.extension.translate.name"),
      extensionId: "translate",
      collaborator: "Google",
      iconURL: GLOBAL_URL.ASSET_EXTENSION_ICON_URL_TRANSLATE,
      insetIconURL: GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_TRANSLATE,
      description: GLOBAL_L10N("gui.extension.translate.description"),
      featured: true,
      internetConnectionRequired: true,
    },
    //   把任何东西变成按键
    {
      name: "Makey Makey",
      extensionId: "makeymakey",
      collaborator: "JoyLabz",
      iconURL: GLOBAL_URL.ASSET_EXTENSION_ICON_URL_MAKEY_MAKEY,
      insetIconURL: GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_MAKEY_MAKEY,
      description: GLOBAL_L10N("gui.extension.makeymakey.description"),
      featured: true,
    },
    // 把作品链接到实体世界
    {
      name: "micro:bit",
      extensionId: "microbit",
      collaborator: "micro:bit",
      iconURL: GLOBAL_URL.ASSET_EXTENSION_ICON_URL_MICROBIT,
      insetIconURL: GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_MICROBIT,
      description: GLOBAL_L10N("gui.extension.microbit.description"),
      featured: true,
      disabled: false,
      bluetoothRequired: true,
      internetConnectionRequired: true,
      launchPeripheralConnectionFlow: true,
      useAutoScan: false,
      connectionIconURL:
        GLOBAL_URL.ASSET_EXTENSION_CONNECTION_ICON_URL_MICROBIT,
      connectionSmallIconURL:
        GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_MICROBIT,
      connectingMessage: GLOBAL_L10N(
        "gui.extension.microbit.connectingMessage"
      ),
      //   helpLink: "http://steam.leadersir.com", // https://scratch.mit.edu/microbit
    },
    // LEGO 交互机器人
    {
      name: "LEGO MINDSTORMS EV3",
      extensionId: "ev3",
      collaborator: "LEGO",
      iconURL: GLOBAL_URL.ASSET_EXTENSION_ICON_URL_LEGO_V3,
      insetIconURL: GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_LEGO_V3,
      description: GLOBAL_L10N("gui.extension.ev3.description"),
      featured: true,
      disabled: false,
      bluetoothRequired: true,
      internetConnectionRequired: true,
      launchPeripheralConnectionFlow: true,
      useAutoScan: false,
      connectionIconURL: GLOBAL_URL.ASSET_EXTENSION_CONNECTION_ICON_URL_LEGO_V3,
      connectionSmallIconURL: GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_LEGO_V3,
      connectingMessage: GLOBAL_L10N("gui.extension.ev3.connectingMessage"),
      // helpLink: "http://steam.leadersir.com", // https://scratch.mit.edu/ev3
    },
    // 生动有趣的机器人创作
    {
      name: "LEGO BOOST",
      extensionId: "boost",
      collaborator: "LEGO",
      iconURL: GLOBAL_URL.ASSET_EXTENSION_ICON_URL_LEGO_BOOST,
      insetIconURL: GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_LEGO_BOOST,
      description: GLOBAL_L10N("gui.extension.boost.description"),
      featured: true,
      disabled: false,
      bluetoothRequired: true,
      internetConnectionRequired: true,
      launchPeripheralConnectionFlow: true,
      useAutoScan: true,
      connectionIconURL:
        GLOBAL_URL.ASSET_EXTENSION_CONNECTION_ICON_URL_LEGO_BOOST,
      connectionSmallIconURL:
        GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_LEGO_BOOST,
      connectionTipIconURL:
        GLOBAL_URL.ASSET_EXTENSION_CONNECTION_TIP_ICON_URL_LEGO_BOOST,
      connectingMessage: GLOBAL_L10N("gui.extension.boost.connectingMessage"),
      // helpLink: "http://steam.leadersir.com", // https://scratch.mit.edu/boost
    },
    // 支持马达和传感器
    {
      name: "LEGO Education WeDo 2.0",
      extensionId: "wedo2",
      collaborator: "LEGO",
      iconURL: GLOBAL_URL.ASSET_EXTENSION_ICON_URL_LEGO_WEDO2,
      insetIconURL: GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_LEGO_WEDO2,
      description: GLOBAL_L10N("gui.extension.wedo2.description"),
      featured: true,
      disabled: false,
      bluetoothRequired: true,
      internetConnectionRequired: true,
      launchPeripheralConnectionFlow: true,
      useAutoScan: true,
      connectionIconURL:
        GLOBAL_URL.ASSET_EXTENSION_CONNECTION_ICON_URL_LEGO_WEDO2,
      connectionSmallIconURL:
        GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_LEGO_WEDO2,
      connectionTipIconURL:
        GLOBAL_URL.ASSET_EXTENSION_CONNECTION_TIP_ICON_URL_LEGO_WEDO2,
      connectingMessage: GLOBAL_L10N("gui.extension.wedo2.connectingMessage"),
      // helpLink: "http://steam.leadersir.com", // https://scratch.mit.edu/wedo
    },
    // // 感受推拉转动
    // {
    //   name: "Go Direct Force & Acceleration",
    //   extensionId: "gdxfor",
    //   collaborator: "Vernier",
    //   iconURL: GLOBAL_URL.ASSET_EXTENSION_ICON_URL_GDXFOR,
    //   insetIconURL: GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_GDXFOR,
    //   description: GLOBAL_L10N("gui.extension.gdxfor.description"),
    //   featured: true,
    //   disabled: false,
    //   bluetoothRequired: true,
    //   internetConnectionRequired: true,
    //   launchPeripheralConnectionFlow: true,
    //   useAutoScan: false,
    //   connectionIconURL: GLOBAL_URL.ASSET_EXTENSION_CONNECTION_ICON_URL_GDXFOR,
    //   connectionSmallIconURL: GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_GDXFOR,
    //   connectingMessage: GLOBAL_L10N("gui.extension.gdxfor.connectingMessage"),
    //   // helpLink: "http://steam.leadersir.com", // https://scratch.mit.edu/vernier
    // },
  ];
};
