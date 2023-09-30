/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-12-09 11:07:50
 */
import i18n from '@/lang'

export default {
  data () {
    return {
      addFlowNodeConfig: [
        {label: 'settings.flow.addModal.nodeName',type: 'text', key: 'nodeName',rules:[{required:true,message:' ',trigger:'change'}],placeholder:'common.placeholder'},
        {label: 'settings.flow.addModal.roleName',type: 'select', valueType: 'string', strValue:true, key: 'requiredRole',optionsUrl:'/approvalFlow/availableJobs',rules:[{required:true,message:' ',trigger:'change'}],placeholder:'common.placeholder'},
        {label: 'settings.flow.addModal.canEdit', type: 'radio',key: 'canEdit',rules:[{required:true,message:' ',trigger:'change'}],options:[{name:'settings.flow.addModal.radioYes',value:true},{name:'settings.flow.addModal.radioNo',value:false}], placeholder:'common.placeholder'},
      ]
    }
  }
}