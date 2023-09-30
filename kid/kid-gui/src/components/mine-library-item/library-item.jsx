import PropTypes from "prop-types";
import React from "react";
import bindAll from "lodash.bindall";
import Box from "../box/box.jsx";
import PlayButton from "../../containers/play-button.jsx";
import styles from "./library-item.css";
import classNames from "classnames";

import { connect } from "react-redux";
// import { favorMaterial } from "../../reducers/mine-state.js";

// import * as Ajax from "../../lib/ajax";

/* eslint-disable react/prefer-stateless-function */

class LibraryItemComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    bindAll(this, [
      // "handleFavor",
      "handleMouseEnter",
      "handleMouseLeave",
    ]);
    this.state = {
      entered: false, //是否鼠标移上去了
    };
  }

  // handleFavor(e) {
  //   e.stopPropagation();

  //   let type = this.props.type;
  //   let id = e.target.dataset.id;

  //   Ajax.get("user/checkLogin").then((res) => {
  //     if (res.success == false) {
  //       // MineBox.error("请先登录");
  //       RETURN_MESSAGE("请先登录");
  //     } else {
  //       this.props.favorMaterial({
  //         id: parseInt(id),
  //         type: parseInt(type),
  //       });
  //     }
  //   });
  // }

  handleMouseEnter() {
    if (this.props.showPlayButton) {
    } else {
      this.props.onMouseEnter();
    }
    this.setState({
      entered: true,
    });
  }

  handleMouseLeave() {
    if (this.props.showPlayButton) {
    } else {
      this.props.onMouseLeave();
    }
    this.setState({
      entered: false,
    });
  }
  render() {
    return this.props.featured ? (
      <div
        className={classNames(
          styles.libraryItem,
          styles.featuredItem,
          {
            [styles.disabled]: this.props.disabled,
          },
          this.props.extensionId ? styles.libraryItemExtension : null,
          this.props.hidden ? styles.hidden : null
        )}
        onClick={this.props.onClick}
      >
        <div className={styles.featuredImageContainer}>
          {this.props.disabled ? (
            <div className={styles.comingSoonText}>
              {GLOBAL_L10N("gui.extensionLibrary.comingSoon")}
            </div>
          ) : null}
          <img className={styles.featuredImage} src={this.props.iconURL} />
        </div>
        {this.props.insetIconURL ? (
          <div className={styles.libraryItemInsetImageContainer}>
            <img
              className={styles.libraryItemInsetImage}
              src={this.props.insetIconURL}
            />
          </div>
        ) : null}
        <div
          className={
            this.props.extensionId
              ? classNames(styles.featuredExtensionText, styles.featuredText)
              : styles.featuredText
          }
        >
          <span className={styles.libraryItemName}>{this.props.name}</span>
          <br />
          <span className={styles.featuredDescription}>
            {this.props.description}
          </span>
        </div>
        {this.props.bluetoothRequired ||
        this.props.internetConnectionRequired ||
        this.props.collaborator ? (
          <div className={styles.featuredExtensionMetadata}>
            <div className={styles.featuredExtensionRequirement}>
              {this.props.bluetoothRequired ||
              this.props.internetConnectionRequired ? (
                <div>
                  <div>{GLOBAL_L10N("gui.extensionLibrary.requires")}</div>
                  <div className={styles.featuredExtensionMetadataDetail}>
                    {this.props.bluetoothRequired ? (
                      <img src={GLOBAL_URL.ASSET_ICON_BLUETOOTH_LIB} />
                    ) : null}
                    {this.props.internetConnectionRequired ? (
                      <img src={GLOBAL_URL.ASSET_ICON_INTERNET_CONNECTION} />
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
            <div className={styles.featuredExtensionCollaboration}>
              {this.props.collaborator ? (
                <div>
                  <div>{GLOBAL_L10N("gui.extensionLibrary.collaboration")}</div>
                  <div className={styles.featuredExtensionMetadataDetail}>
                    {this.props.collaborator}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    ) : (
      <Box
        className={classNames(styles.libraryItem, {
          [styles.hidden]: this.props.hidden,
        })}
        role="button"
        tabIndex="0"
        onBlur={this.props.onBlur}
        onClick={this.props.onClick}
        onFocus={this.props.onFocus}
        onKeyPress={this.props.onKeyPress}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {/* Layers of wrapping is to prevent layout thrashing on animation */}
        <Box className={styles.libraryItemImageContainerWrapper}>
          <Box
            className={styles.libraryItemImageContainer}
            onMouseEnter={
              this.props.showPlayButton ? this.props.onMouseEnter : null
            }
            onMouseLeave={
              this.props.showPlayButton ? this.props.onMouseLeave : null
            }
          >
            <img className={styles.libraryItemImage} src={this.props.iconURL} />
          </Box>
        </Box>
        <span className={styles.libraryItemName}>{this.props.name}</span>
        {this.props.showPlayButton ? (
          <PlayButton
            isPlaying={this.props.isPlaying}
            onPlay={this.props.onPlay}
            onStop={this.props.onStop}
          />
        ) : null}

        {this.state.entered ? (
          <svg
            t="1571823113128"
            className="icon"
            viewBox="0 0 1025 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4998"
            width="26"
            height="26"
          >
            <path
              data-id={this.props.id}
              // onClick={this.handleFavor}
              d="M512 0c-27.733333 0-53.333333 14.933333-66.133333 42.666667l-96 206.933333c-12.8 25.6-36.266667 44.8-64 49.066667L64 330.666667c-59.733333 10.666667-85.333333 83.2-42.666667 125.866666l166.4 170.666667c19.2 19.2 27.733333 46.933333 23.466667 72.533333L170.666667 936.533333c-6.4 49.066667 29.866667 87.466667 72.533333 87.466667 12.8 0 23.466667-2.133333 36.266667-8.533333l196.266666-108.8c10.666667-6.4 23.466667-8.533333 36.266667-8.533334 12.8 0 25.6 2.133333 36.266667 8.533334l196.266666 108.8c10.666667 6.4 23.466667 8.533333 36.266667 8.533333 42.666667 0 81.066667-38.4 72.533333-87.466667l-38.4-236.8c-4.266667-25.6 4.266667-53.333333 23.466667-72.533333l166.4-170.666667c42.666667-42.666667 17.066667-115.2-42.666667-125.866666L740.266667 298.666667c-27.733333-4.266667-53.333333-23.466667-64-49.066667L578.133333 42.666667C565.333333 14.933333 539.733333 0 512 0z"
              fill="#8a8a8a"
              p-id="4999"
              data-spm-anchor-id="a313x.7781069.0.i16"
              className="selected"
            ></path>
          </svg>
        ) : null}
      </Box>
    );
  }
}
/* eslint-enable react/prefer-stateless-function */

LibraryItemComponent.propTypes = {
  id: PropTypes.number.isRequired,
  bluetoothRequired: PropTypes.bool,
  collaborator: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  disabled: PropTypes.bool,
  extensionId: PropTypes.string,
  featured: PropTypes.bool,
  hidden: PropTypes.bool,
  iconURL: PropTypes.string,
  insetIconURL: PropTypes.string,
  internetConnectionRequired: PropTypes.bool,
  isPlaying: PropTypes.bool,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  onBlur: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  showPlayButton: PropTypes.bool,
  // favorMaterial: PropTypes.func,
};

LibraryItemComponent.defaultProps = {
  disabled: false,
  showPlayButton: false,
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  // favorMaterial: (favor) => dispatch(favorMaterial(favor)),
});

export default connect(null, mapDispatchToProps)(LibraryItemComponent);
