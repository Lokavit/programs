<template>
  <el-dialog title="清单 项目" :visible="dialogVisible" :modal-append-to-body="false" modal-append-to-body :append-to-body="true" :before-close="cancelHandler" width="80%" style="margin-top:-60px">
    <el-table v-loading="loading" :data="goodsListData" border highlight-current-row size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" :style="[{'width':width},styleObject]">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="baseType" label="单据类型" width="120px" align="center">
        <template v-slot="scope">{{scope.row.baseType|FormatBaseType}}</template>
      </el-table-column>
      <el-table-column prop="baseEntry" label="单据编号" width="80px" align="center"></el-table-column>
      <el-table-column prop="itemCode" label="物料编码" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="itemDescription" label="物料描述" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="quantity" label="数量" width="60px" align="center"></el-table-column>
      <el-table-column prop="whsCode" label="仓库编码" width="80px" align="center"></el-table-column>
      <el-table-column prop="whsName" label="仓库名称" width="120px" align="center"></el-table-column>
      <el-table-column prop="direction" label="方向" width="60px" align="center">
        <template v-slot="scope">{{scope.row.direction|FormatDirection}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip align="center"></el-table-column>
    </el-table>

    <div slot="footer">
      <el-button type="primary" @click="confirmHandler" size="mini">确 定</el-button>
      <el-button @click="cancelHandler" size="mini">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  // 库存模块 右键菜单 对话框
  name: "InventoryDialog",
  props: {
    /**
     * 库存[收发转]单,需[创建批次]的数据集
     */
    goodsList: [Array, Object],
    /**
     * 对话框是否显示 ，于父组件中的包裹元素 v-if变量绑定，达到手动控制本组件是否渲染
     */
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      /** 列表区域的宽度值 [列表页根据table宽度决定整体宽度] */
      width: this.GLOBAL.returnCurrentWindowWidth(1100),
      /** 列表区域的外边距，达到距离搜索区域及分页区域之间的间隙 */
      styleObject: {
        marginTop: "0px"
      },
      /** 列表中的表头样式 */
      headerCellStyle: this.GLOBAL.LIST_TABLE_HEADER_CELL_STYLE,
      /** 列表中的单元格样式 [非表头部分] */
      cellStyle: this.GLOBAL.LIST_TABLE_CELL_STYLE,
      loading: false // 数据加载中
    };
  },
  computed: {
    goodsListData() {
      return this.goodsList;
    }
  },
  watch: {},
  mounted() {},
  methods: {
    /**
     * 对话框的确定事件
     * 迭代每行数据的所有批次，将其[batches]中 [batchNumber]重复的进行合并
     */
    confirmHandler() {
      this.$emit("on-comfirm"); // 于父组件中实现的事件，用于控制本组件是否渲染
    },
    /**
     * 对话框的取消事件
     */
    cancelHandler() {
      this.$emit("on-cancel");
    }
  }
};
</script>
