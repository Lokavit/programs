/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-10-23 20:02:07
 */

export default {
  data () {
    return {
      addSocietyModalConfig: [
        {label: 'society.table.name', type: 'text', key: 'name',rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholder',},
        {label: 'society.table.shortName', type: 'text',key: 'abbr', paddingLeft:true,placeholder:'common.placeholder'},
        {label: 'society.table.contacts',  key: 'liaison', type: 'text',rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholder'},
        {label: 'society.table.phone',  key: 'telephone', type: 'text',rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholder'},
        {label: 'society.table.mail', key: 'email', type: 'text',rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholder'},
        {label: 'society.table.remark',  key: 'remark', type: 'textarea',fill:true, paddingLeft:true,placeholder:'common.placeholder'},      
        // {label: 'society.table.remark',  key: 'remark', type: 'richtext',fill:true, placeholder:'common.placeholder'}      
      ]
    }
  }
}