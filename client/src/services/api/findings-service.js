import axios from 'axios'

const RESOURCE = 'findings'
const FindingsService = {
  addFindingAttachment(findingUuid, data) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
    return axios.put(`${RESOURCE}/${findingUuid}/attachments/`, data, config)
  },
  createFinding(payload) {
    return axios.post(`${RESOURCE}/create/`, payload)
  },
  createFindingFromSubmission(submissionUuid) {
    return axios.post(`${RESOURCE}/create/`, {
      submission_uuid: submissionUuid,
    })
  },
  deleteFinding(findingUuid) {
    return axios.delete(`${RESOURCE}/${findingUuid}/`)
  },
  deleteFindingAttachment(findingUuid, attachmentUuid) {
    return axios.delete(`${RESOURCE}/${findingUuid}/attachments/${attachmentUuid}/`)
  },
  editFinding(finding) {
    return axios.put(`${RESOURCE}/${finding.uuid}/`, finding)
  },
  editVulnerabilityTypes(findingUuid, vulnerabilityTypeUuid) {
    return axios.get(`${RESOURCE}/${findingUuid}/vulnerability-types/${vulnerabilityTypeUuid}/`)
  },
  followFinding(findingUuid) {
    return axios.get(`${RESOURCE}/${findingUuid}/follow/`)
  },
  getFinding(uuid) {
    return axios.get(`${RESOURCE}/${uuid}/`)
  },
  getFindings(page, sortDirection, sortField, startDate, endDate, vulnType, findingName, priority, programs, status) {
    const params = new URLSearchParams([
      ['page', page],
      ['sort_direction', sortDirection],
      ['sort_field', sortField],
      ['start_date', startDate],
      ['end_date', endDate],
      ['vuln_types', [vulnType.uuid]],
      ['name', findingName],
      ['priority', priority],
      ['programs', programs],
      ['status', status],
    ])
    return axios.get(`${RESOURCE}/list/`, { params })
  },
  getFindingPriorities() {
    return axios.get(`${RESOURCE}/priorities/`)
  },
  linkFinding(findingUuid, linkFindingUuid) {
    return axios.get(`${RESOURCE}/${findingUuid}/link/${linkFindingUuid}/`)
  },
  publishFinding(findingUuid) {
    return axios.put(`${RESOURCE}/${findingUuid}/`, { post_status: 2 })
  },
  searchFindings(programUuid, title, origin) {
    const params = new URLSearchParams([
      ['program', programUuid],
      ['title', title],
      ['origin', origin || ''],
    ])
    return axios.get(`${RESOURCE}/search/`, { params: params })
  },
  getProgramFindings(
    programUuid,
    page,
    sortDirection,
    sortField,
    filterType,
    startDate,
    endDate,
    vulnType,
    findingName,
    priorities,
    resolution = []
  ) {
    const params = new URLSearchParams([
      ['page', page],
      ['sort_direction', sortDirection],
      ['sort_field', sortField],
      ['filter_type', filterType],
      ['start_date', startDate],
      ['end_date', endDate],
      ['vuln_types', [vulnType.uuid]],
      ['name', findingName],
      ['priorities', priorities],
      ['resolution', resolution],
    ])
    return axios.get(`programs/${programUuid}/${RESOURCE}/`, {
      params: params,
    })
  },
  getKanbanFindings() {
    return axios.get(`${RESOURCE}/kanban-list/`)
  },
  generateFindingsReport(startDate, endDate, programUuid) {
    const payload = {
      start_date: startDate,
      end_date: endDate,
      program: programUuid || '',
    }
    return axios.post(`${RESOURCE}/report/`, payload)
  },
  getAllProgramPublishedFindings(programUuid) {
    return axios.get(`programs/${programUuid}/published-findings/all/`)
  },
  getFindingHistory(findingUuid) {
    return axios.get(`${RESOURCE}/history/${findingUuid}`)
  },
}

export default FindingsService
