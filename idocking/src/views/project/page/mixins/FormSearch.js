/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-10-24 15:06:51
 */
export default {
  data () {
    return {
      formSearchConfig: [
        {label: 'project.formSearch.number', type: 'text', key: 'codeContaining',placeholder:'common.placeholder'},
        {label: 'project.formSearch.name', type: 'text',key: 'nameContaining', optionsUrl: '/vessel/type/list',placeholder:'common.placeholder'},
        {label: 'project.formSearch.stage', type: 'select', key: 'currentPhase', valueType:'string', options: [{name:'project.STAGE_NOT_STARTED',value:'NOT_STARTED'},{name:'project.STAGE_PLAN',value:'PLAN'},{name:'project.STAGE_SPECIFICATION',value:'SPECIFICATION'},{name:'project.STAGE_QUOTE',value:'QUOTE'},{name:'project.STAGE_REPAIR',value:'REPAIR'},{name:'project.STAGE_CHECK',value:'CHECK'},{name:'project.STAGE_SUMMARY',value:'SUMMARY'}], placeholder:'common.placeholders'},
        {label: 'project.formSearch.status', type: 'select', key: 'status',valueType:'string', options: [{name:'project.STATUS_DRAFTING',value:'DRAFTING'},{name:'project.STATUS_WAITING_FOR_APPROVAL',value:'WAITING_FOR_APPROVAL'},{name:'project.STATUS_APPROVED',value:'APPROVED'}],placeholder:'common.placeholders'}
      ]
    }
  }
}