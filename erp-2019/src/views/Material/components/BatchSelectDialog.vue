<template>
  <section>
    <el-dialog title="选择批次" :visible="dialogVisible" :modal-append-to-body="false" modal-append-to-body :append-to-body="true" :before-close="cancelHandler" width="1100px">
      <h3 style="margin-top:-40px">单据行</h3>
      <el-table v-loading="loading" :data="goodsListData" border style="width:1100px" highlight-current-row ref="singleTables" @current-change="handleCurrentChangeRow" :header-cell-style="{background:'#eef1f6',color:'#606266'}" size="mini">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="itemCode" label="物料编码" width="120px"></el-table-column>
        <el-table-column prop="itemDescription" label="物料描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="quantity" label="数量" width="120px"></el-table-column>
        <template v-if="isTransfer">
          <el-table-column prop="fromWhsCode" label="从仓库编码" width="120px"></el-table-column>
          <el-table-column prop="fromWhsName" label="从仓库名称" width="120px"></el-table-column>
          <el-table-column prop="toWhsCode" label="到仓库编码" width="120px"></el-table-column>
          <el-table-column prop="toWhsName" label="到仓库名称" width="120px"></el-table-column>
        </template>
        <template v-else>
          <el-table-column prop="whsCode" label="仓库编码" width="120px"></el-table-column>
          <el-table-column prop="whsName" label="仓库名称" width="120px"></el-table-column>
        </template>

        <el-table-column prop="batchCount" label="已选数量总计" width="120px"></el-table-column>
      </el-table>
      <KftTransfer :transferData="transferData">
        <div slot="leftPanel">
          <el-table :data="transferData.left.tableDataL" size="mini" :editable="editable" highlight-current-row :header-cell-style="{background:'#eef1f6',color:'#606266'}" border style="width: 100%" :height="height" @current-change="handleCurrentChangeRowLeft">
            <el-table-column type="index" label="行号"></el-table-column>
            <el-table-column prop="batchNumber" label="批次编码"></el-table-column>
            <el-table-column prop="onHand" label="可用数量" width="80"></el-table-column>
            <el-table-column prop="quantity" label="已选数量" width="130">
              <template v-slot="scope" v-if="editable">
                <el-input-number size="mini" v-model="scope.row.quantity" :min="1" :max="curMax" style="width: 108px;"></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div slot="centerOperate">
          <el-button type="primary" size="mini" @click="handlerLTR">至右</el-button>
          <br />
          <br />
          <el-button type="primary" size="mini" @click="handlerRTL">至左</el-button>
        </div>
        <div slot="rightPanel">
          <el-table :data="transferData.right.tableDataR" border style="width: 100%" highlight-current-row ref="singleTable" @current-change="handleCurrentChangeRowRight" :header-cell-style="{background:'#eef1f6',color:'#606266'}" size="mini" :height="height">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="batchNumber" label="批次编码"></el-table-column>
            <el-table-column prop="quantity" label="已选数量"></el-table-column>
          </el-table>
        </div>
      </KftTransfer>

      <div slot="footer">
        <el-button type="primary" @click="confirmHandler" size="mini">确 定</el-button>
        <el-button @click="cancelHandler" size="mini">取 消</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import { getReportInventoriesBath } from "@/api/stock";
export default {
  // 库存模块 选择批次 对话框
  name: "BatchSelectDialog",
  props: {
    /** 库存[收发转]单,需[选择批次]的数据集 */
    goodsList: [Array, Object],
    /**
     * 对话框是否显示 ，于父组件中的包裹元素 v-if变量绑定，达到手动控制本组件是否渲染
     */
    dialogVisible: {
      type: Boolean,
      default: false
    },
    transfer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentRow: [], // [单据行]表格的当前选中行
      currentRowLeft: [], // [穿梭框-左侧]表格的当前选中行
      currentRowRight: [], // [穿梭框-右侧]表格的当前选中行
      loading: false,
      editable: false, // 是否启用编辑表格
      // transfer: false, // 是否为转储
      transferData: {
        left: {
          title: "可用批次",
          tableDataL: []
        },
        right: {
          title: "已选批次",
          tableDataR: []
        }
      },
      batchCount: 0 // 已选数量总计
    };
  },
  computed: {
    goodsListData: {
      get() {
        return this.goodsList;
      },
      set(newVal) {
        return newVal;
      }
    },
    isTransfer() {
      return this.transfer;
    },
    /** 当前行中 数量输入框的max上限，取该行 可选数量值，若无，返回 1 */
    curMax() {
      if (this.currentRowLeft == undefined) {
        return 1;
      }
      return this.currentRowLeft.onHand;
    },
    /** 计算table height 默认显示为  */
    height() {
      return 300;
    }
  },
  watch: {},
  created() {},
  mounted() {
    // 默认选中[单据行]中的第一行数据 [延时操作，否则不生效]
    setTimeout(() => {
      this.$refs.singleTables.setCurrentRow(this.goodsListData[0]);
      // 计算已选数量总计的结果，赋值给 默认选中行的已选数量总计
      this.$set(
        this.currentRow,
        "batchCount",
        this.totalQuantity(this.transferData.right.tableDataR)
      );
    }, 10);
  },
  methods: {
    /**
     * [单据行]当前选中行
     */
    handleCurrentChangeRow(row) {
      /**
       * 如果 选中行上的 [batches] 已选批次数组 不为undefined （也就是更新之后，再次更改批次选择）
       * 将该行数据中的 [batches]批次数组属性 赋值给 [batchData] 已选批次列表
       */
      if (row != undefined && row.batches != undefined) {
        this.transferData.right.tableDataR = row.batches;
      }
      this.currentRow = row;
      this.getBatchData(); //拿到该行的物料编码和仓库编码，去请求该仓库所有批次
    },
    /**
     * [穿梭框-左侧] 当前选中行
     */
    handleCurrentChangeRowLeft(row) {
      this.currentRowLeft = row;
      this.editable = true;
    },
    /**
     * [穿梭框-右侧] 当前选中行
     */
    handleCurrentChangeRowRight(row) {
      this.currentRowRight = row;
    },

    /**
     * 对话框的确定事件
     */
    confirmHandler() {
      this.currentRow = []; // 清空选中行
      this.editable = false; // 不可编辑
      this.transfer = false; // 重置为非转储单情况
      this.$emit("on-comfirm"); // 于父组件中实现的事件，用于控制本组件是否渲染
    },
    /**
     * 对话框的取消事件
     */
    cancelHandler() {
      this.currentRow = []; // 清空选中行
      this.editable = false; // 不可编辑
      this.transfer = false; // 重置为非转储单情况
      this.$emit("on-cancel");
    },

    /**
     * 获取可用批次表格的数据
     * query: 物料编码 & 仓库编码
     */
    async getBatchData() {
      let query = {}; // 存放请求
      /**
       * 如果 当前行数据上  [fromWhsCode] 从仓库编码
       * 将其转为 合法请求体
       */
      if (this.currentRow.fromWhsCode) {
        query = {
          itemCode: this.currentRow.itemCode,
          whsCode: this.currentRow.fromWhsCode
        };
      }
      /**
       * 如果 当前行数据上  [whsCode] 仓库编码
       * 将其转为 合法请求体
       */
      if (this.currentRow.whsCode) {
        query = {
          itemCode: this.currentRow.itemCode,
          whsCode: this.currentRow.whsCode
        };
      }

      const res = await getReportInventoriesBath(query);
      /**
       * 处理请求回来的数据， 分为以下几种情况
       * 1.当前行数据[currentRowData.batches]批次数组属性中没有数据，则将[res]请求的数据，直接赋值到当前行的可选批次列表
       * 2.……已有数据，则将[res]请求的数据，重新计算,再赋值给[batchDataL]可选批次列表
       * 以上，每当选中一行数据都会请求后台最新的数据，且与正在编辑不冲突。
       *
       * 当前选中行中的[batches]批次数组,还没有添加过任何对象
       * 将请求回来的数据，直接赋值给 [batchDataL]可选批次列表，渲染至页面
       */
      if (
        this.currentRow.batches.length <= 0 ||
        this.currentRow.batches.length == undefined
      ) {
        this.transferData.left.tableDataL = res;
      } else {
        /**
         * 当前选中的[batches]里面已经有对象
         * [currentRow.batches]数组中的数据，一定是{batchNumber:批次编码,quantity:已选数量}，批次编码不会出现重复
         * [batches]中的数据，在 [res]中一定找得到
         * 遍历[res]请求回来的数据，然后于[currentRow.batches]寻找 [batchNumber]批次编码与[res[i]]相同的数据
         * find函数每次返回一个为true的对象，将[res[i]]对象中的[onHand]可选数量重新计算，
         */
        for (let i = 0; i < res.length; i++) {
          let result = this.currentRow.batches.find(
            item => item.batchNumber == res[i].batchNumber
          );
          if (result != undefined) {
            res[i] = {
              batchNumber: result.batchNumber,
              onHand: parseInt(res[i].onHand - result.quantity)
            };
          }
        }
        // 将处理过的 res，赋值给 左侧可选批次列表 映射item,过滤掉 onHand为0的数据
        this.transferData.left.tableDataL = res
          .map(item => item)
          .filter(i => i.onHand > 0);
      }
    },
    /** 至右 点击事件 */
    handlerLTR() {
      // 如果没输入数量,提醒用户输入数量
      if (this.currentRowLeft.quantity == undefined) {
        this.$message.warning("请输入数量");
      }
      // 如果 已选数量 > 可用数量 && 可用数量 > 0
      if (
        this.currentRowLeft.quantity > this.currentRowLeft.onHand &&
        this.currentRowLeft.onHand > 0
      ) {
        this.$message.warning("可用数量超出界限");
      }

      // todo:【数量只要点了，最小是 1】

      // 如果输入没有问题，则对数据进行处理
      else {
        // 当前左至右[选中]数据中[onHand]可用数量重新计算，【可用数量-输入数量值】
        this.currentRowLeft.onHand = parseInt(
          this.currentRowLeft.onHand - this.currentRowLeft.quantity
        );
        let temp = {
          batchNumber: this.currentRowLeft.batchNumber,
          quantity: parseInt(this.currentRowLeft.quantity)
        };
        /**
         * [currentRow.batches] 当前数据已选批次 ，寻找 [batchNumber]批次编码相同的数据
         * 1. 找不到，则使用 push 追加一条数据到 [tableDataR] 数组
         * 2. 找得到，则在其数据上，对[quantity]已选数量，进行追加
         */
        let result = this.currentRow.batches.find(
          item => item.batchNumber === temp.batchNumber
        );
        if (result == undefined) {
          this.transferData.right.tableDataR.push(temp);
        } else {
          for (let i = 0; i < this.transferData.right.tableDataR.length; i++) {
            if (
              this.transferData.right.tableDataR[i].batchNumber ==
              temp.batchNumber
            ) {
              // 使用 $set 视图显示数据
              this.$set(
                this.transferData.right.tableDataR[i],
                "batchNumber",
                temp.batchNumber
              );
              this.$set(
                this.transferData.right.tableDataR[i],
                "quantity",
                parseInt(
                  this.transferData.right.tableDataR[i].quantity + temp.quantity
                )
              );
            }
          }
        }
        // 亦加入到当前选择行数据的[batches]批次数组中
        this.currentRow.batches = this.transferData.right.tableDataR;
        // 计算 当前行数据的[batchCount]已选数量总计
        this.$set(
          this.currentRow,
          "batchCount",
          this.totalQuantity(this.transferData.right.tableDataR)
        );
        /**
         * 如果 [可选批次] 某条可用数量<=0, 将其从 [currentRowLeft]中移除
         */
        if (this.currentRowLeft.onHand <= 0) {
          // 于 [左侧数据集] 中，过滤掉，该暂存项
          this.transferData.left.tableDataL = this.transferData.left.tableDataL.filter(
            item => item.batchNumber != this.currentRowLeft.batchNumber
          );
          this.currentRowLeft = {}; // 清空左至右数据暂存
        }
      }
    },
    /** 至左 点击事件 */
    handlerRTL() {
      // 如果没有选中行数据，提醒用户选择一行数据
      if (this.currentRowRight.batchNumber == undefined) {
        this.$message.warning("请选中一行数据");
        return;
      }
      /**
       * 过滤，移除当前选中行数据 穿梭框右侧[tableDataR], 返回不含当前选中行的[已选批次]数组，达到删除效果。
       */
      this.transferData.right.tableDataR = this.transferData.right.tableDataR.filter(
        item => item.batchNumber != this.currentRowRight.batchNumber
      );
      /**
       * 将以上过滤后的值，赋值给 当前单据行数据中的 [batches] 批次数组
       */
      this.currentRow.batches = this.transferData.right.tableDataR;
      // 计算 当前行数据的[batchCount]已选数量总计
      this.$set(
        this.currentRow,
        "batchCount",
        this.totalQuantity(this.transferData.right.tableDataR)
      );

      /**
       * 过滤 [tableDataL]可用批次列表 ,从中找寻与[rtlRowData]相同的[batchNumber]
       * 如果过滤结果 >0
       */
      if (
        this.transferData.left.tableDataL.filter(
          item => item.batchNumber === this.currentRowRight.batchNumber
        ).length > 0
      ) {
        /**
         * 在左侧[tableDataL]可用批次列表中，找到 与[currentRowRight]中[batchNumber]批次编码相同的数据
         */
        for (let i = 0; i < this.transferData.left.tableDataL.length; i++) {
          if (
            this.transferData.left.tableDataL[i].batchNumber ==
            this.currentRowRight.batchNumber
          ) {
            // 重新计算 于[可选批次]数组中，找到的数据，的[onHand]可用数量 [可用数量=可用数量 + [rtlRowData]已选数量]
            this.transferData.left.tableDataL[i].onHand = parseInt(
              this.transferData.left.tableDataL[i].onHand +
                this.currentRowRight.quantity
            );
          }
        }
      } else {
        // 如果过滤后没找到 符合的[currentRowRight],将该数据push到 [tableDataL],左侧可选批次列表
        this.transferData.left.tableDataL.push({
          batchNumber: this.currentRowRight.batchNumber,
          onHand: this.currentRowRight.quantity
        });
      }

      this.currentRowRight = {}; // 右至左的暂存数据，清空
    },

    /**
     * 计算 动态刷新[单据行]中，每行数据后面的 [batchCount] 已选数量总计
     * 将通过 [currentRow.batches]当前选中行的批次数组，中计算过后的值
     * 赋值给当前选中行的[batchCount] 已选数量总计
     * data:需要计算的数据集，此处为单行数据的批次数据集
     * return: 返回计算结果
     */
    totalQuantity(data) {
      if (!data) return;
      return data
        .map(batch => parseInt(batch.quantity))
        .reduce((sum, current) => sum + current, 0);
    }
  }
};
</script>