import {
  RESET_STORE,
  RESET_QUERY,
  SET_SORT_ORDER,
  SET_SORT_OPTION,
  SET_SUBMISSIONS,
  SET_FILTER_OPTION,
  SET_QUERY,
  SET_QUERY_PAGE,
  SET_PROGRAM,
} from '@/stores/program-submissions/types'

import { InitialState } from './state'

export default {
  [SET_SUBMISSIONS]: (state, payload) => {
    state.submissions = payload
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
    localStorage.setItem('programSubmissionsListSortOption', JSON.stringify(payload))
    localStorage.setItem('programSubmissionsListSortOrder', state.sortOrder)
  },
  [SET_SORT_ORDER]: (state, payload) => {
    state.sortOrder = payload
  },
  [SET_QUERY]: (state, payload) => {
    state.query = payload
  },
  [SET_QUERY_PAGE]: (state, payload) => {
    state.query.page = payload
  },
  [SET_FILTER_OPTION]: (state, payload) => {
    state.filterOption = payload
    localStorage.setItem('programSubmissionsListFilterOption', JSON.stringify(payload))
  },
  [SET_PROGRAM]: (state, payload) => {
    state.program = payload
  },
  [RESET_QUERY]: state => {
    state.submissions = []
    Object.assign(state.query, InitialState.query)
    state.query.page = 1
    state.query.total_pages = 0
  },
  [RESET_STORE]: state => {
    Object.assign(state, InitialState)
    state.submissions = []
    state.query.page = 1
    state.query.total_pages = 0
  },
}
