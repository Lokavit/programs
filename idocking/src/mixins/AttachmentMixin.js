/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-10 19:15:34
 * @LastEditTime: 2019-11-10 12:36:48
 */
import { getToken } from '@/utils/auth'
import { deepCopy, typeOf } from '@/utils/assist'

var token = getToken()

export default{
  inject:['formMod'],
  props: {
    fileList: [Object, Array],
    limit: {
      type: Number,
      default() {
        return 2 * 1024 * 1024  // 2M
      }
    },
    accept: {
      type: String,
      default: '.jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.BMP,.PNG,.pdf,.PDF,.doc,.docx,.xls,.xlsx,.txt,.TXT'
    }
  },
  created() {
    this.formMod && this.formMod.children.push(this)
  },
  data() {
    return{ 
      disabled: true,
      uploading: false,
      cloneFileList: [],
      myHeaders: {Authorization: `Bearer ${token}`}
    }
  },

  methods: {
    beforeUpload(file) {
      let ext = file.name.substring(file.name.lastIndexOf('.'))

      if(!this.accept.split(',').includes(ext)) {
        this.$message({showClose: true, message: this.$t('attachment.errorExt'), type: 'warning'})
        return false
      }

      if(file.size > this.limit) {
        this.$message({showClose: true, message: this.$t('attachment.errorSize'), type: 'warning'})
        return false
      }

      this.uploading = true
    },
    onSuccess(response, file, fileList) {
      this.uploading = false
      response.url = `${this.$ATT}/file/display/${response.id}?compressed=true`
      this.cloneFileList.push(response)
    },
    onRemove(file) {
      // 如果不使用slot-scopt【file】重定义逻辑，此钩子才会生效
      var index = this.cloneFileList.findIndex(item => {
        return item.id == file.id
      })

      this.cloneFileList.splice(index, 1)
    },
    onError() {
      this.$message({showClose: true, message: '文件上传失败', type: 'error'})
      this.uploading = false
    },
    _triggerSaveState() {
      this.disabled = true
    },
    _triggerState(curMode) {

      if(curMode === 3){
        this.tmpFileList = deepCopy(this.cloneFileList)
        this.disabled = false
        return
      }

      if(curMode === 4) {
        this.cloneFileList = this.tmpFileList
      }
      this.disabled = true
    },
    _getSelfData() {
      return { attachments: this.cloneFileList }
    }
  },
  watch: {
    fileList (newFileList) {
      this.cloneFileList = deepCopy(newFileList)

      if(typeOf(newFileList) == 'array') {
        this.cloneFileList.forEach(item => {
          item.url = `${this.$ATT}/file/display/${item.id}?compressed=true`
          // item.fileType = 'IMG'
        })
      }
    }
  }
}