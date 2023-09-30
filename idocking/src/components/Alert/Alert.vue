<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-24 11:38:38
 * @LastEditTime: 2020-03-09 12:56:56
 -->
<template>
  <div class="pf-mask">
    <div class="pf-alert">
      <div class="pf-alert-hd">{{ title }}</div>
      <div class="pf-alert-by">{{ msg }}</div>
      <div class="pf-alert-bt btn-primary" @click.stop="closeAlert">{{ buttonText }}</div>
    </div>
  </div>
</template>

<style lang="stylus">
@import '../../../style/mixins.styl'
@import '../../../style/var.styl'

.pf-alert
  width 80%
  box-sizing border-box
  border-radius 4px
  background-color $dialog-bg
  animation: pf-zoom-in .15s ease ;
  &-hd
    line-height $dialog-title-height;
    text-align center
    font-weight bold
  &-by
    text-align: left;
    padding: 0 20px;
    font-size: 14px;
    color: $dialog-text-color;
    line-height: 20px;
    word-break: break-all;
  &-bt
    line-height: $dialog-btn-height;
    margin-top: 14px;
    text-align:center;
    border-1px(,top)
    &.btn-primary
      color: $theme-color;
    &:active
      background-color $dialog-btn-bg-active
</style>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    msg: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: '确定'
    }
  }
}
</script>
