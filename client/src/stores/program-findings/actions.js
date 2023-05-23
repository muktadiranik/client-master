import {
  APPLY_LIST_OPTIONS,
  LOAD_PROGRAM_FINDINGS,
  LOAD_PROGRAM_NEW_FINDINGS,
  LOAD_PROGRAM_IN_PROGRESS_FINDINGS,
  LOAD_PROGRAM_CLOSED_FINDINGS,
  RESET_STORE,
  RESET_QUERY,
  SET_END_DATE,
  SET_START_DATE,
  SET_FILTER_OPTION,
  SET_SORT_OPTION,
  SET_SORT_ORDER,
  SET_PROGRAM,
  SET_PROGRAM_FINDINGS,
  SET_PROGRAM_NEW_FINDINGS,
  SET_PROGRAM_IN_PROGRESS_FINDINGS,
  SET_PROGRAM_CLOSED_FINDINGS,
  SET_FINDINGS_QUERY,
  SET_FINDINGS_QUERY_PAGE,
  SET_FINDINGS_QUERY_VULN,
  SET_FINDINGS_QUERY_FINDING_NAME,
  PROGRAM_FINDINGS_SET_QUERY_VULN,
  UPDATE_FINDING_RESOLUTION,
  SET_PRIORITY_QUERY,
} from '@/stores/program-findings/types'
import FindingsService from '@/services/api/findings-service'

export default {
  async [LOAD_PROGRAM_FINDINGS]({ commit, dispatch, state }, payload) {
    if (payload && payload.page) {
      await dispatch(SET_FINDINGS_QUERY_PAGE, payload.page)
    }
    const response = await FindingsService.getProgramFindings(
      state.program.uuid,
      state.findingsQuery.page,
      state.sortOrder,
      state.sortOption.property,
      state.filterOption.property,
      state.startDate,
      state.endDate,
      state.findingsQuery.vulnerabilityTypes,
      state.findingsQuery.findingNameSearch,
      state.findingsQuery.priorities
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
      priorities: state.findingsQuery.priorities,
    }

    commit(SET_PROGRAM_FINDINGS, data.results)
    commit(SET_FINDINGS_QUERY, query)
  },
  async [LOAD_PROGRAM_NEW_FINDINGS]({ commit, dispatch, state }, payload) {
    // new findings query
    const response = await FindingsService.getProgramFindings(
      state.program.uuid,
      state.findingsQuery.page,
      state.sortOrder,
      state.sortOption.property,
      state.filterOption.property,
      state.startDate,
      state.endDate,
      state.findingsQuery.vulnerabilityTypes,
      state.findingsQuery.findingNameSearch,
      state.findingsQuery.priorities,
      [1]
    )
    const data = response.data
    commit(SET_PROGRAM_NEW_FINDINGS, data.results)
  },
  async [LOAD_PROGRAM_IN_PROGRESS_FINDINGS]({ commit, dispatch, state }, payload) {
    // in progress findings query
    const response = await FindingsService.getProgramFindings(
      state.program.uuid,
      state.findingsQuery.page,
      state.sortOrder,
      state.sortOption.property,
      state.filterOption.property,
      state.startDate,
      state.endDate,
      state.findingsQuery.vulnerabilityTypes,
      state.findingsQuery.findingNameSearch,
      state.findingsQuery.priorities,
      [4]
    )
    const data = response.data
    commit(SET_PROGRAM_IN_PROGRESS_FINDINGS, data.results)
  },
  async [LOAD_PROGRAM_CLOSED_FINDINGS]({ commit, dispatch, state }, payload) {
    // closed findings query (resolutions 2-3)
    const response = await FindingsService.getProgramFindings(
      state.program.uuid,
      state.findingsQuery.page,
      state.sortOrder,
      state.sortOption.property,
      state.filterOption.property,
      state.startDate,
      state.endDate,
      state.findingsQuery.vulnerabilityTypes,
      state.findingsQuery.findingNameSearch,
      state.findingsQuery.priorities,
      [2, 3]
    )
    const data = response.data
    commit(SET_PROGRAM_CLOSED_FINDINGS, data.results)
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
    await dispatch(LOAD_PROGRAM_FINDINGS)
  },
  async [SET_FINDINGS_QUERY_PAGE]({ commit, dispatch }, payload) {
    commit(SET_FINDINGS_QUERY_PAGE, payload)
    await dispatch(LOAD_PROGRAM_FINDINGS)
  },
  async [SET_SORT_OPTION]({ commit, dispatch }, payload) {
    commit(SET_SORT_OPTION, payload)
    await dispatch(RESET_QUERY)
    await dispatch(LOAD_PROGRAM_FINDINGS)
  },
  async [SET_SORT_ORDER]({ commit }, payload) {
    commit(SET_SORT_ORDER, payload)
  },
  async [SET_START_DATE]({ commit, dispatch }, payload) {
    commit(SET_START_DATE, payload)
    await dispatch(LOAD_PROGRAM_FINDINGS)
  },
  async [SET_END_DATE]({ commit, dispatch }, payload) {
    commit(SET_END_DATE, payload)
    await dispatch(LOAD_PROGRAM_FINDINGS)
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
  async [RESET_STORE]({ commit }, payload) {
    commit(RESET_STORE)
  },
  async [RESET_QUERY]({ commit }, payload) {
    commit(RESET_QUERY)
  },
  async [SET_FINDINGS_QUERY_VULN]({ commit, dispatch }, payload) {
    commit(SET_FINDINGS_QUERY_VULN, payload)
    await dispatch(LOAD_PROGRAM_FINDINGS)
  },
  async [SET_FINDINGS_QUERY_FINDING_NAME]({ commit, dispatch }, payload) {
    commit(SET_FINDINGS_QUERY_FINDING_NAME, payload)
    await dispatch(LOAD_PROGRAM_FINDINGS)
  },
  async [PROGRAM_FINDINGS_SET_QUERY_VULN]({ commit, dispatch }, payload) {
    commit(PROGRAM_FINDINGS_SET_QUERY_VULN, payload)
    await dispatch(LOAD_PROGRAM_FINDINGS)
  },
  async [UPDATE_FINDING_RESOLUTION]({ commit }, payload) {
    await FindingsService.editFinding(payload)
  },
  async [SET_PRIORITY_QUERY]({ commit, dispatch }, payload) {
    commit(SET_PRIORITY_QUERY, payload)
    await dispatch(LOAD_PROGRAM_FINDINGS)
  },
}
