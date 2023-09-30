<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-16 20:30:53
 * @LastEditTime: 2019-10-24 08:54:07
 -->
<template>
  <div class="att-cert-wrapper">
    <div :class="[
      'att-cert',
      {'disabled': disabled},
      {'nodata': cloneFileList.length == 0}
    ]">
      <div class="att-cert-label el-form-item__label">
        <span>{{ $t('carrier.detail.auth') }}</span>
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
      domPrefix: 'auth'
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
// 样式由AnnexCert组件提供
// @/views/information/carrier/components/AnnexCert.vue
</style>