<template>
  <section :style="{'width':width}" class="modal_list">
    <!-- 列表页 查询区域 -->
    <el-form :inline="true" :model="search" size="mini" @submit.native.prevent>
      <div class="form_row" style="margin-bottom:14px;">
        <aside>
          <KftLabel :label="labels.itemCode.value|FormatLabelSuffix"></KftLabel>
          <KftChoose code="Material" v-model="search.itemCode" show-detail @on-choose-selected="chooseMaterial" :placeholder="`请选择${labels.itemCode.value}`" size="mini"></KftChoose>
        </aside>
        <aside>
          <KftLabel :label="labels.whsCode.value|FormatLabelSuffix"></KftLabel>
          <KftChoose code="Warehouse" v-model="search.whsCode" show-detail @on-choose-selected="chooseWarehouse" :placeholder="`请选择${labels.whsCode.value}`" size="mini"></KftChoose>
        </aside>
        <aside>
          <KftLabel :label="labels.batchNumber.value|FormatLabelSuffix"></KftLabel>
          <el-input v-model="search.batchNumber" :placeholder="`请输入${labels.batchNumber.value}`" size="mini"></el-input>
        </aside>
        <aside>
          <KftLabel :label="labels.baseType.value|FormatLabelSuffix"></KftLabel>
          <el-select v-model="search.baseType" :placeholder="`请选择${labels.baseType.value}`" @change="changeBaseType" size="mini" clearable>
            <el-option v-for="item in baseTypeOptions" :key="item.type" :label="item.name" :value="item.type"></el-option>
          </el-select>
        </aside>
      </div>

      <div class="form_row">
        <aside>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit" size="mini" style="margin-left:40px;">查询</el-button>
        </aside>
        <aside></aside>
      </div>
    </el-form>

    <!-- 列表区域 -->
    <el-table v-loading="tableLoading" :data="tableData" border highlight-current-row size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" :max-height="maxHeight" stripe>
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column prop="baseEntry" label="单据编号" align="center" min-width="8%"></el-table-column>
      <el-table-column prop="baseType" label="单据类型" align="center" min-width="8%">
        <template v-slot="scope">{{scope.row.baseType|FormatBaseType}}</template>
      </el-table-column>
      <el-table-column prop="itemCode" label="物料编码" align="center" min-width="12%"></el-table-column>
      <el-table-column prop="itemDescription" label="物料描述" show-overflow-tooltip align="center" min-width="14%"></el-table-column>
      <el-table-column prop="quantity" label="数量" align="center" min-width="6%"></el-table-column>
      <el-table-column prop="whsCode" label="仓库编码" align="center" min-width="8%"></el-table-column>
      <el-table-column prop="whsName" label="仓库名称" align="center" min-width="10%"></el-table-column>
      <el-table-column prop="batchNumber" label="批次编码" align="center" min-width="10%"></el-table-column>
      <el-table-column prop="direction" label="方向" align="center" min-width="6%">
        <template v-slot="scope">{{scope.row.direction|FormatDirection}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip align="center" min-width="16%"></el-table-column>
    </el-table>
  </section>
</template>

<script>
import { getReportBatch } from "@/api/stock";
export default {
  // 库存模块 批次过帐清单 列表页
  name: "ListGoodsReportBatch",
  data() {
    return {
      /** 列表中的表头样式 */
      headerCellStyle: this.GLOBAL.LIST_TABLE_HEADER_CELL_STYLE,
      /** 列表中的单元格样式 [非表头部分] */
      cellStyle: this.GLOBAL.LIST_TABLE_CELL_STYLE,
      /** 防止网路环境较差时，列表数据请求返回较慢，局部假死 */
      tableLoading: false,
      /** 单据类型选项 */
      baseTypeOptions: [
        { type: "GoodsReceipt", name: "库存收货单" },
        { type: "GoodsIssue", name: "库存发货单" },
        { type: "GoodsTransfer", name: "库存转储单" },
        { type: "PurchaseDelivery", name: "采购收货单" },
        { type: "PurchaseReturn", name: "采购退货单" }
      ],
      /** 查询的from */
      search: {},
      tableData: []
    };
  },
  computed: {
    /** 当前窗体宽度值计算 [根据全局设定基数等比缩放] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
    },
    /** 当前窗体标注组 [后台获取所有标注] */
    labels() {
      return this.$store.getters.labels.GoodsReportBatch.listLbales;
    },

    /** 计算table 高度 */
    maxHeight() {
      /**
       * 当前数据总条数是否小于全局函数返回的每页数据条数，
       * 如果小于，则高度为(当前数据总条数+1)*40[每条高度]
       * 否则，返回(全局函数返回的每页数据条数+1)*40[每条高度]
       */
      return this.tableData.length <= this.GLOBAL.returnTableDataSize()
        ? (this.tableData.length + 1) * 40
        : (this.GLOBAL.returnTableDataSize() + 1) * 40;
    }
  },
  watch: {},
  created() {},
  beforeMount() {},
  mounted() {
    this.getDataList();
  },
  methods: {
    /** 作业阶段 下拉选项 变更函数 */
    changeBaseType(val) {},
    /** 物料的chooseList 选中 */
    chooseMaterial(selectedRow) {
      this.$set(this.search, "itemCode", selectedRow.itemCode);
    },
    /** 仓库的chooseList 选中 */
    chooseWarehouse(selectedRow) {
      this.$set(this.search, "whsCode", selectedRow.whsCode);
    },
    /**
     * 该提交事件含以下作用：
     *    使用者输入内容按下查询按钮
     * 参数为:查询的关键字，或许有多个，所以[search]为object格式
     */
    onSubmit() {
      this.getDataList(this.search);
    },

    /**
     * 获取当前页面列表数据集
     * page: 当前页
     * size: 每页数据集条数
     * search: 于查询区域各个属性的值(单项or多项)
     */
    async getDataList(params) {
      if (params == undefined) params = {};
      try {
        /** 列表数据加载效果：开启 */
        this.tableLoading = true;
        let res = await getReportBatch(params);
        if (res.length <= 0) this.$message.warning("未找到相关数据");
        this.tableData = res;
      } catch (err) {}
      /** 列表数据加载效果：关闭 */
      this.tableLoading = false;
    }
  }
};
</script>
