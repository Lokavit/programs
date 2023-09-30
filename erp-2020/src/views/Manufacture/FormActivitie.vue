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
          <!-- 项目编号 -->
          <aside>
            <KftLabel :label="labels.projectEntry.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="projectEntry">
              <!-- 由于ChooseList封装在内，所以此处使用 isDisabled值决定渲染哪一个组件 -->
              <template v-if="!isDisabled">
                <KftChoose code="Project" v-model="form.projectEntry" show-detail @on-choose-selected="chooseProject" :placeholder="`请选择${labels.projectEntry.value}`" size="mini"></KftChoose>
              </template>
              <template v-if="isDisabled">
                <el-input v-model="form.projectEntry" :placeholder="`请输入${labels.projectEntry.value}`" clearable :disabled="isDisabled"></el-input>
              </template>
            </el-form-item>
          </aside>
          <!-- 项目名称 -->
          <aside>
            <KftLabel :label="labels.projectName.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.projectName" :placeholder="`请输入${labels.projectName.value}`" clearable :disabled="true"></el-input>
          </aside>
          <!-- 作业科 -->
          <aside>
            <KftLabel :label="labels.workSection.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.workSection" :placeholder="`请输入${labels.workSection.value}`" clearable></el-input>
          </aside>
        </div>

        <!-- 主表单行多项 第二行 -->
        <div class="form_row">
          <!-- 作业对象 -->
          <aside>
            <KftLabel :label="labels.workObject.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="workObject">
              <KftChoose code="WorkObject" :projectEntry="projectEntry" v-model="form.workObject" show-detail @on-choose-selected="chooseWorkObject" :placeholder="`请选择${labels.workObject.value}`" size="mini"></KftChoose>
            </el-form-item>
          </aside>
          <!-- 作业类型 -->
          <aside>
            <KftLabel :label="labels.workArea.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="workArea">
              <el-select v-model="form.workArea" :placeholder="`请选择${labels.workArea.value}`" @change="changeWorkArea" style="width:-webkit-fill-available;">
                <el-option v-for="item in workAreaOptions" :key="item.entry" :label="item.code" :value="item.code">
                  <span style="float: left">{{ item.code }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </aside>
          <!-- 作业阶段 -->
          <aside>
            <KftLabel :label="labels.workStage.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="workStage">
              <el-select v-model="form.workStage" :placeholder="`请选择${labels.workStage.value}`" @change="changeWorkStage" style="width:-webkit-fill-available;">
                <el-option v-for="item in workStageOptions" :key="item.entry" :label="item.code" :value="item.code">
                  <span style="float: left">{{ item.code }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </aside>
          <!-- 详细工种 -->
          <aside>
            <KftLabel :label="labels.skill.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="skill">
              <el-select v-model="form.skill" :placeholder="`请选择${labels.skill.value}`" @change="changeSkill" style="width:-webkit-fill-available;">
                <el-option v-for="item in skillOptions" :key="item.entry" :label="item.code" :value="item.code">
                  <span style="float: left">{{ item.code }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </aside>
        </div>

        <!-- 主表单行多项 第三行 -->
        <div class="form_row" style="padding-bottom:14px;">
          <!-- 预定开始日期 -->
          <aside>
            <KftLabel :label="labels.plannedStartDate.value|FormatLabelSuffix"></KftLabel>
            <el-date-picker size="mini" v-model="form.plannedStartDate" type="date" :placeholder="`请选择${labels.plannedStartDate.value}`" value-format="yyyy-MM-dd"></el-date-picker>
          </aside>
          <!-- 预定结束日期 -->
          <aside>
            <KftLabel :label="labels.plannedFinishDate.value|FormatLabelSuffix"></KftLabel>
            <el-date-picker size="mini" v-model="form.plannedFinishDate" type="date" :placeholder="`请选择${labels.plannedFinishDate.value}`" value-format="yyyy-MM-dd"></el-date-picker>
          </aside>
          <!-- 预定日历工期 -->
          <aside>
            <KftLabel :label="labels.calendarPeriod.value|FormatLabelSuffix"></KftLabel>
            <el-date-picker size="mini" v-model="form.calendarPeriod" type="date" :placeholder="`请选择${labels.calendarPeriod.value}`" value-format="yyyy-MM-dd"></el-date-picker>
          </aside>
          <!-- 预定物量 -->
          <aside>
            <KftLabel :label="labels.plannedProductVolume.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.plannedProductVolume" :placeholder="`请输入${labels.plannedProductVolume.value}`" clearable></el-input>
          </aside>
        </div>

        <!-- 主表单行多项 第四行 -->
        <div class="form_row" style="padding-bottom:14px;">
          <!-- 物量单位 -->
          <aside>
            <KftLabel :label="labels.productVolumeUnit.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.productVolumeUnit" :placeholder="`请输入${labels.productVolumeUnit.value}`" clearable></el-input>
          </aside>
          <!-- 状态 -->
          <aside>
            <template v-if="isDisabled">
              <KftLabel :label="labels.state.value|FormatLabelSuffix"></KftLabel>
              <el-input size="mini" v-model="form.state" :placeholder="`${labels.state.value}`" clearable :disabled="true"></el-input>
            </template>
          </aside>
          <aside></aside>
          <aside></aside>
        </div>

        <!-- 主表单行多项 第五行 -->
        <div class="form_row">
          <!-- 备注 -->
          <aside style="padding-bottom:14px">
            <KftLabel :label="labels.description.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" type="textarea" v-model="form.description" :placeholder="`请输入${labels.description.value}`"></el-input>
          </aside>
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
import {
  getActivitieInfo,
  postActivitie,
  putActivitie
} from "@/api/manufacture";
import { getSelectLists } from "@/api/common";
export default {
  // 生产模块 中日程 表单页
  name: "FormActivitie",
  data() {
    return {
      /** 窗体内容的 v-loading属性控制值
       * 防止网路环境较差时，窗体内数据返回较慢，窗体空白
       * 防止网路环境较差时，提交事件响应结果及回显较慢，使用者误操作
       */
      formLoading: false,
      projectEntry: "", // 该属性用于 作业对象chooseList所需
      workAreaOptions: [], // 作业类型下拉选项组
      workStageOptions: [], // 作业阶段下拉选项组
      skillOptions: [], // 详细工种下拉选项组
      /** 主表区域 表单对象 */
      form: {},
      /** 主表区域 必填字段校验 */
      rules: {
        entry: [
          {
            required: true,
            message: "请输入编码",
            trigger: "blur"
          }
        ],
        projectEntry: [
          {
            required: true,
            message: "请输入项目编码",
            trigger: "blur"
          }
        ],
        workObject: [
          {
            required: true,
            message: "请输入作业对象",
            trigger: "blur"
          }
        ],
        workArea: [
          { required: true, message: "请选择作业类型", trigger: "change" }
        ],
        workStage: [
          { required: true, message: "请选择作业阶段", trigger: "change" }
        ],
        skill: [
          { required: true, message: "请选择详细工种", trigger: "change" }
        ]
      },
      /** 此开关的多种作用
       * 1.是否禁止输入
       * 2.状态一项默认不显示，由于其独占一行，所以从el-row开始包裹
       */
      isDisabled: false
    };
  },
  computed: {
    /** 当前窗体宽度值计算 [根据全局设定基数等比缩放] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
    },
    /** 当前窗体标注组 [后台获取所有标注] */
    labels() {
      return this.$store.getters.labels.Activitie.formLabels;
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
    /** 项目的chooseList 选中 */
    chooseProject(selectedRow) {
      console.log("EVENT:", event);
      this.$set(this.form, "projectEntry", selectedRow.entry);
      this.$set(this.form, "projectName", selectedRow.name);
      this.projectEntry = selectedRow.entry;
      this.$delete(this.form, "workObject");
    },
    /** 作业对象的chooseList 选中 */
    chooseWorkObject(selectedRow) {
      console.log("ChooseSelect!作业对象:", selectedRow);
      this.$set(this.form, "workObject", selectedRow.entry);
    },

    /** 作业类型 下拉选项 变更函数 */
    changeWorkArea(val) {
      console.log("作业类型选择变更函数:", val);
      let temp = this.workAreaOptions.find(item => item.code == val);
      console.log("TEMP:", temp);
      this.getWorkStage(temp.entry); // 调用
    },
    /** 作业阶段 下拉选项 变更函数 */
    changeWorkStage(val) {
      console.log("作业阶段选择变更函数:", val);
      let temp = this.workStageOptions.find(item => item.code == val);
      this.getSkill(temp.entry);
    },
    /** 详细工种 下拉选项 变更函数 */
    changeSkill(val) {
      console.log("详细工种选择变更函数:", val);
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
        code: "Wbs"
        // parentEntry: "PMS-WorkArea"
      };
      const res = await getSelectLists(params);
      this.workAreaOptions = res;
      // this.form.workArea = this.workAreaOptions[0].name;
    },
    /** 获取作业阶段数据集，用于作业阶段下拉选项组 */
    async getWorkStage(entry = "") {
      if (!entry) this.$message.warning("请选择作业类型");
      let params = {
        code: "Wbs",
        parentEntry: entry
      };
      const res = await getSelectLists(params);
      this.workStageOptions = res;
      // this.form.workStage = this.workStageOptions[0].name;
    },
    /** 获取详细工种数据集，用于详细工种下拉选项组 */
    async getSkill(entry = "") {
      if (!entry) this.$message.warning("请选择作业阶段");
      let params = {
        code: "Wbs",
        parentEntry: entry
      };
      const res = await getSelectLists(params);
      this.skillOptions = res;
      // this.form.skillCode = this.skillOptions[0].name;
    },

    async getDataInfo() {
      try {
        /** 窗体内容加载效果：开启 */
        this.formLoading = true;
        const res = await getActivitieInfo(this.passValue);
        console.log("获取单条数据详细信息RES:", res);
        this.form = res;
        this.form.state = res.state == "confirm" ? "确认" : "未确认";
        this.getWorkStage(this.form.workArea); // 调用请求作业阶段
        this.getSkill(this.form.workStage); // 调用请求详细工种
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /** 新增数据 */
    async postData() {
      try {
        const res = await postActivitie(this.form);
        this.form = res; // 返回结果中的数据，回显至表单上
        this.isDisabled = true; // 新增的数据提交之后，不可更改
        this.$message.success("提交成功");
        this.form.state = res.state == "confirm" ? "确认" : "未确认";
      } catch (error) {
        this.isDisabled = false; // 编码可输入
      }
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    // 更新数据
    async putData() {
      try {
        const res = await putActivitie(this.form);
        this.form = res;
        this.$message.success("修改成功");
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    }
  }
};
</script>
