<template>
  <div
    class="tab-pane"
    :class="{ active: name == $parent.active }"
    v-show="name == $parent.active"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "BaseTabPane",
  props: {
    label: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
  },
};
</script>
