<template>
  <label @dblclick.ctrl="modifyLabel" class="label_hidden" :for="value">
    <span v-if="isRequired" style="display:inline-block;font-size=:12px;color:red;line-height:12px;margin-right:2px;">*</span>
    <template v-if="isEnableTooltip">
      <el-tooltip :content="labelTitle" placement="top">
        <span class="label_hidden">{{ labelTitle.replace(":", "") }}</span>
      </el-tooltip>
    </template>
    <template v-else>{{ labelTitle.replace("：", "") }}</template>

    <el-dialog title="更改标注" :visible="dialogFormVisible" :modal-append-to-body="false" modal-append-to-body :append-to-body="true" :before-close="cancelHandler">
      <el-form size="mini">
        <el-form-item label="原始标注">
          <el-input v-model="defaultLabel" disabled></el-input>
        </el-form-item>
        <el-form-item label="更改标注">
          <el-input v-model="newLabel" placeholder="请输入标注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="confirmHandler">确 定</el-button>
        <el-button @click="cancelHandler">取 消</el-button>
      </div>
    </el-dialog>
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
      // 对话框显隐控制变量
      dialogFormVisible: false,
      labelTitle: this.label, // 转一道，用于本组件中使用
      newLabel: "" // 于弹出框中，输入的新标注
      // isEnableTooltip: false // 是否启用Tooltip,默认禁用
    };
  },
  computed: {
    // 原始标注
    defaultLabel() {
      return this.labelTitle.charAt(this.labelTitle.length - 1) == ":"
        ? this.labelTitle.substring(0, this.labelTitle.length - 1)
        : this.labelTitle;
    },
    // 是否启用Tooltip,默认禁用
    isEnableTooltip() {
      if (this.labelTitle.length > 7) {
        return true;
      }
    }
  },
  methods: {
    /** 修改标注 */
    modifyLabel() {
      this.dialogFormVisible = true;
      // 该修改完成，需提交至后台，存储。
      // console.log("???:", this.$store.dispatch("label/getLabels", labels));
    },
    /**
     * 对话框的确定事件
     */
    confirmHandler() {
      this.dialogFormVisible = false;
      // 处理用户自己写的时候，加了中文冒号
      this.newLabel =
        this.newLabel.charAt(this.newLabel.length - 1) == ":"
          ? this.newLabel.substring(0, this.newLabel.length - 1)
          : this.newLabel;

      this.labelTitle = this.newLabel;
      this.newLabel = ""; // 清空更改标注的值，保证下一次打开时为空
    },
    /**
     * 对话框的取消事件
     */
    cancelHandler() {
      this.dialogFormVisible = false;
      this.newLabel = ""; // 清空更改标注的值，保证下一次打开时为空
    }
  }
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
  max-width: 80px;
}
</style>