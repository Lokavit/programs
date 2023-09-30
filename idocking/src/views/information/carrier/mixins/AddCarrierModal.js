/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-10-23 16:30:12
 */

export default {
  data () {
    return {
      addCarrierModalConfig: [
        {label: 'carrier.table.name', type: 'text', key: 'name', rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholder',},
        {label: 'carrier.table.contacts',type: 'text',key: 'liaison', rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholder'},
        {label: 'carrier.table.phone', type: 'text',key: 'telephone', rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholder'},
      ]
    }
  }
}