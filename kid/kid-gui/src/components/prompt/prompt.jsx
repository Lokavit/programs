import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Box from "../box/box.jsx";
import Modal from "../../containers/modal.jsx";

import styles from "./prompt.css";

const PromptComponent = (props) => (
  <Modal
    className={styles.modalContent}
    contentLabel={props.title}
    onRequestClose={props.onCancel}
  >
    <Box className={styles.body}>
      <Box className={styles.label}>{props.label}</Box>
      <Box>
        <input
          autoFocus
          className={styles.variableNameTextInput}
          defaultValue={props.defaultValue}
          name={props.label}
          onChange={props.onChange}
          onFocus={props.onFocus}
          onKeyPress={props.onKeyPress}
        />
      </Box>
      {props.showVariableOptions ? (
        <div>
          {props.isStage ? (
            <div className={styles.infoMessage}>
              {GLOBAL_L10N("gui.gui.variablePromptAllSpritesMessage")}
            </div>
          ) : (
            <Box className={styles.optionsRow}>
              <label>
                <input
                  checked={props.globalSelected}
                  name="variableScopeOption"
                  type="radio"
                  value="global"
                  onChange={props.onScopeOptionSelection}
                />
                {GLOBAL_L10N("gui.gui.variableScopeOptionAllSprites")}
              </label>
              <label
                className={classNames({
                  [styles.disabledLabel]: props.cloudSelected,
                })}
              >
                <input
                  checked={!props.globalSelected}
                  disabled={props.cloudSelected}
                  name="variableScopeOption"
                  type="radio"
                  value="local"
                  onChange={props.onScopeOptionSelection}
                />
                {GLOBAL_L10N("gui.gui.variableScopeOptionSpriteOnly")}
              </label>
            </Box>
          )}
          {props.showCloudOption ? (
            <Box className={classNames(styles.cloudOption)}>
              <label
                className={classNames({
                  [styles.disabledLabel]: !props.canAddCloudVariable,
                })}
              >
                <input
                  checked={props.cloudSelected && props.canAddCloudVariable}
                  disabled={!props.canAddCloudVariable}
                  type="checkbox"
                  onChange={props.onCloudVarOptionChange}
                />
                {GLOBAL_L10N("gui.gui.cloudVariableOption")}
              </label>
            </Box>
          ) : null}
        </div>
      ) : null}

      <Box className={styles.buttonRow}>
        <button className={styles.cancelButton} onClick={props.onCancel}>
          {GLOBAL_L10N("gui.prompt.cancel")}
        </button>
        <button className={styles.okButton} onClick={props.onOk}>
          {GLOBAL_L10N("gui.prompt.ok")}
        </button>
      </Box>
    </Box>
  </Modal>
);

PromptComponent.propTypes = {
  canAddCloudVariable: PropTypes.bool.isRequired,
  cloudSelected: PropTypes.bool.isRequired,
  defaultValue: PropTypes.string,
  globalSelected: PropTypes.bool.isRequired,
  isStage: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onCloudVarOptionChange: PropTypes.func,
  onFocus: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  onScopeOptionSelection: PropTypes.func.isRequired,
  showCloudOption: PropTypes.bool.isRequired,
  showVariableOptions: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default PromptComponent;
