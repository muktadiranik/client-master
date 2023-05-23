import {
  LOAD_PROGRAM_TRANSACTIONS_PROGRAM,
  LOAD_TRANSACTIONS,
  SET_FILTER_OPTION,
  SET_PROGRAM,
  SET_SORT_OPTION,
  SET_SORT_ORDER,
  SET_TRANSACTIONS,
  SET_TRANSACTIONS_QUERY,
  SET_TRANSACTIONS_QUERY_PAGE,
  SET_LOADING,
  RESET_QUERY,
  RESET_PROGRAM_TRANSACTIONS_STORE,
} from '@/stores/program-transactions/types'
import BankService from '@/services/api/bank-service'
import TransactionService from '@/services/api/transaction-service'

export const actions = {
  async [LOAD_PROGRAM_TRANSACTIONS_PROGRAM]({ commit }, programUuid) {
    const response = await BankService.getProgramSummary(programUuid)
    commit(SET_PROGRAM, response.data)
  },
  async [LOAD_TRANSACTIONS]({ commit, dispatch, state }, payload) {
    try {
      commit(SET_LOADING, true)
      if (payload && payload.page) {
        await dispatch(SET_TRANSACTIONS_QUERY_PAGE, payload.page)
      }
      const params = {
        page: state.transactionsQuery.page,
        sortDirection: state.sortOrder,
        sortField: state.sortOption.property,
        filterField: 'payments',
        programUuid: state.program.uuid,
        user: null,
        paid: null,
        scheduled: null,
      }
      const response = await TransactionService.getTransactionList(params)
      const data = response.data
      commit(SET_TRANSACTIONS_QUERY, {
        page: state.transactionsQuery.page,
        count: data.count,
        next: data.next,
        previous: data.previous,
        total_pages: data.total_pages,
      })
      commit(SET_TRANSACTIONS, data.results)
    } catch (err) {
      commit(SET_TRANSACTIONS, [])
    } finally {
      commit(SET_LOADING, false)
    }
  },
  async [SET_FILTER_OPTION]({ commit, dispatch }, payload) {
    commit(SET_FILTER_OPTION, payload)
    await dispatch(RESET_QUERY)
    await dispatch(LOAD_TRANSACTIONS)
  },
  async [SET_SORT_OPTION]({ commit, dispatch }, payload) {
    commit(SET_SORT_OPTION, payload)
    await dispatch(RESET_QUERY)
    await dispatch(LOAD_TRANSACTIONS)
  },
  async [SET_SORT_ORDER]({ commit }, payload) {
    commit(SET_SORT_ORDER, payload)
  },
  async [SET_TRANSACTIONS_QUERY]({ commit, dispatch }, payload) {
    commit(SET_TRANSACTIONS_QUERY, payload)
    await dispatch(LOAD_TRANSACTIONS)
  },
  async [SET_TRANSACTIONS_QUERY_PAGE]({ commit, dispatch }, payload) {
    commit(SET_TRANSACTIONS_QUERY_PAGE, payload)
    await dispatch(LOAD_TRANSACTIONS)
  },
  async [RESET_QUERY]({ commit }) {
    commit(RESET_QUERY)
  },
  async [RESET_PROGRAM_TRANSACTIONS_STORE]({ commit }) {
    commit(RESET_PROGRAM_TRANSACTIONS_STORE)
  },
}
