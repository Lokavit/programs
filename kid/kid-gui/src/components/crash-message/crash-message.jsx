import PropTypes from "prop-types";
import React from "react";
import Box from "../box/box.jsx";

import styles from "./crash-message.css";

const CrashMessage = (props) => (
  <div className={styles.crashWrapper}>
    <Box className={styles.body}>
      <img
        className={styles.reloadIcon}
        src={GLOBAL_URL.ASSET_ICON_CRASH_RELOAD}
      />
      <h2>{GLOBAL_L10N("gui.crashMessage.label")}</h2>
      <p>{GLOBAL_L10N("gui.crashMessage.description")}</p>
      {props.eventId && (
        <p>
          {/* <FormattedMessage
            defaultMessage="Your error was logged with id {errorId}"
            description="Message to inform the user that page has crashed."
            id="gui.crashMessage.errorNumber"
            values={{
              errorId: props.eventId,
            }}
          />
          {GLOBAL_L10N("gui.crashMessage.errorNumber", `${props.eventId}`)} */}
          Your error was logged with id {errorId}
        </p>
      )}
      <button className={styles.reloadButton} onClick={props.onReload}>
        {GLOBAL_L10N("gui.crashMessage.reload")}
      </button>
    </Box>
  </div>
);

CrashMessage.propTypes = {
  eventId: PropTypes.string,
  onReload: PropTypes.func.isRequired,
};

export default CrashMessage;
