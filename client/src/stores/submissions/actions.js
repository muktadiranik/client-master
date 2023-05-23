import {
  LOAD_SUBMISSIONS,
  LOAD_SUBMISSION_PRIORITIES,
  LOAD_SUBMISSION_RESOLUTIONS,
  LOAD_SUBMISSION_STATUSES,
  RELOAD_SUBMISSIONS,
  RESET_QUERY,
  RESET_STORE,
  SET_ACTIVE_RESEARCHER_POPOVER,
  SET_FILTER_OPTION,
  SET_SUBMISSIONS,
  SET_SUBMISSIONS_QUERY,
  SET_SUBMISSIONS_QUERY_PAGE,
  SET_SUBMISSION_PRIORITIES,
  SET_SUBMISSION_RESOLUTIONS,
  SET_SUBMISSION_STATUSES,
  SET_SORT_OPTION,
  SET_SORT_ORDER,
  UPDATE_SUBMISSIONS,
  TOGGLE_KANBAN_STATUS,
  LOAD_KANBAN_SUBMISSIONS,
  SET_KANBAN_SUBMISSIONS,
  SET_PRIORITY_QUERY,
  SET_STATUS_QUERY,
  SET_SUBMISSIONS_QUERY_PAYMENT,
  SET_SUBMISSIONS_QUERY_SUBMISSION_NAME,
  SET_SUBMISSIONS_QUERY_VALID,
} from '@/stores/submissions/types'
import SubmissionService from '@/services/api/submission-service'

export default {
  async [LOAD_SUBMISSIONS]({ commit, dispatch, state }, payload) {
    if (payload && payload.page) {
      await dispatch(SET_SUBMISSIONS_QUERY_PAGE, payload.page)
    }
    const response = await SubmissionService.getSubmissions(
      state.submissionsQuery.page,
      state.sortOrder,
      state.sortOption.property,
      state.startDate,
      state.endDate,
      state.submissionsQuery.submissionNameSearch,
      state.submissionsQuery.priority,
      state.submissionsQuery.status,
      state.submissionsQuery.payment,
      state.submissionsQuery.validOnly
    )
    const data = response.data
    const query = {
      page: state.submissionsQuery.page,
      count: data.count,
      next: data.next,
      previous: data.previous,
      total_pages: data.total_pages,
    }
    commit(SET_SUBMISSIONS, data.results)
    commit(SET_SUBMISSIONS_QUERY, query)
  },
  async [LOAD_KANBAN_SUBMISSIONS]({ commit }) {
    const response = await SubmissionService.getKanbanSubmissions()
    const data = response.data
    commit(SET_KANBAN_SUBMISSIONS, data)
  },
  async [RELOAD_SUBMISSIONS]({ commit, state }) {
    const currentPage = state.submissionsQuery.page
    let submissions = []
    for (let i = 0, len = currentPage; i < len; i++) {
      const response = await SubmissionService.getSubmissions(
        i + 1,
        state.sortOption.property,
        state.sortOrder,
        state.filterOption.property
      )

      submissions = [...submissions, ...response.data.results]
      commit(SET_SUBMISSIONS_QUERY, {
        page: currentPage,
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      })
    }

    commit(UPDATE_SUBMISSIONS, submissions)
  },
  async [LOAD_SUBMISSION_STATUSES]({ commit, state }) {
    try {
      if (state.submissionStatuses.length > 0) {
        return
      }
      const response = await SubmissionService.getStatuses()
      commit(SET_SUBMISSION_STATUSES, response.data)
    } catch (e) {
      this._vm.$caAlert.error('Failed to load submission')
    }
  },
  async [LOAD_SUBMISSION_RESOLUTIONS]({ commit, state }) {
    try {
      if (state.submissionResolutions.length > 0) {
        return
      }
      const response = await SubmissionService.getResolutions()
      commit(SET_SUBMISSION_RESOLUTIONS, response.data)
    } catch (e) {
      this._vm.$caAlert.error('Failed to load submission resolutions')
    }
  },
  async [LOAD_SUBMISSION_PRIORITIES]({ commit, state }) {
    try {
      if (state.submissionPriorities.length > 0) {
        return
      }
      const response = await SubmissionService.getPriorities()
      commit(SET_SUBMISSION_PRIORITIES, response.data)
    } catch (e) {
      this._vm.$caAlert.error('Failed to load submission resolutions')
    }
  },
  async [SET_ACTIVE_RESEARCHER_POPOVER]({ commit }, payload) {
    commit(SET_ACTIVE_RESEARCHER_POPOVER, payload)
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
  async [SET_SUBMISSIONS_QUERY_PAGE]({ commit, dispatch }, payload) {
    commit(SET_SUBMISSIONS_QUERY_PAGE, payload)
    await dispatch(LOAD_SUBMISSIONS)
  },
  async [RESET_STORE]({ commit }) {
    commit(RESET_STORE)
  },
  async [RESET_QUERY]({ commit }) {
    commit(RESET_QUERY)
  },
  async [TOGGLE_KANBAN_STATUS]({ commit }) {
    commit(TOGGLE_KANBAN_STATUS)
  },
  async [SET_PRIORITY_QUERY]({ commit, dispatch }, payload) {
    commit(SET_PRIORITY_QUERY, payload)
    await dispatch(LOAD_SUBMISSIONS)
  },
  async [SET_STATUS_QUERY]({ commit, dispatch }, payload) {
    commit(SET_STATUS_QUERY, payload)
    await dispatch(LOAD_SUBMISSIONS)
  },
  async [SET_SUBMISSIONS_QUERY_SUBMISSION_NAME]({ commit, dispatch }, payload) {
    commit(SET_SUBMISSIONS_QUERY_SUBMISSION_NAME, payload)
    await dispatch(LOAD_SUBMISSIONS)
  },
  async [SET_SUBMISSIONS_QUERY_PAYMENT]({ commit, dispatch }, payload) {
    commit(SET_SUBMISSIONS_QUERY_PAYMENT, payload)
    await dispatch(LOAD_SUBMISSIONS)
  },
  async [SET_SUBMISSIONS_QUERY_VALID]({ commit, dispatch }) {
    commit(SET_SUBMISSIONS_QUERY_VALID)
    await dispatch(LOAD_SUBMISSIONS)
  },
}
