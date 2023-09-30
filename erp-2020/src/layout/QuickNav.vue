<template>
  <!--  -->
  <nav class="quick_nav">快捷方式区域
      路由的绝对路径最后一级，即直达指定子页面
  </nav>
</template>

<script>
/**
 * 使用 require.context() 方法来创建自己的（模块）上下文，这个方法有 3 个参数：
 * 要搜索的文件夹目录，是否还应该搜索它的子目录，以及一个匹配文件的正则表达式。
 * return：返回一个（require）函数,其有三个属性
 * resolve:返回请求被解析后得到的模块id
 * keys():返回数组，由所有可能被上下文模块处理的请求组成
 * id:上下文模块里面所包含的模块id
 */
const requireComponent = require.context(
  "@/views", // 目录的相对路径
  true, // 是否查询其子目录
  /List[\w]+\.(vue|js)$/ // 匹配[List]件文件名的正则
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
  /** 快捷导航 */
  name: "QuickNav",
  components: COMPONENTS,
  data() {
    return {
      // isCollapse: true, // :collapse="isCollapse" 展开及收起
      /** 通过路由，生成的菜单 */
      menus: this.$router.options.routes[0].children,
      /**
       * 存储所有实例化的组件,用于创建全局模态框时,从其内容找到对应组件
       */
      comps: this.$options.components
    };
  },
  computed: {
    // 返回所有组件的组件名字
    compName() {
      return Object.entries(this.comps);
    },
    // 模态框组
    modalGroup() {
      return this.$store.getters.modalGroup;
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    // selectMenus(key, keyPath) {},
    selectItem(name, title) {
      // 从窗体组件中，寻找与当前传入name相同的窗体组件
      let modal = this.modalGroup.find(m => m.content.component.name == name);
      // 如果找到了符合条件的窗体
      if (modal) {
        /**
         * 当前组件的上级[#app级]下标为[2]的子级，也就是<AppMain>组件，中的层级切换函数()
         * 传入参数为:找到的窗体，该窗体与窗体组中的对应下标[用于层级切换时候的active标识]
         */
        this.$parent.$children[2].changeLevel(
          modal,
          // 从窗体组中，找到该窗体，返回该窗体与窗体组中的下标值[用于层级切换时候的active标识]
          this.modalGroup.findIndex(m => m.timestamp == modal.timestamp)
        );
      } else {
        // 反之，则调用创建新窗体函数
        this.openModal(name, title);
      }
    },
    /** 打开窗体
     * @param name:对应组件的组件名
     * @param title:从路由meta中获取的名字
     * @returns 创建并打开新的窗体
     */
    openModal(name, title) {
      let newModal = {
        title: title, // 此处，从路由meta中获取名字
        timestamp: Number(new Date()), // 时间戳，用于区别Madal  精确至毫秒
        show: true, // 默认显示
        levelNumber: this.$store.getters.levelNumberMax, // 层级
        /** 每个窗体初始化的坐标值 */
        position: this.$store.getters.modalPosition,

        // 其它内容，放在这里，比如打开时，带的数据， or 对应 component
        content: {
          component: this.compName.find(comp => comp[0] == name)[1]
        }
      };
      this.$store.dispatch("modal/openModal", newModal);
      /**
       * 当前组件的上级[#app级]下标为[2]的子级，也就是<AppMain>组件，中的层级切换函数()
       * 传入参数为:新建的窗体，新建窗体的层级值
       */
      this.$parent.$children[2].changeLevel(newModal, newModal.levelNumber);

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
        // active:true, // 激活中的任务栏
      };
      this.$store.dispatch("taskbar/addTask", newTask);
    }
  }
};
</script>

<style>
</style>