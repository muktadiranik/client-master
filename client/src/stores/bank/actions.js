import {
  CREATE_TRANSACTION,
  DELETE_TRANSACTION,
  EDIT_TRANSACTION,
  GET_PENDING_SUBMISSIONS,
  GET_PROGRAM,
  GET_TRANSACTION,
  GET_TRANSACTION_LIST,
  GET_USER_PROFILE,
  RESET_STORE,
  LOAD_TRANSACTION_TYPES,
  LOAD_PROGRAMS_LIST,
  SEARCH_RESEARCHERS,
  SET_TRANSACTION_TYPES,
  SET_ROUTE,
  SET_PROGRAMS_LIST,
} from '@/stores/bank/types'
import AccountService from '@/services/api/account-service'
import ProgramService from '@/services/api/program-service'
import SubmissionService from '@/services/api/submission-service'
import TransactionService from '@/services/api/transaction-service'
import UserService from '@/services/api/user-service'
import router from '@/router'

export default {
  async [GET_PENDING_SUBMISSIONS]({ commit }, payload) {
    const researcherUuid = payload.researcherUuid
    const programUuid = payload.programUuid
    const submissionUuid = payload.submissionUuid || ''
    const query = {
      researcherUuid,
      programUuid,
      submissionUuid,
    }
    const response = await SubmissionService.getPendingSubmissions(query)
    return response.data.results
  },
  async [EDIT_TRANSACTION]({ commit }, payload) {
    const transactionUuid = payload.transactionUuid
    const form = payload.form
    let transaction = {
      recipient: form.researcher.uuid,
      program_uuid: form.program,
      transaction_type: form.transactionType,
      title: form.title,
      amount: form.amount,
      payment_date: form.paymentDate,
      notes: form.notes,
    }
    if (form.submission) {
      transaction['submission_uuid'] = form.submission
    }
    const response = await TransactionService.editTransaction(transactionUuid, transaction)
    return response.data
  },
  async [CREATE_TRANSACTION]({ commit }, payload) {
    let transaction = {
      recipient: payload.researcher.uuid,
      program_uuid: payload.program,
      transaction_type: payload.transactionType,
      title: payload.title,
      amount: payload.amount,
      payment_date: payload.paymentDate,
      notes: payload.notes,
      submission_uuid: payload.submission || null,
    }
    const response = await TransactionService.createTransaction(transaction)
    return response.data
  },
  async [DELETE_TRANSACTION]({ commit }, transactionUuid) {
    const response = await TransactionService.deleteTransaction(transactionUuid)
    return response.data
  },
  async [GET_PROGRAM]({ commit }, payload) {
    const response = await ProgramService.getProgram(payload)
    return response.data
  },
  async [GET_TRANSACTION]({ commit }, payload) {
    const response = await TransactionService.getTransaction(payload)
    return response.data
  },
  async [GET_TRANSACTION_LIST]({ commit }, payload) {
    const response = await TransactionService.getTransactionList(payload)
    return response.data
  },
  async [GET_USER_PROFILE]({ commit }, payload) {
    const response = await UserService.getUserProfile(payload)
    return response.data
  },
  async [LOAD_PROGRAMS_LIST]({ commit, state }, payload) {
    if (state.programs && state.programs.length > 0) {
      return
    }

    let page = 1
    let programs = []

    while (page >= 1) {
      const response = await ProgramService.getShortProgramsList(page)
      const data = response.data
      page++
      programs = [...programs, ...data.results]

      if (!data.next) {
        commit(SET_PROGRAMS_LIST, programs)
        break
      }
    }
  },
  async [LOAD_TRANSACTION_TYPES]({ commit, dispatch, state }) {
    if (state.transactionTypes && state.transactionTypes.length > 0) {
      return
    }
    const response = await TransactionService.getTransactionTypes()
    const transactionTypes = response.data
    commit(SET_TRANSACTION_TYPES, transactionTypes)
  },
  async [SEARCH_RESEARCHERS]({ commit }, payload) {
    return AccountService.userSearch(payload, 'researcher')
  },
  async [RESET_STORE]({ commit, dispatch }, payload) {
    await commit(RESET_STORE)
  },
  async [SET_ROUTE]({ commit }) {
    const route = { ...router.currentRoute }
    commit(SET_ROUTE, route)
  },
}
