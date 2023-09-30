<template>
  <el-dialog title="采购向导" :visible="dialogVisible" :modal-append-to-body="false" modal-append-to-body :append-to-body="true" :before-close="cancelHandler" width="80%">
    <el-tabs v-model="activeName" type="card" stretch :before-leave="beforeLeave" style="margin-top:-30px">
      <div class="steps">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step>
            <div slot="title">勾选未清的采购申请单</div>
          </el-step>
          <el-step>
            <div slot="title">勾选需生成采购订单的项</div>
          </el-step>
        </el-steps>
      </div>
      <el-tab-pane name="1">
        <el-table v-loading="loading" :data="prevTableData" border highlight-current-row ref="multipleTable" @selection-change="handleSelectionChange" size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" :style="{'width':width}" :max-height="heightPrev">
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- <el-table-column type="index"></el-table-column> -->
          <el-table-column prop="docEntry" label="单据编号" width="120px"></el-table-column>
          <el-table-column prop="status" label="状态" width="120px">
            <template v-slot="scope">{{scope.row.status|FormatBaseStatus}}</template>
          </el-table-column>
          <el-table-column prop="docDate" label="单据日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="requiredDate" label="必需日期" show-overflow-tooltip></el-table-column>
          <el-table-column prop="docDueDate" label="到期日" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="2">
        <el-table v-loading="loading" :data="nextTableData" border highlight-current-row ref="multipleTable" @selection-change="handleSelectionChange" size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" :style="{'width':width}" :max-height="heightNext">
          <el-table-column type="selection" width="55"></el-table-column>
          <!-- <el-table-column type="index"></el-table-column> -->
          <el-table-column prop="baseEntry" label="单据编号" width="120px"></el-table-column>
          <el-table-column prop="lineIndex" label="行号" width="120px"></el-table-column>
          <el-table-column prop="itemCode" label="物料编码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="itemDescription" label="物料描述" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="状态" width="120px">
            <template v-slot="scope">{{scope.row.status|FormatBaseStatus}}</template>
          </el-table-column>
          <el-table-column prop="openQuantity" label="未清数量" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-tab-pane>
      <div style="float:right;margin-top:10px;">
        <el-button type="primary" plain @click="handlerPrev" size="mini" v-if="isPrevBtn">上一步</el-button>
        <el-button type="primary" plain @click="handlerNext" size="mini" v-if="isNextBtn">下一步</el-button>
        <el-button type="primary" plain @click="handlerFinish" size="mini" v-if="isFinishBtn">完成</el-button>
        <el-button @click="cancelHandler" size="mini">取 消</el-button>
      </div>
    </el-tabs>
  </el-dialog>
</template>

<script>
import {
  getPurchaseOrderRequestGuide,
  getPurchaseOrderGuide,
  getPurchaseDeliveryGuide
} from "@/api/purchase";
export default {
  // 采购模块 复制从[向导] 对话框
  name: "CopyFromDialog",
  props: {
    /**
     * 对话框是否显示 ，于父组件中的包裹元素 v-if变量绑定，达到手动控制本组件是否渲染
     */
    dialogVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "guideType"
    }
  },
  data() {
    return {
      /** 列表区域的宽度值 [列表页根据table宽度决定整体宽度] */
      width: this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE),
      /** 列表中的表头样式 */
      headerCellStyle: this.GLOBAL.LIST_TABLE_HEADER_CELL_STYLE,
      /** 列表中的单元格样式 [非表头部分] */
      cellStyle: this.GLOBAL.LIST_TABLE_CELL_STYLE,
      activeName: "1", // el-tabs的激活项
      active: 0, // 步骤条的激活项
      loading: false,
      prevTableData: [], // 请求回来的，未清采购申请单数据集
      multipleSelection: [], // 多选
      nextTableData: [], // 步骤一所选中数据集中所有[内嵌行]数据集
      isPrevBtn: false, // 默认不显示上一步
      isNextBtn: true, // 默认显示下一步
      isFinishBtn: false // 默认不显示完成
    };
  },
  computed: {
    /** 计算 向导一 页面table 高度 用于滚动条 */
    heightPrev() {
      /**
       * 当前数据总条数是否小于全局函数返回的每页数据条数，
       * 如果小于，则高度为(当前数据总条数+1)*40[每条高度]
       * 否则，返回(全局函数返回的每页数据条数+1)*40[每条高度]
       */
      return this.prevTableData.length <= this.GLOBAL.returnTableDataSize()
        ? (this.prevTableData.length + 1) * 40
        : this.GLOBAL.returnTableDataSize() * 40;
    },
    // /** 计算 向导二 页面table 高度 用于滚动条 */
    heightNext() {
      /**
       * 当前数据总条数是否小于全局函数返回的每页数据条数，
       * 如果小于，则高度为(当前数据总条数+1)*40[每条高度]
       * 否则，返回(全局函数返回的每页数据条数+1)*40[每条高度]
       */
      return this.nextTableData.length <= this.GLOBAL.returnTableDataSize()
        ? (this.nextTableData.length + 1) * 40
        : this.GLOBAL.returnTableDataSize() * 40;
    },
    guideType() {
      return this.type;
    }
  },
  watch: {
    activeName: {
      immediate: true,
      handler(val) {
        if (val) {
        }
      }
    }
  },

  mounted() {
    this.fetchData();
  },
  methods: {
    /** 下一步 */
    handlerNext(event) {
      console.log("多选数据:", this.multipleSelection);
      if (this.multipleSelection.length <= 0) {
        this.$message.warning("未勾选任何行数据");
        return;
      }

      // 只有当前非最后一页 才会启用这个函数
      this.active = 1;
      this.activeName = "2"; // 点一下，如果逻辑上没问题，切换到第二步的子页面

      /**
       * 从[multipleSelection]多选数据中过滤，返回 从[nextTableData]中过滤，[docEntry]不相等的数据
       * 最终返回，过滤后的[multipleSelection]，也就是用户点击[上一步]，对勾选做了更改的最新勾选结果数据集,
       */
      this.multipleSelection = this.multipleSelection.filter(mItem =>
        // 多选结果的过滤条件为:根据下一步的数据集[nextTableData]中的[docEntry]不相等
        this.nextTableData.filter(nItem => nItem.baseEntry != mItem.docEntry)
      );

      let temp = []; // 用于暂存添加所有line，每次到这里时候，先清空，也就保证了最后赋值给[nextTableData]时候，是最新值。

      // 处理 以上处理完的，最新的，第一步的勾选数据集 [this.multipleSelection]
      this.multipleSelection.map(item => {
        // 在此处转换一下，将三个向导不同的[lines]处理为一个统一的临时变量
        let lines = [];
        if (this.guideType === "FormPurchaseOrder") {
          lines = item.purchaseOrderRequestLines; // 采购申请单未清数据集选中行的[lines]转换
        }
        if (this.guideType === "FormPurchaseDelivery") {
          lines = item.purchaseOrderLines; // 采购订单未清数据集选中行的[lines]转换
        }
        if (this.guideType === "FormPurchaseReturn") {
          lines = item.purchaseDeliveryLines; // 采购收货单未清数据选中行的[lines]转换
        }

        // 迭代所有行数据，为每行添加[docEntry]单据编号
        lines.map(line => {
          // if (line.hasOwnProperty("docEntry")) return; // [line]中已有[docEntry]就不再添加
          line.baseEntry = item.docEntry; // 每条数据添加[docEntry]单据编号，该[line.baseEntry]单据编号用于对采购申请单产生关联
          line.baseLineId = line.id; // 该[line.baseLineId]基础行号，用于对采购申请单产生关联
          line.maxQuantity = line.openQuantity; // 该[line.maxQuantity]最大数量，取该行未清数量的值，作为表单内嵌行数量输入框中的最大边界值
          /**
           * 简单粗暴处理方式: 清空[temp],每次重新将line全部添加到其中
           * 此方案的弊端:第二步必须重新勾选。
           */
          temp.push(line); // 添加到第二步所需数据集

          /**
           * 此处需做以下处理：
           * 若[nextTableData]数据集中，不含有当前的[line],将其加入前者数据集中
           * 若……含有，则不添加
           *
           * [nextTableData]又需以下处理：
           * 将[nextTableData]中每条数据的[docEntry]与[line.docEntry]对比？
           *
           */
        });
      });
      this.nextTableData = temp;
      this.isPrevBtn = true; // 显示上一步按钮
      this.isNextBtn = false; // 隐藏下一步按钮
      this.isFinishBtn = true; // 显示完成按钮
      this.multipleSelection = []; // 清空多选项，用于存储第二步勾选项数组对象
    },
    /** 上一步 */
    handlerPrev() {
      // 只有当前为第二页面 or 第三页面 才会启用这个函数
      this.active = 0;
      this.activeName = "1"; // 点一下，如果逻辑上没问题，切换到第一步的子页面

      this.isPrevBtn = false; // 隐藏上一步按钮
      this.isNextBtn = true; // 显示下一步按钮
      this.isFinishBtn = false; // 隐藏完成按钮
    },
    /** 完成 */
    handlerFinish() {
      console.log("多选项：", this.multipleSelection);
      if (this.multipleSelection.length <= 0) {
        this.$message.warning("未勾选任何行数据");
        return;
      }
      this.$emit("on-comfirm", this.multipleSelection); // 于父组件中实现的事件，用于控制本组件是否渲染
      // 只有当前为第三页面 才会启用这个函数
    },

    beforeLeave(activeName, oldActiveName) {},
    /** * 多选 */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * 对话框的取消事件
     */
    cancelHandler() {
      this.$emit("on-cancel");
    },

    async fetchData() {
      this.loading = true;
      try {
        let res = []; // 存储请求回来的数据集
        if (this.guideType === "FormPurchaseOrder") {
          res = await getPurchaseOrderRequestGuide(); // 获取采购申请单未清数据集
        }
        if (this.guideType === "FormPurchaseDelivery") {
          res = await getPurchaseOrderGuide(); // 获取采购订单未清数据集
        }
        if (this.guideType === "FormPurchaseReturn") {
          res = await getPurchaseDeliveryGuide(); // 采购收货单未清数据
        }

        this.prevTableData = res;
        this.loading = false;
      } catch (err) {
        this.loading = false;
      }
    }
  }
};
</script>
<style lang="scss" >
.el-tabs__header {
  display: none;
}
</style>