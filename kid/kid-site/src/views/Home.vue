<template>
  <div>
    <!-- 在这里加banner -->
    <div class="banner">
      <img :src="banner" draggable="false" />
    </div>
    <!-- 课程介绍、师资介绍、活动介绍 -->
    <Description></Description>
    <!-- 作品集 -->
    <div class="gallery_wrap">
      <h1 class="gallery_title">作品集</h1>
      <button class="draw_border" @click="onMore">MORE</button>
    </div>
    <Gallery></Gallery>
  </div>
</template>

<script>
import Description from "./Home/Description";
import Gallery from "./Gallery";
import { getStudioInfo } from "../api/studio";
export default {
  name: "Home",
  components: {
    Description,
    Gallery,
  },
  data() {
    return {
      banner: "",
    };
  },
  computed: {
    /** @description 当前url上的机构id */
    currentStudioId() {
      return new URLSearchParams(window.location.search).get("studioId");
    },
  },
  mounted() {
    this.getStudioBaseInfo();
  },
  methods: {
    /**
     * @function 点击去往作品展示
     */
    onMore() {
      console.log("更多作品=>跳转到作品展示");
      /** @description 从根目录开始寻找当前需要的BaseTabs */
      let temp = this.$root.$children[0].$children[1];
      /** @description 调用 BaseTabs的函数，并将需要跳转的组件传入 */
      if (temp) temp.tabClick(Gallery);
    },

    // 这里根据url参数值，异步获取对应机构信息
    async getStudioBaseInfo() {
      const res = await getStudioInfo(this.currentStudioId);
      if (res.success) {
        console.log("当前工作室信息:", res);
        this.banner = "http://assets.program.leadersir.net/1600067646411.jpg";
      }
    },
  },
};
</script>
