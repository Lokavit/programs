<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-09 10:32:12
 * @LastEditTime: 2019-12-09 11:12:35
 -->
<template>
  <div class="add-flow-node">
    <form-mod :form-config="addFlowNodeConfig" ref="formMod"></form-mod>
  </div>
</template>

<script>
import AddFlowNodeMixin from '../mixins/AddFlowNode'

export default {
  inject: ['_idialog'],
  mixins: [ AddFlowNodeMixin ],
  data() {
    return {
      addFlowNodeVisible: false
    }
  },
  methods: {
    _save() {

      this.$refs['formMod'].$refs['formMod'].validate((valid) => {
        if (valid) {

          let formData = this.$refs['formMod']._getSelfData()
          var data = {
            "modifiable": formData.canEdit,
            "name": formData.nodeName,
            "requiredRole": formData.requiredRole
          }

          this.$emit('addFlowNode', data)
          this.$nextTick(() => {
            this._idialog.close()
          })

        } else {
          this.confirmLoading = false
        }
      })
    }
  },
  created() {
    this._idialog.children.push(this)
  }
}
</script>