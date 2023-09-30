<template>
  <div class="layout_container">
    <Header></Header>
    <QuickNav></QuickNav>
    <AppMain></AppMain>
  </div>
</template>

<script>
import Header from "./Header";
import QuickNav from "./QuickNav";
import AppMain from "./AppMain";
import { labels } from "@/utils/labels";
export default {
  name: "Index",
  components: { Header, QuickNav, AppMain },
  mounted() {
    // localStorage.setItem("labelData", JSON.stringify(labels));
    // 整体布局一加载时候，就获取所有lables ,
    this.$store.dispatch("label/getLabels", labels);
  },
  methods: {
    // 这里使用异步，获取 后台返回 labels?
    // 亦可以将数据获取写在store/modules/label.js中，但分离性不好，操作性也不好。
  }
};
</script>