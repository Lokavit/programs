/*
 * @Author: Satya
 * @Date: 2020-12-07 14:22:13
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-22 11:39:50
 * doc:重写
 */

import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";

import spriteLibraryContent from "../lib/libraries/sprites.json";
import randomizeSpritePosition from "../lib/randomize-sprite-position";
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

class SpriteLibrary extends React.PureComponent {
  constructor(props) {
    super(props);
    bindAll(this, ["handleItemSelect"]);
  }
  handleItemSelect(item) {
    // 库精灵的随机化位置
    randomizeSpritePosition(item);
    VM.addSprite(JSON.stringify(item.json)).then(() => {});
  }
  render() {
    return (
      <LibraryComponent
        data={spriteLibraryContent}
        id="spriteLibrary"
        type={1}
        typeName={GLOBAL_L10N("gui.spriteLibrary.spriteLib")}
        tags={spriteTags}
        title={GLOBAL_L10N("gui.spriteLibrary.chooseASprite")}
        onItemSelected={this.handleItemSelect}
        onRequestClose={this.props.onRequestClose}
      />
    );
  }
}

SpriteLibrary.propTypes = {
  onRequestClose: PropTypes.func,
  vm: PropTypes.instanceOf(VM).isRequired,
};

export default SpriteLibrary;
