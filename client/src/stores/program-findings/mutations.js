import {
  RESET_STORE,
  RESET_QUERY,
  SET_END_DATE,
  SET_START_DATE,
  SET_SORT_ORDER,
  SET_SORT_OPTION,
  SET_PROGRAM_FINDINGS,
  SET_PROGRAM_NEW_FINDINGS,
  SET_PROGRAM_IN_PROGRESS_FINDINGS,
  SET_PROGRAM_CLOSED_FINDINGS,
  SET_FILTER_OPTION,
  SET_FINDINGS_QUERY,
  SET_FINDINGS_QUERY_PAGE,
  SET_PROGRAM,
  SET_FINDINGS_QUERY_VULN,
  SET_FINDINGS_QUERY_FINDING_NAME,
  UPDATE_NEW_FINDINGS,
  UPDATE_ACCEPTED_FINDINGS,
  UPDATE_IN_PROGRESS_FINDINGS,
  UPDATE_REMEDIATED_FINDINGS,
  UPDATE_CLOSED_FINDINGS,
  SET_PRIORITY_QUERY,
  ADD_IN_PROGRESS_FINDING,
  ADD_NEW_FINDING,
  REMOVE_CLOSED_FINDING,
} from '@/stores/program-findings/types'

import { InitialState } from './state'

export default {
  [SET_PROGRAM_FINDINGS]: (state, payload) => {
    const updatedNewFindings = []
    const updatedInProgressFindings = []
    const updatedAcceptedFindings = []
    const updatedRemediatedFindings = []
    for (let finding of payload) {
      switch (finding.resolution) {
        case 'New':
          updatedNewFindings.push(finding)
          break
        case 'In Progress':
          updatedInProgressFindings.push(finding)
          break
        case 'Risk Accepted':
          updatedAcceptedFindings.push(finding)
          break
        case 'Remediated':
          updatedRemediatedFindings.push(finding)
          break
      }
    }
    state.newFindings = updatedNewFindings
    state.inProgressFindings = updatedInProgressFindings
    state.acceptedFindings = updatedAcceptedFindings
    state.remediatedFindings = updatedRemediatedFindings
  },
  [SET_PROGRAM_NEW_FINDINGS]: (state, payload) => {
    const updatedNewFindings = []
    for (let finding of payload) {
      updatedNewFindings.push(finding)
    }
    state.newFindings = updatedNewFindings
  },
  [SET_PROGRAM_IN_PROGRESS_FINDINGS]: (state, payload) => {
    const updatedInProgressFindings = []
    for (let finding of payload) {
      updatedInProgressFindings.push(finding)
    }
    state.inProgressFindings = updatedInProgressFindings
  },
  [SET_PROGRAM_CLOSED_FINDINGS]: (state, payload) => {
    const updatedClosedFindings = []
    for (let finding of payload) {
      updatedClosedFindings.push(finding)
    }
    state.closedFindings = updatedClosedFindings
  },
  [SET_END_DATE]: (state, payload) => {
    state.endDate = payload
  },
  [SET_START_DATE]: (state, payload) => {
    state.startDate = payload
  },
  [SET_SORT_OPTION]: (state, payload) => {
    if (state.sortOption === payload) {
      if (state.sortOrder === 'asc') {
        state.sortOrder = 'desc'
      } else {
        state.sortOrder = 'asc'
      }
    }

    state.sortOption = payload
    localStorage.setItem('findingsListSortOption', JSON.stringify(payload))
    localStorage.setItem('findingsListSortOrder', state.sortOrder)
  },
  [SET_SORT_ORDER]: (state, payload) => {
    state.sortOrder = payload
  },
  [SET_FINDINGS_QUERY]: (state, payload) => {
    state.findingsQuery = payload
  },
  [SET_FINDINGS_QUERY_PAGE]: (state, payload) => {
    state.findingsQuery.page = payload
  },
  [SET_FILTER_OPTION]: (state, payload) => {
    state.filterOption = payload
    localStorage.setItem('findingsListFilterOption', JSON.stringify(payload))
  },
  [SET_PROGRAM]: (state, payload) => {
    state.program = payload
  },
  [RESET_QUERY]: state => {
    state.findings = []
    const selectedVulnTypes = state.findingsQuery.vulnerabilityTypes
    const searchTerm = state.findingsQuery.findingNameSearch
    Object.assign(state.findingsQuery, InitialState.findingsQuery)
    state.findingsQuery.page = 1
    state.findingsQuery.total_pages = 0
    state.findingsQuery.vulnerabilityTypes = selectedVulnTypes
    state.findingsQuery.findingNameSearch = searchTerm
  },
  [RESET_STORE]: state => {
    Object.assign(state, InitialState)
    state.findingsQuery.page = 1
    state.findingsQuery.total_pages = 0
  },
  [SET_FINDINGS_QUERY_VULN]: (state, payload) => {
    state.findingsQuery.vulnerabilityTypes = payload
    // set to local storage
    localStorage.setItem('findingsListFilterOptionVulnTypes', JSON.stringify(state.findingsQuery.vulnerabilityTypes))
  },
  [SET_FINDINGS_QUERY_FINDING_NAME]: (state, payload) => {
    state.findingsQuery.findingNameSearch = payload
    // set to local storage
    localStorage.setItem('findingsListFilterFindingName', JSON.stringify(state.findingsQuery.findingNameSearch))
  },
  [UPDATE_NEW_FINDINGS]: (state, payload) => {
    state.newFindings = payload
  },
  [UPDATE_IN_PROGRESS_FINDINGS]: (state, payload) => {
    state.inProgressFindings = payload
  },
  [UPDATE_ACCEPTED_FINDINGS]: (state, payload) => {
    state.acceptedFindings = payload
  },
  [UPDATE_REMEDIATED_FINDINGS]: (state, payload) => {
    state.remediatedFindings = payload
  },
  [UPDATE_CLOSED_FINDINGS]: (state, payload) => {
    state.closedFindings = payload
  },
  [SET_PRIORITY_QUERY]: (state, payload) => {
    const existingIndex = state.findingsQuery.priorities.indexOf(payload)
    if (existingIndex < 0) {
      state.findingsQuery.priorities.push(payload)
    } else {
      state.findingsQuery.priorities.splice(existingIndex, 1)
    }
  },
  [ADD_NEW_FINDING]: (state, payload) => {
    state.newFindings.push(payload)
  },
  [ADD_IN_PROGRESS_FINDING]: (state, payload) => {
    state.inProgressFindings.push(payload)
  },
  [REMOVE_CLOSED_FINDING]: (state, payload) => {
    const existingIndex = state.closedFindings.indexOf(payload)
    state.closedFindings.splice(existingIndex, 1)
  },
}
