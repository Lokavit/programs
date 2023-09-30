const OPEN_MODAL = "pro-gui/modals/OPEN_MODAL";
const CLOSE_MODAL = "pro-gui/modals/CLOSE_MODAL";

const MODAL_CAMERA_CAPTURE = "cameraCapture";
const MODAL_COSTUME_LIBRARY = "costumeLibrary";
const MODAL_EXTENSION_LIBRARY = "extensionLibrary";
const MODAL_SOUND_LIBRARY = "soundLibrary";
const MODAL_SOUND_RECORDER = "soundRecorder";
const MODAL_CONNECTION = "connectionModal";
const MODAL_TIPS_LIBRARY = "tipsLibrary";

const initialState = {
  [MODAL_CAMERA_CAPTURE]: false,
  [MODAL_COSTUME_LIBRARY]: false,
  [MODAL_EXTENSION_LIBRARY]: false,
  [MODAL_SOUND_LIBRARY]: false,
  [MODAL_SOUND_RECORDER]: false,
  [MODAL_CONNECTION]: false,
  [MODAL_TIPS_LIBRARY]: false,
};

const reducer = function (state, action) {
  if (typeof state === "undefined") state = initialState;
  switch (action.type) {
    case OPEN_MODAL:
      return Object.assign({}, state, {
        [action.modal]: true,
      });
    case CLOSE_MODAL:
      return Object.assign({}, state, {
        [action.modal]: false,
      });
    default:
      return state;
  }
};
const openModal = function (modal) {
  return {
    type: OPEN_MODAL,
    modal: modal,
  };
};
const closeModal = function (modal) {
  return {
    type: CLOSE_MODAL,
    modal: modal,
  };
};

const openCameraCapture = function () {
  return openModal(MODAL_CAMERA_CAPTURE);
};
const openCostumeLibrary = function () {
  return openModal(MODAL_COSTUME_LIBRARY);
};
const openExtensionLibrary = function () {
  return openModal(MODAL_EXTENSION_LIBRARY);
};
const openSoundLibrary = function () {
  return openModal(MODAL_SOUND_LIBRARY);
};
const openSoundRecorder = function () {
  return openModal(MODAL_SOUND_RECORDER);
};
const openConnectionModal = function () {
  return openModal(MODAL_CONNECTION);
};
const openTipsLibrary = function () {
  return openModal(MODAL_TIPS_LIBRARY);
};
const closeCameraCapture = function () {
  return closeModal(MODAL_CAMERA_CAPTURE);
};
const closeCostumeLibrary = function () {
  return closeModal(MODAL_COSTUME_LIBRARY);
};
const closeExtensionLibrary = function () {
  return closeModal(MODAL_EXTENSION_LIBRARY);
};
const closeSoundLibrary = function () {
  return closeModal(MODAL_SOUND_LIBRARY);
};
const closeSoundRecorder = function () {
  return closeModal(MODAL_SOUND_RECORDER);
};
const closeTipsLibrary = function () {
  return closeModal(MODAL_TIPS_LIBRARY);
};
const closeConnectionModal = function () {
  return closeModal(MODAL_CONNECTION);
};
export {
  reducer as default,
  initialState as modalsInitialState,
  openCameraCapture,
  openCostumeLibrary,
  openExtensionLibrary,
  openSoundLibrary,
  openSoundRecorder,
  openTipsLibrary,
  openConnectionModal,
  closeCameraCapture,
  closeCostumeLibrary,
  closeExtensionLibrary,
  closeSoundLibrary,
  closeSoundRecorder,
  closeTipsLibrary,
  closeConnectionModal,
};
