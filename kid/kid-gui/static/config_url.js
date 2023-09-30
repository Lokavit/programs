/*
 * @Author: Satya
 * @Date: 2020-09-04 19:21:06
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-07 19:02:33
 * doc:所有url的配置表，该文件只在本地运行时使用。
 * 该文件内容的复刻版在_dist/init.js中，若有更改，需同步
 *  命名规范：
 *      LINK_ 超链接类 (通常用于跳转到某页面)
 *      API_ 接口类
 *      ASSET_ 资源类
 */
const GLOBAL_URL = new Object();

/** @description 获取当前浏览器url，判断使用线上还是本地域名 */
GLOBAL_URL.HOST_API =
  window.location.hostname.indexOf("localhost") > -1
    ? /** localhost使用该路径 */
      `https://steam.leadersir.com/`
    : /** 非localhost， 使用相对路径，因为该项目与服务端放在一起 */
      `/`;

/** 七牛云资源地址 会根据不同协议返回不同域名 */
GLOBAL_URL.HOST_ASSET =
  window.location.protocol.indexOf("https") > -1
    ? `https://kid.leadersir.net/`
    : `http://kid.leadersir.net/`;
/** LOGO超链接 创客首页 */
GLOBAL_URL.LINK_LEADERSIR_HOME = `/`;

/** 教程超链接 ，指向创客教程主页面 */
GLOBAL_URL.LINK_LEADERSIR_TUTORIALS = `/course/qualityCourse`;

/** 查看我的作品 超链接 指向创客作品页面 */
GLOBAL_URL.LINK_LOOK_PROJECT = `/center/creation`;

/** SigIn 相关接口 */
GLOBAL_URL.API_SIGNIN_WECHAT = `${GLOBAL_URL.HOST_API}wechat/wechatLoginPage`;
GLOBAL_URL.API_SIGNIN_QQ = `${GLOBAL_URL.HOST_API}qq/qqLoginPage`;
GLOBAL_URL.API_SIGNIN_CHECK = `${GLOBAL_URL.HOST_API}user/checkLogin`;
GLOBAL_URL.API_SIGNIN = `${GLOBAL_URL.HOST_API}user/login`;

/** Sign Out */
GLOBAL_URL.API_SIGNOUT = `${GLOBAL_URL.HOST_API}loginOut`;

/** 教程信息地址:如果是从教程进入创作页，则需要打开教程视窗 */
GLOBAL_URL.API_TUTORIAL = `${GLOBAL_URL.HOST_API}courseContent/getVideoForScratch/`;

/** POST作品文件到后台的接口 */
GLOBAL_URL.API_UPLOAD_SB3FILE = `${GLOBAL_URL.HOST_API}qiniu/uploadSb3`;
/** POST作品表单到后台的接口 */
GLOBAL_URL.API_PROJECT_PUSH = `${GLOBAL_URL.HOST_API}project/saveProjectDraftAndPublish`;
/** POST作品表单到后台的接口 */
GLOBAL_URL.API_PROJECT_DRAFT = `${GLOBAL_URL.HOST_API}project/saveProjectDraft`;
/** GET 当前作品是否允许教师改编 /结尾之后需要加作品id */
GLOBAL_URL.API_IS_ABLE_EDIT_PROJECT = `${GLOBAL_URL.HOST_API}project/isAbleEditProject/`;
/** POST 批改情况下，批改作品的提交 */
GLOBAL_URL.API_MODIFY_PROJECT_BY_TEACHER = `${GLOBAL_URL.HOST_API}project/modifyProjectByTeacher`;

/** 通过传入的id，获取该id的作品 */
GLOBAL_URL.API_GET_PROJECT_DATA = `${GLOBAL_URL.HOST_API}project/ajaxOne`;

/** LOGO 与官网使用同一文件 */
GLOBAL_URL.ASSET_LOGO = `${GLOBAL_URL.HOST_ASSET}img/static/logo_new_3.png`;

/** 对应七牛云 kid/下资源 */
GLOBAL_URL.ASSET_KID = `${GLOBAL_URL.HOST_ASSET}kid/`;

/** 站点图标 */
// GLOBAL_URL.ASSET_FAVICON = `${GLOBAL_URL.ASSET_KID}favicon.ico`;

/** 过场动画  */
GLOBAL_URL.ASSET_LOADING = `${GLOBAL_URL.ASSET_KID}loading.gif`;

/** SignIn 相关资源 */
GLOBAL_URL.ASSET_SIGNIN_ICON_PHONE = `${GLOBAL_URL.HOST_ASSET}login/icon--phone.png`;
GLOBAL_URL.ASSET_SIGNIN_ICON_PWD = `${GLOBAL_URL.HOST_ASSET}login/icon--pwd.png`;
GLOBAL_URL.ASSET_SIGNIN_WECHAT = `${GLOBAL_URL.HOST_ASSET}login/wechat_big.png`;
GLOBAL_URL.ASSET_SIGNIN_QQ = `${GLOBAL_URL.HOST_ASSET}login/qq_big.png`;
GLOBAL_URL.ASSET_SIGN_ACCOUNT = `${GLOBAL_URL.HOST_ASSET}login/account_big.png`;

/** 边看边做 视频最小化时，留在页面上的icon */
GLOBAL_URL.ASSET_ICON_VIDEO = `${GLOBAL_URL.ASSET_KID}video.png`;

/**     ======  对应七牛云 :kid/下文件   =====
 *
 */

/** blocks中的media pro版 */
GLOBAL_URL.ASSET_BLOCK_MEDIA_PRO = `${GLOBAL_URL.ASSET_KID}media-pro/`;
/** blocks中的media jr版 */
GLOBAL_URL.ASSET_BLOCK_MEDIA_JR = `${GLOBAL_URL.ASSET_KID}media-jr/`;

/** 语言选择 */
GLOBAL_URL.ASSET_ICON_LANGUAGE = `${GLOBAL_URL.ASSET_KID}icon_language.svg`;
/** 文件 */
GLOBAL_URL.ASSET_ICON_FILE = `${GLOBAL_URL.ASSET_KID}icon_file.png`;
/** 发布作品 */
GLOBAL_URL.ASSET_ICON_PUSH = `${GLOBAL_URL.ASSET_KID}icon_push.png`;
/** 保存到草稿箱 */
GLOBAL_URL.ASSET_ICON_DRAFT = `${GLOBAL_URL.ASSET_KID}icon_draft.png`;
/** 教程 */
GLOBAL_URL.ASSET_ICON_TUTORIALS = `${GLOBAL_URL.ASSET_KID}icon_tutorials.svg`;
/** 下箭头 */
GLOBAL_URL.ASSET_ICON_DROPDOWN = `${GLOBAL_URL.ASSET_KID}icon_dropdown.svg`;
/** 左下角打开扩展库的按钮 */
GLOBAL_URL.ASSET_ICON_ADD_EXTENSION = `${GLOBAL_URL.ASSET_KID}icon_extensions.svg`;
/** Tabs 之 代码 */
GLOBAL_URL.ASSET_ICON_CODE = `${GLOBAL_URL.ASSET_KID}icon_code.svg`;
/** Tabs 之 造型 */
GLOBAL_URL.ASSET_ICON_COSTUME = `${GLOBAL_URL.ASSET_KID}icon_costumes.svg`;
/** Tabs 之 声音 */
GLOBAL_URL.ASSET_ICON_SOUND = `${GLOBAL_URL.ASSET_KID}icon_sounds.svg`;

/** 添加 背景 */
GLOBAL_URL.ASSET_ICON_ADD_BACKDROP_LIB = `${GLOBAL_URL.ASSET_KID}icon_add_backdrop_lib.svg`;
// /** 添加标识 圆形按钮的小图标 */
GLOBAL_URL.ASSET_ICON_ADD_COSTUME = `${GLOBAL_URL.ASSET_KID}icon_add_costume.svg`;
/** 文件上传 */
GLOBAL_URL.ASSET_ICON_FILE_UPLOAD = `${GLOBAL_URL.ASSET_KID}icon_file_upload.svg`;
/** 绘画 */
GLOBAL_URL.ASSET_ICON_PAINT = `${GLOBAL_URL.ASSET_KID}icon_paint.svg`;
/** 相机 */
GLOBAL_URL.ASSET_ICON_CAMERA = `${GLOBAL_URL.ASSET_KID}icon_camera.svg`;
/**  */
GLOBAL_URL.ASSET_ICON_SURPRISE = `${GLOBAL_URL.ASSET_KID}icon_surprise.svg`;
/** 查找 */
GLOBAL_URL.ASSET_ICON_SEARCH = `${GLOBAL_URL.ASSET_KID}icon_search.svg`;
/** 背景 */
GLOBAL_URL.ASSET_ICON_BACKDROP = `${GLOBAL_URL.ASSET_KID}icon_backdrop.svg`;
/** 声音 左向右 */
GLOBAL_URL.ASSET_ICON_SOUND_LTR = `${GLOBAL_URL.ASSET_KID}icon_sound_ltr.svg`;
/** 声音 右向左 */
GLOBAL_URL.ASSET_ICON_SOUND_RTL = `${GLOBAL_URL.ASSET_KID}icon_sound_rtl.svg`;
/** 声音库 */
GLOBAL_URL.ASSET_ICON_ADD_SOUND_LIB = `${GLOBAL_URL.ASSET_KID}icon_add_sound_lib.svg`;
/** 声音库  录 */
GLOBAL_URL.ASSET_ICON_ADD_SOUND_RECORD = `${GLOBAL_URL.ASSET_KID}icon_add_sound_record.svg`;
/**  */
GLOBAL_URL.ASSET_ICON_HANDLE = `${GLOBAL_URL.ASSET_KID}icon_handle.svg`;
/** 返回 旋转箭头 */
GLOBAL_URL.ASSET_ICON_BACK_TURN = `${GLOBAL_URL.ASSET_KID}icon_back_turn.svg`;
/** 返回 直向箭头 */
GLOBAL_URL.ASSET_ICON_BACK = `${GLOBAL_URL.ASSET_KID}icon_back.svg`;
/** 关闭 + */
GLOBAL_URL.ASSET_ICON_CLOSE = `${GLOBAL_URL.ASSET_KID}icon_close.svg`;
/** 关闭 橙色X */
GLOBAL_URL.ASSET_ICON_CLOSE_ORANGE = `${GLOBAL_URL.ASSET_KID}icon_close_orange.svg`;
/** 删除 */
GLOBAL_URL.ASSET_ICON_DELETE = `${GLOBAL_URL.ASSET_KID}icon_delete.svg`;

/** 声音编辑界面 play */
GLOBAL_URL.ASSET_ICON_SOUND_PLAY = `${GLOBAL_URL.ASSET_KID}icon_sound_play.svg`;
/** 声音界面 stop */
GLOBAL_URL.ASSET_ICON_SOUND_STOP = `${GLOBAL_URL.ASSET_KID}icon_sound_stop.svg`;
/** 声音界面 redo */
GLOBAL_URL.ASSET_ICON_SOUND_REDO = `${GLOBAL_URL.ASSET_KID}icon_sound_redo.svg`;
/** 声音界面 undo */
GLOBAL_URL.ASSET_ICON_SOUND_UNDO = `${GLOBAL_URL.ASSET_KID}icon_sound_undo.svg`;
/** 声音界面 faster */
GLOBAL_URL.ASSET_ICON_SOUND_FASTER = `${GLOBAL_URL.ASSET_KID}icon_sound_faster.svg`;
/** 声音界面 slower */
GLOBAL_URL.ASSET_ICON_SOUND_SLOWER = `${GLOBAL_URL.ASSET_KID}icon_sound_slower.svg`;
/** 声音界面 louder */
GLOBAL_URL.ASSET_ICON_SOUND_LOUDER = `${GLOBAL_URL.ASSET_KID}icon_sound_louder.svg`;
/** 声音界面 softer */
GLOBAL_URL.ASSET_ICON_SOUND_SOFTER = `${GLOBAL_URL.ASSET_KID}icon_sound_softer.svg`;
/** 声音界面 robot */
GLOBAL_URL.ASSET_ICON_SOUND_ROBOT = `${GLOBAL_URL.ASSET_KID}icon_sound_robot.svg`;
/** 声音界面 reverse */
GLOBAL_URL.ASSET_ICON_SOUND_REVERSE = `${GLOBAL_URL.ASSET_KID}icon_sound_reverse.svg`;
/** 声音界面 fade-out */
GLOBAL_URL.ASSET_ICON_SOUND_FADE_OUT = `${GLOBAL_URL.ASSET_KID}icon_sound_fade_out.svg`;
/** 声音界面 fade-in */
GLOBAL_URL.ASSET_ICON_SOUND_FADE_IN = `${GLOBAL_URL.ASSET_KID}icon_sound_fade_in.svg`;
/** 声音界面 mute */
GLOBAL_URL.ASSET_ICON_SOUND_MUTE = `${GLOBAL_URL.ASSET_KID}icon_sound_mute.svg`;
/** 声音界面 cut */
GLOBAL_URL.ASSET_ICON_SOUND_CUT = `${GLOBAL_URL.ASSET_KID}icon_sound_cut.svg`;
/** 声音界面 copy */
GLOBAL_URL.ASSET_ICON_SOUND_COPY = `${GLOBAL_URL.ASSET_KID}icon_sound_copy.svg`;
/** 声音界面 paste */
GLOBAL_URL.ASSET_ICON_SOUND_PASTE = `${GLOBAL_URL.ASSET_KID}icon_sound_paste.svg`;
/** 声音界面 copy_to_new */
GLOBAL_URL.ASSET_ICON_SOUND_COPY_TO_NEW = `${GLOBAL_URL.ASSET_KID}icon_sound_copy_to_new.svg`;

/** 作品播放 */
GLOBAL_URL.ASSET_ICON_PROJECT_PLAY = `${GLOBAL_URL.ASSET_KID}icon_project_play.svg`;
/** 作品停止 */
GLOBAL_URL.ASSET_ICON_PROJECT_STOP = `${GLOBAL_URL.ASSET_KID}icon_project_stop.svg`;
/** 录制界面 播放 */
GLOBAL_URL.ASSET_ICON_RECORD_PLAY = `${GLOBAL_URL.ASSET_KID}icon_record_play.svg`;
/** 录制界面 停止 */
GLOBAL_URL.ASSET_ICON_RECORD_STOP_PLAYBACK = `${GLOBAL_URL.ASSET_KID}icon_record_stop_playback.svg`;
/** 录制界面 停止录制 */
GLOBAL_URL.ASSET_ICON_RECORD_STOP = `${GLOBAL_URL.ASSET_KID}icon_record_stop_recording.svg`;
/** modal help */
GLOBAL_URL.ASSET_ICON_HELP = `${GLOBAL_URL.ASSET_KID}icon_help.svg`;
/** alert success */
GLOBAL_URL.ASSET_ICON_SUCCESS = `${GLOBAL_URL.ASSET_KID}icon_success.svg`;
/** browser 弹窗 */
GLOBAL_URL.ASSET_UNSUPPORTED_BROWSER = `${GLOBAL_URL.ASSET_KID}unsupported_browser.svg`;
/** 蓝牙 */
GLOBAL_URL.ASSET_ICON_BLUETOOTH = `${GLOBAL_URL.ASSET_KID}icon_bluetooth.svg`;
/** 蓝牙白色 */
GLOBAL_URL.ASSET_ICON_BLUETOOTH_WHITE = `${GLOBAL_URL.ASSET_KID}icon_bluetooth_white.svg`;
/** scratchLink */
GLOBAL_URL.ASSET_ICON_SCRATCH_LINK = `${GLOBAL_URL.ASSET_KID}icon_scratchlink.svg`;
/** 查询中 */
GLOBAL_URL.ASSET_ICON_SEARCHING = `${GLOBAL_URL.ASSET_KID}searching.png`;
/** 刷新 */
GLOBAL_URL.ASSET_ICON_REFRESH = `${GLOBAL_URL.ASSET_KID}icon_refresh.svg`;
/** crah reload */
GLOBAL_URL.ASSET_ICON_CRASH_RELOAD = `${GLOBAL_URL.ASSET_KID}icon_reload.svg`;
/** custom procedures */
GLOBAL_URL.ASSET_ICON_CUSTOM_BOOLEAN_INPUT = `${GLOBAL_URL.ASSET_KID}icon_boolean_input.svg`;
/** custom procedures */
GLOBAL_URL.ASSET_ICON_CUSTOM_TEXT_INPUT = `${GLOBAL_URL.ASSET_KID}icon_text_input.svg`;
/** custom procedures */
GLOBAL_URL.ASSET_ICON_CUSTOM_LABEL = `${GLOBAL_URL.ASSET_KID}icon_label.svg`;
/** dial */
GLOBAL_URL.ASSET_ICON_DIAL_FACE = `${GLOBAL_URL.ASSET_KID}icon_dial_face.svg`;
GLOBAL_URL.ASSET_ICON_DIAL_HANDLE = `${GLOBAL_URL.ASSET_KID}icon_dial_handle.svg`;
/** direction picker */
GLOBAL_URL.ASSET_ICON_ALL_AROUND = `${GLOBAL_URL.ASSET_KID}icon_all_around.svg`;
GLOBAL_URL.ASSET_ICON_LEFT_RIGHT = `${GLOBAL_URL.ASSET_KID}icon_left_right.svg`;
GLOBAL_URL.ASSET_ICON_DONT_ROTATE = `${GLOBAL_URL.ASSET_KID}icon_dont_rotate.svg`;
/** green flag */
GLOBAL_URL.ASSET_ICON_GREEN_FLAG = `${GLOBAL_URL.ASSET_KID}icon_green_flag.svg`;
/** 扩展库缩略图 蓝牙 */
GLOBAL_URL.ASSET_ICON_BLUETOOTH_LIB = `${GLOBAL_URL.ASSET_KID}icon_bluetooth_lib.svg`;
/** 扩展库缩略图 联网 */
GLOBAL_URL.ASSET_ICON_INTERNET_CONNECTION = `${GLOBAL_URL.ASSET_KID}icon_internet_connection.svg`;
/** 放大镜 */
GLOBAL_URL.ASSET_ICON_FILTER = `${GLOBAL_URL.ASSET_KID}icon_filter.svg`;
/** 麦克风 */
GLOBAL_URL.ASSET_ICON_MIC_INDICATOR = `${GLOBAL_URL.ASSET_KID}icon_mic_indicator.svg`;
/** 对号 */
GLOBAL_URL.ASSET_ICON_ENTER = `${GLOBAL_URL.ASSET_KID}icon_enter.svg`;
/** 左右箭头 */
GLOBAL_URL.ASSET_ICON_X = `${GLOBAL_URL.ASSET_KID}icon_x.svg`;
/** 上下箭头 */
GLOBAL_URL.ASSET_ICON_Y = `${GLOBAL_URL.ASSET_KID}icon_y.svg`;
/** 眼睛 表示显示 */
GLOBAL_URL.ASSET_ICON_SHOW = `${GLOBAL_URL.ASSET_KID}icon_show.svg`;
/** 眼睛 带斜线 表示隐藏 */
GLOBAL_URL.ASSET_ICON_HIDE = `${GLOBAL_URL.ASSET_KID}icon_hide.svg`;
/** 全屏 */
GLOBAL_URL.ASSET_ICON_FULLSCREEN = `${GLOBAL_URL.ASSET_KID}icon_fullscreen.svg`;
/** 大stage布局 */
GLOBAL_URL.ASSET_ICON_LARGE_STAGE = `${GLOBAL_URL.ASSET_KID}icon_large_stage.svg`;
/** 小stage布局 */
GLOBAL_URL.ASSET_ICON_SMALL_STAGE = `${GLOBAL_URL.ASSET_KID}icon_small_stage.svg`;
/** un全屏 */
GLOBAL_URL.ASSET_ICON_UNFULLSCREEN = `${GLOBAL_URL.ASSET_KID}icon_unfullscreen.svg`;
/** 六边形的stop */
GLOBAL_URL.ASSET_ICON_STOP_ALL = `${GLOBAL_URL.ASSET_KID}icon_stop_all.svg`;
/** turbo */
GLOBAL_URL.ASSET_ICON_TURBO = `${GLOBAL_URL.ASSET_KID}icon_turbo.svg`;

/**     ======  storage.js 所需   =====
 *  对应七牛云 : material/ 下文件
 */
GLOBAL_URL.ASSET_MATERIAL = `${GLOBAL_URL.HOST_ASSET}material/`;

/**     ======  extension-library-data.js所需   =====
 *      对应七牛云 : kid/extensions/ 下文件
 */
/** 扩展库预览界面相关资源 基础URL */
GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL = `${GLOBAL_URL.ASSET_KID}extensions/`;
/** music */
GLOBAL_URL.ASSET_EXTENSION_ICON_URL_MUSIC = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}music.png`;
GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_MUSIC = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}music-small.svg`;
/** pen */
GLOBAL_URL.ASSET_EXTENSION_ICON_URL_PEN = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}pen.png`;
GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_PEN = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}pen-small.svg`;
/** video sensing */
GLOBAL_URL.ASSET_EXTENSION_ICON_URL_VIDEO_SENSING = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}video-sensing.png`;
GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_VIDEO_SENSING = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}video-sensing-small.svg`;

/** text to speech */
GLOBAL_URL.ASSET_EXTENSION_ICON_URL_TEXT_TO_SPEECH = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}text2speech.png`;
GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_TEXT_TO_SPEECH = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}text2speech-small.svg`;

/** translate */
GLOBAL_URL.ASSET_EXTENSION_ICON_URL_TRANSLATE = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}translate.png`;
GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_TRANSLATE = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}translate-small.png`;

/** Makey Makey */
GLOBAL_URL.ASSET_EXTENSION_ICON_URL_MAKEY_MAKEY = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}makeymakey.png`;
GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_MAKEY_MAKEY = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}makeymakey-small.svg`;

/** micro:bit */
GLOBAL_URL.ASSET_EXTENSION_ICON_URL_MICROBIT = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}microbit.png`;
GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_MICROBIT = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}microbit-small.svg`;
GLOBAL_URL.ASSET_EXTENSION_CONNECTION_ICON_URL_MICROBIT = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}microbit-illustration.svg`;

/** LEGO MINDSTORMS EV3 */
GLOBAL_URL.ASSET_EXTENSION_ICON_URL_LEGO_V3 = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}ev3.png`;
GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_LEGO_V3 = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}ev3-small.svg`;
GLOBAL_URL.ASSET_EXTENSION_CONNECTION_ICON_URL_LEGO_V3 = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}ev3-hub-illustration.svg`;

/** LEGO BOOST */
GLOBAL_URL.ASSET_EXTENSION_ICON_URL_LEGO_BOOST = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}boost.png`;
GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_LEGO_BOOST = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}boost-small.svg`;
GLOBAL_URL.ASSET_EXTENSION_CONNECTION_ICON_URL_LEGO_BOOST = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}boost-illustration.svg`;
GLOBAL_URL.ASSET_EXTENSION_CONNECTION_TIP_ICON_URL_LEGO_BOOST = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}boost-button-illustration.svg`;

/** LEGO Education WeDo 2.0 */
GLOBAL_URL.ASSET_EXTENSION_ICON_URL_LEGO_WEDO2 = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}wedo.png`;
GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_LEGO_WEDO2 = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}wedo-small.svg`;
GLOBAL_URL.ASSET_EXTENSION_CONNECTION_ICON_URL_LEGO_WEDO2 = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}wedo-illustration.svg`;
GLOBAL_URL.ASSET_EXTENSION_CONNECTION_TIP_ICON_URL_LEGO_WEDO2 = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}wedo-button-illustration.svg`;

/** Go Direct Force & Acceleration */
GLOBAL_URL.ASSET_EXTENSION_ICON_URL_GDXFOR = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}gdxfor.png`;
GLOBAL_URL.ASSET_EXTENSION_INSET_ICON_URL_GDXFOR = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}gdxfor-small.svg`;
GLOBAL_URL.ASSET_EXTENSION_CONNECTION_ICON_URL_GDXFOR = `${GLOBAL_URL.ASSET_EXTENSION_LIBRARY_BASE_URL}gdxfor-illustration.svg`;

/** 该对象挂载到window下 */
window.GLOBAL_URL = GLOBAL_URL;
