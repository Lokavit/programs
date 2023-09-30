<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 13:02:07
 * @LastEditTime: 2019-11-08 15:12:22
 -->
 
<template>
  <div class="specification">
    <form-search :form-config="formSearchConfig" :column="4" ref="formSearch" @search="search"></form-search>
    <div class="separation-line box-shadow"></div>

    <div class="padding box-shadow">
      <div class="table-toolbar">
        <div class="right">
          <id-button icon="plus" class="align-right" text="common.add" @click="addSpecVisible = true"></id-button>
        </div>
      </div>  

      <table-view ref="tableView"></table-view>
    </div>

    <!-- 选择船舶modal -->
    <select-vessel v-model="selectVesselVisible" @selectIt="selectVessel"></select-vessel>

    <!-- 添加规格书modal -->
    <id-dialog v-model="addSpecVisible" width="55%" :title="$t('specification.addModal.title')">
      <add-project-modal v-if="addSpecVisible" @reload="getTableData"></add-project-modal>
    </id-dialog> 
  </div>
</template>

<script>
import IdButton from '@/components/IdButton'
import FormSearch from "@/components/FormSearch"
import FormSearchConfig from './mixins/FormSearch'
import SelectVessel from '@/modals/SelectVessel'
import TableView from './components/TableView'
import AddProjectModal from './modals/AddSpecModal'

export default {
  components: {
    IdButton,
    FormSearch,
    TableView,
    SelectVessel,
    AddProjectModal
  },
  mixins: [ FormSearchConfig ],
  data() {
    return {
      selectVesselVisible: false,
      addSpecVisible:false
    }
  },
  methods: {
    search(params) {
      params.vesselName && delete params.vesselName
      this.$refs['tableView'].search(params)
    },

    selectVessel(row){
      let { name, id } = row

      this.$refs['formSearch'].formModel.vesselName = name
      this.$refs['formSearch'].formModel.vesselIds = id
    },

    getTableData() {
      // 1、先重置表单搜索条件
      this.$refs['formSearch'].reset()

      // 2、获取搜索条件formModel, 这里是只包含对应key的空值对象，用于初始化搜索
      let params = this.$refs['formSearch'].formModel
      this.$refs['tableView'].search(params)
    }
  }
}
</script>
