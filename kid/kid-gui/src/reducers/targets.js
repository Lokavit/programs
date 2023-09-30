const HIGHLIGHT_TARGET = "pro-gui/targets/HIGHLIGHT_TARGET";

const initialState = {
  sprites: {},
  stage: {},
  highlightedTargetId: null,
  highlightedTargetTime: null,
};

const reducer = function (state, action) {
  if (typeof state === "undefined") state = initialState;
  switch (action.type) {
    case HIGHLIGHT_TARGET:
      return Object.assign({}, state, {
        highlightedTargetId: action.targetId,
        highlightedTargetTime: action.updateTime,
      });
    default:
      return state;
  }
};

const highlightTarget = function (targetId) {
  console.log("highlightTarget:", targetId);
  return {
    type: HIGHLIGHT_TARGET,
    targetId: targetId,
    updateTime: Date.now(),
  };
};
export {
  reducer as default,
  initialState as targetsInitialState,
  highlightTarget,
};
