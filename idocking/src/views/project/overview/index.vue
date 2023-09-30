<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 17:46:47
 * @LastEditTime: 2019-10-25 13:20:34
 -->
<template>
  <div class="project-overview-routerview">
    <div class="project-stage">
      <el-button
        v-for="(stage, index) in stages"  
        @click="routeTo(stage.url)"
        :key="stage.name"
        type="primary" 
        size="mini"
        round 
        plain
        :class="[
          'btn-stage',
          {'btn-overview': index === 0},
          {'btn-stage-active': stage.url.name === $route.name}
        ]"
      >
        {{ $t(stage.name) }}
      </el-button>
    </div>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      projectId:this.$route.query.id,
      stages:[
        { name: "project.step.overview", url: { name: 'project_overview', query:{ id: this.$route.query.id, name: this.$route.query.name }}, icon: "" },
        // {name: "project.step.spec", url:{}, icon: ""},
        // {name: "project.step.quote", url: "", icon: ""}
      ]
    }
  },
  methods: {
    routeTo(path) {
      this.$router.push(path)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../../styles/variables.scss';

.project-overview-routerview{
  .project-stage{
    width: 100%;
    padding:5px 0 15px 0;
  }
  .btn-stage{
    background-color: #DAE0EC!important;
    border-color: $main-border;
    color: $main-border;
  }
  .btn-stage-active,
  .btn-stage:hover, 
  .btn-stage:focus{
    background: $main-bg!important;
    border-color: $main-border!important;
    color: #FFF!important;
    position: relative;
    &:before{
      content: '';
      border-left: 7px solid transparent; 
      border-right: 7px solid transparent; 
      border-bottom: 7px solid rgb(255,255,255); 
      position: absolute;
      bottom: -15px;
      left:50%;
      margin-left:-7px; 
    }
  }
  // .btn-overview{
  //   background: #F4E6E0!important;
  //   border-color: #AE5C30!important;
  //   color:#F8835E!important;
  // }
  // .btn-overview-active,
  // .btn-overview:hover, 
  // .btn-overview:focus{
  //   background: #F8835E;
  //   border-color: #AE5C30;
  //   color: rgba(255,255,255,1);
  //   position: relative;
  //   &:before{
  //     content: '';
  //     border-left: 7px solid transparent; 
  //     border-right: 7px solid transparent; 
  //     border-bottom: 7px solid rgb(255,255,255); 
  //     position: absolute;
  //     bottom: -15px;
  //     left:50%;
  //     margin-left:-7px; 
  //   }
  // }
}
</style>