import { CLOSE_MODAL, RESET_STORE, SET_PAYMENT, SHOW_MODAL } from '@/stores/payment-modal/types'

export default {
  [SET_PAYMENT]: (state, payload) => {
    state.payment = payload
  },
  [CLOSE_MODAL]: (state, payload) => {
    state.visible = payload
  },
  [SHOW_MODAL]: state => {
    state.visible = true
  },
  [RESET_STORE]: state => {
    state.visible = false
    state.payment = undefined
  },
}
