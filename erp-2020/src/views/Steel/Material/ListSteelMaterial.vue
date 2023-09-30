<template>
  <section>
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item>主数据</el-breadcrumb-item>
    </el-breadcrumb>-->

    <!-- 当前组件的标题区域 -->
    <div class="title_container">
      <div>{{$route.meta.title}}</div>
      <!-- <div>预留按钮组区域</div> -->
    </div>

    <!-- 水平分割线 -->
    <!-- <hr style="margin:0;background-color:#cbcbcb;border:none;height:1px" /> -->
    <div style="display: block;height: 1px; width: 100%;background-color: #dcdfe6;"></div>

    <!-- 列表页 过滤条件区域 -->
    <el-form :model="filterCondition" size="mini">
      <div class="form_container">
        <div class="form_row">
          <!-- 第一列 -->
          <aside>
            <KftLabel label="物料编码"></KftLabel>
            <el-input v-model="filterCondition.itemCode" placeholder="请输入物料编码" @keyup.enter.native="onSubmit" clearable @clear="onSubmit" size="mini"></el-input>
          </aside>
          <!-- 第二列 -->
          <aside>
            <KftLabel label="物料描述"></KftLabel>
            <el-input v-model="filterCondition.itemCode" placeholder="请输入物料描述" @keyup.enter.native="onSubmit" clearable @clear="onSubmit" size="mini"></el-input>
          </aside>
          <!-- 第三列 -->
          <aside>
            <KftLabel label="物料组编码"></KftLabel>
            <el-input v-model="filterCondition.itemCode" placeholder="请输入物料组编码" @keyup.enter.native="onSubmit" clearable @clear="onSubmit" size="mini"></el-input>
          </aside>
          <!-- 第四列 -->
          <aside>
            <KftLabel label="物料组名称"></KftLabel>
            <el-input v-model="filterCondition.itemCode" placeholder="物料组名称" @keyup.enter.native="onSubmit" clearable @clear="onSubmit" size="mini"></el-input>
          </aside>

          <!-- 第五列 按钮组  -->
          <aside>
            <el-button @click="onMore" size="mini" style="width:auto;margin-left:auto;">
              <span style="margin:0 -6px">
                {{isShowMore?"收起":"更多"}}
                <i :class="`el-icon-arrow-${direction}`"></i>
              </span>
            </el-button>

            <el-button type="primary" icon="el-icon-search" @click="onSubmit" size="mini" style="margin-right:50px">查询</el-button>
          </aside>
        </div>

        <!-- 更多查询条件 -->
        <template v-if="isShowMore">
          <div class="form_row">
            <!-- 第一列 -->
            <aside>
              <KftLabel :label="labels.itemCode.value"></KftLabel>
              <el-input v-model="filterCondition.itemCode" :placeholder="`请输入${labels.itemCode.value}`" @keyup.enter.native="onSubmit" clearable @clear="onSubmit" size="mini"></el-input>
            </aside>
            <!-- 第二列 -->
            <aside>
              <KftLabel label="仓库"></KftLabel>
              <el-input v-model="filterCondition.itemCode" :placeholder="`请输入${labels.itemCode.value}`" @keyup.enter.native="onSubmit" clearable @clear="onSubmit" size="mini"></el-input>
            </aside>
            <!-- 第三列 -->
            <aside>
              <KftLabel :label="labels.itemCode.value"></KftLabel>
              <el-input v-model="filterCondition.itemCode" :placeholder="`请输入${labels.itemCode.value}`" @keyup.enter.native="onSubmit" clearable @clear="onSubmit" size="mini"></el-input>
            </aside>
            <!-- 第四列 -->
            <aside>
              <KftLabel :label="labels.itemCode.value"></KftLabel>
              <el-input v-model="filterCondition.itemCode" :placeholder="`请输入${labels.itemCode.value}`" @keyup.enter.native="onSubmit" clearable @clear="onSubmit" size="mini"></el-input>
            </aside>
            <aside></aside>
          </div>
        </template>
      </div>
    </el-form>

    <!-- 水平分割线 -->
    <hr style="background-color:#cbcbcb;border:none;height:1px" />
    <!-- <div style="display: block;height: 1px; width: 100%;background-color: #dcdfe6;"></div> -->

    <div style="background-color:rgba(0,0,0,0);height:30px">
      <el-button type="info" @click="onCreate" size="mini" style="position:absolute;right:70px">
        <i class="kft-icon-create"></i>
        <span>添加</span>
      </el-button>
      <el-button type="info" @click="onSubmit" size="mini" style="position:absolute;right:0px">
        <i class="kft-icon-refresh"></i>
        <span>刷新</span>
      </el-button>
    </div>

    <!-- 列表页 表格区域  列使用[min-width]设置该列占比 [注:单独设置不管用] -->
    <el-table v-loading="tableLoading" :data="tableData.content" highlight-current-row size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" stripe @row-dblclick="onSelectRow">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="itemCode" label="物料编码">
        <template v-slot="scope">
          <span @click="onCell" class="span-hover">{{scope.row.itemCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemDescription" label="物料描述" show-overflow-tooltip></el-table-column>
      <el-table-column prop="itemGroupCode" label="物料组编码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="itemGroupName" label="物料组名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="managementType" label="物料管理方式">
        <template v-slot="scope">{{scope.row.managementType|FormatManagementType}}</template>
      </el-table-column>
      <el-table-column prop="defaultWhsCode" label="仓库编码"></el-table-column>
      <el-table-column prop="defaultWhsName" label="仓库名称"></el-table-column>
      <el-table-column prop="preferredVendorCode" label="供应商编码"></el-table-column>
      <el-table-column prop="preferredVendorName" label="供应商名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="inventoryUomCode" label="计量单位编码"></el-table-column>
      <el-table-column prop="inventoryUomName" label="计量单位名称"></el-table-column>
      <el-table-column prop="enabled" label="启用"></el-table-column>

      <el-table-column label="操作" width="50" fixed="right" type="expand">
        <template v-slot="props">
          <div style="background-color:aqua">
            <div class="form_row">
              <aside>
                <label>创建人</label>
                <div>
                  创建人
                  <!-- <span>{{ props.row.name }}</span> -->
                </div>
              </aside>
              <aside>
                <label>创建时间</label>
                <div>创建时间</div>
              </aside>
              <aside>
                <label>修改人</label>
                <div>修改人</div>
              </aside>
              <aside>
                <label>修改时间</label>
                <div>修改时间</div>
              </aside>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表页 分页区域 -->
    <KftPagination :total="tableData.totalElements" :page-size="tableData.size" :fetch-data="getDataList" style="float:right;margin-top:10px;"></KftPagination>
  </section>
</template>

<script>
import { getMaterial } from "@/api/stock";
export default {
  // 钢材物料主数据列表页
  name: "ListSteelMaterial",
  data() {
    return {
      /** 列表中的表头样式 */
      headerCellStyle: this.GLOBAL.LIST_TABLE_HEADER_CELL_STYLE,
      /** 列表中的单元格样式 [非表头部分] */
      cellStyle: this.GLOBAL.LIST_TABLE_CELL_STYLE,
      /** 防止网路环境较差时，列表数据请求返回较慢，局部假死 */
      tableLoading: false,
      /** 查询区域 过滤条件对象 */
      filterCondition: {},
      /** 表格区域 相关 */
      tableData: {
        content: [], // 表格数据
        number: 0, // 当前页数
        size: this.GLOBAL.returnTableDataItem().item, // 每页条数
        totalElements: 0, // 当前列表数据总条数
        totalPages: 0 // 总页数
      },
      /** 是否显示更多查询条件 */
      isShowMore: false
    };
  },
  computed: {
    direction() {
      // 如果 xx展开。 则方向是 up ,否则是 down
      return !this.isShowMore ? "down" : "up";
    },
    /** 任务栏组 */
    taskGroup() {
      return this.$store.getters.taskGroup;
    }
  },

  watch: {},

  mounted() {
    this.getDataList(); // 页面渲染完毕时，请求列表数据
  },
  methods: {
    /** 列表页面 查询区域 点击更多按钮 点击事件
     * 点击该按钮，根据变量值，查询区域显隐多行查询条件
     */
    onMore() {
      this.isShowMore = !this.isShowMore;
    },

    /**
     * 点击 查看单行信息
     */
    onViewInfo(row) {
      console.warn("单行详情:", row);
    },

    /**
     * 该提交事件含以下作用：
     *    使用者输入内容按下回车键
     *    使用者输入内容按下查询按钮
     *    使用者点击清空输入框内容，即(x)按钮
     *    使用者点击页面内的刷新按钮
     * 参数为:查询的关键字，或许有多个，所以[filterCondition]为object格式
     */
    onSubmit() {
      if (!this.filterCondition.keyword) this.getDataList();
      if (this.filterCondition.keyword) {
        // 调用 获取数据， 将输入的查询关键字，传入第三个参数
        this.getDataList(
          this.tableData.number,
          this.tableData.size,
          this.filterCondition
        );
      }
    },
    /** 使用者点击页面查询区域[添加]按钮 事件 */
    onCreate(event) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      // 新建表单暂定唯一性，若用户再次点击添加按钮，将状态跳到已打开的新建表单任务项，并显示
      let isCreateForm = this.taskGroup.find(
        t => t.path == `/steel/material-form/create`
      );
      if (isCreateForm) {
        this.$store.dispatch("taskbar/switchTaskActive", isCreateForm);
      } else {
        // 调用创建窗体对应任务栏函数
        this.createTask(
          { path: `/steel/material-form/`, name: "FormSteelMaterial" },
          "create"
        );
      }
      this.$router.push({
        name: "FormSteelMaterial",
        params: { code: "create" }
      });
    },
    /** 点击单元格，将获取到的内容，传入到task及路由参数中，同时亦带入详情页面 */
    onCell(event) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      this.beforeClickEvent(event.target.innerText);
    },
    /** 行双击事件 */
    onSelectRow(row, column, event) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      this.beforeClickEvent(row.itemCode);
    },

    /** 将单元格点击及行双击事件提取为同一个函数，然后在处理事件时，分别调用
     * @param code 传入点击时获取到的指定值。
     */
    beforeClickEvent(code) {
      /** 由任务栏数组中在，寻找code相同的项 */
      let tempTask = this.taskGroup.find(
        t => t.path == `/steel/material-form/${code}`
      );
      if (tempTask) {
        // 如果找到任务项
        this.$store.dispatch("taskbar/switchTaskActive", tempTask);
      } else {
        // 如果找不到任务项  调用创建窗体对应任务栏函数
        this.createTask(
          { path: `/steel/material-form/`, name: "FormSteelMaterial" },
          code
        );
      }
      /** 路由随之跳转 */
      this.$router.push({
        name: "FormSteelMaterial",
        params: { code: code }
      });
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
        this.tableData = await getMaterial(params);
      } catch (err) {}
      /** 列表数据加载效果：关闭 */
      this.tableLoading = false;
    }
  }
};
</script>
