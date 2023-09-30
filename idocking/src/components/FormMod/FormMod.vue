<!--
 * @Descripttion: ddd
 * type:
    0 普通 —— 增加/编辑
    1 高级 —— 只读(icon、标题)
    2 高级 —— 查看/保存(icon、标题、编辑按钮)
    3 高级 —— 编辑(icon、标题、保存、取消)
    4 高级 —— 取消(同1，但会进行数据回退)
 * @Author: border-1px
 * @Date: 2019-09-27 08:25:56
 * @LastEditTime: 2020-03-09 13:08:20
 -->
<template>
  <div class="dyform-section">

    <!-- 表头 -->
    <div 
      v-if="showHeader && type !== 0" 
      :class='[
        "info-title",
        { striking : striking }
      ]'
    >
      <i class="kft-icon-volumn" />
      <span style="margin:0 10px;">{{ title }}</span>
      <span v-if="toolbar" class="cursor" style="position:relative;top:1px;">
        <span v-if="!editing" @click="editIt">
          <svg-icon width="12" height="12" name="edit" />
        </span>
        <span v-else>
          <span @click="saveIt">
            <svg-icon width="12" height="12" name="save" />
          </span>
          <span @click="cancelIt">
            <svg-icon width="12" height="12" name="close" />
          </span>
        </span>
      </span>
    </div>

    <div
      :class="[
        'dy-form',
        column ? 'dy-form-column' + column : '',
        labelAlign ? 'form--label-align-' + labelAlign : ''
      ]"
    >
      <el-form
        ref="formMod"
        :model="formModel"
        :rules="formRules"
        label-position="left"
        :label-width="labelWidth"
        size="mini"
      >
        <form-mod-item
          v-for="(item, index) in formConfig"
          :key="index"
          v-model="formModel[item.key]"
          :form-item-config="item"
          :style="style"
          :editing="editing"
          v-bind="item"
        />

      </el-form>

      <slot />
    </div>
  </div>
</template>

<script>
import { deepCopy } from '@/utils/assist'
import FormModItem from './FormModItem.vue'

export default {
  name: 'FormMod',
  provide() {
    return {
      formMod: this
    }
  },
  components: {
    FormModItem
  },
  props: {
    striking: {
      type: Boolean,
      default: false
    },
    formConfig: {
      type: [Object, Array],
      required: true
    },
    syncSave: {
      type: Boolean,
      default: true
    },
    paddingLeft: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    column: {
      type: Number,
      default: 1
    },
    formData: {
      type: [Object, Array],
      default: () => {
        return {}
      }
    },
    title: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    labelAlign: {
      type: String,
      default: 'left'
    },
    labelWidth: {
      type: String,
      default: '120px'
    },
    gutter: {
      type: String,
      default: '20'
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 用来通知form组件、slot组件状态！
      children: [],
      mode: this.type,
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
    },
    // 只给表单组件使用，slot组件使用mode
    editing() {
      if (this.mode === 0 || this.mode === 3) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    // 异步数据返回后，过滤表单实际需要的数据
    formData: {
      handler(newValue) {
        if (!newValue) return

        Object.keys(this.formModel).forEach(key => {
          this.formModel[key] = newValue[key]
        })
      }
    },
    mode(curMode) {
      // 向slot组件派发组件状态
      this._dispatchState(curMode)

      // form组件，编辑/非编辑状态逻辑
      if (curMode === 3) { // 高级编辑
        this.cloneFormModel = deepCopy(this.formModel)
      } else if (curMode === 4) { // 取消保存
        this.formModel = deepCopy(this.cloneFormModel)
      }
    }
  },
  methods: {
    _dispatchState() {
      this.children.forEach(child => {
        child._triggerState && child._triggerState(this.mode)
      })
    },
    _triggerState(mode) {
      this.mode = mode
    },
    _triggerSaveState() {
      this.mode = 2
    },
    _triggerEditState() {
      this.mode = 3
    },
    _triggerCancelState() {
      this.mode = 4
    },
    _getSelfState() {
      return this.mode
    },
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
    _getSelfData() {
      return this.formModel
    },
    resetForm() {
      this.$refs['formMod'].resetFields()
    },
    validate() {
      this.$refs['formMod'].validate((valid) => {
        if (valid) {
          return true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    saveIt() {
      (this.syncSave) && (this.mode = 2)

      // 1、根据formConfig筛选出的表单数据
      const formData = this.formModel

      // 2、slot组件(定义了_getSelfData())的数据
      const slotCompData = {}
      this.children.forEach(child => {
        (child._getSelfData) && Object.assign(slotCompData, child._getSelfData())
      })

      this.$emit('saveIt', Object.assign({}, formData, slotCompData))
    },
    editIt() {
      this.mode = 3
      this.$emit('editIt')
    },
    cancelIt() {
      this.mode = 4
      this.$emit('cancelIt')
    }
  }
}
</script>

<style lang="scss">
.dy-form{
  .el-form {
    display: flex;
    flex-wrap: wrap;
    &-item{
      flex: 0 1 100%;
      margin-bottom: 5px;
      box-sizing: border-box;
      &__label{
        font-size: 13px;
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
      &.hide{
        display: none;
      }
      &.no-label{
        // 没写label属性，表示不需要label
        .el-form-item__content{
          margin-left:0!important;
        }
      }
      &.padding-left{
        .el-form-item__label {
          padding-left: 9px;
        }
      }
    }
    .el-select {
      width: 100%;
    }
    .el-cascader{
      width: 100%;
    }
    // partner控件样式
    .el-input.is-disabled .el-input__inner {
      color:#606266!important;
      // background-color: #F5F7FA;
      // border-color: #E4E7ED;
      // cursor: not-allowed;
    }

  }
  &.form--label-align-left{
    .el-form-item__label{
      text-align: left!important;
    }
  }
  &.form--label-align-center{
   .el-form-item__label{
      text-align: center!important;
    }
  }
  &.form--label-align-right{
   .el-form-item__label{
      text-align: right!important;
    }
  }
  &-column2{
    .el-form-item{
      flex: 0 1 50%;
      &.fill{
        flex: 0 1 100%;
      }
      &.hide{
        display: none;
      }
    }
  }
  &-column3{
    .el-form-item{
      flex: 0 1 33.33%;
      &.fill{
        flex: 0 1 100%
      }
      &.hide{
        display: none;
      }
    }
  }
  &-column4{
    .el-form-item{
      flex: 0 1 25%;
      &.fill{
        flex: 0 1 100%
      }
      &.hide{
        display: none;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
@import '../../styles/variables.scss';

.dyform-section{
  width: 100%;
  .info-title{
    box-sizing: border-box;
    font-weight: bold;
  }
  .info-title {
    color:#2E2F2F;
  }
  .info-title.striking {
    color: $title-color;
  }

  svg {
    margin-right: 10px;
  }
}
</style>
