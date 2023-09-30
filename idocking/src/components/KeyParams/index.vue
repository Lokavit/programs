<!--
 * @Descripttion:
 * @Author: border-1px
 * @Date: 2019-11-07 21:16:12
 * @LastEditTime: 2020-03-09 13:28:39
 -->
<template>
  <div class="key-params">
    <ul v-if="editing">
      <li v-if="!data || !data.length" class="kp-item">
        <svg-icon class="key-params-svg" :title="$t('specification.overview.addDockDetailItem.tipKPAdd')" name="add" @click.native="addIt(0, true)" />
      </li>
      <li v-for="(item,index) in data" v-else :key="index" class="kp-item">
        <el-input v-model="item.paramName" class="input" :placeholder="$t('specification.overview.addDockDetailItem.KP_KEY')" /> :
        <el-input v-model="item.value" class="input" :placeholder="$t('specification.overview.addDockDetailItem.KP_VALUE')" />
        <svg-icon class="key-params-svg" style="margin-left:10px;" :title="$t('specification.overview.addDockDetailItem.tipKPAdd')" name="add" @click.native="addIt(index)" />
        <svg-icon class="key-params-svg" :title="$t('specification.overview.addDockDetailItem.tipKPDel')" width="14px" height="14px" name="close" @click.native="delIt(index)" />
      </li>
    </ul>
    <ul v-else>
      <li v-if="!data || !data.length" class="kp-item">
        {{ $t('common.nothing') }}
      </li>
      <li v-for="(item,index) in data" v-else :key="index" class="kp-item-line">
        <div class="kp-item-line-key">{{ item.paramName }}</div> ：
        <div class="kp-item-line-value">{{ item.value }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'KeyParams',
  props: {
    data: Array | Object,
    editing: Boolean
  },
  methods: {
    delIt(index) {
      this.$emit('delKeyParam', index)
    },
    addIt(index, init) {
      this.$emit('addKeyParam', index, init)
    }
  }
}
</script>

<style lang="scss">
.key-params{
  &-svg{
    cursor: pointer;
    margin-right: 10px;
    vertical-align: middle;
  }
  .kp-item{
    text-align: left;
    .input{
      width: 247.5px;
      display: inline-block;
    }
    margin-bottom: 4px;
    &:nth-last-child(1){
      margin-bottom: 0;
    }
    &-svg{
      cursor: pointer;
      margin-right: 15px;
    }
  }
  .kp-item-line{
    > div{
      display: inline-block
    }
  }
}

</style>
