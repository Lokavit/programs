// import Vue from 'vue';
// import {Table} from 'element-ui';
// import KftPagination from '@/components/kingfisher/pagination/KftPagination';

// export default {
//     name: "kft-table",
//     mixins: [Table],
//     props: {
//         showPagination: {type: Boolean, default: false},
//         total: {type: Number},
//         pageLayout: {type: String, default: 'total, prev, pager, next, jumper, slot'},
//         pageSize: {type: Number, default: 20},
//         pageSizes: {type: Array, default: () => [20, 50, 100]},
//         hideOnSinglePage: {type: Boolean, default: true},
//         fetchData: {
//             type: Function, default: () => {
//             }
//         }
//     },
//     data() {
//         return {
//             pagination: null,
//         }
//     },
//     watch: {
//         data: function () {
//             if (this.showPagination) {
//                 this.pagination.total = this.total;
//             }
//         }
//     },
//     mounted() {
//         if (this.showPagination) {
//             this.mountPagination();
//         }
//     },
//     methods: {
//         mountPagination() {
//             const container = document.createElement('div');
//             const parent = this.$el.parentNode;
//             if (parent.lastChild === this.$el) {
//                 parent.appendChild(container);
//             } else {
//                 parent.insertBefore(container, this.$el.nextSibling);
//             }
//             const Pager = Vue.extend(KftPagination);
//             this.pagination = new Pager({
//                 components: {KftPagination},
//                 propsData: {
//                     pageSize: this.pageSize,
//                     pageSizes: this.pageSizes,
//                     layout: this.pageLayout,
//                     small: this.size === 'mini',
//                     total: this.total,
//                     hideOnSinglePage: this.hideOnSinglePage,
//                     fetchData: this.fetchData,
//                 }
//             });
//             this.pagination.$mount(container);
//         }
//     }
// }
