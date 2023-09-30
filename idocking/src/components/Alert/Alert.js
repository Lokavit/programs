/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-12-24 11:38:46
 * @LastEditTime: 2020-03-09 12:56:19
 */
import Vue from 'vue'
import AlertComponent from './Alert.vue'

var instance
var AlertConstructor = Vue.extend(AlertComponent)
const initInstance = () => {
  instance = new AlertConstructor({
    el: document.createElement('div')
  })
  // instance.$mount();
  document.body.appendChild(instance.$el)
}

AlertConstructor.prototype.closeAlert = () => {
  const el = instance.$el
  el.parentNode && el.parentNode.removeChild(el)
  instance.resolve()
}

var Alert = (options = {}) => {
  return new Promise((resolve, reject) => {
    initInstance()

    // instance.$props.msg = options.msg || ''
    // instance.$props.title = options.title || ''
    // instance.$props.buttonText = options.buttonText || '确定'
    Object.assign(instance, options, { resolve, reject })
  })
}

export default Alert
