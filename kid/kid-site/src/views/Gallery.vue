<template>
  <div class="project_list">
    <template v-for="(item, index) in project_list">
      <!-- {{ item }} -->
      <section class="box_border" :key="index">
        <img
          :src="
            item.sb3ImagePath
              ? item.sb3ImagePath
              : `http://assets.program.leadersir.net/img/static/studio_default.png`
          "
          @click="onSelectedProject(item.id)"
        />
        <h1 @click="onSelectedProject(item.id)">
          {{ item.projectName }}
        </h1>
        <h5>
          <span>&#x2605; {{ item.collectionNum_f }}</span>
          <span>&#x2764; {{ item.amountOfReading_f }}</span>
          <span> {{ item.modifyTimeString }}</span>
        </h5>
        <h3 @click="onSelectedUser(item.userId)">
          <img :src="item.authorAvatar ? item.authorAvatar : `&#x263a;`" />
          <span>{{ item.authorUserName }}</span>
        </h3>
      </section>
    </template>
  </div>
</template>

<script>
import { postProjectList } from "../api/studio";
export default {
  name: "Gallery",
  data() {
    return {
      /** @description 查询作品列表 */
      project_data: {
        currentPage: 1,
        studioId: new URLSearchParams(window.location.search).get("studioId"),
      },
      /** @description 存储教师列表，用于html遍历 */
      project_list: [],
    };
  },
  mounted() {
    this.projectList(this.project_data);
  },
  methods: {
    /**
     * @function 点击每个作品都带着id超链接到另一个页面
     */
    onSelectedProject(id) {
      console.log("点选作品:", id);
      // 新窗口打开外链接
      window.open(`/scratchPlayer?id=${id}`, "_blank");
    },
    /**
     * @function 点选作品作者，跳转到作者首页
     */
    onSelectedUser(userId) {
      console.log("点选作者:", userId);
      // 新窗口打开外链接
      window.open(`/home/friends/${userId}`, "_blank");
    },

    async projectList(data) {
      const res = await postProjectList(data);
      if (res.success) {
        console.log("拉取作品列表:", res);
        this.project_list = res.result;
        console.log("作品列表：", this.project_list);
      }
    },
  },
};
</script>
