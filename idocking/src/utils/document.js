/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-18 14:21:15
 * @LastEditTime: 2019-11-18 15:51:26
 */
import Vue from 'vue'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import store from '@/store'

const service = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 5000
})

service.interceptors.request.use(
  config => {

    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${ getToken() }`
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

/**
 * 用来下载询价单/报价单、坞修指导书
 * 
 * @param {*} url Ajax地址(返回二进制文件流)
 * @param {*} params Ajax需要的参数
 * @param {*} fileName 要保存的文件名
 * @param {*} fileType 要保存的文件扩展名 ".pdf"
 */
export function downloadDocument(url, params, fileName, fileType) {
  service({
    url, 
    params, 
    responseType: 'blob'
  }).then(res => {
    const link = document.createElement('a')
    let objectUrl = URL.createObjectURL(res.data) // 创建URL
    link.href = objectUrl
    link.download = fileName + fileType || ''
    link.click()                      // 下载文件
    URL.revokeObjectURL(objectUrl);   // 释放内存
  })
}