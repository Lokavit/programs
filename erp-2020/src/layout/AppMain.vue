<template>
  <main class="main_container">
    <!-- 任务管理器 -->
    <template v-if="showTasks">
      <KftTaskManager></KftTaskManager>
    </template>

    <!-- 路由匹配到的组件将渲染在这里 -->
    <div class="router_view_container">
      <keep-alive>
        <!-- <transition> -->
        <router-view v-if="$route.meta.keepAlive" :key="key"></router-view>
        <!-- </transition> -->
      </keep-alive>
      <!-- <transition> -->
      <router-view v-if="!$route.meta.keepAlive" :key="key"></router-view>
      <!-- </transition> -->
    </div>
  </main>
</template>

<script>
export default {
  name: "AppMain",
  data() {
    return {};
  },
  computed: {
    // /** 默认不显示任务栏(页签)，任务栏数组长度>0则显示
    //  * 解决页面一加载就有一个底边效果的问题。
    //  */
    showTasks() {
      return this.$store.getters.taskGroup.length > 0 ? true : false;
    },
    // /**
    //  * 该计算属性用在 <router-view :key="key"></router-view>
    //  * 在遇到共用组件页面(通常为表单页多开)时，达到每页单独执行一遍所有钩子的目的
    //  */
    key() {
      return this.$route.path;
    }
  },

  watch: {},

  created() {},
  mounted() {},

  methods: {}
};
</script>
