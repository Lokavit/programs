/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-22 16:12:20
 * @LastEditTime: 2019-11-04 11:07:31
 */

import i18n from '@/lang'

export default {
  data () {
    return {
      certInfoModalConfig: [
        {label: 'shipCert.detail.certName', key: 'name', type: 'text',readonly:true,  paddingLeft:true,placeholder:'common.placeholder',},
        {label: 'shipCert.detail.certCode',key: 'code', type: 'text',readonly:true, placeholder:'common.placeholder'},
        {label: 'shipCert.detail.certType',type: 'select', key: 'type',readonly:true, paddingLeft:true, valueType:'string', options: [{name: 'shipCert.addModal.CERTTYPE_OF_VESSEL',value: 'OF_VESSEL'}, {name: 'shipCert.addModal.CERTTYPE_OF_EQUIPMENT',value: 'OF_EQUIPMENT'}],placeholder:'common.placeholder'},
        {label: 'shipCert.detail.signOrg', key: 'issuingAuthority', type: 'text', placeholder:'common.placeholder'},
        {label: 'shipCert.detail.signDate', key: 'issuingDate', type: 'date', paddingLeft:true,placeholder:'common.placeholder'},
        {label: 'shipCert.detail.expireDate', key: 'expirationDate', type: 'date',   placeholder:'common.placeholder'},     
        {
          label: 'shipCert.detail.warnDay', 
          key: 'earlyWarningThreshold', 
          type: 'text',
          placeholder:'common.placeholder',
          rules:[
            { required: true, message: ' ', trigger: 'blur' },
            { trigger: 'blur',
              validator: (rule, value, callback) => {
                if (!/^[+]{0,1}(\d+)$/.test(value)) {
                  callback(new Error(' '));
                } else {
                  callback()
                }
              }  
            }
          ]
        },
        {
          label: 'shipCert.addModal.shipName',
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
        // {label: 'shipCert.detail.remark', key: 'remark', type: 'textarea',fill:true, placeholder:'common.placeholder'},      
        {
          label: 'shipCert.detail.remark',
          key: 'remark',
          type: 'richtext',
          fill:true, 
          paddingLeft:true,
          placeholder:'common.placeholder'
        }  
      ]
    }
  }
}