<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-21 20:30:15
 * @LastEditTime: 2019-11-13 13:21:06
 -->

<!-- FormModItem 配置项 -->

{
  label:'',            // 可选字段，没有的话表示控件占满整行
  rawLabel:false,      // 使用label本身的内容，不进行国际化映射（有时需要Label显示非String的字符，用于显示）
  labelRender:Fn,      // label的自定义Render
  render:Fn,           // 控件的自定义Render
  striking: false,     // 标题高亮显示（黄色）
  key:'',              // 接口字段
  placeholder:'',      // placeholder
  type:'',             // 控件类型 text/date/select/diy/partner
  valueType:'',        // select控件选中后的值(object/string),默认object
  options:[],          // 静态数据{name:'',value:''}
  optionsUrl:'',       // 异步数据
  labelWidth:'',       // label宽度
  labelAlign:'',       // form-mod-item自己的对齐方式, 会覆盖form-mod整体的label对齐配置
  fill:true,           // 满行
  readonly:true,       // 只读
  hidden:true，        // 不显示该控件，但是通过_getSelfData仍可获取其值
  paddingLeft:false,   // label对齐，非必填项label加padding-left，和必填项label对齐
  minHeight: '300px',  // richtext特有字段,默认150px(calc(100vh - 200px))
  maxHeight: '400px'   // richtext特有字段,默认250px
}

### 注意
1、 select默认情况下，选中项目后返回option对象；如果想要取字符串值，需要设置valueType:'string'
2、当type = 'select'时,可通过layout属性自定义布局，layout:['name', 'description'],表示option分成两列，左列显示name值。。。

<!-- FormMod配置项 -->
syncSave: true       // 默认同步保存。如需异步保存,设置false,回调函数中手动触发formMod组件的_triggerSaveState()


### 【验证规则】>=0整数

rules:[
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

### 【验证规则】>=0数字(整数 + 小数)
rules:[
  {
    trigger: 'blur',
    validator: (rule, value, callback) => {
      if (!/^\d+(\.\d+)?$/.test(value)) {
        callback(new Error(' '));
      } else {
        callback()
      }
    }  
  }
]


### 自定义表单label
```
labelRender(h, { ctx, formConfig, formMod }){
  let rawLabel = h('span', i18n.t(formConfig.label))
  let tipIcon = h('i', {
    class: {
      'el-icon-warning-outline': true
    },
    style:{
      'position': 'relative',
      'marginLeft': '5px',
      'top':'1px',
      'cursor': 'pointer'
    }
  })
  let tooltip = h('el-tooltip', {
    props: {
      placement: 'bottom',
      content: 'tip'
    }
  }, [tipIcon])
  
  return h('span', {}, [rawLabel, tooltip])
}
```