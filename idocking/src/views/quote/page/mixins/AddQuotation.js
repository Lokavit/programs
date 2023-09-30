/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2020-03-09 11:04:36
 */
import i18n from '@/lang'

export default {
  data () {
    return {
      shipyardInfoConfig: [
        {label: 'quote.addModal.shipyardName', type: 'text', key: 'name',rules:[{required: true,message:' ',trigger:'blur'}],placeholder:'common.placeholder'},
        {label: 'quote.addModal.liaison', type: 'text', key: 'liaison',rules:[{required: true,message:' ',trigger:'blur'}],placeholder:'common.placeholder'},
        {label: 'quote.addModal.telephone', type: 'text', key: 'telephone',rules:[{required: true,message:' ',trigger:'blur'}],placeholder:'common.placeholder'},
        {label: 'quote.addModal.email', type: 'text', key: 'email',rules:[{required: true,message:' ',trigger:'blur'}],placeholder:'common.placeholder'},
      ],
      projectSelectConfig: [
        {
          label: 'quote.addModal.selectLabel',
          type: 'diy',
          key: 'dockingProject',
          rules:[{required: true,message:' ',trigger:'change'}],
          render: (h, { ctx, formItemConfig, formMod }) => {
            var self = this
            return h('el-select', {
              props: {
                value: formMod.formModel[formItemConfig.key].name,
                placeholder: i18n.t('common.placeholders'),
                popperClass: "no-show-options"
              },
              nativeOn: {
                click: function() {
                  self.selectProjectVisible = true
                }
              }
            })
          }
        }
      ]
    }
  }
}