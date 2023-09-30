<!--
 * @Descripttion:
 * @Author: border-1px
 * @Date: 2019-09-27 08:33:52
 * @LastEditTime: 2020-03-09 13:09:35
 -->
<template>
  <el-form-item
    :prop="formItemConfig.key"
    :rules="formItemConfig.rules"
    :class="[
      {'fill': formItemConfig.fill},
      {'hide': formItemConfig.hidden},
      {'no-label': !formItemConfig.label},
      {'padding-left': formItemConfig.paddingLeft}
    ]"
    :label="formItemConfig.rawLabel ? formItemConfig.label : $t(formItemConfig.label)"
  >
    <template v-if="formItemConfig.labelRender" v-slot:label>
      <label-render
        :form-mod="formMod"
        :form-item-config="formItemConfig"
        :render="formItemConfig.labelRender"
      />
    </template>

    <!-- input -->
    <template v-if="formItemConfig.type==='text'">
      <template v-if="editing && !formItemConfig.readonly">
        <el-input
          :type="formItemConfig.subtype"
          :placeholder="$t(formItemConfig.placeholder)"
          :disabled="formItemConfig.disable"
          v-bind="$attrs"
          v-on="$listeners"
        />
      </template>
      <template v-else>
        <div class="text-left">{{ $attrs.value || '' }}</div>
      </template>
    </template>

    <!-- input -->
    <template v-else-if="formItemConfig.type==='password'">
      <template v-if="editing && !formItemConfig.readonly">
        <el-input
          show-password
          v-bind="$attrs"
          :type="formItemConfig.subtype"
          :placeholder="$t(formItemConfig.placeholder)"
          :disabled="formItemConfig.disable"
          v-on="$listeners"
        />
      </template>
      <template v-else>
        <div class="text-left">{{ $attrs.value || '' }}</div>
      </template>
    </template>

    <!-- select -->
    <template v-else-if="formItemConfig.type==='select'">
      <template v-if="!editing || formItemConfig.readonly">
        <!-- 解决值为string的select显示问题 -->
        <div v-if="formItemConfig.valueType && formItemConfig.valueType == 'string'" class="text-left">{{ $t(strValueSelectShow($attrs.options, $attrs.value)) }}</div>
        <div class="text-left">{{ $attrs.value && $attrs.value.name }}</div>
      </template>
      <template v-else>

        <!-- select选中值取字符串值(value) -->
        <template v-if="formItemConfig.valueType && formItemConfig.valueType == 'string'">
          <el-select
            v-bind="$attrs"
            :placeholder="$t(formItemConfig.placeholder)"
            v-on="$listeners"
          >
            <el-option
              v-for="option in formItemConfig.options || ajaxOptions"
              :key="option.value"
              :label="formItemConfig.strValue ? $t(option) : $t(option.name)"
              :value="formItemConfig.strValue ? option :option.value"
            >
              <!-- select的option自定义布局(左右两列) -->
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
              <!-- select的option自定义布局(左右两列) -->
              <span v-if="formItemConfig.layout && formItemConfig.layout.length" class="select-layout-label">{{ option[formItemConfig.layout[0]] }}</span>
              <span v-if="formItemConfig.layout && formItemConfig.layout.length" class="select-layout-value">{{ option[formItemConfig.layout[1]] }}</span>
            </el-option>

          </el-select>
        </template>
      </template>
    </template>

    <!-- radio -->
    <template v-else-if="formItemConfig.type==='radio'">
      <template v-if="!editing || formItemConfig.readonly">
        <div class="text-left">{{ $t(selfRepairMap($attrs.value)) }}</div>
        <!-- <el-radio
          v-for="(option, index) in formItemConfig.options"
          :key="index"
          :disabled="true"
          v-bind="$attrs"
          v-on="$listeners"
          :label="option.value"
        >{{ $t(option.name) }}</el-radio> -->
      </template>
      <template v-else>
        <el-radio
          v-for="(option, index) in formItemConfig.options"
          :key="index"
          v-bind="$attrs"
          :label="option.value"
          v-on="$listeners"
        >{{ $t(option.name) }}</el-radio>
      </template>
    </template>

    <!-- checkbox -->
    <template v-else-if="formItemConfig.type==='checkbox'">
      <template v-if="!editing || formItemConfig.readonly">
        <div class="text-left">
          <el-checkbox disabled v-bind="$attrs">{{ formItemConfig.name }}</el-checkbox>
        </div>
      </template>
      <template v-else>
        <el-checkbox
          v-bind="$attrs"
          v-on="$listeners"
        >
          {{ formItemConfig.name }}
        </el-checkbox>
      </template>
    </template>

    <!-- date -->
    <template v-else-if="formItemConfig.type==='date'">
      <template v-if="!editing || formItemConfig.readonly">
        <div class="text-left">{{ $attrs.value }}</div>
      </template>
      <template v-else>
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
    </template>

    <!-- textarea -->
    <template v-else-if="formItemConfig.type==='textarea'">
      <template v-if="!editing || formItemConfig.readonly">
        <div class="textarea-left" v-html="$attrs.value" />
      </template>
      <template v-else>
        <el-input
          v-bind="$attrs"
          type="textarea"
          rows="5"
          :placeholder="$t(formItemConfig.placeholder)"
          :disabled="formItemConfig.disable"
          v-on="$listeners"
        />
      </template>
    </template>

    <template v-else-if="formItemConfig.type === 'richtext'">

      <div v-if="!editing || formItemConfig.readonly" class="textarea-left" v-html="$attrs.value" :style="richtext_viewstyle"/>

      <rich-text
        v-show="editing"
        :minHeight="formItemConfig.minHeight"
        :maxHeight="formItemConfig.maxHeight"
        v-bind="$attrs"
        v-on="$listeners"
      />

    </template>

    <!-- 不可编辑，最佳使用方式由diy组件选中后进行赋值 -->
    <template v-else-if="formItemConfig.type === 'partner'">
      <template v-if="!editing || formItemConfig.readonly">
        <div class="text-left">{{ $attrs.value && $attrs.value.name }}</div>
      </template>

      <template v-else>
        <el-input
          v-bind="$attrs"
          :value="$attrs.value && $attrs.value.name"
          type="input"
          :placeholder="$t(formItemConfig.placeholder)"
          :disabled="true"
          v-on="$listeners"
        />
      </template>
    </template>

    <template v-else-if="formItemConfig.type === 'diy'">
      <template v-if="!editing || formItemConfig.readonly">
        <div v-if="$attrs.value && $attrs.value.name" class="text-left">{{ $attrs.value.name }}</div>
        <div v-else class="text-left">{{ $attrs.value }}</div>
      </template>

      <template v-else>
        <Render :form-mod="formMod" :form-item-config="formItemConfig" :render="formItemConfig.render" />
      </template>
    </template>

    <template v-else-if="formItemConfig.type === 'comp'">
      <Render :form-mod="formMod" :form-item-config="formItemConfig" :render="formItemConfig.render" />
    </template>

    <span v-else>未知类型控件</span>

  </el-form-item>
</template>

<script>
import Render from './Render'
import request from '@/utils/request'
import LabelRender from './LabelRender'
import RichText from '@/components/RichText'

export default {
  name: 'FormModItem',
  inject: ['formMod'],
  components: {
    Render,
    LabelRender,
    RichText
  },
  props: {
    formItemConfig: {
      type: Object,
      required: true
    },
    editing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ajaxOptions: []
    }
  },
  computed: {
    richtext_viewstyle() {
      return {
        minHeight: this.formItemConfig.minHeight,
        maxHeight: this.formItemConfig.maxHeight,
      }
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
.text-left{
  text-align: left;
  color: #7D7D7d;
  font-size:13px;
}
.textarea-left{
  text-align: left;
  color: #7D7D7d;
  font-size:13px;
  max-height: 250px;
  overflow-x: hidden;
  overflow-y: auto;
}
.select-layout-label{
  float: left
}
.select-layout-value{
  float: right; color: #8492a6; font-size: 13px
}
</style>
