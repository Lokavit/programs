<template>
  <svg
    :width="width"
    :height="height"
    :class="svgClass"
    v-on="$listeners"
  >
    <use :xlink:href="iconId"></use>
  </svg>
</template>

<script>
export default {
  name: "Icon",
  props: {
    iconClass: {
      type: String, // 圖標類
      default: ""
    },
    className: {
      type: String, // 類名
      default: ""
    },
    iconName: {
      type: String,
      default: "box"
    },
    width: {
      type: [Number, String],
      default: 12
    },
    height: {
      type: [Number, String],
      default: 12
    }
  },
  computed: {
    iconId() {
      return `#icon-${this.iconName}`;
    },
    svgClass() {
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    }
  }
};
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
