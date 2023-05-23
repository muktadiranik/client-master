import { RESET_STORE, SET_LOADING, SET_PROGRAM } from '@/stores/integrations-slack/types'

import { InitialState } from '@/stores/integrations-slack/state'

export const mutations = {
  [SET_PROGRAM]: (state, payload) => {
    state.program = payload
  },
  [RESET_STORE]: state => {
    Object.assign(state, InitialState)
  },
  [SET_LOADING]: (state, payload) => {
    state.loading = payload
  },
}
