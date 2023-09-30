/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 09:04:05
 * @LastEditTime: 2019-12-16 12:46:24
 */

const DashBoardRouter = {
  path: "/dashboard",
  component: () => import('@/layout'),
  meta: {
    title:'menu.dashboard.index',
    alone: true,
    // roles: ['SUPER_INTENDENT','SUPER_INTENDENT_MANAGER','SHIP_OWNER','CHIEF_OFFICER','CHIEF_ENGINEER']
  },
  children: [{
      path: "/",
      component: () => import('@/views/dashboard/page/index.vue'),
      meta: {
        roles: ['SUPER_INTENDENT','SUPER_INTENDENT_MANAGER','SHIP_OWNER','CHIEF_OFFICER','CHIEF_ENGINEER']
      }
    },
    {
      path: "notices",
      component: () => import('@/views/dashboard/notices/index.vue'),
      meta: {
        title:'menu.dashboard.notice',
        roles: ['SUPER_INTENDENT','SUPER_INTENDENT_MANAGER','SHIP_OWNER','CHIEF_OFFICER','CHIEF_ENGINEER']
      }
    }
  ]
}

export default DashBoardRouter
