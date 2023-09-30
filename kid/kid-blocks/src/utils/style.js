/*
 * @Author: Satya
 * @Date: 2020-11-19 13:43:33
 * @Last Modified by: Satya
 * @Last Modified time: 2020-11-22 17:50:03
 * doc: 元素样式的实用工具
 */

const UtilStyle = {
  /**
   * @function 不显示时获取元素的高度和宽度
   * @param {*} element
   */
  _getSizeWithDisplay: function (element) {
    let offsetWidth = /** @type {!HTMLElement} */ (element).offsetWidth;
    let offsetHeight = /** @type {!HTMLElement} */ (element).offsetHeight;
    return new KidBlocks.utils.Size(offsetWidth, offsetHeight);
  },

  /**
   * @function 获取元素的高度和宽度
   * @param {*} element
   */
  getSize: function (element) {
    if (document.defaultView.getComputedStyle(element, "display") != "none")
      return UtilStyle._getSizeWithDisplay(element);

    // 使用临时元素评估大小.
    let style = element.style;
    let originalDisplay = style.display;
    let originalVisibility = style.visibility;
    let originalPosition = style.position;

    style.visibility = "hidden";
    style.position = "absolute";
    style.display = "inline";

    let offsetWidth = /** @type {!HTMLElement} */ (element).offsetWidth;
    let offsetHeight = /** @type {!HTMLElement} */ (element).offsetHeight;

    style.display = originalDisplay;
    style.position = originalPosition;
    style.visibility = originalVisibility;

    return new KidBlocks.utils.Size(offsetWidth, offsetHeight);
  },

  /**
   * 返回相对于HTML文档左上角的Coordinate(坐标及位置)对象
   * @param {*} el
   */
  getPageOffset: function (el) {
    let pos = new KidBlocks.utils.Coordinate(0, 0);
    let box = el.getBoundingClientRect();
    let documentElement = document.documentElement;
    // 必须添加滚动坐标以获得元素的绝对页面偏移量，因为getBoundingClientRect将相对坐标返回到视口.
    let scrollCoord = new KidBlocks.utils.Coordinate(
      window.pageXOffset || documentElement.scrollLeft,
      window.pageYOffset || documentElement.scrollTop
    );
    pos.x = box.left + scrollCoord.x;
    pos.y = box.top + scrollCoord.y;

    return pos;
  },

  /**
   * @function 计算相对于文档的视口坐标
   */
  getViewportPageOffset: function () {
    let body = document.body;
    let documentElement = document.documentElement;
    let scrollLeft = body.scrollLeft || documentElement.scrollLeft;
    let scrollTop = body.scrollTop || documentElement.scrollTop;
    return new KidBlocks.utils.Coordinate(scrollLeft, scrollTop);
  },

  /**
   * @function 显示或隐藏页面中的元素
   * @description 隐藏元素是通过将display属性设置为"none",然后将元素从呈现层次结构中删除.为了显示元素，将还原默认的继承显示属性（在样式表中或通过浏览器的默认样式规则定义）
   * @param {*} el
   * @param {*} isShown
   */
  setElementShown: function (el, isShown) {
    el.style.display = isShown ? "" : "none";
  },

  /**
   * @function 如果元素使用从右到左（RTL）方向，则返回true
   * @param {*} el
   */
  isRightToLeft: function (el) {
    return "rtl" == document.defaultView.getComputedStyle(el, "direction");
  },

  /**
   * @function 获取以像素为单位的计算出的边框宽度（在所有面上）
   * @param {*} element
   */
  getBorderBox: function (element) {
    let left = document.defaultView.getComputedStyle(
      element,
      "borderLeftWidth"
    );
    let right = document.defaultView.getComputedStyle(
      element,
      "borderRightWidth"
    );
    let top = document.defaultView.getComputedStyle(element, "borderTopWidth");
    let bottom = document.defaultView.getComputedStyle(
      element,
      "borderBottomWidth"
    );

    return {
      top: parseFloat(top),
      right: parseFloat(right),
      bottom: parseFloat(bottom),
      left: parseFloat(left),
    };
  },

  /**
   * @function 以最小的数量计算“容器”的滚动位置，以使给定的“元素”的内容和边框可见
   * @description 如果该元素大于容器，则其左上角将尽可能靠近容器的左上角对齐
   * @param {*} element
   * @param {*} container
   * @param {*} opt_center
   */
  getContainerOffsetToScrollInto: function (element, container, opt_center) {
    // 元素边框左上角的绝对位置.
    let elementPos = UtilStyle.getPageOffset(element);
    // 容器边框的绝对位置左上角.
    let containerPos = UtilStyle.getPageOffset(container);
    let containerBorder = UtilStyle.getBorderBox(container);
    // 相对排名 元素的边框到容器的内容框的距离.
    let relX = elementPos.x - containerPos.x - containerBorder.left;
    let relY = elementPos.y - containerPos.y - containerBorder.top;
    // 元素可以在容器中移动多少，即元素在最右下方和最左上最完全可见的位置之间的差.
    let elementSize = UtilStyle._getSizeWithDisplay(element);
    let spaceX = container.clientWidth - elementSize.width;
    let spaceY = container.clientHeight - elementSize.height;
    let scrollLeft = container.scrollLeft;
    let scrollTop = container.scrollTop;
    if (opt_center) {
      // 所有浏览器将非整数滚动位置向下取整.
      scrollLeft += relX - spaceX / 2;
      scrollTop += relY - spaceY / 2;
    } else {
      // 此公式旨在在以下情况下提供正确的滚动值:
      // - element is higher than container (spaceY < 0) => scroll down by relY
      // - element is not higher that container (spaceY >= 0):
      //   - it is above container (relY < 0) => scroll up by abs(relY)
      //   - it is below container (relY > spaceY) => scroll down by relY - spaceY
      //   - it is in the container => don't scroll
      scrollLeft += Math.min(relX, Math.max(relX - spaceX, 0));
      scrollTop += Math.min(relY, Math.max(relY - spaceY, 0));
    }
    return new KidBlocks.utils.Coordinate(scrollLeft, scrollTop);
  },

  /**
   * @function 以最小的量更改“容器”的滚动位置，以使给定的“元素”的内容和边框可见
   * @description 如果元素大于容器，则其左上角将尽可能靠近容器的左上角对齐
   * @param {*} element 可见的元素
   * @param {*} container 要滚动的容器 如果未设置，则将使用文档滚动元素
   * @param {*} opt_center 是否将元素在容器中居中。默认为false
   */
  scrollIntoContainerView: function (element, container, opt_center) {
    let offset = UtilStyle.getContainerOffsetToScrollInto(
      element,
      container,
      opt_center
    );
    container.scrollLeft = offset.x;
    container.scrollTop = offset.y;
  },
};
