import {
  RESET_STORE,
  SET_SORT_OPTION,
  SET_FINDING,
  SET_FINDING_PRIORITIES,
  TOGGLE_LINKING_FINDING,
} from '@/stores/finding/types'

export default {
  [SET_FINDING]: (state, payload) => {
    state.finding = payload
  },
  [SET_FINDING_PRIORITIES]: (state, payload) => {
    state.findingPriorities = payload
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
  [TOGGLE_LINKING_FINDING]: (state, payload) => {
    state.linkingFinding = !state.linkingFinding
  },
  [RESET_STORE]: state => {
    state.finding = {}
    state.linkingFinding = false
  },
}
