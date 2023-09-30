<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 12:54:59
 * @LastEditTime: 2020-03-09 12:51:00
 -->
<template>
  <div class="project-overview padding box-shadow">
    <div class="project-overview-header">
      <div class="step-title">
        <svg-icon name="background-boat" width="20" height="20" />
        {{ $t('project.step.overview') }}
      </div>
      <div class="step-btns">
        <power-button :project-id="projectId" @state-change="getData" />
      </div>
    </div>

    <div style="border:1px solid #F2F2F2;">
      <form-mod
        ref="formMod-BASE"
        :type="2"
        :column="3"
        :sync-save="false"
        :toolbar="canEdit"
        class="form-mod-padding"
        :form-config="baseInfoConfig"
        :form-data="formData"
        :title="$t('common.baseTitle')"
        @saveIt="updateProjectInfo($event,'BASE')"
      />

      <div class="separation-line box-shadow" />
      <form-mod
        ref="formMod-DESC"
        :type="2"
        :column="3"
        :toolbar="canEdit"
        class="form-mod-padding"
        :form-config="descInfoConfig"
        :form-data="formData"
        :title="$t('project.overview.descInfo.title')"
        @saveIt="updateProjectInfo($event,'DESC')"
      />

      <div class="separation-line box-shadow" />
      <form-mod
        ref="formMod-ATTA"
        :type="2"
        :toolbar="canEdit"
        :form-config="attaConfig"
        class="form-mod-padding"
        :title="$t('common.attachment')"
        @saveIt="updateProjectInfo($event,'ATTA')"
      >
        <attachments :file-list="attachments" />
      </form-mod>
    </div>

    <div v-if="flowData" class="separation-line" />
    <div v-if="flowData" class="padding">
      <div class="project-overview-header">
        <div class="info-title">
          <i class="kft-icon-volumn" style="margin-right:6px;" />
          <span>{{ $t('project.overview.flow.title') }}</span>
        </div>
        <div class="step-btns">
          <id-button icon="s-data" text="project.overview.btnHistory" @click="selectHistoryVisible = true" />
        </div>
      </div>
      <flow-portal :flow-data="flowData" />
    </div>

    <!-- modal -->
    <select-vessel v-model="selectVesselVisible" @selectIt="selectVessel" />

    <id-dialog v-model="selectHistoryVisible" width="75%" :footer="false" :title="$t('project.overview.flow.history.title')">
      <history-flow v-if="selectHistoryVisible" :flow-data="flowDataAll" />
    </id-dialog>

  </div>
</template>

<script>
import IdButton from '@/components/IdButton'
import FormMod from '@/components/FormMod'
import PowerButton from '../components/PowerButton'
import Attachments from '@/components/Attachments'
import FlowPortal from '@/components/FlowPortal'
import HistoryFlow from '@/modals/HistoryFlow'
import SelectVessel from '@/modals/SelectVessel'
import BaseInfoMixin from './mixins/BaseInfo'
import DescInfoMixin from './mixins/DescInfo'
import LevelListMixin from '@/mixins/LevelListMixin'
import AttachmentsMixin from './mixins/Attachments'
import { getProjectInfo, updateProjectInfo, getApprovalFlows } from '@/api/project'

export default {
  components: {
    IdButton,
    FormMod,
    SelectVessel,
    Attachments,
    FlowPortal,
    HistoryFlow,
    PowerButton
  },
  mixins: [BaseInfoMixin, DescInfoMixin, AttachmentsMixin, LevelListMixin],
  provide() {
    return {
      _projectOverview: this
    }
  },
  data() {
    return {
      projectId: null,
      powerBtns: [], // 由子组件PowerButton赋值,用以控制formMod是否可编辑
      canEdit: false,
      formData: {},
      flowData: null,
      flowDataAll: null,
      attachments: [],
      selectVesselVisible: false,
      selectHistoryVisible: false
    }
  },
  watch: {
    powerBtns(newValue) {
      if (newValue.includes('SUBMIT') || newValue.includes('MODIFY')) {
        this.canEdit = true
      } else {
        this.canEdit = false
      }
    }
  },
  created() {
    this.projectId = this.$route.query.id
    // setTimeout(() => {
    //   console.log(this.$route.matched)
    //   this.$route.matched.push({
    //     path: this.$route.matched[this.$route.matched.length - 1].path + 'hhh',
    //     meta: { title: "hhh", cn_title: 'hhh', icon: "" },
    //   })
    // }, 2000)
    this.getData()
  },
  methods: {
    getData() {
      if (this.projectId) {
        // 获取项目信息
        getProjectInfo(this.projectId).then(res => {
          const newData = res.data
          newData.type = newData.vessel.type

          this.formData = newData
          this.attachments = newData.attachments
        })

        // 获取审批信息
        getApprovalFlows(this.projectId).then(res => {
          console.log(res)
          this.flowData = res.data[0]
          this.flowDataAll = res.data
        })
      }
    },
    _canNext() {
      // 是否所有formMod都已经是保存状态(只有保存状态才能进入下一步)
      const formMod_BASE = this.$refs['formMod-BASE']._getSelfState()
      const formMod_DESC = this.$refs['formMod-DESC']._getSelfState()
      const formMod_ATTA = this.$refs['formMod-ATTA']._getSelfState()

      if (
        (formMod_BASE === 2 || formMod_BASE === 4) &&
        (formMod_DESC === 2 || formMod_DESC === 4) &&
        (formMod_ATTA === 2 || formMod_ATTA === 4)) {
        return true
      } else {
        return false
      }
    },
    selectVessel(row) {
      const { name, id, type } = row // vessel
      const formModel = this.$refs['formMod-BASE'].formModel

      formModel.vessel.name = name
      formModel.vessel.id = id
      formModel.vessel.type = type.name

      // type字段是新增出来，用于配合formMod进行界面显示，提交数据时要删掉
      formModel.type = type
    },
    updateProjectInfo(newData, type) {
      const data = Object.assign({ id: this.projectId }, this.formData, newData)

      // 基本信息里，有部分数据是必填的，所以需要单独进行表单验证
      if (type === 'BASE') {
        this.$refs['formMod-' + type].$refs['formMod'].validate((valid) => {
          if (valid) {
            updateProjectInfo(data).then(res => {
              this.$message({ showClose: true, message: this.$t('shipInfo.addShipModal.editOk'), type: 'success' })
              this.$refs['formMod-' + type]._triggerSaveState()
            })
          }
        })
      } else {
        updateProjectInfo(data).then(res => {
          this.$message({ showClose: true, message: this.$t('shipInfo.addShipModal.editOk'), type: 'success' })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../styles/variables.scss';

.project-overview{
  &-header{
    margin-bottom: 15px;
    display: flex;
    .step-title{
      width: 200px;
      height: 30px;
      line-height: 30px;
      font-weight: bold;
      color: $title-color;
      svg{
        vertical-align: middle;
        margin-right: 10px;
        position: relative;
        top:-2px;
      }
    }
    .step-btns{
      flex:1;
      text-align: right;
    }
  }
}
</style>
