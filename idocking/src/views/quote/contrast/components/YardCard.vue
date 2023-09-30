<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-20 10:19:58
 * @LastEditTime: 2019-11-27 18:02:17
 -->
<template>
  <div :class="[
    'contrast-card', 
    { 'active': active }
  ]">
    <div v-if="data" class="contrast-card-main">
      <div class="modal-title">
        {{ targetYardInfo.quotationParty && targetYardInfo.quotationParty.name }}
      </div>
      <ul>
        <li class="contrast-card-item">
          <div class="label">{{ $t('quote.contrast.yard.contact') }}</div>
          <div class="value">{{ (targetYardInfo.quotationParty && targetYardInfo.quotationParty.liaison) || '—' }}</div>
        </li>
        <li class="contrast-card-item">
          <div class="label">{{ $t('quote.contrast.yard.email') }}</div>
          <div class="value">{{ (targetYardInfo.quotationParty && targetYardInfo.quotationParty.email) || '—' }}</div>
        </li>
        <li class="contrast-card-item">
          <div class="label">{{ $t('quote.contrast.yard.phone') }}</div>
          <div class="value">{{ (targetYardInfo.quotationParty && targetYardInfo.quotationParty.telephone) || '—' }}</div>
        </li>

        <div class="line"></div>
        <li class="contrast-card-item">
          <div class="label">{{ $t('quote.contrast.yard.enterYard') }}</div>
          <div class="value" v-if="targetYardInfo.offeredAt ">{{ targetYardInfo.offeredAt | timeFormat('YYYY-MM-DD') }}</div>
        </li>
        <div class="line"></div>

        <li class="contrast-card-item">
          <div class="label">{{ $t('quote.contrast.yard.repairCost') }}</div>
          <div class="value">{{ targetYardInfo.subTotal ? currencyFormat(targetYardInfo.subTotal) : '—' }}</div>
        </li>
        <li class="contrast-card-item">
          <div class="label">{{ $t('quote.contrast.yard.extraDiscount') }}</div>
          <div class="value">{{ computedExtraDiscountAmount() || '—' }}</div>
        </li>
        <div class="line"></div>

        <li class="contrast-card-item">
          <div class="label">{{ $t('quote.contrast.yard.finalCost') }}</div>
          <div class="value final-cost">{{ targetYardInfo.subTotal ? (currencyFormat(targetYardInfo.subTotal * (1 - targetYardInfo.extraDiscount))) : '—' }}</div>
        </li>
      </ul>

      <div class="btn-select">
        <id-button text="quote.contrast.yard.btnSelect" @click="handleSelectYard"></id-button>
      </div>
    </div>
    <div v-else class="contrast-card-main svg-bg-boat">
      <div class="nodata-tip">{{ $t('common.nothing') }}</div>
      <div class="btn-select">
        <id-button text="quote.contrast.yard.btnSelect" @click="handleSelectYard"></id-button>
      </div>
    </div>
  </div>
</template>

<script>
import IdButton from '@/components/IdButton'
import { mapGetters } from 'vuex'

export default {
  props: {
    data: Object | Array,
    column: Number,
    active: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'yardInfo1',
      'yardInfo2',
      'yardInfo3'
    ]),
    targetYardInfo() {
      return this['yardInfo' + this.column]
    }

  },
  components: { IdButton },
  methods: {
    handleSelectYard() {
      this.$emit('select-yard')
    },
    computedExtraDiscountAmount() {
      // console.log(this.targetYardInfo)
      // console.log(this.targetYardInfo.subTotal)
      // console.log(this.targetYardInfo.extraDiscount)

      let discount = this.discountFormat(this.targetYardInfo.extraDiscount)
      let amount = this.currencyFormat(this.targetYardInfo.subTotal * this.extraDiscount)
      let formatStr = `- ${discount}`

      return formatStr
    }
  }
}
</script>

<style lang="scss">
@import '../../../../styles/variables.scss';

.contrast-card{
  &.active{
    transition: all 0.2s ease;
    background-color: #F4E7E1;
    border: 4px solid #F4F495;
    .label{
      color: #AE5C30;
    }
    .value{
      color: #AE5C30;
    }
  }

  padding: 0 15px;
  background-color: #FFF;
  box-sizing: border-box;
  height: 400px;
  .modal-title{
    height: 60px;
    line-height: 70px;
  }
  .line{
    height: 1px;
    background-color: rgba(174,92,48,0.2);
    margin: 7px 0;
  }
  &-item{
    font-size: 13px;
    display: flex;
    padding: 8px 0;
    justify-content: space-between;
    .label{
      width: 100px;
      color: #7E7E7E;
      font-weight: bold;
    }
    .value{
      flex:1;
      color: #7D7D7D;
      text-align:right;
    }
    .final-cost{
      font-weight: bold;
      font-size: 16px;
      color: $bg-color;
    }
  }
  &-main{
    width: 100%;
    height: 100%;
    position: relative;
    .nodata-tip{
      position: absolute;
      color: #ACACAC;
      left:0;
      right:0;
      bottom:130px;
      font-size: 13px;
      text-align: center;
    }
    .btn-select{
      position: absolute;
      left:0;
      right:0;
      bottom:30px;
      text-align: center;
      .el-button--mini, .el-button--mini.is-round{
        padding: 10px 40px;
      }
    }
  }

  .svg-bg-boat{
    background-image: url(background-boat.svg);
    background-size: 140px 140px;
    background-repeat: no-repeat;
    background-position: center 100px;
  }
}

</style>