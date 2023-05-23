import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  shortProgramsList: [],
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
