<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-07 09:22:18
 * @LastEditTime: 2019-12-17 10:46:11
 -->
<template>
  <div class="notice-info box-shadow">
    <form-mod :form-config="baseConfig" :form-data="baseData" class="form-mod-padding" :column=2></form-mod>
    <div class="separation-line box-shadow" v-if="baseData.content"></div>
    <!-- <div class="line"></div> -->
    <div class="content" >
      <div class="content-inner" v-html="baseData.content"></div>
    </div>
  </div>
</template>

<script>
import { getNoticeInfo, markNoticeAsUnRead, markNoticeAsReaded } from '@/api/dashboard'

export default {
  inject: ['_idialog'],
  props:{
    noticeId: Number | String
  },
  data() {
    return {
      baseConfig: [
        {label: 'dashboard.notices.infoModal.noticeTitle',type: 'text',key: 'name',fill:true,readonly:true},
        {label: 'dashboard.notices.infoModal.fromName', type: 'text',key: 'fromName',readonly:true},
        {label: 'dashboard.notices.infoModal.createAt',type: 'text',key: 'createdTime',readonly:true},
      ],
      baseData: {},
    }
  },
  methods: {
    getData() {
      getNoticeInfo(this.noticeId).then(res => {
        res.data.fromName = res.data.from.name
        this.baseData = res.data
        this.markNoticeAsReaded()
      })
    },
    markNoticeAsUnRead() {
      markNoticeAsUnRead([this.noticeId]).then(res => {
        this._idialog.close()
        this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'});
      })
    },
    markNoticeAsReaded() {
      markNoticeAsReaded([this.noticeId])
    }
  },
  created() {
    this._idialog.children.push(this)
    this.getData()
  }
}
</script>

<style lang="scss">
.notice-info{
  .line{
    width: 96%;
    margin: 0 auto;
    height: 1px;
    background-color: #F5F5F5;
  }
  .content{
    padding: 15px;
    font-size: 13px;
    &-inner{
      max-height: 200px;
      overflow: auto;
    }
  }
}
</style>