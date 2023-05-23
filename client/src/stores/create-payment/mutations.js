import {
  SET_PAYMENT,
  SET_TRANSACTIONS_QUERY,
  SET_TRANSACTIONS,
  SET_USER_PROFILE,
  TOGGLE_ALL_TRANSACTIONS,
  TOGGLE_TRANSACTION_EDITOR_ENABLED,
  TOGGLE_TRANSACTION_SELECTED,
  RESET_STORE,
  SET_PAYMENT_OPTION,
  SET_LOADING,
} from '@/stores/create-payment/types'
import Vue from 'vue'

export default {
  [SET_USER_PROFILE]: (state, payload) => {
    Vue.set(state, 'userProfile', payload)
    Vue.set(state, 'paymentMethod', payload.payment_info.default_payment_method)
  },
  [SET_TRANSACTIONS]: (state, transactions) => {
    for (let t of transactions) {
      const existing = state.transactions.find(x => x.uuid === t.uuid)
      if (!existing) {
        state.transactions.push(t)
      }
    }
  },
  [SET_TRANSACTIONS_QUERY]: (state, payload) => {
    if (state.transactionsQuery.sortField === payload.sortField) {
      state.transactionsQuery.sortOrder = state.transactionsQuery.sortOrder === 'asc' ? 'desc' : 'asc'
    }

    state.transactionsQuery.page = payload.page || state.transactionsQuery.page
    state.transactionsQuery.sortField = payload.sortField || state.transactionsQuery.sortField
    state.transactionsQuery.sortOrder = payload.sortOrder || state.transactionsQuery.sortOrder
    state.transactionsQuery.filterField = payload.filterField || state.transactionsQuery.filterField
  },
  [SET_PAYMENT]: (state, payment) => {
    state.payment = payment
    if (!state.payment.transactions || state.payment.transactions.length === 0) {
      return
    }

    for (let transaction of state.payment.transactions) {
      const transactionUuid = transaction.uuid
      if (!state.selectedTransactions.includes(transactionUuid)) {
        Vue.set(state.selectedTransactions, state.selectedTransactions.length, transactionUuid)
      }
    }

    state.referenceId = payment.reference_id
    state.notes = payment.notes
    state.paymentMethod = payment.payment_method
    state.btcWalletAddress = payment.btc_wallet_address
    state.ethWalletAddress = payment.eth_wallet_address
    state.paypalEmailAddress = payment.paypal_email
    state.bankAccountNumber = payment.usd_bank_account_number
    state.bankRoutingNumber = payment.usd_bank_routing_number
    state.bankType = payment.usd_bank_type
  },
  [SET_PAYMENT_OPTION]: (state, payload) => {
    if ('referenceId' in payload) {
      state.referenceId = payload.referenceId
    }

    if ('notes' in payload) {
      state.notes = payload.notes
    }

    if ('paymentMethod' in payload) {
      state.paymentMethod = payload.paymentMethod
    }

    if ('bankAccountNumber' in payload) {
      state.bankAccountNumber = payload.bankAccountNumber
    }

    if ('bankRoutingNumber' in payload) {
      state.bankRoutingNumber = payload.bankRoutingNumber
    }

    if ('paypalEmailAddress' in payload) {
      state.paypalEmailAddress = payload.paypalEmailAddress
    }

    if ('btcWalletAddress' in payload) {
      state.btcWalletAddress = payload.btcWalletAddress
    }

    if ('ethWalletAddress' in payload) {
      state.ethWalletAddress = payload.ethWalletAddress
    }

    if ('bankType' in payload) {
      state.bankType = payload.bankType
    }
  },
  [TOGGLE_ALL_TRANSACTIONS]: state => {
    if (state.selectedTransactions.length > 0) {
      state.selectedTransactions = []
      state.toggleAllActive = false
      return
    }

    state.toggleAllActive = true

    for (let t of state.transactions) {
      state.selectedTransactions.push(t.uuid)
    }

    if (!state.payment || !state.payment.transactions) {
      return
    }

    for (let t of state.payment.transactions) {
      state.selectedTransactions.push(t.uuid)
    }
  },
  [TOGGLE_TRANSACTION_EDITOR_ENABLED]: (state, payload) => {
    state.transactionEditorEnabled = payload
  },
  [TOGGLE_TRANSACTION_SELECTED]: (state, payload) => {
    const existingIndex = state.selectedTransactions.indexOf(payload)
    if (existingIndex < 0) {
      state.selectedTransactions.push(payload)
    } else {
      state.selectedTransactions.splice(existingIndex, 1)
    }
  },
  [RESET_STORE]: state => {
    state.payment = undefined
    state.selectedTransactions = []
    state.transactions = []
    state.referenceId = ''
    state.notes = ''
    state.transactionsQuery = {
      page: 1,
      sortField: '',
      sortOrder: '',
      filterField: 'transactions',
    }
    state.userProfile = {}
  },
  [SET_LOADING]: (state, payload) => {
    state.loading = payload
  },
}
