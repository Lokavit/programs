<template>
  <section :style="{'width':width}" v-loading="formLoading">
    <el-form :model="form" size="mini" :rules="rules" ref="form">
      <!-- 主表区域  包裹器 start -->
      <div class="form_container">
        <!-- 主表单行单项 之 计量单位编码 -->
        <div class="form_row">
          <KftLabel :label="labels.uomCode.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
          <el-form-item prop="uomCode">
            <el-input v-model="form.uomCode" :placeholder="`请输入${labels.uomCode.value}`" :disabled="isDisabled" clearable></el-input>
          </el-form-item>
        </div>
        <!-- 主表单行单项 之 计量单位名称 -->
        <div class="form_row">
          <KftLabel :label="labels.uomName.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
          <el-form-item prop="uomName">
            <el-input v-model="form.uomName" :placeholder="`请输入${labels.uomName.value}`" clearable></el-input>
          </el-form-item>
        </div>
        <!-- 主表单行单项 之 高度 -->
        <div class="form_row" style="padding-bottom:14px">
          <KftLabel :label="labels.height.value|FormatLabelSuffix"></KftLabel>
          <el-input size="mini" v-model="form.height" :placeholder="`请输入${labels.height.value}`" clearable></el-input>
        </div>
        <!-- 主表单行单项 之 长度 -->
        <div class="form_row" style="padding-bottom:14px">
          <KftLabel :label="labels.length.value|FormatLabelSuffix"></KftLabel>
          <el-input size="mini" v-model="form.length" :placeholder="`请输入${labels.length.value}`" clearable></el-input>
        </div>
        <!-- 主表单行单项 之 宽度 -->
        <div class="form_row" style="padding-bottom:14px">
          <KftLabel :label="labels.width.value|FormatLabelSuffix"></KftLabel>
          <el-input size="mini" v-model="form.width" :placeholder="`请输入${labels.width.value}`" clearable></el-input>
        </div>
        <!-- 主表单行单项 之 体积 -->
        <div class="form_row" style="padding-bottom:14px">
          <KftLabel :label="labels.volumn.value|FormatLabelSuffix"></KftLabel>
          <el-input size="mini" v-model="form.volumn" :placeholder="`请输入${labels.volumn.value}`" clearable></el-input>
        </div>
        <!-- 主表单行单项 之 体积单位 -->
        <div class="form_row" style="padding-bottom:14px">
          <KftLabel :label="labels.volumnUnit.value|FormatLabelSuffix"></KftLabel>
          <el-select size="mini" v-model="form.volumnUnit" :placeholder="`请输入${labels.volumnUnit.value}`" clearable @change="changeVolumnUnit">
            <el-option v-for="item in volumnUnitOptions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
        <!-- 主表单行单项 之 重量 -->
        <div class="form_row" style="padding-bottom:14px">
          <KftLabel :label="labels.weight.value|FormatLabelSuffix"></KftLabel>
          <el-input size="mini" v-model="form.weight" :placeholder="`请输入${labels.weight.value}`" clearable></el-input>
        </div>
      </div>
      <!-- 主表区域  包裹器 end -->

      <!-- 提交 / 重置 表单 -->
      <div style="text-align:center;margin-top:20px;">
        <el-button type="primary" size="mini" @click="onSubmit()">提交</el-button>
        <el-button size="mini" @click="onCancel()">取消</el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import { getUOMInfo, postUOM, putUOM, getVolumnUnits } from "@/api/stock";
export default {
  // 库存模块 计量单位 表单页
  name: "FormUom",
  data() {
    return {
      /** 窗体内容的 v-loading属性控制值
       * 防止网路环境较差时，窗体内数据返回较慢，窗体空白
       * 防止网路环境较差时，提交事件响应结果及回显较慢，使用者误操作
       */
      formLoading: false,
      /** 主表区域 表单对象 */
      form: {},
      /** 主表区域 必填字段校验 */
      rules: {
        uomCode: [
          {
            required: true,
            message: "请输入计量单位编码",
            trigger: "blur"
          }
        ],
        uomName: [
          {
            required: true,
            message: "请输入计量单位名称",
            trigger: "blur"
          }
        ]
      },
      /** 主表区域 设置为禁止输入的项 */
      isDisabled: false,
      volumnUnitOptions: [] // 表单里的[计量单位]下拉选项组
    };
  },
  computed: {
    /** 当前窗体宽度值计算 [根据全局设定基数等比缩放] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(
        this.GLOBAL.INITIAL_FORM_SINGLE
      );
    },
    /** 当前窗体标注组 [后台获取所有标注] */
    labels() {
      return this.$store.getters.labels.UOM.formLabels;
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
    this.getVolumnUnitOption();
    // 如果有由列表页传递过来的值，即判定为修改表单操作
    if (this.passValue) {
      this.isDisabled = true; // 设置指定项不可输入
      this.getDataInfo(); // 根据传递过来的值，请求对于数据，填充表单
    }
  },
  methods: {
    /** 下拉选项的当前选中项 */
    changeVolumnUnit(val) {},

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

    /** 获取[体积计量单位]下拉选项 */
    async getVolumnUnitOption() {
      try {
        const res = await getVolumnUnits();
        this.volumnUnitOptions = res;
      } catch (error) {}
    },

    /** 根据列表页传递过来的值，请求对应完整信息 */
    async getDataInfo() {
      try {
        /** 窗体内容加载效果：开启 */
        this.formLoading = true;
        const res = await getUOMInfo(this.passValue);
        this.form = res;
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /** 新增数据 */
    async postData() {
      try {
        const res = await postUOM(this.form);
        this.form = res; // 返回结果中的数据，回显至表单上
        this.isDisabled = true; // 新增的数据提交之后，不可更改
        this.$message.success("提交成功");
      } catch (error) {
        this.isDisabled = false; // 编码可输入
      }
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /** 更新数据 */
    async putData() {
      try {
        const res = await putUOM(this.form);
        this.form = res;
        this.$message.success("修改成功");
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    }
  }
};
</script>
