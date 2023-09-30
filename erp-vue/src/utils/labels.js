/**
 * 暂行版 标注的解决方案。
 */

export const labels = {
    /** 库存模块 物料主数据 */
    Material: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            keyword: {
                default: "搜索关键词",
                custom: "",
                value: "搜索关键词"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            itemCode: {
                default: "物料编码",
                custom: "",
                value: "物料编码"
            },
            itemDescription: {
                default: "物料名称",
                custom: "",
                value: "物料名称"
            },
            foreignDescription: {
                default: "外文名称",
                custom: "",
                value: "外文名称"
            },
            itemGroupCode: {
                default: "物料组编码",
                custom: "",
                value: "物料组编码"
            },
            itemGroupName: {
                default: "物料组名称",
                custom: "",
                value: "物料组名称"
            },
            managementType: {
                default: "物料管理方式",
                custom: "",
                value: "物料管理方式"
            },
            defaultWhsCode: {
                default: "仓库编码",
                custom: "",
                value: "仓库编码"
            },
            defaultWhsName: {
                default: "仓库名称",
                custom: "",
                value: "仓库名称"
            },
            preferredVendorCode: {
                default: "供应商编码",
                custom: "",
                value: "供应商编码"
            },
            preferredVendorName: {
                default: "供应商名称",
                custom: "",
                value: "供应商名称"
            },
            inventoryUomCode: {
                default: "计量单位编码",
                custom: "",
                value: "计量单位编码"
            },
            inventoryUomName: {
                default: "计量单位名称",
                custom: "",
                value: "计量单位名称"
            },
            stockThreshold: {
                default: "库存容量",
                custom: "",
                value: "库存容量"
            },
            maxLevel: {
                default: "最大库存",
                custom: "",
                value: "最大库存"
            },
            minLevel: {
                default: "最小库存",
                custom: "",
                value: "最小库存"
            },
            validityDate: {
                default: "开始有效日期",
                custom: "",
                value: "开始有效日期"
            },
            expiryDate: {
                default: "结束有效日期",
                custom: "",
                value: "结束有效日期"
            },
            enabled: {
                default: "是否可用",
                custom: "",
                value: "是否可用"
            },
            remarks: {
                default: "备注",
                custom: "",
                value: "备注"
            },
            intervalLevel: {
                default: "库存阈值",
                custom: "",
                value: "库存阈值"
            }
        }
    },

    /** 库存模块 MaterialGroup 物料组 */
    MaterialGroup: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            keyword: {
                default: "搜索关键词",
                custom: "",
                value: "搜索关键词"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            itemGroupCode: {
                default: "物料组编码",
                custom: "",
                value: "物料组编码"
            },
            itemGroupName: {
                default: "物料组名称",
                custom: "",
                value: "物料组名称"
            }
        }
    },

    /** 库存模块 Warehouse 仓库 */
    Warehouse: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            keyword: {
                default: "搜索关键词",
                custom: "",
                value: "搜索关键词"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            whsCode: {
                default: "仓库编码",
                custom: "",
                value: "仓库编码"
            },
            whsName: {
                default: "仓库名称",
                custom: "",
                value: "仓库名称"
            },
        }
    },

    /** 库存模块 UOM 计量单位 */
    UOM: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            keyword: {
                default: "搜索关键词",
                custom: "",
                value: "搜索关键词"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            uomCode: {
                default: "计量单位编码",
                custom: "",
                value: "计量单位编码"
            },
            uomName: {
                default: "计量单位名称",
                custom: "",
                value: "计量单位名称"
            },
            height: {
                default: "高度",
                custom: "",
                value: "高度"
            },
            length: {
                default: "长度",
                custom: "",
                value: "长度"
            },
            width: {
                default: "宽度",
                custom: "",
                value: "宽度"
            },
            volumn: {
                default: "体积",
                custom: "",
                value: "体积"
            },
            volumnUnit: {
                default: "体积单位",
                custom: "",
                value: "体积单位"
            },
            weight: {
                default: "重量",
                custom: "",
                value: "重量"
            }
        }
    },

    /** 库存模块 BatchNum 批次 */
    MaterialBatch: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            keyword: {
                default: "搜索关键词",
                custom: "",
                value: "搜索关键词"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            batchNumber: {
                default: "批次号",
                custom: "",
                value: "批次号"
            },
            inDate: {
                default: "准入日期",
                custom: "",
                value: "准入日期"
            },
            manufactureDate: {
                default: "制造日期",
                custom: "",
                value: "制造日期"
            },
            expiryDate: {
                default: "过期日期",
                custom: "",
                value: "过期日期"
            },
            itemCode: {
                default: "物料编码",
                custom: "",
                value: "物料编码"
            },
            itemDescription: {
                default: "物料描述",
                custom: "",
                value: "物料描述"
            },
            remarks: {
                default: "备注",
                custom: "",
                value: "备注"
            },
        }
    },

    /** 库存模块 Document 单据 [收发转] */
    Document: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            docEntry: {
                default: "单据编号",
                custom: "",
                value: "单据编号"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            docEntry: {
                default: "单据编号",
                custom: "",
                value: "单据编号"
            },
            docDate: {
                default: "单据日期",
                custom: "",
                value: "单据日期"
            },
            remarks: {
                default: "备注",
                custom: "",
                value: "备注"
            },
        }
    },

    /** 库存模块 批次过帐清单 */
    GoodsReportBatch: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            itemCode: {
                default: "物料编码",
                custom: "",
                value: "物料编码"
            },
            whsCode: {
                default: "仓库编码",
                custom: "",
                value: "仓库编码"
            },
            batchNumber: {
                default: "批次编码",
                custom: "",
                value: "批次编码"
            },
            baseType: {
                default: "单据类型",
                custom: "",
                value: "单据类型"
            }
        },
    },

    /** 库存模块 库存过帐清单 */
    GoodsReportJournal: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            itemCode: {
                default: "物料编码",
                custom: "",
                value: "物料编码"
            },
            itemGroupCode: {
                default: "物料组编码",
                custom: "",
                value: "物料组编码"
            },
            whsCode: {
                default: "仓库编码",
                custom: "",
                value: "仓库编码"
            },
            baseType: {
                default: "单据类型",
                custom: "",
                value: "单据类型"
            }
        },
    },


    /** 采购模块 供应商 */
    Vendor: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            keyword: {
                default: "搜索关键词",
                custom: "",
                value: "搜索关键词"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            code: {
                default: "供应商编码",
                custom: "",
                value: "供应商编码"
            },
            name: {
                default: "供应商名称",
                custom: "",
                value: "供应商名称"
            },
            foreignName: {
                default: "外文名称",
                custom: "",
                value: "外文名称"
            },
            remarks: {
                default: "备注",
                custom: "",
                value: "备注"
            }
        }
    },

    /** 采购模块 采购申请单 */
    PurchaseOrderRequest: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            keyword: {
                default: "搜索关键词",
                custom: "",
                value: "搜索关键词"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            docEntry: {
                default: "单据编号",
                custom: "",
                value: "单据编号"
            },
            docDate: {
                default: "单据日期",
                custom: "",
                value: "单据日期"
            },
            docDueDate: {
                default: "有效日期",
                custom: "",
                value: "有效日期"
            },
            requiredDate: {
                default: "必需日期",
                custom: "",
                value: "必需日期"
            },
            status: {
                default: "状态",
                custom: "",
                value: "状态"
            },
            remarks: {
                default: "备注",
                custom: "",
                value: "备注"
            },
        }
    },

    /** 采购模块 采购订单 */
    PurchaseOrder: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            keyword: {
                default: "搜索关键词",
                custom: "",
                value: "搜索关键词"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            docEntry: {
                default: "单据编号",
                custom: "",
                value: "单据编号"
            },
            docDate: {
                default: "单据日期",
                custom: "",
                value: "单据日期"
            },
            docDueDate: {
                default: "到期日",
                custom: "",
                value: "到期日"
            },
            deliveryDate: {
                default: "交货日期",
                custom: "",
                value: "交货日期"
            },
            vendorCode: {
                default: "供应商编码",
                custom: "",
                value: "供应商编码"
            },
            vendorName: {
                default: "供应商名称",
                custom: "",
                value: "供应商名称"
            },
            purchaserCode: {
                default: "采购员编码",
                custom: "",
                value: "采购员编码"
            },
            purchaserName: {
                default: "采购员姓名",
                custom: "",
                value: "采购员姓名"
            },
            status: {
                default: "状态",
                custom: "",
                value: "状态"
            },
            remarks: {
                default: "备注",
                custom: "",
                value: "备注"
            },
        }
    },

    /** 采购模块 采购收货单 */
    PurchaseDelivery: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            keyword: {
                default: "搜索关键词",
                custom: "",
                value: "搜索关键词"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            docEntry: {
                default: "单据编号",
                custom: "",
                value: "单据编号"
            },
            docDate: {
                default: "单据日期",
                custom: "",
                value: "单据日期"
            },
            docDueDate: {
                default: "到期日",
                custom: "",
                value: "到期日"
            },
            vendorCode: {
                default: "供应商编码",
                custom: "",
                value: "供应商编码"
            },
            vendorName: {
                default: "供应商名称",
                custom: "",
                value: "供应商名称"
            },
            purchaserCode: {
                default: "采购员编码",
                custom: "",
                value: "采购员编码"
            },
            purchaserName: {
                default: "采购员姓名",
                custom: "",
                value: "采购员姓名"
            },
            status: {
                default: "状态",
                custom: "",
                value: "状态"
            },
            remarks: {
                default: "备注",
                custom: "",
                value: "备注"
            },
        }
    },

    /** 采购模块 采购退货单 */
    PurchaseReturn: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            keyword: {
                default: "搜索关键词",
                custom: "",
                value: "搜索关键词"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            docEntry: {
                default: "单据编号",
                custom: "",
                value: "单据编号"
            },
            docDate: {
                default: "单据日期",
                custom: "",
                value: "单据日期"
            },
            docDueDate: {
                default: "到期日",
                custom: "",
                value: "到期日"
            },
            vendorCode: {
                default: "供应商编码",
                custom: "",
                value: "供应商编码"
            },
            vendorName: {
                default: "供应商名称",
                custom: "",
                value: "供应商名称"
            },
            purchaserCode: {
                default: "采购员编码",
                custom: "",
                value: "采购员编码"
            },
            purchaserName: {
                default: "采购员姓名",
                custom: "",
                value: "采购员姓名"
            },
            remarks: {
                default: "备注",
                custom: "",
                value: "备注"
            },
        }
    },

    /** 数据字典 */
    ManufactureSystem: {
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            code: {
                default: "编号",
                custom: "",
                value: "编号"
            },
            name: {
                default: "名称",
                custom: "",
                value: "名称"
            },
            parentEntry: {
                default: "上级编码",
                custom: "",
                value: "上级编码"
            },
            sort: {
                default: "顺序",
                custom: "",
                value: "顺序"
            },
            description: {
                default: "备注",
                custom: "",
                value: "备注"
            },
        }
    },

    /** 生产模块 项目登记 */
    Project: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            keyword: {
                default: "搜索关键词",
                custom: "",
                value: "搜索关键词"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            entry: {
                default: "项目编号",
                custom: "",
                value: "项目编号"
            },
            name: {
                default: "项目名称",
                custom: "",
                value: "项目名称"
            },
            projectType: {
                default: "项目类型",
                custom: "",
                value: "项目类型"
            },
            shipType: {
                default: "船型",
                custom: "",
                value: "船型"
            },
            shipKind: {
                default: "船种",
                custom: "",
                value: "船种"
            },
            shipOwner: {
                default: "船主",
                custom: "",
                value: "船主"
            },
            breadthMLD: {
                default: "型宽",
                custom: "",
                value: "型宽"
            },
            cargoHoldCapacity: {
                default: "货舱容积",
                custom: "",
                value: "货舱容积"
            },
            classification: {
                default: "船级",
                custom: "",
                value: "船级"
            },
            complement: {
                default: "船员定额",
                custom: "",
                value: "船员定额"
            },
            contractDate: {
                default: "合同日期",
                custom: "",
                value: "合同日期"
            },
            deadWeight: {
                default: "载重量",
                custom: "",
                value: "载重量"
            },
            depthMLD: {
                default: "型深",
                custom: "",
                value: "型深"
            },
            designDraught: {
                default: "设计吃水",
                custom: "",
                value: "设计吃水"
            },
            endurance: {
                default: "续航力",
                custom: "",
                value: "续航力"
            },
            lengthBP: {
                default: "垂线间长",
                custom: "",
                value: "垂线间长"
            },
            lengthOA: {
                default: "总长",
                custom: "",
                value: "总长"
            },
            mainEngine: {
                default: "主机",
                custom: "",
                value: "主机"
            },
            referenceEntry: {
                default: "同类型项目",
                custom: "",
                value: "同类型项目"
            },
            scantlingDraught: {
                default: "结构吃水",
                custom: "",
                value: "结构吃水"
            },
            serviceSpeed: {
                default: "服务航速",
                custom: "",
                value: "服务航速"
            },
        }
    },

    /** 生产模块 分段主数据 */
    Block: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            projectEntry: {
                default: "项目编码",
                custom: "",
                value: "项目编码"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            entry: {
                default: "编码",
                custom: "",
                value: "编码"
            },
            name: {
                default: "名称",
                custom: "",
                value: "名称"
            },
            projectEntry: {
                default: "项目编码",
                custom: "",
                value: "项目编码"
            },
            parentEntry: {
                default: "上级编码",
                custom: "",
                value: "上级编码"
            },
            length: {
                default: "长度",
                custom: "",
                value: "长度"
            },
            width: {
                default: "宽度",
                custom: "",
                value: "宽度"
            },
            height: {
                default: "高度",
                custom: "",
                value: "高度"
            },
            weight: {
                default: "净重",
                custom: "",
                value: "净重"
            },
            assemblyIndicator: {
                default: "组装",
                custom: "",
                value: "组装"
            },
            cuttingIndicator: {
                default: "切割",
                custom: "",
                value: "切割"
            },
            erectionIndicator: {
                default: "搭载",
                custom: "",
                value: "搭载"
            },
            steelPOIndicator: {
                default: "钢材采购",
                custom: "",
                value: "钢材采购"
            },
        }
    },

    /** 生产模块 区域主数据 */
    Zone: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            projectEntry: {
                default: "项目编码",
                custom: "",
                value: "项目编码"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            entry: {
                default: "编号",
                custom: "",
                value: "编号"
            },
            name: {
                default: "名称",
                custom: "",
                value: "名称"
            },
            kind: {
                default: "类型", // zone/system
                custom: "",
                value: "类型"
            },
            projectEntry: {
                default: "项目编号",
                custom: "",
                value: "项目编号"
            },
            parentEntry: {
                default: "上级编码",
                custom: "",
                value: "上级编码"
            },
            length: {
                default: "长度",
                custom: "",
                value: "长度"
            },
            width: {
                default: "宽度",
                custom: "",
                value: "宽度"
            },
            height: {
                default: "高度",
                custom: "",
                value: "高度"
            },
            weight: {
                default: "净重",
                custom: "",
                value: "净重"
            },
            assemblyIndicator: {
                default: "组装",
                custom: "",
                value: "组装"
            },
            cuttingIndicator: {
                default: "切割",
                custom: "",
                value: "切割"
            },
            erectionIndicator: {
                default: "搭载",
                custom: "",
                value: "搭载"
            },
            steelPOIndicator: {
                default: "钢材采购",
                custom: "",
                value: "钢材采购"
            },
        }
    },

    /** 生产模块 中日程 */
    Activitie: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            projectEntry: {
                default: "项目编码",
                custom: "",
                value: "项目编码"
            },
            entry: {
                default: "编码",
                custom: "",
                value: "编码"
            },
            workObject: {
                default: "作业对象",
                custom: "",
                value: "作业对象"
            },
            workArea: {
                default: "作业类型",
                custom: "",
                value: "作业类型"
            },
            workStage: {
                default: "作业阶段",
                custom: "",
                value: "作业阶段"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            entry: {
                default: "编号",
                custom: "",
                value: "编号"
            },
            projectEntry: {
                default: "项目编号",
                custom: "",
                value: "项目编号"
            },
            projectName: {
                default: "项目名称",
                custom: "",
                value: "项目名称"
            },
            workSection: {
                default: "作业科",
                custom: "",
                value: "作业科"
            },
            description: {
                default: "标准作业单位描述",
                custom: "",
                value: "标准作业单位描述"
            },
            calendarPeriod: {
                default: "预定日历工期",
                custom: "",
                value: "预定日历工期"
            },
            plannedStartDate: {
                default: "预定开始日期",
                custom: "",
                value: "预定开始日期"
            },
            plannedFinishDate: {
                default: "预定结束日期",
                custom: "",
                value: "预定结束日期"
            },
            plannedProductVolume: {
                default: "预定物量",
                custom: "",
                value: "预定物量"
            },
            productVolumeUnit: {
                default: "物量单位",
                custom: "",
                value: "物量单位"
            },
            workObject: {
                default: "作业对象",
                custom: "",
                value: "作业对象"
            },
            workArea: {
                default: "作业类型",
                custom: "",
                value: "作业类型"
            },
            workStage: {
                default: "作业阶段",
                custom: "",
                value: "作业阶段"
            },
            skill: {
                default: "详细工种",
                custom: "",
                value: "详细工种"
            },
            state: {
                default: "状态",
                custom: "",
                value: "状态"
            },

        }
    },

    /** 生产模块 作业包 */
    WorkPackage: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            projectEntry: {
                default: "项目编码",
                custom: "",
                value: "项目编码"
            },
            activityEntry: {
                default: "中日程",
                custom: "",
                value: "中日程"
            },
            entry: {
                default: "编码",
                custom: "",
                value: "编码"
            },
            workObject: {
                default: "作业对象",
                custom: "",
                value: "作业对象"
            },
            workArea: {
                default: "作业类型",
                custom: "",
                value: "作业类型"
            },
            workStage: {
                default: "作业阶段",
                custom: "",
                value: "作业阶段"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            entry: {
                default: "编号",
                custom: "",
                value: "编号"
            },
            name: {
                default: "名称",
                custom: "",
                value: "名称"
            },
            activityEntry: {
                default: "中日程",
                custom: "",
                value: "中日程"
            },
            projectEntry: {
                default: "项目编号",
                custom: "",
                value: "项目编号"
            },
            projectName: {
                default: "项目名称",
                custom: "",
                value: "项目名称"
            },
            requiredDate: {
                default: "所需日期",
                custom: "",
                value: "所需日期"
            },
            designSection: {
                default: "设计科",
                custom: "",
                value: "设计科"
            },
            workObject: {
                default: "作业对象",
                custom: "",
                value: "作业对象"
            },
            workArea: {
                default: "作业类型",
                custom: "",
                value: "作业类型"
            },
            workStage: {
                default: "作业阶段",
                custom: "",
                value: "作业阶段"
            },
            skill: {
                default: "详细工种",
                custom: "",
                value: "详细工种"
            },
            workMethod: {
                default: "直营/外包",
                custom: "",
                value: "直营/外包"
            },
            workType: {
                default: "制作/安装",
                custom: "",
                value: "制作/安装"
            },
            state: {
                default: "状态",
                custom: "",
                value: "状态"
            }
        }
    },

    /** 生产模块 作业指示 */
    WorkOrder: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            projectEntry: {
                default: "项目编码",
                custom: "",
                value: "项目编码"
            },
            activityEntry: {
                default: "中日程",
                custom: "",
                value: "中日程"
            },
            entry: {
                default: "编码",
                custom: "",
                value: "编码"
            },
            workObject: {
                default: "作业类型",
                custom: "",
                value: "作业类型"
            },
            workArea: {
                default: "作业对象",
                custom: "",
                value: "作业对象"
            },
            workStage: {
                default: "作业阶段",
                custom: "",
                value: "作业阶段"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            entry: {
                default: "编号",
                custom: "",
                value: "编号"
            },
            projectEntry: {
                default: "项目编号",
                custom: "",
                value: "项目编号"
            },
            projectName: {
                default: "项目名称",
                custom: "",
                value: "项目名称"
            },
            activityEntry: {
                default: "中日程",
                custom: "",
                value: "中日程"
            },
            workObject: {
                default: "作业对象",
                custom: "",
                value: "作业对象"
            },
            workArea: {
                default: "作业类型",
                custom: "",
                value: "作业类型"
            },
            workStage: {
                default: "作业阶段",
                custom: "",
                value: "作业阶段"
            },
            skill: {
                default: "详细工种",
                custom: "",
                value: "详细工种"
            },
            plannedProductVolume: {
                default: "预定物量",
                custom: "",
                value: "预定物量"
            },
            plannedStartDate: {
                default: "预定开始日期",
                custom: "",
                value: "预定开始日期"
            },
            plannedFinishDate: {
                default: "预定结束日期",
                custom: "",
                value: "预定结束日期"
            },
            plannedManHour: {
                default: "目标直接工时",
                custom: "",
                value: "目标直接工时"
            },
            putInManHour: {
                default: "已投入工时",
                custom: "",
                value: "已投入工时"
            },

            workCode: {
                default: "作业指示编码",
                custom: "",
                value: "作业指示编码"
            },
            workName: {
                default: "作业指示名称",
                custom: "",
                value: "作业指示名称"
            },

        }
    },

    WbsElement: {
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            entry: {
                default: "ID",
                custom: "",
                value: "ID"
            },
            code: {
                default: "编号",
                custom: "",
                value: "编号"
            },
            name: {
                default: "名称",
                custom: "",
                value: "名称"
            },
            parentEntry: {
                default: "上级编码",
                custom: "",
                value: "上级编码"
            },
            sort: {
                default: "顺序",
                custom: "",
                value: "顺序"
            },
            description: {
                default: "备注",
                custom: "",
                value: "备注"
            },
        }
    },

    /** 生产模块 职班主数据 */
    Workteam: {
        /** 列表窗体 查询区域所需label */
        listLbales: {
            keyword: {
                default: "搜索关键词",
                custom: "",
                value: "搜索关键词"
            }
        },
        /** 表单窗体 主表输入项所需label */
        formLabels: {
            entry: {
                default: "代码",
                custom: "",
                value: "代码"
            },
            name: {
                default: "名称",
                custom: "",
                value: "名称"
            },
            type: {
                default: "类型",
                custom: "",
                value: "类型"
            },
            workArea: {
                default: "作业类型",
                custom: "",
                value: "作业类型"
            },
            membership: {
                default: "总人数",
                custom: "",
                value: "总人数"
            },
            effectiveMembership: {
                default: "操作人数",
                custom: "",
                value: "操作人数"
            },
            effectivePeriod: {
                default: "作业时长",
                custom: "",
                value: "作业时长"
            },
        }
    },


    /** 员工主数据 */
    Employee: {
        listLbales: {
            keyword: {
                default: "关键词",
                custom: "",
                value: "关键词"
            }
        },
        formLabels: {
            city: {
                default: "城市",
                custom: "",
                value: "城市"
            },
            code: {
                default: "编码",
                custom: "",
                value: "编码"
            },
            country: {
                default: "国家",
                custom: "",
                value: "国家"
            },
            detail: {
                default: "详情",
                custom: "",
                value: "详情"
            },
            email: {
                default: "邮箱",
                custom: "",
                value: "邮箱"
            },
            enabled: {
                default: "启用",
                custom: "",
                value: "启用"
            },
            expiryDate: {
                default: "到期日",
                custom: "",
                value: "到期日"
            },
            fullName: {
                default: "姓名",
                custom: "",
                value: "姓名"
            },
            gender: {
                default: "性别",
                custom: "",
                value: "性别"
            },
            postalCode: {
                default: "邮政编码",
                custom: "",
                value: "邮政编码"
            },
            primaryTelephone: {
                default: "主要电话",
                custom: "",
                value: "主要电话"
            },
            secondaryTelephone: {
                default: "辅助电话",
                custom: "",
                value: "辅助电话"
            },
            stateProvince: {
                default: "州省",
                custom: "",
                value: "州省"
            },
            street: {
                default: "街",
                custom: "",
                value: "街"
            },
            validityDate: {
                default: "有效期",
                custom: "",
                value: "有效期"
            },
        }
    }
}