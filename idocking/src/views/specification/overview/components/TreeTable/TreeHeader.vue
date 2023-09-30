<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-05 13:27:55
 * @LastEditTime: 2019-11-07 08:02:36
 -->
<template>
  <div class="spec-tree-table-header" @click="treeCheck">
    <svg-icon v-if="icon" name=""></svg-icon>
    <span v-else class="el-tree-node__expand-icon el-icon-caret-right" :class="isActive&&'expanded'" ></span>
    <div class="item" v-for="(value,key) in $attrs" :key="key">
      <span>{{value}}</span>
    </div>
    <div class="btn-spec-ops-wrap" >
      <slot name="operating">
        <span>{{ $t('common.ops') }}</span>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isCheck: {
      type: Boolean
    },
    icon: {
      type: Boolean,
      default:()=>{
        return false
      }
    }
  },
  data() {
    return{
      isActive: false
    }
  },
  methods: {
    treeCheck() {
      this.isActive = !this.isActive
      this.$emit('treeCheck', this.isActive)
    }
  }
}
</script>

<style lang="scss">

</style>

