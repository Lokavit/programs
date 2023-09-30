import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import ReactModal from "react-modal";

import Button from "../button/button.jsx";
import CloseButton from "../close-button/close-button.jsx";

import styles from "./modal.css";

const ModalComponent = (props) => (
  <ReactModal
    isOpen
    className={classNames(styles.modalContent, props.className, {
      [styles.fullScreen]: props.fullScreen,
    })}
    contentLabel={props.contentLabel}
    overlayClassName={classNames(styles.modalOverlay, props.overlayClassName)}
    onRequestClose={props.onRequestClose}
  >
    <div dir={props.isRtl ? "rtl" : "ltr"} direction="column" grow={1}>
      <div className={classNames(styles.header, props.headerClassName)}>
        {props.onHelp ? (
          <div className={classNames(styles.headerItem, styles.headerItemHelp)}>
            <Button
              className={styles.helpButton}
              iconSrc={GLOBAL_URL.ASSET_ICON_HELP}
              onClick={props.onHelp}
            >
              {GLOBAL_L10N("gui.modal.help")}
            </Button>
          </div>
        ) : null}
        <div className={classNames(styles.headerItem, styles.headerItemTitle)}>
          {props.headerImage ? (
            <img className={styles.headerImage} src={props.headerImage} />
          ) : null}
          {props.contentLabel}
        </div>
        <div className={classNames(styles.headerItem, styles.headerItemClose)}>
          {props.fullScreen ? (
            <Button
              className={styles.backButton}
              iconSrc={GLOBAL_URL.ASSET_ICON_BACK}
              onClick={props.onRequestClose}
            >
              {GLOBAL_L10N("gui.modal.back")}
            </Button>
          ) : (
            <CloseButton
              size={CloseButton.SIZE_LARGE}
              onClick={props.onRequestClose}
            />
          )}
        </div>
      </div>
      {props.children}
    </div>
  </ReactModal>
);

ModalComponent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
  contentLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    .isRequired,
  fullScreen: PropTypes.bool,
  headerClassName: PropTypes.string,
  headerImage: PropTypes.string,
  isRtl: PropTypes.bool,
  onHelp: PropTypes.func,
  onRequestClose: PropTypes.func,
};

export default ModalComponent;
