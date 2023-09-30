<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-31 15:14:11
 * @LastEditTime: 2019-11-13 13:41:40
 -->
<template>
  <div class="dock-item-desc">
    <div class="dock-item-desc-header">
      <div class="dock-item-title">{{ $t('dockItem.item') }}</div>
      <div>
        <span class="dock-item-cell dock-item-code">{{ data && data.code }}</span>
        <span class="dock-item-cell dock-item-name">{{ data && data.name }}</span>
      </div>
    </div>

    <div class="dock-item-desc-bodyer one svg-bg-boat">
      <div class="dock-item-desc-bodyer-inner">
        <el-scrollbar>
            <div class="info-title">
              <i class="kft-icon-volumn" style="margin-right:6px;"></i>
              <span>{{ $t('common.description') }}</span>
            </div>
            <div
              v-if="data"
              v-html="data.description || $t('common.nothing')"
              class="dock-item-description">
            </div>
        </el-scrollbar>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'dock-item-level-one',
  props:{
    data: Object | Array
  },
  watch: {
    data(newVal) {
      this.descData = newVal
    }
  },
  data() {
    return {
      descData: null
    }
  }
}
</script>

<style lang="scss">
@import '../../../../styles/variables.scss';

.dock-item-desc {
  height: 100%;
  display: flex;
  flex-flow: column;
  padding: 20px;
  &-header {
    height: 50px;
  }
  &-bodyer {
    flex:1;
    position:relative;
    margin-top: 20px;
    min-height: 300px;
    padding: 20px;
    box-shadow: 0 0 2px 1px #EAEBED;
    &-inner {
      position:relative;
      height:100%;
    }
    .el-scrollbar{
      over-flow:hidden;
      position: absolute;
      top:0;
      left:0;
      right:0;
      bottom:0;
    }
  }
  .dock-item-title{
    color: $title-color;
    font-size: 18px;
    font-weight: bold;
    margin-bottom:10px;
  }
  .dock-item-cell{
    display: inline-block;
    font-weight: bold;
  }
  .dock-item-code{
    margin-right: 30px;
  }
  .dock-item-description{
    color: #808080;
    line-height: 30px;
    font-size: 14px;
  }
}

.svg-bg-boat{
  background-image: url(background-boat.svg);
  background-size: 227px 227px;
  background-repeat: no-repeat;
  background-position: right bottom;
}
</style>