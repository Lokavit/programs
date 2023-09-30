/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:26:16
 * @LastEditTime: 2019-12-06 09:33:49
 */

const ManagementRouter = {
  path: '/management',
  component: () => import('@/layout'),
  group: true,
  meta: {
    title: "menu.management.index",
    group: true
  },
  children: [{
      path: "project",
      component: () => import('@/views/project/index.vue'),
      meta: {
        title: "menu.management.project",
        icon: "report",
        alone: true,
        roles: ['SUPER_INTENDENT','SUPER_INTENDENT_MANAGER','SHIP_OWNER','CHIEF_OFFICER','CHIEF_ENGINEER']
      },
      children: [{
          path: "/",
          component: () => import('@/views/project/page/index.vue'),
        },
        {
          path: "overview",
          component: () => import('@/views/project/overview/index.vue'),
          children: [{
            path: "/",
            name: 'project_overview',
            meta: { title: 'breadcrumb$' },
            component: () => import('@/views/project/overview/page/index.vue')
          }]
        }
      ]
    },
    {
      path: "information",
      component: () => import('@/views/information/index.vue'),
      meta: {
        title: "menu.management.information",
        icon: "template",
        subMenu: true,
        roles: ['SUPER_INTENDENT','SUPER_INTENDENT_MANAGER','SHIP_OWNER','CHIEF_OFFICER','CHIEF_ENGINEER']
      },
      children: [{
          path: "/",
          component: () => import('@/views/information/index.vue'),
          meta: {
            hidden: true
          }
        },
        {
          path: "shipInfo",
          component: () => import('@/views/information/shipinfo/index.vue'),
          meta: {
            title: "menu.management.shipInfo"
          },
        },
        {
          path: "carrier",
          component: () => import('@/views/information/carrier/index.vue'),
          meta: {
            title: "menu.management.carrier"
          },
        },
        {
          path: "society",
          component: () => import('@/views/information/society/index.vue'),
          meta: {
            title: "menu.management.society"
          },
        },
        {
          path: "cert",
          component: () => import('@/views/information/cert/index.vue'),
          meta: {
            title: "menu.management.cert",
          },
        },
        {
          path: "dockItem",
          component: () => import('@/views/information/dockitem/index.vue'),
          meta: {
            title: "menu.management.dockItem",
          }
        }
      ]
    },
    {
      path: "setting",
      component: () => import('@/views/settings/index.vue'),
      meta: {
        title: "menu.management.settings",
        icon: "report",
        roles: ['MANAGEMENT_COMPANY_ADMIN']
      },
      children: [{
          path: "/",
          component: () => import('@/views/settings/index.vue'),
          meta: {
            hidden: true,
            roles: ['MANAGEMENT_COMPANY_ADMIN']
          }
        },
        {
          path: "company",
          component: () => import('@/views/settings/company/index.vue'),
          meta: {
            title: "menu.management.company",
            roles: ['MANAGEMENT_COMPANY_ADMIN']
          }
        },
        {
          path: "users",
          component: () => import('@/views/settings/users/index.vue'),
          meta: {
            title: "menu.management.users",
            roles: ['MANAGEMENT_COMPANY_ADMIN']
          }
        },
        {
          path: "flow",
          component: () => import('@/views/settings/flow/index.vue'),
          meta: {
            title: "menu.management.flow",
            roles: ['MANAGEMENT_COMPANY_ADMIN']
          }
        }
        ,
        {
          path: "business",
          component: () => import('@/views/settings/business/index.vue'),
          meta: {
            title: "menu.management.business",
            roles: ['MANAGEMENT_COMPANY_ADMIN']
          }
        }
      ]
    }
  ]
}

export default ManagementRouter;
