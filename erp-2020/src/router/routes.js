/** routes 路由组文件 */

import {
    demoRoutes
} from './modules/demo';

/** 工作台 路由组 */
import {
    workspaceRoutes
} from './modules/workspace';

/** 个人中心 路由组 */
import {
    mespaceRoutes
} from './modules/mespace';
/** 资材管理 路由组 */
import {
    MM_ROUTES
} from './modules/mm/mm';
/** 基础数据 路由组 */
import {
    BASICDATA_ROUTES
} from './modules/basicdata';

/** 帮助中心 */
import {
    helperRoutes
} from './modules/helper';


// import {
//     baseinfoRoutes
// } from './modules/baseinfo'; // 基本信息模块路由组

// import {
//     purchaseRoutes
// } from './modules/purchase'; // 采购模块路由组
// import {
//     manufactureRoutes
// } from './modules/manufacture'; // 生产模块路由组
// import {
//     hrRoutes
// } from './modules/hr'; // 人力资源模块路由组



export const routes = [
    /** 登入页面 路由 */
    {
        path: '/login',
        component: () => import('@/layout/Login.vue'),
        name: 'Login',
        meta: {
            requireAuth: false, // 无需权限验证
        }
    },
    /** 根路由 Index.vue */
    {
        path: '/',
        component: () => import('@/layout/Index.vue'),
        redirect: '/workspace', // 重定向在工作台
        children: [
            workspaceRoutes, // 工作台 路由组
            mespaceRoutes, // 个人中心 路由组
            /** 子系统 资材管理 路由组 */
            MM_ROUTES,
            /** 子系统 基础数据 路由组 */
            BASICDATA_ROUTES,



            // steelRoutes, // 钢材管理 路由组


            demoRoutes, // 测试路由组
            helperRoutes, // 帮助中心路由组
            // /** ====== 旧版路由 ========== */
            // baseinfoRoutes, // 基本信息路由组
            // manufactureRoutes, // 生产模块路由组
            // // purchaseRoutes, // 采购模块路由组
            // hrRoutes, // 人力资源模块路由组
        ]
    },
    /** 其它非法页面 */
    {
        path: '/404',
        component: () => import('@/layout/NotFound.vue')
    }, ,
    {
        path: "*",
        hidden: true,
        redirect: {
            path: "/404"
        }
    }
]