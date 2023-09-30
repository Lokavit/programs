/**
 * demo 测试部分
 */

export const demoRoutes = {
    path: '/demo', // 
    meta: {
        title: '测试',
        icon: 'default',
    },
    children: [{
        path: "", //
        component: () => import("@/views/demo/ListFPJS.vue"),
        name: "ListFPJS",
        meta: {
            title: 'FP JavaScript',
        },
    }, {
        path: '',
        component: () => import('@/views/demo/ListAdaptive.vue'),
        name: 'ListAdaptive',
        meta: {
            title: 'Adaptive'
        }
    }]
}