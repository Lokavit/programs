<template>
  <el-pagination v-if="isShowPagination" ref="kftPagination" :page-size="pageSize" :layout="layout" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
</template>

<script>
export default {
  name: "KftPagination",
  props: {
    pageSize: { type: Number, default: 10 },
    total: { type: Number, default: 0 },
    layout: { type: String, default: "total, prev, pager, next" },
    fetchData: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    /** 计算控制分页组件是否显示 */
    isShowPagination() {
      // 如果 总条数>每页显示条数，则显示分页组件，否则不予显示
      return this.total > this.pageSize ? true : false;
    }
  },
  methods: {
    handleCurrentChange(current) {
      this.fetchData(current, this.pageSize);
    },
    handleSizeChange(size) {
      this.fetchData(this.$refs.kftPagination.currentPage, size);
    }
  }
};
</script>
