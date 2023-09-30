<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-23 20:18:41
 * @LastEditTime: 2020-03-09 13:30:57
 -->
<template>
  <div class="project-stage">
    <span class="stage-box" :class="['PLAN','SPECIFICATION','QUOTE','REPAIR','CHECK','SUMMARY'].indexOf(stage)!=-1&&'stage-box-plan'">P</span>
    <span class="stage-box" :class="['SPECIFICATION','QUOTE','REPAIR','CHECK','SUMMARY'].indexOf(stage)!=-1&&'stage-box-spec'">S</span>
    <span class="stage-box" :class="['QUOTE','REPAIR','CHECK','SUMMARY'].indexOf(stage)!=-1&&'stage-box-quote'">Q</span>
    <span class="stage-box" :class="['REPAIR','CHECK','SUMMARY'].indexOf(stage)!=-1&&'stage-box-repair'">R</span>
    <span class="stage-box" :class="['CHECK','SUMMARY'].indexOf(stage)!=-1&&'stage-box-check'">C</span>
    <span class="stage-box" :class="['SUMMARY'].indexOf(stage)!=-1&&'stage-box-summary'">S</span>
  </div>
</template>

<script>
export default {
  props: {
    stage: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
.stage-box{
  display: inline-block;
  width: 26px;
  height: 26px;
  box-sizing: border-box;
  border: 1px solid #EAEBED;
  text-align: center;
  font-size: 13px;
  line-height: 26px;
  margin-right: 6px;
  color:#20335D ;
  font-weight: bold;
  background-color:#EBEBEB;
}
.stage-box-plan{
  background-color:#FFF6F2;
}
.stage-box-spec{
  background-color:#FDE5DC;
}
.stage-box-quote{
  background-color:#FCD4C6;
}
.stage-box-repair{
  background-color:#FFB59D;
}
.stage-box-check{
  background-color:#FF9F81;
}
.stage-box-summary{
  background-color:#F8835E;
}
</style>
