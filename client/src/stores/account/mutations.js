import {
  RESET_USER_STATE,
  RESET_STORE,
  SAVE_USER_AFTER_LOGIN,
  SET_PROFILE,
  SET_ENTRY_REDIRECT,
  SET_USER,
} from '@/stores/account/types'
import { undefinedUser } from '@/stores/account/state'
import Vue from 'vue'
import { InitialState } from './state'

export default {
  [RESET_USER_STATE](state) {
    Vue.set(state, 'user', undefinedUser)
  },
  [RESET_STORE](state) {
    Object.assign(state, InitialState)
  },
  [SAVE_USER_AFTER_LOGIN](state, response) {
    if (!response || !response.data || !response.data.token || !response.data.user_type) {
      state.user = { ...undefinedUser }
      return
    }

    const userData = response.data
    const userActivated = userData.active === true
    const emailConfirmed = userData.email_confirmed === true

    const user = {
      user_type: userData.user_type,
      active: userActivated,
      email_confirmed: emailConfirmed,
      token: response.data.token,
    }

    Vue.set(state, 'user', user)
    localStorage.setItem('inspectiv', user.token)
  },
  [SET_PROFILE](state, payload) {
    Vue.set(state, 'profile', payload)
  },
  [SET_ENTRY_REDIRECT](state, payload) {
    state.entryRedirect = payload
  },
  [SET_USER](state, user){
    state.user = user
  }
}
