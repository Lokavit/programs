/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-10-23 16:34:31
 */

export default {
  data () {
    return {
      infoModalConfig: [
        {label: 'carrier.detail.name', type: 'text', key: 'name',rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholder',},
        {label: 'carrier.detail.contacts', type: 'text',key: 'liaison', rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholder'},
        {label: 'carrier.detail.phone', type: 'text', key: 'telephone', rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholder'},
        {label: 'carrier.detail.mail', type: 'text', key: 'email',paddingLeft:true,placeholder:'common.placeholder'},
        {label: 'carrier.detail.remark',type: 'textarea', key: 'description',paddingLeft:true, fill:true,placeholder:'common.placeholder'},
      ]
    }
  }
}