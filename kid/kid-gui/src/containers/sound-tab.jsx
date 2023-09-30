import PropTypes from "prop-types";
import React from "react";
import bindAll from "lodash.bindall";

import Selector from "../components/asset-panel/selector.jsx";

import RecordModal from "./record-modal.jsx";
import SoundEditor from "./sound-editor.jsx";
import SoundLibrary from "./sound-library.jsx";

import soundLibraryContent from "../lib/libraries/sounds.json";
import { handleFileUpload, soundUpload } from "../lib/file-uploader.js";
// import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import DragConstants from "../lib/drag-constants";

import { connect } from "react-redux";

import {
  closeSoundLibrary,
  openSoundLibrary,
  openSoundRecorder,
} from "../reducers/modals";

import { setRestore } from "../reducers/restore-deletion";
import { showStandardAlert, closeAlertWithId } from "../reducers/alerts";

class SoundTab extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, [
      "handleSelectSound",
      "handleDeleteSound",
      "handleDuplicateSound",
      "handleExportSound",
      "handleNewSound",
      "handleSurpriseSound",
      "handleFileUploadClick",
      "handleSoundUpload",
      "handleDrop",
      "setFileInput",
    ]);
    this.state = { selectedSoundIndex: 0 };
  }

  componentWillReceiveProps(nextProps) {
    const { editingTarget, sprites, stage } = nextProps;

    const target =
      editingTarget && sprites[editingTarget] ? sprites[editingTarget] : stage;
    if (!target || !target.sounds) {
      return;
    }

    // If switching editing targets, reset the sound index
    if (this.props.editingTarget !== editingTarget) {
      this.setState({ selectedSoundIndex: 0 });
    } else if (this.state.selectedSoundIndex > target.sounds.length - 1) {
      this.setState({
        selectedSoundIndex: Math.max(target.sounds.length - 1, 0),
      });
    }
  }

  handleSelectSound(soundIndex) {
    this.setState({ selectedSoundIndex: soundIndex });
  }

  handleDeleteSound(soundIndex) {
    const restoreFun = VM.deleteSound(soundIndex);
    if (soundIndex >= this.state.selectedSoundIndex) {
      this.setState({ selectedSoundIndex: Math.max(0, soundIndex - 1) });
    }
    this.props.dispatchUpdateRestore({ restoreFun, deletedItem: "Sound" });
  }

  handleExportSound(soundIndex) {
    const item = VM.editingTarget.sprite.sounds[soundIndex];
    const blob = new Blob([item.asset.data], {
      type: item.asset.assetType.contentType,
    });
    Utility.downloadBlob(`${item.name}.${item.asset.dataFormat}`, blob);
  }

  handleDuplicateSound(soundIndex) {
    VM.duplicateSound(soundIndex).then(() => {
      this.setState({ selectedSoundIndex: soundIndex + 1 });
    });
  }

  handleNewSound() {
    if (!VM.editingTarget) {
      return null;
    }
    const sprite = VM.editingTarget.sprite;
    const sounds = sprite.sounds ? sprite.sounds : [];
    this.setState({ selectedSoundIndex: Math.max(sounds.length - 1, 0) });
  }

  handleSurpriseSound() {
    const soundItem =
      soundLibraryContent[
        Math.floor(Math.random() * soundLibraryContent.length)
      ];
    const vmSound = {
      format: soundItem.format,
      md5: soundItem.md5,
      rate: soundItem.rate,
      sampleCount: soundItem.sampleCount,
      name: soundItem.name,
    };
    VM.addSound(vmSound).then(() => {
      this.handleNewSound();
    });
  }

  handleFileUploadClick() {
    this.fileInput.click();
  }

  handleSoundUpload(e) {
    const storage = VM.runtime.storage;
    this.props.onShowImporting();
    handleFileUpload(
      e.target,
      (buffer, fileType, fileName, fileIndex, fileCount) => {
        soundUpload(buffer, fileType, storage, (newSound) => {
          newSound.name = fileName;
          VM.addSound(newSound).then(() => {
            this.handleNewSound();
            if (fileIndex === fileCount - 1) {
              this.props.onCloseImporting();
            }
          });
        });
      },
      this.props.onCloseImporting
    );
  }

  handleDrop(dropInfo) {
    if (dropInfo.dragType === DragConstants.SOUND) {
      const sprite = VM.editingTarget.sprite;
      const activeSound = sprite.sounds[this.state.selectedSoundIndex];

      VM.reorderSound(VM.editingTarget.id, dropInfo.index, dropInfo.newIndex);

      this.setState({ selectedSoundIndex: sprite.sounds.indexOf(activeSound) });
    } else if (dropInfo.dragType === DragConstants.BACKPACK_COSTUME) {
      // this.props.onActivateCostumesTab();
      VM.addCostume(dropInfo.payload.body, {
        name: dropInfo.payload.name,
      });
    } else if (dropInfo.dragType === DragConstants.BACKPACK_SOUND) {
      VM.addSound({
        md5: dropInfo.payload.body,
        name: dropInfo.payload.name,
      }).then(this.handleNewSound);
    }
  }

  setFileInput(input) {
    this.fileInput = input;
  }

  render() {
    // const {
    //   dispatchUpdateRestore, // eslint-disable-line no-unused-vars
    //   intl,
    //   isRtl,
    //   vm,
    //   onNewSoundFromLibraryClick,
    //   onNewSoundFromRecordingClick,
    // } = this.props;

    if (!VM.editingTarget) {
      return null;
    }

    const sprite = VM.editingTarget.sprite;

    const sounds = sprite.sounds
      ? sprite.sounds.map((sound) => ({
          url: GLOBAL_URL.ASSET_ICON_SOUND_LTR,
          name: sound.name,
          details: (sound.sampleCount / sound.rate).toFixed(2),
          dragPayload: sound,
        }))
      : [];

    // const messages = defineMessages({
    //   fileUploadSound: {
    //     defaultMessage: "Upload Sound",
    //     description: "Button to upload sound from file in the editor tab",
    //     id: "gui.soundTab.fileUploadSound",
    //   },
    //   surpriseSound: {
    //     defaultMessage: "Surprise",
    //     description: "Button to get a random sound in the editor tab",
    //     id: "gui.soundTab.surpriseSound",
    //   },
    //   recordSound: {
    //     defaultMessage: "Record",
    //     description: "Button to record a sound in the editor tab",
    //     id: "gui.soundTab.recordSound",
    //   },
    //   addSound: {
    //     defaultMessage: "Choose a Sound",
    //     description: "Button to add a sound in the editor tab",
    //     id: "gui.soundTab.addSoundFromLibrary",
    //   },
    // });

    return (
      <div className="asset_panel_wrapper">
        <Selector
          // buttons={[
          //   {
          //     title: intl.formatMessage(messages.addSound),
          //     img: GLOBAL_URL.ASSET_ICON_ADD_SOUND_LIB,
          //     onClick: onNewSoundFromLibraryClick,
          //   },
          //   {
          //     title: intl.formatMessage(messages.fileUploadSound),
          //     img: GLOBAL_URL.ASSET_ICON_FILE_UPLOAD,
          //     onClick: this.handleFileUploadClick,
          //     fileAccept: ".wav, .mp3",
          //     fileChange: this.handleSoundUpload,
          //     fileInput: this.setFileInput,
          //     fileMultiple: true,
          //   },
          //   {
          //     title: intl.formatMessage(messages.surpriseSound),
          //     img: GLOBAL_URL.ASSET_ICON_SURPRISE,
          //     onClick: this.handleSurpriseSound,
          //   },
          //   {
          //     title: intl.formatMessage(messages.recordSound),
          //     img: GLOBAL_URL.ASSET_ICON_ADD_SOUND_RECORD,
          //     onClick: onNewSoundFromRecordingClick,
          //   },
          //   {
          //     title: intl.formatMessage(messages.addSound),
          //     img: GLOBAL_URL.ASSET_ICON_SEARCH,
          //     onClick: onNewSoundFromLibraryClick,
          //   },
          // ]}
          dragType={DragConstants.SOUND}
          // isRtl={isRtl}
          items={sounds}
          selectedItemIndex={this.state.selectedSoundIndex}
          onDeleteClick={this.handleDeleteSound}
          onDrop={this.handleDrop}
          onDuplicateClick={this.handleDuplicateSound}
          onExportClick={this.handleExportSound}
          onItemClick={this.handleSelectSound}
        />
        <div className="asset_panel_detail_area">
          {sprite.sounds && sprite.sounds[this.state.selectedSoundIndex] ? (
            <SoundEditor soundIndex={this.state.selectedSoundIndex} />
          ) : null}
          {this.props.soundRecorderVisible ? (
            <RecordModal onNewSound={this.handleNewSound} />
          ) : null}
          {this.props.soundLibraryVisible ? (
            <SoundLibrary
              vm={VM}
              onNewSound={this.handleNewSound}
              onRequestClose={this.props.onRequestCloseSoundLibrary}
            />
          ) : null}
        </div>
      </div>
    );
  }
}

SoundTab.propTypes = {
  dispatchUpdateRestore: PropTypes.func,
  editingTarget: PropTypes.string,
  // intl: intlShape,
  // isRtl: PropTypes.bool,
  // onActivateCostumesTab: PropTypes.func.isRequired,
  onCloseImporting: PropTypes.func.isRequired,
  onNewSoundFromLibraryClick: PropTypes.func.isRequired,
  onNewSoundFromRecordingClick: PropTypes.func.isRequired,
  onRequestCloseSoundLibrary: PropTypes.func.isRequired,
  onShowImporting: PropTypes.func.isRequired,
  soundLibraryVisible: PropTypes.bool,
  soundRecorderVisible: PropTypes.bool,
  sprites: PropTypes.shape({
    id: PropTypes.shape({
      sounds: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
        })
      ),
    }),
  }),
  stage: PropTypes.shape({
    sounds: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      })
    ),
  }),
};

const mapStateToProps = (state) => ({
  editingTarget: state.scratchGui.targets.editingTarget,
  sprites: state.scratchGui.targets.sprites,
  stage: state.scratchGui.targets.stage,
  soundLibraryVisible: state.scratchGui.modals.soundLibrary,
  soundRecorderVisible: state.scratchGui.modals.soundRecorder,
});

const mapDispatchToProps = (dispatch) => ({
  // onActivateCostumesTab: () => dispatch(activateTab(COSTUMES_TAB_INDEX)),
  onNewSoundFromLibraryClick: (e) => {
    e.preventDefault();
    dispatch(openSoundLibrary());
  },
  onNewSoundFromRecordingClick: () => {
    dispatch(openSoundRecorder());
  },
  onRequestCloseSoundLibrary: () => {
    dispatch(closeSoundLibrary());
  },
  dispatchUpdateRestore: (restoreState) => {
    dispatch(setRestore(restoreState));
  },
  onCloseImporting: () => dispatch(closeAlertWithId("importingAsset")),
  onShowImporting: () => dispatch(showStandardAlert("importingAsset")),
});

export default connect(mapStateToProps, mapDispatchToProps)(SoundTab);
