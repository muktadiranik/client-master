import axios from 'axios'

const RESOURCE = 'submissions'
const SubmissionService = {
  addSubmissionAttachment(submissionUuid, data) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    return axios.put(`${RESOURCE}/${submissionUuid}/attachments/`, data, config)
  },
  assignPmToSubmission(submissionUuid, profileUuid) {
    const payload = {
      action: 'add',
      profile_uuid: profileUuid,
    }
    return axios.post(`${RESOURCE}/${submissionUuid}/program-managers/`, payload)
  },
  createSubmission(data) {
    return axios.post(`${RESOURCE}/new/`, data)
  },
  deleteSubmission(submissionUuid) {
    return axios.delete(`${RESOURCE}/${submissionUuid}/`)
  },
  deleteSubmissionAttachment(submissionUuid, attachmentUuid) {
    return axios.delete(`${RESOURCE}/${submissionUuid}/attachments/${attachmentUuid}/`)
  },
  editSubmission(submissionUuid, data) {
    return axios.put(`${RESOURCE}/${submissionUuid}/`, data)
  },
  editSubmissionVulnerabilityTypes(submissionUuid, vulnerabilityTypeUuid) {
    return axios.get(`${RESOURCE}/${submissionUuid}/vulnerability-types/${vulnerabilityTypeUuid}/`)
  },
  getPriorities() {
    return axios.get(`${RESOURCE}/priorities/`)
  },
  getSubmission(uuid) {
    return axios.get(`${RESOURCE}/${uuid}/`)
  },
  getResolutions() {
    return axios.get(`${RESOURCE}/resolutions/`)
  },
  getStatuses() {
    return axios.get(`${RESOURCE}/statuses/`)
  },
  getSubmissions(
    page,
    sortDirection,
    sortField,
    startDate,
    endDate,
    submissionName,
    priority,
    status,
    payment,
    validOnly
  ) {
    const params = new URLSearchParams([
      ['page', page],
      ['sort_direction', sortDirection],
      ['sort_field', sortField],
      ['start_date', startDate],
      ['end_date', endDate],
      ['name', submissionName],
      ['priority', priority],
      ['status', status],
      ['payment', payment],
      ['valid_only', validOnly],
    ])
    return axios.get(`${RESOURCE}/list/`, { params: params })
  },
  getKanbanSubmissions() {
    return axios.get(`${RESOURCE}/kanban-list/`)
  },
  getProgramSubmissions(programUuid, page, sortField, sortDirection, filterType) {
    const params = new URLSearchParams([
      ['page', page],
      ['sort_field', sortField],
      ['sort_direction', sortDirection],
      ['filter_type', filterType],
    ])
    return axios.get(`programs/${programUuid}/submissions/`, { params: params })
  },
  getVulnerabilityTypes() {
    return axios.get(`${RESOURCE}/vulnerability-types/`)
  },
  linkSubmissionToFinding(submissionUuid, findingUuid) {
    return axios.get(`${RESOURCE}/${submissionUuid}/link/${findingUuid}/`)
  },
  removePmFromSubmission(submissionUuid, profileUuid) {
    const payload = {
      action: 'remove',
      profile_uuid: profileUuid,
    }
    return axios.post(`${RESOURCE}/${submissionUuid}/program-managers/`, payload)
  },
  searchSubmissions(programUuid, title) {
    const params = new URLSearchParams([
      ['program', programUuid],
      ['title', title],
    ])
    return axios.get(`${RESOURCE}/search/`, { params: params })
  },
  toggleSubmissionFollowing(submissionUuid) {
    return axios.get(`${RESOURCE}/${submissionUuid}/follow/`)
  },
  getPendingSubmissions(query) {
    let params = new URLSearchParams([['researcher_uuid', query.researcherUuid]])
    if (query.programUuid) {
      params.append('program_uuid', query.programUuid)
    }
    if (query.submissionUuid) {
      params.append('submission_uuid', query.submissionUuid)
    }
    return axios.get(`${RESOURCE}/pending-submissions/`, { params })
  },
  getSubmissionHistory(submissionUuid) {
    return axios.get(`${RESOURCE}/history/${submissionUuid}`)
  },
}

export default SubmissionService
