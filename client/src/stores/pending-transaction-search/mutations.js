import { SET_PENDING_TRANSACTIONS, SET_PENDING_TRANSACTIONS_QUERY } from '@/stores/pending-transaction-search/types'

export default {
  [SET_PENDING_TRANSACTIONS]: (state, payload) => {
    state.pendingTransactions = payload
  },
  [SET_PENDING_TRANSACTIONS_QUERY]: (state, payload) => {
    state.pendingTransactionsQuery.searchTerms = payload.searchTerms
  },
}
