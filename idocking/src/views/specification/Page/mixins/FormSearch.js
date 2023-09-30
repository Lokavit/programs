/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-11-05 11:20:59
 */

import i18n from '@/lang'

export default {
  data () {
    return {
      formSearchConfig: [
        {
          label: 'shipCert.formSearch.labelName',
          type: 'diy',
          key: 'vesselName',
          render: (h, { ctx, formItemConfig, formMod }) => {
            var self = this
            return h('el-select', {
              props: {
                popperClass: "no-show-options",
                placeholder: i18n.t('common.placeholders'),
                value: formMod.formModel[formItemConfig.key]
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
          label: 'shipCert.formSearch.labelName',
          type: 'text',
          key: 'vesselIds',
          hidden:true
        }
      ]
    }
  }
}