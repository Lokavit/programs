<template>
  <el-dialog title="单据行" :visible="dialogVisible" :modal-append-to-body="false" modal-append-to-body :append-to-body="true" :before-close="cancelHandler" width="80%">
    <el-table v-loading="loading" :data="goodsListData" border highlight-current-row ref="singleTable" @current-change="handleCurrentChangeRow" size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" :style="[{'width':width},styleObject]" :max-height="maxHeight">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="itemCode" label="物料编码"></el-table-column>
      <el-table-column prop="itemDescription" label="物料描述" show-overflow-tooltip></el-table-column>
      <el-table-column prop="quantity" label="数量"></el-table-column>
      <el-table-column prop="whsCode" label="仓库编码"></el-table-column>
      <el-table-column prop="whsName" label="仓库名称"></el-table-column>
      <el-table-column prop="batchCount" label="已选数量总计"></el-table-column>
    </el-table>

    <h3>创建批次</h3>
    <el-table :data="batchData" border highlight-current-row size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" :style="{'width':width}" :row-style="rowStyle" :row-class-name="rowClassName" @current-change="handleCurrentRow">
      <el-table-column type="index" label="行号"></el-table-column>
      <el-table-column prop="batchNumber" label="批次编码" show-overflow-tooltip>
        <template v-slot="scope">
          <small>
            <el-input v-model="scope.row.batchNumber" placeholder="请输入批次编码" clearable size="mini"></el-input>
          </small>
          <span>{{scope.row.batchNumber}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="quantity" label="数量" width="180">
        <template v-slot="scope">
          <small>
            <el-input-number size="mini" v-model="scope.row.quantity" :min="1"></el-input-number>
          </small>
          <span>{{scope.row.quantity}}</span>
        </template>
      </el-table-column>
      <template v-if="isOperate">
        <el-table-column label="操作" width="50">
          <template v-slot="scope">
            <el-popover :ref="`popover-${scope.$index}`" placement="top" width="160">
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
                <el-button type="primary" size="mini" @click="handleDeleteOk(scope._self.$refs[`popover-${scope.$index}`], scope.$index)">确定</el-button>
              </div>
              <el-button type="danger" size="mini" slot="reference" icon="el-icon-minus" circle style="padding:0;margin-left:6px"></el-button>
            </el-popover>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <div slot="footer">
      <el-button type="primary" @click="confirmHandler" size="mini">更 新</el-button>
      <el-button @click="cancelHandler" size="mini">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  // 库存模块 创建批次 对话框
  name: "BatchCreateDialog",
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
      /** 列表区域的外边距，达到距离搜索区域及分页区域之间的间隙 */
      styleObject: {
        marginTop: "-20px"
      },
      /** 列表中的表头样式 */
      headerCellStyle: this.GLOBAL.FORM_TABLE_HEADER_CELL_STYLE,
      /** 列表中的单元格样式 [非表头部分] */
      cellStyle: this.GLOBAL.FORM_TABLE_CELL_STYLE,
      /** 列表中的内容行 样式 */
      rowStyle: this.GLOBAL.FORM_TABLE_ROW_STYLE,
      currentRow: [], // 当前选中行
      loading: false, // 数据加载进度条
      /** 该变量有以下作用：
       * [正值]是否显示操作列:没有单据号时，显示操作列;反之则不显示操作列。
       * [正值]是否显示底部操作按钮: 没有单据号时，显示操作;反之则不显示操作，只能看当前
       * [反值]表单的输入框是否可输入，新增时可输入，一旦提交，则将设置该属性的项锁住[不可输入]
       * [反值]右键菜单是否可用，新增时右键菜单不可用，一旦提交，则右键菜单可用。
       */
      isOperate: true,
      batchData: [], // 表格内的数据
      batchCount: 0, // 已选数量总计
      currentRowBatch: [] // 当前选中行[用于创建批次表格中]
    };
  },
  computed: {
    /** 当前窗体宽度值计算 [根据全局设定基数等比缩放] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
    },
    goodsListData: {
      get() {
        return this.goodsList;
      },
      set(newVal) {
        return newVal;
      }
    },
    /** 计算table 高度 */
    maxHeight() {
      /**
       * 当前数据总条数是否小于全局函数返回的每页数据条数，
       * 如果小于，则高度为(当前数据总条数+1)*40[每条高度]
       * 否则，返回(全局函数返回的每页数据条数+1)*40[每条高度]
       */
      return this.goodsListData.length <= this.GLOBAL.returnTableDataSize() / 2
        ? (this.goodsListData.length + 1) * 40
        : (this.GLOBAL.returnTableDataSize() / 2) * 40;
    }
  },
  watch: {
    batchData: {
      immediate: true,
      handler(val) {
        this.pushEmptyData();
      }
    }
  },
  mounted() {
    // 默认选中[单据行]中的第一行数据 [延时操作，否则不生效]
    setTimeout(() => {
      this.$refs.singleTable.setCurrentRow(this.goodsListData[0]);
      this.$set(
        this.currentRow,
        "batchCount",
        this.totalQuantity(this.batchData)
      );
    }, 10);
  },
  methods: {
    /**
     * 选中当前行 参数为 (当前行 ，旧行)
     * 赋值给[currentRowBatch].把选中的当前行的数据带出去，用于外部使用
     */
    handleCurrentRow(curRow, oldRow) {
      this.currentRowBatch = curRow;
    },
    /**
     * 行 class 函数 参数为 (该行内容 ， 行下标)
     * 该事件 会根据 当前行的变更，自动执行
     * return: 设置当前行的 class ,即为设置当前行的可编辑单元格，是否显示可编辑组件
     */
    rowClassName({ row, rowIndex }) {
      // tableData中[行下标]的数据 == 当前行数据
      return this.batchData[rowIndex] == this.currentRowBatch
        ? "edit_table" // 将其设置为 可编辑
        : "show_table"; // 其他的为为不可编辑
    },

    /**
     * 当前选中行的数据 【单据行的单条数据】
     */
    handleCurrentChangeRow(row) {
      /**
       * 如果 选中行上的 [batches] 已选批次数组 不为undefined （也就是更新之后，再次更改批次选择）
       * 将该行数据中的 [batches]批次数组属性 赋值给 [batchData] 已选批次列表
       */
      if (row != undefined && row.batches != undefined) {
        this.batchData = row.batches;
      }
      this.currentRow = row;
    },

    /**
     * 对话框的确定事件
     * 迭代每行数据的所有批次，将其[batches]中 [batchNumber]重复的进行合并
     */
    confirmHandler() {
      this.currentRow = []; // 清空选中行
      /**
       * 迭代当前点击更新之后， 单据行中的数据集，对其进行处理
       */
      for (let i = 0; i < this.goodsListData.length; i++) {
        // 如果该条数据没有 批次数据集 ，跳过
        if (!this.goodsListData[i].batches) continue;
        // 单据行中，每条数据的批次数据集，去掉空行, 用于之后的操作
        this.goodsListData[i].batches = this.removeEmptyData(
          this.goodsListData[i].batches
        );

        let newBatches = []; // 用于存储 处理后的批次数据集
        /**
         * previous: 前一个
         * current: 当前的
         */
        this.goodsListData[i].batches.reduce((previous, current) => {
          let temp = this.goodsListData[i].batches
            // 过滤，返回， 批次编码 === 当前批次编码 的数据集
            .filter(item => item.batchNumber === current.batchNumber)
            // 计算上一步结果数据集中，所有数量的和
            .reduce((pre, cur) => {
              // 返回 为对象形式 {batchNumber:"B0000-01",quantity:"66"}
              return {
                batchNumber: pre.batchNumber,
                quantity: pre.quantity + cur.quantity
              };
            });
          // 如果存储处理后批次数据集的数组中，找不到 temp 对象的属性值
          if (
            newBatches.find(batch => batch.batchNumber === temp.batchNumber) ==
            undefined
          ) {
            newBatches.push(temp);
          }
        }, 0);
        // 将处理完毕的，新的批次数据集， 赋值给当前数据的批次数据集
        this.goodsListData[i].batches = newBatches;
      }
      /** 隐藏操作列  */
      this.isOperate = false;
      this.currentRowBatch = []; // 清掉当前行
      this.$emit("on-comfirm"); // 于父组件中实现的事件，用于控制本组件是否渲染
    },
    /**
     * 对话框的取消事件
     */
    cancelHandler() {
      this.currentRow = []; // 清空选中行
      /** 隐藏操作列  */
      this.isOperate = true;
      this.currentRowBatch = []; // 清掉当前行
      this.$emit("on-cancel");
    },
    handleDeleteOk(popover, index) {
      popover.doClose();
      this.batchData = this.batchData.filter((row, i) => i !== index);
      // 删除行之后，将其赋值给 [当前选中行].批次数组
      this.currentRow.batches = this.batchData;
      this.$set(
        this.currentRow,
        "batchCount",
        this.totalQuantity(this.batchData)
      );
    },
    /** 添加空数据行 */
    pushEmptyData() {
      if (this.batchData.filter(row => !row.batchNumber).length === 0) {
        this.batchData.push({});
      }
    },

    /**
     * 移除空数据行
     * data: 带有空行的数据，此处为 [批次] 过滤条件[批次批次编码]
     * return: 去掉空数据行的数据集
     */
    removeEmptyData(data) {
      if (data) {
        return data.filter(item => item.batchNumber != undefined);
      }
    },

    /**
     * 计算 动态刷新[单据行]中，每行数据后面的 [batchCount] 已选数量总计
     * 将通过 [currentRow.batches]当前选中行的批次数组，中计算过后的值
     * 赋值给当前选中行的[batchCount] 已选数量总计
     * data:需要计算的数据集，此处为单行数据的批次数据集
     * return: 返回计算结果
     */
    totalQuantity(data) {
      return this.removeEmptyData(data)
        .map(batch => parseInt(batch.quantity))
        .reduce((sum, current) => sum + current, 0);
    }
  }
};
</script>
