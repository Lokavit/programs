const UPDATE_TOOLBOX = "pro-gui/toolbox/UPDATE_TOOLBOX";
// import makeToolboxXML from "../lib/make-toolbox-xml";

const initialState = {
  // toolboxXML: makeToolboxXML(true),
  toolboxXML: MAKE_TOOLBOX_XML(true),
};

const reducer = function (state, action) {
  if (typeof state === "undefined") state = initialState;
  switch (action.type) {
    case UPDATE_TOOLBOX:
      return Object.assign({}, state, {
        toolboxXML: action.toolboxXML,
      });
    default:
      return state;
  }
};

const updateToolbox = function (toolboxXML) {
  return {
    type: UPDATE_TOOLBOX,
    toolboxXML: toolboxXML,
  };
};

export {
  reducer as default,
  initialState as toolboxInitialState,
  updateToolbox,
};
