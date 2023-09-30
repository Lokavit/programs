<template>
  <div>
    <div class="padding box-shadow">      
      <div class="table-toolbar">
        <div class="right">
          <id-button icon="plus" class="align-right" text="common.add" @click="handleAddShip"></id-button>
        </div>
      </div>  

      <div class="table-warpper">
        <el-table
          v-loading="tableLoading"
          :header-cell-style="{
            padding:'8px 0',
            color:'rgba(0,0,0,.7)',
            fontWeight:'900',
            borderBottom:'2px solid rgba(44, 62, 80,.3)'
          }"
          :cell-style="{padding:'8px 0',color:'#2e2f2f'}"
          :data="vesselPageList"
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
            align="left"
            width="280px"
            :label="$t('shipInfo.table.name')"
          >
            <template slot-scope="scope">
              <a class="cursor" @click.prevent="handleEditShip(scope.row.id)">
                {{scope.row.name}}
              </a>
            </template>
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="type.name"
            width="150px"
            :label="$t('shipInfo.table.type')">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="shipIdentificationNumber"
            :label="$t('shipInfo.table.shipid')"
            width="260px">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="shipOwner.name"
            :label="$t('shipInfo.table.owner')">
          </el-table-column>

          <el-table-column
            :show-overflow-tooltip="true"
            align="left"
            prop="endAt"
            fixed="right"
            width="120px"
            :label="$t('shipInfo.table.ops')"
          >
            <template slot-scope="{ row }">
              <!--
              <div class="btn-table-ops" @click.prevent="handleRowClick(row.id)">
                <i class="el-icon-edit" ></i>
              </div>
              -->
              <div class="btn-table-ops" @click.prevent="handleRowDel(row.id)">
                <i class="el-icon-remove" ></i>
              </div>
            </template>
          </el-table-column>

        </el-table>
      </div>

      <pagination
        :pagination="pagination"
        :page="params.page+1"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      ></pagination>
    </div>

  </div>
</template>

<script>
import IdButton from '@/components/IdButton'
import Pagination from "@/components/Pagination"
import PaginationMixin from '@/mixins/PaginationMixin'
import { getVesselPageList, shipInfoDelete } from '@/api/baseInfo'

export default {
  components: { Pagination, IdButton },
  mixins: [ PaginationMixin ],
  data() {
    return {
      tableLoading: false,
      vesselPageList: [],    // 船舶信息列表数据
      params: {              // 传给后台
        companyId: null,
        nameContaining: null,
        shipOwnerId: null,
        page: 0,
        size: 10,
        typeId: null,
        validity: true,
      }
    }
  },
  methods: {
    search(cond) {
      this.params.page = 0;
      this.$set(this.params, 'nameContaining', cond.nameContaining || null)
      this.$set(this.params, 'typeId',cond.typeId? cond.typeId.id : null)
      this.$set(this.params, 'shipOwnerId',cond.shipOwnerId? cond.shipOwnerId.id : null)
      this.getTableData()
    },

    handleEditShip(vesselId) {
      this.$emit('editShip', vesselId)
    },

    handleAddShip() {
      this.$emit('addShip')
    },

    handleRowDel(vesselId) {
      this.$confirm(
        this.$t('common.delText'),  
        this.$t('msgboxLang.title'),
        {
          confirmButtonText: this.$t('msgboxLang.ok'),
          cancelButtonText: this.$t('msgboxLang.cancel'),
          type: 'warning'
        }
      ).then(async () => {
        shipInfoDelete(vesselId).then(res => {
          this.$message({showClose: true,message: this.$t('common.delOk'),type: 'success'});
          this.getTableData()
        })
      })
    },

    getTableData() {
      this.tableLoading = true;
      getVesselPageList(this.params).then(res => {
        this.$set(this.pagination, 'total', res.data.totalElements);
        this.vesselPageList = res.data.content;
        this.tableLoading = false;
      })
    }
  }
}
</script>