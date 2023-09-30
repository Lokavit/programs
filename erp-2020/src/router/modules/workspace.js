/** WorkSpace 工作台 */

export const workspaceRoutes = {
    path: '/workspace',
    // component: () => import('@/layout/Index.vue'),
    // children: [{
    //     path: '/workspace',
    component: () => import('@/views/WorkSpace/WorkSpace.vue'),
    name: 'WorkSpace',
    meta: {
        keepAlive: false
    }
    // }]
}