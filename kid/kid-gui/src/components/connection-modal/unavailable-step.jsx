import PropTypes from "prop-types";
import classNames from "classnames";
import React from "react";

import Box from "../box/box.jsx";
import Dots from "./dots.jsx";

import styles from "./connection-modal.css";

const UnavailableStep = (props) => (
  <Box className={styles.body}>
    <Box className={styles.activityArea}>
      <div className={styles.scratchLinkHelp}>
        <div className={styles.scratchLinkHelpStep}>
          <div className={styles.helpStepNumber}>{"1"}</div>
          <div className={styles.helpStepImage}>
            <img
              className={styles.scratchLinkIcon}
              src={GLOBAL_URL.ASSET_ICON_SCRATCH_LINK}
            />
          </div>
          <div className={styles.helpStepText}>
            {GLOBAL_L10N("gui.connection.unavailable.installscratchlink")}
          </div>
        </div>
        <div className={styles.scratchLinkHelpStep}>
          <div className={styles.helpStepNumber}>{"2"}</div>
          <div className={styles.helpStepImage}>
            <img
              className={styles.scratchLinkIcon}
              src={GLOBAL_URL.ASSET_ICON_BLUETOOTH}
            />
          </div>
          <div className={styles.helpStepText}>
            {GLOBAL_L10N("gui.connection.unavailable.enablebluetooth")}
          </div>
        </div>
      </div>
    </Box>
    <Box className={styles.bottomArea}>
      <Dots error className={styles.bottomAreaItem} total={3} />
      <Box className={classNames(styles.bottomAreaItem, styles.buttonRow)}>
        <button className={styles.connectionButton} onClick={props.onScanning}>
          <img
            className={classNames(styles.buttonIconLeft, styles.buttonIconBack)}
            src={GLOBAL_URL.ASSET_ICON_BACK}
          />
          {GLOBAL_L10N("gui.connection.unavailable.tryagainbutton")}
        </button>
        <button className={styles.connectionButton} onClick={props.onHelp}>
          <img
            className={styles.buttonIconLeft}
            src={GLOBAL_URL.ASSET_ICON_HELP}
          />
          {GLOBAL_L10N("gui.connection.unavailable.helpbutton")}
        </button>
      </Box>
    </Box>
  </Box>
);

UnavailableStep.propTypes = {
  onHelp: PropTypes.func,
  onScanning: PropTypes.func,
};

export default UnavailableStep;
