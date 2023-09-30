/*
 * @Author: Satya
 * @Date: 2020-08-02 18:47:47
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-19 21:39:11
 * doc:
 *  更换扩展库预览文件在本文件的使用
 */

import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";

// 新写的加载扩展库预览方式
import { EXTENSIONLIBRARY_DATA } from "../lib/libraries/extension-library-data";

import LibraryComponent from "../components/library/library.jsx";
// import extensionIcon from "../components/action-menu/icon--sprite.svg";

class ExtensionLibrary extends React.PureComponent {
  constructor(props) {
    super(props);
    bindAll(this, ["handleItemSelect"]);
  }
  handleItemSelect(item) {
    const id = item.extensionId;
    let url = item.extensionURL ? item.extensionURL : id;
    if (!item.disabled && !id) {
      url = prompt(GLOBAL_L10N("gui.extensionLibrary.extensionUrl"));
    }
    if (id && !item.disabled) {
      if (VM.extensionManager.isExtensionLoaded(url)) {
        this.props.onCategorySelected(id);
      } else {
        VM.extensionManager.loadExtensionURL(url).then(() => {
          this.props.onCategorySelected(id);
        });
      }
    }
  }
  render() {
    // const extensionLibraryThumbnailData = extensionLibraryContent.map(
    const extensionLibraryThumbnailData = EXTENSIONLIBRARY_DATA().map(
      (extension) => ({
        rawURL: extension.iconURL || GLOBAL_URL.ASSET_ICON_ADD_COSTUME,
        ...extension,
      })
    );

    return (
      <LibraryComponent
        data={extensionLibraryThumbnailData}
        filterable={false}
        id="extensionLibrary"
        title={GLOBAL_L10N("gui.extensionLibrary.chooseAnExtension")}
        visible={this.props.visible}
        onItemSelected={this.handleItemSelect}
        onRequestClose={this.props.onRequestClose}
      />
    );
  }
}

ExtensionLibrary.propTypes = {
  onCategorySelected: PropTypes.func,
  onRequestClose: PropTypes.func,
  visible: PropTypes.bool,
};

export default ExtensionLibrary;
