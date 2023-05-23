import {
  SET_LOADING_STATE,
  SET_SUBMISSION,
  SET_SUBMISSION_PRIORITIES,
  SET_SUBMISSION_PROPERTY,
  RESET_STORE,
  SET_SUBMISSION_RESOLUTIONS,
  SET_SUBMISSION_STATUSES,
} from '@/modules/submissions/_store/types'

import { InitialState } from './state'
import Vue from 'vue'

export default {
  [SET_LOADING_STATE]: (state, payload) => {
    if (state.loadingStateKeys.includes(payload.key)) {
      state.loadingStates[payload.key] = payload.value
    }
  },
  [SET_SUBMISSION]: (state, payload) => {
    Vue.set(state, 'submission', payload)
  },
  [SET_SUBMISSION_PROPERTY]: (state, payload) => {
    state.submission[payload.property] = payload.value
  },
  [SET_SUBMISSION_PRIORITIES]: (state, payload) => {
    Vue.set(state, 'submissionPriorities', payload)
  },
  [SET_SUBMISSION_RESOLUTIONS]: (state, payload) => {
    Vue.set(state, 'submissionResolutions', payload)
  },
  [SET_SUBMISSION_STATUSES]: (state, payload) => {
    Vue.set(state, 'submissionStatuses', payload)
  },
  [RESET_STORE]: state => {
    Object.assign(state, InitialState)
  },
}
