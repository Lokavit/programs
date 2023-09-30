<template>
  <li class="spec-tree-row">
    <div class="row-title">
      <slot name="treeTitle">
        <tree-header
          ref="treeTitle"
          :region="(index + 1) + '.' + item.code"
          :budget="budgetFormat()"
          @treeCheck="treeClick($event, item, index)"
        >
          <span slot="operating" class="add" @click.stop="addClick(item)"><i class="el-icon-plus" /></span>
        </tree-header>
      </slot>
    </div>

    <el-collapse-transition>
      <div v-show="isActive">
        <div class="row-header">
          <slot name="treeChildTitle">
            <div style="width:24px;height:10px;" />
            <div class="row-header-part">
              <div class="text code"><span>{{ $t('specification.overview.treeChildHeader.code') }}</span></div>
              <div class="text name">{{ $t('specification.overview.treeChildHeader.name') }}</div>
            </div>
            <div class="row-header-part">
              <div class="text">{{ $t('specification.overview.treeChildHeader.budget') }}</div>
              <div class="text">{{ $t('specification.overview.treeChildHeader.selfRepair') }}</div>
              <div class="text">{{ $t('specification.overview.treeChildHeader.status') }}</div>
            </div>
            <div class="btn-spec-ops-wrap"><span>{{ $t('common.ops') }}</span></div>
          </slot>
        </div>

        <template v-if="item.data && item.data.length > 0">
          <tree-item
            :child-data="item.data"
            @linkClick="linkClick"
            @treeChildDelete="treeChildDelete"
          />
        </template>
        <div v-else class="empty-holder">
          <span class="nothing">{{ $t('common.nothing') }}</span>
        </div>

      </div>
    </el-collapse-transition>
  </li>
</template>
<script>
import TreeHeader from './TreeHeader'
import TreeItem from './TreeItem'

export default {
  components: {
    TreeHeader,
    TreeItem
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: {
      type: Number || String,
      default: 0
    }
  },
  data() {
    return {
      isActive: false
    }
  },
  computed: {
    currencyType() {
      return this.$store.state.specification.currencyType
    }
  },
  methods: {
    budgetFormat() {
      let sum = 0
      this.item.data.forEach(it => { sum += (it.budget || 0) })
      return this.currencyFormat(sum) + '  ' + this.currencyType
    },
    treeClick(bool, item, index) {
      this.isActive = bool
      this.$emit('treeClick', item, index)
    },
    linkClick(child, c_index, status) {
      this.$emit('linkClick', this.item, child, c_index, status)
    },
    treeChildDelete(child, c_index) {
      this.$emit('treeChildDelete', child, c_index)
    },
    addClick(item) {
      this.$emit('addClick', item)
    }
  }
}
</script>
<style lang="scss">
@import '../../../../../styles/variables.scss';

// hack,很不好
.btn-spec-ops-wrap{
  width: 100px;
  font-weight: 600;
  overflow: hidden;
  white-space:nowrap;
  text-overflow: ellipsis;
  padding: 4px  10px 4px 0;
  position: relative;
  display: flex;
  align-items: center;
}

.spec-tree-row{
  overflow: hidden;
  width: 100%;
  height: auto;
  margin-top:2px ;
  .row-title{
    display: flex;
    padding-left: 8px;
    background-color:rgba(30,52,107,1);
    border-right: 1px solid rgba(170,179,199,1);
    border-left:1px solid rgba(170,179,199,1);
    color:$menu-text-color;
    align-items: center;
    .dock{
      flex:1;
    }
    .add{
      width: 25px;
      height: 100%;
      font-size: 18px;
      i{
        font-weight: bold !important;
      }
    }
  }

  .row-header{
    display: flex;
    font-size: 12px;
    border-bottom:2px solid rgba(215,215,215,1);
    font-weight: bold;

    // row-header内部header
    &-part{
      display: flex;
      flex:1;
      .text{
        flex:1;
        font-size: 12px;
        padding: 8px 10px 8px 0;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        &.status span{
          // 状态前面有个点，所以要对齐一下
          margin-left: 10px;
        }
      }
      .code{
        min-width: 100px;
        max-width:200px;
      }
      .name{
        flex: 1 ;
        padding: 8px 10px 8px 0;
        box-sizing: border-box;
      }
    }
  }
}

</style>
