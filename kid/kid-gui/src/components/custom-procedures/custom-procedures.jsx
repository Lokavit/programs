import PropTypes from "prop-types";
import React from "react";
import Modal from "../../containers/modal.jsx";
import Box from "../box/box.jsx";

import styles from "./custom-procedures.css";

const CustomProcedures = (props) => (
  <Modal
    className={styles.modalContent}
    contentLabel={GLOBAL_L10N("gui.customProcedures.myblockModalTitle")}
    onRequestClose={props.onCancel}
  >
    <Box className={styles.workspace} componentRef={props.componentRef} />
    <Box className={styles.body}>
      <div className={styles.optionsRow}>
        <div
          className={styles.optionCard}
          role="button"
          tabIndex="0"
          onClick={props.onAddTextNumber}
        >
          <img
            className={styles.optionIcon}
            src={GLOBAL_URL.ASSET_ICON_CUSTOM_TEXT_INPUT}
          />
          <div className={styles.optionTitle}>
            {GLOBAL_L10N("gui.customProcedures.addAnInputNumberText")}
          </div>
          <div className={styles.optionDescription}>
            {GLOBAL_L10N("gui.customProcedures.numberTextType")}
          </div>
        </div>
        <div
          className={styles.optionCard}
          role="button"
          tabIndex="0"
          onClick={props.onAddBoolean}
        >
          <img
            className={styles.optionIcon}
            src={GLOBAL_URL.ASSET_ICON_CUSTOM_BOOLEAN_INPUT}
          />
          <div className={styles.optionTitle}>
            {GLOBAL_L10N("gui.customProcedures.addAnInputBoolean")}
          </div>
          <div className={styles.optionDescription}>
            {GLOBAL_L10N("gui.customProcedures.booleanType")}
          </div>
        </div>
        <div
          className={styles.optionCard}
          role="button"
          tabIndex="0"
          onClick={props.onAddLabel}
        >
          <img
            className={styles.optionIcon}
            src={GLOBAL_URL.ASSET_ICON_CUSTOM_LABEL}
          />
          <div className={styles.optionTitle}>
            {GLOBAL_L10N("gui.customProcedures.addALabel")}
          </div>
        </div>
      </div>
      <div className={styles.checkboxRow}>
        <label>
          <input
            checked={props.warp}
            type="checkbox"
            onChange={props.onToggleWarp}
          />
          {GLOBAL_L10N("gui.customProcedures.runWithoutScreenRefresh")}
        </label>
      </div>
      <Box className={styles.buttonRow}>
        <button className={styles.cancelButton} onClick={props.onCancel}>
          {GLOBAL_L10N("gui.customProcedures.cancel")}
        </button>
        <button className={styles.okButton} onClick={props.onOk}>
          {GLOBAL_L10N("gui.customProcedures.ok")}
        </button>
      </Box>
    </Box>
  </Modal>
);

CustomProcedures.propTypes = {
  componentRef: PropTypes.func.isRequired,
  onAddBoolean: PropTypes.func.isRequired,
  onAddLabel: PropTypes.func.isRequired,
  onAddTextNumber: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  onToggleWarp: PropTypes.func.isRequired,
  warp: PropTypes.bool.isRequired,
};

export default CustomProcedures;
