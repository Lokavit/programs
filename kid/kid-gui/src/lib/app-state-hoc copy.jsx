import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { createStore, combineReducers, compose } from "redux";

import localesReducer, {
  initLocale,
  localesInitialState,
} from "../reducers/locales";

import { setPlayer, setFullScreen } from "../reducers/mode.js";

import locales from "scratch-l10n";
import { detectLocale } from "./detect-locale";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

/*
 * Higher Order Component to provide redux state. If an `intl` prop is provided
 * it will override the internal `intl` redux state
 * @param {React.Component} WrappedComponent - component to provide state for
 * @param {boolean} localesOnly - 仅提供语言环境状态，而不提供GUI所需的所有内容。 仅在渲染模式而不是GUI时用于排除多余状态.
 * @returns {React.Component} component with redux and intl state provided
 */
const AppStateHOC = function (WrappedComponent, localesOnly) {
  class AppStateWrapper extends React.Component {
    constructor(props) {
      super(props);
      let initialState = {};
      let reducers = {};
      let enhancer;

      let initializedLocales = localesInitialState;

      // const locale = detectLocale(Object.keys(locales));
      const locale = document.documentElement.lang;
      console.log("locale:", locale);
      if (locale !== "en") {
        initializedLocales = initLocale(initializedLocales, locale);
      }
      if (localesOnly) {
        // 用于实例化不受支持的浏览器模式的最小状态
        reducers = { locales: localesReducer };
        initialState = { locales: initializedLocales };
        enhancer = composeEnhancers();
      } else {
        // 有必要避免导入不需要的代码，这些代码会使不受支持的浏览器崩溃.
        const guiRedux = require("../reducers/gui");
        const guiReducer = guiRedux.default;
        const {
          guiInitialState,
          guiMiddleware,
          initFullScreen,
          initPlayer,
        } = guiRedux;
        const { ScratchPaintReducer } = require("scratch-paint");

        let initializedGui = guiInitialState;
        if (props.isFullScreen || props.isPlayerOnly) {
          if (props.isFullScreen) {
            initializedGui = initFullScreen(initializedGui);
          }
          if (props.isPlayerOnly) {
            initializedGui = initPlayer(initializedGui);
          }
        }
        reducers = {
          locales: localesReducer,
          scratchGui: guiReducer,
          scratchPaint: ScratchPaintReducer,
        };
        initialState = {
          locales: initializedLocales,
          scratchGui: initializedGui,
        };
        enhancer = composeEnhancers(guiMiddleware);
      }
      const reducer = combineReducers(reducers);
      this.store = createStore(reducer, initialState, enhancer);
      console.log("this:", this);
    }
    componentDidUpdate(prevProps) {
      if (localesOnly) return;
      if (prevProps.isPlayerOnly !== this.props.isPlayerOnly) {
        this.store.dispatch(setPlayer(this.props.isPlayerOnly));
      }
      if (prevProps.isFullScreen !== this.props.isFullScreen) {
        this.store.dispatch(setFullScreen(this.props.isFullScreen));
      }
    }
    render() {
      const {
        isFullScreen, // eslint-disable-line no-unused-vars
        isPlayerOnly, // eslint-disable-line no-unused-vars
        ...componentProps
      } = this.props;
      return (
        <Provider store={this.store}>
          <WrappedComponent {...componentProps} />
        </Provider>
      );
    }
  }
  AppStateWrapper.propTypes = {
    isFullScreen: PropTypes.bool,
    isPlayerOnly: PropTypes.bool,
  };
  return AppStateWrapper;
};

export default AppStateHOC;
