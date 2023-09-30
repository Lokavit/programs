/*
 * @Descripttion: this is descS
 * @Author: border-1px
 * @Date: 2019-10-09 15:53:25
 * @LastEditTime: 2019-12-17 16:58:38
 */

export default {
  SUPER_INTENDENT:'机务',
  SUPER_INTENDENT_MANAGER:'机务经理',
  SHIP_OWNER:'船东',
  CHIEF_OFFICER:'大副',
  CHIEF_ENGINEER:'轮机长',
  MANAGEMENT_COMPANY_ADMIN:'管理员',
  role: {
    SYSTEM: '系统管理员',
    SUPER_ADMIN: '超级管理员',
    MANAGEMENT_COMPANY_ADMIN: '公司管理员',
    SUPER_INTENDENT: '机务',
    SUPER_INTENDENT_MANAGER: '机务经理',
    SHIP_OWNER: '船东',
    CHIEF_OFFICER: '大副',
    CHIEF_ENGINEER: '轮机长'
  },
  common:{
    ok: '确定',
    add: '添加',
    cancel: '取消',
    more:'更多',
    tip:'提示',
    ops: '操作',
    repeat:'不能重复选择哦~',
    readed:'已读',
    unReaded:'未读',
    enable:'启用',
    disable:'禁用',
    addOk: '添加成功',
    editOk: '编辑成功',
    doOk:'操作成功',
    delOk: '删除成功',
    userRepeat:'用户已存在',
    midSlipLine:'——',
    nothing: '暂无数据',
    attachment: '项目附件',
    baseTitle: '基本信息',
    loadingTip: '拼命加载中...',
    delText: '你确定要执行删除操作吗?',
    placeholder: '请输入内容',
    placeholders: '请选择',
    placeholderd: '请选择日期',
    description: '详细描述',
    relateFill: '根据选择自动赋值',
    doing:'功能正在开发中...',
    saveForSubmit: '请先保存数据, 再进行操作!'
  },
  menu:{
    dashboard: {
      index: '工作台',
      notice: '通知'
    },
    management: {
      index: '管理',
      project: '项目',
      information: '信息',
      shipInfo: '船舶管理',
      carrier: '船东管理',
      society: '船级社管理',
      cert: '船舶证书管理',
      dockItem: '坞修项管理',
      settings: '设置',
      company: '公司信息管理',
      users: '用户信息设置',
      flow: '审批流程设置',
      business: '商务条款设置'
    },
    dockrepair: {
      index: '坞修',
      specification: '规格书',
      quote: '询价',
      contrast: '比价'
    }
  },
  modal:{
    vessel:{
      title: '选择船舶',
      name:'船舶名称',
      type:'船舶类型',
      shipId:'船舶识别号'
    }
  },
  attachment:{
    saveOk: '保存成功',
    photo: '图片',
    other: '其他资料',
    upload: '上传文件',
    uploading: '上传中...',
    errorExt: '不支持该文件类型',
    errorSize: '文件尺寸不能超过2M',
    table:{
      name: '文件名',
      type: '文件类型',
      modifyTime: '修改时间',
      ops: '操作',
      preview: '预览',
      download: '下载',
      delete: '删除'
    }
  },
  navHeader: {
    logout: '退出登录',
    password:'修改密码',
    userinfo:'修改用户信息'
  },
  // @/layout/components/navHeader.vue
  msgboxLang: {
    ok: '确定',
    cancel: '取消',
    title: '提示',
    content: '确定要切换语言吗?'
  },
  // @/utils/request.js
  errCode: {
    timeout: '请求超时!',
    c400: '操作失败!',
    c401: '您未登陆!',
    c403: '操作失败，您没有权限!',
    c404: '请求不存在!',
    c500: '服务器开小差了 >.<',
    unkonwn: '未知错误!'
  },
  dashboard:{
    main:{
      titleFlow: '待审批流程',
      titleProject: '坞修列表',
      titleFleet: '船舶列表',
      titleNews: '未读消息',
      otherVessel:'其他船舶',
      head:{
        flow: '待审批流程',
        plan:'坞修计划',
        vessel:'船舶数量',
        news:'未读消息'
      },
      vesselSet:{
        ship1:'散货船',
        ship2:'杂货船',
        ship3:'化学品船',
        ship4:'油船',
        ship5:'集装箱船'
      }
    },
    notices:{
      search:{
        keyword:'通知',
        startAt:'开始时间',
        status:'状态'
      },
      status:{
        ALL:'全部',
        READED:'已读',
        UNREAD:'未读'
      },
      table:{
        content:'通知',
        from:'来自',
        createAt:'时间',
        status:'状态',
        flagAt:'标记为',
        flag_Readed:'已读',
        flag_UnRead:'未读'
      },
      infoModal:{
        title: '通知信息',
        noticeTitle:'通知',
        fromName:'发起人',
        content:'内容',
        createAt:'发起时间',
        btnUnRead:'标记为未读',
      }
    }
  },
  // @/view/baseinfo/page/index.vue
  baseInfo: {
    company: '船舶管理公司管理',
    shipowner: '船东管理',
    shipflag: '船级社管理',
    ship: '船舶管理',
    cert: '船舶证书管理',
    person: '人员管理',
    shipyard: '船厂管理'
  },
  // 船员分配Modal
  allotModal:{
    title: '船员分配',
    tipContent:'该用户已分过船，该操作将解除上一次的分配，并分配给当前操作的船，是否继续？',
    tipReplace: '该操作将使您失去该船的管理权限，是否继续',
    tipNotDel:'至少需要一名机务，这里不能删除！',
    search:{
      name:'姓名',
      status:'状态'
    },
    table:{
      title:'',
      name:'姓名',
      company:'公司',
      status:'状态',
      statusYes:'已分配',
      statusNo:'空闲'
    }
  },
  // 船舶管理
  shipInfo: {
    table:{
      name: '名称',
      type: '类型',
      shipid: '船舶识别号',
      owner: '船东',
      ops: '操作'
    },
    add: '添加',
    formSearch:{
      search: '查询',
      reset: '重置',
      labelName: '船舶名称',
      labelType: '船舶类型',
      labelOwner: '船东',
      holderName: '输入船舶名称',
      holderType: '选择船舶类型',
      holderOwner: '选择船东',
    },
    addShipModal:{
      title: '添加船舶',
      addOk: '添加成功',
      editTitle: '编辑船舶',
      editOk: '编辑成功',
      labelName: '船舶名称',
      labelType: '船舶类型',
      labelShipId: '船舶标识符',
      holderName: '输入船舶名称',
      holderType: '选择船舶类型',
      holderShipId: '输入船舶标识符',
    },
    detailModal: {
      title: '船舶信息',
      subTitleBase: '基本信息',
      subTitleShip: '船舶资料',
      subTitleParams: '主要参数',
      btnAssign:'人员分配',
      base: {
        labelName: '船舶名称',
        labelType: '船舶类型',
        labelShipId: '船舶标识',
        labelIMO: 'IMO',
        labelVSat: 'V-Sat',
        labelVSatMiniC: 'V-Sat mini C',
        labelNationality: '船籍',
        labelMMSI: 'MMSI',
        labelNumber: '呼号',
        labelSatC: 'Sat C',
        labelPhone: '联系电话',
        labelMail: '邮件',
        holderName: '船舶名称',
        holderType: '船舶类型',
        holderShipId: '船舶标识',
        holderIMO: 'IMO',
        holderVSat: 'V-Sat',
        holderVSatMiniC: 'V-Sat mini C',
        holderNationality: '船籍',
        holderMMSI: 'MMSI',
        holderNumber: '呼号',
        holderSatC: 'Sat C',
        holderPhone: '联系电话',
        holderMail: '邮件',
      },
      info: {
        labelRegId: '船检登记号',
        labelPlant: '建造厂',
        labelDelivery: '交付日期',
        labelArea: '航区',
        labelOwner: '所有者',
        labelManager: '经营者',
        labelFlag: '旗船国',
        labelSociety: '船籍社',
        labelPort: '船籍港',
        holderRegId: '船检登记号',
        holderPlant: '建造厂',
        holderDelivery: '交付日期',
        holderArea: '航区',
        holderOwner: '所有者',
        holderManager: '经营者',
        holderFlag: '旗船国',
        holderSociety: '船籍社',
        holderPort: '船籍港'
      },
      params: {
        labelLengthOverall: '总长 (米)',
        labelLengthBP: '垂直间长 (米)',
        labelBreadthMLD: '型宽 (米)',
        labelDepthMLD: '型深 (米)',
        labelDwt: '载重吨 (吨)',
        labelGt: '总吨 (吨)',
        labelPortOfRegistry: '净吨 (吨)',
        labelNumberOfCargoHold: '货舱数 (个)',
        labelNumberOfCrane: '吊车数 (个)',
        labelCraneType: '吊车型号',
        labelLoadDraft: '满载吃水 (米)',
        labelLightDraft: '空载吃水 (米)',
        labelFullLoadShipAirDraft: '满载船高 (米)',
        labelLightshipAirDraft: '空载船高 (米)',
        labelMainEnginePower: '主机功率 (千瓦)',
        labelMainEngineRPM: '主机转速 (转/分)',
        labelMainEngineType: '主机型号',
        labelDesignSpeed: '设计航速',
        holderLengthOverall: '总长 (米)',
        holderLengthBP: '垂直间长 (米)',
        holderBreadthMLD: '型宽 (米)',
        holderDepthMLD: '型深 (米)',
        holderDwt: '载重吨 (吨)',
        holderGt: '总吨 (吨)',
        holderPortOfRegistry: '净吨 (吨)',
        holderNumberOfCargoHold: '货舱数 (个)',
        holderNumberOfCrane: '吊车数 (个)',
        holderCraneType: '吊车型号',
        holderLoadDraft: '满载吃水 (米)',
        holderLightDraft: '空载吃水 (米)',
        holderFullLoadShipAirDraft: '满载船高 (米)',
        holderLightshipAirDraft: '空载船高 (米)',
        holderMainEnginePower: '主机功率 (千瓦)',
        holderMainEngineRPM: '主机转速 (转/分)',
        holderMainEngineType: '主机型号',
        holderDesignSpeed: '设计航速'
      }
    }
  },
  society: {
    table: {
      name: '名称',
      shortName: '简称',
      contacts: '联系人',
      phone: '电话',
      mail: '邮件',
      remark: '备注'
    },
    addSoc: '添加船级社',
    editSoc: '编辑船级社信息'
  },
  carrier: {
    addCarrier: '添加船东',
    editCarrier: '编辑船东',
    table:{
      name: '名称',
      contacts: '联系人',
      phone: '电话',
    },
    detail: {
      name: '名称',
      contacts: '联系人',
      phone: '电话',
      mail: 'E-mail',
      remark: '备注',
      cert: '相关证书',
      auth: '授权证书',
      shipTitle: '船舶列表'
    }
  },
  shipCert: {
    addCert: '添加船舶证书',
    editCert: '编辑船舶证书',
    table: {
      certName: '证书名称',
      shipName: '船舶名称',
      certId: '证书编号',
      flag: '船旗社',
      expireDate: '过期日期',
      status: '状态'
    },
    formSearch:{
      labelName: '船舶名称',
      labelStatus: '证书状态',
      STATUS_NORMAL:'正常',
      STATUS_EXPIRATION_CLOSE:'即将过期',
      STATUS_EXPIRED:'过期'
    },
    addModal:{
      certName: '证书名称',
      shipName: '船舶名称',
      certCode: '证书编号',
      certType: '证书类型',
      CERTTYPE_OF_VESSEL: '船舶证书',
      CERTTYPE_OF_EQUIPMENT: '设备证书'
    },
    detail: {
      certName: '证书名称',
      certCode: '证书编号',
      certType: '证书类型',
      signOrg: '签发机构',
      signDate: '签发日期',
      expireDate: '到期日期',
      warnDay: '预警天数',
      remark: '备注'
    }
  },
  dockItem: {
    version: '体系版本',
    item:'标准坞修项',
    detailItem: '标准坞修细节项',
    defaultText: '请先选择体系版本'
  },
  dockDetailItem:{
    table:{
      code: '编码',
      name: '名称',
      type: '类型',
      budget: '预算',
      selfSupply: '自供'
    }    
  },
  project:{
    STAGE_NOT_STARTED:'未开始',
    STAGE_PLAN:'计划中',
    STAGE_SPECIFICATION:'制定',
    STAGE_QUOTE:'询价中',
    STAGE_REPAIR:'维修中',
    STAGE_CHECK:'结算',
    STAGE_SUMMARY:'总结',
    STATUS_DRAFTING:'草拟',
    STATUS_WAITING_FOR_APPROVAL:'待审批',
    STATUS_APPROVED:'已立项',
    step: {
      overview:'概述',
      spec:'规格书',
      quote:'询价'
    },
    formSearch: {
      number: '项目编号',
      name:'项目名称',
      stage:'项目阶段',
      status:'项目状态'
    },
    table: {
      code: '项目编号',
      name: '项目名称',
      stage: '项目阶段',
      startTime: '开始时间',
      endTime: '结束时间',
      status: '状态'
    },
    addProject: {
      title: '添加项目',
      titles: '选择项目',
      code: '项目编号',
      name: '项目名称',
      shipName: '船舶名称',
      shipType: '船舶类型',
      startTime: '开始时间',
      endTime: '结束时间'
    },
    overview: {
      btnSubmit: '提交审批',
      btnHistory: '历史记录',
      baseInfo: {
        startTime: '开始时间',
        status: '状态',
        stage: '阶段',
        endTime: '结束时间',
        shipName: '船舶名称',
        shipType: '船舶类型',
        shipNo: '船舶识别号'
      },
      descInfo: {
        title: '坞修描述'
      },
      operation:{
        APPROVE: '同意',
        REJECT: '拒绝',
        MODIFY: '更新',
        LOCK: '删除',
        SUBMIT: '提交',
        REEDIT:'重新编辑'
      },
      flow: {
        START: '发起',
        title:'流程审批',
        history:{
          title: '审批历史记录'
        },
        comment: '请输入您的意见(选填)',
        state:{
          default: '未审批',
          doing: '审批中',
          reject: '拒绝',
          agree: '同意',
          complete: '审批完成'
        }
      }
    }
  },
  specification:{
    common:{
      dockItem:'坞修项',
      dockDetailItem:'坞修细节项'
    },
    table:{
      specId: '规格书编号',
      shipName: '船舶名称',
      dockId:'坞修项目',
      createAt:'创建时间',
      proName: '项目名称',
      version: '体系版本',
      currency:'币种',
    },
    addModal:{
      title:'添加规格书',
      proName: '项目名称',
      proCode: '项目编号',
      shipName: '船舶名称',
      shipType:'船舶类型',
      currency:'币种',
      version:'体系版本',
      tipNotNull:'名称或编码不能为空!'
    },
    overview:{
      base:{
        shipName:'船舶名称',
        shipType:'船舶类型',
        buildTime:'建造时间',
        dockType:'坞修类型',
        startTime:'开始时间',
        endTime:'结束时间',
        currency:'币种',
        version:'体系版本'
      },
      addDockItem:{
        title:'增加坞修项',
        number:'编号',
        code:'编码',
        name:'名称',
        selfRepair:'自修',
        budget:'预算',
        radioYes:'是',
        radioNo:'否',
        description:'描述',
      },
      treeChildHeader:{
        code: '编码',
        name: '坞修',
        budget: '预算',
        selfRepair: '自修',
        status: '状态'
      },
      dockItemInfo:{
        desc:'详细描述',
        matter: '注意事项',
        worklist: '工作列表',
        attachment:'附件',
        check: '验收项目'
      },
      addDockDetailItem:{
        TYPE_SERVICE:'服务',
        TYPE_MATERIAL:'物料',
        TYPE_EQUIPMENT:'备件',
        KP_KEY:'参数名',  //placeholder
        KP_VALUE:'参数值',
        tipKPAdd:'添加关键参数',
        tipKPDel:'删除关键参数',
        titleAdd: '增加坞修细节项',
        titleEdit: '编辑坞修细节项',
        code:'编码',
        name:'名称',
        type:'类型',
        budget:'预算',
        supplier:'供应商',
        selfSupply:'自供',
        keyParam:'关键参数',
        keyParamName:'参数名',
        keyParamValue: '参数值',
        unit:'单位',
        quantity:'数量',
        description:'描述'
      }
    }
  },
  quote:{
    search:{
      number: '编号',
      project: '项目',
      billDate: '单据日期',
      selectSpec:'选择规格书',
      status:'状态'
    },
    status:{
      ALL:'全部',
      CREATED:'已创建',
      OFFERED:'已报价',
      WAITING:'未审批',
      APPROVED:'已同意',
      REJECTED:'已拒绝',
      ACCEPTED:'已成交'
    },
    table:{
      projectNumber:'项目编号',
      projectName:'项目名称',
      shipName:'船舶名称',
      shipyard:'船厂',
      status:'状态',
      offeredAt:'报价时间',
      total:'总价',
      btnCompare:'比价',
      btnReCompare:'再次比价',
      btnDeal:'成交',
      btnReject:'拒绝',
      tipNoSelect: '请先选择一个报价单',
      tipNoMatch:'不同项目的报价单，不能一起比价！',
      tipNoPassToDeal: '审批通过的询价单，才能成交哦！',
      tipAccept: '该询价单已成交！',
      tipIsCompleteToReject: '已成交/拒绝的询价单，不能再进行此操作！'
    },
    addModal:{
      title:'添加询价单',
      titles:'选择询价单',
      email:'邮件',
      liaison:'联系人',
      shipyardName:'船厂名称',
      telephone:'电话',
      selectLabel:'选择规格书',
      selectTitle:'规格书信息',
      shipyard:'船厂信息'
    },
    overview:{
      operation:{
        EXPORTQUOTATION: '导出报价单',
        EXPORTINQUIRY: '导出询价单',
        IMPORT: '导入报价单',
        APPROVE: '同意',
        REJECT: '拒绝',
        UPDATE: '更新',
        LOCK: '删除',
        SUBMIT: '提交',
        ACCEPT: '成交',
        VIEWGUIDEBOOK: '查看坞修指导书',
        DOWNGUIDEBOOK: '导出坞修指导书',
        COMPUTE_PDF:'生成坞修指导书',
        FETCH_PDF:'导出坞修指导书',
        TIP_IMPORT_OK: '报价单导入成功',
        TIP_COMPUTE_PDF: '指导书正在生成中，这可能需要几分钟的时间，稍后您可以在此页面看到下载按钮',
        TIP_ACCEPT:'执行成交操作后，同一询价单的其它报价将变为拒绝状态，确定要执行操作吗？'
      },
      base:{
        titleQuote: '报价信息',
        titleBase: '基本信息',
        titleDesc: '描述信息',
        vesselName:'船舶名称',
        dockPlant:'坞修厂',
        vesselType:'船型',
        contact:'联系人',
        vesselNo:'船号',
        email:'联系方式',
        status:'状态',
        dockProject:'坞修项目',
        telephone:'电话',
        totalNoExtraDiscount:'折前总报价',
        extraDiscount:'额外折扣',
        currency:'币种',
        FinalTotal:'折后总金额',
        offeredAt:'报价时间',
        expiryDate: '报价截止时间'
      },
      tree:{
        title:'坞修列表',
        number:'编号',
        name:'名称',
        unit:'单位',
        unitPriceBeforeDiscount:'折前单价',
        quantity:'数量',
        totalBeforeDiscount:'折前小计',
        discount:'折扣率',
        disAmount:'折后小计',
        remark:'备注'
      }
    },
    contrast:{
      btnOpen:'展开',
      tipRepeat:'该询价单已选过了哦~',
      labelOther:'其它',
      base:{
        title:'坞修信息',
        name:'船舶名称',
        type:'船舶类型',
        number:'船舶编号',
        startAt:'开始时间',
        endAt:'结束时间',
        desc:'相关描述'
      },
      yard:{
        title:'船厂名称',
        offHire:'停租时间',
        contact:'联系人',
        email:'E-Mail',
        phone:'电话',
        enterYard:'报价时间',
        waste:'停租损耗',
        discount:'整体折扣',
        extraDiscount:'附加折扣',
        repairCost:'坞修费用',
        finalCost:'总费用',
        btnSelect:'选择船厂'
      }
    }
  },
  settings:{
    flow:{
      table:{
        name:'流程名称',
        brief:'流程概览'
      },
      type:{
        PROJECT_CREATE: '项目审批',
        SPECIFICATION_ITEM_COMPLETE: '规格书坞修项审批',
        QUOTATION_ACCEPT:'询价单审批',
        SUPER_INTENDENT_MANAGER: 'SUPER_INTENDENT_MANAGER',
        SHIP_OWNER: 'SHIP_OWNER',
        SUPER_INTENDENT: 'SUPER_INTENDENT',
        CHIEF_OFFICER: 'CHIEF_OFFICER',
        CHIEF_ENGINEER: 'CHIEF_ENGINEER',
        SHIP_OWNER: 'SHIP_OWNER'
      },
      editModal:{
        title2:'编辑流程节点',
        step:'步骤',
        nodeName:'节点名称',
        roleName:'审批角色',
        title:'审批流程配置',
        modifiable: '可编辑'
      },
      addModal:{
        title:'增加流程节点',
        nodeName:'节点名称',
        roleName:'审批角色',
        canEdit:'可编辑',
        radioYes:'是',
        radioNo:'否',
        btnAdd:'增加节点'
      }
    },
    user: {
      search: {
        keyword: '关键字',
        role: '角色',
        status:'用户状态',
        MANAGEMENT_COMPANY_ADMIN: '管理员',
        SUPER_INTENDENT:'机务',
        SUPER_INTENDENT_MANAGER:'机务经理',
        SHIP_OWNER:'船东',
        CHIEF_OFFICER:'大副',
        CHIEF_ENGINEER:'轮机长'
      },
      table:{
        loginName:'用户名',
        userName:'姓名',
        mail:'邮箱',
        phone:'电话',
        ship:'船舶',
        job:'职务',
        status:'禁用/启用'
      },
      addModal:{
        title:'增加新用户',
        titleEdit:'编辑用户信息',
        loginName:'登陆名',
        userName:'姓名',
        company:'船舶公司',
        job:'职务',
        password:'密码',
        status:'账户状态',
        radioYes:'启用',
        radioNo:'禁用'
      },
      passModal:{
        title:'修改密码',
        oldPass: '旧密码',
        newPass: '新密码',
        newPass2: '密码确认',
        errNotEqual: '两次输入的密码不同',
        holderOldPass:'请输入旧密码',
        holderNewPass:'请输入新密码',
        holderNewPass2:'请再次输入密码'
      }
    },
    company: {
      title:'公司信息',
      comName:'公司名称',
      contact:'联系人',
      phone:'联系方式',
      mail:'e-mail',
      fax:'Fax',
      addr:'地址',
      fullAddr:'详细地址',
      intr:'公司介绍'
    },
    business: {
      title: '商务条款'
    }
  }
}