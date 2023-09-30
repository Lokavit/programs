<template>
  <div>
    <el-input v-model="value" :readonly="true" :placeholder="placeholder" size="mini" class="choose">
      <template v-if="showDetail" slot="prepend">
        <KftDetail :detail-code="detailFormCode" :detail-title="datailFormTitle"></KftDetail>
      </template>
      <template v-if="showChoose" slot="append">
        <el-button size="mini" icon="el-icon-search" type="primary" @click="handleChoose"></el-button>
      </template>
    </el-input>
    <!-- 尝试解藕的chooseDialog 弹层区域 -->
    <template v-if="dialogShow">
      <KftChooseDialog :code="code" :projectEntry="projectEntry" :dialog-visible="dialogShow" @on-comfirm="confirmHandler" @on-cancel="cancelHandler" :single="single" :search="search"></KftChooseDialog>
    </template>
  </div>
</template>

<script>
import chooseTypes from "./chooseTypes.json";
export default {
  name: "KftChoose",
  props: {
    value: { type: String },
    placeholder: { type: String, default: "" },
    // 查询按钮所需，表示需请求的数据集
    code: { type: String, default: "" },
    showDetail: { type: Boolean, default: false },
    showChoose: { type: Boolean, default: true },
    // 尝试添加项目编码进来 用于作业类型
    projectEntry: { type: String, default: "" },
    // 默认是单个查询项，即启用查询条的模式
    single: { type: Boolean, default: true },
    // 查询区域的对象
    search: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      chooseTypes, //可用的choose类型
      dialogShow: false // 是否显示项目清单对话框
    };
  },
  computed: {
    /**
     * 点击查询按钮，将其属性值在此计算
     * 此处会把值的最终计算结果，传给子组件<KftDetail></KftDetail>
     * 其中[this.code]为父组件中的赋值，于此处加上[Form]。
     * 成为本组件中<KftDetail>子组件，所需的组件名
     */
    detailFormCode() {
      console.log("detailFormCOde FORM:", this.code);
      return `Form${this.code}`;
    },
    /**
     * 点击查询按钮时候,创建的全局对话框，标题内容
     * 该值根据传入的[this.code]从[chooseType.json]中读取对应明文值。
     */
    datailFormTitle() {
      return chooseTypes[this.code].title;
    },
    projectEntryData() {
      return this.projectEntry;
    }
  },
  methods: {
    handleChoose() {
      /**
       * 此处防止用户在页面具有基于[项目编码]为请求参数的选项时，
       * 需对用户做出提示，使其优先选择项目编码。而后才可以做其他操作
       */
      if (
        !this.projectEntry &&
        (this.code == "Activity" || this.code == "WorkObject")
      ) {
        this.$message.warning("请选择项目编码");
        return;
      }
      this.dialogShow = true;
    },
    /** 对话框的确定事件 */
    confirmHandler(selectedRow) {
      this.dialogShow = false; // 项目清单弹窗是否显示
      this.$emit("on-choose-selected", { ...selectedRow });
    },
    /** 对话框的取消事件 */
    cancelHandler() {
      this.dialogShow = false; // 项目清单弹窗是否显示
    }
  }
};
</script>