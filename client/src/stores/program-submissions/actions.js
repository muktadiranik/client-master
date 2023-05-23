import {
  LOAD_SUBMISSIONS,
  RESET_STORE,
  RESET_QUERY,
  SET_FILTER_OPTION,
  SET_SORT_OPTION,
  SET_SORT_ORDER,
  SET_PROGRAM,
  SET_SUBMISSIONS,
  SET_QUERY,
  SET_QUERY_PAGE,
} from '@/stores/program-submissions/types'
import SubmissionService from '@/services/api/submission-service'

export default {
  async [LOAD_SUBMISSIONS]({ commit, dispatch, state }, payload) {
    if (payload && payload.page) {
      await dispatch(SET_QUERY_PAGE, payload.page)
    }
    const response = await SubmissionService.getProgramSubmissions(
      state.program.uuid,
      state.query.page,
      state.sortOption.property,
      state.sortOrder,
      state.filterOption.property
    )
    const data = response.data
    const query = {
      page: state.query.page,
      count: data.count,
      next: data.next,
      previous: data.previous,
      total_pages: data.total_pages,
    }
    commit(SET_SUBMISSIONS, data.results)
    commit(SET_QUERY, query)
  },
  async [SET_FILTER_OPTION]({ commit, dispatch }, payload) {
    commit(SET_FILTER_OPTION, payload)
    await dispatch(RESET_QUERY)
    await dispatch(LOAD_SUBMISSIONS)
  },
  async [SET_SORT_OPTION]({ commit, dispatch }, payload) {
    commit(SET_SORT_OPTION, payload)
    await dispatch(RESET_QUERY)
    await dispatch(LOAD_SUBMISSIONS)
  },
  async [SET_SORT_ORDER]({ commit }, payload) {
    commit(SET_SORT_ORDER, payload)
  },
  async [SET_PROGRAM]({ commit, dispatch, state }, payload) {
    if (!payload || !payload.uuid) {
      return
    }

    const oldProgramUuid = state.program && state.program.uuid ? state.program.uuid : ''
    if (oldProgramUuid !== payload.uuid) {
      await dispatch(RESET_STORE)
      commit(SET_PROGRAM, payload)
    }
  },
  async [SET_QUERY_PAGE]({ commit, dispatch }, payload) {
    commit(SET_QUERY_PAGE, payload)
    await dispatch(LOAD_SUBMISSIONS)
  },
  async [RESET_STORE]({ commit }, payload) {
    commit(RESET_STORE)
  },
  async [RESET_QUERY]({ commit }, payload) {
    commit(RESET_QUERY)
  },
}
