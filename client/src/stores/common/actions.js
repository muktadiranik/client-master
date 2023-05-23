import {
  LOAD_COUNTRIES,
  LOAD_PAYMENT_METHOD_TYPES,
  LOAD_VULNERABILITY_TYPES,
  SET_COUNTRIES,
  SET_PAYMENT_METHOD_TYPES,
  SET_VULNERABILITY_TYPES,
  RESET_STORE,
} from '@/stores/common/types'
import CommonService from '@/services/api/common-service'

export default {
  async [LOAD_VULNERABILITY_TYPES]({ commit, state }, payload) {
    if (state.vulnerabilityTypes && state.vulnerabilityTypes.length > 0) {
      return state.vulnerabilityTypes
    }
    const response = await CommonService.getVulnerabilityTypes()
    const vulnerabilityTypes = response.data
    commit(SET_VULNERABILITY_TYPES, vulnerabilityTypes)
    return vulnerabilityTypes
  },
  async [LOAD_PAYMENT_METHOD_TYPES]({ commit, state }) {
    if (state.paymentMethodTypes && state.paymentMethodTypes.length > 0) {
      return state.paymentMethodTypes
    }
    const response = await CommonService.getPaymentMethodTypes()
    const choices = response.data
    commit(SET_PAYMENT_METHOD_TYPES, choices)
    return choices
  },
  async [LOAD_COUNTRIES]({ commit, state }) {
    if (state.countries && state.countries.length > 0) {
      return state.countries
    }
    const response = await CommonService.getCountries()
    const choices = response.data
    commit(SET_COUNTRIES, choices)
    return choices
  },
  async [RESET_STORE]({ commit }) {
    commit(RESET_STORE)
  },
}
