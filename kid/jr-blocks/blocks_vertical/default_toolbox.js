/*
 * @Author: Satya
 * @Date: 2020-05-21 09:12:03
 * @Last Modified by: Satya
 * @Last Modified time: 2020-09-22 18:58:33
 * doc:重写默认积木块xml结构，
 *  可在tests/vertical_playground.html查看效果
 *  追加了新增分类[音乐、绘画]的XML结构
 */

"use strict";

goog.provide("Blockly.Blocks.defaultToolbox");

goog.require("Blockly.Blocks");

/**
 * @fileoverview Provide a default toolbox XML.
 */

Blockly.Blocks.defaultToolbox =
  '<xml id="toolbox-categories" style="display: none">' +
  // 分类 分类名 id  该分类(圆圈)的颜色 第二色(边框色)
  // '<category name="%{BKY_CATEGORY_MOTION}" id="motion" colour="#4C97FF" secondaryColour="#3373CC">' +
  //  运动分类
  '<category name="%{BKY_CATEGORY_MOTION}" id="motion" colour="#4C97FF" secondaryColour="#3373CC" ' +
  // 此处指定iconURI,即可达到将原有圆形图标替换为自定义.svg图标
  'iconURI="../media/category/motion.png" showStatusButton="true">' +
  //  左移
  '<block type="motion_moveleft" id="motion_moveleft">' +
  '<value name="STEPS">' +
  '<shadow type="math_number">' +
  '<field name="NUM">9</field>' +
  "</shadow>" +
  "</value>" +
  '<value name="SECS">' +
  '<shadow type="math_number">' +
  '<field name="NUM">1</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  // 右移
  '<block type="motion_moveright" id="motion_moveright">' +
  '<value name="STEPS">' +
  '<shadow type="math_number">' +
  '<field name="NUM">9</field>' +
  "</shadow>" +
  "</value>" +
  '<value name="SECS">' +
  '<shadow type="math_number">' +
  '<field name="NUM">1</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  // 上移
  '<block type="motion_moveup" id="motion_moveup">' +
  '<value name="STEPS">' +
  '<shadow type="math_number">' +
  '<field name="NUM">9</field>' +
  "</shadow>" +
  "</value>" +
  '<value name="SECS">' +
  '<shadow type="math_number">' +
  '<field name="NUM">1</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  // 下移
  '<block type="motion_movedown" id="motion_movedown">' +
  '<value name="STEPS">' +
  '<shadow type="math_number">' +
  '<field name="NUM">9</field>' +
  "</shadow>" +
  "</value>" +
  '<value name="SECS">' +
  '<shadow type="math_number">' +
  '<field name="NUM">1</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  // 左转
  '<block type="motion_turnleft" id="motion_turnleft">' +
  '<value name="DEGREES">' +
  '<shadow type="math_number">' +
  '<field name="NUM">15</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  // 右转
  '<block type="motion_turnright" id="motion_turnright">' +
  '<value name="DEGREES">' +
  '<shadow type="math_number">' +
  '<field name="NUM">15</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  // 跳跃
  '<block type="motion_jump" id="motion_jump">' +
  '<value name="HEIGHT">' +
  '<shadow type="math_number">' +
  '<field name="NUM">9</field>' +
  "</shadow>" +
  "</value>" +
  '<value name="SECS">' +
  '<shadow type="math_number">' +
  '<field name="NUM">1</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  // 位置重置
  '<block type="motion_movereset" id="motion_movereset"></block>' +
  "</category>" +
  //  外观分类
  '<category name="%{BKY_CATEGORY_LOOKS}" id="looks" colour="#9966FF" secondaryColour="#774DCB" iconURI="../media/category/looks.png" showStatusButton="true">' +
  '<block type="looks_show" id="looks_show"></block>' +
  '<block type="looks_hide" id="looks_hide"></block>' +
  '<block type="looks_zoomout" id="looks_zoomout"></block>' +
  '<block type="looks_zoomin" id="looks_zoomin"></block>' +
  '<block type="looks_zoomreset" id="looks_zoomreset"></block>' +
  '<block type="looks_switchbackdropto" id="looks_switchbackdropto">' +
  '<value name="BACKDROP">' +
  '<shadow type="looks_backdrops"></shadow>' +
  "</value>" +
  "</block>" +
  "</category>" +
  //  声音分类
  '<category name="%{BKY_CATEGORY_SOUND}" id="sound" colour="#D65CD6" secondaryColour="#BD42BD" iconURI="../media/category/sound.png" showStatusButton="true">' +
  '<block type="sound_play" id="sound_play">' +
  '<value name="SOUND_MENU">' +
  '<shadow type="sound_sounds_menu"></shadow>' +
  "</value>" +
  "</block>" +
  '<block type="sound_playuntildone" id="sound_playuntildone">' +
  '<value name="SOUND_MENU">' +
  '<shadow type="sound_sounds_menu"></shadow>' +
  "</value>" +
  "</block>" +
  '<block type="sound_stopallsounds" id="sound_stopallsounds"></block>' +
  '<block type="sound_changeeffectby" id="sound_changeeffectby">' +
  '<value name="VALUE">' +
  '<shadow type="math_number">' +
  '<field name="NUM">10</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="sound_seteffectto" id="sound_seteffectto">' +
  '<value name="VALUE">' +
  '<shadow type="math_number">' +
  '<field name="NUM">100</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="sound_cleareffects" id="sound_cleareffects"></block>' +
  '<block type="sound_changevolumeby" id="sound_changevolumeby">' +
  '<value name="VOLUME">' +
  '<shadow type="math_number">' +
  '<field name="NUM">-10</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="sound_setvolumeto" id="sound_setvolumeto">' +
  '<value name="VOLUME">' +
  '<shadow type="math_number">' +
  '<field name="NUM">100</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="sound_volume" id="sound_volume"></block>' +
  "</category>" +
  //  事件分类
  '<category name="%{BKY_CATEGORY_EVENTS}" id="events" colour="#FFD500" secondaryColour="#CC9900" iconURI="../media/category/events.png" showStatusButton="true">' +
  '<block type="event_whenflagclicked" id="event_whenflagclicked"></block>' +
  '<block type="event_whenthisspriteclicked" id="event_whenthisspriteclicked"></block>' +
  '<block type="event_whenbroadcastreceived" id="event_whenbroadcastreceived">' +
  "</block>" +
  '<block type="event_broadcast" id="event_broadcast">' +
  '<value name="BROADCAST_INPUT">' +
  '<shadow type="event_broadcast_menu"></shadow>' +
  "</value>" +
  "</block>" +
  "</category>" +
  //  控制分类
  '<category name="%{BKY_CATEGORY_CONTROL}" id="control" colour="#FFAB19" secondaryColour="#CF8B17" iconURI="../media/category/control.png" showStatusButton="true">' +
  '<block type="control_wait" id="control_wait">' +
  '<value name="DURATION">' +
  '<shadow type="math_positive_number">' +
  '<field name="NUM">1</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="control_repeat" id="control_repeat">' +
  '<value name="TIMES">' +
  '<shadow type="math_whole_number">' +
  '<field name="NUM">10</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="control_forever" id="control_forever"></block>' +
  '<block type="control_if" id="control_if"></block>' +
  '<block type="control_if_else" id="control_if_else"></block>' +
  "</category>" +
  // 侦测分类
  '<category name="%{BKY_CATEGORY_SENSING}" id="sensing" colour="#4CBFE6" secondaryColour="#2E8EB8">' +
  '<block type="sensing_touchingobject" id="sensing_touchingobject">' +
  '<value name="TOUCHINGOBJECTMENU">' +
  '<shadow type="sensing_touchingobjectmenu"></shadow>' +
  "</value>" +
  "</block>" +
  '<block type="sensing_touchingcolor" id="sensing_touchingcolor">' +
  '<value name="COLOR">' +
  '<shadow type="colour_picker"></shadow>' +
  "</value>" +
  "</block>" +
  '<block type="sensing_coloristouchingcolor" id="sensing_coloristouchingcolor">' +
  '<value name="COLOR">' +
  '<shadow type="colour_picker"></shadow>' +
  "</value>" +
  '<value name="COLOR2">' +
  '<shadow type="colour_picker"></shadow>' +
  "</value>" +
  "</block>" +
  '<block type="sensing_distanceto" id="sensing_distanceto">' +
  '<value name="DISTANCETOMENU">' +
  '<shadow type="sensing_distancetomenu"></shadow>' +
  "</value>" +
  "</block>" +
  '<block type="sensing_keypressed" id="sensing_keypressed">' +
  '<value name="KEY_OPTION">' +
  '<shadow type="sensing_keyoptions"></shadow>' +
  "</value>" +
  "</block>" +
  '<block type="sensing_mousedown" id="sensing_mousedown"></block>' +
  '<block type="sensing_mousex" id="sensing_mousex"></block>' +
  '<block type="sensing_mousey" id="sensing_mousey"></block>' +
  '<block type="sensing_setdragmode" id="sensing_setdragmode"></block>' +
  '<block type="sensing_loudness" id="sensing_loudness"></block>' +
  '<block type="sensing_timer" id="sensing_timer"></block>' +
  '<block type="sensing_resettimer" id="sensing_resettimer"></block>' +
  '<block type="sensing_of" id="sensing_of">' +
  '<value name="OBJECT">' +
  '<shadow type="sensing_of_object_menu"></shadow>' +
  "</value>" +
  "</block>" +
  '<block type="sensing_current" id="sensing_current"></block>' +
  '<block type="sensing_dayssince2000" id="sensing_dayssince2000"></block>' +
  "</category>" +
  //
  '<category name="%{BKY_CATEGORY_OPERATORS}" id="operators" colour="#40BF4A" secondaryColour="#389438">' +
  '<block type="operator_add" id="operator_add">' +
  '<value name="NUM1">' +
  '<shadow type="math_number">' +
  '<field name="NUM"></field>' +
  "</shadow>" +
  "</value>" +
  '<value name="NUM2">' +
  '<shadow type="math_number">' +
  '<field name="NUM"></field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="operator_subtract" id="operator_subtract">' +
  '<value name="NUM1">' +
  '<shadow type="math_number">' +
  '<field name="NUM"></field>' +
  "</shadow>" +
  "</value>" +
  '<value name="NUM2">' +
  '<shadow type="math_number">' +
  '<field name="NUM"></field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="operator_multiply" id="operator_multiply">' +
  '<value name="NUM1">' +
  '<shadow type="math_number">' +
  '<field name="NUM"></field>' +
  "</shadow>" +
  "</value>" +
  '<value name="NUM2">' +
  '<shadow type="math_number">' +
  '<field name="NUM"></field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="operator_divide" id="operator_divide">' +
  '<value name="NUM1">' +
  '<shadow type="math_number">' +
  '<field name="NUM"></field>' +
  "</shadow>" +
  "</value>" +
  '<value name="NUM2">' +
  '<shadow type="math_number">' +
  '<field name="NUM"></field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="operator_random" id="operator_random">' +
  '<value name="FROM">' +
  '<shadow type="math_number">' +
  '<field name="NUM">1</field>' +
  "</shadow>" +
  "</value>" +
  '<value name="TO">' +
  '<shadow type="math_number">' +
  '<field name="NUM">10</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="operator_lt" id="operator_lt">' +
  '<value name="OPERAND1">' +
  '<shadow type="text">' +
  '<field name="TEXT"></field>' +
  "</shadow>" +
  "</value>" +
  '<value name="OPERAND2">' +
  '<shadow type="text">' +
  '<field name="TEXT"></field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="operator_equals" id="operator_equals">' +
  '<value name="OPERAND1">' +
  '<shadow type="text">' +
  '<field name="TEXT"></field>' +
  "</shadow>" +
  "</value>" +
  '<value name="OPERAND2">' +
  '<shadow type="text">' +
  '<field name="TEXT"></field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="operator_gt" id="operator_gt">' +
  '<value name="OPERAND1">' +
  '<shadow type="text">' +
  '<field name="TEXT"></field>' +
  "</shadow>" +
  "</value>" +
  '<value name="OPERAND2">' +
  '<shadow type="text">' +
  '<field name="TEXT"></field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="operator_and" id="operator_and"></block>' +
  '<block type="operator_or" id="operator_or"></block>' +
  '<block type="operator_not" id="operator_not"></block>' +
  '<block type="operator_join" id="operator_join">' +
  '<value name="STRING1">' +
  '<shadow type="text">' +
  '<field name="TEXT">hello</field>' +
  "</shadow>" +
  "</value>" +
  '<value name="STRING2">' +
  '<shadow type="text">' +
  '<field name="TEXT">world</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="operator_letter_of" id="operator_letter_of">' +
  '<value name="LETTER">' +
  '<shadow type="math_whole_number">' +
  '<field name="NUM">1</field>' +
  "</shadow>" +
  "</value>" +
  '<value name="STRING">' +
  '<shadow type="text">' +
  '<field name="TEXT">world</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="operator_length" id="operator_length">' +
  '<value name="STRING">' +
  '<shadow type="text">' +
  '<field name="TEXT">world</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="operator_contains" id="operator_contains">' +
  '<value name="STRING1">' +
  '<shadow type="text">' +
  '<field name="TEXT">hello</field>' +
  "</shadow>" +
  "</value>" +
  '<value name="STRING2">' +
  '<shadow type="text">' +
  '<field name="TEXT">world</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="operator_mod" id="operator_mod">' +
  '<value name="NUM1">' +
  '<shadow type="math_number">' +
  '<field name="NUM"></field>' +
  "</shadow>" +
  "</value>" +
  '<value name="NUM2">' +
  '<shadow type="math_number">' +
  '<field name="NUM"></field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="operator_round" id="operator_round">' +
  '<value name="NUM">' +
  '<shadow type="math_number">' +
  '<field name="NUM"></field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="operator_mathop" id="operator_mathop">' +
  '<value name="NUM">' +
  '<shadow type="math_number">' +
  '<field name="NUM"></field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  "</category>" +
  //
  '<category name="%{BKY_CATEGORY_VARIABLES}" id="data" colour="#FF8C1A" secondaryColour="#DB6E00" custom="VARIABLE">' +
  "</category>" +
  '<category name="%{BKY_CATEGORY_MYBLOCKS}" id="more" colour="#FF6680" secondaryColour="#FF4D6A" custom="PROCEDURE">' +
  "</category>" +
  // 扩展分类
  '<category name="Extensions" id="extensions" colour="#FF6680" secondaryColour="#FF4D6A" ' +
  'iconURI="../media/extensions/wedo2-block-icon.svg" showStatusButton="true">' +
  '<block type="extension_pen_down" id="extension_pen_down"></block>' +
  '<block type="extension_music_drum" id="extension_music_drum">' +
  '<value name="NUMBER">' +
  '<shadow type="math_number">' +
  '<field name="NUM">1</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="extension_wedo_motor" id="extension_wedo_motor"></block>' +
  '<block type="extension_wedo_hat" id="extension_wedo_hat"></block>' +
  '<block type="extension_wedo_boolean" id="extension_wedo_boolean"></block>' +
  '<block type="extension_wedo_tilt_reporter" id="extension_wedo_reporter">' +
  '<value name="TILT">' +
  '<shadow type="extension_wedo_tilt_menu"></shadow>' +
  "</value>" +
  "</block>" +
  '<block type="extension_music_reporter" id="extension_music_reporter"></block>' +
  '<block type="extension_microbit_display" id="extension_microbit_display">' +
  '<value name="MATRIX">' +
  '<shadow type="matrix">' +
  '<field name="MATRIX">0101010101100010101000100</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  '<block type="extension_music_play_note" id="extension_music_play_note">' +
  '<value name="NOTE">' +
  '<shadow type="note">' +
  '<field name="NOTE">60</field>' +
  "</shadow>" +
  "</value>" +
  '<value name="BEATS">' +
  '<shadow type="math_number">' +
  '<field name="NUM">0.25</field>' +
  "</shadow>" +
  "</value>" +
  "</block>" +
  "</category>" +
  // 绘画分类
  '<category name="%{BKY_CATEGORY_PEN}" id="pen" colour="#0FBD8C" secondaryColour="#0DA57A" iconURI="../media/category/pen.png">' +
  '<block type="pen_clear"></block>' +
  '<block type="pen_down"></block>' +
  '<block type="pen_up"></block>' +
  '<block type="pen_setcolorto">' +
  '<value name="COLOR">' +
  '<shadow type="colour_picker"></shadow>' +
  "</value>" +
  "</block>" +
  "</category>" +
  //  音乐分类
  // '<category name="%{BKY_CATEGORY_MUSIC}" id="music" colour="#0FBD8C" secondaryColour="#0DA57A" iconURI="../media/music.svg">' +
  // '<block type="music_playDrumForBeats">' +
  // // ' <value name="DRUM">' +
  // // '<shadow type="music_menu_DRUM">' +
  // // ' <field name="DRUM">1</field>' +
  // // "</shadow>" +
  // // "</value>" +
  // // '<value name="BEATS">' +
  // // '<shadow type="math_number">' +
  // // '<field name="NUM"> 0.25 </field>' +
  // // " </shadow>" +
  // // "</value>" +
  // "</block>" +
  // "</category>" +
  "</xml>";
