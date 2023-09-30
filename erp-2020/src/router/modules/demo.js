/**
 * demo 测试部分
 */

export const demoRoutes = {
    path: "/demo",
    /** 空白区域，只有 <router-view></router-view> */
    component: () => import('@/views/demo/Index.vue'),
    meta: {
        title: '测试',
        icon: 'default',
    },
    children: [{
            path: "", // 作为空白页实际需要渲染的内容，此处path为空
            component: () => import("@/views/demo/ChildOne.vue"),
            name: "ChildOne", // 不写meta信息，继承上级meta
        }, {
            path: "two", //
            component: () => import("@/views/demo/ChildTwo.vue"),
            name: "ChildTwo",
            meta: {
                title: "Two"
            }
        },
        {
            path: "three",
            component: () => import("@/views/demo/ChildThree.vue"),
            name: "ChildThree",
            meta: {
                title: "Three"
            }
        }
    ]
}