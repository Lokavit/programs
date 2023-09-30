import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

import Box from "../box/box.jsx";
import Dots from "./dots.jsx";

import styles from "./connection-modal.css";

const ConnectingStep = (props) => (
  <Box className={styles.body}>
    <Box className={styles.activityArea}>
      <Box className={styles.centeredRow}>
        <div className={styles.peripheralActivity}>
          <img
            className={styles.peripheralActivityIcon}
            src={props.connectionIconURL}
          />
          <img
            className={styles.bluetoothConnectingIcon}
            src={GLOBAL_URL.ASSET_ICON_BLUETOOTH_WHITE}
          />
        </div>
      </Box>
    </Box>
    <Box className={styles.bottomArea}>
      <Box className={classNames(styles.bottomAreaItem, styles.instructions)}>
        {props.connectingMessage}
      </Box>
      <Dots className={styles.bottomAreaItem} counter={1} total={3} />
      <div
        className={classNames(styles.bottomAreaItem, styles.segmentedButton)}
      >
        <button disabled className={styles.connectionButton}>
          {GLOBAL_L10N("gui.connection.connecting-cancelbutton")}
        </button>
        <button
          className={styles.connectionButton}
          onClick={props.onDisconnect}
        >
          <img
            className={styles.abortConnectingIcon}
            src={GLOBAL_URL.ASSET_ICON_CLOSE}
          />
        </button>
      </div>
    </Box>
  </Box>
);

ConnectingStep.propTypes = {
  connectingMessage: PropTypes.node.isRequired,
  connectionIconURL: PropTypes.string.isRequired,
  onDisconnect: PropTypes.func,
};

export default ConnectingStep;
