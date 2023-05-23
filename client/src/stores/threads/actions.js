import {
  CREATE_MESSAGE,
  DELETE_MESSAGE,
  EDIT_MESSAGE,
  LOAD_THREAD,
  SET_THREAD,
  RESET_STORE,
} from '@/stores/threads/types'
import ThreadsService from '@/services/api/threads-service'

export default {
  async [CREATE_MESSAGE]({ commit }, payload) {
    const response = await ThreadsService.createMessage(payload.threadUuid, payload.postData)
    return response.data
  },
  async [EDIT_MESSAGE]({ commit, state }, payload) {
    const response = await ThreadsService.editMessage(payload.threadUuid, payload.messageUuid, payload.postData)
    return response.data
  },
  async [DELETE_MESSAGE]({ commit, state }, payload) {
    const response = await ThreadsService.deleteMessage(payload.threadUuid, payload.messageUuid)
    return response.data
  },
  async [LOAD_THREAD]({ commit }, payload) {
    const response = await ThreadsService.getThread(payload)
    const thread = response.data
    commit(SET_THREAD, thread)
    return thread
  },
  async [RESET_STORE]({ commit }) {
    commit(RESET_STORE)
  },
}
