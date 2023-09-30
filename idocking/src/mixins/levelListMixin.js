/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-01 13:41:31
 * @LastEditTime: 2019-11-18 18:54:39
 */
export default {
  created() {
    /**
     * 询价预览    quote/overview
     * 规格书预览  specification/overview
     * 项目预览    project/overview
     *
     * 末级路由，需添加meta及title属性，为了便于识别，个人写成 meta: { title: 'breadcrumb$' }
     * 后续的代码才能通过$set给$route.matched里某字段重新赋值(read only)
     * 
     */

    let index = this.$route.matched.length - 1
    this.$set(this.$route.matched[index].meta, 'title', this.$route.query.name)
  }
}