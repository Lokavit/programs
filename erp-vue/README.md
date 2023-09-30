# ERP 2020.01.09

- 该项目为 ERP 备份项目
- 该项目主全局窗体化操作模式

===

- [项目 TODO](#项目TODO)
- [组件封装](#组件封装)
- [库存模块](#Material)
- [采购模块](#Purchase)
- [生产模块](#Manufacture)
- [人资模块](#HumanResource)

### 项目结构

- src/assets/styles:样式文件，优先使用 scss 方式编写
- src/layout:整体布局
- src/components/kingfisher:封装组件，通过[kingfisher.js]全局注册

### Remarks

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

* 全局窗体
* - 与切换页签的优劣。
* - 需要改动的工期，及技术点。

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

```md Header
- [左]LOGO，名
- [中]
- [右]全局搜索，消息，头像，系统切换[Product Switcher]
```

```md 系统切换
- 信息
- 库存
- 采购
- 生产
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

- Tabs 区域：激活签，关闭签，Title 超长...，
- 未保存的签，Title 后加\*标注[已是否提交作为判断]
- 签多首尾加[<>]表示可以左右移动
- 同时加[^|v]，浮层显示所有签[含标*状态]
- 关闭签时，未保存给出警告弹窗
- 关闭最后一个签时，将用户引导回从中选择项目的原始列表。
- 字号推荐:font-size: 0.875rem;

## 六种物料类型，六条线，外加生产一条线

- 六种的每条线含[库存和采购]

### 单子改变批次方式

- 多种物料一张单子情况下，列头始终存在，无论该物料是否需要批次
- 选择批次

===

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

#### TODO 待完善

- 单一对话框关闭时，其后的对话框自动位置偏移至被关闭对话框处
- 对话框选中效果，对话框层级切换。

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

## 初版 2019.12.26

### 采购

- 复制从->采购向导对无数据的判定
-
