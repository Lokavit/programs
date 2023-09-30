<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-13 15:20:10
 * @LastEditTime: 2020-03-09 11:10:06
 -->
<template>
  <div>
    <form-mod
      :form-config="projectSelectConfig"
      :type=3
      ref="formMod-P"
      :toolbar=false
      :box-shadow=false
      :box-padding=false
      class="form-mod-padding"
      :title="$t('quote.addModal.selectTitle')">
    </form-mod>
    <div class="separation-line-light"></div>
    <form-mod
      :form-config="shipyardInfoConfig"
      :type=3
      ref="formMod-S"
      :toolbar=false
      :box-shadow=false
      :box-padding=false
      class="form-mod-padding"
      :title="$t('quote.addModal.shipyard')">
    </form-mod>

    <select-spec v-model="selectProjectVisible" @selectIt="selectProject"></select-spec>
  </div>
</template>

<script>
import AddQuotationMixin from '../mixins/AddQuotation'
import SelectSpec from '@/modals/SelectSpec'
import { addQuotation } from '@/api/quote'

export default {
  inject:['_idialog'],
  components: {SelectSpec},
  mixins: [AddQuotationMixin],
  created() {
    this._idialog.children.push(this)
  },
  data() {
    return {
      selectProjectVisible: false
    }
  },
  methods: {
    selectProject(row) {
      let { dockingProject } = row

      this.$refs['formMod-P'].formModel.dockingProject = { 
        name: dockingProject.name,  // 项目名称
        id: row.id                  // 规格书ID (不是项目ID)
      }
    },
    _save() {
      let formP = this.$refs['formMod-P']
      let formS = this.$refs['formMod-S']
      let flagP = false
      let flagS = false

      formP.$refs['formMod'].validate(valid => { valid && (flagP = true)})
      formS.$refs['formMod'].validate(valid => { valid && (flagS = true)})

      if(flagP && flagS) {
        let data = {
          specificationId: formP._getSelfData().dockingProject.id,
          quotationParty: formS._getSelfData()
        }
        
        addQuotation(data).then(res => {
          this.$message({showClose: true,message: this.$t('common.addOk'),type: 'success'})
          this.$emit('reload')
          this._idialog.close()
        })
      }

    }
  }
}
</script>

<style lang="scss">
.separation-line-light{
  height: 10px;
  width: 100%;
  background-color:#F5F5F5;
  margin-bottom:1px;
}
</style>