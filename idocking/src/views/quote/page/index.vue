<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-13 10:04:49
 * @LastEditTime: 2020-03-09 10:56:31
 -->
<template>
  <div class="quote">
    <form-search :form-config="formSearchConfig" :column="4" ref="formSearch" @search="search"></form-search>
    <div class="separation-line box-shadow"></div>

    <div class="padding box-shadow">
      <table-view ref="tableView"></table-view>
    </div>

    <select-spec v-model="selectSpecVisible" @selectIt="handleSelectSpec"></select-spec>
    
  </div>
</template>

<script>
import FormSearch from '@/components/FormSearch'
import FormSearchConfig from './mixins/FormSearch'
import TableView from './components/TableView'
import SelectSpec from '@/modals/SelectSpec'

export default {
  components: { FormSearch, TableView, SelectSpec },
  mixins: [FormSearchConfig],
  data() {
    return {
      selectSpecVisible: false,
      specificationId: null
    }
  },
  methods: {
    search(params) {
      // 此搜索与以往不同，用户未填写的参数，置空也是不可以的，要删掉它。
      let newParams = {}

      params.dockingProject && (newParams.specificationId = this.specificationId)
      params.createdAfter && (newParams.createdAfter = `${params.createdAfter} 00:00:00`)
      params.createdBefore && (newParams.createdBefore = `${params.createdBefore} 23:59:59`)
      params.status && (newParams.status = params.status)
      this.$refs['tableView'].search(newParams)
    },
    handleSelectSpec(data) {
      this.$refs['formSearch'].formModel['dockingProject'] = data.dockingProject
      this.specificationId = data.id
    }
  }
}
</script>