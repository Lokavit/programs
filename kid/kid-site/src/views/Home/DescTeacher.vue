<template>
  <div class="home_desc_wrap">
    <div></div>
    <div class="desc_content">
      <template v-for="(item, index) in teacher_list">
        <section
          class="box_border draw_border"
          :key="index"
          @click="onSelectedTeacher(item)"
        >
          <h1 class="box_title">{{ item.nickName }}</h1>
          <div>
            <img
              :src="
                item.avatar
                  ? item.avatar
                  : `http://assets.program.leadersir.net/img/static/studio_default.png`
              "
            />
            <p class="common_desc">{{ item.signature }}</p>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script>
import { postTeacherList } from "../../api/studio";
export default {
  name: "DescTeacher",
  data() {
    return {
      /** @description 查询教师列表 */
      teacher_data: {
        currentPage: 1,
        studioId: new URLSearchParams(window.location.search).get("studioId"),
        keywords: "",
      },
      /** @description 存储教师列表，用于html遍历 */
      teacher_list: [],
    };
  },
  mounted() {
    this.teacherList(this.teacher_data);
  },
  methods: {
    onSelectedTeacher(item) {
      console.log("当前选中项:", item);
    },

    onMore() {
      console.log("更多教师:");
    },

    async teacherList(data) {
      let temp_formdata = new FormData();
      temp_formdata.append("currentPage", data.currentPage);
      temp_formdata.append("studioId", data.studioId);
      const res = await postTeacherList(temp_formdata);
      if (res.success) {
        console.log("拉取教师列表", res);
        this.teacher_list = res.result;
        console.log("教师列表：", this.teacher_list);
      }
    },
  },
};
</script>
