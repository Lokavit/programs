<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-01 13:41:31
 * @LastEditTime: 2019-12-05 14:24:04
 -->

<template>
  <div class="notices-list">
    <form-search :form-config="formSearchConfig" :column="4" ref="formSearch" @search="search"></form-search>
    <div class="separation-line box-shadow"></div>

    <div class="padding box-shadow">
      <table-view ref="tableView"></table-view>
    </div>
  </div>
</template>

<script>
import FormSearch from '@/components/FormSearch'
import formSearchConfig from './mixins/FormSearch'
import TableView from './components/TableView'

export default {
  mixins: [formSearchConfig],
  components:{ FormSearch, TableView },
  methods: {
    search(params) {
      let newParams = {}

      // 日后需要进行时区转换
      params.createdAfter && (newParams.createdAfter = `${params.createdAfter} 00:00:00`)
      params.createdBefore && (newParams.createdBefore = `${params.createdBefore} 23:59:59`)
      params.keyword && (newParams.keyword = params.keyword)

      if(params.readStatus || params.readStatus === false) {
        newParams.readStatus = params.readStatus
      }
      this.$refs['tableView'].search(newParams)
    },
  }
}
</script>