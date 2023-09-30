/*
 * @Author: Satya
 * @Date: 2020-08-28 18:55:40
 * @Last Modified by: Satya
 * @Last Modified time: 2020-12-23 09:45:57
 * Kid-pro
 *  原lib/blocks.js代码剥离为单文件
 *  make-toolbox-xml：blocks外部使用时的xml文档
 */

/**
 * 渲染vm pro所有积木块
 * @param {*} vm
 */
const VM_BLOCKS_PRO = (vm) => {
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
      outputShape: KidProBlocks.OUTPUT_SHAPE_ROUND,
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
      message0: KidProBlocks.Msg.SENSING_OF,
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
      colour: KidProBlocks.Colours.sensing.primary,
      colourSecondary: KidProBlocks.Colours.sensing.secondary,
      colourTertiary: KidProBlocks.Colours.sensing.tertiary,
      outputShape: KidProBlocks.OUTPUT_SHAPE_ROUND,
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
      KidProBlocks.ScratchMsgs.translate("SOUND_RECORD", "record..."),
      KidProBlocks.recordSoundCallback,
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
    const next = KidProBlocks.ScratchMsgs.translate(
      "LOOKS_NEXTBACKDROP",
      "next backdrop"
    );
    const previous = KidProBlocks.ScratchMsgs.translate(
      "LOOKS_PREVIOUSBACKDROP",
      "previous backdrop"
    );
    const random = KidProBlocks.ScratchMsgs.translate(
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
    const myself = KidProBlocks.ScratchMsgs.translate(
      "CONTROL_CREATECLONEOF_MYSELF",
      "myself"
    );
    return [[myself, "_myself_"]].concat(spriteMenu());
  };

  const soundColors = KidProBlocks.Colours.sounds;

  const looksColors = KidProBlocks.Colours.looks;

  const motionColors = KidProBlocks.Colours.motion;

  const sensingColors = KidProBlocks.Colours.sensing;

  const controlColors = KidProBlocks.Colours.control;

  const eventColors = KidProBlocks.Colours.event;

  KidProBlocks.Blocks.sound_sounds_menu.init = function () {
    const json = jsonForMenuBlock("SOUND_MENU", soundsMenu, soundColors, []);
    this.jsonInit(json);
  };
  KidProBlocks.Blocks.looks_costume.init = function () {
    const json = jsonForMenuBlock("COSTUME", costumesMenu, looksColors, []);
    this.jsonInit(json);
  };

  KidProBlocks.Blocks.looks_backdrops.init = function () {
    const json = jsonForMenuBlock("BACKDROP", backdropsMenu, looksColors, []);
    this.jsonInit(json);
  };

  KidProBlocks.Blocks.event_whenbackdropswitchesto.init = function () {
    const json = jsonForHatBlockMenu(
      KidProBlocks.Msg.EVENT_WHENBACKDROPSWITCHESTO,
      "BACKDROP",
      backdropNamesMenu,
      eventColors,
      []
    );
    this.jsonInit(json);
  };

  KidProBlocks.Blocks.motion_pointtowards_menu.init = function () {
    const mouse = KidProBlocks.ScratchMsgs.translate(
      "MOTION_POINTTOWARDS_POINTER",
      "mouse-pointer"
    );
    const json = jsonForMenuBlock("TOWARDS", spriteMenu, motionColors, [
      [mouse, "_mouse_"],
    ]);
    this.jsonInit(json);
  };

  KidProBlocks.Blocks.motion_goto_menu.init = function () {
    const random = KidProBlocks.ScratchMsgs.translate(
      "MOTION_GOTO_RANDOM",
      "random position"
    );
    const mouse = KidProBlocks.ScratchMsgs.translate(
      "MOTION_GOTO_POINTER",
      "mouse-pointer"
    );
    const json = jsonForMenuBlock("TO", spriteMenu, motionColors, [
      [random, "_random_"],
      [mouse, "_mouse_"],
    ]);
    this.jsonInit(json);
  };

  KidProBlocks.Blocks.motion_glideto_menu.init = function () {
    const random = KidProBlocks.ScratchMsgs.translate(
      "MOTION_GLIDETO_RANDOM",
      "random position"
    );
    const mouse = KidProBlocks.ScratchMsgs.translate(
      "MOTION_GLIDETO_POINTER",
      "mouse-pointer"
    );
    const json = jsonForMenuBlock("TO", spriteMenu, motionColors, [
      [random, "_random_"],
      [mouse, "_mouse_"],
    ]);
    this.jsonInit(json);
  };

  KidProBlocks.Blocks.sensing_of_object_menu.init = function () {
    const stage = KidProBlocks.ScratchMsgs.translate(
      "SENSING_OF_STAGE",
      "Stage"
    );
    const json = jsonForMenuBlock("OBJECT", spriteMenu, sensingColors, [
      [stage, "_stage_"],
    ]);
    this.jsonInit(json);
  };

  KidProBlocks.Blocks.sensing_of.init = function () {
    const blockId = this.id;
    // Function that fills in menu for the first input in the sensing block.
    // Called every time it opens since it depends on the values in the other block input.
    const menuFn = function () {
      const stageOptions = [
        [KidProBlocks.Msg.SENSING_OF_BACKDROPNUMBER, "backdrop #"],
        [KidProBlocks.Msg.SENSING_OF_BACKDROPNAME, "backdrop name"],
        [KidProBlocks.Msg.SENSING_OF_VOLUME, "volume"],
      ];
      const spriteOptions = [
        [KidProBlocks.Msg.SENSING_OF_XPOSITION, "x position"],
        [KidProBlocks.Msg.SENSING_OF_YPOSITION, "y position"],
        [KidProBlocks.Msg.SENSING_OF_DIRECTION, "direction"],
        [KidProBlocks.Msg.SENSING_OF_COSTUMENUMBER, "costume #"],
        [KidProBlocks.Msg.SENSING_OF_COSTUMENAME, "costume name"],
        [KidProBlocks.Msg.SENSING_OF_SIZE, "size"],
        [KidProBlocks.Msg.SENSING_OF_VOLUME, "volume"],
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
          options.sort(KidProBlocks.scratchBlocksUtils.compareStrings);
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

  KidProBlocks.Blocks.sensing_distancetomenu.init = function () {
    const mouse = KidProBlocks.ScratchMsgs.translate(
      "SENSING_DISTANCETO_POINTER",
      "mouse-pointer"
    );
    const json = jsonForMenuBlock("DISTANCETOMENU", spriteMenu, sensingColors, [
      [mouse, "_mouse_"],
    ]);
    this.jsonInit(json);
  };

  KidProBlocks.Blocks.sensing_touchingobjectmenu.init = function () {
    const mouse = KidProBlocks.ScratchMsgs.translate(
      "SENSING_TOUCHINGOBJECT_POINTER",
      "mouse-pointer"
    );
    const edge = KidProBlocks.ScratchMsgs.translate(
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

  KidProBlocks.Blocks.control_create_clone_of_menu.init = function () {
    const json = jsonForMenuBlock("CLONE_OPTION", cloneMenu, controlColors, []);
    this.jsonInit(json);
  };

  KidProBlocks.VerticalFlyout.getCheckboxState = function (blockId) {
    const monitoredBlock = vm.runtime.monitorBlocks._blocks[blockId];
    return monitoredBlock ? monitoredBlock.isMonitored : false;
  };

  KidProBlocks.FlyoutExtensionCategoryHeader.getExtensionState = function (
    extensionId
  ) {
    if (vm.getPeripheralIsConnected(extensionId)) {
      return KidProBlocks.StatusButtonState.READY;
    }
    return KidProBlocks.StatusButtonState.NOT_READY;
  };

  KidProBlocks.FieldNote.playNote_ = function (noteNum, extensionId) {
    vm.runtime.emit("PLAY_NOTE", noteNum, extensionId);
  };

  // Use a collator's compare instead of localeCompare which internally
  // creates a collator. Using this is a lot faster in browsers that create a
  // collator for every localeCompare call.
  const collator = new Intl.Collator([], {
    sensitivity: "base",
    numeric: true,
  });
  KidProBlocks.scratchBlocksUtils.compareStrings = function (str1, str2) {
    return collator.compare(str1, str2);
  };

  // Blocks wants to know if 3D CSS transforms are supported. The cross
  // section of browsers Scratch supports and browsers that support 3D CSS
  // transforms will make the return always true.
  //
  // Shortcutting to true lets us skip an expensive style recalculation when
  // first loading the Scratch editor.
  KidProBlocks.utils.is3dSupported = function () {
    return true;
  };

  return KidProBlocks;
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
  const stageSelected = KidProBlocks.ScratchMsgs.translate(
    "MOTION_STAGE_SELECTED",
    "Stage selected: no motion blocks"
  );
  return `
    <category name="%{BKY_CATEGORY_MOTION}" id="motion" colour="#4C97FF" secondaryColour="#3373CC">
        ${
          isStage
            ? `
        <label text="${stageSelected}"></label>
        `
            : `
            <block type="motion_movesteps">
            <value name="STEPS">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
 
        <block type="motion_turnright">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">15</field>
                </shadow>
            </value>
        </block>
        <block type="motion_turnleft">
            <value name="DEGREES">
                <shadow type="math_number">
                    <field name="NUM">15</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_goto">
            <value name="TO">
                <shadow type="motion_goto_menu">
                </shadow>
            </value>
        </block>
        <block type="motion_gotoxy">
            <value name="X">
                <shadow id="movex" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow id="movey" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="motion_glideto" id="motion_glideto">
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="TO">
                <shadow type="motion_glideto_menu">
                </shadow>
            </value>
        </block>
        <block type="motion_glidesecstoxy">
            <value name="SECS">
                <shadow type="math_number">
                    <field name="NUM">1</field>
                </shadow>
            </value>
            <value name="X">
                <shadow id="glidex" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
            <value name="Y">
                <shadow id="glidey" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_pointindirection">
            <value name="DIRECTION">
                <shadow type="math_angle">
                    <field name="NUM">90</field>
                </shadow>
            </value>
        </block>
        <block type="motion_pointtowards">
            <value name="TOWARDS">
                <shadow type="motion_pointtowards_menu">
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_changexby">
            <value name="DX">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="motion_setx">
            <value name="X">
                <shadow id="setx" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        <block type="motion_changeyby">
            <value name="DY">
                <shadow type="math_number">
                    <field name="NUM">10</field>
                </shadow>
            </value>
        </block>
        <block type="motion_sety">
            <value name="Y">
                <shadow id="sety" type="math_number">
                    <field name="NUM">0</field>
                </shadow>
            </value>
        </block>
        ${blockSeparator}
        <block type="motion_ifonedgebounce"/>
        ${blockSeparator}
        <block type="motion_setrotationstyle"/>
        ${blockSeparator}
        <block id="${targetId}_xposition" type="motion_xposition"/>
        <block id="${targetId}_yposition" type="motion_yposition"/>
        <block id="${targetId}_direction" type="motion_direction"/>`
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
  const hello = KidProBlocks.ScratchMsgs.translate("LOOKS_HELLO", "Hello!");
  const hmm = KidProBlocks.ScratchMsgs.translate("LOOKS_HMM", "Hmm...");
  return `
      <category name="%{BKY_CATEGORY_LOOKS}" id="looks" colour="#9966FF" secondaryColour="#774DCB">
          ${
            isStage
              ? ""
              : `
          <block type="looks_sayforsecs">
              <value name="MESSAGE">
                  <shadow type="text">
                      <field name="TEXT">${hello}</field>
                  </shadow>
              </value>
              <value name="SECS">
                  <shadow type="math_number">
                      <field name="NUM">2</field>
                  </shadow>
              </value>
          </block>
          <block type="looks_say">
              <value name="MESSAGE">
                  <shadow type="text">
                      <field name="TEXT">${hello}</field>
                  </shadow>
              </value>
          </block>
          <block type="looks_thinkforsecs">
              <value name="MESSAGE">
                  <shadow type="text">
                      <field name="TEXT">${hmm}</field>
                  </shadow>
              </value>
              <value name="SECS">
                  <shadow type="math_number">
                      <field name="NUM">2</field>
                  </shadow>
              </value>
          </block>
          <block type="looks_think">
              <value name="MESSAGE">
                  <shadow type="text">
                      <field name="TEXT">${hmm}</field>
                  </shadow>
              </value>
          </block>
          ${blockSeparator}
          `
          }
          ${
            isStage
              ? `
              <block type="looks_switchbackdropto">
                  <value name="BACKDROP">
                      <shadow type="looks_backdrops">
                          <field name="BACKDROP">${backdropName}</field>
                      </shadow>
                  </value>
              </block>
              <block type="looks_switchbackdroptoandwait">
                  <value name="BACKDROP">
                      <shadow type="looks_backdrops">
                          <field name="BACKDROP">${backdropName}</field>
                      </shadow>
                  </value>
              </block>
              <block type="looks_nextbackdrop"/>
          `
              : `
              <block id="${targetId}_switchcostumeto" type="looks_switchcostumeto">
                  <value name="COSTUME">
                      <shadow type="looks_costume">
                          <field name="COSTUME">${costumeName}</field>
                      </shadow>
                  </value>
              </block>
              <block type="looks_nextcostume"/>
              <block type="looks_switchbackdropto">
                  <value name="BACKDROP">
                      <shadow type="looks_backdrops">
                          <field name="BACKDROP">${backdropName}</field>
                      </shadow>
                  </value>
              </block>
              <block type="looks_nextbackdrop"/>
              ${blockSeparator}
              <block type="looks_changesizeby">
                  <value name="CHANGE">
                      <shadow type="math_number">
                          <field name="NUM">10</field>
                      </shadow>
                  </value>
              </block>
              <block type="looks_setsizeto">
                  <value name="SIZE">
                      <shadow type="math_number">
                          <field name="NUM">100</field>
                      </shadow>
                  </value>
              </block>
          `
          }
          ${blockSeparator}
          <block type="looks_changeeffectby">
              <value name="CHANGE">
                  <shadow type="math_number">
                      <field name="NUM">25</field>
                  </shadow>
              </value>
          </block>
          <block type="looks_seteffectto">
              <value name="VALUE">
                  <shadow type="math_number">
                      <field name="NUM">0</field>
                  </shadow>
              </value>
          </block>
          <block type="looks_cleargraphiceffects"/>
          ${blockSeparator}
          ${
            isStage
              ? ""
              : `
              <block type="looks_show"/>
              <block type="looks_hide"/>
          ${blockSeparator}
              <block type="looks_gotofrontback"/>
              <block type="looks_goforwardbackwardlayers">
                  <value name="NUM">
                      <shadow type="math_integer">
                          <field name="NUM">1</field>
                      </shadow>
                  </value>
              </block>
          `
          }
          ${
            isStage
              ? `
              <block id="backdropnumbername" type="looks_backdropnumbername"/>
          `
              : `
              <block id="${targetId}_costumenumbername" type="looks_costumenumbername"/>
              <block id="backdropnumbername" type="looks_backdropnumbername"/>
              <block id="${targetId}_size" type="looks_size"/>
          `
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
      <category name="%{BKY_CATEGORY_SOUND}" id="sound" colour="#D65CD6" secondaryColour="#BD42BD">
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
      <category name="%{BKY_CATEGORY_EVENTS}" id="events" colour="#FFD500" secondaryColour="#CC9900">
          <block type="event_whenflagclicked"/>
          <block type="event_whenkeypressed">
          </block>
          ${
            isStage
              ? `
              <block type="event_whenstageclicked"/>
          `
              : `
              <block type="event_whenthisspriteclicked"/>
          `
          }
          <block type="event_whenbackdropswitchesto">
          </block>
          ${blockSeparator}
          <block type="event_whengreaterthan">
              <value name="VALUE">
                  <shadow type="math_number">
                      <field name="NUM">10</field>
                  </shadow>
              </value>
          </block>
          ${blockSeparator}
          <block type="event_whenbroadcastreceived">
          </block>
          <block type="event_broadcast">
              <value name="BROADCAST_INPUT">
                  <shadow type="event_broadcast_menu"></shadow>
              </value>
          </block>
          <block type="event_broadcastandwait">
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
      <category name="%{BKY_CATEGORY_CONTROL}" id="control" colour="#FFAB19" secondaryColour="#CF8B17">
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
          ${blockSeparator}
          <block type="control_if"/>
          <block type="control_if_else"/>
          <block id="wait_until" type="control_wait_until"/>
          <block id="repeat_until" type="control_repeat_until"/>
          ${blockSeparator}
          <block type="control_stop"/>
          ${blockSeparator}
          ${
            isStage
              ? `
              <block type="control_create_clone_of">
                  <value name="CLONE_OPTION">
                      <shadow type="control_create_clone_of_menu"/>
                  </value>
              </block>
          `
              : `
              <block type="control_start_as_clone"/>
              <block type="control_create_clone_of">
                  <value name="CLONE_OPTION">
                      <shadow type="control_create_clone_of_menu"/>
                  </value>
              </block>
              <block type="control_delete_this_clone"/>
          `
          }
          ${categorySeparator}
      </category>
      `;
};

/**
 * 分类 消息
 * @param {*} isStage
 */
const sensing = (isStage) => {
  const name = KidProBlocks.ScratchMsgs.translate(
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
              <block type="sensing_distanceto">
                  <value name="DISTANCETOMENU">
                      <shadow type="sensing_distancetomenu"/>
                  </value>
              </block>
              ${blockSeparator}
          `
          }
          <block id="askandwait" type="sensing_askandwait">
              <value name="QUESTION">
                  <shadow type="text">
                      <field name="TEXT">${name}</field>
                  </shadow>
              </value>
          </block>
          <block id="answer" type="sensing_answer"/>
          ${blockSeparator}
          <block type="sensing_keypressed">
              <value name="KEY_OPTION">
                  <shadow type="sensing_keyoptions"/>
              </value>
          </block>
          <block type="sensing_mousedown"/>
          <block type="sensing_mousex"/>
          <block type="sensing_mousey"/>
          ${
            isStage
              ? ""
              : `
              ${blockSeparator}
              '<block type="sensing_setdragmode" id="sensing_setdragmode"></block>'+
              ${blockSeparator}
          `
          }
          ${blockSeparator}
          <block id="loudness" type="sensing_loudness"/>
          ${blockSeparator}
          <block id="timer" type="sensing_timer"/>
          <block type="sensing_resettimer"/>
          ${blockSeparator}
          <block id="of" type="sensing_of">
              <value name="OBJECT">
                  <shadow id="sensing_of_object_menu" type="sensing_of_object_menu"/>
              </value>
          </block>
          ${blockSeparator}
          <block id="current" type="sensing_current"/>
          <block type="sensing_dayssince2000"/>
          ${blockSeparator}
          <block type="sensing_username"/>
          ${categorySeparator}
      </category>
      `;
};

/**
 * 分类 运算
 */
const operators = () => {
  const apple = KidProBlocks.ScratchMsgs.translate(
    "OPERATORS_JOIN_APPLE",
    "apple"
  );
  const banana = KidProBlocks.ScratchMsgs.translate(
    "OPERATORS_JOIN_BANANA",
    "banana"
  );
  const letter = KidProBlocks.ScratchMsgs.translate(
    "OPERATORS_LETTEROF_APPLE",
    "a"
  );
  return `
      <category name="%{BKY_CATEGORY_OPERATORS}" id="operators" colour="#40BF4A" secondaryColour="#389438">
          <block type="operator_add">
              <value name="NUM1">
                  <shadow type="math_number">
                      <field name="NUM"/>
                  </shadow>
              </value>
              <value name="NUM2">
                  <shadow type="math_number">
                      <field name="NUM"/>
                  </shadow>
              </value>
          </block>
          <block type="operator_subtract">
              <value name="NUM1">
                  <shadow type="math_number">
                      <field name="NUM"/>
                  </shadow>
              </value>
              <value name="NUM2">
                  <shadow type="math_number">
                      <field name="NUM"/>
                  </shadow>
              </value>
          </block>
          <block type="operator_multiply">
              <value name="NUM1">
                  <shadow type="math_number">
                      <field name="NUM"/>
                  </shadow>
              </value>
              <value name="NUM2">
                  <shadow type="math_number">
                      <field name="NUM"/>
                  </shadow>
              </value>
          </block>
          <block type="operator_divide">
              <value name="NUM1">
                  <shadow type="math_number">
                      <field name="NUM"/>
                  </shadow>
              </value>
              <value name="NUM2">
                  <shadow type="math_number">
                      <field name="NUM"/>
                  </shadow>
              </value>
          </block>
          ${blockSeparator}
          <block type="operator_random">
              <value name="FROM">
                  <shadow type="math_number">
                      <field name="NUM">1</field>
                  </shadow>
              </value>
              <value name="TO">
                  <shadow type="math_number">
                      <field name="NUM">10</field>
                  </shadow>
              </value>
          </block>
          ${blockSeparator}
          <block type="operator_gt">
              <value name="OPERAND1">
                  <shadow type="text">
                      <field name="TEXT"/>
                  </shadow>
              </value>
              <value name="OPERAND2">
                  <shadow type="text">
                      <field name="TEXT">50</field>
                  </shadow>
              </value>
          </block>
          <block type="operator_lt">
              <value name="OPERAND1">
                  <shadow type="text">
                      <field name="TEXT"/>
                  </shadow>
              </value>
              <value name="OPERAND2">
                  <shadow type="text">
                      <field name="TEXT">50</field>
                  </shadow>
              </value>
          </block>
          <block type="operator_equals">
              <value name="OPERAND1">
                  <shadow type="text">
                      <field name="TEXT"/>
                  </shadow>
              </value>
              <value name="OPERAND2">
                  <shadow type="text">
                      <field name="TEXT">50</field>
                  </shadow>
              </value>
          </block>
          ${blockSeparator}
          <block type="operator_and"/>
          <block type="operator_or"/>
          <block type="operator_not"/>
          ${blockSeparator}
          <block type="operator_join">
              <value name="STRING1">
                  <shadow type="text">
                      <field name="TEXT">${apple} </field>
                  </shadow>
              </value>
              <value name="STRING2">
                  <shadow type="text">
                      <field name="TEXT">${banana}</field>
                  </shadow>
              </value>
          </block>
          <block type="operator_letter_of">
              <value name="LETTER">
                  <shadow type="math_whole_number">
                      <field name="NUM">1</field>
                  </shadow>
              </value>
              <value name="STRING">
                  <shadow type="text">
                      <field name="TEXT">${apple}</field>
                  </shadow>
              </value>
          </block>
          <block type="operator_length">
              <value name="STRING">
                  <shadow type="text">
                      <field name="TEXT">${apple}</field>
                  </shadow>
              </value>
          </block>
          <block type="operator_contains" id="operator_contains">
            <value name="STRING1">
              <shadow type="text">
                <field name="TEXT">${apple}</field>
              </shadow>
            </value>
            <value name="STRING2">
              <shadow type="text">
                <field name="TEXT">${letter}</field>
              </shadow>
            </value>
          </block>
          ${blockSeparator}
          <block type="operator_mod">
              <value name="NUM1">
                  <shadow type="math_number">
                      <field name="NUM"/>
                  </shadow>
              </value>
              <value name="NUM2">
                  <shadow type="math_number">
                      <field name="NUM"/>
                  </shadow>
              </value>
          </block>
          <block type="operator_round">
              <value name="NUM">
                  <shadow type="math_number">
                      <field name="NUM"/>
                  </shadow>
              </value>
          </block>
          ${blockSeparator}
          <block type="operator_mathop">
              <value name="NUM">
                  <shadow type="math_number">
                      <field name="NUM"/>
                  </shadow>
              </value>
          </block>
          ${categorySeparator}
      </category>
      `;
};

/** 分类 变量 */
const variables = () => {
  return `
      <category
          name="%{BKY_CATEGORY_VARIABLES}"
          id="variables"
          colour="#FF8C1A"
          secondaryColour="#DB6E00"
          custom="VARIABLE">
      </category>
      `;
};

/** 分类 自定义积木 */
const myBlocks = () => {
  return `
      <category
          name="%{BKY_CATEGORY_MYBLOCKS}"
          id="myBlocks"
          colour="#FF6680"
          secondaryColour="#FF4D6A"
          custom="PROCEDURE">
      </category>
      `;
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
  const operatorsXML =
    moveCategory("operators") || operators(isStage, targetId);
  const variablesXML = moveCategory("data") || variables(isStage, targetId);
  const myBlocksXML = moveCategory("procedures") || myBlocks(isStage, targetId);

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
    operatorsXML,
    gap,
    variablesXML,
    gap,
    myBlocksXML,
  ];

  for (const extensionCategory of categoriesXML) {
    everything.push(gap, extensionCategory.xml);
  }

  everything.push(xmlClose);
  return everything.join("\n");
};
