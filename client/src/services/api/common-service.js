import axios from 'axios'

const CommonService = {
  getCountries() {
    return axios.get('types/countries/')
  },
  getVulnerabilityTypes() {
    return axios.get('types/vulnerability-types/')
  },
  getPaymentMethodTypes() {
    return axios.get('types/payment-methods/')
  },
}

export default CommonService
