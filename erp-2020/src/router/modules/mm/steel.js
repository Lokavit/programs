/** steel 钢材管理路由组 */

export const STEEL_ROUTES = {
    path: 'steel',
    /** 钢材主数据概览页面 */
    component: () => import('@/views/MM/Index.vue'),
    meta: {
        title: '钢材管理',
        icon: 'steel',
    },
    children: [
        /** 钢材 MP 物资供应计划 列表 */
        {
            path: 'steelmp-list',
            component: () => import('@/views/MM/Steel/SteelMP/ListSteelMP.vue'),
            name: 'ListSteelMP',
            meta: {
                title: '物资供应计划',
                keepAlive: true, // 缓存，为了缓存查询区域过滤条件
            }
        },
        /** 钢材 MP 物资供应计划 表单 */
        {
            path: 'steelmp-form/:code',
            component: () => import('@/views/MM/Steel/SteelMP/FormSteelMP.vue'),
            name: 'FormSteelMP',
            meta: {
                keepAlive: true, // 缓存表单的数据
            }
        },
        /** 钢材 BOM 列表 */
        {
            path: 'steelbom-list',
            component: () => import('@/views/MM/Steel/SteelBOM/ListSteelBOM.vue'),
            name: 'ListSteelBOM',
            meta: {
                title: '钢材BOM',
                keepAlive: true, // 缓存，为了缓存查询区域过滤条件
            }
        },
        /** 钢材 BOM 表单 */
        {
            path: 'steelbom-form/:code',
            component: () => import('@/views/MM/Steel/SteelBOM/FormSteelBOM.vue'),
            name: 'FormSteelBOM',
            meta: {
                keepAlive: true, // 缓存表单的数据
            }
        },

        /** 钢材 POR 列表 */
        {
            path: 'steelpor-list',
            component: () => import('@/views/MM/Steel/SteelPOR/ListSteelPOR.vue'),
            name: 'ListSteelPOR',
            meta: {
                title: '钢材POR',
                keepAlive: true, // 缓存，为了缓存查询区域过滤条件
            }
        },
        /** 钢材 POR 表单 */
        {
            path: 'steelpor-form/:code',
            component: () => import('@/views/MM/Steel/SteelPOR/FormSteelPOR.vue'),
            name: 'FormSteelPOR',
            meta: {
                keepAlive: true, // 缓存表单的数据
            }
        },
        /** 钢材PO 列表 */
    ]
}