<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-12 10:16:05
 * @LastEditTime: 2020-03-09 13:21:38
 -->
<template>
  <div class="id-dialog">
    <el-dialog
      v-bind="$attrs"
      :width="width"
      :max-width="width"
      :visible="showDialog"
      :class="['id-dialog', { 'id-dialog-center': center, 'no-footer': !footer }]"
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="close"
    >
      <template slot="title">
        <slot name="title">
          <div class="modal-title">
            <svg-icon :name="icon" width="20" height="20" />
            {{ title }}
          </div>
        </slot>
      </template>

      <div
        :class="[
          'el-dialog__body-inner',
          {
            'box-shadow': boxShadow,
            'padding': boxPadding
          }
        ]"
      >
        <slot />
      </div>

      <template v-if="footer" slot="footer">
        <slot name="footer">
          <div :class="{'footer-center': footerAlign == 'center'}">
            <el-button
              v-if="footerLayout.includes('ok')"
              v-loading="confirmLoading"
              type="primary"
              size="mini"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.7)"
              @click="save"
            >
              <span>{{ $t('common.ok') }}</span>
            </el-button>

            <el-button
              v-if="footerLayout.includes('cancel')"
              size="mini"
              @click="close"
            >
              {{ $t('common.cancel') }}
            </el-button>
          </div>
        </slot>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'IdDialog',
  provide() {
    return {
      _idialog: this
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    center: {
      type: Boolean,
      default: false
    },
    value: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: 'background-boat'
    },
    footer: {
      type: Boolean,
      default: true
    },
    footerAlign: {
      type: String,
      default: 'right'
    },
    footerLayout: {
      type: Array,
      default: () => {
        return ['ok', 'cancel']
      }
    },
    boxShadow: {
      type: Boolean,
      default: true
    },
    boxPadding: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '55%'
    },
    bodyPadding: {
      type: String,
      default: '15px'
    }
  },
  data() {
    return {
      confirmLoading: false,
      children: []
    }
  },
  computed: {
    showDialog() {
      return this.value
    },
    style() {
      return {
        padding: this.bodyPadding
      }
    }
  },
  methods: {
    // 向IdDialog的子组件派发保存状态
    _dispatchState() {
      this.children.forEach(child => {
        child._save && child._save()
      })
    },
    save() {
      this.$emit('save')
      this._dispatchState()
    },
    close() {
      // 至关重要！IdDialog存在父组件生命周期内，就算Dialog销毁，其children中会一直保留之前的脏数据
      this.children = []
      // modal内嵌dialog使用
      this.$emit('input', false)
      // 直接使用dialog
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.modal-title {
  svg{
    vertical-align: middle;
    margin-right: 10px;
    position: relative;
    top:-1px;
  }
}

.id-dialog {
  // 默认有footer
  .el-dialog {
    &__header{
      padding:  25px 20px 15px 20px!important;
      .el-icon-close:before {
        font-size: 24px;
      }
    }
    &__body {
      padding: 5px 20px 0px 20px!important;
    }
    &__footer {
      padding: 10px!important;
    }
  }
  // 无footer
  &.no-footer {
    .el-dialog {
      &__header{
        padding:  25px 20px 15px 20px!important;
      }
      &__body {
        padding: 5px 20px 20px 20px!important;
      }
    }
  }

  // 垂直居中dialog
  &-center{
    .el-dialog {
      margin:0 !important;
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      max-width:1200px;
      &__body{
        &-inner{
          overflow: auto;
          position: relative;
          max-height: calc(100vh - 200px);
        }
      }
    }
  }
}

.footer-center{
  text-align: center;
}
</style>
