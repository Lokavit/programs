<template>
  <section :style="{'width':width}" v-loading="formLoading">
    <el-form :model="form" size="mini" :rules="rules" ref="form">
      <!-- 主表区域  包裹器 start -->
      <div class="form_container">
        <!-- 主表单行多项 第一行 -->
        <div class="form_row">
          <!-- 单据编号 -->
          <aside>
            <KftLabel :label="labels.docEntry.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.docEntry" :placeholder="`${labels.docEntry.value}`" :disabled="true" clearable></el-input>
          </aside>
          <!-- 单据日期 -->
          <aside>
            <KftLabel :label="labels.docDate.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="docDate">
              <el-date-picker v-model="form.docDate" type="datetime" :placeholder="`${labels.docDate.value}`" value-format="yyyy-MM-dd HH:mm:ss" :disabled="!isOperate" style="width:-webkit-fill-available;"></el-date-picker>
            </el-form-item>
          </aside>
          <!-- 必需日期 -->
          <aside>
            <KftLabel :label="labels.requiredDate.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="requiredDate">
              <el-date-picker size="mini" v-model="form.requiredDate" type="datetime" :placeholder="`请选择${labels.requiredDate.value}`" value-format="yyyy-MM-dd HH:mm:ss" :disabled="!isOperate" style="width:-webkit-fill-available;"></el-date-picker>
            </el-form-item>
          </aside>
          <!-- 有效日期 -->
          <aside>
            <KftLabel :label="labels.docDueDate.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="docDueDate">
              <el-date-picker size="mini" v-model="form.docDueDate" type="datetime" :placeholder="`请选择${labels.docDueDate.value}`" value-format="yyyy-MM-dd HH:mm:ss" :disabled="!isOperate" style="width:-webkit-fill-available;"></el-date-picker>
            </el-form-item>
          </aside>
        </div>
        <!-- 主表单行多项 第二行 -->
        <div class="form_row" style="padding-bottom:14px">
          <!-- 状态 -->
          <template v-if="!isOperate">
            <aside>
              <KftLabel :label="labels.status.value|FormatLabelSuffix"></KftLabel>
              <el-input v-model="form.status" size="mini" :disabled="true"></el-input>
            </aside>
          </template>
          <aside style="flex-grow:3;">
            <KftLabel :label="labels.remarks.value|FormatLabelSuffix"></KftLabel>
            <el-input v-model="form.remarks" :placeholder="`请输入${labels.remarks.value}`" size="mini" :disabled="!isOperate"></el-input>
          </aside>
        </div>
      </div>
      <!-- 主表区域  包裹器 end -->

      <!-- 编辑表格区域 -->
      <el-table :data="tableData" border highlight-current-row size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" :style="[styleObject]" :max-height="maxHeight" :row-style="rowStyle" :row-class-name="rowClassName" @current-change="handleCurrentRow">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="物料编码" prop="itemCode">
          <template v-slot="scope">
            <small>
              <KftChoose code="Material" class="kft-line-choose" size="mini" show-detail show-index show-search v-model="scope.row.itemCode" @on-choose-selected="chooseMaterial($event, scope.$index)" placeholder="请选择物料"></KftChoose>
            </small>
            <span>{{scope.row.itemCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="物料描述" show-overflow-tooltip prop="itemDescription"></el-table-column>
        <el-table-column label="数量" prop="quantity">
          <template v-slot="scope">
            <small>
              <el-input-number size="mini" v-model="scope.row.quantity" :min="1"></el-input-number>
            </small>
            <span>{{scope.row.quantity}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status">
          <template v-slot="scope">{{scope.row.status|FormatBaseStatus}}</template>
        </el-table-column>
        <el-table-column label="未清数量" prop="openQuantity"></el-table-column>

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

      <!-- <template v-if="isOperate"> -->
      <!-- 提交 / 重置 表单 -->
      <div style="text-align:center">
        <el-button type="primary" size="mini" @click="onSubmit()">提交</el-button>
        <el-button size="mini" @click="onCancel()">取消</el-button>
      </div>
      <!-- </template> -->
    </el-form>
  </section>
</template>

<script>
import {
  getPurchaseOrderRequestInfo,
  postPurchaseOrderRequest,
  putPurchaseOrderRequest
} from "@/api/purchase";
export default {
  // 采购模块 采购申请单 表单页
  name: "FormPurchaseOrderRequest",
  data() {
    return {
      /** 列表区域的外边距，达到距离搜索区域及分页区域之间的间隙 */
      styleObject: this.GLOBAL.FORM_TABLE_MARGIN,
      /** 列表中的表头样式 */
      headerCellStyle: this.GLOBAL.FORM_TABLE_HEADER_CELL_STYLE,
      /** 列表中的单元格样式 [非表头部分] */
      cellStyle: this.GLOBAL.FORM_TABLE_CELL_STYLE,
      /** 列表中的内容行 样式 */
      rowStyle: this.GLOBAL.FORM_TABLE_ROW_STYLE,
      /** 窗体内容的 v-loading属性控制值
       * 防止网路环境较差时，窗体内数据返回较慢，窗体空白
       * 防止网路环境较差时，提交事件响应结果及回显较慢，使用者误操作
       */
      formLoading: false,
      /** 主表区域 表单对象 */
      form: {
        docDate: this.GLOBAL.FORMATDATETIME(new Date())
      },
      /** 主表区域 必填字段校验 */
      rules: {
        docDate: [
          {
            required: true,
            message: "请选择单据日期",
            trigger: "change"
          }
        ],
        requiredDate: [
          {
            required: true,
            message: "请选择必需日期",
            trigger: "change"
          }
        ],
        docDueDate: [
          {
            required: true,
            message: "请选择有效日期",
            trigger: "change"
          }
        ]
      },
      tableData: [], // 表格内的数据
      currentRow: [], // [单据行]表格的当前选中行
      /** 该变量有以下作用：
       * [正值]是否显示操作列:没有单据号时，显示操作列;反之则不显示操作列。
       * [反值]表单的输入框是否可输入，新增时可输入，一旦提交，则将设置该属性的项锁住[不可输入]
       * [反值]表单的[状态]一项是否显示，新增时隐藏该项，其它情况显示该项，并将该项锁住[不可输入]
       */
      isOperate: true
    };
  },
  computed: {
    /** 当前窗体宽度值计算 [根据全局设定基数等比缩放] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
    },
    /** 当前窗体标注组 [后台获取所有标注] */
    labels() {
      return this.$store.getters.labels.PurchaseOrderRequest.formLabels;
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
    },
    /** 计算 向导一 页面table 高度 用于滚动条 */
    maxHeight() {
      /**
       * 当前数据总条数是否小于全局函数返回的每页数据条数，
       * 如果小于，则高度为(当前数据总条数+1)*40[每条高度]
       * 否则，返回(全局函数返回的每页数据条数+1)*40[每条高度]
       */
      return this.tableData.length <= this.GLOBAL.returnTableDataSize() / 2
        ? (this.tableData.length + 4) * 30
        : (this.GLOBAL.returnTableDataSize() - 1) * 30;
    }
  },
  watch: {
    tableData: {
      immediate: true,
      handler(val) {
        // 如果没有单据号，则表示这是个新建单据，且没有提交过
        if (!this.form.docEntry) {
          this.pushEmptyData(); // 自动加空行
        }
      }
    }
  },
  created() {},
  mounted() {
    // 如果有由列表页传递过来的值，即判定为修改表单操作
    if (this.passValue) {
      this.isOperate = false; // 内嵌表格隐藏操作列
      this.getDataInfo();
      // this.$el 当前组件的 <section> 标签
      this.contextMenuTarget = this.$el;
    }
  },

  methods: {
    /** 物料的chooseList 选中  */
    chooseMaterial(selectedRow, index) {
      let row = this.tableData[index];
      this.$set(row, "itemCode", selectedRow.itemCode);
      this.$set(row, "itemDescription", selectedRow.itemDescription);
      this.$set(row, "quantity", row.quantity || 1);
    },
    /**
     * 选中当前行 参数为 (当前行 ，旧行)
     * 把选中的当前行的数据带出去，用于外部使用
     * 此处根据当前表单单据编号，作为选中行之后的逻辑处理
     * 若有单据号，则当前选中行数据置为[],避免触发选中之后的函数执行
     * 若无单据号，则当前选中行数据，赋值给[currentRow],用于执行选中后的函数操作
     */
    handleCurrentRow(curRow, oldRow) {
      this.form.docEntry != undefined // 是否有单据号
        ? (curRow = []) // 有单据号，当前选中数据清空
        : (this.currentRow = curRow); // 没有单据号，当前选中数据，赋值给[currentRow]
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
    },
    handleDeleteOk(popover, index) {
      popover.doClose();
      this.tableData = this.tableData.filter((row, i) => i !== index);
    },
    /** 添加空数据行 */
    pushEmptyData() {
      if (this.tableData.filter(row => !row.itemCode).length === 0) {
        this.tableData.push({});
      }
    },

    /**
     * 移除空数据行
     * data: 带有空行的数据，此处为 [tableData] 过滤条件[物料编码]
     * return: 去掉空数据行的数据集
     */
    removeEmptyData(data) {
      if (data) {
        return data.filter(item => item.itemCode != undefined);
      }
    },

    /** 表单提交 事件 */
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          /** 窗体内容加载效果：开启 */
          this.formLoading = true;
          this.form.purchaseOrderRequestLines = this.removeEmptyData(
            this.tableData
          );
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
      // 通过调用当前窗体内容的父级.选项组.父级.窗体关闭事件，达到关闭窗体效果。
      this.$parent.$options.parent.handleClose();
    },

    /** 根据列表页传递过来的值，请求对应完整信息 */
    async getDataInfo() {
      try {
        /** 窗体内容加载效果：开启 */
        this.formLoading = true;
        const res = await getPurchaseOrderRequestInfo(this.passValue);
        this.form = res;
        this.form.remarks = res.remarks == null ? " " : res.remarks;
        this.form.status = res.status === "Open" ? "未清" : "已清";
        this.tableData = res.purchaseOrderRequestLines;
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /**
     * 新增数据
     */
    async postData() {
      try {
        const res = await postPurchaseOrderRequest(this.form);
        this.form = res; // 返回结果中的数据，回显至表单上
        this.form.remarks = res.remarks == null ? " " : res.remarks;
        this.$message.success("提交成功");
        /** 隐藏操作列 设置禁输入 */
        this.isOperate = false;
        this.currentRow = []; // 清掉当前行
        this.form.status = res.status === "Open" ? "未清" : "已清"; // 提交成功之后的回显
        this.tableData = res.purchaseOrderRequestLines; // 提交成功之后的回显 内嵌行
        // 内嵌行中的数据，移除空数据行
        this.tableData = this.removeEmptyData(this.tableData);
      } catch (error) {
        /** 显示操作列 设置可输入 */
        this.isOperate = true;
      }
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /** 更新数据 */
    async putData() {
      this.$message.success("修改成功");
      //   try {
      //     const res = await putPurchaseOrderRequest(this.form);
      //     this.form = res;
      //     this.$message.success("修改成功");
      //   } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    }
  }
};
</script>
