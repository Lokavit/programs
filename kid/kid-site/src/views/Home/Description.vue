<template>
  <BaseTabs v-model="activeName" :onChange="change">
    <!-- 在这里加banner -->
    <div class="banner">
      <img :src="studio.banner" />
    </div>
    <template v-for="(item, index) in homeTabs">
      <BaseTabPane :label="item.label" :name="item.name" :key="item.name">
        <template v-for="(component, key, index) in $options.components">
          <component
            v-if="component.name === item.name"
            :is="component.name"
            :key="key"
          ></component>
        </template>
      </BaseTabPane>
    </template>
  </BaseTabs>
</template>

<script>
/**
 * @description 课程介绍、师资介绍、活动介绍
 */
import BaseTabs from "../../components/tabs/BaseTabs";
import BaseTabPane from "../../components/tabs/BaseTabPane";
import DescCourse from "./DescCourse";
import DescTeacher from "./DescTeacher";
import DescClub from "./DescClub";
export default {
  name: "Description",
  components: {
    BaseTabs,
    BaseTabPane,
    DescCourse,
    DescTeacher,
    DescClub,
  },
  data() {
    return {
      studio: {},
      activeName: "DescTeacher", // 当前激活项
      homeTabs: [
        {
          label: "课程介绍",
          name: "DescCourse",
        },
        {
          label: "师资介绍",
          name: "DescTeacher",
        },
        {
          label: "活动介绍",
          name: "DescClub",
        },
      ],
    };
  },
  methods: {
    change() {
      console.log("change");
    },
  },
};
</script>
