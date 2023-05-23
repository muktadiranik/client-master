import { GET_FILTERED_NAVBAR_PROGRAMS } from '@/stores/navbar/types'

export const getters = {
  [GET_FILTERED_NAVBAR_PROGRAMS](state) {
    if (!state.program || !state.program.uuid) {
      return []
    }
    return state.programs.filter(x => x.uuid !== state.program.uuid)
  },
}
