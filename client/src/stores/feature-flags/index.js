import getters from '@/stores/feature-flags/getters'
import actions from '@/stores/feature-flags/actions'
import mutations from '@/stores/feature-flags/mutations'
import { InitialState } from '@/stores/feature-flags/state'

const state = {
    ...InitialState
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
}
