<template>
  <section :style="{'width':width}" class="modal_list">
    <!-- 列表页 查询区域 -->
    <el-form :inline="true" size="mini">
      <div class="form_row">
        <!-- 第一列 查询输入框  -->
        <aside>
          <el-form-item></el-form-item>
        </aside>
        <!-- 按钮组  -->
        <aside style="position:relative">
          <el-button type="info" @click="onRootCreate" size="mini" style="position:absolute;right:140px">
            <i class="kft-icon-create"></i>
            <span>添加</span>
          </el-button>

          <el-upload action :http-request="uploadFile" accept="*/*" :show-file-list="false" style="position:absolute;right:70px">
            <el-button type="info" size="mini">
              <i class="kft-icon-upload"></i>
              <span>上传</span>
            </el-button>
          </el-upload>
          <el-button type="info" @click="onRefresh" size="mini" style="position:absolute;right:0px">
            <i class="kft-icon-refresh"></i>
            <span>刷新</span>
          </el-button>
        </aside>
      </div>
    </el-form>

    <!-- default-expand-all  默认全展开 -->
    <el-table v-loading="tableLoading" :data="tableData" border lazy :load="lazyLoad" row-key="entry" :tree-props="{children: 'children', hasChildren: 'hasElement'}" highlight-current-row size="mini" :header-cell-style="headerCellStyle" :cell-style="cellStyle" @current-change="handleCurrentRow" :max-height="maxHeight" stripe>
      <el-table-column prop="code" label="编码" show-overflow-tooltip width="300"></el-table-column>
      <el-table-column prop="name" label="名称" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="sort" label="顺序" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="description" label="备注" show-overflow-tooltip align="center"></el-table-column>

      <el-table-column label="操作" width="100" align="center">
        <template v-slot="scope">
          <el-button type="warning" size="mini" circle style="padding:0;margin-left:8px" @click="onChildCreate(scope.row)">
            <i class="kft-icon-create"></i>
          </el-button>
          <el-button type="warning" size="mini" circle style="padding:0;margin-left:8px" @click="onModifty(scope.row)">
            <i class="kft-icon-edit"></i>
          </el-button>

          <el-popover :ref="`popover-${scope.$index}`" placement="top" width="160">
            <p>确定删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="scope._self.$refs[`popover-${scope.$index}`].doClose()">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDeleteOk(scope._self.$refs[`popover-${scope.$index}`],scope.row)">确定</el-button>
            </div>
            <el-button type="warning" size="mini" slot="reference" circle style="padding:0;margin-left:6px">
              <i class="kft-icon-delete"></i>
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增及修改的 弹层区域 -->
    <template v-if="dialogShow">
      <el-dialog title="新增/修改" :visible.sync="dialogShow" :modal-append-to-body="false" modal-append-to-body :append-to-body="true" width="480px">
        <el-form :model="form" size="mini" :rules="rules" ref="form" v-loading="formLoading">
          <!-- 主表区域  包裹器 start -->
          <div class="form_container">
            <!-- 主表单行单项 之 编号 -->
            <div class="form_row">
              <KftLabel :label="labels.code.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
              <el-form-item prop="code">
                <el-input v-model="form.code" :placeholder="`请输入${labels.code.value}`" :disabled="isDisabled" clearable></el-input>
              </el-form-item>
            </div>

            <!-- 主表单行单项 之 名称 -->
            <div class="form_row">
              <KftLabel :label="labels.name.value|FormatLabelSuffix" :isRequired="true"></KftLabel>
              <el-form-item prop="name">
                <el-input v-model="form.name" :placeholder="`请输入${labels.name.value}`" clearable></el-input>
              </el-form-item>
            </div>

            <!-- 主表单行单项 之 父级ID -->
            <div class="form_row" style="padding-bottom:14px">
              <KftLabel :label="labels.parentEntry.value|FormatLabelSuffix"></KftLabel>
              <el-input size="mini" v-model="form.parentEntry" :placeholder="`${labels.parentEntry.value}`" clearable :disabled="true"></el-input>
            </div>

            <!-- 主表单行单项 之 顺序 -->
            <div class="form_row" style="padding-bottom:14px">
              <KftLabel :label="labels.sort.value|FormatLabelSuffix"></KftLabel>
              <el-input size="mini" v-model="form.sort" :placeholder="`请输入${labels.sort.value}`" clearable></el-input>
            </div>

            <!-- 主表单行单项 之 备注 -->
            <div class="form_row" style="padding-bottom:14px;">
              <KftLabel :label="labels.description.value|FormatLabelSuffix"></KftLabel>
              <el-input size="mini" type="textarea" v-model="form.description" :placeholder="`请输入${labels.description.value}`"></el-input>
            </div>
          </div>
          <!-- 主表区域  包裹器 end -->

          <!-- 提交 / 重置 表单 -->
          <div style="text-align:center;margin-top:20px;">
            <el-button type="primary" size="mini" @click="confirmHandler()">提交</el-button>
            <el-button size="mini" @click="cancelHandler()">取消</el-button>
          </div>
        </el-form>
      </el-dialog>
    </template>
  </section>
</template>

<script>
import {
  getWbsElements,
  getWbsElementInfo,
  postWbsElement,
  putWbsElement,
  deleteWbsElement,
  postWbsElementImport
} from "@/api/manufacture";
export default {
  // 生产模块 作业分割体系单位 列表页
  name: "ListWbsElement",
  data() {
    return {
      /** 列表中的表头样式 */
      headerCellStyle: this.GLOBAL.LIST_TABLE_HEADER_CELL_STYLE,
      /** 列表中的单元格样式 [非表头部分] */
      cellStyle: this.GLOBAL.LIST_TABLE_CELL_STYLE,
      /** 窗体内容的 v-loading属性控制值
       * 防止网路环境较差时，窗体内数据返回较慢，窗体空白
       * 防止网路环境较差时，提交事件响应结果及回显较慢，使用者误操作
       */
      formLoading: false,
      /** 防止网路环境较差时，列表数据请求返回较慢，局部假死 */
      tableLoading: false,
      /** 列表区域 相关 */
      tableData: [],
      currentRow: [], // 表格的当前选中行
      dialogShow: false, // 是否显示新建及修改对话框
      isDisabled: false, // 是否禁止输入
      form: {},
      rules: {
        // entry: [
        //   {
        //     required: true,
        //     message: "请输入编码",
        //     trigger: "blur"
        //   }
        // ],
        code: [
          {
            required: true,
            message: "请输入编码",
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    /** 当前窗体宽度值计算 [根据全局设定基数等比缩放] */
    width() {
      return this.GLOBAL.returnCurrentWindowWidth(this.GLOBAL.INITIAL_WIDE);
    },
    /** 当前窗体标注组 [后台获取所有标注] */
    labels() {
      return this.$store.getters.labels.WbsElement.formLabels;
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
  mounted() {
    this.getWbsData();
  },
  methods: {
    /** 新增根元素 该按钮在全局窗体底部 */
    onRootCreate(event) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      this.dialogShow = true; // 显示新增/修改对话框
      this.isDisabled = false; // 编号在新增时，可输入
      this.form = {}; // 每次打开新增对话框时，内中数据都清空
    },

    /** 新增子元素，作用于添加子集数据 */
    onChildCreate(row) {
      this.dialogShow = true; // 显示新增/修改对话框
      this.isDisabled = false; // 编号在新增时，可输入
      this.form = {}; // 清空表单数据
      // 当前选中行中的[entry]，复制给打开的新增对话框父级ID
      this.form.parentEntry = row.entry;
    },

    /** 单行操作项 之 行数据编辑 */
    onModifty(row) {
      this.dialogShow = true; // 显示新增/修改对话框
      this.isDisabled = true; // 编号在修改时，禁输入
      this.form = row; // 当前行数据，复制给修改对话框中的表单
      // this.getSystemDataInfo(row.entry); // 或者严禁一些，走请求
    },

    /** 刷新 */
    onRefresh(event) {
      // 此处调一下查询按钮的函数,请求最新数据集
      this.getWbsData();
    },

    /** 当前选中行 该函数作为备用,用于需要操作当前选中行数据or上次选中行数据
     * curRow:当前行
     * oldRow:上次选中行
     */
    handleCurrentRow(curRow, oldRow) {},

    // 自定义上传
    async uploadFile(file) {
      const formData = new FormData();
      // 该 xls 即，后台API 所设置的文件承接 。(也就是body时的每个属性)
      formData.append("xls", file.file);
      const res = await postWbsElementImport(formData);
      if (res.statusOK) {
        this.$message.success("上传成功");
        this.fetchData(); // 调用 请求数据集函数
      } else {
        this.$message.warring("上传失败");
      }
    },
    /** 列表数据懒加载
     * row:拿到点击行的数据。
     * resolve: 请求的数据，作为其参数。
     */
    async lazyLoad(row, treeNode, resolve) {
      let params = {
        parentEntry: row.entry // 当前节点ID作为父级节点ID请求数据
      };
      const res = await getWbsElements(params);
      resolve(res); // 子集数据
      /**
       * 把请求回来的数据，直接加在节点上。
       * 使用该方式，给当前tree节点添加[children],保证[tableData]同步更新
       */
      this.$set(row, "children", res);
    },

    /** 删除选中数据 */
    async handleDeleteOk(popover, row) {
      popover.doClose();
      console.log("待删除的数据:", row);

      /** 优先判断当前row，在[hasElement:true]情况下，子集[dhildren]的数量<=0
       * 主要用于用户删除所有子节点后，再删除row时，手动改变其节点的[hasElement:false]
       * 如此，即程序继续向下，走本函数中else部分的代码,调用递归，将row数据删除。
       */
      if (row.hasElement && row.children && row.children.length <= 0) {
        row.hasElement = false; // 将其 有子节点标识，改为false
      }

      /** 先判定该数据是否有子集，如果有提示用户
       * 当前选中数据 [hasElement:true] 用于判断该数据是否有子集
       * children:该属性为执行过lazy才会附加到对象
       * hasElement的值,并不会随着该行子集变动而变动
       * 以达到子集全部删除后，删除父级不做以下操作提示。
       */
      // 如果当前行 有子集
      if (row.hasElement) {
        this.$confirm("当前数据下含有子集数据，是否确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            // 调用 递归删除函数，删除选中数据
            this.recursiveDelete(this.tableData, row.entry);
            this.$message.success("删除成功");
            return;
          })
          .catch(() => {
            this.$message.info("已取消删除");
          });
      }
      // 如果 当前行 [hasElement:false]
      else if (!row.hasElement) {
        // 调用 递归删除函数，删除选中数据
        this.recursiveDelete(this.tableData, row.entry);
      }
    },

    /** 递归删除
     * data:传入需递归的大数组
     * target:需要删除的指定值
     * use: this.recursiveDelete(this.tableData,row.entry)
     */
    recursiveDelete(data, target) {
      if (!data) return; // 无数据
      if (!Array.isArray(data)) return; // 非数组

      for (let i = 0; i < data.length; i++) {
        // 如果当前的[entry] == target传入值
        if (data[i].entry == target) {
          this.$delete(data, i); // 从视图删除该数据
          // 调用删除API [target] 为外部传入值，亦为接口所需参数
          deleteWbsElement(target);
          return;
        }
        // 非以上情况
        else {
          // 如果 data[i]有children且其长度>0
          if (data[i].children && data[i].children.length > 0) {
            // 递归本函数，继续寻找 target
            this.recursiveDelete(data[i].children, target);
          }
        }
      }
    },

    /** 递归新增
     * data:传入需递归的大数组
     * target:需要删除的指定值
     * use:this.recursivePost(this.tableData,this.form)
     */
    recursivePost(data, target) {
      if (!data) return; // 无数据
      if (!Array.isArray(data)) return; // 非数组
      /** 需要考虑以下问题:
       * 通过 target.parentEntry 判断当前需添加的是根元素还是子元素
       * 添加根元素数据:
       *    直接添加数据:this.$set(data,data.length,target)
       * 添加子元素:
       *    需先判断待插入数据的对象中[hasElement:true]且是否有[children],
       *    如果有，则插入为:this.$set(data,data.length,target)
       *    如果没有,则在插入数据之前，需改变待插入数据的
       */
      /** 无父节点的数据，将[target]对象直接添加到传入的[data]中 */
      if (!target.parentEntry) {
        this.$set(data, data.length, target);
        // this.getSystemData(); // 调用一下请求，让数据重新回来。似乎没有什么作用
        return;
      } else {
        /** 有父节点的数据，即[target.parentEntry]有值的情况下
         *  遍历传入数组,从中找到某数据.entry == 传入target.parentEntry
         */
        for (let i = 0; i < data.length; i++) {
          // 如果 某数据.entry == 传入target.parentEntry
          if (data[i].entry == target.parentEntry) {
            /** 判断该数据的[hasElement]是否有子元素
             * 如果 [hasElement:false]即没有子元素，则该数据一定没有[children]
             */
            if (!data[i].hasElement) {
              data[i].hasElement = true; // 该数据的[hasElement:true]
              data[i].children = new Array(); // 为该数据手动添加一个[children:[]]属性
              // 以上设置完毕后,使用this.$set将数据插入到children数组中
              this.$set(data[i].children, data[i].children.length, target);
              return;
            } else if (data[i].hasElement) {
              /** 如果 [hasElement:ture]即已有子元素 */
              /** 如果该数据没有[children] 将其加上一个children的数组 */
              if (!data[i].children) data[i].children = new Array();
              this.$set(data[i].children, data[i].children.length, target);
              return;
            }
          } else {
            console.log("没找到entry == parentEntry");
            // 如果某条数据有 children，并且 长度>=0
            if (data[i].children && data[i].children.length >= 0) {
              // 递归本函数,直至数据成功插入整体数据的对应层级树中
              this.recursivePost(data[i].children, target);
            }
          }
        }
      }
    },

    /** 对话框的确定事件 */
    confirmHandler() {
      this.$refs.form.validate(valid => {
        if (valid) {
          /** 窗体内容加载效果：开启 */
          this.formLoading = true;
          /** 用 [version] 版本号来判定，执行新增数据函数 or 修改数据函数 */
          this.form.version === undefined ? this.postData() : this.putData();
          /** 窗体内容加载效果：关闭 */
          this.formLoading = false;
          this.dialogShow = false; // 隐藏新增/修改对话框
        } else {
          this.$message.warning("请检查表单");
        }
      });
    },
    /** 对话框的取消事件 */
    cancelHandler() {
      this.form = {}; // 清理form对象值，避免数据回显。
      this.dialogShow = false;
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /**
     * 获取当前页面列表数据集
     * params: 外部传入的对象,通常为[search查询]对象
     */
    async getWbsData(params) {
      try {
        /** 列表数据加载效果：开启 */
        this.tableLoading = true;
        let res = await getWbsElements(params);
        // console.log("分段列表数据:", res);
        this.tableData = res; // 无论数据有无，皆赋值给tableData
      } catch (err) {}
      /** 列表数据加载效果：关闭 */
      this.tableLoading = false;
    },
    /** 新增数据 */
    async postData() {
      try {
        const res = await postWbsElement(this.form);
        console.log("RES:", res);
        this.form = res; // 新增的数据回显，作用于视图更新时。
        // 调用递归新增函数,传入整个数组以及 表单信息回显对象
        this.recursivePost(this.tableData, this.form);
        this.$message.success("提交成功");
      } catch (error) {
        // this.resetForm(); // 调用重置事件，清空表单
        this.isDisabled = false; // 编码可输入
      }
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },

    /** 更新数据 */
    async putData() {
      try {
        const res = await putWbsElement(this.form);
        this.form = res;
        this.getWbsData();
        this.$message.success("修改成功");
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
    },
    /** 根据传入值，获取该数据详细信息 */
    async getWbsDataInfo(entry) {
      try {
        /** 窗体内容加载效果：开启 */
        this.formLoading = true;
        const res = await getWbsElementInfo(entry);
        this.form = res;
      } catch (error) {}
      /** 窗体内容加载效果：关闭 */
      this.formLoading = false;
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
    font-size: 13px;
  }
}

.el-button--warning:hover {
  background-color: rgba(0, 0, 0, 0);
  border-color: rgba(0, 0, 0, 0);
  color: #e9bb1d;
}
</style>
