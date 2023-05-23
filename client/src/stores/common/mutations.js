import { SET_COUNTRIES, SET_PAYMENT_METHOD_TYPES, SET_VULNERABILITY_TYPES, RESET_STORE } from '@/stores/common/types'

export default {
  [SET_COUNTRIES]: (state, payload) => {
    state.countries = payload
  },
  [SET_VULNERABILITY_TYPES]: (state, payload) => {
    state.vulnerabilityTypes = payload
  },
  [SET_PAYMENT_METHOD_TYPES]: (state, payload) => {
    state.paymentMethodTypes = payload.payment_methods
    state.usdBankTypes = payload.usd_bank_types
  },
  [RESET_STORE]: state => {
    state.vulnerabilityTypes = []
  },
}
