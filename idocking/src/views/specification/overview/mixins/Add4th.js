/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-11-29 13:52:14
 */
import i18n from '@/lang'

export default {
  data () {
    return {
      addDockDetailItemConfig: [
        {
          label:'specification.overview.addDockDetailItem.code',
          type: 'diy',
          key: 'code',
          rules:[{required:true,message:' ',trigger:'blur'}],
          render(h, { ctx, formItemConfig, formMod }) {
            var self = this

            return h('el-autocomplete', {
              attrs: { placeholder: i18n.t('common.placeholder') },
              style: { width: '100%' },
              props: {
                value: formMod.formModel[formItemConfig.key],
                fetchSuggestions: (queryString, cb) => {
                  var allData = window.STANDARDTREEALL.filter(item => item.value.length <= 7)
                  
                  let results = []
                  if(queryString) {
                    results = allData.filter(item => {
                      return item.value.startsWith(queryString)
                    })
                  }else{
                    results = allData
                  }

                  cb(results)
                }
              },
              scopedSlots: {
                default: ({ item }) => {
                  let code = h('div', item.code)
                  let name = h('div', item.name)
                  return h('div', {
                    class:{
                      'flex': true,
                      'flex-space-between': true,
                      'disabled': item.value.length < 7 
                    }
                  }, [code, name])
                }
              },
              on: {
                input(newValue) {
                  formMod.formModel[formItemConfig.key] = newValue
                },
                select(item) {

                  // 找到formMod所在父作用域
                  formMod.$parent.getStandardTreeInfo(item.id).then(res => {
                    formMod.formModel['name'] = res.data.name
                    formMod.formModel['type'] = res.data.type
                    formMod.formModel['description'] = res.data.description

                    // 关键参数单独处理成json
                    let keyParams = res.data.keyParams.map(item => {
                      return { paramName: item, value: '' }
                    })
                    formMod.formModel['keyParams'] = keyParams
                  })

                }
              }
            })
          }
        },
        {label:'specification.overview.addDockDetailItem.name', type: 'text',key: 'name',rules:[{required:true,message:' ',trigger:'blur'}], placeholder:'common.placeholder'},
        {label:'specification.overview.addDockDetailItem.type', type: 'select',key: 'type',rules:[{required:true,message:' ',trigger:'change'}],valueType:'string',options:[{name:'specification.overview.addDockDetailItem.TYPE_SERVICE',value:'SERVICE'},{name:'specification.overview.addDockDetailItem.TYPE_MATERIAL',value:'MATERIAL'},{name:'specification.overview.addDockDetailItem.TYPE_EQUIPMENT',value:'EQUIPMENT'}], placeholder:'common.placeholders'},
        {
          label:'specification.overview.addDockDetailItem.budget',
          type: 'diy',
          key: 'budget',
          rules:[
            {required:true,message:' ',trigger:'blur'},
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
            let self = this;
            let input = h('el-input',{ 
              class: { 'flex-1': true },
              props: { value: formMod.formModel[formItemConfig.key] },
              attrs: { placeholder: i18n.t('common.placeholder') },
              on: {
                input(newValue) {
                  formMod.formModel[formItemConfig.key] = newValue
                }
              }
            })
            let suffix = h('span', { style: { marginLeft: '8px' } }, [self.currencyType])

            return h('div',{ class: { 'flex': true } }, [input, suffix])
          }
        },
        {label:'specification.overview.addDockDetailItem.supplier', type: 'text',key: 'supplier', rules:[{required:true,message:' ',trigger:'blur'}],placeholder:'common.placeholder'},
        {label:'specification.overview.addDockDetailItem.selfSupply', type: 'radio',key: 'selfSupply',rules:[{required:true,message:' ',trigger:'change'}],options:[{name:'specification.overview.addDockItem.radioYes',value:true},{name:'specification.overview.addDockItem.radioNo',value:false}], placeholder:'common.placeholder'},
        {
          label:'specification.overview.addDockDetailItem.keyParam',
          key: 'keyParams',
          type: 'comp',
          fill: true,
          render: (h, { ctx, formItemConfig, formMod }) => {
            var self = this
            return h('key-params',{
              props: {
                data: formMod.formModel[formItemConfig.key],
                editing: true
              },
              on: {
                delKeyParam(index) {
                  formMod.formModel[formItemConfig.key].splice(index, 1)
                },
                addKeyParam(index, init) {
                  // 第一次增加时,keyParams的数据类型未确定,需要显示指定
                  if(init){
                    formMod.formModel[formItemConfig.key] = []
                    formMod.formModel[formItemConfig.key].push({ paramName: '', value: '' })
                  } else {
                    formMod.formModel[formItemConfig.key].splice(index + 1, 0, { paramName: '', value: '' })
                  }
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
        {label:'specification.overview.addDockDetailItem.description', type: 'richtext',key: 'description',fill:true, placeholder:'common.placeholder'},
      ]
    }
  }
}