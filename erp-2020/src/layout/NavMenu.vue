<template>
  <nav class="nav_container">
    <!-- 当前所在子系统 如：钢材管理 。该链接始终指向当前子系统概览页面 -->
    <router-link :to="childSystem.path">
      <h4>
        <i :class="`kft-icon-${childSystem.meta.icon}`" style="padding-right:8px;"></i>
        {{childSystem.meta.title}}
      </h4>
    </router-link>
    <!-- 当前子系统之后，横向排列的导航 -->
    <el-menu :default-active="$route.path" router active-text-color="#FFF" @open="handleOpen" @close="handleClose" :unique-opened="true" mode="horizontal">
      <!-- 该三角形用于给子系统做装饰右三角，其位置始终贴着子系统icon+title右侧 -->
      <div class="triangle"></div>
      <template v-for="(item,index) in menus">
        <!-- 如果路由有meta信息，并且信息中有title属性 -->
        <template v-if="item.meta&& item.meta.title">
          <!-- 二级菜单下再无子级菜单的路由 -->
          <template v-if="!item.children">
            <!-- {{ basePath+ item.path }} -->
            <el-menu-item :index="`${item.path.indexOf(basePath)==-1?basePath+item.path:item.path}`" @click.native="selectItem(item,
            item.path.indexOf(basePath)==-1?basePath+item.path:item.path
            )">
              <span>{{item.meta.title}}</span>
            </el-menu-item>
          </template>

          <!-- 二级菜单下，还有子级菜单的路由 -->
          <template v-else>
            <el-submenu :index="`${item.path.indexOf(basePath)==-1?basePath+item.path:item.path}`" :popper-append-to-body="false">
              <template slot="title">
                <span>{{item.meta.title}}</span>
              </template>
              <template v-for="(child,index) in item.children">
                <!-- 如果路由有meta信息，并且信息中有title属性 -->
                <template v-if="child.meta&&child.meta.title">
                  <!-- {{basePath+item.path+'/' + child.path}} -->
                  <el-menu-item :key="index" :index="`${
                    child.path.indexOf(basePath+item.path+'/')==-1?basePath+item.path+'/' + child.path:child.path}`" @click.native="selectItem(child,child.path.indexOf(basePath+item.path+'/')==-1?basePath+item.path+'/' + child.path:child.path)" style="padding:0 20px">{{child.meta.title}}</el-menu-item>
                </template>
              </template>
            </el-submenu>
          </template>
        </template>
      </template>
    </el-menu>
  </nav>
</template>

<script>
export default {
  /** 横导航 */
  name: "NavMenu",
  props: {
    /** 外部[Header传入的，当前选中的子系统对象数据] */
    system: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    /** 计算 当前传入的子系统 */
    childSystem() {
      return this.system;
    },

    basePath() {
      return this.childSystem.path + "/";
    },

    /** 每个子系统的菜单组 */
    menus() {
      // 其中 数组下标值，应为动态匹配
      // return this.$router.options.routes[1].children;
      let routes = this.$router.options.routes[1].children; // 暂存
      // 从路由组中找到传入的路由路径，返回其下标
      let routepath = routes.findIndex(
        item => item.path === this.childSystem.path
      );
      // 将返回的下标作为 路由组的数组下标值，实现动态匹配每个子系统的菜单组
      return this.$router.options.routes[1].children[routepath].children;
    },
    /** 任务栏组 */
    taskGroup() {
      return this.$store.getters.taskGroup;
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
    /** 于导航中选择一项 */
    selectItem(item, baseRoutePath) {
      // console.warn("ITEM:", item, "基础路径:", baseRoutePath);
      if (item.path != baseRoutePath) {
        item.path = baseRoutePath; // 对象的path换成全路径
      }
      // 当前选中，已被打开过。返回对应打开项
      let task = this.taskGroup.find(t => t.path == item.path);
      if (task) {
        // 将激活状态，转移到 选中项
        this.$store.dispatch("taskbar/switchTaskActive", task);
      }
      // 反之，则调用创建task函数，创建一个任务项
      else {
        // 调用创建窗体对应任务栏函数，该函数经过了mixinMethods
        this.createTask(item);
      }
    }
  }
};
</script>