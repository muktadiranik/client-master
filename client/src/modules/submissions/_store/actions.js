import {
  CREATE_SUBMISSION,
  DELETE_ATTACHMENT,
  DELETE_SUBMISSION,
  EDIT_SUBMISSION,
  EDIT_SUBMISSION_VULNERABILITY_TYPES,
  GET_PROGRAM,
  GET_SUBMISSION,
  GET_SUBMISSIONS,
  GET_VULNERABILITY_TYPES,
  LINK_SUBMISSION_TO_FINDING,
  LOAD_SUBMISSION_PRIORITIES,
  LOAD_SUBMISSION_RESOLUTIONS,
  LOAD_SUBMISSION,
  SET_LOADING_STATE,
  SET_SUBMISSION,
  SET_SUBMISSION_PROPERTY,
  SET_SUBMISSION_PRIORITIES,
  SET_SUBMISSION_RESOLUTIONS,
  SET_SUBMISSION_STATUSES,
  UPLOAD_ATTACHMENT,
  SEARCH_PMS,
  TOGGLE_SUBMISSION_FOLLOW,
} from '@/modules/submissions/_store/types'
import { RESET_STORE, ASSIGN_PM_TO_SUBMISSION, REMOVE_PM_FROM_SUBMISSION, LOAD_SUBMISSION_STATUSES } from './types'
import AccountService from '@/services/api/account-service'
import SubmissionService from '@/services/api/submission-service'
import ProgramService from '@/services/api/program-service'

export default {
  [ASSIGN_PM_TO_SUBMISSION]({ commit }, payload) {
    return SubmissionService.assignPmToSubmission(payload.submissionUuid, payload.profileUuid)
  },
  [REMOVE_PM_FROM_SUBMISSION]({ commit }, payload) {
    return SubmissionService.removePmFromSubmission(payload.submissionUuid, payload.profileUuid)
  },
  [SEARCH_PMS]({ commit }, payload) {
    return AccountService.userSearch(payload.searchTerms, payload.userType)
  },
  [CREATE_SUBMISSION]({ commit }, payload) {
    return SubmissionService.createSubmission(payload)
  },
  async [DELETE_ATTACHMENT]({ commit }, payload) {
    const submissionUuid = payload.submissionUuid
    const attachmentUuid = payload.attachmentUuid
    return SubmissionService.deleteSubmissionAttachment(submissionUuid, attachmentUuid)
  },
  async [DELETE_SUBMISSION]({ commit }, payload) {
    return SubmissionService.deleteSubmission(payload)
  },
  async [EDIT_SUBMISSION]({ commit }, payload) {
    return SubmissionService.editSubmission(payload.submission_uuid, payload)
  },
  async [EDIT_SUBMISSION_VULNERABILITY_TYPES]({ commit }, payload) {
    return SubmissionService.editSubmissionVulnerabilityTypes(payload.submissionUuid, payload.vulnerabilityTypeUuid)
  },
  async [GET_PROGRAM]({ commit }, payload) {
    return ProgramService.getProgram(payload)
  },
  async [GET_SUBMISSION]({ commit }, payload) {
    const submission = await SubmissionService.getSubmission(payload)
    return submission
  },
  async [GET_SUBMISSIONS]({ commit }, payload) {
    return SubmissionService.getSubmissions(payload.page, payload.sortField, payload.sortDirection, payload.filterType)
  },
  async [GET_VULNERABILITY_TYPES]({ commit }) {
    const response = await SubmissionService.getVulnerabilityTypes()
    return response.data
  },
  async [LINK_SUBMISSION_TO_FINDING]({ commit }, payload) {
    const response = await SubmissionService.linkSubmissionToFinding(payload.submissionUuid, payload.findingUuid)
    return response.data
  },
  async [LOAD_SUBMISSION_PRIORITIES]({ commit, state }) {
    try {
      if (state.submissionPriorities.length > 0) {
        return
      }
      const response = await SubmissionService.getPriorities()
      commit(SET_SUBMISSION_PRIORITIES, response.data)
    } catch (e) {
      this._vm.$caAlert.error('Failed to load submission resolutions')
    }
  },
  async [LOAD_SUBMISSION_RESOLUTIONS]({ commit, state }) {
    try {
      if (state.submissionResolutions.length > 0) {
        return
      }
      const response = await SubmissionService.getResolutions()
      commit(SET_SUBMISSION_RESOLUTIONS, response.data)
    } catch (e) {
      this._vm.$caAlert.error('Failed to load submission resolutions')
    }
  },
  async [LOAD_SUBMISSION_STATUSES]({ commit, state }) {
    try {
      if (state.submissionStatuses.length > 0) {
        return
      }
      const response = await SubmissionService.getStatuses()
      commit(SET_SUBMISSION_STATUSES, response.data)
    } catch (e) {
      this._vm.$caAlert.error('Failed to load submission')
    }
  },
  async [LOAD_SUBMISSION]({ commit, dispatch }, payload) {
    const response = await dispatch(GET_SUBMISSION, payload)
    const submission = response.data
    await dispatch(SET_SUBMISSION, submission)
  },
  [SET_LOADING_STATE]({ commit }, payload) {
    commit(SET_LOADING_STATE, payload)
  },
  [SET_SUBMISSION]({ commit }, payload) {
    commit(SET_SUBMISSION, payload)
  },
  [SET_SUBMISSION_PROPERTY]({ commit }, payload) {
    commit(SET_SUBMISSION_PROPERTY, payload)
  },
  [TOGGLE_SUBMISSION_FOLLOW]({ commit }, payload) {
    return SubmissionService.toggleSubmissionFollowing(payload)
  },
  async [UPLOAD_ATTACHMENT]({ commit }, payload) {
    return SubmissionService.addSubmissionAttachment(payload.submissionUuid, payload.formData)
  },
  async [RESET_STORE]({ commit }) {
    commit(RESET_STORE)
  },
}
