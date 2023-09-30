import React from "react";
// import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { createStore, combineReducers, compose } from "redux";

// import { setPlayer, setFullScreen } from "../reducers/mode.js";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/*
 * Higher Order Component to provide redux state. If an `intl` prop is provided
 * it will override the internal `intl` redux state
 * @param {React.Component} WrappedComponent - component to provide state for
 * @param {boolean} localesOnly - 仅提供语言环境状态，而不提供GUI所需的所有内容。 仅在渲染模式而不是GUI时用于排除多余状态.
 * @returns {React.Component} component with redux and intl state provided
 */
const AppStateHOC = function (WrappedComponent) {
  class AppStateWrapper extends React.Component {
    constructor(props) {
      super(props);

      // 有必要避免导入不需要的代码，这些代码会使不受支持的浏览器崩溃.
      const guiRedux = require("../reducers/gui");
      const guiReducer = guiRedux.default;
      const { guiInitialState, guiMiddleware } = guiRedux;
      const { ScratchPaintReducer } = require("scratch-paint");

      let initializedGui = guiInitialState;

      this.store = createStore(
        combineReducers({
          scratchGui: guiReducer,
          scratchPaint: ScratchPaintReducer,
        }),
        {
          scratchGui: initializedGui,
        },
        composeEnhancers(guiMiddleware)
      );
      console.log("app-state-hoc.jsx this:", this);
    }
    componentDidUpdate(prevProps) {
      console.log("prevProps:", prevProps);
      console.log("this:", this);
    }
    render() {
      const { ...componentProps } = this.props;
      return (
        <Provider store={this.store}>
          <WrappedComponent {...componentProps} />
        </Provider>
      );
    }
  }
  return AppStateWrapper;
};

export default AppStateHOC;
