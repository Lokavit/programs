<!--
 * @Descripttion: 异步表单。根据后端返回的json，需要变换成FormMod可识别的格式，并[混入]逻辑
 * @Author: border-1px
 * @Date: 2019-12-11 13:55:04
 * @LastEditTime: 2019-12-16 09:24:31
 -->
<template>
  <div class="staff-allot">
    <form-mod v-if="formConfig" :form-config="formConfig" :form-data="formData" ref="formMod"></form-mod>

    <!-- 机务、船东、机务经理 -->
    <id-dialog
      v-model="multipleModalVisible"
      width="45%"
      :title="$t(roleKey)"
      :box-padding="false"
      :box-shadow="false"
      :footer="false"
    >
      <multiple-modal
        v-if="multipleModalVisible"
        :role="role"
        :vesselId="vesselId"
        :selectedUserName="selectedUserName"
        @selectIt="handleSelectIt">
      </multiple-modal>
    </id-dialog>


    <!-- 轮机长、大副 -->
    <id-dialog 
      v-model="singleModalVisible"
      width="45%"
      :title="$t(roleKey)"
      :box-padding="false"
      :box-shadow="false"
      :footer="false"
    >
      <single-modal
        v-if="singleModalVisible"
        :role="role"
        :vesselId="vesselId"
        @selectIt="handleSelectIt">
      </single-modal>
    </id-dialog>

  </div>
</template>

<script>
import i18n from '@/lang'
import singleModal from './single'
import multipleModal from './multiple'
import { getVesselMember, withdrawVesselMember } from '@/api/vessel-member'
import { getAssignableRoles } from '@/api/user'

export default {
  inject: ['_idialog'],
  components: { multipleModal, singleModal },
  props: {
    vesselId: Number | String
  },
  data() {
    return {
      role: null,                    // 职务标识
      roleKey: null,                 // 职务对应的国际化key
      selectedUserName: [],              // 已分配过的用户名，用于优化不能重复选择
      formConfig: null,            
      formData: null,           
      wholeFormData: {},
      singleModalVisible: false,
      multipleModalVisible: false
    }
  },
  methods: {

    withdrawVesselMember(userId) {
      withdrawVesselMember({
        vesselId: this.vesselId,
        userId: userId
      }).then(res => {
        // 这里不刷新页面也可以的(同步删除)
        // this.getData()
      })
    },

    /**
     * 从职务映射表中，寻找name对应的userId，这里为日后支持多选埋下伏笔
     */
    _getJobUserId(roleKey, name) {
      return (this.wholeFormData[roleKey].find(it => it.name == name)).userId
    },

    _getArrDifference(arr1, arr2) {
      return arr1.concat(arr2).filter(function(v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
    },

    /**
     * 变换后端返回数据，用于动态生成Form(变换成能驱动FormMod的数据格式)
     */
    _transformData(rowData) {
      let FORMCONFIG = []    // 表单配置
      let FORMDATA = {}      // 表单对应数据绑定

      rowData.forEach(formItem => {
        FORMCONFIG.push({
          type: 'diy',
          key: formItem.key,             // 角色标识
          label: formItem.roleKey,       // 角色的国际化key(表单label)
          roleKey: formItem.roleKey,     // 角色的国际化key(分船弹窗title)
          multiple: formItem.multiple,   // 是否多船
          render: (h, { ctx, formItemConfig, formMod }) => {
            var self = this

            return h('el-select', {
              attrs: {
                placeholder: i18n.t('common.placeholders') 
              },
              props: {
                // multiple: formItemConfig.key !== 'SUPER_INTENDENT' ? true : false,
                multiple: true,
                popperClass: "no-show-options",	        // 触发select时不显示下拉options
                value: formMod.formModel[formItemConfig.key]
              },
              on: {
                focus: function() {
                  self.role = formItemConfig.key        // 赋值角色ID
                  self.roleKey = formItemConfig.roleKey // 角色的国际化字典Key
                  self.selectedUserName = formMod.formModel[formItemConfig.key]
                  // self._getAssignedUserIds(formMod.formModel[formItemConfig.key])

                  if(formItemConfig.multiple) { 
                    self.multipleModalVisible = true
                  } else {
                    self.singleModalVisible = true
                  }
                },
                change(newValue) {

                  // 机务不能删
                  if(formItemConfig.roleKey === "SUPER_INTENDENT") {
                    self.$alert(
                      self.$t('allotModal.tipNotDel'), 
                      self.$t('common.tip'), 
                      {
                        confirmButtonText: self.$t('common.ok')
                      }
                    );
                    return
                  }

                  // formMod组件初始化时，会绑定默认值，并触发一次input(此时异步数据并没有返回)，这一次的触发需要过滤掉
                  if(formMod.formModel[formItemConfig.key]) {
                    /**
                     * 找出新value与旧value之间的差异(用户名)
                     * 再通过【用户名】去wholeFormData中查到其对应的ID
                     */
                    let name = self._getArrDifference(newValue, formMod.formModel[formItemConfig.key])[0]
                    if(name) {
                      let userId = self._getJobUserId(formItemConfig.key, name)
                      self.withdrawVesselMember(userId)
                    }

                    /**
                     * newValue 是change触发后，最新的数据，需要将其覆盖到下面的参数，才能实现响应式变化，
                     * [这就是尤大大文档所说“深入底层的代价”]
                     * [https://cn.vuejs.org/v2/guide/render-function.html#v-model]
                     * formMod.formModel[formItemConfig.key] 为v-model绑定的数据
                     */
                    formMod.formModel[formItemConfig.key] = newValue
                  }
                }
              }
            },[
              h('i',{
                slot: 'suffix',
                class: 'el-icon-edit el-input__icon'
              }) 
            ])
          }
        })

        FORMDATA[formItem.key] = formItem.members.length ? formItem.members.map(it => it.name) : []

        // if(formItem.members.length) {
        //   if(formItem.key === 'SUPER_INTENDENT') {
        //     FORMDATA[formItem.key] = formItem.members[0].name
        //   } else {
        //     FORMDATA[formItem.key] = formItem.members.map(it => it.name)
        //   }
        // } else {
        //   FORMDATA[formItem.key] = []
        // }

        /**
         *  目前最新 ElementUI 2.13.0 版本还尚未支持: select多选时v-model绑定数组对象(目前只支持绑定数组类型)
         *  formData 用于实现多选时的v-model绑定显示值 (字符串数组)
         *  wholeFormData 存储完整数据(包含id)，用于后续操作（通过显示的name来匹配对应的id）
         */
        this.wholeFormData[formItem.key] = formItem.members.map(it => {
          return {
            name: it.name,
            userId: it.userId
          }
        })

      })

      this.formConfig = FORMCONFIG

      /**
       * 受目前FormMod设计影响，formData只能是异步数据(没使用immdiate)，简单的延时处理下即可
       */
      this.$nextTick(() => {
        this.formData = FORMDATA
      })

    },

    /**
     * 根据用户名获取对应用户ID
     */
    _getAssignedUserIds(usernames) {
      console.log(usernames);return;
      usernames.map(username => {
        for(let item of this.wholeFormData) {
          if (username === item.name) {
            return item.userId
          }
        }
      })
    },

    /**
     * 为用户分完船舶后的回调(重新获取数据)
     */
    handleSelectIt(row, column, event) {
      if(row.role === 'SUPER_INTENDENT') {
        this._idialog.close()
      } else {
        this.getData()
      }
    },

    getData() {

      Promise.all([this.getVesselMember(), this.getAssignableRoles()])
        .then(values => {
          const vesselUsers = values[0]
          const canUseRoles = values[1]

          canUseRoles.forEach(roleItem => {
            roleItem.members = []
            roleItem.key = roleItem.role
            roleItem.multiple = roleItem.multiple
            roleItem.roleKey = roleItem.role

            vesselUsers.forEach(user => {
              if (roleItem.role === user.role) {
                roleItem.members.push({
                  userId: user.userId,
                  name: user.name
                })
              }
            })
          })

          this._transformData(canUseRoles)
      })
    },

    getVesselMember() {
      return new Promise((resolve, reject) => {
        getVesselMember(this.vesselId).then(res => {
          resolve(res.data)
        })
      })
    },

    getAssignableRoles() {
      return new Promise((resolve, reject) => {
        getAssignableRoles().then(res => {
          resolve(res.data)
        })
      })
    }
  },
  created() {
    this._idialog.children.push(this)
    this.getData()
  }
}
</script>

<style lang="scss">

// 改下select的图标(箭头改小人)
.staff-allot{
  .el-input__suffix{
    i.el-select__caret{
      transform: rotateZ(0deg);
    }
    i::before{
      content: "\e7ab"
    }
  }
}
</style>