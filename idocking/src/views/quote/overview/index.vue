<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-14 10:49:14
 * @LastEditTime: 2019-11-28 10:48:36
 -->
<template>
  <div class="quote-overview">
    <div class="quote-overview-info box-shadow padding svg-bg-boat">
      <form-mod-title
        text="quote.overview.base.titleQuote"
        :toolbar=false
        @edit="editIt"
        @save="saveIt"
        @cancel="cancelIt">
      </form-mod-title>
      <form-mod
        :form-config="baseInfoConfig"
        :form-data="quotationInfo"
        :title="$t('quote.overview.base.titleBase')"
        ref="formMod"
        :toolbar=false
        :column=3
        :type=2>
      </form-mod>
      <power-button :quotationId="quoteId" :quotationStatus="quotationStatus" @state-change="getData" class="power-button"></power-button>
    </div>

    <!-- 描述 + 操作按钮组 -->
    <!--
    <div class="separation-line box-shadow"></div>
    <div class="box-shadow padding ">
      <div class="info-title">{{ $t('quote.overview.base.titleDesc') }}</div>
    </div> 
    -->

    <div class="separation-line box-shadow"></div>
    <div class="quote-overview-tree box-shadow padding" v-if="quoteId">
      <div class="info-title">
        {{ $t('quote.overview.tree.title') }}
      </div>
      <table-view :quotationTree="quotationTree" @dataCalcOk="updateBaseInfo"></table-view>
    </div>

    <!-- 审批流程 -->
    <div class="separation-line box-shadow" v-if="flowData"></div>
    <div class="quote-flow padding box-shadow" v-if="flowData">
      <div class="flowportal-header">
        <div class="info-title">
          <i class="kft-icon-volumn" style="margin-right:6px;"></i>
          <span>{{ $t('project.overview.flow.title') }}</span>
        </div> 
        <div class="step-btns">
          <id-button icon='s-data' text="project.overview.btnHistory" @click="selectHistoryVisible = true"></id-button>
        </div>  
      </div>

      <div v-if="flowData && quoteFlowStatus!=='DRAFTING'">
        <flow-portal :flow-data="flowData" ></flow-portal>
      </div>
    </div>

    <id-dialog v-model="selectHistoryVisible" width="55%" :footer="false" :title="$t('project.overview.flow.history.title')">
      <history-flow v-if="selectHistoryVisible" :flow-data="flowDataAll"></history-flow>
    </id-dialog>
  </div>
</template>

<script>
import { getQuotationInfo, getSpecBriefTree, getApprovalFlows } from '@/api/quote'
import BaseInfoMixin from './mixins/BaseInfo'
import LevelListMixin from '@/mixins/LevelListMixin'
import TableView from './components/TableView'
import FormModTitle from './components/FormModTitle'
import IdButton from '@/components/IdButton'
import PowerButton from './components/PowerButton'
import FlowPortal from '@/components/FlowPortal'
import HistoryFlow from '@/modals/HistoryFlow'
import { mapGetters } from 'vuex'

export default {
  name: 'quote-overview',
  provide() {
    return {
      _quoteOverview: this
    }
  },
  components: { FormModTitle, TableView, IdButton, PowerButton, FlowPortal, HistoryFlow },
  mixins: [BaseInfoMixin, LevelListMixin],
  data() {
    return {

      quoteId: null,             // 规格书ID
      quotationInfo: null,       // 询价单详情
      quotationTree: null,       // Tree
      quotationStatus: null,     // 询价单状态(草拟、已报价、待审批、已审批、已成交、已拒绝)
      flowData:null,             // 审批流
      flowDataAll:[],            // 流程历史记录
      editing:false,             // 是否处于编辑状态
      quoteFlowStatus:null,      // 流程状态
      selectHistoryVisible:false,// 流程历史
      powerBtns:[],              // power-button返回的权限状态
      externalGrandDiscount: 1   // 折上折，折扣
    }
  },
  methods: {
    editIt(){
      this.$refs['formMod']._triggerEditState()
    },
    saveIt(){
      this.$refs['formMod']._triggerSaveState()
    },
    cancelIt(){
      this.$refs['formMod']._triggerCancelState()
    },
    // tree递归上下计算完成的数据，反馈给BaseInfo
    updateBaseInfo(data) {
      // 额外折扣就是再打几折，额外折扣如果为0，那就是不打折(*1)
      // let finalTotal = data.totalAfterDiscount * ( this.externalGrandDiscount || 1 )
      // 便宜了多少，off
      let finalTotal = data.totalAfterDiscount * ( 1 - this.externalGrandDiscount || 0 )

      this.$set(this.quotationInfo, 'totalNoExtraDiscount', this.currencyFormat(data.totalAfterDiscount, 2) )
      this.$set(this.quotationInfo, 'FinalTotal', this.currencyFormat(finalTotal, 2) )
    },
    // 列表页已准备完毕的静态数据，赋值给BaseInfo
    updateBaseInfoFromListPage(data) {
      let listData = this.$store.getters.quotationLine

      // this.$set(this.quotationInfo, 'name', listData.name)           // 坞修厂
      // this.$set(this.quotationInfo, 'liaison', listData.liaison)     // 联系人
      // this.$set(this.quotationInfo, 'email', listData.email)         // 邮件
      // this.$set(this.quotationInfo, 'telephone', listData.telephone) // 电话
    },
    getData() {
      if(this.quoteId) {
        getQuotationInfo(this.quoteId).then(res => {
          this.quotationTree = res.data.items
          this.externalGrandDiscount = res.data.externalGrandDiscount

          res.data.vesselType = res.data.vessel.type.name  // 把船舶类型提出来，用于界面展示
          res.data.vesselNo = res.data.vessel.shipIdentificationNumber
          res.data.extraDiscount = this.discountFormat(res.data.externalGrandDiscount)
          res.data.dockProject = res.data.dockingProject.name
          res.data.offeredAt = res.data.offeredAt ? this.timeFormat(res.data.offeredAt, 'YYYY-MM-DD') : ''

          res.data.yardName = res.data.quotationParty.name
          res.data.liaison = res.data.quotationParty.liaison
          res.data.email = res.data.quotationParty.email
          res.data.telephone = res.data.quotationParty.telephone
          res.data.status = res.data.status

          // 用于导出询价单时，给Excel命名
          this.$store.commit('quote/SET_EXPORT_EXCEL_NAME', res.data.name)
          this.quotationInfo = res.data
          this.quotationStatus = res.data.status
        })

        // 审批流程相关数据
        getApprovalFlows(this.quoteId).then(res => {
          this.flowData = res.data[0]
          this.flowDataAll = res.data
        })
      }
    }
  },
  watch: {
    // hack，无奈之举。列表页数据已经存在，而详情异步数据尚未返回，页面内容尚未初始化，
    // 所以需要待页面自身数据初试完成后，再讲列表页静态数据赋值
    quotationTree() {
      this.updateBaseInfoFromListPage()
    }
  },
  created() {
    this.quoteId = this.$route.query.id
    this.getData()
  },
}
</script>

<style lang="scss">
.quote-overview{
  &-info{
    position: relative;
    .info-title{
      font-size: 14px;
    }
    .power-button{
      position: absolute;
      right:20px;
      top:20px;
    }
  }
  .modal-title{
    margin: 10px 0;
  }
  .quote-flow{
    margin-bottom: 30px;
  }
  .flowportal-header{
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .svg-bg-boat{
    background-image: url(background-boat.svg);
    background-size: 227px 227px;
    background-repeat: no-repeat;
    background-position: right bottom;
  }
}

</style>
