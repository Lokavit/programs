<template>
  <section v-loading="formLoading">
    <div class="form_header_container">
      <span>钢材BOM / 表单 {{$route.params.code|FormatFormTitle($route.params.code)}}</span>
      <el-button type="primary" @click="onSave" size="mini">
        <i class="kft-icon-create"></i>
        <span>保存</span>
      </el-button>
    </div>

    <!-- 水平分割线 -->
    <div style="display: block;height: 1px; width: 100%;background-color: #dcdfe6;"></div>

    <el-form :model="formData" size="mini" :rules="rules" ref="formData">
      <!-- 主表区域  包裹器 start -->
      <div class="form_container form_container_background">
        <!-- 主表单行多项 第一行 -->
        <div class="form_row">
          <!-- 项目 -->
          <aside>
            <KftLabel label="项目" :isRequired="true"></KftLabel>
            <el-form-item prop="itemGroupCode">
              <KftChoose code="Project" v-model="formData.projectEntry" show-detail @on-choose-selected="chooseProject" placeholder="请选择项目" size="mini"></KftChoose>
            </el-form-item>
          </aside>
          <!-- 分段 -->
          <aside>
            <KftLabel label="分段" :isRequired="true"></KftLabel>
            <el-form-item prop="itemGroupName">
              <KftChoose code="Project" v-model="formData.projectEntry" show-detail @on-choose-selected="chooseProject" placeholder="请选择分段" size="mini"></KftChoose>
            </el-form-item>
          </aside>
          <!-- BOM名称 -->
          <aside style="flex-grow:2">
            <KftLabel label="BOM名称" :isRequired="true"></KftLabel>
            <el-form-item prop="itemGroupName">
              <el-input v-model="formData.itemGroupName" placeholder="请输入BOM名称"></el-input>
            </el-form-item>
          </aside>
        </div>

        <!-- 主表单行多项 第一行 -->
        <div class="form_row">
          <aside>
            <KftLabel label="BOM文件" :isRequired="true"></KftLabel>
            <el-upload action accept="*/*" :show-file-list="false" style="margin:0 10px;" :auto-upload="false" :on-change="onChangeFile">
              <el-button type="primary" plain size="mini">
                <i class="kft-icon-upload"></i>
                <span>上传</span>
              </el-button>
            </el-upload>
          </aside>
          <aside></aside>
          <aside></aside>
          <aside></aside>
        </div>
      </div>
    </el-form>
  </section>
</template>

<script>
import {
  getMaterialGroupInfo,
  postMaterialGroup,
  putMaterialGroup
} from "@/api/basicdata";
export default {
  /** 钢材BOM上传 表单 */
  name: "FormSteelBOM",
  data() {
    return {
      /** 表单内容的 v-loading属性控制值
       * 防止网路环境较差时，表单内数据返回较慢，填充项空白
       */
      formLoading: false,
      /** 主表区域 表单对象 */
      formData: {},
      fileBOM: {}, // BOM文件对象
      /** 主表区域 必填字段校验 */
      rules: {
        itemGroupCode: [
          {
            required: true,
            message: "请输入物料组编码",
            trigger: "blur"
          }
        ],
        itemGroupName: [
          {
            required: true,
            message: "请输入物料组名称",
            trigger: "blur"
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
    /** 项目的chooseList 选中 */
    chooseProject(selectedRow) {
      console.log("EVENT:", event);
      this.$set(this.form, "projectEntry", selectedRow.entry);
      this.$set(this.form, "projectName", selectedRow.name);
      this.projectEntry = selectedRow.entry;
      this.$delete(this.form, "workObject");
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    onChangeFile(file, fileList) {
      console.log("文件状态改变 FILE:", file, "FILELIST:", fileList);
      this.formData.fileBOM = fileList;
    },
    /** 按钮：保存
     * 将表单提交至后台
     */
    async onSave() {
      // 校验之前，优先判断fileBOM中是否有文件
      // console.log("BOM文件:", this.fileBOM);
      if (!this.fileBOM.length) {
        console.log("没有BOM文件:", this.fileBOM);
        this.$message.warning("请上传BOM文件");
        return;
      }

      // console.log("BOM文件:", this.fileBOM);
      // const fileBOMParse = await this.GLOBAL.imgFileToBase64(
      //   this.fileBOM[0].raw
      // );
      // console.log("BOM文件转base64", fileBOMParse);

      // this.$refs.formData.validate(valid => {
      //   if (valid) {
      //     /** 窗体内容加载效果：开启 */
      //     this.formLoading = true;
      //     /** 用 [version] 版本号来判定，执行新增数据函数 or 修改数据函数 */
      //     this.formData.version === undefined
      //       ? this.postData()
      //       : this.putData();
      //     // 以上业务逻辑处理完毕后，调用mixinMethods中关闭任务项之前的业务逻辑处理函数
      //     this.beforeCloseTask(this.$route.path);
      //   } else {
      //     this.$message.warning("请检查表单");
      //     /** 窗体内容加载效果：关闭 */
      //     this.formLoading = false;
      //   }
      // });
    },

    /** 根据列表页传递过来的值，请求对应完整信息 */
    async getDataInfo(code) {
      try {
        /** 窗体内容加载效果：开启 */
        this.formLoading = true;
        this.formData = await getMaterialGroupInfo(code);
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
        await postMaterialGroup(this.formData);
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
        await putMaterialGroup(params);
        this.$message.success("操作成功");
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    }
  }
};
</script>
