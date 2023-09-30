/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2020-03-05 10:56:55
 * @LastEditTime: 2020-03-09 12:52:22
 */
// 注册过滤器
import Vue from 'vue'

import * as filters from '@/filters'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
  Vue.prototype[key] = filters[key]
})
