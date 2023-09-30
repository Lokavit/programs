import filters from '../filters/filters';
import mixinsMethods from './mixinsMethods';
import mixinsWatch from './mixinsWatch';
export default {
    /** 全局混入 data 部分 */
    data() {
        return {
            /** 用于标识表单页面的表单数据是否初始化过
             * 因提交表单后，需将this.formData重置为初始状态
             * 所以在重置后，手动将该变量设置为false
             * 解决了新增表单后，再次打开新增，还留有上次数据的问题。
             */
            inited: false,
            // formData: {},
        };
    },

    watch: {
        ...mixinsWatch,
    },

    // /** 全局混入 创建完毕钩子 部分 */
    // created() {
    //     console.warn('mixins.js的created,表单数据:', this.formData);
    // },


    /** 全局混入 方法部分 */
    methods: {
        //将mixinsMethods里面的方法用对象展开符混入到mixin上,以方便调用，组件中 this.$xxx方法名
        ...mixinsMethods
    },
    /** 全局混入 过滤器部分 */
    filters: {
        ...filters
    }
}