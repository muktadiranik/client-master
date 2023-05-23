import { GET_USER_PROFILE } from '@/stores/users/types'
import UserService from '@/services/api/user-service'

export default {
  async [GET_USER_PROFILE]({ commit }, payload) {
    const response = await UserService.getUserProfile(payload.profileUuid)
    return response
  },
}
