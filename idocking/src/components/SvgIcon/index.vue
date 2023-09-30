<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 10:12:50
 * @LastEditTime: 2020-03-09 13:40:52
 -->
<template>
  <svg
    aria-hidden="true"
    :title="title"
    :class="iconClass"
    :width="width"
    :height="height"
    :color="color"
  >
    <title>{{ title }}</title>
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon', // 全局svg组件
  props: {
    name: {
      type: String,
      required: true
    },
    svgClass: {
      type: String,
      default: ''
    },
    width: {
      type: String | Number,
      default: '16px'
    },
    height: {
      type: String | Number,
      default: '16px'
    },
    color: {
      type: String,
      default: '#A6C8F0'
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconName() {
      return `#icon-${this.name}`
    },
    iconClass() {
      if (this.svgClass) {
        return `svg-icon-set${this.svgClass}`
      } else {
        if (this.width && this.height) {
          return 'svg-icon-set'
        } else {
          return 'svg-icon'
        }
      }
    }
  }
}
</script>
<style >
.svg-icon{
  width: 16px;
  height: 16px;
  fill: currentColor;
  overflow: hidden;
  padding:0 8px 0 0;
  vertical-align: -3px;
  color:inherit;
}
.svg-icon-set{
  fill: currentColor;
  overflow: hidden;
  color:inherit;
}
</style>
