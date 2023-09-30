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
            <el-form-item>
              <el-input v-model="form.docEntry" :placeholder="`${labels.docEntry.value}`" :disabled="true" clearable></el-input>
            </el-form-item>
          </aside>
          <!-- 单据日期 -->
          <aside>
            <KftLabel :label="labels.docDate.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="docDate">
              <el-date-picker v-model="form.docDate" type="datetime" :placeholder="`请选择${labels.docDate.value}`" value-format="yyyy-MM-dd HH:mm:ss" :disabled="!isOperate" style="width:-webkit-fill-available;"></el-date-picker>
            </el-form-item>
          </aside>
          <!-- remarks 备注 -->
          <aside style="flex-grow:2">
            <KftLabel :label="labels.remarks.value|FormatLabelSuffix"></KftLabel>
            <el-input v-model="form.remarks" :placeholder="`请输入${labels.remarks.value}`" size="mini" :disabled="!isOperate"></el-input>
          </aside>
        </div>
      </div>
      <!-- 主表区域  包裹器 end -->

      <!-- 编辑表格区域 -->
      <el-table :data="tableData" border highlight-current-row size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" :style="[styleObject]" :max-height="maxHeight" :row-style="rowStyle" :row-class-name="rowClassName" @current-change="handleCurrentRow">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="物料编码" width="220" prop="itemCode">
          <template v-slot="scope">
            <small>
              <KftChoose code="Material" class="kft-line-choose" size="mini" show-detail show-index show-search v-model="scope.row.itemCode" @on-choose-selected="chooseMaterial($event, scope.$index)" placeholder="请选择物料"></KftChoose>
            </small>
            <span>{{scope.row.itemCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="物料描述" show-overflow-tooltip prop="itemDescription"></el-table-column>
        <el-table-column prop="managementType" label="物料管理方式" width="100">
          <template v-slot="scope">{{scope.row.managementType|FormatManagementType}}</template>
        </el-table-column>
        <el-table-column label="数量" width="180" prop="quantity">
          <template v-slot="scope">
            <small>
              <el-input-number size="mini" v-model="scope.row.quantity" :min="1"></el-input-number>
            </small>
            <span>{{scope.row.quantity}}</span>
          </template>
        </el-table-column>

        <el-table-column label="仓库编码" width="220" prop="whsCode">
          <template v-slot="scope">
            <small>
              <KftChoose code="Warehouse" class="kft-line-choose" size="mini" show-detail show-index show-search v-model="scope.row.whsCode" @on-choose-selected="chooseWarehouse($event, scope.$index)" placeholder="请选择仓库"></KftChoose>
            </small>
            <span>{{scope.row.whsCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="仓库名称" width="150" show-overflow-tooltip prop="whsName"></el-table-column>

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

      <template v-if="isOperate">
        <!-- 提交 / 重置 表单 -->
        <div style="text-align:center">
          <el-button type="primary" size="mini" @click="onSubmit()">提交</el-button>
          <el-button size="mini" @click="onCancel()">取消</el-button>
        </div>
      </template>
    </el-form>

    <!-- 需要处理批次的 弹层区域 -->
    <template v-if="dialogShow">
      <BatchSelectDialog :goodsList="tData" :dialog-visible="dialogShow" @on-comfirm="confirmHandler" @on-cancel="cancelHandler"></BatchSelectDialog>
    </template>

    <!-- 右键菜单 -->
    <KftRightMenu class="right-menu" :target="contextMenuTarget" :show="contextMenuVisible" @update:show="(show) => contextMenuVisible=show " v-if="!isOperate">
      <a href="javascript:;" @click="getJournal">库存过账清单</a>
      <a href="javascript:;" @click="getBatch">批号交易报表</a>
    </KftRightMenu>

    <!-- 右键菜单所需的对话框 -->
    <template v-if="inventoryShow">
      <InventoryDialog :goodsList="inventoryData" :dialog-visible="inventoryShow" @on-comfirm="confirmHandler" @on-cancel="cancelHandler"></InventoryDialog>
    </template>
  </section>
</template>

<script>
import {
  getGoodsIssueInfo,
  postGoodsIssue,
  getReportJournal,
  getReportBatch
} from "@/api/stock";
import BatchSelectDialog from "./components/BatchSelectDialog";
import InventoryDialog from "./components/InventoryDialog";
export default {
  // 库存模块 库存发货单 表单页
  name: "FormGoodsIssue",
  components: { BatchSelectDialog, InventoryDialog },
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
        ]
      },
      dialogShow: false, // 是否显示创建批次对话框
      tableData: [], // 表格内的数据
      currentRow: [], // [内嵌行]表格的当前选中行
      tData: [], // 需带入到批次创建模态框单据行的数据
      /** 该变量有以下作用：
       * [正值]是否显示操作列:没有单据号时，显示操作列;反之则不显示操作列。
       * [正值]是否显示底部操作按钮: 没有单据号时，显示操作;反之则不显示操作，只能看当前
       * [反值]表单的输入框是否可输入，新增时可输入，一旦提交，则将设置该属性的项锁住[不可输入]
       * [反值]右键菜单是否可用，新增时右键菜单不可用，一旦提交，则右键菜单可用。
       */
      isOperate: true,
      /** 右键菜单插入到Body元素中 */
      contextMenuTarget: document.body,
      contextMenuVisible: false, // 右键菜单是否显示
      inventoryData: [], // 右键菜单弹出框的数据集
      inventoryShow: false // 库存清单弹窗是否显示
    };
  },
  computed: {
    /** 当前窗体宽度值计算 [根据全局设定基数等比缩放] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
    },
    /** 当前窗体标注组 [后台获取所有标注] */
    labels() {
      return this.$store.getters.labels.Document.formLabels;
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
      this.$set(row, "whsCode", selectedRow.defaultWhsCode);
      this.$set(row, "whsName", selectedRow.defaultWhsName);
    },
    /** 仓库的chooseList 选中  */
    chooseWarehouse(selectedRow, index) {
      let row = this.tableData[index];
      this.$set(row, "whsCode", selectedRow.whsCode);
      this.$set(row, "whsName", selectedRow.whsName);
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

    /** 获取 库存过账清单 显示于 对话框Table */
    getJournal() {
      this.contextMenuVisible = false;
      this.inventoryShow = true;
      this.getJournalData(); // 调用 库存过账清单
    },
    /** 获取 批次号交易记录清单 显示于 对话框Table */
    getBatch() {
      this.contextMenuVisible = false;
      this.inventoryShow = true;
      this.getReportBatchData();
    },

    /** 对话框的确定事件 */
    confirmHandler() {
      this.dialogShow = false; // 创建批次弹窗是否显示
      this.inventoryShow = false; // 库存清单弹窗是否显示
      this.formLoading = false; /** 窗体内容加载效果：关闭 */
    },
    /** 对话框的取消事件 */
    cancelHandler() {
      this.dialogShow = false; // 创建批次弹窗是否显示
      this.inventoryShow = false; // 库存清单弹窗是否显示
      this.formLoading = false; /** 窗体内容加载效果：关闭 */
    },

    /** 表单提交 事件 */
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          /** 窗体内容加载效果：开启 */
          this.formLoading = true;
          // 将[tableData]中的数据，移除空行后，赋值给[form.lines]。
          this.form.lines = this.removeEmptyData(this.tableData);
          /** 用 [version] 版本号来判定，执行新增函数 [该表单无更新函数] */
          if (this.form.version !== undefined) return;

          // 如果表格行中无数据，提醒用户选择
          if (this.form.lines == undefined || this.form.lines.length <= 0) {
            this.$message.warning("请选择物料");
            return;
          } else {
            // 返回其中 [物料管理方式]为[批次]的数据组
            let needBatchLines = this.form.lines.filter(
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

                  // 将每个
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
                // 检测每个数据的[数量]与每个数据的[批次数量]值是否一致
                this.tData.every(item => item.quantity == item.batchCount)
                  ? this.postData() // 调用提交数据函数
                  : (this.dialogShow = true); // 批次创建的对话框，显示
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

    /** 根据列表页传递过来的值，请求对应完整信息 */
    async getDataInfo() {
      try {
        /** 窗体内容加载效果：开启 */
        this.formLoading = true;
        const res = await getGoodsIssueInfo(this.passValue);
        this.form = res;
        this.tableData = res.lines;
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /** 新增数据 */
    async postData() {
      try {
        /** 迭代 [form.lines] 去掉每行数据中，唯前端所需[batchCount-批次数量]字段 */
        for (let i = 0; i < this.form.lines.length; i++) {
          // 删除对象中的某个属性， {需要删除的属性, ...其他属性的临时变量} = 当前对象
          let { batchCount, ...formData } = this.form.lines[i];
          this.form.lines[i] = formData;
        }
        let { lines, remarks, ...otherFormData } = this.form;
        this.form = {
          lines: this.form.lines,
          // 如果没有输入任何备注内容，就给一个 [无]字，解决回显覆盖掉输入提示文字
          remarks: remarks == null ? "无" : remarks,
          ...otherFormData
        };
        const res = await postGoodsIssue(this.form);
        this.form = res; // 返回结果中的数据，回显至表单上
        this.$message.success("提交成功");
        /**
         * 隐藏操作列 | 隐藏底部操作按钮组
         * 设置右键菜单可用 | 设置禁输入
         */
        this.isOperate = false;
        this.currentRow = []; // 清掉当前行
        // 内嵌行中的数据，移除空数据行
        this.tableData = this.removeEmptyData(this.tableData);
      } catch (error) {
        /**
         * 显示操作列 | 显示底部操作按钮组
         * 设置右键菜单禁用 | 设置可输入
         */
        this.isOperate = true;
        // 如果错误信息中包含[批次xxx不可用],就打开创建批次对话框
        if (error.data.message) {
          this.dialogShow = true;
        }
      }
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /**
     * 获取库存过账清单数据
     */
    async getJournalData() {
      let query = {
        baseEntry: this.form.docEntry.toString(),
        baseType: "GoodsIssue"
      };

      try {
        const res = await getReportJournal(query);
        this.inventoryData = res;
      } catch (error) {}
    },

    /**
     * 获取批次交易记录清单
     */
    async getReportBatchData() {
      let query = {
        baseEntry: this.form.docEntry.toString(),
        baseType: "GoodsIssue"
      };
      try {
        const res = await getReportBatch(query);
        this.inventoryData = res;
      } catch (error) {}
    }
  }
};
</script>
