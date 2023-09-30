<template>
  <div id="app">
    <Header :logo="studio.logo"></Header>
    <BaseTabs v-model="activeName" :onChange="change">
      <template v-for="(item, index) in tabs">
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
  </div>
</template>

<script>
import Header from "./layout/Header";
import BaseTabs from "./components/tabs/BaseTabs";
import BaseTabPane from "./components/tabs/BaseTabPane";
import Home from "./views/Home";
import CreationTool from "./views/CreationTool";
import NewClub from "./views/NewClub";
import MatchClub from "./views/MatchClub";
import OnlineCourse from "./views/OnlineCourse";
import Gallery from "./views/Gallery";
import PlayAndLearn from "./views/PlayAndLearn";
import MaterialLibrary from "./views/MaterialLibrary";
import { getStudioInfo } from "./api/studio";
export default {
  name: "App",
  components: {
    Header,
    BaseTabs,
    BaseTabPane,
    Home,
    CreationTool,
    NewClub,
    MatchClub,
    OnlineCourse,
    Gallery,
    PlayAndLearn,
    MaterialLibrary,
  },
  data() {
    return {
      studio: {
        logo: "",
      },
      activeName: "Home",
      tabs: [
        {
          label: "首页",
          name: "Home",
        },
        {
          label: "创作工具",
          name: "CreationTool",
        },
        // {
        //   label: "最新活动",
        //   name: "NewClub",
        // },
        {
          label: "在线课程",
          name: "OnlineCourse",
        },
        {
          label: "作品展示",
          name: "Gallery",
        },
        // {
        //   label: "边玩边学",
        //   name: "PlayAndLearn",
        // },
        // {
        //   label: "素材库",
        //   name: "MaterialLibrary",
        // },
        {
          label: "赛事活动",
          name: "MatchClub",
        },
      ],
    };
  },

  watch: {},
  mounted() {
    this.getStudioBaseInfo();
  },
  methods: {
    change(val) {},

    // 这里根据url参数值，异步获取对应机构信息
    async getStudioBaseInfo() {
      let tem_id = new URLSearchParams(window.location.search).get("studioId");
      const res = await getStudioInfo(tem_id);
      if (res.success) {
        this.studio.logo = res.studio.coverUrl;
        this.studio.name = res.studio.name;
      }
    },
  },
};
</script>
