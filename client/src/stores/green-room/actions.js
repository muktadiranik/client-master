import {
  LOAD_GREENROOM_VULNS,
  SET_GREENROOM_VULNS,
} from '@/stores/green-room/types'
import GreenRoomService from '@/services/api/greenroom-service'

export default {
  async [LOAD_GREENROOM_VULNS]({ commit, dispatch, state }, payload) {
    const response = await GreenRoomService.getGreenRoomVulns()
    const data = response.data
    commit(SET_GREENROOM_VULNS, data)
  },
}
