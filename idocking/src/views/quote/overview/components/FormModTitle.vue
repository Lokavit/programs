<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-14 14:27:38
 * @LastEditTime: 2019-11-14 15:10:32
 -->
<template>
  <div class="form-mod-title">
    <svg-icon :name="icon" :width="iconSize" :height="iconSize"></svg-icon>
    {{ raw ? text : $t(text) }}
    <span class="cursor" v-if="toolbar">
      <span v-if="!editing" @click = "editIt" class="global-edit">
        <svg-icon style="margin-left:10px;" width="12" height="12" name="edit" ></svg-icon>
      </span>
      <span v-else>
        <span @click = "saveIt" class="global-edit">
          <svg-icon width="12" style="margin-left:10px;" height="12" name="save" ></svg-icon>
        </span>
        <span @click = "cancelIt" class="global-edit">
          <svg-icon width="12" style="margin-left:10px;" height="12" name="close" ></svg-icon>
        </span>
      </span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'form-mod-title',
  props: {
    icon: {
      type: String,
      default: 'background-boat'
    },
    iconSize: {
      type: String | Number,
      default: 20
    },
    text: String,
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
      editing: false,
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
.form-mod-title {
  box-sizing: border-box;
  font-weight: bold;
  color: #ae5c30;
  font-weight: 800;
  padding:  10px;
  svg{
    vertical-align: middle;
  }
}
</style>