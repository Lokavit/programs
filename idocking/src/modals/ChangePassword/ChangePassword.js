/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-09 15:39:26
 * @LastEditTime: 2019-12-11 08:27:54
 */

import i18n from '@/lang'

export default {
  data () {
    return {
      passwordConfig: [
        {label: 'settings.user.passModal.oldPass', type: 'password',key: 'oldPassword',rules:[{required:true,message:' ',trigger:'blur'}], placeholder:'settings.user.passModal.holderOldPass'},
        {
          label: 'settings.user.passModal.newPass', 
          type: 'password',
          key: 'newPassword',
          rules:[
            {required:true,message:' ',trigger:'blur'},
          ], 
          placeholder:'settings.user.passModal.holderNewPass'
        },
        {
          label: 'settings.user.passModal.newPass2', 
          type: 'password',
          key: 'newPassword2',
          rules:[
            {required:true,message:' ',trigger:'blur'}
          ], 
          placeholder:'settings.user.passModal.holderNewPass2'
        }
      ]
    }
  }
}