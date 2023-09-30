<template>
  <div class="home_desc_wrap">
    <template v-if="!isShow">
      <p>查看机构课程，请点击右上角进行登入</p>
    </template>
    <template v-if="isShow">
      <div><button class="draw_border" @click="onMore">MORE</button></div>
      <div class="desc_content">
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
              />
              <p class="common_desc">{{ item.synopsis }}</p>
            </div>
          </section>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { postTeacherList, getCourseList } from "../../api/studio";
import OnlineCourse from "../OnlineCourse";
export default {
  name: "DescCourse",
  components: { OnlineCourse },
  data() {
    return {
      courseList: [],
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
  watch: {},
  mounted() {
    this.getOnlineCourseList({
      studioId: this.currentStudioId,
      level: 1,
    });
  },
  methods: {
    onSelectedCourse(item) {
      console.log("当前选中课程:", item);
    },

    /**
     * @function 点击去往在线课程
     */
    onMore() {
      console.log("更多课程=>跳转到在线课程");
      /** @description 从根目录开始寻找当前需要的BaseTabs */
      let temp = this.$root.$children[0].$children[1];
      /** @description 调用 BaseTabs的函数，并将需要跳转的组件传入 */
      if (temp) temp.tabClick(OnlineCourse);
    },

    // 获取课程列表
    async getOnlineCourseList(data) {
      const res = await getCourseList(data);
      if (res.success) {
        if (res.result.length > 0) {
          this.courseList.push(res.result[0]);
          this.courseList.push(res.result[1]);
          this.courseList.push(res.result[2]);
          this.courseList.push(res.result[3]);
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
