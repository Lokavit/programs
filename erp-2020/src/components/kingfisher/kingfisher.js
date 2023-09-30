/**
 * 基础组件全局注册
 */
import Vue from 'vue';
// 首字母大写 ,字符串转驼峰命名方式
import {
    upperFirst,
    camelCase
} from '@/utils/util';

const requireComponent = require.context(
    '.', // 基础组件目录的相对路径
    true, // 是否查询其子目录
    /Kft[\w]+\.(vue|js)$/, // 匹配基础组件文件名的正则
);

requireComponent.keys().forEach((fileName) => {
    // 获取组件配置
    const componentConfig = requireComponent(fileName);
    // 获取组件的 PascalCase 命名
    const componentName = upperFirst(
        camelCase(
            // 获取与目录深度无关的文件名 移除文件名开头的 "./_" 移除文件名末尾的扩展名 ".vue .js"
            fileName.split('/').pop().replace(/^\.\/_/, '').replace(/\.\w+$/, '')
        )
    )
    // 全局注册组件
    Vue.component(componentName, componentConfig.default || componentConfig)
});