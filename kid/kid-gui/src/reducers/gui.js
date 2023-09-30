import { applyMiddleware, compose, combineReducers } from "redux";
import alertsReducer, { alertsInitialState } from "./alerts";
import assetDragReducer, { assetDragInitialState } from "./asset-drag";
import colorPickerReducer, { colorPickerInitialState } from "./color-picker";
import connectionModalReducer, {
  connectionModalInitialState,
} from "./connection-modal";
import customProceduresReducer, {
  customProceduresInitialState,
} from "./custom-procedures";
import blockDragReducer, { blockDragInitialState } from "./block-drag";
import hoveredTargetReducer, {
  hoveredTargetInitialState,
} from "./hovered-target";
import micIndicatorReducer, { micIndicatorInitialState } from "./mic-indicator";
import modalReducer, { modalsInitialState } from "./modals";
import monitorReducer, { monitorsInitialState } from "./monitors";
import monitorLayoutReducer, {
  monitorLayoutInitialState,
} from "./monitor-layout";
import projectStateReducer, { projectStateInitialState } from "./project-state";
import restoreDeletionReducer, {
  restoreDeletionInitialState,
} from "./restore-deletion";
import stageSizeReducer, { stageSizeInitialState } from "./stage-size";
import targetReducer, { targetsInitialState } from "./targets";
import timeoutReducer, { timeoutInitialState } from "./timeout";
import toolboxReducer, { toolboxInitialState } from "./toolbox";
import throttle from "redux-throttle";

// import mineStateReducer, { mineInitialState } from "./mine-state";

const guiMiddleware = compose(
  applyMiddleware(throttle(300, { leading: true, trailing: true }))
);

const guiInitialState = {
  alerts: alertsInitialState,
  assetDrag: assetDragInitialState,
  blockDrag: blockDragInitialState,
  colorPicker: colorPickerInitialState,
  connectionModal: connectionModalInitialState,
  customProcedures: customProceduresInitialState,
  hoveredTarget: hoveredTargetInitialState,
  stageSize: stageSizeInitialState,
  micIndicator: micIndicatorInitialState,
  modals: modalsInitialState,
  monitors: monitorsInitialState,
  monitorLayout: monitorLayoutInitialState,
  projectState: projectStateInitialState,
  restoreDeletion: restoreDeletionInitialState,
  targets: targetsInitialState,
  timeout: timeoutInitialState,
  toolbox: toolboxInitialState,
};

// const initEmbedded = function (currentState) {
//   return Object.assign({}, currentState, {
//     mode: {
//       // showBranding: true,
//       // isFullScreen: true,
//       // isPlayerOnly: true,
//       // hasEverEnteredEditor: false,
//     },
//   });
// };

const guiReducer = combineReducers({
  alerts: alertsReducer,
  assetDrag: assetDragReducer,
  blockDrag: blockDragReducer,
  colorPicker: colorPickerReducer,
  connectionModal: connectionModalReducer,
  customProcedures: customProceduresReducer,
  // mode: modeReducer,
  hoveredTarget: hoveredTargetReducer,
  stageSize: stageSizeReducer,
  micIndicator: micIndicatorReducer,
  modals: modalReducer,
  monitors: monitorReducer,
  monitorLayout: monitorLayoutReducer,
  projectState: projectStateReducer,
  restoreDeletion: restoreDeletionReducer,
  targets: targetReducer,
  timeout: timeoutReducer,
  toolbox: toolboxReducer,
});

export {
  guiReducer as default,
  guiInitialState,
  guiMiddleware,
  // initEmbedded,
  // initFullScreen,
  // initPlayer,
};
