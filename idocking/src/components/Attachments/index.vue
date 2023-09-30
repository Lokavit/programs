<!--
 * @Descripttion:
 * @Author: border-1px
 * @Date: 2019-06-25 13:27:13
 * @LastEditTime: 2020-03-09 12:57:50
 -->
<template>
  <div class="id-attachments">

    <el-upload
      v-if="!disabled"
      list-type="picture"
      class="btn-upload-wrap"
      :show-file-list="false"
      :accept="accept"
      :file-list="fileList"
      :headers="myHeaders"
      :on-error="onError"
      :on-remove="onRemove"
      :on-success="onSuccess"
      :before-upload="beforeUpload"
      :action="`${$ATT}/file/putFile/`"
    >
      <id-button v-if="!disabled" icon="upload" text="attachment.upload" />
    </el-upload>

    <el-table
      :header-row-style="{color:'#606266'}"
      :cell-style="{padding:'4px 0',color:'#2e2f2f'}"
      :data="cloneFileList"
      :max-height="maxHeight"
      style="width: 100%"
    >
      <el-table-column
        class-name="fileName"
        prop="fileName"
        width="250px"
        :label="$t('attachment.table.name')"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="fileType"
        width="100"
        :label="$t('attachment.table.type')"
        :show-overflow-tooltip="true"
        min-width="10"
      />
      <el-table-column
        prop="createTime"
        :formatter="formatter"
        :show-overflow-tooltip="true"
        :label="$t('attachment.table.modifyTime')"
      />
      <el-table-column
        fixed="right"
        width="150px"
        :label="disabled ? $t('attachment.table.ops') : '' "
      >
        <!-- 表体 -->
        <template slot-scope="scope">
          <div v-show="scope.row.fileType=='IMG' || scope.row.fileType=='PDF'" class="btn-table-ops" @click="getFileDisplay(scope.row, scope.$index)">
            <i class="el-icon-view icon-weight" />
          </div>
          <div class="btn-table-ops" @click="getFileDownload(scope.row.id, scope.row.fileName)">
            <i class="el-icon-download icon-weight" />
          </div>
          <div v-if="!disabled" class="btn-table-ops" @click="deleteAttachments(scope.row.id, scope.$index)">
            <i class="el-icon-remove icon-weight" />
          </div>
        </template>

      </el-table-column>
    </el-table>

    <image-modal
      v-if="cloneFileList.length > 0"
      ref="images"
      dom-prefix="attach"
      :default-index="defaultIndex"
      :image-list="cloneFileList"
    />

    <pagination
      style="padding-left:10px;"
      :pagination="pagination"
      :page="params.page + 1"
      layout="prev, pager, next"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    />
  </div>
</template>
<script>

import AttachmentMixin from '@/mixins/AttachmentMixin'
import PaginationMixin from '@/mixins/PaginationMixin'
import ImageModal from '@/components/ImageModal'
import Pagination from '@/components/Pagination'
import dayjs from 'dayjs'
import { downloadDocument } from '@/utils/document'

export default {
  name: 'Attachments',
  inject: ['formMod'],
  components: {
    ImageModal,
    Pagination
  },
  mixins: [AttachmentMixin, PaginationMixin],
  props: {
    maxHeight: {
      type: Number,
      default: () => {
        return null
      }
    }
  },
  data() {
    return {
      showImageModal: false,
      defaultIndex: 0
    }
  },
  watch: {
    // 监听cloneFileList,以便更新页码和总数
    cloneFileList() {
      this.getTableData()
    }
  },
  methods: {
    getTableData() {
      this.pagination = {
        total: this.cloneFileList.length,
        pageSizes: [10, 20, 50, 100],
        page: this.params.page,
        size: 10
      }
    },

    formatter(time) {
      return dayjs(time.createTime).format('YYYY-MM-DD')
    },

    closeImageModal() {
      this.showImageModal = false
    },

    /**
     * 附件删除
     */
    deleteAttachments(id, index) { // 删除附件
      this.cloneFileList.splice(index, 1)
    },

    /**
     * 附件查看
     */
    getFileDisplay(row, index) { // 附件的显示预览接口
      this.defaultIndex = index

      if (row.fileType === 'IMG') {
        this.$refs.images.showImage()
      } else if (row.fileType === 'PDF') {
        var eleLink = document.createElement('a')
        eleLink.style.display = 'none'
        eleLink.target = 'view_window'
        document.body.appendChild(eleLink)
        eleLink.href = this.$ATT + '/file/display/' + row.id
        eleLink.click()
        document.body.removeChild(eleLink)
      }
    },
    /**
     * 附件下载
     */
    getFileDownload(id, fileName) {
      var eleLink = document.createElement('a')
      eleLink.download = fileName
      eleLink.style.display = 'none'
      document.body.appendChild(eleLink)
      eleLink.href = `${this.$ATT}/file/download/${id}`
      eleLink.click()
      document.body.removeChild(eleLink)

      // downloadDocument(`${this.$ATT}/file/download/${id}`, null, fileName)
    }
  }
}
</script>

<style lang="scss">
.id-attachments{
  position:relative;
  .el-table__header-wrapper{
    position: relative;

    // 修复超宽表格，表头下边框线
    border-bottom: 1px solid #f2f2f2;
    top:-1px;
  }
  .btn-upload-wrap{
    position: absolute;
    z-index:9999;
    right:18px;
    top:-2px;
  }
  .el-table th>.cell{
    position: static
  }
  .el-table th div {
    line-height: normal
  }
  .icon-weight{
    font-weight: bold;
  }
}

</style>

