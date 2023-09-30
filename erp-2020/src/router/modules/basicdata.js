/** 基本信息 */
/** 基础数据 路由组 */
export const BASICDATA_ROUTES = {
    path: '/basicdata',
    component: () => import('@/views/BasicData/Index.vue'),
    // name: 'ListMaterial',
    meta: {
        title: '基础数据',
        icon: 'basic-data',
    },
    children: [{
            path: '', // 默认去概览页面
            component: () => import('@/views/BasicData//BasicDataOV.vue'),
            name: 'BasicDataOV',
        },

        /** 物料组 */
        {
            path: 'material_group-list',
            component: () => import('@/views/BasicData/MaterialGroup/ListMaterialGroup'),
            name: 'ListMaterialGroup',
            meta: {
                title: '物料组',
                keepAlive: true,
            }
        }, {
            path: 'material_group-form/:code',
            component: () => import('@/views/BasicData/MaterialGroup/FormMaterialGroup'),
            name: 'FormMaterialGroup',
            meta: {
                keepAlive: true,
            }
        },

        /** 仓库 */
        {
            path: 'warehouse-list',
            component: () => import('@/views/BasicData/Warehouse/ListWarehouse'),
            name: 'ListWarehouse',
            meta: {
                title: '仓库',
                keepAlive: true,
            }
        }, {
            path: 'warehouse-form/:code',
            component: () => import('@/views/BasicData/Warehouse/FormWarehouse'),
            name: 'FormWarehouse',
            meta: {
                keepAlive: true,
            }
        },

        /** 计量单位 */
        {
            path: 'uom-list',
            component: () => import('@/views/BasicData/UnitOfMeasure/ListUnitOfMeasure'),
            name: 'ListUnitOfMeasure',
            meta: {
                title: '计量单位',
                keepAlive: true,
            }
        }, {
            path: 'uom-form/:code',
            component: () => import('@/views/BasicData/UnitOfMeasure/FormUnitOfMeasure.vue'),
            name: 'FormUnitOfMeasure',
            meta: {
                keepAlive: true,
            }
        },

        /** 材质代码 */
        {
            path: 'material_qualitie-list',
            component: () => import('@/views/BasicData/MaterialQualitie/ListMaterialQualitie'),
            name: 'ListMaterialQualitie',
            meta: {
                title: '材质代码',
                keepAlive: true,
            }
        }, {
            path: 'material_qualitie-form/:code',
            component: () => import('@/views/BasicData/MaterialQualitie/FormMaterialQualitie'),
            name: 'FormMaterialQualitie',
            meta: {
                keepAlive: true,
            }
        },

        /** 供应商 */
        {
            path: 'supplier-list',
            component: () => import('@/views/BasicData/Supplier/ListSupplier'),
            name: 'ListSupplier',
            meta: {
                title: '供应商',
                keepAlive: true,
            }
        },
        {
            path: 'supplier-form/:code',
            component: () => import('@/views/BasicData/Supplier/FormSupplier'),
            name: 'FormSupplier',
            meta: {
                keepAlive: true,
            }
        }
    ]
}