<template>
  <section v-loading="formLoading">
    <div class="form_header_container">
      <span>供应商 / 表单 {{$route.params.code|FormatFormTitle($route.params.code)}}</span>
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
          <!-- 供应商编码 -->
          <aside>
            <KftLabel label="供应商编码" :isRequired="true"></KftLabel>
            <el-form-item prop="supplierCode">
              <el-input v-model="formData.supplierCode" placeholder="请输入供应商编码" clearable :disabled="isDisabled"></el-input>
            </el-form-item>
          </aside>
          <!-- 供应商名称 -->
          <aside>
            <KftLabel label="供应商名称" :isRequired="true"></KftLabel>
            <el-form-item prop="supplierName">
              <el-input v-model="formData.supplierName" placeholder="请输入供应商名称"></el-input>
            </el-form-item>
          </aside>
          <!-- 法人代表 -->
          <aside>
            <KftLabel label="法人代表"></KftLabel>
            <el-form-item>
              <el-input v-model="formData.coo" placeholder="请输入法人代表"></el-input>
            </el-form-item>
          </aside>
          <!-- 主联系人 -->
          <aside>
            <KftLabel label="主联系人" :isRequired="true"></KftLabel>
            <el-form-item prop="contactName">
              <el-input v-model="formData.contactName" placeholder="请输入主联系人"></el-input>
            </el-form-item>
          </aside>
        </div>
        <!-- 主表单行多项 第二行 -->
        <div class="form_row">
          <!-- 业务范围 -->
          <aside style="flex-grow:3">
            <KftLabel label="业务范围"></KftLabel>
            <el-form-item>
              <el-input v-model="formData.scopeOfBusiness" placeholder="请输入业务范围"></el-input>
            </el-form-item>
          </aside>
          <!-- 邮编 -->
          <aside>
            <KftLabel label="邮编"></KftLabel>
            <el-form-item>
              <el-input v-model="formData.zipCode" placeholder="请输入邮编"></el-input>
            </el-form-item>
          </aside>
        </div>
        <!-- 主表单行多项 第三行 -->
        <div class="form_row">
          <!-- 地址 -->
          <aside style="flex-grow:3">
            <KftLabel label="地址" :isRequired="true"></KftLabel>
            <el-form-item prop="add">
              <el-input v-model="formData.add" placeholder="请输入地址"></el-input>
            </el-form-item>
          </aside>
          <!-- 联系方式 -->
          <aside>
            <KftLabel label="联系方式" :isRequired="true"></KftLabel>
            <el-form-item prop="contactTel">
              <el-input v-model="formData.contactTel" placeholder="请输入联系方式"></el-input>
            </el-form-item>
          </aside>
        </div>
        <!-- 主表单行多项 第四行 -->
        <div class="form_row">
          <!-- 邮箱 -->
          <aside>
            <KftLabel label="邮箱"></KftLabel>
            <el-form-item>
              <el-input v-model="formData.mail" placeholder="请输入邮箱"></el-input>
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
        <!-- 主表单行多项 第二行 -->
        <div class="form_row">
          <aside>
            <!--  附件，数组形式 -->
            <KftLabel label="营业执照"></KftLabel>
            <!-- <el-form-item> -->
            <el-upload action accept=".jpg, .png" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :auto-upload="false" :on-change="onChangeFile">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="50%" :src="dialogImageUrl" style="padding:0 25%" />
            </el-dialog>
            <!-- </el-form-item> -->
          </aside>
        </div>
      </div>
    </el-form>
  </section>
</template>

<script>
import { getSupplierInfo, postSupplier, putSupplier } from "@/api/basicdata";
export default {
  /** 基础数据 供应商 表单 */
  name: "FormSupplier",
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
      fileList: [], // 文件列表
      dialogImageUrl: "",
      dialogVisible: false,
      /** 主表区域 必填字段校验 */
      rules: {
        supplierCode: [
          {
            required: true,
            message: "请输入供应商编码",
            trigger: "blur"
          }
        ],
        supplierName: [
          {
            required: true,
            message: "请输入供应商名称",
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
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    onChangeFile(file, fileList) {
      console.log("文件状态改变 FILE:", file, "FILELIST:", fileList);

      if (fileList.map(item => item.name == file.name).length > 1) {
        console.log("已有同名文件:", file.name);
        // this.handleRemove(file, fileList);
      }

      this.fileList = fileList;
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /** 按钮：保存
     * 将表单提交至后台
     */
    async onSave() {
      // 暂存 图片文件转base64的数组
      let tempFileToBase64List = [];
      for (let i = 0; i < this.fileList.length; i++) {
        let tempFileToBase64 = await this.GLOBAL.imgFileToBase64(
          this.fileList[i].raw
        );
        tempFileToBase64List.push(tempFileToBase64);
      }
      // 将暂存数组 赋值给 表单对象指定属性，用于递交至后台
      this.formData.attaches = tempFileToBase64List;
      // console.log("转为base64:", this.formData);
      this.$refs.formData.validate(valid => {
        if (valid) {
          /** 窗体内容加载效果：开启 */
          this.formLoading = true;
          console.warn("表单数据:", this.formData);
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
        this.formData = await getSupplierInfo(code);
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
        await postSupplier(this.formData);
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
        await putSupplier(params);
        this.$message.success("操作成功");
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    }
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
.avatar {
  width: 50px;
  height: 50px;
  display: block;
}
</style>