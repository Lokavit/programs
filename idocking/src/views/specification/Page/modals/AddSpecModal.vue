<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-21 18:35:08
 * @LastEditTime: 2019-11-05 09:31:53
 -->
<template>
  <div>
    <form-mod :form-config="addSpecModalConfig" :column=2 ref="formMod"></form-mod>
    <select-project v-model="selectProjectVisible" status="APPROVED" @selectIt="selectProject"></select-project>
  </div>
</template>
<script>
import FormMod from '@/components/FormMod'
import SelectProject from '@/modals/SelectProject'
import AddSpecModalMixin from '../mixins/AddSpecModal'
import { addSpecification } from '@/api/specification'

export default {
  inject:['_idialog'],
  name: 'add-project-modal',
  components: { FormMod, SelectProject },
  mixins: [ AddSpecModalMixin ],
  data() {
    return{
      confirmLoading: false,
      selectProjectVisible: false
    }
  },
  methods: {
    _save() {
      this.$refs['formMod'].$refs['formMod'].validate((valid) => {
        if (valid) {
          let formData = this.$refs['formMod']._getSelfData()

          let params = {
            projectId: formData.projectId,
            currencyTypeId: formData.currencyType.id,
            standardTreeVersionId: formData.standardTreeVersionId.id
          }

          addSpecification(params).then(res => {
            this.confirmLoading = false
            this.$message({showClose: true,message: this.$t('common.addOk'),type: 'success'});
            this.$emit('reload')
            this._closeDialog()
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    selectProject(row) {
      let { name, code, id } = row

      this.$refs['formMod'].formModel.projectName = name // 项目名称
      this.$refs['formMod'].formModel.projectNo = code   // 项目编码
      this.$refs['formMod'].formModel.projectId = id     // 项目ID
    },
    _closeDialog(){
      this._idialog.close()
    }
  },
  created() {
    this._idialog.children.push(this)
  }
}
</script>
<style lang="scss" scoped>
</style>

