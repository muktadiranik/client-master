import {
  SET_FILTER_OPTION,
  SET_SORT_OPTION,
  SET_SORT_ORDER,
  SET_TRANSACTIONS_QUERY,
  SET_TRANSACTIONS_QUERY_PAGE,
  SET_TRANSACTIONS,
  SET_LOADING,
  RESET_QUERY,
  RESET_STORE,
} from '@/stores/pending-transactions/types'
import { InitialState } from '@/stores/pending-transactions/state'
import Vue from 'vue'

export const mutations = {
  [SET_FILTER_OPTION]: (state, payload) => {
    state.filterOption = payload
    localStorage.setItem('pendingTransactionsListFilterOption', JSON.stringify(payload))
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
    localStorage.setItem('pendingTransactionsListSortOption', JSON.stringify(payload))
    localStorage.setItem('pendingTransactionsListSortOrder', state.sortOrder)
  },
  [SET_SORT_ORDER]: (state, payload) => {
    state.sortOrder = payload
  },
  [SET_TRANSACTIONS]: (state, payload) => {
    Vue.set(state, 'transactions', payload)
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
