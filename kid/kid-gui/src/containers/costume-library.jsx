import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";

import costumeLibraryContent from "../lib/libraries/costumes.json";
import LibraryComponent from "../components/mine-library/library.jsx";

const spriteTags = [
  { tag: "animals" },
  { tag: "people" },
  { tag: "fantasy" },
  { tag: "dance" },
  { tag: "music" },
  { tag: "sports" },
  { tag: "food" },
  { tag: "fashion" },
  { tag: "letters" },
];
class CostumeLibrary extends React.PureComponent {
  constructor(props) {
    super(props);
    bindAll(this, ["handleItemSelected"]);
  }
  handleItemSelected(item) {
    const split = item.md5.split(".");
    const type = split.length > 1 ? split[1] : null;
    const rotationCenterX = type === "svg" ? item.info[0] : item.info[0] / 2;
    const rotationCenterY = type === "svg" ? item.info[1] : item.info[1] / 2;
    const vmCostume = {
      name: item.name,
      rotationCenterX,
      rotationCenterY,
      bitmapResolution: item.info.length > 2 ? item.info[2] : 1,
      skinId: null,
    };
    VM.addCostumeFromLibrary(item.md5, vmCostume);
  }
  render() {
    return (
      <LibraryComponent
        id="costumeLibrary"
        type={2}
        typeName="造型库"
        tags={spriteTags}
        title={GLOBAL_L10N("gui.costumeLibrary.chooseACostume")}
        onItemSelected={this.handleItemSelected}
        onRequestClose={this.props.onRequestClose}
      />
    );
  }
}

CostumeLibrary.propTypes = {
  onRequestClose: PropTypes.func,
};

export default CostumeLibrary;
