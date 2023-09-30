<template>
  <div id="KftTransfer" class="layout-flex-row">
    <div class="transfer-left">
      <h3>{{transferData.left.title}}</h3>
      <slot name="leftPanel"></slot>
    </div>
    <div class="transfer-center">
      <slot name="centerOperate"></slot>
    </div>
    <div class="transfer-right">
      <h3>{{transferData.right.title}}</h3>
      <slot name="rightPanel"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "KftTransfer",
  props: {
    transferData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  }
};
</script>
