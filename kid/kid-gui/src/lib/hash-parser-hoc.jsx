import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  // getIsFetchingWithoutId,
  /** project-fetcher-hoc.jsx */
  LoadingStates,
  getIsLoading,
  getIsShowingProject,
  projectError,
  onLoadedProject,
  /** project-save-hoc.jsx */
  autoUpdateProject,
  createProject,
  doneCreatingProject,
  doneUpdatingProject,
  getIsAnyCreatingNewState,
  getIsCreatingCopy,
  getIsManualUpdating,
  getIsRemixing,
  getIsShowingWithId,
  getIsShowingWithoutId,
  getIsUpdating,
  /** vm-listener-hoc.jsx */
  getIsLoadingWithId,
  /** gui.jsx */
  getIsError,
  getIsLoadingUpload,
  requestProjectUpload,
} from "../reducers/project-state";

import { openExtensionLibrary } from "../reducers/modals";

/** project-save-hoc.jsx */
import saveProjectToServer from "../lib/save-project-to-server";
import {
  showAlertWithTimeout,
  showStandardAlert,
  closeAlertWithId,
} from "../reducers/alerts";
import { setAutoSaveTimeoutId } from "../reducers/timeout";
/** vm-listener-hoc.jsx */
import { updateBlockDrag } from "../reducers/block-drag";
import { updateMonitors } from "../reducers/monitors";
import { showExtensionAlert } from "../reducers/alerts";
import { updateMicIndicator } from "../reducers/mic-indicator";

/** 以下为gui.jsx搬过来时，当前文件中不曾有的引入项 */
import Blocks from "../containers/blocks.jsx";
import CostumeTab from "../containers/costume-tab.jsx";
import SoundTab from "../containers/sound-tab.jsx";
import CostumeLibrary from "../containers/costume-library.jsx";
import Watermark from "../containers/watermark.jsx";
import Alerts from "../containers/alerts.jsx";
import DragLayer from "../containers/drag-layer.jsx";
import ConnectionModal from "../containers/connection-modal.jsx";
import layout, {
  STAGE_SIZE_MODES,
  STAGE_DISPLAY_SIZES,
} from "../lib/layout-constants";
import styles from "../components/gui/gui.css";

import { setRestore } from "../reducers/restore-deletion";
import spriteLibraryContent from "../lib/libraries/sprites.json";
import { handleFileUpload, spriteUpload } from "../lib/file-uploader.js";
import { emptySprite } from "../lib/empty-assets";
import { highlightTarget } from "../reducers/targets";
import randomizeSpritePosition from "../lib/randomize-sprite-position";
import Input from "../components/forms/input.jsx";
import BufferedInputHOC from "../components/forms/buffered-input-hoc.jsx";

/** @description StageWrapper 舞台 */
import Stage from "../containers/stage.jsx";

const BufferedInput = BufferedInputHOC(Input);

class HashParserComponent extends React.Component {
  constructor(props) {
    super(props);
    /** vm-listener-hoc.jsx 当程序启动时，监听键盘事件所需， */
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    this.tryToAutoSave = this.tryToAutoSave.bind(this);
    // this.loadProject = this.loadProject.bind(this);
    // this.getProjectThumbnail=
    // this.leavePageConfirm=

    /** project-save-hoc.jsx */
    // 我们必须在这里开始监听vm，而不是在componentDidMount中，因为HOC会挂载包装好的组件，因此HOC componentDidMount在挂载包装的组件之后触发.
    // 如果包装的组件在componentDidMount中使用了vm，那么我们需要在安装包装的组件之前开始侦听.

    // VM.on("MONITORS_UPDATE", this.props.onMonitorsUpdate);
    // VM.on("BLOCK_DRAG_UPDATE", this.props.onBlockDragUpdate);
    // VM.on("PERIPHERAL_CONNECTION_LOST_ERROR", this.props.onShowExtensionAlert);
    // VM.on("MIC_LISTENING", this.props.onMicListeningUpdate);

    this.state = {
      /** 用于存储获取的素材List */
      materialLists: [],
      /** 程序是否运行中 */
      isProjectRunning: false,
    };
    document.documentElement.lang = INIT_LOCALES.locale;
    console.log("HashParserHOC:", this.props);
  }
  componentDidMount() {
    console.log("进入componentDidMount");
    if (typeof window === "object") {
      // 注意：最好使用侦听器，而不要分配onbeforeunload;
      // 但是很难在我们的测试中关闭此监听
      window.onbeforeunload = (e) => this.leavePageConfirm(e);
    }

    /** project-save-hoc.jsx */
    // 允许GUI用户传递函数以接收用于触发缩略图或整个项目保存的触发器.
    // 这些函数在卸载时使用null进行调用，以防止陈旧的引用.
    this.props.onSetProjectThumbnailer(this.getProjectThumbnail);
    this.props.onSetProjectSaver(this.tryToAutoSave);

    /** vm-listener-hoc.jsx */
    if (this.props.attachKeyboardEvents) {
      document.addEventListener("keydown", this.handleKeyDown);
      document.addEventListener("keyup", this.handleKeyUp);
    }
    console.log("VM.postIOData:", VM.postIOData);
    VM.postIOData("userData", { username: "" });

    /** 尝试在此调用拖拽布局函数 */
    DragSwappable();
  }
  /**
   * @description (异步)在组件接受新的props之后触发，可以在此访问并修改DOM.
   * @param {*} prevProps
   */
  componentDidUpdate(prevProps) {
    console.log("(异步)在组件接受新的props之后触发", this.props, prevProps);
    /** project-save-hoc.jsx */
    // if (this.props.projectChanged && !prevProps.projectChanged) {
    this.scheduleAutoSave();
    // }
    // if (this.props.isUpdating && !prevProps.isUpdating) {
    // this.updateProjectToStorage();
    // }
    // if (this.props.isCreatingCopy && !prevProps.isCreatingCopy) {
    this.createCopyToStorage();
    // }
    // if (this.props.isRemixing && !prevProps.isRemixing) {
    // this.props.onRemixing(true);
    // this.createRemixToStorage();
    // } else if (!this.props.isRemixing && prevProps.isRemixing) {
    // this.props.onRemixing(false);
    // }

    // 看看我们是否应该在服务器上保存/更新当前项目，不要在尝试保存后立即尝试保存
    // if (prevProps.isUpdating) return;

    // 如果我们新能够保存该项目，请保存它!
    // const becameAbleToSave = this.props.canSave && !prevProps.canSave;
    // const becameShared = this.props.isShared && !prevProps.isShared;
    // if (this.props.isShowingSaveable && (becameAbleToSave || becameShared)) {
    this.props.onAutoUpdateProject();
    // }

    /** vm-listener-hoc.jsx */
    // if (prevProps.username !== this.props.username) {
    VM.postIOData("userData", { username: "" });
    // }

    // 当shouldUpdateTargets状态更改为true时，即当编辑器退出全屏/仅播放器模式时，重新请求目标更新
    // if (this.props.shouldUpdateTargets && !prevProps.shouldUpdateTargets) {
    /* 发出事件，但不触发项目更改 */
    VM.emitTargetsUpdate(false);
    // }

    // 如果使用未启动的虚拟机进入编辑器模式，则启动虚拟机
    // VM.start();
    // VM.greenFlag();
  }
  componentWillUnmount() {
    /** project-fetcher-hoc.jsx */
    // this.clearAutoSaveTimeout();
    // Cant unset the beforeunload because it might no longer belong to this component
    // i.e. if another of this component has been mounted before this one gets unmounted
    // which happens when going from project to editor view.
    // window.onbeforeunload = undefined; // eslint-disable-line no-undefined
    // Remove project thumbnailer function since the components are unmounting
    this.props.onSetProjectThumbnailer(null);
    this.props.onSetProjectSaver(null);

    /** vm-listener-hoc.jsx */
    VM.removeListener(
      "PERIPHERAL_CONNECTION_LOST_ERROR",
      this.props.onShowExtensionAlert
    );
    if (this.props.attachKeyboardEvents) {
      document.removeEventListener("keydown", this.handleKeyDown);
      document.removeEventListener("keyup", this.handleKeyUp);
    }
  }

  /** project-fetcher-hoc.jsx */
  leavePageConfirm(e) {
    console.log("leavePageConfirm");
    if (this.props.projectChanged) {
      // 两种方法都需要返回值以实现浏览器兼容性
      (e || window.event).returnValue = true;
      return true;
    }
    return; // 返回undefined可防止出现提示
  }
  // clearAutoSaveTimeout() {
  //   console.log("clearAutoSaveTimeout");
  //   if (this.props.autoSaveTimeoutId !== null) {
  //     clearTimeout(this.props.autoSaveTimeoutId);
  //     this.props.setAutoSaveTimeoutId(null);
  //   }
  // }
  scheduleAutoSave() {
    console.log("scheduleAutoSave");
    if (this.props.isShowingSaveable && this.props.autoSaveTimeoutId === null) {
      const timeoutId = setTimeout(
        this.tryToAutoSave,
        this.props.autoSaveIntervalSecs * 1000
      );
      this.props.setAutoSaveTimeoutId(timeoutId);
    }
  }
  tryToAutoSave() {
    console.log("tryToAutoSave");
    if (this.props.projectChanged && this.props.isShowingSaveable) {
      this.props.onAutoUpdateProject();
    }
  }

  updateProjectToStorage() {
    console.log("updateProjectToStorage");
    this.props.onShowSavingAlert();
    return this.storeProject(0)
      .then(() => {
        // 这里有一个http响应对象，但是我们不需要检查它，因为其中不包含我们关心的值
        this.props.onUpdatedProject(this.props.loadingState);
        this.props.onShowSaveSuccessAlert();
      })
      .catch((err) => {
        // 始终显示SavingError警报，因为它使用户有机会手动下载或重试保存.
        this.props.onShowAlert("savingError");
        this.props.onProjectError(err);
      });
  }
  createNewProjectToStorage() {
    console.log("createNewProjectToStorage");
    return this.storeProject(null)
      .then((response) => {
        this.props.onCreatedProject(
          response.id.toString(),
          this.props.loadingState
        );
      })
      .catch((err) => {
        this.props.onShowAlert("creatingError");
        this.props.onProjectError(err);
      });
  }
  createCopyToStorage() {
    this.props.onShowCreatingCopyAlert();
    return this.storeProject(null, {
      originalId: 0,
      isCopy: 1,
      title: this.props.projectTitle,
    })
      .then((response) => {
        this.props.onCreatedProject(
          response.id.toString(),
          this.props.loadingState
        );
        this.props.onShowCopySuccessAlert();
      })
      .catch((err) => {
        this.props.onShowAlert("creatingError");
        this.props.onProjectError(err);
      });
  }
  createRemixToStorage() {
    console.log("createRemixToStorage");
    this.props.onShowCreatingRemixAlert();
    return this.storeProject(null, {
      originalId: 0,
      isRemix: 1,
      title: this.props.projectTitle,
    })
      .then((response) => {
        this.props.onCreatedProject(
          response.id.toString(),
          this.props.loadingState
        );
        this.props.onShowRemixSuccessAlert();
      })
      .catch((err) => {
        this.props.onShowAlert("creatingError");
        this.props.onProjectError(err);
      });
  }
  /**
   * storeProject:
   * @param  {number|string|undefined} projectId - 定义的值将被PUT /更新; undefined / null将发布/创建
   * @return {Promise} - 使用包含项目现有或新ID的json对象解析
   * @param {?object} requestParams - 要添加到请求主体的参数对象
   */
  storeProject(projectId, requestParams) {
    console.log("storeProject:", projectId, requestParams);
    requestParams = requestParams || {};
    // this.clearAutoSaveTimeout();
    // 现在开始序列化VM状态，然后再开始将资产存储到服务器的异步过程. 这样可以确保资产在保存项目的过程中不会更新（例如，序列化的项目指的是比我们刚刚完成的资产更新的资产）.
    const savedVMState = VM.toJSON();
    return Promise.all(
      VM.assets
        .filter((asset) => !asset.clean)
        .map((asset) =>
          STORAGE.store(
            asset.assetType,
            asset.dataFormat,
            asset.data,
            asset.assetId
          ).then((response) => {
            // Asset servers respond with {status: ok} for successful POSTs
            if (response.status !== "ok") {
              // Errors include a `code` property, e.g. "Forbidden"
              return Promise.reject(response.code);
            }
            asset.clean = true;
          })
        )
    )
      .then(() =>
        this.props.onUpdateProjectData(projectId, savedVMState, requestParams)
      )
      .then((response) => {
        const id = response.id.toString();
        if (id && this.props.onUpdateProjectThumbnail) {
          this.storeProjectThumbnail(id);
        }
        return response;
      })
      .catch((err) => {
        console.error(err);
        throw err; // pass the error up the chain
      });
  }

  /**
   * 保存/创建项目后，存储项目快照.
   * 需要进行_after_保存，因为项目必须具有ID.
   * @param {!string} projectId - 项目的ID，必须定义.
   */
  storeProjectThumbnail(projectId) {
    console.log("storeProjectThumbnail", projectId);
    try {
      this.getProjectThumbnail((dataURI) => {
        this.props.onUpdateProjectThumbnail(
          projectId,
          // dataURItoBlob(dataURI)
          DATA_URI_TO_BLOB(dataURI)
        );
      });
    } catch (e) {
      console.error("Project thumbnail save error", e);
      // This is intentionally fire/forget because a failure
      // to save the thumbnail is not vitally important to the user.
    }
  }

  getProjectThumbnail(callback) {
    console.log("getProjectThumbnail");
    VM.postIOData("video", { forceTransparentPreview: true });
    VM.renderer.requestSnapshot((dataURI) => {
      VM.postIOData("video", { forceTransparentPreview: false });
      callback(dataURI);
    });
    VM.renderer.draw();
  }

  /** vm-listener-hoc.jsx */

  handleKeyDown(e) {
    // 不要捕获用于块状输入的键.
    if (e.target !== document && e.target !== document.body) return;

    const key = !e.key || e.key === "Dead" ? e.keyCode : e.key;
    VM.postIOData("keyboard", {
      key: key,
      isDown: true,
    });

    // 防止空格/箭头键滚动页面.
    if (
      e.keyCode === 32 || // 32=space
      (e.keyCode >= 37 && e.keyCode <= 40)
    ) {
      // 37, 38, 39, 40 are arrows
      e.preventDefault();
    }
  }
  handleKeyUp(e) {
    // Always capture up events,
    // even those that have switched to other targets.
    const key = !e.key || e.key === "Dead" ? e.keyCode : e.key;
    VM.postIOData("keyboard", {
      key: key,
      isDown: false,
    });

    // E.g., prevent scroll.
    if (e.target !== document && e.target !== document.body) {
      e.preventDefault();
    }
  }

  /** vm-manager-hoc.jsx */
  /**
   * @function 选择精灵
   * @param {*} spriteId 选中精灵的id
   * @param {*} e event
   * @todo 多次点击，事件失效。
   */
  handleSelectSprite(e) {
    console.log("选择精灵:", e);
    e.nativeEvent.stopImmediatePropagation();
    // console.log("选择精灵:", spriteId, this.props.stage, this.props.stage.id);
    // e.preventDefault();
    // e.stopPropagation();
    // console.log("选择精灵:", spriteId, this.props.stage, this.props.stage.id);
    // VM.setEditingTarget(spriteId);
    this.props.onHighlightTarget(spriteId);
    this.setHighlightTarget(spriteId);

    // if (this.props.stage && spriteId !== this.props.stage.id)
  }

  /**
   * @function 设置高亮元素
   * @param {*} materialId 传入需设置高亮的元素ID
   */
  setHighlightTarget(materialId) {
    console.log("设置高亮元素:", materialId);
  }

  /**
   * @function 显示当前元素序列帧
   * @param {*} spriteId
   * @param {*} e
   */
  handleShowFrames(spriteId) {
    console.log("显示序列帧:", spriteId);
    // 调用控制序列帧展示条显隐的函数
    // 通过传入的id，找到其所有帧，放入展示条中

    // 暂时用打开绘制浮层代替
    this.handleShowPaintEditor();
  }

  /** @function 复制元素 */
  handleDuplicateSprite(spriteId, e) {
    console.log("复制元素", spriteId, e);
    e.stopPropagation(); // 防止事件向上传递。
    VM.duplicateSprite(spriteId);
  }

  /** @function 导出元素 */
  handleExportSprite(spriteId, e) {
    console.log("导出元素", spriteId, e);
    e.stopPropagation(); // 防止事件向上传递。
    const spriteName = VM.runtime.getTargetById(spriteId).getName();
    const saveLink = document.createElement("a");
    document.body.appendChild(saveLink);

    VM.exportSprite(spriteId).then((content) => {
      Utility.downloadBlob(`${spriteName}.sprite3`, content);
    });
  }

  /** @function 删除元素 */
  handleDeleteSprite(spriteId, e) {
    console.log("删除元素", spriteId, e);
    e.stopPropagation(); // 防止事件向上传递。
    const restoreSprite = VM.deleteSprite(spriteId);
    const restoreFun = () => restoreSprite();
    this.props.dispatchUpdateRestore({
      restoreFun: restoreFun,
      deletedItem: "Sprite",
    });
  }

  /**
   * @function 点击绿旗，启动事件
   * @param {*} e
   */
  handleGreenFlagClick(e) {
    console.log("启动程序");
    e.preventDefault();
    if (e.shiftKey) {
      VM.setTurboMode(!this.state.isTurboMode);
    } else {
      VM.start();
      VM.greenFlag();
    }
  }

  /**
   * @function 点击停止所有程序
   * @param {*} e
   */
  handleStopAllClick(e) {
    console.log("停止程序");
    e.preventDefault();
    VM.stopAll();
  }

  /** @function 变更元素名 */
  handleChangeSpriteName(name) {
    console.log("变更元素名:", name, "内中调用vm重命名元素函数");
    VM.renameSprite(materialsMeta.editMaterilId, name);
  }

  /** @function 变更元素方向值 */
  handleChangeSpriteDirection(direction) {
    VM.postSpriteInfo({ direction });
  }

  /** @function 变更元素X值 */
  handleChangeSpriteX(x) {
    VM.postSpriteInfo({ x });
  }

  /** @function 变更元素Y值 */
  handleChangeSpriteY(y) {
    VM.postSpriteInfo({ y });
  }
  /** @function 变更元素大小 */
  handleChangeSpriteSize(size) {
    VM.postSpriteInfo({ size });
  }

  // /**
  //  * @function 文件上传点击
  //  * @param {*} e
  //  */
  // handleFileUploadClick(e) {
  //   e.stopPropagation(); // 防止点击选择舞台，该舞台是在背景幕上传过程中手动处理的
  //   this.fileInput.click();
  // }

  /**
   * @function 关闭素材库
   */
  handleCloseMaterialLibrary() {
    console.log("关闭素材库");
    this.setState({ isShowMaterialLibrary: false });
  }

  /**
   * @function 素材库的搜索框
   */
  handleEnterSearch(event) {
    console.log("素材库的搜索框");
    if (event.key === "Enter") {
      console.log("按下回车键");
    }
  }

  /**
   * @function 由素材库浮层选中的一个元素
   * @param {*} material 选中的元素
   * @param {*} e
   */
  handleSelectedMaterial(material, e) {
    console.log("选中的元素:", material);
    // 将选中的元素，添加到this.props.
    materialsMeta.materils[material.id] = material;
    console.log("选中元素是否添加到元素组:", materialsMeta.materils);

    // vm中需再做处理
    // VM.addSprite(JSON.stringify(material.costume));

    // 调用关闭素材库浮层事件
    this.handleCloseMaterialLibrary();
  }
  /** gui.jsx */
  /**
   * @function 新元素
   * @param {*} spriteJSONString
   */
  handleNewSprite(spriteJSONString) {
    console.log("新精灵:", spriteJSONString);
    return VM.addSprite(spriteJSONString);
  }

  /**
   * @function 变更元素上传
   * @param {*} e
   */
  handleChangeSpriteUpload(e) {
    console.log("上传精灵", e);
    const storage = VM.runtime.storage;
    this.props.onShowImporting();
    handleFileUpload(
      e.target,
      (buffer, fileType, fileName, fileIndex, fileCount) => {
        console.log("上传文件:", fileType, fileName);
        spriteUpload(
          buffer,
          fileType,
          fileName,
          storage,
          (newSprite) => {
            this.handleNewSprite(newSprite)
              .then(() => {
                console.log("精灵上传:", fileType, fileName, newSprite);
                if (fileIndex === fileCount - 1) {
                  this.props.onCloseImporting();
                }
              })
              .catch(this.props.onCloseImporting);
          },
          this.props.onCloseImporting
        );
      },
      this.props.onCloseImporting
    );
  }

  shouldComponentUpdate(nextProps) {
    console.log("进入shouldComponentUpdate");
    return (
      // this.props.rotationStyle !== nextProps.rotationStyle ||
      this.props.disabled !== nextProps.disabled ||
      this.props.name !== nextProps.name ||
      this.props.stageSize !== nextProps.stageSize ||
      this.props.visible !== nextProps.visible ||
      // 仅在舍入值已更改时更新这些
      Math.round(this.props.direction) !== Math.round(nextProps.direction) ||
      Math.round(this.props.size) !== Math.round(nextProps.size) ||
      Math.round(this.props.x) !== Math.round(nextProps.x) ||
      Math.round(this.props.y) !== Math.round(nextProps.y)
    );
  }

  /**
   * @function 过渡前应保存
   */
  shouldSaveBeforeTransition() {
    return this.props.canSave && this.props.projectChanged;
  }

  render() {
    if (this.props.isError) {
      throw new Error(
        `Error in GUI [location=${window.location}]: ${this.props.error}`
      );
    }
    /** 选中的元素，用于在元素信息中显示当前选中元素的信息内容 */
    let selectedSprite =
      proxy_materialsData.materils[proxy_materialsData.editMaterilId];
    // console.log("选择的元素:", selectedSprite);
    let spriteInfoDisabled = false;
    if (typeof selectedSprite === "undefined") {
      selectedSprite = {};
      spriteInfoDisabled = true;
    }
    console.log("进入render");
    return (
      // 外部必须套一下。
      <React.Fragment>
        {/* 这段的props都没处理 */}
        {/* {this.props.isPlayerOnly ? (
          <StageWrapper
            isFullScreen={isFullScreen}
            isRendererSupported={Utility.supportedWebGL()}
            loading={fetchingProject || isLoading || loadingStateVisible}
            stageSize={STAGE_SIZE_MODES.large}
            vm={VM}
          >
            {alertsVisible ? (
              <Alerts className={styles.alertsContainer} />
            ) : null}
          </StageWrapper>
        ) : ( */}
        {/* <div> */}
        {Utility.supportedWebGL() ? null : (
          <div>当前浏览器不支持WebGL,请替换或更新至Chrome 85 及以上</div>
        )}
        {/* alerts */}
        {this.props.alertsVisible ? (
          <Alerts className={styles.alertsContainer} />
        ) : null}
        {this.props.connectionModalVisible ? <ConnectionModal vm={VM} /> : null}
        {/* 绘制浮层 */}
        {this.state.isShowPaintEditor ? <CostumeTab vm={VM} /> : null}
        {/* 声音浮层 */}
        {this.state.isShowSoundEditor ? <SoundTab vm={VM} /> : null}
        {/* 素材库 */}
        {this.state.isShowMaterialLibrary ? (
          <React.Fragment>
            <div
              className="mask"
              onClick={this.handleCloseMaterialLibrary.bind(this)}
            ></div>
            <div className="material_library">
              <header>
                <div>素材库</div>
                <div>素材商城</div>
                <div onClick={this.handleCloseMaterialLibrary.bind(this)}>
                  X
                </div>
              </header>
              <main>
                <aside>
                  <div className="search">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="nonzero"
                        d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 001.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 00-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 005.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                      ></path>
                    </svg>
                    <label for="search"></label>
                    <input
                      type="search"
                      id="search"
                      name="q"
                      placeholder="请输入关键词"
                      pattern="(.|\s)*\S(.|\s)*"
                      required=""
                      autocomplete="off"
                      onKeyUp={this.handleEnterSearch.bind(this)}
                    />
                  </div>
                  <div className="material_default">
                    <h1>默认素材</h1>
                    <h3>角色/全部</h3>
                    <h5>形象</h5>
                    <h5>界面</h5>
                    <h5>道具</h5>
                    <h5>特效</h5>
                    <h3>背景/全部</h3>
                    <h5>游戏</h5>
                    <h5>生活</h5>
                    <h5>自然</h5>
                    <h3>声音/全部</h3>
                    <h5>音效</h5>
                    <h5>音乐</h5>
                    <h1>我的素材 +</h1>
                    <h3>我的分组</h3>
                  </div>
                </aside>
                {/* 右侧显示元素列表 */}
                <section>
                  <div className="material_scroll">
                    {this.state.materialLists.length > 0 ? (
                      this.state.materialLists.map((item, index) => {
                        return (
                          <div
                            className="material_lib_item"
                            // 选中单个元素
                            onClick={this.handleSelectedMaterial.bind(
                              this,
                              item
                            )}
                          >
                            {console.log("???", item)}
                            <img
                              src="https://i.loli.net/2020/07/29/j2r5pb4DeLfiJx1.jpg"
                              data-src={
                                GLOBAL_URL.ASSET_MATERIAL + item.fileName
                              }
                            />
                            <span>{item.name}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="material_lib_null"></div>
                    )}
                  </div>
                </section>
              </main>
            </div>
          </React.Fragment>
        ) : null}

        {/* 主体 */}
        <main className="main">
          {/* 左边工作区域 */}
          <section className="main_left">
            {/* 左下角扩展库按钮
         根据 RETURN_KID_VERISON() 判断是否带有扩展库按钮
         pro版有扩展库按钮，jr版则无
     */}
            {RETURN_KID_VERISON() ? (
              <div
                className="extension_button"
                onClick={this.props.onExtensionButtonClick}
              >
                <img
                  className={`extension_button_icon`}
                  draggable={false}
                  src={GLOBAL_URL.ASSET_ICON_ADD_EXTENSION}
                />
              </div>
            ) : (
              []
            )}
            <div className="blocks_wrapper">
              {/* blocks创建 及 相关配置 */}
              <Blocks
                // canUseCloud={canUseCloud}
                // grow={1}
                isVisible={true}
                options={{
                  media: RETURN_KID_VERISON()
                    ? GLOBAL_URL.ASSET_BLOCK_MEDIA_PRO
                    : GLOBAL_URL.ASSET_BLOCK_MEDIA_JR,
                }}
                // stageSize={`small`}
                vm={VM}
              />
            </div>
            {/* 积木编辑区右上角 显示当前选中精灵 */}
            <div className={styles.watermark}>
              <Watermark />
            </div>
          </section>

          {/* 右侧 */}
          <section className="main_right">
            {/* 舞台 canvas */}
            <div className="stage_canvas_wrapper">
              {Utility.supportedWebGL() ? (
                <Stage stageSize={this.props.stageSize} vm={VM} />
              ) : null}
            </div>
            {/* {this.props.loading ? (
                  <Loader isFullScreen={this.props.isFullScreen} />
                ) : null} */}

            {/* 元素信息 */}
            <div className="sprite_info">
              <div className="sprite_info_row">
                {/* 元素名 */}
                <div>
                  <BufferedInput
                    disabled={spriteInfoDisabled}
                    tabIndex="0"
                    type="text"
                    value={spriteInfoDisabled ? "" : selectedSprite.name}
                    onSubmit={this.handleChangeSpriteName.bind(this)}
                  />
                </div>
                {/* 元素方向 */}
                <div>
                  方向:
                  <BufferedInput
                    style={{ width: `6rem` }}
                    disabled={spriteInfoDisabled}
                    label={GLOBAL_L10N("gui.SpriteInfo.direction")}
                    tabIndex="0"
                    type="text"
                    value={spriteInfoDisabled ? "" : selectedSprite.direction}
                    onSubmit={this.handleChangeSpriteDirection.bind(this)}
                  />
                </div>
              </div>
              <div className="sprite_info_row">
                {/* X坐标值 */}
                <div>
                  X:
                  <BufferedInput
                    style={{ width: `11rem` }}
                    disabled={spriteInfoDisabled}
                    placeholder="x"
                    tabIndex="0"
                    type="text"
                    value={
                      spriteInfoDisabled ? "" : Math.round(selectedSprite.x)
                    }
                    onSubmit={this.handleChangeSpriteX.bind(this)}
                  />
                </div>
                {/* Y坐标值 */}
                <div>
                  Y:
                  <BufferedInput
                    style={{ width: `11rem` }}
                    disabled={spriteInfoDisabled}
                    placeholder="y"
                    tabIndex="0"
                    type="text"
                    value={
                      spriteInfoDisabled ? "" : Math.round(selectedSprite.y)
                    }
                    onSubmit={this.handleChangeSpriteY.bind(this)}
                  />
                </div>
                {/* 元素尺寸 */}
                <div>
                  大小:
                  <BufferedInput
                    style={{ width: `6rem` }}
                    disabled={spriteInfoDisabled}
                    tabIndex="0"
                    type="text"
                    value={
                      spriteInfoDisabled ? "" : Math.round(selectedSprite.size)
                    }
                    onSubmit={this.handleChangeSpriteSize.bind(this)}
                  />
                </div>
              </div>
            </div>
          </section>
        </main>
        <DragLayer />
        {/* </div> */}
        {/* )} */}
      </React.Fragment>
    );
  }
}
HashParserComponent.propTypes = {
  // isFetchingWithoutId: PropTypes.bool,
  /** project-fetcher-hoc.jsx */
  // assetHost: PropTypes.string,
  canSave: PropTypes.bool,
  isLoadingProject: PropTypes.bool,
  isShowingProject: PropTypes.bool,
  loadingState: PropTypes.oneOf(LoadingStates),
  onError: PropTypes.func,
  // projectHost: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /** project-save-hoc.jsx */
  autoSaveIntervalSecs: PropTypes.number.isRequired,
  autoSaveTimeoutId: PropTypes.number,
  canCreateNew: PropTypes.bool,
  isAnyCreatingNewState: PropTypes.bool,
  isCreatingCopy: PropTypes.bool,
  isLoading: PropTypes.bool,
  isManualUpdating: PropTypes.bool,
  isRemixing: PropTypes.bool,
  isShared: PropTypes.bool,
  isShowingSaveable: PropTypes.bool,
  isShowingWithId: PropTypes.bool,
  isShowingWithoutId: PropTypes.bool,
  isUpdating: PropTypes.bool,
  onAutoUpdateProject: PropTypes.func,
  onCreateProject: PropTypes.func,
  onCreatedProject: PropTypes.func,
  onProjectError: PropTypes.func,
  onRemixing: PropTypes.func,
  onSetProjectSaver: PropTypes.func.isRequired,
  onSetProjectThumbnailer: PropTypes.func.isRequired,
  onShowAlert: PropTypes.func,
  onShowCopySuccessAlert: PropTypes.func,
  onShowCreatingCopyAlert: PropTypes.func,
  onShowCreatingRemixAlert: PropTypes.func,
  onShowRemixSuccessAlert: PropTypes.func,
  onShowSaveSuccessAlert: PropTypes.func,
  onShowSavingAlert: PropTypes.func,
  onUpdateProjectData: PropTypes.func.isRequired,
  onUpdateProjectThumbnail: PropTypes.func,
  onUpdatedProject: PropTypes.func,
  projectChanged: PropTypes.bool,
  setAutoSaveTimeoutId: PropTypes.func.isRequired,
  // vm: PropTypes.instanceOf(VM).isRequired,

  /** vm-listener-hoc.jsx */
  attachKeyboardEvents: PropTypes.bool,
  onBlockDragUpdate: PropTypes.func.isRequired,
  onGreenFlag: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onMicListeningUpdate: PropTypes.func.isRequired,
  onMonitorsUpdate: PropTypes.func.isRequired,
  // onProjectRunStart: PropTypes.func.isRequired,
  // onProjectRunStop: PropTypes.func.isRequired,
  onProjectSaved: PropTypes.func.isRequired,
  onShowExtensionAlert: PropTypes.func.isRequired,
  shouldUpdateTargets: PropTypes.bool,
  // shouldUpdateProjectChanged: PropTypes.bool,
  // username: PropTypes.string,

  canSave: PropTypes.bool,
  isLoadingWithId: PropTypes.bool,
  // isPlayerOnly: PropTypes.bool,
  // isStarted: PropTypes.bool,
  onError: PropTypes.func,
  onLoadedProject: PropTypes.func,
  // projectData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  canCreateNew: PropTypes.bool,
  canSave: PropTypes.bool,

  authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  authorThumbnailUrl: PropTypes.string,
  authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  autoUpdateProject: PropTypes.func,
  canEditTitle: PropTypes.bool,
  canManageFiles: PropTypes.bool,
  canShare: PropTypes.bool,
  isShared: PropTypes.bool,
  isShowingProject: PropTypes.bool,
  isUpdating: PropTypes.bool,
  onLogOut: PropTypes.func,
  onOpenRegistration: PropTypes.func,
  onShare: PropTypes.func,
  onToggleLoginOpen: PropTypes.func,
  projectTitle: PropTypes.string,
  // sessionExists: PropTypes.bool,
  shouldSaveBeforeTransition: PropTypes.func,
  showComingSoon: PropTypes.bool,
  // userOwnsProject: PropTypes.bool,
  // user: PropTypes.object,
  // project: PropTypes.object,

  // updateUser: PropTypes.func,
  // updateProject: PropTypes.func,
  // saveProjectSb3: PropTypes.func,

  isLoadingUpload: PropTypes.bool,
  isShowingWithoutId: PropTypes.bool,
  loadingState: PropTypes.oneOf(LoadingStates),
  requestProjectUpload: PropTypes.func,
};

/** project-fetcher-hoc.jsx 资源和项目的HOST */
HashParserComponent.defaultProps = {
  /** project-save-hoc.jsx */
  autoSaveIntervalSecs: 120,
  onRemixing: () => {},
  onSetProjectThumbnailer: () => {},
  onSetProjectSaver: () => {},
  onUpdateProjectData: saveProjectToServer,

  attachKeyboardEvents: true,

  basePath: "./",
  canCreateNew: false,
  canEditTitle: false,
  canManageFiles: true,
  canRemix: false,
  canSave: false,
  canCreateCopy: false,
  canShare: false,
  enableCommunity: false,
  isCreating: false,
  isShared: false,
  loading: false,
  showComingSoon: false,
  stageSizeMode: STAGE_SIZE_MODES.large,

  onShare: () => {},
};

const mapStateToProps = (state, ownProps) => {
  const loadingState = state.scratchGui.projectState.loadingState;
  /** project-fetcher-hoc.jsx */
  const isShowingWithId = getIsShowingWithId(loadingState);
  return {
    /** project-fetcher-hoc.jsx */
    autoSaveTimeoutId: state.scratchGui.timeout.autoSaveTimeoutId,
    isAnyCreatingNewState: getIsAnyCreatingNewState(loadingState),
    isLoading: getIsLoading(loadingState),
    isCreatingCopy: getIsCreatingCopy(loadingState),
    isRemixing: getIsRemixing(loadingState),
    isShowingSaveable: ownProps.canSave && isShowingWithId,
    isShowingWithId: isShowingWithId,
    isShowingWithoutId: getIsShowingWithoutId(loadingState),
    isUpdating: getIsUpdating(loadingState),
    isManualUpdating: getIsManualUpdating(loadingState),
    loadingState: loadingState,
    projectChanged: state.scratchGui.projectChanged,
    vm: state.scratchGui.vm,

    /** vm-listener-hoc.jsx */
    isLoadingWithId: getIsLoadingWithId(loadingState),
    // projectData: state.scratchGui.projectState.projectData,
    // projectId: state.scratchGui.projectState.projectId,
    loadingState: loadingState,
    // isStarted: state.scratchGui.vmStatus.started,

    /** gui.jsx */
    alertsVisible: state.scratchGui.alerts.visible,
    connectionModalVisible: state.scratchGui.modals.connectionModal,
    costumeLibraryVisible: state.scratchGui.modals.costumeLibrary,
    error: state.scratchGui.projectState.error,
    isError: getIsError(loadingState),
    isShowingProject: getIsShowingProject(loadingState),
    loadingStateVisible: state.scratchGui.modals.loadingProject,
    targetIsStage:
      state.scratchGui.targets.stage &&
      state.scratchGui.targets.stage.id ===
        state.scratchGui.targets.editingTarget,

    // This is the button's mode, as opposed to the actual current state
    stageSizeMode: state.scratchGui.stageSize.stageSize,

    editingTarget: state.scratchGui.targets.editingTarget,
    hoveredTarget: state.scratchGui.hoveredTarget,
    sprites: state.scratchGui.targets.sprites,
    stage: state.scratchGui.targets.stage,
    raiseSprites: state.scratchGui.blockDrag,

    // 请勿在全屏或仅播放器模式下或在录制声音时发出目标或项目更新（这会导致低功率机器上的录制乱码）
    shouldUpdateTargets: !state.scratchGui.modals.soundRecorder,

    // 不要在全屏或仅播放器模式下更新projectChanged状态
    // shouldUpdateProjectChanged:
    //   !state.scratchGui.mode.isFullScreen &&
    //   !state.scratchGui.mode.isPlayerOnly,
    // username:
    //   state.session && state.session.session && state.session.session.user
    //     ? state.session.session.user.username
    //     : "",
    isLoadingProject: getIsLoading(state.scratchGui.projectState.loadingState),
    isShowingProject: getIsShowingProject(
      state.scratchGui.projectState.loadingState
    ),
    loadingState: state.scratchGui.projectState.loadingState,
    // project: state.scratchGui.mine.project,

    isUpdating: getIsUpdating(loadingState),
    // sessionExists:
    //   state.session && typeof state.session.session !== "undefined",
    // user: state.scratchGui.mine.curr_user,
    // userOwnsProject:
    //   ownProps.authorUsername &&
    //   user &&
    //   ownProps.authorUsername === user.username,
    // saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(
    //   state.scratchGui.vm
    // ),
    isLoadingUpload: getIsLoadingUpload(loadingState),
  };
};
const mapDispatchToProps = (dispatch, ownProps) => ({
  /** project-fetcher-hoc.jsx */
  onError: (error) => dispatch(projectError(error)),
  /** project-save-hoc.jsx */
  onAutoUpdateProject: () => dispatch(autoUpdateProject()),
  onCreatedProject: (projectId, loadingState) =>
    dispatch(doneCreatingProject(projectId, loadingState)),
  onCreateProject: () => dispatch(createProject()),
  onProjectError: (error) => dispatch(projectError(error)),
  onShowAlert: (alertType) => dispatch(showStandardAlert(alertType)),
  onShowCopySuccessAlert: () =>
    showAlertWithTimeout(dispatch, "createCopySuccess"),
  onShowRemixSuccessAlert: () =>
    showAlertWithTimeout(dispatch, "createRemixSuccess"),
  onShowCreatingCopyAlert: () => showAlertWithTimeout(dispatch, "creatingCopy"),
  onShowCreatingRemixAlert: () =>
    showAlertWithTimeout(dispatch, "creatingRemix"),
  onShowSaveSuccessAlert: () => showAlertWithTimeout(dispatch, "saveSuccess"),
  onShowSavingAlert: () => showAlertWithTimeout(dispatch, "saving"),
  onUpdatedProject: (projectId, loadingState) =>
    dispatch(doneUpdatingProject(projectId, loadingState)),
  setAutoSaveTimeoutId: (id) => dispatch(setAutoSaveTimeoutId(id)),

  /** vm-listener-hoc.jsx */
  onMonitorsUpdate: (monitorList) => {
    dispatch(updateMonitors(monitorList));
  },
  onBlockDragUpdate: (areBlocksOverGui) => {
    dispatch(updateBlockDrag(areBlocksOverGui));
  },
  onProjectSaved: () => dispatch(setProjectUnchanged()),
  onShowExtensionAlert: (data) => {
    dispatch(showExtensionAlert(data));
  },
  onMicListeningUpdate: (listening) => {
    dispatch(updateMicIndicator(listening));
  },

  onLoadedProject: (loadingState, canSave) =>
    dispatch(onLoadedProject(loadingState, canSave, true)),

  /** gui.jsx */
  onExtensionButtonClick: () => dispatch(openExtensionLibrary()),

  dispatchUpdateRestore: (restoreState) => {
    dispatch(setRestore(restoreState));
  },
  onHighlightTarget: (id) => {
    dispatch(highlightTarget(id));
  },
  onCloseImporting: () => dispatch(closeAlertWithId("importingAsset")),
  onShowImporting: () => dispatch(showStandardAlert("importingAsset")),
  requestProjectUpload: (loadingState) =>
    dispatch(requestProjectUpload(loadingState)),
});

const WrappedGui = connect(
  mapStateToProps,
  mapDispatchToProps
)(HashParserComponent);

export default WrappedGui;
