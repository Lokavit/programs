/*
 * @Author: Satya
 * @Date: 2020-06-15 09:14:49
 * @Last Modified by: Satya
 * @Last Modified time: 2020-06-15 09:22:06
 * doc:触摸处理类
 */

"use strict";

/**
 * @name Blockly.Touch
 * @namespace
 **/
goog.provide("Blockly.Touch");

goog.require("goog.events");
goog.require("goog.events.BrowserFeature");
goog.require("goog.string");

/**
 * 目前正在关注哪些触摸事件?
 * @type {DOMString}
 * @private
 */
Blockly.Touch.touchIdentifier_ = null;

/**
 * The TOUCH_MAP lookup dictionary specifies additional touch events to fire,
 * in conjunction with mouse events.
 * @type {Object}
 */
Blockly.Touch.TOUCH_MAP = {};
if (goog.events.BrowserFeature.TOUCH_ENABLED) {
  Blockly.Touch.TOUCH_MAP = {
    mousedown: ["touchstart"],
    mousemove: ["touchmove"],
    mouseup: ["touchend", "touchcancel"],
  };
}

/**
 * PID of queued long-press task.
 * @private
 */
Blockly.longPid_ = 0;

/**
 * 长按事件开始 长按可激活触摸设备上的上下文菜单.
 * 不幸的是，当前仅在2015年支持contextmenu触摸事件。 在任何touchstart事件上都会触发此函数，将任务排队，大约一秒钟后将打开上下文菜单。 如果触摸事件提前终止，则任务将被终止
 * @param {!Event} e 触摸开始事件.
 * @param {Blockly.Gesture} gesture 触发此longStart的手势.
 * @private
 */
Blockly.longStart_ = function (e, gesture) {
  Blockly.longStop_();
  // 平移多点触控事件.
  if (e.changedTouches.length != 1) {
    return;
  }
  Blockly.longPid_ = setTimeout(function () {
    e.button = 2; // 模拟右键单击.
    // e是触摸事件。 它需要假装是鼠标事件.
    e.clientX = e.changedTouches[0].clientX;
    e.clientY = e.changedTouches[0].clientY;

    // 让手势正确点击右键.
    if (gesture) {
      gesture.handleRightClick(e);
    }
  }, Blockly.LONGPRESS);
};

/**
 * Nope, that's not a long-press.  Either touchend or touchcancel was fired,
 * or a drag hath begun.  Kill the queued long-press task.
 * @private
 */
Blockly.longStop_ = function () {
  if (Blockly.longPid_) {
    clearTimeout(Blockly.longPid_);
    Blockly.longPid_ = 0;
  }
};

/**
 * Clear the touch identifier that tracks which touch stream to pay attention
 * to.  This ends the current drag/gesture and allows other pointers to be
 * captured.
 */
Blockly.Touch.clearTouchIdentifier = function () {
  Blockly.Touch.touchIdentifier_ = null;
};

/**
 * Decide whether Blockly should handle or ignore this event.
 * Mouse and touch events require special checks because we only want to deal
 * with one touch stream at a time.  All other events should always be handled.
 * @param {!Event} e The event to check.
 * @return {boolean} True if this event should be passed through to the
 *     registered handler; false if it should be blocked.
 */
Blockly.Touch.shouldHandleEvent = function (e) {
  return (
    !Blockly.Touch.isMouseOrTouchEvent(e) ||
    Blockly.Touch.checkTouchIdentifier(e)
  );
};

/**
 * Get the touch identifier from the given event.  If it was a mouse event, the
 * identifier is the string 'mouse'.
 * @param {!Event} e Mouse event or touch event.
 * @return {string} The touch identifier from the first changed touch, if
 *     defined.  Otherwise 'mouse'.
 */
Blockly.Touch.getTouchIdentifierFromEvent = function (e) {
  return e.changedTouches &&
    e.changedTouches[0] &&
    e.changedTouches[0].identifier != undefined &&
    e.changedTouches[0].identifier != null
    ? e.changedTouches[0].identifier
    : "mouse";
};

/**
 * Check whether the touch identifier on the event matches the current saved
 * identifier.  If there is no identifier, that means it's a mouse event and
 * we'll use the identifier "mouse".  This means we won't deal well with
 * multiple mice being used at the same time.  That seems okay.
 * If the current identifier was unset, save the identifier from the
 * event.  This starts a drag/gesture, during which touch events with other
 * identifiers will be silently ignored.
 * @param {!Event} e Mouse event or touch event.
 * @return {boolean} Whether the identifier on the event matches the current
 *     saved identifier.
 */
Blockly.Touch.checkTouchIdentifier = function (e) {
  var identifier = Blockly.Touch.getTouchIdentifierFromEvent(e);

  // if (Blockly.touchIdentifier_ )is insufficient because Android touch
  // identifiers may be zero.
  if (
    Blockly.Touch.touchIdentifier_ != undefined &&
    Blockly.Touch.touchIdentifier_ != null
  ) {
    // We're already tracking some touch/mouse event.  Is this from the same
    // source?
    return Blockly.Touch.touchIdentifier_ == identifier;
  }
  if (e.type == "mousedown" || e.type == "touchstart") {
    // No identifier set yet, and this is the start of a drag.  Set it and
    // return.
    Blockly.Touch.touchIdentifier_ = identifier;
    return true;
  }
  // There was no identifier yet, but this wasn't a start event so we're going
  // to ignore it.  This probably means that another drag finished while this
  // pointer was down.
  return false;
};

/**
 * Set an event's clientX and clientY from its first changed touch.  Use this to
 * make a touch event work in a mouse event handler.
 * @param {!Event} e A touch event.
 */
Blockly.Touch.setClientFromTouch = function (e) {
  if (Blockly.utils.startsWith(e.type, "touch")) {
    // Map the touch event's properties to the event.
    var touchPoint = e.changedTouches[0];
    e.clientX = touchPoint.clientX;
    e.clientY = touchPoint.clientY;
  }
};

/**
 * Check whether a given event is a mouse or touch event.
 * @param {!Event} e An event.
 * @return {boolean} true if it is a mouse or touch event; false otherwise.
 */
Blockly.Touch.isMouseOrTouchEvent = function (e) {
  return (
    Blockly.utils.startsWith(e.type, "touch") ||
    Blockly.utils.startsWith(e.type, "mouse")
  );
};

/**
 * Split an event into an array of events, one per changed touch or mouse
 * point.
 * @param {!Event} e A mouse event or a touch event with one or more changed
 * touches.
 * @return {!Array.<!Event>} An array of mouse or touch events.  Each touch
 *     event will have exactly one changed touch.
 */
Blockly.Touch.splitEventByTouches = function (e) {
  var events = [];
  if (e.changedTouches) {
    for (var i = 0; i < e.changedTouches.length; i++) {
      var newEvent = {
        type: e.type,
        changedTouches: [e.changedTouches[i]],
        target: e.target,
        stopPropagation: function () {
          e.stopPropagation();
        },
        preventDefault: function () {
          e.preventDefault();
        },
      };
      events[i] = newEvent;
    }
  } else {
    events.push(e);
  }
  return events;
};
