<template>
  <el-button size="mini" icon="el-icon-info" type="info" @click="handleDetail"></el-button>
</template>

<script>
/**
 * 使用 require.context() 方法来创建自己的（模块）上下文，这个方法有 3 个参数：
 * 要搜索的文件夹目录，是否还应该搜索它的子目录，以及一个匹配文件的正则表达式。
 * 返回结果为：
 * requireComponent.keys() 输出为文件名为数组 ，如："./Material/ListMaterial.vue"
 */
const requireComponent = require.context(
  "@/views", // 目录的相对路径
  true, // 是否查询其子目录
  /Form[\w]+\.(vue|js)$/ // 匹配[Form]件文件名的正则
);

/**
 * 该变量用于存储通过以上批量import的结果.keys()遍历所有文件名
 * 最终返回的就是每个component ,也就是components:{}的组件实例化
 */
const COMPONENTS = {};
requireComponent.keys().forEach(fileName => {
  /**
   * fileName 输出为: [./Material/ListMaterial.vue] (也就是模块文件夹+内中文件.vue)
   * requireComponent(fileName).default 每个组件
   * requireComponent(fileName).default.name 每个组件里的[name]
   */
  COMPONENTS[requireComponent(fileName).default.name] = requireComponent(
    fileName
  ).default;
});

export default {
  name: "KftDetail",
  components: COMPONENTS, // 以上整理完成的组件，在此注册
  props: {
    /**
     * 查看按钮点击时，所需的code，用于指定新打开的全局对话框，内中组件name
     */
    detailCode: { type: String, default: "" },
    /**
     * 查看按钮点击时，所需的title,用于当前新打开的全局对话框的标题内容
     * 该内容来自于父组件
     */
    detailTitle: { type: String, default: "" }
  },
  data() {
    return {
      comps: this.$options.components // 存储所有注册的组件
    };
  },
  computed: {
    // 返回所有组件的组件名字
    compName() {
      return Object.entries(this.comps);
    },
    levelNumberMax() {
      return this.$store.getters.levelNumberMax;
    },
    /** 计算属性里转一道，便于当前组件使用
     * 该code为父级组件使用本组件时，对其[detail-code]的赋值
     * use: <KftDetail :detail-code="detailFormCode"></KftDetail>
     */
    code() {
      return this.detailCode;
    },
    /** 计算属性里转一道，便于当前组件使用
     * 该title为父级组件使用本组件时，对其[detail-title]的赋值
     * use: <KftDetail :detail-title="datailFormTitle"></KftDetail>
     */
    title() {
      return this.detailTitle;
    }
  },
  watch: {},
  mounted() {},
  methods: {
    handleDetail(event) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      // 获取 当前点击的[查看按钮] 的上级组件，再回来，的input组件
      let chooseListInput = this.$parent.$el.querySelector(".el-input__inner");
      // 如果输入框的值为空，则不不会创建新的全局对话框
      if (chooseListInput.value == "") return;

      console.log("获取chooseListInput的值:", chooseListInput.value);
      /**
       * 调用打开模态框函数，内中参数分别为:
       * name:this.code // 外部传入的code码，用于指定新打开的对话框，内中使用组件的组件名
       * 也就是在使用的地方，加了[Form]字符串的[code]值。如:组件使用时[code="MaterialGroup"]
       * 则 [this.code]的值为:[FormMaterialGroup]。name参数值亦为[FormMaterialGroup]。
       *
       * title:该参数作为打开对话框时候的，对话框标题。该值来自外部，并与计算属性中计算后的结果
       * 如:来自于 [KftChoose-list-types.json]的[title]值
       */
      this.openModal(this.code, this.title, chooseListInput.value);
    },

    /**
     * 打开模态框
     * name: 组件名。根据chooseList的[type]拿到，
     * title: 对话框头部的标题，
     * code: 查看时，需根据该code[明文内容]，打开对应表单，根据内容请求后台数据，用于填充当前表单页。
     * use: this.openModal("FormMaterial", "物料主数据","B00001");
     */
    openModal(name, title, code = "") {
      let newModal = {
        title: `${title} ${code}`, // 此处，从路由meta中获取名字
        timestamp: Number(new Date()), // 时间戳，用于区别Madal  精确至毫秒
        show: true, // 默认显示
        levelNumber: this.$store.getters.levelNumberMax, // 层级
        /** 每个窗体初始化的坐标值 */
        position: this.$store.getters.modalPosition,
        // 其它内容，放在这里，比如打开时，带的数据， or 对应 component
        content: {
          component: this.compName.find(comp => comp[0] == name)[1],
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