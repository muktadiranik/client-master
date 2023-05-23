import { getters } from '@/stores/followed-programs/getters'
import { actions } from '@/stores/followed-programs/actions'
import { mutations } from '@/stores/followed-programs/mutations'
import { initialState } from '@/stores/followed-programs/state'

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
