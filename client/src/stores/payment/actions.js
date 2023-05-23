import { DELETE_PAYMENT, LOAD_PAYMENT, SET_PAYMENT, RESET_STORE } from '@/stores/payment/types'
import PaymentService from '@/services/api/payment-service'

export const actions = {
  async [DELETE_PAYMENT]({ commit, state }, paymentUuid) {
    const response = await PaymentService.deletePayment(paymentUuid)
    const payment = response.data
    commit(SET_PAYMENT, payment)
  },
  async [LOAD_PAYMENT]({ commit, state }, paymentUuid) {
    const response = await PaymentService.getPayment(paymentUuid)
    const payment = response.data
    commit(SET_PAYMENT, payment)
  },
  async [RESET_STORE]({ commit }) {
    commit(RESET_STORE)
  },
}

export default actions
