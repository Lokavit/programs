import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

import styles from "./play-button.css";

const PlayButtonComponent = ({
  className,
  isPlaying,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  setButtonRef,
  ...props
}) => {
  const label = isPlaying
    ? GLOBAL_L10N("gui.playButton.play")
    : GLOBAL_L10N("gui.playButton.stop");

  return (
    <div
      aria-label={label}
      className={classNames(styles.playButton, className, {
        [styles.playing]: isPlaying,
      })}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      ref={setButtonRef}
      {...props}
    >
      <img
        className={styles.playIcon}
        draggable={false}
        src={
          isPlaying
            ? GLOBAL_URL.ASSET_ICON_PROJECT_STOP
            : GLOBAL_URL.ASSET_ICON_PROJECT_PLAY
        }
      />
    </div>
  );
};

PlayButtonComponent.propTypes = {
  className: PropTypes.string,
  isPlaying: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  setButtonRef: PropTypes.func.isRequired,
};

export default PlayButtonComponent;
