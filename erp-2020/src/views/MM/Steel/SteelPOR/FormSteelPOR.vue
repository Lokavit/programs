<template>
  <section v-loading="formLoading">
    <div class="form_header_container">
      <span>钢材POR / 表单 {{$route.params.code|FormatFormTitle($route.params.code)}}</span>
      <div class="btn_container">
        <el-button type="primary" @click="onSave" size="mini">
          <i class="kft-icon-create"></i>
          <span>保存</span>
        </el-button>
        <el-button type="primary" @click="onSubmit" size="mini">
          <i class="kft-icon-create"></i>
          <span>确认</span>
        </el-button>
        <el-button type="primary" @click="onInvalid" size="mini">
          <i class="kft-icon-create"></i>
          <span>作废</span>
        </el-button>
      </div>
    </div>

    <!-- 水平分割线 -->
    <div style="display: block;height: 1px; width: 100%;background-color: #dcdfe6;"></div>

    <!-- 主表 -->
    <el-form :model="formData" size="mini" :rules="rules" ref="formData">
      <!-- 主表区域  包裹器 start -->
      <div class="form_container form_container_background">
        <!-- 主表单行多项 第一行 -->
        <div class="form_row">
          <!-- 项目 -->
          <aside>
            <KftLabel label="项目" :isRequired="true"></KftLabel>
            <el-form-item prop="projectEntry">
              <KftChoose code="Project" v-model="formData.projectEntry" show-detail @on-choose-selected="chooseProject" placeholder="请选择项目" size="mini"></KftChoose>
            </el-form-item>
          </aside>
          <!-- 分段 -->
          <aside>
            <KftLabel label="分段" :isRequired="true"></KftLabel>
            <el-form-item prop="itemDescription">
              <KftChoose code="Project" v-model="formData.projectEntry" show-detail @on-choose-selected="chooseProject" placeholder="请选择分段" size="mini"></KftChoose>
            </el-form-item>
          </aside>
          <!-- POR单号 -->
          <aside>
            <KftLabel label="POR单号" :isRequired="true"></KftLabel>
            <el-form-item prop="projectEntry">
              <KftChoose code="Project" v-model="formData.projectEntry" show-detail @on-choose-selected="chooseProject" placeholder="请选择POR单号" size="mini"></KftChoose>
            </el-form-item>
          </aside>
          <!-- 申请人 -->
          <aside>
            <KftLabel label="申请人" :isRequired="true"></KftLabel>
            <KftChoose code="Project" v-model="formData.projectEntry" show-detail @on-choose-selected="chooseProject" placeholder="请选择申请人" size="mini"></KftChoose>
          </aside>
        </div>
        <!-- 主表单行多项 第二行 -->
        <div class="form_row">
          <!-- 申请部门 -->
          <aside>
            <KftLabel label="申请部门"></KftLabel>
            <el-input :disabled="!isDisabled" v-model="formData.itemDescription" placeholder="申请部门" size="mini"></el-input>
          </aside>
          <!--  备注 -->
          <aside style="flex-grow:3">
            <KftLabel label="备注"></KftLabel>
            <el-input v-model="formData.itemDescription" placeholder="请输入备注" size="mini"></el-input>
          </aside>
        </div>
      </div>

      <!-- 按钮组区域 -->
      <div class="btn_container" style="padding: 10px 0;">
        <!-- 唯有在手动新增表单时 显示的按钮 -->
        <template v-if="isNonGuided">
          <el-button type="primary" plain @click="onCreate" size="mini">
            <i class="kft-icon-create"></i>
            <span>批量新增</span>
          </el-button>
          <el-button type="primary" plain @click="onDelete" size="mini">
            <i class="kft-icon-create"></i>
            <span>批量删除</span>
          </el-button>
        </template>
        <el-button type="primary" plain @click="handleDownload" size="mini">
          <i class="kft-icon-download"></i>
          <span>导出</span>
        </el-button>
      </div>

      <!-- 子表 -->
      <el-table :data="formData.lines" :header-cell-style="GLOBAL.FORM_TABLE_HEADER_CELL_STYLE" :cell-style="GLOBAL.FORM_TABLE_CELL_STYLE" :style="[GLOBAL.FORM_TABLE_MARGIN]" :row-style="GLOBAL.FORM_TABLE_ROW_STYLE" :row-class-name="rowClassName" @current-change="handleCurrentRow" @selection-change="handleSelectionChange" :max-height="maxHeight">
        <template v-if="isNonGuided">
          <el-table-column type="selection" width="55"></el-table-column>
        </template>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="MP单号" prop="inventoryUomCode"></el-table-column>
        <el-table-column label="物料编码" prop="itemCode">
          <template v-slot="scope">
            <small>
              <KftChoose code="Material" class="kft-line-choose" size="mini" show-detail show-index show-search v-model="scope.row.itemCode" @on-choose-selected="chooseMaterial($event, scope.$index)" placeholder="请选择物料"></KftChoose>
            </small>
            <span>{{scope.row.itemCode}}</span>
          </template>
        </el-table-column>

        <el-table-column label="物料描述" show-overflow-tooltip prop="itemDescription"></el-table-column>
        <el-table-column label="计量单位" prop="inventoryUomCode" ></el-table-column>
        <el-table-column label="单位重量" prop="inventoryUomName"></el-table-column>
        <el-table-column label="材质代码" show-overflow-tooltip prop="itemDescription"></el-table-column>
        <el-table-column label="规格" show-overflow-tooltip prop="itemDescription"></el-table-column>

        <el-table-column label="申请采购数量" prop="quantity" width="130">
          <template v-slot="scope">
            <small>
              <el-input-number size="mini" v-model="scope.row.quantity" :min="1" :max="scope.row.maxQuantity"></el-input-number>
            </small>
            <span>{{scope.row.quantity}}</span>
          </template>
        </el-table-column>

        <el-table-column label="PND日期" prop="docDueDate" width="180">
          <template v-slot="scope">
            <small>
              <el-date-picker v-model="scope.row.docDueDate" type="datetime" placeholder="请选择PND日期" value-format="yyyy-MM-dd HH:mm:ss" style="width:-webkit-fill-available;" size="mini"></el-date-picker>
            </small>
            <span>{{scope.row.docDueDate}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <!-- 默认显示生成向导 -->
    <template v-if="isShowGuideSteelPOR">
      <GuideSteelPOR :dialogVisible="isShowGuideSteelPOR" @on-comfirm="onComfirmGuide" @on-cancel="onCancelGuide" @on-addInBulk="onAddInBulk"></GuideSteelPOR>
    </template>
    <!-- 默认不显示批量新增 -->
    <template v-if="isShowAddInBulk">
      <CreateSteelPOR :dialogVisible="isShowAddInBulk" @on-comfirm="onComfirmCreate" @on-cancel="onCancelCreate"></CreateSteelPOR>
    </template>
  </section>
</template>

<script>
/** 钢材 POR 生成向导 */
import GuideSteelPOR from "./GuideSteelPOR";
/** 钢材 POR 批量新增 */
import CreateSteelPOR from "./CreateSteelPOR";
export default {
  /** 钢材 POR 表单 */
  name: "FormSteelPOR",
  components: { GuideSteelPOR, CreateSteelPOR },
  data() {
    return {
      /** 是否显示 POR生成向导 默认显示 */
      isShowGuideSteelPOR: true,
      /** 是否为批量新增 默认为非批量新增 */
      isShowAddInBulk: false,
      /** 是否为向导式新增数据 默认是向导 */
      isNonGuided: false,
      /** 窗体内容的 v-loading属性控制值
       * 防止网路环境较差时，窗体内数据返回较慢，窗体空白
       * 防止网路环境较差时，提交事件响应结果及回显较慢，使用者误操作
       */
      formLoading: false,
      /** 主表区域 表单对象 */
      formData: {
        status: "true", // 默认可用
        lines: []
      },
      /** 主表区域 必填字段校验 */
      rules: {
        projectEntry: [
          {
            required: true,
            message: "请选择项目",
            trigger: "blur"
          }
        ],
        itemDescription: [
          {
            required: true,
            message: "请输入分段",
            trigger: "blur"
          }
        ],
        itemGroupCode: [
          {
            required: true,
            message: "请选择POR单号",
            trigger: "blur"
          }
        ]
      },
      /** 主表区域 设置为禁止输入的项 */
      isDisabled: false,
      passValue: "", // 传入本页面后，存住的id，用于请求页面数据
      multipleSelection: [], // 存储多选
      currentRow: [] // [内嵌行]表格的当前选中行
    };
  },
  computed: {
    /** 计算 页面table 高度 用于滚动条 */
    maxHeight() {
      return parseInt(this.GLOBAL.returnTableDataItem().item) * 40;
    }
  },

  mounted() {
    // console.log("获取传入的code:", this.$route.params.code);
    this.passValue = this.$route.params.code;

    /**
     * 如果有由列表页传递过来的值，即判定为修改表单操作
     * 点击单行进入表单页面，于此处请求并渲染数据
     * 注:由于本页面为共用，只有初次请求走这里，之后的请求通过监听路由变化来控制
     */
    if (this.passValue && this.passValue != "create") {
      this.isDisabled = true; // 设置指定项不可输入
      this.getDataInfo(this.passValue); // 根据传递过来的值，请求对于数据，填充表单
    } else if (this.passValue == "create") {
      /** 如果是create，则将表单页各个状态重置 */
      this.inited = true; // formData数据初始化
      console.log("是否为批量新增");
      /** 是否显示 POR生成向导 默认显示 */
      this.isShowGuideSteelPOR = true;
      /** 是否为批量新增 默认为非批量新增 */
      this.isShowAddInBulk = false;
      /** 是否为向导式新增数据 默认是向导 */
      this.isNonGuided = false;
    }
  },
  methods: {
    /** 项目的chooseList 选中 */
    chooseProject(selectedRow) {
      console.log("EVENT:", event);
      this.$set(this.form, "projectEntry", selectedRow.entry);
      this.$set(this.form, "projectName", selectedRow.name);
      this.projectEntry = selectedRow.entry;
      this.$delete(this.form, "workObject");
    },
    /** 按钮：保存
     *  表单提交至草稿
     */
    onSave() {
      console.log("表单保存");
      // 以上业务逻辑处理完毕后，调用mixinMethods中关闭任务项之前的业务逻辑处理函数
      this.beforeCloseTask(this.$route.path);
    },
    /** 按钮：确认
     *  表单提交至生效
     */
    onSubmit() {
      console.log("表单生效");
    },
    /** 按钮：作废
     * 表单发送作废消息给后端，由后端设置该表单作废
     */
    onInvalid() {
      console.log("表单作废");
    },

    /** 按钮：向导对话框中的确定
     * 因该表单默认由向导页开始，所以将下一次更新时数据变化写在该函数中
     */
    onComfirmGuide(args) {
      this.isShowGuideSteelPOR = false;
      console.log("向导完成后，带入到表单子表中的数据:", args);
      this.formData.lines = args;
      /** 下一次更新时，formData数据初始化 */
      this.$nextTick(function() {
        this.inited = true;
      });
    },
    /** 按钮：向导对话框中的取消
     *
     */
    onCancelGuide() {
      console.log("取消");
      this.isShowGuideSteelPOR = false;
    },

    /** 按钮： 直接新增 */
    onAddInBulk(args) {
      console.log("直接新增:", args);
      this.isShowGuideSteelPOR = false;
      /** 使用者选择了[直接新增] 打开[批量新增][批量删除按钮] */
      this.isNonGuided = args;
    },

    /** 按钮：批量新增对话框的确定
     * 将数据带入到本页面(主表页面)
     */
    onComfirmCreate(args) {
      console.log("批量新增 确定:", args);
      this.formData.lines = args;
      this.isShowAddInBulk = false; // 关闭批量新增对话框
    },

    /** 按钮：批量新增
     * 点击打开批量新增对话框，选择数据
     */
    onCreate() {
      console.log("批量新增");
      this.isShowAddInBulk = true;
    },

    /** 按钮：批量新增对话框取消
     *
     */
    onCancelCreate() {
      console.log("批量新增 取消");
      this.isShowAddInBulk = false;
    },

    /** 批量删除 */
    onDelete() {
      // 从tableData中，移除当前存储的多选对象中的所有数据
      // this.multipleSelection 所有待删除
      // this.tableData 完整数据集

      // 从完整数据集中，过滤掉每一个待删除数据，进行逐一删除
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.formData.lines = this.formData.lines.filter(
          item => item.itemCode != this.multipleSelection[i].itemCode
        );
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

    /** checkBox 选择 */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * 选中当前行 参数为 (当前行 ，旧行)
     * 把选中的当前行的数据带出去，用于外部使用
     * 此处根据当前表单单据编号，作为选中行之后的逻辑处理
     * 若有单据号，则当前选中行数据置为[],避免触发选中之后的函数执行
     * 若无单据号，则当前选中行数据，赋值给[currentRow],用于执行选中后的函数操作
     */
    handleCurrentRow(curRow, oldRow) {
      // this.form.docEntry != undefined // 是否有单据号
      //   ? (curRow = []) // 有单据号，当前选中数据清空
      //   : (this.currentRow = curRow); // 没有单据号，当前选中数据，赋值给[currentRow]
      this.currentRow = curRow;
    },
    /**
     * 行 class 函数 参数为 (该行内容 ， 行下标)
     * 该事件 会根据 当前行的变更，自动执行
     * return: 设置当前行的 class ,即为设置当前行的可编辑单元格，是否显示可编辑组件
     */
    rowClassName({ row, rowIndex }) {
      // tableData中[行下标]的数据 == 当前行数据
      return this.formData.lines[rowIndex] == this.currentRow
        ? "edit_table" // 将其设置为 可编辑
        : "show_table"; // 其他的为为不可编辑
    }
  }
};
</script>
