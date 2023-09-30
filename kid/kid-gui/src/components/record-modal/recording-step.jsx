import PropTypes from "prop-types";
import React from "react";
import Box from "../box/box.jsx";
import Meter from "../meter/meter.jsx";
import Waveform from "../waveform/waveform.jsx";

import styles from "./record-modal.css";

// const messages = defineMessages({
//   permission: {
//     defaultMessage: "{arrow}We need your permission to use your microphone",
//     description:
//       "Permission required notice in recording sound modal. Do not translate {arrow}",
//     id: "gui.recordingStep.permission",
//   },
// });

const RecordingStep = (props) => (
  <Box>
    <Box className={styles.visualizationContainer}>
      <Box className={styles.meterContainer}>
        <Meter height={172} level={props.level} width={20} />
      </Box>
      <Box className={styles.waveformContainer}>
        {props.levels ? (
          <Waveform data={props.levels} height={150} level={0} width={440} />
        ) : (
          <span className={styles.helpText}>
            {GLOBAL_L10N("gui.recordingStep.beginRecord")}
            {/* {props.listening
              ? GLOBAL_L10N("gui.recordingStep.beginRecord")
              : props.intl.formatMessage(messages.permission, {
                  arrow: props.isRtl ? "↗️ \u00A0" : "↖️ \u00A0",
                })} */}
          </span>
        )}
      </Box>
    </Box>
    <Box className={styles.mainButtonRow}>
      <button
        className={styles.mainButton}
        disabled={!props.listening}
        onClick={props.recording ? props.onStopRecording : props.onRecord}
      >
        {props.recording ? (
          <img draggable={false} src={GLOBAL_URL.ASSET_ICON_RECORD_STOP} />
        ) : (
          <svg className={styles.recordButton} height="52" width="52">
            <circle
              className={styles.recordButtonCircle}
              cx="26"
              cy="26"
              r="25"
            />
            <circle
              className={styles.recordButtonCircleOutline}
              cx="26"
              cy="26"
              r={27 + props.level * 5}
            />
          </svg>
        )}
        <div className={styles.helpText}>
          <span className={styles.recordingText}>
            {props.recording
              ? GLOBAL_L10N("gui.recordingStep.stop")
              : GLOBAL_L10N("gui.recordingStep.record")}
          </span>
        </div>
      </button>
    </Box>
  </Box>
);

RecordingStep.propTypes = {
  isRtl: PropTypes.bool,
  level: PropTypes.number,
  levels: PropTypes.arrayOf(PropTypes.number),
  listening: PropTypes.bool,
  onRecord: PropTypes.func.isRequired,
  onStopRecording: PropTypes.func.isRequired,
  recording: PropTypes.bool,
};

export default RecordingStep;
