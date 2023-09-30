<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 17:01:07
 * @LastEditTime: 2019-12-13 11:10:33
 -->
<template>
  <div class="shipinfo">
    <form-search :form-config="formSearchConfig" :column="4" @search="search"></form-search>
    <div class="separation-line box-shadow"></div>

    <!-- table-view -->
    <table-view ref="tableView" @editShip="handleEditShip" @addShip="handleAddShip"></table-view>

    <!-- 船舶详情弹框 -->
    <id-dialog v-model="shipInfoVisible" width="1200px" center :boxPadding="false" :footer="false">
      <ship-info-modal v-if="shipInfoVisible" :vesselId="vesselId" @reload="tableReload"></ship-info-modal>

      <template v-slot:title>
        <div class="shipinfo-modal-header">
          <div class="modal-title">
            <svg-icon name="background-boat" width="20" height="20"></svg-icon>
            {{ $t('shipInfo.detailModal.title') }}
          </div>
          <id-button text="shipInfo.detailModal.btnAssign" icon="s-custom" @click="staffAllotVisible=true"  class="btn-personAssign"></id-button>
        </div>
      </template>
    </id-dialog> 
    
    <!-- 添加船舶 -->
    <id-dialog v-model="addShipVisible" width="55%" :title="$t('shipInfo.detailModal.title')">
      <add-ship-modal v-if="addShipVisible" @reload="tableReload"></add-ship-modal>
    </id-dialog> 

    <!-- 船员分配 -->
    <id-dialog v-model="staffAllotVisible" width="30%" :title="$t('allotModal.title')" :footer=false>
      <staff-allot-modal v-if="staffAllotVisible" :vesselId="vesselId"></staff-allot-modal>
    </id-dialog> 

  </div>
</template>
<script>
import TableView from './components/TableView'
import IdDialog from '@/components/IdDialog'
import FormSearch from "@/components/FormSearch"
import FormSearchConfig from './mixins/FormSearch'
import AddShipModal from './modal/AddShipModal'
import ShipInfoModal from './modal/ShipInfoModal'
import StaffAllotModal from '@/modals/StaffAllot'
import IdButton from '@/components/IdButton'

export default {
  name: 'shipInfo',
  mixins: [FormSearchConfig ],
  components: {
    IdDialog,
    IdButton,
    TableView,
    FormSearch,
    AddShipModal,
    ShipInfoModal,
    StaffAllotModal
  },
  data() {
    return {
      vesselId: 0,               // 船舶id
      rowClickData: {},          // 编辑某行数据
      addShipVisible: false,     // 添加船舶
      shipInfoVisible: false,    // 编辑船舶
      staffAllotVisible: false,  // 分船  
    }
  },
  methods: {
    search(cond) {
      this.$refs['tableView'].search(cond)
    },

    tableReload() {
      this.$refs['tableView'].getTableData()
    },

    handleAddShip() {
      this.addShipVisible = true
    },

    handleEditShip(id) {
      this.vesselId = id;
      this.shipInfoVisible = true
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';

.btn-table-ops{
  display: inline-block;
  width: 22px;
  text-align: center;
  cursor: pointer;
  i{
    color: $main-bg;
  }
  &:hover{
    background-color: rgba(0,0,0,0.2);
    border-radius: 4px;
  }
}  
.shipinfo-modal-header{
  display: flex;
  justify-content: space-between;
  .btn-addFlowNode{
    padding-right: 30px;
  }
  .btn-personAssign{
    position: relative;
    right: 30px;
  }
}
</style>