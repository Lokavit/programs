/**
 * HumanResource 人力资源模块 路由组
 */
export const hrRoutes = {
    path: '/hr',
    meta: {
        title: '人力资源',
        icon: 'hr',
    },
    children: [{
            path: '/hr',
            component: () => import('@/views/HR/HRSpace.vue'),
        },
        {
            path: '/hr/employees',
            component: () => import('@/views/HR/ListEmployees.vue'),
            name: 'ListEmployees',
            meta: {
                title: '员工主数据',
                // icon: 'employees',
            }
        }, {
            path: '/hr/employees/form',
            component: () => import('@/views/HR/FormEmployees.vue'),
        }
    ]
}