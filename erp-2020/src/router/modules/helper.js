/** 帮助中心 相关路由表 */

export const helperRoutes = {
    path: '/helper',
    component: () => import('@/views/Helper/Index.vue'),
    children: [{
        path: 'manual',
        component: () => import('@/views/Helper/Manual.vue'),
        name: 'Manual',
    }]
}