
const state = {
  COUNT_NEWS: 0,
  COUNT_PROJECT: 0,
  COUNT_FLOW: 0,
  COUNT_VESSEL: 0
}

const mutations = {
  SET_COUNT_NEWS: (state, count) => {
    state.COUNT_NEWS = count
  },
  SET_COUNT_PROJECT: (state, count) => {
    state.COUNT_PROJECT = count
  },
  SET_COUNT_FLOW: (state, count) => {
    state.COUNT_FLOW = count
  },
  SET_COUNT_VESSEL: (state, count) => {
    state.COUNT_VESSEL = count
  }
}

export default {
  namespaced: true,
  state,
  mutations
}

