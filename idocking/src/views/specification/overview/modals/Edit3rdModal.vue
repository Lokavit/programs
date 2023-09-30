<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-07 09:22:18
 * @LastEditTime: 2019-11-27 15:32:45
 -->
<template>
  <div class="dock-item-info box-shadow">

    <!-- 自修 -->
    <form-mod
      :type=2
      :form-config="selfRepairConfig"
      :form-data="formData"
      :syncSave="false"
      :toolbar="canEdit3rd"
      @saveIt="saveIt('selfRepair')"
      ref="selfRepair"
      class="form-mod-padding"
      :title="$t('specification.overview.addDockItem.selfRepair')"
    ></form-mod>
    <div class="separation-line box-shadow"></div>
    
    <!-- 描述 -->
    <form-mod
      :type=2
      :form-config="descriptionConfig"
      :form-data="formData"
      :syncSave="false"
      :toolbar="canEdit3rd"
      @saveIt="saveIt('description')"
      ref="description"
      class="form-mod-padding"
      :title="$t('specification.overview.dockItemInfo.desc')"
    ></form-mod>
    <div class="separation-line box-shadow"></div>
    
    <!-- 注意事项 -->
    <form-mod
      :type=2
      :form-config="matterConfig"
      :form-data="formData"
      :syncSave="false"
      :toolbar="canEdit3rd"
      @saveIt="saveIt('matter')"
      ref="matter"
      class="form-mod-padding"
      :title="$t('specification.overview.dockItemInfo.matter')"
    ></form-mod>
    <div class="separation-line box-shadow"></div>

    <!-- 工作列表 -->
    <form-mod
      :type=2
      :column="3"
      ref="worklist"
      :toolbar="canEdit3rd"
      class="form-mod-padding work-list"
      @saveIt="saveIt('worklist')"
      v-if="workListConfig.length"
      :form-config="workListConfig"
      :form-data="workListFormData"
      :title="$t('specification.overview.dockItemInfo.worklist')">
    </form-mod>
    <div class="separation-line box-shadow" v-if="workListConfig.length"></div>

    <!-- 验收项目 -->
    <form-mod
      :type=2
      :column="3"
      ref="check"
      :toolbar="canEdit3rd"
      class="form-mod-padding"
      @saveIt="saveIt('check')"
      v-if="checkOptionsConfig.length"
      :form-config="checkOptionsConfig"
      :form-data="checkOptionsFormData"
      :title="$t('specification.overview.dockItemInfo.check')">
    </form-mod>
    <div class="separation-line box-shadow" v-if="checkOptionsConfig.length"></div>

    <!-- 附件 -->
    <!-- 要获取的是FormMod内嵌的组件的数据，所以回调函数比常规的多一个$event,用来承载组件数据 -->
    <form-mod
      :type=2
      ref="attachment"
      :toolbar="canEdit3rd"
      class="form-mod-padding"
      :form-config="attachmentConfig"
      @saveIt="saveItFromSlot($event, 'attachment')"
      :title="$t('specification.overview.dockItemInfo.attachment')">
      <attachments :file-list='attachments'></attachments>
    </form-mod>
    <div class="separation-line box-shadow"></div>

    <!-- 坞修细节项 -->
    <form-mod
      :type="2"
      :toolbar="canEdit3rd"
      class="form-mod-padding"
      :title="$t('specification.common.dockDetailItem')"
      :form-config="dockItemFormConfig">
      <tree-items-4th 
        :treeItem3rd="treeItem3rd" 
        v-on="$listeners" 
      ></tree-items-4th>
      <!-- v-on="$listeners" 向上传递TreeItem4th组件的行删除事件，让最顶级组件刷新数据 -->
    </form-mod>

    <!-- 审批流 -->
    <div class="separation-line box-shadow" style="margin:10px 0 5px 0" v-if="flowData"></div>
    <div class="form-mod-padding" v-if="flowData">
      <div class="flowportal-header">
        <div class="info-title">
          <i class="kft-icon-volumn" style="margin-right:6px;"></i>
          <span>{{ $t('project.overview.flow.title') }}</span>
        </div> 
        <div class="step-btns">
          <id-button icon='s-data' text="project.overview.btnHistory" @click="historyVisible = true"></id-button>
        </div>
      </div>

      <div v-if="flowData && flowStatus!=='DRAFTING'">
        <flow-portal :flow-data="flowData" ></flow-portal>
      </div>
    </div>

    <!-- 审批流历史 -->
    <id-dialog v-model="historyVisible" width="55%" :footer="false" :title="$t('project.overview.flow.history.title')">
      <history-flow v-if="historyVisible" :flow-data="flowDataAll"></history-flow>
    </id-dialog>

  </div>
</template>

<script>
import FlowPortal from '@/components/FlowPortal'
import HistoryFlow from '@/modals/HistoryFlow'
import IdButton from '@/components/IdButton'
import Attachments from '@/components/Attachments'
import PowerButton from '../components/PowerButton'
import TreeItems4th from '../components/TreeItems4th'
import selfRepairMixin from '../mixins/Edit3rd-SelfRepair'
import descriptionMixin from '../mixins/Edit3rd-Description'
import matterMixin from '../mixins/Edit3rd-Matter'
import { 
  getDockItemInfo,
  updateDockItemInfo,
  getDockItemFlowData,
  getCheckOptionsAll,
  getWorkListAll
} from '@/api/specification'

export default {
  inject: ['_treeTable'],
  components: {
    TreeItems4th,
    PowerButton,
    FlowPortal,
    IdButton,
    HistoryFlow,
    Attachments
  },
  props:{
    specId: String | Number,
    treeItem3rd: Object,     // 第三级坞修项数据
  },
  mixins:[
    selfRepairMixin,
    descriptionMixin,
    matterMixin
  ],
  data() {
    return {
      flowData: null,    // 当前审批流程
      flowDataAll:[],    // 历史审批流程
      formData: [],
      attachments: [],
      originCode: null,  // 三级项原始code(因为code可以修改)
      flowStatus: null,
      historyVisible: false,
      dockItemFormConfig: [{type: 'text', key: 'nothing', hidden:true}],
      attachmentConfig: [{ type: 'text', hidden: true, maxHeight:'200px', key: 'attachments' }],
      workListConfig: [],
      checkOptionsConfig: [],
      workListFormData: {},
      checkOptionsFormData: {}
    }
  },
  computed: {
    // 是否拥有坞修项编辑权限(第三级)
    canEdit3rd () {
      return this.$store.state.specification.canEdit3rd
    },
    currencyType() {
      return this.$store.state.specification.currencyType
    }
  },
  methods: {
    /**
     * FormMod保存后才能进行流程操作
     */
    _canNext() {
      let description = this.$refs['description']._getSelfState() 
      let selfRepair = this.$refs['selfRepair']._getSelfState() 
      let attachment = this.$refs['attachment']._getSelfState()
      let matter = this.$refs['matter']._getSelfState() 
      let worklist = this.$refs['worklist']._getSelfState()
      let check = this.$refs['check']._getSelfState()

      if(
        (description == 2 || description == 4) &&
        (selfRepair == 2 || selfRepair == 4) &&
        (attachment == 2 || attachment == 4) &&
        (matter == 2 || matter == 4) &&
        (worklist == 2 || worklist == 4) &&
        (check == 2 || check == 4)){
          return true
      } else {
        return false
      }
    },

    /**
     * 获取三级坞修项数据
     */
    getDockItemInfo() {
      getDockItemInfo(this.treeItem3rd.id).then(res => {
        const target = res.data
        this.formData = target
        this.originCode = res.originCode
        this.attachments = target.attachments
        this.$store.commit('specification/SET_ORIGINCODE3RD', target.originCode)
        this.$store.commit('specification/SET_SPEC3RDMODALTITLE', target.specification)

        // 工作列表、验收项目FormData数据 { "1": true, "2": true, ... }
        this.workListFormData = target.includingWorks.reduce((all, cur) => (all[cur.id]=true, all), {})
        this.checkOptionsFormData = target.verificationParties.reduce((all, cur) => (all[cur.id]=true, all), {})
      })
    },

    /**
     * 审批流程数据
     */
    getFlowData(fromUserAction) {
      if(fromUserAction) {
        this.$emit('reload')   // 用户改变了流程状态，通知主视图刷新(主要表现在流程状态显示上)
      }

      getDockItemFlowData(this.treeItem3rd.id).then(res => {
        if(res.data.length) {
          this.flowData = res.data[0]
          this.flowDataAll = res.data
          this.flowStatus = res.data[0].status
        }
      })
    },

    /**
     * 获取所有有效的工作列表，生成FormConifg
     */
    getWorkListAll() {
      getWorkListAll().then(res => {
        const result = res.data.map(item => {
          return {
            type: 'checkbox',
            name: item.name,  // 用于显示，不用label是为了让checkbox在最前面
            key: item.id.toString(),
          }
        })
        this.workListConfig = result
      })
    },

    /**
     * 获取所有验收项目，生成FormConifg
     */
    getCheckOptionsAll() {
      getCheckOptionsAll().then(res => {
        const result = res.data.map(item => {
          return {
            type: 'checkbox',
            name: item.name,  // 用于显示，不用label是为了让checkbox在最前面
            key: item.id.toString(),
          }
        })
        this.checkOptionsConfig = result
      })
    },

    /**
     * FormMod分块保存
     */
    saveIt(formModName) {
      let form = this.$refs[formModName]._getSelfData()
      const res = []

      // 工作列表、验收项目数据提交前需要整理格式 includingWorks、verificationParties
      // [
      //   { id: 1 },
      //   { id: 2 },
      //   ...
      // ]
      if (formModName === 'worklist') {
        for (let key in form) { form[key] && res.push({id: key}) }
        form = { includingWorks: res }
      } else if (formModName === 'check') {
        for (let key in form) { form[key] && res.push({id: key}) }
        form = { verificationParties: res }
      }

      // 最终数据合并
      let data = Object.assign(this.formData, form, { id: this.treeItem3rd.id })
      updateDockItemInfo(data).then(res => {
        this.$message({showClose: true,message: this.$t('common.editOk'),type: 'success'})
        this.$refs[formModName]._triggerSaveState()
      })
    },

    // 附件更新(FormMod内嵌comp，要获取的是内嵌component的数据)
    saveItFromSlot(newData, formModName) {
      let data = Object.assign(this.formData, newData, { id: this.treeItem3rd.id } )
      updateDockItemInfo(data).then(res => {
        this.$message({showClose: true,message: this.$t('common.editOk'),type: 'success'})
        this.$refs[formModName]._triggerSaveState()
      })
    },

    getData() {
      this.getDockItemInfo()      // 坞修项数据(3级)
      this.getFlowData()          // 流程数据
      this.getWorkListAll()       // 工作列表
      this.getCheckOptionsAll()   // 验收项目
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style lang="scss">
@import '../../../../styles/variables.scss';

.dock-item-info {
  position: relative;
  .pos-absolute {
    position: absolute;
    z-index:1000;
    right: 10px;
    top:10px;
  }
  
  // checkbox禁用样式
  .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #606266;
    cursor: not-allowed;
  }
  .el-checkbox__input.is-disabled.is-checked {
    .el-checkbox__inner {
      background-color: $bg-color1;
      border-color: $bg-color1;
      color: #606266;
      &:after{
        border-color: #FFF;  // 对勾
      }
    }

  }
}
.flowportal-header{
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>