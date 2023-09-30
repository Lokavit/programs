<!--
 * @Descripttion: a
 * @Author: border-1px
 * @Date: 2019-09-27 08:33:52
 * @LastEditTime: 2020-03-09 13:17:17
 -->
<template>
  <el-form-item
    ref="formItem"
    :prop="formItemConfig.key"
    :rules="formItemConfig.rules"
    :class="[
      { 'fill' : formItemConfig.fill },
      formItemConfig.labelAlign ? 'form-label-align-' + formItemConfig.labelAlign : ''
    ]"
    :label-width="formItemConfig.labelWidth"
    :label="formItemConfig.rawLabel ? formItemConfig.label : $t(formItemConfig.label)"
  >
    <template v-if="formItemConfig.labelRender" v-slot:label>
      <label-render :form-mod="formSearch" :form-item-config="formItemConfig" :render="formItemConfig.labelRender" />
    </template>

    <template v-if="formItemConfig.type==='text'">
      <el-input
        :type="formItemConfig.subtype"
        :disabled="formItemConfig.disable"
        :placeholder="$t(formItemConfig.placeholder)"
        v-bind="$attrs"
        v-on="$listeners"
      />
    </template>

    <template v-else-if="formItemConfig.type==='select'">
      <!-- select选中值取字符串值(value) -->
      <template v-if="formItemConfig.valueType && formItemConfig.valueType == 'string'">
        <el-select
          :placeholder="$t(formItemConfig.placeholder)"
          v-bind="$attrs"
          v-on="$listeners"
        >
          <el-option
            v-for="option in formItemConfig.options || ajaxOptions"
            :key="option.value"
            :label="$t(option.name)"
            :value="option.value"
          >
            <span v-if="formItemConfig.layout && formItemConfig.layout.length" class="select-layout-label">{{ option[formItemConfig.layout[0]] }}</span>
            <span v-if="formItemConfig.layout && formItemConfig.layout.length" class="select-layout-value">{{ option[formItemConfig.layout[1]] }}</span>
          </el-option>

        </el-select>
      </template>

      <!-- select选中值取option对象值(默认) -->
      <template v-else>
        <el-select
          v-bind="$attrs"
          value-key="id"
          :placeholder="$t(formItemConfig.placeholder)"
          v-on="$listeners"
        >
          <el-option
            v-for="option in formItemConfig.options || ajaxOptions"
            :key="option.id"
            :label="option.name"
            :value="option"
          >
            <span v-if="formItemConfig.layout && formItemConfig.layout.length" class="select-layout-label">{{ option[formItemConfig.layout[0]] }}</span>
            <span v-if="formItemConfig.layout && formItemConfig.layout.length" class="select-layout-value">{{ option[formItemConfig.layout[1]] }}</span>
          </el-option>

        </el-select>
      </template>
    </template>

    <!-- date -->
    <template v-else-if="formItemConfig.type==='date'">
      <el-date-picker
        v-bind="$attrs"
        size="mini"
        type="date"
        :clearable="false"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :placeholder="$t(formItemConfig.placeholder)"
        v-on="$listeners"
      />
    </template>

    <template v-else-if="formItemConfig.type === 'diy'">
      <Render :form-mod="formSearch" :form-item-config="formItemConfig" :render="formItemConfig.render" />
    </template>

    <span v-else>未知类型控件</span>

  </el-form-item>
</template>

<script>
import request from '@/utils/request'
import Render from './Render'
import LabelRender from './LabelRender'

export default {
  name: 'FormSearchItem',
  inject: ['formSearch'],
  components: {
    Render,
    LabelRender
  },
  props: {
    formItemConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      ajaxOptions: []
    }
  },
  mounted() {
    const self = this
    const { optionsUrl } = this.formItemConfig

    if (optionsUrl) {
      request.get(optionsUrl)
        .then(res => {
          self.ajaxOptions = res.data
        })
    }
  }
}
</script>

<style lang="scss">
.text-left {
  text-align: left
}
</style>
