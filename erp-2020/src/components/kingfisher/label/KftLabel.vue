<template>
  <label class="label_hidden" :for="value">
    <!-- 标星 -->
    <span v-if="isRequired" class="label_star"></span>
    <!-- 非标星需要占位 -->
    <span v-if="!isRequired" class="label_no_star"></span>
    <!-- 文本内容 -->
    <template v-if="labelTitle.length>6">
      <el-tooltip :content="labelTitle" placement="top">
        <span class="label_hidden">{{ labelTitle}}</span>
      </el-tooltip>
    </template>
    <template v-else>{{ labelTitle}}</template>
  </label>
</template>

<script>
export default {
  /**
   * 自封装 label组件，ctrl+鼠标左键双击，调出弹窗，对当前label明文进行更改
   * 通常用于实施部署时，便捷操作。
   */
  name: "KftLabel",
  props: {
    /** Label明文 */
    label: { type: String, default: "" },
    /** label标签 for属性的值 */
    value: { type: String, default: "" },
    /** 标识是否为必填项 */
    isRequired: { type: Boolean, default: false }
  },
  data() {
    return {
      labelTitle: this.label // 转一道，用于本组件中使用
    };
  },
  computed: {},
  methods: {}
};
</script>


<style lang="scss">
/* 标注文本超长以...表示 */
.label_hidden {
  -o-text-overflow: ellipsis;
  -webkit-text-overflow: ellipsis;
  -moz-text-overflow: ellipsis;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: keep-all;
  max-width: 72px; /* label最大宽度 */
}
</style>