// /*
//  * @Author: Satya
//  * @Date: 2020-11-20 11:02:20
//  * @Last Modified by: Satya
//  * @Last Modified time: 2020-11-20 16:54:11
//  * doc: 由于KidBlocks编辑器中的操作而触发的事件
//  */

// const EVENTS_CONSTANTS = Object.freeze({
//   /** @const 创建块的事件的名称 */
//   CREATE: "create",
//   /** @const 删除块的事件名称 */
//   DELETE: "delete",
//   /** @const 更改块的事件名称 */
//   CHANGE: "change",
//   /** @const 移动块的事件的名称 */
//   MOVE: "move",
//   /** @const 创建变量的事件的名称 */
//   VAR_CREATE: "var_create",
//   /** @const 删除变量的事件的名称 */
//   VAR_DELETE: "var_delete",
//   /** @const 重命名变量的事件名称 */
//   VAR_RENAME: "var_rename",
//   /** @const 记录用户界面更改的事件的名称 */
//   UI: "ui",
//   /** @const 创建注释的事件名称 */
//   COMMENT_CREATE: "comment_create",
//   /** @const 删除注释的事件名称 */
//   COMMENT_DELETE: "comment_delete",
//   /** @const 变更注释的事件名称 */
//   COMMENT_CHANGE: "comment_change",
//   /** @const 移动注释的事件名称 */
//   COMMENT_MOVE: "comment_move",
//   /** @const 记录工作区负载的事件的名称 */
//   FINISHED_LOADING: "finished_loading",
// });

// const Events = {
//   /** 事件常量解构 */
//   ...EVENTS_CONSTANTS,
//   /** @description 展开又收缩至左侧的事件(用于不可移动的工作区) */
//   BUMP_EVENTS: [
//     EVENTS_CONSTANTS.CREATE,
//     EVENTS_CONSTANTS.MOVE,
//     EVENTS_CONSTANTS.COMMENT_CREATE,
//     EVENTS_CONSTANTS.COMMENT_MOVE,
//   ],
//   /** @description 新事件的组ID.分组事件是不可分割的. */
//   _group: "",
//   /** @description 设置是否将下一个事件添加到撤消堆栈中 */
//   recordUndo: true,
//   /** @description 允许创建和触发更改事件 */
//   _disabled: 0,
//   /** @description 排队等待触发的事件列表 */
//   _FIRE_QUEUE: [],

//   /**
//    * @function 停止发送事件
//    * @description 每次对此功能的调用都必须同时调用enables
//    */
//   disable: function () {
//     console.warn("停止发送事件。");
//     Events._disabled++;
//   },

//   /**
//    * @function 开始发送事件.
//    * @description 除非在进行相应的禁用调用时已经禁用了事件.
//    */
//   enable: function () {
//     console.warn("开始发送事件。");
//     Events._disabled--;
//   },

//   /**
//    * @function 返回事件是否可以触发
//    */
//   isEnabled: function () {
//     console.warn("返回事件是否可以触发");
//     return Events.disabled_ == 0;
//   },

//   /**
//    * @function 筛选排队的事件并合并重复项
//    * @param {*} queueIn 事件数组
//    * @param {*} forward 如果向前 (redo)则为true, 如果向后(undo)则为false
//    * @return { } 过滤事件数组
//    */
//   filter: function (queueIn, forward) {
//     // console.log("筛选排队的事件并合并重复项");
//     var queue = queueIn.slice(); // 队列的浅副本.
//     // Undo 撤消以相反的顺序合并.
//     if (!forward) queue.reverse();

//     var mergedQueue = [];
//     var hash = Object.create(null);
//     // 合并重复项.
//     for (var i = 0, event; (event = queue[i]); i++) {
//       if (!event.isNull()) {
//         var key = [event.type, event.blockId, event.workspaceId].join(" ");

//         var lastEntry = hash[key];
//         var lastEvent = lastEntry ? lastEntry.event : null;
//         if (!lastEntry) {
//           // Each item in the hash table has the event and the index of that event
//           // in the input array.  This lets us make sure we only merge adjacent
//           // move events.
//           hash[key] = { event: event, index: i };
//           mergedQueue.push(event);
//         } else if (
//           event.type == EVENTS_CONSTANTS.MOVE &&
//           lastEntry.index == i - 1
//         ) {
//           // Merge move events.
//           lastEvent.newParentId = event.newParentId;
//           lastEvent.newInputName = event.newInputName;
//           lastEvent.newCoordinate = event.newCoordinate;
//           lastEntry.index = i;
//         } else if (
//           event.type == EVENTS_CONSTANTS.CHANGE &&
//           event.element == lastEvent.element &&
//           event.name == lastEvent.name
//         ) {
//           // Merge change events.
//           lastEvent.newValue = event.newValue;
//         } else if (
//           event.type == EVENTS_CONSTANTS.UI &&
//           event.element == "click" &&
//           (lastEvent.element == "commentOpen" ||
//             lastEvent.element == "mutatorOpen" ||
//             lastEvent.element == "warningOpen")
//         ) {
//           // Drop click events caused by opening/closing bubbles.
//         } else {
//           // Collision: newer events should merge into this event to maintain
//           // order.
//           hash[key] = { event: event, index: 1 };
//           mergedQueue.push(event);
//         }
//       }
//     }
//     // Filter out any events that have become null due to merging.
//     queue = mergedQueue.filter(function (e) {
//       return !e.isNull();
//     });
//     // Restore undo order.
//     if (!forward) queue.reverse();

//     // 将mutation事件移到队列顶部.故意跳过第一个事件.
//     for (var i = 1, event; (event = queue[i]); i++) {
//       if (event.type == EVENTS_CONSTANTS.CHANGE && event.element == "mutation")
//         queue.unshift(queue.splice(i, 1)[0]);
//     }
//     return queue;
//   },

//   /**
//    * @function 修改挂起的撤消事件，以便在触发事件时不会将它们降落在撤消堆栈中。
//    * @description 由KidBlocks.Workspace.clearUndo调用.
//    */
//   clearPendingUndo: function () {
//     // console.log("修改挂起的撤消事件，以便在触发事件时不会将它们降落在撤消堆栈中");
//     for (var i = 0, event; (event = Events._FIRE_QUEUE[i]); i++) {
//       event.recordUndo = false;
//     }
//   },

//   /** @function 当前组 */
//   getGroup: function () {
//     // console.log("当前组");
//     return Events._group;
//   },

//   /**
//    * 开始或停止群组
//    * @param {*} state True 开始新组，false 结束组
//    */
//   setGroup: function (state) {
//     // console.log("开始或停止群组");
//     Events._group =
//       typeof state == "boolean"
//         ? state
//           ? KidBlocks.utils.genUid()
//           : ""
//         : state;

//     // if (typeof state == "boolean") {
//     //   Events._group = state ? KidBlocks.utils.genUid() : "";
//     // } else {
//     //   Events._group = state;
//     // }
//   },

//   /**
//    * 计算指定块及其所有后代的ID列表.
//    * @param {!Blockly.Block} block The root block.
//    * @return {!Array.<string>} List of block IDs.
//    * @package
//    */
//   getDescendantIds: function (block) {
//     // console.log("计算指定块及其所有后代的ID列表");
//     let ids = [];
//     let descendants = block.getDescendants(false);
//     for (let i = 0, descendant; (descendant = descendants[i]); i++) {
//       ids[i] = descendant.id;
//     }
//     return ids;
//   },

//   /**
//    * 将JSON解码为事件.
//    * @param {!Object} json JSON representation.
//    * @param {!KidBlocks.Workspace} workspace Target workspace for event.
//    * @return {!KidBlocks.Events.Abstract} JSON表示的事件.
//    * @throws {Error} if an event type is not found in the registry.
//    */
//   fromJson: function (json, workspace) {
//     // console.log("event fromJson", json);
//     let eventClass = KidBlocks.registry.getClass(
//       KidBlocks.registry.EVENT,
//       json.type
//     );

//     if (!eventClass) throw Error("Unknown event type.");

//     let event = new eventClass();
//     event.fromJson(json);
//     event.workspaceId = workspace.id;
//     return event;
//   },
// };
