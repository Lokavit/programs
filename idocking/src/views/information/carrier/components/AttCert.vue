<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-16 20:30:53
 * @LastEditTime: 2019-10-24 08:54:18
 -->
<template>
  <div class="att-cert-wrapper">
    <div :class="[
      'att-cert',
      {'disabled': disabled},
      {'nodata': cloneFileList.length == 0}
    ]">
      <div class="att-cert-label el-form-item__label">
        <span>{{ $t('carrier.detail.cert') }}</span>
      </div>
      <div class="att-cert-value">
        <div class="att-cert-value-inner">
          <el-upload
            style="white-space : nowrap"
            :disabled="disabled"
            list-type="picture-card"
            :accept="accept"
            :headers="myHeaders"
            :on-error="onError"
            :on-remove="onRemove"
            :on-success="onSuccess"
            :file-list="cloneFileList"
            :before-upload="beforeUpload"
            :action="`${$ATT}/file/putFile/`"
          >
            <i class="el-icon-plus" v-if="!disabled"></i>
            <i v-if="disabled && cloneFileList.length == 0" style="font-size:14px;">{{ $t('common.nothing') }}</i>

            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
              >
              <span class="el-upload-list__item-actions">
                <span
                  v-if="disabled"
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>

          </el-upload>
        </div>
      </div>
    </div>

    <image-modal
      v-if="cloneFileList.length>0"
      :dom-prefix="domPrefix"
      ref="images"
      :defaultIndex="defaultIndex" 
      :imageList="cloneFileList">
    </image-modal>

  </div>
</template>

<script>
import AttachmentMixin from '@/mixins/AttachmentMixin'
import ImageModal from '@/components/ImageModal'

export default {
  mixins: [ AttachmentMixin ],
  components:{ ImageModal },
  data() {
    return {
      defaultIndex: 0,
      domPrefix: 'cert'
    }
  },
  methods: {
    handleRemove(file) {
      var index = this.cloneFileList.findIndex(item => {
        return item.id == file.id
      })

      this.cloneFileList.splice(index, 1)
    },
    handlePictureCardPreview(file) {
      var index = this.cloneFileList.findIndex(item => {
        return item.id == file.id
      })
      this.defaultIndex = index

      this.$refs.images.showImage() // 调用子组件的图片显示
    }
  }
}
</script>

<style lang="scss">
.el-upload-list{
  white-space : nowrap;
  overflow:scroll;
}

.att-cert{
  padding: 2px 0;
  display: flex;
  &.disabled{
    // 失效状态下，不显示上传按钮
    .el-upload--picture-card{
      display: none;
    }
    &.nodata{
      // 失效 + 无数据，显示上传按钮
      .el-upload--picture-card{
        display: block!important;
      }
    }
  }
  &-label{
    box-sizing: border-box;
    width: 130px;
    padding: 0 12px 0 10px;
    &.el-form-item__label{
      font-size: 12px;
      font-weight: bold;
      color: #7D7D7D;
      text-align: left;
    }
  }
  &-value{
    flex: 1;
    width: 0;
    &-inner{
      width: 700px;
      overflow-x:auto;
    }
  }
  .el-upload-list__item:first-child{
    margin-top: 0;
  }
  .el-upload-list--picture-card .el-upload-list__item{
    width: 100px;
    height: 100px;
    margin: 0 8px 0 0;
  }
  .el-upload-list__item.is-success{
    min-width: 100px;
  }
  .el-upload-list__item.is-success img{
    width: 100% !important;
    height: 100% !important;
  }
  .el-upload--picture-card{
    width: 100px;
    height: 100px;
    line-height: 100px;
    &__item{
      width: 100px;
      height: 100px;
      line-height: 100px;
    }
  }
}
</style>