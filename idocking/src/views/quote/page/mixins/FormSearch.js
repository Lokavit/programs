/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-11-18 13:03:41
 */
import i18n from '@/lang'

export default {
  data () {
    return {
      formSearchConfig: [
        {
          label: 'quote.search.project',
          type: 'diy',
          key: 'dockingProject',
          render: (h, { ctx, formItemConfig, formMod }) => {
            var self = this
            return h('el-select', {
              props: {
                value: formMod.formModel[formItemConfig.key].name,
                popperClass: "no-show-options",	   // 触发select时不显示下拉options
                placeholder: i18n.t('common.placeholders')
              },
              nativeOn: {
                click: function() {
                  self.selectSpecVisible = true
                }
              }
            })
          }
        },
        {label: 'quote.search.billDate', type: 'date',key: 'createdAfter', placeholder:'common.placeholders'},
        {label: '——',rawLabel: true,type: 'date',key: 'createdBefore',labelWidth:'40px',labelAlign:'left', placeholder:'common.placeholders'},
        {
          label: 'quote.search.status',
          type: 'select',
          key: 'status',
          valueType:'string',
          options: [
            {name:'quote.status.CREATED',value:'CREATED'},  // 草拟
            {name:'quote.status.OFFERED',value:'OFFERED'},  // 已报价
            {name:'quote.status.WAITING',value:'WAITING_FOR_APPROVAL'},  // 待审批
            {name:'quote.status.APPROVED',value:'APPROVED'}, // 已成交
            {name:'quote.status.REJECTED',value:'REJECTED'}  // 已拒绝
          ],
          placeholder:'common.placeholders'}
      ]
    }
  }
}