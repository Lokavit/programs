/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-10-24 16:53:06
 */
import i18n from '@/lang'

export default {
  data () {
    return {
      addProjectModalConfig: [
        {label: 'project.addProject.code',type: 'text', key: 'code',rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholder'},
        {label: 'project.addProject.name',type: 'text', key: 'name', rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholder'},
        {
          label: 'project.addProject.shipName',
          type: 'diy',
          key: 'vessel',
          rules:[{ required: true, message: ' ', trigger: 'change' }],
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
          label: 'project.addProject.shipType',
          type: 'partner',
          key: 'type',
          rules:[{ required: true, message: ' ', trigger: 'change' }],
          placeholder:'common.relateFill'
        },
        {label: 'project.addProject.startTime',type: 'date', key: 'startAt', rules:[{ required: true, message: ' ', trigger: 'change' }],placeholder:'common.placeholderd',},
        {label: 'project.addProject.endTime',type: 'date', key: 'endAt', rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholderd'}
      ]
    }
  }
}