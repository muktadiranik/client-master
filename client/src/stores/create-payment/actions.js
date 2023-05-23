import {
  CREATE_PAYMENT,
  EDIT_PAYMENT,
  EDIT_PAYMENT_TRANSACTIONS,
  EDIT_USER_PROFILE,
  LOAD_PAYMENT,
  LOAD_USER_PROFILE,
  SET_USER_PROFILE,
  LOAD_TRANSACTIONS,
  SET_PAYMENT,
  SET_TRANSACTIONS,
  SET_TRANSACTIONS_QUERY,
  TOGGLE_ALL_TRANSACTIONS,
  TOGGLE_TRANSACTION_EDITOR_ENABLED,
  TOGGLE_TRANSACTION_SELECTED,
  RESET_STORE,
  SET_LOADING,
  SET_PAYMENT_OPTION,
} from '@/stores/create-payment/types'
import BankService from '@/services/api/bank-service'
import PaymentService from '@/services/api/payment-service'
import TransactionService from '@/services/api/transaction-service'

export default {
  async [CREATE_PAYMENT]({ commit, state }, payment) {
    const transactionUuids = state.selectedTransactions
    const response = await PaymentService.createPayment({
      transaction_uuids: transactionUuids,
      recipient: state.userProfile.uuid,
      reference_id: state.referenceId,
      notes: state.notes,
      payment_method: state.paymentMethod,
    })
    commit(SET_PAYMENT, response.data)
    return response.data
  },
  async [EDIT_PAYMENT]({ commit, dispatch, state }, payload) {
    const recipient = payload.recipientUuid ? payload.recipientUuid : state.userProfile.uuid
    const postData = {
      recipient: recipient,
      ...payload,
    }
    const response = await PaymentService.editPayment(postData)
    const payment = response.data
    commit(SET_PAYMENT, payment)
    await dispatch(LOAD_TRANSACTIONS)
    return payment
  },
  async [EDIT_PAYMENT_TRANSACTIONS]({ commit, dispatch, state }, payload) {
    const postData = {
      uuid: payload.uuid,
      transaction_uuids: payload.selectedTransactions || null,
    }
    const response = await PaymentService.editPaymentTransactions(postData)
    const payment = response.data
    commit(SET_PAYMENT, payment)
    await dispatch(LOAD_TRANSACTIONS)
    return payment
  },
  async [EDIT_USER_PROFILE]({ commit, state }, payload) {
    try {
      const profileUuid = payload.profileUuid
      const postData = {
        default_payment_method: payload.defaultPaymentMethod,
      }
      const response = await BankService.editUserProfile(profileUuid, postData)
      commit(SET_USER_PROFILE, response.data)
    } catch (e) {
      throw e
    }
  },
  async [LOAD_PAYMENT]({ commit, state }, paymentUuid) {
    const response = await PaymentService.getPayment(paymentUuid)
    const payment = response.data
    commit(SET_PAYMENT, payment)
    return payment
  },
  async [LOAD_TRANSACTIONS]({ commit, state }) {
    let page = 0
    while (page < 15) {
      page++
      try {
        const username = state.userProfile.username
        const params = {
          page: page,
          sortOrder: state.transactionsQuery.sortOrder,
          sortField: state.transactionsQuery.sortField,
          user: username,
        }
        const response = await TransactionService.getPaymentSelectionTransactionList(params)

        const results = [...response.data.results]
        commit(SET_TRANSACTIONS, results)
      } catch (err) {
        break
      }
    }
  },
  async [SET_LOADING]({ commit }, payload) {
    commit(SET_LOADING, payload)
  },
  async [SET_TRANSACTIONS_QUERY]({ commit, dispatch }, payload) {
    commit(SET_TRANSACTIONS_QUERY, payload)
    await dispatch(LOAD_TRANSACTIONS)
  },
  async [SET_PAYMENT_OPTION]({ commit, dispatch }, payload) {
    commit(SET_PAYMENT_OPTION, payload)
  },
  async [TOGGLE_ALL_TRANSACTIONS]({ commit }) {
    commit(TOGGLE_ALL_TRANSACTIONS)
  },
  async [TOGGLE_TRANSACTION_EDITOR_ENABLED]({ commit }, payload) {
    commit(TOGGLE_TRANSACTION_EDITOR_ENABLED, payload)
  },
  async [TOGGLE_TRANSACTION_SELECTED]({ commit }, payload) {
    commit(TOGGLE_TRANSACTION_SELECTED, payload)
  },
  async [LOAD_USER_PROFILE]({ commit }, profileUuid) {
    const response = await BankService.getUserProfile(profileUuid)
    commit(SET_USER_PROFILE, response.data)
  },
  async [RESET_STORE]({ commit }) {
    commit(RESET_STORE)
  },
}
