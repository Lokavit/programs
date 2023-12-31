import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AlertComponent from "../components/alerts/alert.jsx";
import { openConnectionModal } from "../reducers/modals";
import { setConnectionModalExtensionId } from "../reducers/connection-modal";
import { manualUpdateProject } from "../reducers/project-state";

class Alert extends React.Component {
  constructor(props) {
    super(props);
  }
  handleOnCloseAlert() {
    this.props.onCloseAlert(this.props.index);
  }
  handleOnReconnect() {
    this.props.onOpenConnectionModal(this.props.extensionId);
    this.handleOnCloseAlert();
  }

  downloadProject() {
    this.props.saveProjectSb3().then((content) => {
      if (this.props.onSaveFinished) {
        this.props.onSaveFinished();
      }
      Utility.downloadBlob(this.props.projectFilename, content);
    });
  }

  render() {
    const {
      closeButton,
      content,
      extensionName,
      index, // eslint-disable-line no-unused-vars
      level,
      iconSpinner,
      iconURL,
      message,
      onSaveNow,
      showDownload,
      showReconnect,
      showSaveNow,
    } = this.props;
    return (
      <AlertComponent
        closeButton={closeButton}
        content={content}
        extensionName={extensionName}
        iconSpinner={iconSpinner}
        iconURL={iconURL}
        level={level}
        message={message}
        showDownload={showDownload}
        showReconnect={showReconnect}
        showSaveNow={showSaveNow}
        onCloseAlert={this.handleOnCloseAlert.bind(this)}
        onDownload={this.downloadProject.bind(this)}
        onReconnect={this.handleOnReconnect.bind(this)}
        onSaveNow={onSaveNow}
      />
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  onOpenConnectionModal: (id) => {
    dispatch(setConnectionModalExtensionId(id));
    dispatch(openConnectionModal());
  },
  onSaveNow: () => {
    dispatch(manualUpdateProject());
  },
});

Alert.propTypes = {
  closeButton: PropTypes.bool,
  content: PropTypes.element,
  extensionId: PropTypes.string,
  extensionName: PropTypes.string,
  iconSpinner: PropTypes.bool,
  iconURL: PropTypes.string,
  index: PropTypes.number,
  level: PropTypes.string.isRequired,
  message: PropTypes.string,
  onCloseAlert: PropTypes.func.isRequired,
  onOpenConnectionModal: PropTypes.func,
  onSaveNow: PropTypes.func,
  showDownload: PropTypes.bool,
  showReconnect: PropTypes.bool,
  showSaveNow: PropTypes.bool,
};

export default connect(mapStateToProps, mapDispatchToProps)(Alert);
