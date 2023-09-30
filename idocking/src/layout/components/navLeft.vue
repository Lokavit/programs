<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 09:59:26
 * @LastEditTime: 2019-11-28 16:08:58
 -->
<template>
  <div class="nav-left">  

    <!-- 头部logo -->
    <div class="logo">
      <svg-icon name="logo" width="143" height="32" class="position-logo"></svg-icon>
    </div>

    <!-- 左侧导航菜单 -->
    <div class="left-menu">
      <el-menu
        :default-active="activeMenu"
        :unique-opened="false"
        :collapse-transition="false"
        :router="true"
        mode="vertical">
        <nav-left-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </div>

    <!-- 底部holder图 -->
    <div class="menu-icon">
      <svg-icon name="allboat" width="157" height="157"></svg-icon>
      <span class="copyright">Copyright by Kingfisher , 2019</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NavLeftItem from './NavLeftItem'

export default {
  name: "NavLeft",
  components: { NavLeftItem },
  computed: {
    ...mapGetters([
      'permission_routes'
    ]),
    /**
     * 处理三级路由高亮二级 (不显示三级的情况)
     */
    activeMenu() {
      let currentPath = this.$route.path

      // 有三级子路由，但是左侧菜单栏只显示到二级
      const prefixs = [
        '/management/project',
        '/dockrepair/specification',
        '/dockrepair/quote'
      ]

      let dynamicPath = ''
      prefixs.forEach(prefix => {
        if (currentPath.startsWith(prefix) && currentPath.split('/').length > 3) {
          dynamicPath = prefix
        }
      })

      // 工作台NavLeft只有一级，但实际至少两级，所以其子集需要重定向到顶级
      if (currentPath.startsWith('/dashboard')) {
        return '/dashboard'
      }
      return dynamicPath ? dynamicPath : currentPath
    }
  }
}
</script>

<style lang = "scss">
@import '../../styles/variables.scss';

.position-logo{
  position: relative;
  left:-8px
}

.nav-left{
  height: 100%;
  position: relative;
  box-sizing: border-box;
  .left-menu{
    height: calc(100% - 48px);
    overflow: auto;
  }
  .logo{
    width: 100%;
    height: 48px;
    background-color:#FFF; 
    text-align: center;
    line-height: 48px;
    font-size: 18px;
    color:$color1;
    font-weight: bold;
    letter-spacing:5px;
    font-family: Microsoft YaHei;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .el-menu{
    background-color:inherit;
    border: none;
    text-align: left;
    z-index: 1000;
  }
  .menu-title{
    border-bottom:1px solid #616E90;  
  }
  .el-menu-item-group__title{
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    color: #417abb;
    box-sizing: border-box;
    font-weight: bold;
    padding: 0 0 0 20px;
  }
  .el-menu-item{
    height: 44px;
    line-height: 44px;
    color: #b6bfcd;
    svg {
      position: relative;
      top:-1px;
      margin-right: 8px;
    }
    span{
      font-weight: bold;
    }
  }
  .el-menu-item:focus, .el-menu-item:hover{
    background-color:#2e2f2f;
  }
  .el-menu-item.is-active{
    color: #b6bfcd;
    background-color:#2e2f2f;
    &:after{
      content:"";
      border-right:8px solid rgba(255,255,255,1);
      border-bottom: 7px solid transparent;
      border-top: 7px solid transparent;
      position: absolute;
      right:0;
      top:50%;
      margin-top:-7px; 
    }
  }
  .el-submenu{
    /* 可折叠二级菜单最顶级 */
    .el-submenu__title{
      height: 44px!important;
      line-height: 44px!important;
      color: #b6bfcd;
      &:hover{
        background-color:#2e2f2f;
      }
      &:focus{
        background-color:#2e2f2f;
      }
      svg {
        position: relative;
        top:-1px;
        margin-right: 8px;
      }
      span{
        font-weight: bold;
      }
      .el-icon-arrow-down:before{
        content: '\e790'
      }
    }
    /* 可折叠二级菜单——菜单项 */
    .el-menu-item{
      height: 30px!important;
      line-height: 30px!important;
      color: #7A849C;
      padding:0 20px!important;
      span{
        font-size: 12px;
        font-weight: bold;
      }
    }
  }
  .menu-icon{
    width:100%;
    height:157px;
    opacity: .1;
    position: absolute;
    text-align: center;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    .copyright{
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      color:#616E90;
      font-size: 10px;
      font-weight: bold;
      white-space: nowrap;
    }
  }
}
</style>
