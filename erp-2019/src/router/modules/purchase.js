/** 
 * purchase 采购模块 路由组
 */
export const purchaseRoutes = {
    path: '/purchase',
    meta: {
        title: '采购',
        // icon: 'purchase',
        icon: 'purchase',
    },
    children: [{
        path: '', // /purchase/order-request
        component: () => import('@/views/Purchase/ListPurchaseOrderRequest.vue'),
        name: 'ListPurchaseOrderRequest',
        meta: {
            title: '采购申请单',
            icon: 'purchase-order-request'
        }
    }, {
        path: '', // /purchase/order-request-form
        component: () => import('@/views/Purchase/FormPurchaseOrderRequest.vue')
    }, {
        path: '', // /purchase/order
        component: () => import('@/views/Purchase/ListPurchaseOrder.vue'),
        name: 'ListPurchaseOrder',
        meta: {
            title: '采购订单',
            icon: 'purchase-order',
        }
    }, {
        path: '', // /purchase/order-form
        component: () => import('@/views/Purchase/FormPurchaseOrder.vue'),
    }, {
        path: '', // /purchase/delivery
        component: () => import('@/views/Purchase/ListPurchaseDelivery.vue'),
        name: 'ListPurchaseDelivery',
        meta: {
            title: '采购收货单',
            icon: 'purchase-delivery',
        }
    }, {
        path: '', // /purchase/delivery-form
        component: () => import('@/views/Purchase/FormPurchaseOrder.vue'),
        // }, {
        //     path: '', // /purchase/return
        //     component: () => import('@/views/Purchase/ListPurchaseReturn.vue'),
        //     name: 'ListPurchaseReturn',
        //     meta: {
        //         title: '采购退货单',
        //         icon: 'purchase-return',
        //     }
        // }, {
        //     path: '', // /purchase/return-form
        //     component: () => import('@/views/Purchase/FormPurchaseReturn.vue'),
    }]
}