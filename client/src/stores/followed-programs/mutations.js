import { SET_FOLLOWED_PROGRAMS, SET_LOADING, RESET_STORE } from '@/stores/followed-programs/types'
import { InitialState } from '@/stores/followed-programs/state'

export const mutations = {
  [RESET_STORE](state) {
    Object.assign(state, InitialState)
  },
  [SET_FOLLOWED_PROGRAMS](state, payload) {
    state.followedPrograms = payload
  },
  [SET_LOADING](state, payload) {
    state.loading = payload
  },
}
