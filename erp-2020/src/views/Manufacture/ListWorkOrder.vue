<template>
  <section :style="{'width':width}" class="modal_list">
    <!-- 列表页 查询区域 -->
    <el-form :inline="true" :model="search" size="mini" @submit.native.prevent>
      <div class="form_row">
        <!-- 项目编码 必填 -->
        <aside>
          <KftLabel :label="labels.projectEntry.value|FormatLabelSuffix"></KftLabel>
          <KftChoose code="Project" v-model="search.projectEntry" show-detail @on-choose-selected="chooseProject" :placeholder="`请选择${labels.projectEntry.value}`" size="mini"></KftChoose>
        </aside>
        <!-- 中日程 -->
        <aside>
          <KftLabel :label="labels.activityEntry.value|FormatLabelSuffix"></KftLabel>
          <KftChoose code="Activity" :projectEntry="projectEntry" v-model="search.activityEntry" show-detail @on-choose-selected="chooseActivity" :placeholder="`请选择${labels.activityEntry.value}`" size="mini" :single="false" :search="search"></KftChoose>
        </aside>

        <!-- 编码 -->
        <aside>
          <KftLabel :label="labels.entry.value|FormatLabelSuffix"></KftLabel>
          <el-input size="mini" v-model="search.entry" :placeholder="`请输入${labels.entry.value}`"></el-input>
        </aside>
        <!-- 作业对象 -->
        <aside>
          <KftLabel :label="labels.workObject.value|FormatLabelSuffix"></KftLabel>
          <KftChoose code="WorkObject" :projectEntry="projectEntry" v-model="search.workObject" show-detail @on-choose-selected="chooseWorkObject" :placeholder="`请选择${labels.workObject.value}`" size="mini"></KftChoose>
        </aside>
      </div>

      <div class="form_row" style="margin-top:14px;">
        <!-- 作业类型 -->
        <aside>
          <KftLabel :label="labels.workArea.value|FormatLabelSuffix"></KftLabel>
          <el-select v-model="search.workArea" :placeholder="`请选择${labels.workArea.value}`" @change="changeWorkArea" size="mini" clearable>
            <el-option v-for="item in workAreaOptions" :key="item.entry" :label="item.code" :value="item.code">
              <span style="float: left">{{ item.code }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </aside>
        <!-- 作业阶段 -->
        <aside>
          <KftLabel :label="labels.workStage.value|FormatLabelSuffix"></KftLabel>
          <el-select v-model="search.workStage" :placeholder="`请选择${labels.workStage.value}`" @change="changeWorkStage" size="mini" clearable>
            <el-option v-for="item in workStageOptions" :key="item.entry" :label="item.code" :value="item.code">
              <span style="float: left">{{ item.code }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
            </el-option>
          </el-select>
        </aside>

        <aside>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit" size="mini" style="margin-left:40px;">查询</el-button>
        </aside>
        <aside style="position:relative;">
          <el-button type="info" @click="onCreate" size="mini" style="position:absolute;right:70px">
            <i class="kft-icon-create"></i>
            <span>添加</span>
          </el-button>
          <el-button type="info" @click="onSubmit" size="mini" style="position:absolute;right:0px">
            <i class="kft-icon-refresh"></i>
            <span>刷新</span>
          </el-button>
        </aside>
      </div>
    </el-form>

    <!-- 列表区域 -->

    <el-table v-loading="tableLoading" :data="tableData.content" border highlight-current-row size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" empty-text="请输入项目编码进行查询" stripe>
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column prop="entry" label="编码" align="center">
        <template v-slot="scope">
          <span @click="onCell" class="span-hover">{{scope.row.entry}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="projectEntry" label="项目编码" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="projectName" label="项目名称" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="workObject" label="作业对象" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="workCode" label="作业指示编码" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="workName" label="作业指示名称" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="plannedPhysicalUnit" label="预定物量" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="plannedStartDate" label="预定开始日期" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="plannedFinishDate" label="预定结束日期" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="state" label="状态" show-overflow-tooltip align="center">
        <template v-slot="scope">{{scope.row.state|FormatActivitieState}}</template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <KftPagination :total="tableData.totalElements" :page-size="tableData.size" :fetch-data="getDataList" style="float:right;margin-top:10px;"></KftPagination>
  </section>
</template>

<script>
import { getWorkOrders } from "@/api/manufacture";
import FormWorkOrder from "./FormWorkOrder";
import { getSelectLists } from "@/api/common";
export default {
  // 生产模块 作业指示 列表页
  name: "ListWorkOrder",
  components: { FormWorkOrder },
  data() {
    return {
      /** 列表中的表头样式 */
      headerCellStyle: this.GLOBAL.LIST_TABLE_HEADER_CELL_STYLE,
      /** 列表中的单元格样式 [非表头部分] */
      cellStyle: this.GLOBAL.LIST_TABLE_CELL_STYLE,
      /** 防止网路环境较差时，列表数据请求返回较慢，局部假死 */
      tableLoading: false,
      projectEntry: "", // 该属性用于 作业对象chooseList所需
      workAreaOptions: [], // 作业类型下拉选项组
      workStageOptions: [], // 作业阶段下拉选项组
      /** 查询的from */
      search: {
        // workStage: "" // 作业阶段
      },
      /** 列表区域 相关 */
      tableData: {
        content: [], // 表格数据
        number: 0, // 当前页数
        size: this.GLOBAL.returnTableDataSize(), // 每页条数
        totalElements: 0, // 当前列表数据总条数
        totalPages: 0 // 总页数
      },
      currentRow: [] // 表格的当前选中行
    };
  },
  computed: {
    /** 当前窗体宽度值计算 [根据全局设定基数等比缩放] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
    },
    /** 当前窗体标注组 [后台获取所有标注] */
    labels() {
      return this.$store.getters.labels.WorkOrder.listLbales;
    }
  },
  watch: {},
  created() {},
  beforeMount() {},
  mounted() {
    this.getWorkArea(); // 调用作业类型请求
  },
  methods: {
    /** 项目的chooseList 选中 */
    chooseProject(selectedRow) {
      this.search = {}; // 每次变更项目编码前,情况查询对象的原有属性
      this.$set(this.search, "projectEntry", selectedRow.entry);
      this.projectEntry = selectedRow.entry;
    },
    /** 中日程 chooseList 选中项 */
    chooseActivity(selectedRow) {
      this.$set(this.search, "activityEntry", selectedRow.entry);
    },

    /** 作业对象的chooseList 选中 */
    chooseWorkObject(selectedRow) {
      this.$set(this.search, "workObject", selectedRow.entry);
    },

    /** 作业类型 下拉选项 变更函数 */
    changeWorkArea(val) {
      this.getWorkStage(val); // 调用
    },
    /** 作业阶段 下拉选项 变更函数 */
    changeWorkStage(val) {},

    /**
     * 该提交事件含以下作用：
     *    使用者输入内容按下查询按钮
     *    使用者点击窗体内的刷新按钮
     * 参数为:查询的关键字，或许有多个，所以[search]为object格式
     */
    onSubmit() {
      // 如果查询区域的[项目编码]项中没有值，提示用户输入。这是查询的必要条件，其它输入为辅助
      if (!this.search.projectEntry) this.$message.warning("请输入项目编码");
      if (this.search.projectEntry) {
        // 调用 获取数据， 传入第三个参数(查询对象)
        this.getDataList(
          this.tableData.number,
          this.tableData.size,
          this.search
        );
      }
    },
    /** 新增按钮 事件 */
    onCreate(event) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      this.openModal(); // 点击添加按钮时，调用此处的打开模态框函数
    },
    /** 点击单元格，将获取到的内容，传入到openModal中，同时亦带入详情页面 */
    onCell(event) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      // 调用打开模态框函数，将获取到的单元格数据[itemCode]物料编码传入
      this.openModal(event.target.innerText);
    },

    /** 获取作业类型数据集，用于作业类型下拉选项组 */
    async getWorkArea() {
      let params = {
        code: "Wbs"
      };
      const res = await getSelectLists(params);
      this.workAreaOptions = res;
      // this.form.workArea = this.workAreaOptions[0].name;
    },
    /** 获取作业阶段数据集，用于作业阶段下拉选项组 */
    async getWorkStage(entry = "") {
      // if (!entry) this.$message.warning("请选择作业类型");
      let params = {
        code: "Wbs",
        parentEntry: entry
      };
      const res = await getSelectLists(params);
      this.workStageOptions = res;
      // this.search.workStage = this.workStageOptions[0].name;
    },
    /**
     * 获取当前页面列表数据集
     * page: 当前页
     * size: 每页数据集条数
     * search: 于查询框输入的值,当其为对象时，使用[...search]解构
     */
    async getDataList(page, size, search = {}) {
      let params = {
        page: page > 0 ? page - 1 : 0,
        size: this.tableData.size,
        ...this.GLOBAL.removeEmptyObjectProperty(search) // 解构赋值
      };
      /** 列表数据加载效果：开启 */
      this.tableLoading = true;
      try {
        let res = await getWorkOrders(params);
        this.tableData = res;
      } catch (err) {}
      /** 列表数据加载效果：关闭 */
      this.tableLoading = false;
    },

    /**
     * 打开模态框函数，code默认为空,通常[修改|查看]时需要该参数值
     * 该函数打开的表单有多种形式:
     * 新增数据:点击新建时,调用此函数，打开一个空白表单，用户填写；
     * 修改数据:点击某行指定单元格，传入[code单元格明文内容]，打开表单，根据内容请求后台数据，填充于当前表单页，用户修改；
     */
    openModal(code = "") {
      let newModal = {
        // 调用获取当前对话框title函数 ,加上传入的code，作为打开的模态框的标题
        title: `${this.GLOBAL.getCurrentModalTitle(
          this.$parent.$parent.$el
        )} ${code}`,
        timestamp: Number(new Date()), // 时间戳，用于区别Madal  精确至毫秒
        show: true, // 默认显示
        levelNumber: this.$store.getters.levelNumberMax, // 层级
        /** 每个窗体初始化的坐标值 */
        position: this.$store.getters.modalPosition,
        // 其它内容，放在这里，比如打开时，带的数据， or 对应 component？
        content: {
          component: FormWorkOrder,
          code: code
        }
      };
      this.$store.dispatch("modal/openModal", newModal);
      this.createTask(newModal); // 调用创建窗体对应任务栏函数
    },

    /** 创建窗体对应任务栏
     * @param modal 传入在该函数之前创建的窗体对象
     * @returns 创建并打开新的窗体与之对应的任务项
     */
    createTask(modal) {
      // 窗体创建完成之后，创建任务栏对应 task，添加到任务栏组
      let newTask = {
        title: modal.title, // 传入的modal的标题
        timestamp: modal.timestamp, // modal的时间戳
        // show: !modal.show // modal显隐 反向
        show: modal.show // modal显隐 通窗体状态。2019.12.26
      };
      this.$store.dispatch("taskbar/addTask", newTask);
    }
  }
};
</script>
