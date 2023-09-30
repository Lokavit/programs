<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-09 10:32:12
 * @LastEditTime: 2019-12-09 14:12:14
 -->
<template>
  <div class="flow-node-info">
    <form-mod :form-config="flowNodeInfoConfig" :form-data="flowNodeInfoData" ref="formMod"></form-mod>
  </div>
</template>

<script>
import FlowNodeInfoMixin from '../mixins/FlowNodeInfo'

export default {
  inject: ['_idialog'],
  mixins: [ FlowNodeInfoMixin ],
  props: {
    data: Object | Number
  },
  mounted() {

    // formData数据是同步获取，所以不能用watch
    let tmp = {
      canEdit: this.data.modifiable,
      nodeName: this.data.name,
      requiredRole: this.data.requiredRole
    }

    this.flowNodeInfoData = tmp    
  },
  data() {
    return {
      flowNodeInfoData: {}
    }
  },
  methods: {
    _save() {
      let formData = this.$refs['formMod']._getSelfData()

      // 映射好字段，便于父级直接使用
      var data = {
        "modifiable": formData.canEdit,
        "name": formData.nodeName,
        "requiredRole": formData.requiredRole
      }

      this.$emit('editFlowNode', data)
      this.$nextTick(() => {
        this._idialog.close()
      })
    }
  },
  created() {
    this._idialog.children.push(this)
  }
}
</script>