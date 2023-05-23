import {
  CHECK_EMAIL,
  CHECK_USERNAME,
  RESET_USER_STATE,
  LOAD_DASHBOARD,
  LOAD_PROFILE,
  LOGIN,
  LOGOUT,
  SAVE_USER_AFTER_LOGIN,
  SET_PROFILE,
  UPDATE_PROFILE,
  CHANGE_PASSWORD,
  REQUEST_RECOVERY,
  RESET_PASSWORD,
  RESET_STORE,
  REGISTER_ACCOUNT,
  SYNTHETIC_LOGIN,
  SET_ENTRY_REDIRECT,
  DELETE_USER,
} from '@/stores/account/types'
import { SET_FLAGS, STORE_KEY as FEATURE_FLAGS_STORE_KEY } from '@/stores/feature-flags/types'
import store from '@/stores'

import axios from 'axios'
import AccountService from '@/services/api/account-service'
import { undefinedProfile } from '@/stores/account/state'

export default {
  async [LOAD_DASHBOARD]({ commit }, userType) {
    const response = await AccountService.getDashboard(userType)
    return response.data
  },
  async [LOAD_PROFILE]({ commit, dispatch }) {
    const response = await AccountService.getProfile()
    commit(SET_PROFILE, response.data)
    // set feature flags
    store.dispatch(`${FEATURE_FLAGS_STORE_KEY}/${SET_FLAGS}`, response.data.waffle_flags)
    return response
  },
  async [LOGIN]({ commit, dispatch }, payload) {
    const response = await AccountService.login(payload)

    if (response.status === 202) {
      // user is a migrated app owner
      return response
    }
    commit(SAVE_USER_AFTER_LOGIN, response)

    await dispatch(LOAD_PROFILE)
    return response
  },
  async [SYNTHETIC_LOGIN]({ commit, dispatch }, payload) {
    const response = await AccountService.syntheticLogin(payload)
    commit(SAVE_USER_AFTER_LOGIN, response)
    await dispatch(LOAD_PROFILE)
  },
  async [LOGOUT]({ commit, dispatch }) {
    await AccountService.logout()
    commit(SET_PROFILE, undefinedProfile)
    await dispatch(RESET_USER_STATE)
  },
  async [UPDATE_PROFILE]({ commit }, payload) {
    const url = `${API_BASE_URL}/accounts/profile/`
    const response = await axios.post(url, payload)
    if (response.status === 200) {
      commit(SET_PROFILE, response.data)
    }
    return response
  },
  [CHANGE_PASSWORD]({ commit }, payload) {
    const url = `${API_BASE_URL}/accounts/change-password/`
    return axios.post(url, payload)
  },
  [CHECK_EMAIL]({ commit }, payload) {
    const url = `${API_BASE_URL}/accounts/email/check/${payload}/`
    return axios.get(url)
  },
  [CHECK_USERNAME]({ commit }, payload) {
    const url = `${API_BASE_URL}/accounts/username/check/${payload}/`
    return axios.get(url)
  },
  async [RESET_USER_STATE]({ commit }) {
    commit(RESET_USER_STATE)
  },
  async [REQUEST_RECOVERY]({ commit }, payload) {
    const url = `${API_BASE_URL}/accounts/recover/`
    await axios.post(url, payload)
  },
  [RESET_PASSWORD]({ commit }, payload) {
    const url = `${API_BASE_URL}/accounts/recover/change-password/`
    return axios.post(url, payload)
  },
  [REGISTER_ACCOUNT]({ commit }, payload) {
    const url = `${API_BASE_URL}/accounts/register/`
    return axios.post(url, payload)
  },
  [SAVE_USER_AFTER_LOGIN]({ commit }, payload) {
    commit(SAVE_USER_AFTER_LOGIN, payload)
  },
  async [RESET_STORE]({ commit }) {
    commit(RESET_STORE)
    commit(RESET_USER_STATE)
  },
  [SET_ENTRY_REDIRECT]({ commit }, payload) {
    commit(SET_ENTRY_REDIRECT, payload)
  },
  async [DELETE_USER]({ commit }, payload) {
    const url = `${API_BASE_URL}/accounts/delete/`
    const res = await axios.post(url, payload)
    return res
  },
}
