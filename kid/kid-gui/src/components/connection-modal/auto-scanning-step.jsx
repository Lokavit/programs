import PropTypes from "prop-types";
import React from "react";
import keyMirror from "keymirror";
import classNames from "classnames";

import Box from "../box/box.jsx";
import Dots from "./dots.jsx";

import styles from "./connection-modal.css";

const PHASES = keyMirror({
  prescan: null,
  pressbutton: null,
  notfound: null,
});

const AutoScanningStep = (props) => (
  <Box className={styles.body}>
    <Box className={styles.activityArea}>
      <div className={styles.activityAreaInfo}>
        <div className={styles.centeredRow}>
          {props.phase === PHASES.prescan && (
            <React.Fragment>
              <img
                className={styles.radarBig}
                src={GLOBAL_URL.ASSET_ICON_SEARCHING}
              />
              <img
                className={styles.bluetoothCenteredIcon}
                src={GLOBAL_URL.ASSET_ICON_BLUETOOTH_WHITE}
              />
            </React.Fragment>
          )}
          {props.phase === PHASES.pressbutton && (
            <React.Fragment>
              <img
                className={classNames(styles.radarBig, styles.radarSpin)}
                src={GLOBAL_URL.ASSET_ICON_SEARCHING}
              />
              <img
                className={styles.connectionTipIcon}
                src={props.connectionTipIconURL}
              />
            </React.Fragment>
          )}
          {props.phase === PHASES.notfound && (
            <Box className={styles.instructions}>
              {GLOBAL_L10N("gui.connection.auto-scanning.noPeripheralsFound")}
            </Box>
          )}
        </div>
      </div>
    </Box>
    <Box className={styles.bottomArea}>
      <Box className={classNames(styles.bottomAreaItem, styles.instructions)}>
        {props.phase === PHASES.prescan &&
          GLOBAL_L10N("gui.connection.auto-scanning.prescan")}
        {props.phase === PHASES.pressbutton &&
          GLOBAL_L10N("gui.connection.auto-scanning.pressbutton")}
      </Box>
      <Dots className={styles.bottomAreaItem} counter={0} total={3} />
      <Box className={classNames(styles.bottomAreaItem, styles.buttonRow)}>
        {props.phase === PHASES.prescan && (
          <button
            className={styles.connectionButton}
            onClick={props.onStartScan}
          >
            {GLOBAL_L10N("gui.connection.auto-scanning.start-search")}
          </button>
        )}
        {props.phase === PHASES.pressbutton && (
          <div className={styles.segmentedButton}>
            <button disabled className={styles.connectionButton}>
              {GLOBAL_L10N("gui.connection.connecting-searchbutton")}
            </button>
            <button
              className={styles.connectionButton}
              onClick={props.onRefresh}
            >
              <img
                className={styles.abortConnectingIcon}
                src={GLOBAL_URL.ASSET_ICON_CLOSE}
              />
            </button>
          </div>
        )}
        {props.phase === PHASES.notfound && (
          <button className={styles.connectionButton} onClick={props.onRefresh}>
            <img
              className={styles.buttonIconLeft}
              src={GLOBAL_URL.ASSET_ICON_BACK}
            />
            {GLOBAL_L10N("gui.connection.auto-scanning.try-again")}
          </button>
        )}
      </Box>
    </Box>
  </Box>
);

AutoScanningStep.propTypes = {
  connectionTipIconURL: PropTypes.string,
  onRefresh: PropTypes.func,
  onStartScan: PropTypes.func,
  phase: PropTypes.oneOf(Object.keys(PHASES)),
};

AutoScanningStep.defaultProps = {
  phase: PHASES.prescan,
};

export { AutoScanningStep as default, PHASES };
