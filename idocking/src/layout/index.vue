<!--
 * @Descripttion: Layout布局
 * @Author: border-1px
 * @Date: 2019-10-09 10:34:18
 * @LastEditTime: 2019-11-28 16:03:42
 -->
<template>
  <el-container id="container">
    <el-aside>
      <nav-left :navList = "navList"></nav-left>
    </el-aside>

    <el-container>
      <el-header>
        <nav-header></nav-header>
      </el-header>

      <el-main>
        <nav-main></nav-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavLeft from './components/NavLeft'
import NavHeader from './components/NavHeader'
import NavMain from './components/NavMain'

export default {
  name: 'layout',
  components: {
    NavLeft,
    NavHeader,
    NavMain
  },
  data() {
    return{
      navList: []
    }
  }
}
</script>

<style lang = "scss">
#container{
  height:100vh;
  overflow: hidden;
  
  .el-header {
    height:48px!important;
    line-height:48px;
    font-size: 12px;
    text-align: right;
    background-color:rgb(255,255,255);
    box-shadow: 0 0 3px 2px rgba(0,0,0,0.2);
  }

  .el-aside{
    overflow: hidden;
    width: 200px!important;
    background-color: rgb(32, 51, 93);
  }
  
  .el-main{
    position:relative;top:3px;
    background-color:rgb(243,244,246);
  }
}
</style>