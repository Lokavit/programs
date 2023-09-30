import {
    TYPE_LABELS
} from '../mutations-types';

/** 共享数据 */
const state = {
    labels: {}, // labels对象
}

const mutations = {
    [TYPE_LABELS.GET_LABELS]: (state, data) => {
        state.labels = data;
    }
}

const actions = {
    getLabels({
        commit,
        state
    }, data) {
        if (data) {
            console.log("DATA:", data);
            commit(TYPE_LABELS.GET_LABELS, data);
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}