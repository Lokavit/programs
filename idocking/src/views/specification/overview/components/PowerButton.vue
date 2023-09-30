<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-29 10:19:47
 * @LastEditTime: 2019-11-19 15:09:24
 -->
<template>
  <div class="power-button-project">
    <el-dropdown
      trigger="click"
      v-if="power.length"
      @command="handleCommand"
    >
      <el-button type="primary" size="mini" round>
        {{ $t('common.ops') }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item, index) in power"
          :command=item
          :key="index">
          {{ $t('project.overview.operation.' + item ) }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 同意 -->
    <id-dialog
      v-model="approveVisible"
      :title="$t('project.overview.operation.APPROVE')"
      width="40%"
      ref="idialog-APPROVE"
      :box-shadow="false"
      :box-padding="false"
      footer-align="center"
      @save="approveIt('idialog-APPROVE','formMod-APPROVE')"
      :footer-layout="['ok']">
      <form-mod :form-config="formConfigApprove" ref="formMod-APPROVE"></form-mod>
    </id-dialog>

    <!-- 拒绝 -->
    <id-dialog
      v-model="rejectVisible"
      :title="$t('project.overview.operation.REJECT')"
      width="40%"
      ref="idialog-REJECT"
      :box-shadow="false"
      :box-padding="false"
      footer-align="center"
      @save="rejectIt('idialog-REJECT', 'formMod-REJECT')"
      :footer-layout="['ok']">
      <form-mod :form-config="formConfigReject" ref="formMod-REJECT"></form-mod>
    </id-dialog>
  </div>
</template>

<script>
import IdDialog from '@/components/IdDialog'
import FormMod from '@/components/FormMod'

import { 
  getDockItemOperations,
  submitDockItem,
  approveDockItem,
  rejectDockItem,
  reEditDockItem,
  delDockItem
} from '@/api/specification'

export default {
  inject: ['_treeTable'],
  name: 'power-button',
  props:{
    itemId: String | Number    // 【level 3】坞修项ID
  },
  components:{
    IdDialog,
    FormMod
  },
  data() {
    return {
      power:[],
      approveVisible: false,
      rejectVisible: false,

      // 表单模型配置
      formConfigApprove:[{
        key: 'comment',
        type:'textarea',
        fill: true,
        placeholder: 'project.overview.flow.comment'
      }],
      formConfigReject:[{
        key: 'comment',
        type:'textarea',
        fill: true,
        placeholder: 'project.overview.flow.comment'
      }]
    }
  },
  methods: {
    handleCommand(command) {
      // 所有formMod保存后才能提交

      // 我懒得优化了，烦了
      if(this._treeTable) {
        if(this._treeTable.$refs.dockItemInfo._canNext()) {
          if(command === 'SUBMIT') {
            this.submitIt()
          } else if (command === 'APPROVE') {
            this.approveVisible = true
          } else if (command === 'REJECT') {
            this.rejectVisible = true
          } else if (command === 'REEDIT') {
            this.reEditIt()
          } else if (command === 'LOCK') {
            this.delIt()
          }
        } else {
          this.$message({showClose: true,message: this.$t('common.saveForSubmit'),type: 'warning'});
          return false
        }
      } else {
          if(command === 'SUBMIT') {
            this.submitIt()
          } else if (command === 'APPROVE') {
            this.approveVisible = true
          } else if (command === 'REJECT') {
            this.rejectVisible = true
          } else if (command === 'REEDIT') {
            this.reEditIt()
          } else if (command === 'LOCK') {
            this.delIt()
          }
      }
    },
    reEditIt() {
      reEditDockItem(this.itemId).then(res => {
        this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})
        this.getDockItemOperations()
        this.$emit('state-change')
      })
    },
    submitIt(){
      submitDockItem(this.itemId).then(res => {
        // 更新数据

        this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})
        this.getDockItemOperations()
        this.$emit('state-change')
      })
    },
    approveIt(dialog, formMod) {
      let comment = this.$refs[formMod]._getSelfData().comment

      approveDockItem(this.itemId, comment).then(res => {
        this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})
        this.getDockItemOperations()
        this.$emit('state-change')
        this.$refs[dialog].close()
      })
    },
    rejectIt(dialog, formMod) {
      let comment = this.$refs[formMod]._getSelfData().comment

      rejectDockItem(this.itemId, comment).then(res => {
        this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})
        this.getDockItemOperations()
        this.$emit('state-change')
        this.$refs[dialog].close()
      })
    },
    delIt(){
      this.$confirm(
        this.$t('common.delText'),  
        this.$t('msgboxLang.title'),
        {
          confirmButtonText: this.$t('msgboxLang.ok'),
          cancelButtonText: this.$t('msgboxLang.cancel'),
          type: 'warning'
        }
      ).then(async () => {
        delDockItem(this.itemId).then(res => {
          this.$message({showClose: true,message: this.$t('common.delOk'),type: 'success'})
          this._treeTable.getData()
          this.$nextTick(() => {
            this._treeTable.edit3rdVisible = false
          })
        })
      })
    },
    getDockItemOperations() {
      this.$store.commit('specification/SET_CANEDIT3RD', false)
      getDockItemOperations(this.itemId).then(res => {
        this.power = res.data.filter(item => { return item !== 'MODIFY' })

        // 给项目预览页赋值，用以控制表单是否可以编辑(hack方法，后期需改成vuex)
        this.$store.commit('specification/SET_CANEDIT3RD', res.data.includes('MODIFY'))
      })
    }
  },
  created() {
    this.getDockItemOperations()
  }
}
</script>

<style lang="scss">
@import '../../../../styles/variables.scss';

.power-button-project{
  .el-dropdown{
    .el-button--primary{
      &:focus{
        background-color: $bg-btn-orange!important;
      }
      background-color: $bg-btn-orange!important;
      border: 1px solid $title-color!important;
      color: $title-color;
      font-weight: bold;
      &:hover{
        background: $title-color!important;
        border-color: $title-color!important;
        color: #FFF!important;
      }
    }
  }

}
</style>