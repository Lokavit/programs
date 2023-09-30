/*
 * @Author: Satya
 * @Date: 2020-05-21 09:52:21
 * @Last Modified by: Satya
 * @Last Modified time: 2020-09-22 19:05:56
 * doc:重写所有定义命令
 * 如果更改了本文件，运行 run `npm run translate`
 * 追加了[音乐、绘画分类明文]
 */

"use strict";

goog.provide("Blockly.Msg.en");

goog.require("Blockly.Msg");

// 控制分类 积木块明文及参数占位符
Blockly.Msg.CONTROL_FOREVER = "%1"; // 无线循环
Blockly.Msg.CONTROL_REPEAT = "%1 %2"; // 指定次数循环
Blockly.Msg.CONTROL_WAIT = "%1 %2"; // 延时
Blockly.Msg.CONTROL_IF = "if %1 then";
Blockly.Msg.CONTROL_ELSE = "else";

Blockly.Msg.CONTROL_STOP = "stop";
Blockly.Msg.CONTROL_STOP_ALL = "all";
Blockly.Msg.CONTROL_STOP_THIS = "this script";
Blockly.Msg.CONTROL_STOP_OTHER = "other scripts in sprite";
Blockly.Msg.CONTROL_WAITUNTIL = "wait until %1";
Blockly.Msg.CONTROL_REPEATUNTIL = "repeat until %1";
Blockly.Msg.CONTROL_WHILE = "while %1";
Blockly.Msg.CONTROL_FOREACH = "for each %1 in %2";
Blockly.Msg.CONTROL_STARTASCLONE = "when I start as a clone";
Blockly.Msg.CONTROL_CREATECLONEOF = "create clone of %1";
Blockly.Msg.CONTROL_CREATECLONEOF_MYSELF = "myself";
Blockly.Msg.CONTROL_DELETETHISCLONE = "delete this clone";
Blockly.Msg.CONTROL_COUNTER = "counter";
Blockly.Msg.CONTROL_INCRCOUNTER = "increment counter";
Blockly.Msg.CONTROL_CLEARCOUNTER = "clear counter";
Blockly.Msg.CONTROL_ALLATONCE = "all at once";

// Data blocks
Blockly.Msg.DATA_SETVARIABLETO = "set %1 to %2";
Blockly.Msg.DATA_CHANGEVARIABLEBY = "change %1 by %2";
Blockly.Msg.DATA_SHOWVARIABLE = "show variable %1";
Blockly.Msg.DATA_HIDEVARIABLE = "hide variable %1";
Blockly.Msg.DATA_ADDTOLIST = "add %1 to %2";
Blockly.Msg.DATA_DELETEOFLIST = "delete %1 of %2";
Blockly.Msg.DATA_DELETEALLOFLIST = "delete all of %1";
Blockly.Msg.DATA_INSERTATLIST = "insert %1 at %2 of %3";
Blockly.Msg.DATA_REPLACEITEMOFLIST = "replace item %1 of %2 with %3";
Blockly.Msg.DATA_ITEMOFLIST = "item %1 of %2";
Blockly.Msg.DATA_ITEMNUMOFLIST = "item # of %1 in %2";
Blockly.Msg.DATA_LENGTHOFLIST = "length of %1";
Blockly.Msg.DATA_LISTCONTAINSITEM = "%1 contains %2?";
Blockly.Msg.DATA_SHOWLIST = "show list %1";
Blockly.Msg.DATA_HIDELIST = "hide list %1";
Blockly.Msg.DATA_INDEX_ALL = "all";
Blockly.Msg.DATA_INDEX_LAST = "last";
Blockly.Msg.DATA_INDEX_RANDOM = "random";

// 事件分类 积木块明文及参数占位符
Blockly.Msg.EVENT_WHENFLAGCLICKED = " %1 ";
Blockly.Msg.EVENT_WHENTHISSPRITECLICKED = "%1";
Blockly.Msg.EVENT_WHENSTAGECLICKED = "when stage clicked";
Blockly.Msg.EVENT_WHENTOUCHINGOBJECT = "when this sprite touches %1";
Blockly.Msg.EVENT_WHENBROADCASTRECEIVED = "%1 %2";
Blockly.Msg.EVENT_WHENBACKDROPSWITCHESTO = "when backdrop switches to %1";
Blockly.Msg.EVENT_WHENGREATERTHAN = "when %1 > %2";
Blockly.Msg.EVENT_WHENGREATERTHAN_TIMER = "timer";
Blockly.Msg.EVENT_WHENGREATERTHAN_LOUDNESS = "loudness";
Blockly.Msg.EVENT_BROADCAST = "%1 %2";
Blockly.Msg.EVENT_BROADCASTANDWAIT = "broadcast %1 and wait";
Blockly.Msg.EVENT_WHENKEYPRESSED = "when %1 key pressed";
Blockly.Msg.EVENT_WHENKEYPRESSED_SPACE = "space";
Blockly.Msg.EVENT_WHENKEYPRESSED_LEFT = "left arrow";
Blockly.Msg.EVENT_WHENKEYPRESSED_RIGHT = "right arrow";
Blockly.Msg.EVENT_WHENKEYPRESSED_DOWN = "down arrow";
Blockly.Msg.EVENT_WHENKEYPRESSED_UP = "up arrow";
Blockly.Msg.EVENT_WHENKEYPRESSED_ANY = "any";

// 外观分类 积木块明文及参数占位符
Blockly.Msg.LOOKS_SHOW = "%1"; // 显示角色
Blockly.Msg.LOOKS_HIDE = "%1"; // 隐藏角色
Blockly.Msg.LOOKS_ZOOMIN = "%1"; // 缩小角色
Blockly.Msg.LOOKS_ZOOMOUT = "%1"; // 放大角色
Blockly.Msg.LOOKS_ZOOMRESET = "%1"; // 缩放重置
Blockly.Msg.LOOKS_SWITCHBACKDROPTO = "%1 %2"; // 背景切换

// 运动分类 积木块明文及参数占位符
Blockly.Msg.MOTION_MOVELEFT = "%1 %2 %3"; // 左移
Blockly.Msg.MOTION_MOVERIGHT = "%1 %2 %3"; // 右移
Blockly.Msg.MOTION_MOVEUP = "%1 %2 %3"; // 上移
Blockly.Msg.MOTION_MOVEDOWN = "%1 %2 %3"; // 下移
Blockly.Msg.MOTION_TURNLEFT = "%1 %2"; // 左转
Blockly.Msg.MOTION_TURNRIGHT = "%1 %2"; // 右转
Blockly.Msg.MOTION_JUMP = "%1 %2 %3"; // 跳跃
Blockly.Msg.MOTION_MOVERESET = "%1"; // 位置重置
Blockly.Msg.MOTION_STAGE_SELECTED = "Stage selected: no motion blocks";

// 运算分类 积木块明文及参数占位符
Blockly.Msg.OPERATORS_ADD = "%1 + %2";
Blockly.Msg.OPERATORS_SUBTRACT = "%1 - %2";
Blockly.Msg.OPERATORS_MULTIPLY = "%1 * %2";
Blockly.Msg.OPERATORS_DIVIDE = "%1 / %2";
Blockly.Msg.OPERATORS_RANDOM = "pick random %1 to %2";
Blockly.Msg.OPERATORS_GT = "%1 > %2";
Blockly.Msg.OPERATORS_LT = "%1 < %2";
Blockly.Msg.OPERATORS_EQUALS = "%1 = %2";
Blockly.Msg.OPERATORS_AND = "%1 and %2";
Blockly.Msg.OPERATORS_OR = "%1 or %2";
Blockly.Msg.OPERATORS_NOT = "not %1";
Blockly.Msg.OPERATORS_JOIN = "join %1 %2";
Blockly.Msg.OPERATORS_JOIN_APPLE = "apple";
Blockly.Msg.OPERATORS_JOIN_BANANA = "banana";
Blockly.Msg.OPERATORS_LETTEROF = "letter %1 of %2";
Blockly.Msg.OPERATORS_LETTEROF_APPLE = "a";
Blockly.Msg.OPERATORS_LENGTH = "length of %1";
Blockly.Msg.OPERATORS_CONTAINS = "%1 contains %2?";
Blockly.Msg.OPERATORS_MOD = "%1 mod %2";
Blockly.Msg.OPERATORS_ROUND = "round %1";
Blockly.Msg.OPERATORS_MATHOP = "%1 of %2";
Blockly.Msg.OPERATORS_MATHOP_ABS = "abs";
Blockly.Msg.OPERATORS_MATHOP_FLOOR = "floor";
Blockly.Msg.OPERATORS_MATHOP_CEILING = "ceiling";
Blockly.Msg.OPERATORS_MATHOP_SQRT = "sqrt";
Blockly.Msg.OPERATORS_MATHOP_SIN = "sin";
Blockly.Msg.OPERATORS_MATHOP_COS = "cos";
Blockly.Msg.OPERATORS_MATHOP_TAN = "tan";
Blockly.Msg.OPERATORS_MATHOP_ASIN = "asin";
Blockly.Msg.OPERATORS_MATHOP_ACOS = "acos";
Blockly.Msg.OPERATORS_MATHOP_ATAN = "atan";
Blockly.Msg.OPERATORS_MATHOP_LN = "ln";
Blockly.Msg.OPERATORS_MATHOP_LOG = "log";
Blockly.Msg.OPERATORS_MATHOP_EEXP = "e ^";
Blockly.Msg.OPERATORS_MATHOP_10EXP = "10 ^";

// Procedures blocks
Blockly.Msg.PROCEDURES_DEFINITION = "define %1";

// 侦测分类 积木块明文及参数占位符
Blockly.Msg.SENSING_TOUCHINGOBJECT = "touching %1?";
Blockly.Msg.SENSING_TOUCHINGOBJECT_POINTER = "mouse-pointer";
Blockly.Msg.SENSING_TOUCHINGOBJECT_EDGE = "edge";
Blockly.Msg.SENSING_TOUCHINGCOLOR = "touching color %1?";
Blockly.Msg.SENSING_COLORISTOUCHINGCOLOR = "color %1 is touching %2?";
Blockly.Msg.SENSING_DISTANCETO = "distance to %1";
Blockly.Msg.SENSING_DISTANCETO_POINTER = "mouse-pointer";
Blockly.Msg.SENSING_ASKANDWAIT = "ask %1 and wait";
Blockly.Msg.SENSING_ASK_TEXT = "What's your name?";
Blockly.Msg.SENSING_ANSWER = "answer";
Blockly.Msg.SENSING_KEYPRESSED = "key %1 pressed?";
Blockly.Msg.SENSING_MOUSEDOWN = "mouse down?";
Blockly.Msg.SENSING_MOUSEX = "mouse x";
Blockly.Msg.SENSING_MOUSEY = "mouse y";
Blockly.Msg.SENSING_SETDRAGMODE = "set drag mode %1";
Blockly.Msg.SENSING_SETDRAGMODE_DRAGGABLE = "draggable";
Blockly.Msg.SENSING_SETDRAGMODE_NOTDRAGGABLE = "not draggable";
Blockly.Msg.SENSING_LOUDNESS = "loudness";
Blockly.Msg.SENSING_LOUD = "loud?";
Blockly.Msg.SENSING_TIMER = "timer";
Blockly.Msg.SENSING_RESETTIMER = "reset timer";
Blockly.Msg.SENSING_OF = "%1 of %2";
Blockly.Msg.SENSING_OF_XPOSITION = "x position";
Blockly.Msg.SENSING_OF_YPOSITION = "y position";
Blockly.Msg.SENSING_OF_DIRECTION = "direction";
Blockly.Msg.SENSING_OF_COSTUMENUMBER = "costume #";
Blockly.Msg.SENSING_OF_COSTUMENAME = "costume name";
Blockly.Msg.SENSING_OF_SIZE = "size";
Blockly.Msg.SENSING_OF_VOLUME = "volume";
Blockly.Msg.SENSING_OF_BACKDROPNUMBER = "backdrop #";
Blockly.Msg.SENSING_OF_BACKDROPNAME = "backdrop name";
Blockly.Msg.SENSING_OF_STAGE = "Stage";
Blockly.Msg.SENSING_CURRENT = "current %1";
Blockly.Msg.SENSING_CURRENT_YEAR = "year";
Blockly.Msg.SENSING_CURRENT_MONTH = "month";
Blockly.Msg.SENSING_CURRENT_DATE = "date";
Blockly.Msg.SENSING_CURRENT_DAYOFWEEK = "day of week";
Blockly.Msg.SENSING_CURRENT_HOUR = "hour";
Blockly.Msg.SENSING_CURRENT_MINUTE = "minute";
Blockly.Msg.SENSING_CURRENT_SECOND = "second";
Blockly.Msg.SENSING_DAYSSINCE2000 = "days since 2000";
Blockly.Msg.SENSING_USERNAME = "username";
Blockly.Msg.SENSING_USERID = "user id";

// 声音分类 积木块明文及参数占位符
Blockly.Msg.SOUND_PLAY = "start sound %1";
Blockly.Msg.SOUND_PLAYUNTILDONE = "play sound %1 until done";
Blockly.Msg.SOUND_STOPALLSOUNDS = "stop all sounds";
Blockly.Msg.SOUND_SETEFFECTO = "set %1 effect to %2";
Blockly.Msg.SOUND_CHANGEEFFECTBY = "change %1 effect by %2";
Blockly.Msg.SOUND_CLEAREFFECTS = "clear sound effects";
Blockly.Msg.SOUND_EFFECTS_PITCH = "pitch";
Blockly.Msg.SOUND_EFFECTS_PAN = "pan left/right";
Blockly.Msg.SOUND_CHANGEVOLUMEBY = "change volume by %1";
Blockly.Msg.SOUND_SETVOLUMETO = "set volume to %1%";
Blockly.Msg.SOUND_VOLUME = "volume";
Blockly.Msg.SOUND_RECORD = "record...";

// 追加绘画分类 积木块明文及参数占位符
Blockly.Msg.PEN_CLEAR = "%1 erase all";
Blockly.Msg.PEN_DOWN = "%1 pen down";
Blockly.Msg.PEN_UP = "%1 pen up";
Blockly.Msg.PEN_SETCOLORTO = "%1 %2";

// 追加 音乐分类 积木块明文及参数占位符
Blockly.Msg.MUSIC_PLAYDRUMFORBEATS = "%1";

// 左侧分类的明文定义
Blockly.Msg.CATEGORY_MOTION = "Motion"; // 运动
Blockly.Msg.CATEGORY_LOOKS = "Looks"; // 外观
Blockly.Msg.CATEGORY_SOUND = "Sound"; // 声音
Blockly.Msg.CATEGORY_EVENTS = "Events"; // 事件
Blockly.Msg.CATEGORY_CONTROL = "Control"; // 控制
Blockly.Msg.CATEGORY_SENSING = "Sensing"; // 侦测
Blockly.Msg.CATEGORY_OPERATORS = "Operators"; // 运算
Blockly.Msg.CATEGORY_VARIABLES = "Variables"; // 变量
Blockly.Msg.CATEGORY_MYBLOCKS = "My Blocks"; // 自制
//  新增两个分类
Blockly.Msg.CATEGORY_MUSIC = "Music"; // 音乐
Blockly.Msg.CATEGORY_PEN = "Pen"; // 绘画

// 右键上下文菜单明文
Blockly.Msg.DUPLICATE = "Duplicate";
Blockly.Msg.DELETE = "Delete";
Blockly.Msg.ADD_COMMENT = "Add Comment";
Blockly.Msg.REMOVE_COMMENT = "Remove Comment";
Blockly.Msg.DELETE_BLOCK = "Delete Block";
Blockly.Msg.DELETE_X_BLOCKS = "Delete %1 Blocks";
Blockly.Msg.DELETE_ALL_BLOCKS = "Delete all %1 blocks?";
Blockly.Msg.CLEAN_UP = "Clean up Blocks";
Blockly.Msg.HELP = "Help";
Blockly.Msg.UNDO = "Undo";
Blockly.Msg.REDO = "Redo";
Blockly.Msg.EDIT_PROCEDURE = "Edit";
Blockly.Msg.SHOW_PROCEDURE_DEFINITION = "Go to definition";
Blockly.Msg.WORKSPACE_COMMENT_DEFAULT_TEXT = "Say something...";

// Color
Blockly.Msg.COLOUR_HUE_LABEL = "Color";
Blockly.Msg.COLOUR_SATURATION_LABEL = "Saturation";
Blockly.Msg.COLOUR_BRIGHTNESS_LABEL = "Brightness";

// Variables
// @todo Remove these once fully managed by Scratch VM / Scratch GUI
Blockly.Msg.CHANGE_VALUE_TITLE = "Change value:";
Blockly.Msg.RENAME_VARIABLE = "Rename variable";
Blockly.Msg.RENAME_VARIABLE_TITLE = 'Rename all "%1" variables to:';
Blockly.Msg.RENAME_VARIABLE_MODAL_TITLE = "Rename Variable";
Blockly.Msg.NEW_VARIABLE = "Make a Variable";
Blockly.Msg.NEW_VARIABLE_TITLE = "New variable name:";
Blockly.Msg.VARIABLE_MODAL_TITLE = "New Variable";
Blockly.Msg.VARIABLE_ALREADY_EXISTS = 'A variable named "%1" already exists.';
Blockly.Msg.VARIABLE_ALREADY_EXISTS_FOR_ANOTHER_TYPE =
  'A variable named "%1" already exists for another variable of type "%2".';
Blockly.Msg.DELETE_VARIABLE_CONFIRMATION =
  'Delete %1 uses of the "%2" variable?';
Blockly.Msg.CANNOT_DELETE_VARIABLE_PROCEDURE =
  'Can\'t delete the variable "%1" because it\'s part of the definition of the function "%2"';
Blockly.Msg.DELETE_VARIABLE = 'Delete the "%1" variable';

// Custom Procedures
// @todo Remove these once fully managed by Scratch VM / Scratch GUI
Blockly.Msg.NEW_PROCEDURE = "Make a Block";
Blockly.Msg.PROCEDURE_ALREADY_EXISTS = 'A procedure named "%1" already exists.';
Blockly.Msg.PROCEDURE_DEFAULT_NAME = "block name";

// Lists
// @todo Remove these once fully managed by Scratch VM / Scratch GUI
Blockly.Msg.NEW_LIST = "Make a List";
Blockly.Msg.NEW_LIST_TITLE = "New list name:";
Blockly.Msg.LIST_MODAL_TITLE = "New List";
Blockly.Msg.LIST_ALREADY_EXISTS = 'A list named "%1" already exists.';
Blockly.Msg.RENAME_LIST_TITLE = 'Rename all "%1" lists to:';
Blockly.Msg.RENAME_LIST_MODAL_TITLE = "Rename List";
Blockly.Msg.DEFAULT_LIST_ITEM = "thing";
Blockly.Msg.DELETE_LIST = 'Delete the "%1" list';
Blockly.Msg.RENAME_LIST = "Rename list";

// Broadcast Messages
// @todo Remove these once fully managed by Scratch VM / Scratch GUI
Blockly.Msg.NEW_BROADCAST_MESSAGE = "New message";
Blockly.Msg.NEW_BROADCAST_MESSAGE_TITLE = "New message name:";
Blockly.Msg.BROADCAST_MODAL_TITLE = "New Message";
Blockly.Msg.DEFAULT_BROADCAST_MESSAGE_NAME = "message1";
