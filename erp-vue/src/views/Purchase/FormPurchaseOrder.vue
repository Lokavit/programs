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
              <el-date-picker size="mini" v-model="form.docDate" type="datetime" :placeholder="`请选择${labels.docDate.value}`" value-format="yyyy-MM-dd HH:mm:ss" :disabled="!isOperate" style="width:-webkit-fill-available;"></el-date-picker>
            </el-form-item>
          </aside>
          <!-- 到期日 -->
          <aside>
            <KftLabel :label="labels.docDueDate.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="docDueDate">
              <el-date-picker size="mini" v-model="form.docDueDate" type="datetime" :placeholder="`请选择${labels.docDueDate.value}`" value-format="yyyy-MM-dd HH:mm:ss" :disabled="!isOperate" style="width:-webkit-fill-available;"></el-date-picker>
            </el-form-item>
          </aside>
          <!-- 交货日期 -->
          <aside>
            <KftLabel :label="labels.deliveryDate.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="deliveryDate">
              <el-date-picker size="mini" v-model="form.deliveryDate" type="datetime" :placeholder="`请选择${labels.deliveryDate.value}`" value-format="yyyy-MM-dd HH:mm:ss" :disabled="!isOperate" style="width:-webkit-fill-available;"></el-date-picker>
            </el-form-item>
          </aside>
        </div>

        <!-- 主表单行多项 第二行 -->
        <div class="form_row">
          <!-- 供应商编码 -->
          <aside>
            <KftLabel :label="labels.vendorCode.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="vendorCode">
              <KftChoose code="Vendor" v-model="form.vendorCode" show-detail @on-choose-selected="chooseVendor" :placeholder="`请选择${labels.vendorCode.value}`" size="mini"></KftChoose>
            </el-form-item>
          </aside>
          <!-- 供应商名称 -->
          <aside>
            <KftLabel :label="labels.vendorName.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.vendorName" :placeholder="`${labels.vendorName.value}`" :disabled="true"></el-input>
          </aside>

          <!-- 采购员编码 -->
          <aside>
            <KftLabel :label="labels.purchaserCode.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="purchaserCode">
              <KftChoose code="Employee" v-model="form.purchaserCode" show-detail @on-choose-selected="chooseEmployee" :placeholder="`请选择${labels.purchaserCode.value}`" size="mini"></KftChoose>
            </el-form-item>
          </aside>

          <!-- 采购员姓名 -->
          <aside>
            <KftLabel :label="labels.purchaserName.value|FormatLabelSuffix"></KftLabel>
            <el-input size="mini" v-model="form.purchaserName" :placeholder="`${labels.purchaserName.value}`" :disabled="true"></el-input>
          </aside>
        </div>

        <!-- 主表单行多项 第三行 -->
        <div class="form_row" style="padding-bottom:14px;">
          <!-- 状态 -->
          <aside>
            <template v-if="!isOperate">
              <KftLabel :label="labels.status.value|FormatLabelSuffix"></KftLabel>
              <el-input v-model="form.status" size="mini" :disabled="true"></el-input>
            </template>
          </aside>
          <aside style="flex-grow:3;">
            <KftLabel :label="labels.remarks.value|FormatLabelSuffix"></KftLabel>
            <el-input v-model="form.remarks" :placeholder="`请输入${labels.remarks.value}`" size="mini" :disabled="!isOperate"></el-input>
          </aside>
        </div>
      </div>
      <!-- 主表区域  包裹器 end -->

      <!-- 编辑表格区域 -->
      <el-table :data="tableData" border highlight-current-row size="mini" show-summary :summary-method="getSummaries" :header-cell-style="headerCellStyle" :cell-style="cellStyle" :style="[styleObject]" :max-height="maxHeight" :row-style="rowStyle" :row-class-name="rowClassName" @current-change="handleCurrentRow">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="物料编码" prop="itemCode" min-width="11%">
          <template v-slot="scope">
            <small>
              <KftChoose code="Material" class="kft-line-choose" size="mini" show-detail show-index show-search v-model="scope.row.itemCode" @on-choose-selected="chooseMaterial($event, scope.$index)" placeholder="请选择物料"></KftChoose>
            </small>
            <span>{{scope.row.itemCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="物料描述" show-overflow-tooltip prop="itemDescription" min-width="14%"></el-table-column>

        <el-table-column label="数量" prop="quantity" min-width="12%">
          <template v-slot="scope">
            <small>
              <el-input-number size="mini" v-model="scope.row.quantity" :min="1" :max="scope.row.maxQuantity"></el-input-number>
            </small>
            <span>{{scope.row.quantity}}</span>
          </template>
        </el-table-column>
        <el-table-column label="未清数量" prop="openQuantity" min-width="8%"></el-table-column>
        <el-table-column label="状态" prop="status" min-width="6%">
          <template v-slot="scope">{{scope.row.status|FormatBaseStatus}}</template>
        </el-table-column>

        <el-table-column label="价格" prop="price" min-width="8%">
          <template v-slot="scope">
            <small>
              <el-input size="mini" v-model="scope.row.price"></el-input>
            </small>
            <span>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格货币" prop="priceCurrency" min-width="8%">
          <template v-slot="scope">
            <small>
              <el-input size="mini" v-model="scope.row.priceCurrency"></el-input>
            </small>
            <span>{{scope.row.priceCurrency}}</span>
          </template>
        </el-table-column>
        <el-table-column label="货币汇率" prop="currencyRate" min-width="8%">
          <template v-slot="scope">
            <small>
              <el-input size="mini" v-model="scope.row.currencyRate"></el-input>
            </small>
            <span>{{scope.row.currencyRate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="行总计" prop="lineTotal" min-width="9%">
          <template v-slot="scope">{{Math.round(parseFloat((scope.row.quantity||1) * (scope.row.price*100||0)))/100}}</template>
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

      <!-- 提交 / 重置 表单 -->
      <div style="text-align:center">
        <el-button type="primary" size="mini" @click="onSubmit()">提交</el-button>
        <el-button size="mini" @click="onCancel()">取消</el-button>
        <el-button type="success" @click="handleCopyFrom" style="margin-left:60px" size="mini">复制从</el-button>
      </div>
    </el-form>

    <template v-if="copyFromDialogShow">
      <CopyFromDialog type="FormPurchaseOrder" :dialog-visible="copyFromDialogShow" @on-comfirm="confirmHandlerCopyFrom" @on-cancel="cancelHandlerCopyFrom"></CopyFromDialog>
    </template>
  </section>
</template>

<script>
import {
  getPurchaseOrderInfo,
  postPurchaseOrder,
  putPurchaseOrder
} from "@/api/purchase";
import CopyFromDialog from "./components/CopyFromDialog";
export default {
  // 采购模块 采购定单 表单页
  name: "FormPurchaseOrder",
  components: { CopyFromDialog },
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
        docDueDate: [
          {
            required: true,
            message: "请选择到期日",
            trigger: "change"
          }
        ],
        deliveryDate: [
          {
            required: true,
            message: "请选择交货日期",
            trigger: "change"
          }
        ],
        vendorCode: [
          {
            required: true,
            message: "请选择供应商",
            trigger: "blur"
          }
        ],
        purchaserCode: [
          {
            required: true,
            message: "请选择采购员",
            trigger: "blur"
          }
        ]
      },
      tableData: [], // 表格内的数据
      currentRow: [], // [内嵌行]表格的当前选中行
      /** 该变量有以下作用：
       * [正值]是否显示操作列:没有单据号时，显示操作列;反之则不显示操作列。
       * [反值]表单的输入框是否可输入，新增时可输入，一旦提交，则将设置该属性的项锁住[不可输入]
       * [反值]表单的[状态]一项是否显示，新增时隐藏该项，其它情况显示该项，并将该项锁住[不可输入]
       */
      isOperate: true,
      copyFromDialogShow: false // 是否显示复制从对话框
    };
  },
  computed: {
    /** 当前窗体宽度值计算 [根据全局设定基数等比缩放] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
    },
    /** 当前窗体标注组 [后台获取所有标注] */
    labels() {
      return this.$store.getters.labels.PurchaseOrder.formLabels;
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
       * 如果小于，则高度为(当前数据总条数+1)*30[每条高度]
       * 否则，返回(全局函数返回的每页数据条数+1)*30[每条高度]
       */
      return this.tableData.length <= this.GLOBAL.returnTableDataSize() / 2
        ? (this.tableData.length + 4) * 30
        : (this.GLOBAL.returnTableDataSize() - 1) * 30;
    }
  },
  watch: {
    /** 监听当前表单数据 */
    tableData: {
      immediate: true, // 页面渲染完毕立即触发一次
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
      // 给该行添加 [lineTotal]行总计 属性
      this.$set(
        row,
        "lineTotal",
        Math.round(parseFloat(row.quantity || 1) * (row.price * 100 || 0)) /
          100 || 0
      );
    },
    /** 供应商chooseList 选中 */
    chooseVendor(selectedRow) {
      this.$set(this.form, "vendorCode", selectedRow.code);
      this.$set(this.form, "vendorName", selectedRow.name);
    },
    /** 采购员chooseList 选中 */
    chooseEmployee(selectedRow) {
      this.$set(this.form, "purchaserCode", selectedRow.code);
      this.$set(this.form, "purchaserName", selectedRow.fullName);
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
          this.form.purchaseOrderLines = this.removeEmptyData(this.tableData);
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
      // 通过调用当前窗体内容的$父级.$选项组.父级.窗体关闭事件，达到关闭窗体效果。
      this.$parent.$options.parent.handleClose();
    },

    /** 复制从 */
    handleCopyFrom() {
      // 即使没数据，依然需要有一个 tData，带数据到[复制从]弹窗里，
      this.copyFromDialogShow = true;
    },

    /** 对话框的确定事件 */
    confirmHandlerCopyFrom(args) {
      this.tableData = this.removeEmptyData(this.tableData); // 去除 空行数据
      /**
       * 暂存 每次向导操作完成后，带过来的[args]数据集
       * map一下 args ，于 this.tableData中find 基本[baseEntry]单据编号相同，[baseLineId]基本行号相同，则认为是重复数据
       * 若find为 undefind ，则将该项，push到temp ，最后为数组，添加到 this.tableData
       */
      let temp = []; // 暂存满足条件的数据
      args.map(argsItem => {
        // 处理于复制从对话框选定而带至当前页面liens区域的数据，将每条数据的id移除
        let { id, ...argsItemData } = argsItem;
        argsItem = argsItemData;

        /** 根据条件查找 ：
         * 单项数据的基本[baseEntry]单据编号相同，并且[baseLineId]基本行号相同，则认为是重复数据
         */
        if (
          this.tableData.find(
            item =>
              item.baseEntry === argsItem.baseEntry &&
              item.baseLineId === argsItem.baseLineId
          ) == undefined
        ) {
          temp.push(argsItem);
        }
      });
      // apply() 方法调用一个具有给定this值的函数，以及作为一个数组（或类似数组对象）提供的参数。
      this.tableData.push.apply(this.tableData, temp);

      this.copyFromDialogShow = false; // 创建批次弹窗是否显示
      this.formLoading = false; /** 窗体内容加载效果：关闭 */
    },
    /** 对话框的取消事件 */
    cancelHandlerCopyFrom() {
      this.copyFromDialogShow = false; // 创建批次弹窗是否显示
      this.formLoading = false; /** 窗体内容加载效果：关闭 */
    },

    /** 计算总价 */
    getSummaries(param) {
      let { columns, data } = param;
      // 去掉多余空行
      data = this.removeEmptyData(data);
      let sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价"; // 与行号同列
          return;
        }
        // 如果 是 [lineTotal]行合计列
        if (column.property == "lineTotal") {
          // 计算每行，将其存储在该temp变量中 ，注意此处的金额计算。
          let temp = data.map(
            item =>
              Math.round(parseFloat(item.price * 100 * item.quantity)) / 100
          );
          /**
           * 使用 reduce计算以上得到的 temp数组,将其内中所有元素累加
           */
          sums[index] = temp.reduce((sum, cur) => {
            if (!isNaN(cur)) {
              // 因为是金额，此处使用 *100 再 /100 的方式，避免计算BUG
              return Math.round(parseFloat(sum + cur) * 100) / 100;
            } else {
              return sum;
            }
          }, 0);
        } else {
          sums[index] = " ";
        }
      });
      return sums;
    },

    /** 根据列表页传递过来的值，请求对应完整信息 */
    async getDataInfo() {
      try {
        /** 窗体内容加载效果：开启 */
        this.formLoading = true;
        const res = await getPurchaseOrderInfo(this.passValue);
        this.form = res;
        this.form.remarks = res.remarks == null ? " " : res.remarks;
        this.form.status = res.status == "Open" ? "未清" : "已清";
        this.tableData = res.purchaseOrderLines;
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },
    /**
     * 新增数据
     */
    async postData() {
      try {
        this.form.docDate = this.GLOBAL.FORMATDATETIME(new Date());
        const res = await postPurchaseOrder(this.form);
        this.form = res; // 返回结果中的数据，回显至表单上
        this.form.remarks = res.remarks == null ? " " : res.remarks;
        this.$message.success("提交成功");
        this.form.status = res.status == "Open" ? "未清" : "已清"; // 提交成功之后的回显
        this.form.purchaseOrderLines = res.purchaseOrderLines;
        /** 隐藏操作列 设置禁输入 */
        this.isOperate = false;
        this.currentRow = []; // 清掉当前行
        this.tableData = this.form.purchaseOrderLines;
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
      // try {
      //   const res = await putPurchaseOrder(this.form);
      //   this.form = res;
      //   this.$message.success("修改成功");
      // } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    }
  }
};
</script>
