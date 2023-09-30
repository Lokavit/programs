<template>
  <section :style="{'width':width}" v-loading="formLoading">
    <el-form :model="form" size="mini" :rules="rules" ref="form">
      <!-- 主表区域  包裹器 start -->
      <div class="form_container">
        <!-- 主表单行多项 第一行 -->
        <div class="form_row">
          <!-- 编码 -->
          <aside>
            <KftLabel :label="labels.entry.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="entry">
              <el-input v-model="form.entry" :placeholder="`请输入${labels.entry.value}`" clearable :disabled="isDisabled"></el-input>
            </el-form-item>
          </aside>
          <!-- 名称 -->
          <aside>
            <KftLabel :label="labels.name.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="name">
              <el-input v-model="form.name" :placeholder="`请输入${labels.name.value}`" clearable></el-input>
            </el-form-item>
          </aside>
          <!-- 项目编码 -->
          <aside>
            <KftLabel :label="labels.projectEntry.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="entry">
              <!-- 由于ChooseList封装在内，所以此处使用 isLocking 值决定渲染哪一个组件 -->
              <template v-if="!isLocking">
                <KftChoose code="Project" v-model="form.projectEntry" show-detail @on-choose-selected="chooseProject" :placeholder="`请选择${labels.projectEntry.value}`" size="mini"></KftChoose>
              </template>
              <template v-if="isLocking">
                <el-input v-model="form.projectEntry" :placeholder="`请输入${labels.projectEntry.value}`" clearable :disabled="true"></el-input>
              </template>
            </el-form-item>
          </aside>
          <!-- 上级ID -->
          <aside>
            <KftLabel :label="labels.parentEntry.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.parentEntry" :placeholder="`${labels.parentEntry.value}`" clearable :disabled="true"></el-input>
          </aside>
        </div>
        <!-- 主表单行多项 第二行 -->
        <div class="form_row">
          <!-- 净重 -->
          <aside>
            <KftLabel :label="labels.weight.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.weight" :placeholder="`请输入${labels.weight.value}`" clearable></el-input>
          </aside>
          <!-- 长度 -->
          <aside>
            <KftLabel :label="labels.length.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.length" :placeholder="`请输入${labels.length.value}`" clearable></el-input>
          </aside>
          <!-- 宽度 -->
          <aside>
            <KftLabel :label="labels.width.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.width" :placeholder="`请输入${labels.width.value}`" clearable></el-input>
          </aside>
          <!-- 高度 -->
          <aside>
            <KftLabel :label="labels.height.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.height" :placeholder="`请输入${labels.height.value}`" clearable></el-input>
          </aside>
        </div>

        <!-- 主表单行多项 第三行 -->
        <div class="form_row">
          <!-- 钢材采购 -->
          <aside>
            <KftLabel :label="labels.steelPOIndicator.value|FormatLabelSuffix"></KftLabel>
            <el-radio-group v-model="form.steelPOIndicator" @change="changeSteelPOIndicator">
              <el-radio label="true">
                <span style="font-size:12px">是</span>
              </el-radio>
              <el-radio label="false">
                <span style="font-size:12px">否</span>
              </el-radio>
            </el-radio-group>
          </aside>

          <!-- 组装 -->
          <aside>
            <KftLabel :label="labels.assemblyIndicator.value|FormatLabelSuffix"></KftLabel>
            <el-radio-group v-model="form.assemblyIndicator" @change="changeAssemblyIndicator">
              <el-radio label="true">
                <span style="font-size:12px">是</span>
              </el-radio>
              <el-radio label="false">
                <span style="font-size:12px">否</span>
              </el-radio>
            </el-radio-group>
          </aside>

          <!-- 切割 -->
          <aside>
            <KftLabel :label="labels.cuttingIndicator.value|FormatLabelSuffix"></KftLabel>
            <el-radio-group v-model="form.cuttingIndicator" @change="changeCuttingIndicator">
              <el-radio label="true">
                <span style="font-size:12px">是</span>
              </el-radio>
              <el-radio label="false">
                <span style="font-size:12px">否</span>
              </el-radio>
            </el-radio-group>
          </aside>

          <!-- 搭载 -->
          <aside>
            <KftLabel :label="labels.erectionIndicator.value|FormatLabelSuffix"></KftLabel>
            <el-radio-group v-model="form.erectionIndicator" @change="changeErectionIndicator">
              <el-radio label="true">
                <span style="font-size:12px">是</span>
              </el-radio>
              <el-radio label="false">
                <span style="font-size:12px">否</span>
              </el-radio>
            </el-radio-group>
          </aside>
        </div>
      </div>
      <!-- 主表区域  包裹器 end -->

      <!-- 提交 / 重置 表单 -->
      <div style="text-align:center;padding-top:20px;">
        <el-button type="primary" size="mini" @click="onSubmit()">提交</el-button>
        <el-button size="mini" @click="onCancel()">取消</el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import { getBlockInfo, postBlock, putBlock } from "@/api/manufacture";
export default {
  // 生成模块 分段登记 表单页
  name: "FormBlock",
  data() {
    return {
      isDisabled: false, // 是否禁止输入
      isLocking: false, // 是否锁定 [被锁定项:项目编码]
      /** 窗体内容的 v-loading属性控制值
       * 防止网路环境较差时，窗体内数据返回较慢，窗体空白
       * 防止网路环境较差时，提交事件响应结果及回显较慢，使用者误操作
       */
      formLoading: false,
      form: {
        assemblyIndicator: "false",
        cuttingIndicator: "false",
        erectionIndicator: "false",
        steelPOIndicator: "false"
      },
      rules: {
        entry: [
          {
            required: true,
            message: "请输入编号",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ],
        projectEntry: [
          {
            required: true,
            message: "请选择项目编码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    /** 当前窗体宽度值计算 [根据全局设定基数等比缩放] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
    },
    /** 当前窗体标注组 [后台获取所有标注] */
    labels() {
      return this.$store.getters.labels.Block.formLabels;
    },
    /** 全局窗体组 */
    modalGroup() {
      return this.$store.getters.modalGroup;
    },
    /** 该计算值为，列表页选中数据时所传过来的必要属性值，
     * 用于在本页面进行单条数据请求 */
    passValue() {
      let modals = this.modalGroup;
      // 当前新增，最后一个Modal,的code值
      if (modals[modals.length - 1].content.code) {
        return modals[modals.length - 1].content.code;
      }
    }
  },
  watch: {},
  created() {},
  mounted() {
    // 如果[passValue]是空对象，即表示当前为根节点新增
    if (!this.passValue.entry) {
      this.isDisabled = false; // 编号可输入,项目编码可输入
    }

    // 如果当前没有 [status]属性，则表示该表单为新增状态，进行新增操作
    if (this.passValue.entry && !this.passValue.status) {
      this.isLocking = true; // 锁定项目编码
      /** 当在新增子节点情况下，
       * 手动给form加属性，使其做以下赋值:
       * [form.projectEntry:passValue.projectEntry]表单中项目编号数据为传入对象中的项目编码值
       * [form.parentEntry:passValue.entry]表单中上级编码为传入数据对象中的编码值
       */
      this.$set(this.form, "projectEntry", this.passValue.projectEntry);
      this.$set(this.form, "parentEntry", this.passValue.entry);
    }
    // 如果当前[status]状态为["modifty"]则表示该表单为修改状态，进行修改操作
    if (this.passValue.status == "modifty") {
      this.getDataInfo(); // 根据传入值请求数据填充表单
      this.isDisabled = true; // 编号不可输入
      this.isLocking = true; // 锁定项目编码
    }
  },
  methods: {
    /** 是否组装 */
    changeAssemblyIndicator(val) {},
    /** 切割 */
    changeCuttingIndicator(val) {},
    /** 搭载 */
    changeErectionIndicator(val) {},
    /** 是否钢材采购 */
    changeSteelPOIndicator(val) {},

    /** 项目的chooseList 选中 */
    chooseProject(selectedRow) {
      this.$set(this.form, "projectEntry", selectedRow.entry);
    },

    /** 表单提交 事件 */
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          /** 窗体内容加载效果：开启 */
          this.formLoading = true;
          /** 用 [version] 版本号来判定，执行新增数据函数 or 修改数据函数 */
          this.form.version === undefined ? this.postData() : this.putData();
        } else {
          this.$message.warning("请检查表单");
          /** 窗体内容加载效果：关闭 */
          this.formLoading = false;
        }
      });
    },

    /** [取消] 事件 关闭窗体 */
    onCancel() {
      // 通过调用当前窗体内容的$父级.$选项组.父级.窗体关闭事件，达到关闭窗体效果。
      this.$parent.$options.parent.handleClose();
    },

    /** 根据列表页传递过来的值，请求对应完整信息 */
    async getDataInfo() {
      try {
        /** 窗体内容加载效果：开启 */
        this.formLoading = true;
        // 该接口需传 项目编码及编码 作为API拼接
        const res = await getBlockInfo(
          this.passValue.projectEntry,
          this.passValue.entry
        );
        /** 在修改某节点的情况下,
         * 将请求数据赋值给当前表单,并且对几个单选框进行赋值。
         */
        this.form = res;
        this.form.assemblyIndicator = res.assemblyIndicator.toString();
        this.form.cuttingIndicator = res.cuttingIndicator.toString();
        this.form.erectionIndicator = res.erectionIndicator.toString();
        this.form.steelPOIndicator = res.steelPOIndicator.toString();
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /** 新增数据 */
    async postData() {
      // 将form中的所有的字符串 ["true"]或者["false"]转成 Boolean
      /** 解构赋值的方式 */
      let {
        assemblyIndicator,
        cuttingIndicator,
        erectionIndicator,
        steelPOIndicator,
        ...formData
      } = this.form;
      this.form = {
        assemblyIndicator: this.GLOBAL.stringToBoolean(
          this.form.assemblyIndicator
        ),
        cuttingIndicator: this.GLOBAL.stringToBoolean(
          this.form.cuttingIndicator
        ),
        erectionIndicator: this.GLOBAL.stringToBoolean(
          this.form.erectionIndicator
        ),
        steelPOIndicator: this.GLOBAL.stringToBoolean(
          this.form.steelPOIndicator
        ),
        ...formData
      };
      console.log("FORM:", this.form);

      try {
        const res = await postBlock(this.form);
        this.form = res; // 返回结果中的数据，回显至表单上
        console.log("回显RES:", res);
        this.form.assemblyIndicator = res.assemblyIndicator.toString();
        this.form.cuttingIndicator = res.cuttingIndicator.toString();
        this.form.erectionIndicator = res.erectionIndicator.toString();
        this.form.steelPOIndicator = res.steelPOIndicator.toString();
        this.isDisabled = true; // 新增的数据提交之后，不可更改
        this.$message.success("提交成功");
      } catch (error) {
        this.isDisabled = false; // 编码可输入
      }
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    // 更新数据
    async putData() {
      try {
        const res = await putBlock(this.form);
        /** 在修改某节点的情况下,
         * 将请求数据赋值给当前表单,并且对几个单选框进行赋值。
         */
        this.form = res;
        this.form.assemblyIndicator = res.assemblyIndicator.toString();
        this.form.cuttingIndicator = res.cuttingIndicator.toString();
        this.form.erectionIndicator = res.erectionIndicator.toString();
        this.form.steelPOIndicator = res.steelPOIndicator.toString();
        this.$message.success("修改成功");
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    }
  }
};
</script>


<style lang="scss" scoped>
.el-radio-group {
  label {
    min-width: 0;
  }
}
</style>