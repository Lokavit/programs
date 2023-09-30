/**
 * see:https://opendocs.alipay.com/iot/multi-platform/nkvi9p
 * 在所有需要用到按键的 Page.js 开头加上 import, 并实现关键方法 onKeyPress。（如index.js页面中的使用）
 * 按上述实现，所有按键的事件就会随着页面自动分配，可以避免出现重复注册或未注册的问题
 * 
 * 官方API上直接搬过来。
 */
export default class ix {
  static Page(page) {
    const onLoadRaw = page.onLoad;
    page.onLoad = (...args) => {
      const page = getCurrentPages().slice(-1)[0];
      if (page && page.onKeyPress instanceof Function) {
        ['onShow', 'onHide', 'onUnload'].forEach((f) => {
          const raw = page[f];
          page[f] = (...args) => {
            if (f === 'onShow') {
              if (!page._keyEventListener) {
                my.ix.onKeyEventChange(page._keyEventListener = (r) => {
                  page.onKeyPress.call(page, r);
                });
              }
            } else if (f === 'onHide' || f === 'onUnload') {
              if (page._keyEventListener) {
                my.ix.offKeyEventChange(page._keyEventListener);
                page._keyEventListener = null;
              }
            }
            if (raw instanceof Function)
              raw.call(page, ...args);
          };
        });
        if (onLoadRaw instanceof Function)
          onLoadRaw.call(page, ...args);
      }
    };
    return Page(page);
  }
}