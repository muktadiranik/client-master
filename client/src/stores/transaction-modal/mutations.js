import { CLOSE_MODAL, RESET_STORE, SET_TRANSACTION, SHOW_MODAL } from '@/stores/transaction-modal/types'

export default {
  [SET_TRANSACTION]: (state, payload) => {
    state.transaction = payload
  },
  [CLOSE_MODAL]: (state, payload) => {
    state.visible = payload
    state.transaction = undefined
  },
  [SHOW_MODAL]: state => {
    state.visible = true
  },
  [RESET_STORE]: state => {
    state.visible = false
    state.transaction = undefined
  },
}
