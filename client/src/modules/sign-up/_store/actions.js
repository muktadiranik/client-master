import { CHECK_CONFIRMATION, CHECK_EMAIL, CHECK_USERNAME, COMPLETE_PROFILE, REGISTER_ACCOUNT } from './types'
import axios from 'axios'

export default {
  [CHECK_CONFIRMATION]({ commit }, payload) {
    const url = `${API_BASE_URL}/accounts/confirm/check/${payload}`
    return axios.get(url, payload)
  },
  [CHECK_EMAIL]({ commit }, payload) {
    const url = `${API_BASE_URL}/accounts/email/check/${payload}/`
    return axios.get(url)
  },
  [CHECK_USERNAME]({ commit }, payload) {
    const url = `${API_BASE_URL}/accounts/username/check/${payload}/`
    return axios.get(url)
  },
  [COMPLETE_PROFILE]({ commit }, payload) {
    const url = `${API_BASE_URL}/accounts/register/complete-profile/`
    return axios.post(url, payload)
  },
  [REGISTER_ACCOUNT]({ commit }, payload) {
    const url = `${API_BASE_URL}/accounts/register/`
    return axios.post(url, payload)
  },
}
