import getters from '@/stores/users/getters'
import actions from '@/stores/users/actions'
import mutations from '@/stores/users/mutations'
import { initialState } from '@/stores/users/state'

const state = { ...initialState }

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
