<template>
  <section>
    <el-dialog :visible="dialogVisible" :modal-append-to-body="false" modal-append-to-body :append-to-body="true" :before-close="cancelHandler" width="90%" style="margin-top:-60px;">
      <!-- <el-divider>物资供应计划 批量新增</el-divider> -->

      <el-steps :active="active" align-center finish-status="success">
        <el-step>
          <div slot="title">选择物资供应计划</div>
        </el-step>
        <el-step>
          <div slot="title">填写申请采购数量</div>
        </el-step>
        <!-- <el-step title="步骤 3" description="这段就没那么长了"></el-step> -->
      </el-steps>

      <!-- 步骤1 内容区域 -->
      <template v-if="active==1">
        <GuideStepFirst @on-next="onNextStep" @on-addInBulk="onAddInBulkHandler"></GuideStepFirst>
      </template>

      <!-- 步骤2 内容区域 -->
      <template v-if="active==2">
        <GuideStepSecond :tableData="mplinesData" @on-prev="handlerPrev" @on-finish="handlerFinish"></GuideStepSecond>
      </template>

      <!-- <div slot="footer"> -->
      <!-- <el-button type="primary" plain @click="handlerPrev" size="mini" v-if="isPrevBtn">上一步</el-button>
      <el-button type="primary" plain @click="handlerNext" size="mini" v-if="isNextBtn">下一步</el-button>-->
      <!-- <el-button type="primary" plain @click="handlerFinish" size="mini" v-if="isFinishBtn">完成</el-button> -->
      <!-- <el-button @click="cancelHandler" size="mini">取 消</el-button> -->

      <!-- <el-button type="primary" @click="confirmHandler" size="mini">确 定</el-button>
      <el-button @click="onAddInBulkHandler" size="mini">直接新增</el-button>-->
      <!-- </div> -->
    </el-dialog>
  </section>
</template>

<script>
import GuideStepFirst from "./components/GuideStepFirst";
import GuideStepSecond from "./components/GuideStepSecond";
export default {
  /** 钢材 POR 生成向导 */
  name: "GuideSteelPOR",
  components: { GuideStepFirst, GuideStepSecond },
  props: {
    /**
     * 对话框是否显示 ，于父组件中的包裹元素 v-if变量绑定，达到手动控制本组件是否渲染
     */
    dialogVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      /** 是否为直接新增
       * 该变量通过[直接新增]按钮，传入FormSteelPOR页面
       * 用于判定是否改变POR表单页面的部分内容的状态
       */
      isAddInBulk: false,
      active: 1, // 步骤条的激活项

      /** 存储 选中MP中的每条数据 */
      multipleSelection: []
    };
  },
  computed: {
    /** table内容最大高度，以达到内部滚动的效果 */
    maxHeight() {
      /** 通过获取屏幕宽度返回的当前每页最大条数 * 每行高度 */
      return this.GLOBAL.returnTableDataItem().item * 40;
    }
  },
  mounted() {},
  methods: {
    /** 上一步 */
    handlerPrev() {
      this.active = 1;
      this.mplinesData = null;
    },

    /** 完成 */
    handlerFinish(args) {
      console.log("处理完成的数据", args);
      this.multipleSelection = args;
      this.confirmHandler();
    },

    /** 下一步 */
    onNextStep(args) {
      console.log("使用者点击了下一步:", args);
      this.active = 2;
      this.mplinesData = args;
    },

    /**
     * 对话框的确定事件
     * 迭代每行数据的所有批次，将其[batches]中 [batchNumber]重复的进行合并
     */
    confirmHandler() {
      // this.multipleSelection = MP中的行数据(数量一栏全部填写完成);
      this.$emit("on-comfirm", this.multipleSelection); // 于父组件中实现的事件，用于控制本组件是否渲染
    },
    /**
     * 对话框右上角X事件
     */
    cancelHandler() {
      this.$emit("on-cancel");
    },

    /** 直接新增按钮事件 */
    onAddInBulkHandler() {
      /** 使用者选择批量新增 */
      this.isAddInBulk = true;
      this.$emit("on-addInBulk", this.isAddInBulk);
    }
  }
};
</script>
