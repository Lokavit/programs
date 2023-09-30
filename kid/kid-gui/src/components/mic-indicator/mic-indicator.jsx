import React from "react";
import PropTypes from "prop-types";
import styles from "./mic-indicator.css";
import { stageSizeToTransform } from "../../lib/screen-utils";

const MicIndicatorComponent = (props) => (
  <div
    className={props.className}
    style={stageSizeToTransform(props.stageSize)}
  >
    <img className={styles.micImg} src={GLOBAL_URL.ASSET_ICON_MIC_INDICATOR} />
  </div>
);

MicIndicatorComponent.propTypes = {
  className: PropTypes.string,
  stageSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    widthDefault: PropTypes.number,
    heightDefault: PropTypes.number,
  }).isRequired,
};

export default MicIndicatorComponent;
