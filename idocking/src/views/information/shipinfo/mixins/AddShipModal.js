/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-10-30 08:00:57
 */

export default {
  data () {
    return {
      addShipModalConfig: [
        {label: 'shipInfo.addShipModal.labelName',type: 'text', key: 'name',rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'shipInfo.addShipModal.holderName',},
        {label: 'shipInfo.addShipModal.labelType',type: 'select',key: 'vesselType', optionsUrl:'/vessel/type/list', rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'shipInfo.addShipModal.holderType'},
        {label: 'shipInfo.addShipModal.labelShipId',type: 'text',key: 'shipIdentificationNumber', rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'shipInfo.addShipModal.holderShipId'}      
      ]
    }
  }
}