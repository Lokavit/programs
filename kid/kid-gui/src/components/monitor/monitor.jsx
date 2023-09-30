import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Draggable from "react-draggable";
import { ContextMenuTrigger } from "react-contextmenu";
import {
  BorderedMenuItem,
  ContextMenu,
} from "../context-menu/context-menu.jsx";
import Box from "../box/box.jsx";
import DefaultMonitor from "./default-monitor.jsx";
import LargeMonitor from "./large-monitor.jsx";
import SliderMonitor from "../../containers/slider-monitor.jsx";
import ListMonitor from "../../containers/list-monitor.jsx";

import styles from "./monitor.css";

const categories = {
  data: "#FF8C1A",
  sensing: "#5CB1D6",
  sound: "#CF63CF",
  looks: "#9966FF",
  motion: "#4C97FF",
  list: "#FC662C",
  extension: "#0FBD8C",
};

const modes = {
  default: DefaultMonitor,
  large: LargeMonitor,
  slider: SliderMonitor,
  list: ListMonitor,
};

const MonitorComponent = (props) => (
  <ContextMenuTrigger
    disable={!props.draggable}
    holdToDisplay={props.mode === "slider" ? -1 : 1000}
    id={`monitor-${props.label}`}
  >
    <Draggable
      bounds=".monitor-overlay" // Class for monitor container
      cancel=".no-drag" // Class used for slider input to prevent drag
      defaultClassNameDragging={styles.dragging}
      disabled={!props.draggable}
      onStop={props.onDragEnd}
    >
      <Box
        className={styles.monitorContainer}
        componentRef={props.componentRef}
        onDoubleClick={
          props.mode === "list" || !props.draggable ? null : props.onNextMode
        }
      >
        {React.createElement(modes[props.mode], {
          categoryColor: categories[props.category],
          ...props,
        })}
      </Box>
    </Draggable>
    {ReactDOM.createPortal(
      // Use a portal to render the context menu outside the flow to avoid
      // positioning conflicts between the monitors `transform: scale` and
      // the context menus `position: fixed`. For more details, see
      // http://meyerweb.com/eric/thoughts/2011/09/12/un-fixing-fixed-elements-with-css-transforms/
      <ContextMenu id={`monitor-${props.label}`}>
        {props.onSetModeToDefault && (
          <li onClick={props.onSetModeToDefault}>
            {GLOBAL_L10N("gui.monitor.contextMenu.default")}
          </li>
        )}
        {props.onSetModeToLarge && (
          <li onClick={props.onSetModeToLarge}>
            {GLOBAL_L10N("gui.monitor.contextMenu.large")}
          </li>
        )}
        {props.onSetModeToSlider && (
          <li onClick={props.onSetModeToSlider}>
            {GLOBAL_L10N("gui.monitor.contextMenu.slider")}
          </li>
        )}
        {props.onSliderPromptOpen && props.mode === "slider" && (
          <BorderedMenuItem onClick={props.onSliderPromptOpen}>
            {GLOBAL_L10N("gui.monitor.contextMenu.sliderRange")}
          </BorderedMenuItem>
        )}
        {props.onImport && (
          <li onClick={props.onImport}>
            {GLOBAL_L10N("gui.monitor.contextMenu.import")}
          </li>
        )}
        {props.onExport && (
          <li onClick={props.onExport}>
            {GLOBAL_L10N("gui.monitor.contextMenu.export")}
          </li>
        )}
      </ContextMenu>,
      document.body
    )}
  </ContextMenuTrigger>
);

MonitorComponent.categories = categories;

const monitorModes = Object.keys(modes);

MonitorComponent.propTypes = {
  category: PropTypes.oneOf(Object.keys(categories)),
  componentRef: PropTypes.func.isRequired,
  draggable: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(monitorModes),
  onDragEnd: PropTypes.func.isRequired,
  onExport: PropTypes.func,
  onImport: PropTypes.func,
  onNextMode: PropTypes.func.isRequired,
  onSetModeToDefault: PropTypes.func,
  onSetModeToLarge: PropTypes.func,
  onSetModeToSlider: PropTypes.func,
  onSliderPromptOpen: PropTypes.func,
};

MonitorComponent.defaultProps = {
  category: "extension",
  mode: "default",
};

export { MonitorComponent as default, monitorModes };
