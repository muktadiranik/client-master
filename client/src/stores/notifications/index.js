import getters from '@/stores/notifications/getters'
import actions from '@/stores/notifications/actions'
import mutations from '@/stores/notifications/mutations'
import { initialState } from '@/stores/notifications/state'

const state = { ...initialState }

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
