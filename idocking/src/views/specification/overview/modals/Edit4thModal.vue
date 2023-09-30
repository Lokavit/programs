<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-07 15:15:06
 * @LastEditTime: 2019-11-10 18:00:09
 -->
<template>
  <div class="dock-detail-item-info svg-bg-boat">
    <form-mod
      :title="$t('common.baseTitle')"
      :form-config="dockDetailItemInfoConfig"
      :form-data="formData"
      :showHeader="canEdit3rd"
      :syncSave="false"
      @cancelIt="cancelIt"
      @editIt="editIt"
      @saveIt="saveIt"
      ref="formMod"
      :column="2"
      :type="2"
    ></form-mod>
  </div>
</template>

<script>
import dockDetailItemInfoMixin from '../mixins/Edit4th'
import { 
  getDockDetailItemInfo, 
  updateDockDetailItemInfo 
} from '@/api/specification'
import { mapState } from 'vuex'

export default {
  inject:['_idialog'],
  mixins: [dockDetailItemInfoMixin],
  props:{
    treeItem3rdId: String | Number,   // 【level 3】坞修项ID,更新时需要带上
    treeItem4thId: String | Number    // 【level 4】坞修细节项ID
  },
  data() {
    return {
      formData: {},  // 【level 4】坞修细节项数据
      editing: false // 是否处于编辑状态
    }
  },
  computed: {
    ...mapState({
      currencyType: state => state.specification.currencyType,
      canEdit3rd: state => state.specification.canEdit3rd
    })
  },
  methods:{
    editIt() {
      this.editing = true
    },

    cancelIt() {
      this.editing = false
    },

    saveIt(){
      let form = this.$refs['formMod']._getSelfData()
      let data = Object.assign(form, { id: this.treeItem4thId })

      this.$refs['formMod'].$refs['formMod'].validate(valid => {
        if (valid) {
          updateDockDetailItemInfo(data).then(res => {
            this.$message({showClose: true,message: this.$t('common.editOk'),type: 'success'})
            this.$refs['formMod']._triggerSaveState() // 表单保存状态
            this.editing = false                      // KeyParams保存状态
            this.$emit('reload')
          })
        }
      })
    },

    getData() {
      getDockDetailItemInfo(this.treeItem4thId).then(res => {
        this.formData = res.data
      })
    }
  },

  created() {
    this._idialog.children.push(this)
    this.getData()
  }
}
</script>

<style lang="scss">
.svg-bg-boat{
  background-image: url(background-boat.svg);
  background-size: 227px 227px;
  background-repeat: no-repeat;
  background-position: right bottom;
}
.key-params{
  ul,li {
    padding:0;margin:0;list-style:none;
    color:#7D7D7d;
    font-family: Satve, Arial, Helvetica, sans-serif;
  }
}
</style>