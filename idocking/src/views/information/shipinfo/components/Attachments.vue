<!--
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-06-25 13:27:13
 * @LastEditTime: 2019-10-23 09:32:45
 -->
<template>
  <div class="id-attachments">
    <el-table
      :header-row-style="{color:'#606266'}"
      :cell-style="{padding:'4px 0',color:'#2e2f2f'}"
      :data="attachmentsData"
      :max-height="maxHeight"
      style="width: 100%">
      <el-table-column
        class-name="fileName"
        prop="fileName"
        :label="$t('attachment.table.name')"
        width="250"
        :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="fileType"
        width="100"
        :label="$t('attachment.table.type')"
        :show-overflow-tooltip="true"
        min-width="10">
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="formatter"
        :show-overflow-tooltip="true"
        width="120"
        :label="$t('attachment.table.modifyTime')">
      </el-table-column>
      <el-table-column
        fixed="right"
        :label="$t('attachment.table.ops')">

        <!-- 表头 -->
        <template slot="header" v-if="!disabled">
          <el-upload
            class="upload-demo"
            :action="`${$ATT}/file/putFile/`"
            :show-file-list="false"
            :headers="myHeaders"
            :on-error="annexOnError"
            :on-remove="annexRemove"
            :before-upload="annexBeforeUpload"
            :on-success="annexOnSuccess"
            list-type="picture"
            :file-list="fileList">
            <el-button v-if="!disabled" size="mini" type="success" class="btn-upload">{{ $t('attachment.upload') }}</el-button>
          </el-upload>
        </template>

        <!-- 表体 -->
        <template slot-scope="scope">
          <div class="btn-table-ops" @click="getFileDisplay(scope.row, scope.$index)" :disabled="scope.row.fileType!='IMG'&&scope.row.fileType!='PDF'">
            <i class="el-icon-view icon-weight"></i>
          </div>
          <div class="btn-table-ops" @click="getFileDownload(scope.row.id, scope.row.fileName)">
            <i class="el-icon-download icon-weight"></i>
          </div>
          <div class="btn-table-ops" @click="deleteAttachments(scope.row.id, scope.$index)" v-if="!disabled">
            <i class="el-icon-remove icon-weight"></i>
          </div>
        </template>

      </el-table-column>
    </el-table>
    <image-modal v-if="attachmentsData.length>0" ref="images" :defaultIndex="defaultIndex" :imageList="attachmentsData"></image-modal>
  </div>
</template>
<script>
                
import ImageModal from '@/components/ImageModal'
import dayjs from 'dayjs'

export default {
  name: 'globalAttachments',
  components: {
    ImageModal
  },
  props: {
    attachmentsData: {
      type: Array
    },
    maxHeight: {
      type: Number,
      default:()=>{
        return null
      }
    },
    attaDelete: {
      type: Boolean,
      default: ()=> {
        return true;
      }
    },
    disabled: {
      type: Boolean,
      default: ()=> {
        return true
      }
    }
  },
  data() {
    return {
      showImageModal: false,
      defaultIndex:0
    }
  },
  methods: {
    formatter(time) {
      return dayjs(time.createTime).format('YYYY-MM-DD')
    },
    closeImageModal() {
      this.showImageModal = false;
    },
    deleteAttachments(id, index) { // 删除附件
      this.$emit('deleteAttachments', id, index)
    },
    getFileDisplay(row, index) { // 附件的显示预览接口
      this.defaultIndex = index;
      if(row.fileType == 'IMG'){
        this.$refs.images.showImage() // 调用子组件的图片显示
      }else if(row.fileType == 'PDF'){
        var eleLink = document.createElement('a'); // 创建a标签下载图片
        eleLink.style.display = 'none';
        eleLink.target="view_window"
        document.body.appendChild(eleLink);
        eleLink.href = this.$ATT+'/file/display/'+row.id;
        eleLink.click();
        document.body.removeChild(eleLink);
      }
    },
    getFileDownload(id, fileName) { // 附件下载接口
      var eleLink = document.createElement('a'); // 创建a标签下载图片
      eleLink.download = fileName;
      eleLink.style.display = 'none';
      document.body.appendChild(eleLink);
      eleLink.href = `${this.$ATT}/file/download/${id}`;
      eleLink.click();
      document.body.removeChild(eleLink);
    }
  }
}
</script>

<style lang="scss">
.id-attachments{
  .el-table__header-wrapper{
    position: relative;
  }
  .upload-demo{
    position: absolute;
    top:0px;
    right:0;
  }
  .btn-upload{
    padding: 6px 10px!important;
    border-radius: 20px!important;
  }
}
</style>