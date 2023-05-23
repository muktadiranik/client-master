import { CLOSE_MODAL, LOAD_PAYMENT, RESET_STORE, SET_PAYMENT, SHOW_MODAL } from '@/stores/payment-modal/types'
import PaymentService from '@/services/api/payment-service'

export const actions = {
  async [LOAD_PAYMENT]({ commit, state }, uuid) {
    const response = await PaymentService.getPayment(uuid)
    const payment = response.data
    commit(SET_PAYMENT, payment)
    commit(SHOW_MODAL)
  },
  async [CLOSE_MODAL]({ commit }) {
    commit(CLOSE_MODAL)
  },
  async [SHOW_MODAL]({ commit }) {
    commit(SHOW_MODAL)
  },
  async [RESET_STORE]({ commit }) {
    commit(RESET_STORE)
  },
}

export default actions
