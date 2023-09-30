/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-05 09:45:34
 * @LastEditTime: 2019-12-05 14:23:16
 */

import i18n from '@/lang'

export default {
  data () {
    return {
      formSearchConfig: [
        {
          label: 'dashboard.notices.search.keyword',
          placeholder:'common.placeholder',
          type: 'text',
          key: 'keyword'
        },
        {label: 'dashboard.notices.search.startAt', type: 'date',key: 'createdAfter', placeholder:'common.placeholders'},
        {label: '——',rawLabel: true,type: 'date',key: 'createdBefore',labelWidth:'40px',labelAlign:'left', placeholder:'common.placeholders'},
        {
          label: 'dashboard.notices.search.status',
          type: 'select',
          key: 'readStatus',
          valueType:'string',
          options: [
            {name:'dashboard.notices.status.ALL',value:''},
            {name:'dashboard.notices.status.READED',value: true},
            {name:'dashboard.notices.status.UNREAD',value: false}
          ],
          placeholder:'common.placeholders'}
      ]
    }
  }
}