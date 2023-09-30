<template>
  <section>
    <!-- 过滤条件区域 -->

    <!-- 列表页 表格区域  列使用[min-width]设置该列占比 [注:单独设置不管用] -->
    <el-table v-loading="tableLoading" :data="tableData.content" highlight-current-row size="mini" :header-cell-style="GLOBAL.LIST_TABLE_HEADER_CELL_STYLE" :cell-style="GLOBAL.LIST_TABLE_CELL_STYLE" stripe :max-height="maxHeight" @current-change="currentSelectRow">
      <el-table-column prop="itemCode" label="项目"></el-table-column>
      <el-table-column prop="itemDescription" label="分段" show-overflow-tooltip></el-table-column>
      <el-table-column prop="itemGroupCode" label="BOM名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="docEntry" label="MP编号" show-overflow-tooltip></el-table-column>
      <el-table-column prop="itemGroupName" label="船级" show-overflow-tooltip></el-table-column>
      <el-table-column prop="docDate" label="预定发行日期" show-overflow-tooltip></el-table-column>
      <el-table-column prop="itemGroupName" label="负责人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="itemGroupName" label="负责部门" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="状态">
        <template v-slot="scope">
          <!-- 于结构元素内直接使用，无需加this. -->
          <span :style="{'color':GLOBAL.returnStatusObject(scope.row.status,GLOBAL.STATUSTYPE).color}">● {{GLOBAL.returnStatusObject(scope.row.status,GLOBAL.STATUSTYPE).label}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer">
      <el-button type="primary" plain @click="handlerNext" size="mini">下一步</el-button>
      <el-button @click="onAddInBulkHandler" size="mini">直接新增</el-button>
    </div>
  </section>
</template>

<script>
import steelMPListData from "@/data/steelmp.json";
export default {
  /** 钢材POR 向导 步骤 第一步 */
  name: "GuideStepFirst",
  data() {
    return {
      /** 查询区域 过滤条件对象 */
      filterCondition: {},
      /** 防止网路环境较差时，列表数据请求返回较慢，局部假死 */
      tableLoading: false,
      /** 表格区域 相关 */
      tableData: {
        content: [], // 表格数据
        number: 0, // 当前页数
        size: this.GLOBAL.returnTableDataItem().item, // 每页条数
        totalElements: 0, // 当前列表数据总条数
        totalPages: 0 // 总页数
      },
      /** 当前选中行，默认无数据 */
      currentRow: null
    };
  },
  computed: {
    /** table内容最大高度，以达到内部滚动的效果 */
    maxHeight() {
      /** 通过获取屏幕宽度返回的当前每页最大条数 * 每行高度 */
      return this.GLOBAL.returnTableDataItem().item * 40;
    }
  },
  mounted() {
    this.getDataList(); // 页面渲染完毕时，请求列表数据
  },
  methods: {
    /** 当前选中行 */
    currentSelectRow(curRow, oldCurRow) {
      if (curRow) this.currentRow = curRow;
    },
    /** 下一步 */
    handlerNext() {
      if (!this.currentRow) {
        this.$message.warning("请于表格中选择一项数据");
        return;
      } else {
        this.mpLines = this.currentRow.lines;

        this.$emit("on-next", this.currentRow.lines);
      }
    },

    /** 直接新增按钮事件 */
    onAddInBulkHandler() {
      this.$emit("on-addInBulk");
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
        // this.tableData = await getMaterial(params);
        // 暂行使用，dta中的物料主数据列表数据集
        this.tableData.content = steelMPListData;
      } catch (err) {}
      /** 列表数据加载效果：关闭 */
      this.tableLoading = false;
    }
  }
};
</script>
