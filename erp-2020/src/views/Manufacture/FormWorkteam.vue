<template>
  <section :style="{'width':width}" v-loading="formLoading">
    <el-form :model="form" size="mini" :rules="rules" ref="form">
      <!-- 主表区域  包裹器 start -->
      <div class="form_container">
        <!-- 主表单行单项 之 代码 -->
        <div class="form_row">
          <KftLabel :label="labels.entry.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
          <el-form-item prop="entry">
            <el-input v-model="form.entry" :placeholder="`请输入${labels.entry.value}`" :disabled="isDisabled" clearable></el-input>
          </el-form-item>
        </div>

        <!-- 主表单行单项 之 名称 -->
        <div class="form_row">
          <KftLabel :label="labels.name.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
          <el-form-item prop="name">
            <el-input v-model="form.name" :placeholder="`请输入${labels.name.value}`" clearable></el-input>
          </el-form-item>
        </div>

        <!-- 主表单行单项 之 类型 -->
        <div class="form_row" style="padding-bottom:14px">
          <KftLabel :label="labels.type.value|FormatLabelSuffix"></KftLabel>
          <el-input size="mini" v-model="form.type" :placeholder="`请输入${labels.type.value}`" clearable></el-input>
        </div>

        <!-- 主表单行单项 之 作业类型 -->
        <div class="form_row" style="padding-bottom:14px">
          <KftLabel :label="labels.workArea.value|FormatLabelSuffix"></KftLabel>
          <el-select v-model="form.workArea" :placeholder="`请选择${labels.workArea.value}`" @change="changeWorkArea" size="mini">
            <el-option v-for="item in workAreaOptions" :key="item.entry" :label="item.name" :value="item.code">
              <span style="float: left">{{ item.code }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </div>

        <!-- 主表单行单项 之 总人数 -->
        <div class="form_row" style="padding-bottom:14px">
          <KftLabel :label="labels.membership.value|FormatLabelSuffix"></KftLabel>
          <el-input size="mini" v-model="form.membership" :placeholder="`请输入${labels.membership.value}`" clearable></el-input>
        </div>

        <!-- 主表单行单项 之 操作人数 -->
        <div class="form_row" style="padding-bottom:14px">
          <KftLabel :label="labels.effectiveMembership.value|FormatLabelSuffix"></KftLabel>
          <el-input size="mini" v-model="form.effectiveMembership" :placeholder="`请输入${labels.effectiveMembership.value}`" clearable></el-input>
        </div>

        <!-- 主表单行单项 之 作业时长 -->
        <div class="form_row" style="padding-bottom:14px">
          <KftLabel :label="labels.effectivePeriod.value|FormatLabelSuffix"></KftLabel>
          <el-input size="mini" v-model="form.effectivePeriod" :placeholder="`请输入${labels.effectivePeriod.value}`" clearable></el-input>
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
import { getWorkteamInfo, postWorkteam, putWorkteam } from "@/api/manufacture";
import { getSelectLists } from "@/api/common";
export default {
  // 生产模块 职班 表单页
  name: "FormWorkteam",
  data() {
    return {
      /** 窗体内容的 v-loading属性控制值
       * 防止网路环境较差时，窗体内数据返回较慢，窗体空白
       * 防止网路环境较差时，提交事件响应结果及回显较慢，使用者误操作
       */
      formLoading: false,
      workAreaOptions: [], // 作业类型下拉选项组
      form: {},
      rules: {
        entry: [
          {
            required: true,
            message: "请输入代码",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ]
      },
      isDisabled: false // 是否禁止输入
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
      return this.$store.getters.labels.Workteam.formLabels;
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
    this.getWorkArea(); // 作业类型下拉选项组数据
    // 如果有由列表页传递过来的值，即判定为修改表单操作
    if (this.passValue) {
      this.isDisabled = true; // 设置指定项不可输入
      this.getDataInfo(); // 根据传递过来的值，请求对于数据，填充表单
    }
  },
  methods: {
    /** 作业类型 下拉选项 变更函数 */
    changeWorkArea(val) {
      console.log("作业类型选择变更函数:", val);
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

    /** 获取作业类型数据集，用于作业类型下拉选项组 */
    async getWorkArea() {
      let params = {
        code: "CommonCode",
        parentEntry: "PMS-WorkArea"
      };
      const res = await getSelectLists(params);
      this.workAreaOptions = res;
    },

    /** 根据列表页传递过来的值，请求对应完整信息 */
    async getDataInfo() {
      try {
        /** 窗体内容加载效果：开启 */
        this.formLoading = true;
        const res = await getWorkteamInfo(this.passValue);
        this.form = res;
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /**
     * 新增数据
     */
    async postData() {
      try {
        console.log("FORM:", this.form);
        const res = await postWorkteam(this.form);
        this.form = res; // 返回结果中的数据，回显至表单上
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
        const res = await putWorkteam(this.form);
        this.form = res;
        this.$message.success("修改成功");
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    }
  }
};
</script>