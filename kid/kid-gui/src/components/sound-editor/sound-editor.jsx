import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

import Waveform from "../waveform/waveform.jsx";
import Label from "../forms/label.jsx";
import Input from "../forms/input.jsx";

import BufferedInputHOC from "../forms/buffered-input-hoc.jsx";
import AudioSelector from "../../containers/audio-selector.jsx";
import IconButton from "../icon-button/icon-button.jsx";

import styles from "./sound-editor.css";

const BufferedInput = BufferedInputHOC(Input);

const SoundEditor = (props) => (
  <div
    className={styles.editorContainer}
    ref={props.setRef}
    onMouseDown={props.onContainerClick}
  >
    <div className={styles.row}>
      <div className={styles.inputGroup}>
        <Label text={GLOBAL_L10N("gui.soundEditor.sound")}>
          <BufferedInput
            tabIndex="1"
            type="text"
            value={props.name}
            onSubmit={props.onChangeName}
          />
        </Label>
        <div className={styles.buttonGroup}>
          <button
            className={styles.button}
            disabled={!props.canUndo}
            title={GLOBAL_L10N("gui.soundEditor.undo")}
            onClick={props.onUndo}
          >
            <img
              className={styles.undoIcon}
              draggable={false}
              src={GLOBAL_URL.ASSET_ICON_SOUND_UNDO}
            />
          </button>
          <button
            className={styles.button}
            disabled={!props.canRedo}
            title={GLOBAL_L10N("gui.soundEditor.redo")}
            onClick={props.onRedo}
          >
            <img
              className={styles.redoIcon}
              draggable={false}
              src={GLOBAL_URL.ASSET_ICON_SOUND_REDO}
            />
          </button>
        </div>
      </div>
      <div className={styles.inputGroup}>
        <IconButton
          className={styles.toolButton}
          img={GLOBAL_URL.ASSET_ICON_SOUND_COPY}
          title={GLOBAL_L10N("gui.soundEditor.copy")}
          onClick={props.onCopy}
        />
        <IconButton
          className={styles.toolButton}
          disabled={props.canPaste === false}
          img={GLOBAL_URL.ASSET_ICON_SOUND_PASTE}
          title={GLOBAL_L10N("gui.soundEditor.paste")}
          onClick={props.onPaste}
        />
        <IconButton
          className={classNames(styles.toolButton, styles.flipInRtl)}
          img={GLOBAL_URL.ASSET_ICON_SOUND_COPY_TO_NEW}
          title={GLOBAL_L10N("gui.soundEditor.copyToNew")}
          onClick={props.onCopyToNew}
        />
      </div>
      <IconButton
        className={styles.toolButton}
        disabled={props.trimStart === null}
        img={GLOBAL_URL.ASSET_ICON_SOUND_CUT}
        title={GLOBAL_L10N("gui.soundEditor.cut")}
        onClick={props.onDelete}
      />
    </div>
    <div className={styles.row}>
      <div className={styles.waveformContainer}>
        <Waveform data={props.chunkLevels} height={160} width={600} />
        <AudioSelector
          playhead={props.playhead}
          trimEnd={props.trimEnd}
          trimStart={props.trimStart}
          onPlay={props.onPlay}
          onSetTrim={props.onSetTrim}
          onStop={props.onStop}
        />
      </div>
    </div>
    <div className={classNames(styles.row, styles.rowReverse)}>
      <div className={styles.inputGroup}>
        {props.playhead ? (
          <button
            className={classNames(styles.roundButton, styles.stopButtonn)}
            title={GLOBAL_L10N("gui.soundEditor.stop")}
            onClick={props.onStop}
          >
            <img draggable={false} src={GLOBAL_URL.ASSET_ICON_SOUND_STOP} />
          </button>
        ) : (
          <button
            className={classNames(styles.roundButton, styles.playButton)}
            title={GLOBAL_L10N("gui.soundEditor.play")}
            onClick={props.onPlay}
          >
            <img draggable={false} src={GLOBAL_URL.ASSET_ICON_SOUND_PLAY} />
          </button>
        )}
      </div>
      <IconButton
        className={styles.effectButton}
        img={GLOBAL_URL.ASSET_ICON_SOUND_FASTER}
        title={GLOBAL_L10N("gui.soundEditor.faster")}
        onClick={props.onFaster}
      />
      <IconButton
        className={styles.effectButton}
        img={GLOBAL_URL.ASSET_ICON_SOUND_SLOWER}
        title={GLOBAL_L10N("gui.soundEditor.slower")}
        onClick={props.onSlower}
      />
      <IconButton
        disabled={props.tooLoud}
        className={classNames(styles.effectButton, styles.flipInRtl)}
        img={GLOBAL_URL.ASSET_ICON_SOUND_LOUDER}
        title={GLOBAL_L10N("gui.soundEditor.louder")}
        onClick={props.onLouder}
      />
      <IconButton
        className={classNames(styles.effectButton, styles.flipInRtl)}
        img={GLOBAL_URL.ASSET_ICON_SOUND_SOFTER}
        title={GLOBAL_L10N("gui.soundEditor.softer")}
        onClick={props.onSofter}
      />
      <IconButton
        className={classNames(styles.effectButton, styles.flipInRtl)}
        img={GLOBAL_URL.ASSET_ICON_SOUND_MUTE}
        title={GLOBAL_L10N("gui.soundEditor.mute")}
        onClick={props.onMute}
      />
      <IconButton
        className={styles.effectButton}
        img={GLOBAL_URL.ASSET_ICON_SOUND_FADE_IN}
        title={GLOBAL_L10N("gui.soundEditor.fadeIn")}
        onClick={props.onFadeIn}
      />
      <IconButton
        className={styles.effectButton}
        img={GLOBAL_URL.ASSET_ICON_SOUND_FADE_OUT}
        title={GLOBAL_L10N("gui.soundEditor.fadeOut")}
        onClick={props.onFadeOut}
      />
      <IconButton
        className={styles.effectButton}
        img={GLOBAL_URL.ASSET_ICON_SOUND_REVERSE}
        title={GLOBAL_L10N("gui.soundEditor.reverse")}
        onClick={props.onReverse}
      />
      <IconButton
        className={styles.effectButton}
        img={GLOBAL_URL.ASSET_ICON_SOUND_ROBOT}
        title={GLOBAL_L10N("gui.soundEditor.robot")}
        onClick={props.onRobot}
      />
    </div>
  </div>
);

SoundEditor.propTypes = {
  canPaste: PropTypes.bool.isRequired,
  canRedo: PropTypes.bool.isRequired,
  canUndo: PropTypes.bool.isRequired,
  chunkLevels: PropTypes.arrayOf(PropTypes.number).isRequired,
  name: PropTypes.string.isRequired,
  onChangeName: PropTypes.func.isRequired,
  onContainerClick: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  onCopyToNew: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onEcho: PropTypes.func.isRequired,
  onFadeIn: PropTypes.func.isRequired,
  onFadeOut: PropTypes.func.isRequired,
  onFaster: PropTypes.func.isRequired,
  onLouder: PropTypes.func.isRequired,
  onMute: PropTypes.func.isRequired,
  onPaste: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
  onReverse: PropTypes.func.isRequired,
  onRobot: PropTypes.func.isRequired,
  onSetTrim: PropTypes.func,
  onSlower: PropTypes.func.isRequired,
  onSofter: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onUndo: PropTypes.func.isRequired,
  playhead: PropTypes.number,
  setRef: PropTypes.func,
  tooLoud: PropTypes.bool.isRequired,
  trimEnd: PropTypes.number,
  trimStart: PropTypes.number,
};

export default SoundEditor;
