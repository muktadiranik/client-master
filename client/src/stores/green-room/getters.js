import { LOAD_GREENROOM_VULNS, GET_GREENROOM_VULNS } from '@/stores/green-room/types'

export default {
  [LOAD_GREENROOM_VULNS]: state => state.greenroomVulns,
  [GET_GREENROOM_VULNS]: state => state.greenroomVulns
}
