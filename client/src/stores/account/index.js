import getters from '@/stores/account/getters'
import actions from '@/stores/account/actions'
import mutations from '@/stores/account/mutations'
import { initialState } from '@/stores/account/state'

const state = {
  ...initialState,
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
