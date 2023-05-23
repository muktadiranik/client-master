import {
  RESET_STORE,
  RESET_QUERY,
  SET_ACTIVE_RESEARCHER_POPOVER,
  SET_SORT_ORDER,
  SET_SORT_OPTION,
  SET_FILTER_OPTION,
  SET_SUBMISSIONS,
  SET_SUBMISSION_PRIORITIES,
  SET_SUBMISSION_RESOLUTIONS,
  SET_SUBMISSION_STATUSES,
  SET_SUBMISSIONS_QUERY,
  SET_SUBMISSIONS_QUERY_PAGE,
  UPDATE_SUBMISSIONS,
  TOGGLE_KANBAN_STATUS,
  SET_KANBAN_SUBMISSIONS,
  SET_STATUS_QUERY,
  SET_PRIORITY_QUERY,
  SET_SUBMISSIONS_QUERY_SUBMISSION_NAME,
  SET_SUBMISSIONS_QUERY_PAYMENT,
  SET_SUBMISSIONS_QUERY_VALID,
} from '@/stores/submissions/types'
import Vue from 'vue'

import { InitialState } from '@/stores/submissions/state'

export default {
  [SET_ACTIVE_RESEARCHER_POPOVER]: (state, payload) => {
    state.activeResearcherPopover = payload
  },
  [SET_FILTER_OPTION]: (state, payload) => {
    state.filterOption = payload
    localStorage.setItem('submissionsListFilterOption', JSON.stringify(payload))
  },
  [SET_SUBMISSIONS]: (state, payload) => {
    state.submissions = payload
  },
  [SET_SUBMISSION_RESOLUTIONS]: (state, payload) => {
    Vue.set(state, 'submissionResolutions', payload)
  },
  [SET_SUBMISSION_STATUSES]: (state, payload) => {
    state.submissionStatuses = payload
  },
  [SET_SUBMISSION_PRIORITIES]: (state, payload) => {
    state.submissionPriorities = payload
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
    localStorage.setItem('submissionsListSortOption', JSON.stringify(payload))
    localStorage.setItem('submissionsListSortOrder', state.sortOrder)
  },
  [SET_SORT_ORDER]: (state, payload) => {
    state.sortOrder = payload
  },
  [SET_SUBMISSIONS_QUERY]: (state, payload) => {
    state.submissionsQuery = Object.assign(state.submissionsQuery, payload)
  },
  [SET_SUBMISSIONS_QUERY_PAGE]: (state, payload) => {
    state.submissionsQuery.page = payload
  },
  [RESET_QUERY]: state => {
    state.submissions = []
    Object.assign(state.submissionsQuery, InitialState.submissionsQuery)
    state.submissionsQuery.page = 1
    state.submissionsQuery.total_pages = 0
  },
  [RESET_STORE]: state => {
    Object.assign(state, InitialState)
    state.submissions = []
    state.submissionsQuery.page = 1
    state.submissionsQuery.total_pages = 0
  },
  [UPDATE_SUBMISSIONS]: (state, payload) => {
    state.submissions = payload
  },
  [TOGGLE_KANBAN_STATUS]: state => {
    state.isSubmissionKanban = !state.isSubmissionKanban
  },
  [SET_KANBAN_SUBMISSIONS]: (state, payload) => {
    const updatedNewSubmissions = []
    const updatedInProgressSubmissions = []
    const updatedClosedSubmissions = []
    for (let submission of payload) {
      switch (submission.status_display) {
        case 'New':
          updatedNewSubmissions.push(submission)
          break
        case 'In review':
          updatedInProgressSubmissions.push(submission)
          break
        case 'Validating':
          updatedInProgressSubmissions.push(submission)
          break
        case 'Closed':
          updatedClosedSubmissions.push(submission)
          break
      }
    }
    state.kanbanNewSubmissions = updatedNewSubmissions
    state.kanbanInProgressSubmissions = updatedInProgressSubmissions
    state.kanbanClosedSubmissions = updatedClosedSubmissions
  },
  [SET_PRIORITY_QUERY]: (state, payload) => {
    if (state.submissionsQuery.priority === payload) {
      state.submissionsQuery.priority = ''
      return
    }
    state.submissionsQuery.priority = payload
  },
  [SET_STATUS_QUERY]: (state, payload) => {
    if (state.submissionsQuery.status === payload) {
      state.submissionsQuery.status = ''
      return
    }
    state.submissionsQuery.status = payload
  },
  [SET_SUBMISSIONS_QUERY_SUBMISSION_NAME]: (state, payload) => {
    state.submissionsQuery.submissionNameSearch = payload
    // set to local storage
    localStorage.setItem(
      'submissionsListFilterSubmissionName',
      JSON.stringify(state.submissionsQuery.submissionNameSearch)
    )
  },
  [SET_SUBMISSIONS_QUERY_PAYMENT]: (state, payload) => {
    state.submissionsQuery.payment = payload
  },
  [SET_SUBMISSIONS_QUERY_VALID]: state => {
    state.submissionsQuery.validOnly = !state.submissionsQuery.validOnly
  },
}
