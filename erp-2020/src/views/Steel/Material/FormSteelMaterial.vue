<template>
  <section v-loading="formLoading">
    <div style="font-size:16px;line-height:1.5;padding:6px 0;">主数据 / 表单 {{$route.params.code|FormatFormTitle($route.params.code)}}</div>
    <!-- 水平分割线 -->
    <hr style="margin:11px 0 0 0;background-color:#cbcbcb;border:none;height:1px" />
    <el-form :model="formData" size="mini" :rules="rules" ref="formData">
      <!-- 主表区域  包裹器 start -->
      <div class="form_container">
        <!-- 主表单行多项 第一行 -->
        <div class="form_row">
          <!-- 物料编码 -->
          <aside>
            <KftLabel :label="labels.itemCode.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="itemCode">
              <el-input v-model="formData.itemCode" :placeholder="`请输入${labels.itemCode.value}`" clearable :disabled="isDisabled"></el-input>
            </el-form-item>
          </aside>
          <!-- 物料描述 -->
          <aside>
            <KftLabel :label="labels.itemDescription.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="itemDescription">
              <el-input v-model="formData.itemDescription" :placeholder="`请输入${labels.itemDescription.value}`"></el-input>
            </el-form-item>
          </aside>
          <!-- 外文描述 -->
          <aside>
            <KftLabel :label="labels.foreignDescription.value|FormatLabelSuffix"></KftLabel>
            <el-form-item>
              <el-input v-model="formData.foreignDescription" :placeholder="`请输入${labels.foreignDescription.value}`"></el-input>
            </el-form-item>
          </aside>
          <!-- 物料管理方式 -->
          <aside>
            <KftLabel :label="labels.managementType.value|FormatLabelSuffix"></KftLabel>
            <el-select v-model="formData.managementType" :placeholder="`请输入${labels.managementType.value}`" @change="changeManagementType" size="mini" style="width: -webkit-fill-available;">
              <el-option v-for="item in managementTypeOptions" :key="item" :label="item|FormatManagementType" :value="item"></el-option>
            </el-select>
          </aside>
        </div>
        <!-- 主表单行多项 第二行 -->
        <div class="form_row">
          <!-- 物料组编码 -->
          <aside>
            <KftLabel :label="labels.itemGroupCode.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
            <el-form-item prop="itemGroupCode">
              <KftChoose code="MaterialGroup" v-model="formData.itemGroupCode" show-detail @on-choose-selected="chooseMaterialGroup" :placeholder="`请选择${labels.itemGroupCode.value}`"></KftChoose>
            </el-form-item>
          </aside>
          <!-- 物料组名称 -->
          <aside>
            <KftLabel :label="labels.itemGroupName.value|FormatLabelSuffix"></KftLabel>
            <el-input v-model="formData.itemGroupName" :placeholder="`${labels.itemGroupName.value}`" :disabled="true" size="mini"></el-input>
          </aside>
          <!-- 仓库编码 -->
          <aside>
            <KftLabel :label="labels.defaultWhsCode.value|FormatLabelSuffix"></KftLabel>
            <el-form-item prop="defaultWhsCode">
              <KftChoose code="Warehouse" v-model="formData.defaultWhsCode" show-detail @on-choose-selected="chooseWarehouse" :placeholder="`请选择${labels.defaultWhsCode.value}`" size="mini"></KftChoose>
            </el-form-item>
          </aside>
          <!-- 仓库名称 -->
          <aside>
            <KftLabel :label="labels.defaultWhsName.value|FormatLabelSuffix"></KftLabel>
            <el-input v-model="formData.defaultWhsName" :placeholder="`${labels.defaultWhsName.value}`" :disabled="true" size="mini"></el-input>
          </aside>
        </div>
        <!-- 主表单行多项 第三行 -->
        <div class="form_row">
          <!-- 供应商编码 -->
          <aside>
            <KftLabel :label="labels.preferredVendorCode.value|FormatLabelSuffix"></KftLabel>
            <el-form-item prop="preferredVendorCode">
              <KftChoose code="Vendor" v-model="formData.preferredVendorCode" show-detail @on-choose-selected="chooseVendor" :placeholder="`请选择${labels.preferredVendorCode.value}`" size="mini"></KftChoose>
            </el-form-item>
          </aside>
          <!-- 供应商名称 -->
          <aside>
            <KftLabel :label="labels.preferredVendorName.value|FormatLabelSuffix"></KftLabel>
            <el-input v-model="formData.preferredVendorName" :placeholder="`${labels.preferredVendorName.value}`" :disabled="true" size="mini"></el-input>
          </aside>
          <!-- 计量单位编码 -->
          <aside>
            <KftLabel :label="labels.inventoryUomCode.value|FormatLabelSuffix"></KftLabel>
            <el-form-item prop="inventoryUomCode">
              <KftChoose code="Uom" v-model="formData.inventoryUomCode" show-detail @on-choose-selected="chooseUom" :placeholder="`请选择${labels.inventoryUomCode.value}`" size="mini"></KftChoose>
            </el-form-item>
          </aside>

          <!-- 计量单位名称 -->
          <aside>
            <KftLabel :label="labels.inventoryUomName.value|FormatLabelSuffix"></KftLabel>
            <el-form-item prop="inventoryUomName">
              <el-input v-model="formData.inventoryUomName" :placeholder="`${labels.inventoryUomName.value}`" :disabled="true" size="mini"></el-input>
            </el-form-item>
          </aside>
        </div>
        <!-- 主表单行多项 第四行 -->
        <div class="form_row">
          <!-- 库存阈值 -->
          <aside>
            <KftLabel :label="labels.intervalLevel.value|FormatLabelSuffix"></KftLabel>
            <el-input v-model="formData.minLevel" :placeholder="`0`" size="mini" style="width:50%;"></el-input>
            <span style="display:inline;margin:0 10px;line-height:28px;">~</span>
            <el-input v-model="formData.maxLevel" :placeholder="`9999`" size="mini" style="width:50%;"></el-input>
          </aside>
          <!-- enabled 是否启用 -->
          <aside>
            <KftLabel :label="labels.enabled.value|FormatLabelSuffix"></KftLabel>
            <el-radio-group v-model="formData.enabled" @change="changeEnabled">
              <el-radio label="true">
                <span style="font-size:12px">是</span>
              </el-radio>
              <el-radio label="false">
                <span style="font-size:12px">否</span>
              </el-radio>
            </el-radio-group>
          </aside>
          <!-- 开始有效日期 -->
          <aside>
            <KftLabel :label="labels.validityDate.value|FormatLabelSuffix"></KftLabel>
            <el-form-item>
              <el-date-picker v-model="formData.validityDate" type="datetime" :placeholder="`${labels.validityDate.value}`" value-format="yyyy-MM-dd HH:mm:ss" style="width:-webkit-fill-available;"></el-date-picker>
            </el-form-item>
          </aside>
          <!-- 结束有效日期 -->
          <aside>
            <KftLabel :label="labels.expiryDate.value|FormatLabelSuffix"></KftLabel>
            <el-form-item>
              <el-date-picker v-model="formData.expiryDate" type="datetime" :placeholder="`${labels.expiryDate.value}`" value-format="yyyy-MM-dd HH:mm:ss" style="width:-webkit-fill-available;"></el-date-picker>
            </el-form-item>
          </aside>
        </div>
        <!-- 主表单行多项 第五行 remarks 备注 -->
        <div class="form_row" style="padding-bottom:14px;">
          <aside>
            <KftLabel :label="labels.remarks.value|FormatLabelSuffix"></KftLabel>
            <el-input v-model="formData.remarks" :placeholder="`请输入${labels.remarks.value}`" size="mini"></el-input>
          </aside>
        </div>
      </div>
      <!-- 主表区域  包裹器 end -->

      <!-- 内嵌列表区域 -->
      <el-table v-loading="tableLoading" :data="tableData" border highlight-current-row @current-change="handleCurrentRow" size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" :style="[styleObject]">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="whsCode" label="仓库编码"></el-table-column>
        <el-table-column prop="whsName" label="仓库名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="onHand" label="存货量"></el-table-column>
        <el-table-column prop="isCommited" label="已承诺"></el-table-column>
        <el-table-column prop="onOrder" label="已订购"></el-table-column>
      </el-table>

      <!-- 提交 / 重置 表单 -->
      <div style="text-align:center">
        <el-button type="primary" size="mini" @click="onSaved()">保存</el-button>
        <el-button type="primary" size="mini" @click="onConfirm()">确认</el-button>
        <el-button size="mini" @click="onModify()">变更</el-button>
      </div>
    </el-form>
  </section>
</template>

<script>
import {
  getMaterialInfo,
  getMTOptions,
  getReportMaterial,
  postMaterial,
  putMaterial
} from "@/api/stock";
export default {
  // 库存模块 物料主数据 表单页
  name: "FormSteelMaterial",
  data() {
    return {
      /** 列表区域的外边距，达到距离搜索区域及分页区域之间的间隙 */
      styleObject: this.GLOBAL.FORM_TABLE_MARGIN,
      /** 列表中的表头样式 */
      headerCellStyle: this.GLOBAL.FORM_TABLE_HEADER_CELL_STYLE,
      /** 列表中的单元格样式 [非表头部分] */
      cellStyle: this.GLOBAL.FORM_TABLE_CELL_STYLE,
      /** 窗体内容的 v-loading属性控制值
       * 防止网路环境较差时，窗体内数据返回较慢，窗体空白
       * 防止网路环境较差时，提交事件响应结果及回显较慢，使用者误操作
       */
      formLoading: false,
      /** 防止网路环境较差时，内嵌行数据请求返回较慢，局部假死 */
      tableLoading: false,
      /** 主表区域 表单对象 */
      formData: {
        enabled: "true" // 默认可用
      },
      // /** 表单数据是否初始化过 */
      // inited: false,

      /** 主表区域 必填字段校验 */
      rules: {
        itemCode: [
          {
            required: true,
            message: "请输入物料编码",
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
      /** 主表区域 物料管理方式下拉选项 */
      managementTypeOptions: [],
      /** 主表 内嵌表格数据 */
      tableData: [],
      /** 主表 内嵌表格 当前选中行 */
      currentRow: null,
      passValue: "" // 传入本页面后，存住的id，用于请求页面数据
    };
  },
  computed: {},

  watch: {
    /** 监听 formData 变化 已在 全局 mixinsWatch中处理 */
  },

  created() {},
  mounted() {
    // console.log("获取传入的code:", this.$route.params.code);
    this.passValue = this.$route.params.code;
    /** 获取物料管理方式选项组数据集  */
    this.getManagementTypeOption();

    /**
     * 如果有由列表页传递过来的值，即判定为修改表单操作
     * 点击单行进入表单页面，于此处请求并渲染数据
     * 注:由于本页面为共用，只有初次请求走这里，之后的请求通过监听路由变化来控制
     */
    if (this.passValue && this.passValue != "create") {
      this.isDisabled = true; // 设置指定项不可输入
      this.getDataInfo(this.passValue); // 根据传递过来的值，请求对于数据，填充表单
    }
  },

  methods: {
    /** 物料组的chooseList 选中 */
    chooseMaterialGroup(selectedRow) {
      this.$set(this.formData, "itemGroupCode", selectedRow.itemGroupCode);
      this.$set(this.formData, "itemGroupName", selectedRow.itemGroupName);
    },
    /** 仓库的chooseList 选中 */
    chooseWarehouse(selectedRow) {
      this.$set(this.formData, "defaultWhsCode", selectedRow.whsCode);
      this.$set(this.formData, "defaultWhsName", selectedRow.whsName);
    },
    /** 供应商chooseList 选中 */
    chooseVendor(selectedRow) {
      this.$set(this.formData, "preferredVendorCode", selectedRow.code);
      this.$set(this.formData, "preferredVendorName", selectedRow.name);
    },
    /** 计量单位 chooseList 选中 */
    chooseUom(selectedRow) {
      this.$set(this.formData, "inventoryUomCode", selectedRow.uomCode);
      this.$set(this.formData, "inventoryUomName", selectedRow.uomName);
    },

    /** 物料管理方式 下拉选项的当前选中项 */
    changeManagementType(val) {},
    /** 是否启用 下拉选项的当前选中项 */
    changeEnabled(val) {},

    /** 当前选中行 (当前选中行，上次选中行) */
    handleCurrentRow(curRow, oldRow) {
      this.currentRow = curRow;
    },

    /** [提交] 事件 */
    onSubmit() {
      this.$refs.formData.validate(valid => {
        if (valid) {
          // 检测库存阈值中的两个值是否为数字，并提示使用者
          if (
            !Number.isInteger(parseInt(this.formData.minLevel)) ||
            !Number.isInteger(parseInt(this.formData.maxLevel))
          ) {
            this.$message.warning("库存阈值必须为数字");
            return;
          }
          // 检测库存阈值中的最小库存值是否 >= 最大库存值
          if (
            parseInt(this.formData.minLevel) >= parseInt(this.formData.maxLevel)
          ) {
            this.$message.warning("最小库存值必须小于最大库存值");
            return;
          }
          /** 窗体内容加载效果：开启 */
          this.formLoading = true;
          /** 用 [version] 版本号来判定，执行新增数据函数 or 修改数据函数 */
          this.formData.version === undefined
            ? this.postData()
            : this.putData();
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
      // this.$parent.$options.parent.handleClose();
      console.warn("点击表单取消按钮，做何操作。");
    },

    /** 获取[物料管理方式]下拉选项 */
    async getManagementTypeOption() {
      try {
        const res = await getMTOptions();
        this.managementTypeOptions = res;
        this.formData.managementType = this.managementTypeOptions[0];
      } catch (error) {}
    },

    /** 根据传入值请求对应仓库物料报表
     * code: this.formData.itemCode [当前窗体的物料编码一项]
     */
    async getReport(code) {
      let query = { itemCode: code };
      try {
        /** 内嵌表格加载效果：开启 */
        this.tableLoading = true;
        const res = await getReportMaterial(query);
        this.tableData = res;
      } catch (error) {}
      /** 内嵌表格加载效果：关闭 */
      this.tableLoading = false;
    },

    /** 根据列表页传递过来的值，请求对应完整信息 */
    async getDataInfo(code) {
      try {
        /** 窗体内容加载效果：开启 */
        this.formLoading = true;
        const res = await getMaterialInfo(code);
        this.formData = res;
        // 如果没有输入备注，则使用""或者字符来替换掉占位符提示明文
        this.formData.remarks =
          this.formData.remarks == null ? "无" : this.formData.remarks;
        this.getReport(this.formData.itemCode); // 以上请求完之后，请求仓库物料报表数据
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /** 新增数据 */
    async postData() {
      try {
        const res = await postMaterial(this.formData);
        this.formData = res; // 后台返回结果中的数据，回显至表单上
        this.isDisabled = true; // 新增的数据提交之后，[物料编码一项]不可再更改
        this.$message.success("操作成功");
        this.formData.remarks == null ? "无" : this.formData.remarks;
        this.getReport(this.formData.itemCode); // 以上请求完之后，请求仓库物料报表数据
      } catch (error) {
        this.isDisabled = false; // 指定项可输入 [物料编码]
      }
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /** 更新数据 */
    async putData() {
      try {
        const res = await putMaterial(this.formData);
        this.formData = res;
        this.$message.success("操作成功");
        this.formData.remarks == null ? "无" : this.formData.remarks;
        this.getReport(this.formData.itemCode); // 以上请求完之后，请求仓库物料报表数据
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-radio-group {
  label {
    min-width: 0;
  }
}
</style>
