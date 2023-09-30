/** 资材管理 Material management */

/** 物料主数据 路由组 */
import {
    MATERIAL_ROUTES
} from './material';
/** 钢材管理 路由组 */
import {
    STEEL_ROUTES
} from './steel';

export const MM_ROUTES = {
    path: '/mm',
    component: () => import('@/views/MM/Index.vue'),
    meta: {
        title: '资材管理',
        icon: 'mm',
    },
    children: [{
            path: '', // 默认去概览页面
            component: () => import('@/views/MM/MMOV.vue'),
            name: 'MMOV',
        },
        /** 物料主数据 路由组 */
        MATERIAL_ROUTES,
        /** 钢材管理 路由组 */
        STEEL_ROUTES,
    ]
}