import { RESET_STORE, RESET_ALL_STORES } from '@/stores/types'

export default {
  async [RESET_STORE]({ commit, dispatch }, storeName) {
    if (storeName in this._modules.root._children) {
      await dispatch(`${storeName}/RESET_STORE`)
    }
  },
  async [RESET_ALL_STORES]({ commit, dispatch }) {
    const stores = [
      '$account',
      '$common',
      '$finding',
      '$findings',
      '$findingEdit',
      '$submissions',
      '$threads',
      '$programs',
      '$programFindings',
      '$programSubmissions',
      '$navbar',
    ]

    for (const store of stores) {
      dispatch(RESET_STORE, store)
    }
  },
}
