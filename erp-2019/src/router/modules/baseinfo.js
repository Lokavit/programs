/** 基本信息 */

export const baseinfoRoutes = {
    path: '/baseinfo',
    meta: {
        title: '基本信息',
        icon: 'base-info',
    },
    children: [{
        path: '', // /material/material
        component: () => import('@/views/Material/ListMaterial'),
        name: 'ListMaterial',
        meta: {
            title: '物料主数据',
            icon: 'material',
        }
    }, {
        path: '', // /material/material-form
        component: () => import('@/views/Material/FormMaterial'),
        // name: 'FormMaterial',
    }, {
        path: '', // /material/material-group
        component: () => import('@/views/Material/ListMaterialGroup'),
        name: 'ListMaterialGroup',
        meta: {
            title: '物料组',
            icon: 'material-group',
        }
    }, {
        path: '', // /material/material-group-form
        component: () => import('@/views/Material/FormMaterialGroup'),
        // name: 'FormMaterialGroup',
    }, {
        path: '', // /material/warehouse
        component: () => import('@/views/Material/ListWarehouse'),
        name: 'ListWarehouse',
        meta: {
            title: '仓库',
            icon: 'warehouse'
        }
    }, {
        path: '', // /material/warehouse-form
        component: () => import('@/views/Material/FormWarehouse'),
        // name: 'FormWarehouse',
    }, {
        path: '', // /material/uom
        component: () => import('@/views/Material/ListUnitOfMeasure'),
        name: 'ListUnitOfMeasure',
        meta: {
            title: '计量单位',
            icon: 'uom'
        }
    }, {
        path: '', // /material/uom-form
        component: () => import('@/views/Material/FormUom.vue'),
        // name: 'FormUom',
    }, {
        path: '', // /material/materialbatch
        component: () => import('@/views/Material/ListMaterialBatch'),
        name: 'ListMaterialBatch',
        meta: {
            title: '物料批次',
            icon: 'material-batch'
        }
    }, {
        path: '', // /material/materialbatch-form
        component: () => import('@/views/Material/FormMaterialBatch.vue'),
        // name: 'FormMaterialBatch',
    }, {
        path: '', // /purchase/vendor
        component: () => import('@/views/Purchase/ListVendor.vue'),
        name: 'ListVendor',
        meta: {
            title: '供应商',
            icon: 'vendor',
        }
    }, {
        path: '', // /purchase/vendor-form
        component: () => import('@/views/Purchase/FormVendor.vue')
    }, {
        path: '', // /manufacture/system
        component: () => import('@/views/Manufacture/ListManufactureSystem.vue'),
        name: 'ListManufactureSystem',
        meta: {
            title: '数据字典',
            icon: '',
        }
    }, {
        path: '', // /manufacture/project
        component: () => import('@/views/Manufacture/ListProject.vue'),
        name: 'ListProject',
        meta: {
            title: '项目登记',
            icon: ''
        }
    }, {
        path: '', // /manufacture/project-form
        component: () => import('@/views/Manufacture/FormProject.vue')
    }, {
        path: '', // /manufacture/block
        component: () => import('@/views/Manufacture/ListBlock.vue'),
        name: 'ListBlock',
        meta: {
            title: '分段登记',
            icon: ''
        }
    }, {
        path: '', // /manufacture/block-form
        component: () => import('@/views/Manufacture/FormBlock.vue')
    }, {
        path: '', // /manufacture/zone
        component: () => import('@/views/Manufacture/ListZone.vue'),
        name: 'ListZone',
        meta: {
            title: '区域登记',
            icon: ''
        }
    }, {
        path: '', // /manufacture/zone-form
        component: () => import('@/views/Manufacture/FormZone.vue')
    }, {
        path: '', // /manufacture/wbs
        component: () => import('@/views/Manufacture/ListWbsElement.vue'),
        name: 'ListWbsElement',
        meta: {
            title: '作业分割体系',
            icon: '',
        }
    }, {
        path: '', // /manufacture/workteam
        component: () => import('@/views/Manufacture/ListWorkteam.vue'),
        name: 'ListWorkteam',
        meta: {
            title: '职/班',
            icon: ''
        }
    }, {
        path: '', // /manufacture/workteam-form
        component: () => import('@/views/Manufacture/FormWorkteam.vue'),
    }, ]
}