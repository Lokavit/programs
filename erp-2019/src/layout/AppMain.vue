<template>
  <main class="main_container">
    <!-- 盛放所有全局窗体 -->
    <section class="modal_container">
      <template v-for="(modal,index) in modalGroup">
        <!-- {{modal}} == {{key}} -->
        <KftDialog v-show="modal.show" :key="index" :title="modal.title" :style="{'z-index':modal.levelNumber,'top':`${modal.position.top}px`,'left':`${modal.position.left}px`}" @on-zoommin="handleZoomMin(modal)" @on-close="handleCloseModal(modal)" @on-level="changeLevel(modal,index)" width="auto" :class="{'modal_active':acitve==index}">
          <component :is="modal.content.component" :key="index"></component>
        </KftDialog>
      </template>
    </section>
    <!-- 底部操作任务栏 -->
    <footer class="footer_container">
      <template v-for="(task,index) in taskGroup">
        <div :key="index" @click="handleZoomReset(task, index)" :class="{'task_active':acitve==index}">
          <span style="font-size:12px;">{{task.title}}</span>
          <i class="kft-icon-close" @click="handleCloseTask(task)"></i>
        </div>
      </template>
    </footer>

    <!-- 背景 态势 区域 -->
    <!-- <div class="company_idea">
      <h2>卓越、迅捷、高效、创新</h2>
      <p>为客户提供专业、迅捷的一站式服务</p>
    </div>-->
  </main>
</template>

<script>
export default {
  name: "AppMain",
  data() {
    return {
      /** 窗体及对应任务项的激活 [两者共用一个] */
      acitve: 0
    };
  },
  computed: {
    // 模态框组
    modalGroup() {
      return this.$store.getters.modalGroup;
    },
    // 任务栏组
    taskGroup() {
      return this.$store.getters.taskGroup;
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    /** 每个窗体的关闭事件
     * @param modal 传入选中的窗体
     * @param isCloseTask 是否调用关闭任务项函数，避免函数调用死循环
     */
    handleCloseModal(modal, isCloseTask = true) {
      /** 如果是需要调用关闭任务项函数 */
      if (isCloseTask) {
        // 同时需要关闭任务栏的对应任务项
        let task = this.taskGroup.find(
          item => item.timestamp === modal.timestamp
        );
        // 设置为false 即，程序不再继续调用关闭任务项函数中的关闭窗体函数
        this.handleCloseTask(task, false);
      }
      // 调用  vuex中对应关闭窗体函数
      this.$store.dispatch("modal/closeModal", modal);
    },
    /** 每个窗体的窗体最小化事件
     * @param modal 传入选中的窗体
     */
    handleZoomMin(modal) {
      this.$store.dispatch("modal/toggleModal", modal);
    },

    /** 切换层级 */
    changeLevel(modal, index) {
      // console.log("切换层级 窗体：", modal, "INDEX:", index);
      this.acitve = index;
      // 调用 modal 层级切换，当前点击的窗体切换到最上层
      this.$store.dispatch("modal/switchModalLevel", modal);
    },
    /** 底部任务栏的点击还原 与 窗体显示时，点击任务栏可以将窗体调至最高层级
     * 由窗体组中，通过相同时间戳找到对应窗体
     * 使用对应窗体对象中的[show]，对当前窗体显隐状态进行判断：
     * 若窗体当前处于非显示状态，则执行if语句中，窗体显隐事件，显示该窗体
     * 若窗体当前处于显示状态，则跳过if。即，无需执行窗体显隐事件
     */
    handleZoomReset(task, index) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      // 选中的任务项复制给当前激活任务项，用于为任务栏选中项增加选中样式
      this.acitve = index;

      // 暂存 找到的对应时间戳的数据
      let modal = this.modalGroup.find(m => m.timestamp === task.timestamp);
      /** 如果当前窗体状态非显示，则执行内中窗体显隐函数 */
      if (!modal.show) {
        // 调用 modal显隐事件，显示出来 modal
        this.$store.dispatch("modal/toggleModal", modal);
      }
      // 调用 modal层级切换,当前显示的modal为最上层
      this.$store.dispatch("modal/switchModalLevel", modal);
    },
    /** 底部任务栏点击关闭
     * @param task 传入选中的任务项
     * @param isCloseModal 是否调用关闭窗体函数，避免函数调用死循环
     */
    handleCloseTask(task, isCloseModal = true) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      if (isCloseModal) {
        // 从窗体组中，找到时间戳对象值与任务栏一致的窗体
        let modal = this.modalGroup.find(m => m.timestamp === task.timestamp);
        // 设置为false 即，程序不再继续调用关闭窗体函数中的关闭任务栏函数
        this.handleCloseModal(modal, false);
      }
      this.$store.dispatch("taskbar/closeTask", task);
    }
  }
};
</script>
