/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-11-07 11:03:05
 */
import i18n from '@/lang'

export default {
  data () {
    return {
      selfRepairConfig: [
        {type: 'radio',rules:[{required:true,message:' ',trigger:'change'}],options:[{name:'specification.overview.addDockItem.radioYes',value:true},{name:'specification.overview.addDockItem.radioNo',value:false}],key: 'selfRepair', placeholder:'common.placeholder'}
      ]
    }
  }
}