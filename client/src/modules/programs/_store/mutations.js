import { RESET_STORE, SET_SHORT_PROGRAMS_LIST } from './types'

export default {
  [SET_SHORT_PROGRAMS_LIST](state, programs) {
    for (let i = 0, len = programs.length; i < len; i++) {
      let program = programs[i]
      const existingProgram = state.shortProgramsList.findIndex(x => x.uuid === program.uuid)
      if (existingProgram === -1) {
        state.shortProgramsList.push(program)
      }
    }
  },
  [RESET_STORE](state) {
    state.shortProgramsList = []
  },
}
