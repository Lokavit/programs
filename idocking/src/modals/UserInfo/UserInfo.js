/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-09 15:39:26
 * @LastEditTime: 2019-12-10 16:14:35
 */

import i18n from '@/lang'

export default {
  data () {
    return {
      userInfoConfig: [
        {label: 'settings.user.addModal.userName', type: 'text',key: 'name',rules:[{required:true,message:' ',trigger:'blur'}], placeholder:'common.placeholder'}
        // {
        //   label: 'settings.user.addModal.job',
        //   type: 'select',
        //   key: 'job',
        //   rules:[{required:true,message:' ',trigger:'change'}],
        //   optionsUrl: '/job/managementCompany/list',
        //   placeholder:'common.placeholders'
        // },
      ]
    }
  }
}