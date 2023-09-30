/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-09 14:28:41
 * @LastEditTime: 2019-12-11 09:56:22
 */

export default {
  data () {
    return {
      formSearchConfig: [
        {
          label: 'settings.user.search.role', 
          type: 'select',
          key: 'job', 
          valueType:'string', 
          placeholder:'common.placeholders',
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