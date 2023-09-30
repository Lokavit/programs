<template>
  <div class="rich-text-image">
    <!-- <div class="title">
      <div class="close" @click="close">
          <svg-icon name="close" width="12" height="12"></svg-icon>
      </div>
    </div> -->
    <el-upload
      class="upload-demo"
      :action="`${$ATT}/file/putFile/`"
      :headers="myHeaders"
      accept=".png,.jpeg,.jpg"
      :on-remove="handleRemove"
      :on-success="onSuccess"
      :file-list="fileList"
      list-type="picture"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png/jpeg文件，且不超过100MB</div>
    </el-upload>
    <div class="title">当前附件</div>
    <ul v-if="attachmentsList&&attachmentsList.length>0" class="attachmentsList">
      <li v-for="(item, index) in attachmentsList" :key="index" class="attachments_item bottm">
        <div class="checkbox-wrapper">
          <input :id="`checked_${index}`" v-model="checkList" :value="item" type="checkbox" class="checkbox-input">
          <div class="checkedList">
            <label :for="`checked_${index}`" class="checked checkbox-inner" />
          </div>
        </div>
        <img :src="`${$ATT}/file/display/${item.id}?compressed=true`" class="image">
        <span>{{ item.fileName }} </span>
      </li>
    </ul>
    <div v-else class="empty-holder">
      暂无附件
    </div>

    <div class="title"><el-button size="mini" type="primary" style="float: right;" @click="confirm">确定</el-button> </div>
  </div>
</template>
<script>
// http://192.168.1.5:8181/file/display/36d6bf9d-478b-4ea7-acee-c2b9b2dd4145?compressed=true

import { getToken } from '@/utils/auth'
var token = getToken()

export default {
  name: '',
  props: {
    attachmentsList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      checkList: [], // 选择的附件图片
      local_picture: [], // 本地上传图片
      myHeaders: { Authorization: `Bearer ${token}` },
      fileList: []
    }
  },
  methods: {
    handleRemove(file, fileList) { // 删除图片钩子
      this.local_picture = fileList.map(item => {
        return item.response
      })
    },
    close() {
      this.$emit('close')
    },

    onSuccess(response, file, fileList) { // 上传图片成功钩子
      if (response.fileType === 'IMG') {
        this.local_picture = fileList.map(item => {
          return item.response
        })
      }

      console.log(this.local_picture)
    },
    confirm() { // 确认按钮
      const selectImageList = this.checkList.concat(this.local_picture)
      this.$emit('confirm', selectImageList)
    }
  }
}
</script>
<style lang="scss">
.rich-text-image{
  min-height: 300px;
  background-color: rgba(255,255,255,1);
  overflow: auto;
  .title{
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    padding: 10px;
    min-height: 16px;
    position: relative;
    overflow: hidden;
    .confirm_btn{
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
}
.attachmentsList{
  display: flex;
  flex-wrap: wrap;
  .attachments_item{
    .checkbox-input:checked + .checkedList{
      display: block;
    }
    position: relative;
    // flex: 1 1 30%;
    border-radius: 5px;
    padding: 10px;
    box-sizing:border-box;
    border: 1px solid #c0ccda;
    margin-right: 10px;
    text-overflow:ellipsis;
    white-space: nowrap;
    overflow: hidden;
    flex:1 1 20%;
    min-width: 180px;
    max-width: 220px;
    .image{
      width: 70px !important;
      height: 70px !important;
      margin-right:8px;
    }
    .checkedList{
      width: 46px;
      display: none;
      height: 26px;
      position: absolute;
      top:-5px;
      right: -18px;
      background-color: #13ce66;
      transform: rotateZ(50deg);
      .checked{
        position: absolute;
        left: 15px;
        top: 4px;
        transform: rotateZ(-50deg);
        // background: #13ce66;
      }
    }
  }
  .bottm{
    margin-bottom: 10px;
  }
  .attachments_item:hover .checkedList{
    display: block;
  }

}
.close{
  position:absolute;
  top:10px;
  right: 0px;
}
.close:hover{
  color:red;
}
</style>
