/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-11-29 13:54:51
 */
import i18n from '@/lang'

export default {
  data () {
    return {
      dockDetailItemInfoConfig: [
        {label:'specification.overview.addDockDetailItem.code', type: 'text', key: 'code',rules:[{required:true,message:' ',trigger:'blur'}],placeholder:'common.placeholder'},
        {label:'specification.overview.addDockDetailItem.name', type: 'text',key: 'name',rules:[{required:true,message:' ',trigger:'blur'}], placeholder:'common.placeholder'},
        {label:'specification.overview.addDockDetailItem.type', type: 'select',key: 'type',rules:[{required:true,message:' ',trigger:'change'}],valueType:'string',options:[{name:'specification.overview.addDockDetailItem.TYPE_SERVICE',value:'SERVICE'},{name:'specification.overview.addDockDetailItem.TYPE_MATERIAL',value:'MATERIAL'},{name:'specification.overview.addDockDetailItem.TYPE_EQUIPMENT',value:'EQUIPMENT'}], placeholder:'common.placeholders'},
        {
          label:'specification.overview.addDockDetailItem.budget',
          type: 'diy',
          key: 'budget',
          rules: [
            { required:true,message:' ',trigger:'blur' },
            { trigger: 'blur',
              validator: (rule, value, callback) => {
                if (!/^\d+(\.\d+)?$/.test(value)) {
                  callback(new Error(' '));
                } else {
                  callback()
                }
              }  
            }
          ],
          render: (h, { ctx, formItemConfig, formMod }) => {
            let self = this
            
            return h('el-input', {
              class: { 'flex-1': true },
              props: { value: formMod.formModel[formItemConfig.key]},
              attrs: { placeholder: i18n.t('common.placeholder') },
              on: {
                input(newValue) {
                  formMod.formModel[formItemConfig.key] = newValue
                }
              },
            }, 
            [
              h(
              'template', 
              { slot: 'append' }, 
              [ self.currencyType ]
              )
            ])
 
            // let suffix = h('span', { style: { marginLeft: '8px' } }, [self.currencyType])
            // return h('div', { class: { 'flex': true } }, [input, suffix])
          }
        },
        {label:'specification.overview.addDockDetailItem.supplier', type: 'text',key: 'supplier',paddingLeft:true,placeholder:'common.placeholder'},
        {label:'specification.overview.addDockDetailItem.selfSupply', type: 'radio',key: 'selfSupply',rules:[{required:true,message:' ',trigger:'change'}],options:[{name:'specification.overview.addDockItem.radioYes',value:true},{name:'specification.overview.addDockItem.radioNo',value:false}], placeholder:'common.placeholder'},
        {
          label: 'specification.overview.addDockDetailItem.keyParam',
          // labelRender(h, { ctx, formItemConfig, formMod }){
          //   let rawLabel = h('span', i18n.t('specification.overview.addDockDetailItem.keyParam'))
          //   let tipIcon = h('i', {
          //     class: {
          //       'el-icon-warning-outline': true
          //     },
          //     style:{
          //       'position': 'relative',
          //       'marginLeft': '5px',
          //       'top':'1px',
          //       'cursor': 'pointer'
          //     }
          //   })
          //   let tooltip = h('el-tooltip', {
          //     props: {
          //       placement: 'bottom',
          //       content: 'tip'
          //     }
          //   }, [tipIcon])
            
          //   return h('span', {}, [rawLabel, tooltip])
          // },
          key: 'keyParams',
          type: 'comp',
          fill: true,
          paddingLeft:true,
          render: (h, { ctx, formItemConfig, formMod }) => {
            var self = this
            return h('key-params',{
              props: {
                data: formMod.formModel[formItemConfig.key],
                editing: self.editing
              },
              on: {
                delKeyParam(index) {
                  formMod.formModel[formItemConfig.key].splice(index, 1)
                },
                addKeyParam(index) {
                  formMod.formModel[formItemConfig.key].splice(index + 1, 0, { paramName: '', value: '' })
                }
              }
            })
          }
        },
        {label:'specification.overview.addDockDetailItem.unit', type: 'text',key: 'unit',rules:[{required:true,message:' ',trigger:'blur'}], placeholder:'common.placeholder'},
        {
          label:'specification.overview.addDockDetailItem.quantity',
          placeholder:'common.placeholder',
          type: 'text',
          key: 'quantity',
          rules:[
            {required:true,message:' ',trigger:'blur'},
            { 
              trigger: 'blur',
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
        {label:'specification.overview.addDockDetailItem.description', type: 'richtext',key: 'description',paddingLeft:true,fill:true, placeholder:'common.placeholder'},
      ]
    }
  }
}