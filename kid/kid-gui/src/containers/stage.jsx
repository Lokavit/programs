import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";

import { STAGE_DISPLAY_SIZES } from "../lib/layout-constants";
import { getEventXY } from "../lib/touch-utils";
import VideoProvider from "../lib/video/video-provider";

import {
  activateColorPicker,
  deactivateColorPicker,
} from "../reducers/color-picker";

import classNames from "classnames";
import DOMElementRenderer from "./dom-element-renderer.jsx";
import { moveMonitorRect } from "../reducers/monitor-layout";
import Monitor from "./monitor.jsx";
import { OrderedMap } from "immutable";
import { stageSizeToTransform } from "../lib/screen-utils";

// import TargetHighlight from "./target-highlight.jsx";

import Question from "./question.jsx";
import MicIndicator from "../components/mic-indicator/mic-indicator.jsx";
import { getStageDimensions } from "../lib/screen-utils.js";
import styles from "./stage.css";

const colorPickerRadius = 20;
const dragThreshold = 3; // Same as the block drag threshold
const zoomScale = 3;

class Stage extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, [
      "attachMouseEvents",
      "cancelMouseDownTimeout",
      "detachMouseEvents",
      "handleDoubleClick",
      "handleQuestionAnswered",
      "onMouseUp",
      "onMouseMove",
      "onMouseDown",
      "onStartDrag",
      "onStopDrag",
      "onWheel",
      "updateRect",
      "questionListener",
      "setDragCanvas",
      "clearDragCanvas",
      "drawDragCanvas",
      "positionDragCanvas",
      "setCanvas",
      "handleMonitorChange",
      "getPageCoords",
    ]);
    this.state = {
      mouseDownTimeoutId: null,
      mouseDownPosition: null,
      isDragging: false,
      dragOffset: null,
      dragId: null,
      colorInfo: null,
      question: null,
      stageDimensions: getStageDimensions(this.props.stageSize, false),
    };
    this.canvas = document.createElement("canvas");
    this.renderer = new RenderWebGL(this.canvas);

    VM.attachRenderer(this.renderer);

    // 由于状态是有状态的，因此仅附加一次视频提供者
    VM.setVideoProvider(new VideoProvider());

    // 在加载任何项目之前调用一次draw只会使画布变成白色，而不是纯黑色，这是必需的，因为无法使用CSS设置画布的样式，使其具有不同的默认颜色
    VM.renderer.draw(); // draw()始终undefind
    console.log("stage.jsx", this.props);
  }

  componentDidMount() {
    this.attachRectEvents();
    this.attachMouseEvents(this.canvas);
    this.updateRect();
    VM.runtime.addListener("QUESTION", this.questionListener);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.stageSize !== nextProps.stageSize ||
      this.props.isColorPicking !== nextProps.isColorPicking ||
      this.state.colorInfo !== nextState.colorInfo ||
      this.state.question !== nextState.question ||
      this.props.micIndicator !== nextProps.micIndicator
    );
  }
  componentDidUpdate(prevProps) {
    if (this.props.isColorPicking && !prevProps.isColorPicking) {
      this.startColorPickingLoop();
    } else if (!this.props.isColorPicking && prevProps.isColorPicking) {
      this.stopColorPickingLoop();
    }
    this.updateRect();
    this.renderer.resize(this.rect.width, this.rect.height);
    this.draw();
  }
  componentWillUnmount() {
    this.detachMouseEvents(this.canvas);
    this.detachRectEvents();
    this.stopColorPickingLoop();
    VM.runtime.removeListener("QUESTION", this.questionListener);
  }

  handleMonitorChange(id, x, y) {
    // eslint-disable-line no-unused-vars
    this.props.moveMonitorRect(id, x, y);
  }

  // Transform scratch coordinates into page coordinates
  getPageCoords(x, y) {
    const { stageWidth, stageHeight } = this.props;
    // The renderers "nativeSize" is the [width, height] of the stage in scratch-units
    const nativeSize = VM.renderer.getNativeSize();
    return [
      (stageWidth / nativeSize[0]) * x + stageWidth / 2,
      -((stageHeight / nativeSize[1]) * y) + stageHeight / 2,
    ];
  }

  questionListener(question) {
    this.setState({ question: question });
  }
  handleQuestionAnswered(answer) {
    this.setState({ question: null }, () => {
      VM.runtime.emit("ANSWER", answer);
    });
  }
  startColorPickingLoop() {
    this.intervalId = setInterval(() => {
      if (typeof this.pickX === "number") {
        this.setState({ colorInfo: this.getColorInfo(this.pickX, this.pickY) });
      }
    }, 30);
  }
  stopColorPickingLoop() {
    clearInterval(this.intervalId);
  }
  attachMouseEvents(canvas) {
    document.addEventListener("mousemove", this.onMouseMove);
    document.addEventListener("mouseup", this.onMouseUp);
    document.addEventListener("touchmove", this.onMouseMove);
    document.addEventListener("touchend", this.onMouseUp);
    canvas.addEventListener("mousedown", this.onMouseDown);
    canvas.addEventListener("touchstart", this.onMouseDown);
    canvas.addEventListener("wheel", this.onWheel);
  }
  detachMouseEvents(canvas) {
    document.removeEventListener("mousemove", this.onMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp);
    document.removeEventListener("touchmove", this.onMouseMove);
    document.removeEventListener("touchend", this.onMouseUp);
    canvas.removeEventListener("mousedown", this.onMouseDown);
    canvas.removeEventListener("touchstart", this.onMouseDown);
    canvas.removeEventListener("wheel", this.onWheel);
  }
  attachRectEvents() {
    window.addEventListener("resize", this.updateRect);
    window.addEventListener("scroll", this.updateRect);
  }
  detachRectEvents() {
    window.removeEventListener("resize", this.updateRect);
    window.removeEventListener("scroll", this.updateRect);
  }
  updateRect() {
    this.rect = this.canvas.getBoundingClientRect();
  }
  getScratchCoords(x, y) {
    const nativeSize = this.renderer.getNativeSize();
    return [
      (nativeSize[0] / this.rect.width) * (x - this.rect.width / 2),
      (nativeSize[1] / this.rect.height) * (y - this.rect.height / 2),
    ];
  }
  getColorInfo(x, y) {
    return {
      x: x,
      y: y,
      ...this.renderer.extractColor(x, y, colorPickerRadius),
    };
  }
  handleDoubleClick(e) {
    const { x, y } = Utility.getEventXY(e);
    // Set editing target from cursor position, if clicking on a sprite.
    const mousePosition = [x - this.rect.left, y - this.rect.top];
    const drawableId = this.renderer.pick(mousePosition[0], mousePosition[1]);
    if (drawableId === null) return;
    const targetId = VM.getTargetIdForDrawableId(drawableId);
    if (targetId === null) return;
    VM.setEditingTarget(targetId);
  }
  onMouseMove(e) {
    const { x, y } = Utility.getEventXY(e);
    const mousePosition = [x - this.rect.left, y - this.rect.top];

    if (this.props.isColorPicking) {
      // Set the pickX/Y for the color picker loop to pick up
      this.pickX = mousePosition[0];
      this.pickY = mousePosition[1];
    }

    if (this.state.mouseDown && !this.state.isDragging) {
      const distanceFromMouseDown = Math.sqrt(
        Math.pow(mousePosition[0] - this.state.mouseDownPosition[0], 2) +
          Math.pow(mousePosition[1] - this.state.mouseDownPosition[1], 2)
      );
      if (distanceFromMouseDown > dragThreshold) {
        this.cancelMouseDownTimeout();
        this.onStartDrag(...this.state.mouseDownPosition);
      }
    }
    if (this.state.mouseDown && this.state.isDragging) {
      // Editor drag style only updates the drag canvas, does full update at the end of drag
      // Non-editor drag style just updates the sprite continuously.
      if (this.props.useEditorDragStyle) {
        this.positionDragCanvas(mousePosition[0], mousePosition[1]);
      } else {
        const spritePosition = this.getScratchCoords(
          mousePosition[0],
          mousePosition[1]
        );
        VM.postSpriteInfo({
          x: spritePosition[0] + this.state.dragOffset[0],
          y: -(spritePosition[1] + this.state.dragOffset[1]),
          force: true,
        });
      }
    }
    const coordinates = {
      x: mousePosition[0],
      y: mousePosition[1],
      canvasWidth: this.rect.width,
      canvasHeight: this.rect.height,
    };
    VM.postIOData("mouse", coordinates);
  }
  onMouseUp(e) {
    const { x, y } = Utility.getEventXY(e);
    const mousePosition = [x - this.rect.left, y - this.rect.top];
    this.cancelMouseDownTimeout();
    this.setState({
      mouseDown: false,
      mouseDownPosition: null,
    });
    const data = {
      isDown: false,
      x: x - this.rect.left,
      y: y - this.rect.top,
      canvasWidth: this.rect.width,
      canvasHeight: this.rect.height,
      wasDragged: this.state.isDragging,
    };
    if (this.state.isDragging) {
      this.onStopDrag(mousePosition[0], mousePosition[1]);
    }
    VM.postIOData("mouse", data);

    if (
      this.props.isColorPicking &&
      mousePosition[0] > 0 &&
      mousePosition[0] < this.rect.width &&
      mousePosition[1] > 0 &&
      mousePosition[1] < this.rect.height
    ) {
      const { r, g, b } = this.state.colorInfo.color;
      const componentToString = (c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
      };
      const colorString = `#${componentToString(r)}${componentToString(
        g
      )}${componentToString(b)}`;
      this.props.onDeactivateColorPicker(colorString);
      this.setState({ colorInfo: null });
      this.pickX = null;
      this.pickY = null;
    }
  }
  onMouseDown(e) {
    this.updateRect();
    const { x, y } = Utility.getEventXY(e);
    const mousePosition = [x - this.rect.left, y - this.rect.top];
    if (this.props.isColorPicking) {
      // Set the pickX/Y for the color picker loop to pick up
      this.pickX = mousePosition[0];
      this.pickY = mousePosition[1];
      // Immediately update the color picker info
      this.setState({ colorInfo: this.getColorInfo(this.pickX, this.pickY) });
    } else {
      if (e.button === 0 || (window.TouchEvent && e instanceof TouchEvent)) {
        this.setState({
          mouseDown: true,
          mouseDownPosition: mousePosition,
          mouseDownTimeoutId: setTimeout(
            this.onStartDrag.bind(this, mousePosition[0], mousePosition[1]),
            400
          ),
        });
      }
      const data = {
        isDown: true,
        x: mousePosition[0],
        y: mousePosition[1],
        canvasWidth: this.rect.width,
        canvasHeight: this.rect.height,
      };
      VM.postIOData("mouse", data);
      if (e.preventDefault) {
        // Prevent default to prevent touch from dragging page
        e.preventDefault();
        // But we do want any active input to be blurred
        if (document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
      }
    }
  }
  onWheel(e) {
    const data = {
      deltaX: e.deltaX,
      deltaY: e.deltaY,
    };
    VM.postIOData("mouseWheel", data);
  }
  cancelMouseDownTimeout() {
    if (this.state.mouseDownTimeoutId !== null) {
      clearTimeout(this.state.mouseDownTimeoutId);
    }
    this.setState({ mouseDownTimeoutId: null });
  }
  drawDragCanvas(drawableData) {
    const { data, width, height, x, y } = drawableData;
    this.dragCanvas.width = width;
    this.dragCanvas.height = height;
    // Need to convert uint8array from WebGL readPixels into Uint8ClampedArray
    // for ImageData constructor. Shares underlying buffer, so it is fast.
    const imageData = new ImageData(
      new Uint8ClampedArray(data.buffer),
      width,
      height
    );
    this.dragCanvas.getContext("2d").putImageData(imageData, 0, 0);
    // Position so that pick location is at (0, 0) so that  positionDragCanvas()
    // can use translation to move to mouse position smoothly.
    this.dragCanvas.style.left = `${-x}px`;
    this.dragCanvas.style.top = `${-y}px`;
    this.dragCanvas.style.display = "block";
  }
  clearDragCanvas() {
    this.dragCanvas.width = this.dragCanvas.height = 0;
    this.dragCanvas.style.display = "none";
  }
  positionDragCanvas(mouseX, mouseY) {
    // mouseX/Y are relative to stage top/left, and dragCanvas is already
    // positioned so that the pick location is at (0,0).
    this.dragCanvas.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  }
  onStartDrag(x, y) {
    if (this.state.dragId) return;
    const drawableId = this.renderer.pick(x, y);
    if (drawableId === null) return;
    const targetId = VM.getTargetIdForDrawableId(drawableId);
    if (targetId === null) return;

    const target = VM.runtime.getTargetById(targetId);

    // Do not start drag unless in editor drag mode or target is draggable
    if (!(this.props.useEditorDragStyle || target.draggable)) return;

    // Dragging always brings the target to the front
    target.goToFront();

    // Extract the drawable art
    const drawableData = this.renderer.extractDrawable(drawableId, x, y);

    VM.startDrag(targetId);
    this.setState({
      isDragging: true,
      dragId: targetId,
      dragOffset: drawableData.scratchOffset,
    });
    if (this.props.useEditorDragStyle) {
      this.drawDragCanvas(drawableData);
      this.positionDragCanvas(x, y);
      VM.postSpriteInfo({ visible: false });
    }
  }
  onStopDrag(mouseX, mouseY) {
    const dragId = this.state.dragId;
    const commonStopDragActions = () => {
      VM.stopDrag(dragId);
      this.setState({
        isDragging: false,
        dragOffset: null,
        dragId: null,
      });
    };
    if (this.props.useEditorDragStyle) {
      // Need to sequence these actions to prevent flickering.
      const spriteInfo = { visible: true };
      // First update the sprite position if dropped in the stage.
      if (
        mouseX > 0 &&
        mouseX < this.rect.width &&
        mouseY > 0 &&
        mouseY < this.rect.height
      ) {
        const spritePosition = this.getScratchCoords(mouseX, mouseY);
        spriteInfo.x = spritePosition[0] + this.state.dragOffset[0];
        spriteInfo.y = -(spritePosition[1] + this.state.dragOffset[1]);
        spriteInfo.force = true;
      }
      VM.postSpriteInfo(spriteInfo);
      // Then clear the dragging canvas and stop drag (potentially slow if selecting sprite)
      setTimeout(() => {
        this.clearDragCanvas();
        setTimeout(() => {
          commonStopDragActions();
        }, 30);
      }, 30);
    } else {
      commonStopDragActions();
    }
  }
  setDragCanvas(canvas) {
    this.dragCanvas = canvas;
  }
  draw() {
    const boxSize = 6 / zoomScale;
    const boxLineWidth = 1 / zoomScale;
    const colorRingWidth = 15 / zoomScale;

    const ctx = this.canvas.getContext("2d");
    const { color, data, width, height } = this.props.colorInfo;
    this.canvas.width = zoomScale * width;
    this.canvas.height = zoomScale * height;

    // In order to scale the image data, must draw to a tmp canvas first
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = width;
    tmpCanvas.height = height;
    const tmpCtx = tmpCanvas.getContext("2d");
    const imageData = tmpCtx.createImageData(width, height);
    imageData.data.set(data);
    tmpCtx.putImageData(imageData, 0, 0);

    // Scale the loupe canvas and draw the zoomed image
    ctx.save();
    ctx.scale(zoomScale, zoomScale);
    ctx.drawImage(tmpCanvas, 0, 0, width, height);

    // Draw an outlined square at the cursor position (cursor is hidden)
    ctx.lineWidth = boxLineWidth;
    ctx.strokeStyle = "black";
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    ctx.beginPath();
    ctx.rect(
      width / 2 - boxSize / 2,
      height / 2 - boxSize / 2,
      boxSize,
      boxSize
    );
    ctx.fill();
    ctx.stroke();

    // Draw a thick ring around the loupe showing the current color
    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
    ctx.lineWidth = colorRingWidth;
    ctx.beginPath();
    ctx.moveTo(width, height / 2);
    ctx.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }
  setCanvas(element) {
    this.canvas = element;
  }

  handleClick() {
    VM.start();
    VM.greenFlag();
  }

  render() {
    const {
      onActivateColorPicker, // eslint-disable-line no-unused-vars
      ...props
    } = this.props;

    // if (
    //   !(
    //     this.props.highlightedTargetId &&
    //     VM &&
    //     VM.renderer &&
    //     VM.runtime.getTargetById(this.props.highlightedTargetId)
    //   )
    // )
    //   return null;

    // const target = VM.runtime.getTargetById(this.props.highlightedTargetId);
    // console.log("???", target);
    // const bounds = VM.renderer.getBounds(target.drawableID);
    // const [left, top] = this.getPageCoords(bounds.left, bounds.top);
    // const [right, bottom] = this.getPageCoords(bounds.right, bounds.bottom);

    const pad = 2; // px

    return (
      <React.Fragment>
        <div
          className={classNames({
            [styles.stageWrapper]: !false,
            [styles.stageWrapperOverlay]: false,
            [styles.withColorPicker]: !false && this.props.isColorPicking,
          })}
          style={{
            minHeight: this.state.stageDimensions.height,
            // minWidth: 360,
            minWidth: this.state.stageDimensions.width,
          }}
          onDoubleClick={this.handleDoubleClick}
        >
          stage包裹器
          {/* <div
            className={classNames(styles.stage, {
              [styles.stageOverlayContent]: false,
            })}
            style={{
              height: this.state.stageDimensions.height,
              // width: "calc(100% - 0.125rem)"
              width: this.state.stageDimensions.width,
            }}
          >
            ？？？？ */}
          {/* <DOMElementRenderer
              domElement={this.canvas}
              style={{
                height: this.state.stageDimensions.height,
                width: this.state.stageDimensions.width,
              }}
              {...props}
            />
            DOMElementRenderer */}
          <div
            style={{
              height: this.state.stageDimensions.height,
              width: this.state.stageDimensions.width,
            }}
          >
            <canvas width="480" height="360"></canvas>
          </div>
          {/* </div> */}
          <hr />
          <div className={styles.monitorWrapper}>
            monitorWrapper
            <div
              // Use static `monitor-overlay` class for bounds of draggables
              className={`monitor-list monitor-overlay`}
              style={{
                width: "100%",
                height: this.state.stageDimensions.height,
              }}
            >
              <div
                className="monitor-list-scaler"
                style={stageSizeToTransform(this.state.stageDimensions)}
              >
                {this.props.monitors
                  .valueSeq()
                  .filter((m) => m.visible)
                  .map((monitorData) => (
                    <Monitor
                      draggable={this.props.useEditorDragStyle}
                      height={monitorData.height}
                      id={monitorData.id}
                      isDiscrete={monitorData.isDiscrete}
                      key={monitorData.id}
                      max={monitorData.sliderMax}
                      min={monitorData.sliderMin}
                      mode={monitorData.mode}
                      opcode={monitorData.opcode}
                      params={monitorData.params}
                      spriteName={monitorData.spriteName}
                      targetId={monitorData.targetId}
                      value={monitorData.value}
                      width={monitorData.width}
                      x={monitorData.x}
                      y={monitorData.y}
                      onDragEnd={this.handleMonitorChange}
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className={styles.frameWrapper}>
            {/* <TargetHighlight
              className={styles.frame}
              stageHeight={this.state.stageDimensions.height}
              // stageWidth={"100%"}
              stageWidth={this.state.stageDimensions.width}
            /> */}

            <div
              className={styles.frameWrapper}
              // Ensure new DOM element each update to restart animation
              // key={this.props.highlightedTargetTime}
              // style={{
              //   position: "absolute",
              //   top: `${top - pad}px`,
              //   left: `${left - pad}px`,
              //   width: `${right - left + 2 * pad}px`,
              //   height: `${bottom - top + 2 * pad}px`,
              // }}
            ></div>
          </div>
          {this.props.isColorPicking && this.state.colorInfo ? (
            <div className={styles.colorPickerWrapper}>
              {/* <Loupe colorInfo={this.state.colorInfo} /> */}
              <div
                {...props}
                className={styles.colorPicker}
                componentRef={this.setCanvas}
                element="canvas"
                height={this.state.colorInfo.height}
                style={{
                  top:
                    this.state.colorInfo.y -
                    (zoomScale * this.state.colorInfo.height) / 2,
                  left:
                    this.state.colorInfo.x -
                    (zoomScale * this.state.colorInfo.width) / 2,
                  width: this.state.colorInfo.width * zoomScale,
                  height: this.state.colorInfo.height * zoomScale,
                }}
                width={this.state.colorInfo.width}
              ></div>
            </div>
          ) : null}
          <div
            className={styles.stageBottomWrapper}
            style={{
              width: this.state.stageDimensions.width,
              height: this.state.stageDimensions.height,
              left: "50%",
              marginLeft: this.state.stageDimensions.width * -0.5,
            }}
          >
            {this.props.micIndicator ? (
              <MicIndicator
                className={styles.micIndicator}
                stageSize={this.state.stageDimensions}
              />
            ) : null}
            {this.state.question === null ? null : (
              <div
                className={styles.questionWrapper}
                style={{ width: this.state.stageDimensions.width }}
              >
                <Question
                  question={this.state.question}
                  onQuestionAnswered={this.handleQuestionAnswered}
                />
              </div>
            )}
          </div>
          <canvas
            className={styles.draggingSprite}
            height={0}
            ref={this.setDragCanvas}
            width={0}
          />
        </div>
        {this.props.isColorPicking ? (
          <div
            className={styles.colorPickerBackground}
            onClick={this.props.onDeactivateColorPicker}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

Stage.propTypes = {
  isColorPicking: PropTypes.bool,
  micIndicator: PropTypes.bool,
  onActivateColorPicker: PropTypes.func,
  onDeactivateColorPicker: PropTypes.func,
  // stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
  useEditorDragStyle: PropTypes.bool,
  canvas: PropTypes.instanceOf(Element).isRequired,
  // colorInfo: Loupe.propTypes.colorInfo,
  dragRef: PropTypes.func,
  isColorPicking: PropTypes.bool,
  isStarted: PropTypes.bool,
  onDoubleClick: PropTypes.func,
  onQuestionAnswered: PropTypes.func,
  question: PropTypes.string,

  colorInfo: PropTypes.shape({
    color: PropTypes.shape({
      r: PropTypes.number,
      g: PropTypes.number,
      b: PropTypes.number,
      a: PropTypes.number,
    }),
    data: PropTypes.instanceOf(Uint8Array),
    width: PropTypes.number,
    height: PropTypes.number,
    x: PropTypes.number,
    y: PropTypes.number,
  }),

  moveMonitorRect: PropTypes.func.isRequired,
  draggable: PropTypes.bool.isRequired,
  monitors: PropTypes.instanceOf(OrderedMap),
  onMonitorChange: PropTypes.func.isRequired,
  // stageSize: PropTypes.shape({
  //   width: PropTypes.number,
  //   height: PropTypes.number,
  //   widthDefault: PropTypes.number,
  //   heightDefault: PropTypes.number,
  // }).isRequired,
  highlightedTargetId: PropTypes.string,
  highlightedTargetTime: PropTypes.number,
  stageHeight: PropTypes.number,
  stageWidth: PropTypes.number,
};

Stage.defaultProps = {
  useEditorDragStyle: true,
  dragRef: () => {},
};

const mapStateToProps = (state) => ({
  isColorPicking: state.scratchGui.colorPicker.active,
  micIndicator: state.scratchGui.micIndicator,
  // Do not use editor drag style in fullscreen or player mode.
  // useEditorDragStyle: !(
  //   state.scratchGui.mode.isFullScreen || state.scratchGui.mode.isPlayerOnly
  // ),
  loadingState: state.scratchGui.projectState.loadingState,
  monitors: state.scratchGui.monitors,
  highlightedTargetTime: state.scratchGui.targets.highlightedTargetTime,
  highlightedTargetId: state.scratchGui.targets.highlightedTargetId,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onActivateColorPicker: () => dispatch(activateColorPicker()),
  onDeactivateColorPicker: (color) => dispatch(deactivateColorPicker(color)),
  moveMonitorRect: (id, x, y) => dispatch(moveMonitorRect(id, x, y)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Stage);
