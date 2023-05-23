import { SET_THREAD, RESET_STORE } from '@/stores/threads/types'

export default {
  [SET_THREAD]: (state, payload) => {
    state.thread = payload
  },
  [RESET_STORE]: state => {
    state.thread = {}
  },
}
