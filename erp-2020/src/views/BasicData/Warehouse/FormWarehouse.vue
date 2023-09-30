<template>
  <section v-loading="formLoading">
    <div class="form_header_container">
      <span>仓库 / 表单 {{$route.params.code|FormatFormTitle($route.params.code)}}</span>
      <el-button type="primary" @click="onSave" size="mini">
        <i class="kft-icon-create"></i>
        <span>保存</span>
      </el-button>
    </div>

    <!-- 水平分割线 -->
    <div style="display: block;height: 1px; width: 100%;background-color: #dcdfe6;"></div>

    <el-form :model="formData" size="mini" :rules="rules" ref="formData">
      <!-- 主表区域  包裹器 start -->
      <div class="form_container form_container_background" style="padding-bottom:6px">
        <!-- 主表单行多项 第一行 -->
        <div class="form_row">
          <!-- 编码 -->
          <aside>
            <KftLabel label="编码" :isRequired="true"></KftLabel>
            <el-form-item prop="whsCode">
              <el-input v-model="formData.whsCode" placeholder="请输入编码" clearable :disabled="isDisabled"></el-input>
            </el-form-item>
          </aside>
          <!-- 名称 -->
          <aside>
            <KftLabel label="名称" :isRequired="true"></KftLabel>
            <el-form-item prop="whsName">
              <el-input v-model="formData.whsName" placeholder="请输入名称"></el-input>
            </el-form-item>
          </aside>
          <!-- 分类 -->
          <aside>
            <KftLabel label="分类" :isRequired="true"></KftLabel>
            <el-select v-model="formData.type" size="mini" style="width: -webkit-fill-available;">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </aside>
          <!-- 保管员 -->
          <aside>
            <KftLabel label="保管员"></KftLabel>
            <el-form-item prop="contactName">
              <el-input v-model="formData.contactName" placeholder="请输入保管员"></el-input>
            </el-form-item>
          </aside>
        </div>
        <!-- 主表单行多项 第一行 -->
        <div class="form_row">
          <!-- 联系方式 -->
          <aside>
            <KftLabel label="联系方式"></KftLabel>
            <el-form-item>
              <el-input v-model="formData.contactTel" placeholder="请输入联系方式"></el-input>
            </el-form-item>
          </aside>
          <!-- status 是否可用 -->
          <aside>
            <KftLabel label="状态"></KftLabel>
            <el-select v-model="formData.status" size="mini" style="width: -webkit-fill-available;">
              <el-option v-for="item in GLOBAL.STATUS_ENBALE" :key="item.status" :label="item.label" :value="item.status"></el-option>
            </el-select>
          </aside>
          <aside></aside>
          <aside></aside>
        </div>
      </div>
    </el-form>
  </section>
</template>

<script>
import { getWarehouseInfo, postWarehouse, putWarehouse } from "@/api/basicdata";
export default {
  /** 基础数据 仓库 表单 */
  name: "FormWarehouse",
  data() {
    return {
      /** 窗体内容的 v-loading属性控制值
       * 防止网路环境较差时，窗体内数据返回较慢，窗体空白
       * 防止网路环境较差时，提交事件响应结果及回显较慢，使用者误操作
       */
      formLoading: false,
      /** 主表区域 表单对象 */
      formData: {
        status: "Enable" // 默认可用
      },
      typeOptions: [
        {
          label: "仓库 A",
          value: "a"
        },
        {
          label: "仓库 B",
          value: "b"
        }
      ],
      /** 主表区域 必填字段校验 */
      rules: {
        whsCode: [
          {
            required: true,
            message: "请输入编码",
            trigger: "blur"
          }
        ],
        whsName: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "请选择分类",
            trigger: "change"
          }
        ]
      },
      /** 主表区域 设置为禁止输入的项 */
      isDisabled: false,
      passValue: "" // 传入本页面后，存住的id，用于请求页面数据
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // console.log("获取传入的code:", this.$route.params.code);
    this.passValue = this.$route.params.code;

    /**
     * 如果有由列表页传递过来的值，即判定为修改表单操作
     * 点击单行进入表单页面，于此处请求并渲染数据
     * 注:由于本页面为共用，只有初次请求走这里，之后的请求通过监听路由变化来控制
     */
    if (this.passValue && this.passValue != "create") {
      this.isDisabled = true; // 设置指定项不可输入
      this.getDataInfo(this.passValue); // 根据传递过来的值，请求对于数据，填充表单
    } else if (this.passValue == "create") {
      this.inited = true; // formData数据初始化
    }
  },
  methods: {
    /** 按钮：保存
     * 将表单提交至后台
     */
    onSave() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          /** 窗体内容加载效果：开启 */
          this.formLoading = true;
          /** 用 [version] 版本号来判定，执行新增数据函数 or 修改数据函数 */
          this.formData.version === undefined
            ? this.postData()
            : this.putData();
          // 以上业务逻辑处理完毕后，调用mixinMethods中关闭任务项之前的业务逻辑处理函数
          this.beforeCloseTask(this.$route.path);
        } else {
          this.$message.warning("请检查表单");
          /** 窗体内容加载效果：关闭 */
          this.formLoading = false;
        }
      });
    },

    /** 根据列表页传递过来的值，请求对应完整信息 */
    async getDataInfo(code) {
      try {
        /** 窗体内容加载效果：开启 */
        this.formLoading = true;
        this.formData = await getWarehouseInfo(code);
        /** 下一次更新时，formData数据初始化 */
        this.$nextTick(function() {
          this.inited = true;
        });
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /** 新增数据 */
    async postData() {
      try {
        // 后台返回结果中的数据，回显至表单上
        await postWarehouse(this.formData);
        /** 因手动重置了表单数据，此处需手动设置为未初始化
         * 否则，会在本页关闭后，相关formData页出现任务项标星问题。
         */
        this.inited = false;
        this.$message.success("操作成功");
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /** 更新数据 */
    async putData() {
      try {
        /** 剔除无需传入后台的对象属性 */
        let {
          createBy,
          createTime,
          updateBy,
          updateTime,
          ...params
        } = this.formData;
        /** 剔除后的剩余对象属性，作为请求体传入 */
        await putWarehouse(params);
        this.$message.success("操作成功");
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    }
  }
};
</script>
