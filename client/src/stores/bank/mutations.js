import { RESET_STORE, SET_TRANSACTION_TYPES, SET_ROUTE, SET_PROGRAMS_LIST } from '@/stores/bank/types'

import { InitialState } from './state'

export default {
  [SET_PROGRAMS_LIST]: (state, payload) => {
    state.programs = payload
  },
  [SET_TRANSACTION_TYPES]: (state, payload) => {
    state.transactionTypes = payload
  },
  [RESET_STORE]: state => {
    Object.assign(state, InitialState)
    state.query.page = 0
  },
  [SET_ROUTE]: (state, payload) => {
    state.savedRoute = payload
  },
}
