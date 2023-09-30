<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-14 08:40:54
 * @LastEditTime: 2019-10-23 10:33:37
 -->
<template>
  <div class="shipinfo-annex">
    <div class="upload-warpper">
      <div class="upload-item">
        <div class="key">{{ $t('attachment.photo') }}</div>
        <div class="value">
          <el-upload
            v-if="!disabled"
            :action="`${$ATT}/file/putFile/`"
            :headers="myHeaders"
            :on-error="photoOnError"	
            :on-success="photoOnSuccess"
            accept=".png,.jpeg,.jpg"
            :show-file-list="false">
            <div slot="trigger" class="upload-trigger">+</div>
          </el-upload>
          <div class="photo">
            <img 
              v-if="cloneFileList && cloneFileList.id"
              :src="`${$ATT}/file/display/${cloneFileList.id}?compressed=true`"
            />
            <img v-else :src="holderImg">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deepCopy } from '@/utils/assist'
import AttachmentMixin from '@/mixins/AttachmentMixin'

export default {
  name: 'annex-photo',
  inject: ['formMod'],
  mixins: [AttachmentMixin],
  props: {
    shipPhoto: Object
  },
  created() {
    this.formMod.children.push(this)
  },
  data() {
    return {
      editing: false,
      holderImg: require('../../../../assets/vessel/bulk-cargo.jpg')
    }
  },
  methods: {
    _getSelfData(){
      return Object.assign({}, { photo: this.cloneFileList })
    },
    deleteAttachments(id, index) {
      this.cloneFileList = []
    },
    photoOnSuccess(file) {
      this.cloneFileList = file;
    },
    photoOnError() {
      this.$message({showClose: true,message: '图片上传失败',type: 'error'})
    },
  }
}
</script>

<style lang="scss">
.shipinfo-annex{
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
        min-width:120px;
        max-width: 130px;
        white-space: nowrap;
        font-size: 13px;
        font-weight: bold;
        color:#7D7D7D;
      }
      .value{
        flex:1;
        position: relative;
        // min-width:450px;
        max-width: 800px;
        min-height: 127px;
        min-width: 200px;
        .photo{
          width: 127px;
          height: 127px;
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
          width: 127px;
          height: 127px;
          z-index: 1000;
          color:rgba(255,255,255,.8);
          font-size: 40px;
          line-height: 127px;
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