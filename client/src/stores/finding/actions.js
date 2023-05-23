import {
  CREATE_FINDING,
  CREATE_FINDING_FROM_SUBMISSION,
  DELETE_ATTACHMENT,
  DELETE_FINDING,
  EDIT_FINDING,
  EDIT_VULNERABILITY_TYPES,
  FOLLOW_FINDING,
  LOAD_FINDING_PRIORITIES,
  LINK_FINDING,
  LINK_FINDING_SUBMISSION,
  LOAD_FINDING,
  PUBLISH_FINDING,
  RESET_STORE,
  RESET_QUERY,
  SEARCH_FINDINGS,
  SEARCH_SUBMISSIONS,
  SET_FINDING,
  SET_FINDING_PRIORITIES,
  TOGGLE_LINKING_FINDING,
  UPLOAD_ATTACHMENT,
} from '@/stores/finding/types'
import FindingsService from '@/services/api/findings-service'
import SubmissionService from '@/services/api/submission-service'

export default {
  async [CREATE_FINDING]({ commit }, payload) {
    const response = await FindingsService.createFinding(payload)
    return response.data
  },
  async [CREATE_FINDING_FROM_SUBMISSION]({ commit }, payload) {
    const response = await FindingsService.createFindingFromSubmission(payload.submissionUuid)
    return response.data
  },
  async [DELETE_ATTACHMENT]({ commit }, payload) {
    const findingUuid = payload.findingUuid
    const attachmentUuid = payload.attachmentUuid
    return FindingsService.deleteFindingAttachment(findingUuid, attachmentUuid)
  },
  async [DELETE_FINDING]({ commit }, payload) {
    const response = await FindingsService.deleteFinding(payload)
    const finding = response.data
    commit(SET_FINDING, finding)
    return finding
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
  async [FOLLOW_FINDING]({ commit }, payload) {
    const response = await FindingsService.followFinding(payload)
    const finding = response.data
    commit(SET_FINDING, finding)
    return finding
  },
  async [LINK_FINDING]({ commit }, payload) {
    const response = await FindingsService.linkFinding(payload.findingUuid, payload.linkFindingUuid)
    const finding = response.data
    commit(SET_FINDING, finding)
    return finding
  },
  async [LINK_FINDING_SUBMISSION]({ dispatch }, payload) {
    await SubmissionService.linkSubmissionToFinding(payload.submissionUuid, payload.findingUuid)
    dispatch(LOAD_FINDING, payload.findingUuid)
  },
  async [LOAD_FINDING]({ commit }, payload) {
    const response = await FindingsService.getFinding(payload)
    const finding = response.data
    commit(SET_FINDING, finding)
    return finding
  },
  async [LOAD_FINDING_PRIORITIES]({ commit, state }) {
    if (state.findingPriorities.length > 0) {
      return
    }
    const response = await FindingsService.getFindingPriorities()
    commit(SET_FINDING_PRIORITIES, response.data)
  },
  async [PUBLISH_FINDING]({ commit }, payload) {
    const response = await FindingsService.publishFinding(payload.findingUuid)
    const finding = response.data
    commit(SET_FINDING, finding)
    return finding
  },
  async [SEARCH_FINDINGS]({ commit }, payload) {
    const response = await FindingsService.searchFindings(payload.programUuid, payload.title, payload.origin || '')
    return response
  },
  async [SEARCH_SUBMISSIONS]({ commit }, payload) {
    const response = await SubmissionService.searchSubmissions(payload.programUuid, payload.title)
    return response
  },
  [TOGGLE_LINKING_FINDING]({ commit }, payload) {
    commit(TOGGLE_LINKING_FINDING)
  },
  async [RESET_STORE]({ commit }, payload) {
    commit(RESET_STORE)
  },
  async [RESET_QUERY]({ commit }, payload) {
    commit(RESET_QUERY)
  },
  async [UPLOAD_ATTACHMENT]({ commit }, payload) {
    return FindingsService.addFindingAttachment(payload.findingUuid, payload.formData)
  },
}
