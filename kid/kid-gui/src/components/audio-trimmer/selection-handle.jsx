import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";
import Box from "../box/box.jsx";
import styles from "./audio-trimmer.css";

const SelectionHandle = (props) => (
  <Box
    className={classNames(styles.trimLine, props.handleStyle)}
    onMouseDown={props.onMouseDown}
    onTouchStart={props.onMouseDown}
  >
    <Box className={classNames(styles.trimHandle, styles.topTrimHandle)}>
      <img src={GLOBAL_URL.ASSET_ICON_HANDLE} />
    </Box>
    <Box className={classNames(styles.trimHandle, styles.bottomTrimHandle)}>
      <img src={GLOBAL_URL.ASSET_ICON_HANDLE} />
    </Box>
  </Box>
);

SelectionHandle.propTypes = {
  handleStyle: PropTypes.string,
  onMouseDown: PropTypes.func,
};

export default SelectionHandle;
