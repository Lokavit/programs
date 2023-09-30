<template>
  <section class="modal_list">
    <!-- 列表页 查询区域 -->
    <el-form :inline="true" :model="search" size="mini" @submit.native.prevent>
      <div class="form_row">
        <!-- 第一列 查询输入框 表格列少情况下，需在此处设置最小宽度值 -->
        <aside style="min-width:240px;">
          <KftLabel :label="labels.keyword.value|FormatLabelSuffix"></KftLabel>
          <el-input v-model="search.keyword" :placeholder="`请输入${labels.keyword.value}`" @keyup.enter.native="onSubmit" clearable @clear="onSubmit" size="mini"></el-input>
        </aside>
        <!-- 第二列 查询按钮 -->
        <aside>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit" size="mini" style="margin-left:40px;">查询</el-button>
        </aside>
        <!-- 第三列 按钮组   -->
        <aside style="position:relative;">
          <!-- <button @click="onCreate" style="position:absolute;right:70px">
              <i class="kft-icon-create"></i>
              <span>添加</span>
            </button>
            <button @click="onSubmit" style="position:absolute;right:0px">
              <i class="kft-icon-refresh"></i>
              <span>刷新</span>
          </button>-->
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
    <el-table v-loading="tableLoading" :data="tableData.content" highlight-current-row size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" stripe>
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column prop="code" label="采购员编码" align="center">
        <template v-slot="scope">
          <span @click="onCell" class="span-hover">{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fullName" label="采购员姓名" show-overflow-tooltip align="center"></el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <KftPagination :total="tableData.totalElements" :page-size="tableData.size" :fetch-data="getDataList" style="float:right;margin-top:10px;"></KftPagination>
  </section>
</template>

<script>
import { getEmployees } from "@/api/hr";
import FormEmployees from "./FormEmployees";
export default {
  name: "ListEmployees",
  components: { FormEmployees },
  data() {
    return {
      /** 列表中的表头样式 */
      headerCellStyle: this.GLOBAL.LIST_TABLE_HEADER_CELL_STYLE,
      /** 列表中的单元格样式 [非表头部分] */
      cellStyle: this.GLOBAL.LIST_TABLE_CELL_STYLE,
      /** 防止网路环境较差时，列表数据请求返回较慢，局部假死 */
      tableLoading: false,
      /** 查询的from */
      search: {},
      /** 列表区域 相关 */
      tableData: {
        content: [], // 表格数据
        number: 0, // 当前页数
        size: this.GLOBAL.returnTableDataSize(), // 每页条数
        totalElements: 0, // 当前列表数据总条数
        totalPages: 0 // 总页数
      }
    };
  },
  computed: {
    /** 当前列表页 标注组 之后会从后台获取所有标注 */
    labels() {
      return this.$store.getters.labels.Employee.listLbales;
    }
  },
  watch: {},
  created() {},
  beforeMount() {},
  mounted() {
    this.getDataList(); // 页面渲染完毕时，请求列表数据
  },
  methods: {
    /**
     * 查询按钮点击事件
     * 参数为:查询的关键字，或许有多个，所以为object格式
     */
    onSubmit() {
      if (!this.search.keyword) this.getDataList();
      if (this.search.keyword) {
        // 调用 获取数据， 将输入的查询关键字，传入第三个参数
        this.getDataList(
          this.tableData.number,
          this.tableData.size,
          this.search
        );
      }
    },
    // 新增数据按钮 点击事件
    onCreate(event) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      this.openModal(); // 点击添加按钮时，调用此处的打开模态框函数
    },
    /**
     * 点击单元格，将获取到的内容，传入到openModal中，同时亦带入详情页面
     */
    onCell(event) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      // 调用打开模态框函数，将获取到的单元格数据[itemCode]物料编码传入
      this.openModal(event.target.innerText);
    },

    /**
     * 获取当前页面列表数据集
     * page: 当前页
     * size: 每页数据集条数
     * search: 于查询区域各个属性的值(单项or多项)
     */
    async getDataList(page, size, search = {}) {
      let params = {
        page: page > 0 ? page - 1 : 0,
        size: this.tableData.size,
        ...search // 解构查询区域的输入值
      };
      try {
        /** 列表数据加载效果：开启 */
        this.tableLoading = true;
        let res = await getEmployees(params);
        this.tableData = res;
      } catch (err) {}
      /** 列表数据加载效果：关闭 */
      this.tableLoading = false;
    },

    /**
     * 打开模态框函数
     * 新增及修改，注:修改时需要code，所以此处给默认值
     */
    openModal(code = "") {
      let newModal = {
        // 调用获取当前对话框title函数
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
          component: FormEmployees,
          code: code
        }
      };
      this.$store.dispatch("modal/openModal", newModal);
    }
  }
};
</script>
