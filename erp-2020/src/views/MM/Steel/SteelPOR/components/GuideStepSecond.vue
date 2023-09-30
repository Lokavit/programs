<template>
  <section>
    <!-- 子表 -->
    <el-table :data="tableData" :header-cell-style="GLOBAL.FORM_TABLE_HEADER_CELL_STYLE" :cell-style="GLOBAL.FORM_TABLE_CELL_STYLE" :style="[GLOBAL.FORM_TABLE_MARGIN]" :row-style="GLOBAL.FORM_TABLE_ROW_STYLE" :row-class-name="rowClassName" :max-height="maxHeight" @current-change="handleCurrentRow">
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="剩余需求数量" prop="openQuantity"></el-table-column>

      <el-table-column label="申请采购数量" prop="quantity">
        <template v-slot="scope">
          <small>
            <el-input-number size="mini" v-model="scope.row.quantity" :min="1" :max="scope.row.openQuantity"></el-input-number>
          </small>
          <span>{{scope.row.quantity}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button type="primary" plain @click="handlerPrev" size="mini">上一步</el-button>
      <el-button @click="handlerFinish" size="mini">完成</el-button>
    </div>
  </section>
</template>

<script>
export default {
  /** 钢材POR 向导 步骤 第二步 */
  name: "GuideStepSecond",
  props: {
    /** 当前组件中的列表数据 */
    tableData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
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

  methods: {
    /** 上一步 */
    handlerPrev() {
      this.currentRow = null;
      this.$emit("on-prev");
    },
    /** 完成 */
    handlerFinish() {
      this.$emit("on-finish", this.tableData);
    },

    /**
     * 选中当前行 参数为 (当前行 ，旧行)
     * 把选中的当前行的数据带出去，用于外部使用
     * 此处根据当前表单单据编号，作为选中行之后的逻辑处理
     * 若有单据号，则当前选中行数据置为[],避免触发选中之后的函数执行
     * 若无单据号，则当前选中行数据，赋值给[currentRow],用于执行选中后的函数操作
     */
    handleCurrentRow(curRow, oldRow) {
      // this.form.docEntry != undefined // 是否有单据号
      //   ? (curRow = []) // 有单据号，当前选中数据清空
      //   : (this.currentRow = curRow); // 没有单据号，当前选中数据，赋值给[currentRow]
      this.currentRow = curRow;
    },
    /**
     * 行 class 函数 参数为 (该行内容 ， 行下标)
     * 该事件 会根据 当前行的变更，自动执行
     * return: 设置当前行的 class ,即为设置当前行的可编辑单元格，是否显示可编辑组件
     */
    rowClassName({ row, rowIndex }) {
      // tableData中[行下标]的数据 == 当前行数据
      return this.tableData[rowIndex] == this.currentRow
        ? "edit_table" // 将其设置为 可编辑
        : "show_table"; // 其他的为为不可编辑
    }
  }
};
</script>
