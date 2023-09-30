<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-21 18:35:08
 * @LastEditTime: 2019-10-30 09:13:24
 -->
<template>
  <div class="history-flow" >
    <div v-for="(flow, index) in flowData" :key="index">

      <div class="info-title">
        <i class="kft-icon-volumn" style="margin-right:6px;"></i>
        <span>{{ flow.startTime | timeFormat('YYYY-MM-DD HH:mm') }}</span>
      </div> 

      <flow-portal :flow-data="flow"></flow-portal>

      <div class="separation-line" style="margin:20px 0 13px" v-if="index < flowData.length - 1"></div>
    </div>
  </div>
</template>
<script>
import FlowPortal from '@/components/FlowPortal'
import IdDialog from '@/components/IdDialog'

export default {
  name: 'history-flow',
  components: {
    IdDialog,
    FlowPortal
  },
  props: {
    value: Boolean,
    flowData: Array
  },
  methods: {
    _closeDialog(){
      this.$emit('input',false)
    }
  }
}
</script>
<style lang="scss">
@import '../../../../../styles/variables.scss';

.history-flow  {
  .flow-portal{
    .el-step__title{
      color: #696969;
      font-size: 14px;
      font-weight: bold;
    }
    .el-step__head{
      &.is-finish{
        color: $main-bg;
        border-color: $main-bg;
        .el-step__line{
          background-color: $main-bg;
        }
      }
      &.is-process{
        .el-step__icon.is-text{
          color: $main-bg;
          border-color: $main-bg;
        }
      }
    }
    .el-step__description{
      font-size: 14px;
      &.is-finish{
        color: $main-bg;
      }
      &.is-process{
        color: #FF8C00;
        font-weight: bold;
      }
    }
  }
}

</style>

