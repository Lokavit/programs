<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-20 10:19:58
 * @LastEditTime: 2019-11-27 19:44:09
 -->
<template>
  <div class="contrast-card-fixed">
    <div class="contrast-card-main">
      <div class="modal-title">
        {{ targetYardInfo.quotationParty && targetYardInfo.quotationParty.name }}
      </div>
      <ul v-if="targetYardInfo.quotationParty">
        <li class="contrast-card-item">
          <div class="label">{{ $t('quote.contrast.yard.finalCost') }}</div>
          <div class="value final-cost">{{ targetYardInfo.subTotal ? (currencyFormat(targetYardInfo.subTotal * (1 - targetYardInfo.extraDiscount))) : '—' }}</div>
        </li>
      </ul>
      <div class="btn-select">
        <id-button text="quote.contrast.yard.btnSelect" @click="handleSelectYard"></id-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import IdButton from '@/components/IdButton'

export default {
  components: { IdButton },
  props: {
    data: Object | Array,
    column: Number
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
  methods: {
    handleSelectYard() {
      this.$emit('select-yard')
    }
  }
}
</script>

<style lang="scss">
.contrast-card-fixed{
  height: 100%;
  position: relative;
  .contrast-card-main{
    position: normal !important;
    .btn-select{
      bottom: -5px;
    }
  }
}
</style>