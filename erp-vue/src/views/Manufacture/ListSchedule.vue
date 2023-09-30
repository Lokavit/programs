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
          <el-upload action :http-request="uploadFile" accept="*/*" :show-file-list="false" style="position:absolute;right:70px">
            <el-button type="info" size="mini">
              <i class="kft-icon-upload"></i>
              <span>上传</span>
            </el-button>
          </el-upload>

          <el-button type="info" @click="handleDownload" size="mini" style="position:absolute;right:0px">
            <i class="kft-icon-download"></i>
            <span>下载</span>
          </el-button>
        </aside>
      </div>
    </el-form>

    <!-- 列表区域 -->
    <el-table :data="tableData" border highlight-current-row size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" :max-height="maxHeight" :row-style="rowStyle" :row-class-name="rowClassName" @current-change="handleCurrentRow" stripe>
      <el-table-column type="index" align="center"></el-table-column>
      <el-table-column prop="entry" label="项目编码" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="workplace" label="修建地点" show-overflow-tooltip align="center" width="80">
        <template v-slot="scope">
          <small>
            <el-input size="mini" v-model="scope.row.workplace"></el-input>
          </small>
          <span>{{scope.row.workplace}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="contractSC" label="合同S/C" show-overflow-tooltip align="center">
        <template v-slot="scope">
          <small>
            <el-input size="mini" v-model="scope.row.contractSC"></el-input>
          </small>
          <span>{{scope.row.contractSC}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="contractKL" label="合同K/L" show-overflow-tooltip align="center">
        <template v-slot="scope">
          <small>
            <el-input size="mini" v-model="scope.row.contractKL"></el-input>
          </small>
          <span>{{scope.row.contractKL}}</span>
        </template>
      </el-table-column>-->
      <el-table-column prop="sc" label="钢板切割" show-overflow-tooltip align="center" width="100">
        <template v-slot="scope">
          <small>
            <el-date-picker v-model="scope.row.sc" type="date" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
          </small>
          <span>{{scope.row.sc}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="kl" label="铺龙骨" show-overflow-tooltip align="center" width="100">
        <template v-slot="scope">
          <small>
            <el-date-picker v-model="scope.row.kl" type="date" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
          </small>
          <span>{{scope.row.kl}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fl" label="浮起" show-overflow-tooltip align="center" width="100">
        <template v-slot="scope">
          <small>
            <el-date-picker v-model="scope.row.fl" type="date" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
          </small>
          <span>{{scope.row.fl}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fs" label="最终照光" show-overflow-tooltip align="center" width="100">
        <template v-slot="scope">
          <small>
            <el-date-picker v-model="scope.row.fs" type="date" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
          </small>
          <span>{{scope.row.fs}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dh" label="上建" show-overflow-tooltip align="center" width="100">
        <template v-slot="scope">
          <small>
            <el-date-picker v-model="scope.row.dh" type="date" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
          </small>
          <span>{{scope.row.dh}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sp" label="岸电" show-overflow-tooltip align="center" width="100">
        <template v-slot="scope">
          <small>
            <el-date-picker v-model="scope.row.sp" type="date" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
          </small>
          <span>{{scope.row.sp}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="lc" label="下水" show-overflow-tooltip align="center" width="100">
        <template v-slot="scope">
          <small>
            <el-date-picker v-model="scope.row.lc" type="date" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
          </small>
          <span>{{scope.row.lc}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dg" label="发动机启动" show-overflow-tooltip align="center" width="100">
        <template v-slot="scope">
          <small>
            <el-date-picker v-model="scope.row.dg" type="date" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
          </small>
          <span>{{scope.row.dg}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="bf" label="锅炉启动" show-overflow-tooltip align="center" width="100">
        <template v-slot="scope">
          <small>
            <el-date-picker v-model="scope.row.bf" type="date" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
          </small>
          <span>{{scope.row.bf}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hc" label="舱盖" show-overflow-tooltip align="center" width="100">
        <template v-slot="scope">
          <small>
            <el-date-picker v-model="scope.row.hc" type="date" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
          </small>
          <span>{{scope.row.hc}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="mt" label="主机动车" show-overflow-tooltip align="center" width="100">
        <template v-slot="scope">
          <small>
            <el-date-picker v-model="scope.row.mt" type="date" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
          </small>
          <span>{{scope.row.mt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ie" label="倾斜实验/空船" show-overflow-tooltip align="center" width="100">
        <template v-slot="scope">
          <small>
            <el-date-picker v-model="scope.row.ie" type="date" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
          </small>
          <span>{{scope.row.ie}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="st" label="试航" show-overflow-tooltip align="center" width="100">
        <template v-slot="scope">
          <small>
            <el-date-picker v-model="scope.row.st" type="date" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
          </small>
          <span>{{scope.row.st}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="dl" label="交船" show-overflow-tooltip align="center" width="100">
        <template v-slot="scope">
          <small>
            <el-date-picker v-model="scope.row.dl" type="date" value-format="yyyy-MM-dd" size="mini"></el-date-picker>
          </small>
          <span>{{scope.row.dl}}</span>
        </template>
      </el-table-column>

      <template v-if="isOperate">
        <el-table-column label="操作" width="50">
          <template v-slot="scope">
            <el-button type="warning" size="mini" circle style="padding:0;margin-left:8px">
              <i class="kft-icon-edit"></i>
            </el-button>

            <el-button type="success" size="mini" icon="el-icon-circle-check" circle style="padding:0;margin-left:8px" @click.stop="onSave(scope.row)"></el-button>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </section>
</template>

<script>
import {
  getScheduleMaster,
  putScheduleMaster,
  getProjectDownload
} from "../../api/manufacture";
export default {
  /** 生产计划 项目大日程  */
  name: "ListSchedule",
  data() {
    return {
      /** 列表中的表头样式 */
      headerCellStyle: this.GLOBAL.FORM_TABLE_HEADER_CELL_STYLE,
      /** 列表中的单元格样式 [非表头部分] */
      cellStyle: this.GLOBAL.FORM_TABLE_CELL_STYLE,
      /** 列表中的内容行 样式 */
      rowStyle: this.GLOBAL.FORM_TABLE_ROW_STYLE,
      /** 防止网路环境较差时，列表数据请求返回较慢，局部假死 */
      tableLoading: false,
      /** 标注组 之后会从后台获取所有标注 */
      labels: {
        keyword: { default: "关键词", custom: "", value: "关键词" }
      },
      /** 查询的from */
      search: {},
      tableData: [], // 表格内的数据
      currentRow: [], // [单据行]表格的当前选中行
      /** 该变量有以下作用：
       * [正值]是否显示操作列:没有单据号时，显示操作列;反之则不显示操作列。
       * [反值]表单的输入框是否可输入，新增时可输入，一旦提交，则将设置该属性的项锁住[不可输入]
       */
      isOperate: true,
      form: {} // 存储单行数据
    };
  },
  computed: {
    /** 当前窗体宽度值计算 [根据全局设定基数等比缩放] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
    },

    /** 计算table 高度 */
    maxHeight() {
      // /**
      //  * 当前数据总条数是否小于全局函数返回的每页数据条数，
      //  * 如果小于，则高度为(当前数据总条数+1)*40[每条高度]
      //  * 否则，返回(全局函数返回的每页数据条数+1)*40[每条高度]
      //  */
      // return this.tableData.length <= this.GLOBAL.returnTableDataSize()
      //   ? (this.tableData.length + 1) * 40
      //   : this.GLOBAL.returnTableDataSize() * 40;

      return 560;
    }
  },
  watch: {
    // tableData: {
    //   immediate: true,
    //   handler(val) {
    //     // // 如果没有单据号，则表示这是个新建单据，且没有提交过
    //     // if (!this.form.projectEntry) {
    //     //   // this.pushEmptyData(); // 自动加空行
    //     // }
    //   }
    // }
  },
  created() {},
  beforeMount() {},
  mounted() {
    // console.log("模拟数据:", scheduleData);
    // this.tableData = scheduleData; // 模拟数据赋值给当前列表
    // console.log("赋值数据:", this.tableData);
    this.getDataList(); // 页面渲染完毕时，请求列表数据
  },
  methods: {
    /**
     * 该提交事件含以下作用：
     *    使用者输入内容按下回车键
     *    使用者输入内容按下查询按钮
     *    使用者点击清空输入框内容，即(x)按钮
     * 参数为:查询的关键字，或许有多个，所以[search]为object格式
     *
     * 该查询函数，改为前端自处理的伪查询
     */
    onSubmit() {
      // 获取 search 对象
      console.log("查询条件对象:", this.search);
      if (!this.search.keyword) this.getDataList();
      if (this.search.keyword) {
        this.getDataList(this.search);
      }
    },

    // 单条数据修改后的提交事件
    onSave() {
      console.log("拿到当前待保存数据:", this.currentRow);
      this.form = this.currentRow;
      console.log("单条数据保存,FORM:", this.form);
      this.putData();

      /* 单条数据保存的思路：
        当使用者点击保存时, 可以根据选中行函数，拿到当前待保存行的数据，将其赋值给 this.form
        而后，调用更新API，将数据提交至后台。
        注：是否顺便调用请求列表数据函数? 若请求则可获取最新数据，且操作列状态自动归为初始状态
      */
    },

    /** el-upload的自定义上传 */
    async uploadFile(file) {
      const formData = new FormData();
      // 该 xls 即，后台API 所设置的文件承接 。(也就是body时的每个属性)
      formData.append("xls", file.file);
      const res = await postProjectImport(formData);
      if (res.statusOK) {
        this.$message.success("上传成功");
        this.fetchData(); // 调用 请求数据集函数
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
     * 选中当前行 参数为 (当前行 ，旧行)
     * 把选中的当前行的数据带出去，用于外部使用
     * 当前选中行数据，赋值给[currentRow],用于执行选中后的函数操作
     */
    handleCurrentRow(curRow, oldRow) {
      this.currentRow = curRow; // 当前选中数据，赋值给[currentRow]
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

    // 请求项目大日程数据
    async getDataList(search = {}) {
      try {
        /** 列表数据加载效果：开启 */
        this.tableLoading = true;
        const res = await getScheduleMaster(search);
        this.tableData = res;
      } catch (err) {}
      /** 列表数据加载效果：关闭 */
      this.tableLoading = false;
    },

    // 修改项目大日程数据
    async putData() {
      try {
        /** 列表数据加载效果：开启 */
        this.tableLoading = true;
        const res = await putScheduleMaster(this.form);
        this.form = res;
        this.$message.success("修改成功");
      } catch (error) {}
      /** 列表数据加载效果：关闭 */
      this.tableLoading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
/* 查询条 第四列从右起排列按钮组，此处使用 el-btn-warning 的变更形式 */
.el-button--warning {
  background-color: rgba(0, 0, 0, 0);
  border-color: rgba(0, 0, 0, 0);
  color: #093284;
  border-radius: 50%;
  padding: 0;
  line-height: 28px;
  height: 26px;

  // 图标
  i {
    font-weight: 900;
    font-size: 11px;
  }
}

.el-button--warning:hover {
  background-color: rgba(0, 0, 0, 0);
  border-color: rgba(0, 0, 0, 0);
  color: #e9bb1d;
}
</style>