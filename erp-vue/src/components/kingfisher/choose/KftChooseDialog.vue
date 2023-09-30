<template>
  <el-dialog title="项目 清单" :visible="dialogVisible" :modal-append-to-body="false" modal-append-to-body :append-to-body="true" :before-close="cancelHandler" width="80%" style="margin-top:-60px">
    <el-card :body-style="{ padding: '0px' }" style="margin-top:-30px;margin-bottom:20px;">
      <!-- 查询区域  默认情况 查询条为横向  -->
      <template v-if="single">
        <el-form :model="searchData" size="mini" style="padding:14px 20px 14px 0" @submit.native.prevent>
          <div class="form_row">
            <!-- 第一列 查询输入框 -->
            <aside>
              <KftLabel :label="labels.keyword.value|FormatLabelSuffix"></KftLabel>
              <el-input size="mini" v-model="searchData.keyword" :placeholder="`请输入${labels.keyword.value}`" @keyup.enter.native="onSubmit" clearable @clear="onSubmit"></el-input>
            </aside>
            <!-- 第二列 查询按钮 -->
            <aside>
              <el-button type="primary" icon="el-icon-search" @click="onSubmit" size="mini" style="margin-left:40px;">查询</el-button>
            </aside>
            <aside></aside>
            <aside></aside>
          </div>
        </el-form>
      </template>
      <!-- 查询区域 多条件查询的情况 该区域为 一行四列布局方式。-->
      <template v-else>
        <el-form :model="searchData" size="mini" style="padding:14px 20px 14px 0" @submit.native.prevent>
          <div class="form_row" style="margin-bottom:14px;margin-right:20px">
            <!-- 项目编码 外部带入 不可再改 -->
            <aside>
              <KftLabel :label="labels.projectEntry.value|FormatLabelSuffix"></KftLabel>
              <el-input size="mini" v-model="searchData.projectEntry" :placeholder="`请输入${labels.projectEntry.value}`" :disabled="true"></el-input>
            </aside>
            <!-- 编码 -->
            <aside>
              <KftLabel :label="labels.entry.value|FormatLabelSuffix"></KftLabel>
              <el-input size="mini" v-model="searchData.entry" :placeholder="`请输入${labels.entry.value}`"></el-input>
            </aside>
            <!-- 作业类型 -->
            <aside>
              <KftLabel :label="labels.workArea.value|FormatLabelSuffix"></KftLabel>
              <el-select v-model="searchData.workArea" :placeholder="`请选择${labels.workArea.value}`" @change="changeWorkArea" size="mini" clearable>
                <el-option v-for="item in workAreaOptions" :key="item.entry" :label="item.code" :value="item.code">
                  <span style="float: left">{{ item.code }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </aside>
            <!-- 作业阶段 -->
            <aside>
              <KftLabel :label="labels.workStage.value|FormatLabelSuffix"></KftLabel>
              <el-select v-model="searchData.workStage" :placeholder="`请选择${labels.workStage.value}`" @change="changeWorkStage" size="mini" clearable>
                <el-option v-for="item in workStageOptions" :key="item.entry" :label="item.code" :value="item.code">
                  <span style="float: left">{{ item.code }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.name }}</span>
                </el-option>
              </el-select>
            </aside>
          </div>

          <div class="form_row">
            <!-- 作业对象 -->
            <aside>
              <KftLabel :label="labels.workObject.value|FormatLabelSuffix"></KftLabel>
              <el-input size="mini" v-model="searchData.workObject" :placeholder="`请输入${labels.workObject.value}`"></el-input>
            </aside>
            <!-- 第二列 查询按钮 -->
            <aside>
              <el-button type="primary" icon="el-icon-search" @click="onSubmit" size="mini" style="margin-left:40px;">查询</el-button>
            </aside>
            <aside></aside>
            <!-- 第三列 按钮组   -->
            <aside style="position:relative;">
              <el-button type="warning" @click="onSubmit" size="mini" style="position:absolute;right:0px">
                <i class="kft-icon-refresh"></i>
                <span>刷新</span>
              </el-button>
            </aside>
          </div>
        </el-form>
      </template>
    </el-card>

    <!-- 列表区域 -->
    <el-table v-loading="tableLoading" :data="tableData.content" border highlight-current-row size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" :style="{'width':width}" @current-change="handleCurrentChange" @row-dblclick="onSelectRow">
      <el-table-column type="index" align="center"></el-table-column>
      <template v-for="tableColumn in tableColumns">
        <el-table-column :prop="tableColumn.prop" :label="tableColumn.label" show-overflow-tooltip align="center">
          <!-- 批次管理，该项需要管道过滤器 -->
          <template v-if="tableColumn.prop=='managementType'" v-slot="scope">{{scope.row[tableColumn.prop]|FormatManagementType}}</template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 分页区域 -->
    <KftPagination :total="tableData.totalElements" :page-size="tableData.size" :fetch-data="getDataList" style="float:right;"></KftPagination>

    <div slot="footer">
      <!-- <el-button type="primary" @click="confirmHandler" size="mini">确 认</el-button>
      <el-button @click="cancelHandler" size="mini">取 消</el-button> -->
    </div>
  </el-dialog>
</template>

<script>
import chooseTypes from "./chooseTypes.json";
import { getChooseList, getSelectLists } from "@/api/common";
export default {
  name: "KftChooseDialog",
  props: {
    /**
     * 对话框是否显示 ，于父组件中的包裹元素 v-if变量绑定，达到手动控制本组件是否渲染
     */
    dialogVisible: {
      type: Boolean,
      default: false
    },
    code: { type: String, default: "" }, //控件类型
    // 尝试添加项目编码进来 用于作业类型
    projectEntry: { type: String, default: "" },
    // 默认是单个查询项，即启用查询条的模式 [单行表单还是多行表单]
    single: { type: Boolean, default: true },
    // 查询区域 对象
    search: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      /** 列表区域的宽度值 [列表页根据table宽度决定整体宽度] */
      width: this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE),
      /** 列表中的表头样式 */
      headerCellStyle: this.GLOBAL.LIST_TABLE_HEADER_CELL_STYLE,
      /** 列表中的单元格样式 [非表头部分] */
      cellStyle: this.GLOBAL.LIST_TABLE_CELL_STYLE,
      /** 防止网路环境较差时，列表数据请求返回较慢，局部假死 */
      tableLoading: false,
      /** 标注组 之后会从后台获取所有标注 */
      labels: {
        keyword: { default: "关键词", custom: "", value: "关键词" },
        projectEntry: { default: "项目编码", custom: "", value: "项目编码" },
        entry: { default: "编码", custom: "", value: "编码" },
        workObject: { default: "作业对象", custom: "", value: "作业对象" },
        workArea: { default: "作业类型", custom: "", value: "作业类型" },
        workStage: { default: "作业阶段", custom: "", value: "作业阶段" }
      },
      workAreaOptions: [], // 作业类型下拉选项组
      workStageOptions: [], // 作业阶段下拉选项组
      // /** 查询的from */
      // search: {},
      /** 列表区域 相关 */
      tableData: {
        content: [], // 表格数据
        number: 0, // 当前页数
        size: this.GLOBAL.returnTableDataSize(), // 每页条数
        totalElements: 0, // 当前列表数据总条数
        totalPages: 0 // 总页数
      },
      chooseTypes, //可用的choose类型
      currentRow: null
    };
  },
  computed: {
    /**
     * 当前组件中 el-table的表头
     * 该数据由当前传入[code]值,其对应的json文件，对应属性中的表头数组
     */
    tableColumns() {
      return chooseTypes[this.code].thead;
    },
    // 是否为单组件表单 计算props中的[single]属性值
    singleForm() {
      return this.single;
    },
    // 查询对象 计算props中的 [search]查询对象
    searchData: {
      get() {
        return this.search;
      },
      set(newVal) {
        console.log("newVal:", newVal);
        // return newVal;
        this.search = newVal;
      }
    }
  },
  watch: {},
  mounted() {
    if (this.singleForm) {
      this.getDataList();
    }
    this.getWorkArea(); // 调用作业类型请求
  },
  methods: {
    handleCurrentChange(selectedRow) {
      //处理变更选中行
      this.currentRow = selectedRow;
    },
    /** 行双击事件 */
    onSelectRow(row, column, event) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      //处理dialog确认按钮
      if (this.tableLoading) {
        this.$message("加载中请稍后");
      } else {
        if (this.currentRow) {
          // 于父组件中实现的事件，用于控制本组件是否渲染
          this.$emit("on-comfirm", this.currentRow);
        } else {
          this.$message("请选择一行数据");
        }
      }
    },
    // /**
    //  * 对话框的确定事件
    //  */
    // confirmHandler() {
    //   //处理dialog确认按钮
    //   if (this.tableLoading) {
    //     this.$message("加载中请稍后");
    //   } else {
    //     if (this.currentRow) {
    //       // 于父组件中实现的事件，用于控制本组件是否渲染
    //       this.$emit("on-comfirm", this.currentRow);
    //     } else {
    //       this.$message("请选择一行数据");
    //     }
    //   }
    // },
    /**
     * 对话框的取消事件
     */
    cancelHandler() {
      this.$emit("on-cancel");
    },
    /**
     * 查询按钮点击事件
     * 参数为:查询的关键字，或许有多个，所以为object格式
     */
    onSubmit() {
      console.log("查询数据提交：", this.searchData);
      // 如果
      if (!this.searchData) this.getDataList();
      if (this.searchData.keyword) {
        // 调用 获取数据， 将输入的查询关键字，传入第三个参数
        this.getDataList(
          this.tableData.number,
          this.tableData.size,
          this.searchData
        );
      } else {
        this.getDataList(
          this.tableData.number,
          this.tableData.size,
          this.searchData
        );
      }
    },

    /** 作业类型 下拉选项 变更函数 */
    changeWorkArea(val) {
      let temp = this.workAreaOptions.find(item => item.code == val);
      this.getWorkStage(temp.entry); // 调用
    },
    /** 作业阶段 下拉选项 变更函数 */
    changeWorkStage(val) {},

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
     * search: 于查询框输入的值
     */
    async getDataList(page, size, search = {}) {
      let params = {}; // 请求参数对象
      // 单行查询，且查询只有一个keyword
      if (this.singleForm) {
        search = {
          keyword: this.searchData.keyword
        };
      }
      // 单行查询 作业对象，projectEntry 外部传入
      if (
        this.singleForm &&
        (this.code == "WorkObject" || this.code == "Activity")
      ) {
        // 查询条的关键字输入框无值 ,通常为第一次打开对话框的时候
        if (!search.keyword)
          // 请求数据所需的 [projectEntry]项目编号属性值
          search = {
            projectEntry: this.projectEntry
          };
        console.log("作业对象 keyword无值:", search);
        // 如果关键字输入框有值，通常是已经打开的输入框，根据输入值，再结合[keyword]返回对应数据
        if (search.keyword != undefined) {
          /** 除[projectEntry]项目编号属性值之外，还需传入用户输入的关键字。
           *  以此来保证，返回的数据为当前项目编号下，符合输入关键字的数据 */

          search = {
            projectEntry: this.projectEntry,
            keyword: search.keyword
          };
          console.log("作业对象 keyword有值:", search);
        }
      }
      // 非单个关键字输入框的查询情况下，且当前code为中日程
      if (!this.singleForm && this.code == "Activity") {
        console.log("SEARCH:", this.GLOBAL.removeEmptyObjectProperty(search));

        params = {
          page: page > 0 ? page - 1 : 0,
          size: this.tableData.size,
          code: this.code,
          ...this.GLOBAL.removeEmptyObjectProperty(search)
        };
      }
      params = {
        page: page > 0 ? page - 1 : 0,
        size: this.tableData.size,
        code: this.code,
        ...this.GLOBAL.removeEmptyObjectProperty(search)
      };
      console.log("chooseList请求参数对象:", params);
      try {
        /** 列表数据加载 开始 */
        this.tableLoading = true;
        let res = await getChooseList(params);
        // console.log("CHOOSELIST：", res);
        this.tableData = res;
      } catch (err) {}
      /** 列表数据加载 结束 */
      this.tableLoading = false;
    }
  }
};
</script>