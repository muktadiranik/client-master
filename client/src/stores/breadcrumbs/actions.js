import { SET_BREADCRUMBS, RESET_STORE } from '@/stores/breadcrumbs/types'

export const actions = {
  async [SET_BREADCRUMBS]({ commit }, payload) {
    commit(SET_BREADCRUMBS, payload)
  },
  async [RESET_STORE]({ commit }) {
    commit(RESET_STORE)
  },
}

export default actions
