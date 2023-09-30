import PropTypes from "prop-types";
import classNames from "classnames";
import React from "react";

import Box from "../box/box.jsx";
import Dots from "./dots.jsx";
import styles from "./connection-modal.css";

const ErrorStep = (props) => (
  <Box className={styles.body}>
    <Box className={styles.activityArea}>
      <Box className={styles.centeredRow}>
        <div className={styles.peripheralActivity}>
          <img
            className={styles.peripheralActivityIcon}
            src={props.connectionIconURL}
          />
        </div>
      </Box>
    </Box>
    <Box className={styles.bottomArea}>
      <div className={classNames(styles.bottomAreaItem, styles.instructions)}>
        {GLOBAL_L10N("gui.connection.error.errorMessage")}
      </div>
      <Dots error className={styles.bottomAreaItem} total={3} />
      <Box className={classNames(styles.bottomAreaItem, styles.buttonRow)}>
        <button className={styles.connectionButton} onClick={props.onScanning}>
          <img
            className={classNames(styles.buttonIconLeft, styles.buttonIconBack)}
            src={GLOBAL_URL.ASSET_ICON_BACK}
          />
          {GLOBAL_L10N("gui.connection.error.tryagainbutton")}
        </button>
        <button className={styles.connectionButton} onClick={props.onHelp}>
          <img
            className={styles.buttonIconLeft}
            src={GLOBAL_URL.ASSET_ICON_HELP}
          />
          {GLOBAL_L10N("gui.connection.error.helpbutton")}
        </button>
      </Box>
    </Box>
  </Box>
);

ErrorStep.propTypes = {
  connectionIconURL: PropTypes.string.isRequired,
  onHelp: PropTypes.func,
  onScanning: PropTypes.func,
};

export default ErrorStep;
