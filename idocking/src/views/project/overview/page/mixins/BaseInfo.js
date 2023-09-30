/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-11-11 08:55:49
 */
import i18n from '@/lang'

export default {
  data () {
    return {
      baseInfoConfig: [
        {label: 'project.overview.baseInfo.startTime',readonly:true,type: 'date', key: 'startAt',rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholders'},
        {label: 'project.overview.baseInfo.stage',type: 'select', key: 'phase',paddingLeft:true, valueType:'string', options: [{name:'project.STAGE_NOT_STARTED',value:'NOT_STARTED'},{name:'project.STAGE_PLAN',value:'PLAN'},{name:'project.STAGE_SPECIFICATION',value:'SPECIFICATION'},{name:'project.STAGE_QUOTE',value:'QUOTE'},{name:'project.STAGE_REPAIR',value:'REPAIR'},{name:'project.STAGE_CHECK',value:'CHECK'},{name:'project.STAGE_SUMMARY',value:'SUMMARY'}], placeholder:'common.placeholders'},
        {label: 'project.overview.baseInfo.status', type: 'select', key: 'status',paddingLeft:true,readonly:true, valueType:'string', options: [{name:'project.STATUS_DRAFTING',value:'DRAFTING'},{name:'project.STATUS_WAITING_FOR_APPROVAL',value:'WAITING_FOR_APPROVAL'},{name:'project.STATUS_APPROVED',value:'APPROVED'}],placeholder:'common.placeholders'},
        {label: 'project.overview.baseInfo.endTime', readonly:true, type: 'date', key: 'endAt', paddingLeft:true,placeholder:'common.placeholders'},
        {
          label: 'project.overview.baseInfo.shipName',
          type: 'diy',
          readonly:true,
          key: 'vessel',
          rules:[{ required: true, message: ' ', trigger: 'blur' }],
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
          label: 'project.overview.baseInfo.shipType',
          type: 'partner',
          key: 'type',
          readonly:true,
          rules:[{ required: true, message: ' ', trigger: 'blur' }]
        },
        {label: 'project.overview.baseInfo.shipNo',readonly:true,type: 'text', key: 'code', rules:[{ required: true, message: ' ', trigger: 'blur' }],placeholder:'common.placeholder'},
      ]
    }
  }
}