import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

import Box from "../box/box.jsx";
import PeripheralTile from "./peripheral-tile.jsx";
import Dots from "./dots.jsx";

import styles from "./connection-modal.css";

const ScanningStep = (props) => (
  <Box className={styles.body}>
    <Box className={styles.activityArea}>
      {props.scanning ? (
        props.peripheralList.length === 0 ? (
          <div className={styles.activityAreaInfo}>
            <div className={styles.centeredRow}>
              <img
                className={classNames(styles.radarSmall, styles.radarSpin)}
                src={GLOBAL_URL.ASSET_ICON_SEARCHING}
              />
              {GLOBAL_L10N("gui.connection.scanning.lookingforperipherals")}
            </div>
          </div>
        ) : (
          <div className={styles.peripheralTilePane}>
            {props.peripheralList.map((peripheral) => (
              <PeripheralTile
                connectionSmallIconURL={props.connectionSmallIconURL}
                key={peripheral.peripheralId}
                name={peripheral.name}
                peripheralId={peripheral.peripheralId}
                rssi={peripheral.rssi}
                onConnecting={props.onConnecting}
              />
            ))}
          </div>
        )
      ) : (
        <Box className={styles.instructions}>
          {GLOBAL_L10N("gui.connection.scanning.noPeripheralsFound")}
        </Box>
      )}
    </Box>
    <Box className={styles.bottomArea}>
      <Box className={classNames(styles.bottomAreaItem, styles.instructions)}>
        {GLOBAL_L10N("gui.connection.scanning.instructions")}
      </Box>
      <Dots className={styles.bottomAreaItem} counter={0} total={3} />
      <button
        className={classNames(styles.bottomAreaItem, styles.connectionButton)}
        onClick={props.onRefresh}
      >
        {GLOBAL_L10N("gui.connection.search")}
        <img
          className={styles.buttonIconRight}
          src={GLOBAL_URL.ASSET_ICON_REFRESH}
        />
      </button>
    </Box>
  </Box>
);

ScanningStep.propTypes = {
  connectionSmallIconURL: PropTypes.string,
  onConnecting: PropTypes.func,
  onRefresh: PropTypes.func,
  peripheralList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      rssi: PropTypes.number,
      peripheralId: PropTypes.string,
    })
  ),
  scanning: PropTypes.bool.isRequired,
};

ScanningStep.defaultProps = {
  peripheralList: [],
  scanning: true,
};

export default ScanningStep;
