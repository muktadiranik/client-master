import { RESET_STORE, SET_FINDING } from '@/stores/finding-edit/types'

import { InitialState } from './state'

export default {
  [SET_FINDING]: (state, payload) => {
    state.finding = payload
  },
  [RESET_STORE]: state => {
    Object.assign(state, InitialState)
  },
}
