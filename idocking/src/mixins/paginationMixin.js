/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-10 19:15:34
 * @LastEditTime: 2019-12-12 15:00:38
 */
export default {
  data () {
    return{
      params: {
        size: 10,
        page: 0,
      },
      pagination: { // 分页器的数据
        total: 0,
        page: 1,                        // 当前页码
        pageSizes: [10, 20, 50, 100],   // 每页显示多少条选择框
        size: 10                        // 每页显示多少条
      }
    }
  },
  methods: {
    sizeChange(size) { // 每页条数改变触发
      this.$set(this.params, 'size', size)
      this.getTableData()
    },

    currentChange(page) { // 页码改变触发
      this.$set(this.params, 'page', page-1)
      this.getTableData()
    }
  },
  mounted() {
    this.getTableData()
  }
}