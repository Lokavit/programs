/*
 * @Author: Satya
 * @Date: 2020-08-02 16:14:51
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-12 16:08:25
 * doc: 选择单个精灵，可以进行的操作
 *  有拖拽功能 ，右键菜单[复制、导出、删除]
 */

import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { setHoveredSprite } from "../reducers/hovered-target";
import { updateAssetDrag } from "../reducers/asset-drag";

import DragRecognizer from "../lib/drag-recognizer";

class SpriteSelectorItem extends React.PureComponent {
  constructor(props) {
    super(props);
    bindAll(this, [
      "getCostumeData",
      "setRef",
      "handleClick",
      "handleDelete",
      "handleDuplicate",
      "handleExport",
      "handleMouseEnter",
      "handleMouseLeave",
      "handleMouseDown",
      "handleDragEnd",
      "handleDrag",
      "handleTouchEnd",
      "handleDoubleClick",
    ]);

    this.dragRecognizer = new DragRecognizer({
      onDrag: this.handleDrag,
      onDragEnd: this.handleDragEnd,
    });

    console.log("单个元素:", props);
    console.log("单个元素:", this.props);
  }
  componentDidMount() {
    document.addEventListener("touchend", this.handleTouchEnd);
  }
  componentWillUnmount() {
    document.removeEventListener("touchend", this.handleTouchEnd);
    this.dragRecognizer.reset();
  }

  /** 获取造型数据
   * @returns 返回 造型资源的base64数据 (data:image/svg+xml;base64)
   * 注:该函数返回base64，是因为GetAssetURL()函数中做了转bas64处理
   */
  getCostumeData() {
    console.log("costumeURL:", this.props.costumeURL);
    console.log("asset:", this.props.asset);

    if (this.props.costumeURL) return this.props.costumeURL;
    if (!this.props.asset) return null;
    return GetAssetURL(this.props.asset);
  }

  /** 拖拽结束 */
  handleDragEnd() {
    if (this.props.dragging) {
      this.props.onDrag({
        img: null,
        currentOffset: null,
        dragging: false,
        dragType: null,
        index: null,
      });
    }
    setTimeout(() => {
      this.noClick = false;
    });
  }

  /**
   * 拖拽
   * @param {*} currentOffset 当前偏移
   */
  handleDrag(currentOffset) {
    this.props.onDrag({
      img: this.getCostumeData(),
      currentOffset: currentOffset,
      dragging: true,
      dragType: this.props.dragType,
      index: this.props.index,
      payload: this.props.dragPayload,
    });
    this.noClick = true;
  }
  handleTouchEnd(e) {
    const { x, y } = Utility.getEventXY(e);
    const { top, left, bottom, right } = this.ref.getBoundingClientRect();
    if (x >= left && x <= right && y >= top && y <= bottom) {
      this.handleMouseEnter();
    }
  }
  handleMouseDown(e) {
    this.dragRecognizer.start(e);
  }
  handleClick(e) {
    e.preventDefault();
    if (!this.noClick) {
      this.props.onClick(this.props.id);
      // this.handleClick(this.props.id);
    }
  }
  // 添加个双击事件，用于展开序列帧
  handleDoubleClick(e) {
    e.preventDefault;
    console.log("双击事件，展开序列帧。");
  }

  handleDelete(e) {
    e.stopPropagation(); // To prevent from bubbling back to handleClick
    this.props.onDeleteButtonClick(this.props.id);
  }
  handleDuplicate(e) {
    e.stopPropagation(); // To prevent from bubbling back to handleClick
    this.props.onDuplicateButtonClick(this.props.id);
  }
  handleExport(e) {
    e.stopPropagation();
    this.props.onExportButtonClick(this.props.id);
  }
  handleMouseLeave() {
    this.props.dispatchSetHoveredSprite(null);
  }
  handleMouseEnter() {
    this.props.dispatchSetHoveredSprite(this.props.id);
  }
  setRef(component) {
    // 使用.elem访问DOM节点，因为它正在通过ContextMenuTrigger
    this.ref = component && component.elem;
  }
  render() {
    return (
      <div
        className={`sprite_selector_item ${
          this.props.selected ? "is_selected" : ""
        }`}
        onClick={this.handleClick}
        onDoubleClick={this.handleDoubleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onMouseDown={this.handleMouseDown}
        onTouchStart={this.handleMouseDown}
      >
        {this.props.costumeURL || this.props.asset ? (
          <div
            className="sprite_image_show"
            style={{ backgroundImage: `url(${this.getCostumeData()})` }}
          ></div>
        ) : null}

        <div className="sprite_name">
          {this.props.name}
          {console.log("props:", this.props)}
        </div>

        {/* 复制元素 */}
        {this.props.selected && this.props.name != "背景" ? (
          <div
            aria-label="Copy"
            className="sprite_btn_common btn_copy"
            style={{
              backgroundImage: `url(${GLOBAL_URL.ASSET_ICON_DELETE})`,
            }}
            role="button"
            onClick={this.handleDuplicate}
          ></div>
        ) : null}

        {/* 重写单个元素导出按钮 */}
        {this.props.selected && this.props.name != "背景" ? (
          <div
            aria-label="Exoprt"
            className="sprite_btn_common btn_export"
            style={{
              backgroundImage: `url(${GLOBAL_URL.ASSET_ICON_DELETE})`,
            }}
            role="button"
            onClick={this.handleExport}
          ></div>
        ) : null}

        {/* 重写单个元素删除按钮 */}
        {this.props.selected ? (
          <div
            aria-label="Delete"
            className="sprite_btn_common btn_delete"
            style={{
              backgroundImage: `url(${GLOBAL_URL.ASSET_ICON_DELETE})`,
            }}
            role="button"
            onClick={this.handleDelete}
          ></div>
        ) : null}
      </div>
    );
  }
}

SpriteSelectorItem.propTypes = {
  asset: PropTypes.instanceOf(STORAGE.Asset),
  costumeURL: PropTypes.string,
  dispatchSetHoveredSprite: PropTypes.func.isRequired,
  dragPayload: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dragType: PropTypes.string,
  dragging: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  index: PropTypes.number,
  name: PropTypes.string,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  onDeleteButtonClick: PropTypes.func,
  onDrag: PropTypes.func.isRequired,
  onDuplicateButtonClick: PropTypes.func,
  onExportButtonClick: PropTypes.func,
  receivedBlocks: PropTypes.bool.isRequired,
  selected: PropTypes.bool,
};

const mapStateToProps = (state, { id }) => ({
  dragging: state.scratchGui.assetDrag.dragging,
  receivedBlocks:
    state.scratchGui.hoveredTarget.receivedBlocks &&
    state.scratchGui.hoveredTarget.sprite === id,
});
const mapDispatchToProps = (dispatch) => ({
  dispatchSetHoveredSprite: (spriteId) => {
    dispatch(setHoveredSprite(spriteId));
  },
  onDrag: (data) => dispatch(updateAssetDrag(data)),
});

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(SpriteSelectorItem);

export default ConnectedComponent;
