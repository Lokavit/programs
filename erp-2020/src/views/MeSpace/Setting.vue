<template>
  <section>
    Setting 偏好设置页面
    <!-- 快捷导航配置 -->
    该页面是否做成以下布局样式
    <hr />

    <el-tabs :tab-position="tabPosition" >
      <el-tab-pane label="快捷导航">
        <QuickNavSetting></QuickNavSetting>
      </el-tab-pane>
      <el-tab-pane label="配置管理">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理">角色管理</el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import QuickNavSetting from "./QuickNavSetting";
export default {
  /** 偏好设置 */
  name: "Setting",
  components: { QuickNavSetting },
  data() {
    return {
      tabPosition: "left"
    };
  }
};
</script>
