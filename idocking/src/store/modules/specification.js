/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-05 16:36:13
 * @LastEditTime: 2020-03-09 14:05:11
 */

const state = {
  treeRowData: {},
  currencyType: '', // 货币类型(USD)
  canEdit3rd: false, // 当前用户坞修项(三级)拥有权限["SUBMIT","LOCK","MODIFY"]
  originCode3rd: '',
  spec3rdModalTitle: {}
}

const mutations = {
  SET_TREEROWDATA: (state, data) => {
    state.treeRowData = data
  },
  SET_CURRENCYTYPE: (state, data) => {
    state.currencyType = data
  },
  SET_CANEDIT3RD: (state, data) => {
    state.canEdit3rd = data
  },
  SET_ORIGINCODE3RD: (state, data) => {
    state.originCode3rd = data
  },
  SET_SPEC3RDMODALTITLE: (state, data) => {
    state.spec3rdModalTitle = data
  }
}

export default {
  namespaced: true,
  state,
  mutations
}

