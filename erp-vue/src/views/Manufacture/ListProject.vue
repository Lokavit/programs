<template>
  <section :style="{'width':width}" class="modal_list">
    <!-- 列表页 查询区域 -->
    <el-form :inline="true" :model="search" size="mini" @submit.native.prevent>
      <div class="form_row">
        <!-- 第一列 查询输入框 -->
        <aside>
          <KftLabel :label="labels.keyword.value|FormatLabelSuffix"></KftLabel>
          <el-input v-model="search.keyword" :placeholder="`请输入${labels.keyword.value}`" @keyup.enter.native="onSubmit" clearable @clear="onSubmit" size="mini"></el-input>
        </aside>
        <!-- 第二列 查询按钮 -->
        <aside>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit" size="mini" style="margin-left:40px;">查询</el-button>
        </aside>
        <!-- 空一列 保证宽屏情况下的等分布局 -->
        <aside></aside>
        <!-- 第四列 按钮组  -->
        <aside style="position:relative;">
          <el-button type="info" @click="onCreate" size="mini" style="position:absolute;right:210px">
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

    <el-table v-loading="tableLoading" :data="tableData.content" border highlight-current-row size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" stripe>
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column prop="entry" label="项目编号" align="center">
        <template v-slot="scope">
          <span @click="onCell" class="span-hover">{{scope.row.entry}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="项目名称" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="projectType" label="项目类型" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="shipType" label="船型" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="shipKind" label="船种" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="shipOwner" label="船主" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="complement" label="船员定额" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="deadWeight" label="载重量" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="mainEngine" label="主机" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="endurance" label="续航力" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="serviceSpeed" label="服务航速" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="contractDate" label="合同日期" show-overflow-tooltip align="center"></el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <KftPagination :total="tableData.totalElements" :page-size="tableData.size" :fetch-data="getDataList" style="float:right;margin-top:10px;"></KftPagination>
  </section>
</template>

<script>
import {
  getProjects,
  postProjectImport,
  getProjectDownload
} from "@/api/manufacture";
import FormProject from "./FormProject";
export default {
  // 生产模块 项目登记 列表页
  name: "ListProject",
  components: { FormProject },
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
      tableData: {
        content: [], // 表格数据
        number: 0, // 当前页数
        size: this.GLOBAL.returnTableDataSize(), // 每页条数
        totalElements: 0, // 当前列表数据总条数
        totalPages: 0 // 总页数
      }
    };
  },
  computed: {
    /** 当前窗体宽度值计算 [根据全局设定基数等比缩放] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
    },
    /** 当前表单的所有标注 */
    labels() {
      return this.$store.getters.labels.Project.listLbales;
    }
  },
  watch: {},
  created() {},
  beforeMount() {},
  mounted() {
    this.getDataList(); // 页面渲染完毕时，请求列表数据
  },
  methods: {
    /**
     * 该提交事件含以下作用：
     *    使用者输入内容按下回车键
     *    使用者输入内容按下查询按钮
     *    使用者点击清空输入框内容，即(x)按钮
     *    使用者点击窗体内的刷新按钮
     * 参数为:查询的关键字，或许有多个，所以[search]为object格式
     */
    onSubmit() {
      if (!this.search.keyword) this.getDataList();
      if (this.search.keyword) {
        // 调用 获取数据， 将输入的查询关键字，传入第三个参数
        this.getDataList(
          this.tableData.number,
          this.tableData.size,
          this.search
        );
      }
    },
    /** 新增按钮 事件 */
    onCreate(event) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      this.openModal(); // 点击添加按钮时，调用此处的打开模态框函数
    },
    /** 点击单元格，将获取到的内容，传入到openModal中，同时亦带入详情页面 */
    onCell(event) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      // 调用打开模态框函数，将获取到的单元格数据[itemCode]物料编码传入
      this.openModal(event.target.innerText);
    },

    /** el-upload的自定义上传 */
    async uploadFile(file) {
      const formData = new FormData();
      // 该 xls 即，后台API 所设置的文件承接 。(也就是body时的每个属性)
      formData.append("xls", file.file);
      const res = await postProjectImport(formData);
      if (res.statusOK) {
        this.$message.success("上传成功");
        this.getDataList(); // 请求最新列表数据集
      } else {
        this.$message.warring("上传失败");
      }
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
     * page: 当前页
     * size: 每页数据集条数
     * search: 于查询区域各个属性的值(单项or多项)
     */
    async getDataList(page, size, search = {}) {
      let params = {
        page: page > 0 ? page - 1 : 0,
        size: this.tableData.size,
        ...search
      };
      try {
        /** 列表数据加载效果：开启 */
        this.tableLoading = true;
        let res = await getProjects(params);
        this.tableData = res;
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
    openModal(code = "") {
      let newModal = {
        // 调用获取当前对话框title函数 ,加上传入的code，作为打开的模态框的标题
        title: `${this.GLOBAL.getCurrentModalTitle(
          this.$parent.$parent.$el
        )} ${code}`,
        timestamp: Number(new Date()), // 时间戳，用于区别Madal  精确至毫秒
        show: true, // 默认显示
        levelNumber: this.$store.getters.levelNumberMax, // 层级
        /** 每个窗体初始化的坐标值 */
        position: this.$store.getters.modalPosition,
        // 其它内容，放在这里，比如打开时，带的数据， or 对应 component？
        content: {
          component: FormProject,
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