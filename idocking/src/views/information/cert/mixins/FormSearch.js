/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-10-24 10:06:57
 */

import i18n from '@/lang'

export default {
  data () {
    return {
      formSearchConfig: [
        {
          label: 'shipCert.formSearch.labelName',
          type: 'diy',
          key: 'vessel',
          placeholder:'common.placeholder',
          render: (h, { ctx, formItemConfig, formMod }) => {
            var self = this
            return h('el-select', {
              props: {
                value: formMod.formModel[formItemConfig.key].name,
                placeholder: i18n.t('common.placeholders')
              },
              nativeOn: {
                click: function() {
                  self.selectVesselVisible = true
                }
              }
            })
          }
        },
        {
          label: 'shipCert.formSearch.labelStatus',
          type: 'select',
          valueType:'string',
          key: 'status',
          options:[
            {name:'shipCert.formSearch.STATUS_NORMAL',value:'NORMAL'},
            {name:'shipCert.formSearch.STATUS_EXPIRATION_CLOSE',value:'EXPIRATION_CLOSE'},
            {name:'shipCert.formSearch.STATUS_EXPIRED',value:'EXPIRED'}
          ],
          placeholder:'common.placeholder'
        }
      ]
    }
  }
}