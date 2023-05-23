import axios from 'axios'

const RESOURCE = 'transactions'

const TransactionService = {
  createTransaction(transaction) {
    return axios.post(`${RESOURCE}/`, transaction)
  },
  deleteTransaction(transactionUuid) {
    return axios.delete(`${RESOURCE}/${transactionUuid}/`)
  },
  editTransaction(transactionUuid, transaction) {
    return axios.put(`${RESOURCE}/${transactionUuid}/`, transaction)
  },
  getTransaction(transactionUuid) {
    return axios.get(`${RESOURCE}/${transactionUuid}/`)
  },
  getTransactionTypes() {
    return axios.get(`${RESOURCE}/transaction-types/`)
  },
  getTransactionList(query) {
    let params = new URLSearchParams([
      ['page', query.page || 1],
      ['sort_direction', query.sortDirection || ''],
      ['sort_field', query.sortField || ''],
      ['filter_type', query.filterField || ''],
    ])

    if (query.programUuid) {
      params.append('program', query.programUuid)
    }

    if (query.user) {
      params.append('user', query.user)
    }

    if (query.paid !== null) {
      params.append('paid', query.paid)
    }

    if (query.scheduled !== null) {
      params.append('scheduled', query.scheduled)
    }

    if (query.title !== null) {
      params.append('title', query.title)
    }
    return axios.get(`${RESOURCE}/list/`, { params })
  },
  getPaymentSelectionTransactionList(query) {
    let params = new URLSearchParams([
      ['page', query.page || 1],
      ['sort_direction', query.sortDirection || ''],
      ['sort_field', query.sortField || ''],
      ['user', query.user],
    ])

    return axios.get(`${RESOURCE}/payment-selection-list/`, { params })
  },
  getPendingTransactionsList(page, searchTerms, programUuid) {
    const params = new URLSearchParams([
      ['page', page || 1],
      ['researcher', searchTerms || ''],
      ['program', programUuid || ''],
      ['filter_type', 'transactions'],
    ])

    return axios.get(`${RESOURCE}/pending/`, { params })
  },
  getProgramPendingTransactionsList(programUuid, query) {
    const params = new URLSearchParams([['page', query.page || 1]])
    return axios.get(`${RESOURCE}/pending/${programUuid}`, { params })
  },
  getPendingResearcherTransactionsList(query) {
    let params = new URLSearchParams([
      ['page', query.page || 1],
      ['sort_direction', query.sortDirection || ''],
      ['sort_field', query.sortField || ''],
      ['title', query.title || ''],
    ])
    return axios.get(`${RESOURCE}/researcher-pending/`, { params })
  },
  getUserPendingTransactionsList(query) {
    let params = new URLSearchParams([
      ['page', query.page || 1],
      ['sort_direction', query.sortDirection || ''],
      ['sort_field', query.sortField || ''],
    ])
    return axios.get(`${RESOURCE}/users/${query.profileUuid}/pending/`, { params })
  },
}

export default TransactionService
