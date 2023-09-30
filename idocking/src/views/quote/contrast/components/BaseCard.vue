<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-20 10:19:58
 * @LastEditTime: 2020-03-09 12:50:25
 -->
<template>
  <div class="contrast-card contrast-base svg-bg-boat">
    <div class="modal-title">
      <svg-icon name="background-boat" width="20" height="20" />
      {{ $t('quote.contrast.base.title') }}
    </div>
    <ul>
      <li class="contrast-card-item">
        <div class="label">{{ $t('quote.contrast.base.name') }}</div>
        <div v-if="data" class="value">{{ data.vessel.name }}</div>
      </li>
      <li class="contrast-card-item">
        <div class="label">{{ $t('quote.contrast.base.type') }}</div>
        <div v-if="data" class="value">{{ data.vessel.type.name }}</div>
      </li>
      <li class="contrast-card-item">
        <div class="label">{{ $t('quote.contrast.base.number') }}</div>
        <div v-if="data" class="value">{{ data.vessel.shipIdentificationNumber }}</div>
      </li>
      <li class="contrast-card-item">
        <div class="label">{{ $t('quote.contrast.base.startAt') }}</div>
        <div v-if="data" class="value">{{ data.startAt }}</div>
      </li>
      <li class="contrast-card-item">
        <div class="label">{{ $t('quote.contrast.base.endAt') }}</div>
        <div v-if="data" class="value">{{ data.endAt }}</div>
      </li>
      <li class="contrast-card-item2">
        <div class="label">{{ $t('quote.contrast.base.desc') }}</div>
        <div v-if="data" class="value" v-html="data.description" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    data: Object | Array,
    default: () => {
      return {}
    }
  }
}
</script>

<style lang="scss">
.contrast-base{
  .modal-title{
    color: #2E2F2F;
    font-size: 13px;
  }
  ul,li{
    list-style: none;
  }
  .contrast-card-item{
    .value{
      flex:1;
      color: #7D7D7D;
      text-align:left;
    }
  }
  .contrast-card-item2{
    > div{
      color: #7E7E7E;
      font-size: 13px;
    }
    .label{
      width: 100px;
      font-weight: bold;
      padding: 6px 0;
    }
    .value{
      height: 150px;
      overflow-x: hidden;
      overflow-y: auto;
      width: 100%;
      word-wrap:break-word;
    }
  }

  &.svg-bg-boat{
    background-image: url(background-boat.svg);
    background-size: 160px 160px;
    background-repeat: no-repeat;
    background-position: 90% 90%;
  }
}

</style>
