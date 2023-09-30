const ADD_MONITOR_RECT = "pro-gui/monitors/ADD_MONITOR_RECT";
const MOVE_MONITOR_RECT = "pro-gui/monitors/MOVE_MONITOR_RECT";
const RESIZE_MONITOR_RECT = "pro-gui/monitors/RESIZE_MONITOR_RECT";
const REMOVE_MONITOR_RECT = "pro-gui/monitors/REMOVE_MONITOR_RECT";

const initialState = {
  monitors: {},
  savedMonitorPositions: {},
};

// Verify that the rectangle formed by the 2 points is well-formed
const _verifyRect = function (upperStart, lowerEnd) {
  if (
    isNaN(upperStart.x) ||
    isNaN(upperStart.y) ||
    isNaN(lowerEnd.x) ||
    isNaN(lowerEnd.y)
  ) {
    return false;
  }
  if (!(upperStart.x < lowerEnd.x)) {
    return false;
  }
  if (!(upperStart.y < lowerEnd.y)) {
    return false;
  }
  return true;
};

const _addMonitorRect = function (state, action) {
  if (state.monitors.hasOwnProperty(action.monitorId)) {
    console.error(
      `Can't add monitor, monitor with id ${action.monitorId} already exists.`
    );
    return state;
  }
  if (!_verifyRect(action.upperStart, action.lowerEnd)) {
    console.error(`Monitor rectangle not formatted correctly`);
    return state;
  }
  return {
    monitors: Object.assign({}, state.monitors, {
      [action.monitorId]: {
        upperStart: action.upperStart,
        lowerEnd: action.lowerEnd,
      },
    }),
    savedMonitorPositions: action.savePosition
      ? Object.assign({}, state.savedMonitorPositions, {
          [action.monitorId]: {
            x: action.upperStart.x,
            y: action.upperStart.y,
          },
        })
      : state.savedMonitorPositions,
  };
};

const _moveMonitorRect = function (state, action) {
  if (!state.monitors.hasOwnProperty(action.monitorId)) {
    console.error(
      `Can't move monitor, monitor with id ${action.monitorId} does not exist.`
    );
    return state;
  }
  if (isNaN(action.newX) || isNaN(action.newY)) {
    console.error(`Monitor rectangle not formatted correctly`);
    return state;
  }

  const oldMonitor = state.monitors[action.monitorId];
  if (
    oldMonitor.upperStart.x === action.newX &&
    oldMonitor.upperStart.y === action.newY
  ) {
    // Hasn't moved
    return state;
  }
  const monitorWidth = oldMonitor.lowerEnd.x - oldMonitor.upperStart.x;
  const monitorHeight = oldMonitor.lowerEnd.y - oldMonitor.upperStart.y;
  return {
    monitors: Object.assign({}, state.monitors, {
      [action.monitorId]: {
        upperStart: { x: action.newX, y: action.newY },
        lowerEnd: {
          x: action.newX + monitorWidth,
          y: action.newY + monitorHeight,
        },
      },
    }),
    // User generated position is saved
    savedMonitorPositions: Object.assign({}, state.savedMonitorPositions, {
      [action.monitorId]: { x: action.newX, y: action.newY },
    }),
  };
};

const _resizeMonitorRect = function (state, action) {
  if (!state.monitors.hasOwnProperty(action.monitorId)) {
    console.error(
      `Can't resize monitor, monitor with id ${action.monitorId} does not exist.`
    );
    return state;
  }
  if (
    isNaN(action.newWidth) ||
    isNaN(action.newHeight) ||
    action.newWidth <= 0 ||
    action.newHeight <= 0
  ) {
    console.error(`Monitor rectangle not formatted correctly`);
    return state;
  }

  const oldMonitor = state.monitors[action.monitorId];
  const newMonitor = {
    upperStart: oldMonitor.upperStart,
    lowerEnd: {
      x: oldMonitor.upperStart.x + action.newWidth,
      y: oldMonitor.upperStart.y + action.newHeight,
    },
  };
  if (
    newMonitor.lowerEnd.x === oldMonitor.lowerEnd.x &&
    newMonitor.lowerEnd.y === oldMonitor.lowerEnd.y
  ) {
    // no change
    return state;
  }

  return {
    monitors: Object.assign({}, state.monitors, {
      [action.monitorId]: newMonitor,
    }),
    savedMonitorPositions: state.savedMonitorPositions,
  };
};

const _removeMonitorRect = function (state, action) {
  if (!state.monitors.hasOwnProperty(action.monitorId)) {
    console.error(
      `Can't remove monitor, monitor with id ${action.monitorId} does not exist.`
    );
    return state;
  }

  const newMonitors = Object.assign({}, state.monitors);
  delete newMonitors[action.monitorId];
  return {
    monitors: newMonitors,
    savedMonitorPositions: state.savedMonitorPositions,
  };
};

const reducer = function (state, action) {
  if (typeof state === "undefined") state = initialState;
  switch (action.type) {
    case ADD_MONITOR_RECT:
      return _addMonitorRect(state, action);
    case MOVE_MONITOR_RECT:
      return _moveMonitorRect(state, action);
    case RESIZE_MONITOR_RECT:
      return _resizeMonitorRect(state, action);
    case REMOVE_MONITOR_RECT:
      return _removeMonitorRect(state, action);
    default:
      return state;
  }
};

// Init position --------------------------
const PADDING = 1;
// @todo fix these numbers when we fix https://github.com/LLK/scratch-gui/issues/980
const SCREEN_WIDTH = 40;
const SCREEN_HEIGHT = 30;
// 屏幕边缘缓冲
const SCREEN_EDGE_BUFFER = 4;

const _rectsIntersect = function (rect1, rect2) {
  // If one rectangle is on left side of other
  if (
    rect1.upperStart.x >= rect2.lowerEnd.x ||
    rect2.upperStart.x >= rect1.lowerEnd.x
  )
    return false;
  // If one rectangle is above other
  if (
    rect1.upperStart.y >= rect2.lowerEnd.y ||
    rect2.upperStart.y >= rect1.lowerEnd.y
  )
    return false;
  return true;
};

// 我们需要放置具有给定宽度和高度的监视器。 返回一个rect定义应该放置在哪里.
const getInitialPosition = function (state, monitorId, eltWidth, eltHeight) {
  // 如果此监视器之前有意移动到了某个位置，请放回该位置
  if (state.savedMonitorPositions.hasOwnProperty(monitorId)) {
    const saved = state.savedMonitorPositions[monitorId];
    return {
      upperStart: saved,
      lowerEnd: { x: saved.x + eltWidth, y: saved.y + eltHeight },
    };
  }

  // Try all starting positions for the new monitor to find one that doesn't intersect others
  const endXs = [0];
  const endYs = [0];
  let lastX = null;
  let lastY = null;
  for (const monitor in state.monitors) {
    let x = state.monitors[monitor].lowerEnd.x;
    x = Math.ceil(x / 50) * 50; // Try to choose a sensible "tab width" so more monitors line up
    endXs.push(x);
    endYs.push(Math.ceil(state.monitors[monitor].lowerEnd.y));
  }
  endXs.sort((a, b) => a - b);
  endYs.sort((a, b) => a - b);
  // We'll use plan B if the monitor doesn't fit anywhere (too long or tall)
  let planB = null;
  for (const x of endXs) {
    if (x === lastX) {
      continue;
    }
    lastX = x;
    outer: for (const y of endYs) {
      if (y === lastY) {
        continue;
      }
      lastY = y;
      const monitorRect = {
        upperStart: { x: x + PADDING, y: y + PADDING },
        lowerEnd: { x: x + PADDING + eltWidth, y: y + PADDING + eltHeight },
      };
      // Intersection testing rect that includes padding
      const rect = {
        upperStart: { x, y },
        lowerEnd: {
          x: x + eltWidth + 2 * PADDING,
          y: y + eltHeight + 2 * PADDING,
        },
      };
      for (const monitor in state.monitors) {
        if (_rectsIntersect(state.monitors[monitor], rect)) {
          continue outer;
        }
      }
      // 如果矩形重叠在屏幕的两端
      if (rect.lowerEnd.x > SCREEN_WIDTH || rect.lowerEnd.y > SCREEN_HEIGHT) {
        // 如果rect不太接近完全关闭屏幕，请将其设置为计划B
        if (
          !planB &&
          !(
            rect.upperStart.x + SCREEN_EDGE_BUFFER > SCREEN_WIDTH ||
            rect.upperStart.y + SCREEN_EDGE_BUFFER > SCREEN_HEIGHT
          )
        ) {
          planB = monitorRect;
        }
        continue;
      }
      return monitorRect;
    }
  }
  // If the monitor is too long to fit anywhere, put it in the leftmost spot available
  // that intersects the right or bottom edge and isn't too close to the edge.
  if (planB) {
    return planB;
  }

  // 如果计划B失败并且没有合理的放置位置，则计划C将随机放置监视器
  const randX = Math.ceil(Math.random() * (SCREEN_WIDTH / 2));
  const randY = Math.ceil(Math.random() * (SCREEN_HEIGHT - SCREEN_EDGE_BUFFER));
  return {
    upperStart: {
      x: randX,
      y: randY,
    },
    lowerEnd: {
      x: randX + eltWidth,
      y: randY + eltHeight,
    },
  };
};

// Action creators ------------------------
/**
 * @param {!string} monitorId Id to add
 * @param {!object} upperStart upper point defining the rectangle
 * @param {!number} upperStart.x X of top point that defines the monitor location
 * @param {!number} upperStart.y Y of top point that defines the monitor location
 * @param {!object} lowerEnd lower point defining the rectangle
 * @param {!number} lowerEnd.x X of bottom point that defines the monitor location
 * @param {!number} lowerEnd.y Y of bottom point that defines the monitor location
 * @param {?boolean} savePosition True if the placement should be saved when adding the monitor
 * @returns {object} action to add a new monitor at the location
 */
const addMonitorRect = function (
  monitorId,
  upperStart,
  lowerEnd,
  savePosition
) {
  return {
    type: ADD_MONITOR_RECT,
    monitorId: monitorId,
    upperStart: upperStart,
    lowerEnd: lowerEnd,
    savePosition: savePosition,
  };
};

/**
 * @param {!string} monitorId Id for monitor to move
 * @param {!number} newX X of top point that defines the monitor location
 * @param {!number} newY Y of top point that defines the monitor location
 * @returns {object} action to move an existing monitor to the location
 */
const moveMonitorRect = function (monitorId, newX, newY) {
  return {
    type: MOVE_MONITOR_RECT,
    monitorId: monitorId,
    newX: newX,
    newY: newY,
  };
};

/**
 * @param {!string} monitorId Id for monitor to resize
 * @param {!number} newWidth Width to set monitor to
 * @param {!number} newHeight Height to set monitor to
 * @returns {object} action to resize an existing monitor to the given dimensions
 */
const resizeMonitorRect = function (monitorId, newWidth, newHeight) {
  return {
    type: RESIZE_MONITOR_RECT,
    monitorId: monitorId,
    newWidth: newWidth,
    newHeight: newHeight,
  };
};

/**
 * @param {!string} monitorId Id for monitor to remove
 * @returns {object} action to remove an existing monitor
 */
const removeMonitorRect = function (monitorId) {
  return {
    type: REMOVE_MONITOR_RECT,
    monitorId: monitorId,
  };
};

export {
  reducer as default,
  initialState as monitorLayoutInitialState,
  addMonitorRect,
  getInitialPosition,
  moveMonitorRect,
  resizeMonitorRect,
  removeMonitorRect,
  PADDING,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
};
