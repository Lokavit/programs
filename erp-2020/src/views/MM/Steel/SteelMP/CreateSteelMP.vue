<template>
  <el-dialog :visible="dialogVisible" :modal-append-to-body="false" modal-append-to-body :append-to-body="true" :before-close="cancelHandler" width="90%" style="margin-top:-60px;">
    <el-divider>物资供应计划 批量新增</el-divider>
    <!-- 查询区域 -->
    <el-form :model="filterCondition" size="mini">
      <div class="form_container">
        <div class="form_row">
          <!-- 第一列 -->
          <aside>
            <KftLabel label="物料编码"></KftLabel>
            <el-input v-model="filterCondition.itemCode" placeholder="请输入物料编码" @keyup.enter.native="onFilter" clearable @clear="onFilter" size="mini"></el-input>
          </aside>
          <!-- 第二列 -->
          <aside>
            <KftLabel label="物料描述"></KftLabel>
            <el-input v-model="filterCondition.itemCode" placeholder="请输入物料描述" @keyup.enter.native="onFilter" clearable @clear="onFilter" size="mini"></el-input>
          </aside>
          <!-- 第三列 -->
          <aside>
            <KftLabel label="物料组编码"></KftLabel>
            <el-input v-model="filterCondition.itemCode" placeholder="请输入物料组编码" @keyup.enter.native="onFilter" clearable @clear="onFilter" size="mini"></el-input>
          </aside>
          <!-- 第四列 -->
          <aside>
            <KftLabel label="物料组名称"></KftLabel>
            <el-input v-model="filterCondition.itemCode" placeholder="物料组名称" @keyup.enter.native="onFilter" clearable @clear="onFilter" size="mini"></el-input>
          </aside>

          <!-- 第五列 按钮组  -->
          <aside>
            <el-button type="primary" icon="el-icon-search" @click="onFilter" size="mini" style="position:absolute;right:10%">查询</el-button>
          </aside>
        </div>
      </div>
    </el-form>
    <!-- 列表页 表格区域  列使用[min-width]设置该列占比 [注:单独设置不管用] -->
    <el-table v-loading="tableLoading" :data="tableData.content" highlight-current-row size="mini" :header-cell-style="GLOBAL.LIST_TABLE_HEADER_CELL_STYLE" :cell-style="GLOBAL.LIST_TABLE_CELL_STYLE" stripe @selection-change="handleSelectionChange" :max-height="maxHeight">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="itemCode" label="物料编码"></el-table-column>
      <el-table-column prop="itemDescription" label="物料描述" show-overflow-tooltip></el-table-column>
      <el-table-column prop="itemGroupCode" label="物料组编码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="itemGroupName" label="物料组名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="itemDescription" label="规格" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="状态">
        <template v-slot="scope">
          <!-- 于结构元素内直接使用，无需加this. -->
          <span :style="{'color':GLOBAL.returnStatusObject(scope.row.status,GLOBAL.STATUS_ENBALE).color}">● {{GLOBAL.returnStatusObject(scope.row.status,GLOBAL.STATUS_ENBALE).label}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button type="primary" @click="confirmHandler" size="mini">确 定</el-button>
      <el-button @click="cancelHandler" size="mini">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { getMaterial } from "@/api/stock";
import materialsListData from "@/data/materials.json";
export default {
  /** 钢材 MP 物资供应计划 批量新增
   * 该页非路由项，由列表页新增按钮激活该项
   */
  name: "CreateSteelMP",
  props: {
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
      /** 查询区域 过滤条件对象 */
      filterCondition: {},
      /** 防止网路环境较差时，列表数据请求返回较慢，局部假死 */
      tableLoading: false,
      /** 表格区域 相关 */
      tableData: {
        content: [], // 表格数据
        number: 0, // 当前页数
        size: this.GLOBAL.returnTableDataItem().item, // 每页条数
        totalElements: 0, // 当前列表数据总条数
        totalPages: 0 // 总页数
      },
      multipleSelection: [] // 存储多选
    };
  },
  computed: {
    /** table内容最大高度，以达到内部滚动的效果 */
    maxHeight() {
      /** 通过获取屏幕宽度返回的当前每页最大条数 * 每行高度 */
      return this.GLOBAL.returnTableDataItem().item * 40;
    }
  },
  watch: {},
  mounted() {
    this.getDataList(); // 页面渲染完毕时，请求列表数据
  },
  methods: {
    /** 按钮：查询
     * 根据输入条件，显示过滤后的数据
     * 该过滤事件含以下作用：
     *    使用者输入内容按下回车键
     *    使用者输入内容按下查询按钮
     *    使用者点击清空输入框内容，即(x)按钮
     *    使用者点击页面内的刷新按钮
     * 参数为:查询的条件，或许有多个，所以[filterCondition]为object格式
     */
    onFilter() {
      /** 通过过滤条件对象是否为{}，来决定调用请求接口时，是否传入第三参数(过滤条件对象) */
      this.filterCondition == {}
        ? // 不带任何参数对象
          this.getDataList()
        : // 传入三个参数对象(页码，每页条数，过滤条件对象)
          this.getDataList(
            this.tableData.number,
            this.tableData.size,
            this.filterCondition
          );
    },

    /** checkBox 选择 */
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // console.log("多选", this.multipleSelection);
    },

    /**
     * 对话框的确定事件
     * 迭代每行数据的所有批次，将其[batches]中 [batchNumber]重复的进行合并
     */
    confirmHandler() {
      this.$emit("on-comfirm", this.multipleSelection); // 于父组件中实现的事件，用于控制本组件是否渲染
    },
    /**
     * 对话框的取消事件
     */
    cancelHandler() {
      this.$emit("on-cancel");
    },

    /**
     * 获取当前页面列表数据集
     * page: 当前页
     * size: 每页数据集条数
     * filterCondition: 于查询区域各个属性的值(单项or多项)
     */
    async getDataList(page, size, filterCondition = {}) {
      let params = {
        page: page > 0 ? page - 1 : 0,
        size: this.tableData.size,
        ...filterCondition // 解构查询区域的输入值
      };
      try {
        /** 列表数据加载效果：开启 */
        this.tableLoading = true;
        /** 请求回来的数据，直接赋值给tableData */
        // this.tableData = await getMaterial(params);
        // 暂行使用，dta中的物料主数据列表数据集
        this.tableData = materialsListData;
      } catch (err) {}
      /** 列表数据加载效果：关闭 */
      this.tableLoading = false;
    }
  }
};
</script>