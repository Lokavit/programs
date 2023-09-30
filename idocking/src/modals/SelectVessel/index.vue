<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-21 18:35:08
 * @LastEditTime: 2019-11-19 13:15:06
 -->
<template>
  <id-dialog
    width="55%"
    ref="_idialog"
    :footer="false"
    :box-padding="false"
    :box-shadow="false"
    :value="value"
    :title="$t('modal.vessel.title')"
    @close="_closeDialog"
  >
    <div class="vessel-select-warpper" v-loading="matterLoading">
      <div class="table-warpper"> 
        <el-table
          :header-row-style="{color:'#2e2f2f', height:'30px'}"
          :header-cell-style="{padding:'3px 0',  borderBottom:'2px solid rgba(44, 62, 80,.3)'}"
          :cell-style="{padding:'3px 0',color:'#2e2f2f',cursor: 'pointer'}"
          :data="vesselPageList"
          @row-click="rowClick"
          style="width: 100%"
        >
          <el-table-column
            :show-overflow-tooltip="true"
            label="#"
            type="index"
            align="left"
            width="50">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            prop="name"
            align="left"
            :label="$t('modal.vessel.name')">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="type.name"
            :label="$t('modal.vessel.type')">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="shipIdentificationNumber"
            :label="$t('modal.vessel.shipId')"
            width="260">
          </el-table-column>
        </el-table>
      </div>
      <pagination :pagination="pagination" :page="params.page+1"  @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
    </div>
  </id-dialog>
</template>
<script>
import { getVesselPageList } from '@/api/baseInfo'
import IdDialog from '@/components/IdDialog'
import Pagination from '@/components/Pagination'
import PaginationMixin from '@/mixins/PaginationMixin'
export default {
  name: 'VesselSelect',
  mixins: [ PaginationMixin ],
  components: {
    Pagination,
    IdDialog
  },
  props: {
    value: Boolean
  },
  data() {
    return{
      matterLoading: false,
      vesselPageList: [], // 船舶信息列表数据
      params: {
        companyId: null,
        nameContaining: null,
        page: 0,
        size: 10,
        typeId: null,
        validity: true
      }
    }
  },
  methods: {
    _closeDialog(){
      this.$emit('input',false)
    },
    getTableData() {
      this.matterLoading = true;
      getVesselPageList(this.params).then(res => {
        this.$set(this.pagination, 'total', res.data.totalElements);
        this.vesselPageList = res.data.content;
        this.matterLoading = false;
      })
    },
    rowClick(row, column, event) {
      this.$emit('selectIt', row, column, event)
      this.$nextTick(() => {
        this._closeDialog()
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>

