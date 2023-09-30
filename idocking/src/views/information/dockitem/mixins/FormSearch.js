/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-10-31 09:47:25
 */
export default {
  data () {
    return {
      formSearchConfig: [
        {label: 'dockItem.version',labelWidth:'110px',type: 'select', key: 'version',optionsUrl:'/standardTreeVersion/list' ,placeholder:'common.placeholders'},
      ]
    }
  }
}