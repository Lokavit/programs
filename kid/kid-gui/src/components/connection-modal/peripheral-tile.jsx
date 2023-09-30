import PropTypes from "prop-types";
import classNames from "classnames";
import React from "react";
import bindAll from "lodash.bindall";
import Box from "../box/box.jsx";

import styles from "./connection-modal.css";

class PeripheralTile extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, ["handleConnecting"]);
  }
  handleConnecting() {
    this.props.onConnecting(this.props.peripheralId);
  }
  render() {
    return (
      <Box className={styles.peripheralTile}>
        <Box className={styles.peripheralTileName}>
          <img
            className={styles.peripheralTileImage}
            src={this.props.connectionSmallIconURL}
          />
          <Box className={styles.peripheralTileNameWrapper}>
            <Box className={styles.peripheralTileNameLabel}>
              {GLOBAL_L10N("gui.connection.peripheral-name-label")}
            </Box>
            <Box className={styles.peripheralTileNameText}>
              {this.props.name}
            </Box>
          </Box>
        </Box>
        <Box className={styles.peripheralTileWidgets}>
          <Box className={styles.signalStrengthMeter}>
            <div
              className={classNames(styles.signalBar, {
                [styles.greenBar]: this.props.rssi > -80,
              })}
            />
            <div
              className={classNames(styles.signalBar, {
                [styles.greenBar]: this.props.rssi > -60,
              })}
            />
            <div
              className={classNames(styles.signalBar, {
                [styles.greenBar]: this.props.rssi > -40,
              })}
            />
            <div
              className={classNames(styles.signalBar, {
                [styles.greenBar]: this.props.rssi > -20,
              })}
            />
          </Box>
          <button onClick={this.handleConnecting}>
            {GLOBAL_L10N("gui.connection.connect")}
          </button>
        </Box>
      </Box>
    );
  }
}

PeripheralTile.propTypes = {
  connectionSmallIconURL: PropTypes.string,
  name: PropTypes.string,
  onConnecting: PropTypes.func,
  peripheralId: PropTypes.string,
  rssi: PropTypes.number,
};

export default PeripheralTile;
