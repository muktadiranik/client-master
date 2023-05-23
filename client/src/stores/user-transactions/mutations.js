import {
  SET_FILTER_OPTION,
  SET_SORT_OPTION,
  SET_SORT_ORDER,
  SET_TRANSACTIONS_QUERY,
  SET_TRANSACTIONS_QUERY_PAGE,
  SET_TRANSACTIONS,
  SET_LOADING,
  SET_USER_PROFILE,
  RESET_QUERY,
  RESET_STORE,
} from '@/stores/user-transactions/types'
import { InitialState } from '@/stores/user-transactions/state'

export const mutations = {
  [SET_FILTER_OPTION]: (state, payload) => {
    state.filterOption = payload
    localStorage.setItem('userTransactionsListFilterOption', JSON.stringify(payload))
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
    localStorage.setItem('userTransactionsListSortOption', JSON.stringify(payload))
    localStorage.setItem('userTransactionsListSortOrder', state.sortOrder)
  },
  [SET_SORT_ORDER]: (state, payload) => {
    state.sortOrder = payload
  },
  [SET_TRANSACTIONS]: (state, payload) => {
    state.transactions = payload.filter((thing, index, self) => index === self.findIndex(t => t.uuid === thing.uuid))
  },
  [SET_TRANSACTIONS_QUERY]: (state, payload) => {
    state.transactionsQuery = payload
  },
  [SET_TRANSACTIONS_QUERY_PAGE]: (state, payload) => {
    state.transactionsQuery.page = payload
  },
  [SET_LOADING]: (state, payload) => {
    state.loading = payload
  },
  [SET_USER_PROFILE]: (state, payload) => {
    state.userProfile = payload
  },
  [RESET_QUERY]: state => {
    state.transactions = []
    Object.assign(state.transactionsQuery, InitialState.transactionsQuery)
    state.transactionsQuery.page = 1
    state.transactionsQuery.total_pages = 0
  },
  [RESET_STORE]: (state, payload) => {
    state.transactions = []
    state.transactionsQuery = {
      page: 1,
      sortField: 'paid',
      sortOrder: 'desc',
      filterField: 'all',
      next: '',
      total_pages: 0,
    }
    state.loading = false
  },
}
