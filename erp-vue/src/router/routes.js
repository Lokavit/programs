/**
 * routes 路由组文件
 */

import {
    demoRoutes
} from './modules/demo';
import {
    baseinfoRoutes
} from './modules/baseinfo'; // 基本信息模块路由组
import {
    materialRoutes
} from './modules/material'; // 库存模块路由组
import {
    purchaseRoutes
} from './modules/purchase'; // 采购模块路由组
import {
    manufactureRoutes
} from './modules/manufacture'; // 生产模块路由组
import {
    hrRoutes
} from './modules/hr'; // 人力资源模块路由组



export const routes = [{
    path: '/',
    component: () => import('@/App.vue'),
    children: [
        baseinfoRoutes, // 基本信息路由组
        materialRoutes, // 库存模块路由组
        manufactureRoutes, // 生产模块路由组
        purchaseRoutes, // 采购模块路由组
        hrRoutes, // 人力资源模块路由组
        // demoRoutes, // 测试路由组
    ]
}]