<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 09:59:26
 * @LastEditTime: 2019-11-08 17:34:26
 -->
<template>
  <div class="layout-main">
    <div class="breadcrumb">

      <!-- 面包屑组件 -->
      <el-breadcrumb separator="/">
        <transition-group name="breadcrumb">
          <template v-for="(level,index) in levelListdata" >
            <el-breadcrumb-item :key="level.name + '_' + index" >
              {{ $t(level.meta.title) }}
            </el-breadcrumb-item>
          </template>
        </transition-group>
      </el-breadcrumb>
    </div>
    
    <transition name="fade" mode="out-in">
      <router-view class="router-view"></router-view>
    </transition> 
  </div>

</template>
<script>
export default {
  computed: {
    levelListdata() {
      return this.$route.matched.filter(item => item.meta.title);
    }
  }
}
</script>
<style lang="scss">
.layout-main{
  height: 100%;
  display: flex;
  flex-direction: column;
}
.router-view{
  flex:1;
}
.breadcrumb .el-breadcrumb__item .el-breadcrumb__inner a, .el-breadcrumb__inner.is-link{ // 更改面包屑的样式
  font-weight: 400 !important;
  color:#606266 !important;
}
.el-breadcrumb__item:first-child  .el-breadcrumb__inner{
  font-weight: 900 !important;
  color: #303133 !important; 
}
.breadcrumb{
  width: 100% ;
  padding: 6px 0 16px 0;
}
</style>

