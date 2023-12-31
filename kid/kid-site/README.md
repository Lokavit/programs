# 📚 TODO

| ☑    | ✔    | ✖    | ❌   | 🔵   | 🔴   |
| ---- | ---- | ---- | ---- | ---- | ---- |
| 完成 | 发布 | 重定 | 驳回 | 新增 | 修复 |

| 📚   | 📖   | 📔  | 📕  | 📗  | 📘  | 📙  |
| ---- | ---- | --- | --- | --- | --- | --- |
| 列表 | 进行 |     |     |     |     |     |

`- 进度(完成|发布|重定|驳回)、次第(赤|橙|蓝|绿|白)、类型(新增|BUG)[完成日期]`

# kid-site

- 研发起始日期: 2020.12.26
- 测试帐密:jigou,1

## 机构工作室

- url:/kid-site/index.html?studioId=21
- 单页面。不做路由跳转，以[Tab+component]形式达成效果。
- 页面首次加载时，获取 url 指定参数值。
- 拉取指定参数值对应信息[如:logo、名称、banner 等]

<!--
course/getListForTrainingStudio?studioId=21&level=2
该接口根据传入的机构id及课程lv号，返回对应可观看视频列表

-->

### 功能列表

#### Header 页首

- ☑📕🔵 站点信息:根据 url 参数值拉取对应机构工作室信息填充。
- ☑📕🔵 LOGO:动态替换对应机构工作室专属 LOGO。
- ☑📕🔵 用户:登入、登出、注册。
- ☑📕🔵 个人中心:下拉菜单
- - ☑📕🔵 进入校园:点击事件。需根据当前 headerInfo 值判断是否显示
- - ☑📕🔵 我的主页:超链接。根据 checkLogin 结果获取的 id 跳转。
- - ☑📕🔵 我的作品:超链接。无参。
- - ☑📕🔵 个人资料:超链接。无参。
- - ☑📕🔵 修改密码:超链接。无参。
- - ☑📕🔵 登出系统:点击事件。请求登出接口。

#### Home 首页

- ☑📕🔵 机构自定义 Banner。
- ☑📕🔵 师资介绍:展示当前机构的老师
- ☑📕🔵 课程介绍:选取课程展示。(需登入)。
- - ☑📕🔵 根据登入状态，判断显示课程还是登入提示。
- - ☑📕🔵 截取首页展示的课程。(最多四节)
- - ☑📕🔵 [MORE]去往在线课程板块
- ☑📕🔵 活动介绍:考级评测。(去往赛事板块)
- - ☑📕🔵 去往赛事活动板块
- ☑📕🔵 作品集列表展示
- - ☑📕🔵 点击作品:查看作品详情
- - ☑📕🔵 点击作者:查看作者主页

#### CreationTool 创作工具

- ☑📕🔵 创作工具:点击显示组件(内容块状展示，点击跳转)
- 📕🔵 组件内容填充

#### OnlineCourse 在线课程

- ☑📕🔵 默认显示六个等级，但列表需依据以下:
- ☑📕🔵 未登入:提示用户登入。
- ☑📕🔵 已登入:展示当前用户享有的课程列表。
- 📕🔵 点击单一课程:打开详情页面？？？

#### Gallery 作品展示

- ☑📕🔵 显示当前机构所有作品。
- - ☑📕🔵 点击作品:查看作品详情
- - ☑📕🔵 点击作者:查看作者主页

#### MatchClub 赛事活动

- ☑📕🔵 考试及评测组件
- - ☑📕🔵 分级:考题分为四级，每级包含[选择题、判断题、编程题]
- - ☑📕🔵 默认从`lv1`中随机 30 道题[不含编程题]
- - ☑📕🔵 用户自由选择级别，并根据用户的选择生成当前题组。
- - ☑📕🔵 用户点击左侧题号，可切换题目。
- - ☑📕🔵 答题方式:用户点击任何选择项的[radio、span、img]均视为选择。
- - ☑📕🔵 答题卡:记录并实时更新答题卡数组，直至用户点击提交。
- - ☑📕🔵 组内题切换:
- - - ☑📕🔵 用户未曾答的题，无默认勾选项。
- - - ☑📕🔵 用户已经答的题，再次选中及回看时，需回显最近一次操作项。
- - ☑📕🔵 用户答完提交:使用题号背景色标识结果。(留空算作答错)
- - ☑📕🔵 提交后:仅支持查看当前题组所有题(即，不可更改)

---

## 需求

#### MatchClub

- 在线评测:分为四级。
- 通过lv按钮,判断由 lv(n)中随机一定数量的题目
- 题类:选择(choice)、判断(TFNG)、编程(code)。其中编程题无对错。
- 所有选项选项使用 radio。选择题[0123],判断题[01]
- 是否需要给每一个题，指定类型？还是通用一个类型？
- 通常一页 30 题，不算编程题(1-3)。无需分数，只需对错判断。
- 有未答，可通过，判定该题错误。
- 每页的随机题目只需回答一次，然后给出答题结果。
- 结果只分两种:除正确项，其它错题及未答皆算做错题。
- 当离开或刷新当前页面时，重新生成所有题。
- 评测展示方式:
- - 左侧上方:以下标+1 生成的 30 个按钮。用于控制右侧显示当前选中的题
- - 左侧下方:提交按钮。(前端自行处理)提交后，将题号全部以结果的颜色显示
- - 主体:对应左侧所出的题目+选项组，提交后，所有答案不可更改。
- - 主体下方:上下题切换按钮
- - 题号背景色:[默认:浅橙;选中:标橙;正确:浅绿;错误:浅红]
- - 随机题:需过滤编程题。以类型遍历吗？

```js
// 加载时，默认从lv1数组中随机30题
// 当用户选择lv后，改为从选中的lv中随机30题
// 随机的题存储在一个数组下。
```

```js 一些用到的判断
// questnum 题号不用于输出，但用于算分比对的严格方式
// quest:题目
quest.title; // 题目的文字内容
// 检测题目是否需要src
if (quest.src && quest.src != "") {
  <img src="" />; // 需要有一个img元素
}

// 根据题的类型，

// 选项组[选项号、选项文字内容、选项图片]
options[index].num; // 选项号[ABCD……]
options[index].title; // 选项中的文字内容(title只要有，即使为""也渲染)
options[index].src; // 如果有图，则插入img
// 判断题的options为空数组，所以
if(quest.type=="TFNG")

// answer:每一题的正确答案,一律采用大写
```

### 布局

#### 页首

- 自适应屏幕宽度，高度 5rem
- LOGO:站点图标，可替换
- Sign:站点登入

#### 导航

- 自适应屏幕宽度，高度 5rem
- 切换做成 Tab+component 形式

#### 主体内容

- 自适应屏幕宽度,max-width:1280px;
- 全部以组件形式，便于 Tabs 使用
