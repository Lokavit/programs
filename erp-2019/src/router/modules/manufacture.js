/**
 * manufacture 生产模块 路由组
 */
export const manufactureRoutes = {
    path: '/manufacture', // 
    meta: {
        title: '生产',
        icon: 'manufacture',
    },
    children: [{
            path: '', // /manufacture/activitie
            component: () => import('@/views/Manufacture/ListActivitie.vue'),
            name: 'ListActivitie',
            meta: {
                title: '中日程',
                icon: ''
            }
        }, {
            path: '', // /manufacture/activitie-form
            component: () => import('@/views/Manufacture/FormActivitie.vue')
        }, {
            path: '', // /manufacture/workPackage
            component: () => import('@/views/Manufacture/ListWorkPackage.vue'),
            name: 'ListWorkPackage',
            meta: {
                title: '作业包',
                icon: ''
            }
        }, {
            path: '', // /manufacture/workPackage-form
            component: () => import('@/views/Manufacture/FormWorkPackage.vue')
        }, {
            path: '', // /manufacture/workOrder
            component: () => import('@/views/Manufacture/ListWorkOrder.vue'),
            name: 'ListWorkOrder',
            meta: {
                title: '作业指示',
                icon: ''
            }
        }, {
            path: '', // /manufacture/workOrder-form
            component: () => import('@/views/Manufacture/FormWorkOrder.vue')
        }, {
            path: '', // /manufacture/workReport
            component: () => import('@/views/Manufacture/ListWorkReport.vue'),
            name: 'ListWorkReport',
            meta: {
                title: '作业报告',
                icon: ''
            }
        }, {
            path: '', // /manufacture/workReport-form
            component: () => import('@/views/Manufacture/FormWorkReport.vue'),
        },

        {
            path: '',
            component: () => import('@/views/Manufacture/ListSchedule.vue'),
            name: 'ListSchedule',
            meta: {
                title: '项目大日程',
                icon: ''
            }
        }
    ]
}