/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-10-23 16:45:11
 */
export default {
  data () {
    return {
      formSearchConfig: [
        {label: 'shipInfo.formSearch.labelName', type: 'text', key: 'nameContaining',placeholder:'shipInfo.formSearch.holderName'},
        {label: 'shipInfo.formSearch.labelType', type: 'select',key: 'typeId', optionsUrl: '/vessel/type/list',placeholder:'shipInfo.formSearch.holderType'},
        {label: 'shipInfo.formSearch.labelOwner', type: 'select', key: 'shipOwnerId', optionsUrl: '/shipOwner/list',placeholder:'shipInfo.formSearch.holderOwner'}
      ]
    }
  }
}