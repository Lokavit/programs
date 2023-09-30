const SET_HOVERED_SPRITE = "pro-gui/hovered-target/SET_HOVERED_SPRITE";
const SET_RECEIVED_BLOCKS = "pro-gui/hovered-target/SET_RECEIVED_BLOCKS";

const initialState = {
  sprite: null,
  receivedBlocks: false,
};

const reducer = function (state, action) {
  if (typeof state === "undefined") state = initialState;
  switch (action.type) {
    case SET_HOVERED_SPRITE:
      return {
        sprite: action.spriteId,
        receivedBlocks: false,
      };
    case SET_RECEIVED_BLOCKS:
      return {
        sprite: state.sprite,
        receivedBlocks: action.receivedBlocks,
      };
    default:
      return state;
  }
};

const setHoveredSprite = function (spriteId) {
  console.log("设置悬停精灵:", spriteId);
  return {
    type: SET_HOVERED_SPRITE,
    spriteId: spriteId,
    meta: {
      throttle: 30,
    },
  };
};

// const setReceivedBlocks = function (receivedBlocks) {
//   console.log("设置接收块:", receivedBlocks);
//   return {
//     type: SET_RECEIVED_BLOCKS,
//     receivedBlocks: receivedBlocks,
//   };
// };

export {
  reducer as default,
  initialState as hoveredTargetInitialState,
  setHoveredSprite,
  // setReceivedBlocks,
};
