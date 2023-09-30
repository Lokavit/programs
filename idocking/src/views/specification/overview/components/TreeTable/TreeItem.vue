<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-05 13:17:38
 * @LastEditTime: 2019-11-19 13:55:28
 -->
<template>
  <transition-group name="move-row" tag="ul" mode="out-in">
    <li class="spec-tree-child treeChildBody" v-for="(child, c_index) in childData" :key="child.id">
      <slot name="treeChildBody">
        <div style="width:24px;height:10px;"></div>
        <div class="row-header-part">
          <div class="text code">
            <span>{{child.code}}</span>
          </div>
          <div class="text name">
            <a href="javaScript:;" class="cursor" @click.prevent="linkClick(child, c_index, child.status)"> {{ child.name }}</a>    
          </div>
        </div>
        <div class="row-header-part">
          <div class="text">{{ (child.budget || 0) | currencyFormat }}  {{ currencyType }}</div>
          <div class="text">{{ $t(selfRepairMap(child.selfRepair)) }}</div>
          <div class="text status">
            <span :class="
              [
                'project-status',
                true ? 'project-status-' + child.status : ''
              ]"
            >
              {{ $t(projectStatusMap(child.status)) }}
            </span>
          </div>
        </div>

        <div class="btn-spec-ops-wrap">
          <!--
          <div class="btn-table-ops" @click="treeChildDelete(child, c_index)">
            <i class="el-icon-remove"></i>
          </div> 
          -->
          <div class="btn-table-ops" @click="moveWork($event, 'prve', c_index)">
            <i class="el-icon-top moveIcon" 
            :class="c_index==0&&'disMoveIcon'"></i>
          </div>
          <div class="btn-table-ops"  @click="moveWork($event, 'next', c_index)">
            <i class="el-icon-bottom moveIcon" 
            :class="c_index==childData.length-1&&'disMoveIcon'" ></i>
          </div>
        </div>
        
      </slot>
    </li>
  </transition-group>
</template>
<script>
import { exchangeDockItemOrder } from '@/api/specification';

export default {
  props: {
    childData: {
      type: Array
    }
  },
  computed:{
    currencyType() {
      return this.$store.state.specification.currencyType
    }
  },
  methods: {
    treeChildDelete( child, c_index){
      this.$emit('treeChildDelete', child, c_index)
    },
    linkClick(child, c_index, status) {
      this.$emit('linkClick', child, c_index, status)
    },
    moveWork(e, direction, index) { // 工作项调换顺序
      let el = e.srcElement.parentNode.parentNode;
      if(direction == 'next') {
        if(index == this.childData.length-1) return;
        this.swapSequence(el, 1, index)
      }else {
        if(index == 0) return;
        this.swapSequence(el, -1, index)
      }
    },
    async swapSequence(el, direction, index) { // 调换顺序接口方法
      let time = null;
      try {
        let params = {
          anotherId: this.childData[index].id,
          id: this.childData[index + direction].id
        }
        let res =  await exchangeDockItemOrder(params)
      }
      catch(err) {
        return;
      }

      let target = this.childData[index];
      this.childData.splice(index, 1);
      this.childData.splice(index + direction, 0, target);
    }
  }
}
</script>

<style lang="scss">
@import '../../../../../styles/variables.scss';
a.cursor{
  text-decoration: underline;
}
.spec-tree-child{
  display: flex;
  background-color: #F6F7FB;
  border-bottom: 1px solid #EAEBED;
  .operating i{
    cursor: pointer;
  }
  .code{
    color: $tree-table-row-text
  }
  .name{
    color: $tree-table-row-text
  }
}

</style>