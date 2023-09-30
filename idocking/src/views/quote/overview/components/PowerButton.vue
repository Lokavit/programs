<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-29 10:19:47
 * @LastEditTime: 2019-11-28 10:31:03
 -->
<template>
  <div class="power-button-project">
    <div class="power-button-project-ops">
      <el-dropdown
        trigger="click"
        @command="handleCommand"
      >
        <el-button type="primary" size="mini" round>
          {{ $t('common.ops') }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in power"
            :command=item
            :key="index"
          >

            <!-- 下拉不显示“导出坞修指导书” -->
            <span v-if="item!=='FETCH_PDF'">

              <!-- 草拟状态叫“询价单”，报价完了叫“报价单” -->
              <span v-if="item === 'EXPORT_EXCEL' && quotationStatus === 'CREATED'">
                {{ $t('quote.overview.operation.EXPORTINQUIRY') }}
              </span>
              <span v-else-if="item === 'EXPORT_EXCEL'">
                {{ $t('quote.overview.operation.EXPORTQUOTATION') }}
              </span>
              <!-- 草拟状态叫“询价单”，报价完了叫“报价单” -->

              <span v-else>{{ $t('quote.overview.operation.' + item ) }}</span>
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- power中存在 "COMPUTE_PDF" , 表示未生成过PDF，需隐藏查看、下载按钮 -->
      <id-button v-if="!power.includes('COMPUTE_PDF')" @click="handleViewPDF" type="blue" icon="zoom-in" text="quote.overview.operation.VIEWGUIDEBOOK" />
      <id-button v-if="!power.includes('COMPUTE_PDF')" @click="handleDownPDF" type="blue" icon="download" text="quote.overview.operation.DOWNGUIDEBOOK" /> 
    </div>

    <!-- 成交 -->
    <!-- <id-dialog
      v-model="acceptVisible"
      :title="$t('project.overview.operation.ACCEPT')"
      width="40%"
      ref="idialog-ACCEPT"
      :box-shadow="false"
      :box-padding="false"
      footer-align="center"
      @save="acceptIt('idialog-ACCEPT','formMod-ACCEPT')"
      :footer-layout="['ok']">
      <form-mod :form-config="formConfigAccept" ref="formMod-ACCEPT"></form-mod>
    </id-dialog> -->

    <!-- 同意 -->
    <id-dialog
      v-model="approveVisible"
      :title="$t('project.overview.operation.APPROVE')"
      width="40%"
      ref="idialog-APPROVE"
      :box-shadow="false"
      :box-padding="false"
      footer-align="center"
      @save="approveIt('idialog-APPROVE','formMod-APPROVE')"
      :footer-layout="['ok']">
      <form-mod :form-config="formConfigApprove" ref="formMod-APPROVE"></form-mod>
    </id-dialog>

    <!-- 拒绝 -->
    <id-dialog
      v-model="rejectVisible"
      :title="$t('project.overview.operation.REJECT')"
      width="40%"
      ref="idialog-REJECT"
      :box-shadow="false"
      :box-padding="false"
      footer-align="center"
      @save="rejectIt('idialog-REJECT', 'formMod-REJECT')"
      :footer-layout="['ok']">
      <form-mod :form-config="formConfigReject" ref="formMod-REJECT"></form-mod>
    </id-dialog>

    <!-- 导入询价单 -->
    <el-upload
      id="uploader-excel"
      :multiple='false'
      :auto-upload='true'
      :show-file-list='false'
      :before-upload="beforeUpload"
      :limit="1"
      :headers="myHeaders"
      :on-success="xlsUploadSuccess"
      :action="`${$ATT}/file/putFile/`"
    ></el-upload>

  </div>
</template>

<script>
import IdDialog from '@/components/IdDialog'
import FormMod from '@/components/FormMod'
import AttachmentMixin from '@/mixins/AttachmentMixin'
import { downloadDocument } from '@/utils/document'
import { 
  getOperations,
  acceptQuotation,
  submitQuotation,
  approveQuotation,
  rejectQuotation,
  importQuotation,
  delQuotation,
  computePDF,
  fetchPDFId
} from '@/api/quote'

export default {
  inject: ['_quoteOverview'],
  name: 'power-button',
  mixins:[AttachmentMixin],
  props:{
    quotationId: String | Number,
    quotationStatus: String
  },
  components:{
    IdDialog,
    FormMod
  },
  data() {
    return {
      power:[],
      approveVisible: false,
      rejectVisible: false,

      // 表单模型配置
      formConfigAccept:[{
        key: 'comment',
        type:'textarea',
        fill: true,
        placeholder: 'project.overview.flow.comment'
      }],
      formConfigApprove:[{
        key: 'comment',
        type:'textarea',
        fill: true,
        placeholder: 'project.overview.flow.comment'
      }],
      formConfigReject:[{
        key: 'comment',
        type:'textarea',
        fill: true,
        placeholder: 'project.overview.flow.comment'
      }]
    }
  },
  methods: {
    handleCommand(command) {
      // 所有formMod保存后才能提交
      // if(this._quoteOverview._canNext()) {
        if (command === 'EXPORT_EXCEL') {
          this.exportExcel()
        } else if (command === 'COMPUTE_PDF') {
          this.computePDF()
        } else if (command === 'FETCH_PDF') {
          this.fetchPDFId()
        } else if(command === 'IMPORT') {
          this.importIt()
        } else if(command === 'SUBMIT') {
          this.submitIt()
        } else if (command === 'APPROVE') {
          this.approveVisible = true
        } else if (command === 'REJECT') {
          this.rejectVisible = true
        } else if (command === 'LOCK') {
          this.delIt()
        } else if (command === 'ACCEPT') {
          this.handleAccpet()
        }
      // } else {
      //   this.$message({showClose: true,message: this.$t('common.saveForSubmit'),type: 'warning'});
      //   return false
      // }
    },
    handleAccpet() {
      this.$confirm(
        this.$t('quote.overview.operation.TIP_ACCEPT'),  
        this.$t('quote.overview.operation.ACCEPT'),
        {
          confirmButtonText: this.$t('msgboxLang.ok'),
          cancelButtonText: this.$t('msgboxLang.cancel'),
          type: 'warning'
        }
      ).then(async () => {
        this.acceptIt()
      })
    },
    beforeUpload (file) {
      const isText = file.type === 'application/vnd.ms-excel'
      const isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      return (isText | isTextComputer)
    },
    xlsUploadSuccess(data){
      importQuotation(this.quotationId, data.id).then(res => {
        this.$message({showClose: true,message: this.$t('quote.overview.operation.TIP_IMPORT_OK'), type: 'success'})
        this.getOperations()
        this.$emit('state-change')
      })
    },
    exportExcel() {
      downloadDocument(
        '/quotation/exportExcel', 
        { id: this.quotationId }, 
        this.$store.state.quote.exportExcelName,
        '.xlsx'
      )
    },

    /**
     * 让服务器生成PDF
     */
    computePDF() {
      computePDF(this.quotationId).then(res => {
        this.$alert(
          this.$t('quote.overview.operation.TIP_COMPUTE_PDF'), 
          this.$t('common.tip'), 
          {
            confirmButtonText: this.$t('common.ok')
          }
        );
      })
    },

    /**
     * 获取服务器PDF文件的id，用于拼接完整的查看/下载URL
     */
    async fetchPDFId() {
      return await fetchPDFId(this.quotationId)
    },

    /**
     * 在线查看PDF
     */
    handleViewPDF() {
      this.fetchPDFId().then(res => {
        var eleLink = document.createElement('a')
        eleLink.target="_blank"
        eleLink.style.display = 'none'
        document.body.appendChild(eleLink)
        eleLink.href = this.$ATT + '/file/display/' + res.data.id
        eleLink.click()
        document.body.removeChild(eleLink)
      })
    },

    /**
     * 下载PDF
     */
    handleDownPDF() {
      this.fetchPDFId().then(res => {
        downloadDocument(
          `${this.$ATT}/file/download/${res.data.id}`, 
          { quotationId: this.quotationId }, 
          this.$store.state.quote.exportExcelName,
          '.pdf'
        )
      })
    },

    importIt() {
      document.querySelector('#uploader-excel input[type="file"]').click()
    },
    acceptIt() {
      acceptQuotation(this.quotationId).then(res => {
        // 询价单成交

        this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})
        this.getOperations()
        this.$emit('state-change')
      })
    },
    submitIt(){
      submitQuotation(this.quotationId).then(res => {
        // 更新数据

        this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})
        this.getOperations()
        this.$emit('state-change')
      })
    },
    approveIt(dialog, formMod) {
      let comment = this.$refs[formMod]._getSelfData().comment

      approveQuotation(this.quotationId, comment).then(res => {
        this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})
        this.getOperations()
        this.$emit('state-change')
        this.$refs[dialog].close()
      })
    },
    rejectIt(dialog, formMod) {
      let comment = this.$refs[formMod]._getSelfData().comment

      rejectQuotation(this.quotationId, comment).then(res => {
        this.$message({showClose: true,message: this.$t('common.doOk'),type: 'success'})
        this.$emit('state-change')
        this.$refs[dialog].close()
      })
    },
    delIt(){
      this.$confirm(
        this.$t('common.delText'),
        this.$t('msgboxLang.title'),
        {
          confirmButtonText: this.$t('msgboxLang.ok'),
          cancelButtonText: this.$t('msgboxLang.cancel'),
          type: 'warning'
        }
      ).then(async () => {
        delQuotation(this.quotationId).then(res => {
          this.$message({showClose: true,message: this.$t('common.delOk'),type: 'success'})
          this.$router.replace('/dockrepair/quote')
        })
      })
    },
    getOperations() {
      getOperations(this.quotationId).then(res => {
        this.power = res.data.filter(item => { return item !== 'UPDATE' })

        // 给项目预览页赋值，用以控制表单是否可以编辑(hack方法，后期需改成vuex)
        this._quoteOverview.powerBtns = res.data
      })
    }
  },
  created() {
    this.getOperations()
  }
}
</script>

<style lang="scss">
@import '../../../../styles/variables.scss';

.power-button-project{
  &-ops{
    display: flex;
    > div, > button{
      margin-left: 20px;
    }
  }
  .el-dropdown{
    .el-button--primary{
      &:focus{
        background-color: $bg-btn-orange!important;
      }
      background-color: $bg-btn-orange!important;
      border: 1px solid $title-color!important;
      color: $title-color;
      font-weight: bold;
      &:hover{
        background: $title-color!important;
        border-color: $title-color!important;
        color: #FFF!important;
      }
    }
  }

}
</style>