<template>
  <section :style="{'width':width}" class="modal_list">
    <!-- 列表页 查询区域 -->
    <el-form :inline="true" :model="search" size="mini" @submit.native.prevent>
      <div class="form_row">
        <!-- 第一列 查询输入框 -->
        <aside>
          <KftLabel :label="labels.projectEntry.value|FormatLabelSuffix"></KftLabel>
          <KftChoose code="Project" v-model="search.projectEntry" show-detail @on-choose-selected="chooseProject" :placeholder="`请选择${labels.projectEntry.value}`" size="mini"></KftChoose>
        </aside>
        <!-- 第二列 查询按钮 -->
        <aside>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit" size="mini" style="margin-left:40px;">查询</el-button>
        </aside>
        <!-- 空一列 保证宽屏情况下的等分布局 -->
        <aside></aside>
        <!-- 第四列 按钮组  -->
        <aside style="position:relative;">
          <el-button type="info" @click="onRootCreate" size="mini" style="position:absolute;right:210px">
            <i class="kft-icon-create"></i>
            <span>添加</span>
          </el-button>

          <el-upload action :http-request="uploadFile" accept="*/*" :show-file-list="false" style="position:absolute;right:140px">
            <el-button type="info" size="mini">
              <i class="kft-icon-upload"></i>
              <span>上传</span>
            </el-button>
          </el-upload>

          <el-button type="info" @click="handleDownload" size="mini" style="position:absolute;right:70px">
            <i class="kft-icon-download"></i>
            <span>下载</span>
          </el-button>
          <el-button type="info" @click="onSubmit" size="mini" style="position:absolute;right:0px">
            <i class="kft-icon-refresh"></i>
            <span>刷新</span>
          </el-button>
        </aside>
      </div>
    </el-form>

    <!-- 列表区域 -->
    <el-table v-loading="tableLoading" :data="tableData" border lazy :load="lazyLoad" row-key="entry" :tree-props="{children: 'children', hasChildren: 'hasElement'}" highlight-current-row size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" @current-change="handleCurrentRow" empty-text="请输入项目编码进行查询" :max-height="maxHeight" stripe>
      <el-table-column prop="entry" label="编码" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="name" label="名称" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="projectEntry" label="项目编码" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="length" label="长度" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="width" label="宽度" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="height" label="高度" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="weight" label="净重" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template v-slot="scope">
          <el-button type="warning" size="mini" circle style="padding:0;margin-left:8px" @click="onChildCreate(scope.row)">
            <i class="kft-icon-create"></i>
          </el-button>
          <el-button type="warning" size="mini" circle style="padding:0;margin-left:8px" @click="onModifty(scope.row)">
            <i class="kft-icon-edit"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
import {
  getBlocks,
  postBlockImport,
  getProjectDownload
} from "@/api/manufacture";
import FormBlock from "./FormBlock";
export default {
  // 生成模块 分段主数据 列表页
  name: "ListBlock",
  components: { FormBlock },
  data() {
    return {
      /** 列表中的表头样式 */
      headerCellStyle: this.GLOBAL.LIST_TABLE_HEADER_CELL_STYLE,
      /** 列表中的单元格样式 [非表头部分] */
      cellStyle: this.GLOBAL.LIST_TABLE_CELL_STYLE,
      /** 防止网路环境较差时，列表数据请求返回较慢，局部假死 */
      tableLoading: false,
      /** 查询的from */
      search: {},
      /** 列表区域 相关 */
      tableData: [],
      currentRow: [] // 表格的当前选中行
    };
  },
  computed: {
    /** 当前窗体宽度值计算 [根据全局设定基数等比缩放] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
    },
    /** 当前窗体标注组 [后台获取所有标注] */
    labels() {
      return this.$store.getters.labels.Block.listLbales;
    },
    /** 计算 页面table 高度 用于滚动条 */
    maxHeight() {
      /**
       * 此处使用本页面求出的width值通过16:9的计算 -140结果为表格最大高度
       * 大屏情况下有问题，待修复
       */
      return (parseInt(this.width) / 16) * 9 - 100;
    }
  },
  watch: {},
  created() {},
  beforeMount() {},
  mounted() {},
  methods: {
    /** 项目的chooseList 选中 */
    chooseProject(selectedRow) {
      this.search = {}; // 每次变更项目编码前,情况查询对象的原有属性
      this.$set(this.search, "projectEntry", selectedRow.entry);
    },
    /** 当前选中行 该函数作为备用,用于需要操作当前选中行数据or上次选中行数据
     * curRow:当前行
     * oldRow:上次选中行
     */
    handleCurrentRow(curRow, oldRow) {},

    /**
     * 该提交事件含以下作用：
     *    使用者输入内容按下查询按钮
     *    使用者点击窗体内的刷新按钮
     * 参数为:查询的关键字，或许有多个，所以[search]为object格式
     */
    onSubmit() {
      // 如果查询框中没有值，提示用户输入
      if (!this.search.projectEntry) this.$message.warning("请输入项目编码");
      if (this.search.projectEntry) {
        // 调用 获取数据， 将输入的查询关键字，传入第三个参数
        this.getDataList(this.search);
      }
    },
    /** 新增根元素 该按钮在全局窗体底部 */
    onRootCreate(event) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      this.openModal(); // 打开表单页
    },

    /** 新增子元素，作用于添加子集数据 */
    onChildCreate(row) {
      // 打开表单页 参数为上级对象编码
      // this.$set(row,"status","create");
      this.openModal(row);
      // console.log('当先选中行添加一个新建状态:',row);
    },
    /** 单行操作项 之 行数据编辑 */
    onModifty(row) {
      let passValue = {
        projectEntry: row.projectEntry,
        entry: row.entry,
        status: "modifty"
      };
      this.openModal(passValue); // 打开表单页
    },

    /** 列表数据懒加载
     * row:拿到点击行的数据。
     * resolve: 请求的数据，作为其参数。
     */
    async lazyLoad(row, treeNode, resolve) {
      let params = {
        parentEntry: row.entry // 当前节点ID作为父级节点ID请求数据
      };
      const res = await getBlocks(params);
      resolve(res); // 子集数据
      /**
       * 把请求回来的数据，直接加在节点上。
       * 使用该方式，给当前tree节点添加[children],保证[tableData]同步更新
       */
      this.$set(row, "children", res);
    },

    /** el-upload的自定义上传 */
    async uploadFile(file) {
      console.log("触发！上传");
      const formData = new FormData();
      // 该 xls 即，后台API 所设置的文件承接 。(也就是body时的每个属性)
      formData.append("xls", file.file);
      const res = await postBlockImport(formData);
      if (res.statusOK) this.$message.success("上传成功");
      else this.$message.warring(res.message);
    },

    /** 下载 Excel */
    async handleDownload() {
      const res = await getProjectDownload();
      let blob = new Blob([res.data], {
        type: "application/vnd.ms-excel"
      });
      let downloadElement = document.createElement("a");
      let objectURL = window.URL.createObjectURL(blob); // 创建下载链接
      downloadElement.href = objectURL;
      // `projects_template_${new Date().toLocaleDateString()}.xls`; //下载后文件名
      downloadElement.download = `template.xls`; //下载后文件名,手动设置为模板
      document.body.appendChild(downloadElement);
      downloadElement.click(); //点击下载
      document.body.removeChild(downloadElement); //下载完成移除元素
      window.URL.revokeObjectURL(objectURL); //释放掉blob对象
    },

    /**
     * 获取当前页面列表数据集
     * params: 外部传入的对象,通常为[search查询]对象
     */
    async getDataList(params) {
      try {
        /** 列表数据加载效果：开启 */
        this.tableLoading = true;
        let res = await getBlocks(params);
        this.tableData = res; // 无论数据有无，皆赋值给tableData
      } catch (err) {}
      /** 列表数据加载效果：关闭 */
      this.tableLoading = false;
    },

    /**
     * 打开模态框函数，code默认为空,通常[修改|查看]时需要该参数值
     * 该函数打开的表单有多种形式:
     * 新增数据:点击新建时,调用此函数，打开一个空白表单，用户填写；
     * 修改数据:点击某行指定单元格，传入[code单元格明文内容]，打开表单，根据内容请求后台数据，填充于当前表单页，用户修改；
     */
    openModal(code = {}) {
      let newModal = {
        // 调用获取当前对话框title函数 ,加上传入的code，作为打开的模态框的标题
        title: `${this.GLOBAL.getCurrentModalTitle(this.$parent.$parent.$el)} ${
          code.entry === undefined ? "" : code.entry
        }`,
        timestamp: Number(new Date()), // 时间戳，用于区别Madal  精确至毫秒
        show: true, // 默认显示
        levelNumber: this.$store.getters.levelNumberMax, // 层级
        /** 每个窗体初始化的坐标值 */
        position: this.$store.getters.modalPosition,
        // 其它内容，放在这里，比如打开时，带的数据， or 对应 component？
        content: {
          component: FormBlock,
          code: code
        }
      };
      this.$store.dispatch("modal/openModal", newModal);
      this.createTask(newModal); // 调用创建窗体对应任务栏函数
    },

    /** 创建窗体对应任务栏
     * @param modal 传入在该函数之前创建的窗体对象
     * @returns 创建并打开新的窗体与之对应的任务项
     */
    createTask(modal) {
      // 窗体创建完成之后，创建任务栏对应 task，添加到任务栏组
      let newTask = {
        title: modal.title, // 传入的modal的标题
        timestamp: modal.timestamp, // modal的时间戳
        // show: !modal.show // modal显隐 反向
        show: modal.show // modal显隐 通窗体状态。2019.12.26
      };
      this.$store.dispatch("taskbar/addTask", newTask);
    }
  }
};
</script>


<style lang="scss" scoped>
/* 每行操作列的按钮组，此处使用 el-btn-warning 的变更形式 */
.el-button--warning {
  background-color: rgba(0, 0, 0, 0);
  border-color: rgba(0, 0, 0, 0);
  color: #093284;
  border-radius: 50%;
  padding: 0;
  // line-height: 26px;
  // height: 24px;

  // 图标
  i {
    font-weight: 900;
    font-size: 13px;
  }
}

.el-button--warning:hover {
  background-color: rgba(0, 0, 0, 0);
  border-color: rgba(0, 0, 0, 0);
  color: #e9bb1d;
}
</style>
