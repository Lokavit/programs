<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-14 14:27:38
 * @LastEditTime: 2020-03-09 13:13:05
 -->
<template>
  <div class="form-mod-title">
    <svg-icon v-if="showSvgIcon" :name="icon" :width="iconSize" :height="iconSize" />
    <i v-if="showIconFont" class="kft-icon-volumn" style="margin-right:6px;" />
    {{ raw ? text : $t(text) }}
    <span v-if="toolbar" class="cursor">
      <span v-if="!editing" class="global-edit" @click="editIt">
        <svg-icon style="margin-left:10px;" width="12" height="12" name="edit" />
      </span>
      <span v-else>
        <span class="global-edit" @click="saveIt">
          <svg-icon width="12" style="margin-left:10px;" height="12" name="save" />
        </span>
        <span class="global-edit" @click="cancelIt">
          <svg-icon width="12" style="margin-left:10px;" height="12" name="close" />
        </span>
      </span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'FormModTitle',
  props: {
    icon: {
      type: String,
      default: 'background-boat'
    },
    iconSize: {
      type: String | Number,
      default: 20
    },
    showSvgIcon: {
      type: Boolean,
      default: false
    },
    showIconFont: {
      type: Boolean,
      default: true
    },
    text: {
      type: String,
      default: ''
    },
    raw: {
      type: Boolean,
      default: false
    },
    toolbar: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      editing: false
    }
  },
  methods: {
    editIt() {
      this.editing = true
      this.$emit('edit')
    },
    saveIt() {
      this.editing = false
      this.$emit('save')
    },
    cancelIt() {
      this.editing = false
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss">
@import '../../styles/variables.scss';

.form-mod-title{
  color:#2E2F2F;
  font-weight: bold;
}
.global-edit:hover{
  color: $main-bg;
}
</style>
