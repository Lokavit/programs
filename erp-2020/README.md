# ebuilding-2020

## 2020.02.04 ERP New Version

- [项目 TODO](#项目TODO)

### 项目结构

- src/assets/styles:样式文件，优先使用 scss 方式编写
- src/layout:整体布局
- src/components/kingfisher:封装组件，通过[kingfisher.js]全局注册

```md
software 软件功能
Manual 操作手册
Component 组件封装相关
```

# Component 组件

- src/components/kingfisher:封装组件，通过[kingfisher.js]全局注册

# 目录

- [任务管理器](#任务管理器)

## 任务管理器 KftTaskManager
- 任务项的增加/关闭
- 任务栏组左右按钮的显隐时机
- 任务项组左右按钮控制滚动条按照指定数值，单步顺方向位移
- 任务项的标星状态/激活状态

### 点击关闭每个任务项时候的处理

关闭功能需结合任务项的激活状态及标星状态做处理，分为以下几种情况：

#### 当前待关闭任务项状态：非激活，非标星

- 调用关闭前逻辑处理函数，关闭当前任务项；
- 注：该任务项绝不可能是是任务栏数组中最后一个元素。

#### 当前待关闭任务项状态：非激活，已标星

- 弹出消息盒子，提醒使用者准备关闭的任务项尚处于编辑中，是否强制关闭？
- - 使用者选择*确定*，调用激活项转移函数。通常为当前删除任务项的下标-1；
- - 使用者选择*取消*，切换激活任务项至当前待删除任务项上，路由跳转至该项对应页面。

#### 当前待关闭任务项状态：已激活，已标星

- 弹出消息盒子，提醒使用者准备关闭的任务项尚处于编辑中，是否强制关闭？
- 使用者选择*确定*，调用关闭前逻辑处理函数，关闭当前任务项；
- 使用者选择*取消*，不进行任何其他操作。

#### 当前待关闭任务项状态：已激活，非标星

- 调用关闭前逻辑处理函数，关闭当前任务项；
- 注：该任务项有可能是任务栏数组中最后一个元素，上一步调用函数中已有边界值处理逻辑。


## 待定问题：

<!--
- 是否可以跨模块，只有切换工作台时才清空。[]
- 快捷导航单独处理？ -->
<!-- 不可跨子系统操作，使用者点击子系统切换，先检测所有打开页面是否有标星(未保存状态)，
若有，给出保存提示。确定没有标星tab，才可以进行子系统切换。

快捷导航直链三级菜单，递归向上查找，列出其对应子系统及二级导航 -->

- 页面主体的滚动区域设置。
- - 列表页计算高度行方式，不设置滚动。
    <!-- - - 待定：表单全滚动，加固区域至Tabs -->

## 权限

- 通过路由 meta 中的 code[]数组，与登入帐号权限码做对比，列出当前帐号有权限的路由表。
- 该路由表也作为其帐号下，系统所有需要路由表的路由数据。
- - 包括快导航设置所需，根据罗列路由表，进行勾选配置。

## 个人中心

- mespace.js 路由组。
- 通过点击每项，执行对应操作。
- 目前采用非遍历形式，之后考虑优化，遍历路由组，单级竖排。

### 内容举例

```md
个人中心

- 系统设置 [管理员所属]
- 偏好设置 [快捷导航|]针对于每个使用者。
- 登出系统
```

---

## 页面及功能

- 注：草稿页按钮组中只可见[保存]，表单页按钮组中[无保存]。
- 所有[变更]按钮暂时去掉。
- 作废：暂定作废按钮操作，单独接口。该条数据最终操作完成。不做其他处理。

## 命名方式

- Material:物料主数据
- - Steel:钢材主数据
- 钢材
- - SteelOV:钢材概览[Overview]
- - SteelMP:钢材计划
- - SteelPML:钢材 PML
- - SteelPOR:钢材 POR
- - SteelPO:钢材 PO
- - SteelPD:钢材 PD
- - SteelBOM:钢材 BOM
- - 残材

```md
文件目录

- Material 主数据[内含六种物料，以其名字来命名]
- Steel [钢材]
- - SteelOV[钢材概览页]
- - MP[物资供应计划]
- - - ListSteelMP[mp 列表]
- - - FormSteelMP[mp 表单]
- - - GuideSteelMP[mp 向导]
```

- MP to POR 一对一
- 确认 PML 序列号。[选择采购订单行，录入到货信息(此处根据 MD+物料编码请求 PML)，也就是第三步确认 PML 序列号]，此处序列号包含在每个 PML 中，以合并及分割单元格形式展开。

```js
// 逗号运算符 ,返回最后一个,后面的结果。示例代码：为每个item添加code属性值，并返回
arr.map(item => (item.code = item.id), item);
```

- 因路由跳转不应带大量数据，所以向导页面放在表单页。默认启用。

### 列表页

- 查询区域，过滤条件需缓存，所以列表页亦需设置路由缓存
- 行选择方式：行单击，点击详情。

### 表单页

- 使用者手动关闭表单标签页时，需将该页从缓存中移除。以达到下次开始，重走生命周期。

### 表单页子表

- 子表默认带 checkbox，用于复选。含全选
- table 硬编码每列表头即每列内嵌组件。
- 批量新增：弹出对话框选择数据
- 批量删除：被勾选数据可直接由 table 中移除
- 导入：excel 文件导入并解析
- 表头与 excel 首行对比，视为文件正确，可以解析
- 点击行：编辑行内数据
- 所有 table 是否也存在 label 中？

- 所有与项目及分段绑定的表单，是否在修改时，项目及分段禁止变更？[目前可改]

## 导入 EXCEL 解析

- excel 表对应 table 是否有必填项，若必填项未填写，如何处理?(提示用户？)[在表单上提示必填问题]
- 是否支持多选？ 排队解析每个 EXCEL。[文件单选形式,一次选择一个，上传一个，解析一个]
- 因可编辑 table 中逐条删除的操作模式，若用户导入过多数据，删除较麻烦。
- 是否添加一键清空子表按钮？[改成表格第一列为 checkbox,多选删除]按钮名字[批量删除]
- 除了用户提交时检查子表必填项之外，是否还需要或还可以在其它时机做该检验处理？[不需要，提交时校验]
  <!-- - 导入 EXCEL 时，表头是否处理？或者是提供一版默认表头？[固定表头内容，即对应 EXCEL 中内容] -->

```md 钢材MP为例
- excel 表格中只录入[物料编码]和[需求数量]；
- 解析之后，根据物料编码，请求数据，再将物料信息填充完整；
- 需求数量：excel 解析时进来，在 table 中可以更改
- 另外还需要根据物料编码去请求[可用库存]，
- 思路：
- - 在根据物料编码请求主数据后，就将需求数量加入该行数据中
- - 在根据物料编码请求可用库存，就将可用库存数量加入该行数据中。

- 处理非法物料编码：以[物料编码]判定该条数据是否请求成功，若失败，跳过该条数据。
```

## 导出 EXCEL

- 获取后台文件，进行下载

## 钢材

- 物料编码请求详情数据
- [保存/确定/变更]按钮：操作完成后关闭表单。

- 列表页的刷新是否还需要？要有。

- 新增：该按钮在有新增向导时，默认直接指向新增向导。若非向导，页面上回有[直接新增]按钮
- 新增向导最后一个显示成功的页面去掉，前端使用消息提示用户成功。

### 钢材主数据

- 划分到物料主数据下。
- 列表页：导出、导入。
- 查询区域数据保存。
- 表单：保存，除物料编码外，皆可改。
- 物料不可用状态，在后续操作中是否为不可选？或是后续请求直接过滤掉不可用状态的数据？
- 列表：查询区域[查询]，表区域，分页，按钮组[新增、详情、导入、导出、刷新]。[3 接口:列表、导入、导出]
- 表单：主表布局及每项控制(必填/锁定)，查看，保存。[3 接口:新增、详情、保存]
- 选择数据，点击详情，打开页面，即为查看修改双状态。

### 钢材 MP

- 表单：保存，确定，变更
- 批量新增：点击。请求物料主数据列表，勾选数据。
- 子表导入 excel，前端解析该数据，[xsl-csv-json]
- 作废：直接发起请求，根据后台返回的 500(不能作废)，200(作废),前端无需其他操作。

- 表单页：可用库存置灰原因？数据从哪里来？[通过再次请求，查询回来]
- 批量新增：列表数据是滚动还是分页[滚动]
- 批量新增：是否需要在子表中过滤重复数据[不重复]
- 批量新增：是否记录已选数据[记录]
- 批量新增：以上为最优情况，目前未达到。

- 草稿：主表布局及每项控制(必填/锁定)，导入 Excel，导出 Excel。[9 接口:新增、详情、保存、删除、导入、导出、子表每条、库存、修改子表单条]
- [草稿]批量新增:独立页面，选定数据[单选/多选]。[1 接口:列表]
- 列表：查询区域，表区域[信息列内嵌表单]，分页，按钮组[新增、详情、刷新]。[1 接口:列表]
- 表单：主表布局及每项控制(必填/锁定)，导入 Excel，导出 Excel。[9 接口:新增、详情、确认、作废、导入、导出、子表每条、库存、修改子表单条]
- 批量新增:独立页面，选定数据[单选/多选]。[1 接口:列表]

- [变更]按钮去掉。确认之后，发现错误，只允许作废，而后另做。

- 子表：最大高度，内部滚动。

### 钢材 POR

- 表单，子表批量新增:点击。请求物料主数据列表，勾选数据。
- 子表：MP 单号？？？？[原型图少写了]
- 指定采购员：加了列表页和表单页，此处使用者只有分配采购员权限，无更改 por 权限。
- 向导仅限选择钢材 MP 时使用。
- 手动新增表单使用批量新增和批量删除
- 列表：查询区域，表区域[信息列内嵌表单]，分页，按钮组[新增、详情、刷新]。[1 接口:列表]
- 向导：
- 表单：
  <!--
  将向导按步骤分组件，做到每个组件的独立性
  关于表单页面，状态改变后，使用者点击任务栏[X]，如何能够恢复为初始状态 -->

### 钢材 PO

- 表单：
- 子表一：合计表，根据物料编码合并，并且可以填写[采购单价/税率]；提交时，该表不提交。
- 子表二：详情表，不可编辑。只在提交时将[采购单价/税率]添加到每一条数据中。

### 钢材 PML

- 移入：
- - 点击移入，从列表中选择一条，再选择其子表中待插入数据[可复选]。点击确定
- - 修改上一步带入数据的指定单元格。

- 表单：保存、确定、移动
- 移入:
- 将选中数据插入本表单子表中。点击提交，变更本表单及插入数据源的数据，即两次 post 提交。
- 点击表单中的确定，提交(该表单生效。)
- PML 序列号不可输，数据从向导带入。

# 基础数据 BasicData

## 仓库主数据

- 仓库分类，后台定义，前台读取

## 供应商

- 营业执照图片数组，无论用户如何操作，只在提交表单前，将 fileList 中所有文件转为 base64
- 文件名相同，即为已添加过同名文件。

## 状态整理

- [可用|不可用]
- [草拟|确认|已清|作废][mp、po]
- [已清|未清][子表]
- [已分配|待分配][分配采购员]
- [已入库|未入库][po]
- - [草拟|确认|已入库|作废][pd]

---

```js

    /** 点击导入 or 上传 等
     * <input accept=".doc,.docx" multiple/>
     * accept:文件类型
     * multiple:多选
     */
    importExcel(event) {
      // event.target.files为使用者多选文件的文件对象合集
      console.log("EVENT:", event);
      let excelFile = event.target.files[0]; // 拿到File对象
      // 如果有文件，调用解析Excel单表数据至页面Table中函数
      if (excelFile) this.parseExcelToTable(excelFile);
    },

    /**
     * 解析 Excel单表数据至页面Table中
     */
    parseExcelToTable(file) {
      const reader = new FileReader();
      reader.onload = event => {
        // 返回 workbook 整份EXCEL文档
        const workbook = XLSX.read(event.target.result, { type: "binary" });
        // 返回 worksheet EXCEL文档中的表  worksheet['!ref'] 是工作表的有效范围（基于 A-1）
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        // 表中数据转为JSON
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // 假设需要动态表头
        for (let i = 0; i < data[0].length; i++) {
          if (data[0].length == data[1].length) {
            this.tableHeadData.push({
              key: data[0][i],
              value: data[1][i]
            });
          }
        }

        // 解析并对象化每条数据
        for (let i = 0; i < data.length; i++) {
          // data[i] 为EXCEL中每行数据 ，扣除行1(字段)和行2(字段明文)
          if (i > 1) {
            // 从第三行开始
            let tempData = {}; // 临时存储每个对象
            /** data[i] 每行数据
             * item:每行中的每个单元格
             * index:本行每个单元格数据对应下标
             */
            data[i].forEach((item, index) => {
              // 为临时对象设置属性 并属性赋值，值为当前行每个单元格中的明文
              tempData[data[0][index]] = item;
            });
            // 将每个临时对象添加到 tableData数据中
            this.tableData.push(tempData);
          }
        }
      };
      reader.readAsBinaryString(file);
    }

```

```js
_file(file) {
  const reader = new FileReader();
  reader.onload = event => {
    console.log("EVENT:", event);

    // 返回 workbook 整份EXCEL文档
    const workbook = XLSX.read(event.target.result, { type: "binary" });
    console.log("workbook:", workbook);

    // 返回 worksheet EXCEL文档中的表  worksheet['!ref'] 是工作表的有效范围（基于 A-1）
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    console.log("worksheet:", worksheet);

    // 返回第一行 A1 B1 C1 D1 E1
    const fristRow = Array(XLSX.utils.decode_range(worksheet["!ref"]).e.c);
    console.log("第一行：", fristRow);

    // 当前表数据范围
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    // {e: {c: 4, r: 5}s: {c: 0, r: 0}} e表示end，s表示start ，开始及结束的行索引和列索引
    console.log("当前表数据范围:", range);

    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    console.log("DATA:", ...data);

    // 假设需要动态表头。
    for (let i = 0; i < data[0].length; i++) {
      if (data[0].length == data[1].length) {
        this.tableHeadData.push({
          key: data[0][i],
          value: data[1][i]
        });
      }
    }
    console.log("表头DATA：", this.tableHeadData);

    let tempData = {};

    console.log("动态添加属性后：", tempData);

    data.forEach((rowData, index) => {
      // rowData 为EXCEL中每行数据 ，扣除行1(字段)和行2(字段明文)
      if (index > 1) {
        tempData[data[0][index - 2]] = rowData[index - 2];
        console.log("动态添加属性后：", tempData);
      }
    });
    // console.log("整个表的数据转为tableData:", tableData);
    // this.excelData = tableData;
  };
  reader.readAsBinaryString(file);
},

importfxx(event) {
  let excelFile = event.currentTarget.files[0]; // 拿到File对象
  console.log("excelFile", excelFile);
  if (excelFile) this._file(excelFile);
}

```

---

```js
class MyCoolArray extends Array {
  first() {
    return this[0];
  }
  last() {
    return this[this.length - 1];
  }
}
let a = new MyCoolArray(1, 2, 3);
// 类中函数
a.length;
a;
a.first();
a.last();
```

```js 使用Array.from 映射
let arrData={length:4;2:"Satya"};
// 映射回调，调用函数，把源数据每个值映射/转换到返回值
Array.from(arrData,function mapper(val,index){
  if(typeof val ==="string"){
    return val.toUpperCase();
  }
  else {return index};
});
// [0,1,"Satya",3]

```

### 监听表单数据变化，为任务项标星

```html 组件内部各自实现
<!-- Form组件页面中相关代码 -->
<script>
  export default {
    data() {
      return {
        /** 主表区域 表单对象 */
        formData: {
          enabled: "true", // 默认可用
        },
        /** 用于标识表单页面的表单数据是否初始化过 */
        inited: false,
      };
    },
    watch: {
      /** 监听表单页面 表单数据变化，数据一旦发生改变，为其对应任务项标星 */
      formData: {
        deep: true,
        handler(val) {
          if (this.inited) {
            console.warn("表单数据是否发生过变化:", this.inited);
            // 如果表单数据初始化过， 又发生更改，则对当前对应任务项进行标星操作
            let tempTask = this.taskGroup.find(t => t.code == this.$route.params.code);
            this.$store.dispatch("taskbar/switchTaskStatus", tempTask);
          } else {
            console.warn("表单数据是否发生过变化:", this.inited);
            // 如果表单数据未初始化过，将其手动设置为已初始化
            this.inited = true;
          }
        },
      },
    },
  };
</script>
```

- 因该处理几乎覆盖所有 Form 页面，所以将其写为全局混入方式，减少组件内部代码量

```js 全局Mixins版
/* mixinsWatch.js 全局 watch文件 */
export default {
  /** 监听表单页面 表单数据变化，数据一旦发生改变，为其对应任务项标星 */
  formData: {
    deep: true,
    handler(val) {
      console.warn("全局 watch formData:", val);
      // 该 inited 在全局data中定义
      if (this.inited) {
        console.warn("全局 watch 表单数据是否发生过变化:", this.inited);
        // 如果表单数据初始化过， 又发生更改，则对当前对应任务项进行标星操作
        let tempTask = this.taskGroup.find(t => t.code == this.$route.params.code);
        this.$store.dispatch("taskbar/switchTaskStatus", tempTask);
      } else {
        // 如果表单数据未初始化过，将其手动设置为已初始化
        console.warn("全局 watch 表单数据是否发生过变化:", this.inited);
        this.inited = true;
      }
    },
  },
};

/* mixins.js */
import mixinsWatch from './mixinsWatch'; /** 引入全局混入 watch文件 */
export default {
    /** 全局混入 data 部分 */
    data() {
        return {
            /**
             * 无需定义该变量，因其在各个组件中的初始默认属性值不同
             * 所以该表单数据变量无需覆盖，依然在每个所需组件中各自定义，各自赋默认值
            */
            // formData: {},
            /** 用于标识表单页面的表单数据是否初始化过 */
            inited: false,
        };
    },
    watch: {
      /** 全局混入 watch 部分 */
        ...mixinsWatch,
    },
}

/* main.js */
import mixin from './mixins/mixin'; // 引入全局混入
Vue.mixin(mixin); // 全局混入
```

### 页面共用且复用，各自单独渲染

共用且复用组件，需要在各自数据不同，且同屏存在时，使用代码`:key="key"`,使其每个走一遍组件内所有钩子
`<router-view v-if="$route.meta.keepAlive" :key="key"></router-view>`。

```js 计算属性
  computed: {
    /**
     * 该计算属性用在 <router-view :key="key"></router-view>
     * 在遇到共用组件页面(通常为表单页多开)时，达到每页单独执行一遍所有钩子的目的
     */
    key() {
      return this.$route.path;
    }
  },
```

### 页面共用且复用时，监听路由

- 该共用复用组件指，<router-view></router-view>路由路径相同的情况

```js
watch: {
    /** 监听路由变化，根据变化时的路由参数，请求数据 */
    $route: {
      handler(to, from) {
        console.log("路由TO:", to);
        // console.log("路由FROM:", from);
        // 如果 to 参数为 create情况
        if (to.params.code == "create") {
          console.warn("to 参数为 create 情况");
          // 首次进入创建表单页面时， 将缓存的表单数据赋值给表单数据
          this.formData = this.cacheFormData;
          this.isDisabled = false; // 设置指定项可输入
          console.warn("对to对象进行处理：", this.formData);
        }
        // 如果 to 参数为 edit情况
        else if (to.params.code == "edit") {
          console.warn("to 参数为 edit 情况");
        }

        // 如果 to 参数非 create 非 edit 情况
        else if (to.params.code != "create" && to.params.code != "edit") {
          console.warn("非新建/编辑 表单情况");
          if (to.params.code) {
            this.passValue = to.params.code;
            console.warn("非新建表单情况:", this.passValue);
            this.getDataInfo(this.passValue);
          }
          // from 和 to 路径一致
          if (to.path == from.path) {
            console.warn("非新建表单情况 from to 路径一致:", this.passValue);
            this.passValue = to.params.code;
            this.getDataInfo(this.passValue);
          }
        }
        /**
         * 如果 from 参数为 create情况 从创建页面离开
         * 对表单的状态及数据做处理
         */
        if (from.params.code == "create") {
          this.cacheFormData = this.formData;
          console.warn("从创建页面暂离时，改变缓存数据:", this.cacheFormData);

          let tempTask = this.taskGroup.find(t => t.code == from.params.code);
          this.$store.dispatch("taskbar/switchTaskStatus", tempTask);
        }
      }
    },
  },
```

---

更改 List 列表请求，排序问题
http://localhost:9000/materials?sort=itemCode,desc&sort=itemDescription,desc
即先按照 itemCode 排序，遇到相同的，使用 itemDesc 继续排序，以此类推

- 改动作业分割的 API

- Appmin 页面，填充[背景态势区域]
- 采购模块部分，添加右键弹出批次编辑。[先不做]

- 更改单个标注时，在使用者点击提交后，将字符串末尾字符剔除

- 所有表单页面的主表区域改为计算形式<section :style="{'width':width}">设置
- 内嵌行改为[min-width=xx%]形式。
- 列表页按钮组样式及布局变更。[改 info 按钮，继承该样式后变种]

- 树形菜单目前皆为懒加载形式，不支持深度查询

- 物料主数据改为六种[12 页面]

* chooseListDialog 改为双击行完成单选行数据，移除底部确定及取消按钮
* 任务栏添加选中与否的样式区别。

* 每次创建的任务项为激活状态，除非用户手动切换激活任务项
* 创建时：当前最大一个，this.taskGroup.length -1

* 每新建窗体，默认为激活状态，其它状态反之
* 每新建任务，默认为激活状态，其它状态反之

- chooseList 等列表选择数据：单选及多选的区别。
- - 双击某行选中
- - checkbox 多选

## Fiori 3.0

- 首页：内容集成，[所有的代办事项可以从多个系统汇聚到一个页面上，并且可基于优先级排序]
- - 卡片形式，点击浮现弹窗，显示完整信息。或点击进入对应处理页面
- 全局搜索：搜索结果汇聚了每个系统的关键信息，整合在一个地方来呈现
- Header：头像区滑入，显示 PopTip,内中罗列所有操作按钮
- 用于使用者随时唤起及关闭帮助和搜索等系列内容[轻版本产品使用手册]

```md 轻版本产品使用手册 多种方案
#### 在当前的业务场景和上下文中，提供用户需要的帮助

- 面向字段：针对每个字段给出说明。贯穿全局的[?]图标[弊端：页面到处是?图标]
- 面向区域：针对页面某区域的功能进行详细说明，介绍功能及使用方法[新手引导弹窗]
- 面向页面：对当前页面的功能和内容进行帮助性的说明和引导
- 面向流程：为业务流程提供帮助和说明，引导用户完成每个步骤的操作
- 面向模块：对整个业务模块介绍和说明，帮助用户了解模块业务逻辑和使用方法，引导用户展开业务
- 面向系统：全局的系统帮助|用户初次登录系统时的帮助索引

- - 如：帮助面板可以在任何页面唤起，可自由拖拽，浮在系统最上层。面板内容基于唤起的页面，在面板内摞出当前页面用户最常遇见的问题，用户可以方便的查看相关帮助内容

#### 帮助内容的格式

- 没有格式的纯文本
- 带一定格式的文本 [点句，步骤，字号，字体等]
- 按钮[对后续操作的进一步引导]
- 链接[通常跳转到帮助中心的对应页面]
- 图片，视频[不建议]

#### 帮助设计原则

- 基于上下文：在特定地方，为特定用户，提供特定的帮助
- 高效：尽快让用户完成学习回到之前的任务
- 不滥用：优化业务流程和交互为前提，其次考虑系统内加帮助
```

```md PopTip内容举例
- Recent Activity：近期活动
- Frequently Used：经常使用
- App Finder：应用查找器 [全局搜索]
- Setting：设置
- Edit Home Page：编辑首页
- Contact Support：联系支持
- Give Feedback：给予反馈
- Sign Out：登出
```

## Tabs 形式

- 字号推荐:font-size: 0.875rem;

## 六种物料类型，六条线，外加生产一条线

- 六种的每条线含[库存和采购]

### 单子改变批次方式

- 多种物料一张单子情况下，列头始终存在，无论该物料是否需要批次
- 选择批次

---

- 层级切换：

每个新建窗体，默认为激活状态[isActive]，同时，其它窗体为置灰状态。
每次切换窗体，将当前点击窗体置顶且激活[isActive]，其他反之。

窗体内所有元素背景色为 rgba(0,0,0,0),目的为直接使用 el-dialog-body 的背景色为自身背景色

- 中日程 [预计净日历]是日历还是日期计算值

- 处理表单内嵌行含有批次管理方式时，提交一次，弹出批次编辑，点击更新后，若出现批次有问题的情况，再次点击提交，不弹出批次编辑对话框的问题。

  > 解决方式：因表单统一提交，即不会在点击更新时判定。将该严谨逻辑在提交时处理

物料管理方式：无 ，批次管理 ， 序列号管理

函数：返回过滤后，需要进行批次处理的数据
函数：返回过滤后，需要进行序列号处理的数据
综合以上，伪代码如下：

```js
export function returnDataByType(typeValue, arrayData) {
  return arrayData.filter(item => item.managementType === typeValue);
}

// 返回需要批次管理类型的数据集:
let lines_BATCHNUMBER = this.GLOBAL.returnDataByType("BATCHNUMBER", this.removeEmptyData(this.tableData));
// 返回需要序列号管理类型的数据集:
let lins_SERIALNUMBER = this.GLOBAL.returnDataByType("SERIALNUMBER", this.removeEmptyData(this.tableData));
```

- 校验:每个输入项预留位置,校验不通过时，调用 render()函数，渲染提示明文

```js 追加校验解决方式之一
// 最终渲染为[object HTMLDivElement] 的问题未结局
data(){
      /** 对itemCode进行校验 */
    let validItemCode = (rule, value, callback) => {
      if (value == "" || value == undefined) callback(this.render());
    };
    return{
      /** 主表区域 必填字段校验 */
      rules: {
        itemCode: [
          {
            validator: validItemCode,
            trigger: "blur"
          }
        ],
    };
}
methods:{
    /** 测试回调 */
    render() {
      console.log("渲染回调内容");
      console.log("找到回调的父级:", this.$el);
      const iconParent = this.$el.querySelector(".el-form-item__content");

      // 创建div
      const error_div = document.createElement("div");
      error_div.setAttribute("class", "el-form-item__error");

      const error_icon = document.createElement("i");
      error_icon.setAttribute("class", "kft-icon-info");

      error_div.appendChild(error_icon);
      error_icon.insertAdjacentHTML("afterend", `校验不过`);

      // iconParent.appendChild(error_div);
      console.log("创建i元素", error_div);
      // return iconParent;
      return error_div.innerHTML;
    },
}

```

```js 表单页
/* 
methods区域：
内部处理函数，单项
内部处理函数 onXXXX
async函数系列

特殊页：数据字典

*/
```

### BUG

- 点击左侧导航，有时出现重复路径的错误`NavigationDuplicated` [element-ui^2.13.0]

## 项目 TODO

- kft-table 分页刷新, 非点击页码，导致页码状态未变，但数据为第一页
- form 表单内嵌行,回显 or 查看[非编辑]的状态下,物料编码相同的行重新汇总.显示.
- 对于 el-table 中的每列，使用[min-width="xx%"]百分比来设置，以达到不同分辨率下的自缩放
- 采购模块的更新函数逻辑尚未做。

## Manufacture

### 页面

- ManufactureSystem[数据字典]: ListManufactureSystem
- Project[项目主数据]: ListProject | FormProject
- Block[分段登记]: ListBlock | FormBlock
- Zone[区域登记]: ListZone | FormZone
- Activitie[中日程]: ListActivitie | FormActivitie
- WorkPackage[作业包]: ListWorkPackage | FormWorkPackage
- WorkOrder[作业指示]: ListWorkOrder | FormWorkOrder
- Workteam[职/班]: ListWorkteam | FormWorkteam
- Wbs[作业分割体系]: ListWbs
- WorkReport[作业报告]: ListWorkReport | FormWorkReport

### chooseList 传参方式变更:

[以下 code 类型需传入的参数一览]

- WorkObject[作业对象]:传入 code、parentEntry
- Activity[中日程]:code,parentEntry,entry(可选),workArea(可选),workStage(可选),workObject(可选)
- WorkPackage[作业包]:code,parentEntry,entry(可选),workArea(可选),workStage(可选),workObject(可选),activityEntry(可选)
- WorkOrder[作业指示]:code,parentEntry,entry(可选),workArea(可选),workStage(可选),workObject(可选),activityEntry(可选)
- WorkTeam[职班]:code,keyWord(可选)

### ManufactureSystem 数据字典 [懒加载]

### 列表页[ListManufactureSystem]

- 树状 Table,懒加载，无限层级延展。每层皆可编辑，带有操作列[新增|编辑|删除]。
- 懒加载: 首次请求只加载根节点表格,点击带有子项行，加载对应子项。每次加载的数据，根据当前节点，添加到其子项[children]属性数组中。
- 表单使用对话框形式:提交之后,调用对应 API,前台使用[this.$set()]或者[this.$delete()]操作视图
  <!-- - 表单页[FormManufactureSystem]:[新增-本级代码手输,上级代码自动带入(不可编辑)],[编辑-同新增]
    API:通用接口模块下，数据字典维护[新建:entry 隐藏],entry 用于[修改,详情,删除]时传入
    其中有个[sort]用于使用者手动输入一个值(int32)类型,提交至后台.用于后台根据该值给 select 的 options 选项排序 -->

#### 新增

- 按钮:根节点使用页面底部大按钮;子节点使用行数据操作列新增按钮
- 调用新增 API,将无误数据提交至后台，并且拿到回显数据对象，用于下一步操作。
- 使用递归和[this.$set()]操作视图变更。

#### 修改

- 点击打开对话框，修改其数据。其中表单所需[父级 ID],用当前行[entry]的值填充

#### 删除

- 点击删除，递归数据，使用[this.$delete(data,index)]删除对应数据,视图变更
- 删除根节点时,控制台报错:[Cannot read property 'children' of null"]

```js 数据含子集情况下 删除 解决方式 v3.0: 递归
/** 递归删除
 * data:传入需递归的大数组
 * target:需要删除的指定值
 */
recursiveDelete(data, target) {
  if (!data) return;
  if (!Array.isArray(data)) return;
  for (let i = 0; i < data.length; i++) {
    // 如果找到 == target
    if (data[i].entry == target) {
      this.$delete(data, i); // 从视图删除该数据
      // 调用删除API [target] 为外部传入值，亦为接口所需参数
      deleteSystemCommoncodes(target);
      return;
    }
    // 非以上情况，且data[i]有children且其长度>0
    else {
      if (data[i].children && data[i].children.length > 0) {
        // 递归本函数，继续寻找 target
        this.recursiveDelete(data[i].children, target);
      }
    }
  }
},
```

```js
location.reload(); // 强制刷新页面
this.$delete(this.tableData, index); // 移除了当前数组中的当前下标的数据，视图上移除
```

---

- 中日程
  一个项目对应多个中日程
  有一个字段需要选分段或区域。[如:作业类型-作业阶段维护-详细工种-作业指示单位代码]
  列表页:
  表单页:
  API:中日程[workObject
  [workarea(类型),workstage(阶段)数据由通用接口(selectlist)中获取，code="wbs",pars 通常传[parentEntry]]

  列表页[作业对象，作业类型，作业阶段]需要用 chooseList+关联性选择器。

* 作业报告
  列表页:搜索条，Table 展示已有的作业报告。
  表单页:新增-选择一条[作业指示],数据带入报告里。可编辑

<!-- 以下是 可编辑列表页 -->

<!-- - 船型-船种维护
  可编辑 Table:整个表格皆为下拉框 -->

<!-- - 项目大日程
  列表页:可编辑列表[cell 时间控件]，单条[编辑|保存]保存时提交单条数据
- 查询：伪查询，[添加 excel 导入,暂不做]。
- 表头动态。
- 日程项(动态表头统一编辑处), -->

  <!-- 方案一：Table外上部部分，选择类型，选择阶段。Table可编辑内嵌行形式，录入详细工种数据 -->

- wbs：作业类型-作业阶段维护-详细工种
- wbs：作业类型-作业阶段维护-详细工种-作业指示单位代码

<!-- 暂未确定 -->

- 实绩报告-船壳
- 实绩报告-舾装

## chooseList

- 添加[projectEntry]属性,目前用在[作业对象]的数据请求，因其需要项目编码为 API 参数
- - 中日程 ChooseList 改为在封装中写，最终在使用处，加上[:single="false" :search="search"]

  KftChooseDialog 中 search 的请求参数，多种状况：
  通用的对象属性：
  keyword:String 用于 chooseList 对话框查询条，单个输入框，关键字搜索

  作业对象：需要一个必须属性值[projectEntry: this.projectEntry]
  作为查询对象属性值，一同提交请求。其中还要区别，是否有[keyword]属性值

### 方案二：2019.12.16

- 在 KftChooseDialog 中，编写点击中日程时，chooseList 结构及逻辑

### 方案一：

通过三层<slot>，在需要使用的具体页面，实现插槽结构，以及业务逻辑。
<KftChooseDialog>层，添加 v-if 判断，属性[single:true]默认一行表单，该属性由外部控制
当其为 false 时，渲染带插槽的表单。

```html
<slot name="multiple" :search="search"></slot>
<script>
  props: {
    // 默认是单个查询项，即启用查询条的模式 [单行表单还是多行表单]
    single: { type: Boolean, default: true },
    // 查询区域 对象
    search: {type: Object,default: function() {return {};}}
  }
</script>
```

<KftChoose>层，该层引入<KftChooseDialog>组件，在其内层

```html
<KftChooseDialog :single="single" :search="search">
  <template v-slot:multiple="{search}">
    <slot :search="search"></slot>
  </template>
</KftChooseDialog>
<script>
  props: {
    // 默认是单个查询项，即启用查询条的模式 [单行表单还是多行表单]
    single: { type: Boolean, default: true },
    // 查询区域 对象
    search: {type: Object,default: function() {return {};}}
  }
</script>
```

<ListWorkPackage>层，使用<KftChoose>组件，在其内中

```html
<KftChoose :single="false" :search="search">
  <template v-slot="{search}">
    插槽的内容区域
  </template>
</KftChoose>
<script>
  data(){return{search: {}};}
</script>
```

### ktf-detail

- 该组件与 chooseList 解藕。
- 使用新的批量[import]方式,将所有 Form 开头的组件于[kft-detail]中注册
- 点击查看按钮,调用[openModal]函数,打开一个全局对话框的[Form]表单页
- 需根据传入的值,来打开正确的表单。并且处理打开模态框所需的(name,title,code)参数值

### editTable 可编辑表格

每一个可编辑单元格，皆有两个组件[编辑|显示]
点击某一行,改变该行可编辑单元格中的组件[class]
使用[@current-change]及[:row-class-name]事件,实现以上效果

- ps:每次都将选中行 row,与行 class 事件中的行数据做对比，唯有相同才将该行变为可编辑
- 使用偏门的[small]作为单元格可编辑组件的包裹器,使用[span]作为单元格显示内容的组件

### 分页的效果有点儿问题

```js
/**
 * 解决方案一 ： acitve class [该方式不行]
 */
// 获取页码元素组
let ulNode = this.$el.querySelector(".el-pager");
// 获取所有li
let liNodes = ulNode.getElementsByTagName("li"); // 使用[childNodes]会多出[comment-注释节点]<!---->
for (let i = 0; i < liNodes.length; i++) {
  console.log("LI:", liNodes[i].className); // 输出了每个元素
  if (liNodes[i].className.indexOf("active") != -1) {
    liNodes[i].classList.remove("active");
  }
}
// 给ul下的第一个li 添加 [active]激活样式
ulNode.firstElementChild.classList.add("active");
```

## 组件封装

### KftRightMenu

- 封装右键菜单组件，在使用的地方，列出需要的功能项
- 目前库存收发转储单，在不可编辑情况下，需要右键菜单

### KftLabel 标注

- 方案三：label 封装为独立组件，去掉插槽，改为在实用处与其他组件平级。[2019.12.16]

- 方案一:为 el-form-item 自带 label 绑定一个自定义指令
- 方案二:封装一个 label(内含 slot)，el-form-item 中以内容方式，使用该封装组件，同时省略原有 label
- 目前采用方案二，且在封装的组件里，将[span]使用[tooltip]包裹。实现鼠标滑入全显

#### TODO 待完善

- 标注的存储问题，及暂无后台的临时解决方式[js 文件，于 Layout.vue 中使用 localStorage 缓存,于登出按钮移除该缓存]
- 标注由后台返回，更改标注提交至后台存储。
- 标注只有在 form 上，才加[FormatLabelSuffix],作为 table 表头时，无需加。

## Material

### 页面

- Material[物料主数据]: ListMaterial | FormMaterial
- MaterialGroup[物料组]: ListMaterialGroup | FormMaterialGroup
- Warehouse[仓库]: ListWarehouse | FormWarehouse
- UnitOfMeasure[计量单位]: ListUnitOfMeasure | FormUnitOfMeasure
- MaterialBatch[物料批次]: ListMaterialBatch | FormMaterialBatch
- GoodsReceipt[库存收货单]: ListGoodsReceipt | FormGoodsReceipt
- GoodsIssue[库存发货单]: ListGoodsIssue | FormGoodsIssue
- GoodsTransfer[库存转储单]: ListGoodsTransfer | FormGoodsTransfer
- GoodsReportJournal[库存过账清单]: ListGoodsReportJournal
- GoodsReportBatch[批次过账清单]: ListGoodsReportBatch

#### 子组件

- BatchCreateDialog[创建批次]
- BatchSelectDialog[选择批次]
- InventoryDialog[库存过账及批次过账所需详情对话框][鼠标右键操作]

### BUG 已处理

- 修复 Form 重置按钮，[根据版本号判断]当前清理是否需要给禁输项赋值
- 所有标注，超出指定字符，转...,只有...才显示 tooltip
- EL-UI[el-table]默认选中[setCurrentRow]BUG 处理方式

```js
// 于vue组件的[mounted]函数中，使用延时操作，且[ref=""]变量不可重复
mounted() {
  // 默认选中[单据行]中的第一行数据 [延时操作，否则不生效]
  setTimeout(() => {
    this.$refs.singleTables.setCurrentRow(this.goodsListData[0]);
  }, 10);
},
```
