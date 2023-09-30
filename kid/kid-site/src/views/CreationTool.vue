<template>
  <div class="creation_tool_wrap">
    <template v-for="(item, index) in tools">
      <!-- {{ item }} -->
      <section
        class="box_border draw_border"
        :key="index"
        @click="onSelectedTool(item.url)"
      >
        <img
          :src="
            item.src
              ? item.src
              : `http://assets.program.leadersir.net/img/static/studio_default.png`
          "
        />
        <h1>{{ item.title }}</h1>
        <h3>{{ item.desc }}</h3>
      </section>
    </template>
  </div>
</template>

<script>
export default {
  name: "CreationTool",
  data() {
    return {
      tools: [
        {
          title: "KID-PRO",
          url: "/kid-pro/index.html",
          src: "",
          desc: "少儿编程",
        },
        {
          title: "KID-JR",
          url: "/kid-jr/index.html",
          src: "",
          desc: "幼儿编程",
        },
        {
          title: "KID-CODE",
          url: "/kid-code/index.html",
          src: "",
          desc: "进阶编程",
        },
        {
          title: "KID-GAME",
          url: "/blocklyGames/index.html?lang=zh-hans",
          src: "",
          desc: "游戏编程",
        },
      ],
    };
  },
  methods: {
    onSelectedTool(url) {
      // 跳转到指定页面
      window.open(url, "_self");
    },
  },
};
</script>
