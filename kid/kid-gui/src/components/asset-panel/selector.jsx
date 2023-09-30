/*
 * @Author: Satya 
 * @Date: 2020-12-07 11:04:25 
 * @Last Modified by:   Satya 
 * @Last Modified time: 2020-12-07 11:04:25 
 * doc:原造型tab及声音tab所需
 */

import PropTypes from "prop-types";
import React from "react";
import SpriteSelectorItem from "../sprite-selector-item.jsx";
import SortableAsset from "./sortable-asset.jsx";
import SortableHOC from "../../lib/sortable-hoc.jsx";
import DragConstants from "../../lib/drag-constants";

const Selector = (props) => {
  const {
    // buttons,
    containerRef,
    dragType,
    isRtl,
    items,
    selectedItemIndex,
    draggingIndex,
    draggingType,
    ordering,
    onAddSortable,
    onRemoveSortable,
    onDeleteClick,
    onDuplicateClick,
    onExportClick,
    onItemClick,
  } = props;
  // console.log("buttons:", buttons);

  return (
    <div className="asset_panel_selector_wrapper" componentRef={containerRef}>
      <div className="asset_panel_selector_list_area">
        {items.map((item, index) => (
          <SortableAsset
            id={item.name}
            index={draggingType === dragType ? ordering.indexOf(index) : index}
            key={item.name}
            onAddSortable={onAddSortable}
            onRemoveSortable={onRemoveSortable}
          >
            <SpriteSelectorItem
              asset={item.asset}
              className={`asset_panel_selector_list_item ${
                draggingType === dragType && index === draggingIndex
                  ? "placeholder"
                  : ""
              }`}
              costumeURL={item.url}
              details={item.details}
              dragPayload={item.dragPayload}
              dragType={dragType}
              id={index}
              index={index}
              name={item.name}
              number={index + 1 /* 1-indexed */}
              selected={index === selectedItemIndex}
              onClick={onItemClick}
              onDeleteButtonClick={onDeleteClick}
              onDuplicateButtonClick={onDuplicateClick}
              onExportButtonClick={onExportClick}
            />
          </SortableAsset>
        ))}
      </div>
      {/* {buttons.length > 0 ? (
        <ActionMenu
          className="custom_button"
          img={buttons[0].img}
          moreButtons={buttons.slice(1)}
          title={buttons[0].title}
          tooltipPlace={isRtl ? "left" : "right"}
          onClick={buttons[0].onClick}
        />
      ) : null} */}
    </div>
  );
};

Selector.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      img: PropTypes.string.isRequired,
      onClick: PropTypes.func,
    })
  ),
  containerRef: PropTypes.func,
  dragType: PropTypes.oneOf(Object.keys(DragConstants)),
  draggingIndex: PropTypes.number,
  draggingType: PropTypes.oneOf(Object.keys(DragConstants)),
  isRtl: PropTypes.bool,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      name: PropTypes.string.isRequired,
    })
  ),
  onAddSortable: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onDuplicateClick: PropTypes.func,
  onExportClick: PropTypes.func,
  onItemClick: PropTypes.func.isRequired,
  onRemoveSortable: PropTypes.func,
  ordering: PropTypes.arrayOf(PropTypes.number),
  selectedItemIndex: PropTypes.number.isRequired,
};

export default SortableHOC(Selector);
