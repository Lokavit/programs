<template>
  <header class="header_container">
    <div class="header">
      <div class="header_left">
        <img src="../assets/img/logo.png" />
        <span>e-Building智能化协同管理平台</span>
      </div>
      <!-- 此处想要 click有效，必须加上[native]修饰符 -->
      <router-link to="/" exact :class="{'is_active':true}" @click.native="onShowWorkSpace">工作台</router-link>
      <div class="header_right">
        <i class="kft-icon-message"></i>
        <!-- 鼠标滑入，还是点击？ 先做点击 -->
        <el-popover placement="bottom" width="auto" trigger="hover" v-model="showMeSpace" popper-class="popper_me_space">
          <section>
            <div @click="onSetting">
              <i class="kft-icon-logout" style="font-size: 12px;"></i>偏好设置
            </div>
            <div @click="logout">
              <i class="kft-icon-logout" style="font-size: 12px;"></i>登出系统
            </div>
          </section>

          <div slot="reference" @click="onShowMeSpace">
            <img src="../assets/img/avatar.png" />
          </div>
        </el-popover>

        <span @dblclick.alt="showCustom">|</span>

        <!-- 鼠标滑入，还是点击？ 先做点击 -->
        <el-popover placement="bottom" width="50%" trigger="hover" v-model="showSystemSwitcher" popper-class="popper_system">
          <section>
            <template v-for="(system,index) in systems">
              <template v-if="system.meta&& system.meta.title">
                <div :index="system.path" @click="onSubsystem(system)">
                  <!-- <i :class="`kft-icon-${system.meta.icon}`"></i> -->
                  <h3>{{system.meta.title}}</h3>
                </div>
              </template>
            </template>
          </section>
          <i class="kft-icon-base-info" slot="reference" @click="onShowSystemSwitcher"></i>
        </el-popover>
        <!-- 帮助中心 图标按钮，鼠标滑入，显示提示文字 -->
        <!-- <el-tooltip class="item" effect="dark" content="帮助" placement="bottom">
          <i class="el-icon-question" @click="onHelpManual"></i>
        </el-tooltip> -->
      </div>
    </div>

    <!-- 每个子系统的自有菜单组(导航) ，传入值为当前选中的子系统路由路径 -->
    <template v-if="showNavMenu">
      <NavMenu :system="childSystem"></NavMenu>
    </template>

    <!-- 隐藏功能：用于动态编辑 -->
    <template v-if="dialogShow">
      <el-dialog title="表头配置" :visible="dialogShow" :modal-append-to-body="false" modal-append-to-body :append-to-body="true" :before-close="cancelHandler" width="600px">
        <el-card :body-style="{ padding: '0px' }" style="margin-bottom:20px;">
          <el-form :inline="true" :model="search" size="mini" style="padding:14px 20px 14px 0" @submit.native.prevent>
            <div class="form_row">
              <!-- 第一列 查询输入框 表格列少情况下，需在此处设置最小宽度值 -->
              <aside>
                <KftLabel :label="labels.keyword.value|FormatLabelSuffix"></KftLabel>
                <el-input size="mini" v-model="search.keyword" :placeholder="`请输入${labels.keyword.value}`" @keyup.enter.native="onSubmit" clearable @clear="onSubmit"></el-input>
              </aside>
              <!-- 第二列 查询按钮 -->
              <aside>
                <el-button type="primary" icon="el-icon-search" @click="onSubmit" size="mini" style="margin-left:40px;">查询</el-button>
              </aside>
            </div>
          </el-form>
        </el-card>

        <div style="padding:0 2em">
          <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
            <template v-for="(item,index) in checkGroup">
              <el-checkbox :key="index" :label="item" style="width:6em">{{item.label}}</el-checkbox>
            </template>
          </el-checkbox-group>
        </div>

        <div slot="footer">
          <el-button type="primary" @click="confirmHandler" size="mini">确 定</el-button>
          <el-button @click="cancelHandler" size="mini">取 消</el-button>
        </div>
      </el-dialog>
    </template>
  </header>
</template>

<script>
import { scheduleConfig } from "./scheduleonfig.js"; // 用于模拟请求后台的配置文件，此处暂时手动一个js
import NavMenu from "@/layout/NavMenu.vue";
export default {
  name: "Header",
  components: { NavMenu },
  data() {
    return {
      currentRoutePath: "", // 当前子系统路由路径
      childSystem: {}, // 当前子系统路由对象
      showNavMenu: false, // 是否显示横导航
      showMeSpace: false, // 显示我的
      showSystemSwitcher: false, // 显隐系统切换台
      dialogShow: false, // 对话框隐藏
      labels: {
        keyword: { default: "关键词", custom: "", value: "关键词" }
      },
      /** 查询的from */
      search: {},
      checkGroup: [], // 返回的对应模块表头配置
      checkList: [] // 已选中
    };
  },
  computed: {
    /** 通过路由，生成的系统切换台 */
    systems() {
      // 路由组下，根路径为/的所有子路由，即为所有子系统切换台。
      return this.$router.options.routes[1].children;
    }
  },

  // watch: {
  //   $route: {
  //     handler(to, from) {
  //       console.warn("路由TO:", to);
  //       console.warn("路由FROM:", from);
  //     }
  //   }
  // },

  methods: {
    /** 帮助手册 */
    onHelpManual() {
      // 跳转到操作手册页面
      this.$router.push({ path: "/helper/manual" });
    },

    /** 显示系统切换台 */
    onShowSystemSwitcher() {
      this.showSystemSwitcher = !this.showSystemSwitcher;
    },

    /** 显隐我的 */
    onShowMeSpace() {
      this.showMeSpace = !this.showMeSpace;
    },

    /** 根据传入的路由路径，打开对应子系统的主页面 */
    onSubsystem(system) {
      // 调用系统切换台事件，即在选中某个子系统之后，将系统切换台面板隐藏
      this.onShowSystemSwitcher();

      // console.warn("当前路由路径：", this.$route.path);
      // // 检测当前任务项组中是否有标星任务项，若有，需提示使用者
      // console.warn("切换子系统:", system.path);

      // // 当前路由路径 与 选中子系统路由路径 是否相等
      // console.warn(
      //   "当前路由路径 与 选中子系统路由路径 是否相等:",
      //   this.$route.path == system.path
      // );

      // 如果当前路由路径与选中子系统路由路径不同
      if (this.$route.path != system.path) {
        // 判断任务管理器中，是否有标星状态任务项
        let tempTask = this.$store.getters.taskGroup.find(
          t => t.status != false
        );
        // console.warn("尚有标星元素:", tempTask);

        // 如果有标星状态元素 ，提醒使用者是否强制关闭
        if (tempTask) {
          // 弹窗提示使用者，本页面未保存，保存还是丢弃
          this.$confirm("页面状态尚处于编辑中, 是否强制关闭?", "提示", {
            confirmButtonText: "关闭",
            cancelButtonText: "取消",
            type: "warning"
          })
            // 若使用者选择关闭，这执行关闭任务项前业务逻辑
            .then(() => {
              // 切换子系统，并且调用 清空横导航函数
              this.$store.dispatch("taskbar/clearTask");
              // 选中系统复制给当前子系统
              this.childSystem = system;
              // 当前子系统路由路径
              this.currentRoutePath = system.path;
              this.showNavMenu = true;

              // 跳转到选中子系统的概览页面
              this.$router.push(`${system.path}`);
            })
            // 若使用者点击取消按钮，不做任何操作
            .catch(() => {
              // console.warn("取消关闭");
            });
        } else {
          // 切换子系统，并且调用 清空横导航函数
          this.$store.dispatch("taskbar/clearTask");
          // 选中系统复制给当前子系统
          this.childSystem = system;
          // 当前子系统路由路径
          this.currentRoutePath = system.path;
          this.showNavMenu = true;

          // 跳转到选中子系统的概览页面
          this.$router.push(`${system.path}`);
        }
      }
    },

    /** 工作台超链接 点击事件 */
    onShowWorkSpace() {
      this.showNavMenu = false;
    },

    /** 偏好设置 */
    onSetting() {
      // 跳转到偏好设置
      this.$router.push({ path: "/mespace/setting" });
    },

    removeTitles() {
      // localStorage.removeItem("titleData"); // 登出时，移除缓存的描述
    },
    logout() {
      localStorage.removeItem("labelData"); // 登出时，移除缓存的描述
    },

    /**
     * 该提交事件含以下作用：
     * 输入框：输入内容后，请求后台对应的数据，罗列为 checkBox。用于配置。
     * 使用者选定之后，点击确定，将数据递交至后台。作为该企业私有定制
     */
    onSubmit() {
      // 获取 search 对象
      // console.log("查询条件对象:", this.search);
      if (!this.search.keyword) {
        // 查询输入框为空时，返回整个列表数据
        this.$message.info("请输入需要配置的模块");
      }
      if (this.search.keyword) {
        // console.log(`有关键词`);
        this.getDataList();
      }
    },
    /**
     * 根据使用者输入的关键词，请求对应数据集(表头)
     */
    async getDataList() {
      // console.log(`获取对应数据集(表头)`);
      // const res = await
      // this.checkGroup =res;
      this.checkGroup = scheduleConfig;
    },

    /** 隐藏功能，可呼出表头配置对话框 */
    showCustom(event) {
      // console.log(`快捷键 显示自定义`, event);
      this.dialogShow = true; // 显示表头配置对话框
    },

    handleCheckedCitiesChange(value) {
      // console.log(value);
      this.checkList = value;
    },
    /** 对话框的确定事件 */
    confirmHandler() {
      this.dialogShow = false; // 关闭表头配置对话框
      // 将已选中的 this.checkList 提交至后台
      localStorage.setItem("column", JSON.stringify(this.checkList));
      // console.log(`本地存储:${localStorage.getItem('column')}`);
    },
    /** 对话框的取消事件 */
    cancelHandler() {
      this.dialogShow = false; // 关闭表头配置对话框
    }
  }
};
</script>
