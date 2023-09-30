// import classNames from "classnames";
import bindAll from "lodash.bindall";
import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
// import { resetFavor } from "../../reducers/mine-state.js";

import styles from "./library.css";
import Modal from "../../containers/modal.jsx";

import * as Ajax from "../../lib/ajax";
// import soundIcon from "../library-item/lib-icon--sound.svg";
// import LibraryNav from "../library-nav/library-nav.jsx";
import LibraryItem from "../../containers/mine-library-item.jsx";
// import FavorModal from "./favor-modal.jsx";

class LibraryComponent extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, [
      "handleClose",
      "handleMouseEnter",
      "handleMouseLeave",
      "handleSelect",
      "setFilteredDataRef",
      "loadData",
      "processData",
      "handleQueryChange",
      "findById",
      "handleCloseFavor",
    ]);

    this.state = {
      playingItem: null,
      query: {
        from: 1, //自己收藏的还是官方的
        type: this.props.type,
        bagId: 0, //自己的哪个包
        categoryId: 0, //官方哪个分类
        keywords: "",
      },
      list: [],
      page: 1,
      loadIsLock: false, //加载是否被锁
      loaded: false,
      showFavorPanel: false, //是否显示收藏弹出层
    };
  }
  componentDidMount() {
    this.loadData(this.state.query, this.state.loadIsLock, this.state.page);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.favor != prevProps.favor && this.props.favor != null) {
      this.setState({
        showFavorPanel: true,
      });
    }
  }

  loadData(query, loadIsLock, page) {
    if (loadIsLock) {
      return;
    }
    console.debug("开始加载数据");
    this.setState({
      loadIsLock: true,
    });
    Ajax.post(
      "material/listUserResources",
      { form: { ...query, page: page } },
      (res) => {
        this.setState({
          list: this.state.list.concat(this.processData(res.result)),
          loadIsLock: res.result == null || res.result.length == 0,
          page: page + 1,
        });
      }
    );
  }

  processData(data) {
    if (this.props.type == 4) {
      let list = data.map((sound) => {
        const { md5, ...otherData } = sound;
        return {
          _md5: md5,
          rawURL: GLOBAL_URL.ASSET_ICON_SOUND_LTR,
          ...otherData,
        };
      });
      return list;
    }

    return data;
  }

  handleQueryChange(query) {
    this.setState({
      query: query,
      list: [],
      loadIsLock: false,
      page: 1,
    });
    this.loadData(query, false, 1);
    this.scrollToTop();
  }

  handleSelect(id) {
    this.handleClose();
    this.props.onItemSelected(this.findById(id));
  }
  handleClose() {
    this.props.onRequestClose();
  }

  findById(id) {
    return this.state.list.filter((item) => item.id == id)[0];
  }

  handleMouseEnter(id) {
    // don't restart if mouse over already playing item
    if (this.props.onItemMouseEnter && this.state.playingItem !== id) {
      this.props.onItemMouseEnter(this.findById(id));
      this.setState({
        playingItem: id,
      });
    }
  }
  handleMouseLeave(id) {
    if (this.props.onItemMouseLeave) {
      this.props.onItemMouseLeave(this.findById(id));
      this.setState({
        playingItem: null,
      });
    }
  }
  scrollToTop() {
    this.filteredDataRef.scrollTop = 0;
  }
  setFilteredDataRef(ref) {
    this.filteredDataRef = ref;
    if (ref != null) {
      this.filteredDataRef.onscroll = function () {
        var scrollHeight = this.filteredDataRef.scrollHeight;
        var height = this.filteredDataRef.clientHeight;
        //滚动条到距离底部100px，开始加载
        if (this.filteredDataRef.scrollTop + height > scrollHeight - 100) {
          this.loadData(
            this.state.query,
            this.state.loadIsLock,
            this.state.page
          );
        }
      };
      this.filteredDataRef.onscroll = this.filteredDataRef.onscroll.bind(this);
    }
  }

  /**
   * 关闭收藏弹出层
   */
  handleCloseFavor() {
    this.setState({
      showFavorPanel: false,
    });
    // this.props.resetFavor();
  }

  render() {
    return (
      <Modal
        fullScreen
        contentLabel={this.props.title}
        id={this.props.id}
        onRequestClose={this.handleClose}
      >
        <div className={styles.libraryScrollGridNowrap}>
          LibraryNav
          {/* <LibraryNav
            type={this.props.type}
            typeName={this.props.typeName}
            handleQueryChange={this.handleQueryChange}
          ></LibraryNav> */}
          <div
            className={styles.libraryScrollGrid}
            ref={this.setFilteredDataRef}
          >
            {this.state.list.map((dataItem, index) => (
              <LibraryItem
                bluetoothRequired={dataItem.bluetoothRequired}
                collaborator={dataItem.collaborator}
                description={dataItem.description}
                disabled={dataItem.disabled}
                extensionId={dataItem.extensionId}
                featured={dataItem.featured}
                hidden={dataItem.hidden}
                iconMd5={dataItem.md5}
                iconRawURL={dataItem.rawURL}
                icons={dataItem.json && dataItem.json.costumes}
                id={dataItem.id}
                type={this.props.type}
                insetIconURL={dataItem.insetIconURL}
                internetConnectionRequired={dataItem.internetConnectionRequired}
                isPlaying={this.state.playingItem === dataItem.id}
                key={
                  typeof dataItem.name === "string"
                    ? dataItem.name
                    : dataItem.rawURL
                }
                name={dataItem.name}
                showPlayButton={this.props.showPlayButton}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onSelect={this.handleSelect}
              />
            ))}
            {/* {this.state.showFavorPanel ? (
              <FavorModal
                handleClose={this.handleCloseFavor}
                id={this.props.favor ? this.props.favor.id : 0}
                type={this.props.favor ? this.props.favor.type : 0}
              ></FavorModal>
            ) : null} */}
          </div>
        </div>
      </Modal>
    );
  }
}

LibraryComponent.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.number.isRequired,
  typeName: PropTypes.string.isRequired,

  onItemMouseEnter: PropTypes.func,
  onItemMouseLeave: PropTypes.func,
  onItemSelected: PropTypes.func,
  onRequestClose: PropTypes.func,
  title: PropTypes.string.isRequired,
  // resetFavor: PropTypes.func,
  favor: PropTypes.object,
  setStopHandler: PropTypes.func,
  showPlayButton: PropTypes.bool,
};

LibraryComponent.defaultProps = {};

const mapStateToProps = (state, ownProps) => {
  return {
    favor: state.scratchGui.mine.favor_material,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  // resetFavor: () => dispatch(resetFavor()),
});

export default compose(
  // injectIntl,
  connect(mapStateToProps, mapDispatchToProps)
)(LibraryComponent);
