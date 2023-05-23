import { SET_PAYMENT, RESET_STORE } from '@/stores/payment/types'
import { InitialState } from '@/stores/payment/state'

export default {
  [SET_PAYMENT]: (state, payload) => {
    state.payment = payload
  },
  [RESET_STORE]: state => {
    Object.assign(state, InitialState)
  },
}
