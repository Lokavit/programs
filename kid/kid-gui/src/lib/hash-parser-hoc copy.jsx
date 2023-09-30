import bindAll from "lodash.bindall";
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
// import VM from "kid-vm";

import {
  defaultProjectId,
  getIsFetchingWithoutId,
  setProjectId,
  /** project-fetcher-hoc.jsx */
  LoadingStates,
  getIsCreatingNew,
  getIsFetchingWithId,
  getIsLoading,
  getIsShowingProject,
  onFetchedProjectData,
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
  manualUpdateProject,
  requestNewProject,
  getIsLoadingUpload,
  requestProjectUpload,
} from "../reducers/project-state";

/** project-fetcher-hoc.jsx */
import {
  setProjectUnchanged,
  /** vm-listener-hoc.jsx project-save-hoc.jsx */
  setProjectChanged,
} from "../reducers/project-changed";
import { updateUser, updateProject } from "../reducers/mine-state.js";

import {
  closeLoadingProject,
  /** project-save-hoc.jsx */
  closeCostumeLibrary,
  openExtensionLibrary,
  openLoadingProject,
} from "../reducers/modals";

/** project-save-hoc.jsx */
import collectMetadata from "../lib/collect-metadata";
import saveProjectToServer from "../lib/save-project-to-server";
import {
  showAlertWithTimeout,
  showStandardAlert,
  closeAlertWithId,
} from "../reducers/alerts";
import { setAutoSaveTimeoutId } from "../reducers/timeout";
/** vm-listener-hoc.jsx */
import { updateTargets } from "../reducers/targets";
import { updateBlockDrag } from "../reducers/block-drag";
import { updateMonitors } from "../reducers/monitors";
import {
  setRunningState,
  setTurboState,
  setStartedState,
} from "../reducers/vm-status";
import { showExtensionAlert } from "../reducers/alerts";
import { updateMicIndicator } from "../reducers/mic-indicator";

/** vm-manager-hoc.jsx */
import AudioEngine from "scratch-audio";

/** 以下为gui.jsx搬过来时，当前文件中不曾有的引入项 */
import { setProjectTitle } from "../reducers/project-title";
import Blocks from "../containers/blocks.jsx";
import CostumeTab from "../containers/costume-tab.jsx";
import SoundTab from "../containers/sound-tab.jsx";
import Loader from "../components/loader/loader.jsx";
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

import { setReceivedBlocks } from "../reducers/hovered-target";
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

/** @description StageHeader */
import { setFullScreen } from "../reducers/mode";

/** @function menu.jsx */
// import MenuBarContainer from "../containers/menu-bar-hoc.jsx";
import LoginModal from "../components/menu-bar/login-modal.jsx";

const BufferedInput = BufferedInputHOC(Input);

/**
 * @description 旋转模式
 * @key 原项目中rotationStyle的值，作为选项value
 * @value 重写后选项的明文
 */
const ROTATE_MODE = {
  ALL_AROUND: {
    key: "all around",
    value: "自由",
  },
  LEFT_RIGHT: {
    key: "left-right",
    value: "水平",
  },
  DONT_ROTATE: {
    key: "don't rotate",
    value: "禁止",
  },
};

// 缓存此值以仅在第一次时检索一次.假设会话没有改变.
let isRendererSupported = null;

/* 高阶组件从location.hash获取项目ID
 * @param {React.Component} WrappedComponent: component to render
 * @returns {React.Component} component with hash parsing behavior
 */
class HashParserComponent extends React.Component {
  constructor(props) {
    super(props);
    bindAll(this, [
      "handleHashChange",
      /** titled-hoc.jsx */
      "handleUpdateProjectTitle",
      /** project-fetcher-hoc.jsx */
      "fetchProject",
      /** project-save-hoc.jsx */
      "getProjectThumbnail",
      "leavePageConfirm",
      "tryToAutoSave",
      /** vm-listener-hoc.jsx */
      "handleKeyDown",
      "handleKeyUp",
      "handleProjectChanged",
      "handleTargetsUpdate",
      /** vm-manager-hoc.jsx */
      "loadProject",
    ]);
    /** 设置作品所在 HOST */
    STORAGE.setProjectHost(props.projectHost);
    /** 设置资源所在 HOST */
    STORAGE.setAssetHost(props.assetHost);

    // storage.setTranslatorFunction(props.intl.formatMessage);
    // props.projectId 可能未设置，在这种情况下，使用默认值; 可以由更高的HOC设置，并传递.
    // 此处应该知道初始projectId应该是什么，因此请在redux存储中进行设置.
    if (
      props.projectId !== "" &&
      props.projectId !== null &&
      typeof props.projectId !== "undefined"
    ) {
      this.props.setProjectId(props.projectId.toString());
    }

    /** project-save-hoc.jsx */
    // We have to start listening to the vm here rather than in
    // componentDidMount because the HOC mounts the wrapped component,
    // so the HOC componentDidMount triggers after the wrapped component
    // mounts.
    // If the wrapped component uses the vm in componentDidMount, then
    // we need to start listening before mounting the wrapped component.
    this.props.vm.on("targetsUpdate", this.handleTargetsUpdate);
    this.props.vm.on("MONITORS_UPDATE", this.props.onMonitorsUpdate);
    this.props.vm.on("BLOCK_DRAG_UPDATE", this.props.onBlockDragUpdate);
    this.props.vm.on("TURBO_MODE_ON", this.props.onTurboModeOn);
    this.props.vm.on("TURBO_MODE_OFF", this.props.onTurboModeOff);
    this.props.vm.on("PROJECT_RUN_START", this.props.onProjectRunStart);
    this.props.vm.on("PROJECT_RUN_STOP", this.props.onProjectRunStop);
    this.props.vm.on("PROJECT_CHANGED", this.handleProjectChanged);
    this.props.vm.on("RUNTIME_STARTED", this.props.onRuntimeStarted);
    this.props.vm.on("PROJECT_START", this.props.onGreenFlag);
    this.props.vm.on(
      "PERIPHERAL_CONNECTION_LOST_ERROR",
      this.props.onShowExtensionAlert
    );
    this.props.vm.on("MIC_LISTENING", this.props.onMicListeningUpdate);

    /** titled-hoc.jsx */
    this.state = {
      projectTitle: null,
      /** 显隐添加元素按钮组 */
      isShowMoreBtn: false,
      /** 显示绘制面板浮层 */
      isShowPaintEditor: false,
      /** 显示声音编辑面板浮层 */
      isShowSoundEditor: false,
      /** 显示素材库 */
      isShowMaterialLibrary: false,

      /** 用于存储获取的素材List */
      materialLists: [],

      showLogin: false, // 是否显示 登录窗口
      showEditProject: false, // 是否显示改编作品按钮
      /** 是否显示菜单-文件-子项 */
      isShowFileMenu: false,
      /**是否显示菜单-编辑-子项 */
      isShowEditMenu: false,
      /** 是否显示右侧-用户-子项 */
      isShowAccountMenu: false,
      /** 是否开启加速模式 */
      isTurboMode: false,
    };
    document.documentElement.lang = localesInitialState.locale;
    /** 用于判断单双击事件 */
    this.count = 0;
    console.log("HashParserHOC:", this.props);
  }
  componentDidMount() {
    window.addEventListener("hashchange", this.handleHashChange);
    this.handleHashChange();
    // this.checkLogin(); // 作为演示，关闭检测登入状态

    /** project-fetcher-hoc.jsx */
    let current_id = new URL(document.location).searchParams.get("id");
    // 该函数会调用kid-storage中的一个函数，但是本函数中没有请求头设置参数，所以暂时无法使用
    // this.props.vm.downloadProjectId(`project/ajaxOne/${current_id}`);

    let _this = this;
    // 拉取指定id的作品
    fetch(`${GLOBAL_URL.API_GET_PROJECT_DATA}/${current_id}`).then((response) =>
      response.json().then((result) => {
        // 如果返回成功，并且有对象值，则进行下一步操作
        if (result.success && result.result && result.result.sb3Path) {
          // 下载指定sb3文件
          fetch(`${result.result.sb3Path}`, {
            method: "get",
            responseType: "blob",
          }).then((res) =>
            res.blob().then((blob) => {
              let reader = new FileReader();
              // 开始读取指定的 Blob中的内容, 一旦完成, result 属性中保存的将是被读取文件的 ArrayBuffer 数据对象.
              reader.readAsArrayBuffer(blob);
              // 处理load事件。该事件在读取操作完成时触发。
              reader.onload = function (event) {
                // .loadProject(代表要加载的项目的json字符串，对象或ArrayBuffer。)
                _this.props.vm
                  .loadProject(event.target.result)
                  .then(() => {
                    _this.props.onLoadingFinished(
                      _this.props.loadingState,
                      true
                    );
                  })
                  .catch((error) => {
                    console.warn("this.props.vm.loadProject error", error);
                  });
              };
            })
          );
        }
      })
    );

    /** project-save-hoc.jsx */
    if (typeof window === "object") {
      // Note: it might be better to use a listener instead of assigning onbeforeunload;
      // but then it'd be hard to turn this listening off in our tests
      window.onbeforeunload = (e) => this.leavePageConfirm(e);
    }

    // Allow the GUI consumer to pass in a function to receive a trigger
    // for triggering thumbnail or whole project saves.
    // These functions are called with null on unmount to prevent stale references.
    this.props.onSetProjectThumbnailer(this.getProjectThumbnail);
    this.props.onSetProjectSaver(this.tryToAutoSave);

    /** vm-listener-hoc.jsx */
    if (this.props.attachKeyboardEvents) {
      document.addEventListener("keydown", this.handleKeyDown);
      document.addEventListener("keyup", this.handleKeyUp);
    }
    this.props.vm.postIOData("userData", { username: this.props.username });

    /** vm-manager-hoc.jsx */
    if (!this.props.vm.initialized) {
      this.audioEngine = new AudioEngine();
      this.props.vm.attachAudioEngine(this.audioEngine);
      this.props.vm.setCompatibilityMode(true);
      this.props.vm.initialized = true;
      this.props.vm.setLocale(
        localesInitialState.locale,
        localesInitialState.messages
      );
    }
    if (!this.props.isPlayerOnly && !this.props.isStarted) {
      this.props.vm.start();
    }

    /** gui.jsx */
    this.setReduxTitle(this.props.projectTitle);
    this.props.onStorageInit(STORAGE);
    this.props.onVmInit(this.props.vm);
    document.addEventListener("keydown", this.handleKeyPress.bind(this));

    /** 尝试在此调用拖拽布局函数 */
    DragSwappable();
  }
  componentDidUpdate(prevProps) {
    // 如果我们新获取一个非哈希项目...
    if (this.props.isFetchingWithoutId && !prevProps.isFetchingWithoutId) {
      // ...清除网址中的哈希
      history.pushState(
        "new-project",
        "new-project",
        window.location.pathname + window.location.search
      );
    }

    /** project-fetcher-hoc.jsx */
    // 如果上一个作品的域名 !== 传入的作品域名 使用缓存对象的设置作品域名函数，将作品域名设置为当前作品域名
    if (prevProps.projectHost !== this.props.projectHost)
      STORAGE.setProjectHost(this.props.projectHost);

    // 资源 逻辑同上
    if (prevProps.assetHost !== this.props.assetHost)
      STORAGE.setAssetHost(this.props.assetHost);

    // 是否 是正在使用ID提取 && 非上一.正在使用ID提取
    if (this.props.isFetchingWithId && !prevProps.isFetchingWithId)
      this.fetchProject(this.props.reduxProjectId, this.props.loadingState);

    if (this.props.isShowingProject && !prevProps.isShowingProject)
      this.props.onProjectUnchanged();

    // 如果正在显示 && (上次加载的项目 || 创建新项目) 激活代码tab的逻辑
    // if (
    //   this.props.isShowingProject &&
    //   (prevProps.isLoadingProject || prevProps.isCreatingNew)
    // )
    // this.props.onActivateTab(BLOCKS_TAB_INDEX);

    /** project-save-hoc.jsx */
    if (!this.props.isAnyCreatingNewState && prevProps.isAnyCreatingNewState) {
      this.reportTelemetryEvent("projectWasCreated");
    }
    if (!this.props.isLoading && prevProps.isLoading) {
      this.reportTelemetryEvent("projectDidLoad");
    }

    if (this.props.projectChanged && !prevProps.projectChanged) {
      this.scheduleAutoSave();
    }
    if (this.props.isUpdating && !prevProps.isUpdating) {
      this.updateProjectToStorage();
    }
    if (this.props.isCreatingNew && !prevProps.isCreatingNew) {
      this.createNewProjectToStorage();
    }
    if (this.props.isCreatingCopy && !prevProps.isCreatingCopy) {
      this.createCopyToStorage();
    }
    if (this.props.isRemixing && !prevProps.isRemixing) {
      this.props.onRemixing(true);
      this.createRemixToStorage();
    } else if (!this.props.isRemixing && prevProps.isRemixing) {
      this.props.onRemixing(false);
    }

    // see if we should "create" the current project on the server
    //
    // don't try to create or save immediately after trying to create
    if (prevProps.isCreatingNew) return;
    // if we're newly able to create this project, create it!
    if (
      this.isShowingCreatable(this.props) &&
      !this.isShowingCreatable(prevProps)
    ) {
      this.props.onCreateProject();
    }

    // see if we should save/update the current project on the server
    //
    // don't try to save immediately after trying to save
    if (prevProps.isUpdating) return;
    // if we're newly able to save this project, save it!
    const becameAbleToSave = this.props.canSave && !prevProps.canSave;
    const becameShared = this.props.isShared && !prevProps.isShared;
    if (this.props.isShowingSaveable && (becameAbleToSave || becameShared)) {
      this.props.onAutoUpdateProject();
    }

    /** vm-listener-hoc.jsx */
    if (prevProps.username !== this.props.username) {
      this.props.vm.postIOData("userData", { username: this.props.username });
    }

    // Re-request a targets update when the shouldUpdateTargets state changes to true
    // i.e. when the editor transitions out of fullscreen/player only modes
    if (this.props.shouldUpdateTargets && !prevProps.shouldUpdateTargets) {
      this.props.vm.emitTargetsUpdate(
        false /* Emit the event, but do not trigger project change */
      );
    }

    /** vm-manager-hoc.jsx */
    // 如果项目处于加载状态，则将加载AND字体，而直到现在为止，字体并没有两种方式……正在加载项目！
    // if (
    //   this.props.isLoadingWithId &&
    //   this.props.fontsLoaded &&
    //   (!prevProps.isLoadingWithId || !prevProps.fontsLoaded)
    // )
    if (this.props.isLoadingWithId && !prevProps.isLoadingWithId)
      this.loadProject();

    // 如果使用未启动的虚拟机进入编辑器模式，则启动虚拟机
    if (!this.props.isPlayerOnly && !this.props.isStarted)
      this.props.vm.start();
    /** gui.jsx */
    if (
      this.props.projectId !== prevProps.projectId &&
      this.props.projectId !== null
    ) {
      this.props.onUpdateProjectId(this.props.projectId);
    }
    if (this.props.projectTitle !== prevProps.projectTitle) {
      this.setReduxTitle(this.props.projectTitle);
    }
    if (this.props.isShowingProject && !prevProps.isShowingProject) {
      // 仅当项目从尚未加载变为加载时才通知容器
      // 目前，www中的项目视图不需要知道何时卸载项目
      this.props.onProjectLoaded();
    }
  }
  componentWillUnmount() {
    window.removeEventListener("hashchange", this.handleHashChange);

    /** project-fetcher-hoc.jsx */
    this.clearAutoSaveTimeout();
    // Cant unset the beforeunload because it might no longer belong to this component
    // i.e. if another of this component has been mounted before this one gets unmounted
    // which happens when going from project to editor view.
    // window.onbeforeunload = undefined; // eslint-disable-line no-undefined
    // Remove project thumbnailer function since the components are unmounting
    this.props.onSetProjectThumbnailer(null);
    this.props.onSetProjectSaver(null);

    /** vm-listener-hoc.jsx */
    this.props.vm.removeListener(
      "PERIPHERAL_CONNECTION_LOST_ERROR",
      this.props.onShowExtensionAlert
    );
    if (this.props.attachKeyboardEvents) {
      document.removeEventListener("keydown", this.handleKeyDown);
      document.removeEventListener("keyup", this.handleKeyUp);
    }

    /** gui.jsx */
    document.removeEventListener("keydown", this.handleKeyPress.bind(this));
  }
  handleHashChange() {
    const hashMatch = window.location.hash.match(/#(\d+)/);
    const hashProjectId = hashMatch === null ? defaultProjectId : hashMatch[1];
    this.props.setProjectId(hashProjectId.toString());
  }
  /** titled-hoc.jsx */
  handleUpdateProjectTitle(newTitle) {
    this.setState({ projectTitle: newTitle });
  }

  /** project-fetcher-hoc.jsx */
  leavePageConfirm(e) {
    if (this.props.projectChanged) {
      // both methods of returning a value may be necessary for browser compatibility
      (e || window.event).returnValue = true;
      return true;
    }
    return; // Returning undefined prevents the prompt from coming up
  }
  clearAutoSaveTimeout() {
    if (this.props.autoSaveTimeoutId !== null) {
      clearTimeout(this.props.autoSaveTimeoutId);
      this.props.setAutoSaveTimeoutId(null);
    }
  }
  scheduleAutoSave() {
    if (this.props.isShowingSaveable && this.props.autoSaveTimeoutId === null) {
      const timeoutId = setTimeout(
        this.tryToAutoSave,
        this.props.autoSaveIntervalSecs * 1000
      );
      this.props.setAutoSaveTimeoutId(timeoutId);
    }
  }
  tryToAutoSave() {
    if (this.props.projectChanged && this.props.isShowingSaveable) {
      this.props.onAutoUpdateProject();
    }
  }
  isShowingCreatable(props) {
    return props.canCreateNew && props.isShowingWithoutId;
  }
  updateProjectToStorage() {
    this.props.onShowSavingAlert();
    return this.storeProject(this.props.reduxProjectId)
      .then(() => {
        // there's an http response object available here, but we don't need to examine
        // it, because there are no values contained in it that we care about
        this.props.onUpdatedProject(this.props.loadingState);
        this.props.onShowSaveSuccessAlert();
      })
      .catch((err) => {
        // Always show the savingError alert because it gives the
        // user the chance to download or retry the save manually.
        this.props.onShowAlert("savingError");
        this.props.onProjectError(err);
      });
  }
  createNewProjectToStorage() {
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
      originalId: this.props.reduxProjectId,
      isCopy: 1,
      title: this.props.reduxProjectTitle,
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
    this.props.onShowCreatingRemixAlert();
    return this.storeProject(null, {
      originalId: this.props.reduxProjectId,
      isRemix: 1,
      title: this.props.reduxProjectTitle,
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
   * @param  {number|string|undefined} projectId - defined value will PUT/update; undefined/null will POST/create
   * @return {Promise} - resolves with json object containing project's existing or new id
   * @param {?object} requestParams - object of params to add to request body
   */
  storeProject(projectId, requestParams) {
    requestParams = requestParams || {};
    this.clearAutoSaveTimeout();
    // Serialize VM state now before embarking on
    // the asynchronous journey of storing assets to
    // the server. This ensures that assets don't update
    // while in the process of saving a project (e.g. the
    // serialized project refers to a newer asset than what
    // we just finished saving).
    const savedVMState = this.props.vm.toJSON();
    return Promise.all(
      this.props.vm.assets
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
        this.props.onSetProjectUnchanged();
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
   * Store a snapshot of the project once it has been saved/created.
   * Needs to happen _after_ save because the project must have an ID.
   * @param {!string} projectId - id of the project, must be defined.
   */
  storeProjectThumbnail(projectId) {
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
    this.props.vm.postIOData("video", { forceTransparentPreview: true });
    this.props.vm.renderer.requestSnapshot((dataURI) => {
      this.props.vm.postIOData("video", { forceTransparentPreview: false });
      callback(dataURI);
    });
    this.props.vm.renderer.draw();
  }

  /**
   * Report a telemetry event.
   * @param {string} event - one of `projectWasCreated`, `projectDidLoad`, `projectDidSave`, `projectWasUploaded`
   */
  // TODO make a telemetry HOC and move this stuff there
  reportTelemetryEvent(event) {
    if (this.props.onProjectTelemetryEvent) {
      const metadata = collectMetadata(
        this.props.vm,
        this.props.reduxProjectTitle,
        localesInitialState.locale
      );
      this.props.onProjectTelemetryEvent(event, metadata);
    }
  }

  /** vm-listener-hoc.jsx */
  handleProjectChanged() {
    if (this.props.shouldUpdateProjectChanged && !this.props.projectChanged) {
      this.props.onProjectChanged();
    }
  }
  handleTargetsUpdate(data) {
    if (this.props.shouldUpdateTargets) {
      this.props.onTargetsUpdate(data);
    }
  }
  handleKeyDown(e) {
    // Don't capture keys intended for Blockly inputs.
    if (e.target !== document && e.target !== document.body) return;

    const key = !e.key || e.key === "Dead" ? e.keyCode : e.key;
    this.props.vm.postIOData("keyboard", {
      key: key,
      isDown: true,
    });

    // Prevent space/arrow key from scrolling the page.
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
    this.props.vm.postIOData("keyboard", {
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
   * @function 单个元素的单击及双击事件
   * @description 通过count值，判断需执行的具体事件
   * @param {*} spriteId 传入的元素id
   * @param {*} e event
   */
  handleClickAndDoubleClick(spriteId, e) {
    console.log("处理元素的单击及双击事件:", spriteId, e);
    e.preventDefault(); // 阻止事件向下传递
    this.count++;
    setTimeout(() => {
      if (this.count === 1) {
        // 选择元素事件
        this.handleSelectSprite(spriteId);
      } else if (this.count === 2) {
        // 显示序列帧事件
        this.handleShowFrames(spriteId);
      }
      this.count = 0;
    }, 300);
  }

  /**
   * @function 选择精灵
   * @param {*} spriteId 选中精灵的id
   * @param {*} e event
   */
  handleSelectSprite(spriteId) {
    console.log("选择精灵:", spriteId);
    this.props.vm.setEditingTarget(spriteId);
    // if (this.props.stage && spriteId !== this.props.stage.id) {
    //   console.log("？？？？", this.props.editingTarget);
    //   this.props.onHighlightTarget(this.props.editingTarget);
    // }
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
    this.props.vm.duplicateSprite(spriteId);
  }

  /** @function 导出元素 */
  handleExportSprite(spriteId, e) {
    console.log("导出元素", spriteId, e);
    e.stopPropagation(); // 防止事件向上传递。
    const spriteName = this.props.vm.runtime.getTargetById(spriteId).getName();
    const saveLink = document.createElement("a");
    document.body.appendChild(saveLink);

    this.props.vm.exportSprite(spriteId).then((content) => {
      Utility.downloadBlob(`${spriteName}.sprite3`, content);
    });
  }

  /** @function 删除元素 */
  handleDeleteSprite(spriteId, e) {
    console.log("删除元素", spriteId, e);
    e.stopPropagation(); // 防止事件向上传递。
    const restoreSprite = this.props.vm.deleteSprite(spriteId);
    const restoreFun = () => restoreSprite();
    this.props.dispatchUpdateRestore({
      restoreFun: restoreFun,
      deletedItem: "Sprite",
    });
  }

  /** @function 显隐按钮组函数 */
  handleShowOrHideMoreButton() {
    console.log("显隐按钮组");
    // 显隐按钮组控制
    !this.state.isShowMoreBtn
      ? this.setState({ isShowMoreBtn: true })
      : this.setState({ isShowMoreBtn: false });
  }

  /**
   * @function 显示资源库
   * @description 外部实现,此处调用。当取消或选定资源时，或许还要在此处处理后续
   */
  handleShowAssetLibrary() {
    // 优先关闭展开的按钮组
    this.setState({ isShowMoreBtn: false, isShowMaterialLibrary: true });
    console.log("显示资源库浮层.");

    let temp_formData = new FormData();
    temp_formData.append("form[from]", 1);
    temp_formData.append("form[type]", 1);
    temp_formData.append("form[bagId]", 0);
    temp_formData.append("form[categoryId]", 0);
    temp_formData.append("form[page]", 1);

    pullMaterialList(
      `https://steam.leadersir.com/material/listUserResources`,
      temp_formData
    ).then((result) => {
      // 先处理格式化素材资源
      // formatMaterialList(result);
      // console.log('?????',formatMaterialList(result))
      // 再将资源赋值给当前变量
      this.setState({
        materialLists: formatMaterialList(result),
      });
      // 执行图像懒加载函数
      lazyLoadImage();
    });
  }

  /** @function 显示声音编辑浮层 */
  handleShowSoundEditor() {
    // 隐藏展开按钮组，并且显示声音编辑面板浮层
    this.setState({ isShowMoreBtn: false, isShowSoundEditor: true });
    console.log("显示声音编辑浮层.");
  }

  /** @function 显示绘制精灵浮层 */
  handleShowPaintEditor() {
    // 优先关闭展开的按钮组 ,并且打开绘制面板
    this.setState({ isShowMoreBtn: false, isShowPaintEditor: true });
    console.log("打开绘制面板");

    // const emptyItem = emptySprite();
    // this.props.vm.addSprite(JSON.stringify(emptyItem));
    // .then(() => {
    //   setTimeout(() => {
    //     // 在切换选项卡之前，等待目标更新传播
    //     this.props.onActivateTab(COSTUMES_TAB_INDEX);
    //   });
    // });
  }

  /**
   * @function 随机一个非背景元素
   */
  handleSurpriseSpriteClick() {
    // 优先关闭展开的按钮组
    this.setState({ isShowMoreBtn: false });
    console.log("handleSurpriseSpriteClick:", spriteLibraryContent);

    const surpriseSprites = spriteLibraryContent.filter(
      (sprite) =>
        sprite.tags.indexOf("letters") === -1 &&
        sprite.tags.indexOf("numbers") === -1
    );
    const item =
      surpriseSprites[Math.floor(Math.random() * surpriseSprites.length)];
    randomizeSpritePosition(item);
    console.log("item:", item);
    this.props.vm.addSprite(JSON.stringify(item.json));
    // .then(this.handleActivateBlocksTab);
  }

  /**
   * @function 点击绿旗，启动事件
   * @param {*} e
   */
  handleGreenFlagClick(e) {
    e.preventDefault();
    if (e.shiftKey) {
      this.props.vm.setTurboMode(!this.props.turbo);
    } else {
      if (!this.props.isStarted) this.props.vm.start();
      this.props.vm.greenFlag();
    }
  }

  /**
   * @function 点击停止所有程序
   * @param {*} e
   */
  handleStopAllClick(e) {
    e.preventDefault();
    this.props.vm.stopAll();
  }

  /** @function 变更元素名 */
  handleChangeSpriteName(name) {
    console.log("变更元素名:", name, "内中调用vm重命名元素函数");
    this.props.vm.renameSprite(this.props.editingTarget, name);
  }

  /** @function 元素显隐开关 */
  handleToggle(e) {
    let _temp = document.getElementById("isShow");
    if (_temp.checked) {
      this.handleClickVisible(e);
      this.handlePressVisible(e);
    } else if (_temp.checked == false) {
      this.handleClickNotVisible(e);
      this.handlePressNotVisible(e);
    }
  }

  /** @function 选择旋转模式 */
  handleSelectRotate() {
    let select_rotate = document.querySelector('[name="select_rotate"]');
    this.props.rotationStyle = select_rotate.value;
    // 调用变更元素旋转模式函数
    this.changeSpriteRotationStyle(select_rotate.value);
  }

  /**
   * @function 变更元素旋转模式
   * @param {*} rotationStyle
   */
  changeSpriteRotationStyle(rotationStyle) {
    this.props.vm.postSpriteInfo({ rotationStyle });
  }

  /** @function 变更元素方向值 */
  handleChangeSpriteDirection(direction) {
    this.props.vm.postSpriteInfo({ direction });
  }

  /** @function 变更元素X值 */
  handleChangeSpriteX(x) {
    this.props.vm.postSpriteInfo({ x });
  }

  /** @function 变更元素Y值 */
  handleChangeSpriteY(y) {
    this.props.vm.postSpriteInfo({ y });
  }
  /** @function 变更元素大小 */
  handleChangeSpriteSize(size) {
    this.props.vm.postSpriteInfo({ size });
  }

  /**
   * @function 变更元素显隐设置
   * @param {*} visible
   */
  handleChangeSpriteVisibility(visible) {
    console.log("变更元素显隐:", visible, "内中调用vm显隐元素函数");
    this.props.vm.postSpriteInfo({ visible });
  }

  /** @function 点击显示元素 */
  handleClickVisible(e) {
    e.preventDefault();
    this.handleChangeSpriteVisibility(true);
  }
  /** @function 点击不显示元素 */
  handleClickNotVisible(e) {
    e.preventDefault();
    this.handleChangeSpriteVisibility(false);
  }
  handlePressVisible(e) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      this.handleChangeSpriteVisibility(true);
    }
  }
  handlePressNotVisible(e) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      this.handleChangeSpriteVisibility(false);
    }
  }

  /**
   * @function 文件上传点击
   * @param {*} e
   */
  handleFileUploadClick(e) {
    e.stopPropagation(); // 防止点击选择舞台，该舞台是在背景幕上传过程中手动处理的
    this.fileInput.click();
  }

  /**
   * @function 部分支持键控
   * @description esc键，退出全屏
   * @param {*} event
   */
  handleKeyPress(event) {
    if (event.key === "Escape" && this.props.isFullScreen) {
      this.props.onSetStageUnFull(false);
    }
  }

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
    this.props.sprites[material.id] = material;
    console.log("选中元素是否添加到元素组:", this.props.sprites);

    // vm中需再做处理
    // this.props.vm.addSprite(JSON.stringify(material.costume));

    // 调用关闭素材库浮层事件
    this.handleCloseMaterialLibrary();
  }
  /** gui.jsx */
  setReduxTitle(newTitle) {
    if (newTitle === null || typeof newTitle === "undefined") {
      this.props.onUpdateReduxProjectTitle(`KID Project`);
    } else {
      this.props.onUpdateReduxProjectTitle(newTitle);
    }
  }

  /**
   * @function 新元素
   * @param {*} spriteJSONString
   */
  handleNewSprite(spriteJSONString) {
    console.log("新精灵:", spriteJSONString);
    return this.props.vm.addSprite(spriteJSONString);
    // .then(this.handleActivateBlocksTab);
  }

  /**
   * @function 变更元素上传
   * @param {*} e
   */
  handleChangeSpriteUpload(e) {
    console.log("上传精灵", e);
    const storage = this.props.vm.runtime.storage;
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
  setFileInput(input) {
    console.log("setFileInput:", input);
    this.fileInput = input;
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.rotationStyle !== nextProps.rotationStyle ||
      this.props.disabled !== nextProps.disabled ||
      this.props.name !== nextProps.name ||
      this.props.stageSize !== nextProps.stageSize ||
      this.props.visible !== nextProps.visible ||
      // Only update these if rounded value has changed
      Math.round(this.props.direction) !== Math.round(nextProps.direction) ||
      Math.round(this.props.size) !== Math.round(nextProps.size) ||
      Math.round(this.props.x) !== Math.round(nextProps.x) ||
      Math.round(this.props.y) !== Math.round(nextProps.y)
    );
  }
  /** gui.jsx end */

  /** 加载作品 vm-manager-hoc.jsx */
  loadProject() {
    return this.props.vm
      .loadProject(this.props.projectData)
      .then(() => {
        this.props.onLoadedProject(this.props.loadingState, this.props.canSave);
        // 包装setTimeout，因为渲染器中的皮肤加载可能是异步的.
        setTimeout(() => this.props.onSetProjectUnchanged());

        // 如果虚拟机未运行，请在渲染器上手动调用draw
        // This draws the state of the loaded project with no blocks running
        // which closely matches the 2.0 behavior, except for monitors–
        // 2.0 runs monitors and shows updates (e.g. timer monitor)
        // before the VM starts running other hat blocks.
        if (!this.props.isStarted) {
          // Wrap in a setTimeout because skin loading in
          // the renderer can be async.
          setTimeout(() => this.props.vm.renderer.draw());
        }
      })
      .catch((e) => {
        this.props.onError(e);
      });
  }

  /**
   * 提取作品 project-fetcher-hoc.jsx
   * @param {*} projectId 作品ID
   * @param {*} loadingState 加载状态，该值在project-state.js中定义
   */
  fetchProject(projectId, loadingState) {
    console.log(
      `fetchProject 提取作品 作品ID: ${projectId} 加载状态: ${loadingState}`
    );

    return (
      /**
       * 提取资产但不处理依赖项.
       * @param {AssetType} assetType - 要获取的资产类型.
       * @param {string} assetId - 要提取的资产的ID: a project ID, MD5, etc.
       * @param {DataFormat} dataFormat - 要获取的资产的文件格式/文件扩展名: PNG, JPG, etc.
       * @return {Promise.<Asset>} A promise for the contents of the asset.
       */
      STORAGE.load(
        STORAGE.AssetType.Project,
        projectId,
        STORAGE.DataFormat.JSON
      )
        .then((projectAsset) => {
          if (projectAsset) {
            this.props.onFetchedProjectData(projectAsset.data, loadingState);
          } else {
            // 将加载失败视为错误稍后将被catch捕获
            throw new Error("找不到项目");
          }
        })
        .catch((err) => {
          this.props.onError(err);
          console.error(err);
        })
    );
  }

  /** 检测登录状态 */
  checkLogin() {
    console.log("执行检测登入状态函数");

    fetch(GLOBAL_URL.API_SIGNIN_CHECK).then((response) => {
      response.json().then((result) => {
        if (result.success) {
          console.warn("检测登入结果:", result);
          this.props.updateUser(result);

          // 如果url含有指定字符串，则执行以下逻辑
          if (document.location.search.indexOf("?id=") > -1) {
            console.warn("调用是否可以改编作品的接口");
            let temp = new URL(document.location).searchParams;
            fetch(
              `${GLOBAL_URL.API_IS_ABLE_EDIT_PROJECT}${temp.get("id")}`
            ).then((res) => {
              res.json().then((result_) => {
                console.warn("是否可以改编作品:", result_);
                if (result_.result) {
                  // 成功，则此处显示 改编按钮
                  this.setState({
                    showEditProject: true,
                  });
                }
              });
            });
          }
        } else {
          this.props.updateUser(null);
        }
      });
    });
  }

  handleLogout() {
    fetch(GLOBAL_URL.API_SIGNOUT).then((response) => {
      response.json().then((result) => {
        console.log("sign out:", result);
        this.props.updateUser(null);
      });
    });
  }

  handleClickNew() {
    /** 优先关闭菜单-文件-子项 */
    this.setState({ isShowFileMenu: false });
    // 如果项目肮脏，并且用户拥有该项目，我们将自动保存.
    // 但是如果他们尚未登录并且无法保存，则用户应先考虑下载或登录.
    // 请注意，如果用户登录并编辑其他人的项目，他们将失去工作.
    const readyToReplaceProject = this.confirmReadyToReplaceProject(
      GLOBAL_L10N("gui.sharedMessages.replaceProjectWarning")
    );

    // this.props.onRequestCloseFile();
    if (readyToReplaceProject) {
      this.props.onClickNew(this.props.canSave && this.props.canCreateNew);
    }
    // this.props.onRequestCloseFile();
    this.props.updateProject(null);
  }

  /**
   * @function 保存到电脑
   */
  handleSaveToComputer() {
    // this.props.onRequestCloseFile();
    /** 优先关闭菜单-文件-子项 */
    this.setState({ isShowFileMenu: false });
    this.downloadProject();
    if (this.props.onProjectTelemetryEvent) {
      const metadata = collectMetadata(
        this.props.vm,
        this.props.projectTitle,
        localesInitialState.locale
      );
      this.props.onProjectTelemetryEvent("projectDidSave", metadata);
    }
  }

  /**
   * @function 下载项目
   */
  downloadProject() {
    this.props.saveProjectSb3().then((content) => {
      if (this.props.onSaveFinished) {
        this.props.onSaveFinished();
      }
      Utility.downloadBlob(
        `${
          this.props.projectTitle.length === 0 ? "KID" : this.props.projectTitle
        }.sb3`,
        content
      );
    });
  }

  /**
   * 打开登入窗体
   */
  handleSignIn() {
    this.setState({
      showLogin: true,
    });
  }

  /**
   *  点击关闭登入
   */
  handleCloseSignIn() {
    this.setState({
      showLogin: false,
    });
  }

  /**
   * 初始化发布
   */
  handlePushProject() {
    // this.checkLogin();
    /** 临时测试，为测试发布作品，注释该if语句块 */
    if (this.props.user == null) {
      // 先检测有没有登录
      RETURN_MESSAGE("请先登录");
      return;
    }

    /**
     * 点击发布按钮之后 创建一个发布作品对话框
     * 把props传递给原生使用
     */
    CREATE_PUSH_MODAL(this.props, this.state.showEditProject);
  }

  /**
   * @function 从电脑中上传项目
   * @param {*} e
   */
  handlePushProjectFormComputer(e) {
    console.log("从电脑中上传:", e);
    /** 优先关闭菜单-文件-子项 */
    this.setState({ isShowFileMenu: false });
    document.getElementById("push_project").click();
    // this.props.onRequestCloseFile();
  }

  /**
   * @function 选择文件
   */
  handleFileChange() {
    console.log("选择文件");
    let temp = document.getElementById("push_project");
    console.log("temp:", temp);
    console.log("temp:", temp.files[0]);

    if (temp.files.length > 0) {
      let _temp_this = this;
      let reader = new FileReader();
      reader.readAsArrayBuffer(temp.files[0]);
      reader.onload = function (event) {
        console.log("onload:", event.target.result);
        _temp_this.props.onLoadingStarted();
        console.log("this.props.vm:", _temp_this.props.vm);
        _temp_this.props.vm.loadProject(event.target.result).then(() => {
          // _temp_this.props.onLoadingFinished(
          //   _temp_this.props.loadingState,
          //   true
          // );
          _temp_this.props.onUpdateProjectTitle(
            Utility.getProjectTitleFromFilename(temp.files[0].name)
          );

          temp.value = null;
        });
      };
    }
  }

  /**
   * @function 显隐菜单-文件-子项
   */
  handleShowFileMenu() {
    !this.state.isShowFileMenu
      ? this.setState({ isShowFileMenu: true })
      : this.setState({ isShowFileMenu: false });
    console.log("菜单-文件 显隐控制", this.state.isShowFileMenu);
  }
  /**
   * @function 显隐菜单-编辑-子项
   */
  handleShowEditMenu() {
    !this.state.isShowEditMenu
      ? this.setState({ isShowEditMenu: true })
      : this.setState({ isShowEditMenu: false });
    console.log("菜单-编辑 显隐控制", this.state.isShowEditMenu);
  }
  /**
   * @function 显隐右侧-用户-子项
   */
  handleAccountMenu() {
    !this.state.isShowAccountMenu
      ? this.setState({ isShowAccountMenu: true })
      : this.setState({ isShowAccountMenu: false });
    console.log("右侧-用户 显隐控制", this.state.isShowAccountMenu);
  }

  /**
   * @function 加速模式开关
   */
  handleToggleTurboMode() {
    console.log("加速模式开关");
    this.state.isTurboMode
      ? this.setState({ isTurboMode: false })
      : this.setState({ isTurboMode: true });
    this.props.vm.setTurboMode(!this.state.isTurboMode);
  }

  /**
   * @function 确认准备更换项目
   * @param {*} message
   */
  confirmReadyToReplaceProject(message) {
    let readyToReplaceProject = true;
    if (this.props.projectChanged && !this.props.canCreateNew) {
      readyToReplaceProject = this.props.confirmWithMessage(message);
    }
    return readyToReplaceProject;
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
    let selectedSprite = this.props.sprites[this.props.editingTarget];
    let spriteInfoDisabled = false;
    if (typeof selectedSprite === "undefined") {
      selectedSprite = {};
      spriteInfoDisabled = true;
    }

    const {
      /* eslint-disable no-unused-vars */
      isFetchingWithoutId: isFetchingWithoutIdProp,
      reduxProjectId,
      setProjectId: setProjectIdProp,
      /* eslint-enable no-unused-vars */
      ...componentProps
    } = this.props;

    if (this.props.children) {
      return <div {...props}>{this.props.children}</div>;
    }

    if (isRendererSupported === null) {
      let gl = document.createElement("canvas").getContext("webgl");
      isRendererSupported = gl instanceof WebGLRenderingContext;
    }

    return (
      // 外部必须套一下。
      <React.Fragment>
        {/* 这段的props都没处理 */}
        {this.props.isPlayerOnly ? (
          <StageWrapper
            isFullScreen={isFullScreen}
            isRendererSupported={isRendererSupported}
            loading={fetchingProject || isLoading || loadingStateVisible}
            stageSize={STAGE_SIZE_MODES.large}
            vm={this.props.vm}
          >
            {alertsVisible ? (
              <Alerts className={styles.alertsContainer} />
            ) : null}
          </StageWrapper>
        ) : (
          <div className={styles.pageWrapper} dir={"ltr"} {...componentProps}>
            {/* 加载 */}
            {this.props.loading ? <Loader /> : null}
            {this.props.isCreating ? <Loader /> : null}
            {/* {isRendererSupported ? null : <WebGlModal />} */}
            {isRendererSupported ? null : (
              <div>当前浏览器不支持WebGL,请替换或更新至Chrome 85 及以上</div>
            )}
            {/* alerts */}
            {this.props.alertsVisible ? (
              <Alerts className={styles.alertsContainer} />
            ) : null}
            {this.props.connectionModalVisible ? (
              <ConnectionModal vm={this.props.vm} />
            ) : null}
            {/* 登入浮层 */}
            {this.state.showLogin ? (
              <LoginModal handleClose={this.handleCloseSignIn.bind(this)} />
            ) : null}
            {/* 绘制浮层 */}
            {this.state.isShowPaintEditor ? (
              <CostumeTab vm={this.props.vm} />
            ) : null}
            {/* 声音浮层 */}
            {this.state.isShowSoundEditor ? (
              <SoundTab vm={this.props.vm} />
            ) : null}
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

            {/* 顶部工具栏 */}
            {/* <MenuBarContainer
              // accountNavOpen={this.props.accountNavOpen}
              authorId={this.props.authorId}
              authorThumbnailUrl={this.props.authorThumbnailUrl}
              authorUsername={this.props.authorUsername}
              // canCreateCopy={this.props.canCreateCopy}
              canCreateNew={this.props.canCreateNew}
              canEditTitle={this.props.canEditTitle}
              canManageFiles={this.props.canManageFiles}
              // canRemix={this.props.canRemix}
              canSave={this.props.canSave}
              canShare={this.props.canShare}
              enableCommunity={this.props.enableCommunity}
              isShared={this.props.isShared}
              // renderLogin={this.props.renderLogin}
              showComingSoon={this.props.showComingSoon}
              // onClickAccountNav={this.props.onClickAccountNav}
              // onCloseAccountNav={this.props.onCloseAccountNav}
              onLogOut={this.props.onLogOut}
              onOpenRegistration={this.props.onOpenRegistration}
              onProjectTelemetryEvent={this.props.onProjectTelemetryEvent}
              // onSeeCommunity={this.props.onSeeCommunity}
              onShare={this.props.onShare}
              onToggleLoginOpen={this.props.onToggleLoginOpen}
              onUpdateProjectTitle={this.props.onUpdateProjectTitle}
            /> */}

            <div className="header">
              {/* 左侧LOGO */}
              <div className="kid_logo">
                <a href={`${GLOBAL_URL.LINK_LEADERSIR_HOME}`} target="_black">
                  <img
                    alt="kid"
                    draggable={false}
                    src={GLOBAL_URL.ASSET_LOGO}
                  />
                </a>
              </div>
              {/* 中间菜单区域 */}
              <div className="nav">
                {/* 文件 */}
                <div onMouseUp={this.handleShowFileMenu.bind(this)}>
                  {GLOBAL_L10N("gui.menuBar.file")}
                  <ul
                    className="menu"
                    style={{
                      display: this.state.isShowFileMenu ? "block" : "none",
                    }}
                  >
                    {/* 新建 */}
                    <li onClick={this.handleClickNew.bind(this)}>新建作品</li>
                    {/* 上传本地文件 */}
                    <li onClick={this.handlePushProjectFormComputer.bind(this)}>
                      打开作品
                      <input
                        id="push_project"
                        accept=".sb,.sb2,.sb3"
                        style={{ display: "none" }}
                        type="file"
                        onChange={this.handleFileChange.bind(this)}
                      />
                    </li>
                    {/* 下载文件至电脑 */}
                    <li onClick={this.handleSaveToComputer.bind(this)}>
                      存入电脑
                    </li>
                  </ul>
                </div>

                {/* 编辑 */}
                <div onMouseUp={this.handleShowEditMenu.bind(this)}>
                  {GLOBAL_L10N("gui.menuBar.edit")}
                  <ul
                    className="menu"
                    style={{
                      display: this.state.isShowEditMenu ? "block" : "none",
                    }}
                  >
                    <li onClick={this.handleToggleTurboMode.bind(this)}>
                      {this.state.isTurboMode
                        ? GLOBAL_L10N("gui.menuBar.turboModeOff")
                        : GLOBAL_L10N("gui.menuBar.turboModeOn")}
                    </li>
                  </ul>
                </div>
                {/* 发布 / 批改 */}
                <div onClick={this.handlePushProject.bind(this)}>
                  {this.state.showEditProject
                    ? "批改"
                    : GLOBAL_L10N("gui.menuBar.pushProject")}
                </div>
                {/* 教程 */}
                <div>
                  <a
                    href={`${GLOBAL_URL.LINK_LEADERSIR_TUTORIALS}`}
                    target="_blank"
                    className={`a_to_btn`}
                  >
                    {GLOBAL_L10N("gui.menuBar.tutorialsLibrary")}
                  </a>
                </div>
                {/* 作品库 */}
                <div>
                  <a
                    href={`${GLOBAL_URL.LINK_LOOK_PROJECT}`}
                    target="_blank"
                    className={`a_to_btn`}
                  >
                    {GLOBAL_L10N("gui.menuBar.seeProjectPage")}
                  </a>
                </div>
              </div>

              {/* 右侧登录 */}
              <div className={`menu_right`}>
                {/* show the proper UI in the account menu, given whether the user is
                logged in, and whether a session is available to log in with */}
                <div className={styles.accountInfoGroup}>
                  {this.props.user ? (
                    // ************ user is logged in ************
                    <React.Fragment>
                      <div
                        // className={classNames(styles.userInfo, {
                        //   [styles.active]: this.props.accountMenuOpen,
                        // })}
                        className={styles.userInfo}
                        onMouseUp={this.handleAccountMenu.bind(this)}
                      >
                        {this.props.thumbnailUrl ? (
                          <img
                            className={`${styles.avatar} ${styles.userThumbnail}`}
                            src={this.props.thumbnailUrl}
                          />
                        ) : null}
                        <span className={styles.profileName}>
                          {this.props.user.nickName}
                        </span>
                        <div className={styles.dropdownCaretPosition}>
                          <img
                            className={styles.dropdownCaretIcon}
                            src={GLOBAL_URL.ASSET_ICON_DROPDOWN}
                          />
                        </div>
                        <ul
                          className="menu"
                          style={{
                            display: this.props.isShowAccountMenu
                              ? "block"
                              : "none",
                          }}
                        >
                          <li onClick={this.handleLogout.bind(this)}>
                            {GLOBAL_L10N("gui.accountMenu.signOut")}
                          </li>
                        </ul>
                      </div>
                      {/* 此处嵌套是为了解决内部ulli错位，但又无法直接改变class的问题 */}
                      {/* <div className="sign_out">
                  <ul
                    className="menu"
                    style={{
                      top: this.props.accountMenuOpen ? `3rem` : "-9rem",
                    }}
                  >
                    <li onClick={this.handleLogout.bind(this)}>
                      {GLOBAL_L10N("gui.accountMenu.signOut")}
                    </li>
                  </ul>
                </div> */}
                    </React.Fragment>
                  ) : (
                    // ********* user not logged in *********
                    // 登入按钮
                    <React.Fragment>
                      <div
                        className="btn_login"
                        key="login"
                        onMouseUp={this.handleSignIn.bind(this)}
                      >
                        {GLOBAL_L10N("gui.menuBar.signIn")}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>

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
                    vm={this.props.vm}
                  />
                </div>
                {/* 积木编辑区右上角 显示当前选中精灵 */}
                <div className={styles.watermark}>
                  <Watermark />
                </div>
              </section>
              {/* 未来的元素选择区域
    拉取作品之后，当有了元素组，在此展示
    此处，代码写到外部
  */}
              <section className="main_center">
                {/* 添加元素 */}
                <div className="add_menu_container">
                  {/* 主按钮 */}
                  <button
                    className="button_common button_main"
                    onClick={this.handleShowOrHideMoreButton.bind(this)}
                  ></button>
                  {/* 扩展按钮 */}
                  {this.state.isShowMoreBtn ? (
                    <div className="more_buttons_outer">
                      <div className={`more_buttons`}>
                        {/* 上传一个素材，凡上传素材，皆作为非背景元素处理 */}
                        <button
                          className="button_common"
                          style={{
                            background: `center / contain no-repeat url(${GLOBAL_URL.ASSET_ICON_FILE_UPLOAD}),#ff8800`,
                          }}
                          aria-label="上传"
                          onClick={this.handleFileUploadClick.bind(this)}
                        >
                          <input
                            accept=".svg, .png, .jpg, .jpeg, .sprite2, .sprite3"
                            className="file_input"
                            multiple
                            ref={this.setFileInput.bind(this)}
                            type="file"
                            onChange={this.handleChangeSpriteUpload.bind(this)}
                          />
                          <br />
                          上传
                        </button>
                        {/* 随机一个非背景元素 */}
                        <button
                          className="button_common"
                          style={{
                            background: `center / contain no-repeat url(${GLOBAL_URL.ASSET_ICON_SURPRISE}),#ff8800`,
                          }}
                          aria-label="随机"
                          onClick={this.handleSurpriseSpriteClick.bind(this)}
                        >
                          <br />
                          随机
                        </button>
                        {/* 绘制 */}
                        <button
                          className="button_common"
                          style={{
                            background: `center / contain no-repeat url(${GLOBAL_URL.ASSET_ICON_PAINT}),#ff8800`,
                          }}
                          aria-label="绘制"
                          onClick={this.handleShowPaintEditor.bind(this)}
                        >
                          <br />
                          绘制
                        </button>
                        {/* 素材库 */}
                        <button
                          className="button_common"
                          style={{
                            background: `center / contain no-repeat url(${GLOBAL_URL.ASSET_ICON_SEARCH}),#ff8800`,
                          }}
                          aria-label="素材库"
                          // onClick={this.props.onNewSpriteClick}
                          onClick={this.handleShowAssetLibrary.bind(this)}
                        >
                          <br />
                          素材库
                        </button>
                        {/* 声音浮层开关事件，暂时放在这里 */}
                        <button
                          className="button_common"
                          style={{
                            background: `center / contain no-repeat url(${GLOBAL_URL.ASSET_ICON_SOUND}),#ff8800`,
                          }}
                          aria-label="声音"
                          onClick={this.handleShowSoundEditor.bind(this)}
                        >
                          声音
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
                {/* 元素组 */}
                <div className="sprite_selector">
                  {/* 遍历项目中所有图像元素 */}
                  {this.props.sprites
                    ? Object.keys(this.props.sprites).map((id) => {
                        console.log("id:", id);
                        return (
                          <section
                            // 非舞台元素，含有可拖拽设置
                            className={`${
                              this.props.editingTarget == id
                                ? "is_selected"
                                : ""
                            } ${
                              this.props.sprites[id].name != "Stage"
                                ? "is_draggable"
                                : ""
                            }`}
                            onClick={this.handleClickAndDoubleClick.bind(
                              this,
                              id
                            )}
                          >
                            {/* 元素的对应资源url */}
                            {this.props.sprites[id].costumes[0].asset ? (
                              <div
                                className="sprite_image_show"
                                style={{
                                  backgroundImage: `url(${
                                    // 如果有文件名，表示为格式化的元素，即可使用url，否则使用原始方式
                                    this.props.sprites[id].fileName
                                      ? GLOBAL_URL.ASSET_MATERIAL +
                                        this.props.sprites[id].fileName
                                      : GetAssetURL(
                                          this.props.sprites[id].costumes[0]
                                            .asset
                                        )
                                  })`,
                                }}
                              ></div>
                            ) : null}
                            {/* 元素名 */}
                            <div className="sprite_name">
                              {this.props.sprites[id].name == "Stage"
                                ? "背景"
                                : this.props.sprites[id].name}
                            </div>
                            {/* 单一元素的操作按钮组,其中全包含删除按钮，非背景元素含复制及导出按钮 */}
                            <div
                              aria-label="Copy"
                              className="sprite_btn_common btn_copy"
                              style={{
                                backgroundImage: `url(${GLOBAL_URL.ASSET_ICON_DELETE})`,
                                opacity: `${
                                  this.props.editingTarget == id &&
                                  this.props.sprites[id].name != "Stage"
                                    ? 1
                                    : 0
                                }`,
                              }}
                              role="button"
                              onClick={this.handleDuplicateSprite.bind(
                                this,
                                id
                              )}
                            ></div>

                            <div
                              aria-label="Exoprt"
                              className="sprite_btn_common btn_export"
                              style={{
                                backgroundImage: `url(${GLOBAL_URL.ASSET_ICON_DELETE})`,
                                opacity: `${
                                  this.props.editingTarget == id &&
                                  this.props.sprites[id].name != "Stage"
                                    ? 1
                                    : 0
                                }`,
                              }}
                              role="button"
                              onClick={this.handleExportSprite.bind(this, id)}
                            ></div>

                            <div
                              aria-label="Delete"
                              className="sprite_btn_common btn_delete"
                              style={{
                                backgroundImage: `url(${GLOBAL_URL.ASSET_ICON_DELETE})`,
                                opacity: `${
                                  this.props.editingTarget == id ? 1 : 0
                                }`,
                              }}
                              role="button"
                              onClick={this.handleDeleteSprite.bind(this, id)}
                            ></div>
                          </section>
                        );
                      })
                    : null}
                </div>
              </section>

              {/* 右侧 */}
              <section className="main_right">
                {/* 舞台程序操作器 及 屏幕设置 */}
                <div
                  className={
                    this.props.isFullScreen
                      ? "stage_header_overlay"
                      : "stage_header"
                  }
                >
                  {/* 开始运行及停止运行的切换按钮 以active判断 */}
                  <img
                    className="start_or_stop"
                    draggable={false}
                    src={
                      !this.props.projectRunning
                        ? GLOBAL_URL.ASSET_ICON_GREEN_FLAG
                        : GLOBAL_URL.ASSET_ICON_STOP_ALL
                    }
                    title={
                      !this.props.projectRunning
                        ? GLOBAL_L10N("gui.controls.go")
                        : GLOBAL_L10N("gui.controls.stop")
                    }
                    onClick={
                      !this.props.projectRunning
                        ? this.handleGreenFlagClick.bind(this)
                        : this.handleStopAllClick.bind(this)
                    }
                  />
                  {this.props.turbo ? (
                    <div className="turbo_container">
                      <img
                        className="turbo_icon"
                        src={GLOBAL_URL.ASSET_ICON_TURBO}
                      />
                      <div className="turbo_label">
                        {GLOBAL_L10N("gui.turboMode.active")}
                      </div>
                    </div>
                  ) : null}

                  <div
                    className="stage_header_button"
                    onClick={
                      this.props.isFullScreen
                        ? this.props.onSetStageUnFull
                        : this.props.onSetStageFull
                    }
                    onKeyPress={
                      this.props.isFullScreen
                        ? this.handleKeyPress.bind(this)
                        : null
                    }
                  >
                    <img
                      alt={
                        this.props.isFullScreen
                          ? GLOBAL_L10N("gui.stageHeader.stageSizeUnFull")
                          : GLOBAL_L10N("gui.stageHeader.stageSizeFull")
                      }
                      draggable={false}
                      src={
                        this.props.isFullScreen
                          ? GLOBAL_URL.ASSET_ICON_UNFULLSCREEN
                          : GLOBAL_URL.ASSET_ICON_FULLSCREEN
                      }
                      title={GLOBAL_L10N("gui.stageHeader.fullscreenControl")}
                    />
                  </div>
                </div>

                {/* 舞台 canvas */}
                <div className="stage_canvas_wrapper">
                  {isRendererSupported ? (
                    <Stage
                      stageSize={this.props.stageSize}
                      vm={this.props.vm}
                    />
                  ) : null}
                </div>
                {this.props.loading ? (
                  <Loader isFullScreen={this.props.isFullScreen} />
                ) : null}

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
                    {/* 一个显隐切换按钮 toggle */}
                    <label class="toggle">
                      <input
                        type="checkbox"
                        checked={selectedSprite.visible}
                        id="isShow"
                        onChange={this.handleToggle.bind(this)}
                      />
                      <span class="slider"></span>
                    </label>
                    {/* 旋转模式 */}
                    <div>
                      旋转:
                      <select
                        className="rotate_mode"
                        name="select_rotate"
                        required
                        onChange={this.handleSelectRotate.bind(this)}
                      >
                        {Object.keys(ROTATE_MODE).map((item, index) => (
                          <option key={index} value={ROTATE_MODE[item].key}>
                            {ROTATE_MODE[item].value}
                          </option>
                        ))}
                      </select>
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
                        value={
                          spriteInfoDisabled ? "" : selectedSprite.direction
                        }
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
                          spriteInfoDisabled
                            ? ""
                            : Math.round(selectedSprite.size)
                        }
                        onSubmit={this.handleChangeSpriteSize.bind(this)}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </main>
            <DragLayer />
          </div>
        )}
      </React.Fragment>
    );
  }
}
HashParserComponent.propTypes = {
  isFetchingWithoutId: PropTypes.bool,
  reduxProjectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setProjectId: PropTypes.func,

  /** project-fetcher-hoc.jsx */
  assetHost: PropTypes.string,
  canSave: PropTypes.bool,
  isCreatingNew: PropTypes.bool,
  isFetchingWithId: PropTypes.bool,
  isLoadingProject: PropTypes.bool,
  isShowingProject: PropTypes.bool,
  loadingState: PropTypes.oneOf(LoadingStates),
  onError: PropTypes.func,
  onFetchedProjectData: PropTypes.func,
  onProjectUnchanged: PropTypes.func,
  projectHost: PropTypes.string,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  reduxProjectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setProjectId: PropTypes.func,

  /** project-save-hoc.jsx */
  autoSaveIntervalSecs: PropTypes.number.isRequired,
  autoSaveTimeoutId: PropTypes.number,
  canCreateNew: PropTypes.bool,
  isAnyCreatingNewState: PropTypes.bool,
  isCreatingCopy: PropTypes.bool,
  isCreatingNew: PropTypes.bool,
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
  onProjectTelemetryEvent: PropTypes.func,
  onRemixing: PropTypes.func,
  onSetProjectSaver: PropTypes.func.isRequired,
  onSetProjectThumbnailer: PropTypes.func.isRequired,
  onSetProjectUnchanged: PropTypes.func.isRequired,
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
  reduxProjectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  reduxProjectTitle: PropTypes.string,
  setAutoSaveTimeoutId: PropTypes.func.isRequired,
  vm: PropTypes.instanceOf(VM).isRequired,

  /** vm-listener-hoc.jsx */
  attachKeyboardEvents: PropTypes.bool,
  onBlockDragUpdate: PropTypes.func.isRequired,
  onGreenFlag: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onMicListeningUpdate: PropTypes.func.isRequired,
  onMonitorsUpdate: PropTypes.func.isRequired,
  onProjectChanged: PropTypes.func.isRequired,
  onProjectRunStart: PropTypes.func.isRequired,
  onProjectRunStop: PropTypes.func.isRequired,
  onProjectSaved: PropTypes.func.isRequired,
  onRuntimeStarted: PropTypes.func.isRequired,
  onShowExtensionAlert: PropTypes.func.isRequired,
  onTargetsUpdate: PropTypes.func.isRequired,
  onTurboModeOff: PropTypes.func.isRequired,
  onTurboModeOn: PropTypes.func.isRequired,
  projectChanged: PropTypes.bool,
  shouldUpdateTargets: PropTypes.bool,
  shouldUpdateProjectChanged: PropTypes.bool,
  username: PropTypes.string,

  canSave: PropTypes.bool,
  cloudHost: PropTypes.string,
  isLoadingWithId: PropTypes.bool,
  isPlayerOnly: PropTypes.bool,
  isStarted: PropTypes.bool,
  onError: PropTypes.func,
  onLoadedProject: PropTypes.func,
  onSetProjectUnchanged: PropTypes.func,
  projectData: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  canCreateNew: PropTypes.bool,
  canSave: PropTypes.bool,
  confirmWithMessage: PropTypes.func,
  projectChanged: PropTypes.bool,

  authorId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  authorThumbnailUrl: PropTypes.string,
  authorUsername: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  autoUpdateProject: PropTypes.func,
  canEditTitle: PropTypes.bool,
  canManageFiles: PropTypes.bool,
  canShare: PropTypes.bool,
  confirmReadyToReplaceProject: PropTypes.func,
  isShared: PropTypes.bool,
  isShowingProject: PropTypes.bool,
  isUpdating: PropTypes.bool,
  logo: PropTypes.string,
  onClickNew: PropTypes.func,
  onClickSave: PropTypes.func,
  onLogOut: PropTypes.func,
  onOpenRegistration: PropTypes.func,
  onProjectTelemetryEvent: PropTypes.func,
  onShare: PropTypes.func,
  onToggleLoginOpen: PropTypes.func,
  onUpdateProjectTitle: PropTypes.func,
  projectTitle: PropTypes.string,
  sessionExists: PropTypes.bool,
  shouldSaveBeforeTransition: PropTypes.func,
  showComingSoon: PropTypes.bool,
  userOwnsProject: PropTypes.bool,
  user: PropTypes.object,
  project: PropTypes.object,
  vm: PropTypes.instanceOf(VM).isRequired,
  updateUser: PropTypes.func,
  updateProject: PropTypes.func,
  saveProjectSb3: PropTypes.func,

  isLoadingUpload: PropTypes.bool,
  isShowingWithoutId: PropTypes.bool,
  loadingState: PropTypes.oneOf(LoadingStates),
  onLoadingStarted: PropTypes.func,
  requestProjectUpload: PropTypes.func,
};

/** project-fetcher-hoc.jsx 资源和项目的HOST */
HashParserComponent.defaultProps = {
  assetHost: `${GLOBAL_URL.HOST_ASSET}`,
  projectHost: `${GLOBAL_URL.HOST_ASSET}`,

  /** project-save-hoc.jsx */
  autoSaveIntervalSecs: 120,
  onRemixing: () => {},
  onSetProjectThumbnailer: () => {},
  onSetProjectSaver: () => {},
  onUpdateProjectData: saveProjectToServer,

  attachKeyboardEvents: true,
  onGreenFlag: () => ({}),

  onStorageInit: (storageInstance) =>
    storageInstance.addOfficialScratchWebStores(),
  onProjectLoaded: () => {},
  onUpdateProjectId: () => {},
  onVmInit: (/* vm */) => {},

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
  onUpdateProjectTitle: () => {},
  showComingSoon: false,
  stageSizeMode: STAGE_SIZE_MODES.large,

  confirmWithMessage: (message) => confirm(message),
  onShare: () => {},
};

const mapStateToProps = (state, ownProps) => {
  const loadingState = state.scratchGui.projectState.loadingState;
  /** project-fetcher-hoc.jsx */
  const isShowingWithId = getIsShowingWithId(loadingState);
  return {
    isFetchingWithoutId: getIsFetchingWithoutId(loadingState),
    reduxProjectId: state.scratchGui.projectState.projectId,
    /** project-fetcher-hoc.jsx */
    autoSaveTimeoutId: state.scratchGui.timeout.autoSaveTimeoutId,
    isAnyCreatingNewState: getIsAnyCreatingNewState(loadingState),
    isLoading: getIsLoading(loadingState),
    isCreatingCopy: getIsCreatingCopy(loadingState),
    isCreatingNew: getIsCreatingNew(loadingState),
    isRemixing: getIsRemixing(loadingState),
    isShowingSaveable: ownProps.canSave && isShowingWithId,
    isShowingWithId: isShowingWithId,
    isShowingWithoutId: getIsShowingWithoutId(loadingState),
    isUpdating: getIsUpdating(loadingState),
    isManualUpdating: getIsManualUpdating(loadingState),
    loadingState: loadingState,
    projectChanged: state.scratchGui.projectChanged,
    reduxProjectId: state.scratchGui.projectState.projectId,
    reduxProjectTitle: state.scratchGui.projectTitle,
    vm: state.scratchGui.vm,

    /** vm-listener-hoc.jsx */
    isLoadingWithId: getIsLoadingWithId(loadingState),
    projectData: state.scratchGui.projectState.projectData,
    projectId: state.scratchGui.projectState.projectId,
    loadingState: loadingState,
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
    isStarted: state.scratchGui.vmStatus.started,

    /** gui.jsx */
    alertsVisible: state.scratchGui.alerts.visible,
    connectionModalVisible: state.scratchGui.modals.connectionModal,
    costumeLibraryVisible: state.scratchGui.modals.costumeLibrary,
    error: state.scratchGui.projectState.error,
    isError: getIsError(loadingState),
    isFullScreen: state.scratchGui.mode.isFullScreen,
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
    isShowingProject: getIsShowingProject(loadingState),
    loadingStateVisible: state.scratchGui.modals.loadingProject,
    projectId: state.scratchGui.projectState.projectId,
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

    /** StageHeader Control */
    isStarted: state.scratchGui.vmStatus.running,
    projectRunning: state.scratchGui.vmStatus.running,
    turbo: state.scratchGui.vmStatus.turbo,

    projectChanged: state.scratchGui.projectChanged,
    // Do not emit target or project updates in fullscreen or player only mode
    // or when recording sounds (it leads to garbled recordings on low-power machines)
    shouldUpdateTargets:
      !state.scratchGui.mode.isFullScreen &&
      !state.scratchGui.mode.isPlayerOnly &&
      !state.scratchGui.modals.soundRecorder,
    // Do not update the projectChanged state in fullscreen or player only mode
    shouldUpdateProjectChanged:
      !state.scratchGui.mode.isFullScreen &&
      !state.scratchGui.mode.isPlayerOnly,
    username:
      state.session && state.session.session && state.session.session.user
        ? state.session.session.user.username
        : "",

    /** 当前文件 */
    isCreatingNew: getIsCreatingNew(state.scratchGui.projectState.loadingState),
    isFetchingWithId: getIsFetchingWithId(
      state.scratchGui.projectState.loadingState
    ),
    isLoadingProject: getIsLoading(state.scratchGui.projectState.loadingState),
    isShowingProject: getIsShowingProject(
      state.scratchGui.projectState.loadingState
    ),
    loadingState: state.scratchGui.projectState.loadingState,
    reduxProjectId: state.scratchGui.projectState.projectId,
    project: state.scratchGui.mine.project,

    isUpdating: getIsUpdating(loadingState),
    // isShowingProject: getIsShowingProject(loadingState),
    projectTitle: state.scratchGui.projectTitle,
    sessionExists:
      state.session && typeof state.session.session !== "undefined",
    user: state.scratchGui.mine.curr_user,
    // project: state.scratchGui.mine.project,
    userOwnsProject:
      ownProps.authorUsername &&
      user &&
      ownProps.authorUsername === user.username,
    // vm: state.scratchGui.vm,
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(
      state.scratchGui.vm
    ),
    isLoadingUpload: getIsLoadingUpload(loadingState),
  };
};
const mapDispatchToProps = (dispatch, ownProps) => ({
  setProjectId: (projectId) => {
    dispatch(setProjectId(projectId));
  },
  /** project-fetcher-hoc.jsx */
  onError: (error) => dispatch(projectError(error)),
  onFetchedProjectData: (projectData, loadingState) =>
    dispatch(onFetchedProjectData(projectData, loadingState)),
  setProjectId: (projectId) => dispatch(setProjectId(projectId)),
  onProjectUnchanged: () => dispatch(setProjectUnchanged()),
  updateProject: (project) => dispatch(updateProject(project)),
  onLoadingFinished: (loadingState, success) => {
    dispatch(onLoadedProject(loadingState, ownProps.canSave, success));
    dispatch(closeLoadingProject());
  },

  /** project-save-hoc.jsx */
  onAutoUpdateProject: () => dispatch(autoUpdateProject()),
  onCreatedProject: (projectId, loadingState) =>
    dispatch(doneCreatingProject(projectId, loadingState)),
  onCreateProject: () => dispatch(createProject()),
  onProjectError: (error) => dispatch(projectError(error)),
  onSetProjectUnchanged: () => dispatch(setProjectUnchanged()),
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
  onTargetsUpdate: (data) => {
    dispatch(updateTargets(data.targetList, data.editingTarget));
  },
  onMonitorsUpdate: (monitorList) => {
    dispatch(updateMonitors(monitorList));
  },
  onBlockDragUpdate: (areBlocksOverGui) => {
    dispatch(updateBlockDrag(areBlocksOverGui));
  },
  onProjectRunStart: () => dispatch(setRunningState(true)),
  onProjectRunStop: () => dispatch(setRunningState(false)),
  onProjectChanged: () => dispatch(setProjectChanged()),
  onProjectSaved: () => dispatch(setProjectUnchanged()),
  onRuntimeStarted: () => dispatch(setStartedState(true)),
  onTurboModeOn: () => dispatch(setTurboState(true)),
  onTurboModeOff: () => dispatch(setTurboState(false)),
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
  onRequestCloseCostumeLibrary: () => dispatch(closeCostumeLibrary()),
  onUpdateReduxProjectTitle: (title) => dispatch(setProjectTitle(title)),

  onReceivedBlocks: (receivedBlocks) => {
    dispatch(setReceivedBlocks(receivedBlocks));
  },
  dispatchUpdateRestore: (restoreState) => {
    dispatch(setRestore(restoreState));
  },
  onHighlightTarget: (id) => {
    dispatch(highlightTarget(id));
  },
  onCloseImporting: () => dispatch(closeAlertWithId("importingAsset")),
  onShowImporting: () => dispatch(showStandardAlert("importingAsset")),
  /** StageHeader */
  onSetStageFull: () => dispatch(setFullScreen(true)),
  onSetStageUnFull: () => dispatch(setFullScreen(false)),

  // autoUpdateProject: () => dispatch(autoUpdateProject()),
  onClickNew: (needSave) => dispatch(requestNewProject(needSave)),
  onClickSave: () => dispatch(manualUpdateProject()),
  updateUser: (user) => dispatch(updateUser(user)),
  // updateProject: (project) => dispatch(updateProject(project)),

  // onLoadingFinished: (loadingState, success) => {
  //   dispatch(onLoadedProject(loadingState, ownProps.canSave, success));
  //   dispatch(closeLoadingProject());
  //   // dispatch(closeFileMenu());
  // },
  requestProjectUpload: (loadingState) =>
    dispatch(requestProjectUpload(loadingState)),
  onLoadingStarted: () => dispatch(openLoadingProject()),
});

const WrappedGui = connect(
  mapStateToProps,
  mapDispatchToProps
)(HashParserComponent);

export default WrappedGui;
