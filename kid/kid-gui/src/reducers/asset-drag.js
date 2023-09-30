const DRAG_UPDATE = "pro-gui/asset-drag/DRAG_UPDATE";

const initialState = {
  dragging: false,
  currentOffset: null,
  img: null,
};

const reducer = function (state, action) {
  if (typeof state === "undefined") state = initialState;

  switch (action.type) {
    case DRAG_UPDATE:
      return Object.assign({}, state, action.state);
    default:
      return state;
  }
};

const updateAssetDrag = function (state) {
  console.log("更新资产拖动:", state);
  return {
    type: DRAG_UPDATE,
    state: state,
  };
};

export {
  reducer as default,
  initialState as assetDragInitialState,
  updateAssetDrag,
};
