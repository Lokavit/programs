<!--
 * @Descripttion:
 * @Author: border-1px
 * @Date: 2019-09-27 08:25:56
 * @LastEditTime: 2020-03-09 13:15:39
 -->
<template>
  <div
    :class="[
      'form-search',
      'box-shadow',
      column ? 'form-search-column' + column : '',
      labelAlign ? 'form-label-align-' + labelAlign : ''
    ]"
  >
    <el-form
      ref="formSearch"
      label-position="left"
      :model="formModel"
      :rules="formRules"
      :label-width="labelWidth"
      size="mini"
    >
      <form-search-item
        v-for="(item, index) in formConfig"
        :key="index"
        v-model="formModel[item.key]"
        :form-item-config="item"
        :style="style"
        v-bind="item"
      />

      <slot />

    </el-form>

    <div v-if="btnLayout.length" class="form-search-btns">
      <el-button v-if="btnLayout.includes('search')" type="primary" size="mini" @click="search">
        {{ $t('shipInfo.formSearch.search') }}
      </el-button>
      <el-button v-if="btnLayout.includes('reset')" size="mini" @click="reset">
        {{ $t('shipInfo.formSearch.reset') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import FormSearchItem from './FormSearchItem.vue'

export default {
  name: 'FormSearch',
  provide() {
    return {
      formSearch: this
    }
  },
  components: {
    FormSearchItem
  },
  props: {
    formConfig: {
      type: [Object, Array],
      required: true
    },
    column: {
      type: Number,
      default: 1
    },
    labelWidth: {
      type: String,
      default: '80px'
    },
    labelAlign: {
      type: String,
      default: 'right'
    },
    gutter: {
      type: String,
      default: '20'
    },
    btnLayout: {
      type: Array,
      default() {
        return ['search', 'reset']
      }
    }
  },
  data() {
    return {
      children: [],
      formModel: this.buildFormModel(),
      formRules: this.buildFormRules()
    }
  },
  computed: {
    style() {
      const ret = {}

      if (this.gutter) {
        ret.paddingLeft = `${this.gutter / 2}px`
        ret.paddingRight = ret.paddingLeft
      }

      return ret
    }
  },
  methods: {
    buildFormModel() {
      var ret = {}
      this.formConfig.forEach(item => {
        ret[item.key] = ''
      })
      return ret
    },
    buildFormRules() {
      var ret = {}
      this.formConfig.forEach(item => {
        ret[item.key] = item.rules
      })
      return ret
    },
    search() {
      // 深复制版
      // var data = {}
      // this.cloneFormConfig.forEach(item => {
      //   data[item.key] = item.value
      // })

      this.$emit('search', this.formModel)
    },
    reset() {
      this.$refs['formSearch'].resetFields()
    }
  }
}
</script>

<style lang="scss">

.form-search{
  padding: 12px 0 8px 0;
  background-color: #FFF;
  display: flex;
  .el-form {
    flex:1;
    display: flex;
    flex-wrap: wrap;
    &-item{
      flex: 0 1 100%;
      margin-bottom: 5px;
      &__label{
        font-size: 12px;
        font-weight: bold;
        color:#7D7D7D;
      }
      &.form-label-align-left{
        .el-form-item__label{
          text-align: left!important;
        }
      }
      &.form-label-align-center{
        text-align: center!important;
      }
      &.form-label-align-right{
        text-align: right!important;
      }
    }
    .el-select {
      width: 100%;
    }
  }
  .form-search-btns{
    padding: 0 15px;
  }
  // formMod整体配置label位置
  &.form-label-align-left{
    .el-form-item__label{
      text-align: left!important;
    }
  }
  &.form-label-align-center{
    text-align: center!important;
  }
  &.form-label-align-right{
    text-align: right!important;
  }
  &-column2{
    .el-form-item{
      flex: 0 1 50%;
      &.fill{
        flex: 0 1 100%;
      }
    }
  }
  &-column3{
    .el-form-item{
      flex: 0 1 33.33%;
      &.fill{
        flex: 0 1 100%;
      }
    }
  }
  &-column4{
    .el-form-item{
      flex: 0 1 25%;
      &.fill{
        flex: 0 1 100%;
      }
    }
  }
}
</style>
