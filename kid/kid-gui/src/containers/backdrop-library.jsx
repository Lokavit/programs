import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";

import backdropLibraryContent from "../lib/libraries/backdrops.json";
import LibraryComponent from "../components/mine-library/library.jsx";

const backdropTags = [
  { tag: "fantasy" },
  { tag: "music" },
  { tag: "sports" },
  { tag: "outdoors" },
  { tag: "indoors" },
  { tag: "space" },
  { tag: "underwater" },
  { tag: "patterns" },
];

class BackdropLibrary extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, ["handleItemSelect"]);
  }
  handleItemSelect(item) {
    const vmBackdrop = {
      name: item.name,
      rotationCenterX: item.info[0] && item.info[0] / 2,
      rotationCenterY: item.info[1] && item.info[1] / 2,
      bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
      skinId: null,
    };
    // Do not switch to stage, just add the backdrop
    VM.addBackdrop(item.md5, vmBackdrop);
  }
  render() {
    return (
      <LibraryComponent
        data={backdropLibraryContent}
        id="backdropLibrary"
        type={3}
        typeName={GLOBAL_L10N("gui.costumeLibrary.backdropLib")}
        tags={backdropTags}
        title={GLOBAL_L10N("gui.costumeLibrary.chooseABackdrop")}
        onItemSelected={this.handleItemSelect}
        onRequestClose={this.props.onRequestClose}
      />
    );
  }
}

BackdropLibrary.propTypes = {
  onRequestClose: PropTypes.func,
};

export default BackdropLibrary;
