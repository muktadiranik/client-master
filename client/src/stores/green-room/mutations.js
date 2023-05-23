import {
  SET_GREENROOM_VULNS,
  RESET_STORE,
} from '@/stores/green-room/types'
import { InitialState } from './state'

export default {
  [SET_GREENROOM_VULNS]: (state, payload) => {
    state.greenroomVulns = payload
  },
  [RESET_STORE]: state => {
    Object.assign(state, InitialState)
  },
}
