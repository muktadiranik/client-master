import {
  RESET_STORE,
  SET_LOADING,
  SET_PROGRAM,
  SET_PROGRAMS_LIST,
  SET_PROGRAMS_LIST_QUERY,
} from '@/stores/navbar/types'
import { InitialState } from '@/stores/navbar/state'

export const mutations = {
  [SET_LOADING]: (state, payload) => {
    state.loading = payload
  },
  [SET_PROGRAM]: (state, payload) => {
    state.program = payload
  },
  [SET_PROGRAMS_LIST]: (state, payload) => {
    const programs = payload
    if (!programs) {
      return
    }
    for (let i = 0, len = programs.length; i < len; i++) {
      const program = programs[i]
      const exists = state.programs.find(x => x.uuid === program.uuid)
      if (!exists) {
        state.programs.push(program)
      }
    }
  },
  [SET_PROGRAMS_LIST_QUERY]: (state, payload) => {
    state.query = payload
  },
  [RESET_STORE]: (state, payload) => {
    Object.assign(state, InitialState)
  },
}
