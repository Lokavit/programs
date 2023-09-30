<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-24 13:21:50
 * @LastEditTime: 2019-12-11 09:59:28
 -->
<template>
  <div class="table-view settings-user-table">
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
        :data="userList"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          :show-overflow-tooltip="true"
          label="#"
          type="index"
          align="left"
          width="60">
        </el-table-column>

        <!-- 登录名 -->
        <el-table-column
          align="left"
          :show-overflow-tooltip="true"
          :label="$t('settings.user.table.loginName')"
          prop="name">
          <template slot-scope="{ row }">
            <a class="cursor" @click.prevent="rowClickForEdit(row)">
              {{row.username}}
            </a>
          </template>
        </el-table-column>

        <!-- 姓名 -->
        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="name"
          :label="$t('settings.user.table.userName')">
          <template slot-scope="{ row }">
            <a @click.prevent="rowClickForEdit(row)">
              {{row.name}}
            </a>
          </template>
        </el-table-column>

        <!-- 职务 -->
        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          :label="$t('settings.user.table.job')">
          <template slot-scope="{ row }">
            {{ $t(roleMap(row.role)) }}
          </template>
        </el-table-column>

        <!-- 状态 -->
        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="enabled"
          :label="$t('settings.user.table.status')">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.enabled"
              @change="handleChangeStatus($event, row.userId)"
              active-color="#417ABB"
              inactive-color="#CCCCCC">
            </el-switch>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column
          :show-overflow-tooltip="true"
          align="left"
          prop="endAt"
          width="120"
          fixed="right"
          :label="$t('common.ops')">
          <template slot-scope="{ row }">
            <div class="btn-table-ops" @click.prevent="rowClickForEdit(row)">
              <i class="el-icon-edit" ></i>
            </div>
            <!-- <div class="btn-table-ops" @click.prevent="rowDel(row.id)">
              <i class="el-icon-remove" ></i>
            </div> -->
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
</template>

<script>
import Pagination from "@/components/Pagination"
import PaginationMixin from '@/mixins/PaginationMixin'
import { getUserList, enableUser, disableUser } from '@/api/settings-user'

export default {
  components: {
    Pagination,
  },
  mixins: [ PaginationMixin ],
  data() {
    return {
      tableLoading: false,
      userList: [],
      userId: null
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if(!row.enabled) {
        return 'user-disabled'
      }
    },

    handleChangeStatus(status, userId) {
      if(status) {
        enableUser(userId).then(res => {
          this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})
        })
      } else {
        disableUser(userId).then(res => {
          this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})
        })
      }
    },

    search(rawCond) {
      // 原始条件包含更多数据，搜索只筛选需要的
      let { job } = rawCond

      this.params = Object.assign(this.params, { role: job }, { page: 0 })
      this.getTableData()
    },

    rowDel(id) {
      this.$confirm(
        this.$t('common.delText'),  
        this.$t('msgboxLang.title'),
        {
          confirmButtonText: this.$t('msgboxLang.ok'),
          cancelButtonText: this.$t('msgboxLang.cancel'),
          type: 'warning'
        }
      ).then(async () => {
 
      })
    },

    rowClickForEdit(row) {
      this.userId = row.userId
      this.$emit('changePassword', this.userId)
    },

    getTableData() {
      this.tableLoading = true;
      getUserList(this.params).then(res => {
        this.$set(this.pagination, 'total', res.data.totalElements);
        this.userList = res.data.content
        this.tableLoading = false
      })
    }
  }
}
</script>

<style lang="scss">
.settings-user-table{
  .user-status{
    font-weight: bold;
    &-true{
      color: #3CB371;
    }
    &-false{
      color: #F8835E;
    }
  }
  tr.user-disabled{
    td div.cell{
      color:#A9A9A9!important;
      a{
        color:#A9A9A9!important;
      }
    }
  }
}

</style>