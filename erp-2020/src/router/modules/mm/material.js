/**
 * Material 物料主数据 路由组
 */

export const MATERIAL_ROUTES = {
  path: 'material',
  component: () => import('@/views/MM/Index.vue'),
  // redirect: '/material',
  meta: {
    title: '物料管理',
    icon: 'material',
  },
  children: [
    /** 钢材主数据 列表页 */
    {
      path: 'steel-list',
      component: () => import('@/views/MM/Material/Steel/ListSteel'),
      name: 'ListSteel',
      meta: {
        title: '钢材主数据',
        keepAlive: true,
      }
    },
    /** 钢材主数据 表单页 */
    {
      path: 'steel-form/:code',
      component: () => import('@/views/MM/Material/Steel/FormSteel'),
      name: 'FormSteel',
      meta: {
        keepAlive: true,
      }
    },
  ]
}