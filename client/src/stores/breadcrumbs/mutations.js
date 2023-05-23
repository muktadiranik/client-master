import { RESET_STORE, SET_BREADCRUMBS } from '@/stores/breadcrumbs/types'
import { InitialState } from '@/stores/breadcrumbs/state'

export const mutations = {
  [SET_BREADCRUMBS]: (state, payload) => {
    state.breadcrumbs = payload
  },
  [RESET_STORE]: (state, payload) => {
    Object.assign(state, InitialState)
  },
}
