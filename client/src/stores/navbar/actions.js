import {
  LOAD_PROGRAM,
  LOAD_PROGRAMS_LIST,
  SET_PROGRAM,
  SET_PROGRAMS_LIST,
  SET_PROGRAMS_LIST_QUERY,
  RESET_STORE,
  SET_LOADING,
} from '@/stores/navbar/types'
import ProgramService from '@/services/api/program-service'

export const actions = {
  async [LOAD_PROGRAM]({ commit }, payload) {
    commit(SET_LOADING, true)
    commit(SET_PROGRAM, payload)
    commit(SET_LOADING, false)
  },
  async [LOAD_PROGRAMS_LIST]({ commit, state }, payload) {
    commit(SET_LOADING, true)
    const page = state.query.page + 1
    if (page > 1 && !state.query.next) {
      return
    }
    const response = await ProgramService.getShortProgramsList(page, '')
    const data = response.data
    const query = {
      page: page,
      next: data.next,
      previous: data.previous,
      total_pages: data.total_pages,
      count: data.count,
    }
    commit(SET_PROGRAMS_LIST_QUERY, query)
    commit(SET_PROGRAMS_LIST, data.results)
    commit(SET_LOADING, false)
  },
  async [RESET_STORE]({ commit }) {
    commit(RESET_STORE)
  },
}

export default actions
