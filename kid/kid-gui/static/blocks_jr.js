/*
 * @Author: Satya
 * @Date: 2020-08-28 18:55:40
 * @Last Modified by: Satya
 * @Last Modified time: 2020-09-22 19:14:53
 * Kid-Jr
 *  原lib/blocks.js代码剥离为单文件
 *  make-toolbox-xml：blocks外部使用时的xml文档
 */

console.log("KidJrBlocks:", KidJrBlocks);
/**
 * 渲染vm pro所有积木块
 * @param {*} vm
 */
const VM_BLOCKS_JR = (vm) => {
  const jsonForMenuBlock = function (name, menuOptionsFn, colors, start) {
    return {
      message0: "%1",
      args0: [
        {
          type: "field_dropdown",
          name: name,
          options: function () {
            return start.concat(menuOptionsFn());
          },
        },
      ],
      inputsInline: true,
      output: "String",
      colour: colors.secondary,
      colourSecondary: colors.secondary,
      colourTertiary: colors.tertiary,
      outputShape: KidJrBlocks.OUTPUT_SHAPE_ROUND,
    };
  };

  const jsonForHatBlockMenu = function (
    hatName,
    name,
    menuOptionsFn,
    colors,
    start
  ) {
    return {
      message0: hatName,
      args0: [
        {
          type: "field_dropdown",
          name: name,
          options: function () {
            return start.concat(menuOptionsFn());
          },
        },
      ],
      colour: colors.primary,
      colourSecondary: colors.secondary,
      colourTertiary: colors.tertiary,
      extensions: ["shape_hat"],
    };
  };

  const jsonForSensingMenus = function (menuOptionsFn) {
    return {
      message0: KidJrBlocks.Msg.SENSING_OF,
      args0: [
        {
          type: "field_dropdown",
          name: "PROPERTY",
          options: function () {
            return menuOptionsFn();
          },
        },
        {
          type: "input_value",
          name: "OBJECT",
        },
      ],
      output: true,
      colour: KidJrBlocks.Colours.sensing.primary,
      colourSecondary: KidJrBlocks.Colours.sensing.secondary,
      colourTertiary: KidJrBlocks.Colours.sensing.tertiary,
      outputShape: KidJrBlocks.OUTPUT_SHAPE_ROUND,
    };
  };

  const soundsMenu = function () {
    let menu = [["", ""]];
    if (vm.editingTarget && vm.editingTarget.sprite.sounds.length > 0) {
      menu = vm.editingTarget.sprite.sounds.map((sound) => [
        sound.name,
        sound.name,
      ]);
    }
    menu.push([
      KidJrBlocks.ScratchMsgs.translate("SOUND_RECORD", "record..."),
      KidJrBlocks.recordSoundCallback,
    ]);
    return menu;
  };

  const costumesMenu = function () {
    if (vm.editingTarget && vm.editingTarget.getCostumes().length > 0) {
      return vm.editingTarget
        .getCostumes()
        .map((costume) => [costume.name, costume.name]);
    }
    return [["", ""]];
  };

  const backdropsMenu = function () {
    const next = KidJrBlocks.ScratchMsgs.translate(
      "LOOKS_NEXTBACKDROP",
      "next backdrop"
    );
    const previous = KidJrBlocks.ScratchMsgs.translate(
      "LOOKS_PREVIOUSBACKDROP",
      "previous backdrop"
    );
    const random = KidJrBlocks.ScratchMsgs.translate(
      "LOOKS_RANDOMBACKDROP",
      "random backdrop"
    );
    if (
      vm.runtime.targets[0] &&
      vm.runtime.targets[0].getCostumes().length > 0
    ) {
      return vm.runtime.targets[0]
        .getCostumes()
        .map((costume) => [costume.name, costume.name])
        .concat([
          [next, "next backdrop"],
          [previous, "previous backdrop"],
          [random, "random backdrop"],
        ]);
    }
    return [["", ""]];
  };

  const backdropNamesMenu = function () {
    const stage = vm.runtime.getTargetForStage();
    if (stage && stage.getCostumes().length > 0) {
      return stage.getCostumes().map((costume) => [costume.name, costume.name]);
    }
    return [["", ""]];
  };

  const spriteMenu = function () {
    const sprites = [];
    for (const targetId in vm.runtime.targets) {
      if (!vm.runtime.targets.hasOwnProperty(targetId)) continue;
      if (vm.runtime.targets[targetId].isOriginal) {
        if (!vm.runtime.targets[targetId].isStage) {
          if (vm.runtime.targets[targetId] === vm.editingTarget) {
            continue;
          }
          sprites.push([
            vm.runtime.targets[targetId].sprite.name,
            vm.runtime.targets[targetId].sprite.name,
          ]);
        }
      }
    }
    return sprites;
  };

  const cloneMenu = function () {
    if (vm.editingTarget && vm.editingTarget.isStage) {
      const menu = spriteMenu();
      if (menu.length === 0) {
        return [["", ""]]; // Empty menu matches Scratch 2 behavior
      }
      return menu;
    }
    const myself = KidJrBlocks.ScratchMsgs.translate(
      "CONTROL_CREATECLONEOF_MYSELF",
      "myself"
    );
    return [[myself, "_myself_"]].concat(spriteMenu());
  };

  const soundColors = KidJrBlocks.Colours.sounds;

  const looksColors = KidJrBlocks.Colours.looks;

  const motionColors = KidJrBlocks.Colours.motion;

  const sensingColors = KidJrBlocks.Colours.sensing;

  const controlColors = KidJrBlocks.Colours.control;

  const eventColors = KidJrBlocks.Colours.event;

  KidJrBlocks.Blocks.sound_sounds_menu.init = function () {
    const json = jsonForMenuBlock("SOUND_MENU", soundsMenu, soundColors, []);
    this.jsonInit(json);
  };

  KidJrBlocks.Blocks.looks_backdrops.init = function () {
    const json = jsonForMenuBlock("BACKDROP", backdropsMenu, looksColors, []);
    this.jsonInit(json);
  };

  KidJrBlocks.Blocks.event_whenbackdropswitchesto.init = function () {
    const json = jsonForHatBlockMenu(
      KidJrBlocks.Msg.EVENT_WHENBACKDROPSWITCHESTO,
      "BACKDROP",
      backdropNamesMenu,
      eventColors,
      []
    );
    this.jsonInit(json);
  };

  KidJrBlocks.Blocks.sensing_of_object_menu.init = function () {
    const stage = KidJrBlocks.ScratchMsgs.translate(
      "SENSING_OF_STAGE",
      "Stage"
    );
    const json = jsonForMenuBlock("OBJECT", spriteMenu, sensingColors, [
      [stage, "_stage_"],
    ]);
    this.jsonInit(json);
  };

  KidJrBlocks.Blocks.sensing_of.init = function () {
    const blockId = this.id;
    // Function that fills in menu for the first input in the sensing block.
    // Called every time it opens since it depends on the values in the other block input.
    const menuFn = function () {
      const stageOptions = [
        [KidJrBlocks.Msg.SENSING_OF_BACKDROPNUMBER, "backdrop #"],
        [KidJrBlocks.Msg.SENSING_OF_BACKDROPNAME, "backdrop name"],
        [KidJrBlocks.Msg.SENSING_OF_VOLUME, "volume"],
      ];
      const spriteOptions = [
        [KidJrBlocks.Msg.SENSING_OF_XPOSITION, "x position"],
        [KidJrBlocks.Msg.SENSING_OF_YPOSITION, "y position"],
        [KidJrBlocks.Msg.SENSING_OF_DIRECTION, "direction"],
        [KidJrBlocks.Msg.SENSING_OF_COSTUMENUMBER, "costume #"],
        [KidJrBlocks.Msg.SENSING_OF_COSTUMENAME, "costume name"],
        [KidJrBlocks.Msg.SENSING_OF_SIZE, "size"],
        [KidJrBlocks.Msg.SENSING_OF_VOLUME, "volume"],
      ];
      if (vm.editingTarget) {
        let lookupBlocks = vm.editingTarget.blocks;
        let sensingOfBlock = lookupBlocks.getBlock(blockId);

        // The block doesn't exist, but should be in the flyout. Look there.
        if (!sensingOfBlock) {
          sensingOfBlock = vm.runtime.flyoutBlocks.getBlock(blockId);
          // If we still don't have a block, just return an empty list . This happens during
          // scratch blocks construction.
          if (!sensingOfBlock) {
            return [["", ""]];
          }
          // The block was in the flyout so look up future block info there.
          lookupBlocks = vm.runtime.flyoutBlocks;
        }
        const sort = function (options) {
          options.sort(KidJrBlocks.scratchBlocksUtils.compareStrings);
        };
        // Get all the stage variables (no lists) so we can add them to menu when the stage is selected.
        const stageVariableOptions = vm.runtime
          .getTargetForStage()
          .getAllVariableNamesInScopeByType("");
        sort(stageVariableOptions);
        const stageVariableMenuItems = stageVariableOptions.map((variable) => [
          variable,
          variable,
        ]);
        if (
          sensingOfBlock.inputs.OBJECT.shadow !==
          sensingOfBlock.inputs.OBJECT.block
        ) {
          // There's a block dropped on top of the menu. It'd be nice to evaluate it and
          // return the correct list, but that is tricky. Scratch2 just returns stage options
          // so just do that here too.
          return stageOptions.concat(stageVariableMenuItems);
        }
        const menuBlock = lookupBlocks.getBlock(
          sensingOfBlock.inputs.OBJECT.shadow
        );
        const selectedItem = menuBlock.fields.OBJECT.value;
        if (selectedItem === "_stage_") {
          return stageOptions.concat(stageVariableMenuItems);
        }
        // Get all the local variables (no lists) and add them to the menu.
        const target = vm.runtime.getSpriteTargetByName(selectedItem);
        let spriteVariableOptions = [];
        // The target should exist, but there are ways for it not to (e.g. #4203).
        if (target) {
          spriteVariableOptions = target.getAllVariableNamesInScopeByType(
            "",
            true
          );
          sort(spriteVariableOptions);
        }
        const spriteVariableMenuItems = spriteVariableOptions.map(
          (variable) => [variable, variable]
        );
        return spriteOptions.concat(spriteVariableMenuItems);
      }
      return [["", ""]];
    };

    const json = jsonForSensingMenus(menuFn);
    this.jsonInit(json);
  };

  KidJrBlocks.Blocks.sensing_distancetomenu.init = function () {
    const mouse = KidJrBlocks.ScratchMsgs.translate(
      "SENSING_DISTANCETO_POINTER",
      "mouse-pointer"
    );
    const json = jsonForMenuBlock("DISTANCETOMENU", spriteMenu, sensingColors, [
      [mouse, "_mouse_"],
    ]);
    this.jsonInit(json);
  };

  KidJrBlocks.Blocks.sensing_touchingobjectmenu.init = function () {
    const mouse = KidJrBlocks.ScratchMsgs.translate(
      "SENSING_TOUCHINGOBJECT_POINTER",
      "mouse-pointer"
    );
    const edge = KidJrBlocks.ScratchMsgs.translate(
      "SENSING_TOUCHINGOBJECT_EDGE",
      "edge"
    );
    const json = jsonForMenuBlock(
      "TOUCHINGOBJECTMENU",
      spriteMenu,
      sensingColors,
      [
        [mouse, "_mouse_"],
        [edge, "_edge_"],
      ]
    );
    this.jsonInit(json);
  };

  KidJrBlocks.Blocks.control_create_clone_of_menu.init = function () {
    const json = jsonForMenuBlock("CLONE_OPTION", cloneMenu, controlColors, []);
    this.jsonInit(json);
  };

  KidJrBlocks.VerticalFlyout.getCheckboxState = function (blockId) {
    const monitoredBlock = vm.runtime.monitorBlocks._blocks[blockId];
    return monitoredBlock ? monitoredBlock.isMonitored : false;
  };

  KidJrBlocks.FlyoutExtensionCategoryHeader.getExtensionState = function (
    extensionId
  ) {
    if (vm.getPeripheralIsConnected(extensionId)) {
      return KidJrBlocks.StatusButtonState.READY;
    }
    return KidJrBlocks.StatusButtonState.NOT_READY;
  };

  KidJrBlocks.FieldNote.playNote_ = function (noteNum, extensionId) {
    vm.runtime.emit("PLAY_NOTE", noteNum, extensionId);
  };

  // Use a collator's compare instead of localeCompare which internally
  // creates a collator. Using this is a lot faster in browsers that create a
  // collator for every localeCompare call.
  const collator = new Intl.Collator([], {
    sensitivity: "base",
    numeric: true,
  });
  KidJrBlocks.scratchBlocksUtils.compareStrings = function (str1, str2) {
    return collator.compare(str1, str2);
  };

  // Blocks wants to know if 3D CSS transforms are supported. The cross
  // section of browsers Scratch supports and browsers that support 3D CSS
  // transforms will make the return always true.
  //
  // Shortcutting to true lets us skip an expensive style recalculation when
  // first loading the Scratch editor.
  KidJrBlocks.utils.is3dSupported = function () {
    return true;
  };

  return KidJrBlocks;
};

/**
 * make-toolbox-xml：blocks外部使用时的xml文档
 *
 */
/** 类别分隔符 */
const categorySeparator = `<sep gap="36"/>`;
/** 积木块分隔符 */
const blockSeparator = '<sep gap="28"/>';
const xmlOpen = '<xml style="display: none">';
const xmlClose = "</xml>";

/**
 * xml 转译
 * @param {*} unsafe
 */
const xmlEscape = (unsafe) => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
    }
  });
};

/**
 * 分类 运动
 * @param {*} isStage
 * @param {*} targetId
 */
const motion = (isStage, targetId) => {
  /** 舞台选择 */
  const stageSelected = KidJrBlocks.ScratchMsgs.translate(
    "MOTION_STAGE_SELECTED",
    "Stage selected: no motion blocks"
  );
  //  注：iconURI的地址为 ./static/blocks-media/icon.svg
  return `
    <category name="%{BKY_CATEGORY_MOTION}" id="motion" colour="#4C97FF" secondaryColour="#3373CC" iconURI="${
      GLOBAL_URL.ASSET_BLOCK_MEDIA_JR
    }category/motion.png" >
        ${
          isStage
            ? `
        <label text="${stageSelected}"></label>
        `
            : `
        <block type="motion_moveleft">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
            <value name="SECS">
              <shadow type="math_number">
                <field name="NUM">1</field>
              </shadow>
            </value>
        </block>
        <block type="motion_moveright">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
            <value name="SECS">
              <shadow type="math_number">
                <field name="NUM">1</field>
              </shadow>
            </value>
        </block>
        <block type="motion_moveup">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">9</field>
                </shadow>
            </value>
            <value name="SECS">
              <shadow type="math_number">
                <field name="NUM">1</field>
              </shadow>
            </value>
        </block>
        <block type="motion_movedown">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">9</field>
                </shadow>
            </value>
            <value name="SECS">
              <shadow type="math_number">
                <field name="NUM">1</field>
              </shadow>
            </value>
        </block>
        <block type="motion_jump">
          <value name="HEIGHT">
              <shadow type="math_number">
                  <field name="NUM">9</field>
              </shadow>
          </value>
          <value name="SECS">
            <shadow type="math_number">
              <field name="NUM">1</field>
            </shadow>
          </value>
        </block>
        <block type="motion_turnleft">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="motion_turnright">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        <block type="motion_movereset" />`
        }
        ${categorySeparator}
    </category>
    `;
};

/**
 * 分类 外观
 * @param {*} isStage
 * @param {*} targetId
 * @param {*} costumeName 角色下拉默认值
 * @param {*} backdropName 背景下拉默认值
 */
const looks = (isStage, targetId, costumeName, backdropName) => {
  const hello = KidJrBlocks.ScratchMsgs.translate("LOOKS_HELLO", "Hello!");
  const hmm = KidJrBlocks.ScratchMsgs.translate("LOOKS_HMM", "Hmm...");
  return `
    <category name="%{BKY_CATEGORY_LOOKS}" id="looks" colour="#9966FF" secondaryColour="#774DCB" iconURI="${
      GLOBAL_URL.ASSET_BLOCK_MEDIA_JR
    }category/looks.png">
        ${blockSeparator}
        ${
          isStage
            ? ""
            : `
            <block type="looks_show"/>
            <block type="looks_hide"/>
            <block type="looks_zoomout"/>
            <block type="looks_zoomin"/>
            <block type="looks_zoomreset"/>
            <block type="looks_switchbackdropto">
                <value name="BACKDROP">
                    <shadow type="looks_backdrops">
                        <field name="BACKDROP">${backdropName}</field>
                    </shadow>
                </value>
            </block>`
        }
        ${categorySeparator}
    </category>
    `;
};

/**
 * 分类 声音
 * @param {*} isStage
 * @param {*} targetId
 * @param {*} soundName 声音名字
 */
const sound = (isStage, targetId, soundName) => {
  return `
    <category name="%{BKY_CATEGORY_SOUND}" id="sound" colour="#D65CD6" secondaryColour="#BD42BD" iconURI="${GLOBAL_URL.ASSET_BLOCK_MEDIA_JR}category/sound.png">
        <block id="${targetId}_sound_playuntildone" type="sound_playuntildone">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu">
                    <field name="SOUND_MENU">${soundName}</field>
                </shadow>
            </value>
        </block>
        <block id="${targetId}_sound_play" type="sound_play">
            <value name="SOUND_MENU">
                <shadow type="sound_sounds_menu">
                    <field name="SOUND_MENU">${soundName}</field>
                </shadow>
            </value>
        </block>
        <block type="sound_stopallsounds"/>
        ${blockSeparator}
        <block type="sound_changeeffectby">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="sound_seteffectto">
            <value name="VALUE">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block type="sound_cleareffects"/>
        ${blockSeparator}
        <block type="sound_changevolumeby">
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">-10</field>
                </shadow>
            </value>
        </block>
        <block type="sound_setvolumeto">
            <value name="VOLUME">
                <shadow type="math_number">
                    <field name="NUM">100</field>
                </shadow>
            </value>
        </block>
        <block id="${targetId}_volume" type="sound_volume"/>
        ${categorySeparator}
    </category>
    `;
};

/**
 * 分类 事件
 * @param {*} isStage
 */
const events = (isStage) => {
  return `
    <category name="%{BKY_CATEGORY_EVENTS}" id="events" colour="#FFD500" secondaryColour="#CC9900" iconURI="${
      GLOBAL_URL.ASSET_BLOCK_MEDIA_JR
    }category/events.png">
        <block type="event_whenflagclicked"/>
        ${
          isStage
            ? `
            <block type="event_whenstageclicked"/>
        `
            : `
            <block type="event_whenthisspriteclicked"/>
        `
        }
        <block type="event_whenbroadcastreceived">
        </block>
        <block type="event_broadcast">
            <value name="BROADCAST_INPUT">
                <shadow type="event_broadcast_menu"></shadow>
            </value>
        </block>
        ${categorySeparator}
    </category>
    `;
};

/**
 * 分类 控制
 * @param {*} isStage
 */
const control = (isStage) => {
  return `
    <category name="%{BKY_CATEGORY_CONTROL}" id="control" colour="#FFAB19" secondaryColour="#CF8B17" iconURI="${GLOBAL_URL.ASSET_BLOCK_MEDIA_JR}category/control.png">
        <block type="control_wait">
            <value name="DURATION">
                <shadow type="math_positive_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="control_repeat">
            <value name="TIMES">
                <shadow type="math_whole_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block id="forever" type="control_forever"/>
        <block type="control_if" id="control_if"></block>
        <block type="control_if_else" id="control_if_else"></block>
        ${categorySeparator}
    </category>
    `;
};

/**
 * 分类 消息
 * @param {*} isStage
 */
const sensing = (isStage) => {
  const name = KidJrBlocks.ScratchMsgs.translate(
    "SENSING_ASK_TEXT",
    "What's your name?"
  );
  return `
      <category name="%{BKY_CATEGORY_SENSING}" id="sensing" colour="#4CBFE6" secondaryColour="#2E8EB8">
          ${
            isStage
              ? ""
              : `
              <block type="sensing_touchingobject">
                  <value name="TOUCHINGOBJECTMENU">
                      <shadow type="sensing_touchingobjectmenu"/>
                  </value>
              </block>
              <block type="sensing_touchingcolor">
                  <value name="COLOR">
                      <shadow type="colour_picker"/>
                  </value>
              </block>
              <block type="sensing_coloristouchingcolor">
                  <value name="COLOR">
                      <shadow type="colour_picker"/>
                  </value>
                  <value name="COLOR2">
                      <shadow type="colour_picker"/>
                  </value>
              </block>
          `
          }
      </category>
      `;
};

/**
 * 分类 绘画
 */
const pen = () => {
  return `<category name="%{BKY_CATEGORY_PEN}" id="pen" colour="#0FBD8C" secondaryColour="#0DA57A" iconURI="${GLOBAL_URL.ASSET_BLOCK_MEDIA_JR}category/pen.png">
      <block type="pen_clear"></block>
      <block type="pen_down"></block>
      <block type="pen_up"></block>
      <block type="pen_setcolorto">
          <value name="COLOR">
              <shadow type="colour_picker"></shadow>
          </value>
      </block>
  </category>`;
};

/**
 * 创建xml结构
 * @param {!boolean} isStage 当前工具是否适用于舞台类型的目标
 * @param {?string} targetId 当前在编辑的目标
 * @param {?Array.<object>} categoriesXML 类别的{id，xml}的可选数组
 * @property {string} id 分类或扩展的ID.
 * @property {string} xml 单个分类或扩展的XML.
 * @param {?string} costumeName 角色下拉默认值
 * @param {?string} backdropName 背景下拉默认值
 * @param {?string} soundName 声音下拉默认值
 * @returns {string} 工具箱的XML文档
 */
const MAKE_TOOLBOX_XML = (
  isStage,
  targetId,
  categoriesXML = [],
  costumeName = "",
  backdropName = "",
  soundName = ""
) => {
  const gap = [categorySeparator];
  // 传进来的下拉默认值需要转译一下
  costumeName = xmlEscape(costumeName);
  backdropName = xmlEscape(backdropName);
  soundName = xmlEscape(soundName);

  categoriesXML = categoriesXML.slice();

  const moveCategory = (categoryId) => {
    const index = categoriesXML.findIndex(
      (categoryInfo) => categoryInfo.id === categoryId
    );
    if (index >= 0) {
      const [categoryInfo] = categoriesXML.splice(index, 1);
      return categoryInfo.xml;
    }
  };
  const motionXML = moveCategory("motion") || motion(isStage, targetId);
  const looksXML =
    moveCategory("looks") ||
    looks(isStage, targetId, costumeName, backdropName);
  const soundXML = moveCategory("sound") || sound(isStage, targetId, soundName);
  const eventsXML = moveCategory("event") || events(isStage, targetId);
  const controlXML = moveCategory("control") || control(isStage, targetId);
  const sensingXML = moveCategory("sensing") || sensing(isStage, targetId);
  const penXML = pen();

  const everything = [
    xmlOpen,
    motionXML,
    gap,
    looksXML,
    gap,
    soundXML,
    gap,
    eventsXML,
    gap,
    controlXML,
    gap,
    sensingXML,
    gap,
    penXML, // 绘画XML
  ];

  for (const extensionCategory of categoriesXML) {
    everything.push(gap, extensionCategory.xml);
  }

  everything.push(xmlClose);
  return everything.join("\n");
};
