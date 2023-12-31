import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

import Button from "../button/button.jsx";

import styles from "./tag-button.css";

const TagButtonComponent = ({
  active,
  iconClassName,
  className,
  tag, // eslint-disable-line no-unused-vars
  ...props
}) => (
  <Button
    className={classNames(styles.tagButton, className, {
      [styles.active]: active,
    })}
    iconClassName={classNames(styles.tagButtonIcon, iconClassName)}
    {...props}
  >
    {tag}
  </Button>
);

TagButtonComponent.propTypes = {
  ...Button.propTypes,
  active: PropTypes.bool,
  tag: PropTypes.string.isRequired,
};

TagButtonComponent.defaultProps = {
  active: false,
};

export default TagButtonComponent;
