/*
 * @Descripttion: 
 * @Author: border-1px
 * @Date: 2019-09-27 10:58:54
 * @LastEditTime: 2019-11-05 09:19:03
 */
import i18n from '@/lang'

export default {
  data() {
    return {
      addSpecModalConfig: [{
          label: 'specification.addModal.proName',
          rules: [{
            required: true,
            message: ' ',
            trigger: 'change'
          }],
          type: 'diy',
          key: 'projectName',
          render: (h, {
            ctx,
            formItemConfig,
            formMod
          }) => {
            var self = this
            return h('el-select', {
              props: {
                value: formMod.formModel[formItemConfig.key],
                placeholder: i18n.t('common.placeholders')
              },
              nativeOn: {
                click: function () {
                  self.selectProjectVisible = true
                }
              }
            })
          }
        },
        {
          // 暂存数据，不与用户直接打交道
          hidden: true,
          type: 'text',
          key: 'projectId'
        },
        {
          label: 'specification.addModal.proCode',
          rules: [{
            required: true,
            message: ' ',
            trigger: 'change'
          }],
          type: 'diy',
          key: 'projectNo',
          render: (h, {
            ctx,
            formItemConfig,
            formMod
          }) => {
            var self = this
            return h('el-select', {
              props: {
                value: formMod.formModel[formItemConfig.key],
                placeholder: i18n.t('common.placeholders')
              },
              nativeOn: {
                click: function () {
                  self.selectProjectVisible = true
                }
              }
            })
          }
        },
        {
          label: 'specification.addModal.currency',
          type: 'select',
          key: 'currencyType',
          layout: ['name', 'description'],
          optionsUrl: '/currency/type/list',
          rules: [{
            required: true,
            message: ' ',
            trigger: 'change'
          }],
          placeholder: 'common.placeholders'
        },
        {
          label: 'specification.addModal.version',
          type: 'select',
          key: 'standardTreeVersionId',
          optionsUrl: '/standardTreeVersion/list',
          rules: [{
            required: true,
            message: ' ',
            trigger: 'change'
          }],
          placeholder: 'common.placeholders'
        }
      ]
    }
  }
}
