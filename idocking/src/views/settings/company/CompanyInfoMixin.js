
import i18n from '@/lang'

export default {
  data () {
    return {
      companyInfoConfig: [
        {label: 'settings.company.comName',type: 'text', readonly:true, key: 'name',fill:true, placeholder:'common.placeholder'},
        {label: 'settings.company.contact',type: 'text', key: 'liaison',placeholder:'common.placeholder'},
        {label: 'settings.company.phone', type: 'text', key: 'telephone',placeholder:'common.placeholder'},
        {label: 'settings.company.mail', type: 'text', key: 'email', placeholder:'common.placeholder'},
        {label: 'settings.company.fax', type: 'text', key: 'fax', placeholder:'common.placeholder'},
        {
          label: 'settings.company.addr', 
          type: 'diy',
          key: 'city',
          render: (h, { ctx, formItemConfig, formMod }) => {
            var self = this

            return h('el-cascader', {
              ref:'cascader',
              props: {
                value: formMod.formModel[formItemConfig.key],
                "popper-class": 'fix-cascader-popover',
                placeholder: i18n.t('common.placeholders'),
                props:{
                  lazy: true,
                  lazyLoad: function(node, resolve) {
                    const { value, level } = node

                    if(self.inited) {
                      self.getRegion(value, level, resolve)
                    } else {
                      self.inited = true
                      self.getRegion(1, level, resolve)
                    }
                  }
                }

              },
              on: {
                input(newValue) {
                  formMod.formModel[formItemConfig.key] = newValue
                }
              }
            })
          }
        },
        {label: 'settings.company.fullAddr', type: 'text',key: 'address',placeholder:'common.placeholder'},
        {label: 'settings.company.intr', type: 'richtext',key: 'description', fill:true,placeholder:'common.placeholder'},
      ]
    }
  }
}