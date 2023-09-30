<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-21 18:35:08
 * @LastEditTime: 2019-12-10 16:41:45
 -->
<template>
  <div>
    <form-mod :form-config="addProjectModalConfig" labelAlign="left" :column=2 ref="formMod"></form-mod>
    <select-vessel v-model="selectVesselVisible" @selectIt="selectVessel"></select-vessel>
  </div>
</template>
<script>
import IdDialog from '@/components/IdDialog'
import FormMod from '@/components/FormMod'
import SelectVessel from '@/modals/SelectVessel'
import AddProjectModalMixin from '../mixins/AddProjectModal'
import { addProject } from '@/api/project'

export default {
  inject:['_idialog'],
  name: 'add-project-modal',
  components: { IdDialog, FormMod, SelectVessel },
  mixins: [ AddProjectModalMixin ],
  props: {
    value: Boolean
  },
  data() {
    return{
      confirmLoading: false,
      selectVesselVisible: false
    }
  },
  methods: {
    _save() {
      this.$refs['formMod'].$refs['formMod'].validate((valid) => {
        if (valid) {
          let data = this.$refs['formMod']._getSelfData()
          addProject(data).then(res => {
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
    selectVessel(row) {
      console.log(row.type)
      let { name, id, type } = row

      this.$refs['formMod'].formModel.vessel = { name, id }
      this.$refs['formMod'].formModel.type = type
    },
    _closeDialog(){
      this._idialog.close()
    },
  },
  created() {
    this._idialog.children.push(this)
  }
}
</script>
<style lang="scss" scoped>
</style>

