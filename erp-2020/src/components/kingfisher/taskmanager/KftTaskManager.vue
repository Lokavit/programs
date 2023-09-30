<template>
  <section class="taskmanager_container">
    <!-- 分三列 之 左 按钮 -->
    <div class="left_button" v-show="showTaskbarButton">
      <i class="el-icon-arrow-left" @click="onTaskLeftButton"></i>
    </div>
    <!-- 分三列 之 中 任务栏 -->
    <div class="center_taskbar">
      <div class="taskbar_flex">
        <template v-for="(task,index) in taskGroup">
          <div :index="task.path" :class="['task_item',{'task_active':task.active}]" @click="onSubTask(task,index)">
            <!-- 通过任务项标题明文长度，判定是否显示tooltip。 -->
            <template v-if="task.title.length>7 ">
              <el-tooltip :content="task.title" placement="top">
                <span class="task_item_title">{{ task.title }}</span>
              </el-tooltip>
            </template>
            <template v-else>
              <span>{{ task.title }}</span>
            </template>

            <b class="task_item_status" v-if="task.status">*</b>
            <div class="task_item_close" @click="onCloseTask(task)">
              <i class="kft-icon-close"></i>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- 分三列 之 右 按钮 -->
    <div class="right_button">
      <i class="el-icon-arrow-right" v-show="showTaskbarButton" @click="onTaskRightButton"></i>
    </div>
  </section>
</template>

<script>
export default {
  /** 任务管理器组件
   * 用于对横导航下的任务栏管理
   */
  name: "KftTaskManager",
  props: {},
  data() {
    return {
      /** 左右按钮的显隐开关 */
      showTaskbarButton: false,
      /** 用于存储页面渲染后，获取到的任务栏组元素 */
      centerTaskbar: "",
      taskTitle: "" // 任务项标题
    };
  },
  computed: {
    /** 任务栏组 */
    taskGroup() {
      return this.$store.getters.taskGroup;
    }
    // // 是否启用Tooltip,默认禁用
    // isEnableTooltip() {
    //   if (this.taskTitle.length > 7) {
    //     return true;
    //   }
    // }
  },

  watch: {
    /** 监听 vuex中的任务栏组数据变化 */
    "$store.getters.taskGroup": {
      // immediate: true,
      handler(val) {
        this.isTaskbarButton();
      }
    }
  },

  created() {},
  mounted() {
    /** 自定义事件 接受 函数变更后的结果值 */
    this.$on("isShowButton", function(val) {
      this.showTaskbarButton = val;
    });
    /** 页面渲染完成后，获取任务管理器下任务组元素 */
    this.centerTaskbar = this.$el.querySelector(".center_taskbar");
  },

  methods: {
    /** 是否显示任务栏左右切换按钮 */
    isTaskbarButton() {
      if (this.taskGroup.length > 0) {
        // // 必须使用该方式 dom更新的下一次执行
        this.$nextTick(() => {
          // 任务栏内容区域
          let taskbarFlex = this.centerTaskbar.querySelector(".taskbar_flex");
          // 获取到 任务栏内容区域下的所有任务项
          let taskItems = taskbarFlex.querySelectorAll(".task_item");
          // 所有任务项由类数组转为数组，而后对每个任务项的宽度进行累加计算，返回总和
          let sumTaskItemsWidth = Array.from(taskItems).reduce((sum, cur) => {
            return sum + cur.offsetWidth;
          }, 0);
          // 自定义事件，将该代码块结果带出。
          this.$emit(
            "isShowButton",
            sumTaskItemsWidth > this.centerTaskbar.offsetWidth ? true : false
          );
        });
      }
    },

    /** 根据传入的路由路径，打开对应子系统的主页面 */
    onSubTask(task) {
      // console.log("TASK:", task);
      this.$router.push({ path: `${task.path}` });
      this.$store.dispatch("taskbar/switchTaskActive", task);
    },

    /** 任务栏点击关闭
     * @param task 传入选中的任务项
     */
    onCloseTask(task) {
      event.cancelBubble = true; // 取消父组件点击事件 [事件冒泡]
      /** 当前待关闭任务项状态: 非激活，非标星
       * 直接调用vuex中的关闭任务项函数
       */
      if (!task.active && !task.status) {
        this.$store.dispatch("taskbar/closeTask", task);
      } else if (!task.active && task.status) {
        /** 当前待删除任务项状态: 非激活，已标星
         * 调用 关闭任务项之前的业务逻辑函数，传入当前待关闭任务项
         */
        // 弹窗提示使用者，本页面未保存，保存还是丢弃
        this.$confirm("页面状态尚处于编辑中, 是否强制关闭?", "提示", {
          confirmButtonText: "关闭",
          cancelButtonText: "取消",
          type: "warning"
        })
          // 若使用者选择关闭，这执行关闭任务项前业务逻辑
          .then(() => {
            this.beforeCloseTask(task.path); // 调用关闭任务项前业务逻辑函数
          })
          // 若使用者点击取消按钮，则将当前待删除任务项设置为激活状态，并路由跳转
          .catch(() => {
            // 将激活项切换为 该标星状态页面
            this.$store.dispatch("taskbar/switchTaskActive", task);
            this.$router.push({ path: `${task.path}` }); // 路由跳转至该页面
          });
      } else if (task.active && task.status) {
        /** 当前待删除任务项状态: 已激活，已标星
         * 调用 关闭任务项之前的业务逻辑函数，传入当前待关闭任务项
         */
        // 弹窗提示使用者，本页面未保存，保存还是丢弃
        this.$confirm("页面状态尚处于编辑中, 是否强制关闭?", "提示", {
          confirmButtonText: "关闭",
          cancelButtonText: "取消",
          type: "warning"
        })
          // 若使用者选择关闭，这执行关闭任务项前业务逻辑
          .then(() => {
            this.beforeCloseTask(task.path); // 调用关闭任务项前业务逻辑函数
          })
          // 若使用者点击取消按钮，则将当前待删除任务项设置为激活状态，并路由跳转
          .catch(() => {});
      } else {
        /** 其它情况，当前待删除任务项状态: 已激活，非标星
         * 调用 关闭任务项之前的业务逻辑函数，传入当前待关闭任务项
         */
        this.beforeCloseTask(task.path); // 调用关闭任务项前业务逻辑函数
      }
    },

    /** 任务管理器 至左按钮事件 */
    onTaskLeftButton() {
      this.centerTaskbar.scrollLeft -= 100;
    },

    /** 任务管理器 至右按钮事件 */
    onTaskRightButton() {
      // 元素滚动条距左值 <0?设置为0 :继续单步位移
      this.centerTaskbar.scrollLeft =
        this.centerTaskbar.scrollLeft < 0
          ? 0
          : (this.centerTaskbar.scrollLeft += 100);
    }
  }
};
</script>