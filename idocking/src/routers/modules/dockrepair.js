/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:28:19
 * @LastEditTime: 2019-11-20 08:36:59
 */

const DockRepairRouter = {
  path: '/dockrepair',
  component: () => import('@/layout'),
  meta: {
    title: 'menu.dockrepair.index',
    group: true,
    roles: ['SUPER_INTENDENT','SUPER_INTENDENT_MANAGER','SHIP_OWNER','CHIEF_OFFICER','CHIEF_ENGINEER']
  },
  children: [{
      path: 'specification',
      component: () => import('@/views/specification/index.vue'),
      meta: {
        title: "menu.dockrepair.specification",
        icon: "specification",
        alone: true
      },
      children: [
        {
          path: "/",
          component: () => import('@/views/specification/page/index.vue'),
        },
        {
          path: 'overview',
          name: 'spec_overview',
          component: () => import('@/views/specification/overview/index.vue'),
          meta: {
            hidden: true,
            title: 'breadcrumb$' 
          }
        }
      ]
    },
    {
      path: 'quote',
      component: () => import('@/views/quote/index.vue'),
      meta: {
        title: "menu.dockrepair.quote",
        icon: "quote",
        alone: true
      },
      children: [
        {
          path: "/",
          component: () => import('@/views/quote/page/index.vue'),
        },
        {
          path: "overview",
          component: () => import('@/views/quote/overview/index.vue'),
          meta: { title: 'breadcrumb$' }
        },
        {
          path: "contrast",
          component: () => import('@/views/quote/contrast/index.vue'),
          meta: {
            title: "menu.dockrepair.contrast"
          }
        }
      ]
    }
  ]
}

export default DockRepairRouter
