<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 12:54:59
 * @LastEditTime: 2019-11-04 13:36:43
 -->
<template>
  <div class="project">
    <form-search :form-config="formSearchConfig" :column="4" labelWidth="100px" ref="formSearch" @search="search"></form-search>
    <div class="separation-line box-shadow"></div>
    
    <div class="padding box-shadow">
      <div class="table-toolbar">
        <div class="right">
          <id-button icon="plus" class="align-right" text="common.add" @click="addProjectVisible = true"></id-button>
        </div>
      </div>  

      <table-view ref="tableView"></table-view>
    </div>

    <id-dialog v-model="addProjectVisible" width="55%" :title="$t('project.addProject.title')">
      <add-project-modal v-if="addProjectVisible" @reload="getTableData"></add-project-modal>
    </id-dialog> 
  </div>
</template>

<script>
import IdButton from '@/components/IdButton'
import FormSearch from "@/components/FormSearch"
import FormSearchConfig from './mixins/FormSearch'
import TableView from './components/TableView'
import AddProjectModal from './modals/AddProjectModal'

export default {
  components: {
    IdButton,
    FormSearch,
    TableView,
    AddProjectModal
  },
  mixins: [ FormSearchConfig ],
  data() {
    return {
      addProjectVisible: false
    }
  },
  methods: {
    search(params) {
      this.$refs['tableView'].search(params)
    },
    getTableData() {
      // 1、先重置表单搜索条件
      this.$refs['formSearch'].reset()

      // 2、获取搜索条件formModel, 这里是只包含对应key的空值对象，用于初始化搜索
      let params = this.$refs['formSearch'].formModel
      this.$refs['tableView'].search(params)
    }
  },
}
</script>
