/*
 * @Author: Satya
 * @Date: 2020-08-04 11:45:29
 * @Last Modified by: Satya
 * @Last Modified time: 2020-08-04 11:47:43
 * doc:积木编辑区右上角 显示当前选中精灵
 * 即，表示工作区域内积木的所属精灵
 */

import PropTypes from "prop-types";
import React from "react";

const Watermark = (props) => (
  <img className="sprite_image" src={props.costumeURL} />
);

Watermark.propTypes = {
  costumeURL: PropTypes.string,
};

export default Watermark;
