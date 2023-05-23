import { LOAD_PROFILE, EDIT_PROFILE, INITIATE_TAX_FORM } from '@/modules/account-settings/_store/types'
import AccountService from '@/services/api/account-service'

export const actions = {
  async [LOAD_PROFILE]({ commit }) {
    const response = await AccountService.getProfile()
    return response.data
  },
  async [EDIT_PROFILE]({ state, commit }, payload) {
    const response = await AccountService.updateProfile(payload)
    return response.data
  },
  async [INITIATE_TAX_FORM]({ state, commit }, payload) {
    const response = await AccountService.inititateTaxForm(payload)
    return response.data
  },
}
