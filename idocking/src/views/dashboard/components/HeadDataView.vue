<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-16 09:20:52
 * @LastEditTime: 2020-03-09 12:41:24
 -->

<template>
  <div class="head-data-view box-shadow reset-ul-li">
    <ul class="head-wrapper">
      <li class="head-item">
        <p class="head-text">{{ $t('dashboard.main.head.flow') }}</p>
        <div class="head-number">
          <svg-icon name="head-to-do-list" :width="24" :height="24" />
          <span class="number"><countTo :start-val="0" :end-val="COUNT_FLOW" :duration="1000" /></span>
        </div>
      </li>

      <li class="head-item">
        <p class="head-text">{{ $t('dashboard.main.head.plan') }}</p>
        <div class="head-number">
          <svg-icon name="head-plan" :width="24" :height="24" />
          <span class="number"><countTo :start-val="0" :end-val="COUNT_PROJECT" :duration="1000" /></span>
        </div>
      </li>

      <li class="head-item">
        <p class="head-text">{{ $t('dashboard.main.head.vessel') }}</p>
        <div class="head-number">
          <svg-icon name="head-fleet-number" :width="24" :height="24" />
          <span class="number"><countTo :start-val="0" :end-val="COUNT_VESSEL" :duration="1000" /></span>
        </div>
      </li>

      <li class="head-item">
        <p class="head-text">{{ $t('dashboard.main.head.news') }}</p>
        <div class="head-number">
          <svg-icon name="head-message" :width="24" :height="24" />
          <span class="number"><countTo :start-val="0" :end-val="COUNT_NEWS" :duration="1000" /></span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import countTo from '@/components/CountTo' // 数字滚动插件
import { mapState } from 'vuex'

export default {
  components: {
    countTo
  },
  computed: {
    ...mapState({
      COUNT_FLOW: state => state.dashboard.COUNT_FLOW,
      COUNT_PROJECT: state => state.dashboard.COUNT_PROJECT,
      COUNT_VESSEL: state => state.dashboard.COUNT_VESSEL,
      COUNT_NEWS: state => state.dashboard.COUNT_NEWS
    })
  }
}
</script>

<style lang="scss">
// 盒子的padding
$padding: 20px 30px;
// 数字的字号
$fontSizeNum: 32px;
// head-item标题文字
$head-text:11px;
// head文字颜色
$head-text-color:#B0B0B0;

.head-data-view{
  width: 100%;
  padding: $padding;
  background-color:rgba(255,255,255,1);
  box-sizing:border-box;
  .head-wrapper{
    display:flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .head-item{
      text-align: left;
      // border: 1px solid #abc;
      .head-text{
        text-indent: 37px;
        line-height: 16px;
        color:$head-text-color;
        font-size: $head-text;
        font-weight: bold;
      }
      .head-number{
        .number{
          margin-left:8px;
          font-size: $fontSizeNum;
          color: #2E2F2F;
        }
      }
    }
  }
}
</style>
