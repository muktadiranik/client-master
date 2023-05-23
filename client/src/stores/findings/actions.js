import {
  APPLY_LIST_OPTIONS,
  LOAD_FINDINGS,
  RESET_STORE,
  RESET_QUERY,
  SET_END_DATE,
  SET_START_DATE,
  SET_FILTER_OPTION,
  SET_SORT_OPTION,
  SET_SORT_ORDER,
  SET_FINDINGS,
  SET_FINDINGS_QUERY,
  SET_FINDINGS_QUERY_PAGE,
  SET_FINDINGS_QUERY_VULN,
  SET_FINDINGS_QUERY_FINDING_NAME,
  UPDATE_FINDING_RESOLUTION,
  SET_PRIORITY_QUERY,
  SET_PROGRAM_QUERY,
  SET_STATUS_QUERY,
  GENERATE_CSV,
  SET_KANBAN_FINDINGS,
  LOAD_KANBAN_FINDINGS,
  TOGGLE_KANBAN_STATUS,
  SET_KANBAN_STATUS,
} from '@/stores/findings/types'
import FindingsService from '@/services/api/findings-service'

export default {
  async [LOAD_FINDINGS]({ commit, dispatch, state }, payload) {
    if (payload && payload.page) {
      await dispatch(SET_FINDINGS_QUERY_PAGE, payload.page)
    }
    const response = await FindingsService.getFindings(
      state.findingsQuery.page,
      state.sortOrder,
      state.sortOption.property,
      state.startDate,
      state.endDate,
      state.findingsQuery.vulnerabilityTypes,
      state.findingsQuery.findingNameSearch,
      state.findingsQuery.priority,
      state.findingsQuery.programs,
      state.findingsQuery.status
    )
    const data = response.data
    const query = {
      page: state.findingsQuery.page,
      count: data.count,
      next: data.next,
      previous: data.previous,
      total_pages: data.total_pages,
      vulnerabilityTypes: state.findingsQuery.vulnerabilityTypes,
      findingNameSearch: state.findingsQuery.findingNameSearch,
      priority: state.findingsQuery.priority,
      programs: state.findingsQuery.programs,
      status: state.findingsQuery.status,
    }
    commit(SET_FINDINGS, data.results)
    commit(SET_FINDINGS_QUERY, query)
  },
  async [GENERATE_CSV]({ state }, payload) {
    const response = await FindingsService.getFindings(
      payload,
      state.sortOrder,
      state.sortOption.property,
      state.startDate,
      state.endDate,
      state.findingsQuery.vulnerabilityTypes,
      state.findingsQuery.findingNameSearch,
      state.findingsQuery.priority,
      state.findingsQuery.programs,
      state.findingsQuery.status
    )
    return response.data
  },
  async [LOAD_KANBAN_FINDINGS]({ commit }) {
    const response = await FindingsService.getKanbanFindings()
    const data = response.data
    commit(SET_KANBAN_FINDINGS, data)
  },
  async [APPLY_LIST_OPTIONS]({ commit, dispatch }, payload) {
    if (payload.filter) {
      commit(SET_FILTER_OPTION, payload.filter)
    }

    if (payload.startDate) {
      commit(SET_START_DATE, payload.startDate)
    }

    if (payload.endDate) {
      commit(SET_END_DATE, payload.endDate)
    }

    await dispatch(RESET_QUERY)
    await dispatch(LOAD_FINDINGS)
  },
  async [SET_START_DATE]({ commit, dispatch }, payload) {
    commit(SET_START_DATE, payload)
    await dispatch(LOAD_FINDINGS)
  },
  async [SET_END_DATE]({ commit, dispatch }, payload) {
    commit(SET_END_DATE, payload)
    await dispatch(LOAD_FINDINGS)
  },
  async [SET_SORT_OPTION]({ commit, dispatch }, payload) {
    commit(SET_SORT_OPTION, payload)
    await dispatch(LOAD_FINDINGS)
  },
  async [SET_SORT_ORDER]({ commit }, payload) {
    commit(SET_SORT_ORDER, payload)
  },
  async [RESET_STORE]({ commit }, payload) {
    commit(RESET_STORE)
  },
  async [RESET_QUERY]({ commit }, payload) {
    commit(RESET_QUERY)
  },
  async [SET_FINDINGS_QUERY_PAGE]({ commit, dispatch }, payload) {
    commit(SET_FINDINGS_QUERY_PAGE, payload)
    await dispatch(LOAD_FINDINGS)
  },
  async [SET_FINDINGS_QUERY_VULN]({ commit, dispatch }, payload) {
    commit(SET_FINDINGS_QUERY_VULN, payload)
    await dispatch(LOAD_FINDINGS)
  },
  async [SET_FINDINGS_QUERY_FINDING_NAME]({ commit, dispatch }, payload) {
    commit(SET_FINDINGS_QUERY_FINDING_NAME, payload)
    await dispatch(LOAD_FINDINGS)
  },
  async [UPDATE_FINDING_RESOLUTION]({ commit }, payload) {
    await FindingsService.editFinding(payload)
  },
  async [SET_PRIORITY_QUERY]({ commit, dispatch }, payload) {
    commit(SET_PRIORITY_QUERY, payload)
    await dispatch(LOAD_FINDINGS)
  },
  async [SET_PROGRAM_QUERY]({ commit, dispatch }, payload) {
    commit(SET_PROGRAM_QUERY, payload)
    await dispatch(LOAD_FINDINGS)
  },
  async [SET_STATUS_QUERY]({ commit, dispatch }, payload) {
    commit(SET_STATUS_QUERY, payload)
    await dispatch(LOAD_FINDINGS)
  },
  async [TOGGLE_KANBAN_STATUS]({ commit }) {
    commit(TOGGLE_KANBAN_STATUS)
  },
  async [SET_KANBAN_STATUS]({ commit }, payload) {
    commit(SET_KANBAN_STATUS, payload)
  },
}
