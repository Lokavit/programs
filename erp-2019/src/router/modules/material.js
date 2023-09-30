/**
 * Material 库存模块 路由组
 */

export const materialRoutes = {
  path: '/material',
  // component: () => import('@/layout/Index.vue'),
  // redirect: '/material',
  meta: {
    title: '库存管理',
    icon: 'material',
  },
  children: [{
    path: '', // /material/goods-receipt
    component: () => import('@/views/Material/ListGoodsReceipt'),
    name: 'ListGoodsReceipt',
    meta: {
      title: '库存收货单',
      icon: 'goods-receipt'
    }
  }, {
    path: '', // /material/good-receipt-form
    component: () => import('@/views/Material/FormGoodsReceipt'),
    // name: 'FormGoodsReceipt',
  }, {
    path: '', // /material/goods-issue
    component: () => import('@/views/Material/ListGoodsIssue'),
    name: 'ListGoodsIssue',
    meta: {
      title: '库存发货单',
      icon: 'goods-issue'
    }
  }, {
    path: '', // /material/goods-issue-form
    component: () => import('@/views/Material/FormGoodsIssue'),
    // name: 'FormGoodsIssue',
  }, {
    path: '', // /material/goods-transfer
    component: () => import('@/views/Material/ListGoodsTransfer'),
    name: 'ListGoodsTransfer',
    meta: {
      title: '库存转储单',
      icon: 'goodsTransfer',
    }
  }, {
    path: '', // /material/goods-transfer-form
    component: () => import('@/views/Material/FormGoodsTransfer'),
    // name: 'FormGoodsTransfer',
  }, {
    path: '', // /material/goods-journals
    component: () => import('@/views/Material/ListGoodsReportJournal'),
    name: 'ListGoodsReportJournal',
    meta: {
      title: '库存过账清单',
      icon: 'goods-report-journal',
    }
  }, {
    path: '', // /material/goods-report-batch
    component: () => import('@/views/Material/ListGoodsReportBatch'),
    name: 'ListGoodsReportBatch',
    meta: {
      title: '批次过账清单',
      icon: 'goods-report-batch',
    }
  }]
}