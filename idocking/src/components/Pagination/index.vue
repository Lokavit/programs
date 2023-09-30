<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-10 19:17:26
 * @LastEditTime: 2020-03-09 13:30:40
 -->
<template>
  <div class="pagination" :class="className">
    <span v-if="$i18n.locale == 'zh'" class="recording">共  <span class="recording-inner">{{ pagination.total }}</span>  条记录</span>
    <span v-if="$i18n.locale == 'en'" class="recording">Total:  <span class="recording-inner">{{ pagination.total }}</span></span>
    <div class="page-warpper">
      <el-pagination
        :page-sizes="pagination.pageSizes"
        :current-page="currentPage"
        :page-size="pagination.size"
        :layout="layout"
        :total="pagination.total"
        background
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Pagination', // 全局的分页组件
  props: {
    pagination: {
      type: Object,
      default: () => {
        return {
          total: 0,
          pageSizes: [10, 20, 50, 100],
          size: 10
        }
      }
    },
    layout: {
      type: String,
      default: () => {
        return 'prev, pager, next, jumper'
      }
    },
    pageSize: {
      type: String | Number,
      default: () => {
        return 10
      }
    },
    className: {
      type: String,
      default: ''
    },
    page: {
      type: String | Number,
      default: () => {
        return 1
      }
    }
  },
  computed: {
    currentPage() {
      return this.page
    }
  },
  methods: {
    sizeChange(size) { // 页码改变触发
      this.$emit('sizeChange', size)
    },
    currentChange(count) { // 每页条数改变触发
      this.$emit('currentChange', count)
    }
  }
}
</script>

<style lang="scss">
.pagination{
  padding: 22px 0 7px 0 ;
  position: relative;
  .page-warpper{
    min-width: 130px;
    max-width: 685px;
    overflow: hidden;
    position:absolute;
    right: 0;
    top:20px;
    background: rgb(255,255,255);
    float: right;
  }
  .recording {
    font-size: 12px;
    line-height: 30px;
    color: #999999;
    &-inner{
      font-weight: bold;
    }
  }
}
.el-pager{
  li.hover{
    color:#FFF!important;
  }
}
</style>
