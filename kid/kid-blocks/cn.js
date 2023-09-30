/*
 * @Author: Satya
 * @Date: 2020-11-05 17:22:28
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-22 18:00:37
 * doc:中文简体
 */

"use strict";

const Msg = {
  /** 设置每个分类的颜色 */
  /** pro编程*/
  PRO_MOTION_HUE: 40, // 移动分类
  PRO_LOOKS_HUE: 60, // 外观分类
  PRO_SOUND_HUE: 80, // 声音分类
  PRO_EVENT_HUE: 100, // 事件分类
  PRO_CONTROL_HUE: 140, // 控制分类
  PRO_SENSING_HUE: 180, // 侦测分类
  PRO_OPERATORS_HUE: 0, // 运算分类
  /** 基础功能分类颜色 */
  MATH_HUE: 230,
  LOOPS_HUE: 120,
  LISTS_HUE: 260,
  LOGIC_HUE: 210,
  VARIABLES_HUE: 330,
  TEXTS_HUE: 160,
  PROCEDURES_HUE: 290,
  COLOUR_HUE: 20,
  VARIABLES_DYNAMIC_HUE: 310,

  /** Pro 积木相关明文 */
  PRO_MOTION_MOVESTEPS: "移动 %1 步",
  PRO_MOTION_TURNRIGHT: "右转 %1 %2 度",
  PRO_MOTION_TURNLEFT: "左转 %1 %2 度",
  PRO_MOTION_POINTINDIRECTION: "面向 %1 方向",
  PRO_MOTION_POINTTOWARDS_POINTER: "鼠标指针",
  PRO_MOTION_POINTTOWARDS_RANDOM: "随机方向",
  PRO_MOTION_POINTTOWARDS: "面向 %1",
  PRO_MOTION_GOTO_POINTER: "鼠标指针",
  PRO_MOTION_GOTO_RANDOM: "随机位置",
  PRO_MOTION_GOTO: "移到 %1",
  PRO_MOTION_GOTOXY: "移到 x: %1 y: %2",
  PRO_MOTION_GLIDETO_POINTER: "鼠标指针",
  PRO_MOTION_GLIDETO_RANDOM: "随机位置",
  PRO_MOTION_GLIDESECSTOXY: "在 %1 秒内滑行到 x: %2 y: %3",
  PRO_MOTION_GLIDETO: "在 %1 秒内滑行到 %2",
  PRO_MOTION_CHANGEXBY: "将x坐标增加 %1",
  PRO_MOTION_SETX: "将x坐标设为 %1",
  PRO_MOTION_CHANGEYBY: "将y坐标增加 %1",
  PRO_MOTION_SETY: "将y坐标设为 %1",
  PRO_MOTION_IFONEDGEBOUNCE: "碰到边缘就反弹",
  PRO_MOTION_SETROTATIONSTYLE: "将旋转方式设为 %1",
  PRO_MOTION_SETROTATIONSTYLE_LEFTRIGHT: "左右翻转",
  PRO_MOTION_SETROTATIONSTYLE_DONTROTATE: "不可旋转",
  PRO_MOTION_SETROTATIONSTYLE_ALLAROUND: "任意旋转",
  PRO_MOTION_XPOSITION: "x 坐标",
  PRO_MOTION_YPOSITION: "y 坐标",
  PRO_MOTION_DIRECTION: "方向",

  /** LOOKS 外观 */
  PRO_LOOKS_SHOW: "显示",
  PRO_LOOKS_HIDE: "隐藏",
  PRO_LOOKS_SAYFORSECS: "说 %1 %2 秒",
  PRO_LOOKS_SAY: "说 %1",
  PRO_LOOKS_THINKFORSECS: "思考 %1 %2 秒",
  PRO_LOOKS_THINK: "思考 %1",
  PRO_LOOKS_SWITCHCOSTUMETO: "换成 %1 造型",
  PRO_LOOKS_NEXTCOSTUME: "下一个造型",
  PRO_LOOKS_SWITCHBACKDROPTO: "换成 %1 背景",
  PRO_LOOKS_SWITCHBACKDROPTOANDWAIT: "换成 %1 背景并等待",
  PRO_LOOKS_NEXTBACKDROP_BLOCK: "下一个背景",
  PRO_LOOKS_CHANGESIZEBY: "将大小增加 %1",
  PRO_LOOKS_SETSIZETO: "将大小设为 %1",
  PRO_LOOKS_GOTOFRONTBACK: "移到最 %1 ",
  PRO_LOOKS_GOTOFRONTBACK_FRONT: "前面",
  PRO_LOOKS_GOTOFRONTBACK_BACK: "后面",
  PRO_LOOKS_GOFORWARDBACKWARDLAYERS: "%1 %2 层",
  PRO_LOOKS_GOFORWARDBACKWARDLAYERS_FORWARD: "前移",
  PRO_LOOKS_GOFORWARDBACKWARDLAYERS_BACKWARD: "后移",
  PRO_LOOKS_EFFECT_COLOR: "颜色",
  PRO_LOOKS_EFFECT_FISHEYE: "鱼眼",
  PRO_LOOKS_EFFECT_WHIRL: "漩涡",
  PRO_LOOKS_EFFECT_PIXELATE: "像素化",
  PRO_LOOKS_EFFECT_MOSAIC: "马赛克",
  PRO_LOOKS_EFFECT_BRIGHTNESS: "亮度",
  PRO_LOOKS_EFFECT_GHOST: "虚像",
  PRO_LOOKS_CHANGEEFFECTBY: "将 %1 特效增加 %2",
  PRO_LOOKS_SETEFFECTTO: "将 %1 特效设定为 %2",
  PRO_LOOKS_CLEARGRAPHICEFFECTS: "清除图形特效",
  PRO_LOOKS_SIZE: "大小",
  PRO_LOOKS_COSTUMENUMBERNAME: "造型 %1",
  PRO_LOOKS_BACKDROPNUMBERNAME: "背景 %1",
  PRO_LOOKS_NUMBERNAME_NUMBER: "编号",
  PRO_LOOKS_NUMBERNAME_NAME: "名称",
  /** SOUND 声音 */
  PRO_SOUND_PLAY: "播放声音 %1",
  PRO_SOUND_PLAYUNTILDONE: "播放声音 %1 等待播完",
  PRO_SOUND_STOPALLSOUNDS: "停止所有声音",
  PRO_SOUND_EFFECTS_PITCH: "音调",
  PRO_SOUND_EFFECTS_PAN: "左右平衡",
  PRO_SOUND_CHANGEEFFECTBY: "将 %1 音效增加 %2",
  PRO_SOUND_SETEFFECTO: "将 %1 音效设为 %2",
  PRO_SOUND_CLEAREFFECTS: "清除音效",
  PRO_SOUND_CHANGEVOLUMEBY: "将音量增加 %1",
  PRO_SOUND_SETVOLUMETO: "将音量设为 %1%",
  PRO_SOUND_VOLUME: "音量",
  /** EVENT 事件 */
  PRO_EVENT_WHENFLAGCLICKED: "当 %1 被点击",
  PRO_EVENT_WHENTHISSPRITECLICKED: "当角色被点击",
  PRO_EVENT_WHENSTAGECLICKED: "当舞台被点击",
  PRO_EVENT_WHENKEYPRESSED: "当按下 %1 键",
  PRO_EVENT_WHENKEYPRESSED_SPACE: "空格",
  PRO_EVENT_WHENKEYPRESSED_UP: "↑",
  PRO_EVENT_WHENKEYPRESSED_DOWN: "↓",
  PRO_EVENT_WHENKEYPRESSED_RIGHT: "→",
  PRO_EVENT_WHENKEYPRESSED_LEFT: "←",
  PRO_EVENT_WHENKEYPRESSED_ANY: "任意",
  PRO_EVENT_WHENBACKDROPSWITCHESTO: "当背景换成 %1",
  PRO_EVENT_WHENGREATERTHAN: "当 %1 > %2",
  PRO_EVENT_WHENGREATERTHAN_TIMER: "计时器",
  PRO_EVENT_WHENGREATERTHAN_LOUDNESS: "响度",
  PRO_EVENT_WHENBROADCASTRECEIVED: "当接收到 %1",
  DEFAULT_BROADCAST_MESSAGE_NAME: "消息1", // 接收消息的下拉项
  PRO_EVENT_BROADCAST: "广播 %1",
  PRO_EVENT_BROADCASTANDWAIT: "广播 %1 并等待",
  /** Control 控制 */
  PRO_CONTROL_WAITUNTIL: "等待 %1",
  PRO_CONTROL_WAIT: "等待 %1 秒",
  PRO_CONTROL_FOREVER: "重复执行",
  PRO_CONTROL_REPEAT: "重复执行 %1 次",
  PRO_CONTROL_REPEATUNTIL: "重复执行直到 %1",
  PRO_CONTROL_IF: "如果 %1 那么",
  PRO_CONTROL_ELSE: "否则",
  PRO_CONTROL_STARTASCLONE: "当作为克隆体启动时",
  PRO_CONTROL_CREATECLONEOF: "克隆 %1",
  PRO_CONTROL_CREATECLONEOF_MYSELF: "自己",
  PRO_CONTROL_DELETETHISCLONE: "删除此克隆体",

  /** Sensing 侦测 */
  PRO_SENSING_MOUSEDOWN: "按下鼠标?",
  PRO_SENSING_KEYPRESSED: "按下 %1 键?",
  PRO_SENSING_TOUCHINGOBJECT_POINTER: "鼠标指针",
  PRO_SENSING_TOUCHINGOBJECT_EDGE: "舞台边缘",
  PRO_SENSING_TOUCHINGOBJECT: "碰到 %1 ?",
  PRO_SENSING_TOUCHINGCOLOR: "碰到颜色 %1 ?",
  PRO_SENSING_COLORISTOUCHINGCOLOR: "颜色 %1 碰到 %2 ?",
  PRO_SENSING_ASKANDWAIT: "询问 %1 并等待",
  PRO_SENSING_SETDRAGMODE_DRAGGABLE: "可拖动",
  PRO_SENSING_SETDRAGMODE_NOTDRAGGABLE: "不可拖动",
  PRO_SENSING_SETDRAGMODE: "将拖动模式设为 %1",
  PRO_SENSING_RESETTIMER: "计时器归零",
  PRO_SENSING_DISTANCETO_POINTER: "鼠标指针",
  PRO_SENSING_DISTANCETO: "到 %1 的距离",
  PRO_SENSING_MOUSEX: "鼠标的x坐标",
  PRO_SENSING_MOUSEY: "鼠标的y坐标",
  PRO_SENSING_OF: "%2 的 %1",
  PRO_SENSING_OF_XPOSITION: "x 坐标",
  PRO_SENSING_OF_YPOSITION: "y 坐标",
  PRO_SENSING_OF_DIRECTION: "方向",
  PRO_SENSING_OF_COSTUMENUMBER: "造型编号",
  PRO_SENSING_OF_COSTUMENAME: "造型名称",
  PRO_SENSING_OF_SIZE: "大小",
  PRO_SENSING_OF_VOLUME: "音量",
  PRO_SENSING_OF_BACKDROPNUMBER: "背景编号",
  PRO_SENSING_OF_BACKDROPNAME: "背景名称",
  //   PRO_SENSING_OF_STAGE: "舞台",
  PRO_SENSING_DAYSSINCE2000: "2000年至今的天数",
  PRO_SENSING_ANSWER: "回答",
  PRO_SENSING_LOUDNESS: "响度",
  PRO_SENSING_TIMER: "计时器",
  PRO_SENSING_CURRENT: "当前时间的 %1",
  PRO_SENSING_CURRENT_YEAR: "年",
  PRO_SENSING_CURRENT_MONTH: "月",
  PRO_SENSING_CURRENT_DATE: "日",
  PRO_SENSING_CURRENT_DAYOFWEEK: "星期",
  PRO_SENSING_CURRENT_HOUR: "时",
  PRO_SENSING_CURRENT_MINUTE: "分",
  PRO_SENSING_CURRENT_SECOND: "秒",
  PRO_SENSING_USERNAME: "用户名",

  /** Operators 运算 */
  PRO_OPERATORS_GT: "%1 > %2",
  PRO_OPERATORS_LT: "%1 < %2",
  PRO_OPERATORS_EQUALS: "%1 = %2",
  PRO_OPERATORS_AND: "%1 与 %2",
  PRO_OPERATORS_OR: "%1 或 %2",
  PRO_OPERATORS_NOT: "%1 不成立",
  PRO_OPERATORS_CONTAINS: "%1 包含 %2 ?",
  PRO_OPERATORS_ADD: "%1 + %2",
  PRO_OPERATORS_SUBTRACT: "%1 - %2",
  PRO_OPERATORS_MULTIPLY: "%1 * %2",
  PRO_OPERATORS_DIVIDE: "%1 / %2",
  PRO_OPERATORS_ROUND: "四舍五入 %1",
  PRO_OPERATORS_MATHOP: "%1 %2",
  PRO_OPERATORS_MATHOP_ABS: "绝对值",
  PRO_OPERATORS_MATHOP_FLOOR: "向下取整",
  PRO_OPERATORS_MATHOP_CEILING: "向上取整",
  PRO_OPERATORS_MATHOP_SQRT: "平方根",
  PRO_OPERATORS_MATHOP_SIN: "sin",
  PRO_OPERATORS_MATHOP_COS: "cos",
  PRO_OPERATORS_MATHOP_TAN: "tan",
  PRO_OPERATORS_MATHOP_ASIN: "asin",
  PRO_OPERATORS_MATHOP_ACOS: "acos",
  PRO_OPERATORS_MATHOP_ATAN: "atan",
  PRO_OPERATORS_MATHOP_LN: "ln",
  PRO_OPERATORS_MATHOP_LOG: "log",
  PRO_OPERATORS_MATHOP_EEXP: "e ^",
  PRO_OPERATORS_MATHOP_10EXP: "10 ^",
  PRO_OPERATORS_MOD: "%1 除以 %2 的余数",
  PRO_OPERATORS_LENGTH: "%1 的字符数",
  PRO_OPERATORS_LETTEROF: "%2 的第 %1 个字符",
  PRO_OPERATORS_JOIN: "连接 %1 和 %2",
  PRO_OPERATORS_RANDOM: "在 %1 和 %2 之间取随机数",

  /** 其他明文定义 */
  ADD_COMMENT: "添加注释",
  CANNOT_DELETE_VARIABLE_PROCEDURE:
    "不能删除变量“%1”，因为它是函数“%2”定义的一部分",
  CHANGE_VALUE_TITLE: "更改值：",
  CLEAN_UP: "整理块",
  COLLAPSED_WARNINGS_WARNING: "已收起的信息块内包含警告。",
  COLLAPSE_ALL: "折叠块",
  COLLAPSE_BLOCK: "折叠块",
  COLOUR_BLEND_COLOUR1: "颜色1",
  COLOUR_BLEND_COLOUR2: "颜色2",
  // untranslated
  COLOUR_BLEND_HELPURL: "https://meyerweb.com/eric/tools/color-blend/#:::rgbp",
  COLOUR_BLEND_RATIO: "比例",
  COLOUR_BLEND_TITLE: "混合",
  COLOUR_BLEND_TOOLTIP: "把两种颜色以一个给定的比例(0.0-1.0)进行混合。",
  COLOUR_PICKER_HELPURL: "https://zh.wikipedia.org/wiki/颜色",
  COLOUR_PICKER_TOOLTIP: "从调色板中选择一种颜色。",
  COLOUR_RANDOM_HELPURL: "http://randomcolour.com", // untranslated
  COLOUR_RANDOM_TITLE: "随机颜色",
  COLOUR_RANDOM_TOOLTIP: "随机选择一种颜色。",
  COLOUR_RGB_BLUE: "蓝色",
  COLOUR_RGB_GREEN: "绿色",
  COLOUR_RGB_HELPURL: "https://www.december.com/html/spec/colorpercompact.html", // untranslated
  COLOUR_RGB_RED: "红色",
  COLOUR_RGB_TITLE: "颜色",
  COLOUR_RGB_TOOLTIP:
    "通过指定红色、绿色和蓝色的量创建一种颜色。所有的值必须在0和100之间。",
  CONTROLS_FLOW_STATEMENTS_HELPURL:
    "https://github.com/google/blockly/wiki/Loops#loop-termination-blocks", // untranslated
  CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK: "跳出循环",
  CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE: "继续下一轮循环",
  CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK: "跳出包含它的循环。",
  CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE:
    "跳过本轮循环的剩余部分，并继进行续下一轮迭代。",
  CONTROLS_FLOW_STATEMENTS_WARNING: "警告：这个块只能在循环内使用。",
  CONTROLS_FOREACH_HELPURL:
    "https://github.com/google/blockly/wiki/Loops#for-each", // untranslated
  CONTROLS_FOREACH_TITLE: "为列表 %2 里的每一项 %1",
  CONTROLS_FOREACH_TOOLTIP:
    "遍历列表中的每一项，将变量“%1”设为所选项，并执行一些语句。",
  CONTROLS_FOR_HELPURL:
    "https://github.com/google/blockly/wiki/Loops#count-with", // untranslated
  CONTROLS_FOR_TITLE: "变量 %1 从 %2 数到 %3 每次增加 %4",
  CONTROLS_FOR_TOOLTIP:
    "用变量%1记录从开始数值到终止数值之间的数值，数值按指定间隔增加，并执行指定的块。",
  CONTROLS_IF_ELSEIF_TOOLTIP: "在这个if语句块中增加一个条件。",
  CONTROLS_IF_ELSE_TOOLTIP:
    "在这个if语句块中添加一个最终的，包括所有其余情况的条件。",
  CONTROLS_IF_HELPURL: "https://github.com/google/blockly/wiki/IfElse", // untranslated
  CONTROLS_IF_IF_TOOLTIP: "增加、删除或重新排列各节来重新配置这个if语句块。",
  CONTROLS_IF_MSG_ELSE: "否则",
  CONTROLS_IF_MSG_ELSEIF: "否则如果",
  CONTROLS_IF_MSG_IF: "如果",
  CONTROLS_IF_TOOLTIP_1: "如果值为真，执行一些语句。",
  CONTROLS_IF_TOOLTIP_2:
    "如果值为真，则执行第一块语句。否则，则执行第二块语句。",
  CONTROLS_IF_TOOLTIP_3:
    "如果第一个值为真，则执行第一块的语句。否则，如果第二个值为真，则执行第二块的语句。",
  CONTROLS_IF_TOOLTIP_4:
    "如果第一个值为真，则执行第一块对语句。否则，如果第二个值为真，则执行语句的第二块。如果没有值为真，则执行最后一块的语句。",
  CONTROLS_REPEAT_HELPURL: "https://zh.wikipedia.org/wiki/For循环",
  CONTROLS_REPEAT_INPUT_DO: "执行",
  CONTROLS_REPEAT_TITLE: "重复 %1 次",
  CONTROLS_REPEAT_TOOLTIP: "多次执行一些语句。",
  CONTROLS_WHILEUNTIL_HELPURL:
    "https://github.com/google/blockly/wiki/Loops#repeat", // untranslated
  CONTROLS_WHILEUNTIL_OPERATOR_UNTIL: "重复直到条件满足",
  CONTROLS_WHILEUNTIL_OPERATOR_WHILE: "当条件满足时重复",
  CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL: "只要值为假，执行一些语句。",
  CONTROLS_WHILEUNTIL_TOOLTIP_WHILE: "只要值为真，执行一些语句。",
  DELETE_ALL_BLOCKS: "删除所有 %1 个块吗？",
  DELETE_BLOCK: "删除块",
  DELETE_VARIABLE: "删除变量“%1”",
  DELETE_VARIABLE_CONFIRMATION: "要删除对变量“%2”的%1个引用吗？",
  DELETE_X_BLOCKS: "删除 %1 个块",
  DISABLE_BLOCK: "禁用块",
  DUPLICATE_BLOCK: "复制",
  DUPLICATE_COMMENT: "复制注释",
  ENABLE_BLOCK: "启用块",
  EXPAND_ALL: "展开块",
  EXPAND_BLOCK: "展开块",
  EXTERNAL_INPUTS: "外部输入",
  HELP: "帮助",
  INLINE_INPUTS: "单行输入",
  IOS_CANCEL: "取消",
  IOS_ERROR: "错误",
  IOS_OK: "确定",
  IOS_PROCEDURES_ADD_INPUT: "+添加输入",
  IOS_PROCEDURES_ALLOW_STATEMENTS: "允许的语句",
  IOS_PROCEDURES_DUPLICATE_INPUTS_ERROR: "这个函数有多个输入。",
  IOS_PROCEDURES_INPUTS: "输入",
  IOS_VARIABLES_ADD_BUTTON: "添加",
  IOS_VARIABLES_ADD_VARIABLE: "+添加变量",
  IOS_VARIABLES_DELETE_BUTTON: "删除",
  IOS_VARIABLES_EMPTY_NAME_ERROR: "你不能使用空白的变量名。",
  IOS_VARIABLES_RENAME_BUTTON: "重命名",
  IOS_VARIABLES_VARIABLE_NAME: "变量名",
  LISTS_CREATE_EMPTY_HELPURL:
    "https://github.com/google/blockly/wiki/Lists#create-empty-list",
  LISTS_CREATE_EMPTY_TITLE: "创建空列表",
  LISTS_CREATE_EMPTY_TOOLTIP: "返回一个列表，长度为 0，不包含任何数据记录",
  LISTS_CREATE_WITH_CONTAINER_TITLE_ADD: "列表",
  LISTS_CREATE_WITH_CONTAINER_TOOLTIP:
    "增加、删除或重新排列各部分以此重新配置这个列表块。",
  LISTS_CREATE_WITH_HELPURL:
    "https://github.com/google/blockly/wiki/Lists#create-list-with",
  LISTS_CREATE_WITH_INPUT_WITH: "建立列表从",
  LISTS_CREATE_WITH_ITEM_TOOLTIP: "将一个项添加到列表中。",
  LISTS_CREATE_WITH_TOOLTIP: "建立一个具有任意数量项目的列表。",
  LISTS_GET_INDEX_FIRST: "第一个",
  LISTS_GET_INDEX_FROM_END: "倒数第#",
  LISTS_GET_INDEX_FROM_START: "#",
  LISTS_GET_INDEX_GET: "取得",
  LISTS_GET_INDEX_GET_REMOVE: "取得并移除",
  LISTS_GET_INDEX_LAST: "最后一个",
  LISTS_GET_INDEX_RANDOM: "随机的",
  LISTS_GET_INDEX_REMOVE: "移除",
  LISTS_GET_INDEX_TAIL: "-",
  LISTS_GET_INDEX_TOOLTIP_GET_FIRST: "返回列表中的第一项。",
  LISTS_GET_INDEX_TOOLTIP_GET_FROM: "返回在列表中的指定位置的项。",
  LISTS_GET_INDEX_TOOLTIP_GET_LAST: "返回列表中的最后一项。",
  LISTS_GET_INDEX_TOOLTIP_GET_RANDOM: "返回列表中的随机一项。",
  LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FIRST: "移除并返回列表中的第一项。",
  LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM: "移除并返回列表中的指定位置的项。",
  LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_LAST: "移除并返回列表中的最后一项。",
  LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_RANDOM: "移除并返回列表中的随机一项。",
  LISTS_GET_INDEX_TOOLTIP_REMOVE_FIRST: "移除列表中的第一项",
  LISTS_GET_INDEX_TOOLTIP_REMOVE_FROM: "移除在列表中的指定位置的项。",
  LISTS_GET_INDEX_TOOLTIP_REMOVE_LAST: "移除列表中的最后一项",
  LISTS_GET_INDEX_TOOLTIP_REMOVE_RANDOM: "删除列表中的随机一项。",
  LISTS_GET_SUBLIST_END_FROM_END: "到倒数第#",
  LISTS_GET_SUBLIST_END_FROM_START: "到#",
  LISTS_GET_SUBLIST_END_LAST: "到最后",
  LISTS_GET_SUBLIST_HELPURL:
    "https://github.com/google/blockly/wiki/Lists#getting-a-sublist", // untranslated
  LISTS_GET_SUBLIST_START_FIRST: "获取子列表从第一个",
  LISTS_GET_SUBLIST_START_FROM_END: "获取子列表从最后一个#",
  LISTS_GET_SUBLIST_START_FROM_START: "获取子列表从#",
  LISTS_GET_SUBLIST_TAIL: "-",
  LISTS_GET_SUBLIST_TOOLTIP: "复制列表中指定的部分。",
  LISTS_INDEX_FROM_END_TOOLTIP: "%1是最后一项。",
  LISTS_INDEX_FROM_START_TOOLTIP: "%1是第一项。",
  LISTS_INDEX_OF_FIRST: "寻找第一次出现的项",
  LISTS_INDEX_OF_HELPURL:
    "https://github.com/google/blockly/wiki/Lists#getting-items-from-a-list", // untranslated
  LISTS_INDEX_OF_LAST: "寻找最后一次出现的项",
  LISTS_INDEX_OF_TOOLTIP:
    "返回在列表中的第一/最后一个匹配项的索引值。如果找不到项目则返回%1。",
  LISTS_INLIST: "在列表中",
  LISTS_ISEMPTY_HELPURL:
    "https://github.com/google/blockly/wiki/Lists#is-empty", // untranslated
  LISTS_ISEMPTY_TITLE: "%1是空的",
  LISTS_ISEMPTY_TOOLTIP: "如果改列表为空，则返回真。",
  LISTS_LENGTH_HELPURL:
    "https://github.com/google/blockly/wiki/Lists#length-of", // untranslated
  LISTS_LENGTH_TITLE: "%1的长度",
  LISTS_LENGTH_TOOLTIP: "返回列表的长度。",
  LISTS_REPEAT_HELPURL:
    "https://github.com/google/blockly/wiki/Lists#create-list-with", // untranslated
  LISTS_REPEAT_TITLE: "建立列表使用项 %1 重复 %2 次",
  LISTS_REPEAT_TOOLTIP: "建立包含指定重复次数的值的列表。",
  LISTS_REVERSE_HELPURL:
    "https://github.com/google/blockly/wiki/Lists#reversing-a-list",
  LISTS_REVERSE_MESSAGE0: "倒转%1",
  LISTS_REVERSE_TOOLTIP: "倒转一个列表的拷贝。",
  LISTS_SET_INDEX_HELPURL:
    "https://github.com/google/blockly/wiki/Lists#in-list--set", // untranslated
  LISTS_SET_INDEX_INPUT_TO: "值为",
  LISTS_SET_INDEX_INSERT: "插入在",
  LISTS_SET_INDEX_SET: "设置",
  LISTS_SET_INDEX_TOOLTIP_INSERT_FIRST: "在列表的起始处添加该项。",
  LISTS_SET_INDEX_TOOLTIP_INSERT_FROM: "插入在列表中指定位置的项。",
  LISTS_SET_INDEX_TOOLTIP_INSERT_LAST: "在列表的末尾处添加该项。",
  LISTS_SET_INDEX_TOOLTIP_INSERT_RANDOM: "在列表的随机位置插入该项。",
  LISTS_SET_INDEX_TOOLTIP_SET_FIRST: "设置列表中的第一项。",
  LISTS_SET_INDEX_TOOLTIP_SET_FROM: "设置在列表中指定位置的项。",
  LISTS_SET_INDEX_TOOLTIP_SET_LAST: "设置列表中的最后一项。",
  LISTS_SET_INDEX_TOOLTIP_SET_RANDOM: "设置列表中的随机一项。",
  LISTS_SORT_HELPURL:
    "https://github.com/google/blockly/wiki/Lists#sorting-a-list",
  LISTS_SORT_ORDER_ASCENDING: "升序",
  LISTS_SORT_ORDER_DESCENDING: "降序",
  LISTS_SORT_TITLE: "排序%1 %2 %3",
  LISTS_SORT_TOOLTIP: "排序一个列表的拷贝。",
  LISTS_SORT_TYPE_IGNORECASE: "按字母排序，忽略大小写",
  LISTS_SORT_TYPE_NUMERIC: "按数字排序",
  LISTS_SORT_TYPE_TEXT: "按字母排序",
  LISTS_SPLIT_HELPURL:
    "https://github.com/google/blockly/wiki/Lists#splitting-strings-and-joining-lists",
  LISTS_SPLIT_LIST_FROM_TEXT: "从文本制作列表",
  LISTS_SPLIT_TEXT_FROM_LIST: "从列表拆出文本",
  LISTS_SPLIT_TOOLTIP_JOIN: "加入文本列表至一个文本，由分隔符分隔。",
  LISTS_SPLIT_TOOLTIP_SPLIT: "拆分文本到文本列表，按每个分隔符拆分。",
  LISTS_SPLIT_WITH_DELIMITER: "用分隔符",
  LOGIC_BOOLEAN_FALSE: "假",
  LOGIC_BOOLEAN_HELPURL: "https://github.com/google/blockly/wiki/Logic#values", // untranslated
  LOGIC_BOOLEAN_TOOLTIP: "返回真或假。",
  LOGIC_BOOLEAN_TRUE: "真",
  LOGIC_COMPARE_HELPURL: "https://zh.wikipedia.org/wiki/不等",
  LOGIC_COMPARE_TOOLTIP_EQ: "如果两个输入结果相等，则返回真。",
  LOGIC_COMPARE_TOOLTIP_GT: "如果第一个输入结果比第二个大，则返回真。",
  LOGIC_COMPARE_TOOLTIP_GTE:
    "如果第一个输入结果大于或等于第二个输入结果，则返回真。",
  LOGIC_COMPARE_TOOLTIP_LT: "如果第一个输入结果比第二个小，则返回真。",
  LOGIC_COMPARE_TOOLTIP_LTE:
    "如果第一个输入结果小于或等于第二个输入结果，则返回真。",
  LOGIC_COMPARE_TOOLTIP_NEQ: "如果两个输入结果不相等，则返回真。",
  LOGIC_NEGATE_HELPURL: "https://github.com/google/blockly/wiki/Logic#not",
  LOGIC_NEGATE_TITLE: "非%1",
  LOGIC_NEGATE_TOOLTIP:
    "如果输入结果为假，则返回真；如果输入结果为真，则返回假。",
  LOGIC_NULL: "空",
  LOGIC_NULL_HELPURL: "https://en.wikipedia.org/wiki/Nullable_type", // untranslated
  LOGIC_NULL_TOOLTIP: "返回空值。",
  LOGIC_OPERATION_AND: "并且",
  LOGIC_OPERATION_HELPURL:
    "https://github.com/google/blockly/wiki/Logic#logical-operations", // untranslated
  LOGIC_OPERATION_OR: "或",
  LOGIC_OPERATION_TOOLTIP_AND: "如果两个输入结果都为真，则返回真。",
  LOGIC_OPERATION_TOOLTIP_OR: "如果至少有一个输入结果为真，则返回真。",
  LOGIC_TERNARY_CONDITION: "断言",
  LOGIC_TERNARY_HELPURL: "https://zh.wikipedia.org/wiki/条件运算符",
  LOGIC_TERNARY_IF_FALSE: "如果为假",
  LOGIC_TERNARY_IF_TRUE: "如果为真",
  LOGIC_TERNARY_TOOLTIP:
    "检查“断言”里的条件语句。如果条件为真，则返回“如果为真”的值，否则，则返回“如果为假”的值。",
  MATH_ADDITION_SYMBOL: "+", // untranslated
  MATH_ARITHMETIC_HELPURL: "https://zh.wikipedia.org/wiki/算术",
  MATH_ARITHMETIC_TOOLTIP_ADD: "返回两个数值的和。",
  MATH_ARITHMETIC_TOOLTIP_DIVIDE: "返回两个数值的商。",
  MATH_ARITHMETIC_TOOLTIP_MINUS: "返回两个数值的差值。",
  MATH_ARITHMETIC_TOOLTIP_MULTIPLY: "返回两个数值的乘积。",
  MATH_ARITHMETIC_TOOLTIP_POWER:
    "返回以第一个数值为底数，以第二个数值为幂的结果。",
  MATH_ATAN2_HELPURL: "https://zh.wikipedia.org/wiki/反正切2",
  MATH_ATAN2_TITLE: "点(x:%1,y:%2)的方位角",
  MATH_ATAN2_TOOLTIP: "返回点（X，Y）的反正切值，范围为-180到180度。",
  MATH_CHANGE_HELPURL: "https://zh.wikipedia.org/wiki/加法",
  MATH_CHANGE_TITLE: "将 %1 增加 %2",
  MATH_CHANGE_TOOLTIP: "为变量“%1”增加一个数值。",
  MATH_CONSTANT_HELPURL: "https://zh.wikipedia.org/wiki/数学常数",
  MATH_CONSTANT_TOOLTIP:
    "返回一个常见常量：π (3.141…)、e (2.718…)、φ (1.618…)、平方根 (1.414…)、开平方根 (0.707…)或∞ (无限大)。",
  MATH_CONSTRAIN_HELPURL: "https://en.wikipedia.org/wiki/Clamping_(graphics)", // untranslated
  MATH_CONSTRAIN_TITLE: "将 %1 限制在 最低 %2 到最高 %3 之间",
  MATH_CONSTRAIN_TOOLTIP: "将一个数值限制在两个指定的数值范围（含边界）之间。",
  MATH_DIVISION_SYMBOL: "÷", // untranslated
  MATH_IS_DIVISIBLE_BY: "可被整除",
  MATH_IS_EVEN: "是偶数",
  MATH_IS_NEGATIVE: "是负数",
  MATH_IS_ODD: "是奇数",
  MATH_IS_POSITIVE: "是正数",
  MATH_IS_PRIME: "是质数",
  MATH_IS_TOOLTIP:
    "检查一个数值是否是偶数、奇数、质数、自然数、正数、负数或者是否能被某数整除。返回真或假。",
  MATH_IS_WHOLE: "是整数",
  MATH_MODULO_HELPURL: "https://zh.wikipedia.org/wiki/模除",
  MATH_MODULO_TITLE: "取 %1 ÷ %2 的余数",
  MATH_MODULO_TOOLTIP: "返回这两个数字相除后的余数。",
  MATH_MULTIPLICATION_SYMBOL: "×", // untranslated
  MATH_NUMBER_HELPURL: "https://zh.wikipedia.org/wiki/数",
  MATH_NUMBER_TOOLTIP: "一个数值。",
  MATH_ONLIST_HELPURL: "", // untranslated
  MATH_ONLIST_OPERATOR_AVERAGE: "列表平均值",
  MATH_ONLIST_OPERATOR_MAX: "列表最大值",
  MATH_ONLIST_OPERATOR_MEDIAN: "列表中位数",
  MATH_ONLIST_OPERATOR_MIN: "列表最小值",
  MATH_ONLIST_OPERATOR_MODE: "列表中的众数",
  MATH_ONLIST_OPERATOR_RANDOM: "列表随机项",
  MATH_ONLIST_OPERATOR_STD_DEV: "列表的标准差",
  MATH_ONLIST_OPERATOR_SUM: "列表中数值的和",
  MATH_ONLIST_TOOLTIP_AVERAGE: "返回列表中的数值的平均值。",
  MATH_ONLIST_TOOLTIP_MAX: "返回列表中最大值。",
  MATH_ONLIST_TOOLTIP_MEDIAN: "返回列表中数值的中位数。",
  MATH_ONLIST_TOOLTIP_MIN: "返回列表中最小值。",
  MATH_ONLIST_TOOLTIP_MODE: "返回列表中的出现次数最多的项的列表。",
  MATH_ONLIST_TOOLTIP_RANDOM: "从列表中返回一个随机的元素。",
  MATH_ONLIST_TOOLTIP_STD_DEV: "返回列表的标准差。",
  MATH_ONLIST_TOOLTIP_SUM: "返回列表中的所有数值的和。",
  MATH_POWER_SYMBOL: "^", // untranslated
  MATH_RANDOM_FLOAT_HELPURL: "https://zh.wikipedia.org/wiki/随机数生成器",
  MATH_RANDOM_FLOAT_TITLE_RANDOM: "随机小数",
  MATH_RANDOM_FLOAT_TOOLTIP: "返回一个介于0.0到1.0之间（含边界）的随机数。",
  MATH_RANDOM_INT_HELPURL: "https://zh.wikipedia.org/wiki/随机数生成器",
  MATH_RANDOM_INT_TITLE: "从 %1 到 %2 范围内的随机整数",
  MATH_RANDOM_INT_TOOLTIP:
    "返回一个限制在两个指定数值的范围（含边界）之间的随机整数。",
  MATH_ROUND_HELPURL: "https://zh.wikipedia.org/wiki/数值修约",
  MATH_ROUND_OPERATOR_ROUND: "四舍五入",
  MATH_ROUND_OPERATOR_ROUNDDOWN: "向下舍入",
  MATH_ROUND_OPERATOR_ROUNDUP: "向上舍入",
  MATH_ROUND_TOOLTIP: "数字向上或向下舍入。",
  MATH_SINGLE_HELPURL: "https://zh.wikipedia.org/wiki/平方根",
  MATH_SINGLE_OP_ABSOLUTE: "绝对值",
  MATH_SINGLE_OP_ROOT: "平方根",
  MATH_SINGLE_TOOLTIP_ABS: "返回一个数值的绝对值。",
  MATH_SINGLE_TOOLTIP_EXP: "返回一个数值的e次幂。",
  MATH_SINGLE_TOOLTIP_LN: "返回一个数值的自然对数。",
  MATH_SINGLE_TOOLTIP_LOG10: "返回一个数值的以10为底的对数。",
  MATH_SINGLE_TOOLTIP_NEG: "返回一个数值的相反数。",
  MATH_SINGLE_TOOLTIP_POW10: "返回一个数值的10次幂。",
  MATH_SINGLE_TOOLTIP_ROOT: "返回一个数的平方根。",
  MATH_SUBTRACTION_SYMBOL: "-", // untranslated
  MATH_TRIG_ACOS: "acos", // untranslated
  MATH_TRIG_ASIN: "asin", // untranslated
  MATH_TRIG_ATAN: "atan", // untranslated
  MATH_TRIG_COS: "cos", // untranslated
  MATH_TRIG_HELPURL: "https://zh.wikipedia.org/wiki/三角函数",
  MATH_TRIG_SIN: "sin", // untranslated
  MATH_TRIG_TAN: "tan", // untranslated
  MATH_TRIG_TOOLTIP_ACOS: "返回一个数值的反余弦值。",
  MATH_TRIG_TOOLTIP_ASIN: "返回一个数值的反正弦值。",
  MATH_TRIG_TOOLTIP_ATAN: "返回一个数值的反正切值。",
  MATH_TRIG_TOOLTIP_COS: "返回指定角度的余弦值(非弧度）。",
  MATH_TRIG_TOOLTIP_SIN: "返回指定角度的正弦值(非弧度）。",
  MATH_TRIG_TOOLTIP_TAN: "返回指定角度的正切值(非弧度）。",
  NEW_COLOUR_VARIABLE: "创建颜色变量...",
  NEW_NUMBER_VARIABLE: "创建数字变量...",
  NEW_STRING_VARIABLE: "创建字符串变量...",
  NEW_VARIABLE: "创建变量...",
  NEW_VARIABLE_TITLE: "新变量的名称：",
  NEW_VARIABLE_TYPE_TITLE: "新变量的类型：",
  ORDINAL_NUMBER_SUFFIX: "-",
  PROCEDURES_ALLOW_STATEMENTS: "允许声明",
  PROCEDURES_BEFORE_PARAMS: "与：",
  PROCEDURES_CALLNORETURN_HELPURL: "https://zh.wikipedia.org/wiki/子程序",
  PROCEDURES_CALLNORETURN_TOOLTIP: "运行用户定义的函数“%1”。",
  PROCEDURES_CALLRETURN_HELPURL: "https://zh.wikipedia.org/wiki/子程序",
  PROCEDURES_CALLRETURN_TOOLTIP: "运行用户定义的函数“%1”，并使用它的输出值。",
  PROCEDURES_CALL_BEFORE_PARAMS: "与：",
  PROCEDURES_CREATE_DO: "创建“%1”",
  PROCEDURES_DEFNORETURN_COMMENT: "描述该功能...",
  PROCEDURES_DEFNORETURN_DO: "-",
  PROCEDURES_DEFNORETURN_HELPURL: "https://zh.wikipedia.org/wiki/子程序",
  PROCEDURES_DEFNORETURN_PROCEDURE: "做点什么",
  PROCEDURES_DEFNORETURN_TITLE: "至",
  PROCEDURES_DEFNORETURN_TOOLTIP: "创建一个不带输出值的函数。",
  PROCEDURES_DEFRETURN_HELPURL: "https://zh.wikipedia.org/wiki/子程序",
  PROCEDURES_DEFRETURN_RETURN: "返回",
  PROCEDURES_DEFRETURN_TOOLTIP: "创建一个有输出值的函数。",
  PROCEDURES_DEF_DUPLICATE_WARNING: "警告：此函数具有重复参数。",
  PROCEDURES_HIGHLIGHT_DEF: "突出显示函数定义",
  PROCEDURES_IFRETURN_HELPURL: "http://c2.com/cgi/wiki?GuardClause",
  PROCEDURES_IFRETURN_TOOLTIP: "如果值为真，则返回第二个值。",
  PROCEDURES_IFRETURN_WARNING: "警告：这个块只能在函数内部使用。",
  PROCEDURES_MUTATORARG_TITLE: "输入名称：",
  PROCEDURES_MUTATORARG_TOOLTIP: "添加函数输入。",
  PROCEDURES_MUTATORCONTAINER_TITLE: "输入",
  PROCEDURES_MUTATORCONTAINER_TOOLTIP: "添加、移除或重新排此函数的输入。",
  REDO: "重做",
  REMOVE_COMMENT: "删除注释",
  RENAME_VARIABLE: "重命名变量...",
  RENAME_VARIABLE_TITLE: "将所有“%1”变量重命名为:",
  TEXT_APPEND_HELPURL:
    "https://github.com/google/blockly/wiki/Text#text-modification", // untranslated
  TEXT_APPEND_TITLE: "向%1附加文本%2",
  TEXT_APPEND_TOOLTIP: "将一些文本追加到变量“%1”里。",
  TEXT_CHANGECASE_HELPURL:
    "https://github.com/google/blockly/wiki/Text#adjusting-text-case", // untranslated
  TEXT_CHANGECASE_OPERATOR_LOWERCASE: "转为小写",
  TEXT_CHANGECASE_OPERATOR_TITLECASE: "转为首字母大写",
  TEXT_CHANGECASE_OPERATOR_UPPERCASE: "转为大写",
  TEXT_CHANGECASE_TOOLTIP: "用不同的大小写模式复制并返回这段文字。",
  TEXT_CHARAT_FIRST: "寻找第一个字母",
  TEXT_CHARAT_FROM_END: "获取字符从倒数#",
  TEXT_CHARAT_FROM_START: "获取字符从#",
  TEXT_CHARAT_HELPURL:
    "https://github.com/google/blockly/wiki/Text#extracting-text", // untranslated
  TEXT_CHARAT_LAST: "寻找最后一个字母",
  TEXT_CHARAT_RANDOM: "寻找随机的字母",
  TEXT_CHARAT_TAIL: "-",
  TEXT_CHARAT_TITLE: "在文本%1 里 %2",
  TEXT_CHARAT_TOOLTIP: "返回位于指定位置的字母。",
  TEXT_COUNT_HELPURL:
    "https://github.com/google/blockly/wiki/Text#counting-substrings",
  TEXT_COUNT_MESSAGE0: "计算%1在%2里出现的次数",
  TEXT_COUNT_TOOLTIP: "计算在一段文本中，某个部分文本重复出现了多少次。",
  TEXT_CREATE_JOIN_ITEM_TOOLTIP: "将一个项添加到文本中。",
  TEXT_CREATE_JOIN_TITLE_JOIN: "加入",
  TEXT_CREATE_JOIN_TOOLTIP: "添加、移除或重新排列各节来重新配置这个文本块。",
  TEXT_GET_SUBSTRING_END_FROM_END: "到最后一个字符#",
  TEXT_GET_SUBSTRING_END_FROM_START: "至字符#",
  TEXT_GET_SUBSTRING_END_LAST: "到最后一个字符",
  TEXT_GET_SUBSTRING_HELPURL:
    "https://github.com/google/blockly/wiki/Text#extracting-a-region-of-text", // untranslated
  TEXT_GET_SUBSTRING_INPUT_IN_TEXT: "从文本",
  TEXT_GET_SUBSTRING_START_FIRST: "取得子串自第一个字符",
  TEXT_GET_SUBSTRING_START_FROM_END: "取得子串自倒数#",
  TEXT_GET_SUBSTRING_START_FROM_START: "取得子串自#",
  TEXT_GET_SUBSTRING_TAIL: "-",
  TEXT_GET_SUBSTRING_TOOLTIP: "返回文本中指定的一部分。",
  TEXT_INDEXOF_HELPURL:
    "https://github.com/google/blockly/wiki/Text#finding-text", // untranslated
  TEXT_INDEXOF_OPERATOR_FIRST: "寻找第一次出现的文本",
  TEXT_INDEXOF_OPERATOR_LAST: "寻找最后一次出现的文本",
  TEXT_INDEXOF_TITLE: "在文本 %1 里 %2  %3",
  TEXT_INDEXOF_TOOLTIP:
    "返回第一个文本段在第二个文本段中的第一/最后一个匹配项的起始位置。如果未找到，则返回%1。",
  TEXT_ISEMPTY_HELPURL:
    "https://github.com/google/blockly/wiki/Text#checking-for-empty-text", // untranslated
  TEXT_ISEMPTY_TITLE: "%1是空的",
  TEXT_ISEMPTY_TOOLTIP: "如果给定的文本为空，则返回真。",
  TEXT_JOIN_HELPURL:
    "https://github.com/google/blockly/wiki/Text#text-creation", // untranslated
  TEXT_JOIN_TITLE_CREATEWITH: "建立文本从",
  TEXT_JOIN_TOOLTIP: "通过串起任意数量的项以建立一段文本。",
  TEXT_LENGTH_HELPURL:
    "https://github.com/google/blockly/wiki/Text#text-modification", // untranslated
  TEXT_LENGTH_TITLE: "%1的长度",
  TEXT_LENGTH_TOOLTIP: "返回给定文本的字母数（包括空格）。",
  TEXT_PRINT_HELPURL:
    "https://github.com/google/blockly/wiki/Text#printing-text", // untranslated
  TEXT_PRINT_TITLE: "输出%1",
  TEXT_PRINT_TOOLTIP: "输出指定的文字、数字或其他值。",
  TEXT_PROMPT_HELPURL:
    "https://github.com/google/blockly/wiki/Text#getting-input-from-the-user", // untranslated
  TEXT_PROMPT_TOOLTIP_NUMBER: "要求用户输入数字。",
  TEXT_PROMPT_TOOLTIP_TEXT: "要求用户输入一些文本。",
  TEXT_PROMPT_TYPE_NUMBER: "要求输入数字，并显示提示消息",
  TEXT_PROMPT_TYPE_TEXT: "要求输入文本，并显示提示消息",
  TEXT_REPLACE_HELPURL:
    "https://github.com/google/blockly/wiki/Text#replacing-substrings",
  TEXT_REPLACE_MESSAGE0: "在%3中，将%1替换为%2",
  TEXT_REPLACE_TOOLTIP: "在一段文本中，将出现过的某部分文本都替换掉。",
  TEXT_REVERSE_HELPURL:
    "https://github.com/google/blockly/wiki/Text#reversing-text",
  TEXT_REVERSE_MESSAGE0: "翻转文本%1",
  TEXT_REVERSE_TOOLTIP: "将文本中各个字符的顺序倒转。",
  TEXT_TEXT_HELPURL: "https://zh.wikipedia.org/wiki/字符串",
  TEXT_TEXT_TOOLTIP: "一个字、词语或一行文本。",
  TEXT_TRIM_HELPURL:
    "https://github.com/google/blockly/wiki/Text#trimming-removing-spaces", // untranslated
  TEXT_TRIM_OPERATOR_BOTH: "消除其两侧的空白",
  TEXT_TRIM_OPERATOR_LEFT: "消除其左侧的空白",
  TEXT_TRIM_OPERATOR_RIGHT: "消除其右侧的空白",
  TEXT_TRIM_TOOLTIP:
    "从某一端或同时从两端删除多余的空白，并返回这段文字的一个副本。",
  TODAY: "今天",
  UNDO: "撤销",
  UNNAMED_KEY: "匿名",
  VARIABLES_DEFAULT_NAME: "项目",
  VARIABLES_GET_CREATE_SET: "创建“设定%1”",
  VARIABLES_GET_HELPURL: "https://github.com/google/blockly/wiki/Variables#get", // untranslated
  VARIABLES_GET_TOOLTIP: "返回此变量的值。",
  VARIABLES_SET: "赋值 %1 为 %2",
  VARIABLES_SET_CREATE_GET: "创建“获得%1”",
  VARIABLES_SET_HELPURL: "https://github.com/google/blockly/wiki/Variables#set", // untranslated
  VARIABLES_SET_TOOLTIP: "设置此变量，以使它和输入值相等。",
  VARIABLE_ALREADY_EXISTS: "名字叫“%1”的变量已经存在了。",
  VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE:
    "名字叫“%1”的变量已经有了另一个类型：“%2”。",
  WORKSPACE_ARIA_LABEL: "Blockly工作区",
  WORKSPACE_COMMENT_DEFAULT_TEXT: "说点什么...",

  // CONTROLS_FOREACH_INPUT_DO:"
  //   CONTROLS_REPEAT_INPUT_DO"]",
  get CONTROLS_FOREACH_INPUT_DO() {
    return Msg.CONTROLS_REPEAT_INPUT_DO;
  },
  // CONTROLS_FOR_INPUT_DO:CONTROLS_REPEAT_INPUT_DO"],
  get CONTROLS_FOR_INPUT_DO() {
    return Msg.CONTROLS_REPEAT_INPUT_DO;
  },

  // CONTROLS_IF_ELSEIF_TITLE_ELSEIF:
  //   CONTROLS_IF_MSG_ELSEIF"],
  get CONTROLS_IF_ELSEIF_TITLE_ELSEIF() {
    return Msg.CONTROLS_IF_MSG_ELSEIF;
  },

  // CONTROLS_IF_ELSE_TITLE_ELSE:
  //   CONTROLS_IF_MSG_ELSE"],
  get CONTROLS_IF_ELSE_TITLE_ELSE() {
    return Msg.CONTROLS_IF_MSG_ELSE;
  },

  // CONTROLS_IF_IF_TITLE_IF:CONTROLS_IF_MSG_IF"],
  get CONTROLS_IF_IF_TITLE_IF() {
    return Msg.CONTROLS_IF_MSG_IF;
  },

  // CONTROLS_IF_MSG_THEN:CONTROLS_REPEAT_INPUT_DO"],
  get CONTROLS_IF_MSG_THEN() {
    return Msg.CONTROLS_REPEAT_INPUT_DO;
  },

  // CONTROLS_WHILEUNTIL_INPUT_DO:
  //   CONTROLS_REPEAT_INPUT_DO"],
  get CONTROLS_WHILEUNTIL_INPUT_DO() {
    return Msg.CONTROLS_REPEAT_INPUT_DO;
  },

  // LISTS_CREATE_WITH_ITEM_TITLE:
  //   VARIABLES_DEFAULT_NAME"],
  get LISTS_CREATE_WITH_ITEM_TITLE() {
    return Msg.VARIABLES_DEFAULT_NAME;
  },

  // LISTS_GET_INDEX_HELPURL:LISTS_INDEX_OF_HELPURL"],
  get LISTS_GET_INDEX_HELPURL() {
    return Msg.LISTS_INDEX_OF_HELPURL;
  },

  // LISTS_GET_INDEX_INPUT_IN_LIST:LISTS_INLIST"],
  get LISTS_GET_INDEX_INPUT_IN_LIST() {
    return Msg.LISTS_INLIST;
  },

  // LISTS_GET_SUBLIST_INPUT_IN_LIST:LISTS_INLIST"],
  get LISTS_GET_SUBLIST_INPUT_IN_LIST() {
    return Msg.LISTS_INLIST;
  },

  // LISTS_INDEX_OF_INPUT_IN_LIST:LISTS_INLIST"],
  get LISTS_INDEX_OF_INPUT_IN_LIST() {
    return Msg.LISTS_INLIST;
  },

  // LISTS_SET_INDEX_INPUT_IN_LIST:LISTS_INLIST"],
  get LISTS_SET_INDEX_INPUT_IN_LIST() {
    return Msg.LISTS_INLIST;
  },

  // MATH_CHANGE_TITLE_ITEM:VARIABLES_DEFAULT_NAME"],
  get MATH_CHANGE_TITLE_ITEM() {
    return Msg.VARIABLES_DEFAULT_NAME;
  },

  // PROCEDURES_DEFRETURN_COMMENT:
  //   PROCEDURES_DEFNORETURN_COMMENT"],
  get PROCEDURES_DEFRETURN_COMMENT() {
    return Msg.PROCEDURES_DEFNORETURN_COMMENT;
  },

  // PROCEDURES_DEFRETURN_DO:
  //   PROCEDURES_DEFNORETURN_DO"],
  get PROCEDURES_DEFRETURN_DO() {
    return Msg.PROCEDURES_DEFNORETURN_DO;
  },

  // PROCEDURES_DEFRETURN_PROCEDURE:
  //   PROCEDURES_DEFNORETURN_PROCEDURE"],
  get PROCEDURES_DEFRETURN_PROCEDURE() {
    return Msg.PROCEDURES_DEFNORETURN_PROCEDURE;
  },

  // PROCEDURES_DEFRETURN_TITLE:
  //   PROCEDURES_DEFNORETURN_TITLE"],
  get PROCEDURES_DEFRETURN_TITLE() {
    return Msg.PROCEDURES_DEFNORETURN_TITLE;
  },

  // TEXT_APPEND_VARIABLE:VARIABLES_DEFAULT_NAME"],
  get TEXT_APPEND_VARIABLE() {
    return Msg.VARIABLES_DEFAULT_NAME;
  },

  // TEXT_CREATE_JOIN_ITEM_TITLE_ITEM:
  //   VARIABLES_DEFAULT_NAME"],
  get TEXT_CREATE_JOIN_ITEM_TITLE_ITEM() {
    return Msg.VARIABLES_DEFAULT_NAME;
  },
};
