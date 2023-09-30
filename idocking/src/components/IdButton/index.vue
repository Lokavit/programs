<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-25 13:49:42
 * @LastEditTime: 2020-03-09 13:17:48
 -->
<template>
  <div class="id-button" @click="handleClick">
    <el-button
      v-bind="$attrs"
      :class="[
        true ? 'id-button-' + type : '',
        {
          'disabled': disabled,
          'actived': active
        }
      ]"
      size="mini"
      round
    >
      <i
        v-if="icon"
        :class="[
          'id-button-icon',
          icon ? 'el-icon-' + icon : ''
        ]"
      />

      <slot>
        {{ row ? text : $t(text) }}
      </slot>
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'IdButton',
  props: {
    row: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'default'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit('click')
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../styles/variables.scss';
.id-button{
  display: inline-block;
}
.id-button-icon{
  position: relative;
  top:1px;
}

.id-button-default{
  background-color: $bg-btn-orange;
  border: 1px solid $title-color;
  color: $title-color;
  font-weight: bold;
  &:hover{
    background: $title-color;
    border-color: $title-color;
    color: #FFF!important;
  }
  &.actived {
    background: $title-color;
    border-color: $title-color;
    color: #FFF!important;
  }
}

.id-button-blue{
  background-color: $bg-btn-blue;
  border-color: $main-border;
  color: $main-border;
  font-weight: bold;
  &:hover{
    background: $main-bg!important;
    border-color: $main-border!important;
    color: #FFF!important;
  }
  &.actived {
    background: $main-bg!important;
    border-color: $main-border!important;
    color: #FFF!important;
  }
}

</style>
