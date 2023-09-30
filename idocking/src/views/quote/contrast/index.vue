<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-20 08:23:18
 * @LastEditTime: 2019-11-29 14:13:47
 -->
<template>
  <div class="contrast">
    <div class="contrast-info">
      <div class="contrast-info-0">
        <base-card :data="projectInfo"></base-card>
      </div>
      <div class="contrast-info-1" >
        <yard-card :data="yardInfo1" :active="activeIndex == 1" :column=1 @select-yard="handleSelectYard(1)"></yard-card>
      </div>
      <div class="contrast-info-2" >
        <yard-card :data="yardInfo2" :active="activeIndex == 2" :column=2 @select-yard="handleSelectYard(2)"></yard-card>
      </div>
      <div class="contrast-info-3" >
        <yard-card :data="yardInfo3" :active="activeIndex == 3" :column=3 @select-yard="handleSelectYard(3)"></yard-card>
      </div>
    </div>

    <div class="contrast-info-fixed">
      <div class="contrast-info-0">
        <base-card-fixed :data="projectInfo"></base-card-fixed>
      </div>
      <div class="contrast-info-1">
        <yard-card-fixed :data="yardInfo1" :column=1 @select-yard="handleSelectYard(1)"></yard-card-fixed>
      </div>
      <div class="contrast-info-2">
        <yard-card-fixed :data="yardInfo2" :column=2 @select-yard="handleSelectYard(2)"></yard-card-fixed>
      </div>
      <div class="contrast-info-3">
        <yard-card-fixed :data="yardInfo3" :column=3 @select-yard="handleSelectYard(3)"></yard-card-fixed>
      </div>
    </div>

    <div class="btn-open" @click="isActive = true" v-show="!isActive">
      <span style="margin-right:10px;">{{ $t('quote.contrast.btnOpen') }}</span>
      <i class="el-icon-caret-bottom"></i>
    </div>

    <div v-show="isActive" class="separation-line box-shadow"></div>
    <el-collapse-transition>
      <tree-building 
        v-show="isActive" 
        class="tree-table"
        :referSpecId="referSpecId"
        :yardInfo1="yardInfo1"
        :yardInfo2="yardInfo2"
        :yardInfo3="yardInfo3"
      ></tree-building>
    </el-collapse-transition>

    <id-dialog 
      v-model="selectQuotationVisible"
      :title="$t('quote.addModal.titles')"
      :box-shadow="false"
      :box-padding="false"
      :footer="false">
      <select-quotation 
        v-if="selectQuotationVisible" 
        :selectedQuotations="selectedQuotations"
        :referSpecId="referSpecId" 
        @selectIt="selectIt"
        :status="status">
      </select-quotation>
    </id-dialog>
  </div>
</template>

<script>
import { getQuotationInfo } from '@/api/quote'
import { getProjectInfo } from '@/api/project'
import BaseCard from './components/BaseCard'
import YardCard from './components/YardCard'
import BaseCardFixed from './components/BaseCardFixed'
import YardCardFixed from './components/YardCardFixed'
import TreeBuilding from './components/TreeBuilding'
import SelectQuotation from '@/modals/SelectQuotation'

export default {
  name:'quote-contrast',
  components: { 
    BaseCard, 
    BaseCardFixed, 
    YardCard, 
    YardCardFixed, 
    TreeBuilding, 
    SelectQuotation 
  },
  data() {
    return {
      quotationIds: [],
      referSpecId: null,  // 传给Modal【SelectQuotation】,限制比价可选的规格书
      referProjectId: null,
      projectInfo:null,
      isActive:false,
      activeIndex:-1,
      selectQuotationVisible: false,
      status: null,       // 传给Modal【SelectQuotation】,限制比价可选的规格书审批状态
      column:-1,
      selectedQuotations:[-1, -1, -1],
      yardInfo1:null,
      yardInfo2:null,
      yardInfo3:null,
    }
  },
  methods: {
    handleSelectYard(column) {
      this.column = column
      this.selectQuotationVisible = true
    },
    // Modal选择某一询价单
    selectIt(row) {
      let quotationId = row.id

      getQuotationInfo(quotationId).then(res => {
        this['yardInfo' + this.column] = res.data

        // 异步成功才更新“已选询价单”，保证获取失败时可以重复选择。
        this.selectedQuotations[this.column - 1] = quotationId
      })
    },

    getData() {
      let that = this
      let promises = []

      if(this.quotationIds.length) {
        this.quotationIds.forEach((quotationId,index) => {
          if(!quotationId) return

          promises.push(getQuotationInfo(quotationId))
        })

        Promise.all(promises).then(res => {

          console.log(res);
          res.forEach((item,index) => {

            // 根据询价单ID，获取其对应的规格书和项目ID
            that.referSpecId = item.data.referSpecificationId
            that.referProjectId = item.data.dockingProject.id


            // 【*】船厂的报价数据
            that['yardInfo' + (index + 1)] = item.data

            // quotationId从url获取为string类型，实际我们需要int类型
            that.selectedQuotations[index] = parseInt(item.data.id)
            

            // 坞修项目基本数据
            if(index == 0) {
              getProjectInfo(that.referProjectId).then(res2 => {
                that.projectInfo = res2.data
              })
            }
          })
        })


      }
    },
    /**
     * 缺少节流功能，后期优化
     */
    bindEvents() {
      let cardOffsetTop = document.querySelector(".contrast-info").offsetTop
      let cardHeight = document.querySelector(".contrast-info").offsetHeight
      this.cardFixed = document.querySelector(".contrast-info-fixed")
      this.threshold = cardOffsetTop + cardHeight - 120   // 触发fixed布局的滚动阀值

      document.querySelector('.el-main').addEventListener("scroll", e => {
        this._handleWindowScroll(e)
      }, false);
      window.onresize = e => {
        this._handleWindowResize(e)
      }
    },
    _handleWindowScroll(e) {
      this.scrollTop = e.target.scrollTop

      if(this.scrollTop > this.threshold) {
        // fixed
        this.cardFixed.classList.add('show')
      } else {
        this.cardFixed.classList.remove('show')
      }
    },
    _handleWindowResize(e) {
      let cardFixedWidth = document.querySelector(".contrast").offsetWidth
      document.querySelector(".contrast-info-fixed").style.width = cardFixedWidth + 'px'
    }
  },
  created() {
    let { qId, qId2, qId3 } = this.$route.query

    if(qId) {
      this.quotationIds[0] = this.selectedQuotations[0] = qId
    }
    if(qId2) {
      this.quotationIds[1] = this.selectedQuotations[1] = qId2
    }
    if(qId3) {
      this.quotationIds[2] = this.selectedQuotations[2] = qId3
    }

    // 【重要】页面resize、scroll此变量会被大量访问，通过Object.freeze(),让Vue跳过响应式处理，提升性能
    this.scrollTop = 0
    this.getData()
  },
  mounted() {
    this.bindEvents()
    this._handleWindowResize()
  },
  destroyed() {
    // 事件销毁
    // document.querySelector('.el-main').removeEventListener('scroll')
    // window.onresize = null
  }
}
</script>

<style lang="scss">
@import '../../../styles/variables.scss';

.contrast{
  border: 2px solid #DCDCDC;
  margin-bottom: 30px;
  &-info{
    display: flex;
    > div{
      box-sizing: border-box;
      border-right: 2px solid #F3F2F9;
      &:last-child{
        border-right: none;
      }
    }
    &-0{
      flex:3;
      width: 0;
      // width: 400px;
    }
    &-1,&-2,&-3{
      width: 0;
      flex:2;
      
    }
  }
  .btn-open{
    height: 50px;
    cursor: pointer;
    color: rgb(32, 51, 93);
    font-weight: bold;
    background-color: #FFF;
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tree-table{
    // margin-top: 5px;
    // margin-bottom: 30px;
  }
}

// yardcard的Fixed布局
.contrast-info-fixed{
  position: fixed;
  top: 48px;
  opacity: 0;
  width: 100%;
  display: flex;
  z-index: -1;
  background-color: #CCC;
  transition: all 0.6s ease;
  > div { 
    padding: 10px;
    border-right: 2px solid #F3F2F9;
    box-sizing: border-box!important;
    height: 100px;
  }
  > div:first-child{
    flex: 3;
    width: 0;
  }
  > div:not(:first-child){
    flex: 2;
    width: 0;
  }
  &.show{
    opacity: 1;
    z-index: 999;
  }
}
</style>