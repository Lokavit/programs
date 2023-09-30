import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";

import TagButtonComponent from "../components/tag-button/tag-button.jsx";

class TagButton extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, ["handleClick"]);
  }
  handleClick() {
    this.props.onClick(this.props.tag);
  }
  render() {
    return (
      <TagButtonComponent
          {...this.props}
          onClick={this.handleClick}
      />

    //   <Button
    //     className={classNames(styles.tagButton, className, {
    //       [styles.active]: active,
    //     })}
    //     iconClassName={classNames(styles.tagButtonIcon, iconClassName)}
    //     {...this.props}
    //     onClick={this.handleClick}
    //   >
    //     {GLOBAL_L10N(intlLabel.id)}
    //   </Button>
    );
  }
}

TagButton.propTypes = {
  ...TagButtonComponent.propTypes,
  onClick: PropTypes.func,
};

export default TagButton;
