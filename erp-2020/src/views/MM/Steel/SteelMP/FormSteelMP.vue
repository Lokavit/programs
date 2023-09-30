<template>
  <section v-loading="formLoading">
    <div class="form_header_container">
      <span>物资供应计划 / 表单 {{$route.params.code|FormatFormTitle($route.params.code)}}</span>
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
          <!-- BOM名称 -->
          <aside>
            <KftLabel label="BOM名称" :isRequired="true"></KftLabel>
            <el-form-item prop="itemGroupCode">
              <KftChoose code="MaterialGroup" v-model="formData.itemGroupCode" show-detail @on-choose-selected="chooseMaterialGroup" placeholder="请输入BOM名称"></KftChoose>
            </el-form-item>
          </aside>
          <!-- MP单号 -->
          <aside>
            <KftLabel label="MP单号" :isRequired="true"></KftLabel>
            <el-form-item prop="itemGroupName">
              <el-input v-model="formData.itemGroupName" placeholder="请输入MP单号" :disabled="true" size="mini"></el-input>
            </el-form-item>
          </aside>
        </div>
        <!-- 主表单行多项 第二行 -->
        <div class="form_row">
          <!-- 物料规格 -->
          <aside>
            <KftLabel label="船级"></KftLabel>
            <el-input v-model="formData.itemDescription" placeholder="请输入船级" size="mini"></el-input>
          </aside>

          <!-- 预定发行日期 -->
          <aside>
            <KftLabel label="预定发行日期" :isRequired="true"></KftLabel>
            <el-form-item>
              <el-date-picker v-model="formData.validityDate" type="datetime" placeholder="请选择预定发行日期" value-format="yyyy-MM-dd HH:mm:ss" style="width:-webkit-fill-available;"></el-date-picker>
            </el-form-item>
          </aside>

          <!-- 负责员工 -->
          <aside>
            <KftLabel label="负责员工" :isRequired="true"></KftLabel>
            <KftChoose code="Warehouse" v-model="formData.defaultWhsCode" show-detail @on-choose-selected="chooseWarehouse" placeholder="请选择负责员工" size="mini"></KftChoose>
          </aside>
          <!-- 负责部门 -->
          <aside>
            <KftLabel label="负责部门"></KftLabel>
            <el-input :disabled="!isDisabled" v-model="formData.itemDescription" placeholder="负责部门" size="mini"></el-input>
          </aside>
        </div>
      </div>
    </el-form>
    <!-- 按钮组区域 -->
    <div class="btn_container" style="padding: 10px 0;">
      <el-button type="primary" plain @click="onCreate" size="mini">
        <i class="kft-icon-create"></i>
        <span>批量新增</span>
      </el-button>
      <el-button type="primary" plain @click="onDelete" size="mini">
        <i class="kft-icon-create"></i>
        <span>批量删除</span>
      </el-button>
      <a href="javascript:;" class="file el-button el-button--primary el-button--mini is-plain">
        <i class="kft-icon-upload"></i>
        <span>导入</span>
        <input type="file" accept=".xls, .xlsx" @change="importExcel($event)" />
      </a>
      <el-button type="primary" plain @click="handleDownload" size="mini">
        <i class="kft-icon-download"></i>
        <span>导出</span>
      </el-button>
    </div>

    <!-- 子表 -->
    <el-table :data="tableData" :header-cell-style="GLOBAL.FORM_TABLE_HEADER_CELL_STYLE" :cell-style="GLOBAL.FORM_TABLE_CELL_STYLE" :style="[GLOBAL.FORM_TABLE_MARGIN]" :row-style="GLOBAL.FORM_TABLE_ROW_STYLE" :row-class-name="rowClassName" @current-change="handleCurrentRow" @selection-change="handleSelectionChange" :max-height="maxHeight">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="物料编码" prop="itemCode">
        <template v-slot="scope">
          <small>
            <KftChoose code="Material" class="kft-line-choose" size="mini" show-detail show-index show-search v-model="scope.row.itemCode" @on-choose-selected="chooseMaterial($event, scope.$index)" placeholder="请选择物料"></KftChoose>
          </small>
          <span>{{scope.row.itemCode}}</span>
        </template>
      </el-table-column>

      <el-table-column label="物料描述" show-overflow-tooltip prop="itemDescription"></el-table-column>
      <el-table-column label="计量单位" prop="inventoryUomCode"></el-table-column>
      <el-table-column label="单位重量" prop="inventoryUomName"></el-table-column>
      <el-table-column label="材质代码" show-overflow-tooltip prop="itemDescription"></el-table-column>
      <el-table-column label="规格" show-overflow-tooltip prop="itemDescription"></el-table-column>

      <el-table-column label="需求数量" prop="quantity">
        <template v-slot="scope">
          <small>
            <el-input-number size="mini" v-model="scope.row.quantity" :min="1" :max="scope.row.maxQuantity"></el-input-number>
          </small>
          <span>{{scope.row.quantity}}</span>
        </template>
      </el-table-column>

      <el-table-column label="可用库存" prop="defaultWhsCode"></el-table-column>

      <el-table-column label="预约数量" prop="quantity">
        <template v-slot="scope">
          <small>
            <el-input-number size="mini" v-model="scope.row.q" :min="1" :max="scope.row.maxQuantity"></el-input-number>
          </small>
          <span>{{scope.row.q}}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column label="状态" prop="status">
      <template v-slot="scope">-->
      <!-- 通过status值，格式化明文并且为不同状态设置不同文字颜色 -->
      <!-- <span :style="{'color':scope.row.status=='true'?'green':'blue'}">{{scope.row.status=='true'?'已清':'未清'}}</span>
        </template>
      </el-table-column>-->
    </el-table>

    <!-- 表单 批量新增对话框 套一个v-if,保证该组件每次重新渲染。 -->
    <template v-if="isShowCreateSteelMP">
      <CreateSteelMP :dialogVisible="isShowCreateSteelMP" @on-comfirm="onComfirm" @on-cancel="onCancel"></CreateSteelMP>
    </template>
  </section>
</template>

<script>
import { getMaterialInfo } from "@/api/stock";
import CreateSteelMP from "./CreateSteelMP";
export default {
  /** 钢材 MP 物资供应计划 表单页 */
  name: "FormSteelMP",
  components: { CreateSteelMP },
  data() {
    return {
      /** 是否显示创建钢材物资供应计划 默认不显示 */
      isShowCreateSteelMP: false,
      /** 窗体内容的 v-loading属性控制值
       * 防止网路环境较差时，窗体内数据返回较慢，窗体空白
       * 防止网路环境较差时，提交事件响应结果及回显较慢，使用者误操作
       */
      formLoading: false,
      /** 主表区域 表单对象 */
      formData: {},
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
            message: "请输入物料描述",
            trigger: "blur"
          }
        ],
        itemGroupCode: [
          {
            required: true,
            message: "请选择物料组",
            trigger: "blur"
          }
        ]
      },
      /** 主表区域 设置为禁止输入的项 */
      isDisabled: false,
      passValue: "", // 传入本页面后，存住的id，用于请求页面数据
      tableData: [],
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

    /** 按钮：批量新增
     * 点击打开批量新增对话框，选择数据
     */
    onCreate() {
      console.log("批量新增");
      this.isShowCreateSteelMP = true;
    },
    /** 按钮：对话框中的确定
     *
     */
    onComfirm(args) {
      this.isShowCreateSteelMP = false;
      this.tableData = args;
    },
    /** 按钮：对话框中的取消
     *
     */
    onCancel() {
      console.log("取消");
      this.isShowCreateSteelMP = false;
    },
    /** 批量删除 */
    onDelete() {
      // 从tableData中，移除当前存储的多选对象中的所有数据
      // this.multipleSelection 所有待删除
      // this.tableData 完整数据集

      // 从完整数据集中，过滤掉每一个待删除数据，进行逐一删除
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.tableData = this.tableData.filter(
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
      console.log("多选", this.multipleSelection);
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
      return this.tableData[rowIndex] == this.currentRow
        ? "edit_table" // 将其设置为 可编辑
        : "show_table"; // 其他的为为不可编辑
    },

    /** 点击导入 or 上传 等
     * <input accept=".xls, .xlsx" />
     * accept:文件类型
     */
    async importExcel(event) {
      // event.target.files为使用者多选文件的文件对象合集
      // console.log("EVENT:", event);
      let excelFile = event.target.files[0]; // 拿到File对象
      // 如果有文件，调用解析Excel单表数据至页面Table中函数
      if (excelFile) {
        // 调用 解析excel数据
        this.excelData = await this.GLOBAL.parseExcelData(excelFile);

        // 解析完成之后，
        console.log("TABLEDATA:", this.excelData[0]);

        for (let i = 0; i < this.excelData.length; i++) {
          if (i > 0) {
            // 从第二行开始
            let tempData = {}; // 用于存储每个对象
            try {
              tempData = await getMaterialInfo(this.excelData[i][0]);
              this.$set(tempData, "quantity", this.excelData[i][1]);
            } catch {
              console.warn("请求遇到错误");
            }
            // 如果待push数据中有itemCode
            if (tempData.itemCode) {
              // 将每个临时对象添加到 tableData数据中
              this.tableData.push(tempData);
            }
          }
        }
      }
    },
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
    /** 物料组的chooseList 选中 */
    chooseMaterialGroup(selectedRow) {
      this.$set(this.formData, "itemGroupCode", selectedRow.itemGroupCode);
      this.$set(this.formData, "itemGroupName", selectedRow.itemGroupName);
    },
    /** 仓库的chooseList 选中 */
    chooseWarehouse(selectedRow) {
      this.$set(this.formData, "defaultWhsCode", selectedRow.whsCode);
      this.$set(this.formData, "defaultWhsName", selectedRow.whsName);
    }
  }
};
</script>