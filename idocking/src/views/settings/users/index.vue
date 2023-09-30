<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-06 09:34:37
 * @LastEditTime: 2019-12-11 09:26:18
 -->
<template>
  <div class="settings-users">
    <form-search :form-config="formSearchConfig" :column=4 @search="search"></form-search>
    <div class="separation-line box-shadow"></div>

    <div class="padding box-shadow">
      <div class="table-toolbar">
        <div class="table-toolbar-left"></div>
        <div class="table-toolbar-right">
          <id-button icon="plus" text="common.add" @click="addUserVisible = true"></id-button>
        </div>
      </div>

      <table-view ref="tableView" @changePassword="handleChangePass"></table-view>
    </div>

    <!-- 新增用户 -->
    <id-dialog v-model="addUserVisible" width="40%" :title="$t('settings.user.addModal.title')">
      <add-user-modal v-if="addUserVisible" @reload="getTableData"></add-user-modal>
    </id-dialog> 

    <!-- 更改用户密码 -->
    <id-dialog v-model="changePassVisible" width="40%" :title="$t('settings.user.passModal.title')">
      <change-password-modal v-if="changePassVisible" :userId="userId"></change-password-modal>
    </id-dialog> 
  </div>
</template>

<script>
import FormSearch from '@/components/FormSearch'
import FormSearchMixin from './mixins/FormSearch'
import TableView from './components/TableView'
import AddUserModal from './modals/AddUser'
import ChangePasswordModal from './modals/ChangePassword'
import IdButton from '@/components/IdButton'

export default {
  mixins: [ FormSearchMixin ],
  components: { FormSearch, TableView, AddUserModal, ChangePasswordModal, IdButton },
  data() {
    return {
      addUserVisible: false,
      changePassVisible: false,
      userId:null
    }
  },
  methods: {
    getTableData() {
      this.$refs['tableView'].getTableData()
    },
    handleChangePass(userId) {
      this.userId = userId
      this.changePassVisible = true
    },
    search(cond) {
      this.$refs['tableView'].search(cond)
    }
  }
}
</script>