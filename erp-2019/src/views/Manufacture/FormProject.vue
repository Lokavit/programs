<template>
  <section :style="{'width':width}" v-loading="formLoading">
    <el-form :model="form" size="mini" :rules="rules" ref="form">
      <!-- 主表区域  包裹器 start -->
      <div class="form_container">
        <!-- 主表单行多项 第一行 -->
        <div class="form_row">
          <!-- 项目编号 -->
          <aside>
            <KftLabel :label="labels.entry.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="entry">
              <el-input size="mini" v-model="form.entry" :placeholder="`请输入${labels.entry.value}`" clearable :disabled="isDisabled"></el-input>
            </el-form-item>
          </aside>
          <!-- 同类型项目 -->
          <aside>
            <KftLabel :label="labels.referenceEntry.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.referenceEntry" :placeholder="`请输入${labels.referenceEntry.value}`" clearable></el-input>
          </aside>
          <!-- 船主 -->
          <aside>
            <KftLabel :label="labels.shipOwner.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.shipOwner" :placeholder="`请输入${labels.shipOwner.value}`" clearable></el-input>
          </aside>
          <!-- 合同日期 -->
          <aside>
            <KftLabel :label="labels.contractDate.value|FormatLabelSuffix"></KftLabel>
            <el-form-item>
              <el-date-picker size="mini" v-model="form.contractDate" type="date" :placeholder="`请选择${labels.contractDate.value}`" value-format="yyyy-MM-dd HH:mm:ss" style="width:-webkit-fill-available;"></el-date-picker>
            </el-form-item>
          </aside>
        </div>

        <!-- 主表单行多项 第二行 -->
        <div class="form_row">
          <!-- 项目名称 -->
          <aside>
            <KftLabel :label="labels.name.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="name">
              <el-input size="mini" v-model="form.name" :placeholder="`请输入${labels.name.value}`" clearable></el-input>
            </el-form-item>
          </aside>
          <!-- 总长 -->
          <aside>
            <KftLabel :label="labels.lengthOA.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.lengthOA" :placeholder="`请输入${labels.lengthOA.value}`" clearable></el-input>
          </aside>
          <!-- 型宽 -->
          <aside>
            <KftLabel :label="labels.breadthMLD.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.breadthMLD" :placeholder="`请输入${labels.breadthMLD.value}`" clearable></el-input>
          </aside>
          <!-- 设计吃水 -->
          <aside>
            <KftLabel :label="labels.designDraught.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.designDraught" :placeholder="`请输入${labels.designDraught.value}`" clearable></el-input>
          </aside>
        </div>

        <!-- 主表单行多项 第三行 -->
        <div class="form_row">
          <!-- 项目类型 -->
          <aside>
            <KftLabel :label="labels.projectType.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="projectType">
              <el-select v-model="form.projectType" :placeholder="`请选择${labels.projectType.value}`" @change="changeProjectType" style="width:-webkit-fill-available;">
                <el-option v-for="item in projectTypeOptions" :key="item.entry" :label="item.code" :value="item.code">
                  <span style="float: left">{{ item.code }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </aside>
          <!-- 垂线间长 -->
          <aside>
            <KftLabel :label="labels.lengthBP.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.lengthBP" :placeholder="`请输入${labels.lengthBP.value}`" clearable></el-input>
          </aside>
          <!-- 型深 -->
          <aside>
            <KftLabel :label="labels.depthMLD.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.depthMLD" :placeholder="`请输入${labels.depthMLD.value}`" clearable style="width:240px"></el-input>
          </aside>
          <!-- 结构吃水 -->
          <aside>
            <KftLabel :label="labels.scantlingDraught.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.scantlingDraught" :placeholder="`请输入${labels.scantlingDraught.value}`" clearable></el-input>
          </aside>
        </div>

        <!-- 主表单行多项 第四行 -->
        <div class="form_row">
          <!-- 船型 -->
          <aside>
            <KftLabel :label="labels.shipType.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="shipType">
              <el-select v-model="form.shipType" :placeholder="`请选择${labels.shipType.value}`" @change="changeShipType" style="width:-webkit-fill-available;">
                <el-option v-for="item in shipTypeOptions" :key="item.entry" :label="item.code" :value="item.code">
                  <span style="float: left">{{ item.code }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </aside>
          <!-- 主机 -->
          <aside>
            <KftLabel :label="labels.mainEngine.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.mainEngine" :placeholder="`请输入${labels.mainEngine.value}`" clearable></el-input>
          </aside>
          <!-- 载重量 -->
          <aside>
            <KftLabel :label="labels.deadWeight.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.deadWeight" :placeholder="`请输入${labels.deadWeight.value}`" clearable></el-input>
          </aside>
          <!-- 货舱容积 -->
          <aside>
            <KftLabel :label="labels.cargoHoldCapacity.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.cargoHoldCapacity" :placeholder="`请输入${labels.cargoHoldCapacity.value}`" clearable></el-input>
          </aside>
        </div>

        <div class="form_row">
          <!-- 船种 -->
          <aside>
            <KftLabel :label="labels.shipKind.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="shipKind">
              <el-select v-model="form.shipKind" :placeholder="`请选择${labels.shipKind.value}`" @change="changeShipKind" style="width:-webkit-fill-available;">
                <el-option v-for="item in shipKindOptions" :key="item.entry" :label="item.code" :value="item.code">
                  <span style="float: left">{{ item.code }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </aside>
          <!-- 服务航速 -->
          <aside>
            <KftLabel :label="labels.serviceSpeed.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.serviceSpeed" :placeholder="`请输入${labels.serviceSpeed.value}`" clearable></el-input>
          </aside>
          <!-- 续航力 -->
          <aside>
            <KftLabel :label="labels.endurance.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.endurance" :placeholder="`请输入${labels.endurance.value}`" clearable></el-input>
          </aside>
          <!-- 船员定额 -->
          <aside>
            <KftLabel :label="labels.complement.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.complement" :placeholder="`请输入${labels.complement.value}`" clearable></el-input>
          </aside>
        </div>

        <!-- 主表单行 [1行4列] 第四行 end  classification  船级 -->
        <div class="form_row">
          <aside>
            <KftLabel :label="labels.classification.value|FormatLabelSuffix"></KftLabel>
            <el-input type="textarea" size="mini" v-model="form.classification" :placeholder="`请输入${labels.classification.value}`"></el-input>
          </aside>
        </div>
      </div>
      <!-- 主表区域  包裹器 end -->

      <!-- 提交 / 重置 表单 -->
      <div style="text-align:center;padding-top:20px">
        <el-button type="primary" size="mini" @click="onSubmit()">提交</el-button>
        <el-button size="mini" @click="onCancel()">取消</el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import { getProjectInfo, postProject, putProject } from "@/api/manufacture";
import { getSelectLists } from "@/api/common";
export default {
  // 生产模块 项目登记 表单页
  name: "FormProject",
  data() {
    return {
      projectTypeOptions: [], // 项目类型下拉选项组
      shipTypeOptions: [], // 船型下拉选项组
      shipKindOptions: [], // 船种下拉选项组
      /** 窗体内容的 v-loading属性控制值
       * 防止网路环境较差时，窗体内数据返回较慢，窗体空白
       * 防止网路环境较差时，提交事件响应结果及回显较慢，使用者误操作
       */
      formLoading: false,
      form: {
        shipType: "", // 船型 [非新增时所需]
        shipKind: "" // 船种 [非新增时所需]
      },
      rules: {
        entry: [
          {
            required: true,
            message: "请输入项目编号",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入项目名称",
            trigger: "blur"
          }
        ],
        projectType: [
          { required: true, message: "请选择项目类型", trigger: "change" }
        ],
        shipType: [
          { required: true, message: "请选择船型", trigger: "change" }
        ],
        shipKind: [{ required: true, message: "请选择船种", trigger: "change" }]
      },
      isDisabled: false // 是否禁止输入
    };
  },
  computed: {
    /** 当前窗体宽度值计算 [根据全局设定基数等比缩放] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
    },
    /** 当前窗体标注组 [后台获取所有标注] */
    labels() {
      return this.$store.getters.labels.Project.formLabels;
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
    // 渲染完成后，请求项目类型下拉选项组
    this.getProjectType();
    // 获取船型下拉选项组
    this.getShipType();
    // 如果有由列表页传递过来的值，即判定为修改表单操作
    if (this.passValue) {
      this.isDisabled = true; // 设置指定项不可输入
      this.getDataInfo(); // 根据传递过来的值，请求对于数据，填充表单
    }
  },
  methods: {
    /** 每次变更项目类型选项 */
    changeProjectType(val) {},
    /** 变更船型选择项 */
    changeShipType(val) {
      console.log("变更船型选择项：", val);

      let temp = this.shipTypeOptions.find(item => item.code == val);

      this.getShipKind(temp.entry); // 调用请求船种API函数
    },
    /** 变更船种选择项 */
    changeShipKind(val) {},

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
        const res = await getProjectInfo(this.passValue);
        console.log("获取单条数据详细信息RES:", res);
        this.form = res;
        // 返回的数据，调用一下请求船种下拉,把当前船型数据传入进去
        this.getShipKind(this.form.shipType);
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /** 新增数据 */
    async postData() {
      try {
        const res = await postProject(this.form);
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
        const res = await putProject(this.form);
        this.form = res;
        this.$message.success("修改成功");
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /** 获取项目类型数据 */
    async getProjectType() {
      let params = {
        code: "CommonCode",
        parentEntry: "PMS-ProjectType"
      };
      const res = await getSelectLists(params);
      this.projectTypeOptions = res;
    },

    // 获取船型下拉选项数据(该数据由数据字典来)
    async getShipType() {
      let params = {
        code: "CommonCode",
        parentEntry: "PMS-ShipType"
      };
      const res = await getSelectLists(params);
      console.log("获取船型数据:", res);
      this.shipTypeOptions = res;
    },
    /**
     * 获取船种下拉选项数据(该数据由数据字典来)
     * 注意:此处将请求回来的数据集中第一项，作为默认选项
     */
    async getShipKind(entry = "") {
      if (!entry) this.$message.warning("请选择船型");
      let params = {
        code: "CommonCode",
        parentEntry: entry
      };
      const res = await getSelectLists(params);
      this.shipKindOptions = res;
      // 当船型发生变动时，每次都将最新请求回来的船种数据中的第一项，作为船种的默认选项。
      // 如此，即可解决船型选择发生变动时，船种的选中数据没有变更。
      // this.form.shipKind = this.shipKindOptions[0].name;
    }
  }
};
</script>
