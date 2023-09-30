/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-11-29 13:52:04
 */
import i18n from '@/lang'

export default {
  data () {
    return {
      addDockItemConfig: [
        {
          label:'specification.overview.addDockItem.number',
          // labelRender(h, { ctx, formItemConfig, formMod }){
          //   let rawLabel = h('span', i18n.t(formItemConfig.label))
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
          rules:[{required:true,message:' ',trigger:'blur'}],
          type: 'diy',
          key: 'code',
          render(h, { ctx, formItemConfig, formMod }) {
            var self = this
            return h('el-autocomplete', {
              attrs: { placeholder: i18n.t('common.placeholder') },
              style: { width: '100%' },
              props: {
                value: formMod.formModel[formItemConfig.key],
                fetchSuggestions: (queryString, cb) => {
                  var allData = window.STANDARDTREEALL.filter(item => item.value.length <= 5)
                  
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
                      'disabled': item.value.length < 5
                    }
                  }, [code, name])
                }
              },
              on: {
                input(newValue) {
                  formMod.formModel[formItemConfig.key] = newValue
                },
                select(item) {
                  // 选择编号，自动给name赋值
                  formMod.formModel['name'] = item.name

                  // 找到formMod所在父作用域,获取标准坞修项第三级中的描述
                  formMod.$parent.getStandardTreeInfo(item.id).then(res => {
                    formMod.formModel['description'] = res.data.description
                  })
                }
              }
            })
          }
        },
        {label:'specification.overview.addDockItem.name', type: 'text',key: 'name',rules:[{required:true,message:' ',trigger:'blur'}], placeholder:'common.placeholder'},
        {label:'specification.overview.addDockItem.selfRepair', type: 'radio',rules:[{required:true,message:' ',trigger:'change'}],options:[{name:'specification.overview.addDockItem.radioYes',value:true},{name:'specification.overview.addDockItem.radioNo',value:false}],key: 'selfRepair', placeholder:'common.placeholder'},
        {label:'specification.overview.addDockItem.description', type: 'richtext',fill: true,key: 'description', placeholder:'common.placeholder'},
      ]
    }
  }
}