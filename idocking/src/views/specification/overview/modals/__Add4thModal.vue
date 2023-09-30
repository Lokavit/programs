<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-07 15:15:06
 * @LastEditTime: 2019-11-12 15:21:12
 -->
<template>
  <div class="add-dock-detail-item">
    <form-mod
      :form-config="addDockDetailItemConfig"
      ref="formMod"
      :column=2
    ></form-mod>
  </div>
</template>

<script>
import addDockDetailItemMixin from '../mixins/AddDockDetailItem'
import { addDockDetailItem, getStandardTreeInfo } from '@/api/specification'

export default {
  inject:['_idialog'],
  mixins: [addDockDetailItemMixin],
  props:{
    currencyType: String,
    dockItemId: String | Number,    // 第三级坞修项ID
    dockItemData: Object
  },
  data(){
    return {
      showItCan: false
    }
  },
  methods:{
    getStandardTreeInfo(id) {
      return getStandardTreeInfo(id)
    },
    _save(){
      let form = this.$refs['formMod']._getSelfData()
      if(!form.keyParams) form.keyParams = []  // 默认为空[]
      let data = Object.assign(form, {
        specificationItem: {
          id: this.dockItemId
        }
      })

      this.$refs['formMod'].$refs['formMod'].validate(valid => {
        if (valid) {
          addDockDetailItem(data).then(res => {
            this.$message({showClose: true,message: this.$t('common.addOk'),type: 'success'})
            this.$emit('reload')
            this.$nextTick(() => {
              this._idialog.close()
            })
          })
        }
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs['formMod'].formModel['code'] = this.dockItemData.code
    })
  },
  created() {
    this._idialog.children.push(this)
  }
}
</script>