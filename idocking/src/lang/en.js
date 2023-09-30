/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-10-09 15:53:29
 * @LastEditTime: 2019-12-17 16:58:47
 */
export default {
  SUPER_INTENDENT:'Superintendent',
  SUPER_INTENDENT_MANAGER:'Fleet Manager',
  SHIP_OWNER:'Ship Owner',
  CHIEF_OFFICER:'Chief Officer',
  CHIEF_ENGINEER:'Chief Engineer',
  MANAGEMENT_COMPANY_ADMIN: 'Admin',
  role: {
    SYSTEM: 'SYSTEM',
    SUPER_ADMIN: 'SUPER_ADMIN',
    MANAGEMENT_COMPANY_ADMIN: 'MANAGEMENT_COMPANY_ADMIN',
    SUPER_INTENDENT: 'SUPERINTENDENT',
    SUPER_INTENDENT_MANAGER: 'FLEET_MANAGER',
    SHIP_OWNER: 'SHIP_OWNER',
    CHIEF_OFFICER: 'CHIEF_OFFICER',
    CHIEF_ENGINEER: 'CHIEF_ENGINEER'
  },
  common:{
    ok: 'Confirm',
    add: 'Add',
    cancel: 'Cancel',
    ops: 'Operation',
    more:'More',
    tip:'Tips',
    repeat:'Do not make repeated selections',
    readed:'Readed',
    unReaded:'UnReaded',
    enable:'Enable',
    disable:'Disable',
    addOk: 'Add success',
    editOk: 'Edit success',
    doOk:'Operation completed',
    delOk: 'Delete successful',
    userRepeat:'User already exists',
    midSlipLine:'——',
    nothing: 'No data',
    attachment: 'Attachments',
    baseTitle: 'Basic Information',
    loadingTip: 'Data loading',
    delText: 'Are you sure you want to delete?',
    placeholder: 'Please Input Content',
    placeholders: 'Please Select',
    placeholderd: 'Please Select Date',
    description: 'Description',
    relateFill: 'Auto fill based on Selection',
    doing:'Coming soon...',
    saveForSubmit: 'Please save the data before operation!'
  },
  menu:{
    dashboard: {
      index: 'Dashboard',
      notice: 'Notice'
    },
    management: {
      index: 'Management',
      project: 'Project',
      information: 'Information',
      shipInfo: 'Fleet infromation',
      carrier: 'Owners information',
      society: 'Classification Society',
      cert: 'Ship Certifiactes',
      dockItem: 'Dry docking code',
      settings: 'Settings',
      company: 'Company-Info Setting',
      users: 'User Setting',
      flow: 'Flow Setting',
      business: 'Business Terms'
    },
    dockrepair: {
      index: 'Dock Repair',
      specification: 'Specification',
      quote: 'Quotation',
      contrast: 'Comparison'
    }
  },
  modal:{
    vessel:{
      title: 'Select Ship',
      name:'Ship Name',
      type:'Ship Type',
      shipId:'Ship ID'
    }
  },
  attachment:{
    saveOk: 'Save successfully',
    photo: 'Photo',
    other: 'Other information',
    upload: 'Upload',
    uploading: 'Uploading...',
    errorExt: 'This type of file is not supported',
    errorSize: 'File size limitation 2M',
    table:{
      name: 'File Name',
      type: 'File Type',
      modifyTime: 'Modify Time',
      ops: 'Operation',
      preview: 'Preview',
      download: 'Download',
      delete: 'Del'
    }
  },
  navHeader: {
    logout: 'logout',
    password:'Change Password',
    userinfo:'Change UserInfo'
  },
  // @/layout/components/navHeader.vue
  msgboxLang: {
    ok: 'Confirm',
    cancel: 'Cancel',
    title: 'Info',
    content: 'Do you want to change languages?'
  },
  // @/utils/request.js
  errCode: {
    timeout: 'timeout.',
    c400: 'operation failed.',
    c401: 'You are not logged in.',
    c403: 'The operation failed. You have no authority.',
    c404: 'The request does not exist.',
    c500: 'Server exception.',
    unkonwn: 'unknown error.'
  },
  dashboard:{
    main:{
      titleFlow: 'Process to be approved',
      titleProject: 'Dock repair list',
      titleFleet: 'Fleet list',
      titleNews: 'Unread message',
      otherVessel:'Other ships',
      head:{
        flow: 'Process to be approved',
        plan:'Dock plan',
        vessel:'Vessel Count',
        news:'Unread message'
      },
      vesselSet:{
        ship1:'Bulk cargo',
        ship2:'General cargo ship',
        ship3:'Chemical tanker',
        ship4:'Oil tanker',
        ship5:'Container ship'
      }
    },
    notices:{
      search:{
        keyword:'Notice',
        startAt:'Start Time',
        status:'Status'
      },
      status:{
        ALL:'All',
        READED:'Readed',
        UNREAD:'UnRead'
      },
      table:{
        content:'Notice',
        from:'From',
        createAt:'Create At',
        status:'Status',
        flagAt:'Marked as',
        flag_Readed:'Readed',
        flag_UnRead:'UnRead'
      },
      infoModal:{
        title: 'Notice',
        noticeTitle:'Notice',
        fromName:'From',
        content:'Content',
        createAt:'Create At',
        btnUnRead:'Mark as unread'
      }
    }
  },
  // @/view/baseinfo/page/index.vue
  baseInfo: {
    company: 'Ship-manager',
    shipowner: 'Shipowner',
    shipflag: 'Classification Society',
    ship: 'Ship information',
    cert: 'Ship certificate',
    person: 'Crew management',
    shipyard: 'Shipyard'
  },
  allotModal:{
    title: 'Staff Allot',
    tipContent:'This user has been assigned. This operation will cancel the last assignment. Do you want to continue?',
    tipReplace: 'This operation will cause you to lose the management authority of this ship. Do you want to continue',
    tipNotDel:'This item cannot be empty！',
    search:{
      name:'Name',
      status:'Status'
    },
    table:{
      title:'',
      name:'Name',
      company:'Company',
      status:'Status',
      statusYes:'Assigned',
      statusNo:'Avaliable'
    }
  },
  shipInfo: {
    table:{
      name: 'Name',
      type: 'Type',
      shipid: 'ShipID',
      owner: 'ShipOwner',
      ops: 'Operation'
    },
    add: 'Add',
    formSearch:{
      search: 'Search',
      reset: 'Reset',
      labelName: 'Ship Name',
      labelType: 'Ship Type',
      labelOwner: 'Ship owner',
      holderName: 'Input ship Name',
      holderType: 'Select ship Type',
      holderOwner: 'Select ship owner',
    },
    addShipModal:{
      title: 'Add Ship',
      addOk: 'Add ship success',
      editTitle: 'Edit Ship',
      editOk: 'Editorial success',
      labelName: 'Ship Name',
      labelType: 'Ship Type',
      labelShipId: 'Ship ID',
      holderName: 'input Ship-Name',
      holderType: 'input Ship-Type',
      holderShipId: 'input Ship-ID',
    },
    detailModal: {
      title: 'Ship Information',
      subTitleBase: 'BaseInfo',
      subTitleShip: 'Ship data',
      subTitleParams: 'Main Parameter',
      btnAssign:'Staff Allot',
      base: {
        labelName: 'Ship Name',
        labelType: 'Ship Type',
        labelShipId: 'Ship ID',
        labelIMO: 'IMO',
        labelVSat: 'V-Sat',
        labelVSatMiniC: 'V-Sat mini C',
        labelNationality: 'Flag',
        labelMMSI: 'MMSI',
        labelNumber: 'Call sign',
        labelSatC: 'Sat C',
        labelPhone: 'Phone Number',
        labelMail: 'Mail Adress',
        holderName: 'Ship Name',
        holderType: 'Ship Type',
        holderShipId: 'Ship ID',
        holderIMO: 'IMO',
        holderVSat: 'V-Sat',
        holderVSatMiniC: 'V-Sat mini C',
        holderNationality: 'Flag',
        holderMMSI: 'MMSI',
        holderNumber: 'Call sign',
        holderSatC: 'Sat C',
        holderPhone: 'Phone number',
        holderMail: 'Mail Adress',
      },
      info: {
        labelRegId: 'Class Reg. Number',
        labelPlant: 'Building yard',
        labelDelivery: 'Delivery date',
        labelArea: 'Navigation area',
        labelOwner: 'Ship Owner',
        labelManager: 'Ship Manager',
        labelFlag: 'Flag State',
        labelSociety: 'Classification Society',
        labelPort: 'Port of registry',
        holderRegId: 'Class Reg. Number',
        holderPlant: 'Building yard',
        holderDelivery: 'Delivery date',
        holderArea: 'Navigation area',
        holderOwner: 'Ship Owner',
        holderManager: 'Ship Manager',
        holderFlag: 'Flag State',
        holderSociety: 'Classification Society',
        holderPort: 'Port of registry'
      },
      params: {
        labelLengthOverall: 'length O.A.',
        labelLengthBP: 'length B.P. ',
        labelBreadthMLD: 'Breadth',
        labelDepthMLD: 'Depth',
        labelDwt: 'DWT',
        labelGt: 'Gross Tonnage',
        labelPortOfRegistry: 'Net Tonnage',
        labelNumberOfCargoHold: 'Cargo hold No.',
        labelNumberOfCrane: 'Cargo gear number',
        labelCraneType: 'Cargo gear type',
        labelLoadDraft: 'Scantling draught',
        labelLightDraft: 'Design draught',
        labelFullLoadShipAirDraft: 'F-loaded height',
        labelLightshipAirDraft: 'E-loaded height',
        labelMainEnginePower: 'Main engine power',
        labelMainEngineRPM: 'Main engine RPM',
        labelMainEngineType: 'Main engine type',
        labelDesignSpeed: 'Design speed',
        holderLengthOverall: 'Length O.A.',
        holderLengthBP: 'Length B.P.',
        holderBreadthMLD: 'Breadth',
        holderDepthMLD: 'Depth',
        holderDwt: 'DWT',
        holderGt: 'Gross Tonnage',
        holderPortOfRegistry: 'Net Tonnage',
        holderNumberOfCargoHold: 'Cargo hold No.',
        holderNumberOfCrane: 'Cargo gear number',
        holderCraneType: 'Cargo gear type',
        holderLoadDraft: 'Scanling draught',
        holderLightDraft: 'Design draught',
        holderFullLoadShipAirDraft: 'Full-loaded height',
        holderLightshipAirDraft: 'Empty-loaded height',
        holderMainEnginePower: 'Main engine power',
        holderMainEngineRPM: 'Main engine RPM',
        holderMainEngineType: 'Main engine type',
        holderDesignSpeed: 'Design speed'
      }
    
    }
  },
  society: {
    table: {
      name: 'Name',
      shortName: 'Abbreviation',
      contacts: 'Contacts person',
      phone: 'Phone No.',
      mail: 'Mail Adress',
      remark: 'Remark'
    },
    addSoc: 'Add Classification Society',
    editSoc: 'Edit Classification Society Info'
  },
  carrier: {
    addCarrier: 'Add shipowner',
    editCarrier: 'Edit shipowner',
    table:{
      name: 'Name',
      contacts: 'Contacts person',
      phone: 'Phone No.',
    },
    detail: {
      name: 'Name',
      contacts: 'Contacts person',
      phone: 'Phone No.',
      mail: 'Mail address',
      remark: 'Remark',
      cert: 'Certificates',
      auth: 'Certificate of authorization',
      shipTitle: 'Fleet List'
    }
  },
  shipCert: {
    addCert: 'Add Ship Certificate',
    editCert: 'Edit Ship Certificate',
    table: {
      certName: 'Cert Name',
      shipName: 'Ship Name',
      certId: 'Cert No.',
      flag: 'Flag',
      expireDate: 'Expire Date',
      status: 'Status'
    },
    formSearch:{
      labelName: 'Ship Name',
      labelStatus: 'Certificate Status',
      STATUS_NORMAL:'Normal',
      STATUS_EXPIRATION_CLOSE:'Expire soon',
      STATUS_EXPIRED:'Expired'
    },
    addModal:{
      certName: 'Cert Name',
      shipName: 'Ship Name',
      certCode: 'Cert No.',
      certType: 'Cert Type',
      CERTTYPE_OF_VESSEL: 'Shipping Certificate',
      CERTTYPE_OF_EQUIPMENT: 'Equipment certificate'
    },
    detail: {
      certName: 'Cert Name',
      certCode: 'Cert No.',
      certType: 'Cert Type',
      signOrg: 'Sign Org',
      signDate: 'Sign Date',
      expireDate: 'Expire Date',
      warnDay: 'Warning Day',
      remark: 'Remark'
    }
  },
  dockItem: {
    version: 'System Version',
    item:'Dry dock code',
    detailItem: 'Dry dock code details',
    defaultText: 'Please select the system version first'
  },
  dockDetailItem:{
    table:{
      code: 'Code',
      name: 'Name',
      type: 'Type',
      budget: 'Budget',
      selfSupply: 'Self-Supply'
    }    
  },
  project:{
    STAGE_NOT_STARTED:'Not started',
    STAGE_PLAN:'In the plan',
    STAGE_SPECIFICATION:'Formulate Specification',
    STAGE_QUOTE:'Inquiring',
    STAGE_REPAIR:'Repairing',
    STAGE_CHECK:'Billing',
    STAGE_SUMMARY:'Summary',
    STATUS_DRAFTING:'Draft',
    STATUS_WAITING_FOR_APPROVAL:'For Approving',
    STATUS_APPROVED:'Approved',
    step: {
      overview:'Overview',
      spec:'Specification',
      quote:'Quotation'
    },
    formSearch: {
      number: 'Project No.',
      name:'Project Name',
      stage:'Project Stage',
      status:'Project Status'
    },
    table: {
      code: 'Project No',
      name: 'Project Name',
      stage: 'Project Stage',
      startTime: 'Start Time',
      endTime: 'End Time',
      status: 'Status'
    },
    addProject: {
      title: 'Create a new Project',
      titles: 'Select Project',
      code: 'Project No',
      name: 'Project Name',
      shipName: 'Ship Name',
      shipType: 'Ship Type',
      startTime: 'StartTime',
      endTime: 'EndTime'
    },
    overview: {
      btnSubmit: 'Submit For Approval',
      btnHistory: 'History Record',
      baseInfo: {
        startTime: 'Start Time',
        status: 'Status',
        stage: 'Stage',
        endTime: 'End Time',
        shipName: 'Ship Name',
        shipType: 'Ship Type',
        shipNo: 'Ship ID'
      },
      descInfo: {
        title: 'Repair Description'
      },
      operation:{
        APPROVE: 'Approve',
        REJECT: 'Reject',
        MODIFY: 'Update',
        LOCK: 'Delete',
        SUBMIT: 'Submit',
        REEDIT:'Re-edit'
      },
      flow: {
        START: 'Start',
        title:'Approval process',
        history:{
          title: 'Approval history'
        },
        comment: 'Please enter your comments (optional)',
        state:{
          default: 'Not approved yet',
          doing: 'Under approving',
          reject: 'Reject',
          agree: 'Agree',
          complete: 'Approved'
        }
      }
    }
  },
  specification:{
    common:{
      dockItem:'Docking Item',
      dockDetailItem:'Detail Item'
    },
    table:{
      specId: 'Spec ID',
      shipName: 'Ship Name',
      dockId:'Dock Id',
      createAt:'CreateTime',
      proName: 'Project Name',
      version: 'System Version',
      currency:'currency',
    },
    addModal:{
      title:'Add Specification',
      proName: 'Project Name',
      proCode: 'Project Code',
      shipName: 'Ship Name',
      shipType:'Ship Type',
      currency:'Currency',
      version:'System Verson',
      tipNotNull:'Name and code cannot be empty!'
    },
    overview:{
      base:{
        shipName:'Ship Name',
        shipType:'Ship Type',
        buildTime:'Build Time',
        dockType:'Dock Type',
        startTime:'Start Time',
        endTime:'End Time',
        currency:'Currency',
        version:'System Version'
      },
      addDockItem:{
        title:'Add Docking Item',
        number:'Number',
        code:'Code',
        name:'Name',
        selfRepair:'Self-Repair',
        budget:'Budget',
        radioYes:'Yes',
        radioNo:'No',
        description: 'Description'
      },
      treeChildHeader:{
        code: 'Code',
        name: 'Dock Item',
        budget: 'Budget',
        selfRepair: 'Self-Repair',
        status: 'Status'
      },
      dockItemInfo:{
        desc:'Description',
        matter: 'Notice',
        attachment: 'Attachment',
        worklist: 'Worklist',
        check: 'Check Items'
      },
      addDockDetailItem:{
        TYPE_SERVICE:'SERVICE',
        TYPE_MATERIAL:'MATERIAL',
        TYPE_EQUIPMENT:'SPARE PARTS',
        KP_KEY:'name',
        KP_VALUE:'value',
        tipKPAdd:'Add a Key-Param',
        tipKPDel:'Delete a Key-Param',
        titleAdd: 'Add Docking Detail Item',
        titleEdit: 'Edit Docking Detail Item',
        code:'Code',
        name:'Name',
        type:'Type',
        budget:'Budget',
        supplier:'Supplier',
        selfSupply:'Self-Supply',
        keyParam:'key parameters',
        keyParamName:'param name',
        keyParamValue: 'param value',
        unit:'Unit',
        quantity:'Quantity',
        description:'Description'
      }
    }
  },
  quote:{
    search:{
      number: 'Number',
      project: 'Project',
      billDate: 'Bill Date',
      selectSpec:'Select Specification',
      status: 'Status'
    },
    status:{
      ALL:'All',
      CREATED:'Created',
      OFFERED:'Quoted',
      WAITING:'No approval',
      APPROVED:'Approved',
      REJECTED:'Rejected',
      ACCEPTED:'Dealled'
    },
    table:{
      projectNumber:'Porject Number',
      projectName: 'Project Name',
      shipName:'Ship Name',
      shipyard:'shipyard',
      status:'Status',
      offeredAt:'Quotation time',
      total:'Total Price',
      btnCompare:'Comparison',
      btnReCompare:'Re-Compare',
      btnDeal:'Deal',
      btnReject:'Reject',
      tipNoSelect: 'Please select a quotation first',
      tipNoMatch:'Quotations of different projects cannot be compared together！',
      tipNoPassToDeal: 'Only approved RFQ can a transaction be concluded！',
      tipAccept: 'This inquiry has been completed!！',
      tipIsCompleteToReject: 'The RFQ sheet that has been closed / rejected cannot be operated again！'
    },
    addModal:{
      title:'Add a Quotation',
      titles:'Select Quotation',
      email:'E-mail',
      liaison:'Contact person',
      shipyardName:'Shipyard Name',
      telephone:'Telphone',
      selectLabel:'Select Specification',
      selectTitle:'Specification Info',
      shipyard:'Shipyard Info'
    },
    overview:{
      operation:{
        EXPORTQUOTATION: 'Export quotation',
        EXPORTINQUIRY: 'Export Inquiry sheet',
        IMPORT: 'Import Quotation',
        APPROVE: 'Approve',
        REJECT: 'Reject',
        UPDATE: 'Update',
        LOCK: 'Delete',
        SUBMIT: 'Submit',
        ACCEPT: 'Accept',
        VIEWGUIDEBOOK: 'Specification overview',
        DOWNGUIDEBOOK: 'Export specification',
        COMPUTE_PDF:'Create specification',
        FETCH_PDF:'Export specification',
        TIP_IMPORT_OK: 'Quotation imported successfully',
        TIP_COMPUTE_PDF: 'The specification is undering generated, which may take a few minutes. You will find out the download button on this page later.',
        TIP_ACCEPT:'Are you sure to execute the closing operation？'
      },
      base:{
        titleQuote: 'Quotation Info',
        titleBase: 'Basic Info',
        titleDesc: 'Description',
        vesselName:'Vessel Name',
        dockPlant:'Shipyard',
        vesselType:'Ship Type',
        contact:'contact person',
        vesselNo:'Vessel No',
        email:'Contact',
        status:'Status',
        dockProject:'Dock Reapir Item',
        telephone:'Telephone',
        totalNoExtraDiscount:'Total price',
        extraDiscount:'Discount',
        currency:'Currency',
        FinalTotal:'Amount after discount',
        offeredAt:'Quotation Date',
        expiryDate: 'Quotation expiry Date'
      },
      tree:{
        title:'Repair List',
        number:'Number',
        name:'Name',
        unit:'Unit',
        unitPriceBeforeDiscount:'Unit Price(Before Discount)',
        quantity:'Quantity',
        totalBeforeDiscount:'Total Price(Before Discount)',
        discount:'Discount Rate',
        disAmount:'Discount Amount(After Discount)',
        remark:'Remark'
      }
    },
    contrast:{
      btnOpen:'Open',
      tipRepeat:'Already selected',
      labelOther:'Other',
      base:{
        title:'Docking Information',
        name:'Ship Name',
        type:'Ship Type',
        number:'Ship Number',
        startAt:'Start Time',
        endAt:'End Time',
        desc:'Description'
      },
      yard:{
        title:'Shipyard Name',
        offHire:'Off Hire',
        contact:'Contact',
        email:'E-Mail',
        phone:'Phone',
        enterYard:'Quotation date',
        waste:'Offhire Cost',
        discount:'Overall Discount',
        extraDiscount:'Extra Discount',
        repairCost:'Cost',
        finalCost:'Final Cost',
        btnSelect:'Select Yard'
      }
    }
  },
  settings:{
    flow:{
      table:{
        name:'Flow Name',
        brief:'Brief'
      },
      type:{
        PROJECT_CREATE: 'Project Approval',
        SPECIFICATION_ITEM_COMPLETE: 'Specification Item Approval',
        QUOTATION_ACCEPT:'Quotation Approval',
        SUPER_INTENDENT_MANAGER: 'FLEET_MANAGER',
        SHIP_OWNER: 'SHIP_OWNER',
        SUPER_INTENDENT: 'SUPERINTENDENT',
        CHIEF_OFFICER: 'CHIEF_OFFICER',
        CHIEF_ENGINEER: 'CHIEF_ENGINEER',
        SHIP_OWNER: 'SHIP_OWNER'
      },
      editModal:{
        title2:'Edit Flow Node',
        step:'Step',
        nodeName:'Node Name',
        roleName:'Role',
        title:'Approval Setting',
        modifiable:'Modifiable'
      },
      addModal:{
        title:'Add Flow Node',
        nodeName:'Node Name',
        roleName:'Role Name',
        canEdit:'Can Edit？',
        radioYes:'Yes',
        radioNo:'No',
        btnAdd:'Add Node'
      }
    },
    user: {
      search: {
        keyword: 'Keyword',
        role: 'Role',
        status:'User status',
        MANAGEMENT_COMPANY_ADMIN: 'COMPANY_ADMIN',
        SUPER_INTENDENT:'SUPERINTENDENT',
        SUPER_INTENDENT_MANAGER:'FLEET_MANAGER',
        SHIP_OWNER:'SHIP_OWNER',
        CHIEF_OFFICER:'CHIEF_OFFICER',
        CHIEF_ENGINEER:'CHIEF_ENGINEER'
      },
      table:{
        loginName:'Login Name',
        userName:'User Name',
        mail:'E-Mail',
        phone:'Phone',
        ship:'Ship Yard',
        job:'Job',
        status:'Disable/Enable'
      },
      addModal:{
        title:'Add New User',
        titleEdit:'Edit User Info',
        loginName:'loginName',
        userName:'userName',
        company:'Company',
        job:'Title',
        password:'Password',
        status:'Account Status',
        radioYes:'Enabled',
        radioNo:'Disabled'
      },
      passModal:{
        title:'Change Password',
        oldPass: 'Old Password',
        newPass: 'New Password',
        newPass2: 'Password Confirm',
        errNotEqual: 'The two passwords are different',
        holderOldPass:'Please input old password',
        holderNewPass:'Please input new password',
        holderNewPass2:'Please input old password again'
      }
    },
    company: {
      title:'Company Info',
      comName:'Company Name',
      contact:'Contact',
      phone:'Phone',
      mail:'e-mail',
      fax:'Fax',
      addr:'Addr',
      fullAddr:'Full Addr',
      intr:'Introduction'
    },
    business: {
      title: 'Business terms'
    }
  }
}