<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-09 17:46:47
 * @LastEditTime: 2019-11-13 13:43:20
 -->
<template>
  <div class="dock-item">
    <div class="dock-item-left" >
      <form-search :form-config="formSearchConfig" @search="search" :btn-layout="['search']"></form-search>
      <div class="separation-line"></div>

      <transition name="fade" mode="out-in">
        <div class="dock-item-tree" v-if="version">
          <el-scrollbar :native="false" :noresize="false" tag="div">
            <el-tree
              lazy
              node-key="id"
              :props="props"
              :load="loadNode"
              highlight-current
              :empty-text="$t('common.nothing')"
              @node-click="handleNodeClick"
            >
              <template slot-scope="{ node, data }">
                <div class="custom-tree-row">
                  <div>{{ data.code }}</div>
                  <div>{{ data.name }}</div>
                </div>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
        <div v-else class="dock-item-default-text">
          {{ $t('dockItem.defaultText') }}
        </div>
      </transition> 
      
    </div>

    <!-- tree重要,所以定死宽度,防止小屏显示器被压缩 -->
    <div style="width:12px;"></div>

    <div class="dock-item-right" v-if="dockItemDescData">
      <!-- <component :is="componentId" :data="dockItemDescData"></component> -->
        <dock-item-level-one v-show="componentId == 1" :data="dockItemDescData"></dock-item-level-one>
        <dock-item-level-four v-show="componentId == 4" :data="dockItemDescData"></dock-item-level-four>
    </div>
  </div>
</template>
<script>
import FormSearch from '@/components/FormSearch'
import FormSearchMixin from './mixins/FormSearch'
import DockItemLevelOne from './components/DockItemLevelOne'
import DockItemLevelFour from './components/DockItemLevelFour'

import { 
  getTreeLevel1,
  getTreeLevel2,
  getTreeLevel3,
  getTreeLevel4
} from '@/api/dockItem'

export default {
  components: {
    FormSearch,
    DockItemLevelOne,
    DockItemLevelFour
  },
  mixins: [ FormSearchMixin ],
  data() {
    return {
      props: {
        label: 'code',
        isLeaf: 'leaf'
      },
      version: null,
      dockItemDescData:null,
      componentId: null
    };
  },
  methods: {
    search(params){
      this.version = null
      
      this.$nextTick(() => {
        let version = params.version.id
        version && (this.version = version)
      })
    },
    handleNodeClick(data, node, el){
      if(
        node.level == 1 || 
        node.level == 2 || 
        node.level == 3) {
        this.componentId = 1
      } else {
        this.componentId = 4
      }

      this.dockItemDescData = data
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        getTreeLevel1({versionId: this.version}).then(res => {
          resolve(res.data)
        })
      }

      if (node.level === 1) {
        let code = node.data.code

        getTreeLevel2({versionId: this.version, level1Code: code}).then(res => {
          resolve(res.data)
        })
      }

      if (node.level === 2) {
        let code = node.data.code

        getTreeLevel3({versionId: this.version, level2Code: code}).then(res => {
          resolve(res.data)
        })
      }

      if (node.level === 3) {
        let code = node.data.code

        getTreeLevel4({versionId: this.version, standardItemCode: code}).then(res => {
          res.data.forEach(item => { item.leaf = true })
          resolve(res.data)
        })
      }

    }
  }
}
</script>
<style lang="scss">
@import '../../../styles/variables.scss';

.dock-item{
  height: 100%;
  display: flex;
  justify-content: space-between;
  &-left{
    position: relative;
    flex:0 1 38.2%;
    background-color: #FFF;
    box-shadow: 0 0 2px 1px #EAEBED;
    display: flex;
    flex-direction: column;
  }
  &-right{
    flex: 0 1 61.8%;
    background-color: #FFF;
    box-shadow: 0 0 2px 1px #EAEBED;
    position: relative;
  }
  .dock-item-default-text{
    text-align: center;
    padding-top: 40px;
    color: #999;
  }
  // .dock-item-tree
  &-tree{
    flex:1;
    position: relative;
    .el-scrollbar {
      position: absolute;
      left:0;
      right:0;
      top:0;
      bottom:0;
      &__wrap{
        overflow-x: hidden;
      }
    }
  }

  // 自定义row
  .custom-tree-row{
    width:100%;
    padding-right:20px;
    display:flex;
    justify-content: space-between;
  }
  
  // 第一级节点
  .el-tree > div[role="treeitem"] > .el-tree-node__content{
    background-color: $bg-color!important;
    color: $menu-text-color!important;
    border-bottom: 1px solid #FFF;
  }

  // 通用节点
  .el-tree{
    &-node{
      &__content{
        height: 36px;
        font-size: 14px;
        color: #808080;
        background-color: #FFF;
        border-bottom: 1px solid #EDEEF0;
        &:hover{
          background-color: #F6F7FB;
        }
      }
    }
    span.is-leaf:before{
      content: ''
    }
  }

}
</style>