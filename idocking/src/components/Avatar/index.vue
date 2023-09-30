<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-14 08:40:54
 * @LastEditTime: 2020-03-09 13:00:23
 -->
<template>
  <div class="settings-avatar">
    <div class="upload-warpper">
      <div class="upload-item">
        <!-- <div class="key">{{ $t('attachment.photo') }}</div> -->
        <div class="value">
          <el-upload
            v-if="!disabled"
            :action="`${$ATT}/file/putFile/`"
            :headers="myHeaders"
            :on-error="onError"
            :on-success="onSuccess"
            :accept="accept"
            :show-file-list="false"
          >
            <div slot="trigger" class="upload-trigger">+</div>
          </el-upload>
          <div class="photo">
            <img
              v-if="cloneFileList && cloneFileList.id"
              :src="`${$ATT}/file/display/${cloneFileList.id}?compressed=true`"
            >
            <img v-else :src="defaultAvatar">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AttachmentMixin from '@/mixins/AttachmentMixin'

export default {
  name: 'Avatar',
  mixins: [AttachmentMixin],
  data() {
    return {
      editing: false,
      accept: '.jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PNG',
      defaultAvatar: require('../../assets/settings/default-avatar.jpg')
    }
  },
  methods: {
    _getSelfData() {
      return Object.assign({}, this.cloneFileList)
    },
    onSuccess(file) {
      this.cloneFileList = file
      this.$emit('updateAvatarOk', file.id)
    },
    onError() {
      this.$message({showClose: true, message: '文件上传失败', type: 'error'})
    }
  }
}
</script>

<style lang="scss">
.settings-avatar{
  .upload-warpper{
    display:flex;
    .upload-item{
      flex: 1 1 33%;
      max-width: 33%;
      display: flex;
      .key{
        // padding:5px 15px 5px 0;
        box-sizing: border-box;
        box-sizing:border-box;
        // flex:2;
        min-width:100px;
        max-width: 130px;
        white-space: nowrap;
        font-size: 14px;
        // font-weight: bold;
        color:#7D7D7D;
      }
      .value{
        flex:1;
        position: relative;
        // min-width:450px;
        max-width: 800px;
        min-height: 127px;
        min-width: 140px;
        .photo{
          width: 120px;
          height: 120px;
          position: absolute;
          top:0;
          left: 0;
          // margin-top:-10px;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .attachments-data-warpper{
          max-height: 200px;
          overflow: auto;
        }
        .upload-trigger{
          position: absolute;
          left: 0;
          top:0;
          background-color: rgba(0,0,0,1);
          opacity: .3;
          width: 120px;
          height: 120px;
          z-index: 1000;
          color:rgba(255,255,255,.8);
          font-size: 40px;
          line-height: 120px;
          text-align: center;
        }
      }
    }
    .upload-annex{
      max-width: 70%;
    }
  }
}
</style>
