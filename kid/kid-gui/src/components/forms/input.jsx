import PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

import styles from "./input.css";

const Input = (props) => {
  const { ...componentProps } = props;
  // console.log("Input props:", props);
  return (
    <input
      {...componentProps}
      className={classNames(styles.inputForm, props.className)}
    />
  );
};

Input.propTypes = {
  className: PropTypes.string,
};

export default Input;
