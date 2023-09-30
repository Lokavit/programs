<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-20 10:19:58
 * @LastEditTime: 2020-03-09 12:40:48
 -->
<template>
  <div class="contrast-base-fixed svg-bg-boat">
    <div class="modal-title">
      <svg-icon name="background-boat" width="20" height="20" />
      {{ $t('quote.contrast.base.title') }}
    </div>
    <ul>
      <li class="contrast-card-item">
        <div class="label">{{ $t('quote.contrast.base.name') }}</div>
        <div v-if="data" class="value">{{ data.vessel.name }}</div>
      </li>
      <!-- <li class="contrast-card-item">
        <div class="label">{{ $t('quote.contrast.base.type') }}</div>
        <div class="value" v-if="data">{{ data.vessel.type.name }}</div>
      </li>
      <li class="contrast-card-item">
        <div class="label">{{ $t('quote.contrast.base.number') }}</div>
        <div class="value" v-if="data">{{ data.vessel.shipIdentificationNumber }}</div>
      </li>
      <li class="contrast-card-item">
        <div class="label">{{ $t('quote.contrast.base.startAt') }}</div>
        <div class="value" v-if="data">{{ data.startAt }}</div>
      </li>
      <li class="contrast-card-item">
        <div class="label">{{ $t('quote.contrast.base.endAt') }}</div>
        <div class="value" v-if="data">{{ data.endAt }}</div>
      </li>
      <li class="contrast-card-item">
        <div class="label">{{ $t('quote.contrast.base.desc') }}</div>
        <div class="value" v-if="data">{{ data.description }}</div>
      </li> -->
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    data: Object | Array
  }
}
</script>

<style lang="scss">

</style>
