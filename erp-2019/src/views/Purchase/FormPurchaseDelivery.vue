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
              <el-date-picker v-model="form.docDate" type="datetime" :placeholder="`请选择${labels.docDate.value}`" value-format="yyyy-MM-dd HH:mm:ss" :disabled="!isOperate" style="width:-webkit-fill-available;"></el-date-picker>
            </el-form-item>
          </aside>
          <!-- 到期日 -->
          <aside>
            <KftLabel :label="labels.docDueDate.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="docDueDate">
              <el-date-picker v-model="form.docDueDate" type="datetime" :placeholder="`请选择${labels.docDueDate.value}`" value-format="yyyy-MM-dd HH:mm:ss" :disabled="!isOperate" style="width:-webkit-fill-available;"></el-date-picker>
            </el-form-item>
          </aside>
          <!-- 供应商编码 -->
          <aside>
            <KftLabel :label="labels.vendorCode.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="vendorCode">
              <KftChoose code="Vendor" v-model="form.vendorCode" show-detail @on-choose-selected="chooseVendor" :placeholder="`请选择${labels.vendorCode.value}`" size="mini"></KftChoose>
            </el-form-item>
          </aside>
        </div>

        <!-- 主表单行多项 第二行 -->
        <div class="form_row">
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
          <aside></aside>
        </div>
        <!-- 主表单行多项 第三行 -->
        <div class="form_row" style="padding-bottom:14px;">
          <aside>
            <KftLabel :label="labels.remarks.value|FormatLabelSuffix"></KftLabel>
            <el-input v-model="form.remarks" :placeholder="`请输入${labels.remarks.value}`" size="mini" :disabled="!isOperate"></el-input>
          </aside>
        </div>
      </div>
      <!-- 主表区域  包裹器 end -->

      <!-- 编辑表格区域 -->
      <el-table :data="tableData" border highlight-current-row size="mini" show-summary :summary-method="getSummaries" :header-cell-style="headerCellStyle" :cell-style="cellStyle" :style="[styleObject]" :max-height="maxHeight" :row-style="rowStyle" :row-class-name="rowClassName" @current-change="handleCurrentRow">
        <el-table-column type="index" label="#" width="50px"></el-table-column>
        <el-table-column label="物料编码" width="140" prop="itemCode" min-width="10%">
          <template v-slot="scope">
            <small>
              <KftChoose code="Material" class="kft-line-choose" size="mini" show-detail show-index show-search v-model="scope.row.itemCode" @on-choose-selected="chooseMaterial($event, scope.$index)" placeholder="请选择物料"></KftChoose>
            </small>
            <span>{{scope.row.itemCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="物料描述" show-overflow-tooltip prop="itemDescription" min-width="10%"></el-table-column>
        <el-table-column label="物料管理方式" show-overflow-tooltip prop="managementType" min-width="10%"></el-table-column>
        <el-table-column label="仓库编码" width="140" prop="whsCode" min-width="10%">
          <template v-slot="scope">
            <small>
              <KftChoose code="Warehouse" class="kft-line-choose" size="mini" show-detail show-index show-search v-model="scope.row.whsCode" @on-choose-selected="chooseWarehouse($event, scope.$index)" placeholder="请选择仓库"></KftChoose>
            </small>
            <span>{{scope.row.whsCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="仓库名称" show-overflow-tooltip prop="whsName" min-width="10%"></el-table-column>

        <el-table-column label="数量" prop="quantity" min-width="9%">
          <template v-slot="scope">
            <small>
              <el-input-number size="mini" v-model="scope.row.quantity" :min="1" :max="scope.row.maxQuantity"></el-input-number>
            </small>
            <span>{{scope.row.quantity}}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格" prop="price" min-width="9%">
          <template v-slot="scope">
            <small>
              <el-input size="mini" v-model="scope.row.price"></el-input>
            </small>
            <span>{{scope.row.price}}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格货币" prop="priceCurrency" min-width="9%">
          <template v-slot="scope">
            <small>
              <el-input size="mini" v-model="scope.row.priceCurrency"></el-input>
            </small>
            <span>{{scope.row.priceCurrency}}</span>
          </template>
        </el-table-column>
        <el-table-column label="货币汇率" prop="currencyRate" min-width="9%">
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
          <el-table-column label="操作" min-width="5%">
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
      <CopyFromDialog type="FormPurchaseDelivery" :dialog-visible="copyFromDialogShow" @on-comfirm="confirmHandlerCopyFrom" @on-cancel="cancelHandlerCopyFrom"></CopyFromDialog>
    </template>

    <!-- 需要处理批次的 弹层区域 -->
    <template v-if="dialogShow">
      <BatchCreateDialog :goodsList="tData" :dialog-visible="dialogShow" @on-comfirm="confirmHandler" @on-cancel="cancelHandler"></BatchCreateDialog>
    </template>
  </section>
</template>

<script>
import {
  getPurchaseDeliveryInfo,
  postPurchaseDelivery,
  putPurchaseDelivery
} from "@/api/purchase";
import CopyFromDialog from "./components/CopyFromDialog";
import BatchCreateDialog from "../Material/components/BatchCreateDialog";
export default {
  // 采购模块 采购收货单 表单页
  name: "FormPurchaseDelivery",
  components: { CopyFromDialog, BatchCreateDialog },
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
       */
      isOperate: true,
      copyFromDialogShow: false, // 是否显示复制从对话框
      dialogShow: false, // 是否显示创建批次对话框
      tData: [] // 需带入到批次创建模态框单据行的数据
    };
  },
  computed: {
    /** 当前窗体宽度值计算 [根据全局设定基数等比缩放] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
    },
    /** 当前窗体标注组 [后台获取所有标注] */
    labels() {
      return this.$store.getters.labels.PurchaseDelivery.formLabels;
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
      this.$set(row, "managementType", selectedRow.managementType);
      this.$set(row, "quantity", row.quantity || 1);
      // 给该行添加 [lineTotal]行总计 属性
      this.$set(
        row,
        "lineTotal",
        Math.round(parseFloat(row.quantity || 1) * (row.price * 100 || 0)) /
          100 || 0
      );
    },
    chooseWarehouse(selectedRow, index) {
      let row = this.tableData[index];
      this.$set(row, "whsCode", selectedRow.whsCode);
      this.$set(row, "whsName", selectedRow.whsName);
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
          this.form.purchaseDeliveryLines = this.removeEmptyData(
            this.tableData
          );
          /** 用 [version] 版本号来判定，执行新增函数 [该表单无更新函数] */
          if (this.form.version !== undefined) return;
          // 如果表单行数据没有，提醒用户选择
          if (
            this.form.purchaseDeliveryLines == undefined ||
            this.form.purchaseDeliveryLines.length <= 0
          ) {
            this.$message.warning("请选择物料");
            return;
          } else {
            // 返回其中 [物料管理方式]为[批次]的数据组
            let needBatchLines = this.form.purchaseDeliveryLines.filter(
              item => item.managementType === "BATCHNUMBER"
            );

            // 如果没有需要批次的数据。
            if (needBatchLines == undefined || needBatchLines.length <= 0) {
              this.postData(); // 调用新增数据寒湖是
            } else if (
              needBatchLines != undefined ||
              needBatchLines.length > 0
            ) {
              /**
               * 如果有需要批次的数据  ， 分为以下几种情况
               * 1. 需要批次的数据中，不含有 [batches]，则定然不含有 [batchCount],将这两个属性加到单条数据对象中
               * 2. ……已含有[batches]及[batchCount]，则对数据做进一步处理，使用[batches]计算总量，赋值给[batchCount]
               */

              for (let i = 0; i < needBatchLines.length; i++) {
                /**
                 * 如果 当前某条需要批次的数据中， 没有 [batches] 批次数组这个属性
                 * 添加批次管理属性， 及 临时需要的 [batchCount]已选数量总计 ，注意添加方式
                 */
                if (needBatchLines[i].batches == undefined) {
                  // 给需要批次的数据，加上一个属性 [batches]批次数组
                  this.$set(needBatchLines[i], "batches", new Array());
                  /**
                   * 使用该方式为每个需要批次的数据加上 ，[batchCount] 已选数量总计属性
                   * 当在批次选择模态框中操作时， 该属性值会实时变动。
                   */
                  this.$set(needBatchLines[i], "batchCount", 0);
                } else if (needBatchLines[i].batches.length >= 0) {
                  /**
                   * 如果 当前某条需要批次的数据中 ，已有 [batches] 批次数组这个属性
                   * 1.将索引所指数据中，动态更新，模态框点击更新后出来的数据[tData]中的对应数据
                   * 2.计算该行数据的[batches]数组中的数量总计，赋值给改行数据的[batchCount]属性
                   */
                  /**
                   * 将索引所指数据中，动态更新，模态框点击更新后出来的数据[tData]中的对应数据
                   * 注意:此处$set()中的value，指的是 [tData]的索引同条数据的[batches]
                   */
                  this.$set(
                    needBatchLines[i],
                    "batches",
                    this.tData[i].batches
                  );

                  /**
                   * 计算 该数据的[batches] 批次数组 中数量，返回总数
                   * 将返回的总数量 ，通过$set(),动态赋值给 [batchCount] 已选数量总计
                   */
                  let totalQuantity = needBatchLines[i].batches
                    .map(batch => parseInt(batch.quantity))
                    .reduce((sum, current) => sum + current, 0);
                  // 将计算后的总量， 赋值给 该数据的 [batchCount] 已选数量总计
                  this.$set(needBatchLines[i], "batchCount", totalQuantity);
                }
              }

              // 将数据带到 tData【模态框顶部展示表格】
              this.tData = needBatchLines;
              /**
               * 一个返回 true or false 的方式
               * 如果 不合格数据 > 0 , 使用 every()函数,判断最终输出结果
               * 如果 every()返回为true，可提交， 否则，提示用户选择批次，显示选择批次模态框
               */
              if (this.tData.length > 0) {
                let result = this.tData.every(
                  item => item.quantity == item.batchCount
                );

                if (result) {
                  this.postData();
                } else {
                  this.dialogShow = true; // 批次创建的对话框，显示
                }
              }
            }
          }
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

    /** 处理批次 对话框的确定事件 */
    confirmHandler() {
      this.dialogShow = false; // 创建批次弹窗是否显示
      this.formLoading = false; /** 窗体内容加载效果：关闭 */
    },
    /** 处理批次 对话框的取消事件 */
    cancelHandler() {
      this.dialogShow = false; // 创建批次弹窗是否显示
      this.formLoading = false; /** 窗体内容加载效果：关闭 */
    },

    /** 根据列表页传递过来的值，请求对应完整信息 */
    async getDataInfo() {
      try {
        /** 窗体内容加载效果：开启 */
        this.formLoading = true;
        const res = await getPurchaseDeliveryInfo(this.passValue);
        this.form = res;
        this.form.remarks = res.remarks == null ? " " : res.remarks;
        this.tableData = res.purchaseDeliveryLines;
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
        /** 迭代 [form.lines] 去掉每行数据中，唯前端所需[batchCount-批次数量]字段 */
        for (let i = 0; i < this.form.purchaseDeliveryLines.length; i++) {
          // 删除对象中的某个属性， {需要删除的属性, ...其他属性的临时变量} = 当前对象
          let { batchCount, ...formData } = this.form.purchaseDeliveryLines[i];
          this.form.purchaseDeliveryLines[i] = formData;
        }
        let { purchaseDeliveryLines, ...otherFormData } = this.form;
        this.form = {
          purchaseDeliveryLines: this.form.purchaseDeliveryLines,
          ...otherFormData
        };

        const res = await postPurchaseDelivery(this.form);
        this.form = res; // 返回结果中的数据，回显至表单上
        this.form.remarks = res.remarks == null ? " " : res.remarks;
        this.$message.success("提交成功");
        this.form.purchaseDeliveryLines = res.purchaseDeliveryLines; // 提交成功之后的回显 内嵌行
        /** 隐藏操作列 设置禁输入 */
        this.isOperate = false;
        this.currentRow = []; // 清掉当前行
        this.tableData = this.form.purchaseDeliveryLines;
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
      //   const res = await putPurchaseDelivery(this.form);
      //   this.form = res;
      //   this.$message.success("修改成功");
      // } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    }
  }
};
</script>
