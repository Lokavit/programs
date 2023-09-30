import React from "react";

/*高阶组件可限制对特定道具的更新.
 * 为什么？ 因为某些道具更新是昂贵的，并且需要限制.
 * 当其他属性发生变化时，这将允许渲染，并将使用道具的最后渲染值进行比较.
 * @param {string} propName 用于限制更新的道具名称.
 * @param {string} throttleTime 节流时间.更新该特定媒体资源的最短时间.
 * @returns {function} 接受要包装的组件的函数.
 */
const ThrottledPropertyHOC = function (propName, throttleTime) {
  /**
   * 用React组件调用以包装它的函数.
   * @param {React.Component} WrappedComponent - Component to wrap with throttler.
   * @returns {React.Component} the component wrapped with the throttler.
   */
  return function (WrappedComponent) {
    class ThrottledPropertyWrapper extends React.Component {
      shouldComponentUpdate(nextProps, nextState) {
        //组件是否需要更新，需要返回一个布尔值，返回true则更新，返回flase不更新，这是一个关键点
        for (const property in nextProps) {
          // 如果其他属性已更改，则始终更新
          if (
            property !== propName &&
            this.props[property] !== nextProps[property]
          )
            return true;
        }

        // 如果仅更改了该道具，则允许基于_lastRenderedTime和_lastRenderTime在render中更新的更新进行渲染.允许此更新进行渲染
        if (
          nextProps[propName] !== this._lastRenderedValue &&
          Date.now() - this._lastRenderTime > throttleTime
        )
          return true;

        return false;
      }
      render() {
        this._lastRenderTime = Date.now();
        this._lastRenderedValue = this.props[propName];
        return <WrappedComponent {...this.props} />;
      }
    }

    return ThrottledPropertyWrapper;
  };
};

export default ThrottledPropertyHOC;
