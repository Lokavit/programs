
<template>
  <div class="business-terms box-shadow">
    <form-mod
      ref="BUSINESS"
      :type="2"
      striking
      :syncSave="false"
      class="form-mod-padding"
      :form-config="businessInfoConfig"
      :form-data="formData"
      :title="$t('settings.business.title')"
      @editIt="isEmpty = false"
      @saveIt="updateIt"
      @cancelIt="cancelIt"
    />

    <div v-if="isEmpty" class="empty-holder"></div>
  </div>
</template>

<script>
import { updateBusinessInfo, getBusinessInfo } from '@/api/settings-business'

export default {
  data() {
    return {
      isEmpty: true,
      formData: {
        businessInfo: ''
      },
      businessInfoConfig: [
        {
          type: 'richtext', 
          key: 'businessInfo',
          labelWidth:'0px',
          fill:true,
          placeholder:'common.placeholder',
          minHeight: 'calc(100vh - 245px)',
          maxHeight: 'calc(100vh - 245px)'
        }
      ]
    }
  },
  methods: {
    updateIt(newData) {
      if(newData.businessInfo) {

        updateBusinessInfo({
          commerceClause: newData.businessInfo,
        }).then(res => {
          this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})
          this.$refs['BUSINESS']._triggerSaveState()
          this.isEmpty = false
        })

      } else {
        // alert('内容为空')
      }
    },
    cancelIt() {
      let data = this.$refs['BUSINESS']._getSelfData()
      this.isEmpty = data ? false : true
    },
    getData() {
      getBusinessInfo().then(res => {
        this.formData = { businessInfo: res.data }

        if (res.data) {
          this.isEmpty = false
        } else {
          this.isEmpty = true
        }
      })
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style lang="scss">
.business-terms{
  height: 100%;
  position: relative;
  overflow: auto;
  .empty-holder{
    width: 180px;
    height: 180px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    background: url("../../../assets/imgs/empty.png") no-repeat center;
    background-size: 100%;
  }
}
</style>