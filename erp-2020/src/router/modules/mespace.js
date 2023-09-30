/** MeSpace 个人中心 */

export const mespaceRoutes = {
    path: '/mespace',
    component: () => import('@/views/MeSpace/Index.vue'),
    children: [{
        path: 'setting',
        component: () => import('@/views/MeSpace/Setting.vue'),
        name: 'Setting',
        meta: {
            title: '偏好设置',
            icon: 'setting'
        }
    }]
}