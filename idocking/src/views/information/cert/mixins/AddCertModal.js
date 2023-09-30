/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-10-30 08:15:36
 */
import i18n from '@/lang'

export default {
  data () {
    return {
      addCertModalConfig: [
        {label: 'shipCert.addModal.certName',type: 'text', key: 'name',rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholder'},
        {label: 'shipCert.addModal.certCode',type: 'text', key: 'code', rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholder'},
        {label: 'shipCert.addModal.certType',type: 'select', key: 'type', rules:[{ required: true, message: ' ', trigger: 'change' }],valueType:'string', options: [{name: 'shipCert.addModal.CERTTYPE_OF_VESSEL',value: 'OF_VESSEL'}, {name: 'shipCert.addModal.CERTTYPE_OF_EQUIPMENT',value: 'OF_EQUIPMENT'}],placeholder:'common.placeholder',},
        {
          label: 'shipCert.addModal.shipName',
          rules:[{ required: true, message: ' ', trigger: 'change' }],
          type: 'diy',
          key: 'vessel',
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
        }
      ]
    }
  }
}