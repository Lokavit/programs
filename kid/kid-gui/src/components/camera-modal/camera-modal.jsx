import PropTypes from "prop-types";
import React from "react";
import Box from "../box/box.jsx";
import Modal from "../../containers/modal.jsx";
import styles from "./camera-modal.css";

const CameraModal = ({ ...props }) => (
  <Modal
    className={styles.modalContent}
    contentLabel={GLOBAL_L10N("gui.cameraModal.cameraModalTitle")}
    onRequestClose={props.onCancel}
  >
    <Box className={styles.body}>
      <Box className={styles.cameraFeedContainer}>
        <div className={styles.loadingText}>
          {props.access
            ? GLOBAL_L10N("gui.cameraModal.loadingCameraMessage")
            : `↖️ \u00A0${GLOBAL_L10N("gui.cameraModal.permissionRequest")}`}
        </div>
        <canvas
          className={styles.canvas}
          // height and (below) width of the actual image
          // double stage dimensions to avoid the need for
          // resizing the captured image when importing costume
          // to accommodate double resolution bitmaps
          height="720"
          ref={props.canvasRef}
          width="960"
        />
        {props.capture ? <div className={styles.flashOverlay} /> : null}
      </Box>
      {props.capture ? (
        <Box className={styles.buttonRow}>
          <button
            className={styles.retakeButton}
            key="retake-button"
            onClick={props.onBack}
          >
            <img draggable={false} src={GLOBAL_URL.ASSET_ICON_BACK_TURN} />{" "}
            {GLOBAL_L10N("gui.cameraModal.retakePhoto")}
          </button>
          <button className={styles.okButton} onClick={props.onSubmit}>
            {" "}
            {GLOBAL_L10N("gui.cameraModal.save")}
          </button>
        </Box>
      ) : (
        <Box className={styles.mainButtonRow}>
          <button
            className={styles.mainButton}
            disabled={!props.loaded}
            key="capture-button"
            onClick={props.onCapture}
          >
            <img
              className={styles.mainIcon}
              draggable={false}
              src={GLOBAL_URL.ASSET_ICON_CAMERA}
            />
          </button>
          <div className={styles.helpText}>
            {props.access ? (
              <span
                className={
                  props.loaded ? styles.captureText : styles.disabledText
                }
              >
                {props.loaded
                  ? GLOBAL_L10N("gui.cameraModal.takePhoto")
                  : GLOBAL_L10N("gui.cameraModal.loadingCaption")}
              </span>
            ) : (
              <span className={styles.disabledText}>
                {GLOBAL_L10N("gui.cameraModal.enableCameraCaption")}
              </span>
            )}
          </div>
        </Box>
      )}
    </Box>
  </Modal>
);

CameraModal.propTypes = {
  access: PropTypes.bool,
  canvasRef: PropTypes.func.isRequired,
  capture: PropTypes.string,
  loaded: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCapture: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CameraModal;
