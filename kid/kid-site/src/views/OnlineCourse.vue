<template>
  <div class="exam online_course">
    <header>
      OnlineCourse
      <section>
        <template v-for="index in 6">
          <div
            :key="index"
            class="draw_border"
            @click="onselectedLv(index)"
            :style="{ color: active == index ? ' #ff7600' : '' }"
          >
            {{ `LV${index}` }}
          </div>
        </template>
      </section>
    </header>
    <main>
      <template v-if="!isShow">
        <div>查看机构课程，请点击右上角进行登入</div>
      </template>
      <template v-if="isShow">
        <template v-for="(item, index) in courseList">
          <section
            class="box_border draw_border"
            :key="index"
            @click="onSelectedCourse(item)"
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
              <p class="common_desc">{{ item.synopsis }}</p>
            </div>
          </section>
        </template>
      </template>
    </main>
  </div>
</template>

<script>
import { getCourseList } from "../api/studio";
export default {
  name: "OnlineCourse",
  data() {
    return {
      courseList: [],
      active: 1,
    };
  },
  computed: {
    /** @description 当前url上的机构id */
    currentStudioId() {
      return new URLSearchParams(window.location.search).get("studioId");
    },
    /** @description 用于判断是否在登入状态，唯有登入才显示课程 */
    isShow() {
      // 直接找到Header组件中，对应数据来作为依据
      return this.$root.$children[0].$children[0].headerInfo.isLogin;
    },
  },
  mounted() {
    this.getOnlineCourseList({
      studioId: this.currentStudioId,
      level: 1,
    });
  },
  methods: {
    /** 选择考题等级 */
    onselectedLv(val) {
      console.log("选择等级:", val);
      this.active = val;
      this.getOnlineCourseList({
        studioId: this.currentStudioId,
        level: val,
      });
    },
    // 选择一个视频，去往=> /course/detailForStudio/1(课程ID),后续操作不在本项目中
    onSelectedCourse(val) {
      console.log("选中的课程:", val);
    },

    async getOnlineCourseList(data) {
      const res = await getCourseList(data);
      if (res.success) {
        if (res.result.length > 0) {
          this.courseList = res.result;
          console.log("课程列表:", this.courseList);
        } else {
          this.courseList = [];
        }
      } else {
        this.courseList = [];
      }
    },
  },
};
</script>
