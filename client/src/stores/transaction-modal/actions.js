import {
  CLOSE_MODAL,
  LOAD_TRANSACTION,
  RESET_STORE,
  SET_TRANSACTION,
  SHOW_MODAL,
} from '@/stores/transaction-modal/types'
import TransactionService from '@/services/api/transaction-service'

export const actions = {
  async [LOAD_TRANSACTION]({ commit, state }, uuid) {
    const response = await TransactionService.getTransaction(uuid)
    const transaction = response.data
    commit(SET_TRANSACTION, transaction)
    commit(SHOW_MODAL)
  },
  async [CLOSE_MODAL]({ commit }) {
    commit(CLOSE_MODAL)
  },
  async [RESET_STORE]({ commit }) {
    commit(RESET_STORE)
  },
  async [SHOW_MODAL]({ commit }) {
    commit(SHOW_MODAL)
  },
}

export default actions
