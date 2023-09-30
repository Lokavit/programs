/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-09 15:39:26
 * @LastEditTime: 2019-12-11 09:15:40
 */

import i18n from '@/lang'

export default {
  data () {
    return {
      addUserConfig: [
        {
          label: 'settings.user.addModal.loginName',
          rules:[
            { required:true, message:' ', trigger:'blur'},
            // { validator: validateLoginName, trigger: 'blur' }
          ],
          type: 'diy',
          key: 'loginName',
          placeholder:'common.placeholder',
          render: (h, { ctx, formItemConfig, formMod }) => {
            var self = this
            
            return h('el-input', {
              attrs: { placeholder: i18n.t('common.placeholder') },
              props: {
                value: formMod.formModel[formItemConfig.key],
                placeholder: i18n.t('common.placeholder')
              },
              on: {
                input(newValue) {
                  formMod.formModel[formItemConfig.key] = newValue
                },
                blur() {
                  let loginName = formMod.formModel[formItemConfig.key]
                  
                  if(!loginName) return
                  formMod.$parent.checkLoginNameUnique(loginName).then(res => {
                    if(res.data) {
                      self.$message({showClose: true,message: self.$t('common.userRepeat'),type: 'error'})
                      // self.validateLoginName(loginName)
                    }
                  })
                }
              }
            })
          }
        },
        {label: 'settings.user.addModal.userName', type: 'text',key: 'name',rules:[{required:true,message:' ',trigger:'blur'}], placeholder:'common.placeholder'},
        {label: 'settings.user.addModal.password', type: 'password', key: 'password',rules:[{required:true,message:' ',trigger:'blur'}], placeholder:'common.placeholder'},
        {
          label: 'settings.user.addModal.job', 
          type: 'select',
          key: 'role', 
          valueType:'string', 
          placeholder:'common.placeholder',
          rules:[{required:true,message:' ',trigger:'change'}],
          options:[
            {name:'MANAGEMENT_COMPANY_ADMIN',value:'MANAGEMENT_COMPANY_ADMIN'},
            {name:'SUPER_INTENDENT',value:'SUPER_INTENDENT'},
            {name:'SUPER_INTENDENT_MANAGER',value:'SUPER_INTENDENT_MANAGER'},
            {name:'SHIP_OWNER',value:'SHIP_OWNER'},
            {name:'CHIEF_OFFICER',value:'CHIEF_OFFICER'},
            {name:'CHIEF_ENGINEER',value:'CHIEF_ENGINEER'},
          ]
        }
      ]
    }
  }
}