<!--
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-10-29 19:59:19
 * @LastEditTime: 2019-10-29 20:11:36
 -->
**### 内嵌在IdDialog中的组件需要做额外的工作**

1. 注入 "_idialog" 指针
2. 将自身this加入IdDialog的children
3. 提供 "_save()" 方法,当IdDialog的保存按钮触发时回调内嵌组件


	this._idialog.close()   //调用IdDialog的关闭功能


```javascript
inject: ['_idialog'],
created() {
 this._idialog.children.push(this)
},
methods: {
 async _save() {
  // this._idialog.close()
 }
}
```