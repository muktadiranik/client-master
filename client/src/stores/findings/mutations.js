import {
  RESET_STORE,
  RESET_QUERY,
  SET_END_DATE,
  SET_START_DATE,
  SET_FILTER_OPTION,
  SET_FINDINGS,
  SET_FINDINGS_QUERY,
  SET_FINDINGS_QUERY_PAGE,
  SET_SORT_ORDER,
  SET_SORT_OPTION,
  SET_FINDINGS_QUERY_VULN,
  SET_FINDINGS_QUERY_FINDING_NAME,
  UPDATE_NEW_FINDINGS,
  UPDATE_IN_PROGRESS_FINDINGS,
  UPDATE_CLOSED_FINDINGS,
  SET_PRIORITY_QUERY,
  SET_PROGRAM_QUERY,
  SET_STATUS_QUERY,
  ADD_NEW_FINDING,
  ADD_IN_PROGRESS_FINDING,
  ADD_CLOSED_FINDING,
  REMOVE_CLOSED_FINDING,
  REMOVE_NEW_FINDING,
  SET_KANBAN_FINDINGS,
  TOGGLE_KANBAN_STATUS,
  SET_KANBAN_STATUS,
} from '@/stores/findings/types'

import { InitialState } from './state'
export default {
  [SET_FINDINGS]: (state, payload) => {
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
    // store all findings
    state.findings = payload
  },
  [SET_KANBAN_FINDINGS]: (state, payload) => {
    const updatedNewFindings = []
    const updatedInProgressFindings = []
    const updatedClosedFindings = []
    for (let finding of payload) {
      switch (finding.resolution) {
        case 'New':
          updatedNewFindings.push(finding)
          break
        case 'New Rediscovered':
          updatedNewFindings.push(finding)
          break
        case 'In Progress':
          updatedInProgressFindings.push(finding)
          break
        case 'Closed Risk Accepted':
          updatedClosedFindings.push(finding)
          break
        case 'Closed Remediated':
          updatedClosedFindings.push(finding)
          break
        case 'Closed Verified':
          updatedClosedFindings.push(finding)
          break
      }
    }
    state.kanbanNewFindings = updatedNewFindings
    state.kanbanInProgressFindings = updatedInProgressFindings
    state.kanbanClosedFindings = updatedClosedFindings
  },
  [SET_END_DATE]: (state, payload) => {
    state.endDate = payload
  },
  [SET_START_DATE]: (state, payload) => {
    state.startDate = payload
  },
  [SET_FILTER_OPTION]: (state, payload) => {
    state.filterOption = payload
    localStorage.setItem('findingsListFilterOption', JSON.stringify(payload))
  },
  [SET_SORT_OPTION]: (state, payload) => {
    if (state.sortOption === payload) {
      if (state.sortOrder === 'asc') {
        state.sortOrder = 'desc'
      } else {
        state.sortOrder = 'asc'
      }
    } else {
      state.sortOrder = 'asc'
    }

    state.sortOption = payload
    // localStorage.setItem('findingsListSortOption', JSON.stringify(payload))
    // localStorage.setItem('findingsListSortOrder', state.sortOrder)
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
    state.kanbanNewFindings = payload
  },
  [UPDATE_IN_PROGRESS_FINDINGS]: (state, payload) => {
    state.kanbanInProgressFindings = payload
  },
  [UPDATE_CLOSED_FINDINGS]: (state, payload) => {
    state.kanbanClosedFindings = payload
  },
  [SET_PRIORITY_QUERY]: (state, payload) => {
    if (state.findingsQuery.priority === payload) {
      state.findingsQuery.priority = ''
      return
    }
    state.findingsQuery.priority = payload
  },
  [SET_PROGRAM_QUERY]: (state, payload) => {
    state.findingsQuery.programs = payload
  },
  [SET_STATUS_QUERY]: (state, payload) => {
    if (state.findingsQuery.status === payload) {
      state.findingsQuery.status = ''
      return
    }
    state.findingsQuery.status = payload
  },
  [ADD_NEW_FINDING]: (state, payload) => {
    state.kanbanNewFindings.push(payload)
  },
  [ADD_IN_PROGRESS_FINDING]: (state, payload) => {
    state.kanbanInProgressFindings.push(payload)
  },
  [ADD_CLOSED_FINDING]: (state, payload) => {
    state.kanbanClosedFindings.push(payload)
  },
  [REMOVE_CLOSED_FINDING]: (state, payload) => {
    const existingIndex = state.kanbanClosedFindings.indexOf(payload)
    state.kanbanClosedFindings.splice(existingIndex, 1)
  },
  [REMOVE_NEW_FINDING]: (state, payload) => {
    const existingIndex = state.kanbanNewFindings.indexOf(payload)
    state.kanbanNewFindings.splice(existingIndex, 1)
  },
  [TOGGLE_KANBAN_STATUS]: state => {
    state.isKanban = !state.isKanban
  },
  [SET_KANBAN_STATUS]: (state, payload) => {
    state.isKanban = payload
  },
}
