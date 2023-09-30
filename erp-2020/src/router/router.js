import Vue from "vue";
import VueRouter from "vue-router";
import {
  routes
} from './routes';

Vue.use(VueRouter);

/** Navigating to current location ("/demo") is not allowed
 * 重写路由的push方法--->这个是vue-cli4.x以上的坑，不然的话，你是跳转不了的
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => {
    // if (error.name != "NavigationDuplicated") {
    //   throw error;
    // }
  })
}

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes,
});
// /** 路由前置首位 */
// router.beforeEach((to, form, next) => {
//   if (to.meta.requireAuth === undefined) {
//     // 判断store是否有token，若有则 next(),否则next({path:'/login'})
//   }
// })


// router.beforeEach((to, from, next) => {
//   if (to.matched.length === 0) { //如果未匹配到路由
//     from.path ? next({
//       path: from.path
//     }) : next('/'); //如果上级也未匹配到路由则跳转主页面，如果上级能匹配到则转上级路由
//   } else {
//     next(); //如果匹配到正确跳转
//   }
// });

export default router;