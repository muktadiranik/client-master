import {
  DELETE_ATTACHMENT,
  EDIT_FINDING,
  EDIT_VULNERABILITY_TYPES,
  LOAD_FINDING,
  RESET_STORE,
  SET_FINDING,
  UPLOAD_ATTACHMENT,
} from '@/stores/finding-edit/types'
import FindingsService from '@/services/api/findings-service'

export default {
  async [UPLOAD_ATTACHMENT]({ commit }, payload) {
    return FindingsService.addFindingAttachment(payload.findingUuid, payload.formData)
  },
  async [DELETE_ATTACHMENT]({ commit }, payload) {
    const findingUuid = payload.findingUuid
    const attachmentUuid = payload.attachmentUuid
    return FindingsService.deleteFindingAttachment(findingUuid, attachmentUuid)
  },
  async [EDIT_FINDING]({ commit }, payload) {
    const response = await FindingsService.editFinding(payload)
    const finding = response.data
    commit(SET_FINDING, finding)
    return finding
  },
  async [EDIT_VULNERABILITY_TYPES]({ commit }, payload) {
    const response = await FindingsService.editVulnerabilityTypes(payload.findingUuid, payload.vulnerabilityTypeUuid)
    const finding = response.data
    commit(SET_FINDING, finding)
    return finding
  },
  async [LOAD_FINDING]({ commit }, payload) {
    const response = await FindingsService.getFinding(payload)
    const finding = response.data
    commit(SET_FINDING, finding)
    return finding
  },
  async [RESET_STORE]({ commit }, payload) {
    commit(RESET_STORE)
  },
}
