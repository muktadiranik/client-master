import { REQUEST_THREAD, CREATE_MESSAGE } from './types'
import axios from 'axios'

export default {
  async [REQUEST_THREAD]({ commit }, payload) {
    const url = `${API_BASE_URL}/threads/${payload.threadUuid}/`
    return axios.get(url)
  },
  async [CREATE_MESSAGE]({ commit }, payload) {
    const url = `${API_BASE_URL}/threads/${payload.threadUuid}/create-message/`
    return axios.post(url, payload.messageForm)
  },
}
