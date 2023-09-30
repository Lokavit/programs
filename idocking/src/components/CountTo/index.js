/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-01 13:41:30
 * @LastEditTime: 2020-03-09 13:00:34
 */
import CountTo from './vue-countTo.vue'
export default CountTo
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('count-to', CountTo)
}
