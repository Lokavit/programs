import bindAll from "lodash.bindall";
import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

class TargetHighlight extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, ["getPageCoords"]);
  }

  // Transform scratch coordinates into page coordinates
  getPageCoords(x, y) {
    const { stageWidth, stageHeight, VM } = this.props;
    // The renderers "nativeSize" is the [width, height] of the stage in scratch-units
    const nativeSize = VM.renderer.getNativeSize();
    return [
      (stageWidth / nativeSize[0]) * x + stageWidth / 2,
      -((stageHeight / nativeSize[1]) * y) + stageHeight / 2,
    ];
  }

  render() {
    const {
      className,
      highlightedTargetId,
      highlightedTargetTime,
      VM,
    } = this.props;

    if (
      !(
        this.props.highlightedTargetId &&
        VM &&
        VM.renderer &&
        VM.runtime.getTargetById(this.props.highlightedTargetId)
      )
    )
      return null;

    const target = VM.runtime.getTargetById(this.props.highlightedTargetId);
    const bounds = VM.renderer.getBounds(target.drawableID);
    const [left, top] = this.getPageCoords(bounds.left, bounds.top);
    const [right, bottom] = this.getPageCoords(bounds.right, bounds.bottom);

    const pad = 2; // px

    return (
      <div
        className={className}
        // Ensure new DOM element each update to restart animation
        key={highlightedTargetTime}
        style={{
          position: "absolute",
          top: `${top - pad}px`,
          left: `${left - pad}px`,
          width: `${right - left + 2 * pad}px`,
          height: `${bottom - top + 2 * pad}px`,
        }}
      />
    );
  }
}

TargetHighlight.propTypes = {
  className: PropTypes.string,
  highlightedTargetId: PropTypes.string,
  highlightedTargetTime: PropTypes.number,
  stageHeight: PropTypes.number,
  stageWidth: PropTypes.number,
  VM: PropTypes.instanceOf(VM),
};

const mapStateToProps = (state) => ({
  highlightedTargetTime: state.scratchGui.targets.highlightedTargetTime,
  highlightedTargetId: state.scratchGui.targets.highlightedTargetId,
  VM: state.scratchGui.VM,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TargetHighlight);
