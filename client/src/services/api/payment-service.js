import axios from 'axios'

const RESOURCE = 'payments'
export const PaymentService = {
  createPayment(payment) {
    return axios.post(`${RESOURCE}/`, payment)
  },
  deletePayment(paymentUuid) {
    return axios.delete(`${RESOURCE}/${paymentUuid}/`)
  },
  editPayment(payment) {
    return axios.patch(`${RESOURCE}/${payment.uuid}/`, payment)
  },
  getPayment(paymentUuid) {
    return axios.get(`${RESOURCE}/${paymentUuid}/`)
  },
}

export default PaymentService
