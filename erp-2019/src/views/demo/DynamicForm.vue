<template>
  <el-form :model="formData" size="mini" ref="form">
    <!-- 主表区域  包裹器 start -->
    <div class="form_container">
      <!-- 主表单行单项 -->
      <div class="form_row" style="padding-bottom:14px">
        <label>描述：</label>
        <el-input size="mini"></el-input>
      </div>

      <!-- 主表单行多项 第一行 -->
      <div class="form_row">
        <template v-for="(item,index) in formItems">
          <aside>
            <KftLabel :label="item.label|FormatLabelSuffix"></KftLabel>
            <el-form-item prop="whsCode">
              <template v-if="item.type=='INPUT'">
                <!-- {{item}} -->
                <el-input size="mini" v-model="formData[item.prop]" :disabled="item.isDisabled" :placeholder="`请输入${item.label}`"></el-input>
              </template>
            </el-form-item>
          </aside>
        </template>
      </div>
    </div>
    <!-- 主表区域  包裹器 end -->

    <!-- 提交 / 重置 表单 -->
    <div style="text-align:center;margin-top:20px;">
      <el-button type="primary" size="mini" @click="onSubmit()">提交</el-button>
      <el-button size="mini" @click="onCancel()">取消</el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  // 动态表单
  name: "DynamicForm",
  props: {
    /** 主表区域 输入项对象属性及对象值 */
    formData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    /** 主表区域每项 */
    formItems: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  methods: {
    onSubmit() {
      console.log("DynamicForm.vue on-submit", this.formData);
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit("on-submit", this.formData);
        } else {
          this.$message.warning("请检查表单");
        }
      });
    },
    onCancel() {
      console.log("DynamicForm.vue on-cancel", this.formData);
      this.$emit("om-cancel", this.formData);
    }
  }
};
</script>
