import {
  LOAD_TRANSACTIONS,
  LOAD_USER_PROFILE,
  SET_FILTER_OPTION,
  SET_SORT_OPTION,
  SET_SORT_ORDER,
  SET_TRANSACTIONS,
  SET_TRANSACTIONS_QUERY,
  SET_TRANSACTIONS_QUERY_PAGE,
  SET_LOADING,
  SET_USER_PROFILE,
  RESET_QUERY,
  RESET_STORE,
  SET_TRANSACTIONS_TITLE_QUERY,
} from '@/stores/user-profile-transactions/types'
import TransactionService from '@/services/api/transaction-service'
import BankService from '@/services/api/bank-service'

export const actions = {
  async [LOAD_TRANSACTIONS]({ commit, dispatch, state }, payload) {
    try {
      commit(SET_LOADING, true)
      if (payload && payload.page) {
        await dispatch(SET_TRANSACTIONS_QUERY_PAGE, payload.page)
      }
      const username = state.userProfile.username
      const params = {
        page: state.transactionsQuery.page,
        sortDirection: state.sortOrder,
        sortField: state.sortOption.property,
        filterField: state.filterOption.property,
        programUuid: null,
        user: username,
        paid: null,
        scheduled: null,
        title: state.transactionsQuery.title,
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
  async [LOAD_USER_PROFILE]({ commit }, profileUuid) {
    const response = await BankService.getUserProfile(profileUuid)
    commit(SET_USER_PROFILE, response.data)
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
  async [RESET_STORE]({ commit }) {
    commit(RESET_STORE)
  },
  async [SET_TRANSACTIONS_TITLE_QUERY]({ commit, dispatch }, payload) {
    commit(SET_TRANSACTIONS_TITLE_QUERY, payload)
    await dispatch(LOAD_TRANSACTIONS)
  },
}
