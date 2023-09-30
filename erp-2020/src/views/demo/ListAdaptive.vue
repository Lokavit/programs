<template>
  <section :style="{'width':width}" v-loading="formLoading">
    <DynamicForm :formData="form" :formItems="formJSON.gc.formItem" @on-submit="onSubmit" @om-cancel="onCancel"></DynamicForm>

    <!-- 搜索框  关键设置：tabindex="0" -->
    <div class="search" tabindex="0">
      <input type="text" v-model="search" placeholder="搜索" />
      <i class="kft-icon-close" :style="{'opacity':isShow}"></i>
      <i class="kft-icon-search" style="padding-left:8px;"></i>
    </div>
  </section>
</template>

<script>
import DynamicForm from "./DynamicForm";
import formJSON from "./formJSON.json";
export default {
  // 动态生产主表单
  name: "ListAdaptive",
  components: { DynamicForm },
  data() {
    return {
      // isShow:false, // 是否显示清除按钮
      search: "", // 查询
      formJSON, // 动态表单JSON
      /** 窗体内容的 v-loading属性控制值
       * 防止网路环境较差时，窗体内数据返回较慢，窗体空白
       * 防止网路环境较差时，提交事件响应结果及回显较慢，使用者误操作
       */
      formLoading: false,
      /** 主表区域 表单对象 */
      form: {},
      /** 主表区域 必填字段校验 */
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      /** 主表区域 设置为禁止输入的项 */
      isDisabled: false
    };
  },
  computed: {
    /** 列表区域的宽度值 [列表页根据table宽度决定整体宽度] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(
        this.GLOBAL.INITIAL_TABLE_MEDIUM
      );
    },
    /** 当前窗体标注组 [后台获取所有标注] */
    labels() {
      return this.$store.getters.labels.Vendor.formLabels;
    },
    isShow() {
      return this.search == "" ? 0 : 1;
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /** 表单提交 事件 */
    onSubmit() {
      console.log("ListAdaptive.vue onSubmit");
    },
    /** [取消] 事件 关闭窗体 */
    onCancel() {
      console.log("ListAdaptive.vue onCancel");
      // 通过调用当前窗体内容的$父级.$选项组.父级.窗体关闭事件，达到关闭窗体效果。
      this.$parent.$options.parent.handleClose();
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>