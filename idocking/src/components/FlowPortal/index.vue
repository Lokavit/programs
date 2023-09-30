<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-28 14:19:56
 * @LastEditTime: 2020-03-09 13:03:11
 -->
<template>
  <div class="flow-portal">
    <el-steps :active="curStep">
      <el-step>
        <template v-slot:title>
          {{ $t('project.overview.flow.START') }}
        </template>
        <template v-slot:description>
          {{ flowData.startUser.name }}<br>
          {{ flowData.startTime | timeFormat('YYYY-MM-DD HH:mm') }}
        </template>
      </el-step>
      <el-step v-for="(step, index) in flowData.steps" :key="index">
        <template v-slot:title>
          {{ step.name }}
        </template>
        <template v-slot:description>

          <!-- (最后一个节点) -->
          <template v-if="curStep == flowData.steps.length && index+1 == curStep">
            <!-- 最后节点未处理 -->
            <template v-if="step.status === 'PENDING'">
              {{ step.assignee.name }}<br>
              {{ $t('project.overview.flow.state.doing') }}
            </template>
            <template v-else-if="step.status === 'REJECTED'">
              <span class="step-status-rejected">
                {{ step.assignee.name }} &nbsp;&nbsp;  {{ $t('project.overview.flow.state.reject') }}<br>
                {{ flowData.endTime }}
              </span>
            </template>
            <!-- 最后节点已处理 -->
            <template v-else>
              <span class="flow-complete">
                {{ step.assignee.name }}<br>
                {{ $t('project.overview.flow.state.complete') }}
              </span>
            </template>

          </template>

          <!-- 审批中 -->
          <template v-else-if="index+1 == curStep">
            <!-- REJECTED 拒绝 -->
            <template v-if="step.status === 'REJECTED'">
              <span class="step-status-rejected">
                {{ step.assignee.name }}<br>
                {{ $t('project.overview.flow.state.reject') }}
              </span>
            </template>
            <!-- PENDING 审批ing -->
            <template v-else>
              {{ step.assignee.name }}<br>
              {{ $t('project.overview.flow.state.doing') }}
            </template>
          </template>

          <!-- 流程未到达节点 -->
          <template v-else-if="index+1 > curStep">
            {{ step.assignee.name }}<br>
            {{ $t('project.overview.flow.state.default') }}
          </template>

          <!-- 已审批节点 -->
          <template v-else>
            {{ step.assignee.name }}<br>
            {{ step.completeTime }}
          </template>

        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  name: 'FlowPortal',
  props: {
    flowData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    curStep() {
      const steps = this.flowData.steps
      const status = this.flowData.status

      if (status === 'APPROVED') {
        return steps.length
      }

      if (status === 'REJECTED') {
        return steps.findIndex(step => { return step.status === 'REJECTED' }) + 1
      }

      if (status === 'PENDING') {
        return steps.findIndex(step => { return step.status === 'PENDING' }) + 1
      }

      return 0
    }
  }
}
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.flow-portal{
  .el-step__title{
    color: #696969;
    font-size: 14px;
    font-weight: bold;
  }
  .el-step__head{
    &.is-finish{
      color: $title-color;
      border-color: $title-color;
      .el-step__line{
        background-color: $title-color;
      }
    }
    &.is-process{
      .el-step__icon.is-text{
        color: $title-color;
        border-color: $title-color;
      }
    }
  }
  .step-status-rejected{
    color: red;
    font-weight: bold;
  }
  .el-step__description{
    font-size: 14px;
    &.is-finish{
      color: $main-border;
    }
    &.is-process{
      color: #FF8C00;
      font-weight: bold;
    }
  }
  .flow-complete{
    color: $main-bg;
    font-weight: bold;
  }
}
</style>
