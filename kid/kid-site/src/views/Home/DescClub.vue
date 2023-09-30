<template>
  <div class="home_desc_wrap">
    <div><button class="draw_border" @click="onMore">MORE</button></div>
    <div class="desc_content">
      <template v-for="(item, index) in clubList">
        <section
          class="box_border draw_border"
          :key="index"
          @click="onSelectedClub(item)"
        >
          <h1 class="box_title">{{ item.name }}</h1>
          <div>
            <img
              :src="
                item.coverUrl
                  ? item.coverUrl
                  : `http://assets.program.leadersir.net/img/static/studio_default.png`
              "
              style="width:15rem;height:9rem"
            />
            <p class="common_desc">{{ item.desc }}</p>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script>
import MatchClub from "../MatchClub";
export default {
  name: "DescClub",
  components: { MatchClub },
  data() {
    return {
      clubList: [
        {
          name: "考级评测",
          desc:
            "考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测",
        },
        {
          name: "考级评测",
          desc:
            "考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测",
        },
        {
          name: "考级评测",
          desc:
            "考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测考级评测",
        },
      ],
    };
  },
  methods: {
    /**
     * @function 点击去往在线课程
     */
    onMore() {
      console.log("更多课程=>跳转到在线课程");
      /** @description 从根目录开始寻找当前需要的BaseTabs */
      let temp = this.$root.$children[0].$children[1];
      /** @description 调用 BaseTabs的函数，并将需要跳转的组件传入 */
      if (temp) temp.tabClick(MatchClub);
    },

    /** @description 无论点了哪一项，都去赛事活动板块 */
    onSelectedClub(item) {
      this.onMore();
    },
  },
};
</script>
