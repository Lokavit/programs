import filters from '../filters/filters';
export default {
    /** 全局混入 data 部分 */
    data() {
        return {};
    },
    /** 全局混入 方法部分 */
    methods: {
        //将globalMethods里面的方法用对象展开符混入到mixin上,以方便调用，直接this.$xxx方法名就可以了
    },
    /** 全局混入 过滤器部分 */
    filters: {
        ...filters
    }
}