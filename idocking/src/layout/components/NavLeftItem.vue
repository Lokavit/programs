<template>
  <!-- 只显示当前级，不显示子集，例如dashboard(有两种情况：1.只显示当前  2.末级节点) -->
  <div v-if="item.meta && !item.meta.hidden">
    <template v-if="(item.meta && item.meta.alone) || !item.children">
      <el-menu-item
        :index="basePath"
        :class="{ 'menu-title': basePath.lastIndexOf('/') === 0 }"
      >
        <item :icon="item.meta && item.meta.icon" :title="$t(item.meta.title)" />
      </el-menu-item>
    </template>

    <template v-else>

      <!-- 菜单组,渲染组名 -->
      <template v-if="item.meta.group">
        <div class="menu-title">
          <div class="el-menu-item-group__title">
            {{ $t(item.meta.title) }}
          </div>
          <nav-left-item
            v-for="child in item.children"
            :key="child.path"
            :is-nest="true"
            :item="child"
            :base-path="resolvePath(child.path)"
            class="nest-menu"
          />
        </div>

      </template>

      <!-- 子菜单 -->
      <template v-else>
        <el-submenu ref="subMenu" :index="basePath" popper-append-to-body>
          <template slot="title" v-if="!item.meta.hidden">
            <item 
              v-if="item.meta"
              class="final-nav-item"
              :icon="item.meta && item.meta.icon" 
              :title="$t(item.meta.title)" 
            />
          </template>
          <nav-left-item
            v-for="child in item.children"
            :key="child.path"
            :is-nest="true"
            :item="child"
            :base-path="resolvePath(child.path)"
            class="nest-menu"
          />
        </el-submenu>
      </template>

    </template>    

  </div>
</template>

<script>
import path from 'path'
import Item from './Item'

export default {
  name: 'NavLeftItem',
  components: { Item },
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  methods: {
    resolvePath(routePath) {
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>

<style lang="scss">
  li.el-submenu{
    ul.el-menu > div span{
      padding-left: 24px!important;
    }
  }
</style>
