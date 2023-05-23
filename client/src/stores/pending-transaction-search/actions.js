import {
  SEARCH_PENDING_TRANSACTIONS,
  SET_PENDING_TRANSACTIONS,
  SET_PENDING_TRANSACTIONS_QUERY,
} from '@/stores/pending-transaction-search/types'
import TransactionService from '@/services/api/transaction-service'

export default {
  async [SEARCH_PENDING_TRANSACTIONS]({ commit, state }, payload) {
    try {
      const response = await TransactionService.getPendingTransactionsList(
        state.pendingTransactionsQuery.page,
        state.pendingTransactionsQuery.searchTerms
      )
      const results = [...response.data.results]
      commit(SET_PENDING_TRANSACTIONS, results)
    } catch (err) {}
  },
  async [SET_PENDING_TRANSACTIONS_QUERY]({ commit, dispatch }, payload) {
    commit(SET_PENDING_TRANSACTIONS_QUERY, payload)
    dispatch(SEARCH_PENDING_TRANSACTIONS)
  },
}
