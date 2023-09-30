<template>
  <div role="tabs">
    <div class="tabs-nav">
      <div
        class="draw_border"
        v-for="(item, index) in tabsTab"
        @click="tabClick(item)"
        :class="{ active: active == item.name }"
      >
        {{ item.label }}
      </div>
    </div>

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "BaseTabs",
  props: {
    value: {
      type: String,
      default: "",
    },
    onChange: {
      type: Function,
      default: function() {},
    },
  },
  data() {
    return {
      tabsTab: this.$children,
      active: this.value, // 当前显示的
    };
  },
  methods: {
    tabClick(item) {
      // console.log("BaseTabs:", item);
      this.active = item.name;
      this.$emit("input", item.name); // v-model双向绑定
      this.onChange ? this.onChange(item.name) : "";
    },
  },
};
</script>
