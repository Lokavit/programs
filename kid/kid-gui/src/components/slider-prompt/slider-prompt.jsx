import PropTypes from "prop-types";
import React from "react";

import Box from "../box/box.jsx";
import Modal from "../../containers/modal.jsx";

import styles from "./slider-prompt.css";

const SliderPromptComponent = (props) => (
  <Modal
    className={styles.modalContent}
    contentLabel={GLOBAL_L10N("gui.sliderModal.title")}
    id="sliderPrompt"
    onRequestClose={props.onCancel}
  >
    <Box className={styles.body}>
      <Box className={styles.label}>{GLOBAL_L10N("gui.sliderModal.min")}</Box>
      <Box>
        <input
          className={styles.minInput}
          name={GLOBAL_L10N("gui.sliderModal.min")}
          pattern="-?[0-9]*(\.[0-9]+)?"
          type="text"
          value={props.minValue}
          onChange={props.onChangeMin}
          onKeyPress={props.onKeyPress}
        />
      </Box>
      <Box className={styles.label}>{GLOBAL_L10N("gui.sliderModal.max")}</Box>
      <Box>
        <input
          className={styles.maxInput}
          name={GLOBAL_L10N("gui.sliderModal.max")}
          pattern="-?[0-9]*(\.[0-9]+)?"
          type="text"
          value={props.maxValue}
          onChange={props.onChangeMax}
          onKeyPress={props.onKeyPress}
        />
      </Box>
      <Box className={styles.buttonRow}>
        <button className={styles.cancelButton} onClick={props.onCancel}>
          {GLOBAL_L10N("gui.sliderPrompt.cancel")}
        </button>
        <button className={styles.okButton} onClick={props.onOk}>
          {GLOBAL_L10N("gui.sliderPrompt.ok")}
        </button>
      </Box>
    </Box>
  </Modal>
);

SliderPromptComponent.propTypes = {
  maxValue: PropTypes.string,
  minValue: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onChangeMax: PropTypes.func.isRequired,
  onChangeMin: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

export default SliderPromptComponent;
