/*
 * @Descripttion: this is Descripttion
 * @Author: border-1px
 * @Date: 2019-11-05 16:36:13
 * @LastEditTime: 2019-11-25 15:23:58
 */

const state = {
  quotationLineInfo: {},
  exportExcelName: '',
  yardInfo1: {},
  yardInfo2: {},
  yardInfo3: {}
}

const mutations = {
  SET_QUOTATIONLINE: (state, data) => {
    state.quotationLineInfo = data
  },
  SET_EXPORT_EXCEL_NAME: (state, name) => {
    state.exportExcelName = name
  },
  SET_YARDINFO: (state, info, column) => {
    // state['yardInfo' + number] = info
    alert(column)
    if(column == 1) {
      state.yardInfo1 = info
    } else if (column == 2) {
      state.yardInfo2 = info
    } else if (column == 3) {
      state.yardInfo3 = info
    }
  },

  SET_YARDINFO_1: (state, info, column) => {
    state.yardInfo1 = info
  },
  SET_YARDINFO_2: (state, info, column) => {
    state.yardInfo2 = info
  },
  SET_YARDINFO_3: (state, info, column) => {
    state.yardInfo3 = info
  },
}

export default {
  namespaced: true,
  state,
  mutations
}

