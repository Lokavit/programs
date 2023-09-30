/*
 * @Author: Satya
 * @Date: 2020-08-02 18:48:05
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-15 13:45:26
 * doc:
 *  更换扩展库预览文件在本文件的使用
 */

import bindAll from "lodash.bindall";
import debounce from "lodash.debounce";
import defaultsDeep from "lodash.defaultsdeep";
import PropTypes from "prop-types";
import React from "react";

import Prompt from "./prompt.jsx";
import BlocksComponent from "../components/blocks/blocks.jsx";
import ExtensionLibrary from "./extension-library.jsx";
// 新写的加载扩展库预览方式
import { EXTENSIONLIBRARY_DATA } from "../lib/libraries/extension-library-data";
import CustomProcedures from "./custom-procedures.jsx";
// import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import { STAGE_DISPLAY_SIZES } from "../lib/layout-constants";
import DropAreaHOC from "../lib/drop-area-hoc.jsx";
import DragConstants from "../lib/drag-constants";
import defineDynamicBlock from "../lib/define-dynamic-block";

import { connect } from "react-redux";
import { updateToolbox } from "../reducers/toolbox";
import { activateColorPicker } from "../reducers/color-picker";
import {
  closeExtensionLibrary,
  openSoundRecorder,
  openConnectionModal,
} from "../reducers/modals";
import {
  activateCustomProcedures,
  deactivateCustomProcedures,
} from "../reducers/custom-procedures";
import { setConnectionModalExtensionId } from "../reducers/connection-modal";

const addFunctionListener = (object, property, callback) => {
  const oldFn = object[property];
  object[property] = function () {
    const result = oldFn.apply(this, arguments);
    callback.apply(this, result);
    return result;
  };
};

const DroppableBlocks = DropAreaHOC([DragConstants.BACKPACK_CODE])(
  BlocksComponent
);

class Blocks extends React.Component {
  constructor(props) {
    super(props);
    this.KidBlocks = RETURN_KID_VERISON()
      ? VM_BLOCKS_PRO(VM)
      : VM_BLOCKS_JR(VM);
    bindAll(this, [
      "attachVM",
      "detachVM",
      "getToolboxXML",
      "handleCategorySelected",
      "handleConnectionModalStart",
      "handleDrop",
      "handleStatusButtonUpdate",
      "handleOpenSoundRecorder",
      "handlePromptStart",
      "handlePromptCallback",
      "handlePromptClose",
      "handleCustomProceduresClose",
      "onScriptGlowOn",
      "onScriptGlowOff",
      "onBlockGlowOn",
      "onBlockGlowOff",
      "handleExtensionAdded",
      "handleBlocksInfoUpdate",
      "onTargetsUpdate",
      "onVisualReport",
      "onWorkspaceUpdate",
      "onWorkspaceMetricsChange",
      "setBlocks",
      "setLocale",
    ]);
    this.KidBlocks.prompt = this.handlePromptStart;
    this.KidBlocks.statusButtonCallback = this.handleConnectionModalStart;
    this.KidBlocks.recordSoundCallback = this.handleOpenSoundRecorder;

    this.state = {
      workspaceMetrics: {},
      prompt: null,
    };
    this.onTargetsUpdate = debounce(this.onTargetsUpdate, 100);
    this.toolboxUpdateQueue = [];
  }
  componentDidMount() {
    this.KidBlocks.FieldColourSlider.activateEyedropper_ = this.props.onActivateColorPicker;
    this.KidBlocks.Procedures.externalProcedureDefCallback = this.props.onActivateCustomProcedures;
    this.KidBlocks.ScratchMsgs.setLocale(INIT_LOCALES.locale);

    const workspaceConfig = defaultsDeep(
      {},
      Blocks.defaultOptions,
      this.props.options,
      { toolbox: this.props.toolboxXML }
    );
    this.workspace = this.KidBlocks.inject(this.blocks, workspaceConfig);

    // Register buttons under new callback keys for creating variables,
    // lists, and procedures from extensions.

    const toolboxWorkspace = this.workspace.getFlyout().getWorkspace();

    const varListButtonCallback = (type) => () =>
      this.KidBlocks.Variables.createVariable(this.workspace, null, type);
    const procButtonCallback = () => {
      this.KidBlocks.Procedures.createProcedureDefCallback_(this.workspace);
    };

    toolboxWorkspace.registerButtonCallback(
      "MAKE_A_VARIABLE",
      varListButtonCallback("")
    );
    toolboxWorkspace.registerButtonCallback(
      "MAKE_A_LIST",
      varListButtonCallback("list")
    );
    toolboxWorkspace.registerButtonCallback(
      "MAKE_A_PROCEDURE",
      procButtonCallback
    );

    // Store the xml of the toolbox that is actually rendered.
    // This is used in componentDidUpdate instead of prevProps, because
    // the xml can change while e.g. on the costumes tab.
    this._renderedToolboxXML = this.props.toolboxXML;

    // we actually never want the workspace to enable "refresh toolbox" - this basically re-renders the
    // entire toolbox every time we reset the workspace.  We call updateToolbox as a part of
    // componentDidUpdate so the toolbox will still correctly be updated
    this.setToolboxRefreshEnabled = this.workspace.setToolboxRefreshEnabled.bind(
      this.workspace
    );
    this.workspace.setToolboxRefreshEnabled = () => {
      this.setToolboxRefreshEnabled(false);
    };

    // @todo change this when blockly supports UI events
    addFunctionListener(
      this.workspace,
      "translate",
      this.onWorkspaceMetricsChange
    );
    addFunctionListener(this.workspace, "zoom", this.onWorkspaceMetricsChange);

    this.attachVM();
    // Only update blocks/vm locale when visible to avoid sizing issues
    // If locale changes while not visible it will get handled in didUpdate
    if (this.props.isVisible) {
      this.setLocale();
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.prompt !== nextState.prompt ||
      this.props.isVisible !== nextProps.isVisible ||
      this._renderedToolboxXML !== nextProps.toolboxXML ||
      this.props.extensionLibraryVisible !==
        nextProps.extensionLibraryVisible ||
      this.props.customProceduresVisible !==
        nextProps.customProceduresVisible ||
      this.props.anyModalVisible !== nextProps.anyModalVisible ||
      this.props.stageSize !== nextProps.stageSize
    );
  }
  componentDidUpdate(prevProps) {
    // If any modals are open, call hideChaff to close z-indexed field editors
    if (this.props.anyModalVisible && !prevProps.anyModalVisible) {
      this.KidBlocks.hideChaff();
    }

    // Only rerender the toolbox when the blocks are visible and the xml is
    // different from the previously rendered toolbox xml.
    // Do not check against prevProps.toolboxXML because that may not have been rendered.
    if (
      this.props.isVisible &&
      this.props.toolboxXML !== this._renderedToolboxXML
    ) {
      this.requestToolboxUpdate();
    }

    if (this.props.isVisible === prevProps.isVisible) {
      if (this.props.stageSize !== prevProps.stageSize) {
        // force workspace to redraw for the new stage size
        window.dispatchEvent(new Event("resize"));
      }
      return;
    }
    // @todo hack to resize blockly manually in case resize happened while hidden
    // @todo hack to reload the workspace due to gui bug #413
    if (this.props.isVisible) {
      // Scripts tab
      this.workspace.setVisible(true);
      if (
        prevProps.locale !== INIT_LOCALES.locale ||
        INIT_LOCALES.locale !== VM.getLocale()
      ) {
        // call setLocale if the locale has changed, or changed while the blocks were hidden.
        // vm.getLocale() will be out of sync if locale was changed while not visible
        this.setLocale();
      } else {
        VM.refreshWorkspace();
        this.requestToolboxUpdate();
      }

      window.dispatchEvent(new Event("resize"));
    } else {
      this.workspace.setVisible(false);
    }
  }
  componentWillUnmount() {
    this.detachVM();
    this.workspace.dispose();
    clearTimeout(this.toolboxUpdateTimeout);
  }
  requestToolboxUpdate() {
    clearTimeout(this.toolboxUpdateTimeout);
    this.toolboxUpdateTimeout = setTimeout(() => {
      this.updateToolbox();
    }, 0);
  }
  setLocale() {
    this.KidBlocks.ScratchMsgs.setLocale(INIT_LOCALES.locale);
    VM.setLocale(INIT_LOCALES.locale, INIT_LOCALES.messages).then(() => {
      this.workspace.getFlyout().setRecyclingEnabled(false);
      VM.refreshWorkspace();
      this.requestToolboxUpdate();
      this.withToolboxUpdates(() => {
        this.workspace.getFlyout().setRecyclingEnabled(true);
      });
    });
  }

  updateToolbox() {
    this.toolboxUpdateTimeout = false;

    const categoryId = this.workspace.toolbox_.getSelectedCategoryId();
    const offset = this.workspace.toolbox_.getCategoryScrollOffset();
    this.workspace.updateToolbox(this.props.toolboxXML);
    this._renderedToolboxXML = this.props.toolboxXML;

    // In order to catch any changes that mutate the toolbox during "normal runtime"
    // (variable changes/etc), re-enable toolbox refresh.
    // Using the setter function will rerender the entire toolbox which we just rendered.
    this.workspace.toolboxRefreshEnabled_ = true;

    const currentCategoryPos = this.workspace.toolbox_.getCategoryPositionById(
      categoryId
    );
    const currentCategoryLen = this.workspace.toolbox_.getCategoryLengthById(
      categoryId
    );
    if (offset < currentCategoryLen) {
      this.workspace.toolbox_.setFlyoutScrollPos(currentCategoryPos + offset);
    } else {
      this.workspace.toolbox_.setFlyoutScrollPos(currentCategoryPos);
    }

    const queue = this.toolboxUpdateQueue;
    this.toolboxUpdateQueue = [];
    queue.forEach((fn) => fn());
  }

  withToolboxUpdates(fn) {
    // if there is a queued toolbox update, we need to wait
    if (this.toolboxUpdateTimeout) {
      this.toolboxUpdateQueue.push(fn);
    } else {
      fn();
    }
  }

  attachVM() {
    this.workspace.addChangeListener(VM.blockListener);
    this.flyoutWorkspace = this.workspace.getFlyout().getWorkspace();
    this.flyoutWorkspace.addChangeListener(VM.flyoutBlockListener);
    this.flyoutWorkspace.addChangeListener(VM.monitorBlockListener);
    VM.addListener("SCRIPT_GLOW_ON", this.onScriptGlowOn);
    VM.addListener("SCRIPT_GLOW_OFF", this.onScriptGlowOff);
    VM.addListener("BLOCK_GLOW_ON", this.onBlockGlowOn);
    VM.addListener("BLOCK_GLOW_OFF", this.onBlockGlowOff);
    VM.addListener("VISUAL_REPORT", this.onVisualReport);
    VM.addListener("workspaceUpdate", this.onWorkspaceUpdate);
    VM.addListener("targetsUpdate", this.onTargetsUpdate);
    VM.addListener("EXTENSION_ADDED", this.handleExtensionAdded);
    VM.addListener("BLOCKSINFO_UPDATE", this.handleBlocksInfoUpdate);
    VM.addListener("PERIPHERAL_CONNECTED", this.handleStatusButtonUpdate);
    VM.addListener("PERIPHERAL_DISCONNECTED", this.handleStatusButtonUpdate);
  }
  detachVM() {
    VM.removeListener("SCRIPT_GLOW_ON", this.onScriptGlowOn);
    VM.removeListener("SCRIPT_GLOW_OFF", this.onScriptGlowOff);
    VM.removeListener("BLOCK_GLOW_ON", this.onBlockGlowOn);
    VM.removeListener("BLOCK_GLOW_OFF", this.onBlockGlowOff);
    VM.removeListener("VISUAL_REPORT", this.onVisualReport);
    VM.removeListener("workspaceUpdate", this.onWorkspaceUpdate);
    VM.removeListener("targetsUpdate", this.onTargetsUpdate);
    VM.removeListener("EXTENSION_ADDED", this.handleExtensionAdded);
    VM.removeListener("BLOCKSINFO_UPDATE", this.handleBlocksInfoUpdate);
    VM.removeListener("PERIPHERAL_CONNECTED", this.handleStatusButtonUpdate);
    VM.removeListener("PERIPHERAL_DISCONNECTED", this.handleStatusButtonUpdate);
  }

  updateToolboxBlockValue(id, value) {
    this.withToolboxUpdates(() => {
      const block = this.workspace.getFlyout().getWorkspace().getBlockById(id);
      if (block) {
        block.inputList[0].fieldRow[0].setValue(value);
      }
    });
  }

  onTargetsUpdate() {
    if (VM.editingTarget && this.workspace.getFlyout()) {
      ["glide", "move", "set"].forEach((prefix) => {
        this.updateToolboxBlockValue(
          `${prefix}x`,
          Math.round(VM.editingTarget.x).toString()
        );
        this.updateToolboxBlockValue(
          `${prefix}y`,
          Math.round(VM.editingTarget.y).toString()
        );
      });
    }
  }
  onWorkspaceMetricsChange() {
    const target = VM.editingTarget;
    if (target && target.id) {
      const workspaceMetrics = Object.assign({}, this.state.workspaceMetrics, {
        [target.id]: {
          scrollX: this.workspace.scrollX,
          scrollY: this.workspace.scrollY,
          scale: this.workspace.scale,
        },
      });
      this.setState({ workspaceMetrics });
    }
  }
  onScriptGlowOn(data) {
    this.workspace.glowStack(data.id, true);
  }
  onScriptGlowOff(data) {
    this.workspace.glowStack(data.id, false);
  }
  onBlockGlowOn(data) {
    this.workspace.glowBlock(data.id, true);
  }
  onBlockGlowOff(data) {
    this.workspace.glowBlock(data.id, false);
  }
  onVisualReport(data) {
    this.workspace.reportValue(data.id, data.value);
  }
  getToolboxXML() {
    // Use try/catch because this requires digging pretty deep into the VM
    // Code inside intentionally ignores several error situations (no stage, etc.)
    // Because they would get caught by this try/catch
    try {
      let { editingTarget: target, runtime } = VM;
      const stage = runtime.getTargetForStage();
      if (!target) target = stage; // If no editingTarget, use the stage

      const stageCostumes = stage.getCostumes();
      const targetCostumes = target.getCostumes();
      const targetSounds = target.getSounds();
      const dynamicBlocksXML = VM.runtime.getBlocksXML();

      return MAKE_TOOLBOX_XML(
        target.isStage,
        target.id,
        dynamicBlocksXML,
        targetCostumes[targetCostumes.length - 1].name,
        stageCostumes[stageCostumes.length - 1].name,
        targetSounds.length > 0
          ? targetSounds[targetSounds.length - 1].name
          : ""
      );
    } catch {
      return null;
    }
  }
  onWorkspaceUpdate(data) {
    // When we change sprites, update the toolbox to have the new sprite's blocks
    const toolboxXML = this.getToolboxXML();
    if (toolboxXML) {
      this.props.updateToolboxState(toolboxXML);
    }

    if (VM.editingTarget && !this.state.workspaceMetrics[VM.editingTarget.id]) {
      this.onWorkspaceMetricsChange();
    }

    // Remove and reattach the workspace listener (but allow flyout events)
    this.workspace.removeChangeListener(VM.blockListener);
    const dom = this.KidBlocks.Xml.textToDom(data.xml);
    try {
      this.KidBlocks.Xml.clearWorkspaceAndLoadFromXml(dom, this.workspace);
    } catch (error) {
      // The workspace is likely incomplete. What did update should be
      // functional.
      //
      // Instead of throwing the error, by logging it and continuing as
      // normal lets the other workspace update processes complete in the
      // gui and vm, which lets the vm run even if the workspace is
      // incomplete. Throwing the error would keep things like setting the
      // correct editing target from happening which can interfere with
      // some blocks and processes in the vm.
      if (error.message) {
        error.message = `Workspace Update Error: ${error.message}`;
      }
      console.error(error);
    }
    this.workspace.addChangeListener(VM.blockListener);

    if (VM.editingTarget && this.state.workspaceMetrics[VM.editingTarget.id]) {
      const { scrollX, scrollY, scale } = this.state.workspaceMetrics[
        VM.editingTarget.id
      ];
      this.workspace.scrollX = scrollX;
      this.workspace.scrollY = scrollY;
      this.workspace.scale = scale;
      this.workspace.resize();
    }

    // Clear the undo state of the workspace since this is a
    // fresh workspace and we don't want any changes made to another sprites
    // workspace to be 'undone' here.
    this.workspace.clearUndo();
  }
  handleExtensionAdded(categoryInfo) {
    const defineBlocks = (blockInfoArray) => {
      if (blockInfoArray && blockInfoArray.length > 0) {
        const staticBlocksJson = [];
        const dynamicBlocksInfo = [];
        blockInfoArray.forEach((blockInfo) => {
          if (blockInfo.info && blockInfo.info.isDynamic) {
            dynamicBlocksInfo.push(blockInfo);
          } else if (blockInfo.json) {
            staticBlocksJson.push(blockInfo.json);
          }
          // otherwise it's a non-block entry such as '---'
        });

        this.KidBlocks.defineBlocksWithJsonArray(staticBlocksJson);
        dynamicBlocksInfo.forEach((blockInfo) => {
          // This is creating the block factory / constructor -- NOT a specific instance of the block.
          // The factory should only know static info about the block: the category info and the opcode.
          // Anything else will be picked up from the XML attached to the block instance.
          const extendedOpcode = `${categoryInfo.id}_${blockInfo.info.opcode}`;
          const blockDefinition = defineDynamicBlock(
            this.KidBlocks,
            categoryInfo,
            blockInfo,
            extendedOpcode
          );
          this.KidBlocks.Blocks[extendedOpcode] = blockDefinition;
        });
      }
    };

    // scratch-blocks implements a menu or custom field as a special kind of block ("shadow" block)
    // these actually define blocks and MUST run regardless of the UI state
    defineBlocks(
      Object.getOwnPropertyNames(categoryInfo.customFieldTypes).map(
        (fieldTypeName) =>
          categoryInfo.customFieldTypes[fieldTypeName].scratchBlocksDefinition
      )
    );
    defineBlocks(categoryInfo.menus);
    defineBlocks(categoryInfo.blocks);

    // Update the toolbox with new blocks if possible
    const toolboxXML = this.getToolboxXML();
    if (toolboxXML) {
      this.props.updateToolboxState(toolboxXML);
    }
  }
  handleBlocksInfoUpdate(categoryInfo) {
    // @todo Later we should replace this to avoid all the warnings from redefining blocks.
    this.handleExtensionAdded(categoryInfo);
  }
  handleCategorySelected(categoryId) {
    const extension = EXTENSIONLIBRARY_DATA().find(
      (ext) => ext.extensionId === categoryId
    );
    if (extension && extension.launchPeripheralConnectionFlow) {
      this.handleConnectionModalStart(categoryId);
    }

    this.withToolboxUpdates(() => {
      this.workspace.toolbox_.setSelectedCategoryById(categoryId);
    });
  }
  setBlocks(blocks) {
    this.blocks = blocks;
  }
  handlePromptStart(message, defaultValue, callback, optTitle, optVarType) {
    const p = { prompt: { callback, message, defaultValue } };
    p.prompt.title = optTitle
      ? optTitle
      : this.KidBlocks.Msg.VARIABLE_MODAL_TITLE;
    p.prompt.varType =
      typeof optVarType === "string"
        ? optVarType
        : this.KidBlocks.SCALAR_VARIABLE_TYPE;
    p.prompt.showVariableOptions = // This flag means that we should show variable/list options about scope
      optVarType !== this.KidBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE &&
      p.prompt.title !== this.KidBlocks.Msg.RENAME_VARIABLE_MODAL_TITLE &&
      p.prompt.title !== this.KidBlocks.Msg.RENAME_LIST_MODAL_TITLE;
    p.prompt.showCloudOption =
      optVarType === this.KidBlocks.SCALAR_VARIABLE_TYPE;
    // &&this.props.canUseCloud;
    this.setState(p);
  }
  handleConnectionModalStart(extensionId) {
    this.props.onOpenConnectionModal(extensionId);
  }
  handleStatusButtonUpdate() {
    this.KidBlocks.refreshStatusButtons(this.workspace);
  }
  handleOpenSoundRecorder() {
    this.props.onOpenSoundRecorder();
  }

  /*
   * 将有关建议的名称和变量选项（范围和isCloud）以及其他可能冲突的变量名称的信息从VM传递到暂存块中使用的变量验证提示回调中.
   */
  handlePromptCallback(input, variableOptions) {
    this.state.prompt.callback(
      input,
      VM.runtime.getAllVarNamesOfType(this.state.prompt.varType),
      variableOptions
    );
    this.handlePromptClose();
  }
  handlePromptClose() {
    this.setState({ prompt: null });
  }
  handleCustomProceduresClose(data) {
    this.props.onRequestCloseCustomProcedures(data);
    const ws = this.workspace;
    ws.refreshToolboxSelection_();
    ws.toolbox_.scrollToCategoryById("myBlocks");
  }
  handleDrop(dragInfo) {
    fetch(dragInfo.payload.bodyUrl)
      .then((response) => response.json())
      .then((blocks) => VM.shareBlocksToTarget(blocks, VM.editingTarget.id))
      .then(() => {
        VM.refreshWorkspace();
        this.updateToolbox(); // To show new variables/custom blocks
      });
  }
  render() {
    /* eslint-disable no-unused-vars */
    const {
      anyModalVisible,
      // canUseCloud,
      customProceduresVisible,
      extensionLibraryVisible,
      options,
      stageSize,
      isVisible,
      onActivateColorPicker,
      onOpenConnectionModal,
      onOpenSoundRecorder,
      updateToolboxState,
      onActivateCustomProcedures,
      onRequestCloseExtensionLibrary,
      onRequestCloseCustomProcedures,
      toolboxXML,
      ...props
    } = this.props;
    /* eslint-enable no-unused-vars */
    return (
      <React.Fragment>
        <DroppableBlocks
          componentRef={this.setBlocks}
          onDrop={this.handleDrop}
          {...props}
        />
        {this.state.prompt ? (
          <Prompt
            defaultValue={this.state.prompt.defaultValue}
            isStage={VM.runtime.getEditingTarget().isStage}
            label={this.state.prompt.message}
            showCloudOption={this.state.prompt.showCloudOption}
            showVariableOptions={this.state.prompt.showVariableOptions}
            title={this.state.prompt.title}
            vm={VM}
            onCancel={this.handlePromptClose}
            onOk={this.handlePromptCallback}
          />
        ) : null}
        {extensionLibraryVisible ? (
          <ExtensionLibrary
            vm={VM}
            onCategorySelected={this.handleCategorySelected}
            onRequestClose={onRequestCloseExtensionLibrary}
          />
        ) : null}
        {customProceduresVisible ? (
          <CustomProcedures
            options={{
              media: options.media,
            }}
            onRequestClose={this.handleCustomProceduresClose}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

Blocks.propTypes = {
  anyModalVisible: PropTypes.bool,
  // canUseCloud: PropTypes.bool,
  customProceduresVisible: PropTypes.bool,
  extensionLibraryVisible: PropTypes.bool,
  isVisible: PropTypes.bool,
  onActivateColorPicker: PropTypes.func,
  onActivateCustomProcedures: PropTypes.func,
  onOpenConnectionModal: PropTypes.func,
  onOpenSoundRecorder: PropTypes.func,
  onRequestCloseCustomProcedures: PropTypes.func,
  onRequestCloseExtensionLibrary: PropTypes.func,
  options: PropTypes.shape({
    media: PropTypes.string,
    zoom: PropTypes.shape({
      controls: PropTypes.bool,
      wheel: PropTypes.bool,
      startScale: PropTypes.number,
    }),
    colours: PropTypes.shape({
      workspace: PropTypes.string,
      flyout: PropTypes.string,
      toolbox: PropTypes.string,
      toolboxSelected: PropTypes.string,
      scrollbar: PropTypes.string,
      scrollbarHover: PropTypes.string,
      insertionMarker: PropTypes.string,
      insertionMarkerOpacity: PropTypes.number,
      fieldShadow: PropTypes.string,
      dragShadowOpacity: PropTypes.number,
    }),
    comments: PropTypes.bool,
    collapse: PropTypes.bool,
  }),
  stageSize: PropTypes.oneOf(Object.keys(STAGE_DISPLAY_SIZES)).isRequired,
  toolboxXML: PropTypes.string,
  updateToolboxState: PropTypes.func,
};

Blocks.defaultOptions = {
  zoom: {
    controls: true, // 三个操作按钮
    wheel: true, // 是否允许鼠标滚轴缩放
    startScale: 0.7, // 初始放大基数
    maxScale: 1.5, // 最大放大倍数
    minScale: 0.3, // 最小缩小倍数
    scaleSpeed: 1.2, // 缩放速度比
  },
  // trashcan: true, //是否启用垃圾桶功能
  grid: {
    spacing: 40, // 网格点距
    length: 2, // 网格每个点的长度，数值太高就会成为明线棋盘
    colour: "#ddd", // 网格点的颜色
  },
  colours: {
    workspace: "#F9F9F9",
    flyout: "#F9F9F9",
    toolbox: "#FFFFFF",
    toolboxSelected: "#E9EEF2",
    scrollbar: "#CECDCE",
    scrollbarHover: "#CECDCE",
    insertionMarker: "#000000",
    insertionMarkerOpacity: 0.2,
    fieldShadow: "rgba(255, 255, 255, 0.3)",
    dragShadowOpacity: 0.6,
  },
  comments: true,
  collapse: false,
  sounds: false,
};

Blocks.defaultProps = {
  isVisible: true,
  options: Blocks.defaultOptions,
};

const mapStateToProps = (state) => ({
  anyModalVisible: Object.keys(state.scratchGui.modals).some(
    (key) => state.scratchGui.modals[key]
  ),
  extensionLibraryVisible: state.scratchGui.modals.extensionLibrary,
  toolboxXML: state.scratchGui.toolbox.toolboxXML,
  customProceduresVisible: state.scratchGui.customProcedures.active,
});

const mapDispatchToProps = (dispatch) => ({
  onActivateColorPicker: (callback) => dispatch(activateColorPicker(callback)),
  onActivateCustomProcedures: (data, callback) =>
    dispatch(activateCustomProcedures(data, callback)),
  onOpenConnectionModal: (id) => {
    dispatch(setConnectionModalExtensionId(id));
    dispatch(openConnectionModal());
  },
  onOpenSoundRecorder: () => {
    dispatch(openSoundRecorder());
  },
  onRequestCloseExtensionLibrary: () => {
    dispatch(closeExtensionLibrary());
  },
  onRequestCloseCustomProcedures: (data) => {
    dispatch(deactivateCustomProcedures(data));
  },
  updateToolboxState: (toolboxXML) => {
    dispatch(updateToolbox(toolboxXML));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Blocks);
