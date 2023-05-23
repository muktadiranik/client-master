import {
  LOAD_FOLLOWED_PROGRAMS,
  RESET_STORE,
  SET_FOLLOWED_PROGRAMS,
  SET_LOADING,
  TOGGLE_FOLLOWING,
} from '@/stores/followed-programs/types'
import ProgramService from '@/services/api/program-service'

export const actions = {
  async [LOAD_FOLLOWED_PROGRAMS]({ commit }) {
    commit(SET_LOADING, true)
    try {
      const response = await ProgramService.getFollowedPrograms()
      const followedPrograms = response.data.results
      commit(SET_FOLLOWED_PROGRAMS, followedPrograms)
    } catch (e) {
      this._vm.$caAlert.error('Failed to retrieve followed programs.')
    } finally {
      commit(SET_LOADING, false)
    }
  },
  async [RESET_STORE]({ commit }) {
    commit(RESET_STORE)
  },
  async [TOGGLE_FOLLOWING]({ commit, dispatch }, payload) {
    commit(SET_LOADING, true)
    try {
      await ProgramService.toggleFollowing(payload)
      await dispatch(LOAD_FOLLOWED_PROGRAMS)
    } catch (e) {
      this._vm.$caAlert.error('Failed to update program favorite status.')
    } finally {
      commit(SET_LOADING, false)
    }
  },
}
