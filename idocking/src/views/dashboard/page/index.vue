<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 12:32:13
 * @LastEditTime: 2019-12-17 16:27:05
  项目列表
  船舶列表
  流程审批
  消息列表
 -->
<template>
  <div class="dashboard">
    <head-data-view></head-data-view>
    <div class="dashboard-body">
      <item-flow></item-flow>
      <item-project></item-project>
      <item-fleet></item-fleet>
      <item-news></item-news>
    </div>
  </div>
</template>

<script>
import HeadDataView from '../components/HeadDataView'
import ItemProject from '../components/ItemProject'
import ItemFleet from '../components/ItemFleet'
import ItemNews from '../components/ItemNews'
import ItemFlow from '../components/ItemFlow'

export default {
  components:{
    HeadDataView,
    ItemProject,
    ItemFleet,
    ItemNews,
    ItemFlow
  },
}
</script>

<style lang="scss">
.dashboard{
  // display: flex;
  // flex-direction: column;
  &-body {
    // flex:1;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
      > div {
      width: 0;
      box-sizing: border-box;
      flex: 0 1 49.5%;
    }
  }
}
</style>