<template>
  <section>
    <!-- 当前组件的标题区域 -->
    <div class="title_container">
      <div>{{$route.meta.title}}</div>
      <!-- <div>预留按钮组区域</div> -->
    </div>
    <!-- 水平分割线 -->
    <div style="display: block;height: 1px; width: 100%;background-color: #dcdfe6;"></div>

    <!-- 查询区域 -->
    <el-form :model="filterCondition" size="mini">
      <div class="form_container">
        <div class="form_row">
          <!-- 项目 -->
          <aside>
            <KftLabel label="项目"></KftLabel>
            <el-input v-model="filterCondition.itemGroupCode" placeholder="请输入项目" @keyup.enter.native="onFilter" clearable @clear="onFilter" size="mini"></el-input>
          </aside>
          <!-- 分段 -->
          <aside>
            <KftLabel label="分段"></KftLabel>
            <el-input v-model="filterCondition.itemGroupName" placeholder="请输入分段" @keyup.enter.native="onFilter" clearable @clear="onFilter" size="mini"></el-input>
          </aside>
          <!-- BOM名称   -->
          <aside>
            <KftLabel label="BOM名称"></KftLabel>
            <el-input v-model="filterCondition.itemGroupName" placeholder="请输入BOM名称" @keyup.enter.native="onFilter" clearable @clear="onFilter" size="mini"></el-input>
          </aside>
          <!-- 按钮 -->
          <aside>
            <el-button type="primary" icon="el-icon-search" @click="onFilter" size="mini" style="margin-left:50px;">查询</el-button>
          </aside>
          <!--  -->
          <aside></aside>
        </div>
      </div>
    </el-form>

    <!-- 水平分割线 -->
    <div style="display: block;height: 1px; width: 100%;background-color: #dcdfe6;"></div>

    <!-- 按钮组区域 -->
    <div class="btn_container" style="padding: 10px 0;">
      <el-button type="primary" plain @click="onCreate" size="mini">
        <i class="kft-icon-create"></i>
        <span>新增</span>
      </el-button>
      <el-button type="primary" plain @click="onDetail" size="mini">
        <i class="kft-icon-create"></i>
        <span>详情</span>
      </el-button>
      <el-button type="primary" plain @click="onFilter" size="mini">
        <i class="kft-icon-refresh"></i>
        <span>刷新</span>
      </el-button>
    </div>

    <!-- 列表页 表格区域  列使用[min-width]设置该列占比 [注:单独设置不管用] -->
    <el-table v-loading="tableLoading" :data="tableData.content" highlight-current-row size="mini" :header-cell-style="GLOBAL.LIST_TABLE_HEADER_CELL_STYLE" :cell-style="GLOBAL.LIST_TABLE_CELL_STYLE" stripe @current-change="currentSelectRow">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="itemGroupCode" label="项目" show-overflow-tooltip></el-table-column>
      <el-table-column prop="itemGroupName" label="分段" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="BOM名称" show-overflow-tooltip></el-table-column>
      <el-table-column label="信息" width="50" fixed="right" type="expand">
        <template v-slot="scope">
          <div class="list_info_view">
            <aside>
              <label>创建人：</label>
              <!-- <div> -->
              {{scope.row.createBy}}
              <!-- </div> -->
            </aside>
            <aside>
              <label>创建时间：</label>
              {{GLOBAL.dateTiemFormatRemoveT(scope.row.createTime)}}
            </aside>
            <aside>
              <label>修改人：</label>
              {{scope.row.updateBy}}
            </aside>
            <aside>
              <label>修改时间：</label>
              {{GLOBAL.dateTiemFormatRemoveT(scope.row.updateTime)}}
            </aside>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表页 分页区域 -->
    <KftPagination :total="tableData.totalElements" :page-size="tableData.size" :fetch-data="getDataList" style="float:right;margin-top:10px;"></KftPagination>
  </section>
</template>

<script>
import { getMaterialGroup } from "@/api/basicdata";
export default {
  /** 钢材管理 钢材BOM上传 列表 */
  name: "ListSteelBOM",
  data() {
    return {
      /** 查询区域 过滤条件对象 */
      filterCondition: {},
      /** 防止网路环境较差时，列表数据请求返回较慢，局部假死 */
      tableLoading: false,
      /** 当前选中行，默认无数据 */
      currentRow: null,
      /** 表格区域 相关 */
      tableData: {
        content: [], // 表格数据
        number: 0, // 当前页数
        size: this.GLOBAL.returnTableDataItem().item, // 每页条数
        totalElements: 0, // 当前列表数据总条数
        totalPages: 0 // 总页数
      }
    };
  },

  mounted() {
    this.getDataList(); // 页面渲染完毕时，请求列表数据
  },
  methods: {
    /** 按钮：查询
     * 根据输入条件，显示过滤后的数据
     * 该过滤事件含以下作用：
     *    使用者输入内容按下回车键
     *    使用者输入内容按下查询按钮
     *    使用者点击清空输入框内容，即(x)按钮
     *    使用者点击页面内的刷新按钮
     * 参数为:查询的条件，或许有多个，所以[filterCondition]为object格式
     */
    onFilter() {
      /** 通过过滤条件对象是否为{}，来决定调用请求接口时，是否传入第三参数(过滤条件对象) */
      this.filterCondition == {}
        ? // 不带任何参数对象
          this.getDataList()
        : // 传入三个参数对象(页码，每页条数，过滤条件对象)
          this.getDataList(
            this.tableData.number,
            this.tableData.size,
            this.filterCondition
          );
    },

    /** 当前选中行 */
    currentSelectRow(curRow, oldCurRow) {
      if (curRow) this.currentRow = curRow;
    },

    /** 按钮：新增
     * 点击创建新表单
     */
    onCreate(event) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      // 新建表单暂定唯一性，若用户再次点击添加按钮，将状态跳到已打开的新建表单任务项，并显示
      /** 由任务栏数组中，寻找[create]表单项 */
      let isCreateForm = this.$store.getters.taskGroup.find(
        task => task.path == `/mm/steel/steelbom-form/create`
      );
      // 如果已经有新增表单
      if (isCreateForm) {
        this.$store.dispatch("taskbar/switchTaskActive", isCreateForm);
      } else {
        // 调用创建任务项函数
        this.createTask(
          {
            path: "/mm/steel/steelbom-form/",
            name: "FormSteelBOM",
            meta: this.$route.meta
          },
          "create"
        );
      }
      /** 路由随之跳转 */
      this.$router.push({
        name: "FormSteelBOM",
        params: { code: "create" }
      });
    },

    /** 按钮：详情
     * 根据当前选中行数据，打开对应页面
     * 若当前未有选中行数据，提醒用户选择一行
     */
    onDetail() {
      if (!this.currentRow) {
        this.$message.warning("请于表格中选择一项数据");
        return;
      } else {
        this.beforeClickDetailEvent(this.currentRow.itemGroupCode);
      }
    },

    /** 点击详情之前需处理的逻辑
     * @param code 传入当前选中行数据
     */
    beforeClickDetailEvent(code) {
      /** 由任务栏数组中，寻找code相同的项 */
      let tempTask = this.$store.getters.taskGroup.find(
        task => task.path == `/mm/steel/steelbom-form/${code}`
      );
      if (tempTask) {
        // 如果找到任务项
        this.$store.dispatch("taskbar/switchTaskActive", tempTask);
      } else {
        // 如果找不到任务项  调用创建窗体对应任务栏函数
        this.createTask(
          {
            path: "/mm/steel/steelbom-form/",
            name: "FormSteelBOM",
            meta: this.$route.meta
          },
          code
        );
      }
      /** 路由随之跳转 */
      this.$router.push({
        name: "FormSteelBOM",
        params: { code: code }
      });
    },

    /**
     * 获取当前页面列表数据集
     * page: 当前页
     * size: 每页数据集条数
     * filterCondition: 于查询区域各个属性的值(单项or多项)
     */
    async getDataList(page, size, filterCondition = {}) {
      let params = {
        page: page > 0 ? page - 1 : 0,
        size: this.tableData.size,
        ...filterCondition // 解构查询区域的输入值
      };
      try {
        /** 列表数据加载效果：开启 */
        this.tableLoading = true;
        /** 请求回来的数据，直接赋值给tableData */
        this.tableData = await getMaterialGroup(params);
      } catch (err) {}
      /** 列表数据加载效果：关闭 */
      this.tableLoading = false;
    }
  }
};
</script>
