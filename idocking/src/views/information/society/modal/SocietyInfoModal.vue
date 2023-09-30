<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 17:01:07
 * @LastEditTime: 2019-11-04 12:41:05
 -->
<template>
  <div class="add-society-modal" v-loading="modalLoading" :element-loading-text="$t('common.loadingTip')">
    <form-mod
      labelWidth="150px"
      ref="formMod"
      :form-config="addSocietyModalConfig"
      :form-data="societyInfo"
      :syncSave="false"
      :title="$t('common.baseTitle')"
      label-width="100px"
      :column="2"
      :type=2
      @saveIt="_save">
    </form-mod>
  </div>
</template>
<script>
import { getSocietyInfo, updateSociety } from '@/api/society';
import FormMod from '@/components/FormMod'
import AddSocietyModalMixin from '../mixins/AddSocietyModal'

export default {
  inject: ['_idialog'],
  components: { FormMod },
  mixins: [AddSocietyModalMixin],
  props: {
    societyId: Number | String,
    societyInfo: {}
  },
  data() {
    return {
      modalLoading:false,
      confirmLoading: false,
    }
  },
  methods: {
    closeIt() { // 检测对象
      this._idialog.close()
    },
    _save() {
      this.confirmLoading = true
      this.$refs['formMod'].$refs['formMod'].validate((valid) => {
        if (valid) {
          var data = Object.assign({id: this.societyId}, 
            this.$refs['formMod']._getSelfData()
          )

          updateSociety(data).then(res => {
            this.$message({showClose: true,message: this.$t('common.editOk'),type: 'success'});
            this.$refs['formMod']._triggerSaveState()
            this.confirmLoading = false
            this.$emit('reload')
          })
        } else {
          this.confirmLoading = false
        }
      })
    },
    getSocietyInfo() { // 获取船舶信息数据
      this.modalLoading = true;

      getSocietyInfo(this.societyId).then(res => {
        this.societyInfo = res.data;
        this.modalLoading = false;
      })

    }
  },
  created() {
    this._idialog.children.push(this)
    this.getSocietyInfo()
  }
}
</script>
