<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-05 15:20:53
 * @LastEditTime: 2019-11-28 11:10:56
 -->
<template>
  <form-mod :form-config="addDockItemConfig" ref="formMod" :column=2></form-mod>
</template>

<script>
import AddDockItemMixin from '../mixins/Add3rd'
import { addSpecificationItem, getStandardTreeInfo } from '@/api/specification'

export default {
  inject:['_idialog'],
  mixins:[AddDockItemMixin],
  props:{
    specId: String | Number,
    fromTreeRow: Object
  },
  created(){
    this._idialog.children.push(this)
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs['formMod'].formModel['code'] = this.fromTreeRow.code
    })
  },
  methods:{
    // querySearch(queryString, cb){
    //   let res = queryString ? window.STANDARDTREEALL.filter(this.createFilter(queryString)) : window.STANDARDTREEALL
    //   cb(res);
    // },
    // createFilter(queryString) {
    //   return (item) => {
    //     return (item.code.startsWith(queryString) && item.code.length === 5);
    //   };
    // },
    getStandardTreeInfo(id) {
      return getStandardTreeInfo(id)
    },
    _save(){
      let formMod = this.$refs['formMod']

      formMod.$refs['formMod'].validate(valid => {
        if(valid) {
          let data = formMod._getSelfData()
          data.categoryCode = this.fromTreeRow.code  // 一级的编码  E、H、G
          data.specification = { id: this.specId }   // 规格书编号  id

          addSpecificationItem(data).then(res => {
            this.$message({showClose: true,message: this.$t('common.addOk'),type: 'success'})
            this.$emit('reload')
            this.$nextTick(() => { this._idialog.close() })
          })
        }
      })

    }
  }
}
</script>